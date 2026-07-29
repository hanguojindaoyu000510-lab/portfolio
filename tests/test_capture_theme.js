const { chromium } = require("playwright");
const path = require("path");

async function capturePastelTheme() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const htmlPath = "file:///" + path.resolve(__dirname, "../index.html").replace(/\\/g, "/");

  await page.goto(htmlPath);
  await page.waitForTimeout(500);

  const screenshotPath = path.resolve(__dirname, "../screenshot_mint_cat_theme.png");
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`📸 스카이 민트 고양이 테마 전체 스크린샷 저장: ${screenshotPath}`);

  await browser.close();
}

capturePastelTheme();
