import { StatusBar } from 'expo-status-bar';
import { RouteNavigate } from './src/routes/RouteNavigate';

export default function App() {
  return (
    <>
      <RouteNavigate />
      <StatusBar style="auto" />
    </>
  );
}

