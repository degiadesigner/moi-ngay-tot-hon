/* =========================================================
   SIÊU NHÍ TỰ LẬP - REALTIME SYNC SERVICE
   Đồng bộ 2 chiều tức thì giữa App Bé & App Bố Mẹ
   Không đòi hỏi người dùng cuối phải thao tác kỹ thuật
   ========================================================= */

import { STORE_KEY, createInitialState, todayKey } from './core.js';

class SyncService {
  constructor() {
    this.familyId = null;
    this.role = 'unknown'; // 'be' hoặc 'bome'
    this.channel = null;
    this.listeners = new Set();
    this.state = this.loadLocalState();

    this.initChannel();
    this.initStorageListener();
  }

  loadLocalState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Lỗi đọc dữ liệu local:', e);
    }
    const fresh = createInitialState();
    this.saveLocalState(fresh, false);
    return fresh;
  }

  saveLocalState(newState, broadcast = true) {
    this.state = newState;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.error('Lỗi lưu local storage:', e);
    }
    if (broadcast) {
      this.publish('STATE_UPDATE', { state: newState });
    }
    this.notifyListeners('stateChange', this.state);
  }

  initChannel() {
    if ('BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('sieunhi_family_sync_v2');
      this.channel.onmessage = (event) => {
        this.handleIncomingMessage(event.data);
      };
    }
  }

  initStorageListener() {
    window.addEventListener('storage', (e) => {
      if (e.key === STORE_KEY && e.newValue) {
        try {
          const fresh = JSON.parse(e.newValue);
          this.state = fresh;
          this.notifyListeners('stateChange', this.state);
        } catch (err) {
          // ignore
        }
      }
    });
  }

  handleIncomingMessage(msg) {
    if (!msg || !msg.type) return;

    // Nếu có familyId và không khớp thì bỏ qua (trừ khi là tin nhắn ghép đôi)
    if (this.familyId && msg.familyId && this.familyId !== msg.familyId) {
      return;
    }

    if (msg.type === 'STATE_UPDATE' && msg.payload && msg.payload.state) {
      this.state = msg.payload.state;
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(this.state));
      } catch (e) {}
      this.notifyListeners('stateChange', this.state);
    }

    // Bắn sự kiện cụ thể cho UI xử lý (âm thanh, hiệu ứng, thông báo)
    this.notifyListeners(msg.type, msg.payload);
  }

  publish(type, payload = {}) {
    const msg = {
      type,
      familyId: this.familyId || (this.state && this.state.familyId),
      senderRole: this.role,
      timestamp: Date.now(),
      payload
    };

    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch (e) {
        console.warn('Lỗi gửi tin qua BroadcastChannel:', e);
      }
    }
  }

  subscribe(event, callback) {
    this.listeners.add({ event, callback });
    return () => {
      this.listeners.delete({ event, callback });
    };
  }

  notifyListeners(event, data) {
    this.listeners.forEach((item) => {
      if (item.event === event || item.event === '*') {
        try {
          item.callback(data);
        } catch (e) {
          console.error(`Lỗi listener sự kiện ${event}:`, e);
        }
      }
    });
  }

  // --- HÀNH ĐỘNG DÀNH CHO BÉ ---
  submitTask(kidId, taskId) {
    const dateKey = todayKey();
    const kid = this.state.kids.find((k) => k.id === kidId);
    if (!kid) return;

    if (!kid.days[dateKey]) {
      kid.days[dateKey] = { tasks: {}, notes: {} };
    }
    kid.days[dateKey].tasks = kid.days[dateKey].tasks || {};
    
    // Đánh dấu là đã nộp bài, chờ bố mẹ duyệt
    kid.days[dateKey].tasks[taskId] = {
      status: 'pending',
      submittedAt: Date.now()
    };

    this.saveLocalState(this.state, true);
    this.publish('TASK_SUBMITTED', { kidId, taskId, dateKey, kidName: kid.nickname });
  }

  requestRedeem(kidId, rewardId) {
    const kid = this.state.kids.find((k) => k.id === kidId);
    const reward = this.state.rewards.find((r) => r.id === rewardId);
    if (!kid || !reward) return false;

    if (kid.stars < reward.cost) return false;

    const voucher = {
      id: 'v_' + Date.now().toString(36),
      rewardId: reward.id,
      title: reward.title,
      cost: reward.cost,
      icon: reward.icon,
      status: 'pending',
      requestedAt: Date.now()
    };

    kid.vouchers = kid.vouchers || [];
    kid.vouchers.unshift(voucher);

    this.saveLocalState(this.state, true);
    this.publish('REDEEM_REQUESTED', { kidId, voucher, kidName: kid.nickname });
    return true;
  }

  // --- HÀNH ĐỘNG DÀNH CHO BỐ MẸ ---
  gradeTask(kidId, taskId, gradeType, note = '') {
    // gradeType: 'great' (+3⭐), 'ok' (+2⭐), 'redo' (-1⭐ & làm lại)
    const dateKey = todayKey();
    const kid = this.state.kids.find((k) => k.id === kidId);
    const task = this.state.tasks.find((t) => t.id === taskId);
    if (!kid || !task) return;

    if (!kid.days[dateKey]) {
      kid.days[dateKey] = { tasks: {}, notes: {} };
    }
    const dayData = kid.days[dateKey];
    dayData.tasks = dayData.tasks || {};

    let starsEarned = 0;
    if (gradeType === 'great') {
      starsEarned = (task.stars || 1) + 1; // Thưởng thêm 1 sao cho xuất sắc
      dayData.tasks[taskId] = {
        status: 'approved',
        grade: 'great',
        starsAwarded: starsEarned,
        approvedAt: Date.now(),
        note
      };
      kid.stars += starsEarned;
      kid.totalEarned += starsEarned;
    } else if (gradeType === 'ok') {
      starsEarned = task.stars || 1;
      dayData.tasks[taskId] = {
        status: 'approved',
        grade: 'ok',
        starsAwarded: starsEarned,
        approvedAt: Date.now(),
        note
      };
      kid.stars += starsEarned;
      kid.totalEarned += starsEarned;
    } else if (gradeType === 'redo') {
      // Phạt trừ 1 sao và yêu cầu làm lại
      const penalty = this.state.settings.penaltyOnRedo || 1;
      kid.stars = Math.max(0, kid.stars - penalty);
      dayData.tasks[taskId] = {
        status: 'redo',
        penalty,
        note,
        flaggedAt: Date.now()
      };
    }

    // Cập nhật chuỗi ngày tự lập nếu hoàn thành tốt
    this.saveLocalState(this.state, true);
    this.publish('TASK_GRADED', {
      kidId,
      taskId,
      taskTitle: task.title,
      gradeType,
      starsEarned,
      note,
      currentStars: kid.stars,
      kidName: kid.nickname
    });
  }

  approveVoucher(kidId, voucherId) {
    const kid = this.state.kids.find((k) => k.id === kidId);
    if (!kid || !kid.vouchers) return;

    const v = kid.vouchers.find((x) => x.id === voucherId);
    if (!v || v.status !== 'pending') return;

    if (kid.stars >= v.cost) {
      kid.stars -= v.cost;
      v.status = 'approved';
      v.approvedAt = Date.now();

      this.saveLocalState(this.state, true);
      this.publish('REDEEM_APPROVED', { kidId, voucher: v, kidName: kid.nickname });
    }
  }

  sendLoveNote(kidId, text, sender = 'Bố Mẹ') {
    const kid = this.state.kids.find((k) => k.id === kidId);
    if (!kid) return;

    kid.message = {
      id: 'msg_' + Date.now(),
      sender,
      text: text.trim(),
      sentAt: Date.now(),
      read: false
    };

    this.saveLocalState(this.state, true);
    this.publish('LOVE_NOTE_SENT', { kidId, message: kid.message, kidName: kid.nickname });
  }

  updateKidProfile(kidId, updates) {
    const kidIndex = this.state.kids.findIndex((k) => k.id === kidId);
    if (kidIndex === -1) return;

    this.state.kids[kidIndex] = { ...this.state.kids[kidIndex], ...updates };
    this.saveLocalState(this.state, true);
    this.publish('PROFILE_UPDATED', { kidId, kid: this.state.kids[kidIndex] });
  }

  addKid(kidData) {
    this.state.kids.push(kidData);
    this.saveLocalState(this.state, true);
    this.publish('KID_ADDED', { kid: kidData });
  }
}

export const sync = new SyncService();

