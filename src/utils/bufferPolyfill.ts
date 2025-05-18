// Utility file for Buffer polyfill
import { Buffer as BufferPolyfill } from 'buffer';

// Ensure Buffer is available globally
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || BufferPolyfill;
}

export const Buffer = BufferPolyfill;
