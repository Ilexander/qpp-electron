const { contextBridge, ipcRenderer } = require("electron");
const path = require("path");
const fs = require("fs");

contextBridge.exposeInMainWorld("electron", {
  closeApp: () => {
    ipcRenderer.send("closeApp");
  },

  maximizeApp: () => {
    ipcRenderer.send("maximizeApp");
  },

  hideApp: () => {
    ipcRenderer.send("hideApp");
  },

  getFiles: async (dir = "saves") => {
    const files = await Promise.all(
      fs.readdirSync(path.join(dir)).map(async (file) => {
        const data = await new Promise((resolve) => {
          fs.stat(path.join(dir + "/" + file), (err, stats) => {
            if (err?.code) return null;
            const { mtime, ctime, size } = stats;

            resolve({
              ctime,
              size,
              etime: mtime,
              dir: stats.isDirectory(),
              file: stats.isFile(),
              name: file,
              type: stats.isDirectory() ? "dir" : file.split(".").at(-1),
            });
          });
        });

        return data;
      })
    );

    return files;
  },
  writeFile(pathToDir, data) {
    const readyPath = path.join("saves/", pathToDir);
    fs.writeFileSync(readyPath, data);
  },
  readFile(pathToDir) {
    const readyPath = path.join("saves/", pathToDir);
    return fs.readFileSync(readyPath, 'utf8');
  },
  createFile(pathToDir, name, type) {
    const readyPath = path.join("saves/" + pathToDir, name + `.${type}`);
    fs.writeFileSync(readyPath, "");
  },

  createDir(pathToDir, dirname) {
    const readyPath = path.join("saves/" + pathToDir, dirname);
    fs.mkdirSync(readyPath);
  },
});
