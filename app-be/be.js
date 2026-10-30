/* =========================================================
   SIÊU NHÍ TỰ LẬP - APP BÉ (LOGIC ĐIỀU KHIỂN DÀNH CHO CON)
   ========================================================= */

import {
  todayKey,
  formatVietnameseDate,
  getKidLevel,
  getStageByAge,
  THEME_OPTIONS,
  FONT_OPTIONS,
  BE_PROFILE_KEY
} from '../shared/core.js';
import { sync } from '../shared/sync-service.js';
import { playSound, speak, getVoiceMessage } from '../shared/voice-service.js';

let activeSession = 'morning'; // 'morning' | 'afternoon' | 'evening'
let currentKid = null;
let currentTab = 'tasks'; // 'tasks' | 'rewards' | 'achievements' | 'theme'

// Tự động nhận diện buổi hiện tại theo giờ thực tế
function detectCurrentSession() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

function getActiveKid() {
  const state = sync.state;
  if (!state.kids || !state.kids.length) return null;

  // Lấy kid được ghim cho máy này, hoặc kid đầu tiên
  let savedKidId = localStorage.getItem(BE_PROFILE_KEY);
  let kid = state.kids.find((k) => k.id === savedKidId);
  if (!kid) {
    kid = state.kids[0];
    localStorage.setItem(BE_PROFILE_KEY, kid.id);
  }
  return kid;
}

// Cập nhật giao diện & Phông chữ lên toàn bộ trang theo hồ sơ của bé
function applyThemeAndFont(kid) {
  if (!kid) return;

  // Đảm bảo có stageId theo đúng số tuổi
  const stage = getStageByAge(kid.age);
  const stageId = kid.stageId || stage.id;
  const theme = kid.theme || stage.defaultTheme;
  const font = kid.font || stage.defaultFont;

  document.documentElement.dataset.stage = stageId;
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.font = font;
}

// Bắn pháo hoa ăn mừng khi nhận sao
function triggerConfetti() {
  const colors = ['#ff5277', '#ffb300', '#2ecc71', '#3498db', '#9b59b6'];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = '-20px';
    el.style.opacity = Math.random() + 0.5;
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(el);

    const fallDuration = 1800 + Math.random() * 1200;
    const keyframes = [
      { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${(Math.random() - 0.5) * 160}px, 100vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ];

    const anim = el.animate(keyframes, {
      duration: fallDuration,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    anim.onfinish = () => el.remove();
  }
}

// Render toàn bộ Header của Bé (Hiển thị trọn vẹn Biệt Danh + Tuổi)
function renderHeader() {
  const kid = currentKid;
  if (!kid) return '';

  const levelInfo = getKidLevel(kid.totalEarned || 0);
  const stage = getStageByAge(kid.age);

  return `
    <header class="app-header">
      <div class="kid-header-wrap">
        <div class="kid-identity-block">
          <div class="kid-avatar-frame">${kid.avatar || '🐝'}</div>
          <div class="kid-name-age-box">
            <!-- TÊN BIỆT DANH ĐẦY ĐỦ TRỌN VẸN KHÔNG BỊ CẮT -->
            <div class="kid-fullname-title">Bé ${kid.nickname || 'Mật Ong'}</div>
            <div class="kid-meta-badges">
              <span class="badge-age">🎂 ${kid.age || 6} tuổi</span>
              <span class="badge-stage">${stage.name}</span>
              <span class="badge-level">${levelInfo.icon} Cấp ${levelInfo.level}</span>
            </div>
          </div>
        </div>

        <!-- VÍ SAO / ĐIỂM TỰ LẬP -->
        <div class="star-wallet-pill" title="Số sao hiện có">
          ⭐ <span>${kid.stars || 0}</span>
        </div>
      </div>

      <!-- Thanh EXP Level (Hiển thị rõ nét cho bé tiểu học và mầm non) -->
      <div class="exp-bar-wrap" title="Tiến trình lên cấp kế tiếp">
        <div class="exp-bar-fill" style="width: ${levelInfo.progress}%"></div>
      </div>
      <div class="exp-label-row">
        <span>${levelInfo.title}</span>
        <span>${levelInfo.next ? `Cần thêm ${levelInfo.neededNext} ⭐ để lên Cấp ${levelInfo.next.level}` : 'Đạt Cấp Tối Đa 🏆'}</span>
      </div>
    </header>
  `;
}

// Render lời nhắn yêu thương từ Bố Mẹ nếu có
function renderLoveNote() {
  const kid = currentKid;
  if (!kid || !kid.message || !kid.message.text) return '';

  return `
    <div class="love-banner">
      <div class="love-banner-text">
        <span>💌</span>
        <div>
          <strong>${kid.message.sender || 'Bố Mẹ'}:</strong> "${kid.message.text}"
        </div>
      </div>
      <button class="btn-speaker" id="btn-read-note" title="Nghe lời nhắn">🔊</button>
    </div>
  `;
}

// Render Tab chọn buổi
function renderSessionTabs() {
  return `
    <div class="session-tabs">
      <button class="session-btn ${activeSession === 'morning' ? 'active' : ''}" data-session="morning">
        <span class="s-icon">🌅</span>
        <span>Buổi Sáng</span>
      </button>
      <button class="session-btn ${activeSession === 'afternoon' ? 'active' : ''}" data-session="afternoon">
        <span class="s-icon">🌇</span>
        <span>Chiều Về</span>
      </button>
      <button class="session-btn ${activeSession === 'evening' ? 'active' : ''}" data-session="evening">
        <span class="s-icon">🌙</span>
        <span>Buổi Tối</span>
      </button>
    </div>
  `;
}

// Render danh sách công việc của buổi
function renderTasks() {
  const kid = currentKid;
  const state = sync.state;
  const dateKey = todayKey();
  const dayData = (kid.days && kid.days[dateKey]) || { tasks: {} };
  const taskStatus = dayData.tasks || {};

  const filteredTasks = state.tasks.filter((t) => t.session === activeSession);

  if (!filteredTasks.length) {
    return `<div style="text-align:center; padding:30px; color:var(--text-sub);">Không có việc nào trong buổi này.</div>`;
  }

  return `
    <div class="task-list">
      ${filteredTasks
        .map((t) => {
          const rec = taskStatus[t.id];
          let cardStatusClass = '';
          let actionButtonHtml = '';

          if (!rec) {
            // Chưa làm
            actionButtonHtml = `
              <button class="btn-submit-task" data-task-id="${t.id}">
                ✋ Con làm xong rồi!
              </button>
            `;
          } else if (rec.status === 'pending') {
            cardStatusClass = 'pending';
            actionButtonHtml = `
              <button class="btn-submit-task btn-waiting" disabled>
                ⏳ Chờ Bố Mẹ kiểm tra...
              </button>
            `;
          } else if (rec.status === 'approved') {
            cardStatusClass = 'approved';
            actionButtonHtml = `
              <button class="btn-submit-task btn-approved" disabled>
                ✅ Đã duyệt (+${rec.starsAwarded || t.stars} ⭐)
              </button>
            `;
          } else if (rec.status === 'redo') {
            cardStatusClass = 'redo';
            actionButtonHtml = `
              <div style="width:100%;">
                <div style="font-size:0.85rem; color:#d63031; font-weight:700; margin-bottom:6px;">
                  ⚠️ Bố mẹ nhắc: ${rec.note || 'Con làm lại cho thật sạch sẽ nhé!'}
                </div>
                <button class="btn-submit-task btn-redo-alert" data-task-id="${t.id}">
                  🔄 Con đã làm lại xong rồi!
                </button>
              </div>
            `;
          }

          return `
            <div class="task-card ${cardStatusClass}" id="task-card-${t.id}">
              <div class="task-top-row">
                <div class="task-icon-box">${t.icon || '⭐'}</div>
                <div class="task-info">
                  <div class="task-time-pill">⏰ ${t.time} • +${t.stars} ⭐</div>
                  <div class="task-title">${t.title}</div>
                  <div class="task-note">${t.note || ''}</div>
                </div>
              </div>
              <div class="task-actions-row">
                <button class="btn-speaker" data-speak-task="${t.id}" title="Nghe cô giáo đọc yêu cầu">
                  🔊
                </button>
                ${actionButtonHtml}
              </div>
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}

// Render Mục Đổi Quà
function renderRewardsTab() {
  const kid = currentKid;
  const state = sync.state;

  return `
    <div style="padding:10px 0;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h2 style="font-size:1.3rem; font-weight:800;">🎁 Đổi Quà Thưởng</h2>
        <div class="star-wallet-pill">⭐ ${kid.stars || 0} sao</div>
      </div>
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${state.rewards
          .map((r) => {
            const canRedeem = (kid.stars || 0) >= r.cost;
            return `
              <div class="task-card" style="flex-direction:row; align-items:center; justify-content:space-between;">
                <div style="display:flex; align-items:center; gap:12px; flex:1;">
                  <div class="task-icon-box">${r.icon || '🎁'}</div>
                  <div>
                    <div style="font-weight:800; font-size:1.05rem;">${r.title}</div>
                    <div style="font-size:0.88rem; color:var(--text-sub); font-weight:700;">Cần: ${r.cost} ⭐</div>
                  </div>
                </div>
                <button 
                  class="btn-submit-task ${canRedeem ? '' : 'btn-waiting'}" 
                  style="min-height:44px; padding:0 16px; flex:none; font-size:0.95rem;" 
                  data-redeem-id="${r.id}"
                  ${canRedeem ? '' : 'disabled'}
                >
                  ${canRedeem ? 'Đổi quà 🎁' : 'Thiếu sao'}
                </button>
              </div>
            `;
          })
          .join('')}
      </div>
    </div>
  `;
}

// Render Mục Sổ Sao & Thành Tích
function renderAchievementsTab() {
  const kid = currentKid;
  const levelInfo = getKidLevel(kid.totalEarned || 0);

  return `
    <div style="padding:10px 0;">
      <h2 style="font-size:1.3rem; font-weight:800; margin-bottom:16px;">🏆 Bảng Thành Tích Tự Lập</h2>
      <div class="task-card" style="text-align:center; padding:24px 16px;">
        <div style="font-size:4rem; margin-bottom:8px;">${levelInfo.icon}</div>
        <div style="font-size:1.4rem; font-weight:800;">${levelInfo.title}</div>
        <div style="font-size:0.95rem; color:var(--text-sub); margin-top:4px;">
          Bé đã tích lũy tổng cộng <strong>${kid.totalEarned || 0} ⭐</strong> từ trước đến nay!
        </div>
        <div style="margin-top:16px;">
          <div class="exp-bar-wrap">
            <div class="exp-bar-fill" style="width:${levelInfo.progress}%"></div>
          </div>
          <div class="exp-label-row">
            <span>Tiến độ cấp hiện tại</span>
            <span>${levelInfo.progress}%</span>
          </div>
        </div>
      </div>

      <h3 style="font-size:1.1rem; font-weight:800; margin:20px 0 12px 0;">🎟️ Phiếu quà đã đổi</h3>
      ${
        kid.vouchers && kid.vouchers.length
          ? `<div style="display:flex; flex-direction:column; gap:10px;">
              ${kid.vouchers
                .map(
                  (v) => `
                <div class="task-card" style="padding:12px 16px; flex-direction:row; align-items:center; justify-content:space-between;">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:1.8rem;">${v.icon || '🎁'}</span>
                    <div>
                      <div style="font-weight:700;">${v.title}</div>
                      <div style="font-size:0.8rem; color:var(--text-sub);">Đổi bằng ${v.cost} ⭐</div>
                    </div>
                  </div>
                  <span class="badge-stage" style="${v.status === 'approved' ? 'background:#d4edda; color:#155724;' : ''}">
                    ${v.status === 'approved' ? '✅ Bố mẹ đã thưởng' : '⏳ Chờ bố mẹ trao'}
                  </span>
                </div>
              `
                )
                .join('')}
            </div>`
          : `<div style="color:var(--text-sub); font-size:0.9rem;">Bé chưa đổi phiếu quà nào. Hãy tích sao để đổi nhé!</div>`
      }
    </div>
  `;
}

// Render Mục Chọn Giao Diện & Phông Chữ Tự Do
function renderThemeSelectorTab() {
  const kid = currentKid;

  return `
    <div style="padding:10px 0;">
      <h2 style="font-size:1.3rem; font-weight:800; margin-bottom:8px;">🎨 Chọn Phong Cách Của Bé</h2>
      <p style="font-size:0.9rem; color:var(--text-sub); margin-bottom:16px;">
        Bé có thể tự do chọn màu sắc và kiểu chữ mà mình yêu thích nhất!
      </p>

      <h3 style="font-size:1.05rem; font-weight:800; margin-bottom:10px;">1. Chọn Màu Sắc Chủ Đề</h3>
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px; margin-bottom:20px;">
        ${THEME_OPTIONS.map(
          (th) => `
          <button 
            class="task-card ${kid.theme === th.id ? 'pending' : ''}" 
            style="cursor:pointer; text-align:left; padding:12px; gap:6px; border-width:${kid.theme === th.id ? '2.5px' : '1px'};"
            data-set-theme="${th.id}"
          >
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.5rem;">${th.icon}</span>
              <strong style="font-size:0.95rem;">${th.label}</strong>
            </div>
            <div style="display:flex; gap:4px; margin-top:4px;">
              <span style="width:18px; height:18px; border-radius:50%; background:${th.primary}; display:inline-block;"></span>
              <span style="width:18px; height:18px; border-radius:50%; background:${th.accent}; display:inline-block;"></span>
            </div>
          </button>
        `
        ).join('')}
      </div>

      <h3 style="font-size:1.05rem; font-weight:800; margin-bottom:10px;">2. Chọn Kiểu Chữ (Phông Chữ)</h3>
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${FONT_OPTIONS.map(
          (f) => `
          <button 
            class="task-card ${kid.font === f.id ? 'pending' : ''}" 
            style="cursor:pointer; text-align:left; padding:14px; font-family:${f.family}; border-width:${kid.font === f.id ? '2.5px' : '1px'};"
            data-set-font="${f.id}"
          >
            <div style="font-weight:800; font-size:1.1rem;">${f.label}</div>
            <div style="font-size:0.85rem; color:var(--text-sub); margin-top:2px;">
              Bé Mật Ong tự lập thật ngoan • 123456789
            </div>
          </button>
        `
        ).join('')}
      </div>
    </div>
  `;
}

// Thanh điều hướng đáy
function renderBottomNav() {
  return `
    <nav class="bottom-nav">
      <button class="nav-item ${currentTab === 'tasks' ? 'active' : ''}" data-tab="tasks">
        <span class="nav-icon">📋</span>
        <span>Việc Của Con</span>
      </button>
      <button class="nav-item ${currentTab === 'rewards' ? 'active' : ''}" data-tab="rewards">
        <span class="nav-icon">🎁</span>
        <span>Đổi Quà</span>
      </button>
      <button class="nav-item ${currentTab === 'achievements' ? 'active' : ''}" data-tab="achievements">
        <span class="nav-icon">🏆</span>
        <span>Thành Tích</span>
      </button>
      <button class="nav-item ${currentTab === 'theme' ? 'active' : ''}" data-tab="theme">
        <span class="nav-icon">🎨</span>
        <span>Giao Diện</span>
      </button>
    </nav>
  `;
}

export function renderApp() {
  currentKid = getActiveKid();
  if (!currentKid) {
    document.getElementById('app-root').innerHTML = `
      <div style="text-align:center; padding:50px 20px;">
        <h2>Chưa tìm thấy hồ sơ của Bé</h2>
        <p>Vui lòng kết nối với App Bố Mẹ qua Mã Gia Đình!</p>
      </div>
    `;
    return;
  }

  applyThemeAndFont(currentKid);

  let tabContent = '';
  if (currentTab === 'tasks') {
    tabContent = `
      ${renderSessionTabs()}
      ${renderTasks()}
    `;
  } else if (currentTab === 'rewards') {
    tabContent = renderRewardsTab();
  } else if (currentTab === 'achievements') {
    tabContent = renderAchievementsTab();
  } else if (currentTab === 'theme') {
    tabContent = renderThemeSelectorTab();
  }

  document.getElementById('app-root').innerHTML = `
    <div class="app-container">
      ${renderHeader()}
      ${renderLoveNote()}
      ${tabContent}
      ${renderBottomNav()}
    </div>
  `;

  attachEventHandlers();
}

function attachEventHandlers() {
  // Chuyển buổi
  document.querySelectorAll('[data-session]').forEach((btn) => {
    btn.onclick = () => {
      playSound('tap');
      activeSession = btn.dataset.session;
      renderApp();
    };
  });

  // Chuyển tab đáy
  document.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.onclick = () => {
      playSound('tap');
      currentTab = btn.dataset.tab;
      renderApp();
    };
  });

  // Bấm nộp bài: "Con làm xong rồi!"
  document.querySelectorAll('[data-task-id]').forEach((btn) => {
    btn.onclick = () => {
      const taskId = btn.dataset.taskId;
      playSound('check');
      sync.submitTask(currentKid.id, taskId);

      // Đọc giọng cô giáo động viên
      const prompt = getVoiceMessage('doneSubmit', currentKid);
      speak(prompt, currentKid.stageId);

      renderApp();
    };
  });

  // Bấm loa nghe cô giáo đọc yêu cầu việc
  document.querySelectorAll('[data-speak-task]').forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const taskId = btn.dataset.speakTask;
      const task = sync.state.tasks.find((t) => t.id === taskId);
      if (task) {
        playSound('tap');
        const text = getVoiceMessage('taskPrompt', currentKid, task);
        speak(text, currentKid.stageId);
      }
    };
  });

  // Bấm nghe lời nhắn từ bố mẹ
  const btnReadNote = document.getElementById('btn-read-note');
  if (btnReadNote && currentKid.message) {
    btnReadNote.onclick = () => {
      playSound('tap');
      speak(`${currentKid.message.sender || 'Bố Mẹ'} nhắn con là: ${currentKid.message.text}`, currentKid.stageId);
    };
  }

  // Bấm đổi quà
  document.querySelectorAll('[data-redeem-id]').forEach((btn) => {
    btn.onclick = () => {
      const rewardId = btn.dataset.redeemId;
      const success = sync.requestRedeem(currentKid.id, rewardId);
      if (success) {
        playSound('cheer');
        triggerConfetti();
        const reward = sync.state.rewards.find((r) => r.id === rewardId);
        speak(getVoiceMessage('redeem', currentKid, reward), currentKid.stageId);
        renderApp();
      } else {
        playSound('oops');
        alert('Bé chưa đủ sao để đổi phần quà này, hãy cố gắng tích thêm nhé!');
      }
    };
  });

  // Chọn giao diện màu sắc
  document.querySelectorAll('[data-set-theme]').forEach((btn) => {
    btn.onclick = () => {
      playSound('tap');
      const newTheme = btn.dataset.setTheme;
      sync.updateKidProfile(currentKid.id, { theme: newTheme });
      renderApp();
    };
  });

  // Chọn phông chữ
  document.querySelectorAll('[data-set-font]').forEach((btn) => {
    btn.onclick = () => {
      playSound('tap');
      const newFont = btn.dataset.setFont;
      sync.updateKidProfile(currentKid.id, { font: newFont });
      renderApp();
    };
  });
}

// Khởi chạy App
export function initKidApp() {
  activeSession = detectCurrentSession();
  sync.role = 'be';

  // Lắng nghe sự kiện đồng bộ từ máy Bố Mẹ
  sync.subscribe('TASK_GRADED', (payload) => {
    if (payload.kidId === currentKid?.id) {
      if (payload.gradeType === 'great' || payload.gradeType === 'ok') {
        playSound('star');
        triggerConfetti();
        const msg = getVoiceMessage('approved', currentKid, {
          title: payload.taskTitle,
          award: payload.starsEarned
        });
        speak(msg, currentKid.stageId);
      } else if (payload.gradeType === 'redo') {
        playSound('oops');
        const msg = getVoiceMessage('redo', currentKid, {
          title: payload.taskTitle,
          note: payload.note
        });
        speak(msg, currentKid.stageId);
      }
      renderApp();
    }
  });

  sync.subscribe('LOVE_NOTE_SENT', (payload) => {
    if (payload.kidId === currentKid?.id) {
      playSound('alert');
      speak(`${payload.message.sender} nhắn bé: ${payload.message.text}`, currentKid.stageId);
      renderApp();
    }
  });

  sync.subscribe('stateChange', () => {
    renderApp();
  });

  renderApp();

  // Đọc lời chào thân thương khi mở app
  setTimeout(() => {
    if (currentKid) {
      speak(getVoiceMessage('welcome', currentKid), currentKid.stageId);
    }
  }, 700);
}

