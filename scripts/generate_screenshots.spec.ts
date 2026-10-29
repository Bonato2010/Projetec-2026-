import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Parque Realengo 3D Visual Verification', () => {
    test.setTimeout(120000); // 2 minutes

    test('capture screenshots of park elements', async ({ page }) => {
        // Go to the prototype
        await page.goto('http://localhost:3000');

        // Wait for the intro video and enter button
        await page.waitForSelector('button:has-text("ENTRAR NO PROTÓTIPO")', { timeout: 60000 });
        await page.click('button:has-text("ENTRAR NO PROTÓTIPO")');

        // Wait for main scene to load fully (wait for the canvas and UI)
        await page.waitForSelector('.pointer-events-auto', { state: 'visible', timeout: 30000 });
        // wait for some time to allow textures and 3D objects to compile and render
        await page.waitForTimeout(5000);

        const screenshotDir = path.join(__dirname, '..', 'eco-city', 'public', 'preview-mapa');
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }

        // 1. General View
        await page.screenshot({ path: path.join(screenshotDir, '01_vista_geral.png') });

        // Simulate some basic camera movements (zooming out and panning if possible via scroll or drag)
        // Since we can't reliably script OrbitControls without complex mouse events,
        // we will at least ensure the scene loads and we grab the default view which should frame the park.

        // We will take a second screenshot just slightly later to ensure everything settled
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(screenshotDir, '02_vista_geral_settled.png') });

        // Check if images were created
        expect(fs.existsSync(path.join(screenshotDir, '01_vista_geral.png'))).toBeTruthy();
        expect(fs.existsSync(path.join(screenshotDir, '02_vista_geral_settled.png'))).toBeTruthy();
    });
});
