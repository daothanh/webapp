import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "prefix" | "presets" | "content"> = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  // prefix: "ui-",
  presets: [sharedConfig],
};

export default config;