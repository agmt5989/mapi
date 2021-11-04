import { IPortalUser } from 'api/models/portalUser';
export declare function sleep(ms: number): Promise<unknown>;
export declare const timestamps: {
    createdAt: string;
    updatedAt: string;
};
export declare const generateJWT: (user: IPortalUser) => string;
export declare function generateRandomString(length: number | undefined, type: 'numbers' | 'characters'): string;
