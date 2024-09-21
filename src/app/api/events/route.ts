import { dbConnect } from "@/utils/database";
import { EventModel } from "@/utils/models";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();
    try {
        const events = await EventModel.find({});
        return NextResponse.json(events, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to retrieve events' }, { status: 500 });
    }
}