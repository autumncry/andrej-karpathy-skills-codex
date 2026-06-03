#!/usr/bin/env node
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { cpSync, lstatSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { homedir } from "node:os";

const MARKETPLACE = "andrej-karpathy-skills-codex";
const PLUGIN = "karpathy-guidelines";
const SELECTOR = `${PLUGIN}@${MARKETPLACE}`;
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BROKEN_MARKETPLACE = Symbol("broken marketplace");
const pluginManifestPath = resolve(
  packageRoot,
  "plugins/karpathy-guidelines/.codex-plugin/plugin.json"
);

function codexHome() {
  return process.env.CODEX_HOME || resolve(homedir(), ".codex");
}

function marketplaceRoot() {
  return resolve(codexHome(), "plugin-marketplaces", MARKETPLACE);
}

function ensureMarketplaceRoot() {
  const root = marketplaceRoot();
  mkdirSync(dirname(root), { recursive: true });
  try {
    lstatSync(root);
    rmSync(root, { recursive: true, force: true });
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
  cpSync(packageRoot, root, {
    recursive: true,
    filter: (source) => {
      const relativeSource = source.slice(packageRoot.length);
      return !relativeSource.startsWith("/.git")
        && !relativeSource.endsWith(".tgz")
        && !relativeSource.startsWith("/node_modules");
    }
  });
  return root;
}

function printHelp() {
  console.log(`karpathy-guidelines

Usage:
  karpathy-guidelines setup   Register the Codex marketplace and install the skill plugin
  karpathy-guidelines doctor  Check Codex marketplace and plugin state
  karpathy-guidelines --help  Show this help
  karpathy-guidelines --version
`);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? packageRoot,
    encoding: "utf8"
  });

  return {
    command: [command, ...args].join(" "),
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    error: result.error
  };
}

function printResult(result) {
  if (result.stdout.trim()) {
    console.log(result.stdout.trim());
  }
  if (result.stderr.trim()) {
    console.error(result.stderr.trim());
  }
}

function fail(message, result) {
  console.error(`\n${message}`);
  if (result) {
    console.error(`Command: ${result.command}`);
    printResult(result);
  }
  process.exit(1);
}

function requireCodex() {
  const version = run("codex", ["--version"]);
  if (version.error?.code === "ENOENT") {
    fail("Codex CLI was not found on PATH. Install and authenticate Codex first.");
  }
  if (version.status !== 0) {
    fail("Codex CLI is installed but did not respond successfully.", version);
  }
  return version.stdout.trim() || version.stderr.trim();
}

function marketplaceList(options = {}) {
  const result = run("codex", ["plugin", "marketplace", "list"]);
  if (result.status !== 0) {
    if (options.allowBroken && result.stderr.includes(`\`${MARKETPLACE}\``)) {
      return BROKEN_MARKETPLACE;
    }
    fail("Could not read Codex plugin marketplaces.", result);
  }
  return result.stdout;
}

function pluginList() {
  const result = run("codex", ["plugin", "list"]);
  if (result.status !== 0) {
    fail("Could not read Codex plugins.", result);
  }
  return result.stdout;
}

function desiredPluginVersion() {
  return JSON.parse(readFileSync(pluginManifestPath, "utf8")).version;
}

function getMarketplaceRoot(options = {}) {
  const output = marketplaceList(options);
  if (output === BROKEN_MARKETPLACE) {
    return BROKEN_MARKETPLACE;
  }

  const line = output
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(`${MARKETPLACE} `));

  if (!line) {
    return null;
  }

  return line.trim().slice(MARKETPLACE.length).trim();
}

function installedPluginLine() {
  return pluginList()
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(`${SELECTOR} `));
}

function isInstalledEnabled(line) {
  return Boolean(line?.includes("installed, enabled"));
}

function hasInstalledPlugin() {
  const line = installedPluginLine();
  return isInstalledEnabled(line) && line.includes(` ${desiredPluginVersion()} `);
}

function removeInstalledPlugin(message, options = {}) {
  const line = installedPluginLine();
  if (!isInstalledEnabled(line)) {
    return;
  }
  if (!options.force && line.includes(` ${desiredPluginVersion()} `)) {
    return;
  }

  console.log(message);
  const removePlugin = run("codex", ["plugin", "remove", SELECTOR]);
  if (removePlugin.status !== 0) {
    fail("Failed to remove the existing Karpathy Guidelines plugin.", removePlugin);
  }
  printResult(removePlugin);
}

function setup() {
  requireCodex();
  const root = marketplaceRoot();

  const existingRoot = getMarketplaceRoot({ allowBroken: true });
  if (existingRoot === root) {
    ensureMarketplaceRoot();
    console.log(`Marketplace ${MARKETPLACE} is already registered at ${root}.`);
  } else {
    if (existingRoot === BROKEN_MARKETPLACE) {
      console.log(`Removing broken marketplace ${MARKETPLACE}.`);
      const removeMarketplace = run("codex", ["plugin", "marketplace", "remove", MARKETPLACE]);
      if (removeMarketplace.status !== 0) {
        fail("Failed to remove the broken marketplace before reinstalling.", removeMarketplace);
      }
      printResult(removeMarketplace);
    } else if (existingRoot) {
      console.log(`Updating marketplace ${MARKETPLACE} from ${existingRoot} to ${root}.`);
      removeInstalledPlugin(`Removing existing plugin ${SELECTOR} before updating marketplace root.`, {
        force: true
      });

      const removeMarketplace = run("codex", ["plugin", "marketplace", "remove", MARKETPLACE]);
      if (removeMarketplace.status !== 0) {
        fail("Failed to remove the existing marketplace before updating.", removeMarketplace);
      }
      printResult(removeMarketplace);
    }

    const addMarketplace = run("codex", ["plugin", "marketplace", "add", ensureMarketplaceRoot()]);
    if (addMarketplace.status !== 0) {
      fail("Failed to register the Codex plugin marketplace.", addMarketplace);
    }
    printResult(addMarketplace);
  }

  removeInstalledPlugin(`Refreshing plugin ${SELECTOR} to version ${desiredPluginVersion()}.`);

  if (hasInstalledPlugin()) {
    console.log(`Plugin ${SELECTOR} is already installed and enabled.`);
  } else {
    const addPlugin = run("codex", ["plugin", "add", SELECTOR]);
    if (addPlugin.status !== 0) {
      fail("Failed to install the Karpathy Guidelines plugin.", addPlugin);
    }
    printResult(addPlugin);
  }

  doctor();
}

function checkManualInvocationPolicy() {
  const yamlPath = resolve(
    packageRoot,
    "plugins/karpathy-guidelines/skills/karpathy-guidelines/agents/openai.yaml"
  );
  const yaml = readFileSync(yamlPath, "utf8");
  return yaml.includes("allow_implicit_invocation: false");
}

function doctor() {
  const codexVersion = requireCodex();
  const checks = [
    ["Codex CLI", Boolean(codexVersion), codexVersion],
    ["Marketplace registered", getMarketplaceRoot() === marketplaceRoot(), MARKETPLACE],
    ["Plugin installed and enabled", hasInstalledPlugin(), SELECTOR],
    ["Manual invocation policy", checkManualInvocationPolicy(), "allow_implicit_invocation: false"]
  ];

  let failed = false;
  for (const [label, ok, detail] of checks) {
    const marker = ok ? "ok" : "fail";
    console.log(`${marker} ${label}${detail ? ` - ${detail}` : ""}`);
    failed = failed || !ok;
  }

  if (failed) {
    console.error("\nRun `karpathy-guidelines setup` to register and install the plugin.");
    process.exit(1);
  }
}

function version() {
  const pkg = JSON.parse(readFileSync(resolve(packageRoot, "package.json"), "utf8"));
  console.log(pkg.version);
}

const command = process.argv[2] ?? "--help";

switch (command) {
  case "setup":
    setup();
    break;
  case "doctor":
    doctor();
    break;
  case "--version":
  case "-v":
  case "version":
    version();
    break;
  case "--help":
  case "-h":
  case "help":
    printHelp();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    printHelp();
    process.exit(1);
}
