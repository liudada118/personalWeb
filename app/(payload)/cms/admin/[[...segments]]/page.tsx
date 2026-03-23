import config from "@payload-config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";

import { importMap } from "../importMap";

type PayloadAdminPageProps = {
  params: Promise<{
    segments?: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export function generateMetadata({ params, searchParams }: PayloadAdminPageProps) {
  return generatePageMetadata({
    config,
    params,
    searchParams,
  });
}

export default function PayloadAdminPage({ params, searchParams }: PayloadAdminPageProps) {
  const normalizedParams = params.then((value) => {
    // Keep root admin requests as `undefined` so Payload resolves `/cms/admin`
    // instead of normalizing to `/cms/admin/`, which breaks dashboard matching.
    if (value.segments?.length) {
      return {
        segments: value.segments,
      };
    }

    return {} as { segments: string[] };
  });

  return <RootPage config={config} importMap={importMap} params={normalizedParams} searchParams={searchParams} />;
}
