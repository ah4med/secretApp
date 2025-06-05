import CryptoJs from "crypto-js";

export const encryptUtilFunction = async ({ value, secretKey } = {}) => {
  const encryptedValue = CryptoJs.AES.encrypt(
    JSON.stringify(value),
    secretKey
  ).toString();
  return encryptedValue;
};

export const decryptUtilFunction = async ({ cipher, secretKey } = {}) => {
  const decryptedValue = CryptoJs.AES.decrypt(cipher, secretKey).toString(
    CryptoJs.enc.Utf8
  );
  return decryptedValue;
};
