/* =========================================================
   SIÊU NHÍ TỰ LẬP - CORE DATA & STATE MANAGEMENT
   Dùng chung cho cả App Bé & App Bố Mẹ
   ========================================================= */

export const STORE_KEY = 'sieunhi_v2_data';
export const SYNC_CONFIG_KEY = 'sieunhi_v2_sync';
export const BE_PROFILE_KEY = 'sieunhi_be_active_kid';

// Các mốc lứa tuổi và chủ đề tương ứng
export const AGE_STAGES = {
  MAM_NON: {
    id: 'mam-non',
    label: 'Mầm Non (3 - 6 tuổi)',
    name: 'Mầm Tự Lập',
    sub: 'Đáng yêu, kẹo ngọt, hình vẽ to rõ, giọng cô giáo ngọt ngào',
    defaultTheme: 'candy',
    defaultFont: 'cute',
    expName: 'Ngôi sao',
    expIcon: '⭐',
    minAge: 3, maxAge: 6
  },
  TIEU_HOC: {
    id: 'tieu-hoc',
    label: 'Tiểu Học (7 - 10 tuổi)',
    name: 'Hiệp Sĩ Vũ Trụ',
    sub: 'Năng động, nhiệm vụ game RPG, huy hiệu & cấp độ phiêu lưu',
    defaultTheme: 'galaxy',
    defaultFont: 'dynamic',
    expName: 'Điểm Hiệp Sĩ',
    expIcon: '⚡',
    minAge: 7, maxAge: 10
  },
  TEEN: {
    id: 'teen',
    label: 'Thiếu Niên (11 - 15+ tuổi)',
    name: 'Teen Tự Chủ',
    sub: 'Hiện đại, tối giản, theo dõi mục tiêu cá nhân & thói quen',
    defaultTheme: 'minimal',
    defaultFont: 'modern',
    expName: 'Điểm Năng Suất (XP)',
    expIcon: '🎯',
    minAge: 11, maxAge: 18
  }
};

// Danh sách phông chữ có thể chọn
export const FONT_OPTIONS = [
  { id: 'cute', label: 'Tròn Đáng Yêu (Nunito)', family: "'Nunito', 'Baloo 2', cursive, sans-serif" },
  { id: 'dynamic', label: 'Năng Động Thể Thao (Quicksand)', family: "'Quicksand', 'Be Vietnam Pro', sans-serif" },
  { id: 'modern', label: 'Thanh Lịch Tối Giản (Be Vietnam Pro)', family: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif" }
];

// Danh sách chủ đề màu sắc
export const THEME_OPTIONS = [
  { id: 'candy', label: 'Kẹo Ngọt & Mầm Cây', icon: '🌸', primary: '#ff6b8b', accent: '#48cfad', bg: '#fff5f7' },
  { id: 'galaxy', label: 'Vũ Trụ & Hiệp Sĩ', icon: '🚀', primary: '#5c67f5', accent: '#00d2d3', bg: '#f0f3ff' },
  { id: 'sunshine', label: 'Nắng Mai Vàng Rực', icon: '☀️', primary: '#f39c12', accent: '#2ecc71', bg: '#fffdf0' },
  { id: 'forest', label: 'Rừng Xanh Tươi Mát', icon: '🌿', primary: '#27ae60', accent: '#2980b9', bg: '#f2fbf6' },
  { id: 'minimal', label: 'Tối Giản Hiện Đại (Clean Slate)', icon: '⚡', primary: '#34495e', accent: '#4a69bd', bg: '#f8fafc' },
  { id: 'cyberdark', label: 'Huyền Bí Ban Đêm (Dark Mode)', icon: '🌙', primary: '#a29bfe', accent: '#00cec9', bg: '#1a1d29' }
];

// Hệ thống cấp bậc theo sao/điểm
export const LEVELS = [
  { level: 1, minStars: 0, title: 'Mầm Mới Nhú', icon: '🌱' },
  { level: 2, minStars: 15, title: 'Bé Chăm Chỉ', icon: '🌟' },
  { level: 3, minStars: 40, title: 'Hiệp Sĩ Tập Sự', icon: '🛡️' },
  { level: 4, minStars: 80, title: 'Ngôi Sao Tự Lập', icon: '⭐' },
  { level: 5, minStars: 140, title: 'Dũng Sĩ Tự Giác', icon: '⚔️' },
  { level: 6, minStars: 220, title: 'Thủ Lĩnh Thời Gian', icon: '👑' },
  { level: 7, minStars: 320, title: 'Đại Sứ Tự Chủ', icon: '🏆' }
];

export function getKidLevel(totalEarned = 0) {
  let cur = LEVELS[0];
  let next = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i++) {
    if (totalEarned >= LEVELS[i].minStars) {
      cur = LEVELS[i];
      next = LEVELS[i + 1] || null;
    } else {
      break;
    }
  }
  const prevMin = cur.minStars;
  const nextMin = next ? next.minStars : cur.minStars + 100;
  const progress = next ? Math.min(100, Math.max(0, Math.round(((totalEarned - prevMin) / (nextMin - prevMin)) * 100))) : 100;
  return { ...cur, next, progress, neededNext: next ? (next.minStars - totalEarned) : 0 };
}

// Xác định nhóm tuổi dựa trên số tuổi
export function getStageByAge(age) {
  const num = parseInt(age, 10);
  if (!num || num <= 6) return AGE_STAGES.MAM_NON;
  if (num <= 10) return AGE_STAGES.TIEU_HOC;
  return AGE_STAGES.TEEN;
}

// Tiêu chí hướng dẫn chi tiết từng đầu việc
export const DEFAULT_CRITERIA = {
  t1: '1. Gấp chăn vuông vắn.\n2. Xếp gối ngay ngắn đầu giường.\n3. Kéo phẳng ga giường sạch sẽ.',
  t2: '1. Rửa mặt sạch và lau khô.\n2. Lấy kem đánh răng vừa đủ bằng hạt đậu.\n3. Đánh răng đủ 2 phút cả hàm trên và dưới.',
  t3: '1. Mặc đúng đồng phục hôm nay.\n2. Cài cúc áo thẳng hàng từ trên xuống.\n3. Đi tất và chuẩn bị giày sẵn sàng.',
  t4: '1. Tự ngồi vào bàn ăn vui vẻ.\n2. Tập trung ăn, không dùng điện thoại hay xem TV.\n3. Ăn xong tự bê bát đĩa để vào bồn rửa.',
  t5: '1. Kiểm tra sách vở theo thời khóa biểu hôm nay.\n2. Mang bình nước cá nhân đã đổ đầy.\n3. Đội mũ và đi giày gọn gàng.',
  t6: '1. Đi học về cất giày dép lên kệ ngay ngắn.\n2. Cởi đồng phục treo lên móc hoặc bỏ chậu giặt.\n3. Rửa tay xà phòng sạch sẽ trước khi chạm vào đồ đạc.',
  t7: '1. Ngồi vào bàn học đúng tư thế, lưng thẳng.\n2. Làm hết bài cô giáo giao trên lớp.\n3. Soát lại bài và xếp sách vở vào cặp cho ngày mai.',
  t8: '1. Cất dọn đồ chơi sau khi chơi xong.\n2. Giúp bố mẹ lau bàn ăn hoặc quét nhà.\n3. Vứt rác đúng nơi quy định.',
  t9: '1. Tắm gội sạch sẽ, tự lau khô người.\n2. Thay quần áo ngủ sạch sẽ.\n3. Bỏ quần áo bẩn vào đúng chậu giặt.',
  t10: '1. Tắt hết đèn học và tivi trước khi vào giường.\n2. Đọc 1 mẩu truyện ngắn bổ ích cùng bố mẹ.\n3. Chúc bố mẹ ngủ ngon và đi ngủ đúng giờ.'
};

// Danh mục thời gian biểu mặc định
export const DEFAULT_TASKS = [
  // --- BUỔI SÁNG ---
  {
    id: 't1', title: 'Gấp chăn gối gọn gàng', time: '06:15', session: 'morning',
    stars: 1, icon: '🛏️', note: 'Gấp chăn vuông vắn, xếp gối ngay ngắn',
    applySchool: true, applyWeekend: true, criteria: DEFAULT_CRITERIA.t1
  },
  {
    id: 't2', title: 'Vệ sinh cá nhân, đánh răng', time: '06:25', session: 'morning',
    stars: 1, icon: '🪥', note: 'Đánh răng 2 phút, rửa mặt tỉnh táo',
    applySchool: true, applyWeekend: true, criteria: DEFAULT_CRITERIA.t2
  },
  {
    id: 't3', title: 'Tự thay đồng phục & đi tất', time: '06:35', session: 'morning',
    stars: 1, icon: '👕', note: 'Tự mặc quần áo chỉnh tề, cài cúc thẳng hàng',
    applySchool: true, applyWeekend: false, criteria: DEFAULT_CRITERIA.t3
  },
  {
    id: 't4', title: 'Ăn sáng tập trung 20 phút', time: '06:45', session: 'morning',
    stars: 2, icon: '🥣', note: 'Ngồi ngay ngắn, không xem tivi/điện thoại',
    applySchool: true, applyWeekend: true, criteria: DEFAULT_CRITERIA.t4
  },
  {
    id: 't5', title: 'Soát cặp sách, bình nước, đi giày', time: '07:05', session: 'morning',
    stars: 1, icon: '🎒', note: 'Kiểm tra sách vở, bình nước trước khi đi',
    applySchool: true, applyWeekend: false, criteria: DEFAULT_CRITERIA.t5
  },

  // --- BUỔI CHIỀU VỀ ---
  {
    id: 't6', title: 'Cất giày, treo balo, rửa tay', time: '17:00', session: 'afternoon',
    stars: 1, icon: '👟', note: 'Để giày lên kệ, cởi tất, rửa tay xà phòng',
    applySchool: true, applyWeekend: true, criteria: DEFAULT_CRITERIA.t6
  },
  {
    id: 't7', title: 'Tự giác hoàn thành bài tập về nhà', time: '17:30', session: 'afternoon',
    stars: 3, icon: '📚', note: 'Ngồi bàn học nghiêm túc, làm xong soát lại',
    applySchool: true, applyWeekend: false, criteria: DEFAULT_CRITERIA.t7
  },
  {
    id: 't8', title: 'Phụ giúp việc nhà nhỏ (dọn bàn, cất đồ)', time: '18:30', session: 'afternoon',
    stars: 2, icon: '🧹', note: 'Dọn đồ chơi, phụ mẹ dọn cơm hoặc quét nhà',
    applySchool: true, applyWeekend: true, criteria: DEFAULT_CRITERIA.t8
  },

  // --- BUỔI TỐI ---
  {
    id: 't9', title: 'Tắm gội sạch sẽ, thay đồ ngủ', time: '20:00', session: 'evening',
    stars: 1, icon: '🛁', note: 'Tự tắm sạch, bỏ đồ bẩn vào chậu giặt',
    applySchool: true, applyWeekend: true, criteria: DEFAULT_CRITERIA.t9
  },
  {
    id: 't10', title: 'Đọc sách 15 phút & ngủ đúng giờ', time: '21:15', session: 'evening',
    stars: 2, icon: '🌙', note: 'Tắt đèn, lên giường trước 21:30 ngủ ngon',
    applySchool: true, applyWeekend: true, criteria: DEFAULT_CRITERIA.t10
  }
];

// Kho quà giáo dục & trải nghiệm (Không thiên về tiền bạc)
export const DEFAULT_REWARDS = [
  { id: 'r1', title: 'Bố Mẹ đọc truyện cổ tích cùng con trước khi ngủ', cost: 6, icon: '📖', category: 'tinh_than' },
  { id: 'r2', title: 'Được quyền chọn món ngon cho bữa tối gia đình', cost: 10, icon: '🍕', category: 'trai_nghiem' },
  { id: 'r3', title: '30 phút chơi Lego / vẽ tranh tự do cùng Bố', cost: 12, icon: '🎨', category: 'trai_nghiem' },
  { id: 'r4', title: 'Nuôi heo đất tự lập (Bố mẹ thưởng tích lũy)', cost: 18, icon: '🐷', category: 'tiet_kiem' },
  { id: 'r5', title: 'Chuyến đi công viên / thảo cầm viên cuối tuần', cost: 25, icon: '🎡', category: 'ngoai_khoa' },
  { id: 'r6', title: 'Một quyển truyện tranh / sách khám phá yêu thích', cost: 30, icon: '📚', category: 'hoc_tap' }
];

// Ngày lễ Việt Nam cố định
export const VN_FIXED_HOLIDAYS = {
  '01-01': 'Tết Dương Lịch',
  '04-30': 'Giải phóng miền Nam',
  '05-01': 'Quốc tế Lao động',
  '09-02': 'Quốc khánh 2/9'
};

export function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatVietnameseDate(k = todayKey()) {
  const [y, m, d] = k.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  return `${weekdays[dt.getDay()]}, ngày ${d} tháng ${m}`;
}

export function newKidProfile({ nickname = 'Mật Ong', fullName = '', age = 6, birthYear = null, gender = 'female', avatar = '🐝', theme = null, font = null } = {}) {
  const resolvedAge = age || (birthYear ? (new Date().getFullYear() - birthYear) : 6);
  const stage = getStageByAge(resolvedAge);
  return {
    id: 'k_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    nickname: nickname.trim(),
    fullName: fullName.trim(),
    age: resolvedAge,
    birthYear: birthYear || (new Date().getFullYear() - resolvedAge),
    gender,
    avatar: avatar || '🐝',
    stageId: stage.id,
    theme: theme || stage.defaultTheme,
    font: font || stage.defaultFont,
    stars: 0,
    totalEarned: 0,
    streak: 0,
    bestStreak: 0,
    days: {},
    vouchers: [],
    message: null,
    createdAt: Date.now()
  };
}

export function createInitialState() {
  const firstKid = newKidProfile({
    nickname: 'Mật Ong',
    fullName: 'Nguyễn Ngọc Mật Ong',
    age: 6,
    avatar: '🐝'
  });
  return {
    version: 2,
    familyId: 'GD-' + Math.floor(100000 + Math.random() * 900000),
    familyName: 'Gia Đình Siêu Nhí',
    kids: [firstKid],
    activeKidId: firstKid.id,
    tasks: DEFAULT_TASKS,
    rewards: DEFAULT_REWARDS,
    settings: {
      schoolDays: [1, 2, 3, 4, 5],
      vnHolidays: true,
      comboBonus: 2,
      penaltyOnRedo: 1, // Trừ 1 sao khi phải làm lại
      teacherVoice: true
    },
    dayOverrides: {},
    lastRollover: todayKey()
  };
}

