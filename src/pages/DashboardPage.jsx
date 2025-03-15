import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveTranscript } from "../store/slices/transcriptSlice";
import { updateUsageMinutes } from "../store/slices/subscriptionSlice";
import { AudioVisualizer } from "../components/AudioVisualizer";
import Progress from "../components/Progress";
import { LanguageSelector } from "../components/LanguageSelector";
import { TIER_FEATURES, SUBSCRIPTION_TIERS } from "../store/slices/subscriptionSlice";

const IS_WEBGPU_AVAILABLE = !!navigator.gpu;

const WHISPER_SAMPLING_RATE = 16_000;

const DashboardPage = () => {
  // Create a reference to the worker object.
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

  // We use the `useEffect` hook to setup the worker as soon as the component is mounted.
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
    <div className="flex flex-col h-full mx-auto text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.displayName || 'User'}</p>
      </div>
      
      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Transcripts</h3>
          <p className="text-3xl font-bold">{stats.transcriptCount}</p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Total saved</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Duration</h3>
          <p className="text-3xl font-bold">{Math.round(stats.totalDuration / 60)}m</p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Audio processed</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Accuracy</h3>
          <p className="text-3xl font-bold">{stats.avgAccuracy}%</p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Estimated</p>
        </div>
      </div>
      
      {/* Usage meter */}
      {tier === SUBSCRIPTION_TIERS.FREE && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between mb-2">
            <h3 className="text-lg font-semibold">Daily Usage</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(usageMinutes * 10) / 10} / {usageLimit} minutes
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${usageExceeded ? 'bg-red-600' : 'bg-blue-600'}`} 
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
          {usageExceeded && (
            <div className="mt-3 text-sm text-red-600 dark:text-red-400">
              You've reached your daily limit. 
              <a href="/subscription" className="font-medium ml-1 underline">
                Upgrade your plan
              </a> for unlimited transcription.
            </div>
          )}
        </div>
      )}
      
      {/* Transcription Interface */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Real-time Transcription</h2>
          
          {status === null && (
            <div className="mb-4">
              <p className="max-w-[480px] mb-4">
                <br />
                You are about to load{" "}
                <a
                  href="https://huggingface.co/onnx-community/whisper-base"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline"
                >
                  whisper-base
                </a>
                , a 73 million parameter speech recognition model that is
                optimized for inference on the web. Once downloaded, the model
                (~200&nbsp;MB) will be cached and reused when you revisit the
                page.
                <br />
                <br />
                Everything runs directly in your browser using{" "}
                <a
                  href="https://huggingface.co/docs/transformers.js"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  🤗&nbsp;Transformers.js
                </a>{" "}
                and ONNX Runtime Web, meaning no data is sent to a server. You
                can even disconnect from the internet after the model has
                loaded!
              </p>

              <button
                className="border px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed select-none"
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

          <div className="w-full md:max-w-[600px] p-2">
            <AudioVisualizer 
              className="w-full h-20 rounded-lg" 
              stream={stream} 
            />
            
            {status === "ready" && (
              <div className="relative mt-3">
                <p className="w-full h-[120px] overflow-y-auto overflow-wrap-anywhere border rounded-lg p-2 bg-white dark:bg-gray-900">
                  {text || "Start speaking to see transcription..."}
                </p>
                {tps && (
                  <span className="absolute bottom-0 right-0 px-1 text-xs text-gray-500 dark:text-gray-400">
                    {tps.toFixed(2)} tok/s
                  </span>
                )}
              </div>
            )}
          </div>
          
          {status === "ready" && (
            <div className="relative w-full flex justify-between mt-3">
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
              
              <div className="space-x-2">
                {usageExceeded ? (
                  <button
                    className="border rounded-lg px-3 py-1 bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => window.location.href = '/subscription'}
                  >
                    Upgrade Plan
                  </button>
                ) : (
                  <>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(audioLength)} sec
                    </span>
                    <button
                      className="border rounded-lg px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
                      onClick={handleReset}
                      disabled={isProcessing}
                    >
                      Reset
                    </button>
                    <button
                      className="border rounded-lg px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
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
            <div className="w-full max-w-[500px] text-left mx-auto p-4">
              <p className="text-center">{loadingMessage}</p>
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
    <div className="fixed w-screen h-screen bg-black z-10 bg-opacity-[92%] text-white text-2xl font-semibold flex justify-center items-center text-center">
      WebGPU is not supported
      <br />
      by this browser :&#40;
    </div>
  );
};

export default DashboardPage;
