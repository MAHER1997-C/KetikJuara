import React, { useState, useEffect } from 'react';
import {
  DifficultyLevel,
  StudentProfile,
  TypingSessionResult,
  LeaderboardEntry,
  ClassStudentAnalytics,
} from './types';
import { TYPING_LEVELS } from './data/typingLevels';
import {
  INITIAL_USER_PROFILE,
  INITIAL_LEADERBOARD_ENTRIES,
  INITIAL_CLASS_STUDENTS,
} from './data/initialData';
import { LevelSelector } from './components/LevelSelector';
import { TypingGame } from './components/TypingGame';
import { CharacterCustomizer } from './components/CharacterCustomizer';
import { Leaderboard } from './components/Leaderboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { MultiplayerRace } from './components/MultiplayerRace';
import { ProgressReportModal } from './components/ProgressReportModal';
import { AvatarDisplay } from './components/AvatarDisplay';
import { getMuted, setMuted } from './utils/soundEffects';
import {
  Gamepad2,
  Trophy,
  Users,
  Sparkles,
  Volume2,
  VolumeX,
  Map,
  Flag,
  Palette,
  ShieldCheck,
  GraduationCap,
  Coins,
} from 'lucide-react';

type TabView = 'levels' | 'game' | 'multiplayer' | 'leaderboard' | 'customizer' | 'teacher';

export default function App() {
  // Local storage persistence
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('ketikjuara_student_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_USER_PROFILE;
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem('ketikjuara_leaderboard');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_LEADERBOARD_ENTRIES;
  });

  const [studentsData, setStudentsData] = useState<ClassStudentAnalytics[]>(() => {
    try {
      const saved = localStorage.getItem('ketikjuara_class_students');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CLASS_STUDENTS;
  });

  // App Navigation state
  const [activeTab, setActiveTab] = useState<TabView>('levels');
  const [activeLevel, setActiveLevel] = useState<DifficultyLevel | null>(null);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<ClassStudentAnalytics | null>(null);

  // Global sound mute state
  const [muted, setMutedState] = useState(getMuted());

  // Save profile on change
  useEffect(() => {
    try {
      localStorage.setItem('ketikjuara_student_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // Save leaderboard on change
  useEffect(() => {
    try {
      localStorage.setItem('ketikjuara_leaderboard', JSON.stringify(leaderboard));
    } catch {}
  }, [leaderboard]);

  // Calculate total stars
  const totalStarsEarned = Object.values(profile.levelProgress).reduce(
    (sum, cur) => sum + (cur.stars || 0),
    0
  );

  // Toggle Mute
  const handleToggleMute = () => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
  };

  // Start Level Game
  const handleSelectLevel = (level: DifficultyLevel) => {
    setActiveLevel(level);
    setActiveTab('game');
  };

  // Handle Level Completion
  const handleCompleteLevel = (result: TypingSessionResult, nextLevelId?: string) => {
    // 1. Update Profile Progress
    const currentProg = profile.levelProgress[result.levelId] || {
      stars: 0,
      highWpm: 0,
      highAccuracy: 0,
      completedTimes: 0,
    };

    const newStars = Math.max(currentProg.stars, result.stars);
    const newHighWpm = Math.max(currentProg.highWpm, result.wpm);
    const newHighAcc = Math.max(currentProg.highAccuracy, result.accuracy);

    const updatedProfile: StudentProfile = {
      ...profile,
      coins: profile.coins + result.coinsEarned,
      levelProgress: {
        ...profile.levelProgress,
        [result.levelId]: {
          stars: newStars,
          highWpm: newHighWpm,
          highAccuracy: newHighAcc,
          completedTimes: currentProg.completedTimes + 1,
        },
      },
      history: [result, ...profile.history],
    };

    setProfile(updatedProfile);

    // 2. Update Leaderboard Entry for Current User
    setLeaderboard((prev) => {
      const userIndex = prev.findIndex(
        (e) => e.isCurrentUser || e.name.toLowerCase() === profile.name.toLowerCase()
      );
      const newEntry: LeaderboardEntry = {
        id: 'lb-' + profile.id,
        name: profile.name,
        schoolClass: profile.schoolClass,
        avatar: profile.avatar,
        wpm: Math.max(newHighWpm, userIndex >= 0 ? prev[userIndex].wpm : 0),
        accuracy: newHighAcc,
        stars: Object.values(updatedProfile.levelProgress).reduce((acc, c) => acc + c.stars, 0),
        levelTitle: result.levelTitle,
        timestamp: 'Baru saja',
        isCurrentUser: true,
      };

      if (userIndex >= 0) {
        const copy = [...prev];
        copy[userIndex] = newEntry;
        return copy;
      } else {
        return [newEntry, ...prev];
      }
    });

    // 3. Update Classroom Roster for Current User
    setStudentsData((prev) =>
      prev.map((s) => {
        if (s.name.toLowerCase() === profile.name.toLowerCase()) {
          return {
            ...s,
            avgWpm: Math.round((s.avgWpm + result.wpm) / 2),
            avgAccuracy: Math.round((s.avgAccuracy + result.accuracy) / 2),
            stars: Object.values(updatedProfile.levelProgress).reduce((acc, c) => acc + c.stars, 0),
            totalSessions: s.totalSessions + 1,
            lastActive: 'Baru saja',
            problemKeys: Array.from(new Set([...s.problemKeys, ...result.weakKeysDetected])),
            status: 'online',
          };
        }
        return s;
      })
    );

    // If user clicked next level
    if (nextLevelId) {
      const nextLevelObj = TYPING_LEVELS.find((l) => l.id === nextLevelId);
      if (nextLevelObj) {
        setActiveLevel(nextLevelObj);
      }
    }
  };

  // Profile update handler
  const handleUpdateProfile = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // Award Coins
  const handleAwardCoins = (coins: number) => {
    setProfile((prev) => ({
      ...prev,
      coins: prev.coins + coins,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white pb-12">
      {/* Top Application Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div
            onClick={() => {
              setActiveTab('levels');
              setActiveLevel(null);
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
                <Gamepad2 className="w-5 h-5 text-indigo-400 group-hover:text-emerald-400 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-indigo-300 transition">
                  KetikJuara
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  v2.6
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Game Edukasi Mengetik 10 Jari Siswa
              </p>
            </div>
          </div>

          {/* Navigation Pill Menu */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab('levels');
                setActiveLevel(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                activeTab === 'levels' || activeTab === 'game'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" /> Peta Level
            </button>

            <button
              onClick={() => {
                setActiveTab('multiplayer');
                setActiveLevel(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                activeTab === 'multiplayer'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flag className="w-3.5 h-3.5 text-amber-400" /> Balapan Kelas
            </button>

            <button
              onClick={() => {
                setActiveTab('leaderboard');
                setActiveLevel(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                activeTab === 'leaderboard'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Peringkat
            </button>

            <button
              onClick={() => {
                setActiveTab('customizer');
                setActiveLevel(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                activeTab === 'customizer'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-purple-400" /> Avatar & Koin
            </button>

            <button
              onClick={() => {
                setActiveTab('teacher');
                setActiveLevel(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                activeTab === 'teacher'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                  : 'text-emerald-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Portal Guru
            </button>
          </nav>

          {/* Right User Bar */}
          <div className="flex items-center gap-2.5">
            {/* Audio Toggle */}
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
              title={muted ? 'Nyalakan Audio' : 'Matikan Audio'}
            >
              {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Coins Badge */}
            <div
              onClick={() => {
                setActiveTab('customizer');
                setActiveLevel(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold font-mono text-xs cursor-pointer hover:bg-amber-500/20 transition"
              title="Koin untuk beli aksesoris & maskot"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{profile.coins}</span>
            </div>

            {/* User Mini Avatar Badge */}
            <div
              onClick={() => {
                setActiveTab('customizer');
                setActiveLevel(null);
              }}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition"
            >
              <AvatarDisplay customization={profile.avatar} size="xs" showAura={false} />
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-white block leading-tight">
                  {profile.name}
                </span>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  ⭐ {totalStarsEarned} Bintang
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-between gap-1 mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] font-bold overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('levels');
              setActiveLevel(null);
            }}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'levels' || activeTab === 'game'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400'
            }`}
          >
            Level
          </button>
          <button
            onClick={() => {
              setActiveTab('multiplayer');
              setActiveLevel(null);
            }}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'multiplayer' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Balapan
          </button>
          <button
            onClick={() => {
              setActiveTab('leaderboard');
              setActiveLevel(null);
            }}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'leaderboard' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Peringkat
          </button>
          <button
            onClick={() => {
              setActiveTab('customizer');
              setActiveLevel(null);
            }}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'customizer' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Avatar
          </button>
          <button
            onClick={() => {
              setActiveTab('teacher');
              setActiveLevel(null);
            }}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'teacher' ? 'bg-emerald-600 text-white' : 'text-emerald-400'
            }`}
          >
            Guru
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'game' && activeLevel ? (
          <TypingGame
            level={activeLevel}
            profile={profile}
            onCompleteLevel={handleCompleteLevel}
            onExit={() => {
              setActiveLevel(null);
              setActiveTab('levels');
            }}
            allLevels={TYPING_LEVELS}
          />
        ) : activeTab === 'multiplayer' ? (
          <MultiplayerRace
            profile={profile}
            onExit={() => setActiveTab('levels')}
            onAwardCoins={handleAwardCoins}
          />
        ) : activeTab === 'leaderboard' ? (
          <Leaderboard entries={leaderboard} currentProfile={profile} />
        ) : activeTab === 'customizer' ? (
          <CharacterCustomizer
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onClose={() => setActiveTab('levels')}
          />
        ) : activeTab === 'teacher' ? (
          <TeacherDashboard
            studentsData={studentsData}
            onOpenReportModal={(student) => setSelectedStudentForReport(student)}
            onLaunchClassRace={() => setActiveTab('multiplayer')}
          />
        ) : (
          <LevelSelector
            levels={TYPING_LEVELS}
            profile={profile}
            totalStarsEarned={totalStarsEarned}
            onSelectLevel={handleSelectLevel}
          />
        )}
      </main>

      {/* Progress Report Modal (Triggered by Teacher or Student) */}
      {selectedStudentForReport && (
        <ProgressReportModal
          student={selectedStudentForReport}
          onClose={() => setSelectedStudentForReport(null)}
        />
      )}
    </div>
  );
}
