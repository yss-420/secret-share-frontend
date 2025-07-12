import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = 'https://pfuyxdqzbrjrtqlbkbku.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmdXl4ZHF6YnJqcnRxbGJrYmt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4OTc3NTIsImV4cCI6MjA2NDQ3Mzc1Mn0.2TlmbMETlxDCjUMrd81BY2moYkJnqUMrAQF4kQvdKG4';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);