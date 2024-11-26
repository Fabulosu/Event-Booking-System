"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaRegClock, FaRegCalendar, FaShare, FaStar, FaRegStar } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/navbar";
import BottomBar from "@/components/bottombar";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

interface Rating {
    rating: number;
    reviewText?: string;
    userId: string;
    createdAt: Date;
}

interface Event {
    _id: string;
    title: string;
    address: string;
    date: string;
    price: number;
    description: string;
    category: string;
    availableSeats: number;
    bookedSeats: number;
    organizer: {
        username: string;
        profilePicture?: string;
    };
    imageUrl: string;
    ratings?: Rating[];
}

const EventSkeleton = () => (
    <div className="flex flex-col px-4 md:px-12 animate-pulse">
        <Skeleton className="w-full h-[300px] md:h-[500px]" />
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 mt-6">
            <div className="w-full lg:w-1/2 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="w-full lg:w-1/2">
                <Skeleton className="h-[300px] w-full" />
            </div>
        </div>
    </div>
);

export default function EventPage({ params }: { params: { id: string } }) {
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userRating, setUserRating] = useState<number>(0);
    const [hover, setHover] = useState<number>(0);
    const [review, setReview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const { data: session, status } = useSession();

    const reviewText = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);

                const response = await fetch(`/api/events/${params.id}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    setError(errorData.message || "Failed to fetch event data.");
                    toast.error(errorData.message || "Failed to fetch event data.");
                    return;
                }

                const eventData = await response.json();

                console.log(eventData);

                setEvent(eventData);
            } catch (err) {
                console.error("Error fetching event data:", err);
                setError("Failed to fetch event data.");
                toast.error("Failed to fetch event data.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [params.id]);

    const handleShare = async () => {
        try {
            await navigator.share({
                title: event?.title,
                text: event?.description,
                url: window.location.href,
            });
        } catch (err) {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

    if (loading) {
        return (
            <div className="relative w-full min-h-screen bg-gray-50">
                <Navbar className="relative" />
                <EventSkeleton />
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative w-full min-h-screen bg-gray-50">
                <Navbar className="relative" />
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <Button onClick={() => window.history.back()}>Go Back</Button>
                </div>
            </div>
        );
    }

    const StarRating = () => {
        const stars = [1, 2, 3, 4, 5];

        const calculateAverageRating = () => {
            if (!event?.ratings || event.ratings.length === 0) return 0;
            const sum = event.ratings.reduce((acc, curr) => acc + curr.rating, 0);
            return Number((sum / event.ratings.length).toFixed(1));
        };
        const averageRating = calculateAverageRating();


        const handleRatingSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!userRating) {
                toast.error("Please select a rating");
                return;
            }

            if (status === "unauthenticated") {
                toast.error("You need to be logged to leave a review!");
                return;
            }

            setIsSubmitting(true);
            try {
                const response = await fetch(`/api/rating/${params.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: session?.user?.id,
                        rating: userRating,
                        reviewText: reviewText.current?.value.trim() || undefined,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    if (data.error === 'You have already submitted a review for this event.') {
                        setShowReviewForm(false);
                        setReview("");
                        setUserRating(0)
                        toast.error("You have already reviewed this event.");
                    } else {
                        toast.error("Failed to submit rating.");
                    }
                    throw new Error(data.error || 'Failed to submit rating');
                }

                toast.success("Thank you for your feedback!");
                setShowReviewForm(false);
                setReview("");
            } catch (error) {
                console.error(error);
            } finally {
                setIsSubmitting(false);
            }
        };

        return (
            <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4 pb-4 border-b">
                    <h4 className="font-semibold">Event Rating</h4>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <span className="text-3xl font-bold text-gray-900">
                                {averageRating}
                            </span>
                            <span className="text-gray-500 ml-1">/5</span>
                        </div>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={`w-5 h-5 ${i < Math.round(averageRating)
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">
                        {event?.ratings?.length || 0} {event?.ratings?.length === 1 ? 'rating' : 'ratings'}
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-2 pt-4">
                    <p className="text-sm text-gray-500">Rate this event</p>
                    <div className="flex space-x-1">
                        {stars.map((star) => (
                            <button
                                key={star}
                                className="focus:outline-none transition-colors duration-200"
                                onClick={() => {
                                    setUserRating(star);
                                    setShowReviewForm(true);
                                }}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >
                                {star <= (hover || userRating) ? (
                                    <FaStar className="w-8 h-8 text-yellow-400" />
                                ) : (
                                    <FaRegStar className="w-8 h-8 text-yellow-400" />
                                )}
                            </button>
                        ))}
                    </div>
                    {userRating > 0 && (
                        <p className="text-sm text-gray-600">
                            Your rating: {userRating} star{userRating !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                    <form onSubmit={handleRatingSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="review">Your Review (Optional)</Label>
                            <Textarea
                                id="review"
                                placeholder="Share your experience..."
                                defaultValue={review}
                                ref={reviewText}
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setShowReviewForm(false);
                                    setUserRating(0);
                                    setReview("");
                                }}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        );
    };

    return (
        <div className="relative w-full min-h-screen bg-gray-50">
            <Navbar className="relative" />
            {event && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col pb-24"
                    >
                        <div className="relative w-full h-[300px] md:h-[500px]">
                            <Image
                                src={event.imageUrl ? `/uploads/${event.imageUrl}` : "/images/mockhead.jpg"}
                                fill
                                priority
                                alt={event.title}
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <Button
                                variant="secondary"
                                size="icon"
                                className="absolute top-4 right-4"
                                onClick={handleShare}
                            >
                                <FaShare className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="container mx-auto px-4 -mt-20 relative z-10">
                            <Card className="p-6">
                                <div className="flex flex-col lg:flex-row gap-8">
                                    <div className="w-full lg:w-2/3 space-y-6">
                                        <div>
                                            <Badge className="mb-4">{event.category}</Badge>
                                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                                {event.title}
                                            </h1>
                                            <p className="text-gray-600 leading-relaxed">{event.description}</p>
                                        </div>

                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarImage src={`/uploads/${event.organizer.profilePicture}`} />
                                                        <AvatarFallback>
                                                            {event.organizer.username.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Organized by</p>
                                                        <p className="font-semibold">{event.organizer.username}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <IoLocationOutline className="text-[#24AE7C] w-5 h-5" />
                                                    <p className="text-gray-700">{event.address}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <FaRegCalendar className="text-[#24AE7C] w-5 h-5" />
                                                    <p className="text-gray-700">
                                                        {new Date(event.date).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <FaRegClock className="text-[#24AE7C] w-5 h-5" />
                                                    <p className="text-gray-700">
                                                        {new Date(event.date).toLocaleTimeString('en-US', {
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                            hour12: true,
                                                        })}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="w-full lg:w-1/3">
                                        <Card className="top-24 mb-4">
                                            <CardContent className="p-4">
                                                <StarRating />
                                            </CardContent>
                                        </Card>
                                        <Card className="sticky top-24">
                                            <CardContent className="p-4">
                                                <div className="space-y-4">
                                                    <h3 className="text-xl font-semibold">Event Location</h3>
                                                    <div className="aspect-video relative rounded-lg overflow-hidden">
                                                        <iframe
                                                            width="100%"
                                                            height="100%"
                                                            loading="lazy"
                                                            allowFullScreen
                                                            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API}&q=${encodeURIComponent(event.address)}&zoom=15`}
                                                            className="border-0"
                                                        />
                                                    </div>
                                                    <div className="pt-4 border-t">
                                                        <p className="text-sm text-gray-500 mb-2">Available Seats</p>
                                                        <p className="text-2xl font-bold text-[#24AE7C]">
                                                            {event.availableSeats - event.bookedSeats} / {event.availableSeats}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
            <BottomBar price={event?.price} eventId={event?._id} />
        </div>
    );
}