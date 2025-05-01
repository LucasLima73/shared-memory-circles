import { useEffect, useState } from "react";
import { HomeIcon, Users, Calendar, Bookmark, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface Group {
  id: string;
  name: string;
}

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { supabase, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserGroups() {
      try {
        if (!user?.id) return;

        // Buscar grupos onde o usuário é membro
        const { data: memberships, error: membershipError } = await supabase
          .from('group_members')
          .select('group_id')
          .eq('user_id', user.id);

        if (membershipError) throw membershipError;

        // Se o usuário participa de algum grupo
        if (memberships && memberships.length > 0) {
          const groupIds = memberships.map(m => m.group_id);
          
          // Buscar detalhes dos grupos
          const { data: groups, error: groupsError } = await supabase
            .from('groups')
            .select('id, name')
            .in('id', groupIds)
            .order('name');

          if (groupsError) throw groupsError;
          
          setUserGroups(groups || []);
        } else {
          // Se não participa de nenhum grupo
          setUserGroups([]);
        }
      } catch (error) {
        console.error('Erro ao carregar grupos:', error);
        toast({
          title: "Erro ao carregar grupos",
          description: "Não foi possível carregar seus grupos.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadUserGroups();
  }, [supabase, toast, user]);

  return (
    <aside
      className={cn(
        "hidden md:flex min-h-screen w-64 flex-col justify-between border-r bg-white p-4",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 font-medium"
            onClick={() => navigate('/dashboard')}
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
            {loading ? (
              <div className="space-y-2 px-4">
                <div className="h-8 w-full animate-pulse rounded bg-gray-200"></div>
                <div className="h-8 w-full animate-pulse rounded bg-gray-200"></div>
                <div className="h-8 w-full animate-pulse rounded bg-gray-200"></div>
              </div>
            ) : (
              <>
                {userGroups.map((group) => (
                  <Button
                    key={group.id}
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => navigate(`/groups/${group.id}`)}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-memories-light-purple text-memories-purple">
                      {group.name[0]}
                    </div>
                    {group.name}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-memories-purple"
                  onClick={() => navigate('/groups/new')}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-memories-purple">
                    +
                  </div>
                  Criar novo grupo
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Settings className="h-5 w-5" />
          Configurações
        </Button>
      </div>
    </aside>
  );
}
