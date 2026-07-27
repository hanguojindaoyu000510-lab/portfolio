/**
 * KIM DOWOOK AI Portfolio - 상단 헤더 및 네비게이션 컴포넌트 (Header.js)
 * 로고, 섹션 링크 및 관리자 모드 토글 버튼 제공
 */

export function renderHeader(isAdmin, currentView, onAdminClick, onGoAdminConsole) {
  const header = document.createElement("header");
  header.className = "header-nav";
  header.style.cssText = `
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    background: rgba(11, 15, 23, 0.75);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border-glass);
    padding: 18px 0;
  `;

  const btnText = currentView === 'admin' 
    ? '🌐 메인 포트폴리오' 
    : (isAdmin ? '🔑 관리자 대시보드' : '🔑 관리자 로그인');

  header.innerHTML = `
    <div class="container" style="display: flex; align-items: center; justify-content: space-between;">
      <!-- 브랜드 로고 -->
      <a href="#" class="logo" style="display: flex; align-items: center; gap: 8px; font-size: 1.35rem; font-weight: 800; color: var(--text-main);">
        <span style="background: var(--grad-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">DOWOOK.AI</span>
      </a>

      <!-- 글로벌 네비게이션 메뉴 (캡슐형 스타일) -->
      <nav style="display: flex; align-items: center; gap: 24px;">
        <a href="#about" style="color: var(--text-muted); font-weight: 600; font-size: 0.95rem; transition: color 0.2s;" onmouseover="this.style.color='#00F0FF'" onmouseout="this.style.color='#94A3B8'">소개</a>
        <a href="#projects" style="color: var(--text-muted); font-weight: 600; font-size: 0.95rem; transition: color 0.2s;" onmouseover="this.style.color='#00F0FF'" onmouseout="this.style.color='#94A3B8'">작업물</a>
        <a href="#contact" style="color: var(--text-muted); font-weight: 600; font-size: 0.95rem; transition: color 0.2s;" onmouseover="this.style.color='#00F0FF'" onmouseout="this.style.color='#94A3B8'">연락처</a>
        
        <!-- 관리자 인증 / 전용 대시보드 접속 버튼 -->
        <button id="admin-auth-btn" class="btn-pill btn-pill-sm ${isAdmin ? 'btn-pill-primary' : 'btn-pill-secondary'}" style="margin-left: 12px;">
          ${btnText}
        </button>
      </nav>
    </div>
  `;

  // 관리자 버튼 클릭 이벤트 바인딩
  const adminBtn = header.querySelector("#admin-auth-btn");
  adminBtn.addEventListener("click", () => {
    if (currentView === 'admin') {
      onAdminClick('main');
    } else if (isAdmin) {
      onGoAdminConsole();
    } else {
      onAdminClick('login');
    }
  });

  return header;
}

