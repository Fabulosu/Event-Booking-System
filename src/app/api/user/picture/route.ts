import { getServerSession } from 'next-auth';
import path from 'path';
import fs from 'fs';
import { authConfig } from '@/utils/auth';
import { UserModel } from '@/utils/models';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authConfig);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { image } = await req.json();
        if (!image) {
            return NextResponse.json({ message: 'No image provided' }, { status: 400 });
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const matches = image.match(/^data:image\/([a-zA-Z0-9]+);base64,([^\"]+)/);
        if (!matches) {
            return NextResponse.json({ message: 'Invalid image data' }, { status: 400 });
        }

        const buffer = Buffer.from(matches[2], 'base64');
        // Create a unique filename
        const filename = `${session.user.id}-${Date.now()}${path.extname(matches[1])}.png`;

        // Save the file
        await fs.promises.writeFile(path.join(process.cwd(), "public/uploads/" + filename), new Int8Array(buffer));

        // Update database with new image path
        await UserModel.updateOne(
            { _id: session.user.id },
            { $set: { profilePicture: filename } }
        );

        return NextResponse.json({
            message: 'Profile picture updated successfully',
            image: `${filename}`
        }, { status: 200 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ message: 'Error uploading image' }, { status: 500 });
    }
}