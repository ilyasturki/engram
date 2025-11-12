This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# About Engram

Engram is a self-hosted web application for browsing and playing video files of video games recording from a configured directory on your server. Designed for personal use, it provides a clean, minimalist interface to navigate your video collection organized by folders, with thumbnail previews and essential playback controls.

The application monitors a single configured directory (including all subdirectories), serving video files.

# Design Philosophy

- **Minimalist aesthetic**: Clean, purposeful design with ample whitespace, subtle interactions, and focus on content over chrome. The screen should only display what truly matters, eliminating unnecessary UI elements and distractions
- **Mobile-first**: All interactions must work seamlessly on mobile devices with touch-friendly interfaces
- **Spatial consistency**: New features should feel like natural extensions of existing workflows
- **No authentication**: Open access on your local network for personal use

# Core Features

- **Directory navigation**: Browse videos organized by folder structure
- **Direct playback**: Videos are served as-is without transcoding, respecting original file quality and minimizing server overhead
- **Format support**: Native browser formats (MP4, WebM) plus MKV support
- **Single directory monitoring**: Configure one root directory containing your video collection

# Quick Reference

## Tech Stack

- **Meta-Framework**: Nuxt 4 (SSR disabled, SPA mode, Nitro for backend)
- **Framework**: Vue 3 with Composition API and TypeScript
- **Styling**: TailwindCSS v4
- **Icons**: Lucide Icons with nuxt-icons module
- **Containerization**: Docker (for self-hosted deployment)

## Commands

- `bun run typecheck` - Type checking with vue-tsc
- `bun run format` - Prettier formatting
- `bun run lint` - ESLint
- Never use `bun run dev`

## Key Links

- **Repository**: `https://github.com/Yasso9/safi`
- **Vue.js**: `https://vuejs.org/`
- **Nuxt 4**: `https://nuxt.com/docs/4.x`
- **Tailwind CSS**: `https://tailwindcss.com/`
- **Nitro**: `https://nitro.build/guide/`

# Project Structure

- **`/app`** - Main application directory (Nuxt 4 convention)
    - **`/pages`** - File-based routing
    - **`/components`** - Vue components
    - **`/composables`** - Vue composables
    - **`/utils`** - Utility functions and helpers
    - **`/middleware`** - Route middleware for authorization
    - **`/types`** - TypeScript type definitions
    - **`/assets/css`** - TailwindCSS styles, global styles, and animations
    - **`/plugins`** - Nuxt plugins for global functionality
- **`/server`** - Nitro server directory (backend API)
    - **`/api`** - API endpoints for file operations
    - **`/utils`** - Server-side utilities (workspace management, path validation)
- **`/shared`** - Shared code between client and server
    - **`/types`** - TypeScript type definitions used by both frontend and backend
- **`/samples`** - Video files for testing and demonstration purposes

# Code Style Requirements

- All file names should be kebab-case
- Use `~/` for absolute imports from app root or `~~/` for project root
- Use `undefined` over `null` for optional values
- Follow Vue 3 Composition API patterns consistently
- Never use the `any` type in TypeScript - use proper typing instead
- Don't add comments unless extremely necessary
