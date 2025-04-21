# SpeechSync - Real-time Speech Recognition in the Browser 🎙️

SpeechSync is a powerful web application that performs real-time speech recognition directly in your browser using WebGPU acceleration. Powered by Whisper AI and Transformers.js, this application brings professional-grade transcription capabilities to users without sending any audio data to external servers.

## 🚀 Features

- **Real-time Transcription**: Convert speech to text in real-time directly in your browser
- **WebGPU Acceleration**: Utilizes your GPU for faster model inference through WebGPU
- **Privacy-Focused**: All processing happens locally - no audio data is sent to servers
- **Multi-language Support**: Transcribe audio in multiple languages
- **Responsive UI**: Clean, modern interface built with React and Tailwind CSS
- **User Accounts**: Create an account to save and manage your transcripts
- **Tiered Subscription Plans**: Free tier with usage limits and premium tiers with enhanced features
- **Transcript Management**: View, edit, and manage your saved transcriptions
- **Dark/Light Mode**: Choose your preferred theme

## 🔧 Technology Stack

- **Frontend**: React, React Router, Redux Toolkit
- **UI Components**: Tailwind CSS, Headless UI, Heroicons
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **AI Models**: Hugging Face Transformers.js, Whisper-base model
- **Web Workers**: Background processing for audio transcription
- **WebGPU**: Hardware acceleration for model inference
- **Charts**: Recharts for visualization

## 📋 Requirements

- A browser that supports WebGPU (Chrome 113+, Edge 113+, or other Chromium-based browsers)
- Microphone access
- At least 500MB of free memory for model loading
- GPU with WebGPU support for optimal performance

## 🏗️ Architecture

The application is structured with a focus on performance and user experience:

- **Web Worker**: Model loading and inference runs in a separate thread to keep the UI responsive
- **Service-oriented design**: Separate concerns between UI, authentication, and AI processing
- **Redux state management**: Centralized state management using Redux Toolkit
- **React Router**: Client-side routing with public and protected routes
- **Responsive components**: UI adapts to different screen sizes

## 🚦 How It Works

1. The Whisper base model (~200MB) is downloaded and cached in your browser
2. Audio from your microphone is processed in real-time
3. The model transcribes the audio using WebGPU acceleration
4. Results are displayed immediately and can be saved to your account
5. All processing happens locally - no data is sent to servers

## 📊 Usage Limits

- **Free Tier**: 10 minutes of transcription per day, max 30 seconds per recording
- **Pro Tier**: Unlimited transcription time, longer recordings, priority features
- **Enterprise Tier**: Custom features and support options

## 🔒 Privacy

SpeechSync is designed with privacy in mind:
- All speech recognition happens locally in your browser
- No audio data is ever sent to external servers
- User account data is securely managed through Firebase
- Transcripts are stored in your personal account and not shared

## 🛠️ Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/speechsync.git

# Navigate to the project directory
cd speechsync

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 📦 Building for Production

```bash
# Create optimized production build
npm run build

# Preview the production build locally
npm run preview
```

## 🧪 Future Enhancements

- Support for more languages
- Offline mode with local model storage
- Fine-tuning options for specific domains
- Team collaboration features
- Export options in multiple formats
- API access for developers

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for providing the Transformers.js library
- [Whisper](https://github.com/openai/whisper) by OpenAI for the base model
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Firebase](https://firebase.google.com/) for authentication and database
