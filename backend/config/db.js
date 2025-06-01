import { neon } from "@neondatabase/serverless";

import "dotenv/config";

//CREATES SQL connection
export const sql = neon(process.env.DATABASE_URL);