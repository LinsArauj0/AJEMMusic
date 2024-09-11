import React, { createContext, useState, ReactNode } from "react";

// Defina o tipo do track (isso dependerá da estrutura real dos dados de uma track)
type Track = {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
  };
  artists: { name: string }[];
  // Adicione outros campos necessários aqui
} | null;

// Defina o tipo para o contexto
type PlayerContextType = {
  currentTrack: Track;
  setCurrentTrack: React.Dispatch<React.SetStateAction<Track>>;
};

// Cria o contexto com valor padrão como undefined
const Player = createContext<PlayerContextType | undefined>(undefined);

// Define o tipo das props que o componente PlayerContext recebe
type PlayerContextProps = {
  children: ReactNode;
};

const PlayerContext = ({ children }: PlayerContextProps) => {
  const [currentTrack, setCurrentTrack] = useState<Track>(null);

  return (
    <Player.Provider value={{ currentTrack, setCurrentTrack }}>
      {children}
    </Player.Provider>
  );
};

export { PlayerContext, Player };
