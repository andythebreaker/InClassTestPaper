import { app, BrowserWindow, BrowserView, ipcMain } from 'electron';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import express from 'express';
import cors from 'cors';
import getPort from 'get-port';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// 獲取 __dirname 的等效值
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var DEV_ENV = true;

(async () => {

  // 創建 Express 應用實例
  const server = express();
  
  server.use(cors());
  
  server.get('/urlHistory', async (req, res) => {
    await db.read();
    res.json(db.data.urlHistory);
  });
  
  var myport = 53843;
  
  myport = await getPort();

  const indexHtml = await getIndexHtml(myport);

  server.listen(myport, () => {
    console.log(`API server running on port ${myport}`);
  });
  const adapter = new JSONFile(path.join(app.getAppPath(), 'db.json'));
  //const adapter = new JSONFile('db.json');
  const db = new Low(adapter, { urlHistory: [] });  // 提供默認數據

  var main_height = 800;
  var main_width = Math.round((main_height / 9.0) * 16.0);

  async function getIndexHtml(port) {
    try {
      let htmlContent = await fs.readFile(path.join(app.getAppPath(), 'index.html'), 'utf-8');
      //let htmlContent = await fs.readFile(path.join(__dirname, 'index.html'), 'utf-8');
      return htmlContent.replace('{{PORT}}', port);
    } catch (err) {
      console.error('讀取 index.html 時發生錯誤:', err);
      return '';
    }
  }

  function index_html(xui) {
    xui.webContents.loadURL(index_html_str + String(myport) + index_html_str_port)
  }

  function createWindow() {
    // 創建主窗口
    const mainWindow = new BrowserWindow({
      width: main_width,
      height: main_height,
      webPreferences: {
        devTools: DEV_ENV ? true : false
      }
    })

    // 打開開發者工具
    if (DEV_ENV) {
      mainWindow.webContents.openDevTools()
    }

    // 創建左側視圖
    const leftView = new BrowserView()
    mainWindow.setBrowserView(leftView)  // 修改這裡
    leftView.setBounds({ x: 0, y: 0, width: main_width / 2, height: main_height * 0.8 })  // 修改這裡
    leftView.webContents.loadURL('https://andythebreaker.github.io/InClassTestPaper/')

    // 替換現有的 did-navigate 事件監聽器
    leftView.webContents.on('did-navigate-in-page', (event, url, isMainFrame) => {
      if (isMainFrame) {
        const timestamp = new Date().toISOString();
        // 檢查是否已存在相同的 URL
        const existingEntry = db.data.urlHistory.find(entry => entry.url === url);
        const highLight=false;
        if (!existingEntry) {
          db.data.urlHistory.push({ timestamp, url, highLight });
          db.write();
        }
      }
    });

    // 為左側視圖啟用開發者工具
    if (DEV_ENV) {
      leftView.webContents.openDevTools()
    }

    // 創建右側視圖
    const rightView = new BrowserView({
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    })
    mainWindow.addBrowserView(rightView)  // 修改這裡
    rightView.setBounds({ x: main_width / 2, y: 0, width: main_width / 2, height: main_height * 0.8 })  // 修改這裡
    
    rightView.webContents.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(indexHtml)}`);

    // 添加 IPC 監聽器
    ipcMain.on('redirect-left-view', (event, url) => {
      leftView.webContents.loadURL(url);
    });

    ipcMain.on('delete-url', (event, url) => {
      db.data.urlHistory = db.data.urlHistory.filter(entry => entry.url !== url);
      db.write();
    });

    ipcMain.on('highlight-url', (event, url) => {
      db.data.urlHistory.forEach(entry => {
        if (entry.url === url) {
          entry.highLight = entry.highLight?false:true;
        }
      });
      db.write();
    });

    // 修改右側視圖的預加載腳本
    rightView.webPreferences = {
      preload: path.join(app.getAppPath(), 'preload.js')
    };

    // 為右側視圖啟用開發者工具
    if (DEV_ENV) {
      rightView.webContents.openDevTools()
    }
  }

  app.whenReady().then(createWindow)

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })


  await db.read();
  db.data ||= { urlHistory: [] };
  await db.write();

  // 檢查數據庫是否為空，如果為空則初始化
  if (db.data === null) {
    db.data = { urlHistory: [] };
    await db.write();
  }

})();