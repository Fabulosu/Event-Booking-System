import { dbConnect } from "@/utils/database";
import { EventModel } from "@/utils/models";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = params;

    if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    try {
        const event = await EventModel.findById(id).populate('organizer', 'username');
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

    const updatedData = await req.json();

    try {
        const updatedEvent = await EventModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedEvent) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }
        return NextResponse.json(updatedEvent, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update the event' }, { status: 500 });
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