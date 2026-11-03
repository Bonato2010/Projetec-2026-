import { createRoot } from 'react-dom/client';
import './styles/app.css';

// A galeria /preview-mapa é independente: não carrega o Three.js.
const path = window.location.pathname.replace(/\/+$/, '');
const root = createRoot(document.getElementById('root')!);
if (path === '/preview-mapa') {
  import('./pages/ParkPreview').then(({ default: Page }) => root.render(<Page />));
} else {
  import('./App').then(({ default: App }) => root.render(<App />));
}
