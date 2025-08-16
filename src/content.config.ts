import { file, glob } from "astro/loaders";
import { defineCollection, z, reference } from "astro:content";
import type { icons as lucideIcons } from '@iconify-json/lucide/icons.json';
import type { icons as simpleIcons } from '@iconify-json/simple-icons/icons.json';
import type { icons as bootstrapIcons } from '@iconify-json/bi/icons.json';

const other = defineCollection({
  loader: glob({ base: "src/content/other", pattern: "**/*.{md,mdx}" }),
});

const lucideIconSchema = z.object({
  type: z.literal("lucide"),
  name: z.custom<keyof typeof lucideIcons>(),
});

const simpleIconSchema = z.object({
  type: z.literal("simple-icons"),
  name: z.custom<keyof typeof simpleIcons>(),
});

const bootstrapIconSchema = z.object({
  type: z.union([z.literal("bi"), z.literal("bootstrap")]),
  name: z.custom<keyof typeof bootstrapIcons>(),
});

const iconSchema = z.union([lucideIconSchema, simpleIconSchema, bootstrapIconSchema]);

const quickInfo = defineCollection({
  loader: file("src/content/info.json"),
  schema: z.object({
    id: z.number(),
    icon: iconSchema,
    text: z.string(),
  })
});

const socials = defineCollection({
  loader: file("src/content/socials.json"),
  schema: z.object({
    id: z.number(),
    icon: iconSchema,
    text: z.string(),
    link: z.string().url(),
  })
});

const workExperience = defineCollection({
  loader: file("src/content/work.json"),
  schema: z.object({
    id: z.number(),
    title: z.string(),
    company: z.string(),
    duration: z.string(),
    description: z.string(),
  })
});

const tags = defineCollection({
  loader: file("src/content/tags.json"),
  schema: z.object({
    id: z.string()
  })
});

const posts = defineCollection({
  loader: glob({ base: "src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    description: z.string(),
    tags: z.array(
      reference("tags")
    ),
    draft: z.boolean().optional().default(false),
    image: image(),
  })
});

const projects = defineCollection({
  loader: glob({ base: "src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    image: image(),
    link: z.string().url().optional(),
    info: z.array(
      z.object({
        text: z.string(),
        icon: iconSchema,
        link: z.string().url().optional(),
      })
    )
  })
});

export const collections = { tags, posts, projects, other, quickInfo, socials, workExperience };