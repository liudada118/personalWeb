import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDirectory = path.join(process.cwd(), "data");

async function ensureDirectory() {
  await mkdir(dataDirectory, { recursive: true });
}

export async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  await ensureDirectory();
  const target = path.join(dataDirectory, filename);

  try {
    const content = await readFile(target, "utf8");
    return JSON.parse(content) as T;
  } catch {
    await writeJsonFile(filename, fallback);
    return fallback;
  }
}

export async function writeJsonFile<T>(filename: string, value: T) {
  await ensureDirectory();
  const target = path.join(dataDirectory, filename);
  await writeFile(target, JSON.stringify(value, null, 2), "utf8");
}
