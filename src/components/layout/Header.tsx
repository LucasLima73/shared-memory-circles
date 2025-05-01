
import { useState } from "react";
import { Bell, Menu, MessageSquare, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X /> : <Menu />}
            </Button>
          )}
          <a href="/" className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-memories-purple to-memories-dark-purple bg-clip-text text-xl font-bold text-transparent md:text-2xl font-display">
              Memories
            </span>
          </a>
        </div>

        <div className="hidden md:flex md:flex-1 md:justify-center md:px-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar memórias, grupos ou amigos..."
              className="w-full bg-muted pl-8 md:w-80 lg:w-96"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-memories-purple hover:bg-memories-dark-purple" size="icon">
                <Plus className="h-5 w-5" />
                <span className="sr-only">Nova memória</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <div className="p-4">
                <h2 className="mb-4 text-xl font-bold">Criar nova memória</h2>
                <p className="text-muted-foreground">
                  Adicione fotos, vídeos e texto para compartilhar um momento especial.
                </p>
                <div className="mt-6 flex justify-end">
                  <Button className="bg-memories-purple hover:bg-memories-dark-purple">
                    Criar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            <span className="sr-only">Notificações</span>
          </Button>

          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Mensagens</span>
          </Button>

          <Avatar className="h-8 w-8 border">
            <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {isMobile && showMobileMenu && (
        <div className="border-b bg-white p-4 animate-slide-in">
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="w-full pl-8"
              />
            </div>
            <Button variant="ghost" className="justify-start">Meu Perfil</Button>
            <Button variant="ghost" className="justify-start">Meus Grupos</Button>
            <Button variant="ghost" className="justify-start">Configurações</Button>
          </div>
        </div>
      )}
    </header>
  );
}
