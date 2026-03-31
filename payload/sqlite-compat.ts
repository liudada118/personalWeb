import { existsSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const lockedDocumentRelationColumns = ["media_id", "media_posts_id", "articles_id", "page_content_id"] as const;

function resolveSqliteFilePath(databaseUrl: string) {
  if (databaseUrl.startsWith("file:")) {
    const relativePath = databaseUrl.replace(/^file:(\/\/)?/, "");
    return path.isAbsolute(relativePath) ? relativePath : path.resolve(process.cwd(), relativePath);
  }

  return path.isAbsolute(databaseUrl) ? databaseUrl : path.resolve(process.cwd(), databaseUrl);
}

export async function ensurePayloadSQLiteCompatibility(databaseUrl: string) {
  const dbPath = resolveSqliteFilePath(databaseUrl);

  if (!existsSync(dbPath)) {
    return;
  }

  const db = new DatabaseSync(dbPath);

  try {
    const lockedDocsTable = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
      .get("payload_locked_documents_rels");

    if (!lockedDocsTable) {
      return;
    }

    const columns = new Set(
      db
        .prepare("PRAGMA table_info(payload_locked_documents_rels)")
        .all()
        .map((row) => String((row as { name: string }).name)),
    );

    for (const column of lockedDocumentRelationColumns) {
      if (!columns.has(column)) {
        db.exec(`ALTER TABLE payload_locked_documents_rels ADD COLUMN ${column} INTEGER`);
      }

      db.exec(
        `CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_${column}_idx ON payload_locked_documents_rels (${column})`,
      );
    }
  } finally {
    db.close();
  }
}
