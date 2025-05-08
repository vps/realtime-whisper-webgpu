export function BrowserCheck() {
  const isWebGPUAvailable = !!navigator.gpu;
  const hasRequiredAPIs = 
    !!window.AudioContext && 
    !!navigator.mediaDevices && 
    !!navigator.mediaDevices.getUserMedia;
  
  if (!isWebGPUAvailable) {
    return (
      <div className="fixed w-screen h-screen bg-black z-10 bg-opacity-[92%] text-white text-2xl font-semibold flex flex-col justify-center items-center text-center p-4">
        <h2 className="text-3xl mb-4">WebGPU is not supported</h2>
        <p className="max-w-md mb-6">
          This application requires WebGPU, which isn't available in your current browser.
        </p>
        <div className="text-lg">
          <p className="mb-2">Try one of these browsers:</p>
          <ul className="list-disc text-left ml-8">
            <li>Chrome (version 113+)</li>
            <li>Edge (version 113+)</li>
            <li>Firefox (version 118+ with flags enabled)</li>
          </ul>
        </div>
      </div>
    );
  }
  
  if (!hasRequiredAPIs) {
    return (
      <div className="fixed w-screen h-screen bg-black z-10 bg-opacity-[92%] text-white text-2xl font-semibold flex flex-col justify-center items-center text-center p-4">
        <h2 className="text-3xl mb-4">Missing Required Browser Features</h2>
        <p className="max-w-md">
          This application requires audio recording capabilities that aren't available in your current browser settings.
          Please ensure microphone permissions are granted and you're using a modern browser.
        </p>
      </div>
    );
  }
  
  return null;
}