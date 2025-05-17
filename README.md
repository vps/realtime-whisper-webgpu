# Realtime Whisper WebGPU

This project demonstrates in-browser speech recognition using the Whisper model and WebGPU. It now integrates Supabase for per‑user transcript storage.

## Environment Variables

Copy `.env.example` to `.env` and provide your Supabase credentials:

```
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Running `npm run dev` will log **"Supabase connected"** if the client is configured correctly.
