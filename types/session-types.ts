export interface SessionType {
    session: {
        user: {
            email: string;
            image: string | null;
            id: string;
            role: string;
        };
        expires: string;
    };
}
