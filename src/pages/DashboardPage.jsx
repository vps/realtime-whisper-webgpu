import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { saveTranscript } from "../store/slices/transcriptSlice";
import { updateUsageMinutes } from "../store/slices/subscriptionSlice";
import { AudioVisualizer } from "../components/AudioVisualizer";
import Progress from "../components/Progress";
import { LanguageSelector } from "../components/LanguageSelector";
import { TIER_FEATURES, SUBSCRIPTION_TIERS } from "../store/slices/subscriptionSlice";

const IS_WEBGPU_AVAILABLE = !!navigator.gpu;
const WHISPER_SAMPLING_RATE = 16_000;

const DashboardPage = () => {
  // Create a reference to the worker object
  const worker = useRef(null);
  const recorderRef = useRef(null);

  // Redux state
  const { user } = useSelector((state) => state.auth);
  const { tier, usageMinutes } = useSelector((state) => state.subscription);
  const dispatch = useDispatch();

  // Model loading and progress
  const [status, setStatus] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [progressItems, setProgressItems] = useState([]);

  // Inputs and outputs
  const [text, setText] = useState("");
  const [tps, setTps] = useState(null);
  const [language, setLanguage] = useState("en");

  // Processing
  const [recording, setRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chunks, setChunks] = useState([]);
  const [stream, setStream] = useState(null);
  const [audioLength, setAudioLength] = useState(0);
  const audioContextRef = useRef(null);
  const recordingStartTime = useRef(null);

  // Subscription limits
  const maxAudioLength = TIER_FEATURES[tier]?.maxAudioLength || 30; // seconds
  const MAX_SAMPLES = WHISPER_SAMPLING_RATE * maxAudioLength;
  const usageLimit = TIER_FEATURES[tier]?.transcriptionMinutes || 10; // minutes

  // Usage tracking
  const [usagePercentage, setUsagePercentage] = useState(0);
  const [usageExceeded, setUsageExceeded] = useState(false);

  // Stats for display
  const [stats, setStats] = useState({
    transcriptCount: 0,
    totalDuration: 0,
    avgAccuracy: 95, // Placeholder
  });

  // Set up the worker
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL("../worker.js", import.meta.url), {
        type: "module",
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case "loading":
          // Model file start load: add a new progress item to the list.
          setStatus("loading");
          setLoadingMessage(e.data.data);
          break;

        case "initiate":
          setProgressItems((prev) => [...prev, e.data]);
          break;

        case "progress":
          // Model file progress: update one of the progress items.
          setProgressItems((prev) =>
            prev.map((item) => {
              if (item.file === e.data.file) {
                return { ...item, ...e.data };
              }
              return item;
            }),
          );
          break;

        case "done":
          // Model file loaded: remove the progress item from the list.
          setProgressItems((prev) =>
            prev.filter((item) => item.file !== e.data.file),
          );
          break;

        case "ready":
          // Pipeline ready: the worker is ready to accept messages.
          setStatus("ready");
          if (!usageExceeded) {
            recorderRef.current?.start();
          }
          break;

        case "start":
          {
            // Start generation
            setIsProcessing(true);

            // Request new data from the recorder
            recorderRef.current?.requestData();
          }
          break;

        case "update":
          {
            // Generation update: update the output text.
            const { tps } = e.data;
            setTps(tps);
          }
          break;

        case "complete":
          // Generation complete: re-enable the "Generate" button
          setIsProcessing(false);
          setText(e.data.output);
          
          // Save transcript if we have a user
          if (user && e.data.output && audioLength > 0) {
            const transcriptData = {
              userId: user.uid,
              text: e.data.output,
              language,
              audioLength
            };
            
            dispatch(saveTranscript(transcriptData));
            
            // Update usage minutes
            const usageInMinutes = audioLength / 60;
            dispatch(updateUsageMinutes({ 
              userId: user.uid, 
              minutes: usageInMinutes 
            }));
            
            // Update stats
            setStats(prev => ({
              ...prev,
              transcriptCount: prev.transcriptCount + 1,
              totalDuration: prev.totalDuration + audioLength,
            }));
          }
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener("message", onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => {
      worker.current.removeEventListener("message", onMessageReceived);
    };
  }, [dispatch, user, language, audioLength, usageExceeded]);

  // Handle media recording
  useEffect(() => {
    if (recorderRef.current) return; // Already set

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setStream(stream);

          recorderRef.current = new MediaRecorder(stream);
          audioContextRef.current = new AudioContext({
            sampleRate: WHISPER_SAMPLING_RATE,
          });

          recorderRef.current.onstart = () => {
            setRecording(true);
            setChunks([]);
            recordingStartTime.current = Date.now();
            setAudioLength(0);
          };
          
          recorderRef.current.ondataavailable = (e) => {
            if (e.data.size > 0) {
              setChunks((prev) => [...prev, e.data]);
              
              // Update audio length
              if (recordingStartTime.current) {
                const duration = (Date.now() - recordingStartTime.current) / 1000;
                setAudioLength(duration);
              }
            } else {
              // Empty chunk received, so we request new data after a short timeout
              setTimeout(() => {
                recorderRef.current.requestData();
              }, 25);
            }
          };

          recorderRef.current.onstop = () => {
            setRecording(false);
            recordingStartTime.current = null;
          };
        })
        .catch((err) => console.error("The following error occurred: ", err));
    } else {
      console.error("getUserMedia not supported on your browser!");
    }

    return () => {
      recorderRef.current?.stop();
      recorderRef.current = null;
    };
  }, []);

  // Calculate usage percentage
  useEffect(() => {
    if (tier && usageMinutes !== undefined) {
      const percentage = Math.min((usageMinutes / usageLimit) * 100, 100);
      setUsagePercentage(percentage);
      
      // Check if usage exceeded
      setUsageExceeded(usageMinutes >= usageLimit && tier === SUBSCRIPTION_TIERS.FREE);
      
      // If usage exceeded, stop recording
      if (usageMinutes >= usageLimit && tier === SUBSCRIPTION_TIERS.FREE && recorderRef.current && recording) {
        recorderRef.current.stop();
      }
    }
  }, [usageMinutes, usageLimit, tier, recording]);

  // Process audio chunks
  useEffect(() => {
    if (!recorderRef.current) return;
    if (!recording) return;
    if (isProcessing) return;
    if (status !== "ready") return;
    if (usageExceeded) return;

    if (chunks.length > 0) {
      // Generate from data
      const blob = new Blob(chunks, { type: recorderRef.current.mimeType });

      const fileReader = new FileReader();

      fileReader.onloadend = async () => {
        const arrayBuffer = fileReader.result;
        const decoded =
          await audioContextRef.current.decodeAudioData(arrayBuffer);
        let audio = decoded.getChannelData(0);
        if (audio.length > MAX_SAMPLES) {
          // Get last MAX_SAMPLES
          audio = audio.slice(-MAX_SAMPLES);
        }

        worker.current.postMessage({
          type: "generate",
          data: { audio, language },
        });
      };
      fileReader.readAsArrayBuffer(blob);
    } else {
      recorderRef.current?.requestData();
    }
  }, [status, recording, isProcessing, chunks, language, MAX_SAMPLES, usageExceeded]);

  const handleReset = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      setText("");
      setTimeout(() => {
        if (!usageExceeded) {
          recorderRef.current.start();
        }
      }, 100);
    }
  };

  // Fetch sample stats for demo purposes
  useEffect(() => {
    // In a real app, this would be fetched from the API
    setStats({
      transcriptCount: 5,
      totalDuration: 354, // seconds
      avgAccuracy: 95, // percent
    });
  }, []);

  return IS_WEBGPU_AVAILABLE ? (
    <div className="flex flex-col h-full mx-auto text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Dashboard</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">Welcome back, {user?.displayName || 'User'}</p>
      </div>
      
      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Transcripts", value: stats.transcriptCount, unit: "Total saved" },
          { title: "Duration", value: Math.round(stats.totalDuration / 60), unit: "min. processed" },
          { title: "Accuracy", value: stats.avgAccuracy, unit: "% estimated" }
        ].map((stat, index) => (
          <div key={index} className="card p-6">
            <h3 className="text-sm uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">{stat.title}</h3>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
              <p className="ml-2 text-sm text-neutral-500 dark:text-neutral-400">{stat.unit}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Usage meter for free tier */}
      {tier === SUBSCRIPTION_TIERS.FREE && (
        <div className="card p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Daily Usage</h3>
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              {Math.round(usageMinutes * 10) / 10} / {usageLimit} minutes
            </span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${usageExceeded ? 'bg-red-500' : 'bg-primary-500'}`} 
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
          {usageExceeded && (
            <div className="mt-3 text-sm text-red-500 dark:text-red-400">
              You've reached your daily limit. 
              <a href="/subscription" className="font-medium ml-1 text-primary-600 dark:text-primary-400 hover:underline">
                Upgrade your plan
              </a> for unlimited transcription.
            </div>
          )}
        </div>
      )}
      
      {/* Transcription Interface */}
      <div className="flex-1 overflow-auto">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Real-time Transcription</h2>
          
          {status === null && (
            <div className="mb-6">
              <p className="max-w-2xl mb-6 text-neutral-600 dark:text-neutral-300">
                You are about to load{" "}
                <a
                  href="https://huggingface.co/onnx-community/whisper-base"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  whisper-base
                </a>
                , a 73 million parameter speech recognition model optimized for web inference. Once downloaded, the model
                (~200 MB) will be cached and reused when you revisit the page.
                <br /><br />
                Everything runs directly in your browser using{" "}
                <a
                  href="https://huggingface.co/docs/transformers.js"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  🤗 Transformers.js
                </a>{" "}
                and ONNX Runtime Web, meaning no data is sent to a server. You
                can even disconnect from the internet after the model has loaded!
              </p>

              <button
                className="btn-primary"
                onClick={() => {
                  worker.current.postMessage({ type: "load" });
                  setStatus("loading");
                }}
                disabled={status !== null}
              >
                Load model
              </button>
            </div>
          )}

          <div className="w-full max-w-3xl">
            <AudioVisualizer 
              className="w-full h-24 rounded-xl bg-neutral-50 dark:bg-neutral-800/70" 
              stream={stream} 
            />
            
            {status === "ready" && (
              <div className="relative mt-6">
                <div className="w-full min-h-[160px] overflow-y-auto overflow-wrap-anywhere rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-800/50">
                  <p className="text-neutral-800 dark:text-neutral-200">
                    {text || "Start speaking to see transcription..."}
                  </p>
                </div>
                {tps && (
                  <span className="absolute bottom-2 right-3 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-md text-xs text-neutral-500 dark:text-neutral-400">
                    {tps.toFixed(2)} tok/s
                  </span>
                )}
              </div>
            )}
          </div>
          
          {status === "ready" && (
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
              <LanguageSelector
                language={language}
                setLanguage={(e) => {
                  recorderRef.current?.stop();
                  setLanguage(e);
                  if (!usageExceeded) {
                    recorderRef.current?.start();
                  }
                }}
              />
              
              <div className="flex items-center gap-3">
                {usageExceeded ? (
                  <Link
                    to="/subscription"
                    className="btn-primary"
                  >
                    Upgrade Plan
                  </Link>
                ) : (
                  <>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-md">
                      {Math.round(audioLength)} sec
                    </span>
                    <button
                      className="btn-secondary"
                      onClick={handleReset}
                      disabled={isProcessing}
                    >
                      Reset
                    </button>
                    <button
                      className="btn-primary"
                      onClick={() => {
                        if (recording) {
                          recorderRef.current?.stop();
                        } else if (!usageExceeded) {
                          recorderRef.current?.start();
                        }
                      }}
                      disabled={isProcessing || usageExceeded}
                    >
                      {recording ? 'Pause' : 'Resume'}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
          
          {status === "loading" && (
            <div className="w-full max-w-lg mx-auto p-4">
              <p className="text-center text-neutral-700 dark:text-neutral-300 mb-6">{loadingMessage}</p>
              {progressItems.map(({ file, progress, total }, i) => (
                <Progress
                  key={i}
                  text={file}
                  percentage={progress}
                  total={total}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="fixed inset-0 z-50 bg-neutral-900 bg-opacity-95 flex flex-col justify-center items-center">
      <div className="text-3xl font-medium text-white text-center">
        WebGPU is not supported
        <br />
        by this browser
      </div>
      <div className="text-xl text-neutral-400 mt-4">
        Try using Chrome or Edge
      </div>
    </div>
  );
};

export default DashboardPage;
