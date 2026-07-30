// 공통 유틸리티 함수 모듈

/**
 * 타자기 타입라이터 효과
 */
export function typeWriter(text, element, callback) {
    let index = 0;
    element.innerHTML = '';
    
    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, 35);
        } else if (callback) {
            callback();
        }
    }
    type();
}

/**
 * 1~45 중 중복되지 않는 랜덤 행운 번호 4개 생성
 */
export function generateLuckyNumbers() {
    const nums = [];
    while (nums.length < 4) {
        const n = Math.floor(Math.random() * 45) + 1;
        if (!nums.includes(n)) nums.push(n);
    }
    return nums.sort((a, b) => a - b);
}

/**
 * LocalStorage 기반 명언 기록 저장소 관리
 */
const STORAGE_KEY = 'fortune_history';

export function getHistory() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
        console.error('Failed to load history:', e);
        return [];
    }
}

export function saveHistory(historyArray) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(historyArray));
    } catch (e) {
        console.error('Failed to save history:', e);
    }
}

export function addQuoteToHistory(quoteObj, currentHistory) {
    const dateStr = new Date().toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const newRecord = {
        ko: quoteObj.ko,
        author: quoteObj.author,
        date: dateStr
    };

    const updatedHistory = [newRecord, ...currentHistory];

    // 최대 30개 항목 제한
    if (updatedHistory.length > 30) {
        updatedHistory.pop();
    }

    saveHistory(updatedHistory);
    return updatedHistory;
}

export function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    return [];
}
