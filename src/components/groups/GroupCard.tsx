
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    description: string;
    image: string;
    members: number;
    isPrivate: boolean;
  };
  className?: string;
}

export default function GroupCard({ group, className }: GroupCardProps) {
  return (
    <div
      className={cn(
        "group rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
        <img
          src={group.image}
          alt={group.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {group.isPrivate && (
          <div className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
            Privado
          </div>
        )}
      </div>
      <h3 className="font-display text-lg font-medium">{group.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex -space-x-2">
          {[...Array(Math.min(3, group.members))].map((_, i) => (
            <Avatar key={i} className="border-2 border-white">
              <AvatarImage src={`https://i.pravatar.cc/32?img=${i + 10}`} />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
          ))}
          {group.members > 3 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-muted text-xs">
              +{group.members - 3}
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-memories-purple text-memories-purple hover:bg-memories-light-purple"
        >
          Entrar
        </Button>
      </div>
    </div>
  );
}
