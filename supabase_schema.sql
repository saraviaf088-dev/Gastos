-- ============================================
-- TABLA: user_workspaces
-- Almacena los datos financieros para sincronizacion
-- ============================================

CREATE TABLE IF NOT EXISTS user_workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_code TEXT UNIQUE NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_from TEXT DEFAULT 'PC'
);

-- Index for fast lookups by sync_code
CREATE INDEX IF NOT EXISTS idx_user_workspaces_sync_code ON user_workspaces(sync_code);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Permitir lectura/escritura anonima para demo
-- ============================================

ALTER TABLE user_workspaces ENABLE ROW LEVEL SECURITY;

-- Politica: permitir todo a usuarios anonimos
CREATE POLICY "Allow all for anon" ON user_workspaces
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- HABILITAR REALTIME en la tabla
-- ============================================

-- Ve a Supabase Dashboard > Database > Replication
-- y activa la tabla "user_workspaces" en la seccion de Replication
-- O ejecuta este comando:
ALTER PUBLICATION supabase_realtime ADD TABLE user_workspaces;
