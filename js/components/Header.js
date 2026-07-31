/**
 * KIM DOWOOK AI Portfolio - 상단 헤더 및 네비게이션 컴포넌트 (Header.js)
 * 다크 슬레이트 글래스 헤더 바 & 순백색(#FFFFFF) 고대비 네비게이션 텍스트
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
    background: rgba(15, 23, 42, 0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1.5px solid rgba(56, 189, 248, 0.3);
    padding: 14px 0;
    box-shadow: 0 8px 32px rgba(15, 23, 42, 0.3);
  `;

  const btnText = currentView === 'admin' 
    ? '🐾 메인 포트폴리오' 
    : (isAdmin ? '👑 관리자 대시보드' : '🔑 관리자 로그인');

  header.innerHTML = `
    <div class="container" style="display: flex; align-items: center; justify-content: space-between;">
      <!-- 귀여운 고양이 브랜드 로고 -->
      <a href="#" class="logo" style="display: flex; align-items: center; gap: 8px; font-size: 1.4rem; font-weight: 800; color: #FFFFFF; text-decoration: none;">
        <span style="font-size: 1.3rem; filter: brightness(0) invert(1);" class="cat-bounce paw-icon-white">🐾</span>
        <span style="background: var(--grad-primary); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">DOWOOK.AI</span>
        <span style="font-size: 1.2rem;">🐱</span>
      </a>

      <!-- 글로벌 네비게이션 메뉴 (순백색 #FFFFFF 고대비 텍스트 & 스카이블루 호버 이펙트) -->
      <nav style="display: flex; align-items: center; gap: 10px;">
        <a href="#about" class="nav-item-link" style="color: #FFFFFF; font-weight: 800; font-size: 1.05rem; padding: 8px 18px; border-radius: var(--radius-pill); transition: all 0.2s ease; text-decoration: none;" onmouseover="this.style.color='#38BDF8'; this.style.backgroundColor='rgba(56, 189, 248, 0.2)'" onmouseout="this.style.color='#FFFFFF'; this.style.backgroundColor='transparent'">소개</a>
        <a href="#projects" class="nav-item-link" style="color: #FFFFFF; font-weight: 800; font-size: 1.05rem; padding: 8px 18px; border-radius: var(--radius-pill); transition: all 0.2s ease; text-decoration: none;" onmouseover="this.style.color='#38BDF8'; this.style.backgroundColor='rgba(56, 189, 248, 0.2)'" onmouseout="this.style.color='#FFFFFF'; this.style.backgroundColor='transparent'">작업물</a>
        <a href="#contact" class="nav-item-link" style="color: #FFFFFF; font-weight: 800; font-size: 1.05rem; padding: 8px 18px; border-radius: var(--radius-pill); transition: all 0.2s ease; text-decoration: none;" onmouseover="this.style.color='#38BDF8'; this.style.backgroundColor='rgba(56, 189, 248, 0.2)'" onmouseout="this.style.color='#FFFFFF'; this.style.backgroundColor='transparent'">연락처</a>
        
        <!-- 관리자 접속 버튼 -->
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
