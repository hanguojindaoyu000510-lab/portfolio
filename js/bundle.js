/**
 * KIM DOWOOK AI Portfolio - 단일 번들 스크립트 (bundle.js)
 * 탐색기에서 file:// 로 직접 파일(index.html)을 더블 클릭할 때도
 * 브라우저 CORS 모듈 제약 없이 전용 관리자 대시보드(AdminPage)를 포함하여 화면이 즉시 렌더링되도록 지원하는 번들 파일입니다.
 */

(function () {
  // 1. 공통 유틸리티: 클립보드 복사
  function copyToClipboard(textToCopy, successMessage = "클립보드에 복사되었습니다!") {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => alert(successMessage));
      } else {
        const tempInput = document.createElement("input");
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        alert(successMessage);
      }
    } catch (err) {
      alert(`복사 실패. 수동 복사해 주세요: ${textToCopy}`);
    }
  }

  // 2. 공통 유틸리티: 태그 파싱
  function parseTags(tagString) {
    if (!tagString) return [];
    return tagString
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => (tag.startsWith("#") ? tag : `#${tag}`));
  }

  // 3. 데이터 및 상태 관리
  const defaultData = {
    profile: {
      name: "김도욱",
      headline: "AI 기술로 새로운 경험을 만드는 개발자, 김도욱입니다.",
      bio: "경기도 고양시에서 AI 트렌드를 탐구하며 사용자 중심의 최첨단 AI 웹사이트 및 앱 서비스를 개발하고 있습니다. 유용하고 감각적인 AI 경험을 선사하는 것이 저의 개발 목표입니다.",
      interests: ["AI 트렌드 연구", "AI 웹앱 개발", "서비스 런칭 & 데모"],
      techStack: ["OpenAI API", "Python", "React", "Next.js", "Vite", "Vanilla JS", "Tailored CSS"]
    },
    projects: [
      {
        id: 1,
        title: "🤖 AI 운세 쿠키 생성기",
        description: "오늘의 운세와 용기를 북돋아 주는 격언을 Generative AI가 맞춤 생성해 주는 웹 서비스",
        tags: ["#GPT-4o", "#JavaScript", "#Web Audio", "#CSS3"],
        demoUrl: "https://example.com/fortune",
        githubUrl: "https://github.com/example/fortune",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60"
      },
      {
        id: 2,
        title: "🎨 AI 캔버스 그림 해석기",
        description: "캔버스에 그린 그림과 이미지를 AI가 실시간으로 분석하고 심도 있게 해석해 주는 멀티모달 AI 서비스",
        tags: ["#VisionAI", "#Gemini", "#Canvas", "#React"],
        demoUrl: "https://ai.studio/apps/a6e6ef17-d596-4692-b76c-bd0169136f4a?fullscreenApplet=true",
        githubUrl: "https://github.com/example/canvas-ai",
        imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60"
      },
      {
        id: 3,
        title: "🎨 AI 시각 이미지 갤러리 & 프롬프트 생성기",
        description: "원하는 이미지 스타일을 프롬프트 명령어로 변환하고 실시간 렌더링을 돕는 유틸리티 웹앱",
        tags: ["#Midjourney", "#DALL-E3", "#Vite", "#CSS Glass"],
        demoUrl: "https://example.com/gallery",
        githubUrl: "https://github.com/example/gallery",
        imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=60"
      }
    ]
  };

  const STORAGE_KEY = "dowook_ai_portfolio_data";

  function getPortfolioData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      savePortfolioData(defaultData);
      return defaultData;
    }
    try {
      const data = JSON.parse(stored);
      if (data && data.projects) {
        const p2 = data.projects.find(p => p.id === 2);
        if (p2) {
          p2.title = "🎨 AI 캔버스 그림 해석기";
          p2.description = "캔버스에 그린 그림과 이미지를 AI가 실시간으로 분석하고 심도 있게 해석해 주는 멀티모달 AI 서비스";
          p2.tags = ["#VisionAI", "#Gemini", "#Canvas", "#React"];
          p2.demoUrl = "https://ai.studio/apps/a6e6ef17-d596-4692-b76c-bd0169136f4a?fullscreenApplet=true";
        }
      }
      return data;
    } catch (e) {
      return defaultData;
    }
  }

  function savePortfolioData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // 4. 애플리케이션 상태 (State)
  let state = {
    data: getPortfolioData(),
    isAdmin: false,
    currentView: "main"
  };

  const appRoot = document.getElementById("app");

  // 5. 컴포넌트 렌더러 정의
  function renderHeader() {
    const header = document.createElement("header");
    header.className = "header-nav";
    header.style.cssText = `
      position: sticky; top: 0; left: 0; width: 100%; z-index: 100;
      background: rgba(11, 15, 23, 0.75); backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-glass); padding: 18px 0;
    `;

    const btnText = state.currentView === 'admin'
      ? '🌐 메인 포트폴리오'
      : (state.isAdmin ? '🔑 관리자 대시보드' : '🔑 관리자 로그인');

    header.innerHTML = `
      <div class="container" style="display: flex; align-items: center; justify-content: space-between;">
        <a href="#" class="logo" style="display: flex; align-items: center; gap: 8px; font-size: 1.35rem; font-weight: 800; color: var(--text-main);">
          <span style="background: var(--grad-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">DOWOOK.AI</span>
        </a>
        <nav style="display: flex; align-items: center; gap: 24px;">
          <a href="#about" style="color: var(--text-muted); font-weight: 600; font-size: 0.95rem;">소개</a>
          <a href="#projects" style="color: var(--text-muted); font-weight: 600; font-size: 0.95rem;">작업물</a>
          <a href="#contact" style="color: var(--text-muted); font-weight: 600; font-size: 0.95rem;">연락처</a>
          <button id="admin-auth-btn" class="btn-pill btn-pill-sm ${state.isAdmin ? 'btn-pill-primary' : 'btn-pill-secondary'}" style="margin-left: 12px;">
            ${btnText}
          </button>
        </nav>
      </div>
    `;

    header.querySelector("#admin-auth-btn").addEventListener("click", () => {
      if (state.currentView === 'admin') {
        state.currentView = 'main';
        renderApp();
      } else if (state.isAdmin) {
        state.currentView = 'admin';
        renderApp();
      } else {
        openAdminLoginModal();
      }
    });

    return header;
  }

  function renderHero(profile) {
    const hero = document.createElement("section");
    hero.className = "hero-section";
    hero.style.cssText = "padding: 80px 0 60px 0; text-align: center;";
    hero.innerHTML = `
      <div class="container">
        <div style="display: inline-block; padding: 6px 18px; border-radius: var(--radius-pill); background: rgba(0, 240, 255, 0.1); border: 1px solid rgba(0, 240, 255, 0.3); color: #00F0FF; font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; margin-bottom: 24px;">
          ⚡ AI TREND & WEB-APP DEVELOPER
        </div>
        <h1 style="font-size: var(--fs-hero); font-weight: 800; color: var(--text-main); line-height: 1.25; margin-bottom: 20px; word-break: keep-all;">
          ${profile.headline}
        </h1>
        <p style="font-size: var(--fs-body-lg); color: var(--text-muted); max-width: 720px; margin: 0 auto 36px auto; line-height: 1.6;">
          학생분들과 소통하며 최신 Generative AI 기술을 접목한 웹사이트 및 앱 서비스를 개발하고 내역을 공유합니다.
        </p>
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
          <a href="#projects" class="btn-pill btn-pill-primary">🚀 작업물 구경하기</a>
          <a href="#contact" class="btn-pill btn-pill-secondary">💬 연락하기</a>
        </div>
      </div>
    `;
    return hero;
  }

  function renderBioSection(profile) {
    const bioSection = document.createElement("section");
    bioSection.id = "about";
    bioSection.style.cssText = "padding: 60px 0;";

    const interests = profile.interests || [];
    const techStack = profile.techStack || [];

    bioSection.innerHTML = `
      <div class="container">
        <div class="glass-card" style="padding: 40px; position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px; margin-bottom: 24px;">
            <div>
              <span class="tag-pill tag-pill-ai" style="margin-bottom: 12px; display: inline-block;">ABOUT ME</span>
              <h2 style="font-size: var(--fs-h1); font-weight: 700; color: var(--text-main);">
                안녕하세요, <span style="color: #00F0FF;">${profile.name}</span>입니다! 👋
              </h2>
            </div>
            ${state.isAdmin ? `
              <button id="go-admin-from-bio" class="btn-pill btn-pill-primary btn-pill-sm">
                ✏️ 자기소개 편집 (Admin Console)
              </button>
            ` : ''}
          </div>

          <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 32px;">
            ${profile.bio}
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
            <div style="background: rgba(11, 15, 23, 0.6); padding: 24px; border-radius: 16px; border: 1px solid var(--border-glass);">
              <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 12px;">🎯 핵심 관심 분야</h4>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${interests.map(i => `<span class="tag-pill tag-pill-ai">${i}</span>`).join('')}
              </div>
            </div>
            <div style="background: rgba(11, 15, 23, 0.6); padding: 24px; border-radius: 16px; border: 1px solid var(--border-glass);">
              <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 12px;">🛠️ 보유 기술 스택</h4>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${techStack.map(t => `<span class="tag-pill tag-pill-dev">${t}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const btnGoAdmin = bioSection.querySelector("#go-admin-from-bio");
    if (btnGoAdmin) {
      btnGoAdmin.addEventListener("click", () => {
        state.currentView = "admin";
        renderApp();
      });
    }

    return bioSection;
  }

  function renderProjectsSection(projects) {
    const section = document.createElement("section");
    section.id = "projects";
    section.style.cssText = "padding: 60px 0;";

    section.innerHTML = `
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 40px;">
          <div>
            <span class="tag-pill tag-pill-dev" style="margin-bottom: 12px; display: inline-block;">MY AI PROJECTS</span>
            <h2 style="font-size: var(--fs-h1); font-weight: 700; color: var(--text-main);">
              직접 개발한 <span style="color: #8B5CF6;">AI 웹 & 앱</span> 작업물 🚀
            </h2>
          </div>
          ${state.isAdmin ? `
            <button id="go-admin-from-proj" class="btn-pill btn-pill-primary btn-pill-sm">
              ➕ 작업물 추가 및 관리 (Admin Console)
            </button>
          ` : ''}
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 28px;">
          ${projects.map(p => `
            <div class="glass-card project-card" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="height: 180px; border-radius: 16px; overflow: hidden; margin-bottom: 20px; border: 1px solid var(--border-glass);">
                  <img src="${p.imageUrl}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">
                  ${p.tags.map(t => `<span class="tag-pill tag-pill-ai">${t}</span>`).join('')}
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 10px;">${p.title}</h3>
                <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 24px;">${p.description}</p>
              </div>
              <div style="display: flex; gap: 10px;">
                <a href="${p.demoUrl}" target="_blank" class="btn-pill btn-pill-primary btn-pill-sm" style="flex: 1; text-align: center; text-decoration: none;">🚀 바로가기</a>
                <a href="${p.githubUrl}" target="_blank" class="btn-pill btn-pill-secondary btn-pill-sm" style="text-decoration: none;">💻 Github</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const btnGoAdmin = section.querySelector("#go-admin-from-proj");
    if (btnGoAdmin) {
      btnGoAdmin.addEventListener("click", () => {
        state.currentView = "admin";
        renderApp();
      });
    }

    return section;
  }

  function renderContactSection() {
    const contact = document.createElement("section");
    contact.id = "contact";
    contact.style.cssText = "padding: 60px 0 80px 0;";
    contact.innerHTML = `
      <div class="container">
        <div class="glass-card" style="padding: 48px; text-align: center;">
          <span class="tag-pill tag-pill-ai" style="margin-bottom: 16px; display: inline-block;">GET IN TOUCH</span>
          <h2 style="font-size: var(--fs-h1); font-weight: 700; color: var(--text-main); margin-bottom: 16px;">
            함께 이야기 나누고 싶으신가요? 💬
          </h2>
          <p style="font-size: 1.05rem; color: var(--text-muted); max-width: 600px; margin: 0 auto 36px auto; line-height: 1.6;">
            학생분들의 질문이나 AI 프로젝트 제안, 협업 문의는 언제든 환영합니다!
          </p>
          <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <button id="btn-copy-email" class="btn-pill btn-pill-primary">📧 이메일 주소 복사하기</button>
            <a href="https://github.com" target="_blank" class="btn-pill btn-pill-secondary" style="text-decoration: none;">🐙 Github 프로필</a>
          </div>
        </div>
      </div>
    `;

    contact.querySelector("#btn-copy-email").addEventListener("click", () => {
      copyToClipboard("dowook.ai.dev@gmail.com", "📧 김도욱 개발자의 이메일 주소가 복사되었습니다!");
    });

    return contact;
  }

  // 6. 관리자 로그인 모달
  function openAdminLoginModal() {
    let modal = document.getElementById("admin-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "modal-overlay";
      modal.id = "admin-modal";
      modal.innerHTML = `
        <div class="modal-content">
          <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">🔑 관리자 인증 (김도욱 님 전용)</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 24px;">
            자기소개 및 작업물을 관리할 수 있는 암호를 입력해 주세요. (기본 암호: <code style="color: var(--color-primary);">1234</code>)
          </p>
          <form id="admin-form">
            <div style="margin-bottom: 20px;">
              <input type="password" id="admin-password-input" class="form-input" placeholder="비밀번호 입력 (예: 1234)" autofocus required />
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
              <button type="button" id="close-admin-modal" class="btn-pill btn-pill-secondary btn-pill-sm">취소</button>
              <button type="submit" class="btn-pill btn-pill-primary btn-pill-sm">인증하기</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector("#close-admin-modal").addEventListener("click", () => modal.classList.remove("active"));
      modal.querySelector("#admin-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const pwd = modal.querySelector("#admin-password-input").value;
        if (pwd === "1234") {
          state.isAdmin = true;
          state.currentView = "admin";
          modal.classList.remove("active");
          alert("🔓 관리자 인증 성공! 전용 대시보드(Admin Console)로 접속합니다.");
          renderApp();
        } else {
          alert("❌ 비밀번호가 올바르지 않습니다.");
        }
      });
    }
    setTimeout(() => modal.classList.add("active"), 10);
  }

  // 7. 전용 관리자 대시보드 뷰 (Admin Console)
  let activeAdminTab = "bio";
  let editingProjId = null;

  function renderAdminPageBundle() {
    const adminContainer = document.createElement("div");
    adminContainer.className = "admin-dashboard-container";

    adminContainer.innerHTML = `
      <header class="admin-header">
        <div class="container admin-header-inner">
          <div class="admin-brand">
            <span class="admin-badge">ADMIN CONSOLE</span>
            <h2>🔑 김도욱 개발자 전용 관리자 페이지</h2>
          </div>
          <div class="admin-actions">
            <button id="btn-back-to-main-bundle" class="btn-pill btn-pill-secondary btn-pill-sm">🌐 메인 포트폴리오 보기</button>
            <button id="btn-admin-logout-bundle" class="btn-pill btn-pill-danger btn-pill-sm">🚪 로그아웃</button>
          </div>
        </div>
      </header>

      <main class="container admin-main-content">
        <div class="glass-card admin-welcome-card" style="margin-bottom: 32px; padding: 24px 32px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">반갑습니다, 김도욱 님! 👋</h3>
              <p style="font-size: 0.9rem; color: var(--text-muted);">
                이곳에서 자기소개 문구와 AI 작업물(프로젝트)을 실시간으로 관리할 수 있습니다. 변경사항은 <strong>LocalStorage</strong>에 즉시 저장됩니다.
              </p>
            </div>
            <div class="admin-stats-pills">
              <span class="tag-pill tag-pill-ai">📦 등록된 프로젝트: ${state.data.projects.length}개</span>
            </div>
          </div>
        </div>

        <div class="admin-tabs-nav" style="margin-bottom: 28px;">
          <button class="admin-tab-btn ${activeAdminTab === 'bio' ? 'active' : ''}" id="tab-bio-btn">👤 자기소개 관리</button>
          <button class="admin-tab-btn ${activeAdminTab === 'projects' ? 'active' : ''}" id="tab-proj-btn">🚀 작업물(프로젝트) CRUD 관리</button>
          <button class="admin-tab-btn ${activeAdminTab === 'data' ? 'active' : ''}" id="tab-data-btn">💾 데이터 백업 & 초기화</button>
        </div>

        <div class="admin-tab-content">
          ${activeAdminTab === 'bio' ? renderBioAdminTab() : ''}
          ${activeAdminTab === 'projects' ? renderProjectsAdminTab() : ''}
          ${activeAdminTab === 'data' ? renderDataAdminTab() : ''}
        </div>
      </main>
    `;

    // 이벤트 바인딩
    adminContainer.querySelector("#btn-back-to-main-bundle").addEventListener("click", () => {
      state.currentView = "main";
      renderApp();
    });

    adminContainer.querySelector("#btn-admin-logout-bundle").addEventListener("click", () => {
      state.isAdmin = false;
      state.currentView = "main";
      alert("🔒 관리자 로그아웃 되었습니다.");
      renderApp();
    });

    adminContainer.querySelector("#tab-bio-btn").addEventListener("click", () => {
      activeAdminTab = "bio";
      editingProjId = null;
      renderApp();
    });
    adminContainer.querySelector("#tab-proj-btn").addEventListener("click", () => {
      activeAdminTab = "projects";
      editingProjId = null;
      renderApp();
    });
    adminContainer.querySelector("#tab-data-btn").addEventListener("click", () => {
      activeAdminTab = "data";
      editingProjId = null;
      renderApp();
    });

    // 폼 및 인터랙션 핸들러 등록
    bindAdminEvents(adminContainer);

    return adminContainer;
  }

  function renderBioAdminTab() {
    const prof = state.data.profile;
    return `
      <div class="glass-card admin-form-card">
        <h3 class="admin-section-title">👤 자기소개 (Bio) 정보 수정</h3>
        <p class="admin-section-desc">포트폴리오 메인 화면의 메인 타이틀, 대표 헤드라인, 상세 소개글을 수정합니다.</p>

        <form id="admin-bio-form" class="admin-form-grid">
          <div class="form-group">
            <label class="form-label">개발자 성함</label>
            <input type="text" id="bio-name" class="form-input" value="${prof.name || '김도욱'}" required />
          </div>
          <div class="form-group">
            <label class="form-label">메인 대표 헤드라인 (한 줄 타이틀)</label>
            <input type="text" id="bio-headline" class="form-input" value="${prof.headline || ''}" required />
          </div>
          <div class="form-group">
            <label class="form-label">관심 분야 & 주요 태그 (쉼표 분리)</label>
            <input type="text" id="bio-tags" class="form-input" value="${prof.interests ? prof.interests.join(', ') : ''}" placeholder="AI 트렌드, 웹앱 개발, 서비스 런칭" required />
          </div>
          <div class="form-group full-width">
            <label class="form-label">상세 자기소개글 (Bio)</label>
            <textarea id="bio-text" class="form-input" rows="5" required>${prof.bio || ''}</textarea>
          </div>
          <div class="form-actions full-width">
            <button type="submit" class="btn-pill btn-pill-primary">💾 자기소개 저장하기</button>
          </div>
        </form>
      </div>
    `;
  }

  function renderProjectsAdminTab() {
    const editingProj = state.data.projects.find(p => p.id === editingProjId);
    return `
      <div class="admin-projects-layout">
        <div class="glass-card admin-form-card" style="margin-bottom: 32px;">
          <h3 class="admin-section-title">${editingProj ? '✏️ 프로젝트 수정 모드' : '➕ 신규 AI 프로젝트 추가'}</h3>
          <p class="admin-section-desc">${editingProj ? `ID: ${editingProj.id} 프로젝트를 수정 중입니다.` : '새롭게 만든 AI 웹사이트 및 앱 프로젝트 정보를 입력하세요.'}</p>
          <form id="admin-project-form" class="admin-form-grid">
            <div class="form-group">
              <label class="form-label">프로젝트 제목</label>
              <input type="text" id="proj-title" class="form-input" value="${editingProj ? editingProj.title : ''}" placeholder="예: 🤖 AI 요약 챗봇" required />
            </div>
            <div class="form-group">
              <label class="form-label">기술 태그 (쉼표 분리)</label>
              <input type="text" id="proj-tags" class="form-input" value="${editingProj ? editingProj.tags.join(', ') : ''}" placeholder="#GPT-4o, #React, #Vite" required />
            </div>
            <div class="form-group full-width">
              <label class="form-label">한 줄 요약 설명</label>
              <input type="text" id="proj-desc" class="form-input" value="${editingProj ? editingProj.description : ''}" placeholder="프로젝트의 핵심 AI 기능과 가치" required />
            </div>
            <div class="form-group">
              <label class="form-label">🚀 접속 바로가기 (Live Demo URL)</label>
              <input type="url" id="proj-demo" class="form-input" value="${editingProj ? editingProj.demoUrl : ''}" placeholder="https://example.com/demo" required />
            </div>
            <div class="form-group">
              <label class="form-label">💻 Github URL</label>
              <input type="url" id="proj-github" class="form-input" value="${editingProj ? editingProj.githubUrl : ''}" placeholder="https://github.com/user/repo" required />
            </div>
            <div class="form-group full-width">
              <label class="form-label">🖼️ 썸네일 이미지 URL</label>
              <input type="url" id="proj-img" class="form-input" value="${editingProj ? editingProj.imageUrl : ''}" placeholder="https://images.unsplash.com/..." />
            </div>
            <div class="form-actions full-width">
              ${editingProj ? `
                <button type="button" id="btn-cancel-edit-bundle" class="btn-pill btn-pill-secondary">취소</button>
                <button type="submit" class="btn-pill btn-pill-primary">✏️ 수정 저장하기</button>
              ` : `
                <button type="submit" class="btn-pill btn-pill-primary">➕ 프로젝트 등록하기</button>
              `}
            </div>
          </form>
        </div>

        <div class="glass-card admin-table-card">
          <h3 class="admin-section-title">📂 등록된 프로젝트 목록 (${state.data.projects.length}개)</h3>
          <div class="admin-projects-list">
            ${state.data.projects.map(p => `
              <div class="admin-project-item ${editingProjId === p.id ? 'editing' : ''}">
                <div class="admin-proj-info">
                  <div class="admin-proj-title">
                    <strong>${p.title}</strong>
                    <span class="tag-pill tag-pill-ai" style="margin-left: 8px;">ID: ${p.id}</span>
                  </div>
                  <p class="admin-proj-desc">${p.description}</p>
                </div>
                <div class="admin-proj-actions">
                  <button class="btn-pill btn-pill-secondary btn-pill-sm btn-edit-proj" data-id="${p.id}">✏️ 수정</button>
                  <button class="btn-pill btn-pill-danger btn-pill-sm btn-delete-proj" data-id="${p.id}">🗑️ 삭제</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderDataAdminTab() {
    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        <div class="glass-card">
          <h3 style="font-size: 1.15rem; color: var(--text-main); margin-bottom: 8px;">📥 JSON 데이터 백업 다운로드</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 20px;">저장된 포트폴리오 데이터를 JSON 파일로 다운로드합니다.</p>
          <button id="btn-export-json-bundle" class="btn-pill btn-pill-primary btn-pill-sm">📥 JSON 다운로드</button>
        </div>
        <div class="glass-card">
          <h3 style="font-size: 1.15rem; color: var(--text-main); margin-bottom: 8px;">🔄 기본 데이터로 리셋</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 20px;">데이터를 초기 기본 샘플 상태로 복구합니다.</p>
          <button id="btn-reset-default-bundle" class="btn-pill btn-pill-danger btn-pill-sm">🔄 초기화 실행</button>
        </div>
      </div>
    `;
  }

  function bindAdminEvents(container) {
    const bioForm = container.querySelector("#admin-bio-form");
    if (bioForm) {
      bioForm.addEventListener("submit", (e) => {
        e.preventDefault();
        state.data.profile.name = container.querySelector("#bio-name").value;
        state.data.profile.headline = container.querySelector("#bio-headline").value;
        state.data.profile.interests = parseTags(container.querySelector("#bio-tags").value);
        state.data.profile.bio = container.querySelector("#bio-text").value;
        savePortfolioData(state.data);
        alert("✨ 자기소개 수정사항이 로컬 스토리지에 정상 반영되었습니다!");
        renderApp();
      });
    }

    const projForm = container.querySelector("#admin-project-form");
    if (projForm) {
      projForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = container.querySelector("#proj-title").value;
        const description = container.querySelector("#proj-desc").value;
        const tags = parseTags(container.querySelector("#proj-tags").value);
        const demoUrl = container.querySelector("#proj-demo").value;
        const githubUrl = container.querySelector("#proj-github").value;
        const imageUrl = container.querySelector("#proj-img").value || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60";

        if (editingProjId) {
          const idx = state.data.projects.findIndex(p => p.id === editingProjId);
          if (idx !== -1) {
            state.data.projects[idx] = { id: editingProjId, title, description, tags, demoUrl, githubUrl, imageUrl };
            savePortfolioData(state.data);
            alert("✏️ 프로젝트 수정사항이 저장되었습니다!");
          }
          editingProjId = null;
        } else {
          const newP = { id: Date.now(), title, description, tags, demoUrl, githubUrl, imageUrl };
          state.data.projects.unshift(newP);
          savePortfolioData(state.data);
          alert("🚀 신규 AI 프로젝트가 등록되었습니다!");
        }
        renderApp();
      });
    }

    const editBtns = container.querySelectorAll(".btn-edit-proj");
    editBtns.forEach(b => {
      b.addEventListener("click", (e) => {
        editingProjId = Number(e.currentTarget.getAttribute("data-id"));
        renderApp();
      });
    });

    const cancelEditBtn = container.querySelector("#btn-cancel-edit-bundle");
    if (cancelEditBtn) {
      cancelEditBtn.addEventListener("click", () => {
        editingProjId = null;
        renderApp();
      });
    }

    const deleteBtns = container.querySelectorAll(".btn-delete-proj");
    deleteBtns.forEach(b => {
      b.addEventListener("click", (e) => {
        const id = Number(e.currentTarget.getAttribute("data-id"));
        if (confirm("정말 이 프로젝트를 삭제하시겠습니까?")) {
          state.data.projects = state.data.projects.filter(p => p.id !== id);
          savePortfolioData(state.data);
          if (editingProjId === id) editingProjId = null;
          renderApp();
        }
      });
    });

    const exportBtn = container.querySelector("#btn-export-json-bundle");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const jsonStr = JSON.stringify(state.data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `dowook_portfolio_backup_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    const resetBtn = container.querySelector("#btn-reset-default-bundle");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("모든 저장 데이터가 초기 샘플로 초기화됩니다. 진행하시겠습니까?")) {
          localStorage.removeItem(STORAGE_KEY);
          state.data = getPortfolioData();
          alert("🔄 데이터가 초기화되었습니다.");
          renderApp();
        }
      });
    }
  }

  // 8. 메인 애플리케이션 렌더 루프
  function renderApp() {
    appRoot.innerHTML = "";

    if (state.currentView === "admin" && state.isAdmin) {
      appRoot.appendChild(renderAdminPageBundle());
      return;
    }

    appRoot.appendChild(renderHeader());

    const mainEl = document.createElement("main");
    mainEl.appendChild(renderHero(state.data.profile));
    mainEl.appendChild(renderBioSection(state.data.profile));
    mainEl.appendChild(renderProjectsSection(state.data.projects));
    mainEl.appendChild(renderContactSection());
    appRoot.appendChild(mainEl);

    const footer = document.createElement("footer");
    footer.style.cssText = "text-align: center; padding: 40px 0; color: var(--text-dim); font-size: 0.85rem; border-top: 1px solid var(--border-glass); margin-top: 60px;";
    footer.innerHTML = `<div class="container"><p>© 2026 KIM DOWOOK. AI Portfolio All Rights Reserved.</p></div>`;
    appRoot.appendChild(footer);
  }

  document.addEventListener("DOMContentLoaded", renderApp);
})();
