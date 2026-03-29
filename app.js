const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'experiences.json');

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const defaultData = {
  sites: ['레뷰', '링블', '강남맛집체험단'],
  types: ['방문형', '배송형', '구매형'],
  items: []
};

const ensureDataFile = () => {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
  }
};

const readData = () => {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      sites: Array.isArray(parsed.sites) ? parsed.sites : defaultData.sites,
      types: Array.isArray(parsed.types) ? parsed.types : defaultData.types,
      items: Array.isArray(parsed.items) ? parsed.items : []
    };
  } catch {
    return defaultData;
  }
};

const writeData = (data, cb) => {
  ensureDataFile();
  fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8', cb);
};

const sendJson = (res, status, payload) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
};

const server = http.createServer((req, res) => {
  if (req.url === '/api/data' && req.method === 'GET') {
    return sendJson(res, 200, readData());
  }

  if (req.url === '/api/data' && req.method === 'PUT') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        const input = JSON.parse(body || '{}');
        const data = {
          sites: Array.isArray(input.sites) ? input.sites : defaultData.sites,
          types: Array.isArray(input.types) ? input.types : defaultData.types,
          items: Array.isArray(input.items) ? input.items : []
        };

        writeData(data, (err) => {
          if (err) return sendJson(res, 500, { error: '저장 중 오류가 발생했습니다.' });
          return sendJson(res, 200, { ok: true });
        });
      } catch {
        return sendJson(res, 400, { error: '잘못된 JSON 형식입니다.' });
      }
    });
    return;
  }

  const requestPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(__dirname, 'public', decodeURIComponent(requestPath));

  if (!filePath.startsWith(path.join(__dirname, 'public'))) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 - 접근이 허용되지 않습니다.');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 - 페이지를 찾을 수 없습니다.');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 - 서버 에러가 발생했습니다.');
      }
      return;
    }

    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
    res.end(content);
  });
});

server.listen(PORT, () => {
  ensureDataFile();
  console.log(`Server running at http://localhost:${PORT}`);
});
