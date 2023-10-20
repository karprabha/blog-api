"use client";

import { ReactNode, createContext, useState } from "react";

interface AuthContextType {
    auth: AuthData;
    setAuth: React.Dispatch<React.SetStateAction<AuthData>>;
    persist: boolean;
    setPersist: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AuthData {
    accessToken: string;
    username: string;
}

const initialAuthContextValue: AuthContextType = {
    auth: { accessToken: "", username: "" },
    setAuth: () => {},
    persist: false,
    setPersist: () => {},
};

export const AuthContext = createContext<AuthContextType>(
    initialAuthContextValue
);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState<AuthData>(initialAuthContextValue.auth);

    const storedPersist = localStorage.getItem("persist");
    const [persist, setPersist] = useState(
        storedPersist ? JSON.parse(storedPersist) : false
    );

    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
