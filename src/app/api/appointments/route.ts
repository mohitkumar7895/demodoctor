import { NextRequest, NextResponse } from 'next/server';
import { AppointmentModel } from '@/models/appointment';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId') || undefined;
    const patientEmail = searchParams.get('patientEmail') || undefined;
    const status = searchParams.get('status') || undefined;

    const appointments = await AppointmentModel.getAll({ doctorId, patientEmail, status });
    return NextResponse.json({ success: true, count: appointments.length, data: appointments });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      doctorId,
      doctorName,
      doctorSpecialty,
      doctorAvatar,
      patientName,
      patientEmail,
      patientPhone,
      patientAge,
      patientGender,
      appointmentDate,
      appointmentTime,
      consultationType,
      symptoms,
      fee,
    } = body;

    if (!doctorId || !patientName || !patientEmail || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { success: false, error: 'Missing required appointment fields' },
        { status: 400 }
      );
    }

    const appointment = await AppointmentModel.create({
      doctorId,
      doctorName,
      doctorSpecialty,
      doctorAvatar,
      patientName,
      patientEmail,
      patientPhone,
      patientAge: patientAge ? Number(patientAge) : undefined,
      patientGender,
      appointmentDate,
      appointmentTime,
      consultationType: consultationType || 'in-clinic',
      symptoms: symptoms || '',
      fee: fee || 800,
    });

    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to book appointment' },
      { status: 500 }
    );
  }
}
