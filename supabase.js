
import { createClient } from 
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";


const SUPABASE_URL =
"https://kahrsndwcptpnilwmiqh.supabase.co";


const SUPABASE_KEY =
"sb_publishable_nDgJ0ZBII3Zj97o05Bf6pQ_DYfKauBx";


export const supabase =
createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
