import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User, Mail, Phone, Lock, User2, Check, AlertCircle } from 'lucide-react';

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateUsernameSuggestions = (name: string) => {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const suggestions = [
      cleanName + Math.floor(Math.random() * 1000),
      cleanName + Math.floor(Math.random() * 100)
    ];
    setSuggestedUsernames(suggestions);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData(prev => ({ ...prev, name: newName }));
    if (newName.length > 2) {
      generateUsernameSuggestions(newName);
    }
  };

  const checkUsername = async (username: string) => {
    const { count, error } = await supabase
      .from('profiles')
      .select('username', { count: 'exact', head: true })
      .eq('username', username);
    
    if (error) {
      console.error('Erro ao verificar username:', error);
      return false;
    }
    
    return count === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
  
    try {
      // Verificar se o username está disponível
      const isUsernameAvailable = await checkUsername(formData.username);
      if (!isUsernameAvailable) {
        setError('Este nome de usuário já está em uso');
        setLoading(false);
        return;
      }
    
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          // Metadados do usuário diretamente no raw_user_meta_data
          data: {
            name: formData.name,
            username: formData.username,
            phone: formData.phone
          },
          emailRedirectTo: window.location.origin + '/auth'
        }
      });
    
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }
    
      if (authData.user) {
        // Garantir que o perfil seja criado manualmente caso o trigger não funcione
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              name: formData.name,
              username: formData.username,
              email: formData.email,
              phone: formData.phone
            }, { onConflict: 'id' });
          
          if (profileError) {
            console.error('Erro ao criar perfil:', profileError);
          }
        } catch (profileErr) {
          console.error('Erro ao inserir perfil:', profileErr);
        }
        
        setSuccess('Conta criada com sucesso! Por favor, verifique seu email para confirmar o cadastro.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          username: '',
          password: '',
        });
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Erro no processo de signup:', error);
      setError('Erro ao criar conta. Por favor, tente novamente.');
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Crie sua conta</h2>
        <p className="text-gray-500 mt-2">Preencha os dados abaixo para começar</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div>
            <div className="flex items-center mb-2">
              <User className="h-4 w-4 text-gray-500 mr-2" />
              <label className="font-medium text-gray-700">Nome completo</label>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                placeholder="Digite seu nome"
                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <User2 className="h-4 w-4 text-gray-500 mr-2" />
              <label className="font-medium text-gray-700">Nome de usuário</label>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Escolha um username único"
                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
            {suggestedUsernames.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Sugestões de username:</p>
                <div className="flex gap-2">
                  {suggestedUsernames.map((username, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, username }))}
                      className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full hover:bg-blue-100 transition-colors"
                    >
                      @{username}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Mail className="h-4 w-4 text-gray-500 mr-2" />
              <label className="font-medium text-gray-700">E-mail</label>
            </div>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Phone className="h-4 w-4 text-gray-500 mr-2" />
              <label className="font-medium text-gray-700">Telefone</label>
            </div>
            <div className="relative">
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Lock className="h-4 w-4 text-gray-500 mr-2" />
              <label className="font-medium text-gray-700">Senha</label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Crie uma senha segura"
                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center p-3 rounded-lg bg-red-50 text-red-700">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center p-3 rounded-lg bg-green-50 text-green-700">
            <Check className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{success}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          {loading ? 'Processando...' : 'Criar minha conta'}
        </button>
      </form>
      
      <p className="text-center text-sm text-gray-500 mt-6">
        Já tem uma conta? <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Entrar</a>
      </p>
    </div>
  );
}