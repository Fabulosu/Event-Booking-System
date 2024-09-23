import { dbConnect } from "@/utils/database";
import { EventModel } from "@/utils/models";
import { NextResponse } from "next/server";
import { faker } from "@faker-js/faker";

export async function POST(req: Request) {
    await dbConnect();

    let mockEvents = [];

    try {
        const { numberOfEvents } = await req.json();
        for (let i = 0; i < numberOfEvents; i++) {
            const mockEvent = new EventModel({
                title: faker.lorem.sentence({ min: 1, max: 5 }),
                description: faker.lorem.paragraph(),
                category: faker.helpers.arrayElement(['Music', 'Sports', 'Tech', 'Conference', 'Meetup']),
                location: `${faker.location.city()}, ${faker.location.streetAddress({ useFullAddress: true })}`,
                date: faker.date.future(),
                availableSeats: faker.helpers.rangeToNumber({ min: 10, max: 500 }),
                bookedSeats: 0,
                price: faker.commerce.price({ min: 0, max: 100 }),
                organizer: "66e85b511ce4af78a3681bfa",
            });

            mockEvents.push(mockEvent)

            await mockEvent.save();
        }

        return NextResponse.json({ success: true, event: mockEvents }, { status: 201 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, error: 'Failed to create mock event' }, { status: 500 });
    }
}