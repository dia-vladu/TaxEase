import { lib } from "crypto-js";

function ensureSecretKey() {
  let secretKeyString = process.env.SECRET_KEY;
  
  if (!secretKeyString) {
    const secretKey = lib.WordArray.random(16);
    secretKeyString = secretKey.toString();
    process.env.SECRET_KEY = secretKeyString;
    console.log("New secret key generated");
  }

  return secretKeyString;
}

export default ensureSecretKey;