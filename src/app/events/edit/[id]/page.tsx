"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/select";
import axios from "axios";

interface Event {
    _id: string;
    title: string;
    address: string;
    date: string;
    price: number;
    description: string;
    category: string;
    availableSeats: number;
    organizer: {
        username: string;
    };
    imageUrl: string;
}

export default function EditEventPage({ params }: { params: { id: string } }) {
    const id = params.id;
    const [eventData, setEventData] = useState<Event | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [seats, setSeats] = useState(10);
    const [category, setCategory] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    useEffect(() => {
        if (id) {
            const getEventData = async () => {
                try {
                    const response = await axios.get(`/api/events/${id}`);
                    if (response) setEventData(response.data);

                } catch (error) {
                    console.error(error);
                }
            }

            getEventData();
        }
    }, [id]);

    const router = useRouter();

    if (!eventData) return <div className="h-screen w-screen flex justify-center items-center">Loading!</div>

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

        console.log(formData)
        try {
            const response = await fetch(`/api/events/${id}`, {
                method: "PUT",
                body: formData,
            });

            const data = await response.json();

            if (response.status === 200) {
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
                            defaultValue={eventData.title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={10}
                            className="shadow-xl"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-2" htmlFor="title">Event Category</label>
                        <Select defaultValue={eventData.category.toLowerCase()} onValueChange={(val) => setCategory(val)}>
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
                            value={eventData.description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border px-3 py-2 rounded shadow-xl"
                            rows={3}
                            maxLength={250}
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-2" htmlFor="price">Price</label>
                        <Input
                            type="number"
                            id="price"
                            defaultValue={eventData.price}
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
                            defaultValue={eventData.availableSeats}
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
                        <label className="block font-bold mb-2" htmlFor="date">Date</label>
                        <DatePickerDemo
                            className="w-full shadow-xl"
                            defaultValue={new Date(eventData.date)}
                            onChange={(val) => { val && setDate(val.toString()) }}
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-2" htmlFor="time">Starting time</label>
                        <Input
                            type="time"
                            id="time"
                            defaultValue={new Date(eventData.date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
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
                        Save Changes
                    </Button>
                </form>
            </div>
        </div>
    );
}