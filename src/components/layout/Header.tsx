import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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

        <div className="flex items-center gap-3">
          <a href="/login">
            <Button variant="ghost">Entrar</Button>
          </a>
          <a href="/register">
            <Button className="bg-memories-purple hover:bg-memories-dark-purple">
              Criar Conta
            </Button>
          </a>
        </div>
      </div>

      {isMobile && showMobileMenu && (
        <div className="border-b bg-white p-4 animate-slide-in">
          <div className="flex flex-col space-y-4">
            <a href="/login">
              <Button variant="ghost" className="justify-start">Entrar</Button>
            </a>
            <a href="/register">
              <Button variant="ghost" className="justify-start">Criar Conta</Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}