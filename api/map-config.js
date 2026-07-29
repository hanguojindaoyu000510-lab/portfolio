/**
 * Vercel Serverless Function - 지도 환경변수 안전 반환 API (/api/map-config)
 * 한국항공대학교 (Korea Aerospace University)
 */
module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  res.status(200).json({
    status: "success",
    schoolName: process.env.SCHOOL_NAME || "한국항공대학교 (Korea Aerospace University)",
    schoolAddress: process.env.SCHOOL_ADDRESS || "경기도 고양시 덕양구 항공대학로 76",
    lat: parseFloat(process.env.SCHOOL_LAT || "37.600779"),
    lng: parseFloat(process.env.SCHOOL_LNG || "126.864742"),
    mapApiKey: process.env.KAKAO_MAP_API_KEY || "lyYq0Z8STxd99nxT0"
  });
};
