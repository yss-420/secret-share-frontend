import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pfuyxdqzbrjrtqlbkbku.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmdXl4ZHF6YnJqcnRxbGJrYmt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4OTc3NTIsImV4cCI6MjA2NDQ3Mzc1Mn0.2TlmbMETlxDCjUMrd81BY2moYkJnqUMrAQF4kQvdKG4';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
