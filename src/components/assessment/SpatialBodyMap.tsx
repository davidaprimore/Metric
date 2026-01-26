import React from 'react';
import { cn } from '@/lib/utils';
import { Rotate3d } from 'lucide-react';

interface SpatialBodyMapProps {
    gender: 'male' | 'female';
    onSelectZone: (zoneId: string, side?: 'left' | 'right') => void;
    highlightedZones?: string[];
    mode?: 'skin' | 'perimeter';
}

// ZONES MAPPED TO USER PROVIDED IMAGE (Red Highlights)
// The image shows Front View with biceps pose.
// Red Areas: Triceps (Back of arm), Chest, Abdomen, Side (Oblique/Supra), Thigh (Front), Mid-Back/Lat? (Hard to see without image but assuming standard points).
// Since the image is 2D and static, we map the zones relative to this specific image frame.

const ZONES_MALE = [
    // --- SKINFOLDS (Pollock 7) ---
    // 1. Chest (Peitoral): Mid-chest, diagonal fold.
    { id: 'chest', name: 'Peitoral', top: 25, left: 28, w: 14, h: 8 },
    // 2. Abdomen: Vertical fold, right of umbilicus.
    { id: 'abdomen', name: 'Abdomen', top: 48, left: 45, w: 10, h: 14 },
    // 3. Suprailiac: Diagonal, above crest.
    { id: 'suprailiac_right', name: 'Supra-ilíaca', top: 52, left: 28, w: 10, h: 8 },
    // 4. Thigh: Vertical, mid-thigh.
    { id: 'thigh_right', name: 'Coxa', top: 62, left: 32, w: 12, h: 18 },
    // 5. Axilla (Axilar Média): Vertical, mid-axillary line.
    { id: 'axilla', name: 'Axilar Média', top: 32, left: 25, w: 8, h: 8 },
    // 6. Triceps: Back of arm. (Visible in double bicep pose? Maybe the red patch under the arm?)
    // In "Double Biceps" pose, triceps is the bottom curve.
    { id: 'triceps_right', name: 'Tríceps', top: 28, left: 75, w: 10, h: 10 },
    // 7. Subscapular: Back. (Hard to see on Front Pose). Map near Lats/Ribs?
    // Assume user image might have it or we approximate.
    { id: 'subscapular', name: 'Subescapular', top: 35, left: 70, w: 10, h: 10 },

    // --- PERIMETERS (Should/Arms/etc) ---
    { id: 'neck', name: 'Pescoço', top: 12, left: 42, w: 16, h: 6 },
    { id: 'arm_right', name: 'Braço', top: 25, left: 78, w: 12, h: 15 }, // Bicep peak
];

const ZONES_FEMALE = [
    // Mapped similar to male but adjusted for female anatomy image (usually slimmer waist, different chest).
    { id: 'chest', name: 'Peitoral', top: 25, left: 28, w: 14, h: 8 },
    { id: 'abdomen', name: 'Abdomen', top: 50, left: 45, w: 10, h: 12 },
    { id: 'suprailiac_right', name: 'Supra-ilíaca', top: 54, left: 28, w: 10, h: 8 },
    { id: 'thigh_right', name: 'Coxa', top: 65, left: 32, w: 12, h: 18 },
    { id: 'triceps_right', name: 'Tríceps', top: 28, left: 78, w: 10, h: 10 },
    { id: 'axilla', name: 'Axilar Média', top: 32, left: 24, w: 8, h: 8 },
    { id: 'subscapular', name: 'Subescapular', top: 35, left: 70, w: 10, h: 10 },
];

export const SpatialBodyMap: React.FC<SpatialBodyMapProps> = ({ gender, onSelectZone, highlightedZones = [] }) => {

    // Select Zones based on Gender
    const zones = gender === 'female' ? ZONES_FEMALE : ZONES_MALE;
    const imgSrc = gender === 'female' ? '/assets/anatomy_female.png' : '/assets/anatomy_male.png';

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center bg-transparent">

            {/* BASE IMAGE */}
            <div className="relative w-full h-full flex items-center justify-center">
                <img
                    src={imgSrc}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://placehold.co/400x700/transparent/D4AF37?text=Adicione+/assets/anatomy_" + gender + ".png";
                    }}
                    className="h-[95%] object-contain drop-shadow-2xl transition-opacity duration-500"
                    alt={`Body Map ${gender}`}
                />

                {/* OVERLAY ZONES */}
                {zones.map((zone) => {
                    const isSelected = highlightedZones.includes(zone.id);

                    return (
                        <div
                            key={zone.id}
                            onClick={() => onSelectZone(zone.id)}
                            className={cn(
                                "absolute cursor-pointer transition-all duration-300 rounded-full",
                                isSelected
                                    ? "bg-[#D4AF37]/40 border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.8)]"
                                    : "bg-transparent hover:bg-white/10"
                            )}
                            style={{
                                top: `${zone.top}%`,
                                left: `${zone.left}%`,
                                width: `${zone.w}%`,
                                height: `${zone.h}%`,
                            }}
                        >
                            {/* Label on Active */}
                            {isSelected && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/90 text-[#D4AF37] text-[10px] font-black uppercase px-2 py-1 rounded border border-[#D4AF37] whitespace-nowrap z-10 shadow-xl">
                                    {zone.name}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

        </div>
    );
};
