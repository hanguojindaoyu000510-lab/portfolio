/**
 * KIM DOWOOK AI Portfolio - 메인 애플리케이션 진입점 (app.js)
 * 메인 뷰와 전용 관리자 대시보드 뷰(AdminPage) 간의 상태 및 렌더링 관리
 * Supabase 클라우드 데이터베이스 동기화 지원
 */

import {
  getPortfolioData,
  savePortfolioData,
  fetchPortfolioDataFromSupabase,
  saveProfileToSupabase,
  addProjectToSupabase,
  updateProjectInSupabase,
  deleteProjectFromSupabase
} from "./data/initialData.js";
import { renderHeader } from "./components/Header.js";
import { renderHero } from "./components/Hero.js";
import { renderBioSection } from "./components/BioSection.js";
import { renderProjectsSection } from "./components/ProjectCard.js";
import { renderAdminAuthModal, renderAddProjectModal } from "./components/AdminModal.js";
import { renderContactSection } from "./components/Contact.js";
import { renderSchoolMapSection } from "./components/SchoolMap.js";
import { renderAdminPage } from "./components/AdminPage.js";

// 애플리케이션 상태 (State)
let state = {
  data: getPortfolioData(),
  isAdmin: false,
  currentView: "main" // 'main' | 'admin'
};

// 메인 루트 요소
const appRoot = document.getElementById("app");

/**
 * 전체 화면 메인 렌더링 함수
 */
function renderApp() {
  appRoot.innerHTML = "";

  // 1. 관리자 전용 대시보드 뷰 렌더링
  if (state.currentView === "admin" && state.isAdmin) {
    const adminPageEl = renderAdminPage(state.data, {
      onSaveBio: handleSaveProfile,
      onAddProject: handleAddProject,
      onUpdateProject: handleUpdateProject,
      onDeleteProject: handleDeleteProject,
      onExportData: handleExportData,
      onImportData: handleImportData,
      onResetData: handleResetData,
      onBackToMain: () => {
        state.currentView = "main";
        renderApp();
      },
      onLogout: () => {
        state.isAdmin = false;
        state.currentView = "main";
        alert("🔒 관리자 로그아웃 되었습니다.");
        renderApp();
      }
    });
    appRoot.appendChild(adminPageEl);
    return;
  }

  // 2. 메인 포트폴리오 뷰 렌더링
  // 2-A. 상단 헤더 컴포넌트
  const headerEl = renderHeader(
    state.isAdmin,
    state.currentView,
    (action) => {
      if (action === "main") {
        state.currentView = "main";
        renderApp();
      } else if (action === "login") {
        openAdminLoginModal();
      }
    },
    () => {
      state.currentView = "admin";
      renderApp();
    }
  );
  appRoot.appendChild(headerEl);

  // 2-B. 메인 컨텐츠 영역
  const mainEl = document.createElement("main");

  // 히어로 섹션
  const heroEl = renderHero(state.data.profile);
  mainEl.appendChild(heroEl);

  // 자기소개 섹션
  const bioEl = renderBioSection(state.data.profile, state.isAdmin, handleSaveProfile);
  mainEl.appendChild(bioEl);

  // 작업물 갤러리 섹션
  const projectsEl = renderProjectsSection(
    state.data.projects,
    state.isAdmin,
    handleOpenAddProjectModal,
    handleDeleteProject
  );
  mainEl.appendChild(projectsEl);

  // 학교 위치 지도 섹션
  const schoolMapEl = renderSchoolMapSection();
  mainEl.appendChild(schoolMapEl);

  // 연락처 섹션
  const contactEl = renderContactSection();
  mainEl.appendChild(contactEl);

  appRoot.appendChild(mainEl);

  // 2-C. 하단 푸터
  const footerEl = document.createElement("footer");
  footerEl.style.cssText = "text-align: center; padding: 40px 0; color: var(--text-dim); font-size: 0.85rem; border-top: 1px solid var(--border-glass); margin-top: 60px;";
  footerEl.innerHTML = `
    <div class="container">
      <p>© 2026 KIM DOWOOK. AI Portfolio All Rights Reserved.</p>
    </div>
  `;
  appRoot.appendChild(footerEl);
}

/**
 * 관리자 로그인 모달 열기
 */
function openAdminLoginModal() {
  let modal = document.getElementById("admin-modal");
  if (!modal) {
    modal = renderAdminAuthModal((password) => {
      if (password === "1234") { // 기본 관리자 암호
        state.isAdmin = true;
        state.currentView = "admin";
        modal.classList.remove("active");
        alert("🔓 관리자 인증 성공! 전용 대시보드(Admin Console)로 이동합니다.");
        renderApp();
      } else {
        alert("❌ 비밀번호가 올바르지 않습니다. (기본 암호: 1234)");
      }
    });
    document.body.appendChild(modal);
  }
  setTimeout(() => modal.classList.add("active"), 10);
}

/**
 * 자기소개 프로필 정보 저장 핸들러
 */
async function handleSaveProfile(updatedProfile) {
  state.data.profile = updatedProfile;
  savePortfolioData(state.data);
  await saveProfileToSupabase(updatedProfile);
  renderApp();
}

/**
 * 신규 프로젝트 추가 핸들러
 */
async function handleAddProject(newProject) {
  await addProjectToSupabase(newProject);
  state.data.projects.unshift(newProject);
  savePortfolioData(state.data);
  renderApp();
}

/**
 * 기존 프로젝트 수정 핸들러
 */
async function handleUpdateProject(updatedProject) {
  const index = state.data.projects.findIndex(p => p.id === updatedProject.id);
  if (index !== -1) {
    state.data.projects[index] = updatedProject;
    savePortfolioData(state.data);
  }
  await updateProjectInSupabase(updatedProject);
  renderApp();
}

/**
 * 프로젝트 삭제 핸들러
 */
async function handleDeleteProject(id) {
  state.data.projects = state.data.projects.filter(p => p.id !== id);
  savePortfolioData(state.data);
  await deleteProjectFromSupabase(id);
  renderApp();
}

/**
 * 신규 프로젝트 추가 모달 열기 (메인 화면용)
 */
function handleOpenAddProjectModal() {
  let modal = document.getElementById("add-project-modal");
  if (!modal) {
    modal = renderAddProjectModal(async (newProject) => {
      await handleAddProject(newProject);
      alert("🚀 신규 프로젝트가 성공적으로 등록되었습니다!");
      renderApp();
    });
    document.body.appendChild(modal);
  }
  setTimeout(() => modal.classList.add("active"), 10);
}

/**
 * JSON 데이터 파일 백업 다운로드
 */
function handleExportData() {
  const jsonStr = JSON.stringify(state.data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dowook_portfolio_backup_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * 백업 JSON 데이터 파일 가져오기
 */
function handleImportData(importedData) {
  if (importedData && importedData.profile && importedData.projects) {
    state.data = importedData;
    savePortfolioData(state.data);
    renderApp();
  } else {
    alert("❌ 유효하지 않은 데이터 구조입니다.");
  }
}

/**
 * 기본 샘플 데이터로 리셋
 */
function handleResetData() {
  localStorage.removeItem("dowook_ai_portfolio_data");
  state.data = getPortfolioData();
  renderApp();
}

// 최초 애플리케이션 실행 및 Supabase 데이터 비동기 동기화
document.addEventListener("DOMContentLoaded", async () => {
  renderApp();
  const remoteData = await fetchPortfolioDataFromSupabase();
  if (remoteData) {
    state.data = remoteData;
    renderApp();
  }
});
