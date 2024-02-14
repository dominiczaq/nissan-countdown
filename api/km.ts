import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "@vercel/postgres";
import { z } from "zod";

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
  const insertSchema = z.object({
    // updatedAt: z.string().datetime(),
    value: z.coerce.number(),
  });
  const { value } = insertSchema.parse(request.body);
  console.log("value", value);
  return response.status(200).json({
    value,
    updatedAt: new Date().toISOString(),
  });
  // const secret = request.headers["secret-header"];
  // if (secret !== process.env.SECRET_HEADER) {
  //   console.error("Unauthorized access", secret);
  //   return response.status(401);
  // }
  // const insertSchema = z.object({
  //   updatedAt: z.string().datetime(),
  //   value: z.coerce.number(),
  // });
  // const { updatedAt, value } = insertSchema.parse(request.body);
  // const { rowCount } =
  //   await sql`INSERT INTO km_entries (updated_at, value) VALUES (${updatedAt}, ${value})`;

  // return response.status(200).json(rowCount);
}

// table initialized with create table below
/*
const res = await sql`CREATE TABLE km_entries (
    id SERIAL PRIMARY KEY,
    updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    value INTEGER NOT NULL
);`;
*/
