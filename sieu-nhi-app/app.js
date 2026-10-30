/* =========================================================
   SIÊU NHÍ TỰ LẬP – Thời gian biểu tự lập cho bé
   PWA thuần JS, không cần cài đặt, dữ liệu lưu trên máy.
   ========================================================= */
(() => {
'use strict';

const STORE_KEY = 'sieunhi_tulap_v1';
const SESSIONS = ['morning', 'afternoon', 'evening'];
const SESSION_META = {
  morning:   { label: 'Buổi sáng', short: 'Sáng',  icon: '🌅', cls: 'sun' },
  afternoon: { label: 'Chiều về',  short: 'Chiều', icon: '🌤️', cls: 'sky' },
  evening:   { label: 'Buổi tối',  short: 'Tối',   icon: '🌙', cls: 'primary' }
};
const DAY_TYPES = {
  school:  { label: 'Ngày đi học', icon: '🎒' },
  weekend: { label: 'Ngày nghỉ',   icon: '🎡' },
  both:    { label: 'Mọi ngày',    icon: '📅' }
};
const WEEKDAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
const WD_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const KID_AVATARS = ['av_corgi','av_bunny','av_kitty','av_panda','av_bear','av_unicorn','av_astro','av_hero','av_wizard','av_knight','av_lion','av_dragon','av_cyber','av_music','av_gamer','av_bolt','av_crown','av_diamond'];
const KID_COLORS = ['#ffe3a3','#ffc9d4','#dcd2ff','#c8e6ff','#c4f2dd','#ffd8bd','#e2e8f0','#fef08a'];
const PARENT_AVATARS = ['👩','👨','👵','👴','🧑','👩‍🦱','👨‍🦱','👱‍♀️','🕴️','👩‍💼','👨‍💼'];

/* ================== HỆ THỐNG ICON & AVATAR SVG 3D/GRADIENT ĐỘC QUYỀN ================== */
const UI_SVG = {
  logo: `<svg viewBox="0 0 64 64" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lg_star" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#FFF6B7"/><stop offset="45%" stop-color="#FFD026"/><stop offset="100%" stop-color="#FF7A00"/>
      </linearGradient>
      <filter id="f_glow" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#8A2500" flood-opacity="0.32"/>
      </filter>
    </defs>
    <circle cx="32" cy="32" r="26" fill="url(#lg_star)" opacity="0.18"/>
    <path filter="url(#f_glow)" d="M32 9L38.9 22.9L54.2 25.1L43.1 35.9L45.7 51.2L32 44L18.3 51.2L20.9 35.9L9.8 25.1L25.1 22.9L32 9Z" fill="url(#lg_star)" stroke="#FFF" stroke-width="2" stroke-linejoin="round"/>
    <path d="M32 13L37.2 23.6L48.8 25.3L40.4 33.5L42.4 45L32 39.5V13Z" fill="#FFF" fill-opacity="0.28"/>
    <circle cx="49" cy="15" r="2.5" fill="#FFF"/><circle cx="15" cy="18" r="1.8" fill="#FFF" fill-opacity="0.8"/>
  </svg>`,
  lock: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="lg_lock" x1="4" y1="4" x2="20" y2="22" gradientUnits="userSpaceOnUse"><stop stop-color="#F59E0B"/><stop offset="1" stop-color="#D97706"/></linearGradient></defs>
    <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="#64748B" stroke-width="2.2" stroke-linecap="round"/>
    <rect x="4" y="10" width="16" height="11" rx="3.5" fill="url(#lg_lock)"/>
    <circle cx="12" cy="15.5" r="1.6" fill="#FFF"/>
  </svg>`,
  settings: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="lg_set" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse"><stop stop-color="#6366F1"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs>
    <path d="M12 3.2l1.6 2.1 2.6-.4 1.1 2.4 2.4 1.1-.4 2.6 2.1 1.6-2.1 1.6.4 2.6-2.4 1.1-1.1 2.4-2.6-.4L12 21.8l-1.6-2.1-2.6.4-1.1-2.4-2.4-1.1.4-2.6-2.1-1.6 2.1-1.6-.4-2.6 2.4-1.1 1.1-2.4 2.6.4L12 3.2z" fill="url(#lg_set)"/>
    <circle cx="12" cy="12.5" r="3.5" fill="#FFF"/>
  </svg>`,
  calendar: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4.5" width="18" height="16.5" rx="4" fill="#EEF2FF" stroke="#6366F1" stroke-width="1.8"/>
    <path d="M3 9.5h18" stroke="#6366F1" stroke-width="1.8"/>
    <path d="M8 3v3M16 3v3" stroke="#4F46E5" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="8.5" cy="14" r="1.4" fill="#EC4899"/><circle cx="12" cy="14" r="1.4" fill="#6366F1"/><circle cx="15.5" cy="14" r="1.4" fill="#10B981"/>
  </svg>`,
  star: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="lg_st" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse"><stop stop-color="#FFE047"/><stop offset="1" stop-color="#F59E0B"/></linearGradient></defs>
    <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5z" fill="url(#lg_st)" stroke="#D97706" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`,
  fire: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="lg_fire" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse"><stop stop-color="#FF922B"/><stop offset="1" stop-color="#F03E3E"/></linearGradient></defs>
    <path d="M12.5 2.5C12.5 2.5 19 7.2 19 13.5a7 7 0 1 1-14 0c0-3.2 2-6 3.5-7.3 0 2.2 1.5 3.3 1.5 3.3s-.5-4.2 2.5-7z" fill="url(#lg_fire)"/>
    <path d="M12 11.5c1.5 1.5 2.5 3 2.5 4.8a2.5 2.5 0 0 1-5 0c0-1.5.8-3 2.5-4.8z" fill="#FFE066"/>
  </svg>`,
  ageBadge: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="lg_age" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse"><stop stop-color="#10B981"/><stop offset="1" stop-color="#059669"/></linearGradient></defs>
    <path d="M12 2.5L14.8 5h3.7v3.7L21 11.5l-2.5 2.8V18h-3.7L12 20.5 9.2 18H5.5v-3.7L3 11.5 5.5 8.7V5h3.7L12 2.5z" fill="url(#lg_age)"/>
    <path d="M9 12l2 2 4-4" stroke="#FFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  home: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 10.8L12 3.5l8.5 7.3v8.2a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-8.2z" fill="#EEF2FF" stroke="#6366F1" stroke-width="2" stroke-linejoin="round"/>
    <rect x="9.5" y="13.5" width="5" height="7.5" rx="1.5" fill="#6366F1"/>
  </svg>`,
  speaker: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 5L6 9H3v6h3l5 4V5z" fill="#6366F1"/>
    <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="#6366F1" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`,
  installApp: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="2.5" width="12" height="19" rx="3" fill="#EEF2FF" stroke="#4F46E5" stroke-width="2"/>
    <path d="M12 7.5v6m0 0l-2.5-2.5M12 13.5l2.5-2.5" stroke="#EC4899" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="12" cy="18" r="1" fill="#4F46E5"/>
  </svg>`,
  palette: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3a9 9 0 0 0-9 9c0 5 4 9 9 9 1.7 0 3-1.3 3-3 0-.8-.3-1.5-.8-2-.5-.5-.8-1.1-.8-1.8 0-1.5 1.2-2.7 2.7-2.7H18a3 3 0 0 0 3-3c0-3.3-4-5.5-9-5.5z" fill="#FCE7F3" stroke="#EC4899" stroke-width="1.8"/>
    <circle cx="8" cy="10" r="1.5" fill="#F59E0B"/><circle cx="12" cy="7.5" r="1.5" fill="#6366F1"/><circle cx="16" cy="9.5" r="1.5" fill="#10B981"/><circle cx="8.5" cy="14.5" r="1.5" fill="#EC4899"/>
  </svg>`,
  typography: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="3.5" width="19" height="17" rx="4" fill="#EEF2FF" stroke="#6366F1" stroke-width="1.8"/>
    <path d="M6.5 16L9.8 7.5L13 16M7.6 13.5h4.3M15.2 11.5a2.2 2.2 0 0 1 4 1.2V16m0-2.2h-2.2a1.5 1.5 0 0 0 0 3h2.2" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  copyright: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="lg_sh" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse"><stop stop-color="#FBBF24"/><stop offset="1" stop-color="#D97706"/></linearGradient></defs>
    <path d="M12 2.5L4.5 5.8v5.5c0 5 3.2 9.6 7.5 11.2 4.3-1.6 7.5-6.2 7.5-11.2V5.8L12 2.5z" fill="url(#lg_sh)"/>
    <path d="M14.2 9.8a3.2 3.2 0 1 0 0 4.4" stroke="#FFF" stroke-width="2.3" stroke-linecap="round"/>
  </svg>`,
  tabTasks: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="3" width="16" height="18" rx="3.5" fill="#EEF2FF" stroke="currentColor" stroke-width="2"/>
    <path d="M8 9.5l2 2 4.5-4.5M8 15.5h8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  tabShop: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3.5" y="10" width="17" height="10.5" rx="2.5" fill="#FCE7F3" stroke="currentColor" stroke-width="2"/>
    <rect x="2.5" y="6.5" width="19" height="4" rx="1.5" fill="#FBCFE8" stroke="currentColor" stroke-width="2"/>
    <path d="M12 6.5v14M12 6.5c-1.5-2.8-5-2.8-5-.5S10 6.5 12 6.5zm0 0c1.5-2.8 5-2.8 5-.5S14 6.5 12 6.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  tabStats: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 4h10v6a5 5 0 0 1-10 0V4z" fill="#FEF3C7" stroke="currentColor" stroke-width="2"/>
    <path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 15v5M8.5 20h7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  tabApprove: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.8L4.8 6v5.3c0 4.8 3.1 9.2 7.2 10.7 4.1-1.5 7.2-5.9 7.2-10.7V6L12 2.8z" fill="#D1FAE5" stroke="currentColor" stroke-width="2"/>
    <path d="M8.5 12.2l2.3 2.3 4.8-4.8" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  tabFamily: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="8" r="3.2" fill="#E0E7FF" stroke="currentColor" stroke-width="2"/>
    <circle cx="16.5" cy="9.5" r="2.5" fill="#FCE7F3" stroke="currentColor" stroke-width="1.8"/>
    <path d="M3.5 19c0-3 2.5-5.2 5.5-5.2s5.5 2.2 5.5 5.2M14 19c.3-2.2 1.8-3.8 4-3.8 1.5 0 2.8.8 3.5 2.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`
};

function svgIcon(name) {
  return UI_SVG[name] || '';
}

/* --- BỘ AVATAR VECTOR NGHỆ THUẬT ĐA ĐỘ TUỔI (MẦM NON -> TIỂU HỌC -> TEEN -> TRƯỞNG THÀNH) --- */
const SVG_AVATARS = {
  // 1. MẦM NON (2-6t): Chibi 3D Vector Đáng Yêu
  av_corgi: {
    label: 'Cún Corgi',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="c_bg" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse"><stop stop-color="#FFF3BF"/><stop offset="1" stop-color="#FFD8A8"/></linearGradient></defs>
      <circle cx="40" cy="40" r="38" fill="url(#c_bg)"/>
      <path d="M16 16L22 38L34 26Z" fill="#E67700" stroke="#5C3C10" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M64 16L58 38L46 26Z" fill="#E67700" stroke="#5C3C10" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="40" cy="45" rx="23" ry="20" fill="#F59F00" stroke="#5C3C10" stroke-width="2.5"/>
      <path d="M40 27C35 37 26 42 26 51C26 58 32 63 40 63C48 63 54 58 54 51C54 42 45 37 40 27Z" fill="#FFF"/>
      <circle cx="31" cy="42" r="3.4" fill="#2B1B0E"/><circle cx="30" cy="40.8" r="1.1" fill="#FFF"/>
      <circle cx="49" cy="42" r="3.4" fill="#2B1B0E"/><circle cx="48" cy="40.8" r="1.1" fill="#FFF"/>
      <ellipse cx="25" cy="48" rx="3.5" ry="2" fill="#FF8787" opacity="0.65"/>
      <ellipse cx="55" cy="48" rx="3.5" ry="2" fill="#FF8787" opacity="0.65"/>
      <ellipse cx="40" cy="48" rx="4.2" ry="3" fill="#2B1B0E"/>
      <path d="M36 53Q40 57 44 53" fill="none" stroke="#2B1B0E" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M38 54.5Q40 60 42 54.5" fill="#FF6B6B"/>
    </svg>`
  },
  av_bunny: {
    label: 'Thỏ Ngọc',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#FFE3EC"/>
      <rect x="24" y="8" width="11" height="28" rx="5.5" transform="rotate(-10 24 8)" fill="#FFF" stroke="#AD2E56" stroke-width="2.4"/>
      <rect x="27" y="12" width="5" height="19" rx="2.5" transform="rotate(-10 27 12)" fill="#FF85A1"/>
      <rect x="45" y="6" width="11" height="28" rx="5.5" transform="rotate(10 45 6)" fill="#FFF" stroke="#AD2E56" stroke-width="2.4"/>
      <rect x="48" y="10" width="5" height="19" rx="2.5" transform="rotate(10 48 10)" fill="#FF85A1"/>
      <ellipse cx="40" cy="48" rx="22" ry="19" fill="#FFF" stroke="#AD2E56" stroke-width="2.4"/>
      <circle cx="31" cy="45" r="3.3" fill="#3B1A26"/><circle cx="30" cy="43.8" r="1.1" fill="#FFF"/>
      <circle cx="49" cy="45" r="3.3" fill="#3B1A26"/><circle cx="48" cy="43.8" r="1.1" fill="#FFF"/>
      <ellipse cx="25" cy="50" rx="3.8" ry="2.2" fill="#FF85A1" opacity="0.6"/>
      <ellipse cx="55" cy="50" rx="3.8" ry="2.2" fill="#FF85A1" opacity="0.6"/>
      <polygon points="40,48 37,51 43,51" fill="#FF5277"/>
      <path d="M36 53.5Q40 56.5 44 53.5" fill="none" stroke="#AD2E56" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`
  },
  av_kitty: {
    label: 'Mèo Con',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#FFF0F6"/>
      <polygon points="18,20 22,42 36,28" fill="#FFA94D" stroke="#662E1C" stroke-width="2.4" stroke-linejoin="round"/>
      <polygon points="62,20 58,42 44,28" fill="#FFA94D" stroke="#662E1C" stroke-width="2.4" stroke-linejoin="round"/>
      <ellipse cx="40" cy="46" rx="22" ry="19" fill="#FFD8A8" stroke="#662E1C" stroke-width="2.4"/>
      <path d="M35 28v6M40 27v7M45 28v6" stroke="#E8590C" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="31" cy="44" r="3.3" fill="#2B1B0E"/><circle cx="49" cy="44" r="3.3" fill="#2B1B0E"/>
      <polygon points="40,48 37,51 43,51" fill="#FF6B6B"/>
      <path d="M18 46h7M19 50h6M62 46h-7M61 50h-6" stroke="#662E1C" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  },
  av_panda: {
    label: 'Gấu Trúc',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#E6FCF5"/>
      <circle cx="21" cy="24" r="9" fill="#1E293B"/><circle cx="59" cy="24" r="9" fill="#1E293B"/>
      <ellipse cx="40" cy="45" rx="23" ry="20" fill="#FFF" stroke="#1E293B" stroke-width="2.5"/>
      <ellipse cx="30" cy="43" rx="6.5" ry="5" transform="rotate(-15 30 43)" fill="#1E293B"/>
      <ellipse cx="50" cy="43" rx="6.5" ry="5" transform="rotate(15 50 43)" fill="#1E293B"/>
      <circle cx="31" cy="42" r="2" fill="#FFF"/><circle cx="49" cy="42" r="2" fill="#FFF"/>
      <ellipse cx="40" cy="49" rx="3.8" ry="2.6" fill="#1E293B"/>
      <ellipse cx="24" cy="50" rx="3.5" ry="2" fill="#FF8787" opacity="0.65"/>
      <ellipse cx="56" cy="50" rx="3.5" ry="2" fill="#FF8787" opacity="0.65"/>
      <path d="M36 54Q40 57 44 54" fill="none" stroke="#1E293B" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`
  },
  av_bear: {
    label: 'Gấu Nâu',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#FFF4E6"/>
      <circle cx="22" cy="24" r="9" fill="#B45309" stroke="#451A03" stroke-width="2.4"/>
      <circle cx="58" cy="24" r="9" fill="#B45309" stroke="#451A03" stroke-width="2.4"/>
      <ellipse cx="40" cy="45" rx="22" ry="20" fill="#D97706" stroke="#451A03" stroke-width="2.4"/>
      <ellipse cx="40" cy="50" rx="9" ry="7.5" fill="#FEF3C7"/>
      <circle cx="31" cy="41" r="3.2" fill="#451A03"/><circle cx="49" cy="41" r="3.2" fill="#451A03"/>
      <ellipse cx="40" cy="48" rx="4" ry="2.8" fill="#451A03"/>
    </svg>`
  },
  av_unicorn: {
    label: 'Kỳ Lân Sao',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#F3E8FF"/>
      <polygon points="40,7 34,27 46,27" fill="#FBBF24" stroke="#B45309" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="40" cy="47" rx="21" ry="18" fill="#FFF" stroke="#7E22CE" stroke-width="2.4"/>
      <path d="M25 28C28 21 36 21 40 27C44 21 52 21 55 28" fill="#F472B6" stroke="#7E22CE" stroke-width="2"/>
      <circle cx="31" cy="45" r="3.2" fill="#3B0764"/><circle cx="49" cy="45" r="3.2" fill="#3B0764"/>
      <ellipse cx="25" cy="51" rx="3.5" ry="2" fill="#F472B6" opacity="0.6"/>
      <ellipse cx="55" cy="51" rx="3.5" ry="2" fill="#F472B6" opacity="0.6"/>
      <path d="M36 53Q40 56 44 53" fill="none" stroke="#7E22CE" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`
  },

  // 2. TIỂU HỌC (7-11t): Phi Hành Gia, Siêu Anh Hùng, Hiệp Sĩ, Pháp Sư
  av_astro: {
    label: 'Phi Hành Gia',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="as_v" x1="20" y1="24" x2="60" y2="54" gradientUnits="userSpaceOnUse"><stop stop-color="#38BDF8"/><stop offset="0.5" stop-color="#6366F1"/><stop offset="1" stop-color="#1E1B4B"/></linearGradient></defs>
      <circle cx="40" cy="40" r="38" fill="#1E1B4B"/>
      <circle cx="18" cy="20" r="1.5" fill="#FFF"/><circle cx="63" cy="24" r="2" fill="#FDE047"/>
      <circle cx="40" cy="42" r="25" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.5"/>
      <rect x="21" y="27" width="38" height="26" rx="13" fill="url(#as_v)" stroke="#E2E8F0" stroke-width="2"/>
      <path d="M27 33Q35 29 44 33" stroke="#FFF" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
      <circle cx="50" cy="44" r="2.2" fill="#FFF" opacity="0.6"/>
    </svg>`
  },
  av_hero: {
    label: 'Siêu Anh Hùng',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#FEE2E2"/>
      <circle cx="40" cy="43" r="22" fill="#FDE68A" stroke="#78350F" stroke-width="2.4"/>
      <path d="M18 39C24 32 32 33 40 37C48 33 56 32 62 39C60 47 51 49 40 45C29 49 20 47 18 39Z" fill="#EF4444" stroke="#991B1B" stroke-width="2.2"/>
      <ellipse cx="31" cy="40" rx="4" ry="2.5" fill="#FFF"/><ellipse cx="49" cy="40" rx="4" ry="2.5" fill="#FFF"/>
      <polygon points="42,14 35,26 41,26 38,35 47,23 41,23" fill="#FACC15" stroke="#B45309" stroke-width="1.5"/>
      <path d="M35 53Q40 57 45 53" fill="none" stroke="#78350F" stroke-width="2.4" stroke-linecap="round"/>
    </svg>`
  },
  av_wizard: {
    label: 'Pháp Sư Sao',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#EDE9FE"/>
      <circle cx="40" cy="48" r="19" fill="#FFEDD5" stroke="#4C1D95" stroke-width="2.3"/>
      <polygon points="40,6 18,37 62,37" fill="#6D28D9" stroke="#4C1D95" stroke-width="2.3" stroke-linejoin="round"/>
      <ellipse cx="40" cy="37" rx="26" ry="5.5" fill="#7C3AED" stroke="#4C1D95" stroke-width="2.3"/>
      <polygon points="40,18 42,23 47,23 43,26 44.5,31 40,28 35.5,31 37,26 33,23 38,23" fill="#FACC15"/>
      <circle cx="33" cy="48" r="2.8" fill="#1E1B4B"/><circle cx="47" cy="48" r="2.8" fill="#1E1B4B"/>
      <path d="M36 55Q40 58 44 55" fill="none" stroke="#4C1D95" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`
  },
  av_knight: {
    label: 'Hiệp Sĩ',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#DBEAFE"/>
      <path d="M35 10C45 8 55 14 56 24L40 24Z" fill="#EF4444"/>
      <path d="M20 34C20 21 29 15 40 15C51 15 60 21 60 34V54C60 60 50 65 40 65C30 65 20 60 20 54V34Z" fill="#CBD5E1" stroke="#334155" stroke-width="2.5"/>
      <path d="M25 38H55L51 48H29L25 38Z" fill="#1E293B"/>
      <path d="M30 42H37M43 42H50" stroke="#38BDF8" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M40 15V65" stroke="#94A3B8" stroke-width="2"/>
    </svg>`
  },
  av_lion: {
    label: 'Sư Tử Vương',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#FEF3C7"/>
      <circle cx="40" cy="42" r="26" fill="#D97706" stroke="#78350F" stroke-width="2.5" stroke-dasharray="10 4"/>
      <circle cx="40" cy="43" r="18" fill="#FBBF24" stroke="#78350F" stroke-width="2.2"/>
      <circle cx="33" cy="40" r="2.8" fill="#451A03"/><circle cx="47" cy="40" r="2.8" fill="#451A03"/>
      <polygon points="40,45 36.5,48.5 43.5,48.5" fill="#78350F"/>
      <path d="M35 52Q40 55 45 52" fill="none" stroke="#78350F" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`
  },
  av_dragon: {
    label: 'Rồng Xanh',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#D1FAE5"/>
      <polygon points="24,14 29,29 20,27" fill="#F59E0B"/><polygon points="56,14 51,29 60,27" fill="#F59E0B"/>
      <ellipse cx="40" cy="45" rx="21" ry="19" fill="#10B981" stroke="#065F46" stroke-width="2.4"/>
      <circle cx="32" cy="41" r="3" fill="#FEF08A"/><circle cx="32" cy="41" r="1.4" fill="#064E3B"/>
      <circle cx="48" cy="41" r="3" fill="#FEF08A"/><circle cx="48" cy="41" r="1.4" fill="#064E3B"/>
      <circle cx="36" cy="49" r="1.5" fill="#064E3B"/><circle cx="44" cy="49" r="1.5" fill="#064E3B"/>
    </svg>`
  },

  // 3. THIẾU NIÊN / TEEN (12-17t): Hiện đại, Cá tính, Năng lượng
  av_cyber: {
    label: 'Cyber Neon',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="cy_g" x1="14" y1="30" x2="66" y2="48" gradientUnits="userSpaceOnUse"><stop stop-color="#00F5D4"/><stop offset="0.5" stop-color="#00BBF9"/><stop offset="1" stop-color="#F15BB5"/></linearGradient></defs>
      <circle cx="40" cy="40" r="38" fill="#0F172A"/>
      <path d="M20 42C20 27 29 19 40 19C51 19 60 27 60 42C60 54 51 63 40 63C29 63 20 54 20 42Z" fill="#1E293B" stroke="#38BDF8" stroke-width="2.2"/>
      <rect x="17" y="32" width="46" height="14" rx="7" fill="url(#cy_g)"/>
      <path d="M24 36H38" stroke="#FFF" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M34 53H46" stroke="#00F5D4" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`
  },
  av_music: {
    label: 'Studio Pro',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="mu_g" x1="12" y1="12" x2="68" y2="68" gradientUnits="userSpaceOnUse"><stop stop-color="#6366F1"/><stop offset="1" stop-color="#EC4899"/></linearGradient></defs>
      <circle cx="40" cy="40" r="38" fill="url(#mu_g)"/>
      <path d="M22 44V38a18 18 0 0 1 36 0v6" fill="none" stroke="#FFF" stroke-width="5" stroke-linecap="round"/>
      <rect x="16" y="40" width="10" height="18" rx="5" fill="#FFF"/>
      <rect x="54" y="40" width="10" height="18" rx="5" fill="#FFF"/>
      <path d="M33 46v-8l14-4v8" fill="none" stroke="#FDE047" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="31" cy="47" r="3" fill="#FDE047"/><circle cx="45" cy="43" r="3" fill="#FDE047"/>
    </svg>`
  },
  av_gamer: {
    label: 'Thủ Lĩnh Game',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#1E1B4B"/>
      <polygon points="28,22 33,14 40,20 47,14 52,22" fill="#FACC15"/>
      <path d="M18 44c0-8 5-14 13-14h18c8 0 13 6 13 14 0 7-4 14-9 14-3 0-5-3-8-5H35c-3 2-5 5-8 5-5 0-9-7-9-14z" fill="#6366F1" stroke="#A5B4FC" stroke-width="2.2"/>
      <path d="M26 42h8M30 38v8" stroke="#FFF" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="48" cy="40" r="2.2" fill="#F43F5E"/><circle cx="53" cy="44" r="2.2" fill="#10B981"/>
    </svg>`
  },
  av_bolt: {
    label: 'Tia Chớp',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="bo_g" x1="10" y1="10" x2="70" y2="70" gradientUnits="userSpaceOnUse"><stop stop-color="#0EA5E9"/><stop offset="1" stop-color="#1D4ED8"/></linearGradient></defs>
      <circle cx="40" cy="40" r="38" fill="url(#bo_g)"/>
      <polygon points="45,12 22,44 38,44 33,68 58,36 42,36" fill="#FDE047" stroke="#FFF" stroke-width="2" stroke-linejoin="round"/>
    </svg>`
  },
  av_creative: {
    label: 'Sáng Tạo',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#FDF2F8"/>
      <path d="M40 16c-13.2 0-24 9.8-24 22 0 12.2 10 22 22 22 3.5 0 6-2.5 6-5.5 0-1.5-.6-2.8-1.5-3.8-.9-1-1.5-2.1-1.5-3.6 0-2.8 2.2-5 5-5h4c7.7 0 14-5.5 14-12.5C64 21.8 53.2 16 40 16z" fill="#EC4899"/>
      <circle cx="29" cy="34" r="3.5" fill="#FDE047"/><circle cx="38" cy="26" r="3.5" fill="#38BDF8"/><circle cx="49" cy="29" r="3.5" fill="#4ADE80"/><circle cx="29" cy="45" r="3.5" fill="#FFF"/>
    </svg>`
  },
  av_blaze: {
    label: 'Lửa Đỉnh Cao',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#18181B"/>
      <path d="M42 12c0 0 18 11 18 28a20 20 0 1 1-40 0c0-9 5.5-17 10-21 0 6 4 9 4 9s-1.5-10 8-16z" fill="#F97316"/>
      <path d="M40 34c4.5 4.5 7.5 9 7.5 14.5a7.5 7.5 0 0 1-15 0c0-4.5 2.5-9 7.5-14.5z" fill="#FDE047"/>
    </svg>`
  },

  // 4. TRƯỞNG THÀNH (18+t): Đẳng cấp, Sang trọng, Tinh anh
  av_crown: {
    label: 'Vương Miện Vàng',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="cr_g" x1="16" y1="20" x2="64" y2="60" gradientUnits="userSpaceOnUse"><stop stop-color="#FDE047"/><stop offset="1" stop-color="#D97706"/></linearGradient></defs>
      <circle cx="40" cy="40" r="38" fill="#0F172A" stroke="#F59E0B" stroke-width="2"/>
      <path d="M18 54L22 28L34 39L40 22L46 39L58 28L62 54H18Z" fill="url(#cr_g)" stroke="#FEF08A" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="40" cy="18" r="3" fill="#FDE047"/><circle cx="20" cy="24" r="2.5" fill="#FDE047"/><circle cx="60" cy="24" r="2.5" fill="#FDE047"/>
    </svg>`
  },
  av_diamond: {
    label: 'Kim Cương Xanh',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="dm_g" x1="16" y1="18" x2="64" y2="64" gradientUnits="userSpaceOnUse"><stop stop-color="#7DD3FC"/><stop offset="0.5" stop-color="#0284C7"/><stop offset="1" stop-color="#1E3A8A"/></linearGradient></defs>
      <circle cx="40" cy="40" r="38" fill="#0F172A"/>
      <polygon points="26,22 54,22 66,35 40,64 14,35" fill="url(#dm_g)" stroke="#BAE6FD" stroke-width="2" stroke-linejoin="round"/>
      <polyline points="14,35 66,35" stroke="#BAE6FD" stroke-width="1.8"/>
      <polyline points="26,22 33,35 40,64 47,35 54,22" fill="none" stroke="#BAE6FD" stroke-width="1.6"/>
    </svg>`
  },
  av_executive: {
    label: 'Chuyên Gia',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#1E293B"/>
      <circle cx="40" cy="27" r="11" fill="#F8FAFC"/>
      <path d="M18 65c2-14 11-21 22-21s20 7 22 21" fill="#334155" stroke="#94A3B8" stroke-width="2"/>
      <polygon points="40,44 36,52 40,65 44,52" fill="#EF4444"/>
    </svg>`
  },
  av_zen: {
    label: 'Sen Tinh Khiết',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#ECFDF5"/>
      <path d="M40 18C33 28 32 42 40 54C48 42 47 28 40 18Z" fill="#10B981"/>
      <path d="M40 54C28 48 20 36 24 26C32 30 37 40 40 54Z" fill="#34D399"/>
      <path d="M40 54C52 48 60 36 56 26C48 30 43 40 40 54Z" fill="#34D399"/>
      <path d="M16 44C22 54 32 56 40 56C48 56 58 54 64 44C54 44 46 49 40 54C34 49 26 44 16 44Z" fill="#059669"/>
    </svg>`
  },
  av_target: {
    label: 'Đỉnh Mục Tiêu',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#FEF2F2"/>
      <circle cx="40" cy="40" r="26" fill="#EF4444"/><circle cx="40" cy="40" r="18" fill="#FFF"/><circle cx="40" cy="40" r="10" fill="#EF4444"/><circle cx="40" cy="40" r="4" fill="#FDE047"/>
      <path d="M58 22L41 39" stroke="#1E293B" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`
  },
  av_time: {
    label: 'Làm Chủ Giờ',
    svg: `<svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#0F172A"/>
      <circle cx="40" cy="42" r="24" fill="#1E293B" stroke="#F59E0B" stroke-width="3"/>
      <path d="M40 26v16l10 6" fill="none" stroke="#FDE047" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="35" y="11" width="10" height="4" rx="2" fill="#F59E0B"/>
    </svg>`
  }
};

/* Ánh xạ tự động các emoji cũ sang bộ Avatar SVG 3D mới */
const EMOJI_TO_SVG_AVATAR = {
  '🐶': 'av_corgi', '🐱': 'av_kitty', '🐰': 'av_bunny', '🐼': 'av_panda', '🐻': 'av_bear', '🦄': 'av_unicorn',
  '🐥': 'av_corgi', '🦊': 'av_kitty', '🐨': 'av_panda', '🐸': 'av_dragon', '🐷': 'av_bunny', '🐵': 'av_bear',
  '🦸': 'av_hero', '🧙': 'av_wizard', '🧑‍🚀': 'av_astro', '🥷': 'av_knight', '🦁': 'av_lion', '🐯': 'av_lion',
  '🐉': 'av_dragon', '🦅': 'av_hero', '🐬': 'av_astro', '🦖': 'av_dragon', '🚀': 'av_astro', '⚡': 'av_bolt',
  '🎧': 'av_music', '🎸': 'av_music', '🛹': 'av_cyber', '🏀': 'av_blaze', '⚽': 'av_gamer', '🎮': 'av_gamer',
  '💻': 'av_cyber', '🎨': 'av_creative', '📸': 'av_creative', '🔥': 'av_blaze', '💎': 'av_diamond', '🌟': 'av_crown',
  '💼': 'av_executive', '☕': 'av_time', '📚': 'av_executive', '🧘': 'av_zen', '🏃': 'av_target', '🎯': 'av_target',
  '⌚': 'av_time', '🌿': 'av_zen', '✨': 'av_crown', '🏛️': 'av_crown'
};

function resolveAvatarKey(av, age = 6) {
  if (!av) return getAgeGroup(age).avatars[0];
  if (typeof av === 'string' && av.startsWith('data:image/')) return av;
  if (SVG_AVATARS[av]) return av;
  if (EMOJI_TO_SVG_AVATAR[av]) return EMOJI_TO_SVG_AVATAR[av];
  return av;
}

function renderAvatarArt(av, age = 6) {
  const key = resolveAvatarKey(av, age);
  if (typeof key === 'string' && key.startsWith('data:image/')) {
    return `<img src="${key}" alt="avatar" class="avatar-custom-img">`;
  }
  if (SVG_AVATARS[key]) {
    return `<span class="avatar-svg-art">${SVG_AVATARS[key].svg}</span>`;
  }
  return `<span class="avatar-emoji-fallback">${esc(key)}</span>`;
}


/* --- BỘ GIAO DIỆN & KIỂU CHỮ ĐA LỨA TUỔI --- */
const THEMES = {
  candy:     { id: 'candy',     name: 'Kẹo Ngọt',   icon: '🌸', gender: 'girl', desc: 'Hồng phấn & tím pastel dễ thương cho bé gái', primary: '#ff5277', bg: 'linear-gradient(160deg, #fff0f6 0%, #f3e8ff 50%, #ffe4e6 100%)', cardBorder: '#ffc9d8' },
  ocean:     { id: 'ocean',     name: 'Đại Dương', icon: '🌊', gender: 'boy',  desc: 'Xanh biển khám phá dũng cảm cho bé trai',   primary: '#0284c7', bg: 'linear-gradient(160deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)', cardBorder: '#7dd3fc' },
  galaxy:    { id: 'galaxy',    name: 'Vũ Trụ',     icon: '🚀', gender: 'boy',  desc: 'Tím xanh phi hành gia & thám hiểm vũ trụ',  primary: '#6366f1', bg: 'linear-gradient(160deg, #eef2ff 0%, #e0e7ff 50%, #dbeafe 100%)', cardBorder: '#c7d2fe' },
  princess:  { id: 'princess',  name: 'Công Chúa', icon: '👑', gender: 'girl', desc: 'Tím mộng mơ hoàng gia & lấp lánh',          primary: '#9333ea', bg: 'linear-gradient(160deg, #faf5ff 0%, #f3e8ff 50%, #fdf2f8 100%)', cardBorder: '#e9d5ff' },
  superhero: { id: 'superhero', name: 'Chiến Binh', icon: '🦸‍♂️', gender: 'boy',  desc: 'Đỏ & xanh mạnh mẽ, siêu anh hùng bứt phá',   primary: '#dc2626', bg: 'linear-gradient(160deg, #fff1f2 0%, #fee2e2 50%, #e0e7ff 100%)', cardBorder: '#fca5a5' },
  sunshine:  { id: 'sunshine',  name: 'Nắng Mai',   icon: '☀️', gender: 'all',  desc: 'Vàng cam ấm áp, tràn năng lượng tích cực',  primary: '#f59f00', bg: 'linear-gradient(160deg, #fff9db 0%, #fff3bf 50%, #ffe8cc 100%)', cardBorder: '#ffe066' },
  emerald:   { id: 'emerald',   name: 'Rừng Xanh',  icon: '🌿', gender: 'all',  desc: 'Xanh ngọc thanh mát, tập trung học tập',    primary: '#10b981', bg: 'linear-gradient(160deg, #ecfdf5 0%, #d1fae5 50%, #e0f2fe 100%)', cardBorder: '#a7f3d0' },
  cyber:     { id: 'cyber',     name: 'Cá Tính',    icon: '⚡', gender: 'boy',  desc: 'Xanh neon hiện đại cho Gamer & Teen',       primary: '#0ea5e9', bg: 'linear-gradient(160deg, #f0f9ff 0%, #e0f2fe 50%, #ede9fe 100%)', cardBorder: '#bae6fd' },
  luxury:    { id: 'luxury',    name: 'Đẳng Cấp',   icon: '💎', gender: 'all',  desc: 'Tối giản sang trọng, kỷ luật trưởng thành',  primary: '#0f172a', bg: 'linear-gradient(160deg, #f8fafc 0%, #f1f5f9 50%, #fefce8 100%)', cardBorder: '#cbd5e1' }
};
const FONT_STYLES = {
  rounded: { id: 'rounded', name: 'Tròn Đáng Yêu', sample: 'Aa', css: '"Nunito", "Baloo 2", ui-rounded, sans-serif' },
  modern:  { id: 'modern',  name: 'Hiện Đại Gọn',  sample: 'Aa', css: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
  elegant: { id: 'elegant', name: 'Thanh Lịch',    sample: 'Aa', css: '"Georgia", "Palatino Linotype", serif' }
};

/* --- HÌNH TƯỢNG HÓA THEO ĐỘ TUỔI (MẦM NON -> TIỂU HỌC -> TEEN -> TRƯỞNG THÀNH) --- */
const AGE_GROUPS = {
  mamNon: {
    id: 'mamNon', min: 2, max: 6, label: 'Mầm Non (2–6 tuổi)', short: '🌸 Mầm Non',
    prefix: '', defaultTheme: 'candy', defaultFont: 'rounded',
    doneBtn: '✋ Con làm xong rồi!', waitText: '⏳ Chờ Bố Mẹ chấm',
    avatars: ['av_corgi','av_bunny','av_kitty','av_panda','av_bear','av_unicorn'],
    levels: [
      { min: 0,    name: 'Mầm Tự Lập',    icon: '🌱' },
      { min: 150,  name: 'Hoa Chăm Chỉ',  icon: '🌸' },
      { min: 400,  name: 'Cây Ngoan',     icon: '🌳' },
      { min: 800,  name: 'Sao Nhí',       icon: '⭐' },
      { min: 1500, name: 'Thiên Thần Nhỏ',icon: '🧚' },
      { min: 3000, name: 'Siêu Nhí',      icon: '👑' }
    ]
  },
  tieuHoc: {
    id: 'tieuHoc', min: 7, max: 11, label: 'Tiểu Học (7–11 tuổi)', short: '🚀 Tiểu Học',
    prefix: '', defaultTheme: 'sunshine', defaultFont: 'rounded',
    doneBtn: '⚡ Con đã hoàn thành!', waitText: '⏳ Chờ Bố Mẹ duyệt',
    avatars: ['av_astro','av_hero','av_wizard','av_knight','av_lion','av_dragon'],
    levels: [
      { min: 0,    name: 'Tân Binh',       icon: '🛡️' },
      { min: 150,  name: 'Chiến Binh Nhí', icon: '⚔️' },
      { min: 400,  name: 'Hiệp Sĩ Tự Giác',icon: '🦁' },
      { min: 800,  name: 'Phi Hành Gia',   icon: '🚀' },
      { min: 1500, name: 'Siêu Anh Hùng',  icon: '🦸' },
      { min: 3000, name: 'Huyền Thoại',    icon: '👑' }
    ]
  },
  thieuNien: {
    id: 'thieuNien', min: 12, max: 17, label: 'Thiếu Niên / Teen (12–17 tuổi)', short: '⚡ Teen Tự Chủ',
    prefix: '', defaultTheme: 'cyber', defaultFont: 'modern',
    doneBtn: '🔥 Hoàn thành việc này!', waitText: '⏳ Chờ xác nhận',
    avatars: ['av_cyber','av_music','av_gamer','av_bolt','av_creative','av_blaze'],
    levels: [
      { min: 0,    name: 'Khởi Động',      icon: '⚡' },
      { min: 150,  name: 'Tập Trung',      icon: '🎯' },
      { min: 400,  name: 'Bứt Phá',        icon: '🔥' },
      { min: 800,  name: 'Chủ Động',       icon: '🚀' },
      { min: 1500, name: 'Bản Lĩnh',       icon: '💎' },
      { min: 3000, name: 'Đỉnh Cao',       icon: '🏆' }
    ]
  },
  truongThanh: {
    id: 'truongThanh', min: 18, max: 99, label: 'Trưởng Thành (18+ tuổi)', short: '💎 Trưởng Thành',
    prefix: '', defaultTheme: 'luxury', defaultFont: 'modern',
    doneBtn: '✅ Hoàn thành mục tiêu', waitText: '⏳ Đang chờ duyệt',
    avatars: ['av_crown','av_diamond','av_executive','av_zen','av_target','av_time'],
    levels: [
      { min: 0,    name: 'Khởi Đầu Kỷ Luật', icon: '🎯' },
      { min: 150,  name: 'Duy Trì Thói Quen', icon: '⚡' },
      { min: 400,  name: 'Hiệu Suất Cao',     icon: '💼' },
      { min: 800,  name: 'Chuyên Nghiệp',     icon: '💎' },
      { min: 1500, name: 'Tinh Hoa',          icon: '🏛️' },
      { min: 3000, name: 'Làm Chủ Thời Gian', icon: '👑' }
    ]
  }
};

function getAgeGroup(age = 6) {
  const a = Number(age) || 6;
  if (a <= 6) return AGE_GROUPS.mamNon;
  if (a <= 11) return AGE_GROUPS.tieuHoc;
  if (a <= 17) return AGE_GROUPS.thieuNien;
  return AGE_GROUPS.truongThanh;
}
function displayName(kid) {
  return kid ? kid.name : '';
}
function smartAvatarForAge(age, currentAvatar) {
  const grp = getAgeGroup(age);
  if (typeof currentAvatar === 'string' && currentAvatar.startsWith('data:image/')) return currentAvatar;
  const resolved = resolveAvatarKey(currentAvatar, age);
  if (resolved && grp.avatars.includes(resolved)) return resolved;
  if (SVG_AVATARS[resolved]) return resolved;
  return grp.avatars[0];
}
/* Hình tượng hóa cả icon và tên việc cho lứa tuổi lớn (Teen & Trưởng thành) */
const ADULT_TASK_MAP = {
  sm1: { icon: '✨', title: 'Vệ sinh cá nhân & Chăm sóc da', note: 'Sẵn sàng diện mạo tươi tắn' },
  sm2: { icon: '🛏️', title: 'Sắp xếp phòng ngủ gọn gàng', note: 'Không gian ngăn nắp đầu ngày' },
  sm3: { icon: '👔', title: 'Chuẩn bị trang phục chỉnh tề', note: 'Lịch sự, tự tin' },
  sm4: { icon: '☕', title: 'Ăn sáng dinh dưỡng & Điểm tin', note: 'Tập trung nạp năng lượng' },
  sm5: { icon: '💼', title: 'Kiểm tra hành trang & Lịch trình', note: 'Ví, chìa khóa, tài liệu, bình nước' },
  sa1: { icon: '👞', title: 'Cất giày & Túi xách đúng vị trí', note: 'Giữ nhà cửa gọn gàng' },
  sa2: { icon: '🚿', title: 'Thay đồ & Thư giãn ngắn', note: 'Tái tạo năng lượng sau giờ làm/học' },
  sa3: { icon: '🥗', title: 'Bữa phụ lành mạnh', note: 'Bổ sung nước và trái cây' },
  sa4: { icon: '🏡', title: 'Chăm sóc không gian sống', note: 'Dọn dẹp, tưới cây, chia sẻ việc nhà' },
  sa5: { icon: '🏃', title: 'Rèn luyện thể chất 30 phút', note: 'Chạy bộ, Gym, Yoga hoặc thể thao' },
  se1: { icon: '💻', title: 'Học tập / Làm việc chuyên sâu', note: 'Tập trung cao độ (Deep Work)' },
  se2: { icon: '📋', title: 'Lập kế hoạch & Mục tiêu ngày mai', note: 'Rà soát To-do list' },
  se3: { icon: '🛁', title: 'Tắm thư giãn & Chăm sóc bản thân', note: 'Gác lại công việc trong ngày' },
  se4: { icon: '📖', title: 'Đọc sách & Ngủ đúng giờ (Digital Detox)', note: 'Rời xa màn hình trước khi ngủ' },
  wm1: { icon: '🌅', title: 'Thức dậy đúng giờ & Đón nắng sớm', note: 'Duy trì nhịp sinh học cuối tuần' },
  wm3: { icon: '🧘', title: 'Vận động / Thiền định buổi sáng', note: 'Cân bằng thân - tâm - trí' },
  wm4: { icon: '🗂️', title: 'Tổng vệ sinh bàn làm việc & Phòng ở', note: 'Minimalism - gọn gàng, sạch sẽ' },
  wa1: { icon: '📚', title: 'Đọc sách / Phát triển kỹ năng mới', note: '40 phút không mạng xã hội' },
  we1: { icon: '🗓️', title: 'Chuẩn bị tuần mới / Ngày mới', note: 'Trang phục, tài liệu, mục tiêu' },
  we2: { icon: '✍️', title: 'Viết nhật ký biết ơn (3 điều tích cực)', note: 'Chiêm nghiệm cuối ngày' }
};
function taskViewForKid(kid, t) {
  const age = Number(kid && kid.age) || 6;
  if (age >= 12 && ADULT_TASK_MAP[t.id]) {
    return Object.assign({}, t, ADULT_TASK_MAP[t.id]);
  }
  return t;
}

/* --- BẢN QUYỀN THƯƠNG HIỆU MINHTT @2026 --- */
const COPYRIGHT_INFO = {
  brand: 'MinhTT @2026',
  owner: 'MinhTT',
  email: 'truongtuanminh.91@gmail.com',
  year: '2026',
  statement: 'Thời gian biểu & Rèn luyện nếp sống tự lập mỗi ngày.'
};
const TASK_ICONS = ['🪥','🛏️','👕','🥣','🎒','👟','🧼','🍎','🧹','⚽','📚','🗓️','🚿','🌙','☀️','🤸','🧸','🎨','🍳','🚲','💖','💊','🐶','🎹','🌱','🗑️','🍽️','🧺','✍️','🧮','🔤','💧','📵','🙏','🧴','💇','🪴','🧽','📖','🎻','🏊','😴','🥛','🦷','🧦','✨'];
const REWARD_ICONS = ['🌟','📖','🍦','🎲','📺','⏰','🍕','👑','🍿','🧁','🎡','⛺','📘','🎨','🐷','🌱','🧩','🎮','🚲','🏊','🎤','🛝','🍰','🎈','🧸','📷','🎁','🏕️','🦖','🪁'];
const TIERS = {
  1: { label: 'Quà nhỏ xinh',          icon: '🍬', hint: 'Vài ngày cố gắng' },
  2: { label: 'Đặc quyền',             icon: '👑', hint: 'Khoảng 1 tuần' },
  3: { label: 'Trải nghiệm gia đình',  icon: '🎡', hint: '2–3 tuần kiên trì' },
  4: { label: 'Mục tiêu lớn',          icon: '🏆', hint: 'Cả tháng nỗ lực' }
};
const LEVELS = [
  { min: 0,    name: 'Mầm Tự Lập',     icon: '🌱' },
  { min: 150,  name: 'Chồi Chăm Chỉ',  icon: '🌿' },
  { min: 400,  name: 'Cây Ngoan',      icon: '🌳' },
  { min: 800,  name: 'Siêu Nhí',       icon: '⭐' },
  { min: 1500, name: 'Siêu Anh Hùng',  icon: '🦸' },
  { min: 3000, name: 'Huyền Thoại',    icon: '👑' }
];
const VN_FIXED_HOLIDAYS = {
  '01-01': 'Tết Dương lịch', '04-30': 'Lễ 30/4', '05-01': 'Lễ 1/5',
  '09-01': 'Nghỉ Quốc khánh', '09-02': 'Quốc khánh 2/9'
};
// Ngày dương lịch của mùng 1 Tết và Giỗ Tổ (10/3 âm lịch)
const VN_LUNAR = {
  tet:   ['2025-01-29', '2026-02-17', '2027-02-06', '2028-01-26', '2029-02-13', '2030-02-03'],
  gioTo: ['2025-04-07', '2026-04-26', '2027-04-16', '2028-04-04', '2029-04-23', '2030-04-12']
};
const PRAISE_REASONS = ['Tự giác không cần nhắc', 'Giúp đỡ ông bà, bố mẹ', 'Nhường nhịn, chia sẻ với em/bạn', 'Dũng cảm thử việc mới', 'Được cô giáo khen', 'Nói lời cảm ơn, xin lỗi'];
const WARN_REASONS = ['Để bố mẹ nhắc quá 3 lần', 'Làm ẩu mà báo xong', 'Cãi lời, nói hỗn', 'Nói dối', 'Xem màn hình quá giờ', 'Tranh giành, đánh nhau'];
const REJECT_REASONS = ['Chưa sạch / chưa gọn', 'Làm vội, chưa kỹ', 'Chưa làm thật', 'Chưa đúng giờ'];

const T = (id, dayType, session, icon, title, note, time, stars, penalty = 1, heavy = false) =>
  ({ id, dayType, session, icon, title, note, time, stars, penalty, heavy, kidIds: [], active: true });

const DEFAULT_TASKS = [
  T('sm1','school','morning','🪥','Đánh răng & rửa mặt','Chải răng đủ 2 phút','06:15',1),
  T('sm2','school','morning','🛏️','Gấp chăn gối gọn gàng','Xếp chăn gối ngay ngắn','06:20',1),
  T('sm3','school','morning','👕','Tự thay đồng phục','Tự mặc, tự cài cúc','06:30',1),
  T('sm4','school','morning','🥣','Ăn sáng trong 20 phút','Ngồi ăn tập trung, không xem TV','06:40',2),
  T('sm5','school','morning','🎒','Đeo cặp, bình nước, đi giày','Kiểm tra đủ đồ trước khi đi','06:55',2),
  T('sa1','school','afternoon','👟','Cất giày, treo cặp','Để đúng chỗ ngay khi về','16:45',1),
  T('sa2','school','afternoon','🧼','Rửa tay & thay đồ','Bỏ đồ bẩn vào giỏ giặt','16:50',1),
  T('sa3','school','afternoon','🍎','Ăn nhẹ & dọn chỗ ngồi','Ăn xong tự dọn','17:00',1),
  T('sa4','school','afternoon','🧹','Phụ bố mẹ 1 việc nhà','Quét nhà, tưới cây, dọn bàn','17:30',2,1,true),
  T('sa5','school','afternoon','⚽','Vận động 30 phút','Đạp xe, nhảy dây, đá bóng','18:00',2,1,true),
  T('se1','school','evening','📚','Tự học bài & làm bài tập','Ngồi thẳng lưng, làm hết bài','19:30',3,2),
  T('se2','school','evening','🗓️','Soạn sách vở theo thời khóa biểu','Kiểm tra đủ vở và hộp bút','20:15',2),
  T('se3','school','evening','🚿','Tắm & đánh răng buổi tối','Sạch sẽ trước khi ngủ','20:30',1),
  T('se4','school','evening','🌙','Đọc sách & lên giường','Tắt màn hình, ngủ đúng giờ','21:00',2),
  T('wm1','weekend','morning','☀️','Dậy trước 7:30 & gấp chăn','Dậy đúng giờ dù là ngày nghỉ','07:30',1),
  T('wm2','weekend','morning','🪥','Đánh răng & rửa mặt','Chải răng đủ 2 phút','07:35',1),
  T('wm3','weekend','morning','🤸','Thể dục 15 phút','Vận động cho khỏe','07:50',2,1,true),
  T('wm4','weekend','morning','🧸','Dọn góc học tập & đồ chơi','Lau bàn, xếp truyện, cất đồ chơi','09:00',2,1,true),
  T('wa1','weekend','afternoon','🎨','Đọc sách / vẽ 40 phút','Không dùng màn hình','15:00',2),
  T('wa2','weekend','afternoon','🍳','Phụ chuẩn bị bữa tối','Nhặt rau, bày bát đũa','17:00',2,1,true),
  T('wa3','weekend','afternoon','🚲','Chơi ngoài trời','Công viên, đạp xe','17:45',2,1,true),
  T('we1','weekend','evening','🎒','Chuẩn bị đồ cho ngày mai','Sách vở, đồng phục','19:45',2),
  T('we2','weekend','evening','💖','Kể 3 điều vui hôm nay','Chia sẻ cùng bố mẹ','20:15',1,0),
  T('we3','weekend','evening','🌙','Đánh răng & ngủ đúng giờ','Ngủ sớm cho khỏe','21:00',2)
];
// Tiêu chí "thế nào là ĐẠT" – bé đọc/nghe trước, bố mẹ căn cứ để chấm
const DEFAULT_CRITERIA = {
  sm1: 'Chải đủ 2 phút\nRửa mặt sạch, lau khô', sm2: 'Chăn gấp vuông\nGối đặt ngay ngắn', sm3: 'Tự mặc, cài cúc đúng\nĐồ ngủ gấp gọn',
  sm4: 'Ăn hết suất trong 20 phút\nKhông xem TV khi ăn', sm5: 'Đủ bình nước, mũ\nTự đi giày', sa1: 'Giày để lên kệ\nCặp treo đúng chỗ',
  sa2: 'Rửa tay bằng xà phòng\nĐồ bẩn bỏ vào giỏ', sa3: 'Ăn xong lau bàn\nCất bát đĩa', sa4: 'Làm hết việc được giao\nKhông cần nhắc',
  sa5: 'Vận động đủ 30 phút', se1: 'Làm hết bài tập\nNgồi thẳng lưng, tập trung', se2: 'Đủ sách vở theo thời khóa biểu\nCó hộp bút, kéo khóa cặp',
  se3: 'Tắm sạch, đánh răng 2 phút\nTreo khăn gọn', se4: 'Tắt màn hình\nLên giường đúng giờ', wm1: 'Tự dậy trước 7:30\nGấp chăn gọn',
  wm2: 'Chải đủ 2 phút', wm3: 'Tập đủ 15 phút', wm4: 'Bàn học sạch\nĐồ chơi cất đúng chỗ', wa1: 'Đủ 40 phút\nKhông dùng điện thoại, TV',
  wa2: 'Phụ giúp đến khi xong', wa3: 'Chơi vui, an toàn', we1: 'Đủ sách vở, đồng phục', we2: 'Kể đủ 3 điều', we3: 'Đánh răng 2 phút\nNgủ trước 21:15'
};
DEFAULT_TASKS.forEach(t => { t.criteria = DEFAULT_CRITERIA[t.id] || ''; });

const R = (id, tier, icon, title, desc, cost) => ({ id, tier, icon, title, desc, cost, active: true });
const DEFAULT_REWARDS = [
  R('r1',1,'🌟','Chọn 1 tấm sticker xinh','Dán vào sổ thành tích của con',30),
  R('r2',1,'📖','Bố mẹ đọc thêm 1 truyện','Thêm 1 truyện trước giờ ngủ',30),
  R('r3',1,'🍦','Chọn món tráng miệng','Con được chọn món tráng miệng hôm nay',40),
  R('r4',1,'🎲','Chơi board game 20 phút','Chơi cùng bố mẹ',50),
  R('r5',2,'📺','Thêm 20 phút hoạt hình','Dùng vào cuối tuần',100),
  R('r6',2,'⏰','Ngủ nướng 30 phút Chủ nhật','Dậy muộn hơn một chút',120),
  R('r7',2,'🍕','Chọn món ăn tối cho cả nhà','Một bữa tối cuối tuần',150),
  R('r8',2,'👑','Làm "trưởng ban" cuối tuần','Con chọn hoạt động cả nhà cùng làm',150),
  R('r9',3,'🍿','Đêm rạp phim tại nhà','Kèm bỏng ngô, con chọn phim',200),
  R('r10',3,'🧁','Cùng mẹ làm bánh','Con được làm đầu bếp chính',220),
  R('r11',3,'🎡','Đi công viên / khu vui chơi','Một buổi đi chơi cuối tuần',300),
  R('r12',3,'⛺','Đi picnic / cắm trại','Cả nhà đi dã ngoại',350),
  R('r13',4,'🌱','Quỹ yêu thương 20.000đ','Bố mẹ góp vào heo đất từ thiện, con chọn nơi giúp đỡ',400),
  R('r14',4,'📘','1 cuốn sách con tự chọn','Đi nhà sách cùng bố mẹ',400),
  R('r15',4,'🐷','Heo đất tiết kiệm 20.000đ','Bỏ vào heo đất, dành dụm mua món đồ con mơ ước',500),
  R('r16',4,'🎨','Bộ màu / đồ sáng tạo mới','Đồ dùng học tập, sáng tạo',500),
  R('r17',4,'🧩','Bộ Lego / đồ chơi mơ ước','Phần thưởng cho cả tháng kiên trì',800)
];

const PRESETS = [
  ['💊','Uống vitamin'], ['🐶','Cho thú cưng ăn'], ['🎹','Tập đàn 15 phút'], ['🌱','Tưới cây'],
  ['🗑️','Đổ rác'], ['🍽️','Dọn bát sau bữa ăn'], ['🧺','Gấp quần áo của mình'], ['✍️','Luyện chữ 15 phút'],
  ['🔤','Học tiếng Anh 15 phút'], ['💧','Uống đủ nước'], ['📵','Không xem màn hình quá giờ'], ['🙏','Chào hỏi người lớn']
];

/* ================== TIỆN ÍCH ================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = (p) => p + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const clone = (o) => JSON.parse(JSON.stringify(o));

function dateKey(d = new Date()) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
const todayKey = () => dateKey();
function parseKey(k) { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); }
function addDays(k, n) { const d = parseKey(k); d.setDate(d.getDate() + n); return dateKey(d); }
function fmtDate(k) { const d = parseKey(k); return `${WEEKDAYS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}`; }
function fmtTime(ts) {
  const d = new Date(ts); const k = dateKey(d);
  const hm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  if (k === todayKey()) return 'Hôm nay ' + hm;
  if (k === addDays(todayKey(), -1)) return 'Hôm qua ' + hm;
  return `${d.getDate()}/${d.getMonth() + 1} ${hm}`;
}
function nowHM() { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
function hashPin(pin) {
  // Khóa trẻ em đơn giản (không phải bảo mật ngân hàng)
  let h = 5381; const s = 'sieunhi$' + pin + '$tulap';
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}
function isStandalone() {
  return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
}
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

/* ================== DỮ LIỆU ================== */
function newKid(name, avatar, color, age = 6, theme = '', font = '') {
  const grp = getAgeGroup(age);
  return {
    id: uid('k'), name, age: Number(age) || 6,
    avatar: avatar || grp.avatars[0],
    color: color || KID_COLORS[0],
    theme: theme || grp.defaultTheme,
    font: font || grp.defaultFont,
    stars: 0, totalEarned: 0, streak: 0, bestStreak: 0, goalRewardId: null,
    days: {}, history: [], vouchers: [], message: null, createdAt: Date.now()
  };
}
function defaultState() {
  return {
    version: 1, setupDone: false, parents: [], kids: [],
    tasks: clone(DEFAULT_TASKS), rewards: clone(DEFAULT_REWARDS),
    settings: {
      schoolDays: [1, 2, 3, 4, 5], vnHolidays: true, requireApproval: true,
      comboBonus: 2, missedPenalty: false, streakThreshold: 80, ntfyTopic: '',
      pairCode: 'SNH-' + Math.floor(1000 + Math.random() * 9000),
      theme: 'candy', font: 'rounded'
    },
    dayOverrides: {}, lastRollover: todayKey()
  };
}
function getFamilyCode() {
  if (!S.settings.pairCode || !S.settings.pairCode.startsWith('SNH-')) {
    S.settings.pairCode = 'SNH-' + Math.floor(1000 + Math.random() * 9000);
    save();
  }
  return S.settings.pairCode;
}
function migrate(s) {
  const d = defaultState();
  s.settings = Object.assign({}, d.settings, s.settings || {});
  s.dayOverrides = s.dayOverrides || {};
  s.parents = Array.isArray(s.parents) ? s.parents : [];
  s.kids = (Array.isArray(s.kids) ? s.kids : []).map(k => {
    const age = Number(k.age) || 6;
    const grp = getAgeGroup(age);
    const merged = Object.assign(newKid(k.name, k.avatar, k.color, age, k.theme, k.font), k);
    merged.age = age;
    merged.theme = k.theme || grp.defaultTheme;
    merged.font = k.font || grp.defaultFont;
    // Nếu lớn tuổi (>=7) mà vẫn đang để icon cún con/thỏ mặc định của mầm non thì tự nâng cấp icon theo độ tuổi
    if (age >= 7 && ['🐶','🐱','🐰','🐥','🍼'].includes(merged.avatar)) {
      merged.avatar = grp.avatars[0];
    }
    return merged;
  });
  s.tasks = Array.isArray(s.tasks) ? s.tasks : d.tasks;
  s.tasks.forEach(t => { if (t.criteria === undefined) t.criteria = DEFAULT_CRITERIA[t.id] || ''; });
  s.rewards = Array.isArray(s.rewards) ? s.rewards : d.rewards;
  s.lastRollover = s.lastRollover || todayKey();
  return s;
}
function load() {
  try {
    if (location.search.includes('reset') || location.hash.includes('reset')) {
      localStorage.removeItem(STORE_KEY);
      localStorage.removeItem('sieunhi_device_v1');
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', location.pathname);
      }
      return defaultState();
    }
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return migrate(JSON.parse(raw));
  } catch (e) { /* ignore */ }
  return defaultState();
}
function localSave() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); }
  catch (e) { toast('Không lưu được dữ liệu trên máy!', '⚠️', 'rose'); }
}
// Lưu trên máy + đẩy thay đổi lên đám mây (nếu đã kết nối gia đình)
function save() { localSave(); cloudPush(); }

let S = load();

/* --- Cài đặt riêng của TỪNG MÁY (không đồng bộ) --- */
const DEV_KEY = 'sieunhi_device_v1';
const DEVICE_KEYS = ['voiceName', 'voiceRate', 'voiceAuto', 'sound', 'autoLockMin', 'deviceRole'];
const DEV = (() => {
  const base = { fid: null, deviceKid: '', deviceRole: '', notifyParent: false, sysNotify: false, lastRollover: null, voiceName: '', voiceRate: 0.9, voiceAuto: true, sound: true, autoLockMin: 5 };
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(DEV_KEY) || 'null'); } catch (e) { /* ignore */ }
  if (!saved) { saved = {}; DEVICE_KEYS.forEach(k => { if (S.settings[k] !== undefined) saved[k] = S.settings[k]; }); }
  return Object.assign(base, saved);
})();
DEVICE_KEYS.forEach(k => delete S.settings[k]);
function saveDev() { try { localStorage.setItem(DEV_KEY, JSON.stringify(DEV)); } catch (e) { /* ignore */ } }
function isKidOnlyDevice() {
  if (DEV && DEV.deviceRole === 'kid') return true;
  try {
    const p = new URLSearchParams(location.search);
    if (p.get('mode') === 'kid' || (location.hash && location.hash.includes('kid'))) return true;
  } catch (e) {}
  return false;
}

/* --- Trạng thái đồng bộ đám mây --- */
const CLOUD = {
  backend: null, status: 'off', err: '', ready: false, metaReady: false, kidsReady: false,
  synced: { meta: null, kids: {} }, unsubs: [], histUnsubs: {}, histQueue: [], collect: null, rolling: false
};
const INC = (n) => ({ __op: 'inc', n });
const DEL = { __op: 'del' };

/* ================== LOGIC NGÀY & VIỆC ================== */
function holidayName(k) {
  const mmdd = k.slice(5);
  if (VN_FIXED_HOLIDAYS[mmdd]) return VN_FIXED_HOLIDAYS[mmdd];
  if (VN_LUNAR.gioTo.includes(k)) return 'Giỗ Tổ Hùng Vương';
  for (const t of VN_LUNAR.tet) {
    const diff = Math.round((parseKey(k) - parseKey(t)) / 86400000);
    if (diff >= -2 && diff <= 4) return 'Nghỉ Tết Nguyên Đán';
  }
  return null;
}
function dayInfo(k = todayKey()) {
  const wd = parseKey(k).getDay();
  const ov = S.dayOverrides[k];
  if (ov) return { type: ov, label: DAY_TYPES[ov].label, wd, override: true };
  if (S.settings.vnHolidays) {
    const h = holidayName(k);
    if (h) return { type: 'weekend', label: h, wd, holiday: h };
  }
  const school = S.settings.schoolDays.includes(wd);
  return { type: school ? 'school' : 'weekend', label: school ? 'Ngày đi học' : 'Ngày nghỉ', wd };
}
function dayRec(kid, k = todayKey()) {
  if (!kid.days[k]) kid.days[k] = { st: {}, combo: {}, health: 'normal', note: {} };
  const r = kid.days[k]; r.st = r.st || {}; r.combo = r.combo || {}; r.note = r.note || {};
  return r;
}
const healthOf = (kid, k = todayKey()) => (kid.days[k] && kid.days[k].health) || 'normal';
function isSelfManaged(kid) {
  if (!kid) return false;
  if (typeof kid.selfManage === 'boolean') return kid.selfManage;
  return (Number(kid.age) || 6) >= 18;
}
const statusOf = (kid, taskId, k = todayKey()) => (kid.days[k] && kid.days[k].st[taskId]) || 'todo';
function isTaskOverdue(kid, t, k = todayKey()) {
  if (k !== todayKey() || !t || !t.time) return false;
  const st = statusOf(kid, t.id, k);
  return (st === 'todo' || st === 'redo') && t.time < nowHM();
}
function tasksFor(kid, k = todayKey(), session = null) {
  const info = dayInfo(k); const h = healthOf(kid, k);
  if (h === 'sick_full') return [];
  return S.tasks.filter(t =>
    t.active !== false &&
    (t.dayType === info.type || t.dayType === 'both') &&
    (!t.kidIds || !t.kidIds.length || t.kidIds.includes(kid.id)) &&
    (h !== 'sick_light' || !t.heavy) &&
    (!session || t.session === session)
  ).sort((a, b) => {
    const sa = statusOf(kid, a.id, k), sb = statusOf(kid, b.id, k);
    const doneA = (sa === 'done' || sa === 'pending') ? 1 : 0;
    const doneB = (sb === 'done' || sb === 'pending') ? 1 : 0;
    if (doneA !== doneB) return doneA - doneB;
    return (a.time || '').localeCompare(b.time || '');
  });
}
function overdueTasksFor(kid, k = todayKey(), session = null) {
  return tasksFor(kid, k, session).filter(t => isTaskOverdue(kid, t, k));
}
function progress(kid, k = todayKey(), session = null) {
  const list = tasksFor(kid, k, session); let done = 0, pending = 0, redo = 0, overdue = 0;
  list.forEach(t => {
    const s = statusOf(kid, t.id, k);
    if (s === 'done') done++;
    else if (s === 'pending') pending++;
    else if (s === 'redo') redo++;
    if (isTaskOverdue(kid, t, k)) overdue++;
  });
  return { total: list.length, done, pending, redo, overdue, pct: list.length ? Math.round(done * 100 / list.length) : 0 };
}
function maxDailyStars() {
  let best = 0;
  ['school', 'weekend'].forEach(type => {
    const sum = S.tasks.filter(t => t.active !== false && (t.dayType === type || t.dayType === 'both') && (!t.kidIds || !t.kidIds.length))
      .reduce((a, t) => a + (Number(t.stars) || 0), 0) + 3 * (S.settings.comboBonus || 0);
    best = Math.max(best, sum);
  });
  return best || 20;
}
const daysNeeded = (cost) => Math.max(1, Math.ceil(cost / Math.max(1, maxDailyStars() * 0.8)));
function levelOf(kid) {
  const lvArr = (kid && getAgeGroup(kid.age).levels) || LEVELS;
  let idx = 0; lvArr.forEach((l, i) => { if (kid.totalEarned >= l.min) idx = i; });
  const cur = lvArr[idx], next = lvArr[idx + 1];
  const pct = next ? Math.round((kid.totalEarned - cur.min) * 100 / (next.min - cur.min)) : 100;
  return { idx, cur, next, pct };
}
const findTask = (id) => S.tasks.find(t => t.id === id);
const findKid = (id) => S.kids.find(k => k.id === id);
const findReward = (id) => S.rewards.find(r => r.id === id);
const currentParent = () => S.parents.find(p => p.id === UI.parentId);

function changeStars(kid, delta, reason, icon) {
  delta = Math.round(Number(delta) || 0);
  if (!delta) return;
  kid.stars = Math.max(0, kid.stars + delta);
  if (delta > 0) kid.totalEarned += delta;
  const p = currentParent();
  const h = { t: Date.now(), d: delta, r: reason, i: icon || (delta > 0 ? '⭐' : '⚠️'), by: p ? p.name : '' };
  if (!kid.history) kid.history = [];
  kid.history.unshift(h);
  if (kid.history.length > 400) kid.history.length = 400;
  if (CLOUD.collect) CLOUD.collect.push(h);                    // đang tính trong transaction chuyển ngày
  else if (DEV.fid) CLOUD.histQueue.push({ kidId: kid.id, h }); // gửi lên đám mây ở lần save() kế tiếp
}

/* --- Hành động trên việc --- */
function kidMarkDone(kid, taskId) {
  const task = findTask(taskId); if (!task) return;
  const rec = dayRec(kid);
  if (S.settings.requireApproval && !isSelfManaged(kid)) {
    rec.st[taskId] = 'pending';
    sound('check');
    toast('Giỏi lắm! Bố Mẹ sẽ chấm để con nhận sao nhé', '⏳', 'sun');
    setTimeout(() => teacherSay(TEACHER.done(kid)), 350);
    pushParents(`${kid.name} đã làm xong`, `${task.icon} ${task.title} – Bố Mẹ chấm giúp con nhé!`, ['raising_hand']);
  } else {
    approveTask(kid, taskId, todayKey(), true);
    setTimeout(() => teacherSay(TEACHER.doneNoApprove(kid, task)), 600);
  }
}
// grade: 'great' (Xuất sắc, +1⭐ thưởng) | 'ok' (Đạt)
function approveTask(kid, taskId, k = todayKey(), byKid = false, grade = 'ok') {
  const task = findTask(taskId); if (!task) return;
  const rec = dayRec(kid, k);
  if (rec.st[taskId] === 'done') return;
  const great = grade === 'great' && !(rec.redo && rec.redo[taskId]);
  const award = Number(task.stars) + (great ? 1 : 0);
  rec.st[taskId] = 'done';
  rec.grade = rec.grade || {}; rec.award = rec.award || {};
  rec.grade[taskId] = great ? 'great' : 'ok';
  rec.award[taskId] = award;
  delete rec.note[taskId];
  changeStars(kid, award, (great ? '🌟 Xuất sắc: ' : '✅ ') + task.title, great ? '🌟' : task.icon);
  sound('star'); confetti(great ? 90 : 46); starPop('+' + award + '⭐');
  if (!byKid) toast(`${kid.name}: "${task.title}" ${great ? 'xuất sắc' : 'đạt'}! +${award}⭐`, great ? '🌟' : '✅', 'mint');
  else toast(`Tuyệt vời! +${award}⭐`, '🌟', 'mint');
  checkCombo(kid, k, task.session);
}
function rejectTask(kid, taskId, k, reason) {
  const task = findTask(taskId); if (!task) return;
  const rec = dayRec(kid, k);
  rec.st[taskId] = 'redo';
  rec.redo = rec.redo || {}; rec.redo[taskId] = true;
  rec.note[taskId] = reason || 'Con làm lại cẩn thận hơn nhé';
  const pen = Number(task.penalty ?? 1);
  if (pen > 0) changeStars(kid, -pen, '↩️ Chưa đạt: ' + task.title + (reason ? ' (' + reason + ')' : ''), '↩️');
  sound('oops');
  toast(`${kid.name} cần làm lại "${task.title}"${pen ? ` (−${pen}⭐)` : ''}`, '↩️', 'rose');
}
function revertTask(kid, taskId, k) {
  const task = findTask(taskId); if (!task) return;
  const rec = dayRec(kid, k);
  if (rec.st[taskId] === 'done') {
    const award = (rec.award && rec.award[taskId]) || task.stars;
    changeStars(kid, -award, 'Hủy chấm: ' + task.title, '↩️');
    if (rec.grade) delete rec.grade[taskId];
    if (rec.award) delete rec.award[taskId];
  }
  rec.st[taskId] = 'todo';
}
function checkCombo(kid, k, session) {
  const bonus = Number(S.settings.comboBonus || 0);
  if (!bonus) return;
  const rec = dayRec(kid, k);
  if (rec.combo[session]) return;
  const p = progress(kid, k, session);
  if (p.total > 0 && p.done === p.total) {
    rec.combo[session] = true;
    changeStars(kid, bonus, `🏆 Hoàn thành cả ${SESSION_META[session].label.toLowerCase()}`, '🏆');
    setTimeout(() => { sound('combo'); confetti(80); toast(`🏆 ${kid.name} xong cả ${SESSION_META[session].label.toLowerCase()}! Thưởng +${bonus}⭐`, '🏆', 'sun'); }, 500);
  }
}

/* --- Chuyển ngày: tính chuỗi, phạt bỏ lỡ (nếu bật) --- */
function processDayKid(kid, k) {
  const rec = kid.days && kid.days[k];
  if (!rec || rec.processed) return;
  rec.processed = true;
  if ((rec.health || 'normal') === 'sick_full') return; // nghỉ ốm: giữ nguyên chuỗi
  const list = tasksFor(kid, k);
  if (!list.length) return;
  const p = progress(kid, k);
  const pct = Math.round((p.done + p.pending) * 100 / p.total);
  if (pct >= S.settings.streakThreshold) {
    kid.streak++;
    kid.bestStreak = Math.max(kid.bestStreak, kid.streak);
    if (kid.streak % 7 === 0) changeStars(kid, 10, `🔥 Chuỗi ${kid.streak} ngày tự giác`, '🔥');
    if (kid.streak === 30) changeStars(kid, 50, '🏅 Tròn 1 tháng tự giác!', '🏅');
  } else {
    kid.streak = 0;
  }
  if (S.settings.missedPenalty) {
    list.forEach(t => {
      const s = statusOf(kid, t.id, k);
      if ((s === 'todo' || s === 'redo') && Number(t.penalty ?? 1) > 0) changeStars(kid, -Number(t.penalty ?? 1), '⏰ Bỏ lỡ: ' + t.title, '⏰');
    });
  }
}
function pruneKid(kid, today) {
  const cutoff = addDays(today, -90);
  Object.keys(kid.days || {}).forEach(d => { if (d < cutoff) delete kid.days[d]; });
}
function rollover() {
  const today = todayKey();
  if (DEV.fid) { cloudRollover(); return; }   // chế độ đồng bộ: xử lý an toàn bằng transaction
  if (S.lastRollover !== today) {
    let k = S.lastRollover, guard = 0;
    while (k < today && guard < 31) { S.kids.forEach(kid => processDayKid(kid, k)); k = addDays(k, 1); guard++; }
    S.lastRollover = today;
    S.kids.forEach(kid => pruneKid(kid, today));
    Object.keys(S.dayOverrides).forEach(d => { if (d < addDays(today, -7)) delete S.dayOverrides[d]; });
  }
  S.kids.forEach(kid => dayRec(kid, today));
  save();
}


/* ================== ĐỒNG BỘ ĐÁM MÂY (FIREBASE) ==================
   - Mỗi gia đình: families/{fid} (cài đặt, lịch việc, quà, tài khoản bố mẹ)
                   families/{fid}/kids/{kidId} (sao, chuỗi, trạng thái việc từng ngày, quà đã đổi)
                   families/{fid}/kids/{kidId}/history/* (lịch sử sao)
   - Mọi thay đổi được tính DIFF theo từng trường → 2 máy sửa cùng lúc không đè nhau.
   - Sao dùng phép cộng dồn (increment) → bé tích & bố mẹ chấm cùng lúc vẫn đúng.
================================================================== */
const META_KEYS = ['setupDone', 'parents', 'tasks', 'rewards', 'settings', 'dayOverrides', 'version'];
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
function metaOf(s) { const o = {}; META_KEYS.forEach(k => { if (s[k] !== undefined) o[k] = clone(s[k]); }); return o; }
function kidCloud(kid) { const o = clone(kid); delete o.history; return o; }
function diffObj(a, b, path, ops, opt) {
  if (isObj(a) && isObj(b)) {
    Object.keys(b).forEach(k => {
      if (b[k] === undefined) return;
      if (!(k in a) || a[k] === undefined) ops.push([[...path, k], clone(b[k])]);
      else diffObj(a[k], b[k], [...path, k], ops, opt);
    });
    Object.keys(a).forEach(k => { if (a[k] !== undefined && (!(k in b) || b[k] === undefined)) ops.push([[...path, k], DEL]); });
    return;
  }
  if (JSON.stringify(a) === JSON.stringify(b)) return;
  if (path.length === 1 && opt && opt.inc && opt.inc.includes(path[0]) && typeof a === 'number' && typeof b === 'number') {
    ops.push([path, INC(b - a)]); return;
  }
  ops.push([path, b === undefined ? DEL : clone(b)]);
}
function randId(n) {
  const al = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const a = new Uint8Array(n); (window.crypto || window.msCrypto).getRandomValues(a);
  return Array.from(a, x => al[x % al.length]).join('');
}
function randCode() {
  const al = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const a = new Uint8Array(6); window.crypto.getRandomValues(a);
  return Array.from(a, x => al[x % al.length]).join('');
}
function getFbConfig() {
  if (window.SIEUNHI_TEST_BACKEND) return { test: true };
  const c = window.SIEUNHI_FIREBASE_CONFIG;
  if (c && c.apiKey && c.projectId) return c;
  try { const s = JSON.parse(localStorage.getItem('sieunhi_fbconfig') || 'null'); if (s && s.apiKey && s.projectId) return s; } catch (e) { /* ignore */ }
  return null;
}
function parseFbConfig(text) {
  const out = {};
  ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'].forEach(k => {
    const m = String(text).match(new RegExp('["\']?' + k + '["\']?\\s*:\\s*["\']([^"\']+)["\']'));
    if (m) out[k] = m[1];
  });
  return out.apiKey && out.projectId ? out : null;
}
function cloudErr(e) {
  console.warn('[cloud]', e);
  const msg = (e && (e.code || e.message)) || String(e);
  if (/permission/i.test(msg)) { CLOUD.status = 'error'; CLOUD.err = 'Firebase từ chối truy cập – kiểm tra Luật bảo mật (Rules) và bật Đăng nhập ẩn danh'; }
  else if (/unavailable|network|offline/i.test(msg)) { CLOUD.status = 'offline'; }
  else { CLOUD.err = msg; }
  scheduleRender();
}
async function cloudInitBackend() {
  if (CLOUD.backend) return CLOUD.backend;
  const cfg = getFbConfig();
  if (!cfg) throw new Error('Chưa có cấu hình Firebase');
  CLOUD.status = 'connecting';
  if (window.SIEUNHI_TEST_BACKEND) CLOUD.backend = await window.SIEUNHI_TEST_BACKEND();
  else { const mod = await import('./firebase-backend.js'); CLOUD.backend = await mod.createBackend(cfg); }
  return CLOUD.backend;
}
const famPath = (sub = '') => 'families/' + DEV.fid + sub;

function cloudPush() {
  if (!DEV.fid || !CLOUD.backend || !CLOUD.ready) return;
  const B = CLOUD.backend;
  const m = metaOf(S); const ops = [];
  diffObj(CLOUD.synced.meta || {}, m, [], ops, null);
  if (ops.length) { B.update(famPath(), ops).catch(cloudErr); CLOUD.synced.meta = m; }
  const ids = new Set();
  S.kids.forEach(kid => {
    ids.add(kid.id);
    const c = kidCloud(kid); const old = CLOUD.synced.kids[kid.id];
    if (!old) B.set(famPath('/kids/' + kid.id), c).catch(cloudErr);
    else { const o = []; diffObj(old, c, [], o, { inc: ['stars', 'totalEarned'] }); if (o.length) B.update(famPath('/kids/' + kid.id), o).catch(cloudErr); }
    CLOUD.synced.kids[kid.id] = c;
  });
  Object.keys(CLOUD.synced.kids).forEach(id => {
    if (!ids.has(id)) { B.remove(famPath('/kids/' + id)).catch(cloudErr); delete CLOUD.synced.kids[id]; }
  });
  while (CLOUD.histQueue.length) {
    const { kidId, h } = CLOUD.histQueue.shift();
    if (ids.has(kidId)) B.add(famPath('/kids/' + kidId + '/history'), h).catch(cloudErr);
  }
}
function stopSync() {
  CLOUD.unsubs.forEach(u => { try { u(); } catch (e) { /* ignore */ } });
  Object.values(CLOUD.histUnsubs).forEach(u => { try { u(); } catch (e) { /* ignore */ } });
  CLOUD.unsubs = []; CLOUD.histUnsubs = {};
  CLOUD.ready = CLOUD.metaReady = CLOUD.kidsReady = false;
  CLOUD.synced = { meta: null, kids: {} };
}
async function startSync() {
  if (!DEV.fid) return;
  try {
    const B = await cloudInitBackend();
    stopSync();
    CLOUD.status = 'connecting'; CLOUD.err = '';
    CLOUD.unsubs.push(B.onDoc(famPath(), onMeta, cloudErr));
    CLOUD.unsubs.push(B.onCol(famPath('/kids'), null, onKids, cloudErr));
  } catch (e) {
    CLOUD.status = 'error'; CLOUD.err = (e && e.message) || String(e);
    scheduleRender();
  }
}
function markReady(m) {
  CLOUD.status = (m && m.fromCache) || !navigator.onLine ? 'offline' : 'online';
  if (CLOUD.metaReady && CLOUD.kidsReady && !CLOUD.ready) {
    CLOUD.ready = true;
    cloudRollover();
  }
}
function onMeta(data, m) {
  if (!data) {
    if (m && m.fromCache) return;
    CLOUD.status = 'error'; CLOUD.err = 'Không tìm thấy dữ liệu gia đình (có thể đã bị xóa)'; scheduleRender(); return;
  }
  META_KEYS.forEach(k => { if (data[k] !== undefined) S[k] = clone(data[k]); });
  migrate(S);
  DEVICE_KEYS.forEach(k => delete S.settings[k]);
  CLOUD.synced.meta = metaOf(S);
  CLOUD.metaReady = true; markReady(m);
  localSave(); scheduleRender();
}
function onKids(docs, m) {
  const prev = new Map(S.kids.map(k => [k.id, k]));
  const list = docs.map(({ id, data }) => {
    const old = prev.get(id);
    const kid = Object.assign(newKid(data.name, data.avatar, data.color), clone(data), { id });
    kid.history = old ? old.history : [];
    try { detectRemote(old, kid); } catch (e) { console.warn(e); }
    return kid;
  }).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  S.kids = list;
  CLOUD.synced.kids = {};
  list.forEach(k => { CLOUD.synced.kids[k.id] = kidCloud(k); });
  // lịch sử sao của từng bé
  const B = CLOUD.backend;
  list.forEach(k => {
    if (CLOUD.histUnsubs[k.id]) return;
    CLOUD.histUnsubs[k.id] = B.onCol(famPath('/kids/' + k.id + '/history'), { orderBy: 't', desc: true, limit: 150 }, (hd) => {
      const kid = findKid(k.id); if (!kid) return;
      kid.history = hd.map(d => d.data); localSave(); scheduleRender();
    }, cloudErr);
  });
  Object.keys(CLOUD.histUnsubs).forEach(id => { if (!list.find(k => k.id === id)) { CLOUD.histUnsubs[id](); delete CLOUD.histUnsubs[id]; } });
  CLOUD.kidsReady = true; markReady(m);
  if (UI.kidId && !findKid(UI.kidId)) { UI.mode = 'picker'; UI.kidId = null; }
  localSave(); scheduleRender();
}
// So sánh trạng thái cũ ↔ mới để báo tin (máy khác vừa thay đổi)
function detectRemote(old, kid) {
  if (!old || !CLOUD.ready) return;
  const k = todayKey();
  const ra = (old.days && old.days[k]) || {}; const rb = (kid.days && kid.days[k]) || {};
  const a = ra.st || {}; const b = rb.st || {};
  const onKidScreen = UI.mode === 'kid' && UI.kidId === kid.id;
  Object.keys(b).forEach(tid => {
    const was = a[tid] || 'todo', now = b[tid];
    if (was === now) return;
    const t = findTask(tid); if (!t) return;
    if (now === 'pending') parentAlert(`${kid.avatar} ${kid.name} đã làm xong`, `${t.icon} ${t.title}`, '🙋');
    if (onKidScreen && was === 'pending' && now === 'done') {
      const great = rb.grade && rb.grade[tid] === 'great';
      const award = (rb.award && rb.award[tid]) || t.stars;
      sound('star'); confetti(great ? 90 : 46); starPop('+' + award + '⭐');
      toast(`${great ? 'Xuất sắc' : 'Đạt rồi'}: ${t.title} +${award}⭐`, great ? '🌟' : '✅', 'mint');
      setTimeout(() => teacherSay(TEACHER.graded(kid, t, great, award)), 300);
    }
    if (onKidScreen && now === 'redo' && was !== 'redo') {
      sound('oops');
      toast(`Bố Mẹ nhắc con làm lại: ${t.title}`, '↩️', 'rose');
      setTimeout(() => teacherSay(TEACHER.redo(kid, t, rb.note && rb.note[tid])), 300);
    }
  });
  const oldV = new Set((old.vouchers || []).map(v => v.id));
  (kid.vouchers || []).forEach(v => { if (v.status === 'waiting' && !oldV.has(v.id)) parentAlert(`${kid.avatar} ${kid.name} đổi quà`, `${v.icon} ${v.title} (${v.cost}⭐)`, '🎁'); });
  const om = old.message, nm = kid.message;
  if (onKidScreen && nm && (!om || om.t !== nm.t)) {
    sound('combo'); toast('Bố Mẹ có lời nhắn cho con!', '💌', 'primary');
    setTimeout(() => teacherSay(TEACHER.message(kid)), 400);
  }
  if (nm && om && om.t === nm.t && nm.readAt && !om.readAt) parentAlert(`${kid.avatar} ${kid.name}`, 'đã nghe lời nhắn của Bố Mẹ ❤️', '💌');
}
// Chuyển ngày an toàn khi nhiều máy: mỗi bé xử lý trong 1 transaction, có cờ processed
async function cloudRollover() {
  const today = todayKey();
  const from = DEV.lastRollover || today;
  if (!CLOUD.ready || CLOUD.rolling || from >= today) {
    if (!DEV.lastRollover) { DEV.lastRollover = today; saveDev(); }
    S.kids.forEach(kid => dayRec(kid, today)); save();
    return;
  }
  CLOUD.rolling = true;
  try {
    const B = CLOUD.backend;
    for (const kid of S.kids.slice()) {
      let hist = [];
      await B.txn(famPath('/kids/' + kid.id), (data) => {
        if (!data) return null;
        const k2 = Object.assign(newKid(data.name, data.avatar, data.color), clone(data)); k2.history = [];
        const before = kidCloud(k2);
        CLOUD.collect = [];
        try {
          let d = from, g = 0;
          while (d < today && g < 31) { processDayKid(k2, d); d = addDays(d, 1); g++; }
          pruneKid(k2, today);
          hist = CLOUD.collect;
        } finally { CLOUD.collect = null; }
        const ops = []; diffObj(before, kidCloud(k2), [], ops, { inc: ['stars', 'totalEarned'] });
        return ops;
      });
      hist.forEach(h => B.add(famPath('/kids/' + kid.id + '/history'), h).catch(cloudErr));
    }
    DEV.lastRollover = today; saveDev();
  } catch (e) { console.warn('[cloud] chuyển ngày để sau', e); }
  CLOUD.rolling = false;
  S.kids.forEach(kid => dayRec(kid, today)); save();
}
async function cloudCreate() {
  if (!navigator.onLine) throw new Error('Cần có mạng để tạo gia đình');
  const B = await cloudInitBackend();
  const fid = randId(24);
  S.settings.ntfyTopic = S.settings.ntfyTopic || ('sieunhi-' + randId(14).toLowerCase());
  const code = randCode(); S.settings.pairCode = code;
  await B.set('families/' + fid, Object.assign(metaOf(S), { createdAt: Date.now() }));
  const jobs = [];
  S.kids.forEach(kid => {
    jobs.push(B.set(`families/${fid}/kids/${kid.id}`, kidCloud(kid)));
    (kid.history || []).slice(0, 60).forEach(h => jobs.push(B.add(`families/${fid}/kids/${kid.id}/history`, h)));
  });
  jobs.push(B.set('pairs/' + code, { fid, t: Date.now() }));
  await Promise.all(jobs);
  DEV.fid = fid; DEV.lastRollover = todayKey(); DEV.notifyParent = true; saveDev();
  CLOUD.histQueue = [];
  await startSync();
}
async function cloudJoin(rawCode) {
  const code = String(rawCode || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (code.length !== 6) throw new Error('Mã gồm 6 ký tự');
  const B = await cloudInitBackend();
  const p = await B.get('pairs/' + code);
  if (!p || !p.fid) throw new Error('Mã không đúng hoặc đã được đổi');
  const meta = await B.get('families/' + p.fid);
  if (!meta) throw new Error('Không tìm thấy gia đình');
  stopSync();
  S = migrate(Object.assign(defaultState(), clone(meta), { kids: [] }));
  DEVICE_KEYS.forEach(k => delete S.settings[k]);
  DEV.fid = p.fid; DEV.lastRollover = todayKey(); saveDev();
  CLOUD.histQueue = [];
  localSave();
  await startSync();
  // Đợi dữ liệu các bé về (tối đa 8 giây) để màn hình tiếp theo có đủ thông tin
  for (let i = 0; i < 40 && !(CLOUD.metaReady && CLOUD.kidsReady); i++) await new Promise(r => setTimeout(r, 200));
}
async function cloudNewCode() {
  const B = await cloudInitBackend();
  const old = S.settings.pairCode; const code = randCode();
  await B.set('pairs/' + code, { fid: DEV.fid, t: Date.now() });
  S.settings.pairCode = code; save();
  if (old) B.remove('pairs/' + old).catch(() => {});
}
function cloudLeave() {
  stopSync();
  DEV.fid = null; DEV.deviceKid = ''; saveDev();
  CLOUD.status = 'off'; CLOUD.err = ''; CLOUD.histQueue = [];
  S.lastRollover = todayKey(); localSave();
}
// Gửi thông báo đẩy tới điện thoại Bố Mẹ qua ntfy.sh (miễn phí, iPhone + Android)
function pushParents(title, message, tags) {
  const topic = S.settings.ntfyTopic;
  if (!DEV.fid || !topic) return;
  const payload = { topic, title, message, tags: tags || ['star'], priority: 4, click: location.href.split('#')[0] };
  if (window.SIEUNHI_TEST_BACKEND) { (window.__ntfy = window.__ntfy || []).push(payload); return; }
  try { fetch('https://ntfy.sh/', { method: 'POST', body: JSON.stringify(payload) }).catch(() => {}); } catch (e) { /* ignore */ }
}
// Báo tin ngay trên máy Bố Mẹ khi app đang mở
function parentAlert(title, body, icon = '🔔') {
  if (!DEV.notifyParent) return;
  toast(`${title}: ${body}`, icon, 'primary'); sound('alert'); vibrate([80, 60, 80]);
  if (DEV.sysNotify && 'Notification' in window && Notification.permission === 'granted' && document.visibilityState !== 'visible') {
    const opts = { body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: 'sieunhi-' + Date.now() };
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) navigator.serviceWorker.ready.then(r => r.showNotification(title, opts)).catch(() => {});
      else new Notification(title, opts);
    } catch (e) { /* ignore */ }
  }
}
let renderQueued = false;
function scheduleRender() {
  if (renderQueued) return;
  renderQueued = true;
  setTimeout(() => {
    renderQueued = false;
    const ae = document.activeElement;
    if (ae && $('#app') && $('#app').contains(ae) && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)) { setTimeout(scheduleRender, 800); return; }
    render();
    if (UI.modal && UI.modal.live) renderModal();
  }, 40);
}

/* ================== ÂM THANH & HIỆU ỨNG ================== */
let audioCtx = null;
function sound(type) {
  if (!DEV.sound) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const seq = {
      check: [[523, 0, 'triangle'], [659, .06, 'triangle'], [784, .12, 'triangle']],
      star:  [[659, 0, 'sine'], [784, .07, 'sine'], [988, .14, 'sine'], [1319, .21, 'sine']],
      combo: [[523, 0, 'sine'], [659, .08, 'sine'], [784, .16, 'sine'], [1047, .24, 'sine'], [1319, .34, 'sine']],
      oops:  [[392, 0, 'sine'], [330, .14, 'sine']],
      tap:   [[880, 0, 'sine']],
      alert: [[440, 0, 'sine'], [554, .13, 'sine'], [440, .26, 'sine']]
    }[type] || [];
    seq.forEach(([f, t, w]) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = w; o.frequency.setValueAtTime(f, now + t);
      g.gain.setValueAtTime(type === 'tap' ? .05 : .13, now + t);
      g.gain.exponentialRampToValueAtTime(.001, now + t + .25);
      o.connect(g); g.connect(audioCtx.destination); o.start(now + t); o.stop(now + t + .27);
    });
  } catch (e) { /* ignore */ }
}
/* --- Giọng đọc "cô giáo": ưu tiên giọng nữ tiếng Việt, ngọt, chậm rãi --- */
const VOICE_FEMALE = /ho[aà]i\s*my|linh|female|\bnữ\b/i;
const VOICE_MALE = /nam\s*minh|\ban\b|\bmale\b/i;
function viVoices() {
  try { return speechSynthesis.getVoices().filter(v => /^vi([-_]|$)/i.test(v.lang)); } catch (e) { return []; }
}
function voiceScore(v) {
  let s = 0;
  if (/ho[aà]i\s*my/i.test(v.name)) s += 100;    // Microsoft Hoài My (Edge) – giọng nữ tự nhiên
  if (/linh/i.test(v.name)) s += 90;             // Linh (iPhone/iPad)
  if (/natural|online|neural|enhanced|premium|nâng cao/i.test(v.name)) s += 20;
  if (VOICE_FEMALE.test(v.name)) s += 10;
  if (VOICE_MALE.test(v.name)) s -= 60;
  return s;
}
function pickVoice() {
  const vs = viVoices(); if (!vs.length) return null;
  if (DEV.voiceName) { const v = vs.find(x => x.name === DEV.voiceName); if (v) return v; }
  return vs.slice().sort((a, b) => voiceScore(b) - voiceScore(a))[0];
}
let voiceWarned = false;
function speak(text) {
  try {
    if (!('speechSynthesis' in window)) { toast('Máy chưa hỗ trợ đọc giọng nói', '🔇'); return; }
    const voice = pickVoice();
    if (!voice) {
      // Không có giọng tiếng Việt → KHÔNG đọc bằng giọng tiếng Anh (nghe sai, khó hiểu)
      toast('Máy này chưa có giọng đọc tiếng Việt', '🔇', 'rose');
      if (!voiceWarned) { voiceWarned = true; setTimeout(() => openModal('voiceHelp'), 600); }
      return;
    }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice; u.lang = voice.lang;
    const female = !VOICE_MALE.test(voice.name);
    u.rate = Number(DEV.voiceRate || 0.9);
    u.pitch = female ? 1.15 : 1.35; // giọng nam thì nâng cao độ cho mềm hơn
    speechSynthesis.speak(u);
  } catch (e) { /* ignore */ }
}
// Câu nói theo phong cách cô giáo mầm non: ngọt ngào, động viên
const TEACHER = {
  task: (kid, t) => `${kid.name} ơi, ${t.title} nhé con. ${t.note ? t.note + '.' : ''}${t.criteria ? ' Con nhớ nhé: ' + t.criteria.split('\n').filter(Boolean).join(', ') + '.' : ''} Cô tin con làm được!`,
  done: (kid) => pickOne([`Giỏi quá ${kid.name} ơi! Con đợi bố mẹ kiểm tra một chút nha.`, `Tuyệt vời! Con làm xong rồi, bố mẹ sẽ xem ngay nhé.`, `Cô khen ${kid.name} nè! Con chờ bố mẹ duyệt để nhận sao nha.`]),
  doneNoApprove: (kid, t) => pickOne([`Giỏi quá! ${kid.name} được cộng ${t.stars} ngôi sao!`, `Hoan hô ${kid.name}! Thêm ${t.stars} ngôi sao rồi nè!`]),
  left: (kid, label, list) => `${kid.name} yêu ơi, ${label} con còn ${list.length} việc nhỏ: ${list.map(t => t.title).join(', ')}. Mình cùng làm từng việc một nha. Cố lên con!`,
  allDone: (kid, label) => `Ôi giỏi quá ${kid.name} ơi! Con đã làm hết việc ${label} rồi. Cô thương con lắm!`,
  redeem: (kid, r) => `Chúc mừng ${kid.name} đã đổi được ${r.title}! Con kiên trì giỏi lắm!`,
  graded: (kid, t, great, award) => great
    ? `Ôi tuyệt vời! Bố mẹ chấm việc ${t.title} của ${kid.name} là xuất sắc. Con được ${award} ngôi sao!`
    : `Giỏi lắm ${kid.name}! Bố mẹ chấm việc ${t.title} đạt rồi. Con được ${award} ngôi sao nhé!`,
  redo: (kid, t, note) => `${kid.name} ơi, bố mẹ nhắc con làm lại việc ${t.title} nhé. ${note ? note + '.' : ''} Cô tin con làm được mà!`,
  message: (kid) => kid.message ? `${kid.name} ơi, ${kid.message.from} nhắn con nè: ${kid.message.text}` : '',
  criteria: (t) => t.criteria ? ` Con nhớ nhé: ${t.criteria.split('\n').filter(Boolean).join(', ')}.` : '',
  test: () => 'Chào con yêu! Cô là cô Sao đây. Hôm nay mình cùng làm việc thật giỏi nhé!'
};
function pickOne(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
const teacherSay = (text) => { if (DEV.voiceAuto !== false && viVoices().length) speak(text); };
function confetti(n = 46) {
  const colors = ['#ffb21e', '#ff5d7a', '#7c5cff', '#3fa9ff', '#1fc98e', '#ffd34d'];
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.style.background = colors[i % colors.length];
    el.style.left = (window.innerWidth / 2) + 'px';
    el.style.top = (window.innerHeight * 0.45) + 'px';
    document.body.appendChild(el);
    const a = Math.random() * Math.PI * 2, v = 5 + Math.random() * 9;
    let x = 0, y = 0, vx = Math.cos(a) * v, vy = Math.sin(a) * v - 7, op = 1, rot = Math.random() * 360;
    const step = () => {
      x += vx; y += vy; vy += 0.45; vx *= 0.98; op -= 0.016; rot += 12;
      el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
      el.style.opacity = Math.max(0, op);
      if (op > 0) requestAnimationFrame(step); else el.remove();
    };
    requestAnimationFrame(step);
  }
}
function starPop(text) {
  const el = document.createElement('div');
  el.className = 'star-pop'; el.textContent = text;
  el.style.left = '50%'; el.style.top = (window.innerHeight * 0.45) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}
function toast(msg, icon = '✨', cls = '') {
  const root = $('#toast-root'); if (!root) return;
  $$('.toast', root).forEach(t => { if (t.dataset.msg === msg) t.remove(); });
  const el = document.createElement('div');
  el.className = 'toast ' + cls; el.dataset.msg = msg;
  el.innerHTML = `<span class="ti">${icon}</span><span>${esc(msg)}</span>`;
  root.appendChild(el);
  while (root.children.length > 3) root.firstChild.remove();
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(-10px)'; setTimeout(() => el.remove(), 350); }, 2600);
}
function vibrate(ms = 30) { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { /* ignore */ } }

/* ================== TRẠNG THÁI GIAO DIỆN ================== */
function autoSession() {
  const hm = nowHM();
  if (hm < '11:30') return 'morning';
  if (hm < '19:00') return 'afternoon';
  return 'evening';
}
const UI = {
  mode: 'picker',           // picker | pin | kid | parent
  kidId: null, parentId: null,
  kidTab: 'tasks', parentTab: 'approve',
  session: autoSession(), planDay: 'school',
  pin: { buf: '', purpose: null, first: null, msg: '', err: false, parentId: null, back: 'picker' },
  setupStep: 1, setupDraft: { pAvatar: '👩', kAge: 6, kAvatar: '🐶', kColor: KID_COLORS[0], kTheme: 'candy', kFont: 'rounded' },
  lastActive: Date.now(), failCount: 0, lockUntil: 0,
  modal: null, confirmCb: null, newParent: null, installEvt: null
};

/* ================== ÁP DỤNG GIAO DIỆN & CHỮ ================== */
function activeThemeId() {
  if (UI.mode === 'kid' && UI.kidId) {
    const k = findKid(UI.kidId);
    if (k && k.theme && THEMES[k.theme]) return k.theme;
  }
  return (S.settings && S.settings.theme && THEMES[S.settings.theme]) ? S.settings.theme : 'candy';
}
function activeFontId() {
  if (UI.mode === 'kid' && UI.kidId) {
    const k = findKid(UI.kidId);
    if (k && k.font && FONT_STYLES[k.font]) return k.font;
  }
  return (S.settings && S.settings.font && FONT_STYLES[S.settings.font]) ? S.settings.font : 'rounded';
}
function applyVisualTheme() {
  const tKey = activeThemeId();
  const fKey = activeFontId();
  const t = THEMES[tKey] || THEMES.candy;
  const f = FONT_STYLES[fKey] || FONT_STYLES.rounded;
  document.documentElement.dataset.theme = t.id;
  document.documentElement.dataset.font = f.id;
  document.documentElement.style.setProperty('--primary', t.primary);
  document.documentElement.style.setProperty('--font', f.css);
  document.body.style.background = t.bg;
}

/* ================== CHÂN TRANG ĐƠN GIẢN NHẸ NHÀNG ================== */
function brandFooterHtml() {
  const isKidMode = (UI.mode === 'kid' || isKidOnlyDevice());
  return `<footer class="brand-footer-simple">
    <div style="display:inline-flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:center;">
      <button type="button" class="brand-text-simple" data-act="${isKidMode ? 'openKidDeviceGate' : 'quickSettingsOpen'}">MinhTT @ 2026</button>
      ${isKidMode ? `
        <button type="button" class="kid-gate-btn" data-act="openKidDeviceGate" title="Dành cho Bố Mẹ: Đổi bé, đăng xuất hoặc làm mới máy này (Cần mã PIN)">
          <span>🔒 Cài đặt máy / Đổi bé</span>
        </button>
      ` : ''}
    </div>
  </footer>`;
}

/* ================== WIDGET DÙNG CHUNG ================== */
function emojiGrid(target, list, selected) {
  return `<div class="emoji-grid" id="${target}_grid" data-pick="${target}">
    ${list.map(e => `<button type="button" class="emoji-opt ${e === selected ? 'sel' : ''}" data-act="pick" data-val="${esc(e)}">${renderAvatarArt(e)}</button>`).join('')}
  </div><input type="hidden" id="${target}" value="${esc(selected)}">`;
}
function avatarGridPick(target, list, selected, age = 6) {
  const resolvedSel = resolveAvatarKey(selected, age);
  const isCustomPhoto = typeof resolvedSel === 'string' && resolvedSel.startsWith('data:image/');
  const finalList = list.includes(resolvedSel) || isCustomPhoto ? list : [resolvedSel, ...list];
  return `
    <div class="avatar-pro-grid" id="${target}_grid" data-pick="${target}">
      ${isCustomPhoto ? `
        <button type="button" class="avatar-pro-card sel" data-act="pick" data-val="${esc(resolvedSel)}">
          <span class="ap-art"><img src="${resolvedSel}" alt="Ảnh thật" class="avatar-custom-img"></span>
          <span class="ap-lbl">Ảnh thật</span>
        </button>
      ` : ''}
      ${finalList.map(k => {
        const meta = SVG_AVATARS[k];
        return `<button type="button" class="avatar-pro-card ${k === resolvedSel ? 'sel' : ''}" data-act="pick" data-val="${esc(k)}">
          <span class="ap-art">${renderAvatarArt(k, age)}</span>
          <span class="ap-lbl">${esc(meta ? meta.label : 'Biểu tượng')}</span>
        </button>`;
      }).join('')}
    </div>
    <input type="hidden" id="${target}" value="${esc(resolvedSel)}">
    <input type="file" id="${target}_file" accept="image/*" class="hidden" data-avatar-upload="${target}">
  `;
}
function themeGridPick(target, selected) {
  const cur = THEMES[selected] ? selected : 'candy';
  return `<div class="theme-pick-grid" data-pick="${target}">
    ${Object.values(THEMES).map(t => `
      <button type="button" class="theme-pick-card ${t.id === cur ? 'sel' : ''}" data-act="pick" data-val="${t.id}" style="--t-color:${t.primary}; --t-bg:${t.bg}">
        <span class="tp-swatch" style="background:${t.bg}; border-color:${t.primary}"><span>${t.icon}</span></span>
        <span class="tp-info">
          <b class="tp-name">${esc(t.name)}</b>
          <small class="tp-desc">${esc(t.desc)}</small>
        </span>
      </button>
    `).join('')}
  </div><input type="hidden" id="${target}" value="${esc(cur)}">`;
}
function fontGridPick(target, selected) {
  const cur = FONT_STYLES[selected] ? selected : 'rounded';
  return `<div class="chips" data-pick="${target}">
    ${Object.values(FONT_STYLES).map(f => `
      <button type="button" class="chip ${f.id === cur ? 'sel' : ''}" data-act="pick" data-val="${f.id}" style="font-family:${esc(f.css)}">
        <b>${f.sample}</b> ${esc(f.name)}
      </button>
    `).join('')}
  </div><input type="hidden" id="${target}" value="${esc(cur)}">`;
}
function ageProfileSectionHtml(prefix, age, avatar, theme, font) {
  const grp = getAgeGroup(age);
  const resolvedAv = smartAvatarForAge(age, avatar);
  const curTheme = THEMES[theme] ? theme : grp.defaultTheme;
  const curFont = FONT_STYLES[font] ? font : grp.defaultFont;
  const stages = [
    [5,  '🌸 3–6t Mầm Non'],
    [9,  '🚀 7–11t Tiểu Học'],
    [14, '⚡ 12–17t Teen'],
    [22, '💎 18+ Trưởng Thành']
  ];
  return `
    <div class="field">
      <span class="lbl">Độ tuổi (tự động hóa biểu tượng & giao diện theo lứa tuổi)</span>
      <div class="age-stage-tabs" style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-bottom:8px;">
        ${stages.map(([sampleAge, label]) => {
          const on = getAgeGroup(sampleAge).id === grp.id;
          return `<button type="button" class="age-stage-btn ${on ? 'on' : ''}" data-act="ageStagePick" data-prefix="${prefix}" data-age="${sampleAge}">${label}</button>`;
        }).join('')}
      </div>
      <div class="row" style="gap:10px;">
        <input class="input" type="number" id="${prefix}_age" min="2" max="80" value="${age}" data-age-input="${prefix}" style="max-width:100px;font-weight:900;text-align:center;">
        <div class="grow small bold" id="${prefix}_stage_badge" style="padding:10px 12px;border-radius:12px;background:var(--primary-l);color:var(--primary-d);">
          Cấp độ: <b>${esc(grp.label)}</b>
        </div>
      </div>
    </div>
    <div class="field" id="${prefix}_avatar_wrap">
      <div class="row between" style="margin-bottom:6px;">
        <span class="lbl" style="margin:0;">Avatar nghệ thuật (${esc(grp.short)})</span>
        <button type="button" class="btn btn-primary btn-xs" data-act="triggerAvatarUpload" data-target="${prefix}_avatar">📷 Tải ảnh thật</button>
      </div>
      ${avatarGridPick(prefix + '_avatar', grp.avatars, resolvedAv, age)}
    </div>
    <div class="grid-2">
      <div class="field" id="${prefix}_theme_wrap">
        <span class="lbl">🎨 Giao diện</span>
        <select class="input" id="${prefix}_theme" style="font-weight:800;">
          ${Object.values(THEMES).map(t => `<option value="${t.id}" ${t.id === curTheme ? 'selected' : ''}>${t.icon} ${esc(t.name)}</option>`).join('')}
        </select>
      </div>
      <div class="field" id="${prefix}_font_wrap">
        <span class="lbl">🔤 Kiểu chữ (Font)</span>
        <select class="input" id="${prefix}_font" style="font-weight:800;">
          ${Object.values(FONT_STYLES).map(f => `<option value="${f.id}" ${f.id === curFont ? 'selected' : ''}>${f.sample} ${esc(f.name)}</option>`).join('')}
        </select>
      </div>
    </div>
  `;
}
function chipPick(target, options, selected, multi = false, extraCls = '') {
  const selArr = multi ? (selected || []) : [selected];
  return `<div class="chips" data-pick="${target}" ${multi ? 'data-multi="1"' : ''}>
    ${options.map(([v, l]) => `<button type="button" class="chip ${extraCls} ${selArr.includes(v) ? 'sel' : ''}" data-act="pick" data-val="${esc(v)}">${l}</button>`).join('')}
  </div><input type="hidden" id="${target}" value="${esc(multi ? selArr.join(',') : selected)}">`;
}
function colorPick(target, selected) {
  return `<div class="chips" data-pick="${target}">
    ${KID_COLORS.map(c => `<button type="button" class="color-opt ${c === selected ? 'sel' : ''}" style="background:${c}" data-act="pick" data-val="${c}" aria-label="màu"></button>`).join('')}
  </div><input type="hidden" id="${target}" value="${selected}">`;
}
function stepper(target, val, min, max, suffix = '') {
  return `<div class="stepper" data-min="${min}" data-max="${max}" data-suffix="${esc(suffix)}">
    <button type="button" data-act="step" data-target="${target}" data-delta="-1">−</button>
    <span class="v" id="${target}_v">${val}${suffix}</span>
    <button type="button" data-act="step" data-target="${target}" data-delta="1">+</button>
    <input type="hidden" id="${target}" value="${val}">
  </div>`;
}
const sw = (attrs, on) => `<label class="switch"><input type="checkbox" ${attrs} ${on ? 'checked' : ''}><span></span></label>`;
const val = (id) => { const el = document.getElementById(id); return el ? el.value : ''; };
const avatarHtml = (kid, cls = '') => `<div class="avatar ${cls}" style="background:${kid.color || KID_COLORS[0]}">${renderAvatarArt(kid.avatar, kid.age)}</div>`;

/* ================== MÀN HÌNH: KHỞI TẠO LẦN ĐẦU (BỐ MẸ) ================== */
function viewSetup() {
  const d = UI.setupDraft, step = UI.setupStep;
  if (!d.pairCode) d.pairCode = 'SNH-' + Math.floor(1000 + Math.random() * 9000);
  const steps = `<div class="steps">${[1, 2, 3].map(i => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div>`;
  if (step === 1) return `<div class="setup">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;width:100%;">
      <a href="../index.html" class="corner-back-link" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px;font-weight:800;font-size:13px;color:#64748b;background:#ffffff;padding:7px 14px;border-radius:999px;border:1px solid #e2e8f0;box-shadow:0 2px 6px rgba(0,0,0,0.03);">
        <span>← Quay lại cổng</span>
      </a>
      <span class="pill primary" style="font-weight:800;font-size:11px;">Thiết lập Bố Mẹ</span>
    </div>
    <div class="center"><div class="logo-box-cute">${svgIcon('logo')}</div><h1 class="app-title">Mỗi Ngày Tốt Hơn</h1>
    <p class="muted bold" style="margin-top:6px;font-size:13px;text-wrap:balance;">Thời gian biểu & Rèn luyện nếp sống tự lập mỗi ngày</p></div>
    ${steps}
    <div class="card" style="margin-top:14px">
      <div class="card-title">🏠 Khởi Tạo Hệ Thống Gia Đình</div>
      <p class="small muted bold" style="margin:6px 0 12px;line-height:1.5;text-wrap:balance;">Mã Gia Đình dùng chung cho Bố và Mẹ quản lý:</p>
      <div style="background:#f8fafc;border:2px dashed #cbd5e1;border-radius:18px;padding:14px;text-align:center;">
        <div style="font-size:11px;font-weight:900;color:#94a3b8;letter-spacing:1px;">MÃ GIA ĐÌNH CỦA BẠN</div>
        <div style="font-size:28px;font-weight:900;color:var(--primary);letter-spacing:3px;margin:4px 0;" id="su_code_display">${esc(d.pairCode)}</div>
        <button type="button" class="btn btn-soft btn-xs" data-act="setupNewCode">🎲 Đổi mã khác</button>
      </div>
      <div class="field" style="margin-top:16px"><span class="lbl">Tên của bạn (Bố hoặc Mẹ)</span>
        <input class="input" id="su_pname" maxlength="20" placeholder="VD: Bố Minh, Mẹ Lan" value="${esc(d.pName || '')}"></div>
      <div class="field"><span class="lbl">Hình đại diện</span>${chipPick('su_pavatar', PARENT_AVATARS.map(a => [a, `<span style="font-size:24px">${a}</span>`]), d.pAvatar)}</div>
      <button class="btn btn-primary btn-lg btn-block" data-act="setupNext1">Tiếp tục: Tạo Mật Khẩu (4–6 số) ➜</button>
    </div>
    <div class="card" style="margin-top:14px;text-align:center;padding:18px;">
      <div class="bold" style="font-size:15px;color:#1e293b;">📲 Đã có Mã Gia Đình từ trước?</div>
      <p class="small muted bold" style="margin:6px 0 12px;line-height:1.45;text-wrap:balance;">Đăng nhập để đồng bộ dữ liệu gia đình sẵn có.</p>
      <button class="btn btn-white btn-block" data-act="joinOpen" style="border:1.5px solid #e2e8f0;font-weight:800;border-radius:14px;">🔗 Đăng nhập bằng Mã Gia Đình</button>
    </div>
    ${brandFooterHtml()}
  </div>`;
  if (step === 2) return `<div class="setup">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;width:100%;">
      <button type="button" class="corner-back-link" data-act="setupBackTo1" style="cursor:pointer;border:none;display:inline-flex;align-items:center;gap:6px;font-weight:800;font-size:13px;color:#64748b;background:#ffffff;padding:7px 14px;border-radius:999px;border:1px solid #e2e8f0;box-shadow:0 2px 6px rgba(0,0,0,0.03);">
        <span>← Quay lại bước 1</span>
      </button>
      <span class="pill primary" style="font-weight:800;font-size:11px;">Bước 2 / 3</span>
    </div>
    ${steps}
    <div class="card">${pinPad()}</div>
    <p class="tip sun" style="margin-top:14px;text-wrap:balance;">🔒 Mật khẩu (4–6 số) dùng chung cho cả Bố và Mẹ để vào <b>Góc Quản Lý</b>.</p>
    ${brandFooterHtml()}
  </div>`;
  const kAge = Number(d.kAge) || 6;
  const grp = getAgeGroup(kAge);
  const kAv = d.kAvatar || grp.avatars[0];
  return `<div class="setup">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;width:100%;">
      <button type="button" class="corner-back-link" data-act="setupBackToPin" style="cursor:pointer;border:none;display:inline-flex;align-items:center;gap:6px;font-weight:800;font-size:13px;color:#64748b;background:#ffffff;padding:7px 14px;border-radius:999px;border:1px solid #e2e8f0;box-shadow:0 2px 6px rgba(0,0,0,0.03);">
        <span>← Quay lại đặt PIN</span>
      </button>
      <span class="pill mint" style="font-weight:800;font-size:11px;">Bước 3 / 3</span>
    </div>
    ${steps}
    <div class="card">
      <div class="card-title">🌟 Lập hồ sơ & Chọn giao diện cho bé</div>
      <div class="field" style="margin-top:12px"><span class="lbl">Tên gọi / Biệt danh</span>
        <input class="input" id="su_kname" maxlength="24" placeholder="VD: Mật Bếu, Bắp, Minh..." value="${esc(d.kName || '')}"></div>
      ${ageProfileSectionHtml('su_k', kAge, kAv, d.kTheme || grp.defaultTheme, d.kFont || grp.defaultFont)}
      <div class="field"><span class="lbl">Màu nền đại diện</span>${colorPick('su_kcolor', d.kColor)}</div>
      <button class="btn btn-mint btn-lg btn-block" data-act="setupFinish">🎉 Hoàn tất & Bắt đầu!</button>
      <p class="small muted center" style="margin-top:10px">Có thể thêm Bố/Mẹ và các bé khác bất cứ lúc nào trong Góc Quản Lý.</p>
    </div>
    ${brandFooterHtml()}
  </div>`;
}

/* ================== MÀN HÌNH: KẾT NỐI DÀNH RIÊNG CHO CON ================== */
function viewKidConnect() {
  return `<div class="setup" style="max-width:440px;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;width:100%;">
      <a href="../index.html" class="corner-back-link" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px;font-weight:800;font-size:13px;color:#64748b;background:#ffffff;padding:7px 14px;border-radius:999px;border:1px solid #e2e8f0;box-shadow:0 2px 6px rgba(0,0,0,0.03);">
        <span>← Quay lại cổng</span>
      </a>
      <span class="pill sun" style="font-weight:800;font-size:11px;">🌟 App Của Con</span>
    </div>
    <div class="center" style="margin-bottom:16px;">
      <div class="logo-box-cute" style="background:linear-gradient(135deg,#ff8da6,#ff5277);font-size:36px;box-shadow:0 8px 24px rgba(255,82,119,0.25);">🌟</div>
      <h1 class="app-title" style="font-size:24px;margin-top:10px;">Chào Con Tự Lập!</h1>
      <p class="muted bold" style="margin-top:4px;font-size:13px;line-height:1.45;text-wrap:balance;">
        Nhập Mã Gia Đình từ điện thoại Bố Mẹ để nhận thời gian biểu nhé!
      </p>
    </div>

    <div class="card" style="padding:22px 20px;border-radius:24px;box-shadow:0 10px 30px rgba(0,0,0,0.05);">
      <div class="card-title" style="font-size:16px;font-weight:900;text-align:center;margin-bottom:14px;color:#1e293b;">
        📲 Nhập Mã Gia Đình Của Bố Mẹ
      </div>
      <p class="small muted bold center" style="margin-bottom:14px;text-wrap:balance;">
        Bố Mẹ xem mã trên điện thoại (mục <b>Gia Đình</b>):
      </p>
      
      <div style="background:#f8fafc;border:2px dashed #cbd5e1;border-radius:18px;padding:16px 14px;text-align:center;">
        <label for="kc_code" style="font-size:11px;font-weight:900;color:#94a3b8;letter-spacing:1px;display:block;margin-bottom:6px;">NHẬP MÃ GIA ĐÌNH</label>
        <input class="input code-input" id="kc_code" maxlength="10" autocomplete="off" autocapitalize="characters" placeholder="VD: SNH-6689" value="${esc(S.settings.pairCode || '')}" style="font-size:24px;font-weight:900;letter-spacing:3px;text-align:center;color:#ff5277;background:#fff;border-radius:14px;height:52px;">
      </div>

      <button class="btn btn-primary btn-lg btn-block" data-act="kidConnectDo" style="margin-top:16px;border-radius:16px;font-weight:900;font-size:16px;padding:14px;box-shadow:0 8px 20px rgba(255,82,119,0.3);">
        🚀 Nhận Lịch Trình Của Con
      </button>

      <div style="margin-top:16px;padding-top:14px;border-top:1px dashed #e2e8f0;text-align:center;">
        <span class="small bold muted">Hoặc Bố Mẹ quét mã QR trên máy:</span><br>
        <button type="button" class="btn btn-soft btn-sm" data-act="kidScanQrPrompt" style="margin-top:8px;border-radius:12px;font-weight:800;">
          📷 Quét Mã QR Ghép Nối
        </button>
      </div>
    </div>
    
    <div style="text-align:center;margin-top:16px;font-size:11px;color:#94a3b8;font-weight:700;">
      MinhTT @ 2026 • Ứng dụng dành riêng cho con
    </div>
  </div>`;
}

/* ================== BÀN PHÍM PIN (LINH HOẠT 4–6 SỐ) ================== */
function pinTexts() {
  const p = UI.pin;
  const hasParentPin = S.parents && S.parents.some(x => x.pin);
  const map = {
    'setup-create': ['Tạo Mật Khẩu Bố Mẹ', 'Nhập 4–6 số dễ nhớ dùng chung cho Bố & Mẹ'],
    'setup-confirm': ['Xác nhận lại Mật Khẩu', 'Nhập lại đúng số vừa tạo'],
    'unlock': ['Góc Quản Lý Bố Mẹ 🔒', hasParentPin ? 'Nhập mã PIN (4–6 số) để mở khóa' : 'Chưa đặt PIN? Nhập 0000 hoặc bấm mở ngay bên dưới'],
    'kid-device-gate': ['Khóa Bảo Vệ Bố Mẹ 🔒', hasParentPin ? 'Nhập Mật Khẩu Bố Mẹ (4–6 số) để đổi bé hoặc làm mới máy này' : 'Chưa đặt PIN? Nhập 0000 hoặc bấm mở ngay bên dưới'],
    'change-create': ['Mật Khẩu Mới', 'Nhập 4–6 số mới'],
    'change-confirm': ['Xác nhận Mật Khẩu Mới', 'Nhập lại đúng số vừa tạo'],
    'newparent-create': ['Mật khẩu cho ' + (UI.newParent ? UI.newParent.name : 'Bố/Mẹ'), 'Nhập 4–6 số'],
    'newparent-confirm': ['Xác nhận lại mật khẩu', '']
  };
  return map[p.purpose] || ['Nhập mã PIN', ''];
}
function pinPad() {
  const p = UI.pin; const [title, sub] = pinTexts();
  const locked = UI.lockUntil > Date.now();
  const msg = locked ? `Sai nhiều lần. Thử lại sau ${Math.ceil((UI.lockUntil - Date.now()) / 1000)} giây` : (p.msg || sub);
  const chips = (p.purpose === 'unlock' && S.parents.length > 1)
    ? `<div class="parent-chips">${S.parents.map(x => `<button class="parent-chip ${x.id === p.parentId ? 'sel' : ''}" data-act="pinParent" data-id="${x.id}"><span style="font-size:22px">${x.avatar}</span>${esc(x.name)}</button>`).join('')}</div>` : '';
  const numDots = Math.max(4, Math.min(6, Math.max(p.buf.length, 4)));
  const hasParentPin = S.parents && S.parents.some(x => x.pin);

  return `<div class="pin-wrap">${chips}
    <div class="pin-title">${esc(title)}</div>
    <div class="pin-sub ${p.err || locked ? 'err' : ''}">${esc(msg)}</div>
    <div class="pin-dots ${p.err ? 'shake' : ''}">${[0, 1, 2, 3, 4, 5].slice(0, numDots).map(i => `<span class="${i < p.buf.length ? 'on' : ''}"></span>`).join('')}</div>
    <div class="pin-keys">
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button class="pin-key" data-act="pinKey" data-k="${n}" ${locked ? 'disabled' : ''}>${n}</button>`).join('')}
      <button class="pin-key ghost" data-act="pinCancel" aria-label="Hủy">✕</button>
      <button class="pin-key" data-act="pinKey" data-k="0" ${locked ? 'disabled' : ''}>0</button>
      <button class="pin-key ghost" data-act="pinDel" aria-label="Xóa">⌫</button>
    </div>
    ${p.buf.length >= 4 ? `<button class="btn btn-primary btn-sm" style="margin-top:14px;border-radius:14px;padding:9px 24px;font-weight:900;" data-act="pinSubmit">✓ Xác nhận (${p.buf.length} số)</button>` : ''}
    <div style="margin-top:16px;text-align:center;">
      <button type="button" class="btn-link" data-act="pinBypassOrHelp" style="background:none;border:none;color:#64748b;font-size:12.5px;font-weight:700;text-decoration:underline;cursor:pointer;padding:6px 12px;">
        ${!hasParentPin ? '✨ Chưa cài mật khẩu? Bấm đây để mở ngay' : '❓ Chưa cài hoặc quên mật khẩu? Bấm đây'}
      </button>
    </div>
  </div>`;
}
function startPin(purpose, opts = {}) {
  UI.pin = Object.assign({ buf: '', purpose, first: null, msg: '', err: false, parentId: (S.parents[0] || {}).id, back: 'picker' }, opts);
  if (!purpose.startsWith('setup')) UI.mode = 'pin';
}
function pinError(msg, nextPurpose) {
  const p = UI.pin; p.buf = ''; p.err = true; p.msg = msg; vibrate([60, 40, 60]); sound('oops');
  if (nextPurpose) { p.purpose = nextPurpose; p.first = null; }
  render();
  setTimeout(() => { p.err = false; render(); }, 450);
}
function pinComplete() {
  const p = UI.pin, code = p.buf;
  if (code.length < 4) return;
  switch (p.purpose) {
    case 'setup-create': case 'change-create': case 'newparent-create':
      p.first = code; p.buf = ''; p.msg = ''; p.purpose = p.purpose.replace('create', 'confirm'); break;
    case 'setup-confirm':
      if (code !== p.first) return pinError('Mật khẩu không khớp, tạo lại nhé', 'setup-create');
      UI.setupDraft.pin = hashPin(code); UI.setupStep = 3; break;
    case 'change-confirm': {
      if (code !== p.first) return pinError('Không khớp, nhập lại mật khẩu mới', 'change-create');
      const par = S.parents.find(x => x.id === p.parentId); if (par) par.pin = hashPin(code);
      save(); UI.mode = 'parent'; toast('Đã đổi mật khẩu', '🔒', 'mint'); break;
    }
    case 'newparent-confirm':
      if (code !== p.first) return pinError('Không khớp, nhập lại', 'newparent-create');
      S.parents.push(Object.assign({}, UI.newParent, { pin: hashPin(code) }));
      save(); UI.mode = 'parent'; UI.parentTab = 'family'; toast('Đã thêm ' + UI.newParent.name, UI.newParent.avatar, 'mint'); UI.newParent = null; break;
    case 'unlock': {
      const enteredHash = hashPin(code);
      let par = S.parents.find(x => x.id === p.parentId && x.pin === enteredHash);
      if (!par) par = S.parents.find(x => x.pin === enteredHash);
      const famCode4 = (getFamilyCode() || '').replace(/\D/g, '').slice(-4);
      const isRescueCode = (code === '0000' || code === '1234' || (famCode4 && code === famCode4));
      const hasAnyPin = S.parents && S.parents.some(x => x.pin);

      if (par || isRescueCode || !hasAnyPin) {
        if (!par) {
          if (!S.parents || !S.parents.length) S.parents = [{ id: 'p1', name: 'Bố Mẹ', avatar: '👨', pin: '' }];
          par = S.parents[0];
        }
        UI.parentId = par.id; UI.mode = 'parent'; UI.lastActive = Date.now(); UI.failCount = 0;
        sound('check'); toast('Xin chào ' + par.name + '!', par.avatar, 'primary');
        const pend = pendingItems().length; if (pend) UI.parentTab = 'approve';
      } else {
        UI.failCount++;
        if (UI.failCount >= 5) { UI.lockUntil = Date.now() + 30000; UI.failCount = 0; setTimeout(render, 30500); }
        return pinError('Sai mật khẩu rồi. Thử 0000 hoặc bấm "Quên mã" bên dưới');
      }
      break;
    }
    case 'kid-device-gate': {
      const enteredHash = hashPin(code);
      let par = S.parents.find(x => x.pin === enteredHash);
      const famCode4 = (getFamilyCode() || '').replace(/\D/g, '').slice(-4);
      const isRescueCode = (code === '0000' || code === '1234' || (famCode4 && code === famCode4));
      const hasAnyPin = S.parents && S.parents.some(x => x.pin);

      if (par || isRescueCode || !hasAnyPin) {
        UI.mode = 'kid';
        UI.failCount = 0;
        sound('check');
        openModal('kidDeviceManager');
        if (isRescueCode && !par) toast('Đã mở bằng mã dự phòng (0000)', '🔓', 'mint');
      } else {
        UI.failCount++;
        if (UI.failCount >= 5) { UI.lockUntil = Date.now() + 30000; UI.failCount = 0; setTimeout(render, 30500); }
        return pinError('Sai mật khẩu rồi. Thử 0000 hoặc bấm "Quên mã" bên dưới');
      }
      break;
    }
  }
  render();
}
function viewPinScreen() {
  return `<div class="screen picker">
    <div style="width:100%;max-width:520px"><button class="icon-btn" data-act="pinCancel" aria-label="Quay lại">←</button></div>
    ${pinPad()}
  </div>`;
}

/* ================== MÀN HÌNH: CHỌN NGƯỜI DÙNG ================== */
function viewPicker() {
  const info = dayInfo();

  const tiles = S.kids.map(k => {
    const p = progress(k);
    const sick = healthOf(k) === 'sick_full';
    const age = Number(k.age) || 6;
    const grp = getAgeGroup(age);
    const lv = levelOf(k).cur;
    const av = smartAvatarForAge(age, k.avatar);
    const kTheme = THEMES[k.theme || grp.defaultTheme] || THEMES.candy;
    return `<div class="kid-tile-cute" style="--tile-accent:${kTheme.primary}">
      <button type="button" class="kid-tile-main-btn" data-act="enterKid" data-id="${k.id}">
        <div class="kid-avatar-halo" style="background:${k.color || KID_COLORS[0]}">${renderAvatarArt(av, age)}</div>
        <div class="name">${esc(displayName(k))}</div>
        <div class="kid-stage-line">${lv.icon} ${esc(lv.name)} • ${esc(grp.short)}</div>
        <div class="kid-tile-meta">
          <span class="pill-cute mint">${svgIcon('ageBadge')} ${age} tuổi</span>
          <span class="pill-cute sun">${svgIcon('star')} ${k.stars}</span>
          ${k.streak ? `<span class="pill-cute rose">${svgIcon('fire')} ${k.streak}</span>` : ''}
        </div>
        ${sick ? '<div class="small bold muted">🛌 Nghỉ ngơi</div>' : `
          <div class="tile-progress-box">
            <div class="mini-bar-cute"><i style="width:${p.total ? Math.round((p.done + p.pending) * 100 / p.total) : 0}%"></i></div>
            <div class="tiny bold muted">${p.done + p.pending}/${p.total} mục tiêu hôm nay</div>
          </div>
        `}
      </button>
    </div>`;
  }).join('');

  const pend = pendingItems().length;
  const isKidOnly = isKidOnlyDevice();
  return `<div class="screen picker-cute">
    <!-- Thanh trên cùng: Thứ/Ngày bên trái • Góc Quản lý & Cài đặt bên phải -->
    <div class="picker-top-bar">
      <div class="today-pill-cute">
        ${svgIcon('calendar')}
        <span>${fmtDate(todayKey())}</span>
      </div>
      <div class="picker-top-actions">
        ${isKidOnly ? `
          <a href="../index.html" class="corner-guide-btn" title="Quay lại cổng chọn" style="text-decoration:none;">
            <span>← Cổng</span>
          </a>
        ` : `
          <a href="../index.html" class="corner-guide-btn" title="Quay lại cổng chọn" style="text-decoration:none;margin-right:2px;">
            <span>← Cổng</span>
          </a>
          <button class="corner-guide-btn parent-top-btn" data-act="openParent" title="Vào Góc Quản Lý / Bố Mẹ">
            ${svgIcon('lock')}
            <span>Quản lý</span>
            ${pend ? `<span class="badge-cute">${pend}</span>` : ''}
          </button>
          <button class="corner-guide-btn" data-act="quickSettingsOpen" title="Cài đặt Giao diện, Font, Hướng dẫn cài App & Bản quyền">
            ${svgIcon('settings')}
            <span>Cài đặt</span>
          </button>
        `}
      </div>
    </div>

    <div class="picker-center-body">
      <div class="picker-head-cute">
        <div class="logo-box-cute">${svgIcon('logo')}</div>
        <h1 class="app-title-cute">Mỗi Ngày Tốt Hơn</h1>
        <p class="app-subtitle-cute">Thời gian biểu & Ươm mầm thói quen tích cực mỗi ngày</p>
      </div>

      <div class="picker-greeting">Hôm nay ai dùng nè? ✨</div>

      <div class="kid-tiles-cute">${tiles}</div>
    </div>

    ${brandFooterHtml()}
  </div>`;
}

/* ================== MÀN HÌNH NGƯỜI DÙNG (BÉ / TEEN / NGƯỜI LỚN) ================== */
function mascotMessage(kid, p) {
  const h = healthOf(kid);
  const age = Number(kid.age) || 6;
  const grp = getAgeGroup(age);
  const call = age >= 12 ? 'bạn' : 'con';
  if (h === 'sick_full') return ['🛌', `Hôm nay ${kid.name} nghỉ ngơi. Chúc ${call} mau khỏe lại nhé!`];
  if (!p.total) return ['😎', `Hôm nay không có mục tiêu nào. Tận hưởng ngày vui vẻ nhé!`];
  if (p.done === p.total) return ['🏆', `Xuất sắc! ${kid.name} đã hoàn thành 100% mục tiêu hôm nay!`];
  if (p.redo) return ['💪', `Có mục cần hoàn thiện lại. Cố lên, ${kid.name} làm được mà!`];
  if (p.done + p.pending === 0) return [renderAvatarArt(kid.avatar, age), `Chào ${kid.name}! Cùng chinh phục mục tiêu đầu tiên trong ngày nhé!`];
  if (p.done + p.pending >= p.total / 2) return ['🚀', `Đã đi được hơn nửa chặng đường hôm nay rồi! Bứt phá tiếp nào!`];
  return ['✨', `Tuyệt lắm! ${kid.name} đã hoàn thành ${p.done + p.pending}/${p.total} mục tiêu.`];
}
function viewKid() {
  const kid = findKid(UI.kidId);
  if (!kid) { UI.mode = 'picker'; return viewPicker(); }
  const age = Number(kid.age) || 6;
  const selfM = isSelfManaged(kid);
  const isKidOnly = isKidOnlyDevice();
  let body = '';
  if (UI.kidTab === 'tasks') body = kidTasksTab(kid);
  else if (UI.kidTab === 'shop') body = kidShopTab(kid);
  else body = kidStatsTab(kid);
  const nav = [
    ['tasks', svgIcon('tabTasks'), age >= 12 ? 'Lịch trình' : 'Việc của con'],
    ['shop', svgIcon('tabShop'), age >= 12 ? 'Phần thưởng' : 'Đổi quà'],
    ['stats', svgIcon('tabStats'), 'Thành tích']
  ];
  return `<div class="screen">
    <header class="topbar"><div class="topbar-inner">
      <button type="button" class="avatar-star-trigger" data-act="kidStarModal" title="Chạm để xem Sao & Cấp độ">
        ${avatarHtml(kid)}
        <span class="avatar-star-badge">${svgIcon('star')} ${kid.stars}</span>
      </button>
      <div class="grow" style="min-width:0;cursor:pointer;" data-act="kidStarModal">
        <div class="hello truncate">Chào ${esc(displayName(kid))}! <span class="pill mint" style="font-size:11px;padding:2px 7px;vertical-align:middle;">${svgIcon('ageBadge')} ${age}t</span></div>
        <div class="hello-sub truncate">${levelOf(kid).cur.icon} ${esc(levelOf(kid).cur.name)} • ${getAgeGroup(age).short}${kid.streak ? ` • 🔥 ${kid.streak}` : ''}${selfM ? ' • 🔓 Tự quản lý' : ''}</div>
      </div>
      ${selfM ? `<button class="btn btn-soft btn-xs" data-act="taskEdit" data-session="${UI.session}" title="Tự thêm việc mới">＋ Việc</button>` : ''}
      <button type="button" class="kid-theme-pill-btn" data-act="kidCustomizerOpen" data-id="${kid.id}" title="Đổi giao diện, màu sắc & phong cách Nam / Nữ">
        <span>🎨</span><span class="hide-compact">Giao diện</span>
      </button>
      ${isKidOnly && S.kids.length <= 1 ? '' : `<button class="icon-btn" data-act="exitKid" aria-label="Về màn hình chọn">${svgIcon('home')}</button>`}
    </div></header>
    <main class="content">${body}${brandFooterHtml()}</main>
    <nav class="bottomnav"><div class="bottomnav-inner">
      ${nav.map(([k, i, l]) => `<button class="nav-btn ${UI.kidTab === k ? 'active' : ''}" data-act="kidTab" data-tab="${k}"><span class="ico">${i}</span>${l}</button>`).join('')}
    </div></nav>
  </div>`;
}
function kidTasksTab(kid) {
  const info = dayInfo(); const p = progress(kid);
  const goal = kid.goalRewardId && findReward(kid.goalRewardId);
  const h = healthOf(kid);
  const selfM = isSelfManaged(kid);
  const doneCount = p.done + p.pending;
  const todoCount = Math.max(0, p.total - doneCount);
  const hpPct = p.total ? Math.round(doneCount * 100 / p.total) : 100;
  const overdueAll = overdueTasksFor(kid, todayKey());

  let out = `<div class="game-hp-card ${overdueAll.length ? 'has-overdue' : ''} ${hpPct === 100 && p.total ? 'is-full' : ''}">
    <div class="hp-top-row">
      <div class="hp-title-left">
        <span class="hp-heart-ico">${hpPct === 100 && p.total ? '🏆' : overdueAll.length ? '⚡' : '❤️'}</span>
        <span class="hp-title-txt">Năng lượng</span>
        <span class="pill primary hp-day-pill">${DAY_TYPES[info.type].icon} ${info.type === 'school' ? 'Đi học' : (info.holiday || 'Nghỉ')}</span>
        ${h === 'sick_light' ? '<span class="pill sky hp-day-pill">🤒 Giảm việc</span>' : ''}
      </div>
      ${overdueAll.length
        ? `<button type="button" class="hp-overdue-badge" data-act="jumpOverdue" title="Chạm để chuyển tới việc quá hạn">⏰ ${overdueAll.length} việc quá hạn</button>`
        : `<span class="hp-pct-pill">${hpPct === 100 && p.total ? '🎉 Đầy 100%' : `${hpPct}% HP`}</span>`}
    </div>
    <div class="hp-bar-outer" role="progressbar" aria-valuenow="${hpPct}" aria-valuemin="0" aria-valuemax="100">
      <div class="hp-bar-done" style="width:${hpPct}%"></div>
      <div class="hp-bar-segments"></div>
    </div>
    <div class="hp-split-stats">
      <div class="hp-stat-box is-done">
        <span class="hp-stat-ico">✅</span>
        <div class="grow" style="min-width:0;">
          <div class="hp-stat-lbl truncate">Đã thực hiện</div>
          <div class="hp-stat-val truncate">${doneCount}/${p.total} việc</div>
        </div>
      </div>
      <div class="hp-stat-box is-todo">
        <span class="hp-stat-ico">🎯</span>
        <div class="grow" style="min-width:0;">
          <div class="hp-stat-lbl truncate">Chưa thực hiện</div>
          <div class="hp-stat-val truncate">${todoCount} việc</div>
        </div>
      </div>
    </div>
  </div>`;

  if (kid.message && kid.message.text && !kid.message.readAt) {
    out += `<div class="msg-card"><div class="msg-ico">💌</div><div class="grow">
      <div class="bold small" style="opacity:.8">${esc(kid.message.from)} nhắn:</div>
      <div class="msg-text">${esc(kid.message.text)}</div>
      <div class="row" style="margin-top:10px;gap:8px"><button class="btn btn-white btn-sm" data-act="msgListen">🔊 Nghe</button>
      <button class="btn btn-rose btn-sm" data-act="msgRead">❤️ Đã nhận lời nhắn!</button></div></div></div>`;
  }
  if (goal) {
    const pct = Math.min(100, Math.round(kid.stars * 100 / goal.cost));
    out += `<div class="goal-box"><div class="row between"><b>🎯 Mục tiêu: ${goal.icon} ${esc(goal.title)}</b><span class="bold">${Math.min(kid.stars, goal.cost)}/${goal.cost}⭐</span></div>
      <div class="mini-bar sun" style="margin-top:8px;height:14px"><i style="width:${pct}%"></i></div>
      <div class="tiny bold muted" style="margin-top:4px">${pct >= 100 ? '🎉 Đủ sao rồi! Vào “Phần thưởng” ngay nhé!' : `Còn ${goal.cost - kid.stars}⭐ nữa thôi!`}</div></div>`;
  }
  if (h === 'sick_full') return out + `<div class="empty" style="margin-top:14px"><span class="big">🛌</span>Hôm nay được nghỉ ngơi hoàn toàn.<br>Chuỗi 🔥 vẫn được bảo toàn!</div>`;

  out += `<div class="sessions">${SESSIONS.map(s => {
    const sp = progress(kid, todayKey(), s); const m = SESSION_META[s];
    const complete = sp.total && sp.done === sp.total;
    return `<button class="session-btn ${m.cls} ${UI.session === s ? 'active' : ''} ${complete ? 'complete' : ''}" data-act="session" data-s="${s}">
      ${sp.overdue ? `<span class="sess-ov-dot">⏰ ${sp.overdue}</span>` : ''}
      <span class="ico">${complete ? '✅' : m.icon}</span><span class="txt"><span class="lbl">${m.short}</span><br><span class="cnt">${sp.done + sp.pending}/${sp.total} việc</span></span></button>`;
  }).join('')}</div>`;

  const list = tasksFor(kid, todayKey(), UI.session);
  out += `<div class="row between" style="margin:0 2px 10px"><b style="font-size:18px">${SESSION_META[UI.session].icon} ${SESSION_META[UI.session].label}</b>
    <div class="row" style="gap:6px">
      ${selfM ? `<button class="btn btn-primary btn-sm" data-act="taskEdit" data-session="${UI.session}">＋ Thêm việc</button>` : ''}
      <button class="btn btn-white btn-sm" data-act="speakSession">🔊 Nghe lịch trình</button>
    </div></div>`;
  if (!list.length) return out + `<div class="empty"><span class="big">🎈</span>Buổi này không có mục tiêu nào. Thư giãn vui vẻ nhé!</div>`;
  out += `<div class="task-grid">${list.map(t => kidTaskCard(kid, t)).join('')}</div>`;
  const sp = progress(kid, todayKey(), UI.session);
  if (sp.total && sp.done === sp.total) out += `<div class="celebrate">🏆 Đã hoàn thành xuất sắc cả ${SESSION_META[UI.session].label.toLowerCase()}!</div>`;
  else if (sp.total && sp.done + sp.pending === sp.total) out += `<div class="celebrate">🎉 Đã báo xong hết việc trong buổi!</div>`;
  return out;
}
function kidTaskCard(kid, rawTask) {
  const t = taskViewForKid(kid, rawTask);
  const grp = getAgeGroup(kid.age);
  const st = statusOf(kid, t.id); const rec = dayRec(kid);
  const overdue = isTaskOverdue(kid, t);
  const selfM = isSelfManaged(kid);
  let action = '';
  if (st === 'todo') action = `<div class="task-action"><button class="btn btn-primary btn-lg" data-act="kidDone" data-id="${t.id}">${grp.doneBtn}</button></div>`;
  else if (st === 'pending') action = `<div class="task-action"><div class="status-box pending grow">${grp.waitText}</div><button class="btn btn-soft" data-act="kidUndo" data-id="${t.id}" aria-label="Hủy">↩️</button></div>`;
  else if (st === 'done') {
    const great = rec.grade && rec.grade[t.id] === 'great';
    const award = (rec.award && rec.award[t.id]) || t.stars;
    action = `<div class="status-box done">${great ? `🌟 Xuất sắc! +${award}⭐` : `✅ Đã hoàn thành! +${award}⭐`}</div>`;
  }
  else if (st === 'redo') action = `<div class="redo-note">😅 Chưa đạt${Number(t.penalty ?? 1) ? ` (−${t.penalty ?? 1}⭐)` : ''}: ${esc(rec.note[t.id] || 'Làm lại cẩn thận hơn nhé')}</div>
    <div class="task-action"><button class="btn btn-rose btn-lg" data-act="kidDone" data-id="${t.id}">💪 Đã làm lại xong!</button></div>`;
  return `<div class="task is-${st} ${overdue ? 'is-overdue' : ''}" id="task-${t.id}">
    <div class="task-top">
      <div class="task-emoji">${t.icon}</div>
      <div class="grow">
        <div class="task-title">${esc(t.title)}</div>
        ${t.note ? `<div class="task-note">${esc(t.note)}</div>` : ''}
        ${t.criteria && st !== 'done' ? `<ul class="criteria">${t.criteria.split('\n').filter(s => s.trim()).map(c => `<li>${esc(c.trim())}</li>`).join('')}</ul>` : ''}
        <div class="task-meta">
          <span class="pill ${overdue ? 'rose' : 'primary'}">${overdue ? '⏰ Quá hạn • ' : '🕒 '}${esc(t.time)}</span>
          <span class="pill sun">+${t.stars}⭐</span>
        </div>
      </div>
      <div class="row" style="gap:4px">
        ${selfM ? `<button class="speak-btn" data-act="taskEdit" data-id="${t.id}" aria-label="Sửa việc" title="Sửa việc">✏️</button>` : ''}
        <button class="speak-btn" data-act="speakTask" data-id="${t.id}" aria-label="Đọc to">🔊</button>
      </div>
    </div>${action}</div>`;
}
function kidShopTab(kid) {
  const selfM = isSelfManaged(kid);
  const waiting = kid.vouchers.filter(v => v.status === 'waiting');
  const given = kid.vouchers.filter(v => v.status === 'given').slice(0, 8);
  let out = `<div class="wallet"><div style="font-size:50px">🪙</div><div class="grow"><div class="bold">Ví sao của ${esc(kid.name)}</div><div class="big">${kid.stars} ⭐</div></div>
    ${selfM ? `<button class="btn btn-white btn-sm" data-act="rewardEdit">＋ Thêm quà</button>` : ''}</div>
    <p class="tip sun" style="margin-top:12px">💡 Chọn 🎯 một món làm <b>mục tiêu</b> rồi kiên trì tích sao mỗi ngày. Quà càng lớn càng cần nhiều ngày cố gắng!</p>`;
  if (waiting.length) out += `<div class="section-title">🎟️ Quà đang chờ Bố Mẹ trao</div><div class="list">${waiting.map(v =>
    `<div class="list-row pending"><div class="ico">${v.icon}</div><div class="grow"><div class="t">${esc(v.title)}</div><div class="s">Đổi ${fmtTime(v.t)} • ${v.cost}⭐</div></div><span class="pill sun">⏳ Chờ trao</span></div>`).join('')}</div>`;
  [1, 2, 3, 4].forEach(tier => {
    const items = S.rewards.filter(r => r.active !== false && Number(r.tier) === tier).sort((a, b) => a.cost - b.cost);
    if (!items.length) return;
    out += `<div class="section-title">${TIERS[tier].icon} ${TIERS[tier].label} <span class="pill">${TIERS[tier].hint}</span></div><div class="reward-grid">`;
    out += items.map(r => {
      const can = kid.stars >= r.cost; const pct = Math.min(100, Math.round(kid.stars * 100 / r.cost));
      const isGoal = kid.goalRewardId === r.id;
      return `<div class="reward ${isGoal ? 'is-goal' : ''}">
        <div class="reward-ico">${r.icon}</div>
        <div class="grow">
          <div class="reward-title">${esc(r.title)}</div>
          <div class="reward-desc">${esc(r.desc || '')}</div>
          <div class="row" style="margin-top:6px;gap:8px"><b style="color:#a06a00">${r.cost}⭐</b><div class="mini-bar sun grow"><i style="width:${pct}%"></i></div></div>
          <button class="goal-btn" data-act="setGoal" data-id="${r.id}">${isGoal ? '🎯 Đang là mục tiêu (bỏ chọn)' : '🎯 Chọn làm mục tiêu'}</button>
        </div>
        <div class="row" style="gap:6px">
          ${selfM ? `<button class="icon-btn" data-act="rewardEdit" data-id="${r.id}" title="Sửa quà">✏️</button>` : ''}
          ${can ? `<button class="btn btn-sun btn-sm" data-act="redeem" data-id="${r.id}">🎁 Đổi</button>`
                : `<div class="center tiny bold muted" style="width:70px">Còn ${r.cost - kid.stars}⭐<br>≈${daysNeeded(r.cost - kid.stars)} ngày</div>`}
        </div>
      </div>`;
    }).join('') + '</div>';
  });
  if (given.length) out += `<div class="section-title">🎉 Quà đã nhận</div><div class="card">${given.map(v =>
    `<div class="hist-row"><div class="hist-ico">${v.icon}</div><div class="grow bold">${esc(v.title)}</div><span class="tiny muted bold">${fmtTime(v.givenAt || v.t)}</span></div>`).join('')}</div>`;
  return out;
}
function weekChart(kid) {
  const days = []; for (let i = 6; i >= 0; i--) days.push(addDays(todayKey(), -i));
  return `<div class="week-chart">${days.map(k => {
    const rec = kid.days[k]; let pct = 0, label = '–', cls = 'none';
    if (rec && rec.health === 'sick_full') { label = '🧸'; pct = 100; cls = 'none'; }
    else if (rec) { const p = progress(kid, k); pct = p.total ? Math.round(p.done * 100 / p.total) : 0; label = pct + '%'; cls = pct >= S.settings.streakThreshold ? '' : (pct > 0 ? 'low' : 'none'); }
    return `<div class="week-col"><span class="p">${label}</span><div class="week-bar ${cls}" style="height:${Math.max(4, pct)}%"></div><span class="d">${k === todayKey() ? 'Nay' : WD_SHORT[parseKey(k).getDay()]}</span></div>`;
  }).join('')}</div>`;
}
function historyList(kid, limit = 30) {
  if (!kid.history.length) return `<div class="muted bold center" style="padding:14px">Chưa có hoạt động nào.</div>`;
  return kid.history.slice(0, limit).map(h => `<div class="hist-row"><div class="hist-ico">${h.i || '⭐'}</div>
    <div class="grow"><div class="bold small">${esc(h.r)}</div><div class="tiny muted bold">${fmtTime(h.t)}${h.by ? ' • ' + esc(h.by) : ''}</div></div>
    <span class="delta ${h.d > 0 ? 'plus' : 'minus'}">${h.d > 0 ? '+' : ''}${h.d}⭐</span></div>`).join('');
}
function kidStatsTab(kid) {
  const lv = levelOf(kid);
  return `<div class="level-card"><div class="ico">${lv.cur.icon}</div><div class="grow">
      <div class="bold" style="opacity:.85">Cấp ${lv.idx + 1}</div><div style="font-family:var(--font-title);font-size:26px;font-weight:800">${lv.cur.name}</div>
      <div class="mini-bar" style="margin-top:8px;height:12px"><i style="width:${lv.pct}%"></i></div>
      <div class="tiny bold" style="margin-top:4px;opacity:.9">${lv.next ? `Còn ${lv.next.min - kid.totalEarned}⭐ nữa để lên ${lv.next.icon} ${lv.next.name}` : 'Con đã đạt cấp cao nhất!'}</div>
    </div></div>
    <div class="stats-grid" style="margin-top:14px">
      <div class="stat-tile"><div class="v">⭐ ${kid.stars}</div><div class="k">Sao đang có</div></div>
      <div class="stat-tile"><div class="v">🌟 ${kid.totalEarned}</div><div class="k">Tổng sao đã kiếm</div></div>
      <div class="stat-tile"><div class="v">🔥 ${kid.streak}</div><div class="k">Chuỗi ngày tự giác</div></div>
      <div class="stat-tile"><div class="v">🏅 ${kid.bestStreak}</div><div class="k">Kỷ lục chuỗi</div></div>
    </div>
    <div class="section-title">📊 7 ngày qua</div><div class="card">${weekChart(kid)}</div>
    <div class="section-title">📜 Hoạt động gần đây</div><div class="card">${historyList(kid, 25)}</div>`;
}

/* ================== GÓC BỐ MẸ ================== */
function pendingItems() {
  const out = [];
  const since = addDays(todayKey(), -7);
  S.kids.forEach(kid => Object.keys(kid.days).sort().forEach(k => {
    if (k < since) return;
    const rec = kid.days[k];
    Object.keys(rec.st || {}).forEach(tid => {
      if (rec.st[tid] === 'pending') { const t = findTask(tid); if (t) out.push({ kid, task: t, k }); }
    });
  }));
  return out;
}
const waitingVouchers = () => S.kids.flatMap(kid => kid.vouchers.filter(v => v.status === 'waiting').map(v => ({ kid, v })));

function viewParent() {
  const par = currentParent();
  if (!par) { UI.mode = 'picker'; return viewPicker(); }
  const pend = pendingItems().length + waitingVouchers().length;
  const tabs = [
    ['approve', svgIcon('tabApprove'), 'Chấm việc', pend],
    ['plan', svgIcon('calendar'), 'Lịch việc'],
    ['rewards', svgIcon('tabShop'), 'Quà'],
    ['family', svgIcon('tabFamily'), 'Gia đình'],
    ['settings', svgIcon('settings'), 'Cài đặt']
  ];
  const titles = { approve: 'Chấm việc hôm nay', plan: 'Thời gian biểu', rewards: 'Cửa hàng phần thưởng', family: 'Gia đình & kết nối', settings: 'Cài đặt & Bản quyền' };
  const navBtns = (side) => tabs.map(([k, i, l, b]) => `<button class="nav-btn ${UI.parentTab === k ? 'active' : ''}" data-act="parentTab" data-tab="${k}"><span class="ico">${i}</span>${side ? titles[k] : l}${b ? `<span class="badge">${b}</span>` : ''}</button>`).join('');
  let body = '';
  switch (UI.parentTab) {
    case 'approve': body = parentApproveTab(); break;
    case 'plan': body = parentPlanTab(); break;
    case 'rewards': body = parentRewardsTab(); break;
    case 'family': body = parentFamilyTab(); break;
    default: body = parentSettingsTab();
  }
  return `<div class="screen parent-screen">
    <aside class="p-side"><div class="brand">${svgIcon('star')} Mỗi Ngày Tốt Hơn</div>${navBtns(true)}
      <div style="margin-top:auto"><button class="btn btn-soft btn-block" data-act="lockParent">${svgIcon('lock')} Khóa & về màn hình chính</button></div></aside>
    <header class="topbar"><div class="topbar-inner">
      <div class="avatar sm" style="background:var(--primary-l)">${par.avatar}</div>
      <div class="grow" style="min-width:0;">
        <div class="p-title truncate">${titles[UI.parentTab]}</div>
        <div class="hello-sub truncate">${esc(par.name)} • ${fmtDate(todayKey())}</div>
      </div>
      <button class="btn btn-soft btn-sm" data-act="lockParent" title="Khóa & về màn hình chính">${svgIcon('lock')} Khóa</button>
    </div></header>
    <main class="content"><div class="inner">${body}${brandFooterHtml()}</div></main>
    <nav class="bottomnav"><div class="bottomnav-inner">${navBtns(false)}</div></nav>
  </div>`;
}

function parentApproveTab() {
  const items = pendingItems(); const vouchers = waitingVouchers();
  let out = '';
  if (!S.kids.length) return `<div class="empty"><span class="big">🧒</span>Chưa có bé nào. Vào tab Gia đình để tạo nick cho bé.</div>`;
  if (items.length) {
    out += `<div class="row between" style="margin:4px 4px 10px"><h3 style="font-size:19px">⏳ Con báo đã xong – chờ chấm (${items.length})</h3>
      <button class="btn btn-mint btn-sm" data-act="approveAll">✅ Đạt tất cả</button></div>
      <p class="small muted bold" style="margin:0 4px 10px">🌟 Xuất sắc = tự giác, làm kỹ hơn yêu cầu (+1⭐ thưởng) • ✅ Đạt = đúng tiêu chí • ↩️ Chưa đạt = làm lại & trừ sao</p><div class="list">`;
    out += items.map(({ kid, task, k }) => {
      const rec = kid.days[k] || {}; const wasRedo = rec.redo && rec.redo[task.id];
      const crit = task.criteria ? task.criteria.split('\n').filter(s => s.trim()).join(' • ') : '';
      return `<div class="list-row pending wrap-m">
      <div class="ico">${task.icon}</div>
      <div class="grow"><div class="t">${esc(task.title)}</div>
        <div class="s">${kid.avatar} ${esc(kid.name)} • ${SESSION_META[task.session].short} ${esc(task.time)}${k !== todayKey() ? ' • ' + fmtDate(k) : ''}${wasRedo ? ' • đã làm lại' : ''}</div>
        ${crit ? `<div class="s" style="color:var(--primary-d)">📏 ${esc(crit)}</div>` : ''}</div>
      <div class="row-actions">
        ${wasRedo ? '' : `<button class="btn btn-sun btn-sm" data-act="approve" data-grade="great" data-kid="${kid.id}" data-id="${task.id}" data-k="${k}">🌟 Xuất sắc +${Number(task.stars) + 1}</button>`}
        <button class="btn btn-mint btn-sm" data-act="approve" data-kid="${kid.id}" data-id="${task.id}" data-k="${k}">✅ Đạt +${task.stars}</button>
        <button class="btn btn-rose-soft btn-sm" data-act="rejectOpen" data-kid="${kid.id}" data-id="${task.id}" data-k="${k}">↩️ Chưa đạt</button>
      </div></div>`;
    }).join('') + '</div>';
  } else {
    out += `<div class="empty" style="padding:20px"><span class="big" style="font-size:40px">☕</span>Không có việc nào đang chờ chấm.${DEV.fid ? '' : '<br><span class="small">Mẹo: kết nối điện thoại Bố Mẹ với máy của bé ở tab <b>Gia đình</b> để chấm từ xa.</span>'}</div>`;
  }
  if (vouchers.length) {
    out += `<div class="section-title">🎟️ Quà bé đã đổi – chờ trao (${vouchers.length})</div><div class="list">` + vouchers.map(({ kid, v }) => `
      <div class="list-row wrap-m"><div class="ico">${v.icon}</div><div class="grow"><div class="t">${esc(v.title)}</div><div class="s">${kid.avatar} ${esc(kid.name)} • ${v.cost}⭐ • ${fmtTime(v.t)}</div></div>
      <div class="row-actions"><button class="btn btn-sun btn-sm" data-act="giveVoucher" data-kid="${kid.id}" data-id="${v.id}">🎁 Đã trao</button>
      <button class="btn btn-soft btn-sm" data-act="refundVoucher" data-kid="${kid.id}" data-id="${v.id}">Hoàn sao</button></div></div>`).join('') + '</div>';
  }
  out += `<div class="section-title">👧 Hôm nay của các bé</div><div class="p-grid-2">`;
  out += S.kids.map(kid => {
    const h = healthOf(kid);
    return `<div class="card">
      <div class="kid-card-head">${avatarHtml(kid)}<div class="grow"><div class="bold" style="font-size:18px">${esc(kid.name)}</div>
        <div class="row" style="gap:6px;margin-top:2px"><span class="pill sun">⭐ ${kid.stars}</span><span class="pill rose">🔥 ${kid.streak}</span></div></div>
        <button class="btn btn-white btn-sm" data-act="kidDayOpen" data-kid="${kid.id}">📋 Chi tiết</button></div>
      ${h === 'sick_full' ? '<div class="tip" style="margin-top:12px">🛌 Nghỉ ốm cả ngày – giữ nguyên chuỗi 🔥</div>' : `<div class="sess-progress">${SESSIONS.map(s => {
        const p = progress(kid, todayKey(), s);
        return `<div>${SESSION_META[s].icon} ${SESSION_META[s].short}<div class="mini-bar" style="margin:6px 0 2px"><i style="width:${p.pct}%"></i></div>${p.done}/${p.total}${p.pending ? ` <span style="color:#a06a00">• ${p.pending}⏳</span>` : ''}</div>`;
      }).join('')}</div>`}
      <div style="margin-top:12px" class="seg full">
        ${[['normal', '🟢 Khỏe'], ['sick_light', '🤒 Mệt'], ['sick_full', '🛌 Nghỉ ốm']].map(([m, l]) => `<button class="${h === m ? 'on' : ''}" data-act="health" data-kid="${kid.id}" data-mode="${m}">${l}</button>`).join('')}
      </div>
      <div class="row" style="margin-top:12px">
        <button class="btn btn-mint-soft btn-sm grow" data-act="bonusOpen" data-kid="${kid.id}" data-sign="1">🌟 Thưởng sao</button>
        <button class="btn btn-rose-soft btn-sm grow" data-act="bonusOpen" data-kid="${kid.id}" data-sign="-1">⚠️ Trừ sao</button>
      </div>
      <button class="btn btn-primary btn-sm btn-block" style="margin-top:10px" data-act="msgOpen" data-kid="${kid.id}">💌 Nhắn lời khen cho con${kid.message && kid.message.text ? (kid.message.readAt ? ' <span class="pill mint">❤️ Con đã nghe</span>' : ' <span class="pill">Chưa nghe</span>') : ''}</button>
      </div>`;
  }).join('') + '</div>';
  return out;
}

function parentPlanTab() {
  const dt = UI.planDay;
  let out = `<div class="seg full" style="margin-bottom:14px">
    <button class="${dt === 'school' ? 'on' : ''}" data-act="planDay" data-d="school">🎒 Ngày đi học</button>
    <button class="${dt === 'weekend' ? 'on' : ''}" data-act="planDay" data-d="weekend">🎡 Ngày nghỉ / Lễ</button></div>
    <p class="tip">💡 Mỗi việc nên <b>ngắn gọn, cụ thể</b> (bé đọc là hiểu). Việc quan trọng cho nhiều sao hơn. “Trừ khi chưa đạt” là số sao bị trừ khi Bố Mẹ bấm <b>Chưa đạt</b>.</p>`;
  SESSIONS.forEach(s => {
    const list = S.tasks.filter(t => t.session === s && (t.dayType === dt || t.dayType === 'both')).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    out += `<div class="section-title"><span>${SESSION_META[s].icon} ${SESSION_META[s].label}</span><span class="grow"></span>
      <button class="btn btn-primary btn-sm" data-act="taskEdit" data-session="${s}">＋ Thêm việc</button></div><div class="list">`;
    if (!list.length) out += `<div class="empty" style="padding:16px">Chưa có việc nào.</div>`;
    out += list.map(t => {
      const kidsTxt = t.kidIds && t.kidIds.length ? t.kidIds.map(id => (findKid(id) || {}).name).filter(Boolean).join(', ') : 'Tất cả các bé';
      return `<div class="list-row" style="${t.active === false ? 'opacity:.5' : ''}"><div class="ico">${t.icon}</div>
        <div class="grow"><div class="t">${esc(t.title)}</div>
        <div class="s">🕒 ${esc(t.time)} • +${t.stars}⭐ / −${t.penalty ?? 1}⭐ • ${esc(kidsTxt)}${t.dayType === 'both' ? ' • 📅 Mọi ngày' : ''}${t.heavy ? ' • 💪 miễn khi mệt' : ''}${t.active === false ? ' • ⏸️ Tạm tắt' : ''}</div></div>
        <div class="row-actions"><button class="icon-btn" data-act="taskEdit" data-id="${t.id}" aria-label="Sửa">✏️</button></div></div>`;
    }).join('') + '</div>';
  });
  out += `<div class="section-title">⚡ Thêm nhanh từ gợi ý</div><div class="chips">${PRESETS.map(([i, ttl], idx) =>
    `<button class="chip" data-act="taskPreset" data-i="${idx}">${i} ${esc(ttl)}</button>`).join('')}</div>`;
  return out;
}

function parentRewardsTab() {
  const md = maxDailyStars();
  let out = `<p class="tip sun">⚖️ Mỗi ngày bé kiếm tối đa khoảng <b>${md}⭐</b>. Quà nên chia từ nhỏ đến lớn để bé học <b>kiên trì & tiết kiệm</b> – hạn chế quy đổi thẳng ra tiền tiêu vặt; nếu có tiền thì nên vào heo đất cho mục tiêu cụ thể.</p>
    <div class="row between" style="margin:16px 4px 0"><span></span><button class="btn btn-primary btn-sm" data-act="rewardEdit">＋ Thêm quà</button></div>`;
  [1, 2, 3, 4].forEach(tier => {
    const items = S.rewards.filter(r => Number(r.tier) === tier).sort((a, b) => a.cost - b.cost);
    out += `<div class="section-title">${TIERS[tier].icon} ${TIERS[tier].label} <span class="pill">${TIERS[tier].hint}</span></div><div class="list">`;
    if (!items.length) out += `<div class="empty" style="padding:14px">Chưa có quà.</div>`;
    out += items.map(r => `<div class="list-row" style="${r.active === false ? 'opacity:.5' : ''}"><div class="ico">${r.icon}</div>
      <div class="grow"><div class="t">${esc(r.title)}</div><div class="s">${r.cost}⭐ • ≈ ${daysNeeded(r.cost)} ngày • ${esc(r.desc || '')}</div></div>
      <button class="icon-btn" data-act="rewardEdit" data-id="${r.id}" aria-label="Sửa">✏️</button></div>`).join('') + '</div>';
  });
  return out;
}

function cloudChip() {
  const code = getFamilyCode();
  return `<button class="pill mint" data-act="qrModalOpen" title="Bấm để xem mã QR kết nối">🟢 Mã: ${esc(code)}</button>`;
}
function makeQrSvg(text, size = 180) {
  return `<div style="display:inline-block;padding:12px;background:#fff;border-radius:18px;box-shadow:0 8px 24px rgba(0,0,0,0.06);text-align:center;">
    <svg width="${size}" height="${size}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#ffffff" rx="12"/>
      <g fill="#ff5277">
        <rect x="15" y="15" width="45" height="45" rx="8"/>
        <rect x="23" y="23" width="29" height="29" rx="4" fill="#ffffff"/>
        <rect x="29" y="29" width="17" height="17" rx="3" fill="#ff5277"/>
        <rect x="140" y="15" width="45" height="45" rx="8"/>
        <rect x="148" y="23" width="29" height="29" rx="4" fill="#ffffff"/>
        <rect x="154" y="29" width="17" height="17" rx="3" fill="#ff5277"/>
        <rect x="15" y="140" width="45" height="45" rx="8"/>
        <rect x="23" y="148" width="29" height="29" rx="4" fill="#ffffff"/>
        <rect x="29" y="154" width="17" height="17" rx="3" fill="#ff5277"/>
      </g>
      <g fill="#2d3436">
        <circle cx="95" cy="35" r="5"/><circle cx="115" cy="35" r="4"/>
        <circle cx="75" cy="55" r="4.5"/><circle cx="95" cy="55" r="4"/><circle cx="115" cy="55" r="5"/>
        <circle cx="35" cy="95" r="5"/><circle cx="55" cy="95" r="4"/><circle cx="75" cy="95" r="4"/>
        <circle cx="95" cy="95" r="6" fill="#ff5277"/><circle cx="115" cy="95" r="4"/><circle cx="145" cy="95" r="5"/><circle cx="165" cy="95" r="4"/>
        <circle cx="35" cy="115" r="4"/><circle cx="55" cy="115" r="5"/><circle cx="75" cy="115" r="4"/><circle cx="95" cy="115" r="5"/><circle cx="115" cy="115" r="4.5"/><circle cx="145" cy="115" r="4"/><circle cx="165" cy="115" r="5"/>
        <circle cx="75" cy="145" r="4"/><circle cx="95" cy="145" r="5"/><circle cx="115" cy="145" r="4"/><circle cx="145" cy="145" r="5"/><circle cx="165" cy="145" r="4"/>
        <circle cx="75" cy="165" r="5"/><circle cx="95" cy="165" r="4"/><circle cx="115" cy="165" r="5"/><circle cx="145" cy="165" r="4.5"/><circle cx="165" cy="165" r="5"/>
      </g>
      <circle cx="100" cy="100" r="16" fill="#ffffff" stroke="#ff5277" stroke-width="2"/>
      <text x="100" y="106" font-size="14" text-anchor="middle">🌱</text>
    </svg>
    <div style="margin-top:8px;font-weight:900;font-size:20px;color:#ff5277;letter-spacing:2px;">${text}</div>
  </div>`;
}

function connectCardHtml() {
  const code = getFamilyCode();
  return `<div class="card" style="background:#ffffff; border-radius:20px; padding:18px 20px; border:1px solid rgba(0,0,0,0.06); box-shadow:0 6px 20px rgba(0,0,0,0.04); margin-bottom:18px;">
    <div class="row between" style="align-items:center; margin-bottom:10px;">
      <div class="card-title" style="margin:0; font-size:16px; font-weight:800; color:#1e293b; display:flex; align-items:center; gap:8px;">
        <span>📲</span><span>Kết Nối Máy Của Bé (iPad / Điện thoại)</span>
      </div>
      <span class="pill mint" style="font-weight:700; font-size:11px; padding:3px 9px;">🟢 Sẵn Sàng</span>
    </div>
    <p class="small bold muted" style="margin:0 0 12px; line-height:1.45; color:#64748b;">
      Mở app trên iPad của bé rồi quét mã QR hoặc nhập mã này để 2 máy kết nối tức thì:
    </p>
    <div style="background:#f8fafc; border:1.5px dashed #cbd5e1; border-radius:14px; padding:12px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
      <div>
        <div style="font-size:11px; font-weight:800; color:#94a3b8; letter-spacing:1px;">MÃ GIA ĐÌNH</div>
        <div style="font-size:22px; font-weight:900; color:#ff5277; letter-spacing:3px;">${esc(code)}</div>
      </div>
      <div class="row" style="gap:8px;">
        <button class="btn btn-primary btn-sm" data-act="qrModalOpen" style="border-radius:12px; font-weight:800; padding:8px 14px;">📷 Mã QR</button>
        <button class="btn btn-soft btn-sm" data-act="copyPairCode" style="border-radius:12px; font-weight:700; padding:8px 12px;">📋 Sao Chép</button>
      </div>
    </div>
  </div>`;
}

function parentFamilyTab() {
  let out = connectCardHtml();
  out += `<div class="row between" style="margin:20px 4px 10px"><h3 style="font-size:18px; font-weight:800; color:#1e293b;">🌟 Hồ sơ thành viên</h3><button class="btn btn-primary btn-sm" data-act="kidEdit" style="border-radius:12px; font-weight:800;">＋ Lập hồ sơ mới</button></div><div class="p-grid-2">`;
  out += S.kids.map(kid => {
    const age = Number(kid.age) || 6;
    const grp = getAgeGroup(age);
    const lv = levelOf(kid).cur;
    const tObj = THEMES[kid.theme || grp.defaultTheme] || THEMES.candy;
    return `<div class="card" style="border-radius:20px; box-shadow:0 4px 18px rgba(0,0,0,0.04); border:1px solid rgba(0,0,0,0.06); padding:16px;">
      <div class="kid-card-head" style="align-items:flex-start;">
        ${avatarHtml(kid)}
        <div class="grow" style="min-width:0;">
          <div class="bold" style="font-size:18px; color:#1e293b; word-break:break-word;">${esc(displayName(kid))}</div>
          <div class="row wrap" style="gap:6px; margin:4px 0 6px;">
            <span class="pill mint" style="font-size:11px; padding:2px 8px; font-weight:700;">🎂 ${age} tuổi</span>
            <span class="pill sun" style="font-size:11px; padding:2px 8px; font-weight:700;">${esc(grp.short)}</span>
            <span class="pill primary" style="font-size:11px; padding:2px 8px; font-weight:700;">${tObj.icon} ${esc(tObj.name)}</span>
          </div>
          <div class="small muted bold">${lv.icon} ${esc(lv.name)} • ⭐ ${kid.stars} sao • 🔥 ${kid.bestStreak || 0} ngày</div>
        </div>
      </div>
      <div class="row wrap" style="margin-top:12px; gap:8px;">
        <button class="btn btn-soft btn-sm" data-act="kidEdit" data-id="${kid.id}" style="border-radius:10px; font-weight:700;">🎨 Sửa hồ sơ</button>
        <button class="btn btn-primary btn-sm" data-act="kidPairQrModal" data-id="${kid.id}" style="border-radius:10px; font-weight:700;">📲 Mã máy con</button>
        <button class="btn btn-white btn-sm" data-act="historyOpen" data-kid="${kid.id}" style="border-radius:10px;">📜 Lịch sử</button>
        <button class="btn btn-white btn-sm" data-act="enterKidFromParent" data-id="${kid.id}" style="border-radius:10px;">👀 Xem giao diện</button>
      </div>
    </div>`;
  }).join('') + '</div>';

  out += `<div class="row between" style="margin:26px 4px 10px"><h3 style="font-size:18px; font-weight:800; color:#1e293b;">🛡️ Tài khoản Quản Lý / Bố Mẹ</h3><button class="btn btn-soft btn-sm" data-act="parentAdd" style="border-radius:12px;">＋ Thêm</button></div><div class="list">`;
  out += S.parents.map(p => `<div class="list-row wrap-m" style="border-radius:14px; background:#ffffff;"><div class="ico">${p.avatar}</div><div class="grow"><div class="t" style="font-weight:700;">${esc(p.name)}${p.id === UI.parentId ? ' <span class="pill mint">Đang dùng</span>' : ''}</div><div class="s">Có mã PIN riêng</div></div>
    <div class="row-actions"><button class="btn btn-soft btn-sm" data-act="pinChange" data-id="${p.id}" style="border-radius:10px;">🔑 Đổi PIN</button>
    ${S.parents.length > 1 ? `<button class="btn btn-rose-soft btn-sm" data-act="parentDelete" data-id="${p.id}" style="border-radius:10px;">Xóa</button>` : ''}</div></div>`).join('') + '</div>';
  return out;
}

function voiceSettingsHtml() {
  const st = S.settings; const vs = viVoices(); const cur = pickVoice();
  if (!vs.length) return `<p class="tip sun" style="margin-top:10px">🔇 Máy/trình duyệt này <b>chưa có giọng đọc tiếng Việt</b>, nên app sẽ không đọc (tránh đọc bằng giọng tiếng Anh).</p>
    <button class="btn btn-soft btn-sm" style="margin-top:10px" data-act="voiceHelp">Cách bật giọng tiếng Việt</button>`;
  return `<div class="setting-row" style="display:block"><div class="t">Chọn giọng</div><div class="s">Nên chọn giọng nữ: <b>Linh</b> (iPhone/iPad) hoặc <b>HoaiMy</b> (trình duyệt Edge)</div>
      <select class="input" style="margin-top:8px" data-setting-text="voiceName">
        <option value="">✨ Tự chọn giọng nữ hay nhất${cur ? ' (' + esc(cur.name) + ')' : ''}</option>
        ${vs.map(v => `<option value="${esc(v.name)}" ${DEV.voiceName === v.name ? 'selected' : ''}>${VOICE_MALE.test(v.name) ? '👨' : '👩'} ${esc(v.name)}</option>`).join('')}
      </select></div>
    <div class="setting-row"><div><div class="t">Tốc độ đọc</div></div>
      <select class="input" style="width:auto" data-setting-select="voiceRate">${[[0.75, 'Chậm'], [0.9, 'Vừa (khuyên dùng)'], [1, 'Bình thường']].map(([v, l]) => `<option value="${v}" ${Number(DEV.voiceRate) === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
    <div class="setting-row"><div><div class="t">Cô tự khen khi bé làm xong</div><div class="s">Đọc lời động viên mỗi khi bé bấm hoàn thành</div></div>${sw('data-setting="voiceAuto"', DEV.voiceAuto !== false)}</div>
    <button class="btn btn-primary btn-sm" style="margin-top:6px" data-act="voiceTest">🔊 Nghe thử giọng cô</button>`;
}

function copyrightCardHtml() {
  return `<div class="card" style="margin-top:14px;border-radius:20px;padding:20px;text-align:center;">
    <div style="font-size:32px;margin-bottom:8px;">🌱</div>
    <div style="font-weight:900;font-size:18px;color:#1e293b;">Mỗi Ngày Tốt Hơn</div>
    <p class="muted bold small" style="margin:4px 0 14px;">Thời gian biểu & Rèn luyện nếp sống tự lập mỗi ngày</p>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:12px 14px;border-radius:14px;font-size:12.5px;color:#64748b;display:inline-block;text-align:left;width:100%;">
      <div>Tác giả: <b>MinhTT</b></div>
      <div style="margin-top:4px;">✉️ Gmail: <a href="mailto:truongtuanminh.91@gmail.com" style="color:var(--primary);text-decoration:none;font-weight:700;">truongtuanminh.91@gmail.com</a></div>
      <div style="margin-top:4px;">© 2026 MinhTT</div>
    </div>
  </div>`;
}

function compactSystemOptionsRows(fromQuick = false) {
  const curTheme = THEMES[activeThemeId()] || THEMES.candy;
  const curFont = FONT_STYLES[activeFontId()] || FONT_STYLES.rounded;
  const fq = fromQuick ? 'quick' : '';
  return `
    <div class="compact-opt-list">
      <div class="compact-opt-row" data-act="installHelp" data-from="${fq}">
        <div class="co-ico">${svgIcon('installApp')}</div>
        <div class="grow">
          <div class="co-title">Cài App vào màn hình chính</div>
          <div class="co-sub">Dùng toàn màn hình trên iPad / Điện thoại</div>
        </div>
        <button type="button" class="btn btn-soft btn-xs">Hướng dẫn ›</button>
      </div>
      <div class="compact-opt-row" data-act="themePickerOpen" data-from="${fq}">
        <div class="co-ico">${svgIcon('palette')}</div>
        <div class="grow">
          <div class="co-title">Chọn Giao diện</div>
          <div class="co-sub">Đang dùng: <b>${curTheme.icon} ${esc(curTheme.name)}</b></div>
        </div>
        <button type="button" class="btn btn-soft btn-xs">Xem & chọn ›</button>
      </div>
      <div class="compact-opt-row" data-act="fontPickerOpen" data-from="${fq}">
        <div class="co-ico">${svgIcon('typography')}</div>
        <div class="grow">
          <div class="co-title">Chọn Kiểu chữ (Font)</div>
          <div class="co-sub">Đang dùng: <b>${esc(curFont.name)}</b></div>
        </div>
        <button type="button" class="btn btn-soft btn-xs">Chọn font ›</button>
      </div>
      <div class="compact-opt-row" data-act="copyrightOpen" data-from="${fq}">
        <div class="co-ico">${svgIcon('copyright')}</div>
        <div class="grow">
          <div class="co-title">Thông tin ứng dụng</div>
          <div class="co-sub"><b>MinhTT @ 2026</b></div>
        </div>
        <button type="button" class="btn btn-soft btn-xs">Xem ›</button>
      </div>
      <div class="compact-opt-row" data-act="resetAll" style="border-top:1px dashed rgba(239,68,68,0.25);margin-top:6px;padding-top:10px;">
        <div class="co-ico" style="background:#fee2e2;color:#ef4444;font-size:18px;">🔄</div>
        <div class="grow">
          <div class="co-title" style="color:#ef4444;font-weight:800;">Khởi tạo lại từ đầu</div>
          <div class="co-sub">Xóa toàn bộ dữ liệu & quay về màn hình đầu</div>
        </div>
        <button type="button" class="btn btn-rose-soft btn-xs" style="font-weight:700;">Làm lại</button>
      </div>
    </div>
  `;
}

function parentSettingsTab() {
  const st = S.settings; const tk = todayKey(); const ov = S.dayOverrides[tk] || 'auto'; const info = dayInfo();
  return `<div class="p-grid-2"><div>
    <div class="card"><div class="card-title">⚙️ Giao diện, Font, Cài App & Bản quyền</div>
      ${compactSystemOptionsRows(false)}
    </div>
    <div class="card" style="margin-top:14px"><div class="card-title">🗓️ Lịch học / Lịch làm việc</div>
      <div class="setting-row" style="display:block"><div class="t">Ngày đi học / đi làm trong tuần</div><div class="s">Các ngày còn lại tự động là ngày nghỉ</div>
        <div class="weekday-picker">${[1, 2, 3, 4, 5, 6, 0].map(d => `<button class="${st.schoolDays.includes(d) ? 'on' : ''}" data-act="toggleWd" data-d="${d}">${WD_SHORT[d]}<small>${st.schoolDays.includes(d) ? 'Học' : 'Nghỉ'}</small></button>`).join('')}</div></div>
      <div class="setting-row"><div><div class="t">🇻🇳 Tự nghỉ ngày lễ Việt Nam</div><div class="s">Tết Dương lịch, Tết Nguyên Đán, Giỗ Tổ, 30/4, 1/5, 2/9</div></div>${sw('data-setting="vnHolidays"', st.vnHolidays)}</div>
      <div class="setting-row" style="display:block"><div class="t">Hôm nay (${fmtDate(tk)})</div><div class="s">Đang là: ${DAY_TYPES[info.type].icon} ${esc(info.label)}. Đổi khi nghỉ đột xuất / học bù.</div>
        <div class="seg full" style="margin-top:10px">${[['auto', '📍 Tự động'], ['school', '🎒 Đi học'], ['weekend', '🎡 Nghỉ']].map(([v, l]) => `<button class="${ov === v ? 'on' : ''}" data-act="todayOverride" data-v="${v}">${l}</button>`).join('')}</div></div>
    </div></div><div>
    <div class="card"><div class="card-title">🎯 Luật tích sao</div>
      <div class="setting-row"><div><div class="t">Bố Mẹ duyệt mới cộng sao</div><div class="s">Tắt nếu con đã lớn / người trưởng thành tự giác (tích là được sao ngay)</div></div>${sw('data-setting="requireApproval"', st.requireApproval)}</div>
      <div class="setting-row"><div><div class="t">Thưởng xong cả buổi</div><div class="s">Cộng thêm khi mọi việc trong buổi đều đạt</div></div>${stepper('set_combo', st.comboBonus, 0, 10, '⭐')}</div>
      <div class="setting-row"><div><div class="t">Giữ chuỗi 🔥 khi hoàn thành</div><div class="s">Tỷ lệ việc tối thiểu mỗi ngày</div></div>
        <select class="input" style="width:auto" data-setting-select="streakThreshold">${[60, 70, 80, 90, 100].map(v => `<option value="${v}" ${st.streakThreshold === v ? 'selected' : ''}>${v}%</option>`).join('')}</select></div>
      <div class="setting-row"><div><div class="t">Trừ sao việc bỏ lỡ cuối ngày</div><div class="s">Việc không làm sẽ bị trừ theo mức “trừ khi chưa đạt”</div></div>${sw('data-setting="missedPenalty"', st.missedPenalty)}</div>
    </div>
    <div class="card" style="margin-top:14px"><div class="card-title">🎙️ Giọng cô giáo trợ lý</div>
      ${voiceSettingsHtml()}
    </div>
    <div class="card" style="margin-top:14px"><div class="card-title">📱 Thiết bị & Dữ liệu</div>
      <div class="setting-row"><div><div class="t">Âm thanh hiệu ứng</div><div class="s">Tiếng “ting” khi hoàn thành</div></div>${sw('data-setting="sound"', DEV.sound)}</div>
      <div class="setting-row"><div><div class="t">Tự khóa Góc Quản Lý sau</div><div class="s">Khi không thao tác</div></div>
        <select class="input" style="width:auto" data-setting-select="autoLockMin">${[1, 3, 5, 10, 30].map(v => `<option value="${v}" ${DEV.autoLockMin === v ? 'selected' : ''}>${v} phút</option>`).join('')}</select></div>
      <div class="setting-row"><div class="t">Sao lưu dữ liệu ra file</div><button class="btn btn-primary btn-sm" data-act="exportData">⬇️ Xuất file</button></div>
      <div class="setting-row"><div class="t">Khôi phục từ file</div><button class="btn btn-soft btn-sm" data-act="importData">⬆️ Nhập file</button></div>
      <div class="setting-row"><div class="t" style="color:var(--rose-d)">Xóa toàn bộ & làm lại từ đầu</div><button class="btn btn-rose-soft btn-sm" data-act="resetAll">Xóa hết</button></div>
    </div>
  </div></div>`;
}

/* ================== HỘP THOẠI (MODAL) ================== */
const MODALS = {
  task({ id, session, preset, kidId }) {
    const targetKid = kidId ? findKid(kidId) : null;
    const t = id ? findTask(id) : Object.assign(
      { icon: '✨', title: '', note: '', session: session || 'morning', dayType: UI.planDay, time: session === 'evening' ? '20:00' : session === 'afternoon' ? '17:00' : '06:30', stars: 1, penalty: 1, heavy: false, kidIds: targetKid ? [targetKid.id] : [], active: true },
      preset ? { icon: preset[0], title: preset[1] } : {});
    return `<div class="sheet-head"><h3>${id ? '✏️ Sửa việc' : (targetKid ? `＋ Thêm việc cho ${esc(displayName(targetKid))}` : '＋ Thêm việc mới')}</h3><button class="icon-btn" data-act="closeModal">✕</button></div>
      ${targetKid && !id ? `<div class="tip mint" style="margin-bottom:12px;font-size:12px;">🌟 Việc này sẽ được thêm vào lịch trình riêng của bé <b>${esc(displayName(targetKid))}</b>.</div>` : ''}
      <div class="field"><span class="lbl">Tên việc (ngắn gọn để bé đọc)</span><input class="input" id="tf_title" maxlength="40" value="${esc(t.title)}" placeholder="VD: Gấp quần áo của mình"></div>
      <div class="field"><span class="lbl">Hướng dẫn ngắn (tùy chọn)</span><input class="input" id="tf_note" maxlength="60" value="${esc(t.note)}" placeholder="VD: Gấp gọn rồi cất vào tủ"></div>
      <div class="field"><span class="lbl">📏 Thế nào là ĐẠT? (mỗi dòng 1 ý)</span><textarea class="input" id="tf_crit" rows="3" maxlength="200" placeholder="VD:&#10;Chăn gấp vuông&#10;Gối đặt ngay ngắn">${esc(t.criteria || '')}</textarea>
        <span class="hint">Con sẽ thấy & được cô đọc to trước khi làm. Bố Mẹ căn cứ vào đây để chấm.</span></div>
      <div class="field"><span class="lbl">Biểu tượng</span>${emojiGrid('tf_icon', TASK_ICONS.includes(t.icon) ? TASK_ICONS : [t.icon, ...TASK_ICONS], t.icon)}</div>
      <div class="field"><span class="lbl">Buổi</span>${chipPick('tf_session', SESSIONS.map(s => [s, SESSION_META[s].icon + ' ' + SESSION_META[s].label]), t.session)}</div>
      <div class="field"><span class="lbl">Áp dụng cho</span>${chipPick('tf_day', [['school', '🎒 Ngày đi học'], ['weekend', '🎡 Ngày nghỉ'], ['both', '📅 Mọi ngày']], t.dayType)}</div>
      <div class="grid-2">
        <div class="field"><span class="lbl">Giờ</span><input class="input" type="time" id="tf_time" value="${esc(t.time)}"></div>
        <div class="field"><span class="lbl">Sao thưởng</span>${stepper('tf_stars', t.stars, 1, 5, '⭐')}</div>
      </div>
      <div class="field"><span class="lbl">Trừ khi chưa đạt / phải làm lại</span>${stepper('tf_pen', t.penalty ?? 1, 0, 5, '⭐')}</div>
      ${S.kids.length > 1 ? `<div class="field"><span class="lbl">Dành cho bé</span>${chipPick('tf_kids', S.kids.map(k => [k.id, k.avatar + ' ' + esc(displayName(k))]), t.kidIds || [], true)}<span class="hint">Không chọn = áp dụng cho tất cả các bé</span></div>` : ''}
      <div class="setting-row"><div><div class="t">💪 Việc nặng</div><div class="s">Tự miễn khi bé ốm nhẹ / mệt</div></div>${sw('id="tf_heavy"', t.heavy)}</div>
      ${id ? `<div class="setting-row"><div><div class="t">Đang sử dụng</div><div class="s">Tắt để tạm ẩn mà không xóa</div></div>${sw('id="tf_active"', t.active !== false)}</div>` : ''}
      <div class="sheet-foot">${id ? `<button class="btn btn-rose-soft" data-act="taskDelete" data-id="${id}">🗑️ Xóa</button>` : ''}
        <button class="btn btn-primary" data-act="taskSave" data-id="${id || ''}">💾 Lưu</button></div>`;
  },
  reward({ id }) {
    const r = id ? findReward(id) : { icon: '🎁', title: '', desc: '', cost: 100, tier: 2, active: true };
    return `<div class="sheet-head"><h3>${id ? '✏️ Sửa quà' : '＋ Thêm quà'}</h3><button class="icon-btn" data-act="closeModal">✕</button></div>
      <div class="field"><span class="lbl">Tên quà</span><input class="input" id="rf_title" maxlength="40" value="${esc(r.title)}" placeholder="VD: Đi ăn kem cùng bố"></div>
      <div class="field"><span class="lbl">Mô tả ngắn</span><input class="input" id="rf_desc" maxlength="80" value="${esc(r.desc)}"></div>
      <div class="field"><span class="lbl">Biểu tượng</span>${emojiGrid('rf_icon', REWARD_ICONS.includes(r.icon) ? REWARD_ICONS : [r.icon, ...REWARD_ICONS], r.icon)}</div>
      <div class="field"><span class="lbl">Nhóm quà</span>${chipPick('rf_tier', [1, 2, 3, 4].map(t => [String(t), TIERS[t].icon + ' ' + TIERS[t].label]), String(r.tier))}</div>
      <div class="field"><span class="lbl">Giá (sao)</span><input class="input" type="number" inputmode="numeric" min="5" max="9999" id="rf_cost" value="${r.cost}">
        <span class="hint">Gợi ý: mỗi ngày bé kiếm tối đa ~${maxDailyStars()}⭐</span></div>
      ${id ? `<div class="setting-row"><div class="t">Hiện trong cửa hàng</div>${sw('id="rf_active"', r.active !== false)}</div>` : ''}
      <div class="sheet-foot">${id ? `<button class="btn btn-rose-soft" data-act="rewardDelete" data-id="${id}">🗑️ Xóa</button>` : ''}
        <button class="btn btn-primary" data-act="rewardSave" data-id="${id || ''}">💾 Lưu</button></div>`;
  },
  kid({ id }) {
    const existing = id ? findKid(id) : null;
    const defAge = existing ? (Number(existing.age) || 6) : 6;
    const grp = getAgeGroup(defAge);
    const k = existing || {
      name: '', age: defAge,
      avatar: grp.avatars[S.kids.length % grp.avatars.length],
      color: KID_COLORS[S.kids.length % KID_COLORS.length],
      theme: grp.defaultTheme, font: grp.defaultFont,
      selfManage: defAge >= 18
    };
    const isSelf = existing ? isSelfManaged(existing) : (defAge >= 18);
    return `<div class="sheet-head"><h3>${id ? '🎨 Sửa hồ sơ & Giao diện' : '🌟 Lập hồ sơ thành viên mới'}</h3><button class="icon-btn" data-act="closeModal">✕</button></div>
      <div class="field"><span class="lbl">Tên / Biệt danh</span><input class="input" id="kf_name" maxlength="24" value="${esc(k.name)}" placeholder="VD: Mật Bếu, Bắp, Ken, Minh..."></div>
      ${ageProfileSectionHtml('kf', k.age || 6, k.avatar, k.theme || grp.defaultTheme, k.font || grp.defaultFont)}
      <div class="field"><span class="lbl">Màu nền đại diện</span>${colorPick('kf_color', k.color)}</div>
      <div class="setting-row" style="margin-top:8px;padding:10px 12px;background:var(--bg2);border-radius:14px;">
        <div>
          <div class="t">🔓 Chế độ Tự Quản Lý (Dành cho người lớn / tự giác)</div>
          <div class="s">Tự thêm/sửa thời gian biểu & tích hoàn thành cộng sao ngay mà không cần mật khẩu Bố Mẹ</div>
        </div>
        ${sw('id="kf_self_manage"', isSelf)}
      </div>
      <div class="sheet-foot">${id && S.kids.length > 1 ? `<button class="btn btn-rose-soft" data-act="kidDelete" data-id="${id}">🗑️ Xóa</button>` : ''}
        <button class="btn btn-primary" data-act="kidSave" data-id="${id || ''}">💾 Lưu Hồ Sơ</button></div>`;
  },
  kidStarProfile({ kidId }) {
    const kid = findKid(kidId || UI.kidId);
    if (!kid) return '';
    const age = Number(kid.age) || 6;
    const grp = getAgeGroup(age);
    const lv = levelOf(kid);
    const p = progress(kid);
    const selfM = isSelfManaged(kid);
    return `<div class="sheet-head"><h3>🌟 Hồ Sơ Sao & Cấp Độ</h3><button class="icon-btn" data-act="closeModal">✕</button></div>
      <div class="star-profile-hero">
        ${avatarHtml(kid, 'lg')}
        <div class="sp-name">${esc(displayName(kid))}</div>
        <div class="row wrap center" style="gap:6px;margin-top:4px;">
          <span class="pill mint">${svgIcon('ageBadge')} ${age} tuổi • ${esc(grp.short)}</span>
          ${selfM ? '<span class="pill primary">🔓 Tự quản lý</span>' : ''}
        </div>
      </div>
      <div class="level-card" style="margin-top:12px;">
        <div class="ico">${lv.cur.icon}</div>
        <div class="grow">
          <div class="bold" style="opacity:.9;font-size:12px;text-transform:uppercase;letter-spacing:.5px;">Cấp độ ${lv.idx + 1} hiện tại</div>
          <div style="font-family:var(--font-title);font-size:22px;font-weight:800">${esc(lv.cur.name)}</div>
          <div class="mini-bar" style="margin-top:8px;height:12px"><i style="width:${lv.pct}%"></i></div>
          <div class="tiny bold" style="margin-top:5px;opacity:.92">${lv.next ? `Còn ${lv.next.min - kid.totalEarned}⭐ nữa để thăng cấp ${lv.next.icon} ${esc(lv.next.name)}` : '🏆 Đã đạt cấp độ tối đa!'}</div>
        </div>
      </div>
      <div class="stats-grid" style="margin-top:12px">
        <div class="stat-tile"><div class="v">${svgIcon('star')} ${kid.stars}</div><div class="k">Sao đang có</div></div>
        <div class="stat-tile"><div class="v">🌟 ${kid.totalEarned}</div><div class="k">Tổng sao tích lũy</div></div>
        <div class="stat-tile"><div class="v">${svgIcon('fire')} ${kid.streak}</div><div class="k">Chuỗi ngày liên tiếp</div></div>
        <div class="stat-tile"><div class="v">✅ ${p.done + p.pending}/${p.total}</div><div class="k">Mục tiêu hôm nay</div></div>
      </div>
      <div style="margin-top:14px;">
        <button class="btn btn-primary btn-block" data-act="kidCustomizerOpen" data-id="${kid.id}" style="border-radius:16px;font-weight:900;padding:12px;box-shadow:0 6px 18px rgba(0,0,0,0.08);">
          🎨 Tự Chọn Giao Diện Của Con (Nam / Nữ)
        </button>
      </div>
      <div style="margin-top:8px;">
        <button class="btn btn-soft btn-block" data-act="openKidDeviceGate" style="border-radius:14px;font-weight:700;font-size:12.5px;color:#64748b;padding:10px;">
          🔒 Bố Mẹ: Đổi bé, đăng xuất hoặc làm mới máy này
        </button>
      </div>
      <div class="sheet-foot" style="margin-top:14px">
        ${selfM ? `<button class="btn btn-soft" data-act="kidEdit" data-id="${kid.id}">🎨 Sửa hồ sơ</button>` : ''}
        <button class="btn btn-primary" data-act="openStatsFromModal">📊 Xem chi tiết Thành tích</button>
      </div>`;
  },
  copyright({ from } = {}) {
    const backAct = from === 'quick' ? 'quickSettingsOpen' : 'closeModal';
    return `<div class="sheet-head"><h3>MinhTT @ 2026</h3><button class="icon-btn" data-act="${backAct}">${from === 'quick' ? '←' : '✕'}</button></div>
      ${copyrightCardHtml()}
      <div class="sheet-foot"><button class="btn btn-primary" data-act="${backAct}">${from === 'quick' ? '← Quay lại Cài đặt' : 'Đóng'}</button></div>`;
  },
  kidDevicePickFirst() {
    return `<div class="sheet-head">
      <h3>📲 Đây là máy của bé nào nè?</h3>
    </div>
    <div style="padding:4px 0 16px;">
      <p class="small bold muted center" style="margin-bottom:14px;text-wrap:balance;">
        Gia đình mình có ${S.kids.length} bé. Bố Mẹ hoặc bé hãy chọn đúng tên để gắn thời gian biểu vào máy này nhé:
      </p>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${S.kids.map(k => {
          return `<button type="button" class="btn btn-white btn-block" data-act="kidPickFirstDo" data-id="${k.id}" style="border:2px solid #e2e8f0;padding:12px 14px;border-radius:18px;display:flex;align-items:center;justify-content:space-between;text-align:left;box-shadow:0 4px 12px rgba(0,0,0,0.04);transition:all .2s;">
            <div style="display:flex;align-items:center;gap:12px;">
              <span style="width:44px;height:44px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:#f8fafc;box-shadow:0 2px 6px rgba(0,0,0,0.06);">${renderAvatarArt(k.avatar, k.age)}</span>
              <div>
                <div style="font-weight:900;font-size:16px;color:#1e293b;">${esc(displayName(k))}</div>
                <div style="font-size:12px;color:#64748b;font-weight:700;">${k.age} tuổi • ${getAgeGroup(k.age).short}</div>
              </div>
            </div>
            <span class="pill mint" style="font-weight:800;font-size:12px;">Chọn bé này ➜</span>
          </button>`;
        }).join('')}
      </div>
      <div style="text-align:center;margin-top:16px;font-size:11px;color:#94a3b8;font-weight:700;">
        💡 Sau khi chọn, máy sẽ nhớ cố định bé này. Bố Mẹ có thể đổi lại bằng mã PIN bất cứ lúc nào!
      </div>
    </div>`;
  },
  kidDeviceManager() {
    const curKid = findKid(UI.kidId) || S.kids[0];
    const pairCode = getFamilyCode();
    const hasParentPin = S.parents && S.parents.some(x => x.pin);
    return `<div class="sheet-head">
      <h3>🛡️ Quản Trị Thiết Bị Máy Con</h3>
      <button class="icon-btn" data-act="closeModal">✕</button>
    </div>
    <div style="padding:4px 0 16px;">
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:12px 14px;margin-bottom:14px;">
        <div style="font-size:12px;color:#64748b;font-weight:700;">Thiết bị hiện đang gán cho:</div>
        <div style="font-size:16px;font-weight:900;color:#1e293b;margin-top:4px;display:flex;align-items:center;gap:8px;">
          <span>${curKid ? renderAvatarArt(curKid.avatar, curKid.age) : '❓'}</span>
          <span>${curKid ? esc(displayName(curKid)) : 'Chưa gán bé nào'} (${curKid ? curKid.age : 0} tuổi)</span>
        </div>
        <div style="font-size:11.5px;color:#94a3b8;font-weight:700;margin-top:6px;">Mã gia đình: <b style="color:var(--primary);">${esc(pairCode)}</b></div>
      </div>

      <!-- TRẠNG THÁI MẬT KHẨU BẢO VỆ -->
      <div style="background:${hasParentPin ? '#f0fdf4' : '#fffbeb'};border:1px solid ${hasParentPin ? '#bbf7d0' : '#fef08a'};border-radius:16px;padding:12px 14px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div>
          <div style="font-size:12.5px;font-weight:800;color:${hasParentPin ? '#166534' : '#854d0e'};">
            ${hasParentPin ? '🔒 Đã bật Khóa Bảo Vệ Bố Mẹ' : '💡 Chưa đặt mật khẩu Bố Mẹ'}
          </div>
          <div style="font-size:11px;color:${hasParentPin ? '#15803d' : '#a16207'};margin-top:2px;line-height:1.4;">
            ${hasParentPin ? 'Bé không thể tự thoát máy hay đổi lịch' : 'Mã dự phòng: <b>0000</b>. Bố Mẹ nên đặt mã PIN riêng để an toàn.'}
          </div>
        </div>
        <button type="button" class="btn ${hasParentPin ? 'btn-soft' : 'btn-primary'} btn-sm" data-act="kidDevicePinSetup" style="border-radius:12px;font-weight:800;padding:8px 12px;font-size:11.5px;flex-shrink:0;">
          ${hasParentPin ? 'Đổi mã' : 'Đặt mật khẩu'}
        </button>
      </div>

      <!-- TÙY CHỌN 1: ĐỔI SANG BÉ KHÁC NẾU NHÀ CÓ 2-3 BÉ -->
      <div class="card-title" style="font-size:14px;margin-bottom:8px;">🔄 1. Đổi sang bé khác trên máy này:</div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:18px;">
        ${S.kids.map(k => {
          const isCur = k.id === (curKid ? curKid.id : '');
          return `<button type="button" class="btn ${isCur ? 'btn-primary' : 'btn-soft'} btn-block" data-act="kidSwitchTo" data-id="${k.id}" style="text-align:left;display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-radius:14px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="width:36px;height:36px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,0.06);">${renderAvatarArt(k.avatar, k.age)}</span>
              <div>
                <div style="font-weight:800;font-size:14px;">${esc(displayName(k))}</div>
                <div style="font-size:11px;opacity:0.8;">${k.age} tuổi • ⭐ ${k.stars} sao</div>
              </div>
            </div>
            ${isCur ? '<span class="pill mint" style="font-size:11px;">Đang dùng</span>' : '<span style="font-size:12px;font-weight:800;">Chuyển sang bé này ›</span>'}
          </button>`;
        }).join('')}
      </div>

      <!-- TÙY CHỌN 2: MỞ GÓC BỐ MẸ -->
      <div class="card-title" style="font-size:14px;margin-bottom:8px;">🛡️ 2. Vào Góc Quản Lý Bố Mẹ:</div>
      <button type="button" class="btn btn-white btn-block" data-act="openParentFromGate" style="border:1.5px solid #cbd5e1;border-radius:14px;font-weight:800;padding:12px;margin-bottom:18px;display:flex;align-items:center;justify-content:center;gap:8px;">
        <span>🔒</span>
        <span>Mở Góc Quản Lý để chấm việc / thêm việc</span>
      </button>

      <!-- TÙY CHỌN 3: ĐĂNG XUẤT HOẶC RESET -->
      <div class="card-title" style="font-size:14px;margin-bottom:8px;color:#e11d48;">⚠️ 3. Đăng xuất hoặc Làm mới máy này:</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <button type="button" class="btn btn-soft btn-sm" data-act="kidDeviceLogout" style="border-radius:12px;font-weight:800;color:#64748b;padding:10px;">
          🚪 Đăng xuất máy
        </button>
        <button type="button" class="btn btn-rose-soft btn-sm" data-act="resetAll" style="border-radius:12px;font-weight:800;padding:10px;">
          🧹 Làm mới (Reset)
        </button>
      </div>
    </div>
    <div class="sheet-foot">
      <button class="btn btn-soft" data-act="closeModal">Đóng</button>
    </div>`;
  },
  kidPairQr({ kidId }) {
    const kid = findKid(kidId);
    if (!kid) return '';
    const code = getFamilyCode();
    const qrUrl = `${location.origin}${location.pathname}?mode=kid&pair=${code}&kid=${kid.id}`;
    return `<div class="sheet-head">
      <h3>📲 Mã Máy Của ${esc(displayName(kid))}</h3>
      <button class="icon-btn" data-act="closeModal">✕</button>
    </div>
    <div style="text-align:center;padding:10px 0 16px;">
      <div style="display:inline-flex;align-items:center;gap:8px;background:#f8fafc;padding:6px 14px;border-radius:999px;border:1px solid #e2e8f0;margin-bottom:12px;">
        <span style="font-size:22px;">${renderAvatarArt(kid.avatar, kid.age)}</span>
        <span style="font-weight:900;color:#1e293b;font-size:14px;">${esc(displayName(kid))} • ${kid.age} tuổi</span>
      </div>
      <p class="small bold muted" style="margin-bottom:12px;text-wrap:balance;">
        Bố Mẹ cầm iPad hoặc Điện thoại của <b>${esc(displayName(kid))}</b> quét mã này để máy tự động vào đúng thời gian biểu của bé:
      </p>
      <div class="center" style="margin:8px 0;">
        ${makeQrSvg(qrUrl, 190)}
      </div>
      <div class="center" style="margin-top:10px;">
        <span class="pill sun" style="font-size:14px; font-weight:900; padding:6px 16px; letter-spacing:2px;">MÃ GIA ĐÌNH: ${esc(code)}</span>
      </div>
      <p class="tiny muted bold" style="margin-top:8px;">Hoặc trên máy con: Nhập mã <b>${esc(code)}</b> và chọn đúng tên <b>${esc(displayName(kid))}</b></p>
    </div>
    <div class="sheet-foot"><button class="btn btn-primary" data-act="closeModal">Đã hiểu</button></div>`;
  },
  kidCustomizer({ kidId }) {
    const kid = findKid(kidId || (UI.kidThemeDraft && UI.kidThemeDraft.kidId) || UI.kidId);
    if (!kid) return '';
    const d = UI.kidThemeDraft || {
      kidId: kid.id,
      gender: kid.gender || 'boy',
      age: Number(kid.age) || 6,
      theme: kid.theme || 'ocean',
      font: kid.font || 'rounded',
      avatar: kid.avatar || 'av_hero'
    };

    const g = d.gender || 'boy';
    const age = Number(d.age) || 6;
    const curTheme = THEMES[d.theme] ? d.theme : (g === 'girl' ? 'candy' : 'ocean');
    const curFont = FONT_STYLES[d.font] ? d.font : 'rounded';
    const curAv = d.avatar || (g === 'girl' ? 'av_unicorn' : 'av_hero');
    const themeList = Object.values(THEMES);

    const boyAvatars = [
      { id: 'av_hero', label: 'Siêu Anh Hùng' },
      { id: 'av_astro', label: 'Phi Hành Gia' },
      { id: 'av_knight', label: 'Hiệp Sĩ' },
      { id: 'av_dragon', label: 'Rồng Lửa' },
      { id: 'av_lion', label: 'Sư Tử' },
      { id: 'av_gamer', label: 'Gamer' },
      { id: 'av_corgi', label: 'Corgi' },
      { id: 'av_panda', label: 'Gấu Trúc' },
      { id: 'av_bolt', label: 'Tia Chớp' },
      { id: '🏎️', label: 'Xe Đua' },
      { id: '🤖', label: 'Robot' },
      { id: '🦖', label: 'Khủng Long' },
      { id: '⚽', label: 'Bóng Đá' },
      { id: '🚀', label: 'Tàu Bay' }
    ];

    const girlAvatars = [
      { id: 'av_unicorn', label: 'Kỳ Lân' },
      { id: 'av_bunny', label: 'Thỏ Ngọc' },
      { id: 'av_kitty', label: 'Mèo Con' },
      { id: 'av_bear', label: 'Bé Gấu' },
      { id: 'av_wizard', label: 'Phù Thủy' },
      { id: 'av_music', label: 'Âm Nhạc' },
      { id: 'av_corgi', label: 'Corgi' },
      { id: 'av_crown', label: 'Vương Miện' },
      { id: '👑', label: 'Công Chúa' },
      { id: '🧚', label: 'Tiên Nữ' },
      { id: '🌸', label: 'Hoa Xinh' },
      { id: '🍓', label: 'Dâu Tây' },
      { id: '🎀', label: 'Nơ Hồng' },
      { id: '🦋', label: 'Bướm Xinh' }
    ];

    const teenAvatars = [
      { id: 'av_cyber', label: 'Cyber' },
      { id: 'av_music', label: 'Âm Nhạc' },
      { id: 'av_gamer', label: 'Pro Gamer' },
      { id: 'av_creative', label: 'Sáng Tạo' },
      { id: 'av_blaze', label: 'Bứt Phá' },
      { id: 'av_crown', label: 'Vương Miện' },
      { id: 'av_diamond', label: 'Kim Cương' },
      { id: 'av_target', label: 'Mục Tiêu' },
      { id: '🎧', label: 'Tai Nghe' },
      { id: '🔥', label: 'Ngọn Lửa' },
      { id: '⚡', label: 'Tia Chớp' },
      { id: '💎', label: 'Kim Cương' }
    ];

    let currentAvatarOptions = g === 'girl' ? girlAvatars : (g === 'boy' ? boyAvatars : [...boyAvatars, ...girlAvatars]);
    if (age >= 12 && g === 'all') currentAvatarOptions = teenAvatars;

    return `<div class="sheet-head">
      <h3>🎨 Tự Chọn Giao Diện Của Con</h3>
      <button class="icon-btn" data-act="closeModal">✕</button>
    </div>
    <div class="kid-customizer-body">
      <!-- 1. BÉ CHỌN GIỚI TÍNH / PHONG CÁCH -->
      <div class="kc-section">
        <div class="kc-sec-title">🌟 1. Con là Bé Trai hay Bé Gái nè?</div>
        <div class="kc-gender-pills">
          <button type="button" class="kc-gender-btn ${g === 'boy' ? 'active' : ''}" data-act="kidSetDraftGender" data-val="boy">
            <span class="kc-gb-icon">👦</span>
            <div class="kc-gb-text">
              <span class="kc-gb-title">Bé Trai</span>
              <span class="kc-gb-sub">Khám phá, mạnh mẽ, vũ trụ</span>
            </div>
          </button>
          <button type="button" class="kc-gender-btn ${g === 'girl' ? 'active' : ''}" data-act="kidSetDraftGender" data-val="girl">
            <span class="kc-gb-icon">👧</span>
            <div class="kc-gb-text">
              <span class="kc-gb-title">Bé Gái</span>
              <span class="kc-gb-sub">Ngọt ngào, công chúa, pastel</span>
            </div>
          </button>
          <button type="button" class="kc-gender-btn ${g === 'all' ? 'active' : ''}" data-act="kidSetDraftGender" data-val="all">
            <span class="kc-gb-icon">⚡</span>
            <div class="kc-gb-text">
              <span class="kc-gb-title">Cá Tính</span>
              <span class="kc-gb-sub">Tự do, gamer, hiện đại</span>
            </div>
          </button>
        </div>
      </div>

      <!-- 2. CHỌN ĐỘ TUỔI -->
      <div class="kc-section">
        <div class="kc-sec-title">🎂 2. Con bao nhiêu tuổi?</div>
        <div class="kc-age-row">
          <button type="button" class="kc-age-btn ${age <= 6 ? 'active' : ''}" data-act="kidSetDraftAge" data-val="6">
            <span class="kc-ab-ico">🌸</span>
            <span class="kc-ab-title">Mầm Non</span>
            <span class="kc-ab-sub">2–6 tuổi</span>
          </button>
          <button type="button" class="kc-age-btn ${age >= 7 && age <= 11 ? 'active' : ''}" data-act="kidSetDraftAge" data-val="9">
            <span class="kc-ab-ico">🚀</span>
            <span class="kc-ab-title">Tiểu Học</span>
            <span class="kc-ab-sub">7–11 tuổi</span>
          </button>
          <button type="button" class="kc-age-btn ${age >= 12 && age <= 17 ? 'active' : ''}" data-act="kidSetDraftAge" data-val="14">
            <span class="kc-ab-ico">⚡</span>
            <span class="kc-ab-title">Thiếu Niên</span>
            <span class="kc-ab-sub">12–17 tuổi</span>
          </button>
          <button type="button" class="kc-age-btn ${age >= 18 ? 'active' : ''}" data-act="kidSetDraftAge" data-val="18">
            <span class="kc-ab-ico">💎</span>
            <span class="kc-ab-title">Lớn</span>
            <span class="kc-ab-sub">18+ tuổi</span>
          </button>
        </div>
      </div>

      <!-- 3. CHỌN THEME MÀU SẮC -->
      <div class="kc-section">
        <div class="kc-sec-title">🎨 3. Màu sắc & Chủ đề yêu thích</div>
        <div class="kc-theme-grid">
          ${themeList.map(t => {
            const isSel = t.id === curTheme;
            return `<button type="button" class="kc-theme-card ${isSel ? 'active' : ''}" data-act="kidSetDraftTheme" data-val="${t.id}" style="--thm-col:${t.primary};">
              <div class="kc-tc-header">
                <span class="kc-tc-icon">${t.icon}</span>
                <span class="kc-tc-name">${esc(t.name)}</span>
                ${isSel ? '<span class="kc-tc-check">✓</span>' : ''}
              </div>
              <div class="kc-tc-swatch" style="background:${t.bg};border:1.5px solid ${t.cardBorder};">
                <span class="kc-tc-dot" style="background:${t.primary};"></span>
              </div>
              <div class="kc-tc-desc">${esc(t.desc)}</div>
            </button>`;
          }).join('')}
        </div>
      </div>

      <!-- 4. CHỌN HÌNH ĐẠI DIỆN -->
      <div class="kc-section">
        <div class="kc-sec-title">🧸 4. Chọn Hình Đại Diện của con</div>
        <div class="kc-avatar-grid">
          ${currentAvatarOptions.map(av => {
            const isSel = (av.id === curAv);
            return `<button type="button" class="kc-avatar-item ${isSel ? 'active' : ''}" data-act="kidSetDraftAvatar" data-val="${esc(av.id)}">
              <div class="kc-av-circle">${renderAvatarArt(av.id, age)}</div>
              <span class="kc-av-lbl">${esc(av.label)}</span>
            </button>`;
          }).join('')}
        </div>
      </div>

      <!-- 5. CHỌN KIỂU CHỮ (FONT) -->
      <div class="kc-section">
        <div class="kc-sec-title">✍️ 5. Kiểu chữ hiển thị</div>
        <div class="kc-font-row">
          ${Object.values(FONT_STYLES).map(f => {
            const isSel = f.id === curFont;
            return `<button type="button" class="kc-font-btn ${isSel ? 'active' : ''}" data-act="kidSetDraftFont" data-val="${f.id}">
              <span class="kc-fb-name" style="font-family:${f.css};">${esc(f.name)}</span>
              <span class="kc-fb-sub">${esc(f.desc)}</span>
            </button>`;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- NÚT LƯU TO ĐẸP -->
    <div class="sheet-foot">
      <button type="button" class="btn btn-primary btn-lg btn-block" data-act="kidSaveCustomizer" style="border-radius:18px;font-weight:900;font-size:16px;padding:15px;box-shadow:0 8px 25px rgba(0,0,0,0.15);">
        ✨ Áp Dụng Phong Cách Của Con
      </button>
    </div>`;
  },
  themePicker({ from } = {}) {
    const curTheme = activeThemeId();
    const backAct = from === 'quick' ? 'quickSettingsOpen' : 'closeModal';
    return `<div class="sheet-head"><h3>🎨 Chọn Giao Diện</h3><button class="icon-btn" data-act="${backAct}">${from === 'quick' ? '←' : '✕'}</button></div>
      <p class="small bold muted" style="margin-bottom:10px">Chạm vào một chủ đề để xem trước và áp dụng ngay:</p>
      ${themeGridPick('st_theme_preview', curTheme)}
      <div class="sheet-foot"><button class="btn btn-primary" data-act="${backAct}">✓ Xong</button></div>`;
  },
  fontPicker({ from } = {}) {
    const curFont = activeFontId();
    const backAct = from === 'quick' ? 'quickSettingsOpen' : 'closeModal';
    return `<div class="sheet-head"><h3>🔤 Chọn Kiểu Chữ (Font)</h3><button class="icon-btn" data-act="${backAct}">${from === 'quick' ? '←' : '✕'}</button></div>
      <p class="small bold muted" style="margin-bottom:10px">Xem mẫu chữ bên dưới và chọn phong cách bạn thích:</p>
      <div class="font-preview-list">
        ${Object.values(FONT_STYLES).map(f => `
          <button type="button" class="font-preview-card ${f.id === curFont ? 'sel' : ''}" data-act="setOuterFont" data-font="${f.id}" style="font-family:${esc(f.css)}">
            <div class="fp-badge">${f.sample}</div>
            <div class="grow">
              <div class="fp-title">${esc(f.name)}</div>
              <div class="fp-sample">Mỗi ngày tự giác là một ngày vui ✨</div>
            </div>
            <span class="fp-check">${f.id === curFont ? '✓ Đang dùng' : 'Chọn'}</span>
          </button>
        `).join('')}
      </div>
      <div class="sheet-foot"><button class="btn btn-primary" data-act="${backAct}">✓ Xong</button></div>`;
  },
  quickSettings() {
    return `<div class="sheet-head"><h3>⚙️ Cài đặt & Tùy chọn</h3><button class="icon-btn" data-act="closeModal">✕</button></div>
      ${compactSystemOptionsRows(true)}
      <div class="sheet-foot"><button class="btn btn-primary" data-act="closeModal">Đóng</button></div>`;
  },
  parentAdd() {
    return `<div class="sheet-head"><h3>🛡️ Thêm tài khoản Bố/Mẹ</h3><button class="icon-btn" data-act="closeModal">✕</button></div>
      <div class="field"><span class="lbl">Tên gọi</span><input class="input" id="pf_name" maxlength="20" placeholder="VD: Bố Tuấn, Bà nội"></div>
      <div class="field"><span class="lbl">Hình đại diện</span>${chipPick('pf_avatar', PARENT_AVATARS.map(a => [a, `<span style="font-size:24px">${a}</span>`]), '👨')}</div>
      <div class="sheet-foot"><button class="btn btn-primary" data-act="parentAddNext">Tiếp: tạo mã PIN ➜</button></div>`;
  },
  reject({ kidId, id, k }) {
    const kid = findKid(kidId), t = findTask(id); const pen = Number(t.penalty ?? 1);
    return `<div class="sheet-head"><h3>↩️ Chưa đạt – làm lại</h3><button class="icon-btn" data-act="closeModal">✕</button></div>
      <div class="list-row"><div class="ico">${t.icon}</div><div class="grow"><div class="t">${esc(t.title)}</div><div class="s">${kid.avatar} ${esc(kid.name)} ${pen ? `• bị trừ −${pen}⭐` : '• không trừ sao'}</div></div></div>
      <p class="bold" style="margin:16px 0 8px">Nhắc con điều gì? (bấm để gửi)</p>
      <div class="list">${REJECT_REASONS.map(r => `<button class="btn btn-white btn-block" style="justify-content:flex-start" data-act="rejectDo" data-kid="${kidId}" data-id="${id}" data-k="${k}" data-r="${esc(r)}">${esc(r)}</button>`).join('')}</div>
      <div class="field" style="margin-top:12px"><span class="lbl">Hoặc tự viết</span><input class="input" id="rj_custom" maxlength="60" placeholder="VD: Con gấp lại chăn cho phẳng nhé"></div>
      <div class="sheet-foot"><button class="btn btn-rose" data-act="rejectDo" data-kid="${kidId}" data-id="${id}" data-k="${k}" data-r="">↩️ Gửi nhắc làm lại</button></div>`;
  },
  bonus({ kidId, sign }) {
    const kid = findKid(kidId); const plus = sign > 0;
    const reasons = plus ? PRAISE_REASONS : WARN_REASONS;
    return `<div class="sheet-head"><h3>${plus ? '🌟 Thưởng sao' : '⚠️ Trừ sao'} – ${kid.avatar} ${esc(kid.name)}</h3><button class="icon-btn" data-act="closeModal">✕</button></div>
      <div class="field"><span class="lbl">Số sao</span>${stepper('bf_amt', plus ? 5 : 2, 1, 50, '⭐')}</div>
      <div class="field"><span class="lbl">Lý do (con sẽ thấy trong lịch sử)</span>${chipPick('bf_reason', reasons.map(r => [r, esc(r)]), '', false, plus ? 'mint' : 'rose')}</div>
      <div class="field"><input class="input" id="bf_custom" maxlength="60" placeholder="Hoặc tự viết lý do..."></div>
      <div class="sheet-foot"><button class="btn ${plus ? 'btn-mint' : 'btn-rose'}" data-act="bonusDo" data-kid="${kidId}" data-sign="${sign}">${plus ? '🌟 Thưởng' : '⚠️ Trừ'}</button></div>`;
  },
  kidDay({ kidId }) {
    const kid = findKid(kidId); const k = todayKey();
    if (!kid) return '';
    const age = Number(kid.age) || 6;
    const grp = getAgeGroup(age);
    let out = `<div class="sheet-head">
      <div class="row" style="align-items:center;gap:10px;">
        <div class="avatar sm" style="background:${kid.color || KID_COLORS[0]}">${avatarHtml(kid, 'sm')}</div>
        <div>
          <h3 style="margin:0;font-size:18px;">${esc(displayName(kid))} – Lịch Trình</h3>
          <div class="tiny bold muted">${age} tuổi • ${esc(grp.short)} • ⭐ ${kid.stars} sao • 🔥 ${kid.streak || 0} ngày</div>
        </div>
      </div>
      <button class="icon-btn" data-act="closeModal">✕</button>
    </div>`;

    out += `<div class="kid-day-toolbar">
      <button class="btn btn-primary btn-sm grow" data-act="taskEditForKid" data-kid="${kid.id}">
        <span>＋ Thêm việc mới cho bé</span>
      </button>
      <button class="btn btn-soft btn-sm grow" data-act="kidPickExistingTasksOpen" data-kid="${kid.id}">
        <span>⚡ Chọn từ kho việc có sẵn</span>
      </button>
    </div>`;

    if (healthOf(kid) === 'sick_full') return out + `<div class="empty">🛌 Bé đang nghỉ ốm cả ngày.</div>`;

    SESSIONS.forEach(s => {
      const list = tasksFor(kid, k, s);
      out += `<div class="section-title row between" style="font-size:15px;margin-top:14px;align-items:center;">
        <span>${SESSION_META[s].icon} ${SESSION_META[s].label} (${list.length})</span>
        <button class="btn btn-soft btn-xs" data-act="taskEditForKid" data-kid="${kid.id}" data-session="${s}" style="border-radius:10px;">＋ Thêm buổi này</button>
      </div>`;
      if (!list.length) {
        out += `<div class="empty" style="padding:10px 14px;font-size:13px;">Chưa có việc buổi ${SESSION_META[s].short.toLowerCase()} cho bé. Bấm <b>＋ Thêm</b> hoặc <b>⚡ Chọn từ kho</b> để giao việc.</div>`;
        return;
      }
      out += `<div class="list">`;
      out += list.map(t => {
        const st = statusOf(kid, t.id, k); const rec = kid.days[k] || {};
        const great = rec.grade && rec.grade[t.id] === 'great';
        const isExclusive = t.kidIds && t.kidIds.length === 1 && t.kidIds.includes(kid.id);
        const tag = {
          todo: '<span class="pill" style="font-size:11px;">⬜ Chưa làm</span>',
          pending: '<span class="pill sun" style="font-size:11px;">⏳ Chờ chấm</span>',
          done: great ? '<span class="pill sun" style="font-size:11px;">🌟 Xuất sắc</span>' : '<span class="pill mint" style="font-size:11px;">✅ Đạt</span>',
          redo: '<span class="pill rose" style="font-size:11px;">↩️ Làm lại</span>'
        }[st];
        let acts = '';
        if (st === 'pending') acts = `<button class="btn btn-sun btn-xs" data-act="approve" data-grade="great" data-kid="${kid.id}" data-id="${t.id}" data-k="${k}">🌟</button><button class="btn btn-mint btn-xs" data-act="approve" data-kid="${kid.id}" data-id="${t.id}" data-k="${k}">✅ Đạt</button><button class="btn btn-rose-soft btn-xs" data-act="rejectOpen" data-kid="${kid.id}" data-id="${t.id}" data-k="${k}">↩️</button>`;
        else if (st === 'todo' || st === 'redo') acts = `<button class="btn btn-mint-soft btn-xs" data-act="approve" data-kid="${kid.id}" data-id="${t.id}" data-k="${k}">✅ Chấm đạt</button>`;
        else acts = `<button class="btn btn-soft btn-xs" data-act="revert" data-kid="${kid.id}" data-id="${t.id}" data-k="${k}">Hủy</button>`;

        const scopeBadge = isExclusive
          ? `<span class="pill primary" style="font-size:10px;padding:1px 6px;">👤 Riêng bé</span>`
          : `<span class="pill" style="font-size:10px;padding:1px 6px;">👥 Chung</span>`;

        return `<div class="list-row" style="padding:10px 12px;gap:8px;">
          <div class="ico" style="width:36px;height:36px;font-size:20px;flex-shrink:0;">${t.icon}</div>
          <div class="grow" style="min-width:0;">
            <div class="row" style="gap:6px;align-items:center;">
              <span class="t small bold truncate">${esc(t.title)}</span>
              ${scopeBadge}
            </div>
            <div class="row" style="gap:6px;align-items:center;margin-top:2px;">
              <span class="tiny muted bold">🕒 ${esc(t.time || '')}</span>
              ${tag}
            </div>
          </div>
          <div class="row" style="gap:4px;flex-shrink:0;align-items:center;">
            ${acts}
            <button class="icon-btn sm" data-act="taskEdit" data-id="${t.id}" title="Sửa chi tiết việc" style="width:30px;height:30px;font-size:13px;">✏️</button>
            <button class="icon-btn sm" data-act="kidRemoveTask" data-kid="${kid.id}" data-id="${t.id}" title="Gỡ việc này khỏi lịch của bé" style="width:30px;height:30px;font-size:13px;color:var(--rose-d);">✕</button>
          </div>
        </div>`;
      }).join('') + '</div>';
    });
    return out;
  },
  kidPickTasks({ kidId }) {
    const kid = findKid(kidId);
    if (!kid) return '';
    let out = `<div class="sheet-head">
      <div class="row" style="align-items:center;gap:10px;">
        <div class="avatar sm" style="background:${kid.color || KID_COLORS[0]}">${avatarHtml(kid, 'sm')}</div>
        <div>
          <h3 style="margin:0;font-size:18px;">Kho việc: ${esc(displayName(kid))}</h3>
          <div class="tiny bold muted">Tích chọn việc giao cho bé làm</div>
        </div>
      </div>
      <button class="icon-btn" data-act="kidDayOpen" data-kid="${kid.id}" title="Quay lại">←</button>
    </div>`;

    out += `<div class="tip mint" style="margin:4px 0 14px;font-size:12px;line-height:1.4;">
      💡 <b>Phân quyền lịch riêng:</b> Tích chọn những việc áp dụng cho bé <b>${esc(displayName(kid))}</b>. Bỏ tích việc nào thì việc đó sẽ không xuất hiện trên máy của bé này (không ảnh hưởng bé khác).
    </div>`;

    SESSIONS.forEach(s => {
      const sessTasks = S.tasks.filter(t => t.session === s);
      out += `<div class="section-title row between" style="font-size:15px;margin-top:12px;align-items:center;">
        <span>${SESSION_META[s].icon} ${SESSION_META[s].label} (${sessTasks.length})</span>
        <button class="btn btn-soft btn-xs" data-act="taskEditForKid" data-kid="${kid.id}" data-session="${s}" style="border-radius:10px;">＋ Tạo việc mới</button>
      </div>`;
      if (!sessTasks.length) {
        out += `<div class="empty" style="padding:10px;font-size:13px;">Chưa có việc nào trong buổi này.</div>`;
        return;
      }
      out += `<div class="list">`;
      out += sessTasks.map(t => {
        const hasTask = (!t.kidIds || !t.kidIds.length) || t.kidIds.includes(kid.id);
        const dayLabel = t.dayType === 'school' ? '🎒 Ngày học' : (t.dayType === 'weekend' ? '🎡 Ngày nghỉ' : '📅 Mọi ngày');
        return `<label class="list-row" style="cursor:pointer;padding:10px 12px;display:flex;align-items:center;gap:12px;border-radius:14px;background:#fff;border:1px solid rgba(0,0,0,0.06);">
          <input type="checkbox" class="kpt-check" data-tid="${t.id}" ${hasTask ? 'checked' : ''} style="width:20px;height:20px;accent-color:var(--primary);cursor:pointer;">
          <div class="ico" style="width:36px;height:36px;font-size:20px;flex-shrink:0;">${t.icon}</div>
          <div class="grow" style="min-width:0;">
            <div class="row" style="gap:6px;align-items:center;">
              <span class="t small bold truncate">${esc(t.title)}</span>
              <span class="pill sun" style="font-size:10px;padding:1px 6px;">+${t.stars}⭐</span>
            </div>
            <div class="s tiny muted" style="margin-top:2px;">🕒 ${esc(t.time || '')} • ${dayLabel}</div>
          </div>
        </label>`;
      }).join('');
      out += `</div>`;
    });

    out += `<div class="sheet-foot" style="margin-top:16px;display:flex;gap:10px;">
      <button class="btn btn-soft" data-act="kidDayOpen" data-kid="${kid.id}" style="flex:1;">Hủy</button>
      <button class="btn btn-primary" data-act="kidSaveExistingTasks" data-kid="${kid.id}" style="flex:2;">💾 Lưu Lịch Của Bé</button>
    </div>`;

    return out;
  },
  history({ kidId }) {
    const kid = findKid(kidId);
    return `<div class="sheet-head"><h3>📜 Lịch sử sao – ${esc(kid.name)}</h3><button class="icon-btn" data-act="closeModal">✕</button></div>
      <div class="card" style="padding:8px 12px">${historyList(kid, 200)}</div>`;
  },
  redeem({ kidId, id }) {
    const kid = findKid(kidId), r = findReward(id);
    return `<div class="center" style="padding:10px 0">
      <div style="font-size:70px">${r.icon}</div><h3 style="font-size:24px;margin-top:6px">${esc(r.title)}</h3>
      <p class="bold muted" style="margin-top:8px">Con dùng <b style="color:#a06a00">${r.cost}⭐</b> để đổi quà này nhé?<br>Còn lại: ${kid.stars - r.cost}⭐</p></div>
      <div class="sheet-foot"><button class="btn btn-soft" data-act="closeModal">Để sau</button><button class="btn btn-sun" data-act="redeemDo" data-kid="${kidId}" data-id="${id}">🎁 Đổi luôn!</button></div>`;
  },
  qrCode() {
    const code = getFamilyCode();
    return `<div class="sheet-head"><h3>📷 Quét Mã QR Ghép Nối</h3><button class="icon-btn" data-act="closeModal">✕</button></div>
      <p class="small bold muted" style="margin-bottom:12px;text-align:center;">Dùng camera trên iPad của bé để quét mã này:</p>
      <div class="center" style="margin:10px 0;">
        ${makeQrSvg(code, 200)}
      </div>
      <div class="center" style="margin-top:12px;">
        <span class="pill sun" style="font-size:15px; font-weight:900; padding:6px 18px; letter-spacing:2px;">MÃ: ${esc(code)}</span>
      </div>
      <div class="sheet-foot"><button class="btn btn-primary" data-act="closeModal">Đã Xong</button></div>`;
  },
  join() {
    return `<div class="sheet-head"><h3>🔗 Nhập Mã Gia Đình</h3><button class="icon-btn" data-act="closeModal">✕</button></div>
      <p class="bold muted small">Xem mã trên máy Bố/Mẹ (hoặc mã đã sinh ra: VD SNH-6689) và nhập Mật Khẩu (4–6 số) để đăng nhập dùng chung:</p>
      <div class="field" style="margin-top:14px"><span class="lbl">Mã Gia Đình (6–8 ký tự)</span><input class="input code-input" id="jn_code" maxlength="10" autocomplete="off" autocapitalize="characters" placeholder="VD: SNH-6689" value="${esc(getFamilyCode())}"></div>
      <div class="field" style="margin-top:10px"><span class="lbl">Mật khẩu Bố Mẹ (4–6 số)</span><input class="input" type="password" inputmode="numeric" id="jn_pin" maxlength="6" placeholder="Mật khẩu 4–6 số"></div>
      <div class="sheet-foot"><button class="btn btn-primary" data-act="joinDo">🔗 Kết Nối & Đăng Nhập</button></div>`;
  },
  message({ kidId }) {
    const kid = findKid(kidId); const par = currentParent();
    const quick = ['Mẹ tự hào về con lắm! ❤️', 'Hôm nay con giỏi quá, cố lên nhé!', 'Con gấp chăn rất gọn, mẹ khen!', 'Mai mình cố gắng hơn chút nữa nha con!', 'Bố thương con nhiều!', 'Con nhớ uống đủ nước nhé!'];
    return `<div class="sheet-head"><h3>💌 Nhắn cho ${kid.avatar} ${esc(kid.name)}</h3><button class="icon-btn" data-act="closeModal">✕</button></div>
      <p class="small bold muted">Con sẽ thấy trên màn hình và <b>cô giáo đọc to</b> lời nhắn của ${esc(par ? par.name : 'Bố Mẹ')}.</p>
      <div class="chips" style="margin:12px 0">${quick.map(q => `<button class="chip" data-act="msgQuick" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>
      <textarea class="input" id="ms_text" rows="3" maxlength="160" placeholder="Viết lời nhắn yêu thương...">${esc(kid.message && !kid.message.readAt ? kid.message.text : '')}</textarea>
      <div class="sheet-foot"><button class="btn btn-primary" data-act="msgSend" data-kid="${kidId}">💌 Gửi cho con</button></div>`;
  },
  confirm({ msg, yes, danger }) {
    return `<div class="center" style="padding:12px 0"><div style="font-size:48px">${danger ? '⚠️' : '❓'}</div><p class="bold" style="font-size:18px;margin-top:8px">${msg}</p></div>
      <div class="sheet-foot"><button class="btn btn-soft" data-act="closeModal">Hủy</button><button class="btn ${danger ? 'btn-rose' : 'btn-primary'}" data-act="confirmYes">${yes || 'Đồng ý'}</button></div>`;
  },
  voiceHelp() {
    return `<div class="sheet-head"><h3>🎙️ Bật giọng cô giáo tiếng Việt</h3><button class="icon-btn" data-act="closeModal">✕</button></div>
      <p class="bold muted">Giọng đọc lấy từ chính thiết bị. Mỗi loại máy làm như sau:</p>
      <div class="card" style="margin-top:12px"><div class="card-title">🍎 iPad / iPhone (khuyên dùng cho bé)</div>
        <p class="small bold" style="margin-top:6px;line-height:1.6">Có sẵn giọng nữ <b>“Linh”</b>. Nếu chưa nghe được: Cài đặt → Trợ năng → Nội dung được đọc → Giọng nói → <b>Tiếng Việt → Linh</b> (tải bản <b>Nâng cao</b> cho giọng mượt hơn).</p></div>
      <div class="card" style="margin-top:12px"><div class="card-title">🤖 Android</div>
        <p class="small bold" style="margin-top:6px;line-height:1.6">Cài đặt → Hỗ trợ tiếp cận → Chuyển văn bản thành giọng nói → chọn <b>Google</b> → tải dữ liệu <b>Tiếng Việt</b>, chọn giọng nữ.</p></div>
      <div class="card" style="margin-top:12px"><div class="card-title">💻 Máy tính Windows</div>
        <p class="small bold" style="margin-top:6px;line-height:1.6">Mở app bằng trình duyệt <b>Microsoft Edge</b> → tự có giọng nữ <b>HoaiMy</b> rất tự nhiên (cần có mạng). Chrome trên Windows thường không có giọng tiếng Việt.</p></div>
      <div class="sheet-foot"><button class="btn btn-primary" data-act="voiceTest">🔊 Nghe thử</button></div>`;
  },
  install({ from } = {}) {
    const ios = isIOS();
    const backAct = from === 'quick' ? 'quickSettingsOpen' : 'closeModal';
    return `<div class="sheet-head"><h3>📲 Cài lên màn hình chính</h3><button class="icon-btn" data-act="${backAct}">${from === 'quick' ? '←' : '✕'}</button></div>
      ${UI.installEvt ? `<button class="btn btn-primary btn-lg btn-block" data-act="installNow">⬇️ Cài đặt ngay</button><p class="center small muted bold" style="margin:10px 0">hoặc làm thủ công:</p>` : ''}
      <div class="card" style="${ios ? 'border-color:var(--primary)' : ''}"><div class="card-title">🍎 iPhone / iPad (Safari)</div>
        <ol class="bold" style="line-height:1.8;padding-left:20px;margin:8px 0 0"><li>Mở trang này bằng <b>Safari</b></li><li>Bấm nút <b>Chia sẻ</b> (ô vuông có mũi tên ⬆️)</li><li>Chọn <b>“Thêm vào MH chính”</b></li><li>Bấm <b>Thêm</b> – biểu tượng ⭐ sẽ xuất hiện</li></ol></div>
      <div class="card" style="margin-top:12px"><div class="card-title">🤖 Android (Chrome)</div>
        <ol class="bold" style="line-height:1.8;padding-left:20px;margin:8px 0 0"><li>Bấm menu <b>⋮</b> góc trên</li><li>Chọn <b>“Cài đặt ứng dụng”</b> / “Thêm vào màn hình chính”</li></ol></div>
      <p class="tip sun" style="margin-top:12px">⚠️ Trên iPhone/iPad: dữ liệu trong app ở màn hình chính <b>tách riêng</b> với Safari. Hãy cài app trước rồi mới tạo tài khoản (hoặc dùng Sao lưu → Khôi phục).</p>
      <div class="sheet-foot"><button class="btn btn-primary" data-act="${backAct}">${from === 'quick' ? '← Quay lại Cài đặt' : 'Đã hiểu'}</button></div>`;
  }
};
function openModal(type, args = {}, live = false) { UI.modal = { type, args, live }; renderModal(); }
function closeModal() { UI.modal = null; UI.confirmCb = null; $('#modal-root').innerHTML = ''; }
function renderModal() {
  const root = $('#modal-root');
  if (!UI.modal) { root.innerHTML = ''; return; }
  const sheetScroll = root.querySelector('.sheet') ? root.querySelector('.sheet').scrollTop : 0;
  root.innerHTML = `<div class="modal-back" data-act="backdrop"><div class="sheet" role="dialog" aria-modal="true">${MODALS[UI.modal.type](UI.modal.args)}</div></div>`;
  const sheet = root.querySelector('.sheet'); if (sheet) sheet.scrollTop = sheetScroll;
}
function confirmBox(msg, cb, yes, danger = false) { UI.confirmCb = cb; openModal('confirm', { msg, yes, danger }); }

/* ================== RENDER CHÍNH ================== */
function render() {
  const app = $('#app');
  applyVisualTheme();
  document.body.classList.toggle('parent-mode', S.setupDone && UI.mode === 'parent');
  if (!S.setupDone) app.innerHTML = isKidOnlyDevice() ? viewKidConnect() : viewSetup();
  else if (UI.mode === 'pin') app.innerHTML = viewPinScreen();
  else if (UI.mode === 'kid') app.innerHTML = viewKid();
  else if (UI.mode === 'parent') app.innerHTML = viewParent();
  else app.innerHTML = viewPicker();
}
function update() {
  save(); render();
  if (UI.modal && UI.modal.live) renderModal();
}
function scrollTop() { window.scrollTo(0, 0); }

function syncAgeFormUi(prefix, ageVal) {
  const age = clamp(parseInt(ageVal, 10) || 6, 2, 80);
  const grp = getAgeGroup(age);
  const ageInput = document.getElementById(prefix + '_age');
  if (ageInput && Number(ageInput.value) !== age) ageInput.value = age;
  const badge = document.getElementById(prefix + '_stage_badge');
  if (badge) badge.innerHTML = `Cấp độ: <b>${esc(grp.label)}</b>`;
  // Cập nhật các tab lứa tuổi
  $$(`[data-act="ageStagePick"][data-prefix="${prefix}"]`).forEach(b => {
    b.classList.toggle('on', getAgeGroup(Number(b.dataset.age)).id === grp.id);
  });
  // Cập nhật lưới icon đại diện theo đúng độ tuổi
  const avWrap = document.getElementById(prefix + '_avatar_wrap');
  if (avWrap) {
    const curVal = val(prefix + '_avatar');
    const keepPhoto = typeof curVal === 'string' && curVal.startsWith('data:image/');
    const newAv = keepPhoto ? curVal : grp.avatars[0];
    avWrap.innerHTML = `
      <div class="row between" style="margin-bottom:6px;">
        <span class="lbl" style="margin:0;">Avatar nghệ thuật (${esc(grp.short)})</span>
        <button type="button" class="btn btn-primary btn-xs" data-act="triggerAvatarUpload" data-target="${prefix}_avatar">📷 Tải ảnh thật</button>
      </div>
      ${avatarGridPick(prefix + '_avatar', grp.avatars, newAv, age)}
    `;
  }
  // Cập nhật giao diện chủ đề & kiểu chữ mặc định của độ tuổi
  const thSel = document.getElementById(prefix + '_theme');
  if (thSel) thSel.value = grp.defaultTheme;
  const fnSel = document.getElementById(prefix + '_font');
  if (fnSel) fnSel.value = grp.defaultFont;
  const smChk = document.getElementById(prefix + '_self_manage');
  if (smChk) smChk.checked = age >= 18;
}

/* ================== XỬ LÝ HÀNH ĐỘNG ================== */
const A = {
  /* --- widget --- */
  triggerAvatarUpload(d) {
    const fileInput = document.getElementById(d.target + '_file');
    if (fileInput) { fileInput.value = ''; fileInput.click(); }
  },
  pick(d, el) {
    const grp = el.closest('[data-pick]'); if (!grp) return;
    const input = document.getElementById(grp.dataset.pick);
    if (grp.dataset.multi) {
      el.classList.toggle('sel');
      input.value = $$('.sel', grp).map(x => x.dataset.val).join(',');
    } else {
      $$('.sel', grp).forEach(x => x.classList.remove('sel'));
      el.classList.add('sel'); input.value = el.dataset.val;
    }
    if (grp.dataset.pick === 'st_theme_preview') {
      A.setOuterTheme({ theme: el.dataset.val });
      return;
    }
    sound('tap');
  },
  ageStagePick(d) {
    syncAgeFormUi(d.prefix, d.age);
    sound('tap');
  },
  setOuterTheme(d) {
    if (!THEMES[d.theme]) return;
    S.settings.theme = d.theme;
    if (S.kids.length === 1) S.kids[0].theme = d.theme;
    sound('tap');
    toast(`Đã chọn giao diện ${THEMES[d.theme].icon} ${THEMES[d.theme].name}`, '🎨', 'primary');
    update();
  },
  setOuterFont(d) {
    if (!FONT_STYLES[d.font]) return;
    S.settings.font = d.font;
    if (S.kids.length === 1) S.kids[0].font = d.font;
    sound('tap');
    toast(`Đã chọn kiểu chữ ${FONT_STYLES[d.font].name}`, '🔤', 'primary');
    update();
  },
  copyrightOpen(d = {}) { openModal('copyright', { from: d.from || '' }); },
  themePickerOpen(d = {}) { openModal('themePicker', { from: d.from || '' }, true); },
  fontPickerOpen(d = {}) { openModal('fontPicker', { from: d.from || '' }, true); },
  quickSettingsOpen() { openModal('quickSettings', {}, true); },
  copyCopyrightEmail() {
    const em = COPYRIGHT_INFO.email;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(em).then(() => toast('Đã sao chép Gmail: ' + em, '✉️', 'mint')).catch(() => prompt('Gmail tác giả:', em));
    } else {
      prompt('Gmail tác giả:', em);
    }
  },
  step(d, el) {
    const box = el.closest('.stepper'); const input = document.getElementById(d.target);
    const v = clamp(Number(input.value) + Number(d.delta), Number(box.dataset.min), Number(box.dataset.max));
    input.value = v; document.getElementById(d.target + '_v').textContent = v + (box.dataset.suffix || '');
    if (d.target === 'set_combo') { S.settings.comboBonus = v; save(); }
    sound('tap');
  },
  closeModal() { closeModal(); },
  backdrop(d, el, e) { if (e.target === el) closeModal(); },
  confirmYes() { const cb = UI.confirmCb; closeModal(); if (cb) cb(); },

  /* --- khởi tạo --- */
  setupNewCode() {
    UI.setupDraft.pairCode = 'SNH-' + Math.floor(1000 + Math.random() * 9000);
    const el = document.getElementById('su_code_display');
    if (el) el.textContent = UI.setupDraft.pairCode;
    toast('Đã sinh Mã Gia Đình mới: ' + UI.setupDraft.pairCode, '🎲', 'mint');
  },
  setupBackTo1() {
    UI.setupStep = 1;
    render();
  },
  setupBackToPin() {
    UI.setupStep = 2;
    startPin('setup-create');
    render();
  },
  setupNext1() {
    const name = val('su_pname').trim();
    if (!name) { toast('Nhập tên gọi của bạn nhé', '✍️'); $('#su_pname').focus(); return; }
    UI.setupDraft.pName = name; UI.setupDraft.pAvatar = val('su_pavatar');
    UI.setupStep = 2; startPin('setup-create'); render();
  },
  setupFinish() {
    const name = val('su_kname').trim();
    if (!name) { toast('Nhập tên / biệt danh nhé', '✍️'); $('#su_kname').focus(); return; }
    const age = parseInt(val('su_k_age'), 10) || 6;
    const theme = val('su_k_theme') || getAgeGroup(age).defaultTheme;
    const font = val('su_k_font') || getAgeGroup(age).defaultFont;
    const d = UI.setupDraft;
    const parent = { id: uid('p'), name: d.pName, avatar: d.pAvatar, pin: d.pin };
    S.parents = [parent];
    const kid = newKid(name, val('su_k_avatar'), val('su_kcolor'), age, theme, font);
    S.settings.theme = theme;
    S.settings.font = font;
    S.settings.pairCode = d.pairCode || getFamilyCode();
    changeStars(kid, 5, '🎉 Quà chào mừng Tự Lập', '🎉');
    S.kids = [kid]; S.setupDone = true; S.lastRollover = todayKey();
    rollover(); save();
    UI.mode = 'picker'; sound('combo'); confetti(90);
    toast(`Chào mừng ${name}! Tặng 5⭐ khởi đầu`, kid.avatar, 'primary');
    render(); scrollTop();
  },

  /* --- bé kết nối nhận lịch --- */
  async kidConnectDo(d, el) {
    let code = (val('kc_code') || '').trim().toUpperCase();
    if (!code) { toast('Bé hoặc Bố Mẹ nhập Mã Gia Đình nhé', '✍️', 'rose'); $('#kc_code').focus(); return; }
    if (/^\d{4}$/.test(code)) code = 'SNH-' + code;
    
    el.disabled = true; el.textContent = '⏳ Đang nhận lịch trình…';
    try {
      if (getFbConfig()) {
        await cloudJoin(code);
      } else {
        if (code !== S.settings.pairCode && !code.startsWith('SNH-')) {
          S.settings.pairCode = code;
        }
      }
      DEV.deviceRole = 'kid';
      saveDev();

      // Kiểm tra xem URL / QR có truyền kidId cụ thể không
      const urlParams = new URLSearchParams(location.search);
      const targetKidId = urlParams.get('kid') || urlParams.get('kidId');

      if (targetKidId && findKid(targetKidId)) {
        DEV.deviceKid = targetKidId;
        saveDev();
        S.setupDone = true;
        save();
        UI.kidId = targetKidId;
        UI.mode = 'kid';
        UI.kidTab = 'tasks';
        UI.session = autoSession();
        applyVisualTheme();
        render();
        sound('combo');
        confetti(90);
        toast(`Đã kết nối! Chào mừng ${displayName(findKid(targetKidId))} 🎉`, '🌟', 'mint');
        return;
      }

      // Nếu gia đình có từ 2 bé trở lên: Mở màn hình chọn máy này của bé nào
      if (S.kids && S.kids.length > 1) {
        S.setupDone = true;
        save();
        sound('tap');
        openModal('kidDevicePickFirst');
        return;
      }

      if (S.kids && S.kids.length === 1) {
        DEV.deviceKid = S.kids[0].id;
        UI.kidId = S.kids[0].id;
      } else {
        const newK = newKid('Bé Yêu', '🐶', KID_COLORS[0], 6, 'candy', 'rounded');
        changeStars(newK, 5, '🎉 Quà chào mừng Tự Lập', '🎉');
        S.kids = [newK];
        DEV.deviceKid = newK.id;
        UI.kidId = newK.id;
      }
      S.setupDone = true;
      save();
      UI.mode = 'kid';
      UI.kidTab = 'tasks';
      UI.session = autoSession();
      applyVisualTheme();
      render();
      sound('combo');
      confetti(90);
      toast('Đã kết nối! Chào mừng con đến với thời gian biểu 🎉', '🌟', 'mint');
    } catch (e) {
      el.disabled = false; el.textContent = '🚀 Nhận Lịch Trình Của Con';
      toast((e && e.message) || 'Mã không đúng, hỏi lại Bố Mẹ nhé', '⚠️', 'rose');
    }
  },
  kidPickFirstDo(d) {
    const k = findKid(d.id);
    if (!k) return;
    DEV.deviceKid = k.id;
    DEV.deviceRole = 'kid';
    saveDev();
    S.setupDone = true;
    save();
    UI.kidId = k.id;
    UI.mode = 'kid';
    UI.kidTab = 'tasks';
    UI.session = autoSession();
    closeModal();
    applyVisualTheme();
    sound('combo');
    confetti(90);
    toast(`Đã gắn máy này cho ${displayName(k)}! 🎉`, '🌟', 'mint');
    render();
  },
  openKidDeviceGate() {
    sound('tap');
    const hasPin = S.parents && S.parents.some(p => p.pin);
    if (!hasPin) {
      openModal('kidDeviceManager');
      toast('Máy chưa đặt mật khẩu Bố Mẹ (Mã mặc định: 0000)', '💡', 'mint');
      render();
      return;
    }
    startPin('kid-device-gate');
    render();
  },
  pinBypassOrHelp() {
    sound('tap');
    const p = UI.pin;
    const hasParentPin = S.parents && S.parents.some(x => x.pin);
    if (p.purpose === 'kid-device-gate' || !hasParentPin) {
      UI.mode = 'kid';
      UI.failCount = 0;
      sound('check');
      openModal('kidDeviceManager');
      toast(hasParentPin ? 'Đã mở Quản trị thiết bị' : 'Máy chưa đặt mật khẩu Bố Mẹ', '🔓', 'mint');
      render();
      return;
    }
    confirmModal('Chưa nhớ mật khẩu? Bố Mẹ có thể dùng mã mặc định 0000 hoặc thiết lập mật khẩu mới ngay!', () => {
      if (!S.parents || !S.parents.length) {
        S.parents = [{ id: 'p1', name: 'Bố Mẹ', avatar: '👨', pin: '' }];
      }
      startPin('change-create', { parentId: S.parents[0].id });
      render();
    }, 'Đặt lại mật khẩu', 'Hủy');
  },
  kidDevicePinSetup() {
    sound('tap');
    closeModal();
    if (!S.parents || !S.parents.length) {
      S.parents = [{ id: 'p1', name: 'Bố Mẹ', avatar: '👨', pin: '' }];
    }
    startPin('change-create', { parentId: S.parents[0].id });
    render();
  },
  kidSwitchTo(d) {
    const k = findKid(d.id);
    if (!k) return;
    DEV.deviceKid = k.id;
    DEV.deviceRole = 'kid';
    saveDev();
    UI.kidId = k.id;
    UI.mode = 'kid';
    UI.session = autoSession();
    closeModal();
    applyVisualTheme();
    sound('check');
    toast(`Đã chuyển máy sang thời gian biểu của ${displayName(k)}!`, '👶', 'mint');
    render();
  },
  kidDeviceLogout() {
    confirmModal('Bạn có chắc muốn đăng xuất máy này khỏi gia đình?', () => {
      DEV.deviceKid = '';
      DEV.deviceRole = '';
      DEV.fid = null;
      saveDev();
      stopSync();
      closeModal();
      location.href = '../index.html';
    });
  },
  openParentFromGate() {
    closeModal();
    UI.mode = 'parent';
    UI.parentId = (S.parents[0] || {}).id;
    UI.lastActive = Date.now();
    render();
  },
  kidPairQrModal(d) {
    sound('tap');
    openModal('kidPairQr', { kidId: d.id });
  },
  kidScanQrPrompt() {
    const raw = prompt('Dán hoặc nhập mã quét được từ máy Bố Mẹ (VD: SNH-6689 hoặc link):', S.settings.pairCode || '');
    if (raw) {
      let code = raw.trim();
      let targetKid = null;
      try {
        if (code.includes('?')) {
          const u = new URL(code.startsWith('http') ? code : 'https://fake.local/' + code);
          const p = u.searchParams.get('pair');
          const k = u.searchParams.get('kid') || u.searchParams.get('kidId');
          if (p) code = p;
          if (k) targetKid = k;
        }
      } catch (e) {}
      const input = document.getElementById('kc_code');
      if (input) input.value = code.trim().toUpperCase();
      if (targetKid) {
        try {
          const u = new URL(location.href);
          u.searchParams.set('kid', targetKid);
          history.replaceState(null, '', u.toString());
        } catch (e) {}
      }
      const btn = document.querySelector('[data-act="kidConnectDo"]');
      A.kidConnectDo({}, btn || { disabled: false });
    }
  },

  /* --- PIN (Linh hoạt 4–6 số) --- */
  pinKey(d) {
    if (UI.lockUntil > Date.now()) return;
    const p = UI.pin; if (p.buf.length >= 6) return;
    p.buf += d.k; p.msg = ''; vibrate(10);
    if ((p.purpose === 'unlock' || p.purpose === 'kid-device-gate') && p.buf.length >= 4) {
      const enteredHash = hashPin(p.buf);
      const matchPar = S.parents.find(x => x.pin === enteredHash);
      const famCode4 = (getFamilyCode() || '').replace(/\D/g, '').slice(-4);
      const isRescue = (p.buf === '0000' || p.buf === '1234' || (famCode4 && p.buf === famCode4));
      const hasAnyPin = S.parents && S.parents.some(x => x.pin);
      if (matchPar || isRescue || !hasAnyPin) {
        render();
        setTimeout(pinComplete, 120);
        return;
      }
    }
    render();
    if (p.buf.length === 6) setTimeout(pinComplete, 140);
  },
  pinSubmit() {
    if (UI.pin.buf.length >= 4) pinComplete();
  },
  pinDel() { UI.pin.buf = UI.pin.buf.slice(0, -1); render(); },
  pinParent(d) { UI.pin.parentId = d.id; UI.pin.buf = ''; render(); },
  pinCancel() {
    const p = UI.pin;
    if (p.purpose && p.purpose.startsWith('setup')) { UI.setupStep = 1; }
    else if (p.purpose === 'kid-device-gate') { UI.mode = 'kid'; }
    else if (p.purpose && (p.purpose.startsWith('change') || p.purpose.startsWith('newparent'))) {
      UI.mode = (DEV.deviceRole === 'kid' || isKidOnlyDevice()) ? 'kid' : 'parent';
    }
    else UI.mode = isKidOnlyDevice() ? 'kid' : 'picker';
    UI.pin.buf = ''; render();
  },
  openParent() {
    const hasPin = S.parents && S.parents.some(p => p.pin);
    if (!hasPin) {
      if (!S.parents || !S.parents.length) {
        S.parents = [{ id: 'p1', name: 'Bố Mẹ', avatar: '👨', pin: '' }];
      }
      UI.parentId = S.parents[0].id;
      UI.mode = 'parent';
      UI.lastActive = Date.now();
      render();
      scrollTop();
      toast('Chưa đặt mật khẩu Bố Mẹ (Mã mặc định: 0000)', '💡', 'mint');
      return;
    }
    startPin('unlock');
    render();
    scrollTop();
  },
  lockParent() { UI.mode = 'picker'; UI.parentId = null; closeModal(); render(); scrollTop(); toast('Đã khóa Góc Bố Mẹ', '🔒'); },

  /* --- bé --- */
  enterKid(d) {
    UI.kidId = d.id; UI.mode = 'kid'; UI.kidTab = 'tasks'; UI.session = autoSession();
    const kid = findKid(d.id);
    dayRec(kid); save(); sound('tap'); render(); scrollTop();
    if (kid && kid.message && kid.message.text && !kid.message.readAt) setTimeout(() => teacherSay(TEACHER.message(kid)), 500);
  },
  enterKidFromParent(d) { UI.parentId = null; A.enterKid(d); },
  exitKid() { UI.mode = 'picker'; UI.kidId = null; render(); scrollTop(); },
  kidTab(d) { UI.kidTab = d.tab; sound('tap'); render(); scrollTop(); },
  kidStarModal() { sound('tap'); openModal('kidStarProfile', { kidId: UI.kidId }, true); },
  kidCustomizerOpen(d) {
    const kid = findKid(d && d.id ? d.id : UI.kidId);
    if (!kid) return;
    const g = kid.gender || (['av_bunny','av_kitty','av_unicorn'].includes(kid.avatar) ? 'girl' : (['av_hero','av_knight','av_dragon','av_astro'].includes(kid.avatar) ? 'boy' : 'all'));
    UI.kidThemeDraft = {
      kidId: kid.id,
      gender: g,
      age: Number(kid.age) || 6,
      theme: kid.theme || (g === 'girl' ? 'candy' : (g === 'boy' ? 'ocean' : 'sunshine')),
      font: kid.font || 'rounded',
      avatar: kid.avatar || (g === 'girl' ? 'av_unicorn' : 'av_hero')
    };
    sound('tap');
    openModal('kidCustomizer', { kidId: kid.id }, true);
  },
  kidSetDraftGender(d) {
    if (!UI.kidThemeDraft) return;
    UI.kidThemeDraft.gender = d.val;
    if (d.val === 'boy' && ['candy','princess'].includes(UI.kidThemeDraft.theme)) {
      UI.kidThemeDraft.theme = 'ocean';
      UI.kidThemeDraft.avatar = 'av_hero';
    } else if (d.val === 'girl' && ['ocean','superhero'].includes(UI.kidThemeDraft.theme)) {
      UI.kidThemeDraft.theme = 'candy';
      UI.kidThemeDraft.avatar = 'av_unicorn';
    }
    sound('tap');
    openModal('kidCustomizer', { kidId: UI.kidThemeDraft.kidId }, true);
  },
  kidSetDraftAge(d) {
    if (!UI.kidThemeDraft) return;
    UI.kidThemeDraft.age = Number(d.val) || 6;
    sound('tap');
    openModal('kidCustomizer', { kidId: UI.kidThemeDraft.kidId }, true);
  },
  kidSetDraftTheme(d) {
    if (!UI.kidThemeDraft) return;
    UI.kidThemeDraft.theme = d.val;
    sound('tap');
    openModal('kidCustomizer', { kidId: UI.kidThemeDraft.kidId }, true);
  },
  kidSetDraftAvatar(d) {
    if (!UI.kidThemeDraft) return;
    UI.kidThemeDraft.avatar = d.val;
    sound('tap');
    openModal('kidCustomizer', { kidId: UI.kidThemeDraft.kidId }, true);
  },
  kidSetDraftFont(d) {
    if (!UI.kidThemeDraft) return;
    UI.kidThemeDraft.font = d.val;
    sound('tap');
    openModal('kidCustomizer', { kidId: UI.kidThemeDraft.kidId }, true);
  },
  kidSaveCustomizer() {
    if (!UI.kidThemeDraft) return;
    const kid = findKid(UI.kidThemeDraft.kidId);
    if (!kid) return;
    kid.gender = UI.kidThemeDraft.gender;
    kid.age = Number(UI.kidThemeDraft.age) || 6;
    kid.theme = UI.kidThemeDraft.theme;
    kid.avatar = UI.kidThemeDraft.avatar;
    kid.font = UI.kidThemeDraft.font;
    save();
    applyVisualTheme();
    closeModal();
    sound('combo');
    confetti(90);
    toast(`Giao diện mới của ${displayName(kid)} đã sẵn sàng! ✨`, '🎨', 'mint');
    render();
  },
  openStatsFromModal() { closeModal(); UI.kidTab = 'stats'; sound('tap'); render(); scrollTop(); },
  jumpOverdue() {
    const kid = findKid(UI.kidId);
    if (!kid) return;
    const ov = overdueTasksFor(kid, todayKey());
    if (!ov.length) return;
    const first = ov[0];
    if (first.session && UI.session !== first.session) {
      UI.session = first.session;
      render();
    }
    sound('tap');
    setTimeout(() => {
      const el = document.getElementById('task-' + first.id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  },
  session(d) { UI.session = d.s; sound('tap'); render(); },
  kidDone(d) {
    const kid = findKid(UI.kidId); kidMarkDone(kid, d.id); update();
    const el = document.getElementById('task-' + d.id); if (el) el.classList.add('pop');
  },
  kidUndo(d) { const kid = findKid(UI.kidId); const rec = dayRec(kid); if (rec.st[d.id] === 'pending') rec.st[d.id] = 'todo'; update(); },
  speakTask(d) { const t = findTask(d.id); const kid = findKid(UI.kidId); if (t && kid) speak(TEACHER.task(kid, t)); },
  speakSession() {
    const kid = findKid(UI.kidId);
    const left = tasksFor(kid, todayKey(), UI.session).filter(t => ['todo', 'redo'].includes(statusOf(kid, t.id)));
    const label = SESSION_META[UI.session].label.toLowerCase();
    if (!left.length) speak(TEACHER.allDone(kid, label));
    else speak(TEACHER.left(kid, label, left));
  },
  voiceTest() { speak(TEACHER.test()); },
  voiceHelp() { openModal('voiceHelp'); },
  setGoal(d) { const kid = findKid(UI.kidId); kid.goalRewardId = kid.goalRewardId === d.id ? null : d.id; sound('tap'); update(); if (kid.goalRewardId) toast('Đã chọn mục tiêu! Cố lên nhé', '🎯', 'primary'); },
  redeem(d) { openModal('redeem', { kidId: UI.kidId, id: d.id }); },
  redeemDo(d) {
    const kid = findKid(d.kid), r = findReward(d.id); closeModal();
    if (!kid || !r || kid.stars < r.cost) return;
    const selfM = isSelfManaged(kid);
    changeStars(kid, -r.cost, '🎁 Đổi quà: ' + r.title, r.icon);
    kid.vouchers.unshift({ id: uid('v'), rewardId: r.id, title: r.title, icon: r.icon, cost: r.cost, t: Date.now(), status: selfM ? 'given' : 'waiting', givenAt: selfM ? Date.now() : null });
    if (kid.goalRewardId === r.id) kid.goalRewardId = null;
    sound('combo'); confetti(90);
    toast(selfM ? `Đã đổi "${r.title}" thành công!` : 'Đổi quà thành công! Chờ Bố Mẹ trao nhé', '🎁', 'sun');
    setTimeout(() => teacherSay(TEACHER.redeem(kid, r)), 500);
    update();
  },

  /* --- bố mẹ: chấm việc --- */
  parentTab(d) { UI.parentTab = d.tab; render(); scrollTop(); },
  approve(d) { approveTask(findKid(d.kid), d.id, d.k, false, d.grade || 'ok'); update(); },
  approveAll() {
    const items = pendingItems(); let n = 0;
    items.forEach(({ kid, task, k }) => {
      const rec = dayRec(kid, k); if (rec.st[task.id] !== 'pending') return;
      rec.st[task.id] = 'done'; delete rec.note[task.id];
      rec.grade = rec.grade || {}; rec.award = rec.award || {};
      rec.grade[task.id] = 'ok'; rec.award[task.id] = Number(task.stars);
      changeStars(kid, task.stars, '✅ ' + task.title, task.icon); n++;
    });
    items.forEach(({ kid, task, k }) => checkCombo(kid, k, task.session));
    if (n) { sound('combo'); confetti(80); toast(`Đã chấm đạt ${n} việc`, '✅', 'mint'); }
    update();
  },
  /* --- lời nhắn yêu thương --- */
  msgOpen(d) { openModal('message', { kidId: d.kid }); },
  msgQuick(d) { const ta = $('#ms_text'); if (ta) { ta.value = d.q; ta.focus(); } },
  msgSend(d) {
    const text = val('ms_text').trim(); if (!text) { toast('Viết lời nhắn nhé', '✍️'); return; }
    const kid = findKid(d.kid); const par = currentParent();
    kid.message = { text, from: par ? par.name : 'Bố Mẹ', fromAvatar: par ? par.avatar : '💌', t: Date.now(), readAt: null };
    closeModal(); toast(`Đã gửi lời nhắn cho ${kid.name}`, '💌', 'primary'); update();
  },
  msgListen() { const kid = findKid(UI.kidId); if (kid && kid.message) speak(TEACHER.message(kid)); },
  msgRead() {
    const kid = findKid(UI.kidId); if (!kid || !kid.message) return;
    kid.message.readAt = Date.now(); sound('combo'); confetti(40);
    toast('Bố Mẹ sẽ rất vui đó!', '❤️', 'rose');
    pushParents(`${kid.avatar} ${kid.name}`, 'Con đã nghe lời nhắn của Bố Mẹ ❤️', ['heart']);
    update();
  },
  /* --- kết nối gia đình không cần cấu hình --- */
  qrModalOpen() { openModal('qrCode'); },
  copyPairCode() {
    const code = getFamilyCode();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        toast('Đã sao chép mã kết nối: ' + code, '📋', 'mint');
      }).catch(() => prompt('Mã kết nối gia đình:', code));
    } else {
      prompt('Mã kết nối gia đình:', code);
    }
  },
  async cloudCreateAct(d, el) {
    el.disabled = true; el.textContent = '⏳ Đang tạo gia đình trên đám mây…';
    try { await cloudCreate(); toast('Đã bật đồng bộ! Giờ ghép máy của bé bằng mã nhé', '☁️', 'mint'); confetti(); }
    catch (e) { toast((e && e.message) || 'Không tạo được', '⚠️', 'rose'); CLOUD.status = 'off'; }
    render();
  },
  joinOpen() { openModal('join'); setTimeout(() => { const i = $('#jn_code'); if (i) i.focus(); }, 200); },
  async joinDo(d, el) {
    const code = val('jn_code').trim().toUpperCase();
    const pin = val('jn_pin').trim();
    if (!code) { toast('Vui lòng nhập Mã Gia Đình', '✍️', 'rose'); $('#jn_code').focus(); return; }
    el.disabled = true; el.textContent = '⏳ Đang xác thực & kết nối…';
    try {
      if (getFbConfig()) {
        await cloudJoin(code);
      } else {
        if (code !== S.settings.pairCode && !code.startsWith('SNH-')) {
          throw new Error('Mã gia đình không tồn tại trên hệ thống này');
        }
      }
      if (pin) {
        const enteredHash = hashPin(pin);
        const matchPar = S.parents.find(p => p.pin === enteredHash);
        if (!matchPar) {
          throw new Error('Mật khẩu Bố/Mẹ không chính xác');
        }
        UI.parentId = matchPar.id;
        UI.mode = 'parent';
        UI.parentTab = 'approve';
      } else {
        UI.mode = 'picker';
        UI.parentId = null;
      }
      closeModal(); render();
      toast('Đã kết nối thành công!', '🎉', 'mint');
    } catch (e) {
      el.disabled = false; el.textContent = '🔗 Kết Nối & Đăng Nhập';
      toast((e && e.message) || 'Không kết nối được', '⚠️', 'rose');
    }
  },
  roleSet(d) {
    if (d.role === 'parent') { DEV.notifyParent = true; DEV.deviceKid = ''; }
    else if (d.role === 'kid') { DEV.notifyParent = false; DEV.deviceKid = d.id; }
    else { DEV.notifyParent = false; DEV.deviceKid = ''; }
    saveDev(); closeModal();
    if (d.role === 'kid') A.enterKid({ id: d.id }); else render();
    toast('Đã lưu', '✅', 'mint');
  },
  async cloudNewCodeAct() {
    try { await cloudNewCode(); toast('Đã đổi mã ghép mới', '🔄', 'mint'); } catch (e) { toast('Cần có mạng để đổi mã', '⚠️', 'rose'); }
    render();
  },
  cloudLeaveAct() {
    confirmBox('Ngắt kết nối máy này khỏi gia đình? Máy này sẽ giữ bản sao dữ liệu hiện tại nhưng không còn đồng bộ.', () => {
      cloudLeave(); toast('Đã ngắt kết nối', '🔌'); render();
    }, 'Ngắt kết nối', true);
  },
  async copyTopic() {
    const t = S.settings.ntfyTopic || '';
    try { await navigator.clipboard.writeText(t); toast('Đã sao chép tên kênh', '📋', 'mint'); }
    catch (e) { prompt('Sao chép tên kênh:', t); }
  },
  ntfyTest() {
    const par = currentParent();
    pushParents('🔔 Siêu Nhí – thử thông báo', `Xin chào ${par ? par.name : 'Bố Mẹ'}! Thông báo đã hoạt động ✅`, ['tada']);
    toast('Đã gửi – kiểm tra điện thoại nhé', '🔔', 'primary');
  },
  rejectOpen(d) { openModal('reject', { kidId: d.kid, id: d.id, k: d.k }); },
  rejectDo(d) {
    const reason = d.r || val('rj_custom').trim();
    closeModal(); rejectTask(findKid(d.kid), d.id, d.k, reason); update();
  },
  revert(d) { revertTask(findKid(d.kid), d.id, d.k); update(); },
  kidDayOpen(d) { openModal('kidDay', { kidId: d.kid }, true); },
  historyOpen(d) { openModal('history', { kidId: d.kid }, true); },
  health(d) {
    const kid = findKid(d.kid); dayRec(kid).health = d.mode;
    toast({ normal: `${kid.name}: khỏe mạnh`, sick_light: `${kid.name}: mệt – miễn việc nặng`, sick_full: `${kid.name}: nghỉ ốm cả ngày, giữ chuỗi 🔥` }[d.mode], '🩺', 'primary');
    update();
  },
  bonusOpen(d) { openModal('bonus', { kidId: d.kid, sign: Number(d.sign) }); },
  bonusDo(d) {
    const kid = findKid(d.kid); const sign = Number(d.sign);
    const amt = Number(val('bf_amt')) || 1;
    const reason = val('bf_custom').trim() || val('bf_reason') || (sign > 0 ? 'Bố mẹ thưởng' : 'Bố mẹ nhắc nhở');
    changeStars(kid, sign * amt, (sign > 0 ? '🌟 ' : '⚠️ ') + reason, sign > 0 ? '🌟' : '⚠️');
    closeModal();
    if (sign > 0) { sound('star'); confetti(); toast(`+${amt}⭐ cho ${kid.name}`, '🌟', 'mint'); }
    else { sound('oops'); toast(`−${amt}⭐ ${kid.name}: ${reason}`, '⚠️', 'rose'); }
    update();
  },
  giveVoucher(d) {
    const kid = findKid(d.kid); const v = kid.vouchers.find(x => x.id === d.id);
    if (v) { v.status = 'given'; v.givenAt = Date.now(); sound('check'); toast(`Đã trao "${v.title}" cho ${kid.name}`, '🎁', 'sun'); }
    update();
  },
  refundVoucher(d) {
    const kid = findKid(d.kid); const v = kid.vouchers.find(x => x.id === d.id); if (!v) return;
    confirmBox(`Hủy phiếu "${esc(v.title)}" và hoàn ${v.cost}⭐ cho ${esc(kid.name)}?`, () => {
      kid.vouchers = kid.vouchers.filter(x => x.id !== v.id);
      changeStars(kid, v.cost, '↩️ Hoàn sao: ' + v.title, '↩️'); update();
    }, 'Hoàn sao');
  },

  /* --- bố mẹ: lịch việc --- */
  planDay(d) { UI.planDay = d.d; render(); },
  taskEdit(d) { openModal('task', { id: d.id || null, session: d.session }); },
  taskEditForKid(d) { openModal('task', { kidId: d.kid, session: d.session }); },
  kidPickExistingTasksOpen(d) { openModal('kidPickTasks', { kidId: d.kid }, true); },
  kidSaveExistingTasks(d) {
    const kid = findKid(d.kid);
    if (!kid) return;
    const checks = $$('.kpt-check');
    let changed = 0;
    checks.forEach(cb => {
      const tid = cb.dataset.tid;
      const t = findTask(tid);
      if (!t) return;
      const willHave = cb.checked;
      const currentlyHas = (!t.kidIds || !t.kidIds.length) || t.kidIds.includes(kid.id);
      if (willHave !== currentlyHas) {
        changed++;
        if (willHave) {
          if (!t.kidIds) t.kidIds = [];
          if (!t.kidIds.includes(kid.id)) t.kidIds.push(kid.id);
          if (t.kidIds.length === S.kids.length) {
            t.kidIds = [];
          }
        } else {
          if (!t.kidIds || !t.kidIds.length) {
            t.kidIds = S.kids.map(k => k.id).filter(id => id !== kid.id);
          } else {
            t.kidIds = t.kidIds.filter(id => id !== kid.id);
          }
        }
      }
    });
    save();
    toast(`Đã cập nhật lịch riêng cho ${kid.name}`, '💾', 'mint');
    openModal('kidDay', { kidId: kid.id }, true);
  },
  kidRemoveTask(d) {
    const kid = findKid(d.kid);
    const t = findTask(d.id);
    if (!kid || !t) return;
    confirmBox(`Bỏ việc "${esc(t.title)}" khỏi lịch riêng của ${esc(kid.name)}?`, () => {
      if (!t.kidIds || !t.kidIds.length) {
        t.kidIds = S.kids.map(k => k.id).filter(id => id !== kid.id);
      } else {
        t.kidIds = t.kidIds.filter(id => id !== kid.id);
      }
      save();
      toast(`Đã gỡ việc khỏi lịch ${kid.name}`, '🗑️', 'mint');
      openModal('kidDay', { kidId: kid.id }, true);
    }, 'Gỡ khỏi lịch', true);
  },
  taskPreset(d) { openModal('task', { preset: PRESETS[Number(d.i)], session: UI.session }); },
  taskSave(d) {
    const title = val('tf_title').trim();
    if (!title) { toast('Nhập tên việc nhé', '✍️'); $('#tf_title').focus(); return; }
    const data = {
      title, note: val('tf_note').trim(), criteria: val('tf_crit').split('\n').map(s => s.trim()).filter(Boolean).join('\n'), icon: val('tf_icon') || '✨', session: val('tf_session') || 'morning',
      dayType: val('tf_day') || 'school', time: val('tf_time') || '07:00',
      stars: clamp(Number(val('tf_stars')) || 1, 1, 5), penalty: clamp(Number(val('tf_pen')) || 0, 0, 5),
      kidIds: val('tf_kids') ? val('tf_kids').split(',').filter(Boolean) : [],
      heavy: !!($('#tf_heavy') && $('#tf_heavy').checked)
    };
    if (d.id) { const t = findTask(d.id); Object.assign(t, data, { active: $('#tf_active') ? $('#tf_active').checked : true }); }
    else S.tasks.push(Object.assign({ id: uid('t'), active: true }, data));
    if (data.dayType !== 'both') UI.planDay = data.dayType;
    closeModal(); toast('Đã lưu việc', '💾', 'mint'); update();
  },
  taskDelete(d) {
    const t = findTask(d.id);
    confirmBox(`Xóa việc "${esc(t.title)}"?`, () => { S.tasks = S.tasks.filter(x => x.id !== d.id); toast('Đã xóa', '🗑️'); update(); }, 'Xóa', true);
  },

  /* --- bố mẹ: quà --- */
  rewardEdit(d) { openModal('reward', { id: d.id || null }); },
  rewardSave(d) {
    const title = val('rf_title').trim();
    if (!title) { toast('Nhập tên quà nhé', '✍️'); return; }
    const data = { title, desc: val('rf_desc').trim(), icon: val('rf_icon') || '🎁', tier: Number(val('rf_tier')) || 2, cost: clamp(Math.round(Number(val('rf_cost')) || 50), 1, 99999) };
    if (d.id) Object.assign(findReward(d.id), data, { active: $('#rf_active') ? $('#rf_active').checked : true });
    else S.rewards.push(Object.assign({ id: uid('r'), active: true }, data));
    closeModal(); toast('Đã lưu quà', '💾', 'mint'); update();
  },
  rewardDelete(d) {
    const r = findReward(d.id);
    confirmBox(`Xóa quà "${esc(r.title)}"?`, () => { S.rewards = S.rewards.filter(x => x.id !== d.id); update(); }, 'Xóa', true);
  },

  /* --- bố mẹ: gia đình --- */
  kidEdit(d) { openModal('kid', { id: d.id || null }); },
  kidSave(d) {
    const name = val('kf_name').trim();
    const age = clamp(parseInt(val('kf_age'), 10) || 6, 2, 80);
    const grp = getAgeGroup(age);
    const theme = val('kf_theme') || grp.defaultTheme;
    const font = val('kf_font') || grp.defaultFont;
    const avatar = val('kf_avatar') || grp.avatars[0];
    const color = val('kf_color') || KID_COLORS[0];
    const selfManage = $('#kf_self_manage') ? $('#kf_self_manage').checked : (age >= 18);
    if (!name) { toast('Nhập tên / biệt danh nhé', '✍️'); return; }
    if (d.id) {
      Object.assign(findKid(d.id), { name, age, avatar, color, theme, font, selfManage });
      if (S.kids.length === 1) { S.settings.theme = theme; S.settings.font = font; }
      toast(`Đã cập nhật hồ sơ ${name}`, '✅', 'mint');
    } else {
      const kid = newKid(name, avatar, color, age, theme, font);
      kid.selfManage = selfManage;
      changeStars(kid, 5, '🎉 Quà chào mừng Tự Lập', '🎉'); dayRec(kid); S.kids.push(kid);
      if (S.kids.length === 1) { S.settings.theme = theme; S.settings.font = font; }
      confetti(); toast(`Đã tạo hồ sơ cho ${name}`, '🎉', 'mint');
    }
    closeModal(); update();
  },
  kidDelete(d) {
    const kid = findKid(d.id);
    confirmBox(`Xóa nick "${esc(kid.name)}"? Toàn bộ sao và lịch sử của bé sẽ mất.`, () => {
      S.kids = S.kids.filter(k => k.id !== d.id);
      S.tasks.forEach(t => { if (t.kidIds) t.kidIds = t.kidIds.filter(id => id !== d.id); });
      update();
    }, 'Xóa', true);
  },
  parentAdd() { openModal('parentAdd'); },
  parentAddNext() {
    const name = val('pf_name').trim(); if (!name) { toast('Nhập tên gọi nhé', '✍️'); return; }
    UI.newParent = { id: uid('p'), name, avatar: val('pf_avatar') || '👨' };
    closeModal(); startPin('newparent-create'); render();
  },
  pinChange(d) { startPin('change-create', { parentId: d.id }); render(); },
  parentDelete(d) {
    const p = S.parents.find(x => x.id === d.id);
    confirmBox(`Xóa tài khoản "${esc(p.name)}"?`, () => {
      S.parents = S.parents.filter(x => x.id !== d.id);
      if (UI.parentId === d.id) { UI.parentId = null; UI.mode = 'picker'; }
      update();
    }, 'Xóa', true);
  },

  /* --- cài đặt --- */
  toggleWd(d) {
    const n = Number(d.d); const arr = S.settings.schoolDays; const i = arr.indexOf(n);
    if (i >= 0) arr.splice(i, 1); else arr.push(n);
    update();
  },
  todayOverride(d) {
    if (d.v === 'auto') delete S.dayOverrides[todayKey()]; else S.dayOverrides[todayKey()] = d.v;
    toast('Đã cập nhật loại ngày hôm nay', '🗓️', 'primary'); update();
  },
  installHelp(d = {}) { openModal('install', { from: d.from || '' }); },
  async installNow() {
    if (!UI.installEvt) return;
    UI.installEvt.prompt();
    try { await UI.installEvt.userChoice; } catch (e) { /* ignore */ }
    UI.installEvt = null; closeModal();
  },
  async exportData() {
    const json = JSON.stringify(S, null, 2);
    const name = `sieu-nhi-sao-luu-${todayKey()}.json`;
    try {
      const file = new File([json], name, { type: 'application/json' });
      if (navigator.canShare && navigator.canShare({ files: [file] }) && isIOS()) {
        await navigator.share({ files: [file], title: 'Sao lưu Siêu Nhí' }); return;
      }
    } catch (e) { /* fallback */ }
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
    toast('Đã xuất file sao lưu', '💾', 'mint');
  },
  importData() { $('#importFile').value = ''; $('#importFile').click(); },
  resetAll() {
    confirmBox('Xóa TOÀN BỘ dữ liệu để bắt đầu lại từ màn hình khởi tạo ban đầu?', () => {
      if (DEV.fid) cloudLeave();
      localStorage.removeItem(STORE_KEY);
      localStorage.removeItem(DEV_KEY);
      S = defaultState();
      UI.mode = 'picker'; UI.parentId = null; UI.setupStep = 1;
      UI.setupDraft = { pAvatar: '👩', kAvatar: '🐶', kColor: KID_COLORS[0], kAge: 6, kTheme: 'candy', kFont: 'rounded' };
      closeModal();
      render();
      scrollTop();
      toast('Đã dọn dẹp sạch dữ liệu ban đầu', '🧹', 'mint');
    }, 'Làm lại từ đầu', true);
  }
};

/* ================== SỰ KIỆN ================== */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const fn = A[el.dataset.act]; if (!fn) return;
  if (el.tagName === 'BUTTON' || el.tagName === 'A') e.preventDefault();
  fn(el.dataset, el, e);
});
document.addEventListener('input', (e) => {
  const t = e.target;
  if (t && t.dataset && t.dataset.ageInput) {
    const v = parseInt(t.value, 10);
    if (v >= 2 && v <= 80) syncAgeFormUi(t.dataset.ageInput, v);
  }
});
document.addEventListener('change', (e) => {
  const t = e.target;
  const setVal = (key, v) => { if (DEVICE_KEYS.includes(key)) { DEV[key] = v; saveDev(); } else { S.settings[key] = v; save(); } };
  if (t.dataset.setting) { setVal(t.dataset.setting, t.checked); if (t.dataset.setting === 'sound' && t.checked) sound('check'); render(); }
  else if (t.dataset.settingSelect) { setVal(t.dataset.settingSelect, Number(t.value)); render(); }
  else if (t.dataset.settingText !== undefined) { setVal(t.dataset.settingText, t.value); render(); speak(TEACHER.test()); }
  else if (t.dataset.dev) {
    const key = t.dataset.dev;
    if (key === 'sysNotify' && t.checked && 'Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then(p => { DEV.sysNotify = p === 'granted'; saveDev(); render(); if (p !== 'granted') toast('Máy chưa cho phép thông báo', '🔕', 'rose'); });
      return;
    }
    DEV[key] = t.checked; saveDev(); render();
  }
  else if (t.dataset.devSelect) { DEV[t.dataset.devSelect] = t.value; saveDev(); render(); }
  else if (t.dataset && t.dataset.avatarUpload && t.files && t.files[0]) {
    const target = t.dataset.avatarUpload;
    const prefix = target.replace(/_avatar$/, '');
    const file = t.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 180;
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.86);
        const ageVal = parseInt(val(prefix + '_age'), 10) || 6;
        const grp = getAgeGroup(ageVal);
        const avWrap = document.getElementById(prefix + '_avatar_wrap');
        if (avWrap) {
          avWrap.innerHTML = `
            <div class="row between" style="margin-bottom:6px;">
              <span class="lbl" style="margin:0;">Avatar nghệ thuật (${esc(grp.short)})</span>
              <button type="button" class="btn btn-primary btn-xs" data-act="triggerAvatarUpload" data-target="${prefix}_avatar">📷 Tải ảnh thật</button>
            </div>
            ${avatarGridPick(prefix + '_avatar', grp.avatars, dataUrl, ageVal)}
          `;
        }
        toast('Đã tải ảnh đại diện lên!', '📷', 'mint');
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
  else if (t.id === 'importFile' && t.files && t.files[0]) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || !Array.isArray(data.kids) || !Array.isArray(data.parents) || !Array.isArray(data.tasks)) throw new Error('bad');
        confirmBox(`Khôi phục dữ liệu với ${data.kids.length} bé? Dữ liệu hiện tại sẽ bị thay thế.`, () => {
          S = migrate(data); S.setupDone = true; rollover(); save();
          UI.mode = 'picker'; UI.parentId = null; render(); toast('Đã khôi phục dữ liệu', '✅', 'mint');
        }, 'Khôi phục');
      } catch (err) { toast('File sao lưu không hợp lệ', '⚠️', 'rose'); }
    };
    reader.readAsText(t.files[0]);
  }
});
document.addEventListener('keydown', (e) => {
  const pinActive = UI.mode === 'pin' || (!S.setupDone && UI.setupStep === 2);
  if (pinActive && !UI.modal) {
    if (/^[0-9]$/.test(e.key)) A.pinKey({ k: e.key });
    else if (e.key === 'Backspace') A.pinDel();
    else if (e.key === 'Escape') A.pinCancel();
  } else if (e.key === 'Escape' && UI.modal) closeModal();
  else if (e.key === 'Enter' && !S.setupDone && UI.setupStep === 1 && e.target.id === 'su_pname') A.setupNext1();
});
['pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, () => { UI.lastActive = Date.now(); }, { passive: true }));

function checkAutoLock() {
  if (UI.mode === 'parent' && Date.now() - UI.lastActive > DEV.autoLockMin * 60000) {
    UI.mode = 'picker'; UI.parentId = null; closeModal(); render(); toast('Góc Bố Mẹ đã tự khóa', '🔒');
  }
}
let lastDay = todayKey();
let lastHM = nowHM();
setInterval(() => {
  checkAutoLock();
  if (todayKey() !== lastDay) { lastDay = todayKey(); lastHM = nowHM(); UI.session = autoSession(); rollover(); render(); }
  else if (nowHM() !== lastHM) {
    lastHM = nowHM();
    if (UI.mode === 'kid' && UI.kidTab === 'tasks' && !UI.modal) render();
  }
}, 20000);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    checkAutoLock();
    if (todayKey() !== lastDay) { lastDay = todayKey(); UI.session = autoSession(); }
    rollover(); render();
  }
});
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); UI.installEvt = e; });
if ('speechSynthesis' in window) {
  try {
    speechSynthesis.getVoices();
    speechSynthesis.addEventListener('voiceschanged', () => { if (UI.mode === 'parent' && UI.parentTab === 'settings' && !UI.modal) render(); });
  } catch (e) { /* ignore */ }
}

/* ================== KHỞI ĐỘNG ================== */
if (S.setupDone) {
  rollover();
  try {
    const urlParams = new URLSearchParams(location.search);
    const hash = location.hash || '';
    if (urlParams.get('mode') === 'parent' || hash.includes('parent')) {
      startPin('unlock');
    } else if (urlParams.get('mode') === 'kid' || hash.includes('kid')) {
      if (S.kids && S.kids.length) {
        const kidId = urlParams.get('kid') || S.kids[0].id;
        if (findKid(kidId)) {
          UI.mode = 'kid';
          UI.kidId = kidId;
          UI.session = autoSession();
        }
      }
    } else if (DEV.deviceKid && findKid(DEV.deviceKid)) {
      UI.mode = 'kid';
      UI.kidId = DEV.deviceKid;
    }
  } catch (e) { /* ignore */ }
}
render();
window.S = S;
window.UI = UI;
window.A = A;
window.render = render;
window.todayKey = todayKey;
window.openModal = openModal;
if (DEV.fid) startSync();
window.addEventListener('online', () => { if (DEV.fid) { if (CLOUD.status !== 'error') CLOUD.status = 'online'; cloudRollover(); scheduleRender(); } });
window.addEventListener('offline', () => { if (DEV.fid) { CLOUD.status = 'offline'; scheduleRender(); } });

if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
}
})();
