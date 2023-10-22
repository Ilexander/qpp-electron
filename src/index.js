const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require("path");
const { electron } = require("process");
const fs = require("fs");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const initialFiles = [
  {
    name: "example",
    type: "csv",
    text: `Username; Identifier;First name;Last name
    booker12;9012;Rachel;Booker
    grey07;2070;Laura;Grey
    johnson81;4081;Craig;Johnson
    jenkins46;9346;Mary;Jenkins
    smith79;5079;Jamie;Smith`,
  },
  {
    name: "example-1",
    type: "csv",
    text: `,First Name,Last Name,Gender,Country,Age,Date,Id
    1,Dulce,Abril,Female,United States,32,15/10/2017,1562
    2,Mara,Hashimoto,Female,Great Britain,25,16/08/2016,1582
    3,Philip,Gent,Male,France,36,21/05/2015,2587
    4,Kathleen,Hanner,Female,United States,25,15/10/2017,3549
    5,Nereida,Magwood,Female,United States,58,16/08/2016,2468
    6,Gaston,Brumm,Male,United States,24,21/05/2015,2554
    7,Etta,Hurn,Female,Great Britain,56,15/10/2017,3598
    8,Earlean,Melgar,Female,United States,27,16/08/2016,2456
    9,Vincenza,Weiland,Female,United States,40,21/05/2015,6548
    10,Fallon,Winward,Female,Great Britain,28,16/08/2016,5486
    11,Arcelia,Bouska,Female,Great Britain,39,21/05/2015,1258
    12,Franklyn,Unknow,Male,France,38,15/10/2017,2579
    13,Sherron,Ascencio,Female,Great Britain,32,16/08/2016,3256
    14,Marcel,Zabriskie,Male,Great Britain,26,21/05/2015,2587
    15,Kina,Hazelton,Female,Great Britain,31,16/08/2016,3259
    16,Shavonne,Pia,Female,France,24,21/05/2015,1546
    17,Shavon,Benito,Female,France,39,15/10/2017,3579
    18,Lauralee,Perrine,Female,Great Britain,28,16/08/2016,6597
    19,Loreta,Curren,Female,France,26,21/05/2015,9654
    20,Teresa,Strawn,Female,France,46,21/05/2015,3569
    21,Belinda,Partain,Female,United States,37,15/10/2017,2564
    22,Holly,Eudy,Female,United States,52,16/08/2016,8561
    23,Many,Cuccia,Female,Great Britain,46,21/05/2015,5489
    24,Libbie,Dalby,Female,France,42,21/05/2015,5489
    25,Lester,Prothro,Male,France,21,15/10/2017,6574
    26,Marvel,Hail,Female,Great Britain,28,16/08/2016,5555
    27,Angelyn,Vong,Female,United States,29,21/05/2015,6125`,
  },
];

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "QAPP",
    titleBarOverlay: "QAPP",
    titleBarStyle: "hiddenInset",
    frame: false,
    icon: path.join(__dirname, "images/favicon.ico"),
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  ipcMain.on("closeApp", () => {
    mainWindow.close();
    mainWindow.maximize();
  });

  ipcMain.on("maximizeApp", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on("hideApp", () => {
    mainWindow.minimize();
  });

  fs.stat("/saves", async (e) => {
    if (!e) return;

    if (e?.code === "ENOENT") {
      fs.mkdir(path.join("saves"), (err) => {
        if (err) {
          return console.error(err);
        }

        initialFiles.forEach((el) => {
          fs.writeFileSync(
            path.join(`saves/${el.name}.${el.type}`),
            el.text.replaceAll("    ", "")
          );
        });
      });
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL("http://127.0.0.1:5173/");
  // mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
