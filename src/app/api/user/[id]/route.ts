import { dbConnect } from "@/utils/database";
import { EventModel, ReviewModel, UserModel } from "@/utils/models";
import { NextResponse } from "next/server";
import * as bcrypt from "bcrypt";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    await dbConnect();
    const user = await UserModel.findOne({ _id: id });
    if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    const events = await EventModel.find({ organizer: id });
    const reviews = await ReviewModel.find({ user: id }).populate("event", "title").populate("user", "username profilePicture");
    if (user) return NextResponse.json({ success: true, user, events, reviews });
    else return NextResponse.json({ success: false, message: "This account doesn't exist!" }, { status: 200 });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    await dbConnect();

    if (!id) {
        return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    try {
        const updates = await req.json();

        if (!updates || Object.keys(updates).length === 0) {
            return NextResponse.json({ success: false, message: "No updates provided" }, { status: 400 });
        }

        const user = await UserModel.findById(id);

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        if (updates.currentPassword && updates.newPassword) {
            const isMatch = await bcrypt.compareSync(updates.currentPassword, user.password);
            if (!isMatch) {
                return NextResponse.json({ success: false, message: "Incorrect current password" }, { status: 200 });
            }

            const hashedPassword = bcrypt.hashSync(updates.newPassword, bcrypt.genSaltSync(10));

            user.password = hashedPassword;
            await user.save();

            return NextResponse.json({ success: true, message: "Password updated successfully" }, { status: 200 });
        }

        delete updates.currentPassword;
        delete updates.newPassword;

        const updatedUser = await UserModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        return NextResponse.json(
            { success: true, message: "User updated successfully", user: updatedUser },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ success: false, message: "Failed to update user" }, { status: 500 });
    }
}