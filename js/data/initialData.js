/**
 * KIM DOWOOK AI Portfolio - 데이터 및 상태 관리 모듈 (initialData.js)
 * Supabase 클라우드 데이터베이스 및 LocalStorage 백업 연동
 */

export const SUPABASE_URL = "https://bdurtdvmuaskcryqzzez.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_M8nJwJwqRT6wWmhWDR0E7w_JYxWG0l_";

// 초기 기본 더미 데이터 (김도욱 님의 포트폴리오 기본값 및 폴백용)
export const defaultData = {
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
      demoUrl: "https://portfolio-1-zeta-lime.vercel.app/fortune-cookie/index.html",
      githubUrl: "https://github.com/example/fortune",
      imageUrl: "./assets/images/fortune_cookie_burst.png"
    },
    {
      id: 2,
      title: "🎨 AI 캔버스 그림 해석기",
      description: "캔버스에 그린 그림과 이미지를 AI가 실시간으로 분석하고 심도 있게 해석해 주는 멀티모달 AI 서비스",
      tags: ["#VisionAI", "#Gemini", "#Canvas", "#React"],
      demoUrl: "https://ai.studio/apps/a6e6ef17-d596-4692-b76c-bd0169136f4a?fullscreenApplet=true",
      githubUrl: "https://github.com/example/canvas-ai",
      imageUrl: "./assets/images/anime_robot_canvas.png",
      demoNotice: "💡 접속 안내: Google AI Studio 환경 특성상 그림 캔버스가 뜨기까지 약 5~10초 정도 로딩 시간이 소요될 수 있습니다."
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

// LocalStorage 키 명칭
const STORAGE_KEY = "dowook_ai_portfolio_data";

let supabaseClient = null;

/**
 * Supabase 클라이언트 인스턴스 반환
 */
export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  if (typeof window !== "undefined" && window.supabase && window.supabase.createClient) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
      console.warn("Supabase 클라이언트 초기화 실패:", e);
    }
  }
  return supabaseClient;
}

/**
 * LocalStorage에서 데이터 동기적으로 불러오기 (초기 렌더링용)
 */
export function getPortfolioData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    savePortfolioData(defaultData);
    return defaultData;
  }
  try {
    const data = JSON.parse(stored);
    if (data && data.projects) {
      data.projects = data.projects.filter(p => !p.title.includes("테스트 AI") && !p.description.includes("Playwright E2E"));
      const p1 = data.projects.find(p => p.id == 1 || (p.title && p.title.includes("운세")));
      if (p1) {
        p1.title = "🤖 AI 운세 쿠키 생성기";
        p1.demoUrl = "https://portfolio-1-zeta-lime.vercel.app/fortune-cookie/index.html";
        p1.imageUrl = "./assets/images/fortune_cookie_burst.png";
      }
      const p2 = data.projects.find(p => p.id == 2 || (p.title && p.title.includes("캔버스")));
      if (p2) {
        p2.title = "🎨 AI 캔버스 그림 해석기";
        p2.description = "캔버스에 그린 그림과 이미지를 AI가 실시간으로 분석하고 심도 있게 해석해 주는 멀티모달 AI 서비스";
        p2.tags = ["#VisionAI", "#Gemini", "#Canvas", "#React"];
        p2.demoUrl = "https://ai.studio/apps/a6e6ef17-d596-4692-b76c-bd0169136f4a?fullscreenApplet=true";
        p2.imageUrl = "./assets/images/anime_robot_canvas.png";
        p2.demoNotice = "💡 접속 안내: Google AI Studio 환경 특성상 그림 캔버스가 뜨기까지 약 5~10초 정도 로딩 시간이 소요될 수 있습니다.";
      }
      const p3 = data.projects.find(p => p.id == 3 || (p.title && p.title.includes("창업")));
      if (p3) {
        p3.title = "🎓 대학생 창업 성향 테스트하기!";
        p3.description = "대학생들의 창업 성향과 잠재력을 다각도로 분석하여 맞춤형 창업 유형 및 가이드를 제공하는 테스트 웹 서비스";
        p3.tags = ["#Vite", "#React", "#Startup", "#Vercel"];
        p3.demoUrl = "https://holymoly-orpin.vercel.app/";
        p3.imageUrl = "./assets/images/startup_test_thumb.png";
      }
      savePortfolioData(data);
    }
    return data;
  } catch (e) {
    console.error("데이터 파싱 실패, 기본값으로 재설정합니다.", e);
    return defaultData;
  }
}

/**
 * LocalStorage에 데이터 저장하기 (백업용)
 */
export function savePortfolioData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Supabase DB에서 프로필 및 프로젝트 데이터 비동기 로드
 */
export async function fetchPortfolioDataFromSupabase() {
  const client = getSupabaseClient();
  if (!client) {
    console.log("Supabase client not loaded, using local storage fallback.");
    return getPortfolioData();
  }

  try {
    // 1. 프로필 정보 가져오기
    const { data: profileRows, error: profileErr } = await client
      .from("profiles")
      .select("*")
      .limit(1);

    // 2. 프로젝트 목록 가져오기
    const { data: projectRows, error: projectErr } = await client
      .from("projects")
      .select("*")
      .order("id", { ascending: true });

    if (profileErr || projectErr) {
      console.warn("Supabase 데이터 로드 경고 (DB 테이블 미생성 또는 권한 설정 확인 필요):", profileErr || projectErr);
      return getPortfolioData();
    }

    const result = {
      profile: defaultData.profile,
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
      const p1 = result.projects.find(p => p.id == 1 || (p.title && p.title.includes("운세")));
      if (p1) {
        p1.title = "🤖 AI 운세 쿠키 생성기";
        p1.demoUrl = "https://portfolio-1-zeta-lime.vercel.app/fortune-cookie/index.html";
        p1.imageUrl = "./assets/images/fortune_cookie_burst.png";
      }
      const p2 = result.projects.find(p => p.id == 2 || (p.title && p.title.includes("캔버스")));
      if (p2) {
        p2.title = "🎨 AI 캔버스 그림 해석기";
        p2.description = "캔버스에 그린 그림과 이미지를 AI가 실시간으로 분석하고 심도 있게 해석해 주는 멀티모달 AI 서비스";
        p2.tags = ["#VisionAI", "#Gemini", "#Canvas", "#React"];
        p2.demoUrl = "https://ai.studio/apps/a6e6ef17-d596-4692-b76c-bd0169136f4a?fullscreenApplet=true";
        p2.imageUrl = "./assets/images/anime_robot_canvas.png";
      }
      const p3 = result.projects.find(p => p.id == 3 || (p.title && p.title.includes("창업")));
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
  } catch (err) {
    console.error("Supabase 데이터 로드 중 예외 발생:", err);
    return getPortfolioData();
  }
}

/**
 * Supabase DB에 프로필 정보 저장
 */
export async function saveProfileToSupabase(profile) {
  savePortfolioData({ ...getPortfolioData(), profile });
  const client = getSupabaseClient();
  if (!client) return;

  try {
    const payload = {
      id: 1,
      name: profile.name,
      headline: profile.headline,
      bio: profile.bio,
      interests: profile.interests,
      tech_stack: profile.techStack,
      updated_at: new Date().toISOString()
    };
    const { error } = await client.from("profiles").upsert(payload, { onConflict: "id" });
    if (error) {
      console.error("Supabase 프로필 저장 오류:", error);
    }
  } catch (err) {
    console.error("Supabase 프로필 저장 중 예외 발생:", err);
  }
}

/**
 * Supabase DB에 프로젝트 추가
 */
export async function addProjectToSupabase(newProject) {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    const payload = {
      title: newProject.title,
      description: newProject.description,
      tags: newProject.tags,
      demo_url: newProject.demoUrl,
      github_url: newProject.githubUrl,
      image_url: newProject.imageUrl
    };
    const { data, error } = await client.from("projects").insert([payload]).select();
    if (error) {
      console.error("Supabase 프로젝트 추가 오류:", error);
    } else if (data && data.length > 0) {
      newProject.id = data[0].id;
    }
  } catch (err) {
    console.error("Supabase 프로젝트 추가 중 예외 발생:", err);
  }
}

/**
 * Supabase DB 프로젝트 정보 수정
 */
export async function updateProjectInSupabase(updatedProject) {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    const payload = {
      title: updatedProject.title,
      description: updatedProject.description,
      tags: updatedProject.tags,
      demo_url: updatedProject.demoUrl,
      github_url: updatedProject.githubUrl,
      image_url: updatedProject.imageUrl
    };
    const { error } = await client.from("projects").update(payload).eq("id", updatedProject.id);
    if (error) {
      console.error("Supabase 프로젝트 수정 오류:", error);
    }
  } catch (err) {
    console.error("Supabase 프로젝트 수정 중 예외 발생:", err);
  }
}

/**
 * Supabase DB 프로젝트 삭제
 */
export async function deleteProjectFromSupabase(id) {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    const { error } = await client.from("projects").delete().eq("id", id);
    if (error) {
      console.error("Supabase 프로젝트 삭제 오류:", error);
    }
  } catch (err) {
    console.error("Supabase 프로젝트 삭제 중 예외 발생:", err);
  }
}
