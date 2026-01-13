import React from 'react';

interface DefaultAvatarProps {
    gender?: string;
    className?: string;
}

export const DefaultAvatar: React.FC<DefaultAvatarProps> = ({ gender, className }) => {
    const isFemale = gender?.toLowerCase() === 'feminino';

    // Male Avatar (Brown hair, Blue shirt)
    const MaleSVG = (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle cx="50" cy="50" r="50" fill="#E5E7EB" />
            {/* Body/Shirt */}
            <path d="M50 95C70 95 85 82 88 65C88 55 75 45 50 45C25 45 12 55 12 65C15 82 30 95 50 95Z" fill="#3B82F6" />
            {/* Neck */}
            <rect x="44" y="40" width="12" height="10" fill="#FDE6D2" />
            {/* Face */}
            <circle cx="50" cy="35" r="22" fill="#FDE6D2" />
            {/* Hair */}
            <path d="M28 35C28 23 38 13 50 13C62 13 72 23 72 35V38H28V35Z" fill="#78350F" />
        </svg>
    );

    // Female Avatar (Long Brown hair, Pink shirt)
    const FemaleSVG = (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle cx="50" cy="50" r="50" fill="#E5E7EB" />
            {/* Hair Back */}
            <path d="M25 35C25 21 36 10 50 10C64 10 75 21 75 35V65H25V35Z" fill="#78350F" />
            {/* Body/Shirt */}
            <path d="M50 95C70 95 85 82 88 65C88 55 75 45 50 45C25 45 12 55 12 65C15 82 30 95 50 95Z" fill="#EC4899" />
            {/* Neck */}
            <rect x="44" y="40" width="12" height="10" fill="#FDE6D2" />
            {/* Face */}
            <circle cx="50" cy="35" r="18" fill="#FDE6D2" />
            {/* Hair Front/Bangs */}
            <path d="M32 25C32 25 40 18 50 18C60 18 68 25 68 25" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
        </svg>
    );

    return isFemale ? FemaleSVG : MaleSVG;
};
