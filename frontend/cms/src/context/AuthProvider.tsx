import { ReactNode, createContext, useState } from "react";

interface AuthContextType {
    auth: AuthData;
    setAuth: React.Dispatch<React.SetStateAction<AuthData>>;
}

interface AuthData {
    accessToken: string;
    username: string;
    roles: [string];
}

const initialAuthContextValue: AuthContextType = {
    auth: { accessToken: "", username: "", roles: [""] },
    setAuth: () => {},
};

export const AuthContext = createContext<AuthContextType>(
    initialAuthContextValue
);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState<AuthData>(initialAuthContextValue.auth);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
