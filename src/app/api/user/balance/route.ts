import { dbConnect } from "@/utils/database";
import { UserModel } from "@/utils/models";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/utils/auth";

export async function GET() {
    const session = await getServerSession(authConfig);
    if (!session) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { username, email } = session.user;

    const user = await UserModel.findOne({ $or: [{ username }, { email }] });
    console.log(user)
    if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, balance: user.balance });
}