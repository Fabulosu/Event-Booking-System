"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Navbar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin, Calendar, Edit, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface User {
  _id: string;
  username: string;
  email: string;
  public_email: boolean;
  profilePicture?: string;
  role: "user" | "organizer" | "admin";
  balance: number;
  createdAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  address: string;
  city: string;
  date: string;
  availableSeats: number;
  bookedSeats: number;
  price: number;
  imageUrl: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  reviewText: string;
  rating: number;
  createdAt: string;
  user: User;
  event: Event;
}

interface ProfileData {
  user: User;
  events: Event[];
  reviews: Review[];
}

const ProfileSkeleton = () => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-8">
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
      <Skeleton className="w-32 h-32 rounded-full" />
      <div className="space-y-4 w-full max-w-md">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  </div>
);

const EventCard = ({ event }: { event: Event }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
  >
    <div className="relative h-48">
      <Image
        src={event.imageUrl && `/uploads/` + event.imageUrl || "/images/mockhead.jpg"}
        alt={event.title}
        fill
        className="object-cover"
      />
    </div>
    <div className="p-4 space-y-2">
      <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
        {event.title}
      </h3>
      <div className="flex items-center text-gray-600 text-sm gap-2">
        <Calendar className="w-4 h-4" />
        {new Date(event.date).toLocaleDateString()}
      </div>
      <div className="flex items-center text-gray-600 text-sm gap-2">
        <MapPin className="w-4 h-4" />
        {event.city}
      </div>
      <div className="flex items-center text-gray-600 text-sm gap-2">
        <Users className="w-4 h-4" />
        {event.availableSeats - event.bookedSeats} seats left
      </div>
      <Link href={`/event/${event._id}`}>
        <Button variant="secondary" className="w-full mt-2">
          View Details
        </Button>
      </Link>
    </div>
  </motion.div>
);

const ReviewCard = ({ review }: { review: Review }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300"
  >
    <div className="flex items-start gap-4">
      <div className="relative w-10 h-10">
        <Image
          src="/images/user1.jpg"
          alt={review.user.username}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">{review.user.username}</h4>
            <div className="flex items-center gap-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < review.rating ? "fill-current" : "stroke-current"
                    }`}
                />
              ))}
            </div>
          </div>
          <span className="text-sm text-gray-500">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="mt-2 text-gray-700">{review.reviewText}</p>
        <Link
          href={`/event/${review.event._id}`}
          className="mt-2 text-sm text-blue-600 hover:underline inline-block"
        >
          View Event
        </Link>
      </div>
    </div>
  </motion.div>
);

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (params.userId) {
      const fetchProfileData = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`/api/user/${params.userId}`);
          setProfileData(response.data);
          console.log(response.data);
          if (session?.user.id === params.userId) {
            setIsEditable(true);
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
          toast.error("Failed to load profile data");
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfileData();
    }
  }, [params.userId, session?.user.id]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="container mx-auto pt-24 px-4 sm:px-8">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="container mx-auto pt-24 px-4 sm:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Profile not found
            </h1>
            <Link href="/">
              <Button variant="link" className="mt-4">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { user, events, reviews } = profileData;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto pt-24 px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-md rounded-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <Image
                src="/images/user1.jpg"
                alt="Profile"
                width={128}
                height={128}
                className="rounded-full object-cover border-4 border-gray-200 w-[128px] h-[128px]"
              />
              {isEditable && (
                <button
                  className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                  onClick={() => toast.info("Profile picture update coming soon")}
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {user.username}
              </h1>
              <p className="text-gray-600 mb-2">
                {user.public_email ? user.email : isEditable ? user.email : ""}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="secondary" className="text-sm">
                  {user.role}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  Member since {new Date(user.createdAt).getFullYear()}
                </Badge>
              </div>
              {isEditable && (
                <div className="mt-4 flex gap-2 justify-center md:justify-start">
                  <Button
                    variant="outline"
                    onClick={() => toast.info("Profile edit coming soon")}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => toast.info("Settings coming soon")}
                  >
                    Settings
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            {events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event: Event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No events found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}