"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { DatePickerDemo } from "@/components/ui/date-picker";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function CreateEventPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [seats, setSeats] = useState(10);
    const [time, setTime] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [center, setCenter] = useState<{ lat: number; lng: number }>({
        lat: 51.505,
        lng: -0.09,
    });
    const [date, setDate] = useState("");
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCenter({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error('Error fetching user location: ', error);
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            console.error("User denied the request for Geolocation.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.error("Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            console.error("The request to get user location timed out.");
                            break;
                    }
                }
            );
        }
    }, []);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price.toString());
        formData.append("seats", seats.toString());
        formData.append("date", date);
        formData.append("category", category);
        formData.append("time", time);
        if (image) {
            formData.append("file", image);
        }
        if (location) {
            formData.append("location", JSON.stringify(location));
        }

        try {
            const response = await fetch("/api/events/create", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();

            if (response.status === 201) {
                router.push("/events");
            } else {
                console.error("Failed to create event:", data.error);
            }
        } catch (error) {
            console.error("Failed to create event:", error);
        }
    };

    return (
        <div>
            <Navbar className="relative w-full z-50" />
            <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold mb-6">Create an Event</h2>
                <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-6">
                    <div>
                        <label className="block font-bold mb-2" htmlFor="title">Event Title</label>
                        <Input
                            type="text"
                            id="title"
                            placeholder="Event title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={10}
                            className="shadow-xl"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-2" htmlFor="title">Event Category</label>
                        <Select onValueChange={(val) => setCategory(val)}>
                            <SelectTrigger className="w-full shadow-xl">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="music">Music</SelectItem>
                                <SelectItem value="sports">Sports</SelectItem>
                                <SelectItem value="tech">Tech</SelectItem>
                                <SelectItem value="arts">Arts</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block font-bold mb-2" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            placeholder="Event description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border px-3 py-2 rounded shadow-xl"
                            rows={1}
                            maxLength={250}
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-2" htmlFor="price">Price</label>
                        <Input
                            type="number"
                            id="price"
                            defaultValue={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-full border px-3 py-2 rounded shadow-xl"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-2" htmlFor="seats">Available Seats</label>
                        <Input
                            type="number"
                            id="seats"
                            defaultValue={seats}
                            onChange={(e) => setSeats(Number(e.target.value))}
                            onBlur={(e) => {
                                if (Number(e.target.value) < 10) {
                                    e.target.value = "10";
                                    setSeats(10);
                                }
                            }}
                            className="w-full border px-3 py-2 rounded shadow-xl"
                            min={1}
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-2" htmlFor="location">Location</label>
                        <LoadScriptNext googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API || ""}>
                            <GoogleMap
                                id="marker-example"
                                mapContainerStyle={{ height: "400px", width: "100%" }}
                                center={center}
                                zoom={14}
                                onClick={(event) => {
                                    const lat = event.latLng?.lat();
                                    const lng = event.latLng?.lng();
                                    if (lat && lng) {
                                        setLocation({ lat, lng });
                                    }
                                }}
                            >
                                {location && <Marker position={location} />}
                            </GoogleMap>
                        </LoadScriptNext>
                    </div>

                    <div>
                        <label className="block font-bold mb-2" htmlFor="date">Date</label>
                        <DatePickerDemo
                            className="w-full shadow-xl"
                            onChange={(val) => { val && setDate(val.toString()) }}
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-2" htmlFor="time">Starting time</label>
                        <Input
                            type="time"
                            id="time"
                            defaultValue={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full flex justify-between border px-3 py-2 rounded shadow-xl"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-2" htmlFor="image">Event Image</label>
                        <Input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files?.[0] || null)}
                            className="w-full shadow-xl hover:cursor-pointer"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="bg-[#24AE7C] hover:bg-[#329c75] text-white font-bold py-2 px-4 rounded"
                    >
                        Create Event
                    </Button>
                </form>
            </div>
        </div>
    );
}