"use client";
import Sidebar from "@/components/Sidebar";
import { tenantAPI } from "@/lib/api";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Edit3,
  ExternalLink,
  Home,
  Loader2,
  Menu,
  Package,
  Pencil,
  Phone,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  Shield,
  Ticket,
  Trash2,
  Video,
  Wrench,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// ============================================================
// TYPES
// ============================================================
interface MultiStep {
  text: string;
  url?: string;
}

interface KBEntry {
  id: string;
  issue: string;
  triggers: string[];
  url: string | null;
  action?: string;
  multiStep?: MultiStep[];
}

interface TenantData {
  tenantId: string;
  brandName: string;
  products: { id: string; label: string }[];
  services: { id: string; label: string; enabled: boolean }[];
  troubleshootingKB: Record<string, KBEntry[]>;
  warrantyInfo: Record<string, { duration: string; transferable?: boolean }>;
  homeServiceCities: string[];
  homeServicePricing: { withinWarranty: string; outsideWarranty: string };
  links: Record<string, string>;
  extraEscalationKeywords: string[];
}

// ============================================================
// SAVE FEEDBACK TOAST
// ============================================================
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2 ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
      {type === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      {message}
    </div>
  );
}

// ============================================================
// EDIT KB ENTRY MODAL
// ============================================================
function EditKBEntryModal({ entry, productId, onSave, onClose }: {
  entry: KBEntry | null; // null = new entry
  productId: string;
  onSave: (productId: string, entry: KBEntry, isNew: boolean) => void;
  onClose: () => void;
}) {
  const isNew = !entry;
  const [form, setForm] = useState<KBEntry>(entry || {
    id: `${productId}_${Date.now()}`,
    issue: "",
    triggers: [],
    url: null,
    action: undefined,
    multiStep: [],
  });
  const [triggersText, setTriggersText] = useState((entry?.triggers || []).join(", "));
  const [stepsText, setStepsText] = useState(
    (entry?.multiStep || []).map((s) => `${s.text}${s.url ? ` | ${s.url}` : ""}`).join("\n")
  );

  const handleSave = () => {
    const triggers = triggersText.split(",").map((t) => t.trim()).filter(Boolean);
    const multiStep: MultiStep[] = stepsText
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const parts = line.split("|").map((p) => p.trim());
        return { text: parts[0], url: parts[1] || undefined };
      });
    onSave(productId, { ...form, triggers, multiStep: multiStep.length > 0 ? multiStep : undefined }, isNew);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200/80" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">{isNew ? "Add New" : "Edit"} KB Entry</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition"><X className="w-4 h-4 text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Issue Title</label>
            <input value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:outline-none transition-all" placeholder="e.g. Back side stitching loose" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Trigger Phrases <span className="text-[10px] text-slate-300">(comma-separated)</span></label>
            <textarea value={triggersText} onChange={(e) => setTriggersText(e.target.value)} rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:outline-none transition-all" placeholder="peeche ki silai, bobbin thread, back side loose" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Video URL <span className="text-[10px] text-slate-300">(leave empty if none)</span></label>
            <input value={form.url || ""} onChange={(e) => setForm({ ...form, url: e.target.value || null })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:outline-none transition-all" placeholder="https://youtu.be/..." />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Action <span className="text-[10px] text-slate-300">(if no video)</span></label>
            <select value={form.action || ""} onChange={(e) => setForm({ ...form, action: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:outline-none bg-white transition-all">
              <option value="">None</option>
              <option value="ask_video">Ask customer to send video</option>
              <option value="escalate_immediate">Escalate immediately</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Multi-Step Instructions <span className="text-[10px] text-slate-300">(one per line, format: text | url)</span></label>
            <textarea value={stepsText} onChange={(e) => setStepsText(e.target.value)} rows={4}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:outline-none transition-all"
              placeholder={"Step 1: Re-thread the machine | https://youtu.be/abc\nStep 2: Check bobbin"} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-lg transition">Cancel</button>
          <button onClick={handleSave} disabled={!form.issue.trim()} className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-40 flex items-center gap-1 transition-all">
            <Save className="w-3.5 h-3.5" /> {isNew ? "Add" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PRODUCT VIDEO TABLE (with edit/delete)
// ============================================================
const productColors: Record<number, string> = {
  0: "text-orange-500", 1: "text-blue-500", 2: "text-purple-500",
  3: "text-green-500", 4: "text-pink-500", 5: "text-cyan-500",
};

function VideoTable({ items, title, colorIndex, editMode, onEdit, onDelete, onAdd }: {
  items: KBEntry[]; title: string; colorIndex: number; editMode: boolean;
  onEdit: (entry: KBEntry) => void; onDelete: (entryId: string) => void; onAdd: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = items.filter((item) => {
    const q = searchTerm.toLowerCase();
    return item.issue.toLowerCase().includes(q) || item.triggers.some((t) => t.toLowerCase().includes(q));
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/80 transition">
        <div className="flex items-center gap-3">
          <Package className={`w-4 h-4 ${productColors[colorIndex % 6]}`} />
          <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 uppercase tracking-wider">{items.length} issues</span>
        </div>
        <div className={`w-6 h-6 rounded-md flex items-center justify-center ${open ? 'bg-orange-100' : 'bg-slate-100'}`}>
          {open ? <ChevronUp className="w-3.5 h-3.5 text-orange-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search issues or trigger phrases..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-lg border border-slate-200 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white focus:outline-none transition-all" />
            </div>
            {editMode && (
              <button onClick={onAdd} className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600 flex items-center gap-1 flex-shrink-0 transition-all">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">#</th>
                  <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Issue</th>
                  <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Trigger Phrases</th>
                  <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Video / Action</th>
                  {editMode && <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, index) => (
                  <tr key={item.id || index} className="border-t border-slate-100 hover:bg-orange-50/50">
                    <td className="px-3 py-2 text-slate-400">{index + 1}</td>
                    <td className="px-3 py-2 font-medium text-slate-700">{item.issue}</td>
                    <td className="px-3 py-2 text-slate-500 text-xs max-w-xs">{item.triggers.join(", ")}</td>
                    <td className="px-3 py-2">
                      {item.url ? (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100 transition">
                          <Play className="w-3 h-3" /> Watch
                        </a>
                      ) : item.action === "ask_video" ? (
                        <span className="text-xs text-amber-600 italic">Ask customer to send video</span>
                      ) : item.action === "escalate_immediate" ? (
                        <span className="text-xs text-red-600 font-semibold">Escalate immediately</span>
                      ) : null}
                      {item.multiStep && item.multiStep.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {item.multiStep.map((step, si) => (
                            <div key={si} className="text-xs text-slate-500">
                              {step.url ? (
                                <a href={step.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{step.text}</a>
                              ) : (<span>{step.text}</span>)}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    {editMode && (
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <button onClick={() => onEdit(item)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => onDelete(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={editMode ? 5 : 4} className="px-3 py-6 text-center text-slate-400">No matching issues found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function AkiaraKnowledgePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"videos" | "policies" | "escalation" | "links">("videos");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modal state
  const [editingEntry, setEditingEntry] = useState<{ entry: KBEntry | null; productId: string } | null>(null);

  // Inline edit states for policies/links/escalation
  const [editCities, setEditCities] = useState("");
  const [editPricingWithin, setEditPricingWithin] = useState("");
  const [editPricingOutside, setEditPricingOutside] = useState("");
  const [editKeywords, setEditKeywords] = useState("");
  const [editLinks, setEditLinks] = useState<Record<string, string>>({});
  const [newKeyword, setNewKeyword] = useState("");

  const fetchTenant = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tenantAPI.getTenants();
      const tenants = res.data?.data || [];
      const t = tenants.find((x: TenantData) => x.tenantId === "akiara") || tenants[0];
      if (t) {
        setTenant(t);
        syncEditState(t);
      }
    } catch (err) {
      console.error("Failed to fetch tenant:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const syncEditState = (t: TenantData) => {
    setEditCities((t.homeServiceCities || []).join(", "));
    setEditPricingWithin(t.homeServicePricing?.withinWarranty || "FREE");
    setEditPricingOutside(t.homeServicePricing?.outsideWarranty || "₹500 per visit");
    setEditKeywords((t.extraEscalationKeywords || []).join(", "));
    setEditLinks(t.links || {});
  };

  useEffect(() => { fetchTenant(); }, [fetchTenant]);

  // Save helper
  const saveTenant = async (updates: Partial<TenantData>) => {
    if (!tenant) return;
    setSaving(true);
    try {
      await tenantAPI.updateTenant(tenant.tenantId, updates);
      setToast({ message: "Saved successfully!", type: "success" });
      await fetchTenant();
    } catch (err) {
      console.error("Save failed:", err);
      setToast({ message: "Save failed. Try again.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // KB entry handlers
  const handleSaveEntry = (productId: string, entry: KBEntry, isNew: boolean) => {
    if (!tenant) return;
    const kb = { ...tenant.troubleshootingKB };
    const entries = [...(kb[productId] || [])];
    if (isNew) {
      entries.push(entry);
    } else {
      const idx = entries.findIndex((e) => e.id === entry.id);
      if (idx >= 0) entries[idx] = entry;
    }
    kb[productId] = entries;
    saveTenant({ troubleshootingKB: kb } as Partial<TenantData>);
    setEditingEntry(null);
  };

  const handleDeleteEntry = (productId: string, entryId: string) => {
    if (!tenant || !confirm("Delete this KB entry?")) return;
    const kb = { ...tenant.troubleshootingKB };
    kb[productId] = (kb[productId] || []).filter((e) => e.id !== entryId);
    saveTenant({ troubleshootingKB: kb } as Partial<TenantData>);
  };

  // Policies save handlers
  const saveCitiesAndPricing = () => {
    const cities = editCities.split(",").map((c) => c.trim().toLowerCase()).filter(Boolean);
    saveTenant({
      homeServiceCities: cities,
      homeServicePricing: { withinWarranty: editPricingWithin, outsideWarranty: editPricingOutside },
    } as Partial<TenantData>);
  };

  // Links save
  const saveLinks = () => {
    saveTenant({ links: editLinks } as Partial<TenantData>);
  };

  // Keywords save
  const saveKeywords = () => {
    const kws = editKeywords.split(",").map((k) => k.trim()).filter(Boolean);
    saveTenant({ extraEscalationKeywords: kws } as Partial<TenantData>);
  };

  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    const current = editKeywords ? editKeywords.split(",").map((k) => k.trim()).filter(Boolean) : [];
    current.push(newKeyword.trim());
    setEditKeywords(current.join(", "));
    setNewKeyword("");
  };

  const removeKeyword = (kw: string) => {
    const current = editKeywords.split(",").map((k) => k.trim()).filter(Boolean);
    setEditKeywords(current.filter((k) => k !== kw).join(", "));
  };

  const tabs = [
    { id: "videos" as const, label: "Troubleshooting Videos", icon: Video },
    { id: "policies" as const, label: "Warranty & Policies", icon: Shield },
    { id: "escalation" as const, label: "Escalation Rules", icon: Ticket },
    { id: "links" as const, label: "Useful Links", icon: ExternalLink },
  ];

  const productLabels: Record<string, string> = {};
  (tenant?.products || []).forEach((p) => { productLabels[p.id] = p.label; });
  const kbProducts = Object.keys(tenant?.troubleshootingKB || {});
  const warrantyInfo = tenant?.warrantyInfo || {};
  const warrantyRows = Object.entries(warrantyInfo).map(([productId, info]) => ({
    productId,
    product: productLabels[productId] || productId,
    duration: info.duration || "N/A",
    transferable: info.transferable ?? false,
  }));
  const linkLabelMap: Record<string, string> = {
    warrantyRegistration: "Warranty Registration",
    calendly: "Live Demo Booking",
    website: "Website",
    supportPage: "Support Page",
    faq: "FAQ Sheet",
  };
  const cities = (tenant?.homeServiceCities || []).map((c) => c.charAt(0).toUpperCase() + c.slice(1));
  const pricing = tenant?.homeServicePricing || { withinWarranty: "FREE", outsideWarranty: "₹500 per visit" };
  const escalationKeywords = tenant?.extraEscalationKeywords || [];

  const defaultEscalationTriggers = [
    "Customer frustrated, wants to speak to a person",
    "Customer unhappy or dissatisfied",
    "Scheduled home visit not received",
    "Scheduled home demo not received",
    "Very upset with the product",
    "Multiple calls not answered",
    "Formal complaint requested",
    "Consumer court threat",
    "Product replacement requested",
    "Product return requested",
    "Issue unresolved after troubleshooting",
    "Safety issue (electric shock, fire, smoke) — HIGH PRIORITY",
    "Wants to speak to a manager",
    "Refund outside 7-day policy",
    "Customer sends video needing human review",
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f8fafc]">
        <div className="hidden lg:block"><Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /></div>
        <main className="flex-1 lg:ml-60 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 animate-pulse" />
              <BookOpen className="absolute inset-0 m-auto w-7 h-7 text-white" />
            </div>
            <p className="text-slate-500 font-medium">Loading knowledge base...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {editingEntry && (
        <EditKBEntryModal
          entry={editingEntry.entry}
          productId={editingEntry.productId}
          onSave={handleSaveEntry}
          onClose={() => setEditingEntry(null)}
        />
      )}

      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-slate-200/80">
        {sidebarOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
      </button>
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setSidebarOpen(false)}>
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}
      <div className="hidden lg:block"><Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /></div>

      <main className="flex-1 lg:ml-60 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-200">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{tenant?.brandName || "Bot"} Knowledge Base</h1>
                  <p className="text-sm text-slate-500">Troubleshooting, policies, and escalation rules</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button onClick={() => setEditMode(!editMode)}
                  className={`h-10 px-3.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${editMode ? "bg-orange-500 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300"}`}>
                  <Edit3 className="w-4 h-4" /> {editMode ? "Editing" : "Edit Mode"}
                </button>
                <button onClick={fetchTenant} className="h-10 w-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                  <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Saving overlay */}
          {saving && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
              <div className="bg-white rounded-xl p-5 shadow-2xl border border-slate-200/80 flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                <span className="text-sm text-slate-600 font-medium">Saving changes...</span>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === tab.id ? "bg-orange-500 text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}>
                <tab.icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            ))}
          </div>

          {/* TROUBLESHOOTING VIDEOS TAB */}
          {activeTab === "videos" && (
            <div className="space-y-3">
              {kbProducts.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200/80 py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Video className="w-7 h-7 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">No troubleshooting data found</p>
                  <p className="text-xs text-slate-400 mt-1">Add entries to the troubleshootingKB in tenant config</p>
                </div>
              ) : (
                kbProducts.map((productId, i) => (
                  <VideoTable
                    key={productId}
                    items={tenant!.troubleshootingKB[productId]}
                    title={productLabels[productId] || productId.charAt(0).toUpperCase() + productId.slice(1)}
                    colorIndex={i}
                    editMode={editMode}
                    onEdit={(entry) => setEditingEntry({ entry, productId })}
                    onDelete={(entryId) => handleDeleteEntry(productId, entryId)}
                    onAdd={() => setEditingEntry({ entry: null, productId })}
                  />
                ))
              )}

              {/* Operating Instructions */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-500" /> Bot Operating Instructions
                </h3>
                <div className="space-y-2.5 text-sm text-slate-600">
                  <div className="bg-orange-50/80 rounded-lg p-3.5 border border-orange-100">
                    <p className="text-[10px] font-semibold text-orange-500 uppercase tracking-wider mb-1">Step 1 — Video First</p>
                    <p>Match issue against troubleshooting video links and share the most relevant video. Ask customer to try steps in the video first.</p>
                  </div>
                  <div className="bg-blue-50/80 rounded-lg p-3.5 border border-blue-100">
                    <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-1">Step 2 — Customer Video</p>
                    <p>If customer has already tried all relevant videos and reconnects, request them to send a 30-second short video showing the issue.</p>
                  </div>
                  <div className="bg-red-50/80 rounded-lg p-3.5 border border-red-100">
                    <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wider mb-1">Step 3 — Escalate</p>
                    <p>If Steps 1 and 2 completed and issue still unresolved, transfer to human agent. Inform: &quot;You will receive a call back within 24 hours.&quot;</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WARRANTY & POLICIES TAB */}
          {activeTab === "policies" && (
            <div className="space-y-3">
              {/* Warranty */}
              {warrantyRows.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200/80 p-5">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-500" /> Warranty Policy
                  </h3>
                  <table className="w-full text-sm mb-4">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Product</th>
                        <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Duration</th>
                        <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Transferable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {warrantyRows.map((w) => (
                        <tr key={w.productId} className="border-t border-slate-100">
                          <td className="px-3 py-2 font-medium text-slate-700">{w.product}</td>
                          <td className="px-3 py-2 text-slate-600">{w.duration}</td>
                          <td className="px-3 py-2 text-slate-600">{w.transferable ? "Yes" : "No"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-emerald-50/80 rounded-lg p-3 border border-emerald-100">
                      <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider mb-2">Covers</p>
                      <ul className="text-xs text-green-700 space-y-1">
                        <li>• Manufacturing defects</li>
                        <li>• Hardware failures under normal use</li>
                      </ul>
                    </div>
                    <div className="bg-red-50/80 rounded-lg p-3 border border-red-100">
                      <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wider mb-2">Does NOT Cover</p>
                      <ul className="text-xs text-red-700 space-y-1">
                        <li>• Physical damage or drops</li>
                        <li>• Voltage damage (power surge)</li>
                        <li>• Unauthorized repairs</li>
                        <li>• Normal wear and tear</li>
                        <li>• Accessories</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Home Service Policy */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Home className="w-4 h-4 text-orange-500" /> Home Service Policy
                  </h3>
                  {editMode && (
                    <button onClick={saveCitiesAndPricing} className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 flex items-center gap-1 transition-all">
                      <Save className="w-3 h-3" /> Save
                    </button>
                  )}
                </div>
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Cities <span className="text-[10px] text-slate-300">(comma-separated)</span></label>
                      <input value={editCities} onChange={(e) => setEditCities(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:outline-none transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Within Warranty Charge</label>
                        <input value={editPricingWithin} onChange={(e) => setEditPricingWithin(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:outline-none transition-all" />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Outside Warranty Charge</label>
                        <input value={editPricingOutside} onChange={(e) => setEditPricingOutside(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:outline-none transition-all" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Cities Covered</p>
                      <div className="flex flex-wrap gap-1.5">
                        {cities.length > 0 ? cities.map((c) => (
                          <span key={c} className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-slate-600 border border-slate-200">{c}</span>
                        )) : (<span className="text-xs text-slate-400">No cities configured</span>)}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Service Charges</p>
                      <p className="text-xs text-slate-600">Within Warranty: <span className="font-bold text-green-600">{pricing.withinWarranty}</span></p>
                      <p className="text-xs text-slate-600 mt-1">Outside Warranty: <span className="font-bold text-orange-600">{pricing.outsideWarranty}</span></p>
                    </div>
                  </div>
                )}
              </div>

              {/* Repair Policy */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-orange-500" /> Repair Policy
                </h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Detail</th>
                      <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Within Warranty</th>
                      <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">After Warranty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { detail: "Parts Cost", within: "FREE", after: "FREE" },
                      { detail: "Labor Cost", within: "FREE", after: pricing.outsideWarranty },
                      { detail: "Repair Time", within: "3-7 working days", after: "3-7 working days" },
                      { detail: "If Unrepairable", within: "Replacement", after: "Case-by-case" },
                    ].map((r) => (
                      <tr key={r.detail} className="border-t border-slate-100">
                        <td className="px-3 py-2 font-medium text-slate-700">{r.detail}</td>
                        <td className="px-3 py-2 text-green-600">{r.within}</td>
                        <td className="px-3 py-2 text-slate-600">{r.after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Live Demo */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-500" /> Live Demo Policy
                </h3>
                <div className="text-sm text-slate-600 space-y-2">
                  <p>• All machines eligible</p>
                  <p>• Unlimited bookings</p>
                  <p>• Platform: Google Meet</p>
                  <p>• Days: Monday – Sunday, 10 AM – 6 PM</p>
                  {tenant?.links?.calendly && (
                    <p>• Booking: <a href={tenant.links.calendly} target="_blank" rel="noopener noreferrer" className="text-orange-600 underline hover:text-orange-700">{tenant.links.calendly}</a></p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ESCALATION TAB */}
          {activeTab === "escalation" && (
            <div className="space-y-3">
              <div className="bg-white rounded-xl border border-slate-200/80 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-red-500" /> When to Create Ticket &amp; Escalate
                </h3>
                <div className="space-y-1.5">
                  {defaultEscalationTriggers.map((trigger, i) => (
                    <div key={i} className={`flex items-start gap-3 p-2.5 rounded-lg ${trigger.includes('HIGH PRIORITY') ? 'bg-red-50 border border-red-200' : 'bg-slate-50/80 border border-slate-100'}`}>
                      <span className="flex-shrink-0 w-5 h-5 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                      <p className={`text-sm ${trigger.includes('HIGH PRIORITY') ? 'text-red-700 font-semibold' : 'text-slate-700'}`}>{trigger}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom escalation keywords - editable */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700">Custom Escalation Keywords</h3>
                  {editMode && (
                    <button onClick={saveKeywords} className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 flex items-center gap-1 transition-all">
                      <Save className="w-3 h-3" /> Save
                    </button>
                  )}
                </div>
                {editMode ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {editKeywords.split(",").map((k) => k.trim()).filter(Boolean).map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium border border-red-200 flex items-center gap-1.5">
                          {kw}
                          <button onClick={() => removeKeyword(kw)} className="hover:bg-red-100 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <input value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                        placeholder="Add keyword..." className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:outline-none transition-all" />
                      <button onClick={addKeyword} className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600 flex items-center gap-1 transition-all">
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {escalationKeywords.length > 0 ? escalationKeywords.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium border border-red-200">{kw}</span>
                    )) : (
                      <p className="text-sm text-slate-400">No custom keywords configured</p>
                    )}
                  </div>
                )}
              </div>

              {/* Handling steps + info collection (read-only) */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Escalation Handling Steps</h3>
                <div className="space-y-3 text-sm text-slate-600">
                  {[
                    "Acknowledge the customer's concern empathetically.",
                    "Inform that a ticket has been created and a human agent will contact them shortly.",
                    "Do NOT make any promises regarding timelines or outcomes.",
                    "Create ticket immediately with all available details.",
                    "For safety issues (shock, fire, smoke) — treat as HIGH PRIORITY and flag urgently.",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-6 h-6 ${i === 4 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'} rounded-full text-xs font-bold flex items-center justify-center`}>{i + 1}</span>
                      <p className={i === 4 ? "font-semibold" : ""}>{step}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3 mt-4">
                  <p className="text-xs text-amber-800"><strong>Rule:</strong> When in doubt about whether to escalate, ALWAYS escalate. Never handle complaints, returns, replacements, legal threats, or safety issues alone.</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/80 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Information Collection Flow</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Step</th>
                      <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Action</th>
                      <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Mandatory</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-100"><td className="px-3 py-2">1</td><td className="px-3 py-2">Ask which product</td><td className="px-3 py-2 text-green-600 font-semibold">Yes</td></tr>
                    <tr className="border-t border-slate-100"><td className="px-3 py-2">2</td><td className="px-3 py-2">Ask for Order ID</td><td className="px-3 py-2 text-amber-600">Preferred, not blocking</td></tr>
                    <tr className="border-t border-slate-100"><td className="px-3 py-2">3</td><td className="px-3 py-2">Proceed with solution</td><td className="px-3 py-2 text-green-600 font-semibold">Yes</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* USEFUL LINKS TAB */}
          {activeTab === "links" && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-orange-500" /> Quick Links &amp; Resources
                </h3>
                {editMode && (
                  <button onClick={saveLinks} className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 flex items-center gap-1 transition-all">
                    <Save className="w-3 h-3" /> Save
                  </button>
                )}
              </div>
              {editMode ? (
                <div className="space-y-3">
                  {Object.keys(linkLabelMap).map((key) => (
                    <div key={key}>
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">{linkLabelMap[key]}</label>
                      <input value={editLinks[key] || ""} onChange={(e) => setEditLinks({ ...editLinks, [key]: e.target.value })}
                        placeholder={`https://...`}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:outline-none transition-all" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {Object.entries(tenant?.links || {}).filter(([, v]) => v).length === 0 ? (
                    <div className="text-center py-8">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                      <ExternalLink className="w-7 h-7 text-slate-300" />
                    </div>
                    <p className="text-sm text-slate-400">No links configured. Turn on Edit Mode to add them.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(tenant?.links || {}).filter(([, v]) => v).map(([key, url]) => (
                        <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/50 transition-all group">
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-orange-500 flex-shrink-0 transition-colors" />
                          <span className="text-sm font-medium text-slate-600 group-hover:text-orange-700 transition-colors">{linkLabelMap[key] || key}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
