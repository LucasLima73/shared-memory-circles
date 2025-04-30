
import { HomeIcon, Users, Calendar, Bookmark, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "hidden md:flex h-screen w-64 flex-col border-r bg-white p-4",
        className
      )}
    >
      <div className="flex flex-1 flex-col gap-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 font-medium"
          >
            <HomeIcon className="h-5 w-5" />
            Página Inicial
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 font-medium"
          >
            <Bookmark className="h-5 w-5" />
            Minhas Memórias
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 font-medium"
          >
            <Users className="h-5 w-5" />
            Grupos e Comunidades
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 font-medium"
          >
            <Calendar className="h-5 w-5" />
            Eventos
          </Button>
        </div>

        <div className="mt-6">
          <h3 className="mb-2 px-4 text-sm font-medium text-muted-foreground">
            Meus Grupos
          </h3>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-memories-light-purple text-memories-purple">
                F
              </div>
              Família Silva
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-memories-blue text-blue-700">
                T
              </div>
              Turma 2023
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-memories-pink text-pink-700">
                E
              </div>
              Empresa ABC
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-memories-purple"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-memories-purple">
                +
              </div>
              Criar novo grupo
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Settings className="h-5 w-5" />
          Configurações
        </Button>
      </div>
    </aside>
  );
}
