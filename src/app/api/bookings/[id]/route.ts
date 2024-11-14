import { dbConnect } from "@/utils/database";
import { BookingModel } from "@/utils/models";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    await dbConnect();
    const bookings = await BookingModel.find({ event: id });
    if (bookings) return NextResponse.json({ success: true, bookings });
    else return NextResponse.json({ success: false, message: "This account doesn't exist!" }, { status: 200 });
}