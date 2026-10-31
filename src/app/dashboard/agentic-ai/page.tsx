"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AGENT_ROSTER,
  AGENT_DIVISIONS,
  AgentDefinition,
} from "@/lib/agentic/roster";
import {
  Bot,
  Sparkles,
  Play,
  Copy,
  Check,
  Search,
  Trash2,
  Filter,
  Activity,
  History,
  Sliders,
  Terminal,
  Target,
  FileText,
  Zap,
  Truck,
  Tag,
  RefreshCw,
  Scale,
  Package,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Database,
  Lock,
  Compass,
  Code2,
  CheckSquare,
  Palette,
  Cpu,
  ChevronRight,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Building2,
  Folder,
  FolderGit2,
  FileCode,
  Download,
  HardDrive,
  FolderTree,
  FilePlus,
} from "lucide-react";
import VirtualOfficeMap from "@/components/agentic/VirtualOfficeMap";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Helper map for dynamic Lucide icons
const ICON_MAP: Record<string, React.ElementType> = {
  Target,
  FileText,
  Zap,
  Truck,
  Tag,
  RefreshCw,
  Scale,
  Package,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Database,
  Activity,
  Sliders,
  Lock,
  Compass,
  Code2,
  CheckSquare,
  Palette,
  Cpu,
};

export default function AgenticAiDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "office" | "roster" | "console" | "logs" | "rules" | "files" | "approvals"
  >("office");

  // Shift Status for live tab notification
  const [shiftStatus, setShiftStatus] = useState<{ isRunning: boolean; remainingSeconds: number }>({
    isRunning: false,
    remainingSeconds: 0,
  });

  // Memoized shift handler to prevent render loops
  const handleShiftStatusChange = React.useCallback(
    (isRunning: boolean, remainingSeconds: number) => {
      setShiftStatus((prev) => {
        if (
          prev.isRunning === isRunning &&
          prev.remainingSeconds === remainingSeconds
        ) {
          return prev;
        }
        return { isRunning, remainingSeconds };
      });
    },
    []
  );

  // Real Output Files / Artifacts state
  const [files, setFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [fileCategoryFilter, setFileCategoryFilter] = useState<string>("ALL");
  const [fileSearchQuery, setFileSearchQuery] = useState<string>("");
  const [fileCopied, setFileCopied] = useState(false);
  const [deletingFilePath, setDeletingFilePath] = useState<string | null>(null);

  // Roster state
  const [selectedDivision, setSelectedDivision] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Console state
  const [selectedAgentId, setSelectedAgentId] = useState<string>("lead-prospector");
  const [promptInput, setPromptInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Logs state
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logSearch, setLogSearch] = useState("");
  const [selectedLogDetail, setSelectedLogDetail] = useState<any | null>(null);

  // Stats state
  const [stats, setStats] = useState({
    totalAgents: 20,
    totalExecutions: 0,
    successRate: 100,
    activeAgentsCount: 20,
  });

  // Business Rules state
  const [rules, setRules] = useState({
    minMarginPercent: 25,
    maxWastePercent: 12,
    stockThresholdKg: 300,
    aiProvider: "9router",
    apiKey: "",
    autoAuditEnabled: true,
  });
  const [rulesSaved, setRulesSaved] = useState(false);

  // 9Router State
  const [nineRouterConfig, setNineRouterConfig] = useState({
    baseUrl: "http://localhost:20128/v1",
    apiKey: "",
    model: "gpt-4o-mini",
  });
  const [nineRouterStatus, setNineRouterStatus] = useState<any>(null);
  const [testingNineRouter, setTestingNineRouter] = useState(false);

  // Approvals state
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loadingApprovals, setLoadingApprovals] = useState(false);
  const [approvalActionInProgress, setApprovalActionInProgress] = useState<string | null>(null);

  // Multi-Turn Session Memory state
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionChatThread, setSessionChatThread] = useState<Array<{ role: "user" | "assistant"; text: string; time: string }>>([]);

  // Autonomous Watchdog state
  const [watchdogResult, setWatchdogResult] = useState<any | null>(null);
  const [runningWatchdog, setRunningWatchdog] = useState(false);

  // Fetch stats, logs, files, approvals, watchdog, and 9router on mount
  useEffect(() => {
    fetchStats();
    fetchLogs();
    checkNineRouter();
    fetchFiles();
    fetchApprovals();
    fetchWatchdog();
  }, []);

  const fetchWatchdog = async () => {
    try {
      const res = await fetch("/api/agentic-ai/watchdog");
      const data = await res.json();
      if (data.success && data.result) {
        setWatchdogResult(data.result);
      }
    } catch (e) {
      console.error("Gagal load watchdog status:", e);
    }
  };

  const triggerWatchdogSweep = async () => {
    setRunningWatchdog(true);
    try {
      const res = await fetch("/api/agentic-ai/watchdog", { method: "POST" });
      const data = await res.json();
      if (data.success && data.result) {
        setWatchdogResult(data.result);
        await fetchLogs();
        await fetchStats();
      }
    } catch (e) {
      console.error("Gagal jalankan watchdog sweep:", e);
    } finally {
      setRunningWatchdog(false);
    }
  };

  const handleResetSession = () => {
    setCurrentSessionId(null);
    setSessionChatThread([]);
    setExecutionResult(null);
  };

  const fetchApprovals = async () => {
    setLoadingApprovals(true);
    try {
      const res = await fetch("/api/agentic-ai/actions");
      const data = await res.json();
      if (data.success && Array.isArray(data.actions)) {
        setApprovals(data.actions);
      }
    } catch (e) {
      console.error("Gagal load approvals:", e);
    } finally {
      setLoadingApprovals(false);
    }
  };

  const handleDecision = async (actionId: string, decision: "APPROVE" | "REJECT") => {
    setApprovalActionInProgress(actionId);
    try {
      const res = await fetch("/api/agentic-ai/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionId, decision }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchApprovals();
        await fetchLogs();
      }
    } catch (e) {
      console.error("Gagal submit approval:", e);
    } finally {
      setApprovalActionInProgress(null);
    }
  };

  const checkNineRouter = async () => {
    setTestingNineRouter(true);
    try {
      const res = await fetch("/api/agentic-ai/9router/test");
      const data = await res.json();
      setNineRouterStatus(data);
    } catch (e: any) {
      setNineRouterStatus({ online: false, message: "Koneksi gagal" });
    } finally {
      setTestingNineRouter(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/agentic-ai/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Gagal load stats:", e);
    }
  };

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch("/api/agentic-ai/logs?limit=40");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error("Gagal load logs:", e);
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchFiles = async () => {
    setLoadingFiles(true);
    try {
      const res = await fetch("/api/agentic-ai/files");
      const data = await res.json();
      if (data.success && Array.isArray(data.files)) {
        setFiles(data.files);
        if (data.files.length > 0) {
          setSelectedFile((prev: any) => {
            if (!prev) return data.files[0];
            const match = data.files.find((f: any) => f.relativePath === prev.relativePath);
            return match || data.files[0];
          });
        }
      }
    } catch (e) {
      console.error("Gagal load file artefak agen:", e);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleDeleteFile = async (relPath: string) => {
    if (!window.confirm(`Hapus berkas "${relPath}" secara permanen?`)) return;
    try {
      setDeletingFilePath(relPath);
      const res = await fetch(`/api/agentic-ai/files?path=${encodeURIComponent(relPath)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        await fetchFiles();
      } else {
        alert(data.error || "Gagal menghapus berkas.");
      }
    } catch (e: any) {
      alert("Error saat menghapus: " + e.message);
    } finally {
      setDeletingFilePath(null);
    }
  };

  const handleDownloadFile = (fileItem: any) => {
    const blob = new Blob([fileItem.content || ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileItem.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = async () => {
    if (!confirm("Apakah Anda yakin ingin membersihkan seluruh riwayat audit log?")) return;
    try {
      const res = await fetch("/api/agentic-ai/logs", { method: "DELETE" });
      if (res.ok) {
        setLogs([]);
        fetchStats();
      }
    } catch (e) {
      alert("Gagal membersihkan log");
    }
  };

  const handleSelectAgentForConsole = (agent: AgentDefinition) => {
    setSelectedAgentId(agent.id);
    setPromptInput(agent.samplePrompts[0]);
    setActiveTab("console");
  };

  const currentAgent =
    AGENT_ROSTER.find((a) => a.id === selectedAgentId) || AGENT_ROSTER[0];

  const handleRunAgent = async () => {
    setIsRunning(true);
    setExecutionResult(null);
    const promptToSend = promptInput || currentAgent.samplePrompts[0];
    const sid = currentSessionId || `sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    if (!currentSessionId) setCurrentSessionId(sid);

    try {
      const res = await fetch("/api/agentic-ai/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgentId,
          prompt: promptToSend,
          params: {
            nineRouterUrl: nineRouterConfig.baseUrl,
            apiKey: nineRouterConfig.apiKey,
            model: nineRouterConfig.model,
            sessionId: sid,
          },
        }),
      });

      const data = await res.json();
      setExecutionResult(data);
      if (data.sessionId) setCurrentSessionId(data.sessionId);

      // Add to conversation thread
      setSessionChatThread((prev) => [
        ...prev,
        { role: "user", text: promptToSend, time: new Date().toLocaleTimeString("id-ID") },
        { role: "assistant", text: data.output || "Selesai dieksekusi.", time: new Date().toLocaleTimeString("id-ID") },
      ]);
      setPromptInput("");

      fetchStats();
      fetchLogs();
      fetchApprovals();
    } catch (err: any) {
      setExecutionResult({
        success: false,
        status: "FAILED",
        output: "Terjadi gangguan jaringan saat memproses agent.",
        latencyMs: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyOutput = () => {
    if (!executionResult?.output) return;
    navigator.clipboard.writeText(executionResult.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    setRulesSaved(true);
    setTimeout(() => setRulesSaved(false), 3000);
  };

  // Filtered Roster
  const filteredRoster = AGENT_ROSTER.filter((agent) => {
    const matchDivision =
      selectedDivision === "ALL" || agent.division === selectedDivision;
    const matchSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDivision && matchSearch;
  });

  // Filtered Logs
  const filteredLogs = logs.filter((log) => {
    if (!logSearch) return true;
    const q = logSearch.toLowerCase();
    return (
      log.agentName?.toLowerCase().includes(q) ||
      log.action?.toLowerCase().includes(q) ||
      log.input?.toLowerCase().includes(q)
    );
  });

  // Filtered Artifact Files
  const filteredFiles = files.filter((f) => {
    const matchCat =
      fileCategoryFilter === "ALL" || f.category === fileCategoryFilter;
    const matchSearch =
      !fileSearchQuery ||
      f.fileName?.toLowerCase().includes(fileSearchQuery.toLowerCase()) ||
      f.relativePath?.toLowerCase().includes(fileSearchQuery.toLowerCase()) ||
      (f.content && f.content.toLowerCase().includes(fileSearchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 pb-16 w-full max-w-[1700px] mx-auto px-2 sm:px-4">
      {/* Page Header */}
      <PageHeader
        eyebrow="Autonomous Enterprise Suite"
        title="Agentic AI Command Center"
        description={`Pusat koordinasi ${AGENT_ROSTER.length} Agen AI Otonom untuk ekspansi pasar B2B, penyerapan limbah konveksi, efisiensi gudang, media sosial, dan software engineering.`}
        action={
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 py-1.5 px-3"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {AGENT_ROSTER.length} Agen Siap Beroperasi
            </Badge>
          </div>
        }
      />

      {/* Autonomous Cron Watchdog Status Bar */}
      <div className="bg-slate-950/80 border border-slate-800 p-3 sm:p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
            watchdogResult?.status === "CRITICAL"
              ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
              : watchdogResult?.status === "ATTENTION_REQUIRED"
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
          }`}>
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Autonomous Cron Watchdog (Background Sentinel)
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] font-mono uppercase font-bold py-0 ${
                  watchdogResult?.status === "CRITICAL"
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                    : watchdogResult?.status === "ATTENTION_REQUIRED"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                }`}
              >
                {watchdogResult?.status || "HEALTHY"}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {watchdogResult?.totalFindings
                ? `Terdeteksi ${watchdogResult.totalFindings} kondisi operasional yang diawasi otomatis.`
                : "Semua parameter stok, piutang, dan rendemen limbah berjalan normal."}
              {watchdogResult?.runAt && (
                <span className="text-slate-500 ml-1 font-mono">
                  (Terakhir: {new Date(watchdogResult.runAt).toLocaleTimeString("id-ID")})
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            disabled={runningWatchdog}
            onClick={triggerWatchdogSweep}
            className="h-8 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-950/40"
          >
            <RotateCw className={`h-3.5 w-3.5 mr-1.5 ${runningWatchdog ? "animate-spin" : ""}`} />
            {runningWatchdog ? "Memeriksa..." : "Jalankan Watchdog Sweep"}
          </Button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardContent className="p-4 sm:p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Total Roster
              </p>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                {stats.totalAgents} <span className="text-xs font-medium text-zinc-400">Agen</span>
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardContent className="p-4 sm:p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Aksi Dijalankan
              </p>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                {stats.totalExecutions} <span className="text-xs font-medium text-zinc-400">kali</span>
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardContent className="p-4 sm:p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Tingkat Sukses
              </p>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                {stats.successRate}%
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardContent className="p-4 sm:p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Status Integrasi DB
              </p>
              <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                <CheckCircle2 className="h-4 w-4" /> PostgreSQL Aktif
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ultra-Premium Futuristic Segmented Tab Navigation */}
      <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 p-2 rounded-2xl flex items-center gap-2 overflow-x-auto shadow-2xl shadow-cyan-950/20">
        {/* TAB 1: KANTOR VIRTUAL */}
        <button
          onClick={() => setActiveTab("office")}
          className={`flex items-center gap-2.5 py-2.5 px-4 text-xs font-bold rounded-xl transition-all duration-300 whitespace-nowrap group ${
            activeTab === "office"
              ? "bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 text-cyan-300 border border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.25)]"
              : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent hover:border-slate-800 font-medium"
          }`}
        >
          <div className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${
            activeTab === "office"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
              : "bg-slate-900 text-slate-400 group-hover:text-cyan-400"
          }`}>
            <Building2 className="h-4 w-4" />
          </div>
          <span className="font-bold tracking-wide">Kantor Virtual 2.5D</span>
          {shiftStatus.isRunning ? (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 px-2.5 py-0.5 text-[10px] font-bold animate-pulse">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              ⚡ Shift ({Math.floor(shiftStatus.remainingSeconds / 60)}m)
            </span>
          ) : (
            <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[10px] font-mono text-cyan-300/80">
              Interactive
            </span>
          )}
        </button>

        {/* TAB 2: ROSTER AGEN */}
        <button
          onClick={() => setActiveTab("roster")}
          className={`flex items-center gap-2.5 py-2.5 px-4 text-xs font-bold rounded-xl transition-all duration-300 whitespace-nowrap group ${
            activeTab === "roster"
              ? "bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 text-blue-300 border border-blue-500/50 shadow-[0_0_25px_rgba(59,130,246,0.25)]"
              : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent hover:border-slate-800 font-medium"
          }`}
        >
          <div className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${
            activeTab === "roster"
              ? "bg-blue-500/20 text-blue-300 border border-blue-400/40"
              : "bg-slate-900 text-slate-400 group-hover:text-blue-400"
          }`}>
            <Bot className="h-4 w-4" />
          </div>
          <span className="font-bold tracking-wide">Roster {AGENT_ROSTER.length} Agen</span>
          <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-mono text-blue-300">
            {AGENT_ROSTER.length} Unit
          </span>
        </button>

        {/* TAB 3: CONSOLE */}
        <button
          onClick={() => setActiveTab("console")}
          className={`flex items-center gap-2.5 py-2.5 px-4 text-xs font-bold rounded-xl transition-all duration-300 whitespace-nowrap group ${
            activeTab === "console"
              ? "bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 text-purple-300 border border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.25)]"
              : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent hover:border-slate-800 font-medium"
          }`}
        >
          <div className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${
            activeTab === "console"
              ? "bg-purple-500/20 text-purple-300 border border-purple-400/40"
              : "bg-slate-900 text-slate-400 group-hover:text-purple-400"
          }`}>
            <Terminal className="h-4 w-4" />
          </div>
          <span className="font-bold tracking-wide">Interactive Console</span>
          {isRunning ? (
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          ) : (
            <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] font-mono text-purple-300/80">
              Live LLM
            </span>
          )}
        </button>

        {/* TAB 3.5: APPROVALS & AUTHORIZATION */}
        <button
          onClick={() => {
            setActiveTab("approvals");
            fetchApprovals();
          }}
          className={`flex items-center gap-2.5 py-2.5 px-4 text-xs font-bold rounded-xl transition-all duration-300 whitespace-nowrap group ${
            activeTab === "approvals"
              ? "bg-gradient-to-r from-orange-950/80 via-slate-900 to-amber-950/80 text-orange-300 border border-orange-500/50 shadow-[0_0_25px_rgba(249,115,22,0.25)]"
              : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent hover:border-slate-800 font-medium"
          }`}
        >
          <div className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${
            activeTab === "approvals"
              ? "bg-orange-500/20 text-orange-300 border border-orange-400/40"
              : "bg-slate-900 text-slate-400 group-hover:text-orange-400"
          }`}>
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="font-bold tracking-wide">Otorisasi & Approval</span>
          {approvals.filter((a) => a.status === "REQUIRE_APPROVAL").length > 0 ? (
            <span className="flex items-center gap-1.5 rounded-full bg-orange-500/20 border border-orange-400/50 text-orange-300 px-2.5 py-0.5 text-[10px] font-bold animate-pulse">
              <span className="h-2 w-2 rounded-full bg-orange-400 animate-ping" />
              {approvals.filter((a) => a.status === "REQUIRE_APPROVAL").length} Antrean
            </span>
          ) : (
            <span className="rounded-full bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-mono text-slate-400">
              Clear
            </span>
          )}
        </button>

        {/* TAB 4: LOGS & AUDIT */}
        <button
          onClick={() => {
            setActiveTab("logs");
            fetchLogs();
          }}
          className={`flex items-center gap-2.5 py-2.5 px-4 text-xs font-bold rounded-xl transition-all duration-300 whitespace-nowrap group ${
            activeTab === "logs"
              ? "bg-gradient-to-r from-amber-950/80 via-slate-900 to-orange-950/80 text-amber-300 border border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.25)]"
              : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent hover:border-slate-800 font-medium"
          }`}
        >
          <div className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${
            activeTab === "logs"
              ? "bg-amber-500/20 text-amber-300 border border-amber-400/40"
              : "bg-slate-900 text-slate-400 group-hover:text-amber-400"
          }`}>
            <History className="h-4 w-4" />
          </div>
          <span className="font-bold tracking-wide">Pelacakan Log & Audit</span>
          <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-mono text-amber-300">
            {logs.length} Log
          </span>
        </button>

        {/* TAB 5: FILES & OUTPUT */}
        <button
          onClick={() => {
            setActiveTab("files");
            fetchFiles();
          }}
          className={`flex items-center gap-2.5 py-2.5 px-4 text-xs font-bold rounded-xl transition-all duration-300 whitespace-nowrap group ${
            activeTab === "files"
              ? "bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 text-emerald-300 border border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.25)]"
              : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent hover:border-slate-800 font-medium"
          }`}
        >
          <div className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${
            activeTab === "files"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
              : "bg-slate-900 text-slate-400 group-hover:text-emerald-400"
          }`}>
            <FolderTree className="h-4 w-4" />
          </div>
          <span className="font-bold tracking-wide">File & Dokumen Agen</span>
          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 text-[10px] font-mono font-bold">
            {files.length} Berkas
          </span>
        </button>

        {/* TAB 6: RULES & CONFIG */}
        <button
          onClick={() => setActiveTab("rules")}
          className={`flex items-center gap-2.5 py-2.5 px-4 text-xs font-bold rounded-xl transition-all duration-300 whitespace-nowrap group ${
            activeTab === "rules"
              ? "bg-gradient-to-r from-rose-950/80 via-slate-900 to-pink-950/80 text-rose-300 border border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.25)]"
              : "text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent hover:border-slate-800 font-medium"
          }`}
        >
          <div className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${
            activeTab === "rules"
              ? "bg-rose-500/20 text-rose-300 border border-rose-400/40"
              : "bg-slate-900 text-slate-400 group-hover:text-rose-400"
          }`}>
            <Sliders className="h-4 w-4" />
          </div>
          <span className="font-bold tracking-wide">Aturan Bisnis & Konfig</span>
        </button>
      </div>

      {/* ==================== TAB 0: VIRTUAL OFFICE 2.5D (GAME MODE - KEPT MOUNTED AGAR TIDAK BERHENTI SAAT PINDAH TAB) ==================== */}
      <div className={activeTab === "office" ? "block" : "hidden"}>
        <VirtualOfficeMap
          onSelectAgentForConsole={(agentId) => {
            setSelectedAgentId(agentId);
            setActiveTab("console");
          }}
          onRefreshStats={() => {
            fetchStats();
            fetchLogs();
            fetchFiles();
          }}
          onNavigateToFiles={() => {
            setActiveTab("files");
            fetchFiles();
          }}
          onShiftStatusChange={handleShiftStatusChange}
          nineRouterOnline={nineRouterStatus?.online ?? true}
          activeModel={nineRouterStatus?.model || "ag/gemini-3.8-flash-high"}
        />
      </div>

      {/* ==================== TAB 1: ROSTER 20 AGENT ==================== */}
      {activeTab === "roster" && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              {AGENT_DIVISIONS.map((div) => (
                <Button
                  key={div.id}
                  variant={selectedDivision === div.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDivision(div.id)}
                  className="text-xs h-8 rounded-lg"
                >
                  {div.label}
                </Button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Cari agen atau kemampuan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
          </div>

          {/* Roster Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRoster.map((agent) => {
              const IconComponent = ICON_MAP[agent.iconName] || Bot;

              return (
                <Card
                  key={agent.id}
                  className="border-zinc-200 dark:border-zinc-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-200 shadow-sm flex flex-col justify-between"
                >
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-primary flex items-center justify-center shrink-0">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            {agent.name}
                          </CardTitle>
                          <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {agent.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${agent.badgeColor}`}
                      >
                        {agent.divisionLabel}
                      </span>
                      <p className="mt-2.5 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {agent.description}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 mt-auto">
                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Kemampuan Utama
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {agent.capabilities.map((cap, i) => (
                          <span
                            key={i}
                            className="bg-zinc-100 dark:bg-zinc-800/60 text-zinc-650 dark:text-zinc-350 text-[10px] px-2 py-0.5 rounded-md font-medium"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>

                      <Button
                        onClick={() => handleSelectAgentForConsole(agent)}
                        className="w-full h-8 text-xs font-semibold gap-1.5"
                        variant="default"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        Jalankan Agen di Console
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== TAB 2: INTERACTIVE CONSOLE ==================== */}
      {activeTab === "console" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Panel: Agent Control & Input */}
          <div className="lg:col-span-5 space-y-5">
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" />
                  Konfigurasi Perintah Agen
                </CardTitle>
                <CardDescription className="text-xs">
                  Pilih agen spesialis dan tentukan target tugas yang ingin dianalisis atau dieksekusi.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-4">
                {/* Agent Selector Dropdown */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5 block">
                    Pilih Agen Spesialis ({AGENT_ROSTER.length} Agen)
                  </label>
                  <select
                    value={selectedAgentId}
                    onChange={(e) => {
                      const newId = e.target.value;
                      setSelectedAgentId(newId);
                      const a = AGENT_ROSTER.find((x) => x.id === newId);
                      if (a) setPromptInput(a.samplePrompts[0]);
                    }}
                    className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-1 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                  >
                    {AGENT_ROSTER.map((a) => (
                      <option key={a.id} value={a.id}>
                        [{a.division}] {a.name} - {a.role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Agent Quick Info */}
                <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 p-3 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {currentAgent.name}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {currentAgent.divisionLabel}
                    </Badge>
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                    {currentAgent.description}
                  </p>
                </div>

                {/* Sample Prompt Selector */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 block">
                    Contoh Instruksi Rekomendasi
                  </label>
                  <div className="space-y-1.5">
                    {currentAgent.samplePrompts.map((sp, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPromptInput(sp)}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-colors border ${
                          promptInput === sp
                            ? "bg-primary/10 border-primary text-primary font-medium"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                        }`}
                      >
                        <span className="line-clamp-2">💡 {sp}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt Custom Textarea */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5 block">
                    Instruksi / Pertanyaan Kustom
                  </label>
                  <Textarea
                    rows={4}
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="Ketik instruksi spesifik untuk agen ini..."
                    className="text-xs leading-relaxed"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleRunAgent}
                  disabled={isRunning}
                  className="w-full font-bold gap-2 text-xs h-10 shadow-md"
                >
                  {isRunning ? (
                    <>
                      <RotateCw className="h-4 w-4 animate-spin" />
                      Mengeksekusi Data & Analisis...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-current" />
                      Jalankan Agen Sekarang
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Output & Deliverable View */}
          <div className="lg:col-span-7 space-y-5">
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm min-h-[520px] flex flex-col justify-between">
              <CardHeader className="p-5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-500" />
                      Hasil Eksekusi & Dokumen Deliverable
                    </CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Output terstruktur yang siap disalin, dicetak, atau ditindaklanjuti.
                    </CardDescription>
                  </div>

                  {currentSessionId && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-mono text-cyan-300 border-cyan-500/40 bg-cyan-950/40">
                        Sesi: {currentSessionId.substring(0, 16)}...
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleResetSession}
                        className="h-6 text-[10px] text-slate-400 hover:text-rose-400 px-2"
                      >
                        Sesi Baru
                      </Button>
                    </div>
                  )}

                  {executionResult && (
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          executionResult.status === "SUCCESS"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                            : "bg-rose-50 text-rose-700 border-rose-300"
                        }
                      >
                        {executionResult.status} ({executionResult.latencyMs} ms)
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopyOutput}
                        className="h-7 text-xs gap-1"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" /> Disalin
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" /> Salin Hasil
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-5 flex-1 flex flex-col">
                {isRunning ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-16 text-center space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center animate-bounce">
                      <Bot className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      Agen {currentAgent.name} sedang bekerja...
                    </p>
                    <p className="text-xs text-zinc-500 max-w-sm">
                      Membaca data PostgreSQL, mengingat konteks sesi, serta merumuskan dokumen keputusan.
                    </p>
                  </div>
                ) : executionResult ? (
                  <div className="space-y-4 flex-1">
                    {/* Render Multi-Turn Previous Dialogues if any */}
                    {sessionChatThread.length > 2 && (
                      <div className="space-y-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                        <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                          Riwayat Dialog Sesi Ini ({sessionChatThread.length / 2} Percakapan):
                        </div>
                        {sessionChatThread.slice(0, -2).map((item, idx) => (
                          <div key={idx} className="flex gap-2 text-[11px] leading-relaxed">
                            <span className={item.role === "user" ? "text-cyan-400 font-bold" : "text-emerald-400 font-bold"}>
                              {item.role === "user" ? "Anda:" : "Agen:"}
                            </span>
                            <span className="text-slate-300 truncate">{item.text.replace(/^[>#\s*]+/g, "").substring(0, 90)}...</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Render Image Previews if generated by visual tools */}
                    {(() => {
                      const imgRegex = /!\[(.*?)\]\(((?:\/generated-images\/|https?:\/\/)[^\s)]+)\)/g;
                      const matches = Array.from(executionResult.output.matchAll(imgRegex));
                      if (matches.length === 0) return null;
                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                          {matches.map((m: any, idx: number) => (
                            <div key={idx} className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                                <span className="truncate font-bold text-cyan-300">{m[1] || "Hasil Gambar AI"}</span>
                                <span className="text-emerald-400">100% Free Flux</span>
                              </div>
                              <img
                                src={m[2]}
                                alt={m[1] || "AI Image"}
                                className="w-full h-48 object-cover rounded-lg border border-slate-700 shadow-lg hover:scale-[1.01] transition-transform bg-slate-950"
                              />
                              <div className="flex items-center justify-between pt-1">
                                <a
                                  href={m[2]}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] text-cyan-400 hover:text-cyan-200 underline font-mono flex items-center gap-1"
                                >
                                  Buka Resolusi Penuh ↗
                                </a>
                                <span className="text-[10px] text-slate-500 font-mono">public{m[2]}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}

                    {/* Render Formatted Markdown Content */}
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-4 sm:p-5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-normal leading-relaxed whitespace-pre-wrap select-text max-h-[620px] overflow-y-auto">
                      {executionResult.output}
                    </div>

                    {executionResult.structuredData && (
                      <div className="rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/50 p-3">
                        <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-1">
                          Metadata & Analitika Terverifikasi:
                        </p>
                        <pre className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 overflow-x-auto">
                          {JSON.stringify(executionResult.structuredData, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-16 text-center space-y-3 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl my-auto">
                    <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center">
                      <Terminal className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      Belum ada aksi yang dijalankan
                    </p>
                    <p className="text-xs text-zinc-500 max-w-sm">
                      Pilih instruksi di panel kiri dan klik tombol{" "}
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        "Jalankan Agen Sekarang"
                      </span>{" "}
                      untuk melihat analisis data cerdas.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: AUDIT & LOGS ==================== */}
      {activeTab === "logs" && (
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="p-5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  Jejak Audit Aktivitas Agen (Activity & Audit Trail)
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Setiap aksi dan keputusan agen terekam secara permanen di database PostgreSQL untuk akuntabilitas bisnis.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={fetchLogs}
                  disabled={loadingLogs}
                  className="h-8 text-xs gap-1.5"
                >
                  <RotateCw className={`h-3.5 w-3.5 ${loadingLogs ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleClearLogs}
                  className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Bersihkan Log
                </Button>
              </div>
            </div>

            <div className="pt-3">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Cari dalam riwayat log..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loadingLogs ? (
              <div className="py-16 text-center text-xs text-zinc-500">
                Memuat riwayat log dari database...
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="py-16 text-center text-xs text-zinc-500">
                Belum ada catatan log aktivitas. Jalankan agen di tab Console terlebih dahulu.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase tracking-wider font-bold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Waktu</th>
                      <th className="py-3 px-4">Agen & Divisi</th>
                      <th className="py-3 px-4">Peran / Aksi</th>
                      <th className="py-3 px-4">Instruksi Prompt</th>
                      <th className="py-3 px-4">Status & Latency</th>
                      <th className="py-3 px-4 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                    {filteredLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors"
                      >
                        <td className="py-3 px-4 text-zinc-500 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                          <span className="block text-[10px] text-zinc-400">
                            {new Date(log.createdAt).toLocaleDateString("id-ID")}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                            {log.agentName}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            Divisi {log.division}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-zinc-650 dark:text-zinc-350 max-w-[180px] truncate">
                          {log.action}
                        </td>
                        <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 max-w-[260px] truncate">
                          "{log.input}"
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              log.status === "SUCCESS"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                : "bg-rose-50 text-rose-700 border-rose-300"
                            }`}
                          >
                            {log.status} ({log.latencyMs || 0} ms)
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedLogDetail(log)}
                            className="h-7 text-xs font-semibold text-primary hover:text-primary-hover"
                          >
                            Lihat Detail
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ==================== TAB 4: BUSINESS RULES & CONFIG ==================== */}
      {activeTab === "rules" && (
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm max-w-3xl">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" />
              Aturan Bisnis & Konfigurasi Engine AI
            </CardTitle>
            <CardDescription className="text-xs">
              Atur batas toleransi risiko bisnis dan parameter kalkulasi otomatis yang dipatuhi oleh seluruh agen.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 pt-3">
            <form onSubmit={handleSaveRules} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Target Minimal Gross Margin (%)
                  </label>
                  <Input
                    type="number"
                    value={rules.minMarginPercent}
                    onChange={(e) =>
                      setRules({ ...rules, minMarginPercent: Number(e.target.value) })
                    }
                    className="h-9 text-xs"
                  />
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Agen Quotation & Margin Guard akan menolak penawaran di bawah margin ini.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Batas Toleransi Susut Sampah Sortir (%)
                  </label>
                  <Input
                    type="number"
                    value={rules.maxWastePercent}
                    onChange={(e) =>
                      setRules({ ...rules, maxWastePercent: Number(e.target.value) })
                    }
                    className="h-9 text-xs"
                  />
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Agen QC akan membunyikan alarm anomali jika susut bal melebihi batas ini.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Ambang Batas Re-Order Stok (kg)
                  </label>
                  <Input
                    type="number"
                    value={rules.stockThresholdKg}
                    onChange={(e) =>
                      setRules({ ...rules, stockThresholdKg: Number(e.target.value) })
                    }
                    className="h-9 text-xs"
                  />
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Batas aman stok sebelum Agen Inventory menyarankan pembelian bal baru.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Mode Engine LLM
                  </label>
                  <select
                    value={rules.aiProvider}
                    onChange={(e) =>
                      setRules({ ...rules, aiProvider: e.target.value })
                    }
                    className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 text-xs text-zinc-900 dark:text-zinc-100 font-medium"
                  >
                    <option value="9router">9Router (Universal Proxy / Local Gateway)</option>
                    <option value="local">Autonomous Local Engine (Offline)</option>
                  </select>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Gateway terpadu untuk menghubungkan seluruh agen AI.
                  </p>
                </div>
              </div>

              {/* 9Router Dedicated Setup Card */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/5 p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                      9R
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        Integrasi 9Router Gateway (v0.5.75)
                      </h4>
                      <p className="text-[11px] text-zinc-500">
                        OpenAI-compatible reverse proxy multi-model untuk Next.js.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={checkNineRouter}
                    disabled={testingNineRouter}
                    className="h-7 text-xs gap-1.5"
                  >
                    <RotateCw
                      className={`h-3 w-3 ${testingNineRouter ? "animate-spin" : ""}`}
                    />
                    Test Koneksi
                  </Button>
                </div>

                {/* 9Router Status Banner */}
                {nineRouterStatus && (
                  <div
                    className={`rounded-lg p-2.5 text-xs flex items-center gap-2 border ${
                      nineRouterStatus.online
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300"
                        : "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300"
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                        nineRouterStatus.online
                          ? "bg-emerald-500 animate-pulse"
                          : "bg-amber-500"
                      }`}
                    />
                    <div className="flex-1">
                      <span className="font-bold">
                        {nineRouterStatus.online
                          ? "9Router Online & Terhubung!"
                          : "9Router Siap Dijalankan"}
                      </span>
                      <p className="text-[11px] opacity-90 mt-0.5">
                        {nineRouterStatus.message}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-650 dark:text-zinc-350 block mb-1">
                      9Router Base URL Endpoint
                    </label>
                    <Input
                      type="text"
                      value={nineRouterConfig.baseUrl}
                      onChange={(e) =>
                        setNineRouterConfig({
                          ...nineRouterConfig,
                          baseUrl: e.target.value,
                        })
                      }
                      className="h-8 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-650 dark:text-zinc-350 block mb-1">
                      Model Target yang Digunakan
                    </label>
                    <Input
                      type="text"
                      placeholder="gpt-4o-mini / claude-3-5-sonnet"
                      value={nineRouterConfig.model}
                      onChange={(e) =>
                        setNineRouterConfig({
                          ...nineRouterConfig,
                          model: e.target.value,
                        })
                      }
                      className="h-8 text-xs font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-zinc-650 dark:text-zinc-350 block mb-1">
                      9Router API Key (Diambil dari Dashboard 9Router Anda)
                    </label>
                    <Input
                      type="password"
                      placeholder="sk-9router-..."
                      value={nineRouterConfig.apiKey}
                      onChange={(e) =>
                        setNineRouterConfig({
                          ...nineRouterConfig,
                          apiKey: e.target.value,
                        })
                      }
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500 bg-white dark:bg-zinc-950 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  💡 <strong>Status 9Router:</strong> 9Router Anda sedang aktif di <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded font-mono text-primary font-bold">http://localhost:20128</code>. Cukup salin API Key dari dashboard 9Router Anda dan paste di kolom atas untuk mulai menghasilkan analisis AI 100% real-time!
                </div>
              </div>


              <div className="pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
                <Button type="submit" className="font-bold text-xs h-9">
                  Simpan Aturan Bisnis
                </Button>
                {rulesSaved && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="h-4 w-4" /> Pengaturan berhasil disimpan ke sistem!
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ==================== TAB 5: FILE & ARTIFACT REPOSITORY ==================== */}
      {activeTab === "files" && (
        <div className="space-y-6">
          {/* Header Banner & Safe Folder Guarantee */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-zinc-950 p-5 shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/40 text-xs px-2.5 py-0.5 font-mono">
                    <HardDrive className="h-3 w-3 mr-1" /> WORKSPACE ISOLATED STORAGE
                  </Badge>
                  <span className="text-xs text-zinc-400">
                    Lokasi Fisik: <code className="bg-zinc-800 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">src/generated-artifacts/</code>
                  </span>
                </div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <FolderGit2 className="h-5 w-5 text-emerald-400" />
                  Berkas & Hasil Karya {AGENT_ROSTER.length} Agen AI
                </h3>
                <p className="text-xs text-zinc-300 max-w-3xl leading-relaxed">
                  Semua berkas komponen React/Next.js (<code className="text-cyan-300">.tsx</code>), dokumen arsitektur PRD (<code className="text-purple-300">.md</code>), laporan data analisa (<code className="text-amber-300">.csv/.json</code>), dan skrip query database (<code className="text-emerald-300">.sql</code>) yang diciptakan oleh para robot tersimpan asli di dalam folder proyek Anda. Berkas dapat di-import langsung ke halaman Next.js Anda tanpa menyangsang ke luar workspace.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  onClick={fetchFiles}
                  disabled={loadingFiles}
                  variant="outline"
                  className="bg-zinc-900 border-zinc-700 hover:border-emerald-500 text-zinc-200 hover:text-white text-xs h-9 font-semibold"
                >
                  <RotateCw className={`h-3.5 w-3.5 mr-1.5 ${loadingFiles ? "animate-spin text-emerald-400" : ""}`} />
                  Muat Ulang Berkas
                </Button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-zinc-800/80">
              <div className="bg-zinc-900/80 rounded-xl p-2.5 border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Total Berkas</div>
                <div className="text-lg font-black text-white mt-0.5">{files.length} <span className="text-xs font-normal text-zinc-400">file</span></div>
              </div>
              <div className="bg-zinc-900/80 rounded-xl p-2.5 border border-zinc-800">
                <div className="text-[10px] text-cyan-400 uppercase font-semibold">Komponen TSX</div>
                <div className="text-lg font-black text-cyan-400 mt-0.5">
                  {files.filter(f => f.category === "component").length} <span className="text-xs font-normal text-zinc-400">komponen</span>
                </div>
              </div>
              <div className="bg-zinc-900/80 rounded-xl p-2.5 border border-zinc-800">
                <div className="text-[10px] text-purple-400 uppercase font-semibold">Dokumen PRD</div>
                <div className="text-lg font-black text-purple-400 mt-0.5">
                  {files.filter(f => f.category === "document").length} <span className="text-xs font-normal text-zinc-400">dokumen</span>
                </div>
              </div>
              <div className="bg-zinc-900/80 rounded-xl p-2.5 border border-zinc-800">
                <div className="text-[10px] text-emerald-400 uppercase font-semibold">Laporan & SQL</div>
                <div className="text-lg font-black text-emerald-400 mt-0.5">
                  {files.filter(f => f.category === "sql" || f.category === "report").length} <span className="text-xs font-normal text-zinc-400">file</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Category Filter Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: "ALL", label: "Semua File", count: files.length },
                { id: "component", label: "💻 Komponen (.tsx)", count: files.filter(f => f.category === "component").length },
                { id: "document", label: "📄 Dokumen (.md)", count: files.filter(f => f.category === "document").length },
                { id: "report", label: "📊 Laporan Data", count: files.filter(f => f.category === "report").length },
                { id: "sql", label: "🗄️ Query SQL", count: files.filter(f => f.category === "sql").length },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setFileCategoryFilter(pill.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    fileCategoryFilter === pill.id
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  <span>{pill.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    fileCategoryFilter === pill.id ? "bg-emerald-800 text-emerald-100" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                  }`}>
                    {pill.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72 shrink-0">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Cari nama berkas atau isi..."
                value={fileSearchQuery}
                onChange={(e) => setFileSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>

          {/* Main Two-Column File Explorer & Code Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: File List */}
            <div className="lg:col-span-5 space-y-2.5">
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                <span>Daftar Berkas Fisik ({filteredFiles.length})</span>
                {loadingFiles && <span className="text-emerald-500 animate-pulse text-[11px]">Memuat...</span>}
              </div>

              <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
                {filteredFiles.map((f) => {
                  const isSelected = selectedFile?.relativePath === f.relativePath;
                  const isDeleting = deletingFilePath === f.relativePath;

                  let badgeColor = "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300";
                  if (f.category === "component") badgeColor = "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30";
                  else if (f.category === "document") badgeColor = "bg-purple-500/15 text-purple-400 border border-purple-500/30";
                  else if (f.category === "sql") badgeColor = "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
                  else if (f.category === "report") badgeColor = "bg-amber-500/15 text-amber-400 border border-amber-500/30";

                  return (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFile(f)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "bg-emerald-950/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/40"
                          : "bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                            f.category === "component" ? "bg-cyan-500/10 text-cyan-400" :
                            f.category === "document" ? "bg-purple-500/10 text-purple-400" :
                            f.category === "sql" ? "bg-emerald-500/10 text-emerald-400" :
                            "bg-amber-500/10 text-amber-400"
                          }`}>
                            {f.category === "component" ? <Code2 className="h-4 w-4" /> :
                             f.category === "document" ? <FileText className="h-4 w-4" /> :
                             f.category === "sql" ? <Database className="h-4 w-4" /> :
                             <FileCode className="h-4 w-4" />}
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate flex items-center gap-1.5">
                              {f.fileName}
                            </h4>
                            <p className="text-[10px] font-mono text-zinc-400 truncate mt-0.5">
                              {f.relativePath}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-400">
                              <span className={`px-1.5 py-0.2 rounded font-mono uppercase text-[9px] font-bold ${badgeColor}`}>
                                {f.category}
                              </span>
                              <span>• {(f.sizeBytes / 1024).toFixed(1)} KB</span>
                              <span>• {new Date(f.updatedAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isDeleting}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(f.relativePath);
                          }}
                          className="h-7 w-7 p-0 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg shrink-0"
                          title="Hapus berkas fisik"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {filteredFiles.length === 0 && !loadingFiles && (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 space-y-2">
                    <FileCode className="h-8 w-8 text-zinc-500 mx-auto" />
                    <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Belum ada berkas artefak.</p>
                    <p className="text-[11px] text-zinc-400">
                      Tugaskan robot Fullstack Code Builder (DEV-01) atau PM Architect (PRD-02) di Kantor Virtual untuk menghasilkan kode & dokumen riil!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Code & Document Viewer */}
            <div className="lg:col-span-7">
              {selectedFile ? (
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col h-full">
                  <CardHeader className="p-4 bg-zinc-50/80 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {selectedFile.fileName}
                        </span>
                        <Badge variant="outline" className="text-[10px] uppercase font-mono py-0">
                          {selectedFile.category}
                        </Badge>
                      </div>
                      <p className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                        {selectedFile.relativePath} • {(selectedFile.sizeBytes / 1024).toFixed(1)} KB • Diperbarui {new Date(selectedFile.updatedAt).toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Buka Halaman Live Route */}
                      <a
                        href={`/preview/${selectedFile.fileName.replace(/\.[^/.]+$/, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950/40 transition-all"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Buka Halaman Live</span>
                      </a>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedFile.content || "");
                          setFileCopied(true);
                          setTimeout(() => setFileCopied(false), 2000);
                        }}
                        className="h-8 text-xs font-bold bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                      >
                        {fileCopied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                        {fileCopied ? "Tersalin!" : "Salin Isi"}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadFile(selectedFile)}
                        className="h-8 text-xs font-bold bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Unduh
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteFile(selectedFile.relativePath)}
                        className="h-8 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Hapus
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 flex-1 flex flex-col">
                    {/* Live Route & Integration Banner */}
                    <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border-b border-cyan-500/30 px-4 py-2.5 text-xs text-cyan-300 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                        <span className="font-bold text-white">Route Halaman Aktif:</span>
                        <code className="bg-slate-950 px-2 py-0.5 rounded text-[11px] font-mono text-cyan-300 border border-cyan-500/30">
                          /preview/{selectedFile.fileName.replace(/\.[^/.]+$/, "")}
                        </code>
                      </div>
                      <a
                        href={`/preview/${selectedFile.fileName.replace(/\.[^/.]+$/, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-200 underline"
                      >
                        Uji & Tampilkan di Browser ↗
                      </a>
                    </div>

                    {/* Preformatted Code Content */}
                    <div className="p-4 bg-zinc-950 flex-1 overflow-x-auto min-h-[420px] max-h-[600px] overflow-y-auto">
                      <pre className="font-mono text-xs text-zinc-200 leading-relaxed whitespace-pre font-medium">
                        {selectedFile.content || "// Berkas kosong."}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-400">
                  <Folder className="h-12 w-12 text-zinc-500 mb-3" />
                  <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Pilih Berkas untuk Melihat Isi & Kode</h4>
                  <p className="text-xs text-zinc-400 max-w-sm mt-1">
                    Klik salah satu berkas di daftar sebelah kiri untuk mempratinjau kode sumber, menyalin, atau mengunduhnya.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 7: APPROVALS & AUTHORIZATION ==================== */}
      {activeTab === "approvals" && (
        <div className="space-y-6">
          <Card className="border border-slate-800 bg-slate-950/70 shadow-xl backdrop-blur-xl">
            <CardHeader className="pb-3 border-b border-slate-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                    <ShieldCheck className="h-5 w-5 text-orange-400" />
                    Pusat Otorisasi & Persetujuan Mutasi Bisnis (Human-in-the-Loop)
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400 mt-1">
                    Semua tindakan kritis yang diusulkan oleh AI Agent (Draf Penjualan, Purchase Order, Pengeluaran) membutuhkan otorisasi admin sebelum resmi dicatat ke database ERP.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={fetchApprovals}
                  disabled={loadingApprovals}
                  className="h-8 text-xs bg-slate-900 border-slate-700 text-slate-300 hover:text-white"
                >
                  <RotateCw className={`h-3.5 w-3.5 mr-1.5 ${loadingApprovals ? "animate-spin" : ""}`} />
                  Segarkan Antrean
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              {approvals.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                  <ShieldCheck className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-300">Tidak Ada Antrean Otorisasi</p>
                  <p className="text-xs text-slate-500 mt-1">Saat agen mengusulkan tindakan perubahan data, item approval akan muncul di sini.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {approvals.map((act) => {
                    const isPending = act.status === "REQUIRE_APPROVAL";
                    const isApproved = act.status === "APPROVED";
                    const isProcessing = approvalActionInProgress === act.id;

                    return (
                      <div
                        key={act.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isPending
                            ? "bg-slate-900/80 border-orange-500/40 shadow-lg shadow-orange-950/20"
                            : isApproved
                            ? "bg-slate-900/40 border-emerald-500/30 opacity-85"
                            : "bg-slate-900/40 border-rose-500/30 opacity-70"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-mono uppercase font-bold ${
                                  isPending
                                    ? "bg-orange-500/20 text-orange-300 border-orange-500/40 animate-pulse"
                                    : isApproved
                                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                    : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                                }`}
                              >
                                {act.status}
                              </Badge>
                              <span className="font-mono text-xs font-bold text-cyan-300">
                                {act.toolName}
                              </span>
                              <span className="text-slate-500">•</span>
                              <span className="text-xs text-slate-400 font-medium">
                                Diusulkan oleh: <span className="text-slate-200 font-semibold">{act.agentName || "AI Agent"}</span> ({act.division || "Divisi"})
                              </span>
                              <span className="text-slate-500">•</span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {act.createdAt ? new Date(act.createdAt).toLocaleString("id-ID") : ""}
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                              {act.reason}
                            </p>

                            {/* Payload Details */}
                            {act.payload && (
                              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg text-xs space-y-1 font-mono">
                                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Ringkasan Payload Mutasi:</div>
                                {act.payload.customerName && (
                                  <div className="text-slate-300">Pelanggan: <span className="text-white font-bold">{act.payload.customerName}</span></div>
                                )}
                                {act.payload.productCodeOrName && (
                                  <div className="text-slate-300">Produk: <span className="text-white font-bold">{act.payload.productCodeOrName}</span></div>
                                )}
                                {act.payload.quantityKg !== undefined && (
                                  <div className="text-slate-300">Volume: <span className="text-amber-300 font-bold">{act.payload.quantityKg} kg</span></div>
                                )}
                                {act.payload.pricePerKg !== undefined && (
                                  <div className="text-slate-300">Harga: <span className="text-emerald-300 font-bold">Rp {Number(act.payload.pricePerKg).toLocaleString("id-ID")}/kg</span></div>
                                )}
                                {act.payload.estimatedSubtotal !== undefined && (
                                  <div className="text-slate-300">Total Nilai: <span className="text-emerald-400 font-bold">Rp {Number(act.payload.estimatedSubtotal).toLocaleString("id-ID")}</span></div>
                                )}
                              </div>
                            )}

                            {/* Commit Message feedback if approved */}
                            {act.commitMessage && (
                              <div className="bg-emerald-950/40 border border-emerald-500/40 p-2.5 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                                <span>{act.commitMessage}</span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          {isPending && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                size="sm"
                                disabled={isProcessing}
                                onClick={() => handleDecision(act.id, "APPROVE")}
                                className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/30"
                              >
                                {isProcessing ? (
                                  <RotateCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                                ) : (
                                  <Check className="h-3.5 w-3.5 mr-1.5" />
                                )}
                                Setujui & Bukukan ke DB
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isProcessing}
                                onClick={() => handleDecision(act.id, "REJECT")}
                                className="h-8 border-rose-600/50 text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 text-xs"
                              >
                                Tolak
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Inspect Log Detail Modal */}
      {selectedLogDetail && (
        <Dialog
          open={!!selectedLogDetail}
          onOpenChange={() => setSelectedLogDetail(null)}
        >
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                Rincian Jejak Audit: {selectedLogDetail.agentName}
              </DialogTitle>
              <DialogDescription className="text-xs">
                ID Log: <span className="font-mono">{selectedLogDetail.id}</span> •{" "}
                {new Date(selectedLogDetail.createdAt).toLocaleString("id-ID")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div>
                <p className="font-bold uppercase tracking-wider text-zinc-500 text-[10px] mb-1">
                  Instruksi Input (Prompt)
                </p>
                <div className="rounded-lg bg-zinc-100 dark:bg-zinc-900 p-3 text-zinc-800 dark:text-zinc-200">
                  {selectedLogDetail.input}
                </div>
              </div>

              <div>
                <p className="font-bold uppercase tracking-wider text-zinc-500 text-[10px] mb-1">
                  Deliverable / Hasil Output Agen
                </p>
                <div className="rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto font-mono text-xs">
                  {selectedLogDetail.output}
                </div>
              </div>

              {selectedLogDetail.metadata && (
                <div>
                  <p className="font-bold uppercase tracking-wider text-zinc-500 text-[10px] mb-1">
                    Structured Payload JSON
                  </p>
                  <pre className="rounded-lg bg-zinc-100 dark:bg-zinc-900 p-3 text-emerald-600 dark:text-emerald-400 overflow-x-auto text-[11px] font-mono">
                    {selectedLogDetail.metadata}
                  </pre>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
