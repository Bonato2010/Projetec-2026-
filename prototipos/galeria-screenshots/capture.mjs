import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');

// Helper to wait for a port to be ready
const waitOnPort = (port, timeout = 5000) => {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const check = () => {
            fetch(`http://localhost:${port}`)
                .then(res => {
                    if (res.ok) resolve();
                    else setTimeout(check, 100);
                })
                .catch(() => {
                    if (Date.now() - start > timeout) reject(new Error('Timeout waiting for port'));
                    else setTimeout(check, 100);
                });
        };
        check();
    });
};

async function generateScreenshots() {
    console.log('Starting screenshot generation process...');

    // Configurações de Viewport
    const desktopViewport = { width: 1440, height: 900 };
    const mobileViewport = { width: 390, height: 844, isMobile: true, hasTouch: true };

    const browser = await chromium.launch({ headless: true });

    // 1. MAPA DO PARQUE (prototipos/01-mapa-parque)
    const mapaDir = path.resolve(projectRoot, 'prototipos', '01-mapa-parque');
    if (fs.existsSync(mapaDir)) {
        console.log('Starting server for 01-mapa-parque...');
        const server = spawn('python3', ['-m', 'http.server', '3000'], {
            cwd: mapaDir,
            stdio: 'ignore'
        });

        try {
            await waitOnPort(3000);
            console.log('Server is ready. Capturing screenshots...');

            // --- DESKTOP ---
            const desktopContext = await browser.newContext({ viewport: desktopViewport });
            const desktopPage = await desktopContext.newPage();
            await desktopPage.goto('http://localhost:3000');

            // Wait for map to render
            await desktopPage.waitForSelector('#map-wrapper svg', { state: 'visible' });
            await desktopPage.waitForTimeout(1000); // Give it a sec to settle

            const destDir = path.join(__dirname, 'screenshots', 'mapa-parque');

            // Capture: Home Desktop
            await desktopPage.screenshot({ path: path.join(destDir, 'desktop-home.png'), fullPage: false });

            // Interaction 1: Click "Esportes"
            await desktopPage.locator('button[data-category="esporte"]').click();
            await desktopPage.waitForTimeout(500);
            await desktopPage.screenshot({ path: path.join(destDir, 'desktop-filter-esportes.png'), fullPage: false });

            // Interaction 2: Click an element to open info panel
            await desktopPage.locator('g[data-id="campo-futebol"]').click();
            await desktopPage.waitForTimeout(500);
            await desktopPage.screenshot({ path: path.join(destDir, 'desktop-info-panel.png'), fullPage: false });

            await desktopContext.close();


            // --- MOBILE ---
            const mobileContext = await browser.newContext({ viewport: mobileViewport });
            const mobilePage = await mobileContext.newPage();
            await mobilePage.goto('http://localhost:3000');

            await mobilePage.waitForSelector('#map-wrapper svg', { state: 'visible' });
            await mobilePage.waitForTimeout(1000);

            // Capture: Home Mobile
            await mobilePage.screenshot({ path: path.join(destDir, 'mobile-home.png'), fullPage: false });

            // Interaction 1: Open info panel on mobile
            await mobilePage.locator('button[data-category="esporte"]').click();
            await mobilePage.waitForTimeout(500);
            await mobilePage.locator('g[data-id="campo-futebol"]').click();
            await mobilePage.waitForTimeout(500);

            await mobilePage.screenshot({ path: path.join(destDir, 'mobile-info-panel.png'), fullPage: false });

            await mobileContext.close();
            console.log('Screenshots for mapa-parque completed.');

        } catch (error) {
            console.error('Error capturing mapa-parque:', error);
        } finally {
            server.kill();
        }
    } else {
        console.warn('Directory prototipos/01-mapa-parque not found. Skipping.');
    }

    // Para os próximos protótipos (Painel Ambiental e Simulador Drenagem)
    // Deixaremos placeholders que informam na tela se a pasta ainda não existe.
    // Como eles não estão no disco (apenas pedido o espaço na galeria), faremos um log.
    console.log('Check for painel-ambiental... (Not implemented yet)');
    console.log('Check for simulador-drenagem... (Not implemented yet)');

    // Generate a simple timestamp file to let the gallery know when the last update was
    fs.writeFileSync(path.join(__dirname, 'last-update.json'), JSON.stringify({
        timestamp: new Date().toISOString()
    }));

    await browser.close();
    console.log('Screenshot generation complete.');
}

generateScreenshots();