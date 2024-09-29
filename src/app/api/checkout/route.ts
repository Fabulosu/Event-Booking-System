import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-06-20',
});

interface CheckoutSessionBody {
    amount: number;
    quantity: number;
    eventName: string;
    userId: string;
    eventId: string;
}

export async function POST(req: NextRequest) {
    try {
        const { amount, quantity, eventName, userId, eventId }: CheckoutSessionBody = await req.json();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Event Ticket - ${eventName}`,
                        },
                        unit_amount: amount * 100,
                    },
                    quantity,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/cancel`,
            metadata: {
                userId: userId,
                eventId: eventId,
                quantity,
            },
        });
        console.log(session)
        return NextResponse.json({ id: session.id }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }
}