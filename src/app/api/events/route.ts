import { dbConnect } from "@/utils/database";
import { EventModel } from "@/utils/models";
import { NextRequest, NextResponse } from "next/server";

interface EventQuery {
    category?: { $regex: string; $options: string };
    location?: { $regex: string; $options: string };
    title?: { $regex: string; $options: string };
}

export async function GET(req: NextRequest) {

    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const location = url.searchParams.get("location");
    const name = url.searchParams.get("name");

    await dbConnect();
    const query: EventQuery = {};

    if (category) {
        query.category = { $regex: category, $options: "i" };
    }
    if (location) {
        query.location = { $regex: location, $options: "i" };
    }
    if (name) {
        query.title = { $regex: name, $options: "i" };
    }

    try {
        const events = await EventModel.find(query);
        return NextResponse.json(events, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to retrieve events' }, { status: 500 });
    }
}