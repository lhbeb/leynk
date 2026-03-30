import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase credentials
const supabaseUrl = 'https://rwevvpdpguhincowygzx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3ZXZ2cGRwZ3VoaW5jb3d5Z3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NDg1MTQsImV4cCI6MjA3ODEyNDUxNH0.W-2ECC9vNHaOC0lP8BntGUM4StaseOl-nAwtmCKsxl0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket name
export const PROFILE_PICTURES_BUCKET = 'profile-pictures';

