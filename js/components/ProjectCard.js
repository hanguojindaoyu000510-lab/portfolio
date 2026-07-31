/**
 * KIM DOWOOK AI Portfolio - AI 작업물 갤러리 섹션 및 카드 컴포넌트 (ProjectCard.js)
 * 시원하고 귀여운 스카이블루 & 민트 그린 고양이 AI 테마
 */

export function openDemoNoticeModal(project, url) {
  const existingModal = document.getElementById("demo-notice-modal");
  if (existingModal) existingModal.remove();

  const modal = document.createElement("div");
  modal.className = "modal-overlay active";
  modal.id = "demo-notice-modal";

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 460px; text-align: center; border: 2px solid #F59E0B; box-shadow: 0 25px 50px -12px rgba(245, 158, 11, 0.3);">
      <div style="font-size: 2.5rem; margin-bottom: 8px; animation: pulse 1.5s infinite;">🎨 ⏳</div>
      <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 12px;">
        Google AI Studio 데모 접속 안내
      </h3>
      <div style="text-align: left; background: rgba(254, 243, 199, 0.6); border: 1.5px dashed #F59E0B; padding: 16px; border-radius: 16px; margin-bottom: 20px; font-size: 0.9rem; color: #78350F; line-height: 1.6;">
        <p style="margin-bottom: 6px; font-weight: 800; font-size: 0.95rem;">🐾 캔버스 생성 대기 안내</p>
        Google AI Studio 앱 환경 특성상 <strong>그림을 그릴 캔버스 공간이 뜨기까지 약 5~10초간 로딩 시간</strong>이 소요됩니다.<br/><br/>
        화면이 잠시 비어보이더라도 오류가 아니니, <strong>접속 후 5~10초만 기다려주시면</strong> 캔버스가 활성화됩니다! 😊
      </div>
      <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 20px; font-size: 0.85rem; color: var(--text-muted);">
        <input type="checkbox" id="hide-demo-notice-check" style="cursor: pointer; width: 16px; height: 16px; accent-color: var(--color-primary);" />
        <label for="hide-demo-notice-check" style="cursor: pointer; user-select: none;">다음부터 안내 없이 바로 이동하기</label>
      </div>
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button id="cancel-demo-notice-btn" class="btn-pill btn-pill-secondary btn-pill-sm" style="flex: 1;">닫기</button>
        <button id="confirm-demo-notice-btn" class="btn-pill btn-pill-primary btn-pill-sm" style="flex: 1.4;">🚀 바로 데모 접속</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => {
    modal.classList.remove("active");
    setTimeout(() => modal.remove(), 200);
  };

  modal.querySelector("#cancel-demo-notice-btn").addEventListener("click", closeModal);

  modal.querySelector("#confirm-demo-notice-btn").addEventListener("click", () => {
    const isChecked = modal.querySelector("#hide-demo-notice-check").checked;
    if (isChecked) {
      localStorage.setItem(`hide_demo_notice_${project.id}`, "true");
    }
    closeModal();
    window.open(url, "_blank");
  });
}

export function renderProjectsSection(projects, isAdmin, onAddProject, onDeleteProject) {
  const section = document.createElement("section");
  section.id = "projects";
  section.className = "section";

  section.innerHTML = `
    <div class="container">
      <!-- 섹션 타이틀 및 관리자 신규 추가 버튼 -->
      <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 class="section-title">
            <span>🐱 AI PROJECTS</span>
          </h2>
          <p class="section-subtitle" style="margin-bottom: 0;">직접 기획하고 개발한 AI 웹사이트 및 앱 서비스 갤러리입니다.</p>
        </div>
        ${isAdmin ? `
          <button id="add-project-btn" class="btn-pill btn-pill-primary btn-pill-sm">
            ➕ 신규 프로젝트 추가
          </button>
        ` : ''}
      </div>

      <!-- 프로젝트 카드 그리드 레이아웃 -->
      <div class="projects-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 28px;">
        ${projects.map(project => renderSingleProjectCard(project, isAdmin)).join('')}
      </div>
    </div>
  `;

  // 프로젝트 삭제 버튼 이벤트 바인딩
  if (isAdmin) {
    const deleteBtns = section.querySelectorAll(".delete-project-btn");
    deleteBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id, 10);
        if (confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) {
          onDeleteProject(id);
        }
      });
    });

    const addBtn = section.querySelector("#add-project-btn");
    if (addBtn) {
      addBtn.addEventListener("click", onAddProject);
    }
  }

  const demoBtns = section.querySelectorAll(".demo-access-btn");
  demoBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(btn.dataset.id, 10);
      const proj = projects.find(p => p.id === id);
      if (proj && proj.demoNotice) {
        const hideNotice = localStorage.getItem(`hide_demo_notice_${proj.id}`) === "true";
        if (!hideNotice) {
          e.preventDefault();
          openDemoNoticeModal(proj, proj.demoUrl);
        }
      }
    });
  });

  return section;
}

/**
 * 개별 프로젝트 카드 HTML 생성 헬퍼 함수
 */
function renderSingleProjectCard(project, isAdmin) {
  const localUrl = project.localDemoUrl || ((project.id == 1 || (project.title && project.title.includes("운세")) || (project.demoUrl && project.demoUrl.includes("fortune-cookie"))) ? "http://localhost:8085/" : null);

  return `
    <div class="glass-card project-card" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      <div>
        <!-- 프로젝트 썸네일 이미지 -->
        <div style="position: relative; width: 100%; height: 190px; border-radius: 20px; overflow: hidden; margin-bottom: 20px; box-shadow: 0 6px 16px rgba(186, 230, 253, 0.2);">
          <img src="${project.imageUrl}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1.0)'" />
          ${isAdmin ? `
            <button class="delete-project-btn btn-pill btn-pill-sm" data-id="${project.id}" style="position: absolute; top: 12px; right: 12px; background: rgba(244, 63, 94, 0.9); color: white; border: none; padding: 0 14px; height: 32px; font-weight: 700;">
              🗑️ 삭제
            </button>
          ` : ''}
        </div>

        <!-- 프로젝트 타이틀 -->
        <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 10px; letter-spacing: -0.01em;">
          ${project.title}
        </h3>

        <!-- 프로젝트 요약 설명 -->
        <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: ${project.demoNotice ? '14px' : '20px'};">
          ${project.description}
        </p>

        ${project.demoNotice ? `
          <div class="demo-notice-box">
            <span style="font-size: 1.1rem; flex-shrink: 0;">⏳</span>
            <div>
              <strong style="color: #92400E;">접속 안내 (약 5~10초 대기)</strong><br/>
              Google AI Studio 접속 후 캔버스가 뜨기까지 5~10초간 로딩 시간이 소요됩니다.
            </div>
          </div>
        ` : ''}
      </div>

      <div>
        <!-- 태그 모음 -->
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 24px;">
          ${project.tags.map(tag => `<span class="tag-pill tag-pill-ai">${tag}</span>`).join('')}
        </div>

        <!-- 하단 링크 액션 버튼 -->
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <a href="${project.demoUrl}" target="_blank" data-id="${project.id}" class="demo-access-btn btn-pill btn-pill-primary btn-pill-sm" style="flex: 1; min-width: 100px; text-align: center; text-decoration: none;">
            🐾 데모 접속
          </a>
          ${localUrl ? `
            <a href="${localUrl}" target="_blank" class="btn-pill btn-pill-secondary btn-pill-sm" style="text-decoration: none;" title="로컬 테스트 환경 (http://localhost:8085/)">
              🏠 로컬 접속 (8085)
            </a>
          ` : ''}
          <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-pill btn-pill-secondary btn-pill-sm" style="text-decoration: none;">
            💻 Github
          </a>
        </div>
      </div>
    </div>
  `;
}
