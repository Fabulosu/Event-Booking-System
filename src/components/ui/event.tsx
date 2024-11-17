import Image from 'next/image';
import React from 'react';
import { FaRegClock, FaTicketAlt } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from './badge';
import { formatDate, formatPrice } from '@/lib/utils';

interface EventData {
    _id: string;
    date: string | Date;
    title: string;
    price: number;
    city: string;
    availableSeats: number;
    bookedSeats: number;
    imageUrl: string;
    category?: string;
}

interface Props {
    data: EventData;
}

const EventCard: React.FC<Props> = ({ data }) => {
    const remainingSeats = data.availableSeats - data.bookedSeats;
    const isLowAvailability = remainingSeats < 10;

    return (
        <Link href={`/event/${data._id}`}>
            <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
                <div className="relative aspect-video">
                    <Image
                        src={data.imageUrl ? `/uploads/${data.imageUrl}` : "/images/mockhead.jpg"}
                        alt={data.title}
                        fill
                        className="object-cover"
                    />
                    {data.category && (
                        <Badge
                            variant="secondary"
                            className="absolute top-4 left-4"
                        >
                            {data.category}
                        </Badge>
                    )}
                    {isLowAvailability && (
                        <Badge
                            variant="destructive"
                            className="absolute top-4 right-4"
                        >
                            {remainingSeats} seats left
                        </Badge>
                    )}
                </div>

                <div className="p-4 space-y-4">
                    <h3 className="text-lg font-semibold line-clamp-2">
                        {data.title}
                    </h3>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                            <FaRegClock className="flex-shrink-0" />
                            <span className="text-sm">
                                {formatDate(new Date(data.date))}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                            <IoLocationOutline className="flex-shrink-0" />
                            <span className="text-sm">{data.city}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <FaTicketAlt className="text-[#24AE7C]" />
                            <span className="font-bold">
                                {formatPrice(data.price)}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default EventCard;