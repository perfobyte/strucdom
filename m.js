// convert-ts-to-js.js
import fs from "fs";
import path from "path";

function walk(dir, callback) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) walk(full, callback);
    else callback(full);
  }
}

function replaceInFile(file, from, to) {
  const data = fs.readFileSync(file, "utf8");
  const updated = data.replace(from, to);
  if (data !== updated) fs.writeFileSync(file, updated);
}

function convert(root) {
  walk(root, (file) => {
    // 1. Удаляем тесты
    if (file.endsWith(".test.ts")) {
      fs.unlinkSync(file);
      return;
    }

    // 2. Преобразуем импорты
    if (file.endsWith(".ts")) {
      replaceInFile(file, /\.ts(['"])/g, ".js$1");
    }

    // 3. Переименовываем .ts → .js
    if (file.endsWith(".ts")) {
      const newPath = file.replace(/\.ts$/, ".js");
      fs.renameSync(file, newPath);
    }
  });
}

convert("./src"); // или путь к твоему проекту
