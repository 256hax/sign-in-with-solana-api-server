import * as dotenv from 'dotenv'

// --- Solana ---
import { Keypair } from '@solana/web3.js';

// --- Sign Message ---
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { decodeUTF8, encodeUTF8 } from 'tweetnacl-util';

// --- JWT ---
import jwt, { Algorithm } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { Router } from 'express';

dotenv.config();
export const router = Router();

// -----------------------------------------------
//  Config for test
// -----------------------------------------------
// User KeyPair
const keypair = Keypair.fromSecretKey(
  Uint8Array.from([42, 10, 22, 97, 116, 115, 107, 57, 226, 247, 40, 179, 216, 11, 216, 9, 110, 233, 110, 240, 85, 78, 144, 173, 253, 79, 75, 12, 175, 216, 43, 214, 245, 164, 74, 111, 54, 131, 150, 17, 113, 31, 4, 20, 159, 81, 221, 64, 109, 212, 188, 82, 203, 134, 242, 13, 210, 177, 22, 8, 166, 44, 126, 233])
);
// -> HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg

// Message
const message: string = 'f07e210c-652b-4578-aff3-0a1ae2ce8165';

router.post('/create-message', async (req, res, next) => {
  try {
    res.header('Content-Type', 'application/json; charset=utf-8');

    return res.json({ message });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Normally, sign message using wallet app(e.g. Phantom) in frontend.
// Example: https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/react/connect_wallet/solana-wallet-adapter/src/components/SignMessageButton.tsx
router.post('/sign-message', async (req, res, next) => {
  try {
    res.header('Content-Type', 'application/json; charset=utf-8');

    // -----------------------------------------------
    //  Get Request
    // -----------------------------------------------
    const { message } = req.body;

    // -----------------------------------------------
    //  Sign Message
    // -----------------------------------------------
    const messageBytes = decodeUTF8(message);
    const signedMessageSignature = nacl.sign.detached(messageBytes, keypair.secretKey);

    const signature = bs58.encode(signedMessageSignature);

    return res.json({ signature });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.post('/verify-signature', async (req, res, next) => {
  try {
    res.header('Content-Type', 'application/json; charset=utf-8');

    // -----------------------------------------------
    //  Get Request
    // -----------------------------------------------
    const { signature } = req.body;

    // -----------------------------------------------
    //  Verify Signature
    // -----------------------------------------------
    // Normally, verify signature in backend server.
    const verified = nacl.sign.detached.verify(
      decodeUTF8(message), // Message
      bs58.decode(signature), // Signature
      keypair.publicKey.toBytes() // PublicKey
    );

    return res.json({ verified });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.post('/sign-in', async (req, res, next) => {
  try {
    res.header('Content-Type', 'application/json; charset=utf-8');

    // ----------------------------------------
    //  Authentication
    // ----------------------------------------
    // Sign message by user and verify signature by provider, then
    //  true(passing auth): run create token
    //  false(failed auth): return failed authentication error
    // 
    // To make it easier to understand, we will skip authentication.
    // Please do not forget implementation for authentication.

    const userAddress = keypair.publicKey.toString(); // For test.

    // ----------------------------------------
    //  Create Token(JWT)
    // ----------------------------------------
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET not found.');

    const payload = {
      address: userAddress,
    };

    const options = {
      algorithm: process.env.JWT_ALGORITHM as Algorithm,
      issuer: process.env.JWT_ISSUER, // Issuer mail address
      audience: process.env.JWT_AUDIENCE, // Web domain
      // subject: userId, // User unique ID
      jwtid: uuidv4(), // Token random unique ID
      expiresIn: process.env.JWT_EXPIRES_IN,
    };

    const token = jwt.sign(payload, jwtSecret, options);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      // secure: true, // Recommend activation
    });
    // Decode token tool: https://jwt.io/

    return res.json(token);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Normally, decode JWT in frontend.
router.get('/verify-jwt', async (req, res, next) => {
  try {
    res.header('Content-Type', 'application/json; charset=utf-8');

    // -----------------------------------------------
    //  Get JWT from Cookie
    // -----------------------------------------------
    // req.cookies.token means get key name "token" in cookie.
    const token = req.cookies.token;

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET not found.');

    const decoded = jwt.verify(token, jwtSecret);

    return res.json({ decoded });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});