import { NextRequest, NextResponse } from 'next/server';
import { PrescriptionModel } from '@/models/prescription';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get('appointmentId');
    const patientId = searchParams.get('patientId');

    if (appointmentId) {
      const presc = await PrescriptionModel.getByAppointmentId(appointmentId);
      return NextResponse.json({ success: true, data: presc });
    }

    if (patientId) {
      const list = await PrescriptionModel.getByPatientId(patientId);
      return NextResponse.json({ success: true, count: list.length, data: list });
    }

    return NextResponse.json(
      { success: false, error: 'Provide appointmentId or patientId' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch prescription' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appointmentId, doctorId, doctorName, doctorSpecialty, patientId, patientName, diagnosis, items, advice } = body;

    if (!appointmentId || !doctorId || !diagnosis || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'appointmentId, doctorId, diagnosis, and items are required' },
        { status: 400 }
      );
    }

    const prescription = await PrescriptionModel.create({
      appointmentId,
      doctorId,
      doctorName: doctorName || 'Doctor',
      doctorSpecialty: doctorSpecialty || 'General',
      patientId: patientId || 'pat-1',
      patientName: patientName || 'Patient',
      diagnosis,
      items,
      advice: advice || '',
    });

    return NextResponse.json({ success: true, data: prescription }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create prescription' },
      { status: 500 }
    );
  }
}
