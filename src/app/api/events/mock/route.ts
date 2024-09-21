import { dbConnect } from "@/utils/database";
import { EventModel } from "@/utils/models";
import { NextResponse } from "next/server";
import { faker } from "@faker-js/faker";

export async function POST() {
    await dbConnect();

    try {
        // Generate mock event data
        const mockEvent = new EventModel({
            title: faker.lorem.sentence(),
            description: faker.lorem.paragraph(),
            category: faker.helpers.arrayElement(['Music', 'Sports', 'Tech', 'Conference', 'Meetup']),
            location: faker.location.city(),
            date: faker.date.future(),
            availableSeats: faker.helpers.rangeToNumber({ min: 10, max: 500 }),
            bookedSeats: 0,
            price: faker.commerce.price({ min: 0, max: 100 }),
            organizer: "66e85b511ce4af78a3681bfa",
        });

        await mockEvent.save();

        return NextResponse.json({ success: true, event: mockEvent }, { status: 201 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, error: 'Failed to create mock event' }, { status: 500 });
    }
}