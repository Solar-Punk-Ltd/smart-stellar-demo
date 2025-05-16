import React, { FormEvent, useState, useEffect } from 'react';
import {useKeyIdStore} from '../store/keyId';
import {useContractIdStore} from '../store/contractId';
import { chat } from "../utils/chat";
import { account, server } from "../utils/passkey-kit";
import { generateAndStoreKeypair, getStoredPublicKeys, signWithStoredKey } from '../utils/keypairUtils';
import { SignerStore } from '@solarpunkltd/passkey-kit';

let sending = false;
let sessionKey: string | null = null;

export default function MessageForm() {
    const [msg, setMsg] = useState("");

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
     
        const formData = new FormData(event.currentTarget)   
        let msg = formData.get('msg') as string;
        const formKeyId = formData.get('kid') as string;
        const formContractId = formData.get('cid') as string;
    
        if (!formContractId || !formKeyId) return {
            addr: '',
            msg: '',
        };
    
        try {
            sending = true;

            let at = await chat.send({
                addr: formContractId,
                msg,
            });

            const storedKeys = await getStoredPublicKeys();
            console.log("Stored keys:", storedKeys);
            if (storedKeys.length < 1) {
                console.log("No stored keys found, creating new key");
                const initSessionKey = async () => {
                    console.log('Initializing Stellar session key...');
                    try {
                      // Check if we already have a session key
                      const existingKeys = await getStoredPublicKeys();
                      console.log('Existing session keys:', existingKeys);
              
                      if (existingKeys.length === 0) {
                        console.log('No session key found, generating new one...');
                        const publicKey = await generateAndStoreKeypair();
                        console.log('Generated and stored new session key with public key:', publicKey);
                      } else {
                        console.log('Using existing session key with public key:', existingKeys[0].publicKey);
                      }
                    } catch (error) {
                      console.error('Error initializing Stellar session key:', error);
                    }
                  };
              
                await initSessionKey();
                const storedKeys = await getStoredPublicKeys();
                console.log("Stored keys after init:", storedKeys);

                const { sequence } = await account.rpc.getLatestLedger()
                const kat = await account.addEd25519(storedKeys[0].publicKey, undefined, SignerStore.Temporary, sequence + 360000);

                await account.sign(kat, { keyId: formKeyId });
                const res = await server.send(kat);
                console.log(res);
                sessionKey = res.keyId;
            }

            const storedKeys2 = await getStoredPublicKeys();
            if (storedKeys2.length > 0) {
                at = await signWithStoredKey(storedKeys2[0].id, at);
                console.log("Signed with stored key");
                console.log(at);
            } else {
                at = await account.sign(at, { keyId: formKeyId });
                console.error("Signed with key");
                console.error(at);
            }

            await server.send(at);

            msg = "";
        } catch (error) {
            console.error("An error occurred:", error);
        } finally {
            sending = false;
        }

        setMsg("");    
        return {
            addr: formData.get('addr') as string,
            msg: formData.get('msg') as string,
        }
      }

    const keyId = useKeyIdStore((state) => state.keyId)
    const contractId = useContractIdStore((state) => state.contractId)

    return (
        <form className="flex flex-col mt-5" onSubmit={onSubmit}>
            <textarea
                className="border px-3 py-1 mb-2 border-gray-400 rounded-lg"
                rows={4}
                name="msg"
                id="msg"
                placeholder="Type your message..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
            ></textarea>
            <input type='hidden' id="kid" name="kid" value={keyId} />
            <input type='hidden' id="cid" name="cid" value={contractId} />
            <div className="flex items-center ml-auto">
                <button
                    className="bg-black text-white px-2 py-1 text-sm font-mono disabled:bg-gray-400"
                    type="submit"
                    disabled={sending}
                >
                    Send{sending ? "ing..." : ""}
                </button>
            </div>
        </form>
    )
}
