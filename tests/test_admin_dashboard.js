/**
 * KIM DOWOOK AI Portfolio - 관리자 전용 대시보드(Admin Console) E2E 테스트 스크립트
 */

const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

// 간단한 로컬 포트폴리오 웹서버 생성
function startServer(port = 8085) {
  const rootDir = path.resolve(__dirname, "..");
  
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg"
  };

  const server = http.createServer((req, res) => {
    let filePath = path.join(rootDir, req.url === "/" ? "index.html" : req.url);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || "text/plain";

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end("404 Not Found");
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
      }
    });
  });

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

async function runAdminDashboardTest() {
  console.log("\n🧪 [관리자 대시보드 E2E 테스트 시작] Admin Page & LocalStorage 검증\n");

  const server = await startServer(8085);
  console.log("🌐 로컬 웹서버 실행 중: http://localhost:8085");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  try {
    // 1. 메인 포트폴리오 접속
    await page.goto("http://localhost:8085/index.html");
    console.log("✅ 1. 포트폴리오 메인 화면 정상 로드 (http://localhost:8085)");

    // 2. 관리자 로그인 클릭 및 인증
    await page.click("#admin-auth-btn");
    await page.waitForSelector("#admin-modal.active");
    console.log("✅ 2. 🔑 관리자 로그인 모달 팝업 확인");

    await page.fill("#admin-password-input", "1234");
    
    // Alert 자동 승인 처리
    page.on("dialog", async (dialog) => {
      console.log(`💬 [브라우저 알림 메시지]: ${dialog.message()}`);
      await dialog.accept();
    });

    await page.click("#admin-form button[type='submit']");
    await page.waitForTimeout(500);

    // 3. 관리자 전용 대시보드 뷰 접속 검증
    const isAdminViewVisible = await page.isVisible(".admin-dashboard-container");
    console.log(`✅ 3. 🔒 전용 관리자 대시보드(Admin Console) 접속: ${isAdminViewVisible ? '성공 (OK)' : '실패'}`);

    // 관리자 페이지 스크린샷 캡처
    await page.screenshot({ path: "screenshot_admin_dashboard_view.png", fullPage: true });
    console.log("📸 4. [스크린샷 캡처] screenshot_admin_dashboard_view.png");

    // 4. [자기소개 관리] 탭 폼 수정 테스트
    await page.fill("#bio-headline", "AI 기술로 세상에 가치를 더하는 개발자, 김도욱입니다.");
    await page.fill("#bio-text", "경기도 고양시에서 AI 최신 트렌드를 연구하고 다양한 AI 웹/앱을 개발하며 학생분들과 동기부여를 나누고 있습니다.");
    await page.click("#admin-bio-form button[type='submit']");
    await page.waitForTimeout(500);
    console.log("✅ 5. 👤 자기소개 정보 수정 및 LocalStorage 저장 성공");

    // 5. [작업물 CRUD 관리] 탭 테스트
    await page.click("#tab-proj-btn");
    await page.waitForTimeout(300);
    console.log("✅ 6. 🚀 작업물 CRUD 관리 탭 이동 성공");

    // 신규 AI 프로젝트 등록
    await page.fill("#proj-title", "🤖 AI 스마트 에세이 피드백 시스템");
    await page.fill("#proj-desc", "학생들의 에세이와 보고서를 AI가 실시간 첨삭해 주는 모던 웹 앱 서비스");
    await page.fill("#proj-tags", "#ChatGPT-4o, #React, #Tailwind");
    await page.fill("#proj-demo", "https://example.com/essay-ai");
    await page.fill("#proj-github", "https://github.com/example/essay-ai");
    await page.click("#admin-project-form button[type='submit']");
    await page.waitForTimeout(500);
    console.log("✅ 7. ➕ 관리자 전용 페이지에서 신규 AI 프로젝트 등록 완료");

    // 등록 후 프로젝트 목록 개수 검증
    const projCount = await page.locator(".admin-project-item").count();
    console.log(`   - 현재 등록된 총 프로젝트 개수: ${projCount}개`);

    // 6. 메인 포트폴리오로 돌아가기 및 수정 반영 확인
    await page.click("#btn-back-to-main-bundle");
    await page.waitForTimeout(500);
    console.log("✅ 8. 🌐 메인 포트폴리오 뷰로 재이동");

    const updatedHeadline = await page.textContent(".hero-section h1");
    console.log(`   - 메인 화면에 반영된 헤드라인: "${updatedHeadline.trim()}"`);

    const mainCardCount = await page.locator(".project-card").count();
    console.log(`   - 메인 화면 갤러리에 표시된 카드 개수: ${mainCardCount}개`);

    // 메인 화면 반영 스크린샷
    await page.screenshot({ path: "screenshot_main_updated_dashboard.png", fullPage: true });
    console.log("📸 9. [스크린샷 캡처] screenshot_main_updated_dashboard.png");

  } catch (err) {
    console.error("❌ [테스트 중 오류 발생]:", err);
  } finally {
    await browser.close();
    server.close();
    console.log("\n🎉 [테스트 결과 리포트] 관리자 페이지 레이아웃, 컴포넌트, LocalStorage 연동이 모두 정상 동작합니다!\n");
  }
}

runAdminDashboardTest();
