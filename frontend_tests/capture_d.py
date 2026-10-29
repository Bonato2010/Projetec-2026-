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

        await page.evaluate("document.getElementById('vida-content-scroll').scrollTo(0, document.getElementById('vida-content-scroll').scrollHeight * 0.70)")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="frontend_tests/screenshots/checkpoint_D/ods_consumo.png")
        print("Captured ODS & Consumo")

        await page.evaluate("document.getElementById('vida-content-scroll').scrollTo(0, document.getElementById('vida-content-scroll').scrollHeight * 0.85)")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="frontend_tests/screenshots/checkpoint_D/equipe.png")
        print("Captured Equipe")

        await context.close()
        await browser.close()
        print("Checkpoint D capture complete")

asyncio.run(run())
