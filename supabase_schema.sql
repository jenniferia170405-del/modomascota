-- SQL SCHEMA PARA MODO MASCOTA EN SUPABASE CLOUD
-- Copia y pega todo este script en el SQL Editor de tu proyecto gratuito en Supabase.

-- 1. Tabla de Perfiles de Usuario
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Mascotas
CREATE TABLE IF NOT EXISTS public.pets (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  sex TEXT,
  birth_date TEXT,
  approximate_age TEXT,
  weight NUMERIC,
  color TEXT,
  adoption_date TEXT,
  photo TEXT,
  notes TEXT,
  allergies TEXT,
  important_alert TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Fichas Médicas y Vacunas
CREATE TABLE IF NOT EXISTS public.health_records (
  id TEXT PRIMARY KEY,
  pet_id TEXT REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  next_date TEXT,
  description TEXT,
  veterinarian TEXT,
  clinic TEXT,
  notes TEXT,
  dose TEXT,
  product TEXT,
  weight_value NUMERIC,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de Recordatorios
CREATE TABLE IF NOT EXISTS public.reminders (
  id TEXT PRIMARY KEY,
  pet_id TEXT REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  recurrence TEXT DEFAULT 'once',
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) para privacidad total
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad: Cada usuario sólo ve y modifica sus propios datos
CREATE POLICY "Users can manage their own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage their own pets" ON public.pets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own health records" ON public.health_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own reminders" ON public.reminders FOR ALL USING (auth.uid() = user_id);
