import { dbConnect } from "@/utils/database";
import { EventModel } from "@/utils/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    await dbConnect();
    const events = await EventModel.find({ organizer: userId });

    if (events) return NextResponse.json({ success: true, events });
    else return NextResponse.json({ success: false, message: "This user doesn't have any events!" }, { status: 200 });
}