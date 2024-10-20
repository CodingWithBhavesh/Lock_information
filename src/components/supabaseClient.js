// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Replace these values with your Supabase project details
const supabaseUrl = 'https://snsxdcypxreojrbotltf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuc3hkY3lweHJlb2pyYm90bHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNzY4MzgsImV4cCI6MjA0NDc1MjgzOH0.q5kA2vXWXhb5M6m0NCW-p06zZA97kB3vwB35h8hzjGw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
