import { \ } from 'react-native-virgil-crypto';

const virgilCrypto = new VirgilCrypto();

// 👉 Replace with your actual Base64 public key from the server
const PUBLIC_KEY_BASE64 = 'MCowBQYDK2VwAyEAYourBase64PublicKey==';

// Import public key once
const publicKey: VirgilPublicKey = virgilCrypto.importPublicKey(
  Buffer.from(PUBLIC_KEY_BASE64, 'base64')
);

/**
 * Encrypt text using the common public key.
 * Returns Base64-encoded encrypted string.
 */
export const encryptData = (plainText: string): string => {
  if (!plainText) return '';
  const encryptedData = virgilCrypto.encrypt(plainText, publicKey);
  return encryptedData.toString('base64');
};
