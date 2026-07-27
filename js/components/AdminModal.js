/**
 * KIM DOWOOK AI Portfolio - 관리자 인증 및 프로젝트 추가 모달 (AdminModal.js)
 * 비밀번호 입력 및 신규 프로젝트 폼 모달 기능 제공
 */

import { parseTags } from "../utils/validator.js";

/**
 * 비밀번호 인증 모달 생성
 */
export function renderAdminAuthModal(onAuthenticate) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.id = "admin-modal";

  modal.innerHTML = `
    <div class="modal-content">
      <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">
        🔑 관리자 인증 (김도욱 님 전용)
      </h3>
      <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 24px;">
        자기소개 및 작업물을 직접 수정/추가할 수 있는 비밀번호를 입력해 주세요. (기본 암호: <code style="color: var(--color-primary);">1234</code>)
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

  // 닫기 및 폼 제출 이벤트
  modal.querySelector("#close-admin-modal").addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal.querySelector("#admin-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const password = modal.querySelector("#admin-password-input").value;
    onAuthenticate(password);
  });

  return modal;
}

/**
 * 신규 프로젝트 등록 모달 생성
 */
export function renderAddProjectModal(onAdd) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.id = "add-project-modal";

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 520px;">
      <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--text-main); margin-bottom: 20px;">
        ➕ 신규 AI 프로젝트 추가
      </h3>

      <form id="add-project-form" style="display: flex; flex-direction: column; gap: 14px;">
        <div>
          <label style="font-size: 0.85rem; color: var(--text-muted);">프로젝트 제목</label>
          <input type="text" id="new-title" class="form-input" placeholder="예: 🤖 AI 요약 서비스" required />
        </div>
        <div>
          <label style="font-size: 0.85rem; color: var(--text-muted);">한 줄 요약 설명</label>
          <input type="text" id="new-desc" class="form-input" placeholder="서비스에 대한 짧은 설명" required />
        </div>
        <div>
          <label style="font-size: 0.85rem; color: var(--text-muted);">기술 태그 (쉼표 분리)</label>
          <input type="text" id="new-tags" class="form-input" placeholder="#GPT-4o, #React, #Vite" required />
        </div>
        <div>
          <label style="font-size: 0.85rem; color: var(--text-muted);">라이브 데모 URL</label>
          <input type="url" id="new-demo" class="form-input" placeholder="https://..." required />
        </div>
        <div>
          <label style="font-size: 0.85rem; color: var(--text-muted);">Github URL</label>
          <input type="url" id="new-github" class="form-input" placeholder="https://github.com/..." required />
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 12px;">
          <button type="button" id="close-add-modal" class="btn-pill btn-pill-secondary btn-pill-sm">취소</button>
          <button type="submit" class="btn-pill btn-pill-primary btn-pill-sm">등록 완료</button>
        </div>
      </form>
    </div>
  `;

  modal.querySelector("#close-add-modal").addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal.querySelector("#add-project-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const newProject = {
      id: Date.now(),
      title: modal.querySelector("#new-title").value,
      description: modal.querySelector("#new-desc").value,
      tags: parseTags(modal.querySelector("#new-tags").value),
      demoUrl: modal.querySelector("#new-demo").value,
      githubUrl: modal.querySelector("#new-github").value,
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60"
    };
    onAdd(newProject);
    modal.classList.remove("active");
  });

  return modal;
}
