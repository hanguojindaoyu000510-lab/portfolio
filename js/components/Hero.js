/**
 * KIM DOWOOK AI Portfolio - 메인 히어로 섹션 컴포넌트 (Hero.js)
 * 시원하고 귀여운 스카이블루 & 민트 그린 고양이 AI 테마
 */

export function renderHero(profileData) {
  const heroSection = document.createElement("section");
  heroSection.className = "section hero-section animate-fade-in";
  heroSection.style.cssText = `
    padding: 80px 0 60px;
    position: relative;
  `;

  heroSection.innerHTML = `
    <div class="container" style="max-width: 1000px;">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 40px; flex-wrap: wrap-reverse;">
        <!-- 좌측 텍스트 인트로 영역 -->
        <div style="flex: 1; min-width: 320px; text-align: left;">
          <!-- 상단 귀여운 고양이 뱃지 -->
          <div style="margin-bottom: 20px;">
            <span class="tag-pill tag-pill-ai pulse-glow" style="padding: 8px 20px; font-size: 0.9rem; height: auto; border-radius: var(--radius-pill); font-weight: 700;">
              🐱‍💻 MINT & SKY AI CAT DEVELOPER 🐾
            </span>
          </div>

          <!-- 메인 헤드라인 타이틀 -->
          <h1 style="font-size: clamp(2.2rem, 4.5vw, 3.4rem); font-weight: 800; line-height: 1.3; margin-bottom: 20px; letter-spacing: -0.02em; color: var(--text-main);">
            AI 기술로 시원하고 스마트한<br/>
            경험을 만드는 <span style="background: var(--grad-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">김도욱</span>입니다 🐾
          </h1>

          <!-- 세부 타이틀 및 설명 -->
          <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 32px; max-width: 580px; word-break: keep-all; line-height: 1.7;">
            ${profileData && profileData.headline ? profileData.headline : "유용하고 감각적인 AI 서비스를 개발하고 사용자와 함께 소통해 나갑니다."}
          </p>

          <!-- 캡슐형 퀵 액션 버튼 모음 -->
          <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
            <a href="#projects" class="btn-pill btn-pill-primary" style="font-size: 1.05rem;">
              🐾 작업물 구경하기
            </a>
            <a href="#contact" class="btn-pill btn-pill-secondary" style="font-size: 1.05rem;">
              ✉️ 이메일 보내기
            </a>
          </div>
        </div>

        <!-- 우측 고양이 개발자 아바타 일러스트 -->
        <div style="flex: 0 0 280px; text-align: center; margin: 0 auto;">
          <div class="glass-card pulse-glow" style="padding: 16px; border-radius: 36px; background: #FFFFFF; border: 2px solid rgba(56, 189, 248, 0.4); box-shadow: 0 20px 40px rgba(56, 189, 248, 0.25);">
            <img 
              src="./assets/cat_developer.png" 
              alt="AI Cat Developer Avatar" 
              style="width: 100%; height: 260px; object-fit: cover; border-radius: 28px;"
              class="cat-bounce"
            />
            <div style="margin-top: 12px; font-weight: 800; font-size: 0.95rem; color: var(--color-primary);">
              🐾 DOWOOK CAT AI 🐱
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return heroSection;
}
