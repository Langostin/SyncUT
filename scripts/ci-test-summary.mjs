// Convierte el reporte JUnit de Vitest en una tabla Markdown para el resumen
// del job en GitHub Actions ($GITHUB_STEP_SUMMARY).
// Uso: node scripts/ci-test-summary.mjs <reporte.xml> "<Título>"
import fs from "node:fs";

const [, , file, title = "Resultados de pruebas"] = process.argv;

if (!file || !fs.existsSync(file)) {
  console.log(`## ${title}\n\n⚠️ No se generó el reporte de pruebas (${file}).`);
  process.exit(0);
}

const xml = fs.readFileSync(file, "utf8");
const decode = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const cases = [...xml.matchAll(/<testcase\b([^>]*?)(\/>|>([\s\S]*?)<\/testcase>)/g)].map((m) => {
  const attr = (name) => decode(m[1].match(new RegExp(`\\s${name}="([^"]*)"`))?.[1] ?? "");
  const body = m[3] ?? "";
  const status = /<(failure|error)\b/.test(body) ? "❌" : /<skipped\b/.test(body) ? "⏭️" : "✅";
  const [suite, ...rest] = attr("name").split(" > ");
  return { suite: rest.length ? suite : attr("classname"), name: rest.join(" > ") || suite, time: Number(attr("time")) * 1000, status };
});

const passed = cases.filter((c) => c.status === "✅").length;
const failed = cases.filter((c) => c.status === "❌").length;
const icon = failed ? "❌" : "✅";

const lines = [
  `## ${icon} ${title}`,
  "",
  `**${passed} de ${cases.length} pruebas aprobadas**${failed ? ` · ${failed} fallidas` : ""}`,
  "",
  "| Estado | Grupo | Prueba | Tiempo |",
  "|:---:|---|---|---:|",
  ...cases.map(
    (c) => `| ${c.status} | ${c.suite.replace(/\|/g, "\\|")} | ${c.name.replace(/\|/g, "\\|")} | ${c.time.toFixed(1)} ms |`
  ),
  "",
];

console.log(lines.join("\n"));
