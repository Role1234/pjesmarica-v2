// =========================
// SUPABASE KONFIGURACIJA
// =========================


const SUPABASE_URL =
"https://kahrsndwcptpnilwmiqh.supabase.co";


const SUPABASE_KEY =
"sb_publishable_nDgJ0ZBII3Zj97o05Bf6pQ_DYfKauBx";



// =========================
// KREIRANJE KLIJENTA
// =========================


const supabase =
window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



// =========================
// EXPORT ZA MODULE
// =========================


export { supabase };



// =========================
// GLOBALNI PRISTUP
// (ako zatreba)
// =========================


window.supabaseClient = supabase;

