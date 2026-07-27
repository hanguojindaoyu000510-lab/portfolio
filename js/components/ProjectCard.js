/**
 * KIM DOWOOK AI Portfolio - AI 작업물 갤러리 섹션 및 카드 컴포넌트 (ProjectCard.js)
 * 프로젝트 그리드 카드 렌더링 및 관리자 모드 전용 CRUD(추가/삭제) 기능 포함
 */

export function renderProjectsSection(projects, isAdmin, onAddProject, onDeleteProject) {
  const section = document.createElement("section");
  section.id = "projects";
  section.className = "section";

  section.innerHTML = `
    <div class="container">
      <!-- 섹션 타이틀 및 관리자 신규 추가 버튼 -->
      <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 class="section-title">🚀 AI PROJECTS</h2>
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

  return section;
}

/**
 * 개별 프로젝트 카드 HTML 생성 헬퍼 함수
 */
function renderSingleProjectCard(project, isAdmin) {
  return `
    <div class="glass-card project-card" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      <div>
        <!-- 프로젝트 썸네일 이미지 -->
        <div style="position: relative; width: 100%; height: 180px; border-radius: 16px; overflow: hidden; margin-bottom: 20px;">
          <img src="${project.imageUrl}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1.0)'" />
          ${isAdmin ? `
            <button class="delete-project-btn btn-pill btn-pill-sm" data-id="${project.id}" style="position: absolute; top: 12px; right: 12px; background: rgba(239, 68, 68, 0.85); color: white; border: none; padding: 0 12px; height: 30px;">
              🗑️ 삭제
            </button>
          ` : ''}
        </div>

        <!-- 프로젝트 타이틀 -->
        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 10px;">
          ${project.title}
        </h3>

        <!-- 프로젝트 요약 설명 -->
        <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
          ${project.description}
        </p>
      </div>

      <div>
        <!-- 태그 모음 -->
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 24px;">
          ${project.tags.map(tag => `<span class="tag-pill tag-pill-ai">${tag}</span>`).join('')}
        </div>

        <!-- 하단 링크 액션 버튼 (라이브 데모 바로가기 & Github) -->
        <div style="display: flex; gap: 10px;">
          <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn-pill btn-pill-primary btn-pill-sm" style="flex: 1;">
            🚀 데모 접속
          </a>
          <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-pill btn-pill-secondary btn-pill-sm">
            💻 Github
          </a>
        </div>
      </div>
    </div>
  `;
}
