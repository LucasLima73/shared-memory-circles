import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PencilIcon,
  ImageIcon,
  Loader2,
  Plus,
  XIcon,
  Camera,
  Calendar,
  Lock,
  Globe,
  Clock,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from 'uuid';

interface Group {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_private: boolean;
  allow_all_photos: boolean;
  created_at: string;
  created_by: string;
  owner_name?: string;
}

interface GroupForm {
  name: string;
  description: string;
  image_url: string | null;
}

interface Memory {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  created_by: string;
  group_id: string;
}

interface MemoryForm {
  title: string;
  description: string;
  images: File[];
}

export default function GroupDetailsPage() {
  const { id } = useParams();
  const { supabase, user } = useAuth();
  const { toast } = useToast();
  const [group, setGroup] = useState<Group | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMemories, setLoadingMemories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [addingMemory, setAddingMemory] = useState(false);
  const [memoryDialogOpen, setMemoryDialogOpen] = useState(false);
  const [previewMemory, setPreviewMemory] = useState<Memory | null>(null);
  const [memoryFile, setMemoryFile] = useState<File | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [joiningGroup, setJoiningGroup] = useState(false);
  const [leavingGroup, setLeavingGroup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const memoryImagesRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<GroupForm>({
    name: "",
    description: "",
    image_url: null,
  });

  const [memoryForm, setMemoryForm] = useState<MemoryForm>({
    title: "",
    description: "",
    images: [],
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const checkMembership = async () => {
    if (!user?.id || !id) return false;

    const { data: membership } = await supabase
      .from("group_members")
      .select("*")
      .eq("group_id", id)
      .eq("user_id", user.id)
      .single();

    setIsMember(!!membership);
    
    // Check if user is the owner
    if (group && group.created_by === user.id) {
      setIsOwner(true);
    }
    
    return !!membership;
  };

  const joinGroup = async () => {
    if (!user?.id || !id || isMember || joiningGroup) return;

    try {
      setJoiningGroup(true);
      const { error } = await supabase
        .from("group_members")
        .insert({
          group_id: id,
          user_id: user.id,
          role: "member"
        });

      if (error) throw error;

      setIsMember(true);
      toast({
        title: "Grupo acessado!",
        description: "Você agora é membro deste grupo.",
      });

      // Reload memories after joining
      loadMemories();
    } catch (error) {
      console.error("Error joining group:", error);
      toast({
        title: "Erro ao entrar no grupo",
        description: "Não foi possível entrar no grupo.",
        variant: "destructive",
      });
    } finally {
      setJoiningGroup(false);
    }
  };
  
  const leaveGroup = async () => {
    if (!user?.id || !id || !isMember || leavingGroup) return;
    
    try {
      setLeavingGroup(true);
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", id)
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      setIsMember(false);
      toast({
        title: "Grupo abandonado",
        description: "Você saiu deste grupo com sucesso.",
      });
      
      // Clear memories since user is no longer a member
      setMemories([]);
    } catch (error) {
      console.error("Error leaving group:", error);
      toast({
        title: "Erro ao sair do grupo",
        description: "Não foi possível sair do grupo.",
        variant: "destructive",
      });
    } finally {
      setLeavingGroup(false);
    }
  };

  const checkAndCreateMembership = async (groupId: string) => {
    try {
      const { data: membership, error: membershipError } = await supabase
        .from("group_members")
        .select("*")
        .eq("group_id", groupId)
        .eq("user_id", user.id)
        .single();

      if (membershipError && membershipError.code === "PGRST116") {
        const { data: group } = await supabase
          .from("groups")
          .select("created_by")
          .eq("id", groupId)
          .single();

        if (group && group.created_by === user.id) {
          await supabase.from("group_members").insert({
            group_id: groupId,
            user_id: user.id,
            role: "owner",
          });
        }
      }
    } catch (error) {
      console.error("Error checking membership:", error);
    }
  };

  useEffect(() => {
    async function init() {
      await loadGroup();
      // Load memories regardless of membership for public groups
      loadMemories();
    }
    init();
  }, [id, supabase]);

  async function loadGroup() {
      try {
        const { data, error } = await supabase
          .from("groups")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        
        // Just use the creator ID as a simple identifier
        // This avoids querying tables that might not exist
        data.owner_name = data.created_by ? `Usuário ${data.created_by.substring(0, 6)}` : "Usuário";
        
        // If the current user is the creator, mark it as "você"
        if (user && data.created_by === user.id) {
          data.owner_name = "Você";
        }

        setGroup(data);
        setForm({
          name: data.name,
          description: data.description || "",
          image_url: data.image_url,
        });
        
        // Check if current user is the owner
        if (user && data.created_by === user.id) {
          setIsOwner(true);
        }

        await checkAndCreateMembership(data.id);
      } catch (error) {
        toast({
          title: "Erro ao carregar grupo",
          description: "Não foi possível carregar os detalhes do grupo.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

  async function loadMemories() {
    if (!id) return;

    try {
      setLoadingMemories(true);
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .eq("group_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setMemories(data || []);
    } catch (error) {
      console.error("Error loading memories:", error);
      toast({
        title: "Erro ao carregar memórias",
        description: "Não foi possível carregar as memórias deste grupo.",
        variant: "destructive",
      });
    } finally {
      setLoadingMemories(false);
    }
  }



  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      await checkAndCreateMembership(id);

      const fileExt = file.name.split(".").pop();
      const filePath = `${id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("group-covers")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("group-covers").getPublicUrl(filePath);

      await handleSave({ ...form, image_url: publicUrl });
      setForm((prev) => ({ ...prev, image_url: publicUrl }));

      toast({
        title: "Imagem atualizada",
        description: "A imagem de capa foi atualizada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao fazer upload",
        description: "Não foi possível fazer upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (newData: Partial<GroupForm>) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from("groups")
        .update(newData)
        .eq("id", id);

      if (error) throw error;

      setGroup((prev) => (prev ? { ...prev, ...newData } : null));
      setEditing(false);

      toast({
        title: "Grupo atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMemoryImagesSelect = async (e: React.ChangeEvent<HTMLInputElement>, autoSave = false) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    console.log("Files selected:", files);

    // Create preview URLs for the images
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviewUrls]);

    // Update memory form
    setMemoryForm(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
    
    // Auto-save if requested (for the empty state quick upload)
    if (autoSave && files.length > 0) {
      // Use a minimal form with just the images
      const quickForm = {
        title: "Nova memória",
        description: "",
        images: files
      };
      
      // Save immediately
      await handleQuickMemorySave(quickForm);
    }
  };

  const removePreviewImage = (index: number) => {
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previewImages[index]);

    // Remove from previews and form
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setMemoryForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleQuickMemorySave = async (quickForm) => {
    try {
      setAddingMemory(true);
      console.log("Quick saving memory with files:", quickForm.images.length);

      // Upload each image
      const uploadPromises = quickForm.images.map(async (file) => {
        const fileExt = file.name.split(".").pop();
        const filePath = `memories/${id}/${uuidv4()}.${fileExt}`;

        console.log("Uploading file to path:", filePath);

        const { error: uploadError } = await supabase.storage
          .from("memory-images")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("memory-images").getPublicUrl(filePath);

        console.log("File uploaded, public URL:", publicUrl);
        return publicUrl;
      });

      const imageUrls = await Promise.all(uploadPromises);
      console.log("All images uploaded:", imageUrls);

      // Create a memory record for each image
      const memoriesData = imageUrls.map(imageUrl => ({
        title: quickForm.title,
        description: quickForm.description,
        image_url: imageUrl,
        group_id: id,
        created_by: user.id
      }));

      console.log("Creating memory records:", memoriesData);
      const { error } = await supabase.from("memories").insert(memoriesData);

      if (error) {
        console.error("Error inserting memories:", error);
        throw error;
      }

      // Reload memories
      const { data: newMemories } = await supabase
        .from("memories")
        .select("*")
        .eq("group_id", id)
        .order("created_at", { ascending: false });

      setMemories(newMemories || []);
      console.log("Memories updated:", newMemories);

      // Reset form
      setMemoryForm({
        title: "",
        description: "",
        images: []
      });
      setPreviewImages([]);
      
      toast({
        title: "Memórias adicionadas",
        description: "As novas memórias foram adicionadas com sucesso.",
      });
    } catch (error) {
      console.error("Error saving memories:", error);
      toast({
        title: "Erro ao salvar memórias",
        description: "Não foi possível salvar as memórias.",
        variant: "destructive",
      });
    } finally {
      setAddingMemory(false);
    }
  };

  const handleMemorySave = async () => {
    try {
      setAddingMemory(true);
      console.log("Saving memory with form data:", memoryForm);

      if (memoryForm.images.length === 0) {
        toast({
          title: "Imagens obrigatórias",
          description: "Por favor, adicione pelo menos uma imagem.",
          variant: "destructive",
        });
        setAddingMemory(false);
        return;
      }

      // Upload each image
      const uploadPromises = memoryForm.images.map(async (file) => {
        const fileExt = file.name.split(".").pop();
        const filePath = `memories/${id}/${uuidv4()}.${fileExt}`;

        console.log("Uploading file to path:", filePath);

        const { error: uploadError } = await supabase.storage
          .from("memory-images")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("memory-images").getPublicUrl(filePath);

        console.log("File uploaded, public URL:", publicUrl);
        return publicUrl;
      });

      const imageUrls = await Promise.all(uploadPromises);
      console.log("All images uploaded:", imageUrls);

      // Create a memory record for each image
      const memoriesData = imageUrls.map(imageUrl => ({
        title: memoryForm.title,
        description: memoryForm.description,
        image_url: imageUrl,
        group_id: id,
        created_by: user.id
      }));

      console.log("Creating memory records:", memoriesData);
      const { error } = await supabase.from("memories").insert(memoriesData);

      if (error) {
        console.error("Error inserting memories:", error);
        throw error;
      }

      // Reload memories
      const { data: newMemories } = await supabase
        .from("memories")
        .select("*")
        .eq("group_id", id)
        .order("created_at", { ascending: false });

      setMemories(newMemories || []);
      console.log("Memories updated:", newMemories);

      // Reset form
      setMemoryForm({
        title: "",
        description: "",
        images: []
      });
      setPreviewImages([]);
      
      // Close the dialog
      setMemoryDialogOpen(false);

      toast({
        title: "Memórias adicionadas",
        description: "As novas memórias foram adicionadas com sucesso.",
      });
    } catch (error) {
      console.error("Error saving memories:", error);
      toast({
        title: "Erro ao salvar memórias",
        description: "Não foi possível salvar as memórias.",
        variant: "destructive",
      });
    } finally {
      setAddingMemory(false);
      setSaving(false);
      setMemoryForm({
        title: "",
        description: "",
        images: []
      });
      setPreviewImages([]);
    }
  };

  const handleMemoryUpload = async () => {
    if (!memoryFile || !user) return;
    setAddingMemory(true);

    try {
      const ext = memoryFile.name.split(".").pop();
      const path = `memories/${id}/${uuidv4()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("memory-images")
        .upload(path, memoryFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("memory-images")
        .getPublicUrl(path);

      const { error: insertError } = await supabase.from("memories").insert({
        title: "",
        description: "",
        image_url: publicUrl,
        group_id: id,
        created_by: user.id
      });

      if (insertError) throw insertError;

      const { data: updated } = await supabase
        .from("memories")
        .select("*")
        .eq("group_id", id)
        .order("created_at", { ascending: false });

      setMemories(updated || []);
      setMemoryFile(null);
      toast({ 
        title: "Memória adicionada",
        description: "Sua memória foi adicionada com sucesso!",
        variant: "default"
      });
    } catch (error) {
      toast({ 
        title: "Erro ao adicionar memória", 
        variant: "destructive" 
      });
    } finally {
      setAddingMemory(false);
    }
  };
  const handleDeleteMemory = async (memoryId: string) => {
    try {
      const { data: memory, error: fetchError } = await supabase
        .from("memories")
        .select("*")
        .eq("id", memoryId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Verificar se o usuário é o dono da memória
      if (memory.created_by !== user.id) {
        toast({
          title: "Permissão negada",
          description: "Você só pode excluir memórias que você criou.",
          variant: "destructive"
        });
        return;
      }
      
      console.log("Deleting memory:", memoryId);
      
      const { error: deleteError } = await supabase
        .from("memories")
        .delete()
        .eq("id", memoryId);
      
      if (deleteError) {
        console.error("Error deleting memory record:", deleteError);
        throw deleteError;
      }
      
      // Atualizar a UI removendo a memória da lista
      setMemories(prev => prev.filter(m => m.id !== memoryId));
      
      // Fechar o preview se estiver aberto
      if (previewMemory && previewMemory.id === memoryId) {
        setPreviewMemory(null);
      }
  
      toast({
        title: "Memória deletada",
        description: "A memória foi removida com sucesso.",
      });
    } catch (error) {
      console.error("Error in handleDeleteMemory:", error);
      toast({
        title: "Erro ao deletar",
        description: "Não foi possível deletar a memória.",
        variant: "destructive",
      });
    }
  };
  

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-indigo-50 to-white min-h-screen">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-indigo-100">
        {/* Capa */}
        <div className="relative">
          {group?.image_url ? (
            <img
              src={group.image_url}
              alt={group.name}
              className="w-full h-64 md:h-80 object-cover"
            />
          ) : (
            <div className="w-full h-64 md:h-80 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white">
                <ImageIcon className="h-16 w-16 mx-auto mb-2 opacity-75" />
                <h2 className="font-medium text-xl">Adicione uma imagem de capa</h2>
              </div>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
          />

          {group && isOwner && <Button
            variant="secondary"
            className={cn(
              "absolute bottom-4 right-4 bg-white/90 hover:bg-white text-indigo-700 hover:text-indigo-800 border border-indigo-200 shadow-md transition-all",
              uploadingImage && "pointer-events-none"
            )}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                {group.image_url ? "Alterar capa" : "Adicionar capa"}
              </>
            )}
          </Button>}
        </div>

        {/* Conteúdo */}
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-indigo-700">Nome do grupo</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="mt-1 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-indigo-700">Descrição</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="mt-1 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                      rows={4}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold mb-4 text-indigo-800">{group?.name}</h1>
                  {group?.description && (
                    <p className="text-gray-600 mb-4 leading-relaxed">{group.description}</p>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-2">
              {editing ? (
                <>
                  <Button
                    variant="outline"
                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    onClick={() => {
                      setEditing(false);
                      setForm({
                        name: group?.name || "",
                        description: group?.description || "",
                        image_url: group?.image_url,
                      });
                    }}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={() => handleSave(form)} 
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar"
                    )}
                  </Button>
                </>
              ) : (
                isOwner && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditing(true)}
                    className="text-indigo-700 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                )
              )}
            </div>
          </div>

          {group && <div className="flex items-center justify-between gap-4 text-sm text-indigo-600 bg-indigo-50 p-3 rounded-lg">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center">
                {group.is_private ? (
                  <Lock className="h-4 w-4 mr-1 text-indigo-500" />
                ) : (
                  <Globe className="h-4 w-4 mr-1 text-indigo-500" />
                )}
                <span>{group.is_private ? "Grupo Privado" : "Grupo Público"}</span>
              </div>
              <span className="text-indigo-300">•</span>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-indigo-500" />
                <span>
                  Criado em {new Date(group.created_at).toLocaleDateString()}
                </span>
              </div>
              <span className="text-indigo-300">•</span>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1 text-indigo-500" />
                <span>
                  Criado por {group.owner_name || "Usuário"}
                </span>
              </div>
              {!isOwner && (
                !isMember ? (
                  <Button
                    onClick={joinGroup}
                    disabled={joiningGroup}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {joiningGroup ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={leaveGroup}
                    disabled={leavingGroup}
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    {leavingGroup ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saindo...
                      </>
                    ) : (
                      "Sair do grupo"
                    )}
                  </Button>
                )
              )}
            </div>
          </div>}
        </div>
      </div>

      {isMember ? (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-indigo-800 flex items-center">
          <Camera className="h-5 w-5 mr-2 text-indigo-600" />
          Memórias
        </h2>
        <div>
          <Dialog open={memoryDialogOpen} onOpenChange={setMemoryDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
                onClick={() => {
                  // Reset form when opening dialog
                  setMemoryForm({
                    title: "",
                    description: "",
                    images: []
                  });
                  setPreviewImages([]);
                }}
              >
                <Plus className="w-4 h-4 mr-2" /> Nova Memória
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl text-indigo-800">Adicionar nova memória</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-indigo-700">Título</Label>
                  <Input 
                    id="title" 
                    placeholder="Título da memória" 
                    className="border-indigo-200"
                    value={memoryForm.title}
                    onChange={(e) => setMemoryForm(prev => ({...prev, title: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-indigo-700">Descrição</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Descreva esta memória..."
                    className="border-indigo-200"
                    value={memoryForm.description}
                    onChange={(e) => setMemoryForm(prev => ({...prev, description: e.target.value}))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-indigo-700">Imagens</Label>
                  <div className="border-2 border-dashed border-indigo-200 rounded-lg p-6 text-center hover:bg-indigo-50 transition cursor-pointer" onClick={() => memoryImagesRef.current?.click()}>
                    <input 
                      ref={memoryImagesRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleMemoryImagesSelect}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <ImageIcon className="mx-auto h-8 w-8 text-indigo-400" />
                    <p className="mt-2 text-sm text-indigo-600">Clique para selecionar imagens</p>
                    <p className="text-xs text-indigo-400">ou arraste e solte aqui</p>
                  </div>

                  {previewImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {previewImages.map((url, index) => (
                        <div key={index} className="relative">
                          <img src={url} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-md" />
                          <button 
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            onClick={() => removePreviewImage(index)}
                          >
                            <XIcon className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleMemorySave} 
                  disabled={addingMemory || memoryForm.images.length === 0}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {addingMemory ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Adicionar memória"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

    </div>
    ): (
      null
    )}


      {loadingMemories ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-indigo-100 h-48 rounded-lg mb-2"></div>
              <div className="h-4 bg-indigo-100 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-indigo-50 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : memories.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <Camera className="h-12 w-12 mx-auto text-indigo-300 mb-4" />
        <h3 className="text-xl font-semibold text-indigo-700 mb-2">Nenhuma memória ainda</h3>
        <p className="text-gray-600 mb-4">Adicione a primeira memória para este grupo!</p>
    
        {/* 👇 este input estava faltando aqui */}
        <input
          type="file"
          ref={memoryImagesRef}
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleMemoryImagesSelect(e, true)}
        />
    
        <Button 
          onClick={() => memoryImagesRef.current?.click()}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Criar memória
        </Button>
      </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {memories.map((memory) => (
  <div
    key={memory.id}
    className="break-inside-avoid cursor-pointer bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-indigo-100"
    onClick={() => setPreviewMemory(memory)}
  >
    <img
      src={memory.image_url}
      alt="memória"
      className="rounded-lg w-full mb-3 hover:opacity-90 transition"
    />
    <div className="px-1">
      <h3 className="font-semibold text-indigo-800 mb-1 line-clamp-1">
        {memory.title || "Sem título"}
      </h3>
      {memory.description && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
          {memory.description}
        </p>
      )}
      <div className="flex items-center justify-between text-xs text-indigo-400 mt-2">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {new Date(memory.created_at).toLocaleDateString()}
        </div>
        {memory.created_by === user?.id && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // evita abrir o preview
              handleDeleteMemory(memory.id);
            }}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            Deletar
          </button>
        )}
      </div>
    </div>
  </div>
))}

        </div>
      )}
      {isMember && (
        <Dialog open={!!previewMemory} onOpenChange={() => setPreviewMemory(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-xl bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-indigo-50 flex items-center justify-center p-4">
                <img
                  src={previewMemory?.image_url}
                  alt="Memória"
                  className="w-full h-auto rounded-lg shadow-md max-h-[600px] object-contain"
                />
              </div>
              <div className="flex flex-col justify-between p-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-3 text-indigo-800">{previewMemory?.title || "Sem título"}</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {previewMemory?.description || "Sem descrição"}
                  </p>
                </div>
                <div className="pt-4 border-t border-indigo-100">
                  <div className="flex items-center text-sm text-indigo-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      Publicado em {previewMemory?.created_at ? new Date(previewMemory.created_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}