import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"

export function CreateGroupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [allowAllPhotos, setAllowAllPhotos] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { supabase, user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .rpc('create_group_with_owner', {
          p_name: name,
          p_is_private: isPrivate,
          p_allow_all_photos: allowAllPhotos,
          p_user_id: user.id
        })

      if (error) throw error

      toast({
        title: "Grupo criado com sucesso!",
        description: "Você foi redirecionado para a página do grupo.",
      })

      navigate(`/groups/${data.group_id}`)
    } catch (error) {
      toast({
        title: "Erro ao criar grupo",
        description: "Ocorreu um erro ao criar o grupo. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do grupo</Label>
        <Input
          id="name"
          required
          placeholder="Digite o nome do grupo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="private">Grupo privado</Label>
          <p className="text-sm text-muted-foreground">
            Apenas membros podem ver o conteúdo
          </p>
        </div>
        <Switch
          id="private"
          checked={isPrivate}
          onCheckedChange={setIsPrivate}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="photos">Permissão para fotos</Label>
          <p className="text-sm text-muted-foreground">
            Todos os membros podem adicionar fotos
          </p>
        </div>
        <Switch
          id="photos"
          checked={allowAllPhotos}
          onCheckedChange={setAllowAllPhotos}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-memories-purple hover:bg-memories-dark-purple"
        disabled={isLoading}
      >
        {isLoading ? "Criando..." : "Criar grupo"}
      </Button>
    </form>
  )
}
