import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    summary: z.string(),
    author: z.string().default("Guild Officers"),
    draft: z.boolean().default(false),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/resources" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      author: z.string().default("Broken Banner"),
      description: z.string(),
      externalUrl: z.string().url().optional(),
      category: z.enum(["guides", "tools", "addons"]).optional(),
      cover: image(),
      coverAlt: z.string().optional(),
    }),
});

export const collections = { news, resources };
