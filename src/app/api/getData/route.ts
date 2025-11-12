import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';


export async function GET() {
  try {
   
    const filePath = path.join(process.cwd(), 'public', 'derms.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const practitioners = JSON.parse(fileContents);

    const filePath_1 = path.join(process.cwd(), 'public', 'clinics.json');
    const fileContents_1 = fs.readFileSync(filePath_1, 'utf-8');
    const clinics = JSON.parse(fileContents_1);
   
    

    
    

    return NextResponse.json({clinics: clinics, practitioners: practitioners});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read devices.json' }, { status: 500 });
  }
}