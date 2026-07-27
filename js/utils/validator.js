/**
 * KIM DOWOOK AI Portfolio - 데이터 포맷팅 및 검증 유틸리티 (validator.js)
 * 태그 배열 문자열 변환, URL 검증 공통 함수
 */

/**
 * 쉼표 구분 태그 문자열을 배열로 파싱 및 정리하는 공통 함수
 * @param {string} tagString - 예: "#GPT-4o, #React, #Vite"
 * @returns {string[]} 해시태그 규칙이 적용된 배열
 */
export function parseTags(tagString) {
  if (!tagString) return [];
  return tagString
    .split(",")
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .map(tag => (tag.startsWith("#") ? tag : `#${tag}`));
}

/**
 * 올바른 URL 형식인지 검증하는 공통 함수
 * @param {string} urlString - 검증할 URL
 * @returns {boolean} 유효 여부
 */
export function isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
}
