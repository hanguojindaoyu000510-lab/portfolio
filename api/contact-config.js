/**
 * Vercel Serverless Function - 이메일 환경변수 안전 반환 API (/api/contact-config)
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
    serviceId: process.env.EMAILJS_SERVICE_ID || "service_5imxylv",
    templateId: process.env.EMAILJS_TEMPLATE_ID || "template_8gaj1uo",
    publicKey: process.env.EMAILJS_PUBLIC_KEY || "lyYq0Z8STxd99nxT0",
    receiverEmail: process.env.RECEIVER_EMAIL || "hanguojindaoyu000510@gmail.com"
  });
};
