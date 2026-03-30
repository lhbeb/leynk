'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Terminal,
  Play,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Globe,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import SuperAdminGuard from '@/components/SuperAdminGuard';
import { clearSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PreviewRow {
  id: string;
  title: string;
  oldUrl: string;
  newUrl: string;
  changed: boolean;
}

interface ScriptResult {
  affected: number;
  failed?: number;
  dryRun: boolean;
  message: string;
  preview: PreviewRow[];
  errors?: string[];
}

// ─── Domain Replace Script Component ─────────────────────────────────────────

function DomainReplaceScript() {
  const [fromDomain, setFromDomain] = useState('hoodfair.com');
  const [toDomain, setToDomain] = useState('deeldepot.com');

  // Step 1 — Preview state (read-only scan, never writes to DB)
  const [previewing, setPreviewing] = useState(false);
  const [previewResult, setPreviewResult] = useState<ScriptResult | null>(null);
  const [previewError, setPreviewError] = useState('');
  const [showTable, setShowTable] = useState(true);

  // Step 2 — Execute state (only reachable after preview is loaded)
  const [executing, setExecuting] = useState(false);
  const [executeResult, setExecuteResult] = useState<ScriptResult | null>(null);
  const [executeError, setExecuteError] = useState('');

  const reset = () => {
    setPreviewing(false);
    setPreviewResult(null);
    setPreviewError('');
    setShowTable(true);
    setExecuting(false);
    setExecuteResult(null);
    setExecuteError('');
  };

  // ── Step 1: Preview — dryRun is hardcoded true, this NEVER writes to the DB ─
  const handlePreview = async () => {
    setPreviewing(true);
    setPreviewResult(null);
    setPreviewError('');
    setExecuteResult(null);
    setExecuteError('');

    try {
      const res = await fetch('/api/scripts/replace-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromDomain,
          toDomain,
          dryRun: true, // hardcoded — this code path NEVER modifies the database
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Preview failed');
      setPreviewResult(data);
    } catch (err: any) {
      setPreviewError(err.message || 'Unknown error during preview');
    } finally {
      setPreviewing(false);
    }
  };

  // ── Step 2: Execute — dryRun is hardcoded false, this ALWAYS writes to the DB
  // This function is only ever callable after previewResult is set.
  const handleExecute = async () => {
    if (!previewResult || previewResult.affected === 0) return;

    setExecuting(true);
    setExecuteResult(null);
    setExecuteError('');

    try {
      const res = await fetch('/api/scripts/replace-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromDomain,
          toDomain,
          dryRun: false, // hardcoded — this code path ALWAYS modifies the database
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Execution failed');
      setExecuteResult(data);
    } catch (err: any) {
      setExecuteError(err.message || 'Unknown error during execution');
    } finally {
      setExecuting(false);
    }
  };

  const alreadyExecuted = !!executeResult;
  const canExecute =
    !!previewResult && previewResult.affected > 0 && !alreadyExecuted && !executing;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-accent/10 overflow-hidden">
      {/* Script Header */}
      <div className="px-6 py-5 border-b border-accent/10 flex items-start gap-4">
        <div className="w-11 h-11 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
          <Globe className="text-accent" size={22} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-text-primary">Domain URL Replacer</h3>
            <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">
              Bulk Action
            </span>
          </div>
          <p className="text-sm text-text-primary/60 leading-relaxed">
            Scans all link URLs in the database and replaces a source domain with a target domain.
            The full path and product slug after the domain are preserved.
          </p>
        </div>
      </div>

      {/* ── Config inputs ── */}
      <div className="px-6 py-5 bg-bg-primary/40 border-b border-accent/10">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-text-primary/50 uppercase tracking-wider mb-1.5">
              Replace domain
            </label>
            <input
              type="text"
              value={fromDomain}
              onChange={(e) => { setFromDomain(e.target.value); reset(); }}
              placeholder="hoodfair.com"
              disabled={previewing || executing}
              className="w-full px-4 py-2.5 rounded-xl border border-accent/20 bg-white text-sm text-text-primary
                placeholder:text-text-primary/30 focus:outline-none focus:ring-2 focus:ring-accent/30
                focus:border-accent/50 transition disabled:opacity-50"
            />
          </div>

          <div className="flex items-end pb-0.5 sm:pt-6">
            <ArrowRight className="text-accent" size={20} />
          </div>

          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-text-primary/50 uppercase tracking-wider mb-1.5">
              With domain
            </label>
            <input
              type="text"
              value={toDomain}
              onChange={(e) => { setToDomain(e.target.value); reset(); }}
              placeholder="deeldepot.com"
              disabled={previewing || executing}
              className="w-full px-4 py-2.5 rounded-xl border border-accent/20 bg-white text-sm text-text-primary
                placeholder:text-text-primary/30 focus:outline-none focus:ring-2 focus:ring-accent/30
                focus:border-accent/50 transition disabled:opacity-50"
            />
          </div>
        </div>

        {fromDomain && toDomain && (
          <p className="mt-3 text-xs text-text-primary/40 font-mono bg-white/70 rounded-lg px-3 py-2 border border-accent/10">
            https://<span className="text-red-400 line-through">{fromDomain.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>/product-slug
            {' → '}
            https://<span className="text-emerald-500">{toDomain.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>/product-slug
          </p>
        )}
      </div>

      {/* ── STEP 1: Preview button ── */}
      <div className="px-6 py-4 border-b border-accent/10 bg-white">
        <p className="text-xs font-bold text-text-primary/40 uppercase tracking-widest mb-3">
          Step 1 — Scan (read-only, no changes)
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePreview}
            disabled={previewing || executing || !fromDomain || !toDomain}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-accent/40 text-accent
              font-semibold rounded-xl hover:bg-accent/5 hover:border-accent transition-all
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {previewing ? <RefreshCw size={16} className="animate-spin" /> : <Eye size={16} />}
            {previewing ? 'Scanning database…' : 'Preview Changes'}
          </button>

          {(previewResult || previewError) && !previewing && (
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2 text-text-primary/40 hover:text-text-primary
                font-medium rounded-xl hover:bg-bg-primary transition-all text-sm"
            >
              <RefreshCw size={13} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Preview error ── */}
      {previewError && (
        <div className="px-6 py-4 bg-red-50 border-b border-red-100 flex items-start gap-3">
          <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-semibold text-red-700 text-sm">Preview failed</p>
            <p className="text-sm text-red-600 mt-0.5">{previewError}</p>
          </div>
        </div>
      )}

      {/* ── Preview results (shown only after Step 1 completes) ── */}
      {previewResult && (
        <>
          {/* Summary banner */}
          <div className={`px-6 py-4 border-b flex items-start gap-3 ${
            previewResult.affected > 0 ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'
          }`}>
            <Eye className={previewResult.affected > 0 ? 'text-blue-500' : 'text-amber-500'} size={20} />
            <div className="flex-1">
              <p className={`font-semibold ${previewResult.affected > 0 ? 'text-blue-700' : 'text-amber-700'}`}>
                👁 Preview — no changes made yet
              </p>
              <p className={`text-sm mt-0.5 ${previewResult.affected > 0 ? 'text-blue-600' : 'text-amber-600'}`}>
                {previewResult.message}
              </p>
            </div>
            <div className={`px-4 py-1.5 rounded-full font-bold text-lg ${
              previewResult.affected > 0 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {previewResult.affected}
            </div>
          </div>

          {/* Change table */}
          {previewResult.preview.length > 0 && (
            <div className="px-6 py-4 border-b border-accent/10">
              <button
                onClick={() => setShowTable((v) => !v)}
                className="flex items-center gap-2 text-sm font-semibold text-text-primary/60 hover:text-text-primary mb-3 transition-colors"
              >
                {showTable ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {showTable ? 'Hide' : 'Show'} affected links ({previewResult.preview.length})
              </button>

              {showTable && (
                <div className="border border-accent/10 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-bg-primary border-b border-accent/10">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-text-primary/70 w-1/5">Link Title</th>
                        <th className="px-4 py-3 text-left font-semibold text-text-primary/70">Before</th>
                        <th className="px-4 py-3 text-left font-semibold text-text-primary/70">After</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-accent/5">
                      {previewResult.preview.map((row) => (
                        <tr key={row.id} className="hover:bg-bg-primary/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-text-primary truncate max-w-[160px]">
                            {row.title || '—'}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-red-500 break-all">{row.oldUrl}</td>
                          <td className="px-4 py-3 font-mono text-xs text-emerald-600 break-all">{row.newUrl}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: Execute — only rendered after preview results are shown ── */}
          {!alreadyExecuted && (
            <div className={`px-6 py-4 border-b border-accent/10 ${
              previewResult.affected === 0 ? 'opacity-40 pointer-events-none' : ''
            }`}>
              <p className="text-xs font-bold text-text-primary/40 uppercase tracking-widest mb-3">
                Step 2 — Execute{' '}
                {previewResult.affected === 0
                  ? '(nothing to update)'
                  : `(will update ${previewResult.affected} link${previewResult.affected !== 1 ? 's' : ''})`}
              </p>
              <button
                onClick={handleExecute}
                disabled={!canExecute}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white
                  font-semibold rounded-xl hover:bg-accent/90 transition-all shadow-sm
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {executing ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
                {executing
                  ? 'Applying changes…'
                  : `Apply to ${previewResult.affected} link${previewResult.affected !== 1 ? 's' : ''}`}
              </button>
            </div>
          )}

          {/* Execute error */}
          {executeError && (
            <div className="px-6 py-4 bg-red-50 border-b border-red-100 flex items-start gap-3">
              <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-semibold text-red-700 text-sm">Execution failed</p>
                <p className="text-sm text-red-600 mt-0.5">{executeError}</p>
              </div>
            </div>
          )}

          {/* Execute success */}
          {executeResult && (
            <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100 flex items-start gap-3">
              <CheckCircle2 className="text-emerald-500 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="font-semibold text-emerald-700">✅ Script executed successfully</p>
                <p className="text-sm text-emerald-600 mt-0.5">
                  {executeResult.message}
                  {executeResult.failed ? ` · ${executeResult.failed} failed` : ''}
                </p>
                {executeResult.errors && executeResult.errors.length > 0 && (
                  <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-100">
                    {executeResult.errors.map((e, i) => (
                      <p key={i} className="text-xs text-red-600 font-mono">{e}</p>
                    ))}
                  </div>
                )}
              </div>
              <div className="px-4 py-1.5 rounded-full font-bold text-lg bg-emerald-100 text-emerald-700">
                {executeResult.affected}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function ScriptsContent() {
  const router = useRouter();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      clearSession();
      router.push('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-accent/20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center">
          <div className="flex-1">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-text-primary/60 hover:text-text-primary transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>

          <div className="flex-1 flex justify-center items-center gap-3">
            <Link href="/admin" className="flex items-center gap-3">
              <Image src="/leynk-logo.svg" alt="Leynk" width={180} height={60} priority />
              <span className="px-3 py-1 bg-accent text-white text-sm font-semibold rounded-full">
                Admin
              </span>
            </Link>
          </div>

          <div className="flex-1 flex justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-text-primary/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <Terminal className="text-accent" size={22} />
            </div>
            <h1 className="text-3xl font-bold text-text-primary">Scripts</h1>
          </div>
          <p className="text-text-primary/60 ml-[52px]">
            Run bulk database operations directly against Supabase.
            Each script requires a <span className="font-semibold text-blue-600">Preview</span> step
            before the <span className="font-semibold text-accent">Execute</span> button becomes available.
          </p>
        </div>

        {/* Warning Banner */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-8">
          <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-amber-800">Use with caution</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Scripts run directly against the production database. Always review the preview table before
              executing. Some operations cannot be undone without a database backup.
            </p>
          </div>
        </div>

        {/* Scripts List */}
        <div className="space-y-6">
          <DomainReplaceScript />

          {/* Placeholder for future scripts */}
          <div className="bg-white/50 rounded-2xl border-2 border-dashed border-accent/20 px-6 py-8 text-center">
            <Terminal className="text-text-primary/20 mx-auto mb-3" size={32} />
            <p className="text-text-primary/40 font-medium">More scripts coming soon</p>
            <p className="text-sm text-text-primary/30 mt-1">
              Additional bulk operations will appear here
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ScriptsPage() {
  return (
    <SuperAdminGuard>
      <ScriptsContent />
    </SuperAdminGuard>
  );
}
