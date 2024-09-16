import { connect } from 'mongoose';

export async function dbConnect() {
    try {
        await connect(process.env.MONGO_URI || '');
    } catch (error) {
        console.error('[INFO] Database connection error: ' + error);
    }
}