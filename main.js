const { app, BrowserWindow, Menu, shell, Tray } = require("electron");
const path = require("path");

let tray = null; // Variável para armazenar a instância da bandeja
let win = null; // Variável para armazenar a instância da janela

// Função para resolver caminhos absolutos
const resolveAssetPath = (asset) =>
  app.isPackaged
    ? path.join(process.resourcesPath, asset)
    : path.join(__dirname, asset);

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  win.loadFile("index.html");

  // Menu template com um botão personalizado
  const menu = Menu.buildFromTemplate([
    {
      label: "Sobre",
      submenu: [
        {
          label: "Sobre Square Cloud",
          click: () => {
            shell.openExternal("https://squarecloud.app/");
          },
        },
        {
          label: "Sobre mim",
          click: () => {
            shell.openExternal("https://jeiel.pages.dev");
          },
        },
      ],
    },
  ]);

  // Definir o menu da aplicação
  Menu.setApplicationMenu(menu);

  // Evento para minimizar a janela ao fechar
  win.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      win.hide();
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  // Criar a bandeja
  tray = new Tray(resolveAssetPath("logo.png")); // Caminho dinâmico para o logo
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Abrir",
      click: () => {
        win.show();
      },
    },
    {
      label: "Sair",
      click: () => {
        app.isQuiting = true; // Define a flag para indicar que a aplicação deve sair
        app.quit();
      },
    },
  ]);

  tray.setToolTip("Minha Aplicação Electron");
  tray.setContextMenu(contextMenu);

  // Evento de clique na bandeja
  tray.on("click", () => {
    win.isVisible() ? win.hide() : win.show();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
