import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
// GET: Fetch user's chat usage count
export async function GET() {
  try {
    
    const { data, error} = await supabase
      .from('clinics')
      .select('*')  // Use 'exact' to get the precise count
      .range(0,400)
      if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
  
      // Return all rows
      return NextResponse.json({ result: data });
    } catch (error) {
      console.error("Error fetching clinics:", error);
      return NextResponse.json({ error: "Failed to fetch clinic data" }, { status: 500 });
    }
}