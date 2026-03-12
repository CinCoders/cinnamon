import { execSync } from "node:child_process";
import fs from "node:fs";

execSync(
  "npx @tailwindcss/cli -i ./src/styles/cinnamon.css -o ./dist/cinnamon.raw.css --minify",
  { stdio: "inherit" }
);

let css = fs.readFileSync("./dist/cinnamon.raw.css", "utf8");

// Renomeia a declaração agregada de camadas, se existir
css = css.replace(
  /@layer\s+theme,\s*base,\s*components,\s*utilities\s*;/g,
  "@layer cinnamon-theme, cinnamon-base, cinnamon-components, cinnamon-utilities;"
);

// Renomeia camadas especiais do Tailwind para nomes da lib
css = css.replace(/@layer\s+base\b/g, "@layer cinnamon-base");
css = css.replace(/@layer\s+components\b/g, "@layer cinnamon-components");
css = css.replace(/@layer\s+utilities\b/g, "@layer cinnamon-utilities");
css = css.replace(/@layer\s+theme\b/g, "@layer cinnamon-theme");

fs.writeFileSync("./dist/cinnamon.css", css);
fs.rmSync("./dist/cinnamon.raw.css");