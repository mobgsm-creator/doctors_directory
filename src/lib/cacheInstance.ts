// lib/cache-instance.ts
import NodeCache from 'node-cache';

// Use globalThis to prevent HMR from creating new instances
const globalForCache = globalThis as unknown as {
  dataCache: NodeCache | undefined;
};

export const dataCache = globalForCache.dataCache ?? new NodeCache({ 
  stdTTL: 3600,
  checkperiod: 600,
});

if (process.env.NODE_ENV !== 'production') {
  globalForCache.dataCache = dataCache;
}

export default dataCache;