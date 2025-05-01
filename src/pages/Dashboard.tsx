import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import FeaturedSection from "@/components/home/FeaturedSection";
import MemoryCard from "@/components/memories/MemoryCard";
import GroupCard from "@/components/groups/GroupCard";
import { useAuth } from "@/contexts/AuthContext";

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
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-muted/30">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Bem-vindo, {user?.email}</h1>
            
            <FeaturedSection
              title="Suas Memórias Recentes"
              description="Momentos especiais compartilhados recentemente"
              actionLabel="Ver todas"
              actionHref="/memories"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {featuredMemories.map((memory) => (
                  <MemoryCard key={memory.id} memory={memory} />
                ))}
              </div>
            </FeaturedSection>

            <FeaturedSection
              title="Seus Grupos"
              description="Grupos que você participa"
              actionLabel="Ver todos"
              actionHref="/groups"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {featuredGroups.map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            </FeaturedSection>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
