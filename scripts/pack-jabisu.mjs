// Builds the folder a host unpacks and runs with its own Node: the server and
// its production dependencies as a .zip, next to the SHA-256 the host checks.
// Photo labeling and terminal pictures stay out, and with them every native
// binary, so the same archive runs on any Node 20+ the host brings.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const stage = join(root, "build", "jabisu");
const { version } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
// npm is a .cmd shim on Windows and needs a shell to start.
const run = (cmd, args, cwd = root) =>
  execFileSync(cmd, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });

run("npm", ["run", "build"]);

rmSync(stage, { recursive: true, force: true });
mkdirSync(join(stage, "build"), { recursive: true });
for (const file of ["package.json", "package-lock.json", "LICENSE", "THIRD_PARTY_NOTICES.md"])
  cpSync(join(root, file), join(stage, file));
cpSync(join(root, "dist"), join(stage, "dist"), {
  recursive: true,
  filter: (src) => !src.endsWith(".map"),
});
for (const file of ["parts.json", "viewer.html", "standalone.html"])
  cpSync(join(root, "build", file), join(stage, "build", file));
cpSync(
  join(root, "node_modules", "@fontsource", "nanum-pen-script", "LICENSE"),
  join(stage, "LICENSE.nanum-pen-script"),
);
cpSync(join(root, "node_modules", "@fontsource", "kalam", "LICENSE"), join(stage, "LICENSE.kalam"));

run("npm", ["ci", "--omit=dev", "--ignore-scripts", "--no-audit", "--no-fund"], stage);
// Loaded only for photos and terminal pictures, which this bundle leaves off.
for (const native of ["sharp", "@img", "@resvg"])
  rmSync(join(stage, "node_modules", native), { recursive: true, force: true });

const out = join(root, `sketchy-${version}.zip`);
rmSync(out, { force: true });
// bsdtar writes zip. Windows 10+ ships it in System32; a GNU tar earlier on
// PATH (Git Bash) cannot, so name it. macOS has it as tar.
const tar =
  process.platform === "win32" ? join(process.env.SystemRoot, "System32", "tar.exe") : "tar";
execFileSync(tar, ["-a", "-c", "-f", out, "-C", stage, "."], { stdio: "inherit" });
const sha256 = createHash("sha256").update(readFileSync(out)).digest("hex");
writeFileSync(`${out}.sha256`, `${sha256}  sketchy-${version}.zip\n`);
console.error(`pack-jabisu: wrote ${out}\nsha256 ${sha256}`);
