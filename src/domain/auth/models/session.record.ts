import { UserRecord } from "../../user/models/user.record";

export interface SessionRecord {
    id: string;
    token: string;
    expiresAt: Date;
    isRevoked: boolean;
    userAgent: string | null;
    ipAddress: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    user: UserRecord
}