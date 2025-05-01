import { useState } from "react";
import { Bell, Menu, MessageSquare, Plus, Search, X, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateGroupForm } from "@/components/groups/CreateGroupForm";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

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
              <DialogHeader>
                <DialogTitle>Criar novo grupo</DialogTitle>
                <DialogDescription>
                  Crie um novo grupo para compartilhar memórias com amigos e familiares.
                </DialogDescription>
              </DialogHeader>
              <div className="p-4">
                <CreateGroupForm />
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  signOut();
                  navigate('/');
                }}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
