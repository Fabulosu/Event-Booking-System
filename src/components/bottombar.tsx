"use client";
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { IoLocationOutline } from 'react-icons/io5';
import { Separator } from './ui/separator';
import { FaRegCalendar, FaRegClock } from 'react-icons/fa';
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';

interface Props {
    price?: number;
    eventId?: string;
}

interface Event {
    _id: string;
    title: string;
    location: string;
    date: string;
    price: number;
    description: string;
    organizer: {
        username: string;
    };
}

const BottomBar: React.FC<Props> = ({ price = 0, eventId }) => {
    const { data: session } = useSession();
    const [event, setEvent] = useState<Event | null>(null);
    const [ticketsToBuy, setTicketsToBuy] = useState(0);

    useEffect(() => {
        if (eventId) {
            const fetchEvent = async () => {
                try {
                    const response = await axios.get(`/api/events/${eventId}`);
                    setEvent(response.data);
                } catch (err) {
                    console.log(err);
                }
            };

            fetchEvent();
        }
    }, [eventId]);

    const handleCheckout = async () => {

        const stripe = await loadStripe(
            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
        );
        if (!stripe) {
            return;
        }

        try {
            console.log(session)
            const response = await axios.post('/api/checkout', {
                amount: price,
                quantity: ticketsToBuy,
                eventName: event?.title,
                userId: session?.user.id,
                eventId: event?._id,
            });

            if (response.status === 200) {
                await stripe.redirectToCheckout({
                    sessionId: response.data.id
                });
            } else {
                console.error('Failed to create checkout session');
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
        }
    };

    return (
        <div className='flex fixed z-50 bottom-0 px-12 justify-between items-center w-screen h-[80px] bg-white shadow-inner shadow-neutral-400'>
            <p className="font-bold text-2xl">{price === 0 ? "FREE" : `$${price}`}</p>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='bg-[#24AE7C] hover:bg-[#329c75] text-white scale-110'>Purchase Ticket</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle className='font-bold text-2xl'>{event?.title}</DialogTitle>
                        <DialogDescription className='flex flex-col gap-2'>
                            <div className='flex flex-row gap-2 items-center'>
                                <IoLocationOutline className="text-[#24AE7C]" />
                                {event?.location}
                            </div>
                            <div className='flex flex-row gap-2 items-center'>
                                <FaRegCalendar className="text-[#24AE7C]" />
                                {event && new Date(event?.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </div>
                            <div className='flex flex-row gap-2 items-center'>
                                <FaRegClock className="text-[#24AE7C]" />
                                {event && new Date(event?.date).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                })}
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <Separator orientation='horizontal' className='w-full bg-gray-600' />
                    <div className='w-full h-full flex justify-between py-4 shadow-xl'>
                        <div className='flex flex-col justify-center'>
                            <p className='text-sm font-semibold'>{event?.title}</p>
                            <p className='font-bold text-[#24AE7C]'>{price === 0 ? "FREE" : `$${price}`}</p>
                        </div>
                        <div className='flex flex-row gap-2 items-center'>
                            <Button
                                variant="ghost"
                                onClick={() => setTicketsToBuy((prev) => Math.max(0, prev - 1))}
                                className={ticketsToBuy === 0 ? "text-gray-600" : ""}
                                disabled={ticketsToBuy === 0}
                            >
                                <CiCircleMinus size={30} />
                            </Button>
                            <p className='text-xl'>{ticketsToBuy}</p>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    if (price === 0 && ticketsToBuy < 1) {
                                        setTicketsToBuy(ticketsToBuy + 1);
                                    } else if (price > 0 && ticketsToBuy < 10) {
                                        setTicketsToBuy(ticketsToBuy + 1);
                                    }
                                }}
                                className={
                                    (price === 0 && ticketsToBuy >= 1) || (price > 0 && ticketsToBuy >= 10)
                                        ? "text-gray-600"
                                        : ""
                                }
                                disabled={
                                    (price === 0 && ticketsToBuy >= 1) || (price > 0 && ticketsToBuy >= 10)
                                }
                            >
                                <CiCirclePlus size={30} />
                            </Button>
                        </div>
                    </div>

                    <DialogFooter className='w-full'>
                        <div className='w-full flex justify-between'>
                            <div>
                                <p className='font-bold text-xl'>{`$${price && (price * ticketsToBuy).toFixed(2)}`}</p>
                                <p className='text-xs text-gray-600'>{`${ticketsToBuy}x Ticket`}</p>
                            </div>

                            <DialogTrigger asChild className='h-full'>
                                <Button type="submit" onClick={handleCheckout} disabled={ticketsToBuy === 0} className='h-full bg-[#24AE7C] hover:bg-[#329c75]'>Continue</Button>
                            </DialogTrigger>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default BottomBar;