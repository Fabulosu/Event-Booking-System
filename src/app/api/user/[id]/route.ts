import { dbConnect } from "@/utils/database";
import { UserModel } from "@/utils/models";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    await dbConnect();
    const user = await UserModel.findOne({ _id: id });
    if (user) return NextResponse.json({ success: true, user: user });
    else return NextResponse.json({ success: false, message: "This account doesn't exist!" }, { status: 200 });
}