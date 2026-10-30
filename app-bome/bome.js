/* =========================================================
   SIÊU NHÍ TỰ LẬP - APP BỐ MẸ (LOGIC DASHBOARD QUẢN LÝ)
   ========================================================= */

import {
  todayKey,
  formatVietnameseDate,
  getKidLevel,
  getStageByAge,
  THEME_OPTIONS,
  FONT_OPTIONS,
  AGE_STAGES,
  newKidProfile
} from '../shared/core.js';
import { sync } from '../shared/sync-service.js';
import { playSound } from '../shared/voice-service.js';
import { renderQRCodeSVG } from '../shared/qr-generator.js';

let activeKidId = null;
let currentTab = 'pending'; // 'pending' | 'tasks' | 'rewards' | 'family'
let editingKid = null;
let showAddKidModal = false;
let showEditKidModal = false;
let showPairingModal = false;
let redoTaskModal = null; // { kidId, taskId }

function getActiveKid() {
  const state = sync.state;
  if (!state.kids || !state.kids.length) return null;
  let kid = state.kids.find((k) => k.id === activeKidId);
  if (!kid) {
    kid = state.kids[0];
    activeKidId = kid.id;
  }
  return kid;
}

// Lấy danh sách việc đang chờ Bố Mẹ duyệt của hôm nay
function getPendingTasks() {
  const dateKey = todayKey();
  const list = [];
  const state = sync.state;

  state.kids.forEach((kid) => {
    const dayData = (kid.days && kid.days[dateKey]) || {};
    const tasksMap = dayData.tasks || {};
    Object.keys(tasksMap).forEach((tid) => {
      if (tasksMap[tid].status === 'pending') {
        const taskDef = state.tasks.find((t) => t.id === tid);
        if (taskDef) {
          list.push({
            kid,
            task: taskDef,
            submittedAt: tasksMap[tid].submittedAt
          });
        }
      }
    });
  });
  return list;
}

// Render Header của Bố Mẹ
function renderParentHeader() {
  const state = sync.state;
  return `
    <header class="parent-header">
      <div class="parent-title-group">
        <div class="parent-app-title">
          <span>🛡️</span>
          <span>Bố Mẹ Quản Lý</span>
        </div>
        <div class="parent-sub">${formatVietnameseDate()}</div>
      </div>
      <button class="family-badge" id="btn-show-family" title="Xem mã gia đình & QR kết nối">
        <span>👨‍👩‍👧‍👦</span>
        <span>Mã: ${state.familyId || 'Gia Đình'}</span>
      </button>
    </header>
  `;
}

// Render thanh chọn con (Hỗ trợ nhà có nhiều bé)
function renderKidSelector() {
  const state = sync.state;
  const curKid = getActiveKid();

  return `
    <div class="kid-selector-bar">
      ${state.kids
        .map(
          (k) => `
        <div class="kid-chip ${k.id === curKid?.id ? 'active' : ''}" data-select-kid="${k.id}">
          <div class="kid-chip-avatar">${k.avatar || '🐝'}</div>
          <div>
            <strong>${k.nickname}</strong>
            <span style="font-size:0.8rem; opacity:0.85;">(${k.age}t)</span>
          </div>
        </div>
      `
        )
        .join('')}
      <button class="btn-add-kid-chip" id="btn-open-add-kid">
        + Thêm Con
      </button>
    </div>
  `;
}

// Render thẻ hồ sơ bé đang chọn
function renderKidProfileCard() {
  const kid = getActiveKid();
  if (!kid) return '';

  const levelInfo = getKidLevel(kid.totalEarned || 0);
  const stage = getStageByAge(kid.age);

  return `
    <div class="kid-profile-card">
      <div class="profile-top-row">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="kid-avatar-frame">${kid.avatar || '🐝'}</div>
          <div>
            <!-- HIỂN THỊ ĐẦY ĐỦ TÊN BIỆT DANH VÀ TUỔI -->
            <div class="kid-big-title">Bé ${kid.nickname} (${kid.age} tuổi)</div>
            <div class="kid-details-text">
              Họ tên: ${kid.fullName || 'Chưa đặt'} • Giao diện: <strong>${stage.name}</strong>
            </div>
          </div>
        </div>
        <button class="btn-edit-kid" id="btn-edit-kid-profile">
          ✏️ Tùy Chỉnh
        </button>
      </div>

      <div style="display:flex; gap:10px; margin-top:14px; flex-wrap:wrap;">
        <span class="badge-age">🎂 ${kid.age} tuổi</span>
        <span class="badge-stage">${stage.name}</span>
        <span class="badge-level">${levelInfo.icon} Cấp ${levelInfo.level}: ${levelInfo.title}</span>
        <span class="star-wallet-pill" style="font-size:0.95rem; padding:4px 10px;">⭐ Hiện có: ${kid.stars || 0} sao</span>
      </div>

      <!-- Khung gửi lời nhắn yêu thương đến máy con -->
      <div style="margin-top:14px; padding-top:12px; border-top:1px solid #f1f5f9; display:flex; gap:8px;">
        <input 
          type="text" 
          id="input-love-note" 
          class="form-input" 
          placeholder="Gửi lời nhắn yêu thương cho bé ${kid.nickname}..." 
          style="flex:1;"
        />
        <button class="btn-primary-action" id="btn-send-love-note" style="width:auto; padding:0 16px;">
          💌 Gửi
        </button>
      </div>
    </div>
  `;
}

// Render Tab 1: Hàng đợi duyệt việc (Pending Approval Queue)
function renderPendingQueue() {
  const pending = getPendingTasks();

  return `
    <div class="pending-section">
      <div class="pending-header-row">
        <div style="font-weight:800; font-size:1.1rem; color:#b45309; display:flex; align-items:center; gap:8px;">
          <span>🔔</span>
          <span>Việc Chờ Bố Mẹ Kiểm Tra</span>
        </div>
        <span class="pending-count-badge">${pending.length} việc</span>
      </div>

      ${
        pending.length
          ? `<div style="display:flex; flex-direction:column; gap:10px;">
              ${pending
                .map(
                  (item) => `
                <div class="pending-card">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div>
                      <span style="font-size:0.8rem; font-weight:700; color:#ff5277; background:#fff0f3; padding:2px 8px; border-radius:999px;">
                        Bé ${item.kid.nickname} (${item.kid.age} tuổi)
                      </span>
                      <div style="font-weight:800; font-size:1.05rem; margin-top:4px;">
                        ${item.task.icon || '⭐'} ${item.task.title}
                      </div>
                      <div style="font-size:0.82rem; color:#64748b; margin-top:2px;">
                        ⏰ Giờ quy định: ${item.task.time} • Điểm gốc: +${item.task.stars}⭐
                      </div>
                    </div>
                  </div>

                  <!-- 3 NÚT CHẤM ĐIỂM DÀNH CHO BỐ MẸ -->
                  <div class="grading-buttons-row">
                    <button class="btn-grade btn-grade-great" data-grade="great" data-kid-id="${item.kid.id}" data-task-id="${item.task.id}">
                      <span>🌟 Xuất Sắc</span>
                      <span>+${item.task.stars + 1} ⭐ (Thưởng)</span>
                    </button>
                    <button class="btn-grade btn-grade-ok" data-grade="ok" data-kid-id="${item.kid.id}" data-task-id="${item.task.id}">
                      <span>✅ Đạt Chuẩn</span>
                      <span>+${item.task.stars} ⭐</span>
                    </button>
                    <button class="btn-grade btn-grade-redo" data-grade="redo" data-kid-id="${item.kid.id}" data-task-id="${item.task.id}">
                      <span>↩️ Chưa Đạt</span>
                      <span>-1⭐ & Làm lại</span>
                    </button>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>`
          : `<div style="text-align:center; padding:24px 10px; color:#94a3b8; font-size:0.95rem;">
              Hiện chưa có việc nào bé nộp chờ duyệt. Khi bé bấm "Con làm xong rồi!" ở máy con, việc sẽ hiện tại đây!
            </div>`
      }
    </div>
  `;
}

// Render Tab 2: Quản lý thời gian biểu (Tasks Manager)
function renderTasksManager() {
  const state = sync.state;

  return `
    <div style="background:#ffffff; border-radius:20px; padding:18px; box-shadow:0 4px 16px rgba(0,0,0,0.05); margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <h3 style="font-size:1.15rem; font-weight:800;">⏰ Danh Sách Thời Gian Biểu</h3>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px;">
        ${state.tasks
          .map(
            (t) => `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:12px; background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:1.8rem;">${t.icon || '⭐'}</span>
              <div>
                <div style="font-weight:700; font-size:0.95rem;">${t.title}</div>
                <div style="font-size:0.8rem; color:#64748b;">
                  Buổi: ${t.session === 'morning' ? 'Sáng' : t.session === 'afternoon' ? 'Chiều' : 'Tối'} • ${t.time} • +${t.stars}⭐
                </div>
              </div>
            </div>
            <span class="badge-stage" style="background:#e0e7ff; color:#3730a3;">
              ${t.applySchool ? 'Đi học' : 'Nghỉ'}
            </span>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}

// Render Tab 3: Quản lý Kho Quà
function renderRewardsManager() {
  const state = sync.state;
  const curKid = getActiveKid();

  // Kiểm tra yêu cầu đổi quà đang chờ duyệt
  const pendingVouchers = [];
  state.kids.forEach((k) => {
    (k.vouchers || []).forEach((v) => {
      if (v.status === 'pending') {
        pendingVouchers.push({ kid: k, voucher: v });
      }
    });
  });

  return `
    <div style="background:#ffffff; border-radius:20px; padding:18px; box-shadow:0 4px 16px rgba(0,0,0,0.05); margin-bottom:16px;">
      <h3 style="font-size:1.15rem; font-weight:800; margin-bottom:12px;">🎁 Yêu Cầu Đổi Quà Chờ Phê Duyệt</h3>
      ${
        pendingVouchers.length
          ? `<div style="display:flex; flex-direction:column; gap:8px; margin-bottom:20px;">
              ${pendingVouchers
                .map(
                  (item) => `
                <div style="padding:12px; background:#fff7ed; border:1px solid #fed7aa; border-radius:14px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <div style="font-weight:700; font-size:0.95rem;">Bé ${item.kid.nickname} muốn đổi: ${item.voucher.title}</div>
                    <div style="font-size:0.82rem; color:#c2410c;">Trừ ${item.voucher.cost} ⭐ từ ví bé</div>
                  </div>
                  <button class="btn-primary-action" style="width:auto; padding:6px 14px; font-size:0.85rem;" data-approve-voucher="${item.voucher.id}" data-kid-id="${item.kid.id}">
                    Duyệt Trao Quà
                  </button>
                </div>
              `
                )
                .join('')}
            </div>`
          : `<div style="color:#64748b; font-size:0.9rem; margin-bottom:20px;">Hiện không có yêu cầu đổi quà nào đang chờ.</div>`
      }

      <h3 style="font-size:1.15rem; font-weight:800; margin-bottom:12px;">📦 Danh Mục Quà Thưởng Cho Bé</h3>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${state.rewards
          .map(
            (r) => `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:#f8fafc; border-radius:12px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:1.6rem;">${r.icon || '🎁'}</span>
              <div>
                <div style="font-weight:700; font-size:0.95rem;">${r.title}</div>
                <div style="font-size:0.8rem; color:#64748b;">Chi phí: ${r.cost} sao</div>
              </div>
            </div>
            <span class="star-wallet-pill" style="font-size:0.85rem; padding:4px 8px;">${r.cost} ⭐</span>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}

// Render Modal Kết nối Gia đình (Không cần cài Firebase)
function renderPairingModal() {
  if (!showPairingModal) return '';
  const state = sync.state;
  const qrSvg = renderQRCodeSVG(state.familyId || 'SIEUNHI', 180);

  return `
    <div class="modal-overlay active">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">👨‍👩‍👧‍👦 Kết Nối Với Máy Của Bé</h3>
          <button class="modal-close" id="btn-close-pairing">×</button>
        </div>
        <p style="font-size:0.9rem; color:#64748b; margin-bottom:14px;">
          Chỉ cần quét mã QR hoặc nhập Mã Gia Đình dưới đây trên iPad/máy của con để 2 máy thông nhau ngay tức thì!
        </p>

        <div style="text-align:center; margin:16px 0;">
          ${qrSvg}
        </div>

        <div style="background:#f1f5f9; padding:12px; border-radius:12px; text-align:center; margin-bottom:16px;">
          <div style="font-size:0.82rem; color:#64748b;">MÃ KẾT NỐI GIA ĐÌNH:</div>
          <div style="font-size:1.6rem; font-weight:800; color:#ff5277; letter-spacing:3px;">
            ${state.familyId || 'GD-888999'}
          </div>
        </div>

        <a href="../app-be/index.html" target="_blank" class="btn-primary-action" style="text-decoration:none; margin-bottom:8px;">
          📱 Mở Thử App Bé Trên Máy Này
        </a>
      </div>
    </div>
  `;
}

// Render Modal Chỉnh sửa Hồ sơ Con (Biệt danh, Tuổi, Theme theo tuổi)
function renderEditKidModal() {
  if (!showEditKidModal) return '';
  const kid = editingKid || getActiveKid();
  if (!kid) return '';

  return `
    <div class="modal-overlay active">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">✏️ Chỉnh Sửa Hồ Sơ Của Bé</h3>
          <button class="modal-close" id="btn-close-edit-kid">×</button>
        </div>

        <div class="form-group">
          <label class="form-label">Tên Biệt Danh (Ở nhà thường gọi con là gì?)</label>
          <input type="text" id="edit-nickname" class="form-input" value="${kid.nickname || ''}" placeholder="VD: Mật Ong, Bắp, Sữa, Cún..." />
        </div>

        <div class="form-group">
          <label class="form-label">Họ và Tên Đầy Đủ (Tùy chọn)</label>
          <input type="text" id="edit-fullname" class="form-input" value="${kid.fullName || ''}" placeholder="VD: Nguyễn Ngọc Mật Ong" />
        </div>

        <div class="form-group">
          <label class="form-label">Tuổi của con (Năm nay con mấy tuổi?)</label>
          <input type="number" id="edit-age" class="form-input" value="${kid.age || 6}" min="2" max="18" />
        </div>

        <div class="form-group">
          <label class="form-label">Biểu tượng Avatar</label>
          <input type="text" id="edit-avatar" class="form-input" value="${kid.avatar || '🐝'}" placeholder="VD: 🐝, 🦁, 🐱, 🌸, 🚀..." />
        </div>

        <div class="form-group">
          <label class="form-label">Lựa Chọn Giao Diện Theo Độ Tuổi</label>
          <select id="edit-stage" class="form-select">
            <option value="mam-non" ${kid.stageId === 'mam-non' ? 'selected' : ''}>🌸 Mầm Non (3 - 6 tuổi): Mầm Tự Lập (Kẹo ngọt, chữ to, cô giáo đọc to)</option>
            <option value="tieu-hoc" ${kid.stageId === 'tieu-hoc' ? 'selected' : ''}>🚀 Tiểu Học (7 - 10 tuổi): Hiệp Sĩ Vũ Trụ (Game RPG, thanh EXP, huy hiệu)</option>
            <option value="teen" ${kid.stageId === 'teen' ? 'selected' : ''}>⚡ Thiếu Niên (11 - 15+ tuổi): Teen Tự Chủ (Tối giản hiện đại, habit tracker)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Màu Sắc Chủ Đề</label>
          <select id="edit-theme" class="form-select">
            ${THEME_OPTIONS.map(
              (th) => `
              <option value="${th.id}" ${kid.theme === th.id ? 'selected' : ''}>${th.icon} ${th.label}</option>
            `
            ).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Kiểu Phông Chữ</label>
          <select id="edit-font" class="form-select">
            ${FONT_OPTIONS.map(
              (f) => `
              <option value="${f.id}" ${kid.font === f.id ? 'selected' : ''}>${f.label}</option>
            `
            ).join('')}
          </select>
        </div>

        <button class="btn-primary-action" id="btn-save-edit-kid" style="margin-top:10px;">
          💾 Lưu Thay Đổi
        </button>
      </div>
    </div>
  `;
}

// Render Modal Thêm Con Mới
function renderAddKidModal() {
  if (!showAddKidModal) return '';

  return `
    <div class="modal-overlay active">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">👶 Thêm Hồ Sơ Con Mới</h3>
          <button class="modal-close" id="btn-close-add-kid">×</button>
        </div>

        <div class="form-group">
          <label class="form-label">Tên Biệt Danh Của Con (*)</label>
          <input type="text" id="add-nickname" class="form-input" placeholder="VD: Bé Bắp, Bé Sữa, Bin..." />
        </div>

        <div class="form-group">
          <label class="form-label">Tuổi của con (*)</label>
          <input type="number" id="add-age" class="form-input" value="6" min="2" max="18" />
        </div>

        <div class="form-group">
          <label class="form-label">Biểu tượng Avatar</label>
          <input type="text" id="add-avatar" class="form-input" value="🦁" />
        </div>

        <button class="btn-primary-action" id="btn-submit-add-kid" style="margin-top:10px;">
          ➕ Tạo Hồ Sơ Cho Bé
        </button>
      </div>
    </div>
  `;
}

// Render Modal Nhắc Nhở Khi Chấm Chưa Đạt (Làm lại)
function renderRedoTaskModal() {
  if (!redoTaskModal) return '';
  const task = sync.state.tasks.find((t) => t.id === redoTaskModal.taskId);

  return `
    <div class="modal-overlay active">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title" style="color:#d63031;">↩️ Nhắc Bé Làm Lại Việc</h3>
          <button class="modal-close" id="btn-close-redo-modal">×</button>
        </div>
        <p style="font-size:0.9rem; color:#64748b; margin-bottom:12px;">
          Bé sẽ bị trừ 1 sao phạt và được nhận thông báo giọng cô giáo nhẹ nhàng nhắc con làm lại cho sạch sẽ.
        </p>

        <div class="form-group">
          <label class="form-label">Việc cần làm lại: <strong>${task ? task.title : ''}</strong></label>
          <textarea id="redo-note-text" class="form-textarea" rows="3" placeholder="Nhập lời dặn dò cho con (VD: Con nhớ xếp chăn vuông vắn lại nhé...)"></textarea>
        </div>

        <button class="btn-primary-action" id="btn-confirm-redo" style="background:#d63031;">
          Gửi Nhắc Nhở & Yêu Cầu Làm Lại
        </button>
      </div>
    </div>
  `;
}

// Render Tabs chính của Bố Mẹ
function renderParentTabs() {
  const pendingCount = getPendingTasks().length;

  return `
    <div class="parent-tabs">
      <button class="ptab-btn ${currentTab === 'pending' ? 'active' : ''}" data-ptab="pending">
        <span style="font-size:1.3rem;">🔔</span>
        <span>Duyệt Việc ${pendingCount > 0 ? `(${pendingCount})` : ''}</span>
      </button>
      <button class="ptab-btn ${currentTab === 'tasks' ? 'active' : ''}" data-ptab="tasks">
        <span style="font-size:1.3rem;">⏰</span>
        <span>Biểu Giờ</span>
      </button>
      <button class="ptab-btn ${currentTab === 'rewards' ? 'active' : ''}" data-ptab="rewards">
        <span style="font-size:1.3rem;">🎁</span>
        <span>Kho Quà</span>
      </button>
      <button class="ptab-btn ${currentTab === 'family' ? 'active' : ''}" data-ptab="family">
        <span style="font-size:1.3rem;">👨‍👩‍👧</span>
        <span>Kết Nối</span>
      </button>
    </div>
  `;
}

export function renderApp() {
  let content = '';
  if (currentTab === 'pending') {
    content = renderPendingQueue();
  } else if (currentTab === 'tasks') {
    content = renderTasksManager();
  } else if (currentTab === 'rewards') {
    content = renderRewardsManager();
  } else if (currentTab === 'family') {
    content = `
      <div style="background:#ffffff; border-radius:20px; padding:18px; text-align:center;">
        <h3 style="font-size:1.2rem; font-weight:800; margin-bottom:12px;">Mã Ghép Đôi Gia Đình</h3>
        <p style="font-size:0.9rem; color:#64748b; margin-bottom:16px;">Mở App Bé trên iPad hoặc máy con rồi quét mã này để tự động kết nối!</p>
        ${renderQRCodeSVG(sync.state.familyId || 'SIEUNHI', 200)}
        <div style="margin-top:16px; font-size:1.3rem; font-weight:800; color:#ff5277;">${sync.state.familyId || 'GD-888999'}</div>
      </div>
    `;
  }

  document.getElementById('app-root').innerHTML = `
    <div class="parent-container">
      ${renderParentHeader()}
      ${renderKidSelector()}
      ${renderKidProfileCard()}
      ${renderParentTabs()}
      ${content}
      ${renderPairingModal()}
      ${renderEditKidModal()}
      ${renderAddKidModal()}
      ${renderRedoTaskModal()}
    </div>
  `;

  attachEventHandlers();
}

function attachEventHandlers() {
  // Chọn bé
  document.querySelectorAll('[data-select-kid]').forEach((btn) => {
    btn.onclick = () => {
      playSound('tap');
      activeKidId = btn.dataset.selectKid;
      renderApp();
    };
  });

  // Chuyển tab Bố Mẹ
  document.querySelectorAll('[data-ptab]').forEach((btn) => {
    btn.onclick = () => {
      playSound('tap');
      currentTab = btn.dataset.ptab;
      renderApp();
    };
  });

  // Nút mở modal ghép đôi
  const btnShowFam = document.getElementById('btn-show-family');
  if (btnShowFam) {
    btnShowFam.onclick = () => {
      playSound('tap');
      showPairingModal = true;
      renderApp();
    };
  }
  const btnClosePair = document.getElementById('btn-close-pairing');
  if (btnClosePair) {
    btnClosePair.onclick = () => {
      showPairingModal = false;
      renderApp();
    };
  }

  // Chấm điểm 3 mức
  document.querySelectorAll('[data-grade]').forEach((btn) => {
    btn.onclick = () => {
      const grade = btn.dataset.grade;
      const kidId = btn.dataset.kidId;
      const taskId = btn.dataset.taskId;

      if (grade === 'redo') {
        // Mở popup để bố mẹ gõ lời dặn dò cho con
        redoTaskModal = { kidId, taskId };
        renderApp();
      } else {
        playSound('star');
        sync.gradeTask(kidId, taskId, grade);
        renderApp();
      }
    };
  });

  // Xác nhận làm lại trong modal redo
  const btnConfirmRedo = document.getElementById('btn-confirm-redo');
  if (btnConfirmRedo && redoTaskModal) {
    btnConfirmRedo.onclick = () => {
      const note = document.getElementById('redo-note-text').value.trim();
      playSound('oops');
      sync.gradeTask(redoTaskModal.kidId, redoTaskModal.taskId, 'redo', note);
      redoTaskModal = null;
      renderApp();
    };
  }
  const btnCloseRedo = document.getElementById('btn-close-redo-modal');
  if (btnCloseRedo) {
    btnCloseRedo.onclick = () => {
      redoTaskModal = null;
      renderApp();
    };
  }

  // Duyệt phiếu đổi quà
  document.querySelectorAll('[data-approve-voucher]').forEach((btn) => {
    btn.onclick = () => {
      playSound('cheer');
      const vId = btn.dataset.approveVoucher;
      const kId = btn.dataset.kidId;
      sync.approveVoucher(kId, vId);
      renderApp();
    };
  });

  // Gửi lời nhắn yêu thương
  const btnSendLove = document.getElementById('btn-send-love-note');
  if (btnSendLove) {
    btnSendLove.onclick = () => {
      const input = document.getElementById('input-love-note');
      if (input && input.value.trim()) {
        playSound('tap');
        sync.sendLoveNote(getActiveKid().id, input.value.trim(), 'Bố Mẹ');
        input.value = '';
        alert('Đã gửi lời nhắn thành công! Giọng cô giáo sẽ đọc lời nhắn cho bé nghe.');
      }
    };
  }

  // Mở modal sửa hồ sơ bé
  const btnEditKid = document.getElementById('btn-edit-kid-profile');
  if (btnEditKid) {
    btnEditKid.onclick = () => {
      playSound('tap');
      editingKid = { ...getActiveKid() };
      showEditKidModal = true;
      renderApp();
    };
  }
  const btnCloseEdit = document.getElementById('btn-close-edit-kid');
  if (btnCloseEdit) {
    btnCloseEdit.onclick = () => {
      showEditKidModal = false;
      renderApp();
    };
  }

  // Lưu chỉnh sửa hồ sơ bé
  const btnSaveEdit = document.getElementById('btn-save-edit-kid');
  if (btnSaveEdit) {
    btnSaveEdit.onclick = () => {
      const nickname = document.getElementById('edit-nickname').value.trim();
      const fullName = document.getElementById('edit-fullname').value.trim();
      const age = parseInt(document.getElementById('edit-age').value, 10) || 6;
      const avatar = document.getElementById('edit-avatar').value.trim() || '🐝';
      const stageId = document.getElementById('edit-stage').value;
      const theme = document.getElementById('edit-theme').value;
      const font = document.getElementById('edit-font').value;

      if (!nickname) {
        alert('Vui lòng nhập tên biệt danh của bé!');
        return;
      }

      playSound('tap');
      sync.updateKidProfile(getActiveKid().id, {
        nickname,
        fullName,
        age,
        avatar,
        stageId,
        theme,
        font
      });
      showEditKidModal = false;
      renderApp();
    };
  }

  // Mở modal thêm con
  const btnOpenAddKid = document.getElementById('btn-open-add-kid');
  if (btnOpenAddKid) {
    btnOpenAddKid.onclick = () => {
      playSound('tap');
      showAddKidModal = true;
      renderApp();
    };
  }
  const btnCloseAdd = document.getElementById('btn-close-add-kid');
  if (btnCloseAdd) {
    btnCloseAdd.onclick = () => {
      showAddKidModal = false;
      renderApp();
    };
  }

  // Submit thêm con
  const btnSubmitAdd = document.getElementById('btn-submit-add-kid');
  if (btnSubmitAdd) {
    btnSubmitAdd.onclick = () => {
      const nickname = document.getElementById('add-nickname').value.trim();
      const age = parseInt(document.getElementById('add-age').value, 10) || 6;
      const avatar = document.getElementById('add-avatar').value.trim() || '🦁';

      if (!nickname) {
        alert('Vui lòng nhập tên biệt danh của con!');
        return;
      }

      playSound('star');
      const newKid = newKidProfile({ nickname, age, avatar });
      sync.addKid(newKid);
      activeKidId = newKid.id;
      showAddKidModal = false;
      renderApp();
    };
  }
}

export function initParentApp() {
  sync.role = 'bome';

  // Lắng nghe khi con nộp bài để kêu chuông ting ting
  sync.subscribe('TASK_SUBMITTED', (payload) => {
    playSound('alert');
    renderApp();
  });

  sync.subscribe('REDEEM_REQUESTED', (payload) => {
    playSound('alert');
    renderApp();
  });

  sync.subscribe('stateChange', () => {
    renderApp();
  });

  renderApp();
}

