import "dotenv/config";
import argon2 from "argon2";

const password = process.argv[2] ?? "password123";
const hash = await argon2.hash(password);
console.log(hash);
