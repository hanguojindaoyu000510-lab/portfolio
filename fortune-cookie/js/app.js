// 포춘 쿠키 웹 앱 메인 엔트리 포인트 모듈
import { quotes } from './data/quotes.js';
import { ParticleBackground } from './utils/particles.js';
import { playCrackSound, toggleAudioMute } from './utils/audio.js';
import { 
    typeWriter, 
    generateLuckyNumbers, 
    getHistory, 
    addQuoteToHistory, 
    clearHistory 
} from './utils/helpers.js';

// DOM 요소 렌더링 및 엘리먼트 참조
const cookieWrapper = document.getElementById('cookie-wrapper');
const glowAura = document.getElementById('glow-aura');
const fortunePaperContainer = document.getElementById('fortune-paper-container');
const fortuneText = document.getElementById('fortune-text');
const fortuneAuthor = document.getElementById('fortune-author');
const luckyNumbersContainer = document.getElementById('lucky-numbers');
const actionPanel = document.getElementById('action-panel');
const copyBtn = document.getElementById('copy-btn');
const resetBtn = document.getElementById('reset-btn');
const historyList = document.getElementById('history-list');
const emptyHistory = document.getElementById('empty-history');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const soundToggleBtn = document.getElementById('sound-toggle');
const catChips = document.querySelectorAll('.cat-chip');

// 상태 변수
let isCracked = false;
let currentQuote = null;
let currentCategory = 'all';
let unlockedHistory = getHistory();

// 1. 배경 파티클 애니메이션 초기화
const bgParticles = new ParticleBackground('bg-particles');
bgParticles.start();

// 2. 히스토리 UI 업데이트
function updateHistoryUI() {
    if (unlockedHistory.length === 0) {
        emptyHistory.style.display = 'block';
        historyList.querySelectorAll('.history-card').forEach(el => el.remove());
        return;
    }

    emptyHistory.style.display = 'none';
    
    // 기존 카드 제거
    historyList.querySelectorAll('.history-card').forEach(el => el.remove());

    // 데이터 렌더링
    unlockedHistory.forEach(item => {
        const card = document.createElement('div');
        card.className = 'history-card';
        card.innerHTML = `
            <p class="history-quote">"${item.ko}"</p>
            <div class="history-meta">
                <span class="history-author">- ${item.author}</span>
                <span class="history-date"><i class="fa-regular fa-calendar-days"></i> ${item.date}</span>
            </div>
        `;
        historyList.appendChild(card);
    });
}

// 3. 카테고리 칩 이벤트 바인딩
catChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
        catChips.forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentCategory = e.currentTarget.getAttribute('data-category');
    });
});

// 4. 쿠키 깨기 처리
function crackCookie() {
    if (isCracked) return;
    isCracked = true;

    // 사운드 효과
    playCrackSound();

    // 쿠키 쪼개짐 & 후광 애니메이션
    cookieWrapper.classList.add('cracked');
    glowAura.classList.add('active');

    // 카테고리별 명언 필터링
    const filteredQuotes = currentCategory === 'all'
        ? quotes
        : quotes.filter(q => q.category === currentCategory);
    
    const pool = filteredQuotes.length > 0 ? filteredQuotes : quotes;
    currentQuote = pool[Math.floor(Math.random() * pool.length)];

    // 종이 슬라이드 및 텍스트 렌더링
    setTimeout(() => {
        fortunePaperContainer.classList.add('active');
        
        // 타자기 타이핑 효과
        typeWriter(currentQuote.ko, fortuneText, () => {
            fortuneAuthor.style.opacity = '0';
            fortuneAuthor.innerHTML = `- ${currentQuote.author} <br><small style="color:#8c8275; margin-top:5px; display:block;">"${currentQuote.en}"</small>`;
            fortuneAuthor.style.transition = 'opacity 0.8s ease';
            
            setTimeout(() => {
                fortuneAuthor.style.opacity = '1';
                
                // 행운 번호 표시
                const numbers = generateLuckyNumbers();
                const numSpans = luckyNumbersContainer.querySelectorAll('.num-span');
                numbers.forEach((num, idx) => {
                    numSpans[idx].textContent = num;
                    numSpans[idx].style.animation = `fadeInUp 0.3s ease forwards ${idx * 0.1}s`;
                });
                
                // 액션 패널 페이드인
                actionPanel.classList.add('active');
            }, 300);
        });

        // 히스토리에 추가
        unlockedHistory = addQuoteToHistory(currentQuote, unlockedHistory);
        updateHistoryUI();
    }, 450);
}

// 5. 리셋 처리
function resetStage() {
    if (!isCracked) return;

    cookieWrapper.classList.remove('cracked');
    glowAura.classList.remove('active');
    fortunePaperContainer.classList.remove('active');
    actionPanel.classList.remove('active');

    setTimeout(() => {
        fortuneText.innerHTML = '';
        fortuneAuthor.innerHTML = '';
        const numSpans = luckyNumbersContainer.querySelectorAll('.num-span');
        numSpans.forEach(span => span.textContent = '0');
        isCracked = false;
    }, 800);
}

// 6. 이벤트 바인딩
cookieWrapper.addEventListener('click', crackCookie);
resetBtn.addEventListener('click', resetStage);

soundToggleBtn.addEventListener('click', () => {
    toggleAudioMute(soundToggleBtn);
});

copyBtn.addEventListener('click', () => {
    if (!currentQuote) return;
    
    const shareText = `[오늘의 포춘 쿠키]\n"${currentQuote.ko}"\n- ${currentQuote.author}`;
    navigator.clipboard.writeText(shareText).then(() => {
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> 복사 완료!';
        copyBtn.style.background = 'rgba(74, 222, 128, 0.2)';
        copyBtn.style.borderColor = 'rgba(74, 222, 128, 0.4)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = '';
            copyBtn.style.borderColor = '';
        }, 2000);
    }).catch(err => {
        console.error('클립보드 복사 실패:', err);
    });
});

clearHistoryBtn.addEventListener('click', () => {
    if (confirm('모든 기록을 삭제하시겠습니까?')) {
        unlockedHistory = clearHistory();
        updateHistoryUI();
    }
});

// 초기화 execution
updateHistoryUI();
