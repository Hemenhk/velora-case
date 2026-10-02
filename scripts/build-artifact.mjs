// Bundles the Next.js flow into one self-contained HTML file for the Claude artifact preview.
// Same components, same Tailwind CSS; Next.js routing is the only thing left out.
import { build } from "esbuild";
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

mkdirSync(".artifact", { recursive: true });

const js = await build({
  entryPoints: ["artifact/main.tsx"],
  bundle: true,
  minify: true,
  format: "iife",
  write: false,
  jsx: "automatic",
  target: "es2020",
  tsconfig: "tsconfig.json",
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "error",
});

execSync("npx @tailwindcss/cli -i app/globals.css -o .artifact/app.css --minify", { stdio: "inherit" });
const css = readFileSync(".artifact/app.css", "utf8");

const font = readFileSync(
  "node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2",
).toString("base64");

const html = `<title>Vägen in till Velora</title>
<style>
@font-face{font-family:"Fraunces Variable";font-style:normal;font-display:swap;font-weight:100 900;src:url(data:font/woff2;base64,${font}) format("woff2-variations"),url(data:font/woff2;base64,${font}) format("woff2");}
${css}
</style>
<div id="root"></div>
<script>${js.outputFiles[0].text.replace(/<\/script/gi, "<\\/script")}</script>
`;

writeFileSync(".artifact/velora-flow.html", html);
console.log(`Wrote .artifact/velora-flow.html (${(html.length / 1024).toFixed(0)} KB)`);