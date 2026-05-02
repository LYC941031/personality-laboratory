import { compileMDX } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content");

export async function getMdxContent(
  subdir: "types" | "solutions",
  slug: string
) {
  const filePath = path.join(contentDir, subdir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const source = fs.readFileSync(filePath, "utf-8");

  const { content, frontmatter } = await compileMDX<{
    title: string;
    description: string;
  }>({
    source,
    options: { parseFrontmatter: true },
  });

  return { content, frontmatter };
}

export function getAllMdxSlugs(subdir: "types" | "solutions"): string[] {
  const dir = path.join(contentDir, subdir);

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}
