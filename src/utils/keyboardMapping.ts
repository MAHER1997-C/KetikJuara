import { FingerId } from '../types';

export interface KeyInfo {
  key: string;
  display: string;
  finger: FingerId;
  fingerNameId: string;
  hand: 'left' | 'right';
  row: number; // 0: number row, 1: top, 2: home, 3: bottom, 4: space
  width?: string;
}

export const FINGER_NAMES: Record<FingerId, { name: string; hand: 'Kiri' | 'Kanan'; color: string; bgClass: string; borderClass: string; textClass: string }> = {
  'left-pinky': {
    name: 'Kelingking Kiri',
    hand: 'Kiri',
    color: '#f43f5e',
    bgClass: 'bg-rose-500/20',
    borderClass: 'border-rose-500',
    textClass: 'text-rose-400',
  },
  'left-ring': {
    name: 'Jari Manis Kiri',
    hand: 'Kiri',
    color: '#fb923c',
    bgClass: 'bg-orange-500/20',
    borderClass: 'border-orange-500',
    textClass: 'text-orange-400',
  },
  'left-middle': {
    name: 'Jari Tengah Kiri',
    hand: 'Kiri',
    color: '#facc15',
    bgClass: 'bg-amber-500/20',
    borderClass: 'border-amber-500',
    textClass: 'text-amber-400',
  },
  'left-index': {
    name: 'Telunjuk Kiri',
    hand: 'Kiri',
    color: '#4ade80',
    bgClass: 'bg-emerald-500/20',
    borderClass: 'border-emerald-500',
    textClass: 'text-emerald-400',
  },
  'thumb': {
    name: 'Ibu Jari (Spasi)',
    hand: 'Kanan',
    color: '#38bdf8',
    bgClass: 'bg-sky-500/20',
    borderClass: 'border-sky-500',
    textClass: 'text-sky-400',
  },
  'right-index': {
    name: 'Telunjuk Kanan',
    hand: 'Kanan',
    color: '#60a5fa',
    bgClass: 'bg-blue-500/20',
    borderClass: 'border-blue-500',
    textClass: 'text-blue-400',
  },
  'right-middle': {
    name: 'Jari Tengah Kanan',
    hand: 'Kanan',
    color: '#818cf8',
    bgClass: 'bg-indigo-500/20',
    borderClass: 'border-indigo-500',
    textClass: 'text-indigo-400',
  },
  'right-ring': {
    name: 'Jari Manis Kanan',
    hand: 'Kanan',
    color: '#a78bfa',
    bgClass: 'bg-violet-500/20',
    borderClass: 'border-violet-500',
    textClass: 'text-violet-400',
  },
  'right-pinky': {
    name: 'Kelingking Kanan',
    hand: 'Kanan',
    color: '#f472b6',
    bgClass: 'bg-pink-500/20',
    borderClass: 'border-pink-500',
    textClass: 'text-pink-400',
  },
};

export const KEYBOARD_ROWS: KeyInfo[][] = [
  // Row 0: Numbers & symbols
  [
    { key: '`', display: '~ `', finger: 'left-pinky', fingerNameId: 'Kelingking Kiri', hand: 'left', row: 0 },
    { key: '1', display: '1', finger: 'left-pinky', fingerNameId: 'Kelingking Kiri', hand: 'left', row: 0 },
    { key: '2', display: '2', finger: 'left-ring', fingerNameId: 'Jari Manis Kiri', hand: 'left', row: 0 },
    { key: '3', display: '3', finger: 'left-middle', fingerNameId: 'Jari Tengah Kiri', hand: 'left', row: 0 },
    { key: '4', display: '4', finger: 'left-index', fingerNameId: 'Telunjuk Kiri', hand: 'left', row: 0 },
    { key: '5', display: '5', finger: 'left-index', fingerNameId: 'Telunjuk Kiri', hand: 'left', row: 0 },
    { key: '6', display: '6', finger: 'right-index', fingerNameId: 'Telunjuk Kanan', hand: 'right', row: 0 },
    { key: '7', display: '7', finger: 'right-index', fingerNameId: 'Telunjuk Kanan', hand: 'right', row: 0 },
    { key: '8', display: '8', finger: 'right-middle', fingerNameId: 'Jari Tengah Kanan', hand: 'right', row: 0 },
    { key: '9', display: '9', finger: 'right-ring', fingerNameId: 'Jari Manis Kanan', hand: 'right', row: 0 },
    { key: '0', display: '0', finger: 'right-pinky', fingerNameId: 'Kelingking Kanan', hand: 'right', row: 0 },
    { key: '-', display: '-', finger: 'right-pinky', fingerNameId: 'Kelingking Kanan', hand: 'right', row: 0 },
    { key: '=', display: '=', finger: 'right-pinky', fingerNameId: 'Kelingking Kanan', hand: 'right', row: 0 },
  ],
  // Row 1: Top Row
  [
    { key: 'Tab', display: 'Tab', finger: 'left-pinky', fingerNameId: 'Kelingking Kiri', hand: 'left', row: 1, width: 'w-12 sm:w-14' },
    { key: 'q', display: 'Q', finger: 'left-pinky', fingerNameId: 'Kelingking Kiri', hand: 'left', row: 1 },
    { key: 'w', display: 'W', finger: 'left-ring', fingerNameId: 'Jari Manis Kiri', hand: 'left', row: 1 },
    { key: 'e', display: 'E', finger: 'left-middle', fingerNameId: 'Jari Tengah Kiri', hand: 'left', row: 1 },
    { key: 'r', display: 'R', finger: 'left-index', fingerNameId: 'Telunjuk Kiri', hand: 'left', row: 1 },
    { key: 't', display: 'T', finger: 'left-index', fingerNameId: 'Telunjuk Kiri', hand: 'left', row: 1 },
    { key: 'y', display: 'Y', finger: 'right-index', fingerNameId: 'Telunjuk Kanan', hand: 'right', row: 1 },
    { key: 'u', display: 'U', finger: 'right-index', fingerNameId: 'Telunjuk Kanan', hand: 'right', row: 1 },
    { key: 'i', display: 'I', finger: 'right-middle', fingerNameId: 'Jari Tengah Kanan', hand: 'right', row: 1 },
    { key: 'o', display: 'O', finger: 'right-ring', fingerNameId: 'Jari Manis Kanan', hand: 'right', row: 1 },
    { key: 'p', display: 'P', finger: 'right-pinky', fingerNameId: 'Kelingking Kanan', hand: 'right', row: 1 },
    { key: '[', display: '[', finger: 'right-pinky', fingerNameId: 'Kelingking Kanan', hand: 'right', row: 1 },
    { key: ']', display: ']', finger: 'right-pinky', fingerNameId: 'Kelingking Kanan', hand: 'right', row: 1 },
  ],
  // Row 2: Home Row (Baris Beranda)
  [
    { key: 'Caps', display: 'Caps', finger: 'left-pinky', fingerNameId: 'Kelingking Kiri', hand: 'left', row: 2, width: 'w-14 sm:w-16' },
    { key: 'a', display: 'A', finger: 'left-pinky', fingerNameId: 'Kelingking Kiri', hand: 'left', row: 2 },
    { key: 's', display: 'S', finger: 'left-ring', fingerNameId: 'Jari Manis Kiri', hand: 'left', row: 2 },
    { key: 'd', display: 'D', finger: 'left-middle', fingerNameId: 'Jari Tengah Kiri', hand: 'left', row: 2 },
    { key: 'f', display: 'F', finger: 'left-index', fingerNameId: 'Telunjuk Kiri', hand: 'left', row: 2 },
    { key: 'g', display: 'G', finger: 'left-index', fingerNameId: 'Telunjuk Kiri', hand: 'left', row: 2 },
    { key: 'h', display: 'H', finger: 'right-index', fingerNameId: 'Telunjuk Kanan', hand: 'right', row: 2 },
    { key: 'j', display: 'J', finger: 'right-index', fingerNameId: 'Telunjuk Kanan', hand: 'right', row: 2 },
    { key: 'k', display: 'K', finger: 'right-middle', fingerNameId: 'Jari Tengah Kanan', hand: 'right', row: 2 },
    { key: 'l', display: 'L', finger: 'right-ring', fingerNameId: 'Jari Manis Kanan', hand: 'right', row: 2 },
    { key: ';', display: ';', finger: 'right-pinky', fingerNameId: 'Kelingking Kanan', hand: 'right', row: 2 },
    { key: "'", display: "'", finger: 'right-pinky', fingerNameId: 'Kelingking Kanan', hand: 'right', row: 2 },
    { key: 'Enter', display: 'Enter', finger: 'right-pinky', fingerNameId: 'Kelingking Kanan', hand: 'right', row: 2, width: 'w-14 sm:w-16' },
  ],
  // Row 3: Bottom Row
  [
    { key: 'Shift', display: 'Shift', finger: 'left-pinky', fingerNameId: 'Kelingking Kiri', hand: 'left', row: 3, width: 'w-16 sm:w-20' },
    { key: 'z', display: 'Z', finger: 'left-pinky', fingerNameId: 'Kelingking Kiri', hand: 'left', row: 3 },
    { key: 'x', display: 'X', finger: 'left-ring', fingerNameId: 'Jari Manis Kiri', hand: 'left', row: 3 },
    { key: 'c', display: 'C', finger: 'left-middle', fingerNameId: 'Jari Tengah Kiri', hand: 'left', row: 3 },
    { key: 'v', display: 'V', finger: 'left-index', fingerNameId: 'Telunjuk Kiri', hand: 'left', row: 3 },
    { key: 'b', display: 'B', finger: 'left-index', fingerNameId: 'Telunjuk Kiri', hand: 'left', row: 3 },
    { key: 'n', display: 'N', finger: 'right-index', fingerNameId: 'Telunjuk Kanan', hand: 'right', row: 3 },
    { key: 'm', display: 'M', finger: 'right-index', fingerNameId: 'Telunjuk Kanan', hand: 'right', row: 3 },
    { key: ',', display: ',', finger: 'right-middle', fingerNameId: 'Jari Tengah Kanan', hand: 'right', row: 3 },
    { key: '.', display: '.', finger: 'right-ring', fingerNameId: 'Jari Manis Kanan', hand: 'right', row: 3 },
    { key: '/', display: '/', finger: 'right-pinky', fingerNameId: 'Kelingking Kanan', hand: 'right', row: 3 },
  ],
  // Row 4: Space
  [
    { key: ' ', display: 'Spasi (Space)', finger: 'thumb', fingerNameId: 'Ibu Jari (Spasi)', hand: 'right', row: 4, width: 'w-64 sm:w-80' },
  ],
];

// Helper to look up key info by char
const charToKeyMap: Record<string, KeyInfo> = {};
KEYBOARD_ROWS.forEach(row => {
  row.forEach(item => {
    charToKeyMap[item.key.toLowerCase()] = item;
    charToKeyMap[item.display.toLowerCase()] = item;
  });
});

export function getKeyInfo(char: string): KeyInfo | undefined {
  if (!char) return undefined;
  if (char === ' ') return charToKeyMap[' '];
  return charToKeyMap[char.toLowerCase()];
}

export function getFingerForChar(char: string): FingerId {
  const info = getKeyInfo(char);
  return info ? info.finger : 'right-index';
}
