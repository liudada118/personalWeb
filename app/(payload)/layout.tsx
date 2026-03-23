import "./payload-admin.css";
import "./payload-workbench.css";

import config from "@payload-config";
import { RootLayout, handleServerFunctions, metadata } from "@payloadcms/next/layouts";
import type { ServerFunctionClientArgs } from "payload";

import { importMap } from "./cms/admin/importMap";

export { metadata };

async function serverFunction(args: ServerFunctionClientArgs) {
  "use server";

  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
}

export default function PayloadRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
