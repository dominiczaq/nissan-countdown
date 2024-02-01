import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  return response.status(200).json([
    { updatedAt: new Date("2024-02-01T11:28"), value: 12_695 },
    { updatedAt: new Date("2024-01-31T12:09"), value: 12_604 },
    { updatedAt: new Date("2024-01-30T13:21"), value: 12_503 },
  ]);
}
