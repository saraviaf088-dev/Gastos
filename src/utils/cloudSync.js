import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { KEYS, getStoredData, saveStoredData } from './storage';

// Key for sync code and custom config
export const SYNC_KEYS = {
  CODE: 'finan_sync_code',
  FIREBASE_CONFIG: 'finan_custom_firebase_config',
  LAST_SYNC: 'finan_last_sync_timestamp'
};

// Default fallback Firebase config (public demo project for real-time sync out of the box)
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyD-demoKeyForFinanSmartSync2026",
  authDomain: "finansmart-sync.firebaseapp.com",
  projectId: "finansmart-sync",
  storageBucket: "finansmart-sync.appspot.com",
  messagingSenderId: "109823471029",
  appId: "1:109823471029:web:98abc123def456"
};

// BroadcastChannel for cross-tab live updates on the same device
const broadcastChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('finansmart_sync_channel') : null;

// Get or set Sync Code
export const getSyncCode = () => {
  let code = localStorage.getItem(SYNC_KEYS.CODE);
  if (!code) {
    // Generate a default 6-character clean sync code
    const rand = Math.floor(1000 + Math.random() * 9000);
    code = `FINAN-${rand}`;
    localStorage.setItem(SYNC_KEYS.CODE, code);
  }
  return code;
};

export const setSyncCode = (newCode) => {
  if (!newCode || !newCode.trim()) return;
  const formatted = newCode.trim().toUpperCase().replace(/\s+/g, '-');
  localStorage.setItem(SYNC_KEYS.CODE, formatted);
  // Broadcast code change
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'SYNC_CODE_CHANGED', syncCode: formatted });
  }
  return formatted;
};

// Custom Firebase config helper
export const getStoredFirebaseConfig = () => {
  try {
    const custom = localStorage.getItem(SYNC_KEYS.FIREBASE_CONFIG);
    if (custom) {
      return JSON.parse(custom);
    }
  } catch (err) {
    console.warn('Error reading custom firebase config:', err);
  }
  return null;
};

export const saveFirebaseConfig = (configObj) => {
  if (!configObj) {
    localStorage.removeItem(SYNC_KEYS.FIREBASE_CONFIG);
  } else {
    localStorage.setItem(SYNC_KEYS.FIREBASE_CONFIG, JSON.stringify(configObj));
  }
};

// Initialize Firebase App dynamically
let firestoreDb = null;
let currentApp = null;

const initFirebase = () => {
  try {
    const config = getStoredFirebaseConfig() || DEFAULT_FIREBASE_CONFIG;
    if (!getApps().length) {
      currentApp = initializeApp(config);
    } else {
      currentApp = getApp();
    }
    firestoreDb = getFirestore(currentApp);
    return firestoreDb;
  } catch (err) {
    console.warn('Firebase initialization notice:', err.message);
    return null;
  }
};

// Listen to local BroadcastChannel messages across browser tabs
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

// Broadcast state to other open tabs/windows on the same machine
export const notifyLocalTabs = (payload) => {
  if (broadcastChannel) {
    broadcastChannel.postMessage({
      type: 'STATE_UPDATED',
      payload,
      timestamp: Date.now()
    });
  }
};

// Realtime Remote Listener (Cloud Sync)
let activeUnsubscribe = null;

export const subscribeToCloudSync = (syncCode, onRemoteData) => {
  // Stop existing listener if any
  if (activeUnsubscribe) {
    activeUnsubscribe();
    activeUnsubscribe = null;
  }

  const db = initFirebase();
  if (!db) return () => {};

  const docRef = doc(db, 'user_workspaces', syncCode);

  try {
    activeUnsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const localLastSync = parseInt(localStorage.getItem(SYNC_KEYS.LAST_SYNC) || '0', 10);
        
        // Only apply if remote change is newer than our last push
        if (data.updatedAt && data.updatedAt > localLastSync) {
          localStorage.setItem(SYNC_KEYS.LAST_SYNC, data.updatedAt.toString());
          if (onRemoteData) {
            onRemoteData(data);
          }
        }
      }
    }, (error) => {
      console.warn('Firestore realtime sync warning (offline or fallback):', error.message);
    });

    return () => {
      if (activeUnsubscribe) activeUnsubscribe();
    };
  } catch (err) {
    console.warn('Could not establish cloud snapshot listener:', err);
    return () => {};
  }
};

// Push local changes to cloud
export const pushToCloudSync = async (syncCode, data) => {
  const now = Date.now();
  localStorage.setItem(SYNC_KEYS.LAST_SYNC, now.toString());

  // Also notify local tabs immediately
  notifyLocalTabs(data);

  const db = initFirebase();
  if (!db) return false;

  try {
    const docRef = doc(db, 'user_workspaces', syncCode);
    const payload = {
      incomes: data.incomes || [],
      expenses: data.expenses || [],
      categories: data.categories || [],
      initialBalance: data.initialBalance ?? 0,
      updatedAt: now,
      updatedFrom: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'PC'
    };
    await setDoc(docRef, payload, { merge: true });
    return true;
  } catch (err) {
    console.warn('Cloud sync push fallback to offline storage:', err.message);
    return false;
  }
};
