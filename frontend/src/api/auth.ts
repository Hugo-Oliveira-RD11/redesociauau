import { Usuario } from "@/types";

export const AUTH_API = {
  login: async (data: { username: string; password: string }): Promise<any> => {
    return {} as Usuario;
  },
  logout: async (): Promise<any> => {
    return null;
  },

  listAll: async (): Promise<any[]> => {
    return [
      { id: 1, name: "música", criado_por: 2 },
      { id: 2, name: "futebol", criado_por: 1 },
      { id: 3, name: "cinema", criado_por: 3 },
    ];
  },
};
