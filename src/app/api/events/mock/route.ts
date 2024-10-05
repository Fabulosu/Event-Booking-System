import { dbConnect } from "@/utils/database";
import { EventModel } from "@/utils/models";
import { NextResponse } from "next/server";
import { faker } from "@faker-js/faker";

export async function POST(req: Request) {
    await dbConnect();

    const mockEvents = [];

    try {
        const { numberOfEvents } = await req.json();
        for (let i = 0; i < numberOfEvents; i++) {
            const randAddress = faker.helpers.arrayElement([
                "123 Main St, Springfield",
                "456 Oak Ave, Metropolis",
                "789 Elm St, Gotham",
                "101 Pine Rd, Star City",
                "202 Maple Dr, Central City",
                "1 Rue de Rivoli, Paris, France",
                "221B Baker St, London, England",
                "1600 Pennsylvania Ave NW, Washington, D.C., USA",
                "10 Downing St, London, England",
                "17 Rue du Cygne, Paris, France",
                "Karl-Liebknecht-Str. 5, Berlin, Germany",
                "Plaza Mayor, Madrid, Spain",
                "Váci utca 12, Budapest, Hungary",
                "Via del Corso 22, Rome, Italy",
                "Nyhavn 1, Copenhagen, Denmark",
                "Avenida da Liberdade, Lisbon, Portugal",
                "Brivibas iela 30, Riga, Latvia",
                "Pikk jalg 3, Tallinn, Estonia",
                "Freiheit 4, Zurich, Switzerland",
                "Storgata 15, Oslo, Norway",
                "Kungsgatan 5, Stockholm, Sweden",
                "Strøget, Copenhagen, Denmark",
                "Rotenturmstraße 10, Vienna, Austria",
                "Deak Ferenc ter 2, Budapest, Hungary",
                "Gran Via 27, Barcelona, Spain",
                "Princes Street, Edinburgh, Scotland",
                "Váci utca 20, Budapest, Hungary",
                "Via del Governo Vecchio, Rome, Italy",
                "Aleje Jerozolimskie 1, Warsaw, Poland",
                "Náměstí Republiky 10, Prague, Czech Republic"
            ])
            const mockEvent = new EventModel({
                title: faker.lorem.sentence({ min: 1, max: 5 }),
                description: faker.lorem.paragraph(),
                category: faker.helpers.arrayElement(['Music', 'Sports', 'Tech', 'Conference', 'Meetup']),
                address: randAddress,
                city: randAddress.split(",")[1].replace(" ", ""),
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