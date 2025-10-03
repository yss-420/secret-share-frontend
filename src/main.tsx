import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import 'quill/dist/quill.snow.css'

createRoot(document.getElementById("root")!).render(<App />);
