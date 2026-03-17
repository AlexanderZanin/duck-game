# Duck Hunt — Quick Start

Small Duck Hunt-style game: a Socket.IO server emits round-start events and the React + TypeScript frontend animates a duck sprite, plays audio, and accepts click-to-shoot input. State is managed with MobX and audio is handled with Howler.js.

## Prerequisites

- Node.js 16+ and npm

## Install dependencies

```bash
npm install
```

## Run the app locally

Start both frontend and backend concurrently:

```bash
npm run dev:all
```

Wait until everything is up and running and open in the browser:

```
http://localhost:5173/
```
