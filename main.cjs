const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let serverProcess = null;
let mainWindow = null;

// Determine if we are in development mode
const isDev = process.env.NODE_ENV !== 'production';

function startServer() {
  if (isDev) {
    // In dev, the launcher starts the server, so we don't start a duplicate here
    return;
  }

  // Find the compiled server path
  const serverPath = path.join(__dirname, 'dist', 'server.cjs');
  if (!fs.existsSync(serverPath)) {
    console.error(`Compiled server not found at: ${serverPath}. Run npm run build first.`);
    return;
  }

  console.log(`[Electron Main] Starting production Express server: ${serverPath}`);
  
  serverProcess = spawn('node', [serverPath], {
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: '3000'
    }
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`[Express Server]: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`[Express Server Error]: ${data}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 850,
    title: "Vellum & Vestige Art Director Suite",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Give the server 1.5 seconds to start up in production, or load immediately in dev
  const delay = isDev ? 0 : 1500;
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000').catch((err) => {
      console.error("Failed to load URL:", err);
      // Fallback reload
      setTimeout(() => mainWindow.loadURL('http://localhost:3000'), 1000);
    });
  }, delay);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
