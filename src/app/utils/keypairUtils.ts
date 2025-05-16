import { Keypair } from '@stellar/stellar-sdk';
import { account } from './passkey-kit';

// Initialize IndexedDB
const DB_NAME = 'StellarSessionStore';
const STORE_NAME = 'sessionKeys';
const DB_VERSION = 1;

const initDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

/**
 * Generates a new Stellar session key
 * @returns The public key of the generated session key
 */
export const generateAndStoreKeypair = async (): Promise<string> => {
  const keypair = Keypair.random();
  await saveKeypair(keypair);
  return keypair.publicKey();
};

/**
 * Saves a session key to IndexedDB
 */
const saveKeypair = async (keypair: Keypair): Promise<string> => {
  const db = await initDB();
  const id = crypto.randomUUID();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.add({
      id,
      publicKey: keypair.publicKey(),
      privateKey: keypair.secret(),
      createdAt: new Date().toISOString()
    });

    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Signs a transaction using a stored session key
 * @param keyId The ID of the stored session key to use for signing
 * @param transaction The transaction to sign
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const signWithStoredKey = async (keyId: string, transaction: any): Promise<any> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_NAME], 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(keyId);

    request.onsuccess = () => {
      const handleKey = async () => {
        const data = request.result;
        if (!data) {
          reject(new Error('Keypair not found'));
          return;
        }

        try {
          const keypair = Keypair.fromSecret(data.privateKey);

          // Sign the transaction
          await account.sign(transaction, {keypair});

          resolve(transaction);
        } catch (error) {
          reject(error);
        }
      };

      handleKey().catch(reject);
    };

    request.onerror = () => reject(request.error);
  });
};

/**
 * Gets all stored session public keys
 * @returns Array of public keys
 */
export const getStoredPublicKeys = async (): Promise<Array<{id: string, publicKey: string}>> => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_NAME], 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const keys = request.result.map(({ id, publicKey }) => ({ id, publicKey }));
      resolve(keys);
    };

    request.onerror = () => reject(request.error);
  });
};
