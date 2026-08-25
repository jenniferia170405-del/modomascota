import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
  const localUrl = localStorage.getItem('modo_mascota_supabase_url');
  const localKey = localStorage.getItem('modo_mascota_supabase_key');

  const url = envUrl || localUrl || '';
  const key = envKey || localKey || '';

  return { url, key, isConfigured: Boolean(url && key && url.startsWith('http')) };
};

const config = getSupabaseConfig();

export const supabase: SupabaseClient | null = config.isConfigured
  ? createClient(config.url, config.key)
  : null;

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseConfig().isConfigured;
};

export const saveSupabaseCredentials = (url: string, key: string) => {
  localStorage.setItem('modo_mascota_supabase_url', url.trim());
  localStorage.setItem('modo_mascota_supabase_key', key.trim());
  window.location.reload();
};

export const clearSupabaseCredentials = () => {
  localStorage.removeItem('modo_mascota_supabase_url');
  localStorage.removeItem('modo_mascota_supabase_key');
  window.location.reload();
};
