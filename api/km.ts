import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "@vercel/postgres";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
);

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method === "POST") {
    return post(request, response);
  }

  const { rows } =
    await sql`SELECT id, updated_at, value FROM km_entries ORDER BY updated_at DESC LIMIT 10;`;
  return response.status(200).json(rows);
}

async function post(request: VercelRequest, response: VercelResponse) {
  const sessionJwt = request.headers["session"];
  if (typeof sessionJwt !== "string") {
    return response.status(401);
  }
  const {
    data: { user },
  } = await supabase.auth.getUser(sessionJwt);
  if (!user || user.role !== "authenticated" || !user.email) {
    return response.status(401);
  }
  const insertSchema = z.object({
    value: z.coerce.number(),
  });
  const { value } = insertSchema.parse(request.body);
  const updatedAt = new Date().toISOString();
  const addedBy = user.email;
  const { rowCount } =
    await sql`INSERT INTO km_entries (updated_at, value, added_by) VALUES (${updatedAt}, ${value}, ${addedBy})`;

  return response.status(200).json({
    value,
    updatedAt,
    addedBy,
  });
}

// table initialized with create table below
/*
const res = await sql`CREATE TABLE km_entries (
    id SERIAL PRIMARY KEY,
    updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    value INTEGER NOT NULL
);`;

const res =
    await sql`alter TABLE km_entries ADD COLUMN added_by VARCHAR(255) DEFAULT '';`;
*/
