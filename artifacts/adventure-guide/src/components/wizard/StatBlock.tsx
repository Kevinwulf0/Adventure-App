import { formatModifier } from '@/lib/dnd-engine';
import { cn } from '@/lib/utils';

interface StatBlockProps {
  label: string;
  score: number;
  modifier: number;
  className?: string;
}

export function StatBlock({ label, score, modifier, className }: StatBlockProps) {
  return (
    <div className={cn(
      "relative flex flex-col items-center justify-center p-3 rounded-xl",
      "bg-card border border-primary/20 shadow-md",
      "before:absolute before:inset-0 before:rounded-xl before:border before:border-primary/10 before:scale-[0.96]",
      className
    )}>
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-display font-bold text-foreground text-glow">{score}</span>
        <div className="absolute -bottom-3 bg-background border border-primary/30 px-3 py-0.5 rounded-full shadow-sm text-primary font-bold text-sm">
          {formatModifier(modifier)}
        </div>
      </div>
    </div>
  );
}
