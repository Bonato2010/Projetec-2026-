import asyncio
from playwright.async_api import async_playwright
import time

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(
            record_video_dir="frontend_tests/videos/",
            record_video_size={"width": 1280, "height": 720}
        )
        page = await context.new_page()

        await page.goto('http://localhost:3000')
        print("Page loaded")

        # Wait for intro video to complete by waiting for the main content container
        await page.wait_for_selector("#vida-content-scroll", timeout=60000)

        # Screenshot Hero Scene
        await page.screenshot(path="frontend_tests/screenshots/scene_hero.png")
        print("Captured Hero Scene")

        # Scroll to Equipe section (we now have an absolute container to scroll instead of window)
        await page.evaluate("document.getElementById('vida-content-scroll').scrollTo(0, document.getElementById('vida-content-scroll').scrollHeight * 0.75)")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="frontend_tests/screenshots/scene_equipe.png")
        print("Captured Equipe Scene")

        await context.close()
        await browser.close()
        print("Test complete")

asyncio.run(run())
