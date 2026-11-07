/**
 * ECOCITY PIXEL ART — INTERFACE DO CONTROLE MOBILE (CELULAR DO VISITANTE)
 */

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session') || 'VIDA-ECOCITY';

  const sync = new VidaSyncEngine({ role: 'mobile', sessionId });

  const screenLogin = document.getElementById('screen-login');
  const screenGame = document.getElementById('screen-game');
  const inputName = document.getElementById('input-name');
  const btnJoin = document.getElementById('btn-join');
  const roleChoices = document.querySelectorAll('.role-choice-card');
  const playerTag = document.getElementById('player-tag');
  const roleTag = document.getElementById('role-tag');
  const mobileButtonsList = document.getElementById('mobile-buttons-list');
  const actionToast = document.getElementById('action-toast');
  const connBadge = document.getElementById('conn-badge');

  let selectedRole = 'coop_p1';

  // Seleção visual dos papéis
  roleChoices.forEach(card => {
    card.addEventListener('click', () => {
      roleChoices.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedRole = card.dataset.role;
    });
  });

  // Conexão e Entrada no Jogo
  btnJoin.addEventListener('click', () => {
    const nome = inputName.value.trim() || 'Operador Visitante';

    sync.send('VISITOR_JOIN_REQUEST', {
      visitor: {
        nome: nome,
        modo: selectedRole
      }
    });

    screenLogin.style.display = 'none';
    screenGame.style.display = 'flex';

    if (playerTag) playerTag.innerText = nome;
    if (roleTag) {
      if (selectedRole === 'coop_p1') roleTag.innerText = 'OPERADOR 1: INFRAESTRUTURA & TRANSPORTE';
      else if (selectedRole === 'coop_p2') roleTag.innerText = 'OPERADOR 2: SAÚDE & MEIO AMBIENTE';
      else roleTag.innerText = 'COMANDO INTEGRAL (INDIVIDUAL)';
    }

    renderActions(selectedRole);
  });

  function renderActions(role) {
    if (!mobileButtonsList) return;
    mobileButtonsList.innerHTML = '';

    const actions = [];
    if (role === 'coop_p1' || role === 'individual') {
      actions.push(
        { id: 'reforcar_seguranca', icon: '🛡️', title: 'Reforçar Segurança Viária', desc: 'Isola e patrulha corredores estratégicos' },
        { id: 'manter_transporte', icon: '🚌', title: 'Rotas Alternativas de Ônibus', desc: 'Garante mobilidade urbana sem interrupção' },
        { id: 'bloquear_vias', icon: '🚧', title: 'Bloqueio de Vias Alagadas', desc: 'Interdita trechos com risco de inundação' },
        { id: 'acionar_bacias', icon: '🌊', title: 'Acionar Bacias de Amortecimento', desc: 'Drena a água para o Parque Realengo' }
      );
    }
    if (role === 'coop_p2' || role === 'individual') {
      actions.push(
        { id: 'abrir_abrigos', icon: '➕', title: 'Abrir Abrigos de Emergência', desc: 'Acolhe famílias e populações vulneráveis' },
        { id: 'proteger_verdes', icon: '🌳', title: 'Proteger Áreas Verdes & Encostas', desc: 'Evita degradação e risco de deslizamento' },
        { id: 'rotas_hospital', icon: '🏥', title: 'Corredor Hospitalar Prioritário', desc: 'Desobstrui tráfego para ambulâncias e socorro' },
        { id: 'mobilizar_defesa_civil', icon: '🚤', title: 'Mobilizar Defesa Civil & Botes', desc: 'Resgate de moradores ilhados na enchente' }
      );
    }

    actions.forEach(act => {
      const btn = document.createElement('button');
      btn.className = 'mobile-action-btn';
      btn.innerHTML = `
        <span style="font-size: 22px;">${act.icon}</span>
        <div>
          <div>${act.title}</div>
          <div style="font-size: 10px; color: var(--text-muted); font-weight: normal;">${act.desc}</div>
        </div>
      `;

      btn.addEventListener('click', () => {
        sync.send('player_action', { actionId: act.id });

        if (actionToast) {
          actionToast.innerText = `✓ Decisão "${act.title}" enviada à TV!`;
          actionToast.style.display = 'block';
          setTimeout(() => { actionToast.style.display = 'none'; }, 2000);
        }
      });

      mobileButtonsList.appendChild(btn);
    });
  }

  sync.on('CITY_STATE_UPDATE', (payload) => {
    // Recebe e pode atualizar métricas ou avisos
  });
});
