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

        await page.screenshot(path="frontend_tests/screenshots/baseline/1_hero.png")
        print("Captured Hero Scene")

        await page.evaluate("document.getElementById('vida-content-scroll').scrollBy(0, document.getElementById('vida-content-scroll').clientHeight * 0.8)")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="frontend_tests/screenshots/baseline/2_section_1.png")
        print("Captured Section 1")

        await page.evaluate("document.getElementById('vida-content-scroll').scrollTo(0, document.getElementById('vida-content-scroll').scrollHeight - document.getElementById('vida-content-scroll').clientHeight)")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="frontend_tests/screenshots/baseline/3_footer.png")
        print("Captured Footer/Equipe")

        await context.close()
        await browser.close()
        print("Baseline capture complete")

asyncio.run(run())
