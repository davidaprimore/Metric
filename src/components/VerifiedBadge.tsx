export function VerifiedBadge() {
    return (
        <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full ml-1 relative" title="Profissional Verificado">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span className="absolute inset-0 rounded-full animate-[pulse-badge_2s_infinite]"></span>
        </span>
    );
}
