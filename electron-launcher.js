import { spawn } from 'child_process';
import net from 'net';

// Start Express dev server using tsx
const devServer = spawn('npx', ['tsx', 'server.ts'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

// Check if port 3000 is active, then launch Electron
function checkServer() {
  const socket = new net.Socket();
  socket.connect(3000, 'localhost', () => {
    socket.destroy();
    console.log('[Launcher] Port 3000 active, launching Electron client...');
    
    // Spawn electron pointing to the root directory
    const electronApp = spawn('npx', ['electron', '.'], {
      stdio: 'inherit'
    });

    electronApp.on('close', () => {
      console.log('[Launcher] Electron client closed. Shutting down dev server...');
      devServer.kill();
      process.exit();
    });
  });

  socket.on('error', () => {
    // Retry check in 200ms
    setTimeout(checkServer, 200);
  });
}

checkServer();
