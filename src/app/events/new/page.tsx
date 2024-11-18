"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { DatePickerDemo } from "@/components/ui/date-picker";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // Add toast for notifications
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion"; // Add animations

export default function CreateEventPage() {
    const router = useRouter();

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

    // Add loading state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form validation state
    const [errors, setErrors] = useState({
        title: "",
        description: "",
        price: "",
        seats: "",
        location: "",
        date: "",
        time: "",
        image: "",
    });

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Basic form validation
        let hasErrors = false;
        const newErrors = { ...errors };

        if (title.length < 3) {
            newErrors.title = "Title must be at least 3 characters long";
            hasErrors = true;
        }

        if (description.length < 10) {
            newErrors.description = "Description must be at least 10 characters long";
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

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
                toast.success("Event created successfully!");
                router.push("/events");
            } else {
                toast.error(data.error || "Failed to create event");
            }
        } catch (error) {
            toast.error("An error occurred while creating the event");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar className="relative w-full z-50" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto p-8 my-8"
            >
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
                        Create Your Event
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Event Title *
                                    </label>
                                    <Input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-[#24AE7C]"
                                        placeholder="Enter event title"
                                        maxLength={50}
                                        required
                                    />
                                    {errors.title && (
                                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Category *
                                    </label>
                                    <Select onValueChange={(val) => setCategory(val)}>
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
                                        className="mt-1 w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-[#24AE7C] focus:border-transparent transition-all duration-200"
                                        rows={4}
                                        placeholder="Describe your event..."
                                        maxLength={250}
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {description.length}/250 characters
                                    </p>
                                </div>
                            </div>

                            {/* Right Column */}
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
                                            onBlur={(e) => {
                                                if (Number(e.target.value) < 10) {
                                                    e.target.value = "10";
                                                    setSeats(10);
                                                }
                                            }}
                                            className="mt-1"
                                            min="10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Date & Time *
                                    </label>
                                    <div className="grid grid-cols-2 gap-4 mt-1">
                                        <DatePickerDemo
                                            onChange={(val) => {
                                                val && setDate(val.toString());
                                            }}
                                        />
                                        <Input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Event Image
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-[#24AE7C] transition-colors duration-200">
                                        <div className="space-y-1 text-center">
                                            <svg
                                                className="mx-auto h-12 w-12 text-gray-400"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 48 48"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-[#24AE7C] hover:text-[#1d8b63] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#24AE7C]"
                                                >
                                                    <span>Upload a file</span>
                                                    <Input
                                                        id="file-upload"
                                                        type="file"
                                                        className="sr-only"
                                                        accept="image/*"
                                                        onChange={(e) =>
                                                            setImage(e.target.files?.[0] || null)
                                                        }
                                                        required
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

                        <div className="mt-8">
                            <label className="text-sm font-medium text-gray-700">
                                Location *
                            </label>
                            <div className="mt-1 rounded-lg overflow-hidden">
                                <LoadScriptNext
                                    googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API || ""}
                                >
                                    <GoogleMap
                                        mapContainerStyle={{
                                            height: "400px",
                                            width: "100%",
                                            borderRadius: "0.5rem",
                                        }}
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
                        </div>

                        <div className="flex justify-end mt-8">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#24AE7C] hover:bg-[#1d8b63] text-white px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Creating Event...
                                    </span>
                                ) : (
                                    "Create Event"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}