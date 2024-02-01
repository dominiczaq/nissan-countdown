import dotenvExpand from "dotenv-expand";
import { defineConfig, loadEnv } from "vite";
import solidPlugin from "vite-plugin-solid";
// import devtools from 'solid-devtools/vite';

export default defineConfig(({ mode }) => {
  // Only modify process.env in development mode
  if (mode === "development") {
    const env = loadEnv(mode, process.cwd(), "");
    dotenvExpand.expand({ parsed: env });
  }

  return {
    plugins: [
      /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
      // devtools(),
      solidPlugin(),
    ],
    server: {
      port: 3000,
    },
    build: {
      target: "esnext",
    },
  };
});
