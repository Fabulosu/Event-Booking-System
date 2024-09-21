import { dbConnect } from "@/utils/database";
import { EventModel } from "@/utils/models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const eventData = await req.json();

        const newEvent = new EventModel(eventData);
        await newEvent.save();

        return NextResponse.json({ success: true, event: newEvent }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create event' }, { status: 500 });
    }
}