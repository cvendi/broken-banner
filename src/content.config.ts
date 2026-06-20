import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      author: z.string().default("Broken Banner"),
      pubDate: z.coerce.date(),
      description: z.string(),
      externalUrl: z.string().url().optional(),
      category: z.enum(["guides", "tools", "addons", "guild news"]).optional(),
      cover: image(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { news };
