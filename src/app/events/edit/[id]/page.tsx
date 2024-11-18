"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePickerDemo } from "@/components/ui/date-picker";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [seats, setSeats] = useState(10);
    const [category, setCategory] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const router = useRouter();

    useEffect(() => {
        const getEventData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`/api/events/${id}`);
                if (response) {
                    const event = response.data;
                    setEventData(event);
                    setTitle(event.title);
                    setDescription(event.description);
                    setPrice(event.price);
                    setSeats(event.availableSeats);
                    setCategory(event.category.toLowerCase());
                    setDate(event.date);
                    setTime(new Date(event.date).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit"
                    }));
                }
            } catch (error) {
                setError("Failed to load event data");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) getEventData();
    }, [id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

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

        try {
            const response = await fetch(`/api/events/${id}`, {
                method: "PUT",
                body: formData,
            });

            const data = await response.json();

            if (response.status === 200) {
                toast.success("Event updated successfully!");
                router.push("/events");
            } else {
                toast.error(data.error || "Failed to update event");
            }
        } catch (error) {
            toast.error("An error occurred while updating the event");
            console.error("Failed to update event:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/events/${id}`);
            toast.success("Event deleted successfully!");
            router.push("/events");
        } catch (error) {
            toast.error("Failed to delete event");
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#24AE7C]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-screen flex flex-col justify-center items-center gap-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <p className="text-xl font-medium text-gray-900">{error}</p>
                <Button onClick={() => router.push("/events")}>
                    Return to Events
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar className="relative w-full z-50" />
            <div className="max-w-4xl mx-auto p-6 my-8">
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Edit Event</h2>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete Event</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        event and remove all associated data.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Event Title *
                                    </label>
                                    <Input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="mt-1"
                                        maxLength={50}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Category *
                                    </label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="music">🎵 Music</SelectItem>
                                            <SelectItem value="sports">⚽ Sports</SelectItem>
                                            <SelectItem value="tech">💻 Tech</SelectItem>
                                            <SelectItem value="arts">🎨 Arts</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Description *
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="mt-1 w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-[#24AE7C] focus:border-transparent"
                                        rows={4}
                                        maxLength={250}
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {description.length}/250 characters
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">
                                            Price (£) *
                                        </label>
                                        <Input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(Number(e.target.value))}
                                            className="mt-1"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">
                                            Seats *
                                        </label>
                                        <Input
                                            type="number"
                                            value={seats}
                                            onChange={(e) => setSeats(Number(e.target.value))}
                                            className="mt-1"
                                            min="10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">
                                            Date *
                                        </label>
                                        <DatePickerDemo
                                            className="mt-1"
                                            defaultValue={new Date(date)}
                                            onChange={(val) => val && setDate(val.toString())}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">
                                            Time *
                                        </label>
                                        <Input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="mt-1"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Event Image
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#24AE7C] transition-colors duration-200">
                                        <div className="space-y-1 text-center">
                                            {imagePreview || eventData?.imageUrl ? (
                                                <div className="relative w-full h-40 mb-4">
                                                    <Image
                                                        src={imagePreview || `/uploads/${eventData?.imageUrl}`}
                                                        alt="Preview"
                                                        fill
                                                        className="object-cover rounded-lg"
                                                    />
                                                </div>
                                            ) : (
                                                <svg
                                                    className="mx-auto h-12 w-12 text-gray-400"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    viewBox="0 0 48 48"
                                                >
                                                    <path
                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            )}
                                            <div className="flex text-sm text-gray-600">
                                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#24AE7C] hover:text-[#1d8b63] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#24AE7C]">
                                                    <span>Upload a file</span>
                                                    <input
                                                        type="file"
                                                        className="sr-only"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, GIF up to 10MB
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/events")}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#24AE7C] hover:bg-[#1d8b63]"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving Changes
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}