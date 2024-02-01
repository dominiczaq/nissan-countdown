import z from "zod";

const fetchKmSchema = z.array(
  z.object({
    updated_at: z.string().datetime(),
    value: z.number(),
  })
);

export async function fetchKm() {
  return fetch("/api/km")
    .then((data) => data.json())
    .then((data) =>
      fetchKmSchema
        .parse(data)
        .map((parsed) => ({
          value: parsed.value,
          updatedAt: parsed.updated_at,
        }))
    );
}
