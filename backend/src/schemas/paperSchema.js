import { z } from "zod";

export const paperSchema = z.object({
  title: z.string(),

  authors: z.array(z.string()),

  publication_year: z.string(),

  research_problem: z.string(),

  objectives: z.array(z.string()),

  topics: z.array(z.string()),

  methodology: z.string(),

  dataset: z.string(),

  findings: z.array(z.string()),

  limitations: z.array(z.string()),

  references: z.array(z.string()),
});
