import React, { useState } from 'react';
import {
  CharacterCustomization,
  StudentProfile,
  AvatarId,
  SkinColor,
  AccessoryId,
  AuraId,
  SoundTheme,
  TitleId,
} from '../types';
import {
  AVATAR_LIST,
  SKIN_COLORS,
  ACCESSORY_LIST,
  AURA_LIST,
  SOUND_THEMES,
  TITLES_LIST,
} from '../data/characterItems';
import { AvatarDisplay } from './AvatarDisplay';
import { playKeySound } from '../utils/soundEffects';
import {
  Sparkles,
  Coins,
  Check,
  Lock,
  Volume2,
  Smile,
  Palette,
  Shield,
  Award,
  Music,
} from 'lucide-react';

interface CharacterCustomizerProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  onClose: () => void;
}

type TabType = 'avatar' | 'skin' | 'accessory' | 'aura' | 'sound' | 'title';

export const CharacterCustomizer: React.FC<CharacterCustomizerProps> = ({
  profile,
  onUpdateProfile,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('avatar');
  const [customization, setCustomization] = useState<CharacterCustomization>(profile.avatar);
  const [studentName, setStudentName] = useState(profile.name);
  const [schoolClass, setSchoolClass] = useState(profile.schoolClass);

  // Helper to check if item is owned
  const isAvatarUnlocked = (id: AvatarId) => id === 'robot' || profile.unlockedAvatars.includes(id);
  const isAccessoryUnlocked = (id: AccessoryId) => id === 'none' || profile.unlockedAccessories.includes(id);
  const isAuraUnlocked = (id: AuraId) => id === 'none' || profile.unlockedAuras.includes(id);
  const isTitleUnlocked = (id: TitleId) => id === 'pemula' || profile.unlockedTitles.includes(id);

  // Buy / Equip Avatar
  const handleSelectAvatar = (id: AvatarId, price: number) => {
    if (isAvatarUnlocked(id)) {
      const next = { ...customization, avatar: id };
      setCustomization(next);
      onUpdateProfile({ avatar: next });
    } else if (profile.coins >= price) {
      const nextUnlocked = [...profile.unlockedAvatars, id];
      const next = { ...customization, avatar: id };
      setCustomization(next);
      onUpdateProfile({
        coins: profile.coins - price,
        unlockedAvatars: nextUnlocked,
        avatar: next,
      });
    }
  };

  // Select Skin Color (Free)
  const handleSelectSkin = (skin: SkinColor) => {
    const next = { ...customization, skin };
    setCustomization(next);
    onUpdateProfile({ avatar: next });
  };

  // Buy / Equip Accessory
  const handleSelectAccessory = (id: AccessoryId, price: number) => {
    if (isAccessoryUnlocked(id)) {
      const next = { ...customization, accessory: id };
      setCustomization(next);
      onUpdateProfile({ avatar: next });
    } else if (profile.coins >= price) {
      const nextUnlocked = [...profile.unlockedAccessories, id];
      const next = { ...customization, accessory: id };
      setCustomization(next);
      onUpdateProfile({
        coins: profile.coins - price,
        unlockedAccessories: nextUnlocked,
        avatar: next,
      });
    }
  };

  // Buy / Equip Aura
  const handleSelectAura = (id: AuraId, price: number) => {
    if (isAuraUnlocked(id)) {
      const next = { ...customization, aura: id };
      setCustomization(next);
      onUpdateProfile({ avatar: next });
    } else if (profile.coins >= price) {
      const nextUnlocked = [...profile.unlockedAuras, id];
      const next = { ...customization, aura: id };
      setCustomization(next);
      onUpdateProfile({
        coins: profile.coins - price,
        unlockedAuras: nextUnlocked,
        avatar: next,
      });
    }
  };

  // Select Sound Theme
  const handleSelectSound = (theme: SoundTheme) => {
    playKeySound(theme);
    const next = { ...customization, soundTheme: theme };
    setCustomization(next);
    onUpdateProfile({ avatar: next });
  };

  // Buy / Equip Title
  const handleSelectTitle = (id: TitleId, price: number) => {
    if (isTitleUnlocked(id)) {
      const next = { ...customization, title: id };
      setCustomization(next);
      onUpdateProfile({ avatar: next });
    } else if (profile.coins >= price) {
      const nextUnlocked = [...profile.unlockedTitles, id];
      const next = { ...customization, title: id };
      setCustomization(next);
      onUpdateProfile({
        coins: profile.coins - price,
        unlockedTitles: nextUnlocked,
        avatar: next,
      });
    }
  };

  // Save Name & Class
  const handleSaveProfileInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: studentName.trim() || 'Siswa Juara',
      schoolClass: schoolClass.trim() || 'Kelas 7A',
    });
  };

  // Find active title display name
  const currentTitleObj = TITLES_LIST.find((t) => t.id === customization.title);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Bengkel Karakter & Avatar</h2>
            <p className="text-xs text-slate-400">
              Kustomisasi maskot pengetikmu untuk memotivasi latihan dan tampil percaya diri di arena!
            </p>
          </div>
        </div>

        {/* Coins indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold font-mono">
            <Coins className="w-5 h-5 text-amber-400" />
            <span>{profile.coins} Koin</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/30"
          >
            Selesai & Pakai
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Character Showcase & Identity Info */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Avatar Stage Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

            {/* Title Badge */}
            <div className="relative z-10 mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                {currentTitleObj?.name}
              </span>
            </div>

            {/* Avatar Mascot Stage */}
            <div className="relative my-4">
              <AvatarDisplay customization={customization} size="xl" showAura={true} animate={true} />
            </div>

            {/* Identity Info */}
            <h3 className="text-xl font-black text-white mt-4 relative z-10">{profile.name}</h3>
            <p className="text-xs text-slate-400 relative z-10">{profile.schoolClass}</p>

            {/* Quick Test Key Sound */}
            <div className="mt-6 w-full pt-4 border-t border-slate-800/80 relative z-10">
              <button
                type="button"
                onClick={() => playKeySound(customization.soundTheme)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition"
              >
                <Volume2 className="w-4 h-4 text-emerald-400" />
                Tes Suara Ketikan ({customization.soundTheme})
              </button>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">
              Identitas Siswa
            </h4>
            <form onSubmit={handleSaveProfileInfo} className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Contoh: Aditya Pratama"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Kelas / Sekolah</label>
                <input
                  type="text"
                  value={schoolClass}
                  onChange={(e) => setSchoolClass(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Contoh: Kelas 8B - SMP Merdeka"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
              >
                Simpan Identitas
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Customization Shop Tabs & Item Grid */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl">
            <button
              onClick={() => setActiveTab('avatar')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'avatar'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Smile className="w-3.5 h-3.5" /> Maskot
            </button>

            <button
              onClick={() => setActiveTab('skin')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'skin'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Palette className="w-3.5 h-3.5" /> Warna Cyber
            </button>

            <button
              onClick={() => setActiveTab('accessory')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'accessory'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Aksesoris
            </button>

            <button
              onClick={() => setActiveTab('aura')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'aura'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Aura Efek
            </button>

            <button
              onClick={() => setActiveTab('sound')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'sound'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Music className="w-3.5 h-3.5" /> Suara Tuts
            </button>

            <button
              onClick={() => setActiveTab('title')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'title'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5" /> Gelar Juara
            </button>
          </div>

          {/* Tab Content Panes */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 min-h-[400px]">
            {/* 1. MASKOT AVATAR TAB */}
            {activeTab === 'avatar' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Pilih Maskot Karakter</h4>
                  <span className="text-xs text-slate-400">Buka maskot baru dengan koin dari latihan!</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {AVATAR_LIST.map((item) => {
                    const isUnlocked = isAvatarUnlocked(item.id);
                    const isEquipped = customization.avatar === item.id;
                    const canAfford = profile.coins >= item.price;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectAvatar(item.id, item.price)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                          isEquipped
                            ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/20'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {item.badge && (
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            {item.badge}
                          </span>
                        )}

                        <div className="flex items-center gap-3 mb-3">
                          <AvatarDisplay
                            customization={{ ...customization, avatar: item.id }}
                            size="md"
                            showAura={false}
                          />
                          <div>
                            <h5 className="text-sm font-bold text-white">{item.name}</h5>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                          {isEquipped ? (
                            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Terpasang
                            </span>
                          ) : isUnlocked ? (
                            <span className="text-xs font-semibold text-slate-300">
                              Klik untuk Pakai
                            </span>
                          ) : (
                            <span
                              className={`text-xs font-bold flex items-center gap-1 ${
                                canAfford ? 'text-amber-400' : 'text-slate-500'
                              }`}
                            >
                              <Lock className="w-3 h-3" /> {item.price} Koin
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. WARNA CYBER TAB */}
            {activeTab === 'skin' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Palet Warna Cyber</h4>
                  <span className="text-xs text-slate-400">Pilih warna energi utama maskotmu</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  {SKIN_COLORS.map((skin) => {
                    const isEquipped = customization.skin === skin.id;

                    return (
                      <div
                        key={skin.id}
                        onClick={() => handleSelectSkin(skin.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                          isEquipped
                            ? 'bg-slate-800/80 border-indigo-500 shadow-md'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-md"
                          style={{ backgroundColor: skin.hex }}
                        >
                          {isEquipped && <Check className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">{skin.name}</h5>
                          <span className="text-[10px] text-slate-400 font-mono">{skin.hex}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. AKSESORIS TAB */}
            {activeTab === 'accessory' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Aksesoris & Topi Juara</h4>
                  <span className="text-xs text-slate-400">Gunakan perlengkapan unik saat mengetik</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {ACCESSORY_LIST.map((item) => {
                    const isUnlocked = isAccessoryUnlocked(item.id);
                    const isEquipped = customization.accessory === item.id;
                    const canAfford = profile.coins >= item.price;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectAccessory(item.id, item.price)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isEquipped
                            ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/20'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <AvatarDisplay
                            customization={{ ...customization, accessory: item.id }}
                            size="sm"
                            showAura={false}
                          />
                          <div>
                            <h5 className="text-xs font-bold text-white">{item.name}</h5>
                            <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                          {isEquipped ? (
                            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Terpasang
                            </span>
                          ) : isUnlocked ? (
                            <span className="text-xs font-semibold text-slate-300">Gunakan</span>
                          ) : (
                            <span
                              className={`text-xs font-bold flex items-center gap-1 ${
                                canAfford ? 'text-amber-400' : 'text-slate-500'
                              }`}
                            >
                              <Lock className="w-3 h-3" /> {item.price} Koin
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. AURA TAB */}
            {activeTab === 'aura' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Efek Aura & Partikel</h4>
                  <span className="text-xs text-slate-400">Efek bercahaya yang mengelilingi karakter</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {AURA_LIST.map((item) => {
                    const isUnlocked = isAuraUnlocked(item.id);
                    const isEquipped = customization.aura === item.id;
                    const canAfford = profile.coins >= item.price;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectAura(item.id, item.price)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isEquipped
                            ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/20'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <AvatarDisplay
                            customization={{ ...customization, aura: item.id }}
                            size="sm"
                            showAura={true}
                          />
                          <div>
                            <h5 className="text-xs font-bold text-white">{item.name}</h5>
                            <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                          {isEquipped ? (
                            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Terpasang
                            </span>
                          ) : isUnlocked ? (
                            <span className="text-xs font-semibold text-slate-300">Gunakan</span>
                          ) : (
                            <span
                              className={`text-xs font-bold flex items-center gap-1 ${
                                canAfford ? 'text-amber-400' : 'text-slate-500'
                              }`}
                            >
                              <Lock className="w-3 h-3" /> {item.price} Koin
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. SOUND THEMES TAB */}
            {activeTab === 'sound' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Tema Suara Ketukan (Sound Packs)</h4>
                  <span className="text-xs text-slate-400">Pilih efek audio mekanikal saat menekan tuts</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {SOUND_THEMES.map((theme) => {
                    const isEquipped = customization.soundTheme === theme.id;

                    return (
                      <div
                        key={theme.id}
                        onClick={() => handleSelectSound(theme.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isEquipped
                            ? 'bg-indigo-950/40 border-indigo-500 shadow-md'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <h5 className="text-sm font-bold text-white">{theme.name}</h5>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {theme.previewBadge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{theme.description}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playKeySound(theme.id);
                            }}
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5"
                          >
                            <Volume2 className="w-3.5 h-3.5" /> Dengar Contoh
                          </button>

                          {isEquipped ? (
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Dipakai
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">Klik untuk Pilih</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. GELAR JUARA TAB */}
            {activeTab === 'title' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Gelar & Julukan Pengetik</h4>
                  <span className="text-xs text-slate-400">Gelar kehormatan yang tampil di papan peringkat</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {TITLES_LIST.map((item) => {
                    const isUnlocked = isTitleUnlocked(item.id);
                    const isEquipped = customization.title === item.id;
                    const canAfford = profile.coins >= item.price;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectTitle(item.id, item.price)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isEquipped
                            ? 'bg-indigo-950/40 border-indigo-500 shadow-md'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="text-sm font-bold text-white flex items-center gap-2">
                              <Award className="w-4 h-4 text-amber-400" />
                              {item.name}
                            </h5>
                            {item.badge && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                          {isEquipped ? (
                            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Gelar Aktif
                            </span>
                          ) : isUnlocked ? (
                            <span className="text-xs font-semibold text-slate-300">Gunakan</span>
                          ) : (
                            <span
                              className={`text-xs font-bold flex items-center gap-1 ${
                                canAfford ? 'text-amber-400' : 'text-slate-500'
                              }`}
                            >
                              <Lock className="w-3 h-3" /> {item.price} Koin
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
