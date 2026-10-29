import asyncio
from playwright.async_api import async_playwright
import time

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(
            viewport={"width": 1280, "height": 720}
        )
        page = await context.new_page()

        await page.goto('http://localhost:3000')
        print("Page loaded")

        # Wait for intro video to complete
        await page.wait_for_selector("#vida-content-scroll", timeout=60000)
        print("Intro complete")

        await page.evaluate("document.getElementById('vida-content-scroll').scrollBy(0, document.getElementById('vida-content-scroll').clientHeight * 0.9)")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="frontend_tests/screenshots/checkpoint_B_C/fundamentos.png")
        print("Captured Fundamentos")

        await page.evaluate("document.getElementById('vida-content-scroll').scrollBy(0, document.getElementById('vida-content-scroll').clientHeight * 0.9)")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="frontend_tests/screenshots/checkpoint_B_C/clima_bio.png")
        print("Captured Clima & Biodiversidade")

        await page.evaluate("document.getElementById('vida-content-scroll').scrollBy(0, document.getElementById('vida-content-scroll').clientHeight * 0.9)")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="frontend_tests/screenshots/checkpoint_B_C/agua_residuos.png")
        print("Captured Agua & Residuos")

        await page.evaluate("document.getElementById('vida-content-scroll').scrollBy(0, document.getElementById('vida-content-scroll').clientHeight * 0.9)")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="frontend_tests/screenshots/checkpoint_B_C/cidades_energia.png")
        print("Captured Cidades & Energia")

        await context.close()
        await browser.close()
        print("Checkpoint B & C capture complete")

asyncio.run(run())
