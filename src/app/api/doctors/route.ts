import { NextRequest, NextResponse } from 'next/server';
import { DoctorModel } from '@/models/doctor';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const specialty = searchParams.get('specialty') || undefined;
    const search = searchParams.get('search') || undefined;

    const doctors = await DoctorModel.getAll({ specialty, search });
    return NextResponse.json({ success: true, count: doctors.length, data: doctors });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.specialty || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and specialty are required' },
        { status: 400 }
      );
    }

    const doctor = await DoctorModel.create(body);
    return NextResponse.json({ success: true, data: doctor }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create doctor' },
      { status: 500 }
    );
  }
}
