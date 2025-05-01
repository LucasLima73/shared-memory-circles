import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

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
  const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([]);

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
  
    // Verificar se o username está disponível
    const isUsernameAvailable = await checkUsername(formData.username);
    if (!isUsernameAvailable) {
      setError('Este nome de usuário já está em uso');
      return;
    }
  
    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
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
        return;
      }
  
      if (authData.user) {
        setError('Conta criada com sucesso! Por favor, verifique seu email para confirmar o cadastro.');
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Erro no processo de signup:', error);
      setError('Erro ao criar conta. Por favor, tente novamente.');
    }
  };
  

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Criar Conta</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={handleNameChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {suggestedUsernames.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">Sugestões de username:</p>
            <div className="flex gap-2">
              {suggestedUsernames.map((username, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, username }))}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {username}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            required
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Telefone</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Criar Conta
        </button>
      </form>
    </div>
  );
}
