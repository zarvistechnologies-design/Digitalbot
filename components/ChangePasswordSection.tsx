"use client";

import { authAPI } from "@/lib/api";
import { KeyRound, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

export default function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (newPassword.length < 8) return setError("Use at least 8 characters for your new password.");
    if (newPassword !== confirmPassword) return setError("The new passwords do not match.");
    setSaving(true);
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password changed successfully.");
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || "Could not change your password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="flex items-center gap-2 font-black"><KeyRound className="h-4 w-4 text-orange-600" />Change password</h2>
        <p className="mt-1 text-sm text-slate-500">Confirm your current password before setting a new one.</p>
      </div>
      <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2">
        <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-bold text-slate-700">Current password</span><input required autoComplete="current-password" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm" /></label>
        <label><span className="mb-1.5 block text-sm font-bold text-slate-700">New password</span><input required minLength={8} autoComplete="new-password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm" /></label>
        <label><span className="mb-1.5 block text-sm font-bold text-slate-700">Confirm new password</span><input required minLength={8} autoComplete="new-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm" /></label>
        {error && <p role="alert" className="sm:col-span-2 text-sm font-semibold text-rose-700">{error}</p>}
        {message && <p role="status" className="sm:col-span-2 text-sm font-semibold text-emerald-700">{message}</p>}
        <div className="sm:col-span-2"><button type="submit" disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-bold text-white disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{saving ? "Updating" : "Update password"}</button></div>
      </form>
    </section>
  );
}
