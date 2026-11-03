import { useEffect, useMemo, useState } from 'react';

interface Shot { id: string; category: string; title: string; caption: string; file: string; capturedAt: string; layoutVersion: string; status: string }
interface RunRecord { runAt: string; layoutVersion: string; shots: Shot[] }
interface Index { generatedAt: string; layoutVersion: string; shots: Shot[]; history: RunRecord[] }
interface RefImage { id: string; title: string; file: string; source: string }

const CATS: { id: string; label: string }[] = [
  { id: 'mapeamento', label: 'Mapeamento' }, { id: 'vista-geral', label: 'Vista geral' }, { id: 'arquitetura', label: 'Arquitetura' },
  { id: 'esportes', label: 'Esportes' }, { id: 'paisagismo', label: 'Paisagismo' }, { id: 'evolucao', label: 'Evolução' },
];

/** Galeria independente (/preview-mapa). Só mostra capturas REAIS geradas por `npm run capture`. */
export default function ParkPreview() {
  const [index, setIndex] = useState<Index | null | 'none'>(null);
  const [refs, setRefs] = useState<RefImage[]>([]);
  const [cat, setCat] = useState('vista-geral');
  const [open, setOpen] = useState<Shot | null>(null);
  useEffect(() => {
    fetch('/preview-mapa/index.json', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : Promise.reject())).then(setIndex).catch(() => setIndex('none'));
    fetch('/preview-mapa/referencias/index.json', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : [])).then(setRefs).catch(() => setRefs([]));
  }, []);
  const shots = useMemo(() => (index && index !== 'none' ? index.shots.filter((s) => s.category === cat) : []), [index, cat]);
  const refOf = (s: Shot) => refs.find((r) => r.id === s.id);

  return (
    <div className="gallery">
      <header>
        <a href="/">← Voltar ao modelo 3D</a>
        <h1>Parque Realengo · Galeria de desenvolvimento</h1>
        <p className="note">Capturas reais da cena executada no navegador. A implantação é provisória: posições e dimensões aproximadas, aguardando plantas e fotografias.</p>
      </header>
      <nav>{CATS.map((c) => <button key={c.id} className={c.id === cat ? 'on' : ''} onClick={() => setCat(c.id)}>{c.label}</button>)}</nav>
      {index === null && <p>Carregando…</p>}
      {index === 'none' && (
        <div className="empty">
          <h2>Nenhuma captura gerada ainda</h2>
          <p>As imagens não são inventadas: rode <code>npm run capture</code> com o projeto instalado e a galeria será preenchida a partir de <code>public/preview-mapa/</code>.</p>
        </div>
      )}
      {index && index !== 'none' && cat !== 'evolucao' && (
        <div className="grid">
          {shots.length === 0 && <p>Sem capturas nesta categoria.</p>}
          {shots.map((s) => (
            <figure key={s.id} onClick={() => setOpen(s)}>
              <img src={`/preview-mapa/${s.file}`} alt={s.title} loading="lazy" />
              <figcaption><b>{s.title}</b><span>{s.caption}</span><em className="chip approximate">{s.status}</em></figcaption>
            </figure>
          ))}
        </div>
      )}
      {index && index !== 'none' && cat === 'evolucao' && (
        <div className="evo">
          <h2>Versão atual · {index.layoutVersion} · {new Date(index.generatedAt).toLocaleString('pt-BR')}</h2>
          <div className="grid small">{index.shots.map((s) => <figure key={s.id} onClick={() => setOpen(s)}><img src={`/preview-mapa/${s.file}`} alt={s.title} loading="lazy" /><figcaption><b>{s.title}</b></figcaption></figure>)}</div>
          {index.history.map((h) => (
            <section key={h.runAt}>
              <h2>Versão anterior · {h.layoutVersion} · {new Date(h.runAt).toLocaleString('pt-BR')}</h2>
              <div className="grid small">{h.shots.map((s) => <figure key={s.id} onClick={() => setOpen(s)}><img src={`/preview-mapa/${s.file}`} alt={s.title} loading="lazy" /><figcaption><b>{s.title}</b></figcaption></figure>)}</div>
            </section>
          ))}
          {index.history.length === 0 && <p>Ainda não há versões anteriores: cada novo <code>npm run capture</code> arquiva a rodada anterior.</p>}
        </div>
      )}
      {open && (
        <div className="lightbox" onClick={() => setOpen(null)}>
          <div className="lb-body" onClick={(e) => e.stopPropagation()}>
            <img src={`/preview-mapa/${open.file}`} alt={open.title} />
            {refOf(open) && <img src={`/preview-mapa/referencias/${refOf(open)!.file}`} alt={`Referência: ${refOf(open)!.title}`} />}
            <p><b>{open.title}</b> — {open.caption}<br /><small>Capturado em {new Date(open.capturedAt).toLocaleString('pt-BR')} · layout v{open.layoutVersion} · {open.status}{refOf(open) ? ` · referência: ${refOf(open)!.source}` : ''}</small></p>
            <button onClick={() => setOpen(null)}>Fechar</button>
          </div>
        </div>
      )}
      <footer><small>Comparação com referências: coloque imagens com licença adequada em <code>public/preview-mapa/referencias/</code> e liste-as em <code>index.json</code> (campos <code>id</code>, <code>title</code>, <code>file</code>, <code>source</code>) usando o mesmo <code>id</code> da captura.</small></footer>
    </div>
  );
}
