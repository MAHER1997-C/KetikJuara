import React, { useState } from 'react';
import { LeaderboardEntry, StudentProfile } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import { Trophy, Medal, Award, Search, Filter, Sparkles, Zap, Target } from 'lucide-react';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentProfile: StudentProfile;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  currentProfile,
}) => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'weekly' | 'daily'>('all');
  const [classFilter, setClassFilter] = useState<'all' | 'my-class'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter entries
  const filtered = entries
    .filter((entry) => {
      // Class filter
      if (classFilter === 'my-class') {
        const studentClass = currentProfile.schoolClass.toLowerCase().trim();
        const entryClass = entry.schoolClass.toLowerCase().trim();
        if (!entryClass.includes(studentClass.split(' ')[0] || '')) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          entry.name.toLowerCase().includes(query) ||
          entry.schoolClass.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);

  const top3 = filtered.slice(0, 3);
  const remaining = filtered.slice(3);

  // Find current user's rank
  const userRankIndex = filtered.findIndex(
    (e) => e.isCurrentUser || e.name.toLowerCase() === currentProfile.name.toLowerCase()
  );

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Papan Peringkat Global & Kelas</h2>
            <p className="text-xs text-slate-400">
              Adu kecepatan dan ketepatan mengetik 10 jari bersama siswa berprestasi seluruh nusantara!
            </p>
          </div>
        </div>

        {/* Current user's rank pill */}
        {userRankIndex >= 0 && (
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Posisi Kamu: Peringkat #{userRankIndex + 1}</span>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
        {/* Time filters */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              timeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua Waktu
          </button>
          <button
            onClick={() => setTimeFilter('weekly')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              timeFilter === 'weekly'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pekan Ini
          </button>
          <button
            onClick={() => setTimeFilter('daily')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              timeFilter === 'daily'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hari Ini
          </button>
        </div>

        {/* Class toggle & Search input */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setClassFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition ${
                classFilter === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua Sekolah
            </button>
            <button
              onClick={() => setClassFilter('my-class')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition ${
                classFilter === 'my-class'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Kelas Saya ({currentProfile.schoolClass.split(' ')[0] || 'Kelas'})
            </button>
          </div>

          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* TOP 3 PODIUM DISPLAY */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* Rank 2 (Silver) */}
          {top3[1] && (
            <div className="bg-slate-900/80 border border-slate-700/60 rounded-3xl p-5 flex flex-col items-center text-center relative overflow-hidden order-2 md:order-1 mt-4 md:mt-6">
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-slate-400/20 text-slate-300 font-black font-mono flex items-center justify-center border border-slate-400/40 text-sm">
                2
              </div>
              <div className="relative mb-3">
                <AvatarDisplay customization={top3[1].avatar} size="lg" />
                <span className="absolute -bottom-1 -right-1 text-2xl">🥈</span>
              </div>
              <h3 className="text-base font-bold text-white">{top3[1].name}</h3>
              <p className="text-xs text-slate-400">{top3[1].schoolClass}</p>

              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-800 w-full justify-center">
                <div className="text-center">
                  <div className="text-lg font-black font-mono text-slate-200">{top3[1].wpm}</div>
                  <div className="text-[10px] text-slate-400">WPM</div>
                </div>
                <div className="h-6 w-px bg-slate-800" />
                <div className="text-center">
                  <div className="text-lg font-black font-mono text-emerald-400">{top3[1].accuracy}%</div>
                  <div className="text-[10px] text-slate-400">Akurasi</div>
                </div>
              </div>
            </div>
          )}

          {/* Rank 1 (Gold Champion) */}
          {top3[0] && (
            <div className="bg-gradient-to-b from-amber-950/30 to-slate-900/90 border-2 border-amber-500/50 rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden order-1 md:order-2 shadow-2xl shadow-amber-500/10">
              <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-amber-500/20 text-amber-300 font-black font-mono flex items-center justify-center border border-amber-500/50 text-base">
                1
              </div>
              <div className="relative mb-3 scale-110">
                <AvatarDisplay customization={top3[0].avatar} size="lg" showAura={true} />
                <span className="absolute -bottom-1 -right-1 text-3xl animate-bounce">👑</span>
              </div>
              <h3 className="text-lg font-black text-white mt-2">{top3[0].name}</h3>
              <p className="text-xs text-amber-300/80 font-medium">{top3[0].schoolClass}</p>

              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-800 w-full justify-center">
                <div className="text-center">
                  <div className="text-2xl font-black font-mono text-amber-400">{top3[0].wpm}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">WPM Rekor</div>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div className="text-center">
                  <div className="text-2xl font-black font-mono text-emerald-400">{top3[0].accuracy}%</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Akurasi</div>
                </div>
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3[2] && (
            <div className="bg-slate-900/80 border border-amber-800/40 rounded-3xl p-5 flex flex-col items-center text-center relative overflow-hidden order-3 md:order-3 mt-4 md:mt-8">
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-amber-800/20 text-amber-500 font-black font-mono flex items-center justify-center border border-amber-800/40 text-sm">
                3
              </div>
              <div className="relative mb-3">
                <AvatarDisplay customization={top3[2].avatar} size="lg" />
                <span className="absolute -bottom-1 -right-1 text-2xl">🥉</span>
              </div>
              <h3 className="text-base font-bold text-white">{top3[2].name}</h3>
              <p className="text-xs text-slate-400">{top3[2].schoolClass}</p>

              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-800 w-full justify-center">
                <div className="text-center">
                  <div className="text-lg font-black font-mono text-amber-500">{top3[2].wpm}</div>
                  <div className="text-[10px] text-slate-400">WPM</div>
                </div>
                <div className="h-6 w-px bg-slate-800" />
                <div className="text-center">
                  <div className="text-lg font-black font-mono text-emerald-400">{top3[2].accuracy}%</div>
                  <div className="text-[10px] text-slate-400">Akurasi</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard Table List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
            Daftar Peringkat Lengkap ({filtered.length} Siswa Terdaftar)
          </span>
          <span className="text-xs text-slate-500">Diperbarui Real-time</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {filtered.map((item, index) => {
            const isMe = item.isCurrentUser || item.name.toLowerCase() === currentProfile.name.toLowerCase();

            return (
              <div
                key={item.id + index}
                className={`p-4 sm:px-6 flex items-center justify-between gap-4 transition ${
                  isMe
                    ? 'bg-indigo-950/40 border-l-4 border-indigo-500'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                {/* Left: Rank & Student Profile */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-7 h-7 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 ${
                      index === 0
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : index === 1
                        ? 'bg-slate-400/20 text-slate-300 border border-slate-400/40'
                        : index === 2
                        ? 'bg-amber-800/20 text-amber-500 border border-amber-800/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    #{index + 1}
                  </div>

                  <AvatarDisplay customization={item.avatar} size="sm" showAura={false} />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{item.name}</span>
                      {isMe && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Kamu
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{item.schoolClass}</p>
                  </div>
                </div>

                {/* Right: Scores & Stats */}
                <div className="flex items-center gap-4 sm:gap-6 font-mono">
                  <div className="text-right">
                    <div className="text-sm sm:text-base font-bold text-white flex items-center gap-1 justify-end">
                      <Zap className="w-3.5 h-3.5 text-indigo-400 hidden sm:inline" />
                      {item.wpm} <span className="text-xs text-slate-400 font-sans font-normal">WPM</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 justify-end">
                      <Target className="w-3 h-3 text-emerald-400 hidden sm:inline" />
                      {item.accuracy}% akurat
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-1 text-amber-400 text-xs font-sans">
                    <span>⭐</span>
                    <span className="font-bold text-slate-200">{item.stars}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
