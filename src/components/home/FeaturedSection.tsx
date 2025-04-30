
import { Button } from "@/components/ui/button";

interface FeaturedSectionProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  children: React.ReactNode;
}

export default function FeaturedSection({
  title,
  description,
  actionLabel,
  actionHref,
  children,
}: FeaturedSectionProps) {
  return (
    <div className="py-8">
      <div className="container px-4 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">{title}</h2>
            {description && (
              <p className="mt-1 text-muted-foreground">{description}</p>
            )}
          </div>
          {actionLabel && (
            <Button
              variant="ghost"
              className="text-memories-purple hover:text-memories-dark-purple hover:bg-memories-light-purple/50"
              asChild
            >
              <a href={actionHref || "#"}>{actionLabel}</a>
            </Button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
