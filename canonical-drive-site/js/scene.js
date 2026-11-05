let R;

try {
  R = new THREE.WebGLRenderer({
    canvas: $('#c'),
    antialias: !low
  });
} catch (e) {}

if (!R) {
  $('#fb').style.display = 'block';

  const l = () => ui(scrollY / mx() * 7);

  addEventListener('scroll', l);
  l();

} else {

  R.setPixelRatio(
    Math.min(devicePixelRatio, low ? 1 : 1.75)
  );

  const sc = new THREE.Scene();

  const cam = new THREE.PerspectiveCamera(
    50,
    1,
    0.05,
    400
  );

  const rs = () => {
    R.setSize(innerWidth, innerHeight);

    cam.aspect = innerWidth / innerHeight;
    cam.updateProjectionMatrix();
  };

  rs();
  addEventListener('resize', rs);

  const gt = (c0, c1) => {
    const x = document.createElement('canvas');

    x.width = x.height = 128;

    const g = x.getContext('2d');

    const q = g.createRadialGradient(
      64,
      64,
      0,
      64,
      64,
      64
    );

    q.addColorStop(0, c0);
    q.addColorStop(1, c1);

    g.fillStyle = q;
    g.fillRect(0, 0, 128, 128);

    return new THREE.CanvasTexture(x);
  };

  const spr = (t, c, s, o) => {
    const m = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: t,
        color: c,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: o
      })
    );

    m.scale.set(s, s, 1);

    return m;
  };

  const halo = gt(
    'rgba(255,255,255,1)',
    'rgba(255,255,255,0)'
  );

  const UV = new THREE.Group();
  const L = [];

  sc.add(UV);

  const stars = (n, Rm, sz, col, par, op) => {
    const a = new Float32Array(n * 3);

    for (let i = 0; i < n; i++) {
      const u = Math.random() * 6.283;
      const v = Math.acos(2 * Math.random() - 1);
      const r = Rm * (0.7 + Math.random() * 0.3);

      a[i * 3] =
        r * Math.sin(v) * Math.cos(u);

      a[i * 3 + 1] =
        r * Math.cos(v);

      a[i * 3 + 2] =
        r * Math.sin(v) * Math.sin(u);
    }

    const g = new THREE.BufferGeometry();

    g.setAttribute(
      'position',
      new THREE.BufferAttribute(a, 3)
    );

    const p = new THREE.Points(
      g,
      new THREE.PointsMaterial({
        size: sz,
        color: col,
        transparent: true,
        opacity: op,
        depthWrite: false
      })
    );

    p.userData.f = par;

    UV.add(p);
    L.push(p);
  };

  stars(
    low ? 900 : 2600,
    150,
    0.5,
    0xbcd0ff,
    0.6,
    0.9
  );

  stars(
    low ? 300 : 900,
    110,
    0.8,
    0xffe2b0,
    1,
    0.8
  );

  [
    [0x7a4cff, 0.2, [-60, 30, -100]],
    [0x2fb8c8, 0.15, [70, -20, -90]],
    [0xff7a3a, 0.12, [0, 50, -110]]
  ].forEach((n) => {
    const s = spr(
      gt('#fff', 'rgba(255,255,255,0)'),
      n[0],
      130,
      n[1]
    );

    s.position.set(...n[2]);

    UV.add(s);
  });

  const dust = (() => {
    const n = low ? 250 : 700;
    const a = new Float32Array(n * 3);

    for (let i = 0; i < n; i++) {
      a[i * 3] = -15 + Math.random() * 50;
      a[i * 3 + 1] = (Math.random() - 0.5) * 30;
      a[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }

    const g = new THREE.BufferGeometry();

    g.setAttribute(
      'position',
      new THREE.BufferAttribute(a, 3)
    );

    const p = new THREE.Points(
      g,
      new THREE.PointsMaterial({
        size: 0.07,
        color: 0xdfe8ff,
        transparent: true,
        opacity: 0.6,
        depthWrite: false
      })
    );

    sc.add(p);

    return p;
  })();

  const SUN = new THREE.Group();

  const U = {
    t: { value: 0 },
    c: {
      value: new THREE.Color(1, 0.72, 0.2)
    }
  };

  sc.add(SUN);

  SUN.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 64, 64),

      new THREE.ShaderMaterial({
        uniforms: U,

        vertexShader: `
          varying vec3 p;
          varying vec3 n;

          void main() {
            p = position;
            n = normalize(normalMatrix * normal);

            gl_Position =
              projectionMatrix *
              modelViewMatrix *
              vec4(position, 1.);
          }
        `,

        fragmentShader: `
          uniform float t;
          uniform vec3 c;

          varying vec3 p;
          varying vec3 n;

          void main() {
            float a =
              sin(p.x * 3. + t) *
              sin(p.y * 3. - t * .7) *
              sin(p.z * 3. + t * .5)
              + .5 *
              sin(p.x * 7. - t * 1.3) *
              sin(p.y * 6. + p.z * 4. + t);

            float f = pow(1. - abs(n.z), 2.);

            gl_FragColor = vec4(
              mix(
                c * .75,
                c * 1.35,
                a * .4 + .5
              )
              + vec3(1., .5, .1) * f * .6,
              1.
            );
          }
        `
      })
    )
  );

  const H1 = spr(
    halo,
    0xffa030,
    16,
    0.7
  );

  const H2 = spr(
    halo,
    0xff6a10,
    34,
    0.28
  );

  SUN.add(H1, H2);

  {
    const N = low ? 300 : 900;
    const a = new Float32Array(N * 3);
    const d = [];

    for (let i = 0; i < N; i++) {
      d.push([
        Math.random() * 6.283,
        Math.acos(2 * Math.random() - 1),
        2.4 + Math.random() * 1.8,
        0.1 + Math.random() * 0.4
      ]);
    }

    const g = new THREE.BufferGeometry();

    g.setAttribute(
      'position',
      new THREE.BufferAttribute(a, 3)
    );

    const P = new THREE.Points(
      g,
      new THREE.PointsMaterial({
        size: 0.07,
        color: 0xffcf6a,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );

    SUN.add(P);

    SUN.userData = {
      a,
      d,
      g,
      N
    };
  }

  sc.add(
    new THREE.PointLight(
      0xffe0b0,
      2.6,
      0,
      1
    )
  );

  sc.add(
    new THREE.AmbientLight(
      0x4a5a88,
      0.55
    )
  );

  const EG = new THREE.Group();

  EG.position.set(16, 0, 0);

  sc.add(EG);

  const tx = (() => {
    const x = document.createElement('canvas');

    x.width = 512;
    x.height = 256;

    const g = x.getContext('2d');

    g.fillStyle = '#16508f';
    g.fillRect(0, 0, 512, 256);

    g.fillStyle = '#2f8a5a';

    for (let i = 0; i < 60; i++) {
      g.beginPath();

      g.ellipse(
        Math.random() * 512,
        30 + Math.random() * 196,
        10 + Math.random() * 40,
        6 + Math.random() * 22,
        Math.random() * 3,
        0,
        6.3
      );

      g.fill();
    }

    return new THREE.CanvasTexture(x);
  })();

  EG.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 48, 48),

      new THREE.MeshStandardMaterial({
        map: tx,
        roughness: 0.9
      })
    )
  );

  EG.add(
    spr(
      halo,
      0x4aa0ff,
      7.6,
      0.45
    )
  );

  const nL = new THREE.Vector3(
    -0.25,
    0.5,
    0.83
  ).normalize();

  const CG = new THREE.Group();

  CG.position
    .copy(nL)
    .multiplyScalar(2.5);

  CG.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    nL
  );

  EG.add(CG);

  const BG = new THREE.Group();

  CG.add(BG);

  const M = (c, e) =>
    new THREE.MeshStandardMaterial({
      color: c,
      roughness: 0.7,
      emissive: e || 0,
      emissiveIntensity: 0.5
    });

  const gd = new THREE.Mesh(
    new THREE.CylinderGeometry(
      1.3,
      1.3,
      0.04,
      40
    ),
    M(0x1b2433)
  );

  gd.position.y = -0.02;

  CG.add(gd);

  const rows = [];
  const cs = [];

  for (let x = -1; x <= 1; x += 0.14) {
    for (let z = -1; z <= 1; z += 0.14) {
      if (
        Math.hypot(x, z) > 1.15 ||
        Math.abs((x + 1.05) % 0.56) < 0.1 ||
        Math.abs((z + 1.05) % 0.56) < 0.1
      ) {
        continue;
      }

      if (
        x < -0.35 &&
        z < -0.1 &&
        z > -0.8
      ) {
        continue;
      }

      rows.push([x, z]);
    }
  }

  const bm = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.1, 1, 0.1),

    new THREE.MeshStandardMaterial({
      roughness: 0.6,
      emissive: 0x1b2a44,
      emissiveIntensity: 0.35
    }),

    rows.length
  );

  const D = new THREE.Object3D();
  const C = new THREE.Color();

  rows.forEach((q, i) => {
    const h =
      0.05 +
      Math.random() *
      (
        Math.hypot(...q) < 0.5
          ? 0.55
          : 0.22
      );

    D.position.set(
      q[0],
      h / 2,
      q[1]
    );

    D.scale.set(1, h, 1);

    D.updateMatrix();

    bm.setMatrixAt(i, D.matrix);

    bm.setColorAt(
      i,
      C.set(
        q[0] > 0.45
          ? 0xc86a5a
          : q[1] > 0.55
            ? 0x3fd58c
            : 0x8fa6c8
      )
    );
  });

  BG.add(bm);

  const ch = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.015,
      0.02,
      0.5,
      8
    ),
    M(0x888888)
  );

  ch.position.set(
    0.65,
    0.25,
    0.25
  );

  BG.add(ch);

  const hos = new THREE.Mesh(
    new THREE.BoxGeometry(
      0.14,
      0.4,
      0.14
    ),
    M(0xffffff, 0x6070a0)
  );

  hos.position.set(
    -0.15,
    0.2,
    0.5
  );

  BG.add(hos);

  const road = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(
      (() => {
        const p = [];

        for (
          let k = -1;
          k <= 1;
          k += 0.56
        ) {
          p.push(
            new THREE.Vector3(
              k,
              0.03,
              -1.1
            ),
            new THREE.Vector3(
              k,
              0.03,
              1.1
            ),
            new THREE.Vector3(
              -1.1,
              0.03,
              k
            ),
            new THREE.Vector3(
              1.1,
              0.03,
              k
            )
          );
        }

        return p;
      })()
    ),

    new THREE.LineBasicMaterial({
      color: 0x58e0ff,
      transparent: true,
      opacity: 0
    })
  );

  CG.add(road);

  const park = new THREE.Mesh(
    new THREE.CircleGeometry(0.4, 24),
    M(0x1f8a4a, 0x0a3a1a)
  );

  park.rotation.x = -Math.PI / 2;

  park.position.set(
    -0.6,
    0.03,
    -0.45
  );

  CG.add(park);

  const TG = new THREE.Group();

  TG.position.set(
    -0.6,
    0,
    -0.45
  );

  const tr = new THREE.InstancedMesh(
    new THREE.ConeGeometry(
      0.05,
      0.2,
      6
    ),
    M(0x2fb866, 0x0b3a20),
    22
  );

  for (let i = 0; i < 22; i++) {
    const a = Math.random() * 6.28;
    const r = Math.random() * 0.33;

    D.position.set(
      Math.cos(a) * r,
      0.1,
      Math.sin(a) * r
    );

    D.scale.set(1, 1, 1);

    D.updateMatrix();

    tr.setMatrixAt(i, D.matrix);
  }

  TG.add(tr);
  CG.add(TG);

  const hz = (() => {
    const n = low ? 120 : 280;
    const a = new Float32Array(n * 3);

    for (let i = 0; i < n; i++) {
      a[i * 3] =
        (Math.random() - 0.5) * 2;

      a[i * 3 + 1] =
        0.1 + Math.random() * 0.9;

      a[i * 3 + 2] =
        (Math.random() - 0.5) * 2;
    }

    const g = new THREE.BufferGeometry();

    g.setAttribute(
      'position',
      new THREE.BufferAttribute(a, 3)
    );

    const p = new THREE.Points(
      g,
      new THREE.PointsMaterial({
        size: 0.5,
        map: halo,
        color: 0x8a7a68,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        sizeAttenuation: true
      })
    );

    CG.add(p);

    return p;
  })();

  const sens = [
    [0.5, 0.6, 0.5],
    [-0.4, 0.5, -0.1],
    [0.1, 0.55, -0.6],
    [-0.5, 0.4, 0.6],
    [0.7, 0.5, -0.4]
  ].map((q) => {
    const s = spr(
      halo,
      0x58e0ff,
      0.1,
      0
    );

    s.position.set(...q);

    CG.add(s);

    return s;
  });

  const mk = [
    [0.65, 0.55, 0.25, 0xff6a4a],
    [-0.15, 0.5, 0.5, 0xffffff],
    [-0.6, 0.3, -0.45, 0x3fd58c],
    [0.3, 0.35, -0.6, 0x58e0ff]
  ].map((q) => {
    const s = spr(
      halo,
      q[3],
      0.18,
      0
    );

    s.position.set(
      q[0],
      q[1],
      q[2]
    );

    CG.add(s);

    return s;
  });

  const geo = [
    new THREE.CylinderGeometry(
      0.05,
      0.05,
      0.12,
      12
    ),

    new THREE.BoxGeometry(
      0.07,
      0.12,
      0.015
    ),

    new THREE.BoxGeometry(
      0.11,
      0.11,
      0.02
    ),

    new THREE.SphereGeometry(
      0.06,
      12,
      12
    )
  ];

  const col = [
    0xc0c8d8,
    0x58e0ff,
    0xff7ab0,
    0xffe14a
  ];

  const TK = [];

  for (let i = 0; i < 8; i++) {
    const m = new THREE.Mesh(
      geo[i % 4],
      M(
        col[i % 4],
        col[i % 4]
      )
    );

    m.userData = {
      t: i % 4,
      i
    };

    sc.add(m);
    TK.push(m);
  }

  const ring = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(
      Array.from(
        { length: 64 },
        (_, i) =>
          new THREE.Vector3(
            Math.cos(i / 64 * 6.283),
            Math.sin(i / 64 * 6.283),
            0
          )
      )
    ),

    new THREE.LineBasicMaterial({
      color: 0x59d38c,
      transparent: true,
      opacity: 0
    })
  );

  sc.add(ring);

  const lin = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.9, 0, 0),
      new THREE.Vector3(0.9, 0, 0)
    ]),

    new THREE.LineBasicMaterial({
      color: 0xff7b6b,
      transparent: true,
      opacity: 0
    })
  );

  sc.add(lin);

  const ray = new THREE.Raycaster();
  const mv = new THREE.Vector2();

  $('#c').addEventListener(
    'click',
    (e) => {
      mv.set(
        e.clientX / innerWidth * 2 - 1,
        -e.clientY / innerHeight * 2 + 1
      );

      ray.setFromCamera(mv, cam);

      const h = ray.intersectObjects(TK)[0];

      if (
        h &&
        Math.abs(sp * 7 - 4) < 1
      ) {
        const o = OBJ[h.object.userData.t];

        $('#i4').innerHTML =
          `<b>${o[0]}</b> — ${o[1]}`;
      }
    }
  );

  const V = (a, b, c) =>
    new THREE.Vector3(a, b, c);

  const cp = new THREE.Vector3();
  const N = new THREE.Vector3();
  const Dd = new THREE.Vector3();
  const Rr = new THREE.Vector3();

  const Q = new THREE.Quaternion();
  const tmp = new THREE.Vector3();

  const hue = [
    [1, 0.72, 0.2],
    [0.6, 0.85, 1],
    [1, 0.78, 0.45],
    [1, 0.6, 0.3],
    [0.6, 1, 0.7],
    [1, 0.5, 0.4],
    [0.5, 0.85, 1],
    [1, 0.8, 0.4]
  ];

  const clock = new THREE.Clock();

  let lp = 0;

  R.setAnimationLoop(() => {
    const dt = Math.min(
      clock.getDelta(),
      0.05
    );

    const t = clock.elapsedTime;

    sp +=
      (tp - sp) *
      (
        RM
          ? 1
          : 1 - Math.exp(-dt * 4.5)
      );

    const p7 = sp * 7;

    ui(p7);

    U.t.value = t * 0.5;

    SUN.rotation.y =
      p7 * 0.9 +
      t * 0.03;

    UV.rotation.y =
      p7 * 0.28;

    L.forEach((p) => {
      p.rotation.y =
        p7 * 0.12 * p.userData.f;
    });

    dust.rotation.y =
      p7 * 0.05;

    EG.rotation.y =
      -2.2 *
      (
        1 -
        sm(p7, 0.7, 2.3)
      ) +
      t * 0.01 *
      (p7 < 2 ? 1 : 0);

    EG.updateMatrixWorld(true);

    CG.getWorldPosition(cp);

    CG.getWorldQuaternion(Q);

    N
      .set(0, 1, 0)
      .applyQuaternion(Q);

    Dd
      .copy(cp)
      .normalize()
      .multiplyScalar(-1);

    Dd
      .copy(cp)
      .setLength(1);

    Dd.addScaledVector(
      N,
      -Dd.dot(N)
    );

    Dd.normalize();

    Rr.crossVectors(N, Dd);

    const F = (n, d, r, ly) =>
      cp
        .clone()
        .addScaledVector(N, n)
        .addScaledVector(Dd, d)
        .addScaledVector(Rr, r);

    const kp = [
      V(0, 1.5, 17),
      V(9, 2.2, 9),
      F(2.4, 3.6, 1),
      F(0.8, 1.9, 0.2),
      F(1.5, 3.2, 0),
      F(2.4, 2.6, -1.8),
      F(4.4, 0.9, 0),
      V(11, 5, 34)
    ];

    const kl = [
      V(0, 0, 0),
      V(13.5, 0, 0),
      F(0.2, 0, 0),
      F(1.25, 0, 0),
      F(1.2, 0, 0),
      F(0.2, 0, 0),
      F(0, 0, 0),
      V(8, 0, 0)
    ];

    const i = Math.min(
      6,
      Math.floor(p7)
    );

    const e = sm(
      p7 - i,
      0,
      1
    );

    cam.position.lerpVectors(
      kp[i],
      kp[i + 1],
      e
    );

    tmp.lerpVectors(
      kl[i],
      kl[i + 1],
      e
    );

    cam.position.y +=
      Math.sin(p7 * 1.7) * 0.15;

    cam.lookAt(tmp);

    const S = SUN.userData;
    const a = S.a;

    for (let k = 0; k < S.N; k++) {
      const q = S.d[k];

      const u =
        q[0] +
        t * q[3] * 0.3;

      const dd =
        q[2] +
        0.3 *
        Math.sin(
          t * q[3] * 3 + k
        );

      a[k * 3] =
        dd *
        Math.sin(q[1]) *
        Math.cos(u);

      a[k * 3 + 1] =
        dd *
        Math.cos(q[1]);

      a[k * 3 + 2] =
        dd *
        Math.sin(q[1]) *
        Math.sin(u);
    }

    S.g.attributes
      .position
      .needsUpdate = true;

    const h0 =
      hue[
        Math.min(
          7,
          Math.round(p7)
        )
      ];

    U.c.value.lerp(
      new THREE.Color(...h0),
      0.04
    );

    H1.material.opacity =
      0.6 +
      0.15 *
      Math.sin(t * 1.4);

    const haze =
      sm(p7, 3.8, 4.7) *
      (
        1 -
        sm(p7, 5.3, 5.9)
      );

    const map =
      sm(p7, 5.6, 6.2) *
      (
        1 -
        sm(p7, 6.6, 7)
      );

    hz.material.opacity =
      haze * 0.35;

    BG.scale.y =
      1 - 0.9 * map;

    road.material.opacity =
      map;

    TG.scale.setScalar(
      0.5 +
      0.5 *
      sm(p7, 5.2, 5.9) +
      0.001
    );

    sens.forEach((s, k) => {
      const v =
        map *
        (
          0.6 +
          0.4 *
          Math.sin(t * 3 + k)
        );

      s.material.opacity = v;

      s.scale.setScalar(
        0.1 +
        0.08 *
        Math.sin(t * 3 + k) +
        0.05
      );
    });

    mk.forEach((s, k) => {
      s.material.opacity =
        sm(p7, 1.8, 2.4) *
        (
          1 -
          sm(p7, 2.9, 3.4)
        ) *
        (
          0.6 +
          0.3 *
          Math.sin(t * 2 + k)
        );
    });

    const vis =
      sm(p7, 2.7, 3.1) *
      (
        1 -
        sm(p7, 4.8, 5.2)
      );

    const m =
      sm(p7, 3.5, 4.4);

    const ctr =
      cp
        .clone()
        .addScaledVector(N, 1.2);

    ring.visible =
      lin.visible =
      vis > 0.01;

    ring.position.copy(ctr);

    ring.scale.setScalar(0.95);

    ring.quaternion.setFromRotationMatrix(
      new THREE.Matrix4().makeBasis(
        Rr,
        N,
        Dd
      )
    );

    ring.material.opacity =
      m * vis * 0.5;

    lin.position.copy(ctr);

    lin.quaternion.copy(
      ring.quaternion
    );

    lin.material.opacity =
      (1 - m) *
      vis *
      0.6;

    TK.forEach((k, j) => {
      const u =
        (
          t * 0.06 +
          j / 8
        ) % 1;

      const xl =
        -0.85 +
        1.7 * u;

      const yl =
        Math.sin(
          u * 6.283
        ) * 0.04;

      const a2 =
        u * 6.283 +
        1.57;

      const px =
        xl * (1 - m) +
        Math.cos(a2) *
        0.95 *
        m;

      const py =
        yl * (1 - m) +
        Math.sin(a2) *
        0.95 *
        m;

      k.position
        .copy(ctr)
        .addScaledVector(
          Rr,
          px
        )
        .addScaledVector(
          N,
          py
        );

      k.scale.setScalar(
        vis * 1.4 + 0.001
      );

      k.rotation.y = t;

      k.visible =
        vis > 0.01;
    });

    R.render(sc, cam);
  });
}

ui(0);