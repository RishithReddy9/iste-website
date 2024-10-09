
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req, res) {
    // Get current time
    const currentTime = new Date().toISOString();

    // Update the status of records where timestamp is in the past
    const { error } = await supabase
      .from('seating')
      .update({ status: 'available' })
      .lt('locked_until', currentTime)
      .neq('status', 'booked');
      return NextResponse.json({status:200})
}
