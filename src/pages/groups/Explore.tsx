import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Globe, Lock, Search, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Group {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_private: boolean;
  created_at: string;
  created_by: string;
  member_count: number;
  owner_name: string | null;
}

export default function ExploreGroups() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [joiningGroup, setJoiningGroup] = useState<string | null>(null);

  useEffect(() => {
    fetchOpenGroups();
  }, []);

  const fetchOpenGroups = async () => {
    try {
      setLoading(true);
  
      // 1. Buscar todos os grupos públicos
      const { data: groups, error: groupsError } = await supabase
        .from('groups')
        .select('*')
        .eq('is_private', false)
        .order('created_at', { ascending: false });
  
      if (groupsError) throw groupsError;
  
      // 2. Buscar contagem de membros por grupo
      // Primeiro, obter todos os membros dos grupos
      const { data: allMembers, error: countError } = await supabase
        .from('group_members')
        .select('group_id')
        .in('group_id', groups.map(g => g.id));
        
      if (countError) throw countError;
      
      // Criar um mapa de contagem de membros por grupo
      const memberCounts = allMembers?.reduce((acc, member) => {
        acc[member.group_id] = (acc[member.group_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};
  
      // 3. Buscar nomes dos donos (opcional, só se você quiser mostrar)
      const creatorIds = [...new Set(groups.map(g => g.created_by))];
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', creatorIds);
  
      if (profileError) throw profileError;
  
      const profileMap = profiles?.reduce((acc, curr) => {
        acc[curr.id] = curr.name;
        return acc;
      }, {} as Record<string, string>);
  
      // 4. Transformar e juntar os dados
      const transformedGroups = groups.map(group => ({
        ...group,
        member_count: memberCounts?.[group.id] || 0,
        owner_name: profileMap?.[group.created_by] || 'Usuário'
      }));
  
      setGroups(transformedGroups);
    } catch (error) {
      console.error('Error fetching open groups:', error);
      toast({
        title: 'Erro ao carregar grupos',
        description: 'Não foi possível carregar os grupos disponíveis.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      setJoiningGroup(groupId);
      
      // Check if already a member
      const { data: existingMembership } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .single();
      
      if (existingMembership) {
        // Already a member, just navigate to the group
        navigate(`/groups/${groupId}`);
        return;
      }
      
      // Join the group
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member'
        });

      if (error) throw error;

      toast({
        title: 'Grupo acessado!',
        description: 'Você agora é membro deste grupo.',
      });
      
      navigate(`/groups/${groupId}`);
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        title: 'Erro ao entrar no grupo',
        description: 'Não foi possível entrar no grupo.',
        variant: 'destructive',
      });
    } finally {
      setJoiningGroup(null);
    }
  };

  console.log(groups)

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: ptBR });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-center text-memories-purple">Explore Grupos</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Descubra novos grupos para compartilhar suas memórias com pessoas que têm interesses semelhantes.
        </p>
        
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar grupos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-memories-purple/30 focus:border-memories-purple"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-memories-purple"></div>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Globe className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum grupo encontrado</h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchTerm ? 'Nenhum grupo corresponde à sua busca.' : 'Não há grupos públicos disponíveis no momento.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <div key={group.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100">
              <div className="relative h-40 overflow-hidden">
                {group.image_url ? (
                  <img 
                    src={group.image_url} 
                    alt={group.name} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-memories-light-purple to-memories-purple flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{group.name.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5 shadow-sm">
                  <Globe className="h-4 w-4 text-memories-purple" />
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{group.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {group.description || 'Sem descrição'}
                </p>
                
                <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
                  <div className="flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    <span>{group.member_count} {group.member_count === 1 ? 'membro' : 'membros'}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>Criado em {formatDate(group.created_at)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback className="bg-memories-light-purple text-white text-xs">
                        {group.owner_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-600">
                      {group.owner_name || 'Usuário'}
                    </span>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => joinGroup(group.id)}
                    disabled={joiningGroup === group.id}
                    className="bg-memories-purple hover:bg-memories-dark-purple text-white"
                  >
                    {joiningGroup === group.id ? (
                      <span className="flex items-center">
                        <div className="h-3 w-3 mr-1 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                        Entrando...
                      </span>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
