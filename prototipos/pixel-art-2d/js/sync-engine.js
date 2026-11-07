/**
 * PROJETO V.I.D.A. — CENTRAL MULTITELA DE SUSTENTABILIDADE
 * Sustentabilidade & Biotecnologia Aplicada
 * Motor de Sincronização em Tempo Real (TV Stand ⟷ Celular do Visitante)
 * Transporte híbrido: WebSocket (LAN/Wi-Fi) + BroadcastChannel + LocalStorage
 */

class VidaSyncEngine {
  constructor(options = {}) {
    this.role = options.role || 'tv'; // 'tv' ou 'mobile'
    this.sessionId = options.sessionId || this.generateSessionId();
    this.handlers = new Map();
    this.ws = null;
    this.broadcastChannel = null;
    this.isConnected = false;
    this.activeVisitor = null;
    this.idleTimer = null;
    this.idleTimeoutMs = 90000; // 90 segundos de inatividade para reset
    this.lastActivityTime = Date.now();

    this.initTransports();
    this.startHeartbeat();
  }

  generateSessionId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `VIDA-${code}`;
  }

  initTransports() {
    // 1. BroadcastChannel (Sincronização instantânea na mesma máquina)
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        this.broadcastChannel = new BroadcastChannel(`vida_sync_${this.sessionId}`);
        this.broadcastChannel.onmessage = (event) => {
          this.handleIncomingMessage(event.data, 'broadcast');
        };
      }
    } catch (e) {
      console.warn("BroadcastChannel não suportado:", e);
    }

    // 2. LocalStorage StorageEvent Fallback
    window.addEventListener('storage', (event) => {
      if (event.key === `vida_sync_event_${this.sessionId}` && event.newValue) {
        try {
          const msg = JSON.parse(event.newValue);
          this.handleIncomingMessage(msg, 'storage');
        } catch (e) {}
      }
    });

    // 3. WebSocket (Para conexões entre dispositivos na rede Wi-Fi / LAN)
    this.connectWebSocket();
  }

  connectWebSocket() {
    if (window.location.protocol === 'file:') return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws?role=${this.role}&session=${this.sessionId}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.emit('connection_status', { connected: true, transport: 'websocket' });
        this.sendRaw({
          type: 'REGISTER_ROLE',
          role: this.role,
          sessionId: this.sessionId
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleIncomingMessage(msg, 'websocket');
        } catch (e) {}
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.emit('connection_status', { connected: false, transport: 'websocket' });
        setTimeout(() => this.connectWebSocket(), 3000);
      };

      this.ws.onerror = () => {
        this.isConnected = false;
      };
    } catch (e) {
      console.warn("WebSocket indisponível, utilizando BroadcastChannel.");
    }
  }

  handleIncomingMessage(msg, transportSource) {
    if (!msg || !msg.type) return;

    // Ignora mensagens enviadas pelo próprio dispositivo
    if (msg.senderRole === this.role) return;

    this.lastActivityTime = Date.now();
    this.resetIdleTimer();

    // Eventos de Conexão e Sessão
    if (msg.type === 'VISITOR_JOIN_REQUEST') {
      if (this.role === 'tv') {
        this.activeVisitor = msg.visitor || { nome: 'Visitante' };
        this.send('VISITOR_JOIN_ACCEPTED', {
          sessionId: this.sessionId,
          visitor: this.activeVisitor
        });
        this.emit('visitor_connected', this.activeVisitor);
      }
    } else if (msg.type === 'VISITOR_JOIN_ACCEPTED') {
      if (this.role === 'mobile') {
        this.emit('session_accepted', msg.payload);
      }
    } else if (msg.type === 'visitor_ready') {
      if (this.role === 'tv') {
        this.emit('visitor_ready', msg.payload || {});
      }
    } else if (msg.type === 'VISITOR_DISCONNECT') {
      if (this.role === 'tv') {
        this.activeVisitor = null;
        this.emit('visitor_disconnected', {});
      }
    }

    // Dispara handlers registrados
    this.emit(msg.type, msg.payload, transportSource);
  }

  send(type, payload = {}) {
    this.lastActivityTime = Date.now();
    this.resetIdleTimer();

    const message = {
      type,
      sessionId: this.sessionId,
      senderRole: this.role,
      timestamp: Date.now(),
      payload
    };

    this.sendRaw(message);
  }

  sendRaw(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch (e) {}
    }

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(message);
      } catch (e) {}
    }

    try {
      localStorage.setItem(`vida_sync_event_${this.sessionId}`, JSON.stringify(message));
    } catch (e) {}
  }

  on(type, callback) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type).push(callback);
  }

  emit(type, data, source) {
    if (this.handlers.has(type)) {
      this.handlers.get(type).forEach(cb => {
        try {
          cb(data, source);
        } catch (e) {
          console.error(`Erro no handler do evento ${type}:`, e);
        }
      });
    }
  }

  startHeartbeat() {
    setInterval(() => {
      if (this.role === 'mobile' && this.isConnected) {
        this.send('HEARTBEAT', { time: Date.now() });
      }
    }, 12000);
  }

  resetIdleTimer() {
    clearTimeout(this.idleTimer);
    if (this.role === 'tv' && this.activeVisitor) {
      this.idleTimer = setTimeout(() => {
        console.log("Tempo limite de inatividade atingido. Retornando ao Modo de Espera.");
        this.activeVisitor = null;
        this.emit('session_timeout', {});
        this.send('SESSION_TIMEOUT_FORCE', {});
      }, this.idleTimeoutMs);
    }
  }

  disconnect() {
    this.send('VISITOR_DISCONNECT', {});
    this.activeVisitor = null;
    clearTimeout(this.idleTimer);
  }
}

window.VidaSyncEngine = VidaSyncEngine;
