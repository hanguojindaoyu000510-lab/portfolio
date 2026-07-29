/**
 * KIM DOWOOK AI Portfolio - 소셜 & 이메일 연동 연락처 컴포넌트 (Contact.js)
 * 시원하고 귀여운 스카이블루 & 민트 그린 고양이 AI 테마
 * 서버 API 프록시(/api/contact-config) 연동 및 3중 스팸 방지
 */

import { copyToClipboard } from "../utils/clipboard.js";

const COOLDOWN_MS = 30000;

export function renderContactSection() {
  const contactSection = document.createElement("section");
  contactSection.id = "contact";
  contactSection.className = "section";

  // 고양이 보안 퀴즈 난수 생성
  let currentQuiz = generateCatQuiz();

  contactSection.innerHTML = `
    <div class="container" style="max-width: 800px;">
      <div class="glass-card pulse-glow" style="padding: 48px 32px; position: relative;">
        <!-- 섹션 헤더 -->
        <div style="text-align: center; margin-bottom: 36px;">
          <span class="tag-pill tag-pill-ai" style="margin-bottom: 12px; display: inline-flex;">✉️ CONTACT ME 🐾</span>
          <h2 style="font-size: 2.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 12px;">
            이메일로 문의 남기기
          </h2>
          <p style="font-size: 1.05rem; color: var(--text-muted); max-width: 560px; margin: 0 auto;">
            프로젝트 제작 문의, 기술 협업 제안, 기타 메시지를 남겨주시면 확인 후 입력하신 이메일로 답변을 보내드립니다.
          </p>
        </div>

        <!-- EmailJS 연동 연락폼 -->
        <form id="contact-form" style="display: flex; flex-direction: column; gap: 4px;">
          <!-- 1. 스팸 봇 차단용 허니팟 숨김 필드 -->
          <input 
            type="text" 
            id="contact-honeypot" 
            name="website_url" 
            style="display:none !important;" 
            tabindex="-1" 
            autocomplete="off" 
          />

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            <!-- 이름 / 닉네임 입력 -->
            <div class="form-group">
              <label for="contact-name" class="form-label">
                👤 성함 / 닉네임 <span style="color: var(--color-primary);">*</span>
              </label>
              <input 
                type="text" 
                id="contact-name" 
                name="name" 
                class="form-input" 
                placeholder="예: 홍길동" 
                required 
              />
            </div>

            <!-- 이메일 주소 입력 -->
            <div class="form-group">
              <label for="contact-email" class="form-label">
                ✉️ 이메일 주소 <span style="color: var(--color-primary);">*</span>
              </label>
              <input 
                type="email" 
                id="contact-email" 
                name="email" 
                class="form-input" 
                placeholder="example@domain.com" 
                required 
              />
            </div>
          </div>

          <!-- 메시지 내용 입력 -->
          <div class="form-group">
            <label for="contact-message" class="form-label">
              💬 메시지 내용 <span style="color: var(--color-primary);">*</span>
            </label>
            <textarea 
              id="contact-message" 
              name="message" 
              class="form-input" 
              placeholder="문의하실 내용이나 전달하고 싶은 메시지를 자유롭게 입력해 주세요." 
              required
            ></textarea>
          </div>

          <!-- 🐾 2. 고양이 보안 퀴즈 (스팸 방지 CAPTCHA) -->
          <div class="form-group" style="background: rgba(56, 189, 248, 0.08); padding: 18px 20px; border-radius: var(--radius-input); border: 1.5px dashed var(--border-glass-bright); margin-bottom: 24px;">
            <label for="contact-quiz" class="form-label" style="margin-bottom: 8px;">
              🐾 고양이 스팸 방지 퀴즈: 
              <span id="quiz-question-text" style="color: var(--color-primary); font-weight: 800; font-size: 1.05rem;">
                ${currentQuiz.n1} + ${currentQuiz.n2} = ?
              </span> 
              <span style="color: var(--color-primary);">*</span>
            </label>
            <input 
              type="number" 
              id="contact-quiz" 
              class="form-input" 
              placeholder="숫자 정답 입력 (예: ${currentQuiz.ans})" 
              required 
            />
          </div>

          <!-- 전송 버튼 -->
          <div style="text-align: center; margin-top: 4px;">
            <button type="submit" id="contact-submit-btn" class="btn-pill btn-pill-primary" style="width: 100%; max-width: 320px; font-size: 1.05rem;">
              🚀 이메일 보내기
            </button>
          </div>

          <!-- 피드백 알림 영역 -->
          <div id="contact-feedback" class="contact-feedback"></div>
        </form>

        <div style="border-top: 1.5px solid var(--border-glass); margin: 40px 0 28px;"></div>

        <!-- 소셜 & 보조 연락처 캡슐 버튼 모음 -->
        <div style="text-align: center;">
          <p style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 16px; font-weight: 600;">
            소셜 메신저 및 기타 채널로 연락하기
          </p>
          <div style="display: flex; justify-content: center; align-items: center; gap: 14px; flex-wrap: wrap;">
            <!-- 1:1 오픈채팅 -->
            <a href="https://open.kakao.com" target="_blank" rel="noopener noreferrer" class="btn-pill btn-pill-secondary btn-pill-sm">
              🟡 1:1 오픈채팅
            </a>

            <!-- 이메일 주소 복사 버튼 -->
            <button id="copy-email-btn" type="button" class="btn-pill btn-pill-secondary btn-pill-sm">
              📋 이메일 주소 복사
            </button>

            <!-- Github 바로가기 -->
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="btn-pill btn-pill-secondary btn-pill-sm">
              💻 Github 프로필
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  const form = contactSection.querySelector("#contact-form");
  const submitBtn = contactSection.querySelector("#contact-submit-btn");
  const feedbackEl = contactSection.querySelector("#contact-feedback");
  const copyBtn = contactSection.querySelector("#copy-email-btn");

  copyBtn.addEventListener("click", async () => {
    const env = await getContactServerConfig();
    copyToClipboard(env.receiverEmail, `이메일 주소(${env.receiverEmail})가 클립보드에 복사되었습니다!`);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. 허니팟 스팸 봇 차단 검증
    const honeypotVal = form.querySelector("#contact-honeypot").value;
    if (honeypotVal) {
      showFeedback(feedbackEl, "error", "⚠️ 비정상적인 접근(스팸 봇)이 탐지되었습니다.");
      return;
    }

    // 2. 30초 재전송 쿨타임 검증
    const lastSentTime = sessionStorage.getItem("dowook_last_email_sent_time");
    if (lastSentTime) {
      const elapsed = Date.now() - parseInt(lastSentTime, 10);
      if (elapsed < COOLDOWN_MS) {
        const remainSec = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
        showFeedback(feedbackEl, "error", `⚠️ 잦은 전송 방지를 위해 ${remainSec}초 후 다시 시도해 주세요.`);
        return;
      }
    }

    const name = form.querySelector("#contact-name").value.trim();
    const email = form.querySelector("#contact-email").value.trim();
    const message = form.querySelector("#contact-message").value.trim();
    const userQuizVal = parseInt(form.querySelector("#contact-quiz").value.trim(), 10);

    if (!name || !email || !message || isNaN(userQuizVal)) {
      showFeedback(feedbackEl, "error", "⚠️ 모든 필수 입력란 및 보안 퀴즈 정답을 작성해 주세요.");
      return;
    }

    // 3. 🐾 고양이 보안 퀴즈 정답 검증
    if (userQuizVal !== currentQuiz.ans) {
      showFeedback(feedbackEl, "error", `⚠️ 고양이 보안 퀴즈 정답이 올바르지 않습니다. (${currentQuiz.n1} + ${currentQuiz.n2} 정답 입력)`);
      return;
    }

    // 서버 API 프록시를 통해 안전하게 환경변수 수신
    const envConfig = await getContactServerConfig();

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.7";
    submitBtn.innerHTML = `⏳ 이메일 전송 중...`;
    hideFeedback(feedbackEl);

    try {
      if (typeof window.emailjs !== "undefined") {
        await window.emailjs.send(
          envConfig.serviceId,
          envConfig.templateId,
          {
            name: name,
            email: email,
            message: message,
            to_email: envConfig.receiverEmail
          },
          envConfig.publicKey
        );
      } else {
        throw new Error("EmailJS SDK가 로드되지 않았습니다.");
      }

      sessionStorage.setItem("dowook_last_email_sent_time", Date.now().toString());

      showFeedback(
        feedbackEl,
        "success",
        `🎉 성공적으로 이메일이 전송되었습니다! (${envConfig.receiverEmail} 수신)`
      );
      form.reset();

      currentQuiz = generateCatQuiz();
      const quizTextEl = form.querySelector("#quiz-question-text");
      const quizInputEl = form.querySelector("#contact-quiz");
      if (quizTextEl) quizTextEl.textContent = `${currentQuiz.n1} + ${currentQuiz.n2} = ?`;
      if (quizInputEl) quizInputEl.placeholder = `숫자 정답 입력 (예: ${currentQuiz.ans})`;

    } catch (error) {
      console.error("EmailJS Send Error:", error);
      showFeedback(
        feedbackEl,
        "error",
        `❌ 메일 전송 중 오류가 발생했습니다. (${error.text || error.message || "다시 시도해 주세요."})`
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
      submitBtn.innerHTML = originalBtnText;
    }
  });

  return contactSection;
}

/**
 * 서버 API (/api/contact-config) 수신 함수
 */
async function getContactServerConfig() {
  try {
    const res = await fetch("/api/contact-config");
    if (res.ok) {
      const data = await res.json();
      if (data && data.status === "success") {
        return data;
      }
    }
  } catch (e) {
    console.warn("Contact API Proxy fetch failed, using fallback.");
  }
  return {
    serviceId: "service_5imxylv",
    templateId: "template_8gaj1uo",
    publicKey: "lyYq0Z8STxd99nxT0",
    receiverEmail: "hanguojindaoyu000510@gmail.com"
  };
}

function generateCatQuiz() {
  const n1 = Math.floor(Math.random() * 8) + 2;
  const n2 = Math.floor(Math.random() * 8) + 1;
  return { n1, n2, ans: n1 + n2 };
}

function showFeedback(el, type, message) {
  el.className = `contact-feedback ${type}`;
  el.textContent = message;
}

function hideFeedback(el) {
  el.className = "contact-feedback";
  el.textContent = "";
}
