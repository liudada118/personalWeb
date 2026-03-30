#!/usr/bin/env node

const path = require("path");
const { spawn } = require("child_process");

const rawArgs = process.argv.slice(2);

function readValue(args, index) {
  const value = args[index + 1];

  if (!value || value.startsWith("-")) {
    throw new Error(`Missing value for ${args[index]}`);
  }

  return value;
}

function parseDevArgs(args) {
  const parsed = {
    hostname: process.env.HOST || undefined,
    port: Number.parseInt(process.env.PORT || "3000", 10),
    explicitPort: Boolean(process.env.PORT),
    turbopack: false,
    passthrough: [],
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--port" || arg === "-p") {
      parsed.port = Number.parseInt(readValue(args, index), 10);
      parsed.explicitPort = true;
      index += 1;
      continue;
    }

    if (arg.startsWith("--port=")) {
      parsed.port = Number.parseInt(arg.slice("--port=".length), 10);
      parsed.explicitPort = true;
      continue;
    }

    if (arg === "--hostname" || arg === "-H") {
      parsed.hostname = readValue(args, index);
      index += 1;
      continue;
    }

    if (arg.startsWith("--hostname=")) {
      parsed.hostname = arg.slice("--hostname=".length);
      continue;
    }

    if (arg === "--turbo" || arg === "--turbopack") {
      parsed.turbopack = true;
      parsed.passthrough.push(arg);
      continue;
    }

    parsed.passthrough.push(arg);
  }

  if (!Number.isFinite(parsed.port) || parsed.port <= 0) {
    throw new Error(`Invalid port: ${parsed.port}`);
  }

  return parsed;
}

function runNativeNextDev(args) {
  const nextBin = require.resolve("next/dist/bin/next");
  const child = spawn(process.execPath, [nextBin, "dev", ...args], {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
  });

  child.on("error", (error) => {
    console.error(error);
    process.exit(1);
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
}

async function runWindowsNextDev(args) {
  process.env.NODE_ENV = process.env.NODE_ENV || "development";

  if (args.turbopack) {
    process.env.TURBOPACK = "1";
  }

  const dir = process.cwd();
  const loadConfig = require("next/dist/server/config").default;
  const { setGlobal } = require("next/dist/trace/shared");
  const { startServer } = require("next/dist/server/lib/start-server");

  const config = await loadConfig("phase-development-server", dir);
  const distDir = path.join(dir, config.distDir || ".next");

  setGlobal("phase", "phase-development-server");
  setGlobal("distDir", distDir);

  if (args.passthrough.length > 0) {
    console.warn(
      `> Windows dev launcher ignored unsupported Next dev args: ${args.passthrough.join(" ")}`
    );
  }

  console.log("> Windows dev launcher active (single-process Next.js)");

  await startServer({
    dir,
    port: args.port,
    allowRetry: !args.explicitPort,
    isDev: true,
    hostname: args.hostname,
  });
}

async function main() {
  const args = parseDevArgs(rawArgs);

  if (process.platform !== "win32") {
    runNativeNextDev(rawArgs);
    return;
  }

  await runWindowsNextDev(args);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
