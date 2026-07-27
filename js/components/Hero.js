/**
 * KIM DOWOOK AI Portfolio - 메인 히어로 섹션 컴포넌트 (Hero.js)
 * 첫인상을 좌우하는 대형 메인 타이틀 및 캡슐 액션 버튼 제공
 */

export function renderHero(profileData) {
  const heroSection = document.createElement("section");
  heroSection.className = "section hero-section animate-fade-in";
  heroSection.style.cssText = `
    padding: 100px 0 60px;
    text-align: center;
    position: relative;
  `;

  heroSection.innerHTML = `
    <div class="container" style="max-width: 900px;">
      <!-- 상단 상징 뱃지 -->
      <div style="margin-bottom: 24px;">
        <span class="tag-pill tag-pill-ai pulse-glow" style="padding: 6px 18px; font-size: 0.85rem; height: auto;">
          ✨ AI Web & App Developer Portfolio
        </span>
      </div>

      <!-- 메인 임팩트 타이틀 -->
      <h1 style="font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 800; line-height: 1.25; margin-bottom: 24px; letter-spacing: -0.02em;">
        AI 기술로 새로운 경험을 만드는<br/>
        개발자 <span style="background: var(--grad-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">김도욱</span>입니다.
      </h1>

      <!-- 세부 타이틀 및 관심 분야 태그 -->
      <p style="font-size: 1.15rem; color: var(--text-muted); margin-bottom: 36px; max-width: 720px; margin-left: auto; margin-right: auto; word-break: keep-all;">
        학생분들을 포함한 모든 사용자에게 유용하고 감각적인 AI 웹/앱 프로젝트를 공유하고 개발합니다.
      </p>

      <!-- 캡슐형 퀵 액션 버튼 모음 -->
      <div style="display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap;">
        <a href="#projects" class="btn-pill btn-pill-primary">
          🚀 작업물 구경하기
        </a>
        <a href="#contact" class="btn-pill btn-pill-secondary">
          💬 1:1 연락하기
        </a>
      </div>
    </div>
  `;

  return heroSection;
}
