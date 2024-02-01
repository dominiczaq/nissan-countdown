import z from "zod";

const fetchKmSchema = z.array(
  z.object({
    updatedAt: z.string().datetime(),
    value: z.number(),
  })
);

export async function fetchKm() {
  return fetch("/api/km")
    .then((data) => data.json())
    .then((data) => fetchKmSchema.parse(data));
}
