"use client";

import { visivaBotAPI } from "@/lib/api";
import {
  Check,
  Edit2,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { VisivaPageShell } from "../_components/VisivaPageShell";
import { timeAgo } from "../_components/visiva-utils";

interface TemplateVariable {
  key: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
}

interface VisivaTemplate {
  _id: string;
  name: string;
  templateId: string;
  language: string;
  body: string;
  variables: TemplateVariable[];
  active: boolean;
  updatedAt: string;
}

interface TemplateForm {
  id?: string;
  name: string;
  templateId: string;
  language: string;
  body: string;
  variables: TemplateVariable[];
  active: boolean;
}

const emptyForm: TemplateForm = {
  name: "",
  templateId: "",
  language: "es",
  body: "¡Hola {{nombre}}! Soy Valeria del equipo de admisiones. ¿Tienes disponibilidad para una llamada esta semana?",
  variables: [{ key: "nombre", label: "Nombre", required: true, defaultValue: "" }],
  active: true,
};

function makeTemplateId(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "") || `visiva_${Date.now()}`;
}

function sanitizeKey(value: string) {
  return value.replace(/[^a-zA-Z0-9_]/g, "");
}

export default function VisivaTemplatesPage() {
  const [templates, setTemplates] = useState<VisivaTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<TemplateForm>(emptyForm);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await visivaBotAPI.getTemplates({ search: search || undefined });
      setTemplates(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch Visiva templates:", err);
      setError("Failed to load templates.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const resetForm = () => {
    setForm({ ...emptyForm, variables: [...emptyForm.variables] });
    setError("");
  };

  const editTemplate = (template: VisivaTemplate) => {
    setForm({
      id: template._id,
      name: template.name,
      templateId: template.templateId,
      language: template.language || "es",
      body: template.body,
      variables: template.variables || [],
      active: template.active !== false,
    });
    setError("");
    setSaved(false);
  };

  const saveTemplate = async () => {
    if (!form.name.trim() || !form.body.trim()) {
      setError("Name and body are required.");
      return;
    }

    setSaving(true);
    setError("");
    setSaved(false);
    const payload = {
      name: form.name.trim(),
      templateId: form.templateId.trim() || makeTemplateId(form.name),
      language: form.language.trim() || "es",
      body: form.body.trim(),
      active: form.active,
      variables: form.variables
        .map((variable) => ({
          key: sanitizeKey(variable.key).trim(),
          label: variable.label.trim() || variable.key.trim(),
          required: variable.required !== false,
          defaultValue: variable.defaultValue || "",
        }))
        .filter((variable) => variable.key),
    };

    try {
      if (form.id) await visivaBotAPI.updateTemplate(form.id, payload);
      else await visivaBotAPI.createTemplate(payload);
      resetForm();
      setSaved(true);
      fetchTemplates();
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { error?: string } } };
      setError(errorResponse.response?.data?.error || "Failed to save template.");
    } finally {
      setSaving(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await visivaBotAPI.deleteTemplate(id);
      setTemplates((prev) => prev.filter((template) => template._id !== id));
      if (form.id === id) resetForm();
    } catch (err) {
      console.error("Failed to delete template:", err);
      setError("Failed to delete template.");
    }
  };

  const addVariable = () => {
    setForm((prev) => ({
      ...prev,
      variables: [...prev.variables, { key: "", label: "", required: true, defaultValue: "" }],
    }));
  };

  const updateVariable = (index: number, updates: Partial<TemplateVariable>) => {
    setForm((prev) => ({
      ...prev,
      variables: prev.variables.map((variable, itemIndex) => itemIndex === index ? { ...variable, ...updates } : variable),
    }));
  };

  const removeVariable = (index: number) => {
    setForm((prev) => ({
      ...prev,
      variables: prev.variables.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  return (
    <VisivaPageShell
      title="Templates"
      description="Reusable Spanish admissions follow-ups"
      icon={<FileText className="w-5 h-5 text-white" />}
      maxWidth="max-w-6xl"
      actions={
        <>
          <button onClick={resetForm} className="h-10 px-4 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 flex items-center gap-2 hover:bg-slate-50">
            <Plus className="w-4 h-4" />
            New
          </button>
          <button onClick={fetchTemplates} className="h-10 px-4 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 flex items-center gap-2 hover:bg-slate-50">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </>
      }
    >
      {(error || saved) && (
        <div className={`px-4 py-3 rounded-xl border text-sm ${saved ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {saved ? "Template saved." : error}
        </div>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-emerald-600" />
            <h2 className="font-semibold text-slate-900">{form.id ? "Edit Template" : "New Template"}</h2>
          </div>

          <label className="block">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</span>
            <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value, templateId: prev.templateId || makeTemplateId(event.target.value) }))} className="mt-1 w-full h-10 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Template ID</span>
              <input value={form.templateId} onChange={(event) => setForm((prev) => ({ ...prev, templateId: makeTemplateId(event.target.value) }))} className="mt-1 w-full h-10 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Language</span>
              <input value={form.language} onChange={(event) => setForm((prev) => ({ ...prev, language: event.target.value }))} className="mt-1 w-full h-10 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Body</span>
            <textarea value={form.body} onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))} rows={7} className="mt-1 w-full px-3 py-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none resize-none" />
          </label>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Variables</span>
              <button onClick={addVariable} className="h-8 px-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
            {form.variables.map((variable, index) => (
              <div key={index} className="grid grid-cols-12 gap-2">
                <input value={variable.key} onChange={(event) => updateVariable(index, { key: sanitizeKey(event.target.value) })} placeholder="key" className="col-span-4 h-9 px-2 bg-slate-50 rounded-lg border border-slate-200 text-sm font-mono" />
                <input value={variable.label} onChange={(event) => updateVariable(index, { label: event.target.value })} placeholder="label" className="col-span-5 h-9 px-2 bg-slate-50 rounded-lg border border-slate-200 text-sm" />
                <select value={variable.required === false ? "optional" : "required"} onChange={(event) => updateVariable(index, { required: event.target.value !== "optional" })} className="col-span-2 h-9 px-1 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <option value="required">Req</option>
                  <option value="optional">Opt</option>
                </select>
                <button onClick={() => removeVariable(index)} className="col-span-1 h-9 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50" aria-label="Remove variable">
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={form.active} onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))} className="rounded border-slate-300" />
            Active
          </label>

          <button onClick={saveTemplate} disabled={saving} className="w-full h-11 rounded-lg bg-emerald-600 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Template
          </button>
        </div>

        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex-1">
              <h2 className="font-semibold text-slate-900">Saved Templates</h2>
              <p className="text-xs text-slate-400">{templates.length} templates</p>
            </div>
            <div className="relative sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search templates..." className="w-full h-10 pl-10 pr-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <Loader2 className="w-7 h-7 animate-spin mx-auto mb-2" />
              Loading templates...
            </div>
          ) : templates.length === 0 ? (
            <div className="py-20 text-center text-slate-400">No templates found</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {templates.map((template) => (
                <div key={template._id} className="p-4 hover:bg-slate-50">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-slate-900">{template.name}</p>
                        <span className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${template.active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                          {template.active ? "Active" : "Inactive"}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-mono">{template.templateId}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap line-clamp-3">{template.body}</p>
                      <p className="text-xs text-slate-400 mt-2">Updated {timeAgo(template.updatedAt)}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => editTemplate(template)} className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50" aria-label="Edit template">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteTemplate(template._id)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50" aria-label="Delete template">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {saved && (
        <div className="fixed bottom-5 right-5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold">
          <Check className="w-4 h-4" />
          Saved
        </div>
      )}
    </VisivaPageShell>
  );
}
