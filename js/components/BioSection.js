/**
 * KIM DOWOOK AI Portfolio - 나만 편집 가능한 자기소개 섹션 컴포넌트 (BioSection.js)
 * 시원하고 귀여운 스카이블루 & 민트 그린 고양이 AI 테마
 */

export function renderBioSection(profileData, isAdmin, onSaveProfile) {
  const bioSection = document.createElement("section");
  bioSection.id = "about";
  bioSection.className = "section";

  const isEditingState = isAdmin;

  bioSection.innerHTML = `
    <div class="container">
      <div class="glass-card ${isEditingState ? 'admin-editing-active' : ''}" style="position: relative; padding: 40px;">
        <!-- 섹션 헤더 -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
          <h2 class="section-title" style="margin-bottom: 0;">
            <span style="font-size: 1.8rem;">👋 ABOUT ME 🐾</span>
          </h2>
          ${isAdmin ? '<span class="tag-pill tag-pill-ai">✏️ 관리자 편집 모드</span>' : ''}
        </div>

        <!-- 자기소개 본문 컨텐츠 -->
        <div id="bio-content-area">
          ${isEditingState ? `
            <!-- 관리자 실시간 편집 폼 -->
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div>
                <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">이름</label>
                <input type="text" id="edit-name" class="form-input" value="${profileData.name}" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">메인 타이틀 / 한 줄 소개</label>
                <input type="text" id="edit-headline" class="form-input" value="${profileData.headline}" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">자기소개 상세 내용</label>
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
            <h3 style="font-size: 1.4rem; font-weight: 800; color: var(--color-primary); margin-bottom: 14px; letter-spacing: -0.01em;">
              ${profileData.headline}
            </h3>
            <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.8; margin-bottom: 28px; word-break: keep-all;">
              ${profileData.bio}
            </p>

            <!-- 주요 관심 분야 및 기술 스택 태그 뱃지 -->
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              ${profileData.interests.map(item => `<span class="tag-pill tag-pill-ai">🐾 ${item}</span>`).join('')}
              ${profileData.techStack.map(tech => `<span class="tag-pill tag-pill-dev">⚡ ${tech}</span>`).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;

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
