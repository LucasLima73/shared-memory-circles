
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-memories-light-purple py-16 md:py-24">
      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12 lg:grid-cols-[1fr_500px]">
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="block">Eternize seus</span>
              <span className="bg-gradient-to-r from-memories-purple to-memories-dark-purple bg-clip-text text-transparent">
                momentos especiais
              </span>
            </h1>
            <p className="mt-4 max-w-[600px] text-lg text-muted-foreground md:text-xl">
              Crie, compartilhe e reviva suas memórias mais preciosas com amigos,
              família e comunidades em uma plataforma feita para guardar momentos.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                className="rounded-full bg-memories-purple px-6 py-2 text-lg hover:bg-memories-dark-purple"
              >
                Comece Agora
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-memories-purple px-6 py-2 text-lg text-memories-purple hover:bg-memories-light-purple"
              >
                Saiba Mais
              </Button>
            </div>
          </div>
          <div className="relative hidden h-full md:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=350&fit=crop"
                    alt="Friends enjoying time together"
                    className="h-40 w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1522673607200-164d1b3ce551?w=500&h=350&fit=crop"
                    alt="Family gathering"
                    className="h-64 w-full object-cover"
                  />
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1496275068113-fff8c90750d1?w=500&h=350&fit=crop"
                    alt="Wedding celebration"
                    className="h-64 w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1528495612343-9ca9f4a9f67c?w=500&h=350&fit=crop"
                    alt="Birthday celebration"
                    className="h-40 w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
