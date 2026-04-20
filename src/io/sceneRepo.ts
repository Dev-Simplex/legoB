import { openDB, type IDBPDatabase } from 'idb';
import type { Scene } from '../types/domain';

const DB_NAME = 'legob';
const SCHEMA_VERSION = 1;
const SCENES = 'scenes';
const KV = 'kv';

type LegobDb = IDBPDatabase<unknown>;

let dbPromise: Promise<LegobDb> | null = null;

function db(): Promise<LegobDb> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, SCHEMA_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(SCENES)) {
          const store = db.createObjectStore(SCENES, { keyPath: 'id' });
          store.createIndex('updatedAt', 'updatedAt');
        }
        if (!db.objectStoreNames.contains(KV)) {
          db.createObjectStore(KV);
        }
      },
    });
  }
  return dbPromise;
}

export type SceneSummary = Pick<Scene, 'id' | 'name' | 'updatedAt' | 'thumbnail'>;

export const sceneRepo = {
  async save(scene: Scene): Promise<void> {
    const conn = await db();
    await conn.put(SCENES, { ...scene, updatedAt: Date.now(), schemaVersion: SCHEMA_VERSION });
    // Best-effort persistence grant (non-blocking).
    try {
      if (navigator.storage?.persist) {
        await navigator.storage.persist();
      }
    } catch {
      /* ignore */
    }
  },

  async load(id: string): Promise<Scene | null> {
    const conn = await db();
    return ((await conn.get(SCENES, id)) as Scene | undefined) ?? null;
  },

  async list(): Promise<SceneSummary[]> {
    const conn = await db();
    const all = (await conn.getAll(SCENES)) as Scene[];
    return all
      .map((s) => ({ id: s.id, name: s.name, updatedAt: s.updatedAt, thumbnail: s.thumbnail }))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  },

  async delete(id: string): Promise<void> {
    const conn = await db();
    await conn.delete(SCENES, id);
  },

  async rename(id: string, name: string): Promise<void> {
    const conn = await db();
    const existing = (await conn.get(SCENES, id)) as Scene | undefined;
    if (!existing) return;
    await conn.put(SCENES, { ...existing, name, updatedAt: Date.now() });
  },
};
