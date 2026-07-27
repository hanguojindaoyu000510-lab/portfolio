/**
 * KIM DOWOOK AI Portfolio - 데이터 및 상태 관리 모듈 (initialData.js)
 * LocalStorage 기반 데이터 지속성 지원
 */

// 초기 기본 더미 데이터 (김도욱 님의 포트폴리오 기본값)
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

// LocalStorage 키 명칭
const STORAGE_KEY = "dowook_ai_portfolio_data";

/**
 * LocalStorage에서 데이터 불러오기 (없을 시 기본값 저장 후 반환)
 */
export function getPortfolioData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    savePortfolioData(defaultData);
    return defaultData;
  }
  try {
    const data = JSON.parse(stored);
    // 프로젝트 2 정보 자동 동기화
    if (data && data.projects) {
      const p2 = data.projects.find(p => p.id === 2);
      if (p2) {
        p2.title = "🎨 AI 캔버스 그림 해석기";
        p2.description = "캔버스에 그린 그림과 이미지를 AI가 실시간으로 분석하고 심도 있게 해석해 주는 멀티모달 AI 서비스";
        p2.tags = ["#VisionAI", "#Gemini", "#Canvas", "#React"];
        p2.demoUrl = "https://ai.studio/apps/a6e6ef17-d596-4692-b76c-bd0169136f4a?fullscreenApplet=true";
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
 * LocalStorage에 데이터 저장하기
 */
export function savePortfolioData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
