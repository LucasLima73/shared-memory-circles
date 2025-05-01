
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthContext';

type Group = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  is_private: boolean;
  created_at: string;
};

type GroupContextType = {
  groups: Group[];
  loading: boolean;
  createGroup: (data: Partial<Group>) => Promise<Group>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
};

const GroupContext = createContext<GroupContextType>({} as GroupContextType);

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadGroups();
      subscribeToGroups();
    }
  }, [user]);

  const loadGroups = async () => {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading groups:', error);
      return;
    }

    setGroups(data);
    setLoading(false);
  };

  const subscribeToGroups = () => {
    const subscription = supabase
      .channel('groups')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'groups' }, loadGroups)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const createGroup = async (data: Partial<Group>) => {
    const { data: group, error } = await supabase
      .from('groups')
      .insert([{ ...data, created_by: user?.id }])
      .select()
      .single();

    if (error) throw error;
    return group;
  };

  const joinGroup = async (groupId: string) => {
    const { error } = await supabase
      .from('group_members')
      .insert([{ group_id: groupId, user_id: user?.id, role: 'member' }]);

    if (error) throw error;
  };

  const leaveGroup = async (groupId: string) => {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .match({ group_id: groupId, user_id: user?.id });

    if (error) throw error;
  };

  return (
    <GroupContext.Provider value={{ groups, loading, createGroup, joinGroup, leaveGroup }}>
      {children}
    </GroupContext.Provider>
  );
}

export const useGroups = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroups must be used within a GroupProvider');
  }
  return context;
};
