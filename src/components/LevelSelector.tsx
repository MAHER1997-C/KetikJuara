import React from 'react';
import { DifficultyLevel, StudentProfile } from '../types';
import {
  Trophy,
  Lock,
  Play,
  CheckCircle2,
  Zap,
  Target,
  Sparkles,
  ArrowRight,
  Flame,
  Home,
  ArrowUpCircle,
  ArrowDownCircle,
  BookOpen,
  Code,
} from 'lucide-react';

interface LevelSelectorProps {
  levels: DifficultyLevel[];
  profile: StudentProfile;
  totalStarsEarned: number;
  onSelectLevel: (level: DifficultyLevel) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="w-6 h-6 text-indigo-400" />,
  ArrowUpCircle: <ArrowUpCircle className="w-6 h-6 text-sky-400" />,
  ArrowDownCircle: <ArrowDownCircle className="w-6 h-6 text-teal-400" />,
  Zap: <Zap className="w-6 h-6 text-amber-400" />,
  BookOpen: <BookOpen className="w-6 h-6 text-emerald-400" />,
  Code: <Code className="w-6 h-6 text-purple-400" />,
  Flame: <Flame className="w-6 h-6 text-rose-500 animate-pulse" />,
};

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  levels,
  profile,
  totalStarsEarned,
  onSelectLevel,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Campaign Banner Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Kurikulum Mengetik Cepat 10 Jari
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Peta Petualangan Mengetik Siswa
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Taklukkan setiap tingkatan dari dasar tuts beranda, kata sehari-hari, simbol koding,
            hingga pertempuran bos kecepatan! Kumpulkan bintang dan koin untuk membuka maskot impianmu.
          </p>
        </div>

        {/* Floating Quick Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 relative z-10">
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
            <span className="text-2xl">⭐</span>
            <div>
              <div className="text-lg font-black font-mono text-amber-400">{totalStarsEarned}</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Bintang</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
            <span className="text-2xl">🪙</span>
            <div>
              <div className="text-lg font-black font-mono text-amber-400">{profile.coins}</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Koin Juara</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <div className="text-lg font-black font-mono text-indigo-400">
                {Object.values(profile.levelProgress).length > 0
                  ? Math.max(0, ...Object.values(profile.levelProgress).map((p) => p.highWpm))
                  : 0}{' '}
                <span className="text-xs font-sans">WPM</span>
              </div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Rekor Tertinggi</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <div className="text-lg font-black font-mono text-emerald-400">
                {Object.keys(profile.levelProgress).length} / {levels.length}
              </div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Level Ditaklukkan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Levels Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {levels.map((level) => {
          const isUnlocked = level.unlockedByDefault || totalStarsEarned >= level.requiredStars;
          const progress = profile.levelProgress[level.id];
          const isCompleted = !!progress && progress.stars > 0;
          const starsEarned = progress?.stars || 0;
          const isBoss = level.tier === 7;

          return (
            <div
              key={level.id}
              className={`p-5 sm:p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                isBoss
                  ? isUnlocked
                    ? 'bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-900/90 border-rose-500/50 shadow-xl'
                    : 'bg-slate-900/50 border-slate-800/80 opacity-60'
                  : isUnlocked
                  ? 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/60 shadow-xl hover:shadow-indigo-500/10'
                  : 'bg-slate-900/40 border-slate-800/80 opacity-60'
              }`}
            >
              {/* Level Tier & Star Count Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                    Tier {level.tier} • {level.category}
                  </span>

                  {/* Stars Display */}
                  <div className="flex items-center gap-1 text-sm">
                    <span className={starsEarned >= 1 ? 'text-amber-400' : 'text-slate-700'}>⭐</span>
                    <span className={starsEarned >= 2 ? 'text-amber-400' : 'text-slate-700'}>⭐</span>
                    <span className={starsEarned >= 3 ? 'text-amber-400' : 'text-slate-700'}>⭐</span>
                  </div>
                </div>

                {/* Level Title & Icon */}
                <div className="flex items-start gap-3.5 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {iconMap[level.iconName] || <Zap className="w-6 h-6 text-indigo-400" />}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {level.title}
                      {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{level.subtitle}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400/90 mt-2 line-clamp-2 leading-relaxed">
                  {level.description}
                </p>
              </div>

              {/* Bottom Requirements & Action Button */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-indigo-400" /> Min: {level.targetWpm} WPM
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-emerald-400" /> Min: {level.minAccuracy}%
                  </span>
                </div>

                {isUnlocked ? (
                  <button
                    onClick={() => onSelectLevel(level)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md ${
                      isBoss
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                        : isCompleted
                        ? 'bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {isCompleted ? 'Main Ulang' : 'Mulai Latihan'}
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Butuh {level.requiredStars} ⭐ untuk buka</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
