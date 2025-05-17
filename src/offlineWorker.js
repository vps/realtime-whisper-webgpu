self.addEventListener('message', async (e) => {
  const { type } = e.data || {};
  switch (type) {
    case 'load':
      self.postMessage({ status: 'ready' });
      break;
    case 'generate':
      self.postMessage({ status: 'error', message: 'Offline transcription not implemented' });
      break;
    case 'reset':
      self.postMessage({ status: 'info', message: 'Transcription context reset', output: '', history: [] });
      break;
    case 'getHistory':
      self.postMessage({ status: 'history', history: [], output: '' });
      break;
    default:
      console.warn('Unknown message type', type);
  }
});
