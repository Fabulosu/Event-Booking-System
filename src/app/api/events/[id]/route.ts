import { dbConnect } from "@/utils/database";
import { EventModel } from "@/utils/models";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authConfig } from "@/utils/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = params;

    if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    try {
        const event = await EventModel.findById(id).populate('organizer', 'username profilePicture');
        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }
        return NextResponse.json(event, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to retrieve the event' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = params;

    if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const session = await getServerSession(authConfig);

    if (session) {
        try {
            const formData = await req.formData();
            const updateFields: Partial<{
                title: string;
                description: string;
                price: number;
                date: string;
                location: object;
                category: string;
                availableSeats: number;
            }> = {};

            const title = formData.get('title')?.toString();
            if (title) updateFields.title = title;

            const description = formData.get('description')?.toString();
            if (description) updateFields.description = description;

            const price = parseFloat(formData.get('price') as string);
            if (!isNaN(price)) updateFields.price = price;

            const date = formData.get('date')?.toString();
            const time = formData.get('time')?.toString();
            if (date) {
                const dateString = new Date(date);
                updateFields.date = `${dateString.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                })}, ${time}`;
            }

            const location = formData.get('location') ? JSON.parse(formData.get('location') as string) : null;
            if (location) updateFields.location = location;

            const category = formData.get('category')?.toString();
            if (category) updateFields.category = category;

            const availableSeats = parseInt(formData.get('seats') as string, 10);
            if (!isNaN(availableSeats)) updateFields.availableSeats = availableSeats;

            // const file = formData.get('file') as File;
            // if (file) {
            //     const buffer = Buffer.from(await file.arrayBuffer());
            //     const filename = file.name.replaceAll(" ", "_");
            //     updateFields.imageUrl = filename;

            //     try {
            //         await writeFile(
            //             path.join(process.cwd(), "public/uploads/" + filename),
            //             new Int8Array(buffer)
            //         );
            //     } catch (error) {
            //         console.error("Error occurred while saving file: ", error);
            //         return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
            //     }
            // }

            const updatedEvent = await EventModel.findByIdAndUpdate(id, updateFields, { new: true });
            if (!updatedEvent) {
                return NextResponse.json({ error: 'Event not found' }, { status: 404 });
            }

            return NextResponse.json(updatedEvent, { status: 200 });
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: 'Failed to update the event' }, { status: 500 });
        }
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = params;

    if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    try {
        const deletedEvent = await EventModel.findByIdAndDelete(id);
        if (!deletedEvent) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete the event' }, { status: 500 });
    }
}