import { NextResponse } from "next/server";

import { formatFileSize, getAssetList } from "@/lib/server/admin";

export async function GET() {
  const assets = await getAssetList();

  return NextResponse.json(
    assets.map((item) => ({
      ...item,
      readableSize: formatFileSize(item.filesize),
    })),
  );
}
