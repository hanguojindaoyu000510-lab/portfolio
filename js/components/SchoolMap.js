/**
 * KIM DOWOOK AI Portfolio - 학교 위치 지도 컴포넌트 (SchoolMap.js)
 * 한국항공대학교 (Korea Aerospace University)
 * 서버 API 프록시(/api/map-config) 기반 카카오맵 동적 연동
 */

import { copyToClipboard } from "../utils/clipboard.js";

export function renderSchoolMapSection() {
  const mapSection = document.createElement("section");
  mapSection.id = "school-map";
  mapSection.className = "section";

  mapSection.innerHTML = `
    <div class="container" style="max-width: 900px;">
      <div class="glass-card pulse-glow" style="padding: 40px 32px; position: relative;">
        <!-- 섹션 헤더 -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
          <div>
            <span class="tag-pill tag-pill-ai" style="margin-bottom: 10px; display: inline-flex;">🏫 LOCATION 🐾</span>
            <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">
              우리 학교 위치 안내
            </h2>
            <p id="school-address-text" style="font-size: 0.95rem; color: var(--text-muted);">
              📍 경기도 고양시 덕양구 항공대학로 76 (한국항공대학교)
            </p>
          </div>
          
          <div style="display: flex; gap: 10px;">
            <button id="copy-school-addr-btn" class="btn-pill btn-pill-secondary btn-pill-sm">
              📋 주소 복사
            </button>
            <a id="kakao-map-direct-link" href="https://map.kakao.com/?q=한국항공대학교" target="_blank" rel="noopener noreferrer" class="btn-pill btn-pill-primary btn-pill-sm">
              📍 길찾기 바로가기
            </a>
          </div>
        </div>

        <!-- 카카오맵 지도 영역 래퍼 -->
        <div style="position: relative; width: 100%; height: 380px; border-radius: 24px; overflow: hidden; border: 2.5px solid var(--border-glass); box-shadow: 0 10px 30px rgba(186, 230, 253, 0.25);">
          <!-- 카카오맵 이 부모 컨테이너에 드로잉됨 -->
          <div id="kakao-school-map" style="width: 100%; height: 100%; background: #E0F2FE; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-weight: 700;">
            ⏳ 지도를 불러오는 중입니다... 🐾
          </div>
        </div>
      </div>
    </div>
  `;

  const copyBtn = mapSection.querySelector("#copy-school-addr-btn");
  copyBtn.addEventListener("click", () => {
    const addrText = mapSection.querySelector("#school-address-text").textContent.replace("📍 ", "");
    copyToClipboard(addrText, `학교 주소가 클립보드에 복사되었습니다!`);
  });

  initKakaoMapAsync(mapSection);
  return mapSection;
}

/**
 * 서버 API (/api/map-config) 호출 후 카카오맵 SDK 동적 로드 및 렌더링
 */
async function initKakaoMapAsync(containerEl) {
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
        if (data && data.status === "success") {
          config = data;
        }
      }
    } catch (e) {
      console.warn("Server API proxy unreachable, using fallback config.");
    }

    const addrEl = containerEl.querySelector("#school-address-text");
    const linkEl = containerEl.querySelector("#kakao-map-direct-link");
    if (addrEl) addrEl.textContent = `📍 ${config.schoolAddress}`;
    if (linkEl) linkEl.href = `https://map.kakao.com/?q=${encodeURIComponent(config.schoolName)}`;

    if (typeof window.kakao === "undefined" || !window.kakao.maps) {
      await loadKakaoMapSdkScript(config.mapApiKey);
    }

    const mapContainer = containerEl.querySelector("#kakao-school-map");
    if (!mapContainer || typeof window.kakao === "undefined" || !window.kakao.maps) {
      renderMapFallbackUI(mapContainer, config);
      return;
    }

    window.kakao.maps.load(() => {
      mapContainer.innerHTML = "";
      const loc = new window.kakao.maps.LatLng(config.lat, config.lng);
      const mapOptions = {
        center: loc,
        level: 3
      };

      const map = new window.kakao.maps.Map(mapContainer, mapOptions);

      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      const marker = new window.kakao.maps.Marker({
        position: loc,
        map: map
      });

      const iwContent = `
        <div style="padding:10px 14px; background:#FFFFFF; border-radius:14px; border:2px solid #38BDF8; font-size:12px; font-weight:800; color:#0F172A; text-align:center; box-shadow:0 4px 14px rgba(56,189,248,0.3);">
          🐾 ${config.schoolName} 🐱
          <div style="font-size:11px; color:#475569; margin-top:2px; font-weight:600;">${config.schoolAddress}</div>
        </div>
      `;

      const infowindow = new window.kakao.maps.InfoWindow({
        position: loc,
        content: iwContent
      });

      infowindow.open(map, marker);
    });

  } catch (err) {
    console.error("Kakao Map Load Error:", err);
    const mapContainer = containerEl.querySelector("#kakao-school-map");
    renderMapFallbackUI(mapContainer, { schoolName: "한국항공대학교", schoolAddress: "경기도 고양시 덕양구 항공대학로 76" });
  }
}

function loadKakaoMapSdkScript(appKey) {
  return new Promise((resolve, reject) => {
    if (document.getElementById("kakao-map-sdk-script")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = "kakao-map-sdk-script";
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}

function renderMapFallbackUI(container, config) {
  if (!container) return;
  container.innerHTML = `
    <div style="text-align: center; padding: 24px; background: rgba(255, 255, 255, 0.95); border-radius: 20px; border: 2px solid var(--color-primary);">
      <div style="font-size: 2.2rem; margin-bottom: 8px;">🏫 🐾</div>
      <h4 style="font-size: 1.2rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">${config.schoolName}</h4>
      <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 16px;">${config.schoolAddress}</p>
      <a href="https://map.kakao.com/?q=${encodeURIComponent(config.schoolName)}" target="_blank" rel="noopener noreferrer" class="btn-pill btn-pill-primary btn-pill-sm">
        📍 카카오맵에서 위치 보기
      </a>
    </div>
  `;
}
