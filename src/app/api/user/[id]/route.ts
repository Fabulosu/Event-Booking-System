import { dbConnect } from "@/utils/database";
import { EventModel, ReviewModel, UserModel } from "@/utils/models";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    await dbConnect();
    const user = await UserModel.findOne({ _id: id });
    if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    const events = await EventModel.find({ organizer: id });
    const reviews = await ReviewModel.find({ user: id }).populate("event", "title").populate("user", "username");
    if (user) return NextResponse.json({ success: true, user, events, reviews });
    else return NextResponse.json({ success: false, message: "This account doesn't exist!" }, { status: 200 });
}