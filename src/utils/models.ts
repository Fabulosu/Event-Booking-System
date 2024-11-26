import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
    role: { type: String, enum: ["user", "organizer", "admin"], default: "user" },
    public_email: { type: Boolean, required: true, default: false },
    public_profile: { type: Boolean, required: true, default: true },
    profilePicture: { type: String },
    refreshTokens: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
});

const eventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // e.g., Music, Sports, Tech
    address: { type: String, required: true },
    city: { type: String, required: true },
    date: { type: Date, required: true },
    availableSeats: { type: Number, required: true },
    bookedSeats: { type: Number, default: 0 },
    price: { type: Number, default: 0 }, // Optional, for paid events
    organizer: { type: Schema.Types.ObjectId, ref: "User" },
    imageUrl: { type: String, required: true },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    createdAt: { type: Date, default: Date.now },
});

const bookingSchema = new Schema({
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookingDate: { type: Date, default: Date.now },
    numberOfSeats: { type: Number, required: true },
    totalPrice: { type: Number },
    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
    paymentStatus: { type: String, enum: ["paid", "pending"], default: "pending" },
});

const calendarSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    googleCalendarId: { type: String },
    appleCalendarId: { type: String },
    eventsSynced: [{ type: Schema.Types.ObjectId, ref: "Event" }],
});

const paymentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["credit_card", "paypal", "stripe"], required: true },
    status: { type: String, enum: ["success", "failed"], required: true },
    transactionId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
});

const reviewSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    reviewText: { type: String },
    rating: { type: Number, min: 1, max: 5, required: true },
    createdAt: { type: Date, default: Date.now },
});

const notificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["booking", "payment", "reminder"], required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const activityLogSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    details: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const UserModel = models.User || model("User", userSchema);
const EventModel = models.Event || model("Event", eventSchema);
const BookingModel = models.Booking || model("Booking", bookingSchema);
const CalendarModel = models.Calendar || model("Calendar", calendarSchema);
const PaymentModel = models.Payment || model("Payment", paymentSchema);
const ReviewModel = models.Review || model("Review", reviewSchema);
const NotificationModel = models.Notification || model("Notification", notificationSchema);
const ActivityLogModel = models.ActivityLog || model("ActivityLog", activityLogSchema);

export {
    UserModel,
    EventModel,
    BookingModel,
    CalendarModel,
    PaymentModel,
    ReviewModel,
    NotificationModel,
    ActivityLogModel,
};