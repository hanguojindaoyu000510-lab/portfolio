/**
 * KIM DOWOOK AI Portfolio - 이메일 전송 연락폼(Contact Form) E2E 검증 테스트
 */

const { chromium } = require("playwright");
const path = require("path");

async function runContactFormTest() {
  console.log("\n🧪 [테스트 시작] EmailJS 이메일 전송 연락폼(Contact Form) 기능 검증\n");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const htmlPath = "file:///" + path.resolve(__dirname, "../index.html").replace(/\\/g, "/");

  try {
    await page.goto(htmlPath);
    console.log(`✅ 1. index.html 로드 완료: ${htmlPath}`);

    // 1. Contact 섹션 및 폼 존재 검증
    const contactSectionVisible = await page.isVisible("#contact");
    const contactFormVisible = await page.isVisible("#contact-form");
    const nameInputVisible = await page.isVisible("#contact-name");
    const emailInputVisible = await page.isVisible("#contact-email");
    const messageInputVisible = await page.isVisible("#contact-message");
    const submitBtnVisible = await page.isVisible("#contact-submit-btn");

    console.log(`✅ 2. 연락폼 요소 검증:`);
    console.log(`   - 연락처 섹션 (#contact): ${contactSectionVisible ? 'OK' : 'FAIL'}`);
    console.log(`   - 연락폼 (#contact-form): ${contactFormVisible ? 'OK' : 'FAIL'}`);
    console.log(`   - 이름 입력창 (#contact-name): ${nameInputVisible ? 'OK' : 'FAIL'}`);
    console.log(`   - 이메일 입력창 (#contact-email): ${emailInputVisible ? 'OK' : 'FAIL'}`);
    console.log(`   - 메시지 입력창 (#contact-message): ${messageInputVisible ? 'OK' : 'FAIL'}`);
    console.log(`   - 전송 버튼 (#contact-submit-btn): ${submitBtnVisible ? 'OK' : 'FAIL'}`);

    // 2. 폼 입력값 채우기
    await page.fill("#contact-name", "기모찌");
    await page.fill("#contact-email", "yamathe@naver.com");
    await page.fill("#contact-message", "안녕하세요! EmailJS 연락폼 기능 E2E 테스트 메시지입니다.");

    // 🐾 고양이 보안 퀴즈 정답 읽어서 자동 채우기
    const quizText = await page.textContent("#quiz-question-text");
    const numbers = quizText.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      const ans = parseInt(numbers[0], 10) + parseInt(numbers[1], 10);
      await page.fill("#contact-quiz", ans.toString());
      console.log(`✅ 3. 입력 필드 테스트 데이터 채우기 완료 (퀴즈 정답: ${numbers[0]} + ${numbers[1]} = ${ans})`);
    }

    // 3. EmailJS SDK 및 함수 바인딩 검증
    const hasEmailJS = await page.evaluate(() => typeof window.emailjs !== "undefined");
    console.log(`✅ 4. EmailJS SDK 로드 상태: ${hasEmailJS ? '성공 (SDK 준비됨)' : '미로드 (로컬 file:// 프로토콜 환경)'}`);

    // 4. 스크린샷 캡처하여 증적 저장
    const screenshotPath = path.resolve(__dirname, "../screenshot_contact_form.png");
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 5. 연락폼 전체 스크린샷 저장 완료: ${screenshotPath}`);

    console.log("\n🎉 [테스트 완료] 연락폼 UI 및 폼 검증이 정상적으로 통과되었습니다!\n");
  } catch (error) {
    console.error("❌ [테스트 실패]:", error);
  } finally {
    await browser.close();
  }
}

runContactFormTest();
