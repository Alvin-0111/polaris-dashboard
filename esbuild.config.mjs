import esbuild from "esbuild";
import { copyFileSync } from "node:fs";

async function build() {
  try {
    await esbuild.build({
      entryPoints: ["src/main.ts"],
      bundle: true,
      outfile: "dist/main.js",
      platform: "node",
      target: "es2020",
      external: ["obsidian"],
      format: "cjs",
      minify: false
    });
    copyFileSync("styles.css", "dist/styles.css");
    console.log("✅构建成功：dist/main.js + styles.css");
  } catch (e) {
    console.error("❌构建失败", e);
    process.exit(1);
  }
}

build();
