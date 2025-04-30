
import { Heart, MessageSquare, Share } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MemoryCardProps {
  memory: {
    id: string;
    title: string;
    image: string;
    author: {
      name: string;
      avatar: string;
    };
    group?: {
      name: string;
    };
    date: string;
    likes: number;
    comments: number;
  };
  className?: string;
}

export default function MemoryCard({ memory, className }: MemoryCardProps) {
  return (
    <div className={cn("memory-card", className)}>
      <div className="relative">
        <img
          src={memory.image}
          alt={memory.title}
          className="memory-card-image"
        />
        <div className="memory-card-overlay">
          <h3 className="text-lg font-medium">{memory.title}</h3>
          {memory.group && (
            <p className="text-sm text-white/80">Em {memory.group.name}</p>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={memory.author.avatar} />
              <AvatarFallback>{memory.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{memory.author.name}</p>
              <p className="text-xs text-muted-foreground">{memory.date}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" className="flex gap-1">
            <Heart className="h-4 w-4" />
            <span>{memory.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{memory.comments}</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
