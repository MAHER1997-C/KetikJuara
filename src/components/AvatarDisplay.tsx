import React from 'react';
import { CharacterCustomization } from '../types';

interface AvatarDisplayProps {
  customization: CharacterCustomization;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showAura?: boolean;
  className?: string;
  animate?: boolean;
}

const colorMap = {
  indigo: { primary: '#6366f1', secondary: '#818cf8', accent: '#c7d2fe', glow: 'rgba(99, 102, 241, 0.4)' },
  emerald: { primary: '#10b981', secondary: '#34d399', accent: '#a7f3d0', glow: 'rgba(16, 185, 129, 0.4)' },
  amber: { primary: '#f59e0b', secondary: '#fbbf24', accent: '#fde68a', glow: 'rgba(245, 158, 11, 0.4)' },
  rose: { primary: '#f43f5e', secondary: '#fb7185', accent: '#fecdd3', glow: 'rgba(244, 63, 94, 0.4)' },
  cyan: { primary: '#06b6d4', secondary: '#22d3ee', accent: '#a5f3fc', glow: 'rgba(6, 182, 212, 0.4)' },
  purple: { primary: '#a855f7', secondary: '#c084fc', accent: '#e9d5ff', glow: 'rgba(168, 85, 247, 0.4)' },
};

const sizeClasses = {
  xs: 'w-7 h-7',
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
  xl: 'w-28 h-28',
};

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  customization,
  size = 'md',
  showAura = true,
  className = '',
  animate = true,
}) => {
  const { avatar, skin, accessory, aura } = customization;
  const colors = colorMap[skin] || colorMap.indigo;

  // Render Base Avatar SVG
  const renderAvatarBase = () => {
    switch (avatar) {
      case 'robot':
        return (
          <g>
            {/* Robot Head */}
            <rect x="22" y="24" width="56" height="52" rx="14" fill={colors.primary} />
            <rect x="26" y="28" width="48" height="44" rx="10" fill="#1e1b4b" />
            {/* Antenna */}
            <line x1="50" y1="24" x2="50" y2="12" stroke={colors.secondary} strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="10" r="5" fill={colors.accent} className={animate ? 'animate-pulse' : ''} />
            {/* Robot Visor / Eyes */}
            <rect x="32" y="38" width="36" height="16" rx="8" fill="#0f172a" stroke={colors.secondary} strokeWidth="2" />
            <circle cx="42" cy="46" r="4" fill={colors.accent} />
            <circle cx="58" cy="46" r="4" fill={colors.accent} />
            {/* Robot Smile / Screen wave */}
            <path d="M 40 60 Q 50 66 60 60" stroke={colors.accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Ear Bolts */}
            <rect x="16" y="44" width="6" height="12" rx="2" fill={colors.secondary} />
            <rect x="78" y="44" width="6" height="12" rx="2" fill={colors.secondary} />
          </g>
        );

      case 'kancil':
        return (
          <g>
            {/* Kancil / Deer Ears */}
            <polygon points="34,16 26,38 42,34" fill={colors.primary} />
            <polygon points="34,20 29,36 39,33" fill={colors.accent} />
            <polygon points="66,16 58,34 74,38" fill={colors.primary} />
            <polygon points="66,20 61,33 71,36" fill={colors.accent} />
            {/* Head Face */}
            <ellipse cx="50" cy="52" rx="28" ry="26" fill={colors.primary} />
            <ellipse cx="50" cy="62" rx="18" ry="14" fill="#ffffff" />
            {/* Big Expressive Eyes */}
            <circle cx="38" cy="46" r="7" fill="#0f172a" />
            <circle cx="36" cy="44" r="2.5" fill="#ffffff" />
            <circle cx="62" cy="46" r="7" fill="#0f172a" />
            <circle cx="60" cy="44" r="2.5" fill="#ffffff" />
            {/* Cute Nose & Smile */}
            <polygon points="50,60 46,55 54,55" fill="#e11d48" />
            <path d="M 47 63 Q 50 67 53 63" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Cheeks */}
            <circle cx="32" cy="54" r="4" fill="#fda4af" opacity="0.8" />
            <circle cx="68" cy="54" r="4" fill="#fda4af" opacity="0.8" />
          </g>
        );

      case 'garuda':
        return (
          <g>
            {/* Garuda Crest Feathers */}
            <path d="M 50 10 L 45 28 L 50 24 L 55 28 Z" fill={colors.secondary} />
            <path d="M 38 16 L 42 32 L 48 26 Z" fill={colors.primary} />
            <path d="M 62 16 L 52 26 L 58 32 Z" fill={colors.primary} />
            {/* Head */}
            <circle cx="50" cy="48" r="28" fill={colors.primary} />
            {/* Sharp Cyber Mask */}
            <path d="M 28 42 L 50 32 L 72 42 L 50 56 Z" fill="#1e293b" opacity="0.7" />
            {/* Fierce Eyes */}
            <polygon points="34,44 44,40 40,48" fill={colors.accent} />
            <polygon points="66,44 60,48 56,40" fill={colors.accent} />
            {/* Golden Curved Beak */}
            <path d="M 44 48 Q 50 48 56 48 L 50 72 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
            <line x1="45" y1="52" x2="55" y2="52" stroke="#b45309" strokeWidth="1.5" />
          </g>
        );

      case 'cat':
        return (
          <g>
            {/* Cat Ears */}
            <polygon points="26,16 18,44 40,36" fill={colors.primary} />
            <polygon points="27,22 22,42 36,36" fill="#f43f5e" opacity="0.7" />
            <polygon points="74,16 60,36 82,44" fill={colors.primary} />
            <polygon points="73,22 64,36 78,42" fill="#f43f5e" opacity="0.7" />
            {/* Cat Head */}
            <ellipse cx="50" cy="54" rx="30" ry="25" fill={colors.primary} />
            {/* Ninja Cat Eyes */}
            <ellipse cx="38" cy="48" rx="6" ry="8" fill="#10b981" />
            <ellipse cx="38" cy="48" rx="2" ry="7" fill="#042f2e" />
            <ellipse cx="62" cy="48" rx="6" ry="8" fill="#10b981" />
            <ellipse cx="62" cy="48" rx="2" ry="7" fill="#042f2e" />
            {/* Whiskers */}
            <line x1="20" y1="56" x2="10" y2="54" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="20" y1="60" x2="10" y2="62" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="80" y1="56" x2="90" y2="54" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="80" y1="60" x2="90" y2="62" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            {/* Muzzle */}
            <ellipse cx="50" cy="62" rx="10" ry="6" fill="#ffffff" />
            <circle cx="50" cy="59" r="2.5" fill="#f43f5e" />
          </g>
        );

      case 'astro':
        return (
          <g>
            {/* Astronaut Helmet Outer */}
            <circle cx="50" cy="50" r="32" fill="#ffffff" stroke="#cbd5e1" strokeWidth="4" />
            {/* Neck Collar */}
            <rect x="34" y="78" width="32" height="12" rx="4" fill={colors.primary} />
            {/* Visor */}
            <rect x="26" y="32" width="48" height="34" rx="16" fill={colors.primary} />
            {/* Visor Reflection Gloss */}
            <path d="M 32 38 Q 50 32 64 36" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.8" strokeLinecap="round" />
            {/* Internal HUD Star / Planet */}
            <circle cx="42" cy="48" r="4" fill={colors.accent} />
            <circle cx="58" cy="52" r="2" fill="#ffffff" />
          </g>
        );

      case 'dragon':
        return (
          <g>
            {/* Dragon Horns */}
            <path d="M 32 28 Q 18 10 24 6 Q 30 18 36 24" fill="#f59e0b" />
            <path d="M 68 28 Q 82 10 76 6 Q 70 18 64 24" fill="#f59e0b" />
            {/* Dragon Head */}
            <path d="M 28 36 L 50 24 L 72 36 L 76 66 L 50 78 L 24 66 Z" fill={colors.primary} />
            {/* Dragon Scales */}
            <polygon points="50,30 45,38 55,38" fill={colors.secondary} />
            <polygon points="50,42 43,52 57,52" fill={colors.secondary} />
            {/* Glowing Amber Eyes */}
            <polygon points="34,46 44,44 38,52" fill="#fde047" />
            <circle cx="39" cy="47" r="1.5" fill="#000000" />
            <polygon points="66,46 56,44 62,52" fill="#fde047" />
            <circle cx="61" cy="47" r="1.5" fill="#000000" />
            {/* Snout with Smoke */}
            <circle cx="44" cy="68" r="2" fill="#1e1b4b" />
            <circle cx="56" cy="68" r="2" fill="#1e1b4b" />
          </g>
        );
    }
  };

  // Render Overlaid Accessory
  const renderAccessory = () => {
    switch (accessory) {
      case 'gamer-headset':
        return (
          <g>
            {/* Headset Band */}
            <path d="M 18 50 A 34 34 0 0 1 82 50" fill="none" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
            <path d="M 22 46 A 30 30 0 0 1 78 46" fill="none" stroke={colors.secondary} strokeWidth="2" strokeLinecap="round" />
            {/* Ear Cups */}
            <rect x="12" y="42" width="10" height="22" rx="5" fill="#0f172a" stroke={colors.accent} strokeWidth="1.5" />
            <rect x="78" y="42" width="10" height="22" rx="5" fill="#0f172a" stroke={colors.accent} strokeWidth="1.5" />
            {/* Mic */}
            <path d="M 20 60 Q 24 74 38 72" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="38" cy="72" r="3" fill="#ef4444" className={animate ? 'animate-ping' : ''} />
          </g>
        );

      case 'crown':
        return (
          <g>
            <polygon points="30,22 36,8 50,18 64,8 70,22" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
            <rect x="30" y="20" width="40" height="5" rx="1.5" fill="#d97706" />
            {/* Jewels */}
            <circle cx="36" cy="11" r="2" fill="#f43f5e" />
            <circle cx="50" cy="19" r="2.5" fill="#06b6d4" />
            <circle cx="64" cy="11" r="2" fill="#f43f5e" />
          </g>
        );

      case 'vr-goggles':
        return (
          <g>
            <rect x="24" y="38" width="52" height="20" rx="6" fill="#09090b" stroke={colors.accent} strokeWidth="2" />
            <rect x="30" y="42" width="40" height="12" rx="4" fill="#18181b" />
            <line x1="34" y1="48" x2="48" y2="48" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
            <line x1="52" y1="48" x2="66" y2="48" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
            <rect x="14" y="45" width="12" height="6" fill="#27272a" />
            <rect x="74" y="45" width="12" height="6" fill="#27272a" />
          </g>
        );

      case 'grad-cap':
        return (
          <g>
            {/* Cap Base */}
            <polygon points="50,6 84,18 50,30 16,18" fill="#1e1b4b" stroke="#4338ca" strokeWidth="1" />
            <rect x="36" y="25" width="28" height="8" rx="2" fill="#1e1b4b" />
            {/* Tassel */}
            <circle cx="50" cy="18" r="2" fill="#fbbf24" />
            <path d="M 50 18 Q 65 24 72 36" fill="none" stroke="#fbbf24" strokeWidth="2" />
            <rect x="70" y="34" width="4" height="6" fill="#f59e0b" />
          </g>
        );

      case 'space-helmet':
        return (
          <g>
            <circle cx="50" cy="48" r="38" fill="none" stroke="#38bdf8" strokeWidth="3" opacity="0.6" />
            <ellipse cx="36" cy="24" rx="14" ry="5" fill="#ffffff" opacity="0.4" transform="rotate(-20 36 24)" />
          </g>
        );

      case 'ninja-headband':
        return (
          <g>
            <rect x="20" y="32" width="60" height="9" rx="3" fill="#dc2626" />
            <rect x="42" y="33" width="16" height="7" rx="2" fill="#e2e8f0" />
            {/* Ties */}
            <path d="M 22 36 Q 10 44 8 58" fill="none" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
            <path d="M 20 39 Q 12 50 12 62" fill="none" stroke="#b91c1c" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        );

      default:
        return null;
    }
  };

  // Render Background Aura Effects
  const renderAura = () => {
    if (!showAura || aura === 'none') return null;

    switch (aura) {
      case 'lightning':
        return (
          <div className="absolute inset-0 -m-2 rounded-full border-2 border-cyan-400/60 animate-pulse glow-indigo pointer-events-none">
            <span className="absolute -top-1 left-2 text-cyan-300 text-xs">⚡</span>
            <span className="absolute -bottom-1 right-2 text-cyan-300 text-xs">⚡</span>
          </div>
        );

      case 'sparkle':
        return (
          <div className="absolute inset-0 -m-2 rounded-full border-2 border-amber-400/50 glow-amber pointer-events-none">
            <span className="absolute -top-2 right-1 text-amber-300 text-xs animate-bounce">✨</span>
            <span className="absolute bottom-0 -left-1 text-amber-300 text-xs animate-pulse">⭐</span>
          </div>
        );

      case 'flame':
        return (
          <div className="absolute inset-0 -m-2 rounded-full border-2 border-rose-500/60 glow-rose pointer-events-none">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-rose-400 text-sm animate-bounce">🔥</span>
          </div>
        );

      case 'pixel':
        return (
          <div className="absolute inset-0 -m-1 rounded-2xl border-2 border-emerald-400/60 glow-emerald pointer-events-none">
            <span className="absolute -top-2 left-0 text-[10px] font-mono text-emerald-400 font-bold">01</span>
            <span className="absolute -bottom-2 right-0 text-[10px] font-mono text-emerald-400 font-bold">10</span>
          </div>
        );

      case 'cosmic':
        return (
          <div className="absolute inset-0 -m-3 rounded-full border-2 border-purple-500/70 border-dashed animate-spin [animation-duration:12s] pointer-events-none" />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
      {renderAura()}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md z-10 transition-transform duration-200"
      >
        {renderAvatarBase()}
        {renderAccessory()}
      </svg>
    </div>
  );
};
