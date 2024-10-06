import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { dbConnect } from "@/utils/database";
import { EventModel } from "@/utils/models";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authConfig } from "@/utils/auth";

interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

const getGeocodedAddress = async (lat: number, lng: number): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
        const response = await axios.get(geocodingUrl);
        if (response.data.results.length > 0) {
            return response.data.results[0].formatted_address;
        } else {
            throw new Error("No address found for the given coordinates.");
        }
    } catch (error) {
        console.error("Error fetching address from Google Maps API:", error);
        throw new Error("Failed to get address");
    }
};

const getGeocodedCity = async (lat: number, lng: number): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
        const response = await axios.get(geocodingUrl);
        if (response.data.results.length > 0) {
            const addressComponents: AddressComponent[] = response.data.results[0].address_components;

            const cityComponent = addressComponents.find((component) =>
                component.types.includes("locality")
            );

            if (cityComponent) {
                return cityComponent.long_name;
            } else {
                try {
                    return addressComponents[2].long_name;

                } catch (error) {
                    console.error(error);
                    throw new Error("City not found in address components.");
                }
            }
        } else {
            throw new Error("No address found for the given coordinates.");
        }
    } catch (error) {
        console.error("Error fetching city from Google Maps API:", error);
        throw new Error("Failed to get city");
    }
};

export async function POST(req: Request) {
    await dbConnect();

    const session = await getServerSession(authConfig);

    if (session) {
        try {
            const formData = await req.formData();

            // Get form data fields
            const title = formData.get('title')?.toString();
            const description = formData.get('description')?.toString();
            const price = parseFloat(formData.get('price') as string);
            const date = formData.get('date')?.toString();
            const location = JSON.parse(formData.get('location') as string);
            const file = formData.get('file') as File;
            const category = formData.get('category')?.toString();
            const availableSeats = parseFloat(formData.get('seats') as string);
            const time = formData.get('time')?.toString();

            // Validate required fields
            if (!title || !description || !date || !time || !location) {
                return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
            }

            const dateString = new Date(date);

            let imageUrl = null;

            const address = await getGeocodedAddress(location.lat, location.lng);
            const city = await getGeocodedCity(location.lat, location.lng);

            if (file) {
                // Handle file upload
                const buffer = Buffer.from(await file.arrayBuffer());
                const filename = file.name.replaceAll(" ", "_");
                imageUrl = filename;

                try {
                    await writeFile(
                        path.join(process.cwd(), "public/uploads/" + filename),
                        new Int8Array(buffer)
                    );
                } catch (error) {
                    console.error("Error occurred while saving file: ", error);
                    return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
                }
            }

            // Create new event
            const newEvent = new EventModel({
                title,
                description,
                price: price || 0,
                date: `${dateString.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                })}, ${time}`,
                address,
                city,
                imageUrl,
                category,
                availableSeats,
                bookedSeats: 0,
                organizer: session.user.id,
            });

            await newEvent.save();

            return NextResponse.json({ success: true, event: newEvent }, { status: 201 });
        } catch (error) {
            console.error("Error creating event:", error);
            return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
        }
    } else {
        console.error("Error creating event: invalid session");
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
    }
}