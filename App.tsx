import { StatusBar } from 'expo-status-bar';
import { RouteNavigate } from './src/routes/RouteNavigate';
import { AuthProvider } from './src/components/AuthContext/AuthContext';
// import { PlayerContext } from './PlayerContext';

export default function App() {
  return (
    <AuthProvider>
      <RouteNavigate />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

