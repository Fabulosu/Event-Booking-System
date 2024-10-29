import Image from 'next/image';
import React from 'react';
import { BsFillPeopleFill } from "react-icons/bs";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoTicket } from 'react-icons/io5';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from './button';

interface EventData {
    _id: string;
    date: string | Date;
    title: string;
    price: number;
    city: string;
    availableSeats: number;
    bookedSeats: number;
    imageUrl: string;
}

interface Props {
    data: EventData
}

const EventCard: React.FC<Props> = ({ data }) => {
    return (
        <div className='flex items-center md:gap-6 w-full lg:w-[50vw] shadow-xl h-[80px] md:h-[100px] rounded-lg'>
            <Image src={data.imageUrl && `/uploads/` + data.imageUrl || "/images/mockhead.jpg"} alt='Image' width={300} height={250} className='w-[100px] md:w-[300px] h-full rounded-l-lg' />
            <div className='w-full flex gap-5 md:gap-2 justify-between items-center p-2 md:p-5'>
                <h1 className='font-semibold text-md sm:text-lg md:text-2xl w-[20vw] text-nowrap overflow-hidden'>{data.title}</h1>
                <div className='flex flex-col'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className='hover:cursor-default'><p className='flex items-center gap-2 text-sm text-gray-600'><BsFillPeopleFill />{data.bookedSeats}</p></TooltipTrigger>
                            <TooltipContent>
                                <p>{data.bookedSeats} attendees!</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className='hover:cursor-default'><p className='flex items-center gap-2 text-sm text-gray-600'><IoTicket />{data.availableSeats}</p></TooltipTrigger>
                            <TooltipContent>
                                <p>{data.availableSeats} tickets left!</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <Link href={`/events/edit/${data._id}`} className={cn(buttonVariants({ size: "lg" }), "bg-[#24AE7C] hover:bg-[#329c75] font-bold")}>Edit</Link>
            </div>
        </div>
    )
}

export default EventCard;