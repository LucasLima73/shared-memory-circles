import { useEffect, useState } from "react";
import FeaturedSection from "@/components/home/FeaturedSection";
import MemoryCard from "@/components/memories/MemoryCard";
import GroupCard from "@/components/groups/GroupCard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase"; // ajuste conforme seu caminho real

const Dashboard = () => {
  const { user } = useAuth();

  const [groups, setGroups] = useState<any[]>([]); // use tipagem se tiver
  const [loadingGroups, setLoadingGroups] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      const { data, error } = await supabase.from("groups").select("*");

      if (error) {
        console.error("Erro ao buscar grupos:", error.message);
      } else {
        setGroups(data);
      }

      setLoadingGroups(false);
    };

    fetchGroups();
  }, []);

  const featuredMemories = [
    {
      id: "1",
      title: "Viagem à praia - Ano Novo 2024",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
      author: { name: "Ana Silva", avatar: "https://i.pravatar.cc/150?img=29" },
      group: { name: "Família Silva" },
      date: "01/01/2024",
      likes: 24,
      comments: 5,
    },
    {
      id: "2",
      title: "Formatura Universidade Federal",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
      author: { name: "Carlos Mendes", avatar: "https://i.pravatar.cc/150?img=12" },
      date: "15/12/2023",
      likes: 56,
      comments: 12,
    },
  ];

  return (
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
          {!loadingGroups && groups.map((group) => (
            <GroupCard
              key={group.id}
              group={{
                id: group.id,
                name: group.name,
                description: group.description,
                image: group.image_url, // ou placeholder se estiver vazio
                members: 0, // coloque real se você buscar membros depois
                isPrivate: group.is_private,
              }}
            />
          ))}
        </div>
      </FeaturedSection>
    </div>
  );
};

export default Dashboard;
