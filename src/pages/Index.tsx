
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import MemoryCard from "@/components/memories/MemoryCard";
import GroupCard from "@/components/groups/GroupCard";

// Sample data for memories
const featuredMemories = [
  {
    id: "1",
    title: "Viagem à praia - Ano Novo 2024",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    author: {
      name: "Ana Silva",
      avatar: "https://i.pravatar.cc/150?img=29",
    },
    group: {
      name: "Família Silva",
    },
    date: "01/01/2024",
    likes: 24,
    comments: 5,
  },
  {
    id: "2",
    title: "Formatura Universidade Federal",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
    author: {
      name: "Carlos Mendes",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    date: "15/12/2023",
    likes: 56,
    comments: 12,
  },
  {
    id: "3",
    title: "Aniversário de 30 anos",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop",
    author: {
      name: "Paula Costa",
      avatar: "https://i.pravatar.cc/150?img=24",
    },
    date: "05/03/2024",
    likes: 42,
    comments: 8,
  },
  {
    id: "4",
    title: "Confraternização da empresa",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=600&fit=crop",
    author: {
      name: "Marcos Oliveira",
      avatar: "https://i.pravatar.cc/150?img=15",
    },
    group: {
      name: "Empresa ABC",
    },
    date: "22/12/2023",
    likes: 18,
    comments: 3,
  },
];

// Sample data for groups
const featuredGroups = [
  {
    id: "1",
    name: "Turma de Formandos 2023",
    description: "Grupo para compartilhar memórias da nossa jornada acadêmica.",
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800&h=500&fit=crop",
    members: 34,
    isPrivate: false,
  },
  {
    id: "2",
    name: "Casamento João & Maria",
    description: "Compartilhe fotos e vídeos do grande dia!",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=500&fit=crop",
    members: 86,
    isPrivate: true,
  },
  {
    id: "3",
    name: "Viagem Europa 2023",
    description: "Memórias da nossa viagem inesquecível pelo velho continente.",
    image: "https://images.unsplash.com/photo-1493707553966-283afac8c358?w=800&h=500&fit=crop",
    members: 12,
    isPrivate: true,
  },
];

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-muted/30">
          <HeroSection />

          <FeaturedSection
            title="Memórias em Destaque"
            description="Momentos especiais compartilhados recentemente"
            actionLabel="Ver todas"
            actionHref="#"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredMemories.map((memory) => (
                <MemoryCard key={memory.id} memory={memory} />
              ))}
            </div>
          </FeaturedSection>

          <FeaturedSection
            title="Grupos Populares"
            description="Encontre comunidades para compartilhar suas memórias"
            actionLabel="Explorar grupos"
            actionHref="#"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          </FeaturedSection>

          <div className="bg-memories-light-purple py-16">
            <div className="container px-4 text-center md:px-6">
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Crie seu próprio espaço de memórias
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Perfeito para escolas, empresas, eventos ou qualquer grupo que
                queira preservar momentos juntos. Personalize sua experiência
                com recursos exclusivos.
              </p>
              <div className="mt-8 flex justify-center">
                <button className="rounded-full bg-memories-purple px-6 py-3 text-white hover:bg-memories-dark-purple">
                  Criar um grupo
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
