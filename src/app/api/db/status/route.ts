import { NextRequest, NextResponse } from 'next/server';
import { checkDbConnection, initializeMysqlTables } from '@/lib/db';
import { AppointmentModel } from '@/models/appointment';

export async function GET() {
  try {
    const status = await checkDbConnection();
    const stats = await AppointmentModel.getStats();

    return NextResponse.json({
      success: true,
      status,
      stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const result = await initializeMysqlTables();
    const status = await checkDbConnection();
    return NextResponse.json({ ...result, status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
