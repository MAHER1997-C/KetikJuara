import React, { useState } from 'react';
import { ClassStudentAnalytics } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import { FINGER_NAMES, KEYBOARD_ROWS } from '../utils/keyboardMapping';
import {
  Users,
  Zap,
  Target,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Send,
} from 'lucide-react';

interface TeacherDashboardProps {
  studentsData: ClassStudentAnalytics[];
  onOpenReportModal: (student: ClassStudentAnalytics) => void;
  onLaunchClassRace: (customPrompt?: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  studentsData,
  onOpenReportModal,
  onLaunchClassRace,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('Kelas 8B');
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedStudentForHeatmap, setSelectedStudentForHeatmap] = useState<string | null>(null);
  const [customNotice, setCustomNotice] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Available classes
  const classesList = ['Semua Kelas', 'Kelas 7A', 'Kelas 7B', 'Kelas 8A', 'Kelas 8B'];

  // Filter students by selected class
  const filteredStudents = studentsData.filter((s) => {
    const matchesClass = selectedClass === 'Semua Kelas' || s.schoolClass.includes(selectedClass);
    const matchesSearch = s.name.toLowerCase().includes(searchStudent.toLowerCase());
    return matchesClass && matchesSearch;
  });

  // Aggregated class metrics
  const totalStudents = filteredStudents.length;
  const avgWpm = totalStudents > 0
    ? Math.round(filteredStudents.reduce((acc, curr) => acc + curr.avgWpm, 0) / totalStudents)
    : 0;
  const avgAccuracy = totalStudents > 0
    ? Math.round((filteredStudents.reduce((acc, curr) => acc + curr.avgAccuracy, 0) / totalStudents) * 10) / 10
    : 0;
  const onlineCount = filteredStudents.filter((s) => s.status === 'online' || s.status === 'typing').length;

  // Aggregate Key Error Heatmap
  const aggregateKeyErrors: Record<string, number> = {};
  filteredStudents.forEach((student) => {
    student.problemKeys.forEach((key) => {
      const lower = key.toLowerCase();
      aggregateKeyErrors[lower] = (aggregateKeyErrors[lower] || 0) + 1;
    });
  });

  // Calculate highest error frequency for normalizing heatmap color
  const maxErrors = Math.max(1, ...Object.values(aggregateKeyErrors));

  // Handle teacher broadcast notice
  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNotice.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setCustomNotice('');
    }, 3000);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'ID,Nama Siswa,Kelas,WPM Rata-rata,Akurasi %,Level Tertinggi,Bintang,Tuts Sulit\n';
    const rows = filteredStudents
      .map(
        (s) =>
          `"${s.id}","${s.name}","${s.schoolClass}",${s.avgWpm},${s.avgAccuracy},"${s.currentLevel}",${s.stars},"${s.problemKeys.join(' ')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Ketikan_${selectedClass.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Dasbor Analisis Performa Guru</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Real-time Live
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pantau progres kecepatan, kelemahan jari, dan akurasi seluruh siswa dalam satu layar terpusat.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onLaunchClassRace()}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-amber-300" /> Buka Balapan Kelas Langsung
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition border border-slate-700 flex items-center gap-1.5"
            title="Unduh Data Nilai Spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Unduh CSV
          </button>
        </div>
      </div>

      {/* Class Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {classesList.map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedClass === cls
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama siswa..."
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Real-time KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-white">{avgWpm} WPM</div>
            <div className="text-[11px] font-semibold text-slate-400">Rata-rata Kecepatan</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-emerald-400">{avgAccuracy}%</div>
            <div className="text-[11px] font-semibold text-slate-400">Rata-rata Akurasi</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-sky-400">{onlineCount} / {totalStudents}</div>
            <div className="text-[11px] font-semibold text-slate-400">Siswa Sedang Aktif</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-amber-400">18.4 Jam</div>
            <div className="text-[11px] font-semibold text-slate-400">Total Durasi Latihan</div>
          </div>
        </div>
      </div>

      {/* DIAGNOSTIC SECTION: Keyboard Heatmap & Finger Weakness Analysis */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              Peta Panas Tuts Lemah & Diagnosis Jari Siswa
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Warna merah mengindikasikan tuts yang paling sering salah ditekan oleh siswa dalam kelas.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Tingkat Kesalahan:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">Rendah (0)</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 text-[10px]">Sedang</span>
            <span className="px-2 py-0.5 rounded bg-rose-600/80 text-white font-bold text-[10px]">Tinggi</span>
          </div>
        </div>

        {/* Heatmap Mini Keyboard */}
        <div className="flex flex-col gap-1.5 items-center select-none font-mono-typing my-2">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1 justify-center w-full">
              {row.map((item) => {
                const keyLower = item.key.toLowerCase();
                const errCount = aggregateKeyErrors[keyLower] || 0;
                const ratio = errCount / maxErrors;

                let heatColor = 'bg-slate-950/80 text-slate-400 border-slate-800';
                if (errCount > 0) {
                  if (ratio > 0.6) {
                    heatColor = 'bg-rose-600 text-white font-bold border-rose-400 shadow-md shadow-rose-600/40';
                  } else if (ratio > 0.3) {
                    heatColor = 'bg-amber-600/60 text-white font-semibold border-amber-500';
                  } else {
                    heatColor = 'bg-amber-500/20 text-amber-200 border-amber-500/40';
                  }
                }

                const widthClass = item.width || 'w-8 sm:w-10';

                return (
                  <div
                    key={item.key}
                    className={`h-8 sm:h-9 ${widthClass} rounded-lg text-xs flex flex-col items-center justify-center border transition relative ${heatColor}`}
                    title={`Huruf ${item.key.toUpperCase()} - ${errCount} kali keliru`}
                  >
                    <span>{item.display}</span>
                    {errCount > 0 && (
                      <span className="absolute -top-1.5 -right-1 text-[9px] font-mono px-1 rounded-full bg-rose-500 text-white font-black leading-tight">
                        {errCount}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Diagnostic Insights for Teacher */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <span className="font-bold text-slate-200 block mb-0.5">Rekomendasi Latihan Guru:</span>
              <p className="text-slate-400 leading-relaxed">
                Sebagian besar siswa mengalami kendala pada tuts{' '}
                <strong className="text-rose-400 font-mono">P, B, Q, dan tanda baca</strong>. Disarankan
                menugaskan pengulangan Level 2 (Baris Atas) dan Level 3 (Baris Bawah) dengan fokus jangkauan
                jari kelingking kiri dan telunjuk kanan.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 flex items-start gap-3">
            <span className="text-xl">🎯</span>
            <div>
              <span className="font-bold text-slate-200 block mb-0.5">Distribusi Jari Lemah:</span>
              <p className="text-slate-400 leading-relaxed">
                68% kesalahan terjadi pada <strong className="text-amber-300">Kelingking Kanan</strong> (huruf P, Enter, titik koma)
                karena jari sering melompat tanpa bertumpu pada tombol beranda (Home Row).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Student Roster Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Daftar Siswa & Status Real-time ({filteredStudents.length} Siswa)
          </h3>
          <span className="text-xs text-slate-400">Klik "Lihat Rapor" untuk cetak lembar progres siswa</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Siswa</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Kecepatan</th>
                <th className="py-3 px-3">Akurasi</th>
                <th className="py-3 px-3">Level Progres</th>
                <th className="py-3 px-3">Tuts Sulit</th>
                <th className="py-3 px-4 text-right">Aksi Guru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <AvatarDisplay customization={student.avatar} size="xs" showAura={false} />
                      <div>
                        <div className="font-bold text-white text-sm">{student.name}</div>
                        <div className="text-[11px] text-slate-400">{student.schoolClass}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    {student.status === 'typing' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Sedang Mengetik
                      </span>
                    ) : student.status === 'online' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Siap / Online
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400">
                        Selesai Latihan
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-mono font-bold text-indigo-400 text-sm">{student.avgWpm}</span>
                    <span className="text-[10px] text-slate-500 ml-1">WPM</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`font-mono font-bold text-sm ${student.avgAccuracy >= 93 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {student.avgAccuracy}%
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[11px] font-semibold border border-slate-700">
                        {student.currentLevel}
                      </span>
                      <span className="text-amber-400 text-[11px]">⭐ {student.stars}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex gap-1 flex-wrap">
                      {student.problemKeys.slice(0, 3).map((k) => (
                        <span
                          key={k}
                          className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold text-[10px] border border-rose-500/30"
                        >
                          {k.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onOpenReportModal(student)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-indigo-300 font-semibold transition border border-slate-700 flex items-center gap-1.5 ml-auto text-xs"
                    >
                      <Printer className="w-3.5 h-3.5" /> Lihat Rapor
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Classroom Broadcast Notice Form */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5">
        <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <Send className="w-4 h-4 text-indigo-400" />
          Kirim Pengumuman / Instruksi Latihan ke Layar Siswa
        </h4>
        <p className="text-xs text-slate-400 mb-3">
          Pesan akan muncul di layar seluruh murid kelas secara instan.
        </p>

        <form onSubmit={handleBroadcast} className="flex gap-2">
          <input
            type="text"
            value={customNotice}
            onChange={(e) => setCustomNotice(e.target.value)}
            placeholder="Contoh: Anak-anak, silakan selesaikan Level 4 dengan akurasi minimal 92% sebelum jam 10!"
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
          >
            <Send className="w-3.5 h-3.5" /> Kirim Instruksi
          </button>
        </form>

        {broadcastSent && (
          <div className="mt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" /> Instruksi berhasil disiarkan ke 18 murid kelas!
          </div>
        )}
      </div>
    </div>
  );
};
