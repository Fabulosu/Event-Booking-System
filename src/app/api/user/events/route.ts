import { dbConnect } from "@/utils/database";
import { EventModel } from "@/utils/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    await dbConnect();

    try {
        const events = await EventModel.find({ organizer: userId }).populate("reviews");

        if (events.length > 0) {
            return NextResponse.json({ success: true, events });
        } else {
            return NextResponse.json(
                { success: false, message: "This user doesn't have any events!" },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error("Error fetching events with ratings:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch events." },
            { status: 500 }
        );
    }
}