"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  AgentDefinition,
  AGENT_ROSTER,
} from "@/lib/agentic/roster";
import {
  Sparkles,
  Play,
  RotateCw,
  Volume2,
  VolumeX,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  Coffee,
  Server,
  Layers,
  ArrowRight,
  Maximize2,
  Minimize2,
  Terminal,
  Copy,
  Check,
  Send,
  Building2,
  X,
  Code2,
  Cpu,
  Package,
  ShieldCheck,
  Target,
  FileText,
  Clock,
  Compass,
  CheckSquare,
  Palette,
  Truck,
  Scale,
  RefreshCw,
  Activity,
  Sliders,
  Lock,
  Database,
  ShieldAlert,
  Tag,
  Bot,
  Radio,
  Filter,
  Eye,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// =========================================================================
// RETRO MECHA AUDIO SYNTHESIZER (Pure Web Audio API, Zero Lag)
// =========================================================================
function playRetroSound(type: "click" | "success" | "work" | "mission" | "bubble") {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "bubble") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.07);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.07);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === "work") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.setValueAtTime(480, now + 0.06);
      osc.frequency.setValueAtTime(640, now + 0.12);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === "success" || type === "mission") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      osc.frequency.setValueAtTime(1046.5, now + 0.24);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch {}
}

// =========================================================================
// ROBOT METADATA PER AGENT (ROBOT CODE, VISOR, SPEC)
// =========================================================================
export interface RobotMetadata {
  unitCode: string;
  robotName: string;
  visorColor: "cyan" | "amber" | "yellow" | "emerald" | "purple";
  chassisGradient: string;
  glowColor: string;
  batteryLevel: number;
  coreFrequency: string;
  idleThought: string;
  workThought: string;
  sectorId: "engineering" | "sales" | "warehouse" | "finance" | "datacenter";
  sectorLabel: string;
}

export interface TaskItem {
  id: string;
  agentId: string;
  unitCode: string;
  robotName: string;
  room: string;
  prompt: string;
  status: "running" | "completed" | "failed";
  startTime: string;
  completedTime?: string;
  durationMs?: number;
  output?: string;
  sectorId?: string;
}

export interface TaskToastNotification {
  id: string;
  type: "start" | "success" | "error";
  title: string;
  message: string;
  unitCode: string;
  timestamp: string;
}

const ROBOT_UNITS: Record<string, RobotMetadata> = {
  // Sector 1: Software Engineering & Neural Core
  "code-builder": {
    unitCode: "DEV-01",
    robotName: "CyberCoder-X",
    visorColor: "cyan",
    chassisGradient: "from-cyan-500/20 via-slate-900 to-blue-950/40",
    glowColor: "#06b6d4",
    batteryLevel: 98,
    coreFrequency: "4.8 GHz",
    idleThought: "[DEV-01] Standby kompilasi Next.js 16...",
    workThought: "⚡ [DEV-01] Menulis kode handler API & skema Prisma riil...",
    sectorId: "engineering",
    sectorLabel: "Neural Dev & Cloud Pod",
  },
  "pm-architect": {
    unitCode: "PRD-02",
    robotName: "ArchBot-Prime",
    visorColor: "cyan",
    chassisGradient: "from-blue-500/20 via-slate-900 to-indigo-950/40",
    glowColor: "#3b82f6",
    batteryLevel: 100,
    coreFrequency: "4.5 GHz",
    idleThought: "[PRD-02] Menyelaraskan backlog fitur B2B...",
    workThought: "⚡ [PRD-02] Menyusun PRD teknis berdasarkan data riil...",
    sectorId: "engineering",
    sectorLabel: "Neural Dev & Cloud Pod",
  },
  "qa-tester": {
    unitCode: "QA-03",
    robotName: "TestGuard-Sentinel",
    visorColor: "cyan",
    chassisGradient: "from-sky-500/20 via-slate-900 to-cyan-950/40",
    glowColor: "#0ea5e9",
    batteryLevel: 95,
    coreFrequency: "4.2 GHz",
    idleThought: "[QA-03] Sensor edge case database standby...",
    workThought: "⚡ [QA-03] Menjalankan test regression suite Jest...",
    sectorId: "engineering",
    sectorLabel: "Neural Dev & Cloud Pod",
  },
  "ui-ux-designer": {
    unitCode: "UI-04",
    robotName: "DesignSynth-v2",
    visorColor: "cyan",
    chassisGradient: "from-teal-500/20 via-slate-900 to-blue-950/40",
    glowColor: "#14b8a6",
    batteryLevel: 97,
    coreFrequency: "4.0 GHz",
    idleThought: "[UI-04] Audit token kenyamanan antarmuka...",
    workThought: "⚡ [UI-04] Mengoptimasi layout Tailwind responsive...",
    sectorId: "engineering",
    sectorLabel: "Neural Dev & Cloud Pod",
  },
  "devops-optimizer": {
    unitCode: "SRE-05",
    robotName: "CloudNexus-SRE",
    visorColor: "cyan",
    chassisGradient: "from-indigo-500/20 via-slate-900 to-slate-950",
    glowColor: "#6366f1",
    batteryLevel: 99,
    coreFrequency: "5.0 GHz",
    idleThought: "[SRE-05] 9Router latency stabil 210ms...",
    workThought: "⚡ [SRE-05] Menganalisis indeks query PostgreSQL...",
    sectorId: "engineering",
    sectorLabel: "Neural Dev & Cloud Pod",
  },

  // Sector 2: B2B Growth & Revenue Radar
  "lead-prospector": {
    unitCode: "LEAD-06",
    robotName: "RadarHunter-Alpha",
    visorColor: "amber",
    chassisGradient: "from-amber-500/20 via-slate-900 to-orange-950/40",
    glowColor: "#f59e0b",
    batteryLevel: 96,
    coreFrequency: "4.6 GHz",
    idleThought: "[LEAD-06] Radar manufaktur Karawang online...",
    workThought: "⚡ [LEAD-06] Memetakan 3 target pabrik B2B berpotensi...",
    sectorId: "sales",
    sectorLabel: "Revenue Radar Pod",
  },
  "quotation-drafter": {
    unitCode: "QUOTE-07",
    robotName: "PriceBot-Pro",
    visorColor: "amber",
    chassisGradient: "from-yellow-500/20 via-slate-900 to-amber-950/40",
    glowColor: "#eab308",
    batteryLevel: 98,
    coreFrequency: "4.4 GHz",
    idleThought: "[QUOTE-07] Algoritma kalkulasi margin standby...",
    workThought: "⚡ [QUOTE-07] Menyusun penawaran resmi HPP margin 25%...",
    sectorId: "sales",
    sectorLabel: "Revenue Radar Pod",
  },
  "whatsapp-closer": {
    unitCode: "CLOSE-08",
    robotName: "WhatsAppCloser-AI",
    visorColor: "amber",
    chassisGradient: "from-orange-500/20 via-slate-900 to-red-950/40",
    glowColor: "#f97316",
    batteryLevel: 100,
    coreFrequency: "4.7 GHz",
    idleThought: "[CLOSE-08] Bot closing otomatis standby...",
    workThought: "⚡ [CLOSE-08] Mengunci transaksi majun & kesepakatan ongkir...",
    sectorId: "sales",
    sectorLabel: "Revenue Radar Pod",
  },

  // Sector 3: Supply Chain & Sorting Bay
  "sourcing-scout": {
    unitCode: "SCOUT-09",
    robotName: "FiberScout-Bot",
    visorColor: "yellow",
    chassisGradient: "from-amber-500/20 via-slate-900 to-yellow-950/40",
    glowColor: "#eab308",
    batteryLevel: 94,
    coreFrequency: "4.1 GHz",
    idleThought: "[SCOUT-09] Evaluasi limbah kain Majalaya...",
    workThought: "⚡ [SCOUT-09] Menghitung kelayakan armada jemput...",
    sectorId: "warehouse",
    sectorLabel: "Logistics & Sorting Bay",
  },
  "bale-scorer": {
    unitCode: "BALE-10",
    robotName: "BaleEval-Mech",
    visorColor: "yellow",
    chassisGradient: "from-yellow-500/20 via-slate-900 to-stone-900",
    glowColor: "#ca8a04",
    batteryLevel: 97,
    coreFrequency: "4.3 GHz",
    idleThought: "[BALE-10] Evaluasi supplier Grade A: 94...",
    workThought: "⚡ [BALE-10] Membandingkan tren fluktuasi harga bal...",
    sectorId: "warehouse",
    sectorLabel: "Logistics & Sorting Bay",
  },
  "circular-matcher": {
    unitCode: "CIRC-11",
    robotName: "EcoRecycle-Bot",
    visorColor: "yellow",
    chassisGradient: "from-lime-500/20 via-slate-900 to-emerald-950/40",
    glowColor: "#84cc16",
    batteryLevel: 95,
    coreFrequency: "3.9 GHz",
    idleThought: "[CIRC-11] Pencocokan perca non-majun aktif...",
    workThought: "⚡ [CIRC-11] Menghitung valorisasi sisa sortir...",
    sectorId: "warehouse",
    sectorLabel: "Logistics & Sorting Bay",
  },
  "yield-optimizer": {
    unitCode: "SORT-12",
    robotName: "SortMaster-Yield",
    visorColor: "yellow",
    chassisGradient: "from-yellow-600/20 via-slate-900 to-amber-950",
    glowColor: "#d97706",
    batteryLevel: 98,
    coreFrequency: "4.5 GHz",
    idleThought: "[SORT-12] Rendemen sortir majun putih: 44.5%...",
    workThought: "⚡ [SORT-12] Mengaudit persentase susut sampah riil...",
    sectorId: "warehouse",
    sectorLabel: "Logistics & Sorting Bay",
  },
  "inventory-forecaster": {
    unitCode: "STOCK-13",
    robotName: "StockOracle-Bot",
    visorColor: "yellow",
    chassisGradient: "from-amber-600/20 via-slate-900 to-stone-900",
    glowColor: "#f59e0b",
    batteryLevel: 96,
    coreFrequency: "4.2 GHz",
    idleThought: "[STOCK-13] Stok majun putih aman 9 hari...",
    workThought: "⚡ [STOCK-13] Menghitung re-order buffer stok bal...",
    sectorId: "warehouse",
    sectorLabel: "Logistics & Sorting Bay",
  },
  "qc-detector": {
    unitCode: "QC-14",
    robotName: "DefectHunter-QC",
    visorColor: "yellow",
    chassisGradient: "from-rose-500/20 via-slate-900 to-amber-950/40",
    glowColor: "#f43f5e",
    batteryLevel: 99,
    coreFrequency: "4.6 GHz",
    idleThought: "[QC-14] Timbangan bal digital terkalibrasi...",
    workThought: "⚡ [QC-14] Mendeteksi anomali susut di atas batas...",
    sectorId: "warehouse",
    sectorLabel: "Logistics & Sorting Bay",
  },

  // Sector 4: Treasury & Margin Sentinel Vault
  "margin-guard": {
    unitCode: "FIN-15",
    robotName: "MarginGuard-Sentinel",
    visorColor: "emerald",
    chassisGradient: "from-emerald-500/20 via-slate-900 to-teal-950/40",
    glowColor: "#10b981",
    batteryLevel: 100,
    coreFrequency: "4.8 GHz",
    idleThought: "[FIN-15] HPP riil Rp 11.200/kg terverifikasi...",
    workThought: "⚡ [FIN-15] Menghitung floor price penawaran partai...",
    sectorId: "finance",
    sectorLabel: "Treasury Vault Pod",
  },
  "debt-collector": {
    unitCode: "DEBT-16",
    robotName: "DebtReclaimer-AI",
    visorColor: "emerald",
    chassisGradient: "from-teal-500/20 via-slate-900 to-green-950/40",
    glowColor: "#14b8a6",
    batteryLevel: 96,
    coreFrequency: "4.3 GHz",
    idleThought: "[DEBT-16] Memantau invoice piutang 14 hari...",
    workThought: "⚡ [DEBT-16] Menyusun draf penagihan resmi via WA...",
    sectorId: "finance",
    sectorLabel: "Treasury Vault Pod",
  },

  // Sector 5: Cybernetic Core & Systems
  "query-builder": {
    unitCode: "SQL-17",
    robotName: "QueryForge-SQL",
    visorColor: "purple",
    chassisGradient: "from-purple-500/20 via-slate-900 to-indigo-950/40",
    glowColor: "#a855f7",
    batteryLevel: 98,
    coreFrequency: "5.2 GHz",
    idleThought: "[SQL-17] Engine Text-to-SQL analitik online...",
    workThought: "⚡ [SQL-17] Merender pivot analitik transaksi...",
    sectorId: "datacenter",
    sectorLabel: "Core Systems Pod",
  },
  "db-auditor": {
    unitCode: "AUDIT-18",
    robotName: "DatabaseHealer-Bot",
    visorColor: "purple",
    chassisGradient: "from-violet-500/20 via-slate-900 to-purple-950/40",
    glowColor: "#8b5cf6",
    batteryLevel: 97,
    coreFrequency: "4.9 GHz",
    idleThought: "[AUDIT-18] Memeriksa integritas relasi foreign key...",
    workThought: "⚡ [AUDIT-18] Memindai stok minus & duplikasi database...",
    sectorId: "datacenter",
    sectorLabel: "Core Systems Pod",
  },
  "rule-configurator": {
    unitCode: "RULE-19",
    robotName: "RuleEngine-Core",
    visorColor: "purple",
    chassisGradient: "from-slate-500/20 via-slate-900 to-purple-950/40",
    glowColor: "#94a3b8",
    batteryLevel: 100,
    coreFrequency: "4.4 GHz",
    idleThought: "[RULE-19] Toleransi susut terkunci 12%...",
    workThought: "⚡ [RULE-19] Memperbarui parameter margin aman...",
    sectorId: "datacenter",
    sectorLabel: "Core Systems Pod",
  },
  "audit-watchdog": {
    unitCode: "SEC-20",
    robotName: "CoreSecurity-Watchdog",
    visorColor: "purple",
    chassisGradient: "from-red-500/20 via-slate-900 to-slate-950",
    glowColor: "#ef4444",
    batteryLevel: 99,
    coreFrequency: "5.1 GHz",
    idleThought: "[SEC-20] Jejak audit LLM terenkripsi...",
    workThought: "⚡ [SEC-20] Mengaudit latensi & integritas sistem...",
    sectorId: "datacenter",
    sectorLabel: "Core Systems Pod",
  },
  "erp-orchestrator": {
    unitCode: "ORCH-00",
    robotName: "CommandPrime-Orchestrator",
    visorColor: "purple",
    chassisGradient: "from-purple-500/20 via-slate-900 to-indigo-950/40",
    glowColor: "#c084fc",
    batteryLevel: 100,
    coreFrequency: "5.5 GHz",
    idleThought: "[ORCH-00] Koordinasi alur multi-agen aktif...",
    workThought: "⚡ [ORCH-00] Mendelegasikan tugas lintas sektor...",
    sectorId: "datacenter",
    sectorLabel: "Core Systems Pod",
  },

  // Sector 6: Creative Media Studio & Viral Broadcasting
  "visual-prompt-artist": {
    unitCode: "ART-01",
    robotName: "FluxImage-Bot",
    visorColor: "cyan",
    chassisGradient: "from-fuchsia-500/20 via-slate-900 to-purple-950/40",
    glowColor: "#d946ef",
    batteryLevel: 98,
    coreFrequency: "4.8 GHz",
    idleThought: "[ART-01] Generator foto fisik Flux standby...",
    workThought: "⚡ [ART-01] Merender berkas foto JPG ke server publik...",
    sectorId: "marketing",
    sectorLabel: "Media Sosial & Konten",
  },
  "reels-scriptwriter": {
    unitCode: "VID-02",
    robotName: "ReelsScript-Master",
    visorColor: "amber",
    chassisGradient: "from-amber-500/20 via-slate-900 to-rose-950/40",
    glowColor: "#f59e0b",
    batteryLevel: 96,
    coreFrequency: "4.6 GHz",
    idleThought: "[VID-02] Menyiapkan hook 3 detik video TikTok...",
    workThought: "⚡ [VID-02] Menulis naskah demo uji serap oli mesin...",
    sectorId: "marketing",
    sectorLabel: "Media Sosial & Konten",
  },
  "sosmed-analytics-scout": {
    unitCode: "STAT-03",
    robotName: "MetricScout-Sosmed",
    visorColor: "emerald",
    chassisGradient: "from-emerald-500/20 via-slate-900 to-teal-950/40",
    glowColor: "#10b981",
    batteryLevel: 97,
    coreFrequency: "4.7 GHz",
    idleThought: "[STAT-03] Memantau rasio konversi klik ke WhatsApp CS...",
    workThought: "⚡ [STAT-03] Menghitung jam tayang optimal kawasan industri...",
    sectorId: "marketing",
    sectorLabel: "Media Sosial & Konten",
  },
  "editorial-planner": {
    unitCode: "PLAN-04",
    robotName: "CalendarMatrix-Bot",
    visorColor: "cyan",
    chassisGradient: "from-indigo-500/20 via-slate-900 to-blue-950/40",
    glowColor: "#6366f1",
    batteryLevel: 99,
    coreFrequency: "4.5 GHz",
    idleThought: "[PLAN-04] Matriks editorial 4 pilar 30 hari siap...",
    workThought: "⚡ [PLAN-04] Menyusun jadwal kampanye timbangan jujur...",
    sectorId: "marketing",
    sectorLabel: "Media Sosial & Konten",
  },
  "caption-copywriter": {
    unitCode: "COPY-05",
    robotName: "AidaCopy-Writer",
    visorColor: "cyan",
    chassisGradient: "from-blue-500/20 via-slate-900 to-indigo-950/40",
    glowColor: "#3b82f6",
    batteryLevel: 98,
    coreFrequency: "4.4 GHz",
    idleThought: "[COPY-05] Formula headline PAS & AIDA terkalibrasi...",
    workThought: "⚡ [COPY-05] Meriset 25 hashtag tertarget kawasan industri...",
    sectorId: "marketing",
    sectorLabel: "Media Sosial & Konten",
  },
  "community-closer": {
    unitCode: "LEAD-06",
    robotName: "DirectCloser-DM",
    visorColor: "cyan",
    chassisGradient: "from-cyan-500/20 via-slate-900 to-emerald-950/40",
    glowColor: "#06b6d4",
    batteryLevel: 100,
    coreFrequency: "4.9 GHz",
    idleThought: "[LEAD-06] Radar DM & komentar Instagram siaga...",
    workThought: "⚡ [LEAD-06] Memfilter prospek pembeli tonase ke WhatsApp...",
    sectorId: "marketing",
    sectorLabel: "Media Sosial & Konten",
  },
  "trend-jacker": {
    unitCode: "TREND-07",
    robotName: "AudioTrend-Jacker",
    visorColor: "amber",
    chassisGradient: "from-orange-500/20 via-slate-900 to-yellow-950/40",
    glowColor: "#f97316",
    batteryLevel: 95,
    coreFrequency: "4.3 GHz",
    idleThought: "[TREND-07] Scanning audio viral TikTok & meme bengkel...",
    workThought: "⚡ [TREND-07] Mengadaptasi format humor kerja gudang...",
    sectorId: "marketing",
    sectorLabel: "Media Sosial & Konten",
  },
  "b2b-linkedin-voice": {
    unitCode: "LINK-08",
    robotName: "LinkedInVoice-B2B",
    visorColor: "cyan",
    chassisGradient: "from-sky-500/20 via-slate-900 to-blue-950/40",
    glowColor: "#0284c7",
    batteryLevel: 98,
    coreFrequency: "4.7 GHz",
    idleThought: "[LINK-08] Draf artikel ekonomi sirkular ESG standby...",
    workThought: "⚡ [LINK-08] Menulis artikel opini purchasing manufaktur...",
    sectorId: "marketing",
    sectorLabel: "Media Sosial & Konten",
  },
  "kol-influencer-scout": {
    unitCode: "KOL-09",
    robotName: "CreatorScout-Pro",
    visorColor: "emerald",
    chassisGradient: "from-teal-500/20 via-slate-900 to-cyan-950/40",
    glowColor: "#14b8a6",
    batteryLevel: 97,
    coreFrequency: "4.4 GHz",
    idleThought: "[KOL-09] Menjaring kreator bengkel bubut & otomotif...",
    workThought: "⚡ [KOL-09] Menyusun surat penawaran barter sampel majun...",
    sectorId: "marketing",
    sectorLabel: "Media Sosial & Konten",
  },
  "brand-reputation-guard": {
    unitCode: "GUARD-10",
    robotName: "SentimenGuard-Net",
    visorColor: "purple",
    chassisGradient: "from-rose-500/20 via-slate-900 to-pink-950/40",
    glowColor: "#f43f5e",
    batteryLevel: 99,
    coreFrequency: "5.0 GHz",
    idleThought: "[GUARD-10] Sentinel sentimen publik mendengarkan...",
    workThought: "⚡ [GUARD-10] Menganalisis respon ulasan pembeli kain bal...",
    sectorId: "marketing",
    sectorLabel: "Media Sosial & Konten",
  },
};

// Modern Cyber Pod Sectors
const SECTOR_PODS = [
  {
    id: "engineering",
    name: "SECTOR A: Neural Dev & Cloud Lab",
    shortName: "Software Lab",
    badge: "5 UNIT ROBOT",
    themeColor: "cyan",
    accentBorder: "border-cyan-500/40 hover:border-cyan-400",
    accentGlow: "shadow-[0_0_40px_rgba(6,182,212,0.12)]",
    bgGradient: "from-cyan-950/20 via-slate-950 to-slate-900/90",
    tagline: "Arsitektur Fullstack, QA Automation, DevOps SRE & UI/UX",
  },
  {
    id: "sales",
    name: "SECTOR B: Commercial War Room & Revenue Radar",
    shortName: "Sales War Room",
    badge: "3 UNIT ROBOT",
    themeColor: "amber",
    accentBorder: "border-amber-500/40 hover:border-amber-400",
    accentGlow: "shadow-[0_0_40px_rgba(245,158,11,0.12)]",
    bgGradient: "from-amber-950/20 via-slate-950 to-slate-900/90",
    tagline: "Intelijen Prospek Pabrik Karawang, Margin HPP & WA Closing",
  },
  {
    id: "warehouse",
    name: "SECTOR C: Robotic Sorting & Logistics Bay",
    shortName: "Gudang & Sortir",
    badge: "6 UNIT ROBOT",
    themeColor: "yellow",
    accentBorder: "border-yellow-500/40 hover:border-yellow-400",
    accentGlow: "shadow-[0_0_40px_rgba(234,179,8,0.12)]",
    bgGradient: "from-yellow-950/20 via-slate-950 to-slate-900/90",
    tagline: "Sourcing Konveksi, Rendemen Bal, QC & Prediksi Re-Stock",
  },
  {
    id: "finance",
    name: "SECTOR D: Treasury & Capital Risk Vault",
    shortName: "Finance Vault",
    badge: "2 UNIT ROBOT",
    themeColor: "emerald",
    accentBorder: "border-emerald-500/40 hover:border-emerald-400",
    accentGlow: "shadow-[0_0_40px_rgba(16,185,129,0.12)]",
    bgGradient: "from-emerald-950/20 via-slate-950 to-slate-900/90",
    tagline: "Margin Guard Floor Price & Pengawasan Piutang Tempo (AR/AP)",
  },
  {
    id: "datacenter",
    name: "SECTOR E: Core Systems & Security Citadel",
    shortName: "Data Center",
    badge: "4 UNIT ROBOT",
    themeColor: "purple",
    accentBorder: "border-purple-500/40 hover:border-purple-400",
    accentGlow: "shadow-[0_0_40px_rgba(168,85,247,0.12)]",
    bgGradient: "from-purple-950/20 via-slate-950 to-slate-900/90",
    tagline: "Text-to-SQL Query, Integritas Database, Config & Audit Trail",
  },
  {
    id: "marketing",
    name: "SECTOR F: Creative Media Studio & Viral Broadcasting",
    shortName: "Media Sosial & Konten",
    badge: "10 UNIT ROBOT",
    themeColor: "fuchsia",
    accentBorder: "border-fuchsia-500/40 hover:border-fuchsia-400",
    accentGlow: "shadow-[0_0_40px_rgba(217,70,239,0.12)]",
    bgGradient: "from-fuchsia-950/20 via-slate-950 to-slate-900/90",
    tagline: "Prompt AI Visual, Naskah Reels, Copywriting, Trend Jacker & Sentimen Medsos",
  },
];

interface VirtualOfficeMapProps {
  onSelectAgentForConsole?: (agentId: string) => void;
  onRefreshStats?: () => void;
  onNavigateToFiles?: () => void;
  onShiftStatusChange?: (isRunning: boolean, remainingSeconds: number) => void;
  nineRouterOnline?: boolean;
  activeModel?: string;
}

export default function VirtualOfficeMap({
  onSelectAgentForConsole,
  onRefreshStats,
  onNavigateToFiles,
  onShiftStatusChange,
  nineRouterOnline = true,
  activeModel = "ag/gemini-3.8-flash-high",
}: VirtualOfficeMapProps) {
  // Navigation & Filtering
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>("all");
  const [targetAutomationSector, setTargetAutomationSector] = useState<string>("engineering");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active Working State
  const [activeWorkingAgentId, setActiveWorkingAgentId] = useState<string | null>(null);
  const [agentLiveThoughts, setAgentLiveThoughts] = useState<Record<string, string>>({});
  const [agentStatuses, setAgentStatuses] = useState<Record<string, "idle" | "working" | "done" | "sync">>({});

  // Workstation Inspector Modal
  const [workstationAgent, setWorkstationAgent] = useState<AgentDefinition | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isExecutingTask, setIsExecutingTask] = useState(false);
  const [taskOutput, setTaskOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [savingFile, setSavingFile] = useState(false);
  const [lastSavedFilePath, setLastSavedFilePath] = useState<string | null>(null);

  // Real Project Artifact Saver (Smart Automatic & Manual Persistence)
  const handleSaveOutputToFile = async (
    outputContent: string,
    agentName?: string,
    unitCode?: string,
    promptText?: string,
    isSilent = false,
    isExplicitBossOrder = false
  ) => {
    if (!outputContent || outputContent.trim().length === 0) return null;

    // BOSS GATE PROTOCOL: Dilarang membuat berkas fisik tanpa instruksi eksplisit dari atasan (User)
    const hasFileKeyword = /buatkan\s+(file|berkas|komponen|dokumen|skrip|halaman|ui)|simpan\s+(ke\s+)?(file|berkas)|tulis\s+(ke\s+)?(file|berkas)|export\s+(file|berkas)|save\s+to\s+file/i.test(promptText || "");
    if (!isExplicitBossOrder && !hasFileKeyword) {
      // Perintah bersifat analisis murni / monitoring, jangan mengotori folder disk
      return null;
    }

    try {
      setSavingFile(true);
      if (!isSilent) triggerSound("click");

      // Clean prompt into a PascalCase component/file slug
      const makeSlugFromPrompt = (prompt: string, fallback: string) => {
        const cleaned = prompt
          .replace(/^(buatkan|tambahkan|bikin|tolong|buat|draft|buat draf|desain|analisis|cek|verifikasi|hitung|refactor)\s+/i, "")
          .trim();

        if (/menu.*admin|admin.*menu/i.test(cleaned)) return "AdminNavigationMenu";
        if (/sidebar/i.test(cleaned)) return "SidebarNavigation";
        if (/modal.*input|input.*timbang/i.test(cleaned)) return "WeighingInputModal";
        if (/kalkulasi.*hpp|hitung.*hpp/i.test(cleaned)) return "HppCalculationService";
        if (/harga.*bal|price.*bal/i.test(cleaned)) return "BalePriceConfig";
        if (/surat.*jalan/i.test(cleaned)) return "SuratJalanDigital";
        if (/valuasi.*stok/i.test(cleaned)) return "StockValuationCard";

        const words = cleaned
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 3)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join("");
        return words.replace(/[^A-Za-z0-9_]/g, "") || fallback;
      };

      const promptSlug = promptText ? makeSlugFromPrompt(promptText, "FeatureArtifact") : "Artifact";

      // 1. Detect comment in code: // [filename.ext]
      const fileCommentMatch = outputContent.match(/\/\/\s*(?:components|src|lib)?\/?([A-Za-z0-9_\-]+\.(?:tsx|jsx|ts|js|json|sql|md))/i);

      let fileName = `${unitCode || "BOT"}_Output_${Date.now()}.txt`;
      let category = "components";

      if (
        unitCode === "DEV-01" ||
        unitCode === "UI-04" ||
        unitCode === "QA-03" ||
        outputContent.includes("export function") ||
        outputContent.includes("export default") ||
        outputContent.includes("import React") ||
        outputContent.includes("return (") ||
        outputContent.includes("const ")
      ) {
        if (fileCommentMatch && fileCommentMatch[1]) {
          fileName = fileCommentMatch[1];
        } else {
          const isComponent = outputContent.includes("<") || outputContent.includes("React") || outputContent.includes("return (");
          fileName = isComponent ? `${promptSlug}.tsx` : `${promptSlug}.ts`;
        }
        category = "components";
      } else if (
        unitCode === "SQL-17" ||
        outputContent.includes("```sql") ||
        (outputContent.includes("SELECT ") && outputContent.includes("FROM "))
      ) {
        if (fileCommentMatch && fileCommentMatch[1]) {
          fileName = fileCommentMatch[1];
        } else {
          fileName = `Query_${promptSlug}_${Date.now()}.sql`;
        }
        category = "sql";
      } else if (
        unitCode === "PRD-02" ||
        outputContent.includes("# PRD") ||
        outputContent.includes("### Spesifikasi")
      ) {
        const matchTitle = outputContent.match(/^#+\s*([A-Za-z0-9_\-\s]+)/m);
        const titleSlug = matchTitle ? matchTitle[1].trim().replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30) : promptSlug;
        fileName = `PRD_${titleSlug}.md`;
        category = "docs";
      } else if (
        outputContent.includes("```json") ||
        outputContent.includes("```csv") ||
        unitCode === "QC-13" ||
        unitCode === "MARGIN-14"
      ) {
        const ext = outputContent.includes("```json") ? "json" : "md";
        fileName = `Laporan_${promptSlug}_${Date.now()}.${ext}`;
        category = "reports";
      } else {
        const matchTitle = outputContent.match(/^#+\s*([A-Za-z0-9_\-\s]+)/m);
        const titleSlug = matchTitle ? matchTitle[1].trim().replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30) : promptSlug;
        fileName = `Laporan_${titleSlug}.md`;
        category = "reports";
      }

      const res = await fetch("/api/agentic-ai/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName,
          content: outputContent,
          category,
        }),
      });

      const data = await res.json();
      if (data.success) {
        triggerSound("success");
        setLastSavedFilePath(data.relativePath);
        pushTaskNotification(
          "success",
          "⚡ Berkas Otomatis Tersimpan Fisik!",
          `Tersimpan di ${data.relativePath}`,
          unitCode || "DEV-01"
        );
        if (onRefreshStats) onRefreshStats();
        return data;
      } else {
        if (!isSilent) alert("Gagal menyimpan file: " + (data.error || "Gagal"));
        return null;
      }
    } catch (e: any) {
      if (!isSilent) alert("Error saat menyimpan berkas: " + e.message);
      return null;
    } finally {
      setSavingFile(false);
    }
  };

  // =========================================================================
  // PUSAT KENDALI SHIFT AUTOMASI (UNIFIED COMMAND HUB)
  // =========================================================================
  const [isShiftRunning, setIsShiftRunning] = useState(false);
  const [shiftDurationMinutes, setShiftDurationMinutes] = useState<number>(60); // Default: 1 Jam
  const [shiftRemainingSeconds, setShiftRemainingSeconds] = useState<number>(3600);
  const [shiftTargetSector, setShiftTargetSector] = useState<string>("all"); // 'all' | 'engineering' | 'sales' | 'warehouse' | 'finance' | 'datacenter'
  const [shiftCompletedTasksCount, setShiftCompletedTasksCount] = useState<number>(0);
  const [tickCountdown, setTickCountdown] = useState<number>(15);

  const [officeActivityFeed, setOfficeActivityFeed] = useState<
    { id: string; time: string; unitCode: string; agentName: string; room: string; message: string; isAi: boolean }[]
  >([]);

  // Real Multi-Agent Automation Pipeline Runner
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [pipelineSectorName, setPipelineSectorName] = useState("");
  const [pipelineCurrentStep, setPipelineCurrentStep] = useState(0);
  const [pipelineTotalSteps, setPipelineTotalSteps] = useState(0);
  const [activePipelineOutput, setActivePipelineOutput] = useState<string | null>(null);

  // =========================================================================
  // TASK TRACKING & NOTIFICATION SYSTEM
  // =========================================================================
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState<"all" | "running" | "completed">("all");
  const [selectedDetailTask, setSelectedDetailTask] = useState<TaskItem | null>(null);
  const [floatingToasts, setFloatingToasts] = useState<TaskToastNotification[]>([]);

  // Sound trigger
  const triggerSound = (type: "click" | "success" | "work" | "mission" | "bubble") => {
    if (soundEnabled) playRetroSound(type);
  };

  // Push Floating Mecha Notification Toast
  const pushTaskNotification = (
    type: "start" | "success" | "error",
    title: string,
    message: string,
    unitCode: string
  ) => {
    const notifId = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newNotif: TaskToastNotification = {
      id: notifId,
      type,
      title,
      message,
      unitCode,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    };

    setFloatingToasts((prev) => [newNotif, ...prev.slice(0, 3)]);
    if (type === "start") triggerSound("work");
    else if (type === "success") triggerSound("success");

    setTimeout(() => {
      setFloatingToasts((prev) => prev.filter((n) => n.id !== notifId));
    }, 5500);
  };

  // Fetch Real Tasks directly from PostgreSQL AgentLog
  const fetchRealDatabaseTasks = async () => {
    try {
      setLoadingTasks(true);
      const res = await fetch("/api/agentic-ai/logs?limit=50");
      if (res.ok) {
        const data = await res.json();
        if (data.logs && Array.isArray(data.logs)) {
          const dbTasks: TaskItem[] = data.logs.map((log: any) => {
            const meta = ROBOT_UNITS[log.agentId];
            const date = log.createdAt ? new Date(log.createdAt) : new Date();
            const timeStr = !isNaN(date.getTime())
              ? date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
              : "Baru saja";
            return {
              id: log.id,
              agentId: log.agentId,
              unitCode: meta?.unitCode || "BOT",
              robotName: meta?.robotName || log.agentName || "Robot Agen",
              room: meta?.sectorLabel || log.division || "Pusat Kendali",
              prompt: log.input,
              status:
                log.status === "SUCCESS" || log.status === "completed"
                  ? "completed"
                  : "failed",
              startTime: timeStr,
              completedTime: timeStr,
              durationMs: log.latencyMs || 2500,
              output: log.output,
              sectorId: meta?.sectorId,
            };
          });

          setTasks((prev) => {
            const runningTasks = prev.filter((t) => t.status === "running");
            const existingIds = new Set(runningTasks.map((t) => t.id));
            const newDbTasks = dbTasks.filter((t) => !existingIds.has(t.id));
            const merged = [...runningTasks, ...newDbTasks];
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem("darmin_agent_tasks", JSON.stringify(merged.slice(0, 50)));
              } catch {}
            }
            return merged;
          });
        }
      }
    } catch (e) {
      console.error("Gagal sinkronisasi task dari PostgreSQL:", e);
    } finally {
      setLoadingTasks(false);
    }
  };

  // Clean Task History (Clear both PostgreSQL AgentLog & localStorage)
  const handleClearDatabaseTasks = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus seluruh riwayat task selesai dari database PostgreSQL?")) {
      return;
    }
    try {
      setLoadingTasks(true);
      triggerSound("click");
      const res = await fetch("/api/agentic-ai/logs", { method: "DELETE" });
      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.status === "running"));
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("darmin_agent_tasks");
          } catch {}
        }
        pushTaskNotification("success", "Riwayat Dibersihkan", "Audit task di PostgreSQL berhasil direset.", "HQ-CORE");
        if (onRefreshStats) onRefreshStats();
      }
    } catch (e) {
      console.error("Gagal menghapus riwayat task:", e);
    } finally {
      setLoadingTasks(false);
    }
  };

  // Initialize initial thoughts & demo verified tasks (with PostgreSQL & localStorage sync)
  useEffect(() => {
    const initialThoughts: Record<string, string> = {};
    const initialStatuses: Record<string, "idle" | "working" | "done" | "sync"> = {};
    AGENT_ROSTER.forEach((agent) => {
      const meta = ROBOT_UNITS[agent.id];
      initialThoughts[agent.id] = meta ? meta.idleThought : "Standby online...";
      initialStatuses[agent.id] = "idle";
    });
    setAgentLiveThoughts(initialThoughts);
    setAgentStatuses(initialStatuses);

    // Initial feed
    setOfficeActivityFeed([
      {
        id: "feed-1",
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        unitCode: "HQ-CORE",
        agentName: "Central Matrix",
        room: "Pusat Kendali",
        message: "⚡ Komando Robotik DARMIN aktif. 5 Sektor pod siap menjalankan automasi nyata.",
        isAi: false,
      },
      {
        id: "feed-2",
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        unitCode: "9R-NET",
        agentName: "9Router Proxy",
        room: "Neural Core",
        message: `⚡ Terhubung ke 9Router (${activeModel}). Seluruh task dieksekusi secara otonom tanpa dummy.`,
        isAi: true,
      },
    ]);

    // Restore active shift from localStorage if still running across tab/page switches
    if (typeof window !== "undefined") {
      try {
        const savedShift = localStorage.getItem("darmin_agent_shift_state");
        if (savedShift) {
          const parsed = JSON.parse(savedShift);
          const now = Date.now();
          if (parsed.isShiftRunning && parsed.shiftEndTime > now) {
            const remaining = Math.floor((parsed.shiftEndTime - now) / 1000);
            setIsShiftRunning(true);
            setShiftRemainingSeconds(remaining);
            if (parsed.shiftDurationMinutes) setShiftDurationMinutes(parsed.shiftDurationMinutes);
            if (parsed.shiftTargetSector) setShiftTargetSector(parsed.shiftTargetSector);
            if (parsed.shiftCompletedTasksCount) setShiftCompletedTasksCount(parsed.shiftCompletedTasksCount);
          } else {
            localStorage.removeItem("darmin_agent_shift_state");
          }
        }
      } catch {}

      // Fast restore cached tasks from localStorage for instant 0ms render
      try {
        const savedTasks = localStorage.getItem("darmin_agent_tasks");
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks);
          if (Array.isArray(parsedTasks) && parsedTasks.length > 0) {
            setTasks(parsedTasks);
          }
        }
      } catch {}
    }

    // Immediately fetch all persistent real tasks from PostgreSQL database
    fetchRealDatabaseTasks();
  }, [activeModel]);

  // Sync tasks on opening Task Monitor modal
  useEffect(() => {
    if (isTaskModalOpen) {
      fetchRealDatabaseTasks();
    }
  }, [isTaskModalOpen]);

  // Persist tasks list to localStorage
  useEffect(() => {
    if (tasks.length > 0 && typeof window !== "undefined") {
      try {
        localStorage.setItem("darmin_agent_tasks", JSON.stringify(tasks.slice(0, 50)));
      } catch {}
    }
  }, [tasks]);

  // Notify parent of shift status for live tab indicator safely without infinite loop
  const onShiftStatusChangeRef = useRef(onShiftStatusChange);
  useEffect(() => {
    onShiftStatusChangeRef.current = onShiftStatusChange;
  }, [onShiftStatusChange]);

  const lastNotifiedShiftRef = useRef({ isRunning: false, remainingSeconds: -1 });
  useEffect(() => {
    if (
      lastNotifiedShiftRef.current.isRunning !== isShiftRunning ||
      lastNotifiedShiftRef.current.remainingSeconds !== shiftRemainingSeconds
    ) {
      lastNotifiedShiftRef.current = { isRunning: isShiftRunning, remainingSeconds: shiftRemainingSeconds };
      onShiftStatusChangeRef.current?.(isShiftRunning, shiftRemainingSeconds);
    }
  }, [isShiftRunning, shiftRemainingSeconds]);

  // Open Robot Workstation
  const handleOpenWorkstation = (agent: AgentDefinition) => {
    triggerSound("click");
    setWorkstationAgent(agent);
    setCustomPrompt(agent.samplePrompts[0]);
    setTaskOutput(null);
    setLastSavedFilePath(null);
  };

  // Run Robot Workstation Task (REAL 9ROUTER LLM EXECUTION)
  const handleRunWorkstationTask = async () => {
    if (!workstationAgent) return;
    const robot = ROBOT_UNITS[workstationAgent.id];
    setIsExecutingTask(true);
    setTaskOutput(null);
    setLastSavedFilePath(null);
    triggerSound("work");

    const taskId = `task-${Date.now()}`;
    const startTimeStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const startTimestamp = Date.now();

    // Register active task
    const newTask: TaskItem = {
      id: taskId,
      agentId: workstationAgent.id,
      unitCode: robot?.unitCode || "BOT",
      robotName: robot?.robotName || workstationAgent.name,
      room: workstationAgent.divisionLabel,
      prompt: customPrompt,
      status: "running",
      startTime: startTimeStr,
      sectorId: robot?.sectorId,
    };
    setTasks((prev) => [newTask, ...prev]);

    // Push notification toast
    pushTaskNotification(
      "start",
      `[${robot?.unitCode}] Menjalankan Tugas`,
      customPrompt.slice(0, 60),
      robot?.unitCode || "BOT"
    );

    setActiveWorkingAgentId(workstationAgent.id);
    setAgentStatuses((prev) => ({ ...prev, [workstationAgent.id]: "working" }));
    setAgentLiveThoughts((prev) => ({
      ...prev,
      [workstationAgent.id]: robot?.workThought || "⚡ Memproses instruksi...",
    }));

    try {
      const res = await fetch("/api/agentic-ai/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: workstationAgent.id,
          prompt: customPrompt,
        }),
      });

      const data = await res.json();
      const outputText = data.output || "Tidak ada respon dari 9Router.";
      setTaskOutput(outputText);
      triggerSound("success");

      // OTOMATIS SIMPAN KE FILE FISIK SEKETIKA (AUTO-SAVE REAL FILE)
      try {
        await handleSaveOutputToFile(
          outputText,
          workstationAgent.name,
          robot?.unitCode,
          customPrompt,
          true
        );
      } catch (saveErr) {
        console.error("Gagal auto-save file:", saveErr);
      }

      const durationMs = Date.now() - startTimestamp;
      const completedTimeStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

      // Update task to completed
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: "completed",
                completedTime: completedTimeStr,
                durationMs,
                output: outputText,
              }
            : t
        )
      );

      // Push success notification
      pushTaskNotification(
        "success",
        `✅ [${robot?.unitCode}] Tugas Tuntas`,
        outputText.slice(0, 75) + "...",
        robot?.unitCode || "BOT"
      );

      setAgentStatuses((prev) => ({ ...prev, [workstationAgent.id]: "done" }));

      setOfficeActivityFeed((prev) => [
        {
          id: `task-${Date.now()}`,
          time: completedTimeStr,
          unitCode: robot?.unitCode || "BOT",
          agentName: robot?.robotName || workstationAgent.name,
          room: workstationAgent.divisionLabel,
          message: `Menyelesaikan tugas: "${customPrompt.slice(0, 48)}..."`,
          isAi: true,
        },
        ...prev.slice(0, 24),
      ]);

      if (onRefreshStats) onRefreshStats();
    } catch (err: any) {
      const errMsg = `Error eksekusi: ${err?.message || String(err)}`;
      setTaskOutput(errMsg);

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: "failed",
                completedTime: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
                output: errMsg,
              }
            : t
        )
      );

      pushTaskNotification("error", `❌ [${robot?.unitCode}] Gagal`, err?.message || "Gangguan API", robot?.unitCode || "BOT");
    } finally {
      setIsExecutingTask(false);
      setTimeout(() => {
        setActiveWorkingAgentId(null);
        setAgentStatuses((prev) => ({ ...prev, [workstationAgent.id]: "idle" }));
        setAgentLiveThoughts((prev) => ({
          ...prev,
          [workstationAgent.id]: robot?.idleThought || "Standby.",
        }));
      }, 5000);
    }
  };

  // =========================================================================
  // REAL MULTI-AGENT AUTOMATION PIPELINE (NON-DUMMY, LIVE 9ROUTER + POSTGRESQL)
  // =========================================================================
  const runRealSectorAutomation = async (sectorId: string) => {
    if (isPipelineRunning) return;
    setIsPipelineRunning(true);
    setActivePipelineOutput(null);

    const targetSector = SECTOR_PODS.find((s) => s.id === sectorId) || SECTOR_PODS[0];
    setPipelineSectorName(targetSector.shortName);
    triggerSound("mission");

    // Filter agents for this sector
    const sectorAgents = AGENT_ROSTER.filter((a) => ROBOT_UNITS[a.id]?.sectorId === sectorId);
    setPipelineTotalSteps(sectorAgents.length);
    setPipelineCurrentStep(0);

    pushTaskNotification(
      "start",
      `⚡ Automasi ${targetSector.shortName} Dimulai`,
      `Menjalankan pipeline otonom 9Router untuk ${sectorAgents.length} unit robot sekuensial.`,
      "SWARM"
    );

    setOfficeActivityFeed((prev) => [
      {
        id: `pipe-start-${Date.now()}`,
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        unitCode: "SWARM",
        agentName: `Automasi ${targetSector.shortName}`,
        room: targetSector.shortName,
        message: `⚡ Memulai automasi robotik sekuensial riil di [${targetSector.name}]. ${sectorAgents.length} Robot terhubung ke 9Router.`,
        isAi: true,
      },
      ...prev.slice(0, 24),
    ]);

    // Automatically focus view on this sector
    setSelectedSectorFilter(sectorId);

    let cumulativeContext = "";

    for (let i = 0; i < sectorAgents.length; i++) {
      setPipelineCurrentStep(i + 1);
      const agent = sectorAgents[i];
      const robot = ROBOT_UNITS[agent.id];

      // Build real dynamic business prompt based on previous robot outputs
      let dynamicPrompt = agent.samplePrompts[0];
      if (cumulativeContext) {
        dynamicPrompt = `${agent.samplePrompts[0]}. KONTEKS DARI UNIT SEBELUMNYA: ${cumulativeContext.slice(0, 300)}`;
      }

      const taskId = `pipe-step-${Date.now()}-${i}`;
      const startTimeStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const startTimestamp = Date.now();

      // Register step task
      const newTask: TaskItem = {
        id: taskId,
        agentId: agent.id,
        unitCode: robot?.unitCode || "BOT",
        robotName: robot?.robotName || agent.name,
        room: agent.divisionLabel,
        prompt: dynamicPrompt,
        status: "running",
        startTime: startTimeStr,
        sectorId: robot?.sectorId,
      };
      setTasks((prev) => [newTask, ...prev]);

      pushTaskNotification(
        "start",
        `[${robot?.unitCode}] Langkah ${i + 1}/${sectorAgents.length}`,
        dynamicPrompt.slice(0, 55),
        robot?.unitCode || "BOT"
      );

      setActiveWorkingAgentId(agent.id);
      setAgentStatuses((prev) => ({ ...prev, [agent.id]: "working" }));
      setAgentLiveThoughts((prev) => ({
        ...prev,
        [agent.id]: `⚡ [STEP ${i + 1}/${sectorAgents.length}] Robot ${robot?.unitCode} memproses AI riil...`,
      }));
      triggerSound("work");

      try {
        const res = await fetch("/api/agentic-ai/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentId: agent.id,
            prompt: dynamicPrompt,
          }),
        });

        const data = await res.json();
        const outputSnippet = data.output || "Tugas diselesaikan.";
        cumulativeContext += `\n- [${robot?.unitCode}]: ${outputSnippet.slice(0, 150)}`;
        setActivePipelineOutput(outputSnippet);

        // Auto-save physical file artifact for sector pipeline step
        handleSaveOutputToFile(
          outputSnippet,
          agent.name,
          robot?.unitCode,
          dynamicPrompt,
          true
        ).catch(() => {});

        const durationMs = Date.now() - startTimestamp;
        const completedTimeStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: "completed",
                  completedTime: completedTimeStr,
                  durationMs,
                  output: outputSnippet,
                }
              : t
          )
        );

        pushTaskNotification(
          "success",
          `✅ [${robot?.unitCode}] Selesai (${(durationMs / 1000).toFixed(1)}s)`,
          outputSnippet.slice(0, 70),
          robot?.unitCode || "BOT"
        );

        setOfficeActivityFeed((prev) => [
          {
            id: `step-${Date.now()}-${i}`,
            time: completedTimeStr,
            unitCode: robot?.unitCode || "BOT",
            agentName: robot?.robotName || agent.name,
            room: agent.divisionLabel,
            message: `✅ [${robot?.unitCode}] Selesai via 9Router: "${outputSnippet.slice(0, 60)}..."`,
            isAi: true,
          },
          ...prev.slice(0, 24),
        ]);

        setAgentStatuses((prev) => ({ ...prev, [agent.id]: "done" }));
      } catch (err: any) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: "failed",
                  completedTime: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                  output: `Gagal: ${err?.message || "API Timeout"}`,
                }
              : t
          )
        );
      }

      await new Promise((res) => setTimeout(res, 2200));
      setAgentStatuses((prev) => ({ ...prev, [agent.id]: "idle" }));
      setAgentLiveThoughts((prev) => ({
        ...prev,
        [agent.id]: robot?.idleThought || "Standby.",
      }));
    }

    setActiveWorkingAgentId(null);
    setIsPipelineRunning(false);
    triggerSound("success");

    pushTaskNotification(
      "success",
      `🏆 Automasi Sektor Selesai!`,
      `Seluruh ${sectorAgents.length} unit di ${targetSector.shortName} telah menuntaskan tugas.`,
      "SWARM"
    );

    setOfficeActivityFeed((prev) => [
      {
        id: `pipe-end-${Date.now()}`,
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        unitCode: "SWARM",
        agentName: `Automasi ${targetSector.shortName}`,
        room: targetSector.shortName,
        message: `🏆 Automasi robotik ${targetSector.shortName} SUKSES TUNTAS! Seluruh ${sectorAgents.length} unit telah mengeksekusi deliverable riil.`,
        isAi: true,
      },
      ...prev.slice(0, 24),
    ]);

    if (onRefreshStats) onRefreshStats();
  };

  // Helper Format Jam & Menit
  const formatRemainingTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}j ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}d`;
    }
    return `${m}m ${s.toString().padStart(2, "0")}d`;
  };

  // Mulai Shift Automasi (Start Shift)
  const handleStartShift = () => {
    triggerSound("mission");
    const totalSec = shiftDurationMinutes * 60;
    const endTime = Date.now() + totalSec * 1000;
    setShiftRemainingSeconds(totalSec);
    setShiftCompletedTasksCount(0);
    setIsShiftRunning(true);
    setTickCountdown(3);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "darmin_agent_shift_state",
          JSON.stringify({
            isShiftRunning: true,
            shiftTargetSector,
            shiftDurationMinutes,
            shiftEndTime: endTime,
            shiftCompletedTasksCount: 0,
          })
        );
      } catch {}
    }

    const targetSectorObj = SECTOR_PODS.find((s) => s.id === shiftTargetSector);
    const targetLabel = shiftTargetSector === "all" ? `Seluruh ${AGENT_ROSTER.length} Robot Kantor` : targetSectorObj?.name || "Sektor";

    pushTaskNotification(
      "start",
      "🚀 Shift Automasi Dimulai!",
      `Target: ${targetLabel} • Durasi: ${shiftDurationMinutes >= 60 ? `${shiftDurationMinutes / 60} Jam` : `${shiftDurationMinutes} Menit`}`,
      "HQ-CORE"
    );

    setOfficeActivityFeed((prev) => [
      {
        id: `shift-start-${Date.now()}`,
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        unitCode: "HQ-CORE",
        agentName: "Shift Master",
        room: "Pusat Kendali",
        message: `🚀 Shift automasi terpusat DIMULAI. Target: [${targetLabel}]. Durasi: ${shiftDurationMinutes} menit.`,
        isAi: false,
      },
      ...prev.slice(0, 24),
    ]);
  };

  // Hentikan Shift Automasi (Emergency Stop)
  const handleStopShift = () => {
    triggerSound("click");
    setIsShiftRunning(false);
    setIsPipelineRunning(false);
    setActiveWorkingAgentId(null);

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("darmin_agent_shift_state");
      } catch {}
    }

    pushTaskNotification(
      "error",
      "⏹️ Automasi Dihentikan",
      `Shift dihentikan oleh operator. Total tugas tuntas: ${shiftCompletedTasksCount} task.`,
      "HQ-CORE"
    );

    setOfficeActivityFeed((prev) => [
      {
        id: `shift-stop-${Date.now()}`,
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        unitCode: "HQ-CORE",
        agentName: "Shift Master",
        room: "Pusat Kendali",
        message: `⏹️ Shift automasi DIHENTIKAN secara manual. Sistem kembali ke mode standby.`,
        isAi: false,
      },
      ...prev.slice(0, 24),
    ]);
  };

  // Subroutine Eksekusi Shift Otomatis (REAL 9ROUTER EXECUTION)
  const runShiftAutonomousTick = async () => {
    if (isExecutingTask || isPipelineRunning) return;

    // Pick candidate from target selection
    const candidateAgents =
      shiftTargetSector === "all"
        ? AGENT_ROSTER
        : AGENT_ROSTER.filter((a) => ROBOT_UNITS[a.id]?.sectorId === shiftTargetSector);

    if (candidateAgents.length === 0) return;
    const randomAgent = candidateAgents[Math.floor(Math.random() * candidateAgents.length)];
    const robot = ROBOT_UNITS[randomAgent.id];
    const randomPrompt =
      randomAgent.samplePrompts[Math.floor(Math.random() * randomAgent.samplePrompts.length)];

    const taskId = `shift-task-${Date.now()}`;
    const startTimeStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const startTimestamp = Date.now();

    const newTask: TaskItem = {
      id: taskId,
      agentId: randomAgent.id,
      unitCode: robot?.unitCode || "BOT",
      robotName: robot?.robotName || randomAgent.name,
      room: randomAgent.divisionLabel,
      prompt: `[Shift Automasi] ${randomPrompt}`,
      status: "running",
      startTime: startTimeStr,
      sectorId: robot?.sectorId,
    };
    setTasks((prev) => [newTask, ...prev]);

    pushTaskNotification(
      "start",
      `[${robot?.unitCode}] Menjalankan Tugas Shift`,
      randomPrompt.slice(0, 60),
      robot?.unitCode || "BOT"
    );

    setActiveWorkingAgentId(randomAgent.id);
    setAgentStatuses((prev) => ({ ...prev, [randomAgent.id]: "working" }));
    setAgentLiveThoughts((prev) => ({
      ...prev,
      [randomAgent.id]: robot?.workThought || "⚡ Memproses instruksi shift...",
    }));

    try {
      const res = await fetch("/api/agentic-ai/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: randomAgent.id,
          prompt: randomPrompt,
        }),
      });

      const data = await res.json();
      const outputText = data.output || "Tugas otonom selesai.";
      const durationMs = Date.now() - startTimestamp;
      const completedTimeStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

      // Auto-save physical file artifact for autonomous shift execution
      handleSaveOutputToFile(
        outputText,
        randomAgent.name,
        robot?.unitCode,
        randomPrompt,
        true
      ).catch(() => {});

      setShiftCompletedTasksCount((c) => {
        const next = c + 1;
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem("darmin_agent_shift_state");
            if (raw) {
              const parsed = JSON.parse(raw);
              parsed.shiftCompletedTasksCount = next;
              localStorage.setItem("darmin_agent_shift_state", JSON.stringify(parsed));
            }
          } catch {}
        }
        return next;
      });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: "completed",
                completedTime: completedTimeStr,
                durationMs,
                output: outputText,
              }
            : t
        )
      );

      pushTaskNotification(
        "success",
        `✅ [${robot?.unitCode}] Selesai (${(durationMs / 1000).toFixed(1)}s)`,
        outputText.slice(0, 70),
        robot?.unitCode || "BOT"
      );

      setOfficeActivityFeed((prev) => [
        {
          id: `auto-${Date.now()}`,
          time: completedTimeStr,
          unitCode: robot?.unitCode || "BOT",
          agentName: robot?.robotName || randomAgent.name,
          room: randomAgent.divisionLabel,
          message: `[Shift 9Router] Selesai: "${outputText.slice(0, 60)}..."`,
          isAi: true,
        },
        ...prev.slice(0, 24),
      ]);

      setAgentStatuses((prev) => ({ ...prev, [randomAgent.id]: "done" }));
      if (onRefreshStats) onRefreshStats();
    } catch {
      // ignore
    } finally {
      setTimeout(() => {
        setActiveWorkingAgentId((curr) => (curr === randomAgent.id ? null : curr));
        setAgentStatuses((prev) => ({ ...prev, [randomAgent.id]: "idle" }));
        setAgentLiveThoughts((prev) => ({
          ...prev,
          [randomAgent.id]: robot?.idleThought || "Standby.",
        }));
      }, 4000);
    }
  };

  // Shift Timer & Interval Tick Hook
  useEffect(() => {
    if (!isShiftRunning || isPipelineRunning) return;

    const timer = setInterval(() => {
      setShiftRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsShiftRunning(false);
          if (typeof window !== "undefined") {
            try {
              localStorage.removeItem("darmin_agent_shift_state");
            } catch {}
          }
          triggerSound("success");
          pushTaskNotification(
            "success",
            "🏁 Shift Selesai!",
            `Waktu shift automasi telah tuntas. Berhasil menyelesaikan ${shiftCompletedTasksCount} task.`,
            "HQ-CORE"
          );
          return 0;
        }
        return prev - 1;
      });

      setTickCountdown((prev) => {
        if (prev <= 1) {
          runShiftAutonomousTick();
          return 16;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isShiftRunning, isPipelineRunning, shiftTargetSector, shiftDurationMinutes, shiftCompletedTasksCount]);

  return (
    <div className="space-y-6">
      {/* =========================================================================
          FUTURISTIC COMMAND BRIDGE: SECTOR FILTER & TARGETED SWARM ENGINE
          ========================================================================= */}
      <div className="relative rounded-[2rem] border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 shadow-2xl overflow-hidden text-white backdrop-blur-xl">
        {/* Ambient Top Wave Glow */}
        <div className="absolute -top-12 left-1/3 w-96 h-28 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 right-1/4 w-96 h-28 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Header Title with Robot Icon */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 shadow-xl shadow-cyan-500/25 border border-cyan-400/40">
              <Bot className="h-8 w-8 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-slate-900"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  Kompleks Komando Robotik DARMIN
                  <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs px-2 py-0.5">
                    🤖 {AGENT_ROSTER.length} Unit Mecha Otonom
                  </Badge>
                </h2>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                <span>🛸 {SECTOR_PODS.length} Sektor Pod Terintegrasi</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  9Router LLM: {activeModel}
                </span>
                <span>•</span>
                <span className="text-cyan-400 font-mono">⚡ Zero Dummy (Live Database)</span>
              </p>
            </div>
          </div>

          {/* Quick Monitor Task & Sound Toggle */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                triggerSound("click");
                setIsTaskModalOpen(true);
              }}
              className={`text-xs h-9 px-3.5 font-bold transition-all shadow-md rounded-2xl flex items-center gap-2 border ${
                tasks.some((t) => t.status === "running")
                  ? "bg-gradient-to-r from-amber-500/25 to-orange-500/25 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-pulse"
                  : "bg-slate-900/90 border-slate-700 text-slate-200 hover:text-white hover:border-cyan-400"
              }`}
            >
              <CheckSquare className="h-4 w-4 text-cyan-400" />
              <span>📋 Monitor Task</span>
              {tasks.some((t) => t.status === "running") ? (
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-950 animate-ping"></span>
                  {tasks.filter((t) => t.status === "running").length} Berjalan
                </span>
              ) : (
                <span className="bg-slate-800 text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded-full border border-slate-700">
                  {tasks.length} Task
                </span>
              )}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playRetroSound("click");
              }}
              className="h-9 w-9 p-0 border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl"
              title={soundEnabled ? "Nonaktifkan Efek Suara Mecha" : "Aktifkan Efek Suara Mecha"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-cyan-400" /> : <VolumeX className="h-4 w-4 text-slate-500" />}
            </Button>
          </div>
        </div>

        {/* =====================================================================
            SATU PUSAT KENDALI AUTOMASI SHIFT ROBOTIK (UNIFIED COMMAND HUB)
            ===================================================================== */}
        <div className="mt-4 pt-4 border-t border-slate-800/90 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950 p-4 border border-cyan-500/25 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3.5 items-end">
            
            {/* PUSAT 1: SIAPA YANG BEKERJA (Target Unit) */}
            <div className="xl:col-span-4 space-y-1.5">
              <label className="text-xs text-cyan-400 font-bold flex items-center gap-1.5 uppercase tracking-wide">
                <Bot className="h-4 w-4 text-cyan-400" />
                1. Siapa yang Bekerja:
              </label>
              <select
                value={shiftTargetSector}
                disabled={isShiftRunning}
                onChange={(e) => {
                  triggerSound("click");
                  setShiftTargetSector(e.target.value);
                  setSelectedSectorFilter(e.target.value);
                }}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl px-3 py-2.5 font-bold focus:outline-none focus:border-cyan-400 cursor-pointer disabled:opacity-60 shadow-inner"
              >
                <option value="all" className="bg-slate-900 text-white font-bold">
                  🌐 Seluruh Kantor ({AGENT_ROSTER.length} Unit Robot Lengkap)
                </option>
                {SECTOR_PODS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                    {s.name} ({s.badge})
                  </option>
                ))}
              </select>
            </div>

            {/* PUSAT 2: PILIHAN MAU BERAPA JAM BEKERJA (Durasi) */}
            <div className="xl:col-span-5 space-y-1.5">
              <label className="text-xs text-amber-400 font-bold flex items-center gap-1.5 uppercase tracking-wide">
                <Clock className="h-4 w-4 text-amber-400" />
                2. Berapa Jam Bekerja:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {[
                  { label: "15 Menit", mins: 15 },
                  { label: "1 Jam", mins: 60 },
                  { label: "2 Jam", mins: 120 },
                  { label: "4 Jam", mins: 240 },
                  { label: "8 Jam", mins: 480 },
                  { label: "24 Jam", mins: 1440 },
                ].map((item) => (
                  <button
                    key={item.mins}
                    type="button"
                    disabled={isShiftRunning}
                    onClick={() => {
                      triggerSound("click");
                      setShiftDurationMinutes(item.mins);
                      setShiftRemainingSeconds(item.mins * 60);
                    }}
                    className={`text-[11px] py-2 px-1 text-center rounded-xl font-bold transition-all disabled:opacity-60 truncate ${
                      shiftDurationMinutes === item.mins
                        ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 font-black scale-[1.02]"
                        : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* PUSAT 3: TOMBOL SATU PUSAT (MULAI vs BERHENTI) */}
            <div className="xl:col-span-3 flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                3. Eksekusi Automasi:
              </label>
              {isShiftRunning ? (
                <Button
                  size="sm"
                  onClick={handleStopShift}
                  className="w-full bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs h-9 px-4 rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 border border-rose-400/50 animate-pulse hover:scale-[1.02] transition-all"
                >
                  <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                  <span>⏹️ HENTIKAN SEKARANG</span>
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleStartShift}
                    className="flex-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-xs h-9 px-3 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 border border-emerald-400/50 hover:scale-[1.02] transition-all"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>▶️ MULAI SHIFT</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isPipelineRunning}
                    onClick={() => runRealSectorAutomation(shiftTargetSector === "all" ? "engineering" : shiftTargetSector)}
                    className="text-[11px] h-9 px-2.5 font-bold border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:text-white hover:bg-cyan-900 rounded-xl shrink-0"
                    title="Jalankan estafet sekuensial seluruh unit dalam 1 sektor sekaligus"
                  >
                    ⚡ 1 Putaran
                  </Button>
                </div>
              )}
            </div>

          </div>

          {/* TELEMETRY & COUNTDOWN SAAT SEDANG BERJALAN */}
          {isShiftRunning && (
            <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-emerald-500/20">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-emerald-400 font-black font-mono">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  STATUS: SHIFT AKTIF BERJALAN
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-300 font-bold font-mono flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Sisa Waktu: {formatRemainingTime(shiftRemainingSeconds)}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-cyan-300 font-mono">
                  Tugas Berikutnya: <strong className="text-white font-black">{tickCountdown}s</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
                <span>Tugas Tuntas Sesi Ini: <strong className="text-emerald-400 font-black">{shiftCompletedTasksCount}</strong></span>
                <span>•</span>
                <span className="text-cyan-400 truncate font-semibold">
                  Target: {shiftTargetSector === "all" ? `${AGENT_ROSTER.length} Robot Kantor` : SECTOR_PODS.find((s) => s.id === shiftTargetSector)?.shortName}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Sector Navigation Filters */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 mr-1 font-semibold">Tampilan Sektor:</span>
            {[
              { id: "all", label: "🛸 Semua Sektor" },
              { id: "engineering", label: "💻 Neural Dev & Cloud" },
              { id: "sales", label: "💼 Revenue Radar" },
              { id: "warehouse", label: "🏭 Sorting & Logistics" },
              { id: "finance", label: "💰 Treasury Vault" },
              { id: "datacenter", label: "🖥️ Core Systems" },
              { id: "marketing", label: "📱 Creative Media & Sosmed" },
            ].map((sector) => (
              <button
                key={sector.id}
                onClick={() => {
                  triggerSound("click");
                  setSelectedSectorFilter(sector.id);
                  if (sector.id !== "all") setTargetAutomationSector(sector.id);
                }}
                className={`text-xs px-3 py-1 rounded-xl font-bold transition-all ${
                  selectedSectorFilter === sector.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {sector.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-cyan-400/80 font-mono hidden md:inline">
            ✨ Desain Pod Futuristik Organik • Zero Kotak Kaku
          </span>
        </div>
      </div>

      {/* Active Pipeline Live Progress Notification */}
      {isPipelineRunning && (
        <div className="rounded-2xl border border-cyan-500/60 bg-gradient-to-r from-cyan-950/90 via-slate-900 to-indigo-950/90 p-4 shadow-xl text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <RotateCw className="h-5 w-5 animate-spin" />
              </div>
              <div>
                <div className="text-xs uppercase font-extrabold tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
                  Automasi Real-Time 9Router Sedang Berlangsung
                </div>
                <div className="text-sm font-bold text-white">
                  Target: <span className="text-cyan-300 font-black">{pipelineSectorName}</span>
                </div>
                <div className="text-xs text-slate-300">
                  Data aktual dari PostgreSQL sedang dianalisis dan diproses oleh LLM tanpa simulasi palsu.
                </div>
              </div>
            </div>
            <div className="text-xs bg-slate-800/90 border border-cyan-500/40 rounded-xl px-3 py-1.5 text-cyan-300 font-mono font-bold">
              Progress: Unit {pipelineCurrentStep} dari {pipelineTotalSteps} Selesai
            </div>
          </div>

          {activePipelineOutput && (
            <div className="mt-3 p-2.5 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-xs font-mono text-slate-300 max-h-24 overflow-y-auto">
              <div className="text-[10px] text-cyan-400 font-bold mb-1">HASIL EKSEKUSI TERAKHIR:</div>
              {activePipelineOutput.slice(0, 200)}...
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          FUTURISTIC CYBER PODS COMPLEX (ORGANIC NON-BOXY DESIGN)
          ========================================================================= */}
      <div className="relative rounded-[2.5rem] border border-slate-700/80 bg-slate-950 p-4 sm:p-6 shadow-2xl overflow-hidden min-h-[750px]">
        {/* Ambient Grid Backdrop */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Central Energy Conduits / Flow Lines connecting the pods */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/20 via-purple-500/30 to-amber-500/20 pointer-events-none -translate-y-1/2 hidden lg:block" />

        <div className="relative z-10 space-y-6">
          {/* =====================================================================
              SECTOR A: NEURAL DEV & CLOUD POD (CURVED ORGANIC POD)
              ===================================================================== */}
          {(selectedSectorFilter === "all" || selectedSectorFilter === "engineering") && (
            <div className="relative rounded-[2.2rem] border-2 border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-950/95 to-slate-900/90 p-5 shadow-[0_0_40px_rgba(6,182,212,0.12)] transition-all duration-300 hover:border-cyan-400">
              {/* Sector Holographic Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-cyan-500/20 gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-black">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-cyan-300 tracking-wide">
                        SECTOR 01: NEURAL DEV & CLOUD POD
                      </h3>
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/40 text-[10px] px-2 py-0">
                        5 ROBOT UNIT
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400">Tim Fullstack, QA Automation, DevOps SRE, Architect & UI/UX</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => runRealSectorAutomation("engineering")}
                    disabled={isPipelineRunning}
                    className="h-8 text-xs bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 px-3 rounded-xl font-bold"
                  >
                    ⚡ Automasi Sektor Dev
                  </Button>
                </div>
              </div>

              {/* Robot Pod Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {AGENT_ROSTER.filter((a) => ROBOT_UNITS[a.id]?.sectorId === "engineering").map((agent) => (
                  <CyberRobotPod
                    key={agent.id}
                    agent={agent}
                    robot={ROBOT_UNITS[agent.id]}
                    isActive={activeWorkingAgentId === agent.id}
                    status={agentStatuses[agent.id] || "idle"}
                    thought={agentLiveThoughts[agent.id]}
                    onClick={() => handleOpenWorkstation(agent)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              SECTOR B: COMMERCIAL WAR ROOM & REVENUE RADAR (CURVED ORGANIC POD)
              ===================================================================== */}
          {(selectedSectorFilter === "all" || selectedSectorFilter === "sales") && (
            <div className="relative rounded-[2.2rem] border-2 border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-950/95 to-slate-900/90 p-5 shadow-[0_0_40px_rgba(245,158,11,0.12)] transition-all duration-300 hover:border-amber-400">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-amber-500/20 gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-amber-300 tracking-wide">
                        SECTOR 02: REVENUE RADAR & COMMERCIAL WAR ROOM
                      </h3>
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/40 text-[10px] px-2 py-0">
                        3 ROBOT UNIT
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400">Radar Pabrik KIIC Karawang, Smart Quotation & WhatsApp Closing</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => runRealSectorAutomation("sales")}
                    disabled={isPipelineRunning}
                    className="h-8 text-xs bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 px-3 rounded-xl font-bold"
                  >
                    ⚡ Automasi Sektor Sales
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {AGENT_ROSTER.filter((a) => ROBOT_UNITS[a.id]?.sectorId === "sales").map((agent) => (
                  <CyberRobotPod
                    key={agent.id}
                    agent={agent}
                    robot={ROBOT_UNITS[agent.id]}
                    isActive={activeWorkingAgentId === agent.id}
                    status={agentStatuses[agent.id] || "idle"}
                    thought={agentLiveThoughts[agent.id]}
                    onClick={() => handleOpenWorkstation(agent)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              SECTOR C: ROBOTIC SORTING & LOGISTICS BAY (CURVED INDUSTRIAL POD)
              ===================================================================== */}
          {(selectedSectorFilter === "all" || selectedSectorFilter === "warehouse") && (
            <div className="relative rounded-[2.2rem] border-2 border-yellow-500/40 bg-gradient-to-br from-yellow-950/20 via-slate-950/95 to-slate-900/90 p-5 shadow-[0_0_40px_rgba(234,179,8,0.12)] transition-all duration-300 hover:border-yellow-400">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-yellow-500/20 gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 flex items-center justify-center font-black">
                    <Scale className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-yellow-300 tracking-wide">
                        SECTOR 03: ROBOTIC SORTING & SUPPLY CHAIN BAY
                      </h3>
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/40 text-[10px] px-2 py-0">
                        6 ROBOT UNIT
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400">Sourcing Kain Majalaya, Timbangan Bal, Rendemen Sortir & QC Defect</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => runRealSectorAutomation("warehouse")}
                    disabled={isPipelineRunning}
                    className="h-8 text-xs bg-yellow-950/80 hover:bg-yellow-900 text-yellow-300 border border-yellow-500/40 px-3 rounded-xl font-bold"
                  >
                    ⚡ Automasi Sektor Gudang
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {AGENT_ROSTER.filter((a) => ROBOT_UNITS[a.id]?.sectorId === "warehouse").map((agent) => (
                  <CyberRobotPod
                    key={agent.id}
                    agent={agent}
                    robot={ROBOT_UNITS[agent.id]}
                    isActive={activeWorkingAgentId === agent.id}
                    status={agentStatuses[agent.id] || "idle"}
                    thought={agentLiveThoughts[agent.id]}
                    onClick={() => handleOpenWorkstation(agent)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              SECTOR D & E: TREASURY VAULT & CORE SYSTEMS (DUAL POD ROW)
              ===================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SECTOR D: TREASURY VAULT */}
            {(selectedSectorFilter === "all" || selectedSectorFilter === "finance") && (
              <div className="relative rounded-[2.2rem] border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-slate-950/95 to-slate-900/90 p-5 shadow-[0_0_40px_rgba(16,185,129,0.12)] transition-all duration-300 hover:border-emerald-400">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-emerald-300 tracking-wide">
                          SECTOR 04: TREASURY VAULT
                        </h3>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/40 text-[10px] px-2 py-0">
                          2 UNIT
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400">Margin Guard HPP Riil & Audit Piutang Tempo</p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => runRealSectorAutomation("finance")}
                    disabled={isPipelineRunning}
                    className="h-8 text-xs bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 px-3 rounded-xl font-bold"
                  >
                    ⚡ Automasi Vault
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {AGENT_ROSTER.filter((a) => ROBOT_UNITS[a.id]?.sectorId === "finance").map((agent) => (
                    <CyberRobotPod
                      key={agent.id}
                      agent={agent}
                      robot={ROBOT_UNITS[agent.id]}
                      isActive={activeWorkingAgentId === agent.id}
                      status={agentStatuses[agent.id] || "idle"}
                      thought={agentLiveThoughts[agent.id]}
                      onClick={() => handleOpenWorkstation(agent)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* SECTOR E: CORE SYSTEMS & DATA CENTER */}
            {(selectedSectorFilter === "all" || selectedSectorFilter === "datacenter") && (
              <div className="relative rounded-[2.2rem] border-2 border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-slate-950/95 to-slate-900/90 p-5 shadow-[0_0_40px_rgba(168,85,247,0.12)] transition-all duration-300 hover:border-purple-400">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-500/20">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center font-black">
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-purple-300 tracking-wide">
                          SECTOR 05: CORE SYSTEMS
                        </h3>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/40 text-[10px] px-2 py-0">
                          4 UNIT
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400">Text-to-SQL Query, Integritas DB & Audit Security</p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => runRealSectorAutomation("datacenter")}
                    disabled={isPipelineRunning}
                    className="h-8 text-xs bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/40 px-3 rounded-xl font-bold"
                  >
                    ⚡ Automasi Core
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {AGENT_ROSTER.filter((a) => ROBOT_UNITS[a.id]?.sectorId === "datacenter").map((agent) => (
                    <CyberRobotPod
                      key={agent.id}
                      agent={agent}
                      robot={ROBOT_UNITS[agent.id]}
                      isActive={activeWorkingAgentId === agent.id}
                      status={agentStatuses[agent.id] || "idle"}
                      thought={agentLiveThoughts[agent.id]}
                      onClick={() => handleOpenWorkstation(agent)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* =====================================================================
              SECTOR 06: CREATIVE MEDIA STUDIO & VIRAL BROADCASTING (MARKETING)
              ===================================================================== */}
          {(selectedSectorFilter === "all" || selectedSectorFilter === "marketing") && (
            <div className="relative rounded-[2.2rem] border-2 border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-950/20 via-slate-950/95 to-slate-900/90 p-5 shadow-[0_0_40px_rgba(217,70,239,0.12)] transition-all duration-300 hover:border-fuchsia-400">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-fuchsia-500/20 gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/40 flex items-center justify-center font-black">
                    <Palette className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-fuchsia-300 tracking-wide">
                        SECTOR 06: CREATIVE MEDIA STUDIO & SOSMED
                      </h3>
                      <Badge className="bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40 text-[10px] px-2 py-0">
                        10 ROBOT UNIT
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400">Visual Prompt Artist, Naskah Reels/TikTok, Copywriting, Trend Jacker & Sentimen Medsos</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => runRealSectorAutomation("marketing")}
                    disabled={isPipelineRunning}
                    className="h-8 text-xs bg-fuchsia-950/80 hover:bg-fuchsia-900 text-fuchsia-300 border border-fuchsia-500/40 px-3 rounded-xl font-bold"
                  >
                    ⚡ Automasi Sektor Medsos
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {AGENT_ROSTER.filter((a) => ROBOT_UNITS[a.id]?.sectorId === "marketing").map((agent) => (
                  <CyberRobotPod
                    key={agent.id}
                    agent={agent}
                    robot={ROBOT_UNITS[agent.id]}
                    isActive={activeWorkingAgentId === agent.id}
                    status={agentStatuses[agent.id] || "idle"}
                    thought={agentLiveThoughts[agent.id]}
                    onClick={() => handleOpenWorkstation(agent)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              SECTOR LOUNGE: SOLAR RECHARGE & COOLANT LOUNGE (POD SANTAI)
              ===================================================================== */}
          {selectedSectorFilter === "all" && (
            <div className="rounded-[2.2rem] border border-rose-500/30 bg-gradient-to-r from-rose-950/20 via-slate-950 to-slate-900/90 p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center font-bold">
                  <Coffee className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                    Neural Dock & Coolant Bay
                  </h4>
                  <p className="text-[11px] text-slate-400">Area Pengisian Daya Surya & Pendingin Komputasi Robot</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5">
                  <span className="text-lg">☕</span>
                  <span className="text-slate-300 text-[11px]">Robusta Garut</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5">
                  <span className="text-lg">🔋</span>
                  <span className="text-emerald-400 text-[11px] font-mono">48V Solar Dock</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5">
                  <span className="text-lg">💧</span>
                  <span className="text-cyan-400 text-[11px] font-mono">Coolant: 14°C</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Robot Activity Stream */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 shadow-lg">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Terminal className="h-3.5 w-3.5 text-cyan-400" />
              <span>Live Robotic Neural Stream (Terhubung ke PostgreSQL & 9Router)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">Live AI Pipeline Active</span>
          </div>

          <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px]">
            {officeActivityFeed.map((item) => (
              <div key={item.id} className="flex items-start gap-2 text-slate-300 leading-tight">
                <span className="text-slate-500 shrink-0">[{item.time}]</span>
                <span className="text-cyan-400 font-bold shrink-0">[{item.unitCode}]</span>
                <span className="text-indigo-300 font-semibold shrink-0">[{item.agentName}]</span>
                <span className="text-slate-200 truncate">{item.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          WORKSTATION INSPECTOR MODAL
          ========================================================================= */}
      <Dialog open={!!workstationAgent} onOpenChange={(open) => !open && setWorkstationAgent(null)}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white p-6 shadow-2xl rounded-3xl">
          {workstationAgent && (
            <div>
              <DialogHeader>
                <div className="flex items-center gap-3.5">
                  <RobotMechaHead
                    code={ROBOT_UNITS[workstationAgent.id]?.unitCode || "BOT"}
                    visorColor={ROBOT_UNITS[workstationAgent.id]?.visorColor || "cyan"}
                    isActive={isExecutingTask}
                    size="lg"
                  />
                  <div>
                    <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                      {ROBOT_UNITS[workstationAgent.id]?.robotName || workstationAgent.name}
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/40 text-xs">
                        Unit {ROBOT_UNITS[workstationAgent.id]?.unitCode}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-indigo-400/40 text-indigo-300">
                        {workstationAgent.divisionLabel}
                      </Badge>
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-300 mt-0.5">
                      {workstationAgent.role} • Clock: {ROBOT_UNITS[workstationAgent.id]?.coreFrequency || "4.5 GHz"} • Battery: {ROBOT_UNITS[workstationAgent.id]?.batteryLevel}%
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Workstation Body */}
              <div className="mt-5 space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {workstationAgent.capabilities.map((cap, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono"
                    >
                      ✓ {cap}
                    </span>
                  ))}
                </div>

                {/* Prompt Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Instruksi Kerja Robotik (Subroutine Prompt Nyata):
                    </label>
                    <span className="text-[11px] text-emerald-400 font-mono">9Router: {activeModel}</span>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Ketik instruksi kerja..."
                      className="bg-slate-950 border-slate-700 text-white text-xs rounded-xl"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isExecutingTask) handleRunWorkstationTask();
                      }}
                    />
                    <Button
                      onClick={handleRunWorkstationTask}
                      disabled={isExecutingTask || !customPrompt.trim()}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs shrink-0 rounded-xl"
                    >
                      {isExecutingTask ? (
                        <>
                          <RotateCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5 mr-1.5" />
                          Tugaskan Robot
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Sample Prompts */}
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    <span className="text-[10px] text-slate-400 mr-1">Contoh Cepat:</span>
                    {workstationAgent.samplePrompts.map((sp, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          triggerSound("click");
                          setCustomPrompt(sp);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                      >
                        {sp.slice(0, 36)}...
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Real Output Screen */}
                {taskOutput && (
                  <div className="mt-3 rounded-2xl border border-slate-700 bg-slate-950 p-3.5">
                    {/* Auto-Saved Physical File Banner */}
                    {lastSavedFilePath && (
                      <div className="mb-2.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/60 border border-emerald-500/50 text-[11px] text-emerald-300 flex items-center justify-between shadow-lg shadow-emerald-950/20">
                        <span className="flex items-center gap-2 font-mono truncate mr-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          <span>Berkas Fisik Otomatis Tersimpan: <strong className="text-white underline">{lastSavedFilePath}</strong></span>
                        </span>
                        {onNavigateToFiles && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setWorkstationAgent(null);
                              onNavigateToFiles();
                            }}
                            className="h-6 text-[10px] bg-emerald-600/30 border-emerald-500/60 hover:bg-emerald-600 text-emerald-300 hover:text-white px-2.5 py-0 font-bold shrink-0 transition flex items-center gap-1"
                          >
                            <HardDrive className="h-3 w-3" />
                            Buka di Tab Berkas →
                          </Button>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
                      <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Deliverable Asli dari 9Router LLM:
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          disabled={savingFile}
                          onClick={() => {
                            const robot = workstationAgent ? ROBOT_UNITS[workstationAgent.id] : undefined;
                            handleSaveOutputToFile(taskOutput, workstationAgent?.name, robot?.unitCode, customPrompt, false, true);
                          }}
                          className={`h-6 text-[11px] font-bold px-2.5 rounded-lg flex items-center gap-1 shadow-sm transition ${
                            lastSavedFilePath
                              ? "bg-emerald-700 hover:bg-emerald-600 text-white"
                              : "bg-cyan-600 hover:bg-cyan-500 text-white"
                          }`}
                        >
                          <HardDrive className="h-3 w-3" />
                          {savingFile ? "Menyimpan..." : lastSavedFilePath ? "✅ Tersimpan Fisik" : "💾 Simpan File Fisik"}
                        </Button>

                        {onNavigateToFiles && !lastSavedFilePath && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setWorkstationAgent(null);
                              onNavigateToFiles();
                            }}
                            className="h-6 text-[11px] bg-slate-900 border-slate-700 hover:border-emerald-500 text-emerald-400 hover:text-white px-2 rounded-lg"
                          >
                            Tab Berkas →
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(taskOutput);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="h-6 text-[11px] text-slate-400 hover:text-white px-2 rounded-lg"
                        >
                          {copied ? <Check className="h-3 w-3 text-emerald-400 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                          {copied ? "Tersalin" : "Salin"}
                        </Button>
                      </div>
                    </div>

                    {/* Render Image Previews if task output generated an image */}
                    {(() => {
                      const imgRegex = /!\[(.*?)\]\(((?:\/generated-images\/|https?:\/\/)[^\s)]+)\)/g;
                      const matches = Array.from(taskOutput.matchAll(imgRegex));
                      if (matches.length === 0) return null;
                      return (
                        <div className="mb-3 space-y-2 p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                          {matches.map((m: any, idx: number) => (
                            <div key={idx} className="space-y-1">
                              <img
                                src={m[2]}
                                alt={m[1] || "AI Image"}
                                className="w-full h-44 object-cover rounded-lg border border-slate-700 shadow-md"
                              />
                              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-1">
                                <span className="text-cyan-300 font-bold">{m[1] || "Gambar AI"}</span>
                                <a href={m[2]} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                                  Buka Foto Penuh ↗
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}

                    <div className="max-h-64 overflow-y-auto text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed pr-1">
                      {taskOutput}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          PEMBERITAHUAN TASK REAL-TIME (FLOATING MECHA TASK TOASTS)
          ========================================================================= */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {floatingToasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border p-3.5 shadow-2xl backdrop-blur-2xl transition-all duration-300 animate-in slide-in-from-top-4 ${
              toast.type === "start"
                ? "bg-slate-950/95 border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.35)] text-white"
                : toast.type === "success"
                ? "bg-slate-950/95 border-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.35)] text-white"
                : "bg-slate-950/95 border-rose-500/80 shadow-[0_0_30px_rgba(244,63,94,0.35)] text-white"
            }`}
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    toast.type === "start"
                      ? "bg-amber-400 animate-ping"
                      : toast.type === "success"
                      ? "bg-emerald-400"
                      : "bg-rose-400"
                  }`}
                />
                <Badge className="bg-slate-900 text-cyan-300 border-slate-700 text-[10px] font-mono px-1.5 py-0">
                  {toast.unitCode}
                </Badge>
                <span className="text-xs font-bold text-white tracking-wide">
                  {toast.title}
                </span>
              </div>
              <button
                onClick={() => setFloatingToasts((prev) => prev.filter((n) => n.id !== toast.id))}
                className="text-slate-400 hover:text-white p-0.5 rounded-md transition-colors"
                title="Tutup Notifikasi"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-1.5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {toast.message}
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="text-slate-400 font-mono">🕒 {toast.timestamp}</span>
              <button
                onClick={() => {
                  triggerSound("click");
                  setIsTaskModalOpen(true);
                }}
                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 hover:underline"
              >
                Lihat di Monitor Task →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          MODAL PUSAT PEMANTAUAN & ANTREAN TASK ROBOTIK (TASK MONITOR MODAL)
          ========================================================================= */}
      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent className="max-w-3xl bg-slate-950 border border-cyan-500/40 text-white p-6 shadow-2xl rounded-3xl max-h-[88vh] flex flex-col">
          <DialogHeader className="pb-3 border-b border-slate-800 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-indigo-600/30 to-purple-600/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-black">
                  <CheckSquare className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-black text-white flex items-center gap-2">
                    Pusat Pemantauan & Antrean Task Robotik
                    <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/40 text-xs px-2 py-0.5">
                      LIVE 9ROUTER
                    </Badge>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-300 mt-0.5">
                    Pantau status eksekusi task otonom, antrean instruksi robot, serta deliverable analisis riil dari PostgreSQL.
                  </DialogDescription>
                </div>
              </div>

              {/* Status summary pill */}
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-slate-900 border-slate-700 text-slate-300 font-mono text-xs px-2.5 py-1"
                >
                  Model: {activeModel}
                </Badge>
              </div>
            </div>

            {/* Quick Metrics & Filter Tabs */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                {[
                  { id: "all", label: `Semua (${tasks.length})` },
                  {
                    id: "running",
                    label: `⚡ Sedang Berjalan (${tasks.filter((t) => t.status === "running").length})`,
                  },
                  {
                    id: "completed",
                    label: `✅ Selesai (${tasks.filter((t) => t.status === "completed").length})`,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      triggerSound("click");
                      setTaskFilter(tab.id as any);
                    }}
                    className={`text-xs px-3 py-1 rounded-xl font-bold transition-all ${
                      taskFilter === tab.id
                        ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                        : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={loadingTasks}
                  onClick={() => {
                    triggerSound("click");
                    fetchRealDatabaseTasks();
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-cyan-300 hover:text-white transition flex items-center gap-1 font-mono disabled:opacity-50"
                  title="Ambil data task terbaru langsung dari tabel PostgreSQL"
                >
                  <RotateCw className={`h-3 w-3 ${loadingTasks ? "animate-spin text-cyan-400" : ""}`} />
                  {loadingTasks ? "Menyinkron..." : "Sinkron DB"}
                </button>

                {tasks.length > 0 && (
                  <button
                    disabled={loadingTasks}
                    onClick={handleClearDatabaseTasks}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition font-medium disabled:opacity-50"
                  >
                    Bersihkan Riwayat Selesai
                  </button>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Body: Task List or Task Detail */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-3">
            {selectedDetailTask ? (
              /* Detail View for a single task */
              <div className="rounded-2xl border border-cyan-500/40 bg-slate-900/90 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <RobotMechaHead
                      code={selectedDetailTask.unitCode}
                      visorColor="cyan"
                      isActive={selectedDetailTask.status === "running"}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {selectedDetailTask.robotName}
                        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/40 text-[10px]">
                          {selectedDetailTask.unitCode}
                        </Badge>
                      </h4>
                      <p className="text-[11px] text-slate-400">{selectedDetailTask.room}</p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedDetailTask(null)}
                    className="h-7 text-xs text-slate-400 hover:text-white"
                  >
                    ← Kembali ke Daftar Task
                  </Button>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Instruksi Subroutine (Prompt):
                  </div>
                  <div className="text-xs text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono">
                    {selectedDetailTask.prompt}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Hasil Deliverable AI Riil (9Router):
                    </span>
                    {selectedDetailTask.output && (
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          disabled={savingFile}
                          onClick={() => {
                            handleSaveOutputToFile(
                              selectedDetailTask.output || "",
                              selectedDetailTask.robotName,
                              selectedDetailTask.unitCode,
                              undefined,
                              false,
                              true
                            );
                          }}
                          className="h-6 text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 rounded-lg flex items-center gap-1 shadow-sm"
                        >
                          <HardDrive className="h-3 w-3" />
                          {savingFile ? "Menyimpan..." : "💾 Simpan File Fisik"}
                        </Button>

                        {onNavigateToFiles && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setIsTaskModalOpen(false);
                              onNavigateToFiles();
                            }}
                            className="h-6 text-[11px] bg-slate-900 border-slate-700 hover:border-emerald-500 text-emerald-400 hover:text-white px-2 rounded-lg"
                          >
                            Tab Berkas →
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedDetailTask.output || "");
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="h-6 text-[11px] text-slate-400 hover:text-white px-2 rounded-lg"
                        >
                          {copied ? <Check className="h-3 w-3 text-emerald-400 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                          {copied ? "Tersalin" : "Salin Hasil"}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Render Image Previews if detail task has images */}
                  {selectedDetailTask.output && (() => {
                    const imgRegex = /!\[(.*?)\]\(((?:\/generated-images\/|https?:\/\/)[^\s)]+)\)/g;
                    const matches = Array.from(selectedDetailTask.output.matchAll(imgRegex));
                    if (matches.length === 0) return null;
                    return (
                      <div className="mb-2.5 p-2 bg-slate-900 border border-slate-800 rounded-xl">
                        {matches.map((m: any, idx: number) => (
                          <div key={idx} className="space-y-1">
                            <img
                              src={m[2]}
                              alt={m[1] || "AI Image"}
                              className="w-full h-44 object-cover rounded-lg border border-slate-700 shadow-md"
                            />
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-1">
                              <span className="text-cyan-300 font-bold">{m[1] || "Gambar AI"}</span>
                              <a href={m[2]} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                                Buka Foto Penuh ↗
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 max-h-80 overflow-y-auto text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                    {selectedDetailTask.output || "Tidak ada output tercatat."}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                  <span>Mulai: {selectedDetailTask.startTime}</span>
                  {selectedDetailTask.completedTime && <span>Selesai: {selectedDetailTask.completedTime}</span>}
                  {selectedDetailTask.durationMs && (
                    <span className="text-cyan-400 font-bold">
                      Durasi: {(selectedDetailTask.durationMs / 1000).toFixed(2)} detik
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* List View of Tasks */
              <>
                {tasks
                  .filter((t) => {
                    if (taskFilter === "running") return t.status === "running";
                    if (taskFilter === "completed") return t.status === "completed";
                    return true;
                  })
                  .map((task) => (
                    <div
                      key={task.id}
                      className={`rounded-2xl border p-4 transition-all duration-200 ${
                        task.status === "running"
                          ? "border-amber-400/80 bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                          : task.status === "completed"
                          ? "border-slate-800 bg-slate-900/80 hover:border-slate-700"
                          : "border-rose-500/50 bg-rose-950/10"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-3">
                          <RobotMechaHead
                            code={task.unitCode}
                            visorColor={task.status === "running" ? "amber" : "cyan"}
                            isActive={task.status === "running"}
                            size="sm"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-black text-white">{task.robotName}</h4>
                              <Badge className="bg-slate-800 text-cyan-300 border-slate-700 text-[9px] font-mono">
                                {task.unitCode}
                              </Badge>
                              <span className="text-[10px] text-slate-400">• {task.room}</span>
                            </div>
                            <div className="text-[11px] text-slate-300 line-clamp-1 mt-0.5 font-medium">
                              "{task.prompt}"
                            </div>
                          </div>
                        </div>

                        {/* Status Badge & Action */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {task.status === "running" ? (
                            <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/50 text-xs px-2.5 py-1 flex items-center gap-1.5 animate-pulse">
                              <RotateCw className="h-3 w-3 animate-spin" />
                              SEDANG DIKERJAKAN
                            </Badge>
                          ) : task.status === "completed" ? (
                            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/40 text-xs px-2 py-0.5 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              SELESAI {task.durationMs ? `(${(task.durationMs / 1000).toFixed(1)}s)` : ""}
                            </Badge>
                          ) : (
                            <Badge className="bg-rose-500/20 text-rose-300 border-rose-400/40 text-xs">
                              GAGAL
                            </Badge>
                          )}

                          {task.output && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                triggerSound("click");
                                setSelectedDetailTask(task);
                              }}
                              className="h-7 text-xs bg-slate-800 border-slate-700 hover:border-cyan-400 text-cyan-300 hover:text-white px-2.5 rounded-xl font-bold flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              Lihat Output
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Live In-Progress indicator */}
                      {task.status === "running" && (
                        <div className="mt-3 pt-2.5 border-t border-amber-500/20 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[10px] text-amber-300 font-mono">
                            <span className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                              Mengeksekusi LLM via 9Router & querying data riil...
                            </span>
                            <span>Mulai: {task.startTime}</span>
                          </div>
                          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-amber-500/30">
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full w-2/3 animate-pulse rounded-full" />
                          </div>
                        </div>
                      )}

                      {/* Completed Output Preview Snippet */}
                      {task.status === "completed" && task.output && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                          <div className="truncate pr-2 font-mono text-[10px] text-slate-400">
                            <span className="text-emerald-400 font-bold">Ringkasan:</span> {task.output.slice(0, 100)}...
                          </div>
                          <span className="shrink-0 text-[10px] font-mono text-slate-500">
                            {task.completedTime}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}

                {tasks.length === 0 && (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 text-slate-400 space-y-2">
                    <CheckSquare className="h-8 w-8 text-slate-600 mx-auto" />
                    <p className="text-sm font-bold text-slate-300">Belum ada task yang dieksekusi.</p>
                    <p className="text-xs text-slate-400">
                      Jalankan automasi robotik per-sektor atau aktifkan Auto-Pilot untuk melihat daftar task live.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-400 font-mono">
              💡 Seluruh hasil task diverifikasi tersimpan di tabel audit PostgreSQL.
            </span>
            <Button
              size="sm"
              onClick={() => setIsTaskModalOpen(false)}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-xl px-4"
            >
              Tutup Monitor
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// =========================================================================
// ROBOT MECHA HEAD COMPONENT (CYBERNETIC CHASSIS WITH VISOR)
// =========================================================================
function RobotMechaHead({
  code,
  visorColor = "cyan",
  isActive,
  size = "md",
}: {
  code: string;
  visorColor?: "cyan" | "amber" | "yellow" | "emerald" | "purple";
  isActive: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const visorGlows = {
    cyan: "bg-cyan-400 shadow-[0_0_12px_#22d3ee]",
    amber: "bg-amber-400 shadow-[0_0_12px_#fbbf24]",
    yellow: "bg-yellow-400 shadow-[0_0_12px_#facc15]",
    emerald: "bg-emerald-400 shadow-[0_0_12px_#34d399]",
    purple: "bg-purple-400 shadow-[0_0_12px_#c084fc]",
  };

  const isLg = size === "lg";

  return (
    <div className={`relative flex flex-col items-center justify-center ${isActive ? "scale-105" : ""}`}>
      {/* Robot Antenna with blinking status beacon */}
      <div className="flex flex-col items-center -mb-1 z-10">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isActive ? "bg-red-400 animate-ping" : "bg-emerald-400 animate-pulse"
          }`}
        />
        <span className="h-2 w-0.5 bg-slate-500" />
      </div>

      {/* Robot Metallic Head Chassis */}
      <div
        className={`relative rounded-2xl border-2 bg-gradient-to-b from-slate-800 to-slate-950 flex flex-col items-center justify-between shadow-xl ${
          isLg ? "h-14 w-14 p-1.5" : "h-11 w-11 p-1"
        } ${
          isActive
            ? "border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse"
            : "border-slate-700 group-hover:border-slate-500"
        }`}
      >
        {/* Robot Bolts on sides */}
        <span className="absolute -left-1 top-3 h-2.5 w-1 rounded-l bg-slate-600 border border-slate-700" />
        <span className="absolute -right-1 top-3 h-2.5 w-1 rounded-r bg-slate-600 border border-slate-700" />

        {/* Robot Visor / Glowing Optical Sensor */}
        <div
          className={`w-full rounded bg-slate-900 border border-slate-800 flex items-center justify-center px-1 overflow-hidden ${
            isLg ? "h-4" : "h-3"
          }`}
        >
          <div
            className={`w-full h-1.5 rounded-full ${visorGlows[visorColor]} ${
              isActive ? "animate-pulse" : ""
            }`}
          />
        </div>

        {/* Robot Speaker Grille */}
        <div className="flex items-center gap-0.5 opacity-80 mb-0.5">
          <span className="h-1 w-1 bg-slate-500 rounded-xs" />
          <span className="h-1.5 w-1 bg-slate-400 rounded-xs" />
          <span className="h-1 w-1 bg-slate-500 rounded-xs" />
        </div>
      </div>

      {/* Robot Unit Code Badge */}
      <span className="mt-1 text-[8px] font-mono px-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold tracking-tighter">
        {code}
      </span>
    </div>
  );
}

// =========================================================================
// CYBER ROBOT POD COMPONENT (SLEEK ROUNDED DOCK STATION)
// =========================================================================
function CyberRobotPod({
  agent,
  robot,
  isActive,
  status,
  thought,
  onClick,
}: {
  agent: AgentDefinition;
  robot: RobotMetadata;
  isActive: boolean;
  status: "idle" | "working" | "done" | "sync";
  thought?: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl border p-3 cursor-pointer transition-all duration-300 select-none ${
        isActive
          ? "border-amber-400 bg-amber-500/15 shadow-[0_0_25px_rgba(245,158,11,0.4)] scale-[1.03]"
          : "border-slate-800/80 bg-slate-900/90 hover:border-slate-600 hover:bg-slate-850 hover:shadow-xl"
      }`}
    >
      {/* Dynamic Subroutine Speech Bubble */}
      <div className="mb-2 relative">
        <div
          className={`rounded-xl p-1.5 text-[10px] leading-tight transition-all duration-300 ${
            isActive
              ? "bg-amber-400 text-slate-950 font-bold shadow-md animate-pulse"
              : "bg-slate-950/90 text-slate-300 border border-slate-800 group-hover:border-slate-600"
          }`}
        >
          <div className="truncate font-mono">{thought || robot?.idleThought}</div>
        </div>
      </div>

      {/* Robot Dock & Mecha Head */}
      <div className="flex items-center gap-3">
        <RobotMechaHead
          code={robot?.unitCode || "BOT"}
          visorColor={robot?.visorColor || "cyan"}
          isActive={isActive}
        />

        {/* Telemetry Display */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 truncate transition-colors">
              {robot?.robotName || agent.shortName}
            </h4>
            <span
              className={`text-[8px] px-1.5 py-0.2 rounded font-mono uppercase font-bold ${
                isActive
                  ? "bg-amber-400 text-slate-950"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {isActive ? "⚡ RUN" : "ONLINE"}
            </span>
          </div>

          {/* Terminal Screen Simulation */}
          <div className="mt-1.5 flex items-center justify-between bg-slate-950 rounded-lg px-2 py-1 border border-slate-800/90">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400 truncate">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="truncate">{agent.role.slice(0, 16)}</span>
            </div>
            <Monitor className="h-3 w-3 text-slate-500 shrink-0 ml-1" />
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="mt-2.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 group-hover:text-slate-200 font-mono">
        <span className="truncate">{robot?.coreFrequency || "4.5 GHz"} • {agent.capabilities[0]}</span>
        <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform shrink-0 font-bold">
          Buka Unit →
        </span>
      </div>
    </div>
  );
}
