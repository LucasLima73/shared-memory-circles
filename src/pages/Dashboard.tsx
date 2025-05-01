import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeaturedSection from "@/components/home/FeaturedSection";
import MemoryCard from "@/components/memories/MemoryCard";
import GroupCard from "@/components/groups/GroupCard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);
  const [publicGroups, setPublicGroups] = useState<any[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingPublic, setLoadingPublic] = useState(true);
  const [groupMemberCounts, setGroupMemberCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user?.id) return;

      // Busca os grupos criados pelo usuário
      const { data: createdGroups, error: createdGroupsError } = await supabase
      .from("groups")
      .select("*")
      .eq("created_by", user.id);

    if (createdGroupsError) {
      console.error("Erro ao buscar grupos do usuário:", createdGroupsError.message);
    } else {
      setGroups(createdGroups);
    }
    setLoadingGroups(false);

    // Busca os grupos onde o usuário é membro
    const { data: memberships, error: membershipsError } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", user.id);

    if (membershipsError) {
      console.error("Erro ao buscar grupos que o usuário participa:", membershipsError.message);
    } else if (memberships && memberships.length > 0) {
      const groupIds = memberships.map(m => m.group_id);

      // Busca os detalhes dos grupos
      const { data: memberGroups, error: memberGroupsError } = await supabase
        .from("groups")
        .select("*")
        .in("id", groupIds);

      if (memberGroupsError) {
        console.error("Erro ao buscar detalhes dos grupos:", memberGroupsError.message);
      } else {
        // Junte os grupos criados e os que participa (removendo duplicados)
        const allGroups = [
          ...(createdGroups || []),
          ...(memberGroups || [])
        ].filter((group, index, self) =>
          index === self.findIndex(g => g.id === group.id)
        );
        setGroups(allGroups);
      }
    }
  };

  const fetchPublicGroups = async () => {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("is_private", false)
      .limit(6);

    if (error) console.error("Erro ao buscar grupos públicos:", error.message);
    else setPublicGroups(data);
    setLoadingPublic(false);
  };

  fetchGroups();
  fetchPublicGroups();
}, [user?.id]);

// Função para buscar o número de membros de um grupo
const fetchGroupMembersCount = async (groupId: string) => {
  const { count, error } = await supabase
    .from("group_members")
    .select("*", { count: "exact", head: true })
    .eq("group_id", groupId);
  
  if (error) {
    console.error("Erro ao buscar número de membros:", error.message);
    return 0;
  }
  
  return count || 0;
};

// Buscar número de membros para todos os grupos
useEffect(() => {
  const fetchAllMemberCounts = async () => {
    const allGroups = [...groups, ...publicGroups];
    const uniqueGroups = allGroups.filter((group, index, self) => 
      index === self.findIndex(g => g.id === group.id)
    );
    
    const counts: Record<string, number> = {};
    
    for (const group of uniqueGroups) {
      counts[group.id] = await fetchGroupMembersCount(group.id);
    }
    
    setGroupMemberCounts(counts);
  };
  
  if (groups.length > 0 || publicGroups.length > 0) {
    fetchAllMemberCounts();
  }
}, [groups, publicGroups]);

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

  const handleCreateGroup = () => navigate("/groups/create");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-indigo-800">Bem-vindo, {user?.user_metadata.name}</h1>

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
        {loadingGroups ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse rounded-lg overflow-hidden shadow-md border border-indigo-100">
                <div className="bg-indigo-100 h-40"></div>
                <div className="p-4">
                  <div className="h-5 bg-indigo-100 rounded mb-2 w-2/3"></div>
                  <div className="h-4 bg-indigo-50 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : groups.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={{
                  id: group.id,
                  name: group.name,
                  description: group.description,
                  image: group.image_url,
                  members: groupMemberCounts[group.id] || 0,
                  isPrivate: group.is_private,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 border border-indigo-100 text-center">
            <div className="mb-6 mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-indigo-100">
              <Users className="h-10 w-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-indigo-800 mb-2">Você ainda não tem grupos</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Crie um grupo para começar a compartilhar memórias com amigos e familiares.
              Você pode criar álbuns temáticos, viagens ou eventos especiais.
            </p>
            <Button onClick={handleCreateGroup} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6">
              <PlusCircle className="h-5 w-5 mr-2" />
              Criar meu primeiro grupo
            </Button>
          </div>
        )}
      </FeaturedSection>

      <FeaturedSection
        title="Grupos Abertos"
        description="Explore grupos públicos e participe de novas comunidades"
        actionLabel="Ver mais"
        actionHref="/groups/explore"
      >
        {loadingPublic ? (
          <p className="text-gray-500">Carregando grupos públicos...</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-max">
              {publicGroups.map((group) => (
                <div className="min-w-[280px] max-w-[280px]" key={group.id}>
                  <GroupCard
                    group={{
                      id: group.id,
                      name: group.name,
                      description: group.description,
                      image: group.image_url,
                      members: groupMemberCounts[group.id] || 0,
                      isPrivate: group.is_private,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </FeaturedSection>
    </div>
  );
};

export default Dashboard;
