import { createClient } from '@supabase/supabase-js';

const DbUrl = 'https://vntunuzrneoakdckqjvk.supabase.co';
const DbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudHVudXpybmVvYWtkY2txanZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTI5NzEsImV4cCI6MjA2NzI4ODk3MX0.CWJIVqq-x5_doDk8rsl8ZJWP7um9VakuIDBihcfsrsU';

export const DB = createClient(DbUrl, DbKey);
export const TABLE = {
    "main": "fin_statistic",
    "balance": "fin_balance"
}