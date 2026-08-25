import { createClient, SupabaseClient } from '@supabase/supabase-js';

function formatSupabaseUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  let clean = rawUrl.trim();
  clean = clean.replace(/\/rest\/v1\/?$/, '');
  clean = clean.replace(/\/+$/, '');
  return clean;
}

const DEFAULT_SUPABASE_URL = 'https://ctbfpuxitzrvbivcrwqu.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0YmZwdXhpdHpydmJpdmNyd3F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MTY3OTAsImV4cCI6MjEwMzE5Mjc5MH0.I2TiwVQKV2jbsP0tYHxPfhi1CF0SMxRGsgOaVM0mVfs';

const getSupabaseConfig = () => {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
  const localUrl = localStorage.getItem('modo_mascota_supabase_url');
  const localKey = localStorage.getItem('modo_mascota_supabase_key');

  const rawUrl = envUrl || localUrl || DEFAULT_SUPABASE_URL;
  const url = formatSupabaseUrl(rawUrl);
  const key = (envKey || localKey || DEFAULT_SUPABASE_KEY).trim();

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
