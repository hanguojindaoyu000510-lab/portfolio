/**
 * KIM DOWOOK AI Portfolio - 클립보드 공통 유틸리티 (clipboard.js)
 * 텍스트 클립보드 복사 및 토스트 알림 처리
 */

/**
 * 텍스트를 클립보드에 복사하고 결과를 알리는 공통 함수
 * @param {string} textToCopy - 복사할 텍스트
 * @param {string} successMessage - 성공 시 표시할 메시지
 */
export async function copyToClipboard(textToCopy, successMessage = "클립보드에 복사되었습니다!") {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(textToCopy);
      alert(successMessage);
    } else {
      // 대체 복사 방식 (Legacy Fallback)
      const tempInput = document.createElement("input");
      tempInput.value = textToCopy;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      alert(successMessage);
    }
  } catch (err) {
    console.error("클립보드 복사 중 오류 발생:", err);
    alert(`복사 실패. 수동으로 복사해 주세요: ${textToCopy}`);
  }
}
