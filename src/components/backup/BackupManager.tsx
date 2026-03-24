"use client";

import { useState, useRef } from "react";
import { Download, Upload, Lock } from "lucide-react";
import { toast } from "sonner";

interface BackupExportProps {
  userId: string;
}

export function BackupExport({ userId }: BackupExportProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/backup/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });
      const data: { encrypted?: string; error?: string } = await response.json();
      if (!response.ok || !data.encrypted) throw new Error(data.error || "Export failed");
      
      const blob = new Blob([data.encrypted], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `budgetpro-backup-${new Date().toISOString().split("T")[0]}.bkb`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Backup exported successfully");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Encryption Password</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
          />
        </div>
        <button
          onClick={handleExport}
          disabled={loading || !password}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>
    </div>
  );
}

interface BackupImportProps {
  userId: string;
}

export function BackupImport({ userId }: BackupImportProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !password) {
      toast.error("Please select a file and enter password");
      return;
    }
    setLoading(true);
    try {
      const text = await file.text();
      const response = await fetch("/api/backup/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, encryptedData: text, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      toast.success("Data imported successfully");
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Import Backup</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter backup password"
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
          />
        </div>
        <label className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg cursor-pointer hover:bg-secondary/80">
          <Upload className="h-4 w-4" />
          Import
          <input
            ref={fileRef}
            type="file"
            accept=".bkb"
            onChange={handleImport}
            disabled={loading || !password}
            className="hidden"
          />
        </label>
      </div>
      <p className="text-xs text-muted-foreground">Warning: Import will replace all existing data</p>
    </div>
  );
}

interface BackupManagerProps {
  userId: string;
}

export function BackupManager({ userId }: BackupManagerProps) {
  return (
    <div className="space-y-6">
      <BackupExport userId={userId} />
      <BackupImport userId={userId} />
    </div>
  );
}