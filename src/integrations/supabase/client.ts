// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ailfhaxilcxctzmdpwbn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbGZoYXhpbGN4Y3R6bWRwd2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMjk1MTgsImV4cCI6MjA2MTYwNTUxOH0.H17Vm4Hd-lNeVOZGhgDBZn8GWeJzMe6innvBcaKTk_I";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);