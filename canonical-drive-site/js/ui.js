const PN = [];
const NV = $('#nv');
const SS = $('#S');

CH.forEach((c, i) => {
  const e = document.createElement('section');

  e.className = 'ch';

  e.innerHTML = `
    <div class="k">${c.k}</div>

    <h2>${c.t}</h2>

    <p>${c.d}</p>

    <div class="chips">
      ${(c.it || [])
        .map(
          (x, j) =>
            `<button class="chip" data-j="${j}">${x[0]}</button>`
        )
        .join('')}
    </div>

    <div class="info" id="i${i}"></div>

    ${c.x || ''}
  `;

  SS.append(e);

  const ch = [
    ...e.querySelectorAll('.chip')
  ];

  ch.forEach((b) => {
    b.onclick = () => {
      const x = c.it[b.dataset.j];

      $(`#i${i}`).innerHTML =
        `<b>${x[0]}</b> — ${x[1]}`;
    };
  });

  PN.push({
    e,
    ch
  });

  const b = document.createElement('button');

  b.innerHTML = `
    <span>${c.n}</span>
    <i></i>
  `;

  b.setAttribute(
    'aria-label',
    c.n
  );

  b.onclick = () => goto(i);

  NV.append(b);
});

const mx = () =>
  document.documentElement.scrollHeight -
  innerHeight;

const goto = (i) => {
  scrollTo({
    top: (i / 7) * mx(),
    behavior: RM ? 'auto' : 'smooth'
  });
};

let tp = 0;
let sp = 0;
let idle;
let pres;

addEventListener('scroll', () => {
  tp = scrollY / mx();

  clearTimeout(idle);

  idle = setTimeout(() => {
    const q = tp * 7;
    const i = Math.round(q);

    if (
      Math.abs(q - i) > 0.03 &&
      !RM
    ) {
      goto(i);
    }
  }, 220);
});

addEventListener('keydown', (e) => {
  const i = Math.round(tp * 7);

  if (
    e.key === 'ArrowDown' ||
    e.key === 'ArrowRight' ||
    e.key === 'PageDown'
  ) {
    goto(
      Math.min(7, i + 1)
    );
  }

  if (
    e.key === 'ArrowUp' ||
    e.key === 'ArrowLeft' ||
    e.key === 'PageUp'
  ) {
    goto(
      Math.max(0, i - 1)
    );
  }

  if (
    e.key === 'm' ||
    e.key === 'M'
  ) {
    tf();
  }

  if (
    e.key === 'p' ||
    e.key === 'P'
  ) {
    tpz();
  }
});

function tf() {
  const o =
    document.documentElement.classList.toggle(
      'feira'
    );

  $('#bf').setAttribute(
    'aria-pressed',
    o
  );
}

function tpz() {
  if (pres) {
    clearInterval(pres);
    pres = 0;
  } else {
    const nx = () =>
      goto(
        (Math.round(tp * 7) + 1) % 8
      );

    nx();

    pres = setInterval(
      nx,
      13000
    );
  }

  $('#bp').setAttribute(
    'aria-pressed',
    !!pres
  );

  $('#bp').textContent =
    pres
      ? '■ Parar'
      : '▶ Apresentação (P)';
}

$('#bf').onclick = tf;
$('#bp').onclick = tpz;

function ui(p7) {
  PN.forEach((o, i) => {
    const d = p7 - i;

    const a = Math.max(
      0,
      1 - Math.abs(d) * 1.7
    );

    const s = o.e.style;

    s.opacity = a;

    s.transform = `
      translate3d(
        ${d * -90}px,
        0,
        ${-Math.abs(d) * 160}px
      )
      rotateY(${d * 16}deg)
    `;

    s.filter =
      a < 1
        ? `blur(${(1 - a) * 6}px)`
        : '';

    s.visibility =
      a > 0.01
        ? 'visible'
        : 'hidden';

    s.pointerEvents =
      a > 0.6
        ? 'auto'
        : 'none';

    o.ch.forEach((b, j) => {
      b.classList.toggle(
        'v',
        i > 0 &&
        p7 > i - 0.3 + j * 0.07
      );
    });
  });

  const k = Math.round(p7);

  NV.childNodes.forEach((b, i) => {
    b.classList.toggle(
      'on',
      i === k
    );
  });

  $('#bar').style.width =
    (p7 / 7) * 100 + '%';

  $('#hint').style.opacity =
    p7 < 0.2
      ? 1
      : 0;
}