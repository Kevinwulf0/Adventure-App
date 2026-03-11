import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Portrait({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn("relative w-full aspect-square max-w-[320px] mx-auto", className)}>
      {/* Ornate Frame Base */}
      <div className="absolute inset-0 bg-card rounded-sm shadow-2xl flex items-center justify-center z-0 overflow-hidden">
        {isLoading && (
          <div className="flex flex-col items-center justify-center text-primary/50 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin" />
            <span className="font-display text-sm tracking-widest">Conjuring Vision...</span>
          </div>
        )}
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-1000",
            isLoading ? "opacity-0" : "opacity-100"
          )}
        />
        {/* Dark vignette over image */}
        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] pointer-events-none" />
      </div>

      {/* Frame Overlay Image */}
      <img 
        src={`${import.meta.env.BASE_URL}images/ornate-border.png`}
        className="absolute inset-[-6%] w-[112%] h-[112%] z-10 pointer-events-none drop-shadow-xl"
        alt=""
        style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }}
      />
    </div>
  );
}
