'use strict';

const TOKEN = 'token';
const TOKEN_LENGTH = 80;
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const DIGIT = '0123456789';
const ALPHA_DIGIT = ALPHA + DIGIT;

const generateToken = () => {
  const base = ALPHA_DIGIT.length;
  let token = new Array(TOKEN_LENGTH);
  for (let i = 0; i < TOKEN_LENGTH; ++i)
  {
    const index = ((bytes[i] * base) / BYTE) | 0;
    token[i] = ALPHA_DIGIT[index];
  }
  return token;
};
