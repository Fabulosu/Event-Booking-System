import Stripe from 'stripe';
import { dbConnect } from '@/utils/database';
import { PaymentModel, BookingModel, EventModel, UserModel } from '@/utils/models';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature || Array.isArray(signature)) {
        console.error('Missing or invalid Stripe signature header');
        return NextResponse.json('Missing or invalid Stripe signature header', { status: 400 });
    }

    let event;

    try {
        const rawBody = await req.text();

        event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (err) {
        console.error(`Webhook signature verification failed: ${(err as Error).message}`);
        return NextResponse.json(`Webhook Error: ${(err as Error).message}`, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.metadata && session.amount_total !== null) {
            await dbConnect();

            try {
                const payment = new PaymentModel({
                    user: session.metadata.userId,
                    event: session.metadata.eventId,
                    amount: session.amount_total / 100,
                    paymentMethod: 'stripe',
                    status: 'success',
                    transactionId: session.id,
                });
                await payment.save();

                const booking = new BookingModel({
                    event: session.metadata.eventId,
                    user: session.metadata.userId,
                    numberOfSeats: session.metadata.quantity,
                    totalPrice: session.amount_total / 100,
                    paymentStatus: 'paid',
                });
                await booking.save();

                await EventModel.findByIdAndUpdate(
                    session.metadata.eventId,
                    { $inc: { bookedSeats: session.metadata.quantity } },
                    { new: true }
                );

                const event = await EventModel.findById(session.metadata.eventId);

                await UserModel.findByIdAndUpdate(
                    event.organizer,
                    { $inc: { balance: session.amount_total / 100 } },
                    { new: true }
                );

            } catch (error) {
                console.error('Failed to save payment or booking:', error);
                return NextResponse.json('Failed to save payment or booking', { status: 500 });
            }
        } else {
            console.error('Missing metadata or amount_total in session');
            return NextResponse.json('Invalid Session Data', { status: 400 });
        }
    }

    return NextResponse.json({ received: true });
}