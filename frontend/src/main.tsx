import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import posthog from 'posthog-js';
import { PostHogProvider } from '@posthog/react';
import App from './App.tsx';
import { settings } from './config/settings.ts';

if (typeof window !== 'undefined') {
  posthog.init(settings.posthogProjectToken, {
    api_host: settings.posthogHost,
    defaults: '2026-06-25',
    enable_recording_console_log: true,
  });
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
    <App />
    </PostHogProvider>
  </StrictMode>,
)
