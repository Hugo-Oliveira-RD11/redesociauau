"use client";

import { Usuario } from "@/types";
import React, { useContext, useState, useEffect } from "react";

interface Props {
  user: Usuario;
  setUsuario: (user: Usuario) => void;
}

const AppContext = React.createContext<Props>({
  user: {} as Usuario,
  setUsuario: () => {},
});

export const AppProvider: React.FC<any> = ({ children }) => {
  const [user, setUsuario] = useState<Usuario>({} as Usuario);

  // Effect to refresh token periodically
  useEffect(() => {
    const _user = localStorage.getItem("user");
    console.log(_user);

    if (_user) setUsuario(JSON.parse(_user));

    // if (!window.location.href.includes("/login")) {
    //   USUARIOS_API.me().then((_user) => {
    //     setUsuario(_user);
    //   });
    // }
  }, []);

  return (
    <AppContext.Provider value={{ user, setUsuario }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
