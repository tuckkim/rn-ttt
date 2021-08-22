import React, { createContext, Dispatch, ReactElement, ReactNode, SetStateAction, useContext, useState } from "react";

type AuthUserType = { [key: string]: any } | null;
type AuthContextType = {
  user: AuthUserType;
  setUser: Dispatch<SetStateAction<AuthUserType>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a context provider");
  }
  return context;
}

const AuthProvider = (props: { children: ReactNode }): ReactElement => {
  const [user, setUser] = useState<AuthUserType>(null);

  return <AuthContext.Provider {...props} value={{ user, setUser }} />;
};

export { AuthProvider, useAuth };
