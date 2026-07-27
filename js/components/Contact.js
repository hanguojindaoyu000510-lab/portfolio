/**
 * KIM DOWOOK AI Portfolio - 소셜 & 연락처 섹션 컴포넌트 (Contact.js)
 * 1:1 오픈채팅, 이메일 클립보드 복사, Github 바로가기 제공
 */

import { copyToClipboard } from "../utils/clipboard.js";

export function renderContactSection() {
  const contactSection = document.createElement("section");
  contactSection.id = "contact";
  contactSection.className = "section";

  contactSection.innerHTML = `
    <div class="container">
      <div class="glass-card pulse-glow" style="text-align: center; padding: 60px 24px; position: relative;">
        <!-- 섹션 헤더 -->
        <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-main); margin-bottom: 12px;">
          💬 LET'S CONNECT!
        </h2>
        <p style="font-size: 1.05rem; color: var(--text-muted); max-width: 600px; margin: 0 auto 36px;">
          프로젝트 문의, 기술 질문, 피드백 등 어떤 소통이든 환영합니다. 부담 없이 연락해 주세요!
        </p>

        <!-- 소셜 & 연락처 캡슐 버튼 모음 -->
        <div style="display: flex; justify-content: center; align-items: center; gap: 16px; flex-wrap: wrap;">
          <!-- 1:1 오픈채팅 -->
          <a href="https://open.kakao.com" target="_blank" rel="noopener noreferrer" class="btn-pill btn-pill-primary">
            🟡 1:1 오픈채팅 참여하기
          </a>

          <!-- 이메일 복사 버튼 -->
          <button id="copy-email-btn" class="btn-pill btn-pill-secondary">
            ✉️ 이메일 주소 복사
          </button>

          <!-- Github 바로가기 -->
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="btn-pill btn-pill-secondary">
            💻 Github 프로필
          </a>
        </div>
      </div>
    </div>
  `;

  // 이메일 주소 복사 공통 유틸리티 바인딩
  const copyBtn = contactSection.querySelector("#copy-email-btn");
  copyBtn.addEventListener("click", () => {
    const dummyEmail = "dowook.ai.dev@gmail.com";
    copyToClipboard(dummyEmail, `이메일 주소(${dummyEmail})가 클립보드에 복사되었습니다!`);
  });

  return contactSection;
}
