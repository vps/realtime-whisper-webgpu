# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a real-time speech recognition web application that uses OpenAI's Whisper model running entirely in the browser via WebGPU. The app performs automatic speech recognition (ASR) on live microphone input or uploaded audio files, leveraging Hugging Face Transformers.js for in-browser ML inference.

## Key Technologies

- **React 18** with Vite as the build tool
- **WebGPU** for hardware-accelerated ML inference
- **Hugging Face Transformers.js** (v3.0.0) for the Whisper ASR pipeline
- **Supabase** for user authentication and transcript storage
- **Tailwind CSS** for styling
- **Vitest** for testing

## Development Commands

```bash
# Start development server (Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run tests
npx vitest

# Run tests in watch mode
npx vitest --watch

# Run a single test file
npx vitest tests/worker.test.js
```

## Architecture Overview

### Main Application Flow

1. **App.jsx** - Main component that orchestrates the entire application
   - Manages state for model loading, recording, transcription, and UI
   - Initializes and communicates with the Web Worker for ML inference
   - Handles microphone access via MediaRecorder API
   - Processes audio in 30-second chunks (MAX_AUDIO_LENGTH = 30s)
   - Supports two input modes: microphone and file upload

2. **worker.js** - Web Worker for ML inference
   - Loads and manages Whisper model instances using a Singleton pattern
   - Supports multiple model sizes: tiny (~150MB), base (~200MB), small (~500MB), medium (~1.5GB)
   - Handles message-based communication with the main thread
   - Message types: `load`, `generate`, `reset`, `changeModel`, `getHistory`, `getAvailableModels`
   - Automatically falls back to smaller models if loading fails (e.g., unauthorized access)
   - Uses WebGPU for hardware acceleration with quantization (encoder: fp32, decoder: q4)

### Key Utilities

- **utils/transcription.js** - Handles merging and cleaning of continuous transcription segments
  - `mergeTranscriptions()` - Intelligently merges overlapping transcription segments
  - `cleanTranscription()` - Removes artifacts like `[BLANK_AUDIO]` markers

- **utils/errorHandler.js** - Centralized error handling with typed errors
  - Defines error types, messages, and recovery suggestions
  - `attemptRecovery()` - Attempts automatic recovery for certain error types
  - `checkBrowserSupport()` - Validates browser feature support

- **utils/storage.js** - LocalStorage helpers for user preferences
  - Saves/loads language preference, model preference, auto-process setting, and transcription history

- **utils/database.js** - Supabase integration for authenticated users
  - `saveTranscript()` - Saves transcription to Supabase
  - `fetchTranscripts()` - Retrieves user's transcription history

### Component Structure

Components are in `src/components/`:
- **ActionButtons.jsx** - Control buttons (reset, copy, process)
- **AudioVisualizer.jsx** - Real-time audio waveform visualization
- **ErrorMessage.jsx** - User-facing error display with retry functionality
- **FileUpload.jsx** - Audio file upload interface
- **LanguageSelector.jsx** - Language selection dropdown
- **ModelSelector.jsx** - Model size selection UI
- **TranscriptionHistory.jsx** - Display local transcription history
- **MyHistory.jsx** - Display user's Supabase-stored transcriptions
- **TranscriptionStatus.jsx** - Shows current processing status
- **BrowserCheck.jsx** - Browser compatibility warnings
- **ErrorBoundary.jsx** - React error boundary for error recovery

## Important Implementation Details

### Audio Processing

- Audio is sampled at 16kHz (WHISPER_SAMPLING_RATE = 16000)
- Maximum audio length per chunk is 30 seconds (MAX_SAMPLES = 480000)
- Audio chunks are processed in WebGPU-optimized format
- Continuous transcription maintains context across chunks via `previousTranscription` state

### Model Management

- Models are loaded on-demand and cached by the browser
- Model switching clears transcription context and reinitializes the pipeline
- If a larger model fails to load (e.g., unauthorized access), the app automatically falls back to smaller models
- Shader compilation and warmup happens after model loading for performance

### Transcription Merging

The app uses intelligent overlapping word detection to merge continuous transcription segments:
- Looks for 3-8 word overlaps between previous and current segments
- Falls back to similarity matching if exact overlap not found
- Handles sentence boundaries and duplicate word removal

### Error Recovery

The app implements graceful error recovery:
- Typed errors with user-friendly messages and actionable suggestions
- Automatic fallback to smaller models on loading failures
- Retry mechanisms with exponential backoff
- Recovery attempts for audio permission and model loading errors

### State Persistence

User preferences are persisted in localStorage:
- Selected language
- Selected model size
- Auto-process toggle
- Local transcription history

Authenticated users also have transcripts saved to Supabase.

## Browser Requirements

- WebGPU support (Chrome/Edge 113+)
- MediaRecorder API for audio recording
- Web Workers for background ML inference
- AudioContext API for audio processing

## Testing

- Tests use Vitest
- Current test coverage focuses on transcription merging logic
- Worker tests are in `tests/worker.test.js`

## Supabase Integration

The app uses Supabase for:
- User authentication (Google OAuth)
- Storing transcripts in a `transcripts` table with columns: `content`, `language`, `created_at`
- Configuration in `src/supabase.js`