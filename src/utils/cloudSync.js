const broadcastChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('finansmart_sync_channel') : null;

export const setupLocalTabSync = (onRemoteUpdate) => {
  if (!broadcastChannel) return () => {};

  const handleMessage = (event) => {
    if (event.data && event.data.type === 'STATE_UPDATED') {
      if (onRemoteUpdate) {
        onRemoteUpdate(event.data.payload);
      }
    }
  };

  broadcastChannel.addEventListener('message', handleMessage);
  return () => broadcastChannel.removeEventListener('message', handleMessage);
};

export const notifyLocalTabs = (payload) => {
  if (broadcastChannel) {
    broadcastChannel.postMessage({
      type: 'STATE_UPDATED',
      payload,
      timestamp: Date.now()
    });
  }
};
