import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/Button';
import { X, ZoomIn, ZoomOut, Check } from 'lucide-react';

interface ImageCropperProps {
    image: string;
    onCropComplete: (croppedImage: Blob) => void;
    onCancel: () => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<Blob> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(blob);
            }, 'image/jpeg');
        });
    };

    const handleFinish = async () => {
        try {
            const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
            onCropComplete(croppedBlob);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
            <div className="p-4 flex justify-between items-center bg-black/50 backdrop-blur-md absolute top-0 left-0 right-0 z-10">
                <button onClick={onCancel} className="text-white p-2">
                    <X size={24} />
                </button>
                <h2 className="text-white font-bold">Editar Foto</h2>
                <button onClick={handleFinish} className="text-secondary p-2 font-bold flex items-center gap-2">
                    Concluir <Check size={20} />
                </button>
            </div>

            <div className="flex-1 relative bg-dark">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={onCropChange}
                    onCropComplete={onCropCompleteInternal}
                    onZoomChange={setZoom}
                    cropShape="round"
                    showGrid={false}
                />
            </div>

            <div className="p-8 bg-black/50 backdrop-blur-md absolute bottom-0 left-0 right-0">
                <div className="flex items-center gap-4 max-w-sm mx-auto">
                    <ZoomOut className="text-white/50" size={20} />
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="flex-1 h-1.5 bg-white/20 rounded-full appearance-none accent-secondary"
                    />
                    <ZoomIn className="text-white/50" size={20} />
                </div>
            </div>
        </div>
    );
};
