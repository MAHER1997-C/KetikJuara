import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DifficultyLevel, Exercise, StudentProfile, TypingSessionResult } from '../types';
import { VirtualKeyboard } from './VirtualKeyboard';
import { AvatarDisplay } from './AvatarDisplay';
import { getFingerForChar } from '../utils/keyboardMapping';
import { playComboSound, playErrorSound, playKeySound, playVictorySound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Flame,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Clock,
  Keyboard as KeyboardIcon,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { getMuted, setMuted } from '../utils/soundEffects';

interface TypingGameProps {
  level: DifficultyLevel;
  profile: StudentProfile;
  onCompleteLevel: (result: TypingSessionResult, nextLevelId?: string) => void;
  onExit: () => void;
  allLevels: DifficultyLevel[];
}

export const TypingGame: React.FC<TypingGameProps> = ({
  level,
  profile,
  onCompleteLevel,
  onExit,
  allLevels,
}) => {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const currentExercise: Exercise = level.exercises[exerciseIndex] || level.exercises[0];

  const targetText = currentExercise.text;

  // Typing state
  const [userInput, setUserInput] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Stats
  const [mistakes, setMistakes] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [currentCombo, setCurrentCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lastPressedKey, setLastPressedKey] = useState<string>('');
  const [isCurrentError, setIsCurrentError] = useState(false);
  const [weakKeysList, setWeakKeysList] = useState<Record<string, number>>({});

  // Display toggles
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [muted, setMutedState] = useState(getMuted());

  // Boss Battle HP (for Level 7)
  const isBossBattle = level.tier === 7;
  const [bossHp, setBossHp] = useState(100);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically
  useEffect(() => {
    inputRef.current?.focus();
  }, [exerciseIndex, hasStarted]);

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hasStarted && !isFinished) {
      interval = setInterval(() => {
        if (startTime) {
          const seconds = (Date.now() - startTime) / 1000;
          setElapsedTime(seconds);
        }
      }, 200);
    }
    return () => clearInterval(interval);
  }, [hasStarted, isFinished, startTime]);

  // Derived metrics
  const activeChar = targetText[charIndex] || '';
  const correctKeystrokes = Math.max(0, totalKeystrokes - mistakes);
  const accuracy = totalKeystrokes > 0 ? Math.max(0, Math.round((correctKeystrokes / totalKeystrokes) * 100)) : 100;
  const minutes = Math.max(0.01, elapsedTime / 60);
  const wpm = minutes > 0 ? Math.round((charIndex / 5) / minutes) : 0;
  const cpm = minutes > 0 ? Math.round(charIndex / minutes) : 0;
  const progressPercent = Math.min(100, Math.round((charIndex / targetText.length) * 100));

  // Reset exercise
  const resetExercise = useCallback(() => {
    setUserInput('');
    setCharIndex(0);
    setHasStarted(false);
    setIsFinished(false);
    setStartTime(null);
    setElapsedTime(0);
    setMistakes(0);
    setTotalKeystrokes(0);
    setCurrentCombo(0);
    setMaxCombo(0);
    setLastPressedKey('');
    setIsCurrentError(false);
    setWeakKeysList({});
    if (isBossBattle) setBossHp(100);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [isBossBattle]);

  // Sound mute toggle
  const toggleMute = () => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
  };

  // Finish exercise handler
  const handleExerciseComplete = useCallback(() => {
    setIsFinished(true);
    playVictorySound();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Confetti fallback
    }

    // Determine Stars
    let stars = 1;
    if (wpm >= level.targetWpm && accuracy >= level.minAccuracy) {
      stars = 3;
    } else if (wpm >= level.targetWpm * 0.75 || accuracy >= level.minAccuracy - 5) {
      stars = 2;
    }

    // Determine coins earned
    const coins = Math.round(wpm * 2 + (accuracy > 95 ? 30 : 15) + (stars * 10));

    // Construct session result
    const result: TypingSessionResult = {
      id: 'session-' + Date.now(),
      timestamp: new Date().toISOString(),
      levelId: level.id,
      levelTitle: level.title,
      wpm,
      cpm,
      accuracy,
      timeSpentSeconds: Math.round(elapsedTime),
      mistakesCount: mistakes,
      totalKeystrokes,
      maxCombo,
      stars,
      coinsEarned: coins,
      weakKeysDetected: Object.keys(weakKeysList),
    };

    // Find next level
    const currentIndex = allLevels.findIndex((l) => l.id === level.id);
    const nextLevel = currentIndex >= 0 && currentIndex < allLevels.length - 1 ? allLevels[currentIndex + 1] : undefined;

    onCompleteLevel(result, nextLevel?.id);
  }, [accuracy, allLevels, elapsedTime, level, maxCombo, mistakes, onCompleteLevel, totalKeystrokes, weakKeysList, wpm]);

  // Handle keystroke input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const key = e.key;

    // Ignore modifier keys
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(key)) {
      return;
    }

    // Backspace handling
    if (key === 'Backspace') {
      e.preventDefault();
      if (charIndex > 0) {
        setCharIndex((prev) => prev - 1);
        setUserInput((prev) => prev.slice(0, -1));
        setIsCurrentError(false);
      }
      return;
    }

    // Only process single printable characters
    if (key.length !== 1) return;
    e.preventDefault();

    // Start timer on first keystroke
    if (!hasStarted) {
      setHasStarted(true);
      setStartTime(Date.now());
    }

    setLastPressedKey(key);
    setTotalKeystrokes((prev) => prev + 1);

    const expectedChar = targetText[charIndex];

    if (key === expectedChar) {
      // Correct keystroke!
      playKeySound(profile.avatar.soundTheme);
      setIsCurrentError(false);
      const nextCharIndex = charIndex + 1;
      setCharIndex(nextCharIndex);
      setUserInput((prev) => prev + key);

      // Combo streak
      const newCombo = currentCombo + 1;
      setCurrentCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      if (newCombo % 10 === 0) {
        playComboSound(newCombo);
      }

      // Boss damage
      if (isBossBattle) {
        const remainingChars = targetText.length - nextCharIndex;
        const newHp = Math.max(0, Math.round((remainingChars / targetText.length) * 100));
        setBossHp(newHp);
      }

      // Check if finished exercise
      if (nextCharIndex >= targetText.length) {
        handleExerciseComplete();
      }
    } else {
      // Mistake!
      playErrorSound();
      setIsCurrentError(true);
      setMistakes((prev) => prev + 1);
      setCurrentCombo(0);

      // Track weak key
      setWeakKeysList((prev) => ({
        ...prev,
        [expectedChar.toLowerCase()]: (prev[expectedChar.toLowerCase()] || 0) + 1,
      }));
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col gap-6" onClick={() => inputRef.current?.focus()}>
      {/* Hidden input to capture physical keyboard input */}
      <input
        ref={inputRef}
        type="text"
        value=""
        onChange={() => {}}
        onKeyDown={handleKeyDown}
        className="opacity-0 absolute -z-50 pointer-events-none"
        autoFocus
      />

      {/* Top Navigation & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl px-5 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <AvatarDisplay customization={profile.avatar} size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">{level.title}</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Latihan {exerciseIndex + 1}/{level.exercises.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">{level.subtitle}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title={muted ? 'Nyalakan Suara' : 'Bisukan Suara'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={() => setShowKeyboard(!showKeyboard)}
            className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-semibold ${
              showKeyboard
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Sembunyikan/Tampilkan Keyboard Virtual"
          >
            <KeyboardIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{showKeyboard ? 'Tuts Aktif' : 'Tuts Sembunyi'}</span>
          </button>

          <button
            onClick={resetExercise}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Mulai Ulang Latihan"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Ulang</span>
          </button>

          <button
            onClick={onExit}
            className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold transition"
          >
            Keluar
          </button>
        </div>
      </div>

      {/* Real-time HUD Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* WPM Speed */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono tracking-tight text-white">{wpm}</div>
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              WPM <span className="text-[10px] text-slate-500">({cpm} CPM)</span>
            </div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className={`text-2xl font-black font-mono tracking-tight ${accuracy >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {accuracy}%
            </div>
            <div className="text-[11px] font-semibold text-slate-400">
              Akurasi ({mistakes} keliru)
            </div>
          </div>
        </div>

        {/* Combo Multiplier */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-3.5 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
            currentCombo >= 10
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 animate-pulse'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}>
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono tracking-tight text-amber-400">
              {currentCombo}x
            </div>
            <div className="text-[11px] font-semibold text-slate-400">
              Combo (Maks: {maxCombo})
            </div>
          </div>
        </div>

        {/* Time Elapsed */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono tracking-tight text-sky-400">
              {Math.floor(elapsedTime)}s
            </div>
            <div className="text-[11px] font-semibold text-slate-400">
              Target: {level.targetWpm} WPM
            </div>
          </div>
        </div>
      </div>

      {/* Boss Battle HP Bar (If Level 7) */}
      {isBossBattle && (
        <div className="bg-rose-950/40 border border-rose-600/40 rounded-2xl p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👾</span>
              <div>
                <span className="text-sm font-bold text-rose-300">BOS BUGZILLA SYSTEM CRASHER</span>
                <p className="text-[11px] text-rose-400/80">Ketik akurat untuk meluncurkan serangan roket laser!</p>
              </div>
            </div>
            <span className="font-mono font-black text-rose-300 text-lg">{bossHp} / 100 HP</span>
          </div>
          <div className="w-full bg-slate-950 h-4 rounded-full overflow-hidden border border-rose-500/40">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 transition-all duration-200"
              style={{ width: `${bossHp}%` }}
            />
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-150"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Interactive Typing Prompt Area */}
      <div className="relative bg-slate-900/95 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Hint text banner */}
        <div className="flex items-center gap-2 mb-4 text-xs text-indigo-300/80 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-2 rounded-xl">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Tips: {currentExercise.hint}</span>
        </div>

        {/* Character Stream Display */}
        <div className="font-mono-typing text-xl sm:text-2xl md:text-3xl leading-relaxed tracking-wider break-words select-none p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 min-h-[140px] flex flex-wrap items-center">
          {targetText.split('').map((char, index) => {
            const isCompleted = index < charIndex;
            const isCurrent = index === charIndex;

            let charColor = 'text-slate-500';
            if (isCompleted) {
              charColor = 'text-emerald-400 font-medium';
            } else if (isCurrent) {
              charColor = isCurrentError
                ? 'bg-rose-500 text-white rounded px-0.5'
                : 'bg-indigo-600 text-white rounded px-0.5 shadow-md shadow-indigo-500/50';
            }

            return (
              <span
                key={index}
                className={`relative inline-block transition-colors ${charColor}`}
              >
                {char === ' ' ? ' ' : char}
                {isCurrent && (
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-indigo-400 animate-cursor-blink rounded-full" />
                )}
              </span>
            );
          })}
        </div>

        {/* Start / Focus Prompt */}
        {!hasStarted && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 animate-pulse">
            <span>Mulai mengetik tombol pertama di keyboard untuk memulai waktu</span>
          </div>
        )}
      </div>

      {/* Virtual Keyboard with Finger Guidance */}
      {showKeyboard && (
        <VirtualKeyboard
          activeChar={activeChar}
          lastPressedKey={lastPressedKey}
          isError={isCurrentError}
        />
      )}

      {/* Completion Modal */}
      {isFinished && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-center flex flex-col items-center gap-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Trophy & Stars */}
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-amber-400 shadow-xl shadow-indigo-500/20">
                <Trophy className="w-10 h-10" />
              </div>
              <div className="absolute -top-2 -right-2">
                <AvatarDisplay customization={profile.avatar} size="sm" />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Latihan Selesai!</h3>
              <p className="text-sm text-slate-400 mt-1">
                {wpm >= level.targetWpm && accuracy >= level.minAccuracy
                  ? 'Luar biasa! Kamu melampaui target level ini!'
                  : 'Bagus sekali! Terus latih kelenturan jari untuk mencapai bintang 3!'}
              </p>
            </div>

            {/* Stars Awarded */}
            <div className="flex items-center gap-3 text-3xl">
              <span className="text-amber-400 drop-shadow-md">⭐</span>
              <span className={`drop-shadow-md ${wpm >= level.targetWpm * 0.75 ? 'text-amber-400' : 'text-slate-700'}`}>⭐</span>
              <span className={`drop-shadow-md ${wpm >= level.targetWpm && accuracy >= level.minAccuracy ? 'text-amber-400' : 'text-slate-700'}`}>⭐</span>
            </div>

            {/* Stats Breakdown Grid */}
            <div className="grid grid-cols-3 gap-3 w-full bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div>
                <div className="text-2xl font-bold font-mono text-indigo-400">{wpm}</div>
                <div className="text-xs text-slate-400">WPM Kecepatan</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-emerald-400">{accuracy}%</div>
                <div className="text-xs text-slate-400">Akurasi</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-amber-400">+{Math.round(wpm * 2 + (accuracy > 95 ? 30 : 15))}</div>
                <div className="text-xs text-slate-400">Koin Bonus 🪙</div>
              </div>
            </div>

            {/* Weak Keys Diagnostic Feedback */}
            {Object.keys(weakKeysList).length > 0 && (
              <div className="w-full text-left bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs">
                <span className="font-bold text-rose-300 block mb-1">
                  Catatan Evaluasi Guru Otomatis:
                </span>
                <p className="text-slate-300">
                  Perlu diperhatikan tuts:{' '}
                  {Object.keys(weakKeysList).map((k) => (
                    <span key={k} className="inline-block px-1.5 py-0.5 mx-0.5 bg-rose-500/20 text-rose-300 font-mono font-bold rounded">
                      {k.toUpperCase()} ({getFingerForChar(k)})
                    </span>
                  ))}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full mt-2">
              <button
                onClick={resetExercise}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Ulangi
              </button>

              {exerciseIndex < level.exercises.length - 1 ? (
                <button
                  onClick={() => {
                    setExerciseIndex((prev) => prev + 1);
                    resetExercise();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                >
                  Latihan Selanjutnya <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onExit}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  Selesai Level <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
