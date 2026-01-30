export interface ProfessionalData {
    id: string;
    name: string;
    specialty: string;
    crm: string;
    avatar: string;
    coverImage: string;
    rating: number;
    reviewsCount: number;
    location: string;
    distance: string;
    nextAvailable: string;
    bio: string;
    languages: string[];
    education: Array<{
        degree: string;
        school: string;
        year: string;
    }>;
    certifications: string[];
    services: Array<{
        id: number;
        name: string;
        duration: string;
        price: number;
        isPopular: boolean;
        description: string;
    }>;
    stats: {
        patients: number;
        sessions: number;
        experience: string;
    };
}
