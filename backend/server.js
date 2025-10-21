const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { exec } = require('child_process');

const app = express();
const port = 3000;

// 데이터베이스 경로 설정
const dbPath = path.resolve(__dirname, 'db', 'od.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// 정적 파일 제공
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

app.get('/api/players', (req, res) => {
  db.all('SELECT * FROM players', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

app.get('/', (req, res) => {
  res.send('Hello from DotaSpammerFinder Backend!');
});

app.get('/api/update-db', (req, res) => {
  const pythonScriptPath = path.resolve(__dirname, 'DbMaker', 'update.py');
  
  // 가상 환경이 있다면 활성화 후 실행해야 할 수도 있습니다.
  // 예: 'source venv/bin/activate && python3 ...'
  exec(`python3 ${pythonScriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing python script: ${error}`);
      return res.status(500).send('Error updating database');
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.send('Database update process started.');
  });
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});