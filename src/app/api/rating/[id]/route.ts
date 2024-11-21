import { dbConnect } from "@/utils/database";
import { EventModel, ReviewModel } from "@/utils/models";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = params;

    if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    try {
        const event = await EventModel.findById(id);
        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        const ratings = await ReviewModel.find({ event: id });
        if (!ratings) {
            return NextResponse.json({ error: 'This event hasn\'t received any ratings!' }, { status: 404 });
        }
        return NextResponse.json(ratings, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to retrieve the event ratings!' }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id: eventId } = params;

    if (!ObjectId.isValid(eventId)) {
        return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    try {
        const event = await EventModel.findById(eventId);
        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        const body = await req.json();
        const { userId, rating, reviewText } = body;

        if (!userId || !rating) {
            return NextResponse.json(
                { error: 'Missing required fields: userId and rating are mandatory.' },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 });
        }

        const existingReview = await ReviewModel.findOne({ user: userId, event: eventId });
        if (existingReview) {
            return NextResponse.json(
                { error: 'You have already submitted a review for this event.' },
                { status: 400 }
            );
        }

        const reviewData = {
            user: userId,
            event: eventId,
            rating,
            reviewText,
        };

        const review = new ReviewModel(reviewData);
        await review.save();

        return NextResponse.json({ success: true, message: 'Review created successfully.', review }, { status: 201 });
    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json({ error: 'Failed to create review.' }, { status: 500 });
    }
}