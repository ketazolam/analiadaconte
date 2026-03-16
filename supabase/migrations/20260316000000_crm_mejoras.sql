-- Columnas nuevas en propiedades
ALTER TABLE propiedades
  ADD COLUMN IF NOT EXISTS notas_privadas text,
  ADD COLUMN IF NOT EXISTS etiqueta text,
  ADD COLUMN IF NOT EXISTS estado_actual text,
  ADD COLUMN IF NOT EXISTS no_publicar_precio boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS m2_descubiertos numeric,
  ADD COLUMN IF NOT EXISTS m2_semicubiertos numeric,
  ADD COLUMN IF NOT EXISTS a_estrenar boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS antiguedad integer,
  ADD COLUMN IF NOT EXISTS expensas numeric,
  ADD COLUMN IF NOT EXISTS orientacion text,
  ADD COLUMN IF NOT EXISTS cantidad_plantas integer,
  ADD COLUMN IF NOT EXISTS cobertura_cochera text,
  ADD COLUMN IF NOT EXISTS luminosidad text,
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS recorrido_360_proveedor text,
  ADD COLUMN IF NOT EXISTS recorrido_360_codigo text,
  ADD COLUMN IF NOT EXISTS planos text[];

-- Columnas nuevas en mensajes
ALTER TABLE mensajes
  ADD COLUMN IF NOT EXISTS respondido boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS destacado boolean DEFAULT false;

-- Tabla de visitas por propiedad
CREATE TABLE IF NOT EXISTS property_views (
  id bigserial PRIMARY KEY,
  propiedad_id integer NOT NULL,
  path text,
  created_at timestamptz DEFAULT now()
);

-- Índice para queries rápidas por propiedad
CREATE INDEX IF NOT EXISTS idx_property_views_propiedad_id ON property_views(propiedad_id);
CREATE INDEX IF NOT EXISTS idx_property_views_created_at ON property_views(created_at);

-- RLS: habilitar y permitir insert/select anónimo para el tracking
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "allow_insert_views" ON property_views FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "allow_select_views" ON property_views FOR SELECT USING (true);
