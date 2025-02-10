import 'express-session';
import { ObjectId } from 'mongoose';

declare module 'express-session' {
    interface SessionData {
        user?: string | null;
        admin?: boolean;
    }
}