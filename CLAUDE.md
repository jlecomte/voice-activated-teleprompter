# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
A voice-activated teleprompter web application built with Vite, React, Redux Toolkit, and TypeScript. The app uses the Web Speech API to provide automatic scrolling based on speech recognition as users read their scripts.

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run type-check` - Run TypeScript type checking without emitting files
- `npm run format` - Format code with Prettier

## Architecture

### Core Libraries
- **Speech Recognition**: Uses Web Speech API (`webkitSpeechRecognition`) with language selection support (`en-US` and `pt-BR`)
- **Speech Matching**: Custom algorithm in `src/lib/speech-matcher.ts` that uses Levenshtein distance to match recognized speech with reference text
- **Text Processing**: Tokenizer in `src/lib/word-tokenizer.ts` handles text parsing and element creation

### Redux State Structure
The app uses Redux Toolkit with two main slices:
- **navbarSlice**: Controls app status (editing/playing/stopped), display settings (font size, margins, opacity, flip settings), and language selection
- **contentSlice**: Manages script content, text tokenization, and speech recognition indices

### Key Components
- **NavBar**: Controls for play/stop/edit, language selection dropdown, settings sliders, and display options
- **Content**: Renders either textarea (edit mode) or formatted script with highlighted progress (play mode)

### Speech Recognition Flow
1. Language is automatically detected from browser or manually selected via dropdown
2. `SpeechRecognizer` class wraps Web Speech API with configurable language and auto-restart functionality
3. Recognition results trigger speech matching algorithm
4. `computeSpeechRecognitionTokenIndex()` uses Levenshtein distance to find best match
5. Redux state updates trigger UI highlighting and auto-scrolling

## Browser Compatibility
- Requires Chrome/Chromium browsers (uses webkitSpeechRecognition)
- Supports English (`en-US`) and Brazilian Portuguese (`pt-BR`) with automatic language detection and manual selection
- Uses modern ES modules and Vite for development

## Key Files
- `src/lib/speech-recognizer.ts` - Web Speech API wrapper
- `src/lib/speech-matcher.ts` - Core matching algorithm using Levenshtein distance
- `src/lib/word-tokenizer.ts` - Text parsing and tokenization
- `src/features/content/Content.tsx` - Main display component with auto-scroll
- `src/app/store.ts` - Redux store configuration