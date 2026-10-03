import { NextRequest, NextResponse } from 'next/server';
import { DoctorModel } from '@/models/doctor';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doctor = await DoctorModel.getById(id);

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: doctor });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching doctor' },
      { status: 500 }
    );
  }
}
