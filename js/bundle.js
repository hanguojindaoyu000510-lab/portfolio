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
        imageUrl: "./assets/images/anime_robot_canvas.png"
      },
      {
        id: 3,
        title: "🎓 대학생 창업 성향 테스트하기!",
        description: "대학생들의 창업 성향과 잠재력을 다각도로 분석하여 맞춤형 창업 유형 및 가이드를 제공하는 테스트 웹 서비스",
        tags: ["#Vite", "#React", "#Startup", "#Vercel"],
        demoUrl: "https://holymoly-orpin.vercel.app/",
        githubUrl: "https://github.com/example/startup-test",
        imageUrl: "./assets/images/startup_test_thumb.png"
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
          p2.imageUrl = "./assets/images/anime_robot_canvas.png";
        }
        const p3 = data.projects.find(p => p.id === 3);
        if (p3) {
          p3.title = "🎓 대학생 창업 성향 테스트하기!";
          p3.description = "대학생들의 창업 성향과 잠재력을 다각도로 분석하여 맞춤형 창업 유형 및 가이드를 제공하는 테스트 웹 서비스";
          p3.tags = ["#Vite", "#React", "#Startup", "#Vercel"];
          p3.demoUrl = "https://holymoly-orpin.vercel.app/";
          p3.imageUrl = "./assets/images/startup_test_thumb.png";
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

  // 3-B. Supabase 데이터베이스 연동 모듈
  const SUPABASE_URL = "https://bdurtdvmuaskcryqzzez.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_M8nJwJwqRT6wWmhWDR0E7w_JYxWG0l_";
  let supabaseClient = null;

  function getSupabaseClient() {
    if (supabaseClient) return supabaseClient;
    if (typeof window !== "undefined" && window.supabase && window.supabase.createClient) {
      try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      } catch (e) {
        console.warn("Supabase 초기화 경고:", e);
      }
    }
    return supabaseClient;
  }

  async function fetchPortfolioDataFromSupabase() {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data: profileRows, error: profileErr } = await client.from("profiles").select("*").limit(1);
      const { data: projectRows, error: projectErr } = await client.from("projects").select("*").order("id", { ascending: true });
      if (profileErr || projectErr) return null;

      const result = {
        profile: { ...defaultData.profile },
        projects: defaultData.projects
      };
      if (profileRows && profileRows.length > 0) {
        const p = profileRows[0];
        result.profile = {
          name: p.name || defaultData.profile.name,
          headline: p.headline || defaultData.profile.headline,
          bio: p.bio || defaultData.profile.bio,
          interests: Array.isArray(p.interests) ? p.interests : defaultData.profile.interests,
          techStack: Array.isArray(p.tech_stack) ? p.tech_stack : defaultData.profile.techStack
        };
      }
      if (projectRows && projectRows.length > 0) {
        result.projects = projectRows.map(row => ({
          id: row.id,
          title: row.title,
          description: row.description,
          tags: Array.isArray(row.tags) ? row.tags : [],
          demoUrl: row.demo_url || "",
          githubUrl: row.github_url || "",
          imageUrl: row.image_url || ""
        }));
      }
      if (result.projects) {
        const p2 = result.projects.find(p => p.id === 2);
        if (p2) {
          p2.title = "🎨 AI 캔버스 그림 해석기";
          p2.description = "캔버스에 그린 그림과 이미지를 AI가 실시간으로 분석하고 심도 있게 해석해 주는 멀티모달 AI 서비스";
          p2.tags = ["#VisionAI", "#Gemini", "#Canvas", "#React"];
          p2.demoUrl = "https://ai.studio/apps/a6e6ef17-d596-4692-b76c-bd0169136f4a?fullscreenApplet=true";
          p2.imageUrl = "./assets/images/anime_robot_canvas.png";
        }
        const p3 = result.projects.find(p => p.id === 3);
        if (p3) {
          p3.title = "🎓 대학생 창업 성향 테스트하기!";
          p3.description = "대학생들의 창업 성향과 잠재력을 다각도로 분석하여 맞춤형 창업 유형 및 가이드를 제공하는 테스트 웹 서비스";
          p3.tags = ["#Vite", "#React", "#Startup", "#Vercel"];
          p3.demoUrl = "https://holymoly-orpin.vercel.app/";
          p3.imageUrl = "./assets/images/startup_test_thumb.png";
        }
      }
      savePortfolioData(result);
      return result;
    } catch (e) {
      return null;
    }
  }

  async function saveProfileToSupabase(profile) {
    const client = getSupabaseClient();
    if (!client) return;
    try {
      await client.from("profiles").upsert({
        id: 1,
        name: profile.name,
        headline: profile.headline,
        bio: profile.bio,
        interests: profile.interests,
        tech_stack: profile.techStack,
        updated_at: new Date().toISOString()
      }, { onConflict: "id" });
    } catch (e) {}
  }

  async function addProjectToSupabase(newProject) {
    const client = getSupabaseClient();
    if (!client) return;
    try {
      const { data } = await client.from("projects").insert([{
        title: newProject.title,
        description: newProject.description,
        tags: newProject.tags,
        demo_url: newProject.demoUrl,
        github_url: newProject.githubUrl,
        image_url: newProject.imageUrl
      }]).select();
      if (data && data.length > 0) {
        newProject.id = data[0].id;
      }
    } catch (e) {}
  }

  async function updateProjectInSupabase(updatedProject) {
    const client = getSupabaseClient();
    if (!client) return;
    try {
      await client.from("projects").update({
        title: updatedProject.title,
        description: updatedProject.description,
        tags: updatedProject.tags,
        demo_url: updatedProject.demoUrl,
        github_url: updatedProject.githubUrl,
        image_url: updatedProject.imageUrl
      }).eq("id", updatedProject.id);
    } catch (e) {}
  }

  async function deleteProjectFromSupabase(id) {
    const client = getSupabaseClient();
    if (!client) return;
    try {
      await client.from("projects").delete().eq("id", id);
    } catch (e) {}
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

    const btnText = state.currentView === 'admin' 
      ? '🌐 메인 포트폴리오' 
      : (state.isAdmin ? '🔑 관리자 대시보드' : '🔑 관리자 로그인');

    header.innerHTML = `
      <div class="container" style="display: flex; align-items: center; justify-content: space-between;">
        <a href="#" class="logo" style="display: flex; align-items: center; gap: 8px; font-size: 1.4rem; font-weight: 800; color: #FFFFFF; text-decoration: none;">
          <span style="font-size: 1.3rem; filter: brightness(0) invert(1);" class="cat-bounce paw-icon-white">🐾</span>
          <span style="background: var(--grad-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">DOWOOK.AI</span>
          <span style="font-size: 1.2rem;">🐱</span>
        </a>
        <nav style="display: flex; align-items: center; gap: 10px;">
          <a href="#about" style="color: #FFFFFF; font-weight: 800; font-size: 1.05rem; padding: 8px 18px; border-radius: var(--radius-pill); transition: all 0.2s ease; text-decoration: none;" onmouseover="this.style.color='#38BDF8'; this.style.backgroundColor='rgba(56, 189, 248, 0.2)'" onmouseout="this.style.color='#FFFFFF'; this.style.backgroundColor='transparent'">소개</a>
          <a href="#projects" style="color: #FFFFFF; font-weight: 800; font-size: 1.05rem; padding: 8px 18px; border-radius: var(--radius-pill); transition: all 0.2s ease; text-decoration: none;" onmouseover="this.style.color='#38BDF8'; this.style.backgroundColor='rgba(56, 189, 248, 0.2)'" onmouseout="this.style.color='#FFFFFF'; this.style.backgroundColor='transparent'">작업물</a>
          <a href="#contact" style="color: #FFFFFF; font-weight: 800; font-size: 1.05rem; padding: 8px 18px; border-radius: var(--radius-pill); transition: all 0.2s ease; text-decoration: none;" onmouseover="this.style.color='#38BDF8'; this.style.backgroundColor='rgba(56, 189, 248, 0.2)'" onmouseout="this.style.color='#FFFFFF'; this.style.backgroundColor='transparent'">연락처</a>
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
    hero.style.cssText = "padding: 80px 0 60px 0;";
    hero.innerHTML = `
      <div class="container" style="max-width: 1000px;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 40px; flex-wrap: wrap-reverse;">
          <div style="flex: 1; min-width: 320px; text-align: left;">
            <div style="margin-bottom: 20px;">
              <span class="tag-pill tag-pill-ai pulse-glow" style="padding: 8px 20px; font-size: 0.9rem; height: auto; border-radius: var(--radius-pill); font-weight: 700;">
                🐱‍💻 MINT & SKY AI CAT DEVELOPER 🐾
              </span>
            </div>
            <h1 style="font-size: var(--fs-hero); font-weight: 800; color: var(--text-main); line-height: 1.3; margin-bottom: 20px; word-break: keep-all;">
              AI 기술로 시원하고 스마트한<br/>경험을 만드는 <span style="background: var(--grad-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">김도욱</span>입니다 🐾
            </h1>
            <p style="font-size: var(--fs-body-lg); color: var(--text-muted); max-width: 580px; margin: 0 0 36px 0; line-height: 1.7;">
              유용하고 감각적인 AI 서비스를 개발하고 사용자와 함께 소통해 나갑니다.
            </p>
            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
              <a href="#projects" class="btn-pill btn-pill-primary">🐾 작업물 구경하기</a>
              <a href="#contact" class="btn-pill btn-pill-secondary">✉️ 이메일 보내기</a>
            </div>
          </div>
          <div style="flex: 0 0 280px; text-align: center; margin: 0 auto;">
            <div class="glass-card pulse-glow" style="padding: 16px; border-radius: 36px; background: #FFFFFF; border: 2px solid rgba(56, 189, 248, 0.4); box-shadow: 0 20px 40px rgba(56, 189, 248, 0.25);">
              <img 
                src="./assets/cat_developer.png" 
                alt="AI Cat Developer Avatar" 
                style="width: 100%; height: 260px; object-fit: cover; border-radius: 28px;"
                class="cat-bounce"
              />
              <div style="margin-top: 12px; font-weight: 800; font-size: 0.95rem; color: var(--color-primary);">
                🐾 DOWOOK CAT AI 🐱
              </div>
            </div>
          </div>
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
              <span class="tag-pill tag-pill-ai" style="margin-bottom: 12px; display: inline-block;">👋 ABOUT ME 🐾</span>
              <h2 style="font-size: var(--fs-h1); font-weight: 800; color: var(--text-main);">
                안녕하세요, <span style="color: var(--color-primary);">${profile.name}</span>입니다! 🐾
              </h2>
            </div>
            ${state.isAdmin ? `
              <button id="go-admin-from-bio" class="btn-pill btn-pill-primary btn-pill-sm">
                ✏️ 자기소개 편집 (Admin Console)
              </button>
            ` : ''}
          </div>

          <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.8; margin-bottom: 32px;">
            ${profile.bio}
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
            <div style="background: rgba(255, 255, 255, 0.9); padding: 24px; border-radius: 20px; border: 1.5px solid var(--border-glass); box-shadow: 0 4px 14px rgba(186, 230, 253, 0.1);">
              <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 12px;">🎯 핵심 관심 분야</h4>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${interests.map(i => `<span class="tag-pill tag-pill-ai">🐾 ${i}</span>`).join('')}
              </div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.9); padding: 24px; border-radius: 20px; border: 1.5px solid var(--border-glass); box-shadow: 0 4px 14px rgba(186, 230, 253, 0.1);">
              <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 12px;">🛠️ 보유 기술 스택</h4>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${techStack.map(t => `<span class="tag-pill tag-pill-dev">⚡ ${t}</span>`).join('')}
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
            <h2 style="font-size: var(--fs-h1); font-weight: 800; color: var(--text-main);">
              직접 개발한 <span style="color: var(--color-primary);">AI 웹 & 앱</span> 작업물 🐱
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
                <div style="height: 190px; border-radius: 20px; overflow: hidden; margin-bottom: 20px; border: 1.5px solid var(--border-glass); box-shadow: 0 6px 16px rgba(186, 230, 253, 0.15);">
                  <img src="${p.imageUrl}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">
                  ${p.tags.map(t => `<span class="tag-pill tag-pill-ai">${t}</span>`).join('')}
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 10px;">${p.title}</h3>
                <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 24px;">${p.description}</p>
              </div>
              <div style="display: flex; gap: 10px;">
                <a href="${p.demoUrl}" target="_blank" class="btn-pill btn-pill-primary btn-pill-sm" style="flex: 1; text-align: center; text-decoration: none;">🐾 데모 접속</a>
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

  const EMAILJS_SERVICE_ID = "service_5imxylv";
  const EMAILJS_TEMPLATE_ID = "template_8gaj1uo";
  const EMAILJS_PUBLIC_KEY = "lyYq0Z8STxd99nxT0";
  const RECEIVER_EMAIL = "hanguojindaoyu000510@gmail.com";
  const COOLDOWN_MS = 30000;

  function generateCatQuiz() {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 1;
    return { n1, n2, ans: n1 + n2 };
  }

  function renderContactSection() {
    const contact = document.createElement("section");
    contact.id = "contact";
    contact.className = "section";

    let currentQuiz = generateCatQuiz();

    contact.innerHTML = `
      <div class="container" style="max-width: 800px;">
        <div class="glass-card pulse-glow" style="padding: 48px 32px; position: relative;">
          <!-- 섹션 헤더 -->
          <div style="text-align: center; margin-bottom: 36px;">
            <span class="tag-pill tag-pill-ai" style="margin-bottom: 12px; display: inline-flex;">✉️ CONTACT ME 🐾</span>
            <h2 style="font-size: 2.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 12px;">
              이메일로 문의 남기기
            </h2>
            <p style="font-size: 1.05rem; color: var(--text-muted); max-width: 560px; margin: 0 auto;">
              프로젝트 제작 문의, 기술 협업 제안, 기타 메시지를 남겨주시면 확인 후 입력하신 이메일로 답변을 보내드립니다.
            </p>
          </div>

          <!-- EmailJS 연동 연락폼 -->
          <form id="contact-form" style="display: flex; flex-direction: column; gap: 4px;">
            <!-- 1. 스팸 봇 차단용 허니팟 숨김 필드 -->
            <input 
              type="text" 
              id="contact-honeypot" 
              name="website_url" 
              style="display:none !important;" 
              tabindex="-1" 
              autocomplete="off" 
            />

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
              <!-- 이름 / 닉네임 입력 -->
              <div class="form-group">
                <label for="contact-name" class="form-label">
                  👤 성함 / 닉네임 <span style="color: var(--color-primary);">*</span>
                </label>
                <input 
                  type="text" 
                  id="contact-name" 
                  name="name" 
                  class="form-input" 
                  placeholder="예: 홍길동" 
                  required 
                />
              </div>

              <!-- 이메일 주소 입력 -->
              <div class="form-group">
                <label for="contact-email" class="form-label">
                  ✉️ 이메일 주소 <span style="color: var(--color-primary);">*</span>
                </label>
                <input 
                  type="email" 
                  id="contact-email" 
                  name="email" 
                  class="form-input" 
                  placeholder="example@domain.com" 
                  required 
                />
              </div>
            </div>

            <!-- 메시지 내용 입력 -->
            <div class="form-group">
              <label for="contact-message" class="form-label">
                💬 메시지 내용 <span style="color: var(--color-primary);">*</span>
              </label>
              <textarea 
                id="contact-message" 
                name="message" 
                class="form-input" 
                placeholder="문의하실 내용이나 전달하고 싶은 메시지를 자유롭게 입력해 주세요." 
                required
              ></textarea>
            </div>

            <!-- 🐾 2. 고양이 보안 퀴즈 (스팸 방지 CAPTCHA) -->
            <div class="form-group" style="background: rgba(56, 189, 248, 0.08); padding: 18px 20px; border-radius: var(--radius-input); border: 1.5px dashed var(--border-glass-bright); margin-bottom: 24px;">
              <label for="contact-quiz" class="form-label" style="margin-bottom: 8px;">
                🐾 고양이 스팸 방지 퀴즈: 
                <span id="quiz-question-text" style="color: var(--color-primary); font-weight: 800; font-size: 1.05rem;">
                  ${currentQuiz.n1} + ${currentQuiz.n2} = ?
                </span> 
                <span style="color: var(--color-primary);">*</span>
              </label>
              <input 
                type="number" 
                id="contact-quiz" 
                class="form-input" 
                placeholder="숫자 정답 입력 (예: ${currentQuiz.ans})" 
                required 
              />
            </div>

            <!-- 전송 버튼 -->
            <div style="text-align: center; margin-top: 4px;">
              <button type="submit" id="contact-submit-btn" class="btn-pill btn-pill-primary" style="width: 100%; max-width: 320px; font-size: 1.05rem;">
                🚀 이메일 보내기
              </button>
            </div>

            <!-- 피드백 알림 영역 -->
            <div id="contact-feedback" class="contact-feedback"></div>
          </form>

          <div style="border-top: 1.5px solid var(--border-glass); margin: 40px 0 28px;"></div>

          <!-- 소셜 & 보조 연락처 캡슐 버튼 모음 -->
          <div style="text-align: center;">
            <p style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 16px; font-weight: 600;">
              소셜 메신저 및 기타 채널로 연락하기
            </p>
            <div style="display: flex; justify-content: center; align-items: center; gap: 14px; flex-wrap: wrap;">
              <!-- 1:1 오픈채팅 -->
              <a href="https://open.kakao.com" target="_blank" rel="noopener noreferrer" class="btn-pill btn-pill-secondary btn-pill-sm">
                🟡 1:1 오픈채팅
              </a>

              <!-- 이메일 주소 복사 버튼 -->
              <button id="btn-copy-email" type="button" class="btn-pill btn-pill-secondary btn-pill-sm">
                📋 이메일 주소 복사
              </button>

              <!-- Github 바로가기 -->
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="btn-pill btn-pill-secondary btn-pill-sm">
                💻 Github 프로필
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    const form = contact.querySelector("#contact-form");
    const submitBtn = contact.querySelector("#contact-submit-btn");
    const feedbackEl = contact.querySelector("#contact-feedback");
    const copyBtn = contact.querySelector("#btn-copy-email");

    copyBtn.addEventListener("click", () => {
      copyToClipboard(RECEIVER_EMAIL, `이메일 주소(${RECEIVER_EMAIL})가 클립보드에 복사되었습니다!`);
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // 1. 허니팟 스팸 봇 차단 검증
      const honeypotVal = form.querySelector("#contact-honeypot").value;
      if (honeypotVal) {
        feedbackEl.className = "contact-feedback error";
        feedbackEl.textContent = "⚠️ 비정상적인 접근(스팸 봇)이 탐지되었습니다.";
        return;
      }

      // 2. 30초 재전송 쿨타임 검증
      const lastSentTime = sessionStorage.getItem("dowook_last_email_sent_time");
      if (lastSentTime) {
        const elapsed = Date.now() - parseInt(lastSentTime, 10);
        if (elapsed < COOLDOWN_MS) {
          const remainSec = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
          feedbackEl.className = "contact-feedback error";
          feedbackEl.textContent = `⚠️ 잦은 전송 방지를 위해 ${remainSec}초 후 다시 시도해 주세요.`;
          return;
        }
      }

      const name = form.querySelector("#contact-name").value.trim();
      const email = form.querySelector("#contact-email").value.trim();
      const message = form.querySelector("#contact-message").value.trim();
      const userQuizVal = parseInt(form.querySelector("#contact-quiz").value.trim(), 10);

      if (!name || !email || !message || isNaN(userQuizVal)) {
        feedbackEl.className = "contact-feedback error";
        feedbackEl.textContent = "⚠️ 모든 필수 입력란 및 보안 퀴즈 정답을 작성해 주세요.";
        return;
      }

      // 3. 🐾 고양이 보안 퀴즈 정답 검증
      if (userQuizVal !== currentQuiz.ans) {
        feedbackEl.className = "contact-feedback error";
        feedbackEl.textContent = `⚠️ 고양이 보안 퀴즈 정답이 올바르지 않습니다. (${currentQuiz.n1} + ${currentQuiz.n2} 정답 입력)`;
        return;
      }

      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";
      submitBtn.innerHTML = `⏳ 이메일 전송 중...`;
      feedbackEl.className = "contact-feedback";
      feedbackEl.textContent = "";

      try {
        if (typeof window.emailjs !== "undefined") {
          await window.emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              name: name,
              email: email,
              message: message,
              to_email: RECEIVER_EMAIL
            },
            EMAILJS_PUBLIC_KEY
          );
        } else {
          throw new Error("EmailJS SDK가 로드되지 않았습니다.");
        }

        sessionStorage.setItem("dowook_last_email_sent_time", Date.now().toString());

        feedbackEl.className = "contact-feedback success";
        feedbackEl.textContent = `🎉 성공적으로 이메일이 전송되었습니다! (${RECEIVER_EMAIL} 수신)`;
        form.reset();

        currentQuiz = generateCatQuiz();
        const quizTextEl = form.querySelector("#quiz-question-text");
        const quizInputEl = form.querySelector("#contact-quiz");
        if (quizTextEl) quizTextEl.textContent = `${currentQuiz.n1} + ${currentQuiz.n2} = ?`;
        if (quizInputEl) quizInputEl.placeholder = `숫자 정답 입력 (예: ${currentQuiz.ans})`;

      } catch (error) {
        console.error("EmailJS Send Error:", error);
        feedbackEl.className = "contact-feedback error";
        feedbackEl.textContent = `❌ 메일 전송 중 오류가 발생했습니다. (${error.text || error.message || "다시 시도해 주세요."})`;
      } finally {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        submitBtn.innerHTML = originalBtnText;
      }
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
      bioForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        state.data.profile.name = container.querySelector("#bio-name").value;
        state.data.profile.headline = container.querySelector("#bio-headline").value;
        state.data.profile.interests = parseTags(container.querySelector("#bio-tags").value);
        state.data.profile.bio = container.querySelector("#bio-text").value;
        savePortfolioData(state.data);
        await saveProfileToSupabase(state.data.profile);
        alert("✨ 자기소개 수정사항이 로컬 및 Supabase DB에 반영되었습니다!");
        renderApp();
      });
    }

    const projForm = container.querySelector("#admin-project-form");
    if (projForm) {
      projForm.addEventListener("submit", async (e) => {
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
            const updatedP = { id: editingProjId, title, description, tags, demoUrl, githubUrl, imageUrl };
            state.data.projects[idx] = updatedP;
            savePortfolioData(state.data);
            await updateProjectInSupabase(updatedP);
            alert("✏️ 프로젝트 수정사항이 저장되었습니다!");
          }
          editingProjId = null;
        } else {
          const newP = { id: Date.now(), title, description, tags, demoUrl, githubUrl, imageUrl };
          await addProjectToSupabase(newP);
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
          deleteProjectFromSupabase(id);
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

  function renderSchoolMapSection() {
    const mapSection = document.createElement("section");
    mapSection.id = "school-map";
    mapSection.className = "section";

    mapSection.innerHTML = `
      <div class="container" style="max-width: 900px;">
        <div class="glass-card pulse-glow" style="padding: 40px 32px; position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
            <div>
              <span class="tag-pill tag-pill-ai" style="margin-bottom: 10px; display: inline-flex;">🏫 LOCATION 🐾</span>
              <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">
                우리 학교 위치 안내
              </h2>
              <p id="school-address-text-bundle" style="font-size: 0.95rem; color: var(--text-muted);">
                📍 경기도 고양시 덕양구 항공대학로 76 (한국항공대학교)
              </p>
            </div>
            <div style="display: flex; gap: 10px;">
              <button id="copy-school-addr-bundle" class="btn-pill btn-pill-secondary btn-pill-sm">📋 주소 복사</button>
              <a id="kakao-map-direct-bundle" href="https://map.kakao.com/?q=한국항공대학교" target="_blank" rel="noopener noreferrer" class="btn-pill btn-pill-primary btn-pill-sm">📍 길찾기 바로가기</a>
            </div>
          </div>
          <div style="position: relative; width: 100%; height: 380px; border-radius: 24px; overflow: hidden; border: 2.5px solid var(--border-glass); box-shadow: 0 10px 30px rgba(186, 230, 253, 0.25);">
            <div id="kakao-school-map-bundle" style="width: 100%; height: 100%; background: #E0F2FE; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-weight: 700;">
              ⏳ 지도를 불러오는 중입니다... 🐾
            </div>
          </div>
        </div>
      </div>
    `;

    const copyBtn = mapSection.querySelector("#copy-school-addr-bundle");
    copyBtn.addEventListener("click", () => {
      const addrText = mapSection.querySelector("#school-address-text-bundle").textContent.replace("📍 ", "");
      copyToClipboard(addrText, `학교 주소가 클립보드에 복사되었습니다!`);
    });

    initKakaoMapBundleAsync(mapSection);
    return mapSection;
  }

  async function initKakaoMapBundleAsync(containerEl) {
    try {
      let config = {
        schoolName: "한국항공대학교 (Korea Aerospace University)",
        schoolAddress: "경기도 고양시 덕양구 항공대학로 76",
        lat: 37.600779,
        lng: 126.864742,
        mapApiKey: "lyYq0Z8STxd99nxT0"
      };

      try {
        const res = await fetch("/api/map-config");
        if (res.ok) {
          const data = await res.json();
          if (data && data.status === "success") config = data;
        }
      } catch (e) {}

      const addrEl = containerEl.querySelector("#school-address-text-bundle");
      const linkEl = containerEl.querySelector("#kakao-map-direct-bundle");
      if (addrEl) addrEl.textContent = `📍 ${config.schoolAddress}`;
      if (linkEl) linkEl.href = `https://map.kakao.com/?q=${encodeURIComponent(config.schoolName)}`;

      if (typeof window.kakao === "undefined" || !window.kakao.maps) {
        await new Promise((resolve, reject) => {
          if (document.getElementById("kakao-map-sdk-script")) return resolve();
          const script = document.createElement("script");
          script.id = "kakao-map-sdk-script";
          script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${config.mapApiKey}&autoload=false`;
          script.onload = () => resolve();
          script.onerror = (e) => reject(e);
          document.head.appendChild(script);
        });
      }

      const mapContainer = containerEl.querySelector("#kakao-school-map-bundle");
      if (!mapContainer || typeof window.kakao === "undefined" || !window.kakao.maps) {
        renderMapFallbackBundleUI(mapContainer, config);
        return;
      }

      window.kakao.maps.load(() => {
        mapContainer.innerHTML = "";
        const loc = new window.kakao.maps.LatLng(config.lat, config.lng);
        const map = new window.kakao.maps.Map(mapContainer, { center: loc, level: 3 });
        map.addControl(new window.kakao.maps.ZoomControl(), window.kakao.maps.ControlPosition.RIGHT);
        const marker = new window.kakao.maps.Marker({ position: loc, map: map });
        const infowindow = new window.kakao.maps.InfoWindow({
          position: loc,
          content: `<div style="padding:10px 14px; background:#FFFFFF; border-radius:14px; border:2px solid #38BDF8; font-size:12px; font-weight:800; color:#0F172A; text-align:center;">🐾 ${config.schoolName} 🐱</div>`
        });
        infowindow.open(map, marker);
      });
    } catch (err) {
      renderMapFallbackBundleUI(containerEl.querySelector("#kakao-school-map-bundle"), { schoolName: "학교 위치 안내", schoolAddress: "서울특별시 광진구 능동로 209" });
    }
  }

  function renderMapFallbackBundleUI(container, config) {
    if (!container) return;
    container.innerHTML = `
      <div style="text-align: center; padding: 24px; background: rgba(255, 255, 255, 0.95); border-radius: 20px; border: 2px solid var(--color-primary);">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">🏫 🐾</div>
        <h4 style="font-size: 1.2rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">${config.schoolName}</h4>
        <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 16px;">${config.schoolAddress}</p>
        <a href="https://map.kakao.com/?q=${encodeURIComponent(config.schoolName)}" target="_blank" rel="noopener noreferrer" class="btn-pill btn-pill-primary btn-pill-sm">📍 카카오맵에서 위치 보기</a>
      </div>
    `;
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
    mainEl.appendChild(renderSchoolMapSection());
    mainEl.appendChild(renderContactSection());
    appRoot.appendChild(mainEl);

    const footer = document.createElement("footer");
    footer.style.cssText = "text-align: center; padding: 40px 0; color: var(--text-dim); font-size: 0.85rem; border-top: 1px solid var(--border-glass); margin-top: 60px;";
    footer.innerHTML = `<div class="container"><p>© 2026 KIM DOWOOK. AI Portfolio All Rights Reserved.</p></div>`;
    appRoot.appendChild(footer);
  }

  document.addEventListener("DOMContentLoaded", async () => {
    renderApp();
    const remoteData = await fetchPortfolioDataFromSupabase();
    if (remoteData) {
      state.data = remoteData;
      renderApp();
    }
  });
})();
