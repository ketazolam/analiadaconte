-- CRM Admin Panel: nuevas tablas para contactos, mensajes, tareas, actividad y config

-- Contactos
CREATE TABLE IF NOT EXISTS contactos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text,
  apellido text,
  email text,
  telefono text,
  estado text DEFAULT 'consulta', -- consulta | interesado | deshabilitado
  origen text DEFAULT 'manual',   -- zonaprop | mercadolibre | web | whatsapp | manual
  propiedad_id uuid REFERENCES propiedades(id) ON DELETE SET NULL,
  notas text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contactos_estado_idx ON contactos(estado);
CREATE INDEX IF NOT EXISTS contactos_origen_idx ON contactos(origen);
CREATE INDEX IF NOT EXISTS contactos_created_at_idx ON contactos(created_at DESC);

-- Mensajes
CREATE TABLE IF NOT EXISTS mensajes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contacto_id uuid REFERENCES contactos(id) ON DELETE SET NULL,
  propiedad_id uuid REFERENCES propiedades(id) ON DELETE SET NULL,
  asunto text,
  cuerpo text,
  leido boolean DEFAULT false,
  origen text DEFAULT 'web', -- zonaprop | mercadolibre | web | whatsapp
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mensajes_leido_idx ON mensajes(leido);
CREATE INDEX IF NOT EXISTS mensajes_created_at_idx ON mensajes(created_at DESC);

-- Tareas
CREATE TABLE IF NOT EXISTS tareas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descripcion text,
  estado text DEFAULT 'pendiente',   -- pendiente | en_progreso | completada
  prioridad text DEFAULT 'normal',   -- baja | normal | alta
  propiedad_id uuid REFERENCES propiedades(id) ON DELETE SET NULL,
  contacto_id uuid REFERENCES contactos(id) ON DELETE SET NULL,
  asignado_a uuid,                   -- referencia a auth.users (sin FK para evitar restricciones)
  fecha_vencimiento date,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tareas_estado_idx ON tareas(estado);

-- Actividad (log de acciones)
CREATE TABLE IF NOT EXISTS actividad (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,                      -- referencia a auth.users
  tipo text,                         -- creó | actualizó | eliminó
  entidad text,                      -- propiedad | contacto | tarea | mensaje
  entidad_id uuid,
  descripcion text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS actividad_created_at_idx ON actividad(created_at DESC);

-- Configuración de la inmobiliaria (singleton)
CREATE TABLE IF NOT EXISTS config_inmobiliaria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text DEFAULT 'Analía Daconte Propiedades',
  email text DEFAULT 'info@analiadaconte.com.ar',
  telefono text DEFAULT '223 300-1242',
  instagram text DEFAULT 'https://www.instagram.com/analiadaconte',
  facebook text DEFAULT 'https://www.facebook.com/analiadaconte',
  logo_url text,
  updated_at timestamptz DEFAULT now()
);

-- Trigger para updated_at en contactos
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contactos_updated_at
  BEFORE UPDATE ON contactos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER config_updated_at
  BEFORE UPDATE ON config_inmobiliaria
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: habilitar en todas las tablas nuevas
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE actividad ENABLE ROW LEVEL SECURITY;
ALTER TABLE config_inmobiliaria ENABLE ROW LEVEL SECURITY;

-- Policies: solo usuarios autenticados
CREATE POLICY "contactos_auth" ON contactos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "mensajes_auth" ON mensajes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "tareas_auth" ON tareas FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "actividad_auth" ON actividad FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "config_auth" ON config_inmobiliaria FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insertar config inicial
INSERT INTO config_inmobiliaria (nombre, email, telefono, instagram, facebook)
VALUES (
  'Analía Daconte Propiedades',
  'info@analiadaconte.com.ar',
  '223 300-1242',
  'https://www.instagram.com/analiadaconte',
  'https://www.facebook.com/analiadaconte'
) ON CONFLICT DO NOTHING;
