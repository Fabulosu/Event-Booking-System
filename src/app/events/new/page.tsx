"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { DatePickerDemo } from "@/components/ui/date-picker";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [center, setCenter] = useState<{ lat: number; lng: number }>({
        lat: 0,
        lng: 0,
    });
    // const [date, setDate] = useState("");
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
        // formData.append("date", date);
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await axios.post("/api/events", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status === 201) {
                router.push("/events");
            }
        } catch (error) {
            console.error("Failed to create event:", error);
        }
    };

    const handleDateChange = (newDate: Date | undefined) => {
        console.log("Selected Date:", newDate);
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
                        <label className="block font-bold mb-2" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            placeholder="Event description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border px-3 py-2 rounded shadow-xl"
                            rows={5}
                            maxLength={250}
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-2" htmlFor="price">Price</label>
                        <Input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-full border px-3 py-2 rounded shadow-xl"
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
                            onChange={handleDateChange}
                            className="w-full shadow-xl"
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
