/// <reference types="vite/client" />

// Add global Buffer definition for TypeScript
interface Window {
  Buffer: typeof Buffer;
}
