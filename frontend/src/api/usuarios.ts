export const USUARIOS_API = {
  create: async (input: FormData): Promise<any> => {
    // Simula criação de usuário
    return {
      id_usuario: Math.floor(Math.random() * 10000),
      ...Object.fromEntries(input),
    };
  },

  update: async (id: number, input: FormData): Promise<any> => {
    return {
      id_usuario: id,
      ...Object.fromEntries(input),
    };
  },

  findAll: async (): Promise<any[]> => {
    return [
      {
        id_usuario: 1,
        email: "joao@email.com",
        nome_usuario: "joaosilva",
        foto_perfil: "https://example.com/joao.jpg",
        data_nascimento: "1990-05-21",
        tags: "esportes,música,tecnologia",
      },
    ];
  },

  findById: async (id: string): Promise<any> => {
    return {
      id_usuario: id,
      email: "usuario@email.com",
      nome_usuario: "usuario",
      foto_perfil: "https://example.com/perfil.jpg",
      data_nascimento: "1988-01-01",
      tags: "games,café",
    };
  },

  delete: async (id: number): Promise<void> => {
    console.log(`Usuário ${id} deletado.`);
  },
};
