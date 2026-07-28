import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import { sites } from "./build/sites-vite-plugin";

const workerConfig = {
  name: "server",
  main: "./worker/index.ts",
  compatibility_date: "2026-05-22",
  compatibility_flags: ["nodejs_compat"],
  assets: {
    binding: "ASSETS",
    run_worker_first: true,
  },
};

export default defineConfig({
  plugins: [
    sites(),
    cloudflare({
      config: workerConfig,
    }),
  ],
});
