/* =========================================================
   SIÊU NHÍ TỰ LẬP - VOICE & SOUND SERVICE
   Giọng đọc cô giáo tiếng Việt truyền cảm + Hiệu ứng âm thanh offline
   ========================================================= */

let audioCtx = null;

export function playSound(type = 'tap') {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;
    const seq = {
      tap: [[880, 0, 'sine', 0.05]],
      check: [[523, 0, 'triangle', 0.12], [659, 0.06, 'triangle', 0.12], [784, 0.12, 'triangle', 0.15]],
      star: [[659, 0, 'sine', 0.12], [784, 0.07, 'sine', 0.14], [988, 0.14, 'sine', 0.16], [1319, 0.21, 'sine', 0.2]],
      cheer: [[523, 0, 'sine', 0.1], [659, 0.08, 'sine', 0.12], [784, 0.16, 'sine', 0.14], [1047, 0.24, 'sine', 0.16], [1319, 0.32, 'sine', 0.22]],
      oops: [[440, 0, 'sawtooth', 0.12], [349, 0.15, 'sawtooth', 0.15]],
      alert: [[440, 0, 'sine', 0.15], [554, 0.12, 'sine', 0.15], [440, 0.24, 'sine', 0.15]],
      levelup: [[440, 0, 'sine', 0.12], [554, 0.08, 'sine', 0.14], [659, 0.16, 'sine', 0.16], [880, 0.24, 'sine', 0.22]]
    }[type] || [[880, 0, 'sine', 0.05]];

    seq.forEach(([freq, delay, wave, vol]) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, now + delay);
      gain.setValueAtTime(vol, now + delay);
      gain.exponentialRampToValueAtTime(0.001, now + delay + 0.28);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.3);
    });
  } catch (e) {
    // ignore
  }
}

// Lấy danh sách giọng đọc tiếng Việt
export function getVietnameseVoices() {
  if (!('speechSynthesis' in window)) return [];
  try {
    return speechSynthesis.getVoices().filter(v => /^vi([-_]|$)/i.test(v.lang));
  } catch (e) {
    return [];
  }
}

function scoreVoice(v) {
  let s = 0;
  if (/ho[aà]i\s*my/i.test(v.name)) s += 100; // Microsoft Hoài My (Edge) - cực ngọt ngào
  if (/linh/i.test(v.name)) s += 90; // Linh (Apple iOS/iPadOS/macOS)
  if (/natural|online|neural|premium/i.test(v.name)) s += 30;
  if (/female|nữ/i.test(v.name)) s += 15;
  if (/nam\s*minh|\bmale\b/i.test(v.name)) s -= 50;
  return s;
}

export function pickBestVietnameseVoice() {
  const list = getVietnameseVoices();
  if (!list.length) return null;
  return list.slice().sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
}

export function speak(text, stageId = 'mam-non') {
  if (!('speechSynthesis' in window)) return false;
  try {
    const voice = pickBestVietnameseVoice();
    if (!voice) return false;

    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice.lang;

    // Điều chỉnh cao độ và tốc độ theo lứa tuổi
    if (stageId === 'mam-non') {
      u.rate = 0.88; // Chậm rãi, ngọt ngào cho bé nhỏ
      u.pitch = 1.18; // Cao nhẹ, dễ thương
    } else if (stageId === 'tieu-hoc') {
      u.rate = 0.95; // Năng động, vui tươi
      u.pitch = 1.05;
    } else {
      u.rate = 1.0;  // Điềm đạm, tự nhiên
      u.pitch = 1.0;
    }

    speechSynthesis.speak(u);
    return true;
  } catch (e) {
    return false;
  }
}

// Nội dung lời nói tùy chỉnh theo Biệt danh và Lứa tuổi
export function getVoiceMessage(type, kid, data = {}) {
  const name = kid ? (kid.nickname || 'con yêu') : 'con yêu';
  const stage = kid ? kid.stageId : 'mam-non';

  if (stage === 'mam-non') {
    switch (type) {
      case 'welcome':
        return `Chào ${name} yêu quý! Chúc con một ngày tự lập thật ngoan và vui vẻ nhé!`;
      case 'taskPrompt':
        return `${name} ơi, mình cùng làm việc ${data.title} nhé! ${data.criteria ? 'Con nhớ: ' + data.criteria.replace(/\n/g, ', ') : ''} Cô Sao tin con làm được!`;
      case 'doneSubmit':
        return `Hoan hô ${name} giỏi lắm! Con đợi bố mẹ kiểm tra để nhận sao nhé!`;
      case 'approved':
        return `Ôi tuyệt vời quá! Bố mẹ vừa khen việc ${data.title} của ${name} xuất sắc nè! Tặng con ${data.award || 2} ngôi sao!`;
      case 'redo':
        return `${name} ơi, bố mẹ nhắc con làm lại việc ${data.title} cho thật sạch sẽ nhé. ${data.note ? 'Lời nhắn: ' + data.note : ''} Cố lên nào bé yêu!`;
      case 'redeem':
        return `Chúc mừng ${name} đã đổi được ${data.title}! Con chăm chỉ tích sao thật là giỏi!`;
      default:
        return `${name} ơi, cố gắng lên nhé!`;
    }
  } else if (stage === 'tieu-hoc') {
    switch (type) {
      case 'welcome':
        return `Chào Hiệp sĩ ${name}! Sẵn sàng hoàn thành các nhiệm vụ hôm nay để thăng cấp nhé!`;
      case 'taskPrompt':
        return `Nhiệm vụ tiếp theo của ${name}: ${data.title}. ${data.criteria ? 'Yêu cầu: ' + data.criteria.replace(/\n/g, ', ') : ''} Hãy hoàn thành thật nhanh gọn nào!`;
      case 'doneSubmit':
        return `Xuất sắc! ${name} đã nộp nhiệm vụ. Đang gửi tín hiệu về trạm chỉ huy của bố mẹ!`;
      case 'approved':
        return `Nhiệm vụ ${data.title} đã được phê duyệt! Cộng thêm ${data.award || 2} điểm kinh nghiệm cho hiệp sĩ ${name}!`;
      case 'redo':
        return `Chú ý hiệp sĩ ${name}: Việc ${data.title} cần được hoàn thiện lại cho chuẩn xác. ${data.note ? 'Nhắc nhở: ' + data.note : ''}`;
      case 'redeem':
        return `Tuyệt đỉnh! ${name} đã mở khóa thành công phần thưởng ${data.title}!`;
      default:
        return `Cố gắng lên nhé ${name}!`;
    }
  } else {
    // Teen
    switch (type) {
      case 'welcome':
        return `Chào ${name}. Chúc bạn một ngày làm việc tự chủ và hiệu quả!`;
      case 'taskPrompt':
        return `Mục tiêu hiện tại: ${data.title}. ${data.criteria ? 'Tiêu chí: ' + data.criteria.replace(/\n/g, ', ') : ''}`;
      case 'doneSubmit':
        return `Đã ghi nhận hoàn thành mục tiêu. Thông báo đã được gửi đến phụ huynh.`;
      case 'approved':
        return `Mục tiêu ${data.title} đã được duyệt. Bạn được cộng ${data.award || 2} điểm tích lũy.`;
      case 'redo':
        return `Mục tiêu ${data.title} cần làm lại. ${data.note ? 'Ghi chú: ' + data.note : ''}`;
      case 'redeem':
        return `Bạn đã đổi thành công phần thưởng ${data.title}.`;
      default:
        return `Tiếp tục phát huy nhé ${name}!`;
    }
  }
}

