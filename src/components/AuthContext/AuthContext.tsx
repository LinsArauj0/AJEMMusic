import { createContext, useState, ReactNode } from "react"

interface AuthContextType {
    authToken: string | null;
    setAuthToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    const [ authToken, setAuthToken ] = useState<string | null>(null);

    return(
        <AuthContext.Provider value={{ authToken, setAuthToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider }