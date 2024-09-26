import { dbConnect } from "@/utils/database";
import { UserModel } from "@/utils/models";
import { NextResponse } from "next/server";
import * as bcrypt from "bcrypt";

export async function POST(req: Request) {
    const { username, email, password } = await req.json();

    await dbConnect();
    const user = await UserModel.findOne({ $or: [{ username }, { email }] });
    if (!user) {
        const hashedPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const newUser = new UserModel({
            username: username,
            email: email,
            password: hashedPass,
            role: 'user',
            profilePicture: ""
        });
        await newUser.save();
        return NextResponse.json({ success: true, message: "Account created successfully!" }, { status: 200 });
    } else {
        return NextResponse.json({ success: false, message: "There is already an account with this username or email!" }, { status: 200 });
    }
}