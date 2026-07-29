/**
 * KIM DOWOOK AI Portfolio - 백엔드 API 프록시 & 스태틱 파일 서버 (server.js)
 * 브라우저 및 GitHub API 키 유출 방지를 위한 서버 프록시 레이어
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

// .env 파일 로드 함수 (외부 라이브러리 없이 순수 Node.js 파싱)
function loadEnv() {
  const envPath = path.resolve(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [key, ...values] = trimmed.split("=");
        process.env[key.trim()] = values.join("=").trim();
      }
    });
  }
}

loadEnv();

const PORT = process.env.PORT || 3000;

// MIME 타입 맵
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  // CORS 헤더 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname;

  // 1. 서버 API 엔드포인트: 지도 설정 정보 반환 (/api/map-config)
  if (pathname === "/api/map-config" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      status: "success",
      schoolName: process.env.SCHOOL_NAME || "한국항공대학교 (Korea Aerospace University)",
      schoolAddress: process.env.SCHOOL_ADDRESS || "경기도 고양시 덕양구 항공대학로 76",
      lat: parseFloat(process.env.SCHOOL_LAT || "37.600779"),
      lng: parseFloat(process.env.SCHOOL_LNG || "126.864742"),
      mapApiKey: process.env.KAKAO_MAP_API_KEY || "lyYq0Z8STxd99nxT0"
    }));
    return;
  }

  // 2. 서버 API 엔드포인트: 이메일 서비스 설정 프록시 (/api/contact-config)
  if (pathname === "/api/contact-config" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      status: "success",
      serviceId: process.env.EMAILJS_SERVICE_ID || "service_5imxylv",
      templateId: process.env.EMAILJS_TEMPLATE_ID || "template_8gaj1uo",
      publicKey: process.env.EMAILJS_PUBLIC_KEY || "lyYq0Z8STxd99nxT0",
      receiverEmail: process.env.RECEIVER_EMAIL || "hanguojindaoyu000510@gmail.com"
    }));
    return;
  }

  // 3. 스태틱 파일 제공 (index.html, css, js, assets 등)
  let filePath = path.join(__dirname, pathname === "/" ? "index.html" : pathname);
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        // Fallback to index.html for Single Page App routing
        fs.readFile(path.join(__dirname, "index.html"), (err, htmlContent) => {
          if (err) {
            res.writeHead(500);
            res.end("500 Server Error");
          } else {
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(htmlContent, "utf-8");
          }
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 [KIM DOWOOK AI Portfolio Server Running]`);
  console.log(`- Local URL: http://localhost:${PORT}`);
  console.log(`- Map API Proxy: http://localhost:${PORT}/api/map-config`);
  console.log(`- Contact API Proxy: http://localhost:${PORT}/api/contact-config\n`);
});
