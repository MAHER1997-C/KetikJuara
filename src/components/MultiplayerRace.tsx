import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MultiplayerRoom, RaceParticipant, StudentProfile } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import { playCountdownBeep, playKeySound, playVictorySound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  Flag,
  Trophy,
  Users,
  Zap,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  UserPlus,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { getMuted, setMuted } from '../utils/soundEffects';

interface MultiplayerRaceProps {
  profile: StudentProfile;
  onExit: () => void;
  onAwardCoins: (coins: number) => void;
}

const RACE_PROMPTS = [
  'Pendidikan adalah senjata paling ampuh yang dapat kamu gunakan untuk mengubah dunia menjadi lebih cerdas dan berkeadaban luhur.',
  'Kecepatan dan ketepatan jemari menari di atas tuts keyboard melambangkan generasi muda Indonesia yang tangkas dan siap menghadapi era digital.',
  'Bermimpilah setinggi langit, jika engkau jatuh, engkau akan jatuh di antara bintang-bintang gemerlap nusantara yang megah.',
  'Semangat gotong royong dan pantang menyerah adalah kunci emas membuka gerbang masa depan bangsa yang gemilang.',
];

const BOT_CLASSMATES = [
  { name: 'Budi Cepat', class: 'Kelas 8B', avatar: { avatar: 'kancil' as const, skin: 'emerald' as const, accessory: 'gamer-headset' as const, aura: 'lightning' as const, soundTheme: 'pop' as const, title: 'jari-kilat' as const }, baseWpm: 45 },
  { name: 'Siti Kilat', class: 'Kelas 8B', avatar: { avatar: 'cat' as const, skin: 'amber' as const, accessory: 'ninja-headband' as const, aura: 'flame' as const, soundTheme: 'mechanical' as const, title: 'ahli-10-jari' as const }, baseWpm: 52 },
  { name: 'Dewi Handal', class: 'Kelas 8B', avatar: { avatar: 'astro' as const, skin: 'cyan' as const, accessory: 'vr-goggles' as const, aura: 'cosmic' as const, soundTheme: 'laser' as const, title: 'duta-ketik' as const }, baseWpm: 38 },
  { name: 'Rian 10-Jari', class: 'Kelas 8B', avatar: { avatar: 'garuda' as const, skin: 'purple' as const, accessory: 'crown' as const, aura: 'sparkle' as const, soundTheme: 'typewriter' as const, title: 'dewa-keyboard' as const }, baseWpm: 48 },
];

export const MultiplayerRace: React.FC<MultiplayerRaceProps> = ({
  profile,
  onExit,
  onAwardCoins,
}) => {
  const [roomCode, setRoomCode] = useState('JUARA8B');
  const [roomStatus, setRoomStatus] = useState<'lobby' | 'countdown' | 'racing' | 'finished'>('lobby');
  const [countdown, setCountdown] = useState(3);
  const [promptText, setPromptText] = useState(RACE_PROMPTS[0]);

  // Participants
  const [participants, setParticipants] = useState<RaceParticipant[]>([
    {
      id: profile.id,
      name: profile.name,
      schoolClass: profile.schoolClass,
      avatar: profile.avatar,
      progress: 0,
      wpm: 0,
      accuracy: 100,
      finished: false,
      isCurrentUser: true,
    },
    {
      id: 'bot-1',
      name: BOT_CLASSMATES[0].name,
      schoolClass: BOT_CLASSMATES[0].class,
      avatar: BOT_CLASSMATES[0].avatar,
      progress: 0,
      wpm: 0,
      accuracy: 96,
      finished: false,
      isBot: true,
    },
    {
      id: 'bot-2',
      name: BOT_CLASSMATES[1].name,
      schoolClass: BOT_CLASSMATES[1].class,
      avatar: BOT_CLASSMATES[1].avatar,
      progress: 0,
      wpm: 0,
      accuracy: 98,
      finished: false,
      isBot: true,
    },
  ]);

  // Typing state for current user
  const [charIndex, setCharIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [raceStartTime, setRaceStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [myWpm, setMyWpm] = useState(0);
  const [myRank, setMyRank] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Sound mute
  const [muted, setMutedState] = useState(getMuted());
  const toggleMute = () => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
  };

  // Cross-tab real-time sync with BroadcastChannel
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('ketikjuara_race_channel');
      channelRef.current = bc;

      bc.onmessage = (event) => {
        const msg = event.data;
        if (!msg) return;

        if (msg.type === 'PLAYER_JOIN' && msg.player.id !== profile.id) {
          setParticipants((prev) => {
            if (prev.some((p) => p.id === msg.player.id)) return prev;
            return [...prev, msg.player];
          });
        } else if (msg.type === 'START_RACE') {
          setPromptText(msg.prompt || RACE_PROMPTS[0]);
          startCountdown();
        } else if (msg.type === 'PROGRESS_UPDATE' && msg.playerId !== profile.id) {
          setParticipants((prev) =>
            prev.map((p) =>
              p.id === msg.playerId
                ? { ...p, progress: msg.progress, wpm: msg.wpm, finished: msg.finished }
                : p
            )
          );
        }
      };

      // Broadcast self join
      bc.postMessage({
        type: 'PLAYER_JOIN',
        player: {
          id: profile.id,
          name: profile.name,
          schoolClass: profile.schoolClass,
          avatar: profile.avatar,
          progress: 0,
          wpm: 0,
          accuracy: 100,
          finished: false,
          isCurrentUser: false,
        },
      });

      return () => {
        bc.close();
      };
    }
  }, [profile]);

  // Add simulated classmate bot
  const handleAddClassmate = () => {
    const availableBots = BOT_CLASSMATES.filter(
      (b) => !participants.some((p) => p.name === b.name)
    );
    if (availableBots.length === 0) return;

    const botToAdd = availableBots[0];
    const newParticipant: RaceParticipant = {
      id: 'bot-' + Date.now(),
      name: botToAdd.name,
      schoolClass: botToAdd.class,
      avatar: botToAdd.avatar,
      progress: 0,
      wpm: 0,
      accuracy: 97,
      finished: false,
      isBot: true,
    };

    setParticipants((prev) => [...prev, newParticipant]);
  };

  // Start Countdown
  const startCountdown = () => {
    setRoomStatus('countdown');
    setCountdown(3);
    playCountdownBeep(false);

    let count = 3;
    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        playCountdownBeep(false);
      } else if (count === 0) {
        setCountdown(0);
        playCountdownBeep(true);
        clearInterval(timer);
        startRace();
      }
    }, 1000);
  };

  // Start Race
  const startRace = () => {
    setRoomStatus('racing');
    setRaceStartTime(Date.now());
    setCharIndex(0);
    setMistakes(0);
    setElapsedSeconds(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Bot simulation loop during racing
  useEffect(() => {
    let botInterval: NodeJS.Timeout;
    if (roomStatus === 'racing' && raceStartTime) {
      botInterval = setInterval(() => {
        const elapsed = (Date.now() - raceStartTime) / 1000;
        setElapsedSeconds(elapsed);

        setParticipants((prev) =>
          prev.map((p) => {
            if (!p.isBot || p.finished) return p;

            // Find bot config
            const botConfig = BOT_CLASSMATES.find((b) => b.name === p.name) || { baseWpm: 45 };
            // Calculate progress based on WPM
            const charsPerSec = (botConfig.baseWpm * 5) / 60;
            const simulatedChars = Math.min(promptText.length, Math.floor(elapsed * charsPerSec * (0.85 + Math.random() * 0.3)));
            const newProgress = Math.min(100, Math.round((simulatedChars / promptText.length) * 100));
            const isBotFinished = newProgress >= 100;

            return {
              ...p,
              progress: newProgress,
              wpm: Math.round((simulatedChars / 5) / Math.max(0.01, elapsed / 60)),
              finished: isBotFinished,
              finishTimeSeconds: isBotFinished ? Math.round(elapsed) : undefined,
            };
          })
        );
      }, 400);
    }
    return () => clearInterval(botInterval);
  }, [roomStatus, raceStartTime, promptText]);

  // Check if race completed
  useEffect(() => {
    if (roomStatus === 'racing') {
      const allFinished = participants.every((p) => p.finished);
      if (allFinished) {
        setRoomStatus('finished');
        playVictorySound();
        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        } catch {}
      }
    }
  }, [participants, roomStatus]);

  // Handle player typing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (roomStatus !== 'racing') return;

    const key = e.key;
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(key)) return;

    if (key === 'Backspace') {
      e.preventDefault();
      if (charIndex > 0) {
        setCharIndex((prev) => prev - 1);
      }
      return;
    }

    if (key.length !== 1) return;
    e.preventDefault();

    const expected = promptText[charIndex];

    if (key === expected) {
      playKeySound(profile.avatar.soundTheme);
      const nextIndex = charIndex + 1;
      setCharIndex(nextIndex);

      const elapsed = raceStartTime ? (Date.now() - raceStartTime) / 1000 : 0.1;
      const progress = Math.min(100, Math.round((nextIndex / promptText.length) * 100));
      const currentWpm = Math.round((nextIndex / 5) / Math.max(0.01, elapsed / 60));
      setMyWpm(currentWpm);

      const isMeFinished = nextIndex >= promptText.length;

      // Update current user in participant list
      setParticipants((prev) => {
        const finishedCount = prev.filter((p) => p.finished).length;
        const myRankPos = isMeFinished ? finishedCount + 1 : undefined;
        if (isMeFinished && myRank === null) {
          setMyRank(myRankPos || 1);
          playVictorySound();
          try {
            confetti({ particleCount: 80, spread: 60 });
          } catch {}
          onAwardCoins(myRankPos === 1 ? 150 : myRankPos === 2 ? 100 : 70);
        }

        const updated = prev.map((p) =>
          p.id === profile.id
            ? {
                ...p,
                progress,
                wpm: currentWpm,
                finished: isMeFinished,
                finishTimeSeconds: isMeFinished ? Math.round(elapsed) : undefined,
                rank: myRankPos,
              }
            : p
        );

        // Broadcast to other tabs
        channelRef.current?.postMessage({
          type: 'PROGRESS_UPDATE',
          playerId: profile.id,
          progress,
          wpm: currentWpm,
          finished: isMeFinished,
        });

        return updated;
      });
    } else {
      setMistakes((prev) => prev + 1);
    }
  };

  // Reset race
  const handleResetRace = () => {
    setRoomStatus('lobby');
    setCharIndex(0);
    setMistakes(0);
    setMyWpm(0);
    setMyRank(null);
    setParticipants((prev) =>
      prev.map((p) => ({
        ...p,
        progress: 0,
        wpm: 0,
        finished: false,
        finishTimeSeconds: undefined,
        rank: undefined,
      }))
    );
  };

  // Sorted participants by progress or finish time
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.finished && b.finished) {
      return (a.finishTimeSeconds || 0) - (b.finishTimeSeconds || 0);
    }
    if (a.finished) return -1;
    if (b.finished) return 1;
    return b.progress - a.progress;
  });

  return (
    <div
      className="w-full max-w-5xl mx-auto flex flex-col gap-6"
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        type="text"
        value=""
        onChange={() => {}}
        onKeyDown={handleKeyDown}
        className="opacity-0 absolute -z-50 pointer-events-none"
        autoFocus
      />

      {/* Top Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flag className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Arena Balapan Mengetik Kelas</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Kode Room: {roomCode}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Kompetisi real-time antar siswa kelas secara langsung dengan avatar dan lintasan balap!
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {roomStatus === 'lobby' && (
            <>
              <button
                onClick={handleAddClassmate}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition border border-slate-700 flex items-center gap-1.5"
                title="Tambahkan Siswa Bot Kelas"
              >
                <UserPlus className="w-4 h-4 text-sky-400" /> Tambah Teman Kelas
              </button>

              <button
                onClick={startCountdown}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-white" /> Mulai Balapan!
              </button>
            </>
          )}

          <button
            onClick={onExit}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Keluar
          </button>
        </div>
      </div>

      {/* COUNTDOWN OVERLAY */}
      {roomStatus === 'countdown' && (
        <div className="bg-slate-900/90 border border-indigo-500/40 rounded-3xl p-10 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-200">
          <span className="text-xs uppercase tracking-widest font-black text-indigo-400 mb-2">
            Persiapan Di Garis Start
          </span>
          <div className="text-7xl sm:text-9xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-amber-400 to-orange-500 animate-pulse">
            {countdown > 0 ? countdown : 'GAS!'}
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Letakkan jari-jarimu di tuts beranda (ASDF JKL;)!
          </p>
        </div>
      )}

      {/* LIVE RACE TRACK LANES */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Track Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-semibold">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Lintasan Balap ({participants.length} Pembalap)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Garis Finis</span>
            <span className="font-mono text-xs">🏁 100%</span>
          </div>
        </div>

        {/* Lanes List */}
        <div className="flex flex-col gap-4">
          {participants.map((participant, index) => {
            const isMe = participant.isCurrentUser;

            return (
              <div
                key={participant.id}
                className={`p-3 rounded-2xl border transition-all relative ${
                  isMe
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                {/* Lane Info Label */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-500">#{index + 1}</span>
                    <span className="font-bold text-white">
                      {participant.name} {isMe && <span className="text-indigo-400 font-semibold">(Kamu)</span>}
                    </span>
                    <span className="text-[10px] text-slate-400">({participant.schoolClass})</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <span className="font-bold text-indigo-300 text-xs">{participant.wpm} WPM</span>
                    <span className="text-emerald-400 text-xs">{participant.progress}%</span>
                    {participant.finished && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        🏁 Selesai! ({participant.finishTimeSeconds}s)
                      </span>
                    )}
                  </div>
                </div>

                {/* Track Lane Roadway */}
                <div className="relative w-full h-12 bg-slate-900 rounded-xl overflow-hidden border border-slate-800/80 flex items-center">
                  {/* Road Asphalt Lines */}
                  <div className="absolute inset-0 flex items-center justify-between px-2 opacity-20">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="w-4 h-0.5 bg-slate-400 rounded-full" />
                    ))}
                  </div>

                  {/* Finish Line Checkered Banner */}
                  <div className="absolute right-0 top-0 bottom-0 w-6 bg-[repeating-conic-gradient(#000000_0%_25%,#ffffff_0%_50%)] bg-[size:10px_10px] opacity-40 border-l border-white/20" />

                  {/* Moving Racer Avatar */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-out flex items-center gap-1.5"
                    style={{
                      left: `calc(${participant.progress * 0.88}% + 4px)`,
                    }}
                  >
                    <AvatarDisplay
                      customization={participant.avatar}
                      size="sm"
                      showAura={participant.progress > 40}
                      animate={roomStatus === 'racing' && !participant.finished}
                    />

                    {/* Speed Bubble */}
                    <div className="px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-amber-300 font-bold whitespace-nowrap shadow-md">
                      {participant.wpm} WPM
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TYPING PROMPT (Active when racing) */}
      {(roomStatus === 'racing' || roomStatus === 'lobby') && (
        <div className="bg-slate-900/95 border-2 border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Teks Balapan Kelas:
            </span>
            <span className="font-mono text-indigo-400 font-bold">
              Kecepatanmu: {myWpm} WPM
            </span>
          </div>

          {/* Interactive Character Stream */}
          <div className="font-mono-typing text-lg sm:text-xl leading-relaxed tracking-wider break-words select-none p-4 rounded-2xl bg-slate-950/80 border border-slate-800 min-h-[110px] flex flex-wrap items-center">
            {promptText.split('').map((char, index) => {
              const isCompleted = index < charIndex;
              const isCurrent = index === charIndex;

              let charColor = 'text-slate-500';
              if (isCompleted) {
                charColor = 'text-emerald-400 font-medium';
              } else if (isCurrent) {
                charColor = 'bg-indigo-600 text-white rounded px-0.5 shadow-md shadow-indigo-500/50';
              }

              return (
                <span key={index} className={`relative inline-block transition-colors ${charColor}`}>
                  {char === ' ' ? ' ' : char}
                  {isCurrent && (
                    <span className="absolute -bottom-1 left-0 right-0 h-1 bg-indigo-400 animate-cursor-blink rounded-full" />
                  )}
                </span>
              );
            })}
          </div>

          {roomStatus === 'lobby' && (
            <div className="mt-3 text-center text-xs text-slate-400">
              Tekan <strong className="text-emerald-400">"Mulai Balapan!"</strong> di atas saat seluruh teman sekelas sudah siap.
            </div>
          )}
        </div>
      )}

      {/* FINISHED PODIUM RECAP MODAL */}
      {roomStatus === 'finished' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-center flex flex-col items-center gap-5 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/20">
              <Trophy className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Balapan Selesai!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Hasil resmi kompetisi mengetik kelas live
              </p>
            </div>

            {/* Podium Rank Results */}
            <div className="w-full flex flex-col gap-2 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
              {sortedParticipants.map((p, idx) => {
                const isMe = p.isCurrentUser;
                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl ${
                      isMe ? 'bg-indigo-950/60 border border-indigo-500/40' : 'bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-sm text-amber-400">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                      </span>
                      <AvatarDisplay customization={p.avatar} size="xs" showAura={false} />
                      <span className="font-bold text-white text-xs">
                        {p.name} {isMe && '(Kamu)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span className="text-indigo-400 font-bold">{p.wpm} WPM</span>
                      <span className="text-slate-400">{p.finishTimeSeconds}s</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={handleResetRace}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Balapan Lagi
              </button>

              <button
                onClick={onExit}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                Kembali ke Menu <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
