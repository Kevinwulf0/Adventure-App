import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center text-center p-8">
      <div className="max-w-md w-full glass-panel p-8 rounded-2xl">
        <h1 className="text-6xl font-display font-bold text-destructive mb-4">404</h1>
        <h2 className="text-2xl font-display text-primary mb-6">Uncharted Territory</h2>
        <p className="text-muted-foreground font-serif text-lg mb-8">
          The path you seek is obscured by fog and shadow. It exists not in these lands.
        </p>
        <Link href="/">
          <Button className="w-full">Return to the Forge</Button>
        </Link>
      </div>
    </div>
  );
}
