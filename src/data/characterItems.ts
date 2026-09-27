import { AccessoryId, AuraId, AvatarId, SkinColor, SoundTheme, TitleId } from '../types';

export interface ShopItem<T> {
  id: T;
  name: string;
  price: number;
  description: string;
  badge?: string;
}

export const AVATAR_LIST: ShopItem<AvatarId>[] = [
  { id: 'robot', name: 'TypeBot-3000', price: 0, description: 'Robot pemroses ketukan kilat generasi cerdas.' },
  { id: 'kancil', name: 'Kancil Gesit', price: 150, description: 'Karakter cerdas dan gesit cerita rakyat nusantara.' },
  { id: 'garuda', name: 'Garuda Cyber', price: 250, description: 'Lambang keberanian dengan sayap laser berteknologi tinggi.' },
  { id: 'cat', name: 'Ninja Neko', price: 350, description: 'Kucing ninja dengan cakar ketukan tanpa suara.' },
  { id: 'astro', name: 'Astronot Bintang', price: 500, description: 'Penjelajah antariksa pengetik kode stasiun luar angkasa.' },
  { id: 'dragon', name: 'Naga Samudra', price: 750, description: 'Naga legendaris dengan kobaran combo tiada henti.', badge: 'Legendaris' },
];

export const SKIN_COLORS: { id: SkinColor; name: string; hex: string; bgClass: string; textClass: string }[] = [
  { id: 'indigo', name: 'Cyber Indigo', hex: '#6366f1', bgClass: 'bg-indigo-500', textClass: 'text-indigo-400' },
  { id: 'emerald', name: 'Neon Zamrud', hex: '#10b981', bgClass: 'bg-emerald-500', textClass: 'text-emerald-400' },
  { id: 'amber', name: 'Emas Juara', hex: '#f59e0b', bgClass: 'bg-amber-500', textClass: 'text-amber-400' },
  { id: 'rose', name: 'Laser Mawar', hex: '#f43f5e', bgClass: 'bg-rose-500', textClass: 'text-rose-400' },
  { id: 'cyan', name: 'Es Siberia', hex: '#06b6d4', bgClass: 'bg-cyan-500', textClass: 'text-cyan-400' },
  { id: 'purple', name: 'Mistik Ungu', hex: '#a855f7', bgClass: 'bg-purple-500', textClass: 'text-purple-400' },
];

export const ACCESSORY_LIST: ShopItem<AccessoryId>[] = [
  { id: 'none', name: 'Tanpa Aksesoris', price: 0, description: 'Gaya minimalis sederhana.' },
  { id: 'gamer-headset', name: 'Headphone Pro Gamer', price: 100, description: 'Headphone RGB untuk fokus penuh pada ritme ketikan.' },
  { id: 'crown', name: 'Mahkota Emas Juara', price: 200, description: 'Mahkota berkilau untuk pengetik peringkat tertinggi.' },
  { id: 'vr-goggles', name: 'Kacamata Cyber VR', price: 300, description: 'Mata visor futuristik dengan hud kecepatan real-time.' },
  { id: 'grad-cap', name: 'Toga Sarjana Cilik', price: 250, description: 'Topi kelulusan bukti kecerdasan siswa berprestasi.' },
  { id: 'space-helmet', name: 'Helm Kosmik Apollo', price: 400, description: 'Helm kaca pelindung badai radiasi antariksa.' },
  { id: 'ninja-headband', name: 'Ikat Kepala Ninja', price: 150, description: 'Ikat kepala semangat api membakar ketangkasan jemari.' },
];

export const AURA_LIST: ShopItem<AuraId>[] = [
  { id: 'none', name: 'Tanpa Aura', price: 0, description: 'Tanpa partikel latar.' },
  { id: 'lightning', name: 'Kilatan Petir Biru', price: 150, description: 'Kilatan listrik berdesis di sekeliling karakter saat mengetik.' },
  { id: 'sparkle', name: 'Taburan Bintang Emas', price: 200, description: 'Bintang berkilauan merekah di setiap akurasi 100%.' },
  { id: 'flame', name: 'Kobaran Api Semangat', price: 300, description: 'Api membara yang menyala semakin terang saat combo.' },
  { id: 'pixel', name: 'Matriks Data Hijau', price: 250, description: 'Hujan kode biner cyber retro arcade.' },
  { id: 'cosmic', name: 'Nebula Antariksa', price: 450, description: 'Pusaran galaksi ungu misterius.', badge: 'Epik' },
];

export const SOUND_THEMES: { id: SoundTheme; name: string; description: string; previewBadge: string }[] = [
  { id: 'mechanical', name: 'Switch Mekanikal (Cherry Blue)', description: 'Suara klik renyah keyboard mekanikal pro para programmer.', previewBadge: 'Klik Renyah' },
  { id: 'pop', name: 'Gelembung Air (Bubble Pop)', description: 'Suara letupan gelembung yang lucu, memuaskan, dan menenangkan.', previewBadge: 'Pop Lembut' },
  { id: 'laser', name: 'Laser Blaster Sci-Fi', description: 'Efek tembakan laser futuristik seperti di film fiksi ilmiah.', previewBadge: 'Pew Pew' },
  { id: 'typewriter', name: 'Mesin Tik Kuno Klasik', description: 'Bunyi denting logam tuas mesin tik era sastrawan tempo dulu.', previewBadge: 'Denting Logam' },
  { id: 'retro8bit', name: 'Arcade 8-Bit Chiptune', description: 'Melodi nada chiptune ala konsol game retro 90-an.', previewBadge: 'Chiptune' },
];

export const TITLES_LIST: ShopItem<TitleId>[] = [
  { id: 'pemula', name: 'Pengetik Pemula', price: 0, description: 'Langkah awal petualangan menaklukkan keyboard.' },
  { id: 'jari-kilat', name: 'Jari Kilat Kelas', price: 120, description: 'Siswa dengan refleks jari super cepat di kelas.' },
  { id: 'ahli-10-jari', name: 'Master Sepuluh Jari', price: 250, description: 'Mengetik buta (blind typing) tanpa melirik tuts sama sekali.' },
  { id: 'duta-ketik', name: 'Duta Ketik Nasional', price: 400, description: 'Inspirasi teman sebaya dalam kecakapan digital.' },
  { id: 'dewa-keyboard', name: 'Dewa Keyboard Sekolah', price: 600, description: 'Legenda pengetik tercepat yang tak terkalahkan.', badge: 'Legenda' },
];
