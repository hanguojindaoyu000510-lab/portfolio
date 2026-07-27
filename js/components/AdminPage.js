/**
 * KIM DOWOOK AI Portfolio - 전용 관리자 대시보드 페이지 컴포넌트 (AdminPage.js)
 * prd.md F-04 명세 및 design.md 가이드라인 준수
 */

import { parseTags } from "../utils/validator.js";

/**
 * 전용 관리자 대시보드 페이지 렌더링
 * @param {Object} data - 포트폴리오 데이터 (profile, projects)
 * @param {Object} callbacks - 이벤트를 처리할 콜백 함수 모음
 */
export function renderAdminPage(data, callbacks) {
  const adminContainer = document.createElement("div");
  adminContainer.className = "admin-dashboard-container";
  adminContainer.id = "admin-page-view";

  // 상태 관리를 위한 내부 액티브 탭
  let activeTab = "bio"; // 'bio' | 'projects' | 'data'
  let editingProjectId = null; // 수정 중인 프로젝트 ID

  function updateView() {
    adminContainer.innerHTML = `
      <!-- 1. 관리자 전용 상단 헤더 -->
      <header class="admin-header">
        <div class="container admin-header-inner">
          <div class="admin-brand">
            <span class="admin-badge">ADMIN CONSOLE</span>
            <h2>🔑 김도욱 개발자 전용 관리자 페이지</h2>
          </div>
          <div class="admin-actions">
            <button id="btn-back-to-main" class="btn-pill btn-pill-secondary btn-pill-sm">
              🌐 메인 포트폴리오 보기
            </button>
            <button id="btn-admin-logout" class="btn-pill btn-pill-danger btn-pill-sm">
              🚪 로그아웃
            </button>
          </div>
        </div>
      </header>

      <!-- 2. 본문 컨테이너 -->
      <main class="container admin-main-content">
        <!-- 2-A. 환영 안내 배너 -->
        <div class="glass-card admin-welcome-card" style="margin-bottom: 32px; padding: 24px 32px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">
                반갑습니다, 김도욱 님! 👋
              </h3>
              <p style="font-size: 0.9rem; color: var(--text-muted);">
                이곳에서 자기소개 문구와 AI 작업물(프로젝트)을 실시간으로 관리할 수 있습니다. 변경사항은 <strong>로컬 스토리지(LocalStorage)</strong>에 즉시 저장됩니다.
              </p>
            </div>
            <div class="admin-stats-pills">
              <span class="tag-pill tag-pill-ai">📦 등록된 프로젝트: ${data.projects.length}개</span>
              <span class="tag-pill tag-pill-dev">💾 저장소: Browser LocalStorage</span>
            </div>
          </div>
        </div>

        <!-- 2-B. 탭 메뉴 -->
        <div class="admin-tabs-nav" style="margin-bottom: 28px;">
          <button class="admin-tab-btn ${activeTab === 'bio' ? 'active' : ''}" data-tab="bio">
            👤 자기소개 관리
          </button>
          <button class="admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}" data-tab="projects">
            🚀 작업물(프로젝트) CRUD 관리
          </button>
          <button class="admin-tab-btn ${activeTab === 'data' ? 'active' : ''}" data-tab="data">
            💾 데이터 백업 & 초기화
          </button>
        </div>

        <!-- 2-C. 탭 콘텐츠 영역 -->
        <div class="admin-tab-content">
          ${activeTab === 'bio' ? renderBioTab(data.profile) : ''}
          ${activeTab === 'projects' ? renderProjectsTab(data.projects, editingProjectId) : ''}
          ${activeTab === 'data' ? renderDataTab() : ''}
        </div>
      </main>
    `;

    bindEvents();
  }

  /**
   * 탭 1: 자기소개 관리 폼 렌더링
   */
  function renderBioTab(profile) {
    const tagsString = profile.interests ? profile.interests.join(", ") : "";
    return `
      <div class="glass-card admin-form-card">
        <h3 class="admin-section-title">👤 자기소개 (Bio) 정보 수정</h3>
        <p class="admin-section-desc">포트폴리오 메인 화면의 메인 타이틀, 대표 헤드라인, 상세 소개글을 수정합니다.</p>

        <form id="admin-bio-form" class="admin-form-grid">
          <div class="form-group">
            <label class="form-label">개발자 성함</label>
            <input type="text" id="bio-name" class="form-input" value="${profile.name || '김도욱'}" required />
          </div>

          <div class="form-group">
            <label class="form-label">메인 대표 헤드라인 (한 줄 타이틀)</label>
            <input type="text" id="bio-headline" class="form-input" value="${profile.headline || ''}" required />
          </div>

          <div class="form-group">
            <label class="form-label">관심 분야 & 주요 태그 (쉼표 분리)</label>
            <input type="text" id="bio-tags" class="form-input" value="${tagsString}" placeholder="AI 트렌드, 웹앱 개발, 서비스 런칭" required />
          </div>

          <div class="form-group full-width">
            <label class="form-label">상세 자기소개글 (Bio)</label>
            <textarea id="bio-text" class="form-input" rows="5" required>${profile.bio || ''}</textarea>
          </div>

          <div class="form-actions full-width">
            <button type="submit" class="btn-pill btn-pill-primary">
              💾 자기소개 저장하기
            </button>
          </div>
        </form>
      </div>
    `;
  }

  /**
   * 탭 2: 작업물(프로젝트) 목록 및 CRUD 폼 렌더링
   */
  function renderProjectsTab(projects, editId) {
    const editingProject = projects.find(p => p.id === editId);

    return `
      <div class="admin-projects-layout">
        <!-- 2-1. 프로젝트 등록/수정 폼 카드 -->
        <div class="glass-card admin-form-card" style="margin-bottom: 32px;">
          <h3 class="admin-section-title">
            ${editingProject ? '✏️ 프로젝트 수정 모드' : '➕ 신규 AI 프로젝트 추가'}
          </h3>
          <p class="admin-section-desc">
            ${editingProject ? `ID: ${editingProject.id} 프로젝트를 수정 중입니다.` : '새롭게 만든 AI 웹사이트 및 앱 프로젝트 정보를 입력하세요.'}
          </p>

          <form id="admin-project-form" class="admin-form-grid">
            <div class="form-group">
              <label class="form-label">프로젝트 제목</label>
              <input type="text" id="proj-title" class="form-input" value="${editingProject ? editingProject.title : ''}" placeholder="예: 🤖 AI 요약 챗봇" required />
            </div>

            <div class="form-group">
              <label class="form-label">기술 태그 (쉼표 분리)</label>
              <input type="text" id="proj-tags" class="form-input" value="${editingProject ? editingProject.tags.join(', ') : ''}" placeholder="#GPT-4o, #React, #Vite" required />
            </div>

            <div class="form-group full-width">
              <label class="form-label">한 줄 요약 설명</label>
              <input type="text" id="proj-desc" class="form-input" value="${editingProject ? editingProject.description : ''}" placeholder="프로젝트의 핵심 AI 기능과 가치를 설명하세요." required />
            </div>

            <div class="form-group">
              <label class="form-label">🚀 접속 바로가기 (Live Demo URL)</label>
              <input type="url" id="proj-demo" class="form-input" value="${editingProject ? editingProject.demoUrl : ''}" placeholder="https://example.com/demo" required />
            </div>

            <div class="form-group">
              <label class="form-label">💻 Github 레포지토리 URL</label>
              <input type="url" id="proj-github" class="form-input" value="${editingProject ? editingProject.githubUrl : ''}" placeholder="https://github.com/user/repo" required />
            </div>

            <div class="form-group full-width">
              <label class="form-label">🖼️ 썸네일 이미지 URL (선택사항)</label>
              <input type="url" id="proj-img" class="form-input" value="${editingProject ? editingProject.imageUrl : ''}" placeholder="https://images.unsplash.com/..." />
            </div>

            <div class="form-actions full-width">
              ${editingProject ? `
                <button type="button" id="btn-cancel-edit" class="btn-pill btn-pill-secondary">취소</button>
                <button type="submit" class="btn-pill btn-pill-primary">✏️ 수정 저장하기</button>
              ` : `
                <button type="submit" class="btn-pill btn-pill-primary">➕ 프로젝트 등록하기</button>
              `}
            </div>
          </form>
        </div>

        <!-- 2-2. 등록된 프로젝트 목록 관리 테이블 -->
        <div class="glass-card admin-table-card">
          <h3 class="admin-section-title">📂 등록된 프로젝트 목록 (${projects.length}개)</h3>
          <p class="admin-section-desc">등록된 작업물을 확인하고 수정하거나 삭제할 수 있습니다.</p>

          <div class="admin-projects-list">
            ${projects.map(proj => `
              <div class="admin-project-item ${editingProjectId === proj.id ? 'editing' : ''}">
                <div class="admin-proj-info">
                  <div class="admin-proj-title">
                    <strong>${proj.title}</strong>
                    <span class="tag-pill tag-pill-ai" style="margin-left: 8px;">ID: ${proj.id}</span>
                  </div>
                  <p class="admin-proj-desc">${proj.description}</p>
                  <div class="admin-proj-tags" style="margin-top: 6px;">
                    ${proj.tags.map(tag => `<span class="tag-pill tag-pill-dev">${tag}</span>`).join(' ')}
                  </div>
                </div>
                <div class="admin-proj-actions">
                  <button class="btn-pill btn-pill-secondary btn-pill-sm btn-edit-proj" data-id="${proj.id}">
                    ✏️ 수정
                  </button>
                  <button class="btn-pill btn-pill-danger btn-pill-sm btn-delete-proj" data-id="${proj.id}">
                    🗑️ 삭제
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 탭 3: 데이터 백업 및 복원 렌더링
   */
  function renderDataTab() {
    return `
      <div class="admin-data-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        <!-- 카드 1: 백업 다운로드 -->
        <div class="glass-card">
          <h3 style="font-size: 1.15rem; color: var(--text-main); margin-bottom: 8px;">📥 JSON 데이터 백업 다운로드</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 20px;">
            현재 저장된 모든 포트폴리오 데이터를 JSON 파일로 다운로드하여 백업합니다.
          </p>
          <button id="btn-export-json" class="btn-pill btn-pill-primary btn-pill-sm">
            📥 JSON 다운로드
          </button>
        </div>

        <!-- 카드 2: 데이터 업로드 복원 -->
        <div class="glass-card">
          <h3 style="font-size: 1.15rem; color: var(--text-main); margin-bottom: 8px;">📤 백업 JSON 파일 가져오기</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 20px;">
            백업해둔 JSON 파일을 선택하여 로컬 스토리지 데이터를 복원합니다.
          </p>
          <input type="file" id="input-import-json" accept=".json" style="display: none;" />
          <button id="btn-trigger-import" class="btn-pill btn-pill-secondary btn-pill-sm">
            📤 JSON 파일 선택
          </button>
        </div>

        <!-- 카드 3: 초기 기본 데이터 복원 -->
        <div class="glass-card">
          <h3 style="font-size: 1.15rem; color: var(--text-main); margin-bottom: 8px;">🔄 기본 데이터로 리셋</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 20px;">
            데이터를 초기 김도욱 포트폴리오 기본 샘플 상태로 원복합니다.
          </p>
          <button id="btn-reset-default" class="btn-pill btn-pill-danger btn-pill-sm">
            🔄 초기화 실행
          </button>
        </div>
      </div>
    `;
  }

  /**
   * 이벤트 바인딩
   */
  function bindEvents() {
    // 메인으로 가기 & 로그아웃
    const btnBack = adminContainer.querySelector("#btn-back-to-main");
    if (btnBack) btnBack.addEventListener("click", () => callbacks.onBackToMain());

    const btnLogout = adminContainer.querySelector("#btn-admin-logout");
    if (btnLogout) btnLogout.addEventListener("click", () => callbacks.onLogout());

    // 탭 전환 이벤트
    const tabBtns = adminContainer.querySelectorAll(".admin-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        activeTab = e.currentTarget.getAttribute("data-tab");
        editingProjectId = null;
        updateView();
      });
    });

    // 탭 1: 자기소개 저장 폼 제출
    const bioForm = adminContainer.querySelector("#admin-bio-form");
    if (bioForm) {
      bioForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const updatedProfile = {
          ...data.profile,
          name: adminContainer.querySelector("#bio-name").value,
          headline: adminContainer.querySelector("#bio-headline").value,
          interests: parseTags(adminContainer.querySelector("#bio-tags").value),
          bio: adminContainer.querySelector("#bio-text").value
        };
        callbacks.onSaveBio(updatedProfile);
        alert("✨ 자기소개 수정사항이 로컬 스토리지에 성공적으로 저장되었습니다!");
        updateView();
      });
    }

    // 탭 2: 프로젝트 추가/수정 폼 제출
    const projForm = adminContainer.querySelector("#admin-project-form");
    if (projForm) {
      projForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = adminContainer.querySelector("#proj-title").value;
        const description = adminContainer.querySelector("#proj-desc").value;
        const tags = parseTags(adminContainer.querySelector("#proj-tags").value);
        const demoUrl = adminContainer.querySelector("#proj-demo").value;
        const githubUrl = adminContainer.querySelector("#proj-github").value;
        const imageUrl = adminContainer.querySelector("#proj-img").value || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60";

        if (editingProjectId) {
          // 수정 저장
          const updatedProject = {
            id: editingProjectId,
            title,
            description,
            tags,
            demoUrl,
            githubUrl,
            imageUrl
          };
          callbacks.onUpdateProject(updatedProject);
          alert("✏️ 프로젝트 수정사항이 저장되었습니다!");
          editingProjectId = null;
        } else {
          // 신규 등록
          const newProject = {
            id: Date.now(),
            title,
            description,
            tags,
            demoUrl,
            githubUrl,
            imageUrl
          };
          callbacks.onAddProject(newProject);
          alert("🚀 신규 AI 프로젝트가 등록되었습니다!");
        }
        updateView();
      });
    }

    // 프로젝트 수정 버튼 클릭
    const editBtns = adminContainer.querySelectorAll(".btn-edit-proj");
    editBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        editingProjectId = Number(e.currentTarget.getAttribute("data-id"));
        updateView();
        adminContainer.querySelector("#admin-project-form").scrollIntoView({ behavior: "smooth" });
      });
    });

    // 프로젝트 수정 취소
    const btnCancelEdit = adminContainer.querySelector("#btn-cancel-edit");
    if (btnCancelEdit) {
      btnCancelEdit.addEventListener("click", () => {
        editingProjectId = null;
        updateView();
      });
    }

    // 프로젝트 삭제 버튼 클릭
    const deleteBtns = adminContainer.querySelectorAll(".btn-delete-proj");
    deleteBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = Number(e.currentTarget.getAttribute("data-id"));
        if (confirm("정말 이 프로젝트를 삭제하시겠습니까?")) {
          callbacks.onDeleteProject(id);
          if (editingProjectId === id) editingProjectId = null;
          updateView();
        }
      });
    });

    // 탭 3: 데이터 백업 다운로드
    const btnExport = adminContainer.querySelector("#btn-export-json");
    if (btnExport) {
      btnExport.addEventListener("click", () => callbacks.onExportData());
    }

    // 데이터 파일 불러오기
    const btnTriggerImport = adminContainer.querySelector("#btn-trigger-import");
    const inputImport = adminContainer.querySelector("#input-import-json");
    if (btnTriggerImport && inputImport) {
      btnTriggerImport.addEventListener("click", () => inputImport.click());
      inputImport.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const json = JSON.parse(evt.target.result);
            callbacks.onImportData(json);
            alert("📥 백업 데이터가 정상적으로 복원되었습니다!");
            updateView();
          } catch (err) {
            alert("❌ 유효하지 않은 JSON 데이터 파일입니다.");
          }
        };
        reader.readAsText(file);
      });
    }

    // 기본 데이터 초기화
    const btnReset = adminContainer.querySelector("#btn-reset-default");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        if (confirm("경고: 저장된 모든 데이터가 기본 샘플로 초기화됩니다. 진행하시겠습니까?")) {
          callbacks.onResetData();
          alert("🔄 데이터가 초기 기본값으로 성공적으로 리셋되었습니다.");
          updateView();
        }
      });
    }
  }

  updateView();
  return adminContainer;
}
