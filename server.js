/**
 * PROJETO V.I.D.A. — SERVIDOR DE REDE LOCAL & WEBSOCKET EM TEMPO REAL
 * Sustentabilidade & Biotecnologia Aplicada • Projetec 2026
 * 
 * Funcionalidades:
 * 1. Servidor HTTP estático de alta performance.
 * 2. Suporte obrigatório a Range Requests (HTTP 206) para streaming fluido do vídeo MP4 (iOS Safari e Android).
 * 3. Servidor WebSocket (ws) para sincronização ultrarrápida TV ⟷ Celular na rede Wi-Fi / LAN.
 * 4. Detecção automática de IP local (ex: 192.168.1.14) e API /api/network-info.
 * 5. Gerenciamento estrito de sessões com Single Active Visitor Lock (evita conflito entre múltiplos celulares).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { WebSocketServer, WebSocket } = require('ws');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname);

// Tipos MIME suportados
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.jfif': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8'
};

// Detecção automática dos IPs da máquina na rede local
function getLocalNetworkIps() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  let preferredIp = '127.0.0.1';

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        ips.push({ iface: name, ip: net.address });
        if (!preferredIp || preferredIp === '127.0.0.1' || name.toLowerCase().includes('wi-fi') || name.toLowerCase().includes('wlan') || name.toLowerCase().includes('eth')) {
          preferredIp = net.address;
        }
      }
    }
  }

  return { preferredIp, allIps: ips };
}

// ----------------------------------------------------------------------------
// SERVIDOR HTTP COM SUPORTE A RANGE REQUESTS (206)
// ----------------------------------------------------------------------------
const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Redirecionamento 301/302 de /pixel-art-2d para /pixel-art-2d/ (com barra final)
  if (pathname === '/pixel-art-2d' || pathname === '/tela2' || pathname === '/prototipo-pixel-art') {
    res.writeHead(302, { 'Location': `${pathname}/${parsedUrl.search || ''}` });
    res.end();
    return;
  }

  // Headers de CORS para a rede local da feira
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. Endpoint de API: Informações de Rede para o QR Code da TV
  if (pathname === '/api/network-info') {
    const netInfo = getLocalNetworkIps();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ip: netInfo.preferredIp,
      port: PORT,
      allIps: netInfo.allIps,
      tvUrl: `http://${netInfo.preferredIp}:${PORT}/`,
      mobileUrl: `http://${netInfo.preferredIp}:${PORT}/controle.html`,
      bioUrl: `http://${netInfo.preferredIp}:${PORT}/biotecnologia`
    }));
    return;
  }

  // 1.1 Endpoint de API: Ranking Global Compartilhado (GET & POST)
  const RANKING_FILE = fs.existsSync(path.join(ROOT_DIR, 'site', 'data', 'ranking.json')) ? path.join(ROOT_DIR, 'site', 'data', 'ranking.json') : path.join(ROOT_DIR, 'data', 'ranking.json');

  if (pathname === '/api/ranking') {
    if (req.method === 'GET') {
      fs.readFile(RANKING_FILE, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify([]));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      });
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const newRecord = JSON.parse(body);
          if (!newRecord.nome) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Nome obrigatório' }));
            return;
          }

          let ranking = [];
          if (fs.existsSync(RANKING_FILE)) {
            try {
              ranking = JSON.parse(fs.readFileSync(RANKING_FILE, 'utf8'));
            } catch (e) {
              ranking = [];
            }
          }

          const record = {
            id: newRecord.id || `rank_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            nome: String(newRecord.nome).slice(0, 32),
            avatar: newRecord.avatar || '🌱',
            modo: newRecord.modo || 'Quiz de Sustentabilidade',
            categoria: newRecord.categoria || 'Sustentabilidade',
            dificuldade: newRecord.dificuldade || 'Médio',
            acertos: Number(newRecord.acertos) || 0,
            totalQuestoes: Number(newRecord.totalQuestoes) || 20,
            notaFinal: String(newRecord.notaFinal || '0.0'),
            tempoSegundos: Number(newRecord.tempoSegundos) || 0,
            tempoFormatado: newRecord.tempoFormatado || '00m 00s',
            data: new Date().toLocaleDateString('pt-BR'),
            timestamp: Date.now()
          };

          ranking.push(record);

          // Ordenação: Maior nota primeiro; desempate por menor tempo
          ranking.sort((a, b) => {
            const notaDiff = parseFloat(b.notaFinal) - parseFloat(a.notaFinal);
            if (Math.abs(notaDiff) > 0.01) return notaDiff;
            return a.tempoSegundos - b.tempoSegundos;
          });

          // Limitar aos top 150 participantes da feira
          ranking = ranking.slice(0, 150);

          fs.writeFileSync(RANKING_FILE, JSON.stringify(ranking, null, 2), 'utf8');

          // Broadcast via WebSocket para todos os navegadores abertos (TV, celulares, computadores)
          const broadcastMsg = JSON.stringify({
            type: 'RANKING_UPDATED',
            payload: { ranking, newEntry: record }
          });
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcastMsg);
            }
          });

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, ranking, added: record }));
        } catch (postErr) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: postErr.message }));
        }
      });
      return;
    }
  }

  // 2. Atalhos amigáveis e Mapeamento de Prefixo do Protótipo Pixel Art 2D
  if (pathname === '/' || pathname === '/tv') {
    pathname = '/site/index.html';
  } else if (pathname === '/ranking-tv' || pathname === '/ranking') {
    pathname = '/site/index.html';
  } else if (pathname === '/controle' || pathname === '/mobile') {
    pathname = '/site/controle.html';
  } else if (pathname === '/galeria') {
    pathname = '/prototipos/galeria-screenshots/index.html';
  } else if (pathname === '/screenshots' || pathname === '/screenshots/') {
    pathname = '/screenshots/index.html';
  } else if (pathname === '/site-informativo' || pathname === '/site-informativo/' || pathname === '/biotecnologia' || pathname === '/sustentabilidade' || pathname === '/informativo') {
    pathname = '/site-informativo/index.html';
  } else if (pathname === '/pixel-art-2d' || pathname === '/pixel-art-2d/' || pathname === '/tela2' || pathname === '/prototipo-pixel-art') {
    pathname = '/prototipos/pixel-art-2d/index.html';
  } else if (pathname === '/pixel-art-2d/controle' || pathname === '/tela2/controle') {
    pathname = '/prototipos/pixel-art-2d/controle.html';
  } else if (pathname.startsWith('/pixel-art-2d/')) {
    pathname = `/prototipos/pixel-art-2d/${pathname.slice(14)}`;
  } else if (!pathname.startsWith('/site') && !pathname.startsWith('/site-informativo') && !pathname.startsWith('/prototipos') && !pathname.startsWith('/screenshots') && !pathname.startsWith('/api') && pathname !== '/ws') {
    // Se o navegador requisitar recursos relativos (css, js, public, etc.)
    const siteCandidate = path.join(ROOT_DIR, 'site', pathname);
    const prototipoCandidate = path.join(ROOT_DIR, 'prototipos', 'pixel-art-2d', pathname);
    if (fs.existsSync(siteCandidate)) {
      pathname = `/site${pathname}`;
    } else if (fs.existsSync(prototipoCandidate)) {
      pathname = `/prototipos/pixel-art-2d${pathname}`;
    }
  }

  // Normalização do caminho seguro no disco
  let safePath = path.normalize(path.join(ROOT_DIR, pathname));

  // Proteção contra path traversal
  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Acesso Negado');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Arquivo não encontrado: ${pathname}`);
      return;
    }

    if (stats.isDirectory()) {
      safePath = path.join(safePath, 'index.html');
      fs.stat(safePath, (errDir, statsDir) => {
        if (errDir) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`404 Diretório sem index.html`);
          return;
        }
        serveFile(req, res, safePath, statsDir);
      });
      return;
    }

    serveFile(req, res, safePath, stats);
  });
});

function serveFile(req, res, filePath, stats) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const totalSize = stats.size;
  const rangeHeader = req.headers.range;

  // Suporte a HTTP 206 Partial Content (Essencial para vídeos no Safari iOS / Chrome Mobile)
  if (rangeHeader && ext === '.mp4') {
    const parts = rangeHeader.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

    if (start >= totalSize || end >= totalSize || start > end) {
      res.writeHead(416, {
        'Content-Range': `bytes */${totalSize}`
      });
      res.end();
      return;
    }

    const chunkSize = end - start + 1;
    const stream = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${totalSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    stream.pipe(res);
    stream.on('error', (streamErr) => {
      console.error('[HTTP] Erro ao transmitir vídeo range:', streamErr.message);
      if (!res.headersSent) {
        res.writeHead(500);
        res.end();
      }
    });
    return;
  }

  // Resposta padrão 200 OK
  res.writeHead(200, {
    'Content-Length': totalSize,
    'Content-Type': contentType,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-cache'
  });

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
  stream.on('error', (streamErr) => {
    console.error('[HTTP] Erro ao ler arquivo:', streamErr.message);
    if (!res.headersSent) {
      res.writeHead(500);
      res.end();
    }
  });
}

// ----------------------------------------------------------------------------
// SERVIDOR WEBSOCKET COM SINGLE ACTIVE VISITOR LOCK
// ----------------------------------------------------------------------------
const wss = new WebSocketServer({ server });

// Registro de sessões ativas: sessionId => { tv: ws, activeVisitor: ws, queue: [ws, ...] }
const sessionRegistry = new Map();

function getSessionData(sessionId) {
  if (!sessionRegistry.has(sessionId)) {
    sessionRegistry.set(sessionId, {
      tv: null,
      activeVisitor: null,
      queue: []
    });
  }
  return sessionRegistry.get(sessionId);
}

wss.on('connection', (ws, req) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  ws.role = parsedUrl.searchParams.get('role') || 'unknown';
  ws.sessionId = parsedUrl.searchParams.get('session') || null;

  console.log(`[WS] Nova conexão: papel=${ws.role}, sessão=${ws.sessionId} (Total online: ${wss.clients.size})`);

  if (ws.sessionId) {
    const sData = getSessionData(ws.sessionId);
    if (ws.role === 'tv') {
      sData.tv = ws;
    } else if (ws.role === 'mobile') {
      // Se já houver um visitante ativo nessa sessão
      if (sData.activeVisitor && sData.activeVisitor !== ws && sData.activeVisitor.readyState === WebSocket.OPEN) {
        sData.queue.push(ws);
        ws.isQueued = true;
        console.log(`[WS] Sessão ${ws.sessionId} ocupada. Visitante adicionado à fila (Posição: ${sData.queue.length})`);
        ws.send(JSON.stringify({
          type: 'SESSION_BUSY',
          sessionId: ws.sessionId,
          payload: {
            message: 'O stand está sendo explorado por outro visitante. Aguarde alguns instantes.',
            queuePos: sData.queue.length
          }
        }));
      } else {
        sData.activeVisitor = ws;
        ws.isQueued = false;
        console.log(`[WS] Visitante assumiu o controle ativo da sessão ${ws.sessionId}`);
        ws.send(JSON.stringify({
          type: 'SESSION_ACCEPTED',
          sessionId: ws.sessionId,
          payload: { status: 'active' }
        }));
      }
    }
  }

  ws.on('message', (data) => {
    try {
      const msgStr = data.toString('utf8');
      const msgObj = JSON.parse(msgStr);

      if (msgObj.type === 'REGISTER_ROLE') {
        ws.role = msgObj.role || ws.role;
        ws.sessionId = msgObj.sessionId || ws.sessionId;
        const sData = getSessionData(ws.sessionId);
        if (ws.role === 'tv') {
          sData.tv = ws;
        }
      }

      if (msgObj.sessionId && !ws.sessionId) {
        ws.sessionId = msgObj.sessionId;
      }

      // Se for um visitante na fila, ignora comandos de controle na TV
      if (ws.isQueued && msgObj.type !== 'HEARTBEAT') {
        return;
      }

      // Retransmite mensagem para os outros nós da mesma sessão
      const targetSession = ws.sessionId;
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          if (!targetSession || !client.sessionId || client.sessionId === targetSession) {
            client.send(msgStr);
          }
        }
      });
    } catch (err) {
      console.warn('[WS] Erro ao processar mensagem JSON:', err.message);
    }
  });

  const handleDisconnect = () => {
    console.log(`[WS] Conexão encerrada: papel=${ws.role}, sessão=${ws.sessionId}`);
    
    if (ws.sessionId) {
      const sData = getSessionData(ws.sessionId);

      if (ws.role === 'mobile') {
        // Se era o visitante ativo
        if (sData.activeVisitor === ws) {
          sData.activeVisitor = null;

          // Notifica a TV que o visitante saiu
          const disconnectMsg = JSON.stringify({
            type: 'VISITOR_DISCONNECT',
            sessionId: ws.sessionId,
            senderRole: 'mobile',
            payload: {}
          });
          if (sData.tv && sData.tv.readyState === WebSocket.OPEN) {
            sData.tv.send(disconnectMsg);
          }

          // Se houver próximo na fila, promove para ativo
          while (sData.queue.length > 0) {
            const nextClient = sData.queue.shift();
            if (nextClient && nextClient.readyState === WebSocket.OPEN) {
              sData.activeVisitor = nextClient;
              nextClient.isQueued = false;
              console.log(`[WS] Promovendo próximo visitante da fila para a sessão ${ws.sessionId}`);
              nextClient.send(JSON.stringify({
                type: 'SESSION_FREE',
                sessionId: ws.sessionId,
                payload: { status: 'promoted' }
              }));
              break;
            }
          }
        } else {
          // Remove da fila caso estivesse esperando
          const qIdx = sData.queue.indexOf(ws);
          if (qIdx !== -1) {
            sData.queue.splice(qIdx, 1);
          }
        }
      } else if (ws.role === 'tv') {
        sData.tv = null;
      }
    }
  };

  ws.on('close', handleDisconnect);
  ws.on('error', handleDisconnect);
});

// Inicializa o servidor ouvindo em todas as interfaces de rede (0.0.0.0)
server.listen(PORT, '0.0.0.0', () => {
  const netInfo = getLocalNetworkIps();
  console.log(`\n================================================================`);
  console.log(`🌿 PROJETO V.I.D.A. — CENTRAL MULTITELA DO PARQUE REALENGO`);
  console.log(`================================================================`);
  console.log(`📡 Servidor ativo na porta ${PORT}`);
  console.log(`🖥️  TELA 1 (Televisão do Stand):  http://localhost:${PORT}/`);
  console.log(`📱 TELA 2 (Celular do Visitante): http://${netInfo.preferredIp}:${PORT}/controle.html`);
  console.log(`🔄 WebSocket em tempo real:        ws://${netInfo.preferredIp}:${PORT}/ws`);
  console.log(`🖼️  Galeria de Screenshots:        http://localhost:${PORT}/galeria`);
  console.log(`🌐 TELA 3 (Biotecnologia & Sustentabilidade - Bio Nova): http://localhost:${PORT}/site-informativo/`);
  console.log(`🎨 TELA 2 (Protótipo Pixel Art 2D): http://localhost:${PORT}/pixel-art-2d`);
  console.log(`----------------------------------------------------------------`);
  console.log(`✨ IPs de rede disponíveis:`);
  netInfo.allIps.forEach(i => console.log(`   - Interface [${i.iface}]: http://${i.ip}:${PORT}/`));
  console.log(`================================================================\n`);
});
