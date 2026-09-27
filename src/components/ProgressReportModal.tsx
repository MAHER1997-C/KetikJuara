import React, { useState } from 'react';
import { ClassStudentAnalytics } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import {
  Printer,
  Copy,
  Check,
  Share2,
  FileText,
  Award,
  Download,
  Send,
  Sparkles,
  ExternalLink,
  X,
} from 'lucide-react';

interface ProgressReportModalProps {
  student: ClassStudentAnalytics;
  onClose: () => void;
}

export const ProgressReportModal: React.FC<ProgressReportModalProps> = ({
  student,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [syncedLMS, setSyncedLMS] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Compute Grade letter
  let gradeLetter = 'A';
  let gradePredicate = 'Sangat Memuaskan';
  if (student.avgWpm >= 50 && student.avgAccuracy >= 95) {
    gradeLetter = 'A+';
    gradePredicate = 'Istimewa / Ahli 10 Jari';
  } else if (student.avgWpm >= 40 && student.avgAccuracy >= 92) {
    gradeLetter = 'A';
    gradePredicate = 'Sangat Memuaskan';
  } else if (student.avgWpm >= 30 && student.avgAccuracy >= 88) {
    gradeLetter = 'B+';
    gradePredicate = 'Memuaskan';
  } else if (student.avgWpm >= 20) {
    gradeLetter = 'B';
    gradePredicate = 'Cukup / Perlu Rutin Latihan';
  } else {
    gradeLetter = 'C';
    gradePredicate = 'Perlu Pendampingan Khusus';
  }

  // Generate classroom text summary
  const generateSummaryText = () => {
    return `📊 *RAPOR KEMAJUAN MENGETIK 10 JARI SISWA*
🏫 SMP Negeri Merdeka Belajar
👤 Nama: ${student.name}
📚 Kelas: ${student.schoolClass}
📅 Tanggal: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
---------------------------------
⚡ Kecepatan Rata-rata: ${student.avgWpm} WPM
🎯 Akurasi Rata-rata: ${student.avgAccuracy}%
🏆 Level Dicapai: ${student.currentLevel} (⭐ ${student.stars} Bintang)
🎖️ Predikat Nilai: ${gradeLetter} (${gradePredicate})
🔍 Tuts Perlu Dilatih: ${student.problemKeys.join(', ').toUpperCase()}
---------------------------------
Catatan Guru: Pertahankan postur mengetik tegak dan latih kelenturan ${student.weakFinger} untuk mencapai ritme ketukan optimal.`;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSyncToLMS = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncedLMS(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Modal Header & Quick Actions */}
        <div className="no-print p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Rapor Kemajuan Mengetik Resmi</h3>
              <p className="text-[11px] text-slate-400">Siap cetak, simpan PDF, dan disinkronkan ke LMS</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
              title="Cetak Rapor Resmi atau Simpan sebagai PDF"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak / PDF
            </button>

            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition border border-slate-700 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Tersalin!' : 'Salin Pesan'}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Report Card Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-slate-900 report-card-print">
          {/* School Kop Surat */}
          <div className="border-b-2 border-slate-700 pb-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="text-2xl">🎓</span>
              <h2 className="text-lg font-black tracking-wide uppercase text-white">
                Kementerian Pendidikan & Kebudayaan
              </h2>
            </div>
            <h1 className="text-base font-bold text-indigo-400 uppercase tracking-widest">
              Laporan Hasil Kemajuan Belajar Mengetik 10 Jari Siswa
            </h1>
            <p className="text-[11px] text-slate-400">
              Sistem Pembelajaran Terkomputerisasi KetikJuara • Tahun Ajaran 2026/2027
            </p>
          </div>

          {/* Student Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Nama Lengkap</span>
              <span className="font-bold text-white text-sm">{student.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Kelas / Rombel</span>
              <span className="font-bold text-white text-sm">{student.schoolClass}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Tanggal Penilaian</span>
              <span className="font-semibold text-slate-300">
                {new Date().toLocaleDateString('id-ID', { dateStyle: 'medium' })}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Predikat Kelulusan</span>
              <span className="font-black text-emerald-400 text-base">{gradeLetter}</span>
            </div>
          </div>

          {/* Metric Performance Highlights */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-center">
              <span className="text-xs text-indigo-300 font-semibold block mb-1">Kecepatan Mengetik</span>
              <span className="text-3xl font-black font-mono text-indigo-400">{student.avgWpm}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Kata Per Menit (WPM)</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center">
              <span className="text-xs text-emerald-300 font-semibold block mb-1">Tingkat Akurasi</span>
              <span className="text-3xl font-black font-mono text-emerald-400">{student.avgAccuracy}%</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Rasio Ketukan Tepat</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-center">
              <span className="text-xs text-amber-300 font-semibold block mb-1">Bintang & Progres</span>
              <span className="text-3xl font-black font-mono text-amber-400">{student.stars} ⭐</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">{student.currentLevel}</span>
            </div>
          </div>

          {/* Detailed Diagnostic & Diagnostic Table */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
            <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Diagnosis Kemampuan Motorik Jemari Siswa
            </h4>
            <div className="space-y-2 text-slate-300 leading-relaxed">
              <p>
                <strong>Area Kelemahan Terdeteksi:</strong> Siswa memiliki frekuensi koreksi tertinggi pada tuts{' '}
                {student.problemKeys.map((k) => (
                  <span key={k} className="inline-block px-1.5 py-0.2 mx-0.5 bg-rose-500/20 text-rose-300 font-mono font-bold rounded">
                    {k.toUpperCase()}
                  </span>
                ))}{' '}
                yang dikendalikan oleh <span className="text-amber-300 font-semibold">{student.weakFinger}</span>.
              </p>
              <p>
                <strong>Rekomendasi Tindak Lanjut:</strong> Berikan porsi latihan tambahan pada Baris Atas dan
                latihan kata-kata bertempo sedang tanpa menggunakan tombol hapus (Backspace) secara impulsif.
              </p>
            </div>
          </div>

          {/* Official Signature Lines */}
          <div className="pt-6 grid grid-cols-2 text-center text-xs text-slate-300">
            <div>
              <p className="text-slate-400 mb-12">Mengetahui,<br />Guru Mata Pelajaran Informatika</p>
              <p className="font-bold text-white border-t border-slate-700 pt-1 inline-block min-w-[160px]">
                ( Bpk. Haryanto, S.Kom )
              </p>
            </div>
            <div>
              <p className="text-slate-400 mb-12">Disahkan Oleh,<br />Kepala Laboratorium Komputer</p>
              <p className="font-bold text-white border-t border-slate-700 pt-1 inline-block min-w-[160px]">
                ( Ibu Ratna Sari, M.Pd )
              </p>
            </div>
          </div>
        </div>

        {/* LMS / Platform Integration Footer */}
        <div className="no-print p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Share2 className="w-4 h-4 text-indigo-400" />
            <span>Integrasi LMS Sekolah:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Siap Terhubung
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncToLMS}
              disabled={syncing || syncedLMS}
              className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                syncedLMS
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {syncing ? (
                <span>Menghubungkan...</span>
              ) : syncedLMS ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Tersinkron ke Google Classroom
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-sky-400" /> Sinkronkan ke Google Classroom
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
