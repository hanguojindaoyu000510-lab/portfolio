/**
 * KIM DOWOOK AI Portfolio - 나만 편집 가능한 자기소개 섹션 컴포넌트 (BioSection.js)
 * 일반 방문자 모드와 관리자 실시간 텍스트 수정 모드 지원
 */

export function renderBioSection(profileData, isAdmin, onSaveProfile) {
  const bioSection = document.createElement("section");
  bioSection.id = "about";
  bioSection.className = "section";

  // 일반 모드와 관리자 수정 모드에 따른 HTML 생성
  const isEditingState = isAdmin;

  bioSection.innerHTML = `
    <div class="container">
      <div class="glass-card ${isEditingState ? 'admin-editing-active' : ''}" style="position: relative;">
        <!-- 섹션 헤더 -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
          <h2 class="section-title" style="margin-bottom: 0;">
            <span>👋 ABOUT ME</span>
          </h2>
          ${isAdmin ? '<span class="tag-pill tag-pill-ai">✏️ 관리자 편집 모드 활성화</span>' : ''}
        </div>

        <!-- 자기소개 본문 컨텐츠 -->
        <div id="bio-content-area">
          ${isEditingState ? `
            <!-- 관리자 실시간 편집 폼 -->
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div>
                <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px;">이름</label>
                <input type="text" id="edit-name" class="form-input" value="${profileData.name}" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px;">메인 타이틀 / 한 줄 소개</label>
                <input type="text" id="edit-headline" class="form-input" value="${profileData.headline}" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px;">자기소개 상세 내용</label>
                <textarea id="edit-bio" class="form-input">${profileData.bio}</textarea>
              </div>
              <div style="display: flex; justify-content: flex-end; margin-top: 8px;">
                <button id="save-bio-btn" class="btn-pill btn-pill-primary btn-pill-sm">
                  💾 수정사항 저장하기
                </button>
              </div>
            </div>
          ` : `
            <!-- 일반 방문자용 표시 뷰 -->
            <h3 style="font-size: 1.4rem; font-weight: 700; color: var(--color-primary); margin-bottom: 12px;">
              ${profileData.headline}
            </h3>
            <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px; word-break: keep-all;">
              ${profileData.bio}
            </p>

            <!-- 주요 관심 분야 및 기술 스택 태그 뱃지 -->
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              ${profileData.interests.map(item => `<span class="tag-pill tag-pill-ai"># ${item}</span>`).join('')}
              ${profileData.techStack.map(tech => `<span class="tag-pill tag-pill-dev">⚡ ${tech}</span>`).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  // 저장 버튼 이벤트 리스너 등록
  if (isEditingState) {
    const saveBtn = bioSection.querySelector("#save-bio-btn");
    saveBtn.addEventListener("click", () => {
      const updatedProfile = {
        ...profileData,
        name: bioSection.querySelector("#edit-name").value,
        headline: bioSection.querySelector("#edit-headline").value,
        bio: bioSection.querySelector("#edit-bio").value
      };
      onSaveProfile(updatedProfile);
    });
  }

  return bioSection;
}
