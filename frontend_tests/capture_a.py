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

        await page.screenshot(path="frontend_tests/screenshots/checkpoint_A/earth_hero.png")
        print("Captured Realistic Earth")

        await context.close()
        await browser.close()
        print("Checkpoint A capture complete")

asyncio.run(run())
