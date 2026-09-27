import React from 'react';
import { FINGER_NAMES, getKeyInfo, KEYBOARD_ROWS } from '../utils/keyboardMapping';

interface VirtualKeyboardProps {
  activeChar: string;
  lastPressedKey?: string;
  isError?: boolean;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeChar,
  lastPressedKey,
  isError = false,
}) => {
  const activeKeyInfo = getKeyInfo(activeChar);
  const activeFinger = activeKeyInfo?.finger;
  const fingerGuide = activeFinger ? FINGER_NAMES[activeFinger] : null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md">
      {/* Finger placement guide banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
            Panduan 10 Jari:
          </span>
          {fingerGuide ? (
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${fingerGuide.bgClass} ${fingerGuide.borderClass} ${fingerGuide.textClass}`}>
                {fingerGuide.name}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                (Tangan {fingerGuide.hand})
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Tekan tombol mulai untuk berlatih</span>
          )}
        </div>

        {/* Target key badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Tuts Selanjutnya:</span>
          <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold text-sm border border-indigo-500/40">
            {activeChar === ' ' ? '␣ Spasi' : (activeChar || '–')}
          </span>
        </div>
      </div>

      {/* Keyboard Grid */}
      <div className="flex flex-col gap-1.5 sm:gap-2 items-center select-none font-mono-typing">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 sm:gap-1.5 justify-center w-full">
            {row.map((item) => {
              const isActive =
                (item.key.toLowerCase() === activeChar?.toLowerCase()) ||
                (item.key === ' ' && activeChar === ' ');

              const isJustPressed =
                lastPressedKey &&
                (item.key.toLowerCase() === lastPressedKey.toLowerCase() ||
                  (item.key === ' ' && lastPressedKey === ' '));

              const fingerStyle = FINGER_NAMES[item.finger];

              // Key styling based on state
              let keyClasses = 'bg-slate-800/90 text-slate-300 border-slate-700/80 hover:border-slate-600';

              if (isActive) {
                keyClasses = 'bg-indigo-600 text-white font-black border-indigo-400 shadow-lg shadow-indigo-500/50 scale-105 z-10 animate-pulse';
              } else if (isJustPressed && isError) {
                keyClasses = 'bg-rose-600 text-white font-bold border-rose-400 shadow-lg shadow-rose-500/50 scale-100';
              } else if (isJustPressed && !isError) {
                keyClasses = 'bg-emerald-600 text-white font-bold border-emerald-400 shadow-lg shadow-emerald-500/40';
              }

              // Special widths
              const widthClass = item.width || 'w-8 sm:w-11 md:w-12';

              return (
                <div
                  key={item.key + item.display}
                  className={`
                    ${widthClass} h-9 sm:h-11 md:h-12
                    flex flex-col items-center justify-center
                    rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold
                    border transition-all duration-150 relative overflow-hidden
                    ${keyClasses}
                  `}
                >
                  {/* Subtle color pip representing finger assignment */}
                  <div
                    className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full opacity-60"
                    style={{ backgroundColor: fingerStyle?.color }}
                    title={fingerStyle?.name}
                  />

                  <span>{item.display}</span>

                  {/* Tactile bumps for F and J */}
                  {(item.key === 'f' || item.key === 'j') && (
                    <div className="w-2.5 h-0.5 bg-slate-400 rounded-full mt-0.5 opacity-70" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Hands finger color legend */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 hidden sm:flex items-center justify-between text-[11px] text-slate-400 px-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500">Tangan Kiri:</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Kelingking</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Manis</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Tengah</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Telunjuk</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500">Tangan Kanan:</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Telunjuk</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Tengah</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500" /> Manis</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-500" /> Kelingking</span>
        </div>
      </div>
    </div>
  );
};
