# README — Publicação e Gestão do Site Informativo BIO NOVA

**Projeto:** V.I.D.A. — Sustentabilidade & Biotecnologia Aplicada (Projetec 2026)  
**Módulo:** Portal Educativo Bio Nova & Hub de QR Codes  

---

## 1. Endereços de Acesso

- **Endereço Público (GitHub Pages):** [`https://bonato2010.github.io/Projetec-2026-/`](https://bonato2010.github.io/Projetec-2026-/)
- **Endereço Local (Rede Wi-Fi do Stand):** `http://10.158.191.231:3000/biotecnologia`
- **Porta Utilizada:** `3000`

---

## 2. Como Iniciar o Servidor Localmente

Para rodar o servidor de rede local na feira de ciências:

```bash
# Instale as dependências (caso necessário)
npm install

# Inicie o servidor oficial
npm start
```

O servidor iniciará na porta `3000`, detectando automaticamente o IP local da máquina (ex: `10.158.191.231`) e servindo a rota `/biotecnologia` diretamente para o `site-informativo/index.html`.

---

## 3. Localização dos Arquivos de QR Code

Os arquivos do QR Code exclusivo do Bio Nova estão armazenados em:

- `site-informativo/assets/qr-code/qr-bio-nova.svg` (Formato vetorial de alta resolução para impressão e displays)
- `site-informativo/assets/qr-code/qr-bio-nova.png` (Formato raster otimizado)

---

## 4. Como Regenerar o QR Code

Caso o endereço público ou o IP local seja alterado, o QR Code pode ser regenerado executando:

```bash
node scripts/generate-bio-nova-qr.js
```

O script atualizará automaticamente os arquivos SVG e PNG com a URL definitiva.

---

## 5. Instruções de Publicação no GitHub Pages

O site informativo é totalmente compatível com hospedagem estática e está configurado para deploy automático via GitHub Actions:

1. Arquivo de configuração de workflow: `.github/workflows/deploy-bio-nova.yml`
2. O workflow publica o diretório `./site-informativo` na branch de GitHub Pages sempre que há push na branch `main` ou `develop`.
3. Verifique o status da publicação na aba **Actions** do repositório no GitHub (`https://github.com/Bonato2010/Projetec-2026-/actions`).

---

## 6. Resultado dos Testes

- **Leitura por Câmera:** Testado e verificado com leitores de QR de dispositivos móveis.
- **Contraste e Legibilidade:** Alta proporção de contraste (preto/azul profundo `#0a121e` sobre fundo branco puro `#ffffff`).
- **Integração Visual:** Apresentado lado a lado com o QR Code do protótipo Pixel Art 2D no painel unificado do stand, garantindo total independência de acesso (sem sobreposição de rotas).
