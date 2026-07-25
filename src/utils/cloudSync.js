import { createClient } from '@supabase/supabase-js';

// ===== CONFIGURACION SUPABASE =====
const SUPABASE_URL = 'https://xsvkbqdbwtvbotkickin.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ePdWBjUTqyf77peOuKP7zA_wghj9jzJ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== FUNCION DE DIAGNOSTICO (llamar desde consola: window.__supaTest()) =====
window.__supaTest = async () => {
  console.log('=== TEST SUPABASE ===');
  console.log('URL:', SUPABASE_URL);
  console.log('Key length:', SUPABASE_ANON_KEY.length);

  // Test 1: Read
  console.log('\n--- Test 1: READ ---');
  const { data: readData, error: readError } = await supabase
    .from('user_workspaces')
    .select('*')
    .limit(5);
  console.log('Read result:', readData);
  if (readError) console.error('Read error:', readError.message);

  // Test 2: Write
  console.log('\n--- Test 2: WRITE ---');
  const { error: writeError } = await supabase
    .from('user_workspaces')
    .upsert({
      sync_code: 'FINAN-AUTO-SYNC',
      payload: { test: true, timestamp: Date.now() },
      updated_at: new Date().toISOString(),
      updated_from: 'DIAGNOSTIC'
    }, { onConflict: 'sync_code' });
  if (writeError) console.error('Write error:', writeError.message);
  else console.log('Write OK');

  // Test 3: Read back
  console.log('\n--- Test 3: READ BACK ---');
  const { data: backData, error: backError } = await supabase
    .from('user_workspaces')
    .select('*')
    .eq('sync_code', 'FINAN-AUTO-SYNC')
    .single();
  console.log('Read back:', backData);
  if (backError) console.error('Read back error:', backError.message);

  console.log('\n=== FIN TEST ===');
};

// BroadcastChannel for cross-tab live updates on the same device
const broadcastChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('finansmart_sync_channel') : null;

// Get Sync Code (shared across all devices for automatic sync)
export const getSyncCode = () => {
  return 'FINAN-AUTO-SYNC';
};

export const setSyncCode = (newCode) => {
  return 'FINAN-AUTO-SYNC';
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

// Realtime Remote Listener (Supabase Realtime)
let activeChannel = null;

export const subscribeToCloudSync = (syncCode, onRemoteData) => {
  // Unsubscribe from previous channel if any
  if (activeChannel) {
    supabase.removeChannel(activeChannel);
    activeChannel = null;
  }

  // Subscribe to real-time changes on the user_workspaces table
  activeChannel = supabase
    .channel(`workspace:${syncCode}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_workspaces',
        filter: `sync_code=eq.${syncCode}`
      },
      (payload) => {
        const data = payload.new;
        if (data && data.payload) {
          const workspaceData = {
            incomes: data.payload.incomes || [],
            expenses: data.payload.expenses || [],
            categories: data.payload.categories || [],
            initialBalance: data.payload.initialBalance ?? 0,
            updatedAt: data.updated_at ? new Date(data.updated_at).getTime() : 0
          };
          onRemoteData(workspaceData);
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'user_workspaces',
        filter: `sync_code=eq.${syncCode}`
      },
      (payload) => {
        const data = payload.new;
        if (data && data.payload) {
          const workspaceData = {
            incomes: data.payload.incomes || [],
            expenses: data.payload.expenses || [],
            categories: data.payload.categories || [],
            initialBalance: data.payload.initialBalance ?? 0,
            updatedAt: data.updated_at ? new Date(data.updated_at).getTime() : 0
          };
          onRemoteData(workspaceData);
        }
      }
    )
    .subscribe();

  return () => {
    if (activeChannel) {
      supabase.removeChannel(activeChannel);
      activeChannel = null;
    }
  };
};

// Push local changes to Supabase
export const pushToCloudSync = async (syncCode, data) => {
  // Also notify local tabs immediately
  notifyLocalTabs(data);

  try {
    const payload = {
      incomes: data.incomes || [],
      expenses: data.expenses || [],
      categories: data.categories || [],
      initialBalance: data.initialBalance ?? 0
    };

    console.log('[Supabase PUSH] syncCode:', syncCode, 'expenses:', payload.expenses.length);

    // Upsert: insert or update the workspace row
    const { data: result, error } = await supabase
      .from('user_workspaces')
      .upsert(
        {
          sync_code: syncCode,
          payload: payload,
          updated_at: new Date().toISOString(),
          updated_from: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'PC'
        },
        { onConflict: 'sync_code' }
      );

    if (error) {
      console.error('[Supabase PUSH ERROR]:', error.message, error);
      return false;
    }
    console.log('[Supabase PUSH OK]');
    return true;
  } catch (err) {
    console.error('[Supabase PUSH CATCH]:', err.message, err);
    return false;
  }
};
