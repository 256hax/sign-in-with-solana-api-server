import * as dotenv from 'dotenv'

// --- JWT ---
import jwt, { Algorithm } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { Router } from 'express';

dotenv.config();
export const router = Router();

router.post('/sign-in', async (req, res, next) => {
  try {
    res.header('Content-Type', 'application/json; charset=utf-8');

    // Validation
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET not found.');

    const userAddress = 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg';

    // Create JWT
    const payload = {
      address: userAddress,
    };

    const options = {
      algorithm: process.env.JWT_ALGORITHM as Algorithm,
      issuer: process.env.JWT_ISSUER, // Issuer mail address
      audience: process.env.JWT_AUDIENCE, // Web domain
      subject: userAddress, // User unique ID
      jwtid: uuidv4(), // Token random unique ID
      expiresIn: process.env.JWT_EXPIRES_IN,
    };

    const token = jwt.sign(payload, jwtSecret, options);

    // Set cookie
    res.cookie('token', token, { httpOnly: true });

    return res.json(token);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});