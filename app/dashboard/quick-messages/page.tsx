"use client";
import Sidebar from "@/components/Sidebar";
import { healthiqureAPI } from "@/lib/api";
import {
  AlertCircle,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  File,
  FileText,
  Filter,
  Image,
  Loader2,
  Menu,
  Paperclip,
  Phone,
  Search,
  Send,
  Stethoscope,
  Trash2,
  Video,
  X
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface HistoryItem {
  _id: string;
  phone: string;
  message: string;
  type: string;
  hospitalName: string;
  doctorName: string;
  documentUrl: string | null;
  documentName: string | null;
  mimeType: string | null;
  sentBy: string;
  status: string;
  error: string | null;
  createdAt: string;
}

function formatPhone(phone: string) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) {
    return `+91 ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function typeIcon(type: string) {
  switch (type) {
    case "image":
      return <Image className="w-4 h-4 text-blue-500" />;
    case "video":
      return <Video className="w-4 h-4 text-purple-500" />;
    case "audio":
      return <FileText className="w-4 h-4 text-yellow-600" />;
    case "document":
      return <File className="w-4 h-4 text-orange-500" />;
    case "template":
      return <FileText className="w-4 h-4 text-green-600" />;
    default:
      return <Send className="w-4 h-4 text-orange-500" />;
  }
}

export default function QuickMessagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [sendMessageOpen, setSendMessageOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterHospital, setFilterHospital] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [hospitals, setHospitals] = useState<string[]>([]);
  const [doctors, setDoctors] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [expandedMsg, setExpandedMsg] = useState<HistoryItem | null>(null);

  // ===== Verified Templates =====
  const VERIFIED_TEMPLATES = [
    {
      name: "healthiqure_v1",
      label: "Patient Referral Letter",
      variables: ["{{1}}", "{{2}}"],
      variableLabels: ["Name", "Diagnosis"],
      content: `Dear {{1}},

Greetings from Life Care Clinic & Diagnostic Centre Bordumsa, a unit of HealthiQure Technologies Pvt. Ltd.

We are referring a patient diagnosed with{{2}} for your expert evaluation and retina opinion. We kindly request you to examine the patient and advise further management accordingly.

We would be grateful if you could please confirm a suitable appointment for the same. Kindly share the appointment details with us at 7099093551.

Looking forward to your support.

Warm regards,
Life Care Clinic & Diagnostic Centre 
(A unit of HealthiQure Technologies Pvt. Ltd.)
Bordumsa 792056, Arunachal Pradesh
Email: lifecarebordumsa.in@gmail.com
Phone: 7099093551`,
    },
    {
      name: "healthiqure_v2",
      label: "Welcome / Introduction Message",
      variables: [],
      variableLabels: [],
      content: `Welcome to Life Care Clinic & Diagnostic Centre
(A Unit of HealthiQure Technologies Pvt. Ltd.)

"Right Healthcare, Simplified" — that's our promise.

At HealthiQure, we make healthcare easy by supporting you at every step—from consultation and diagnostics to specialist care, hospital admissions, and referrals across India.

With centres at Bordumsa and Miao, we offer multi-specialty consultations, ultrasonography, ECG, lab tests, health check-ups, medicines, and ambulance services—all under one trusted network.

To know more or book services, simply send "Hi" to our Patient Navigation WhatsApp Bot – 08047360162.

Through our partner hospitals across Namsai, Roing, Pasighat, Tinsukia, Dibrugarh, Guwahati and beyond, we ensure timely treatment with travel and stay support.

Powered by technology, driven by care - we are making healthcare simpler, smarter, and closer to you.`,
    },
  ];

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateParams, setTemplateParams] = useState<string[]>([]);
  const [templatePhone, setTemplatePhone] = useState("");
  const [templateHospitalName, setTemplateHospitalName] = useState("");
  const [templateDoctorName, setTemplateDoctorName] = useState("");
  const [sendingTemplate, setSendingTemplate] = useState(false);
  const [templateResult, setTemplateResult] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [templatePreviewOpen, setTemplatePreviewOpen] = useState(false);

  const activeTemplate = VERIFIED_TEMPLATES.find((t) => t.name === selectedTemplate);

  const getPreviewContent = () => {
    if (!activeTemplate) return "";
    let preview = activeTemplate.content;
    activeTemplate.variables.forEach((v, i) => {
      preview = preview.replace(v, templateParams[i] || `[${activeTemplate.variableLabels[i]}]`);
    });
    return preview;
  };

  const handleTemplateSend = async () => {
    if (!activeTemplate) return;
    const cleanPhone = templatePhone.trim().replace(/\D/g, "");
    if (!cleanPhone) return;
    // If template has variables, ensure all are filled
    if (activeTemplate.variables.length > 0) {
      const allFilled = templateParams.every((p) => p.trim() !== "");
      if (!allFilled) return;
    }
    setSendingTemplate(true);
    setTemplateResult(null);
    try {
      const fullPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
      await healthiqureAPI.sendTemplateMessage({
        phone: fullPhone,
        templateName: activeTemplate.name,
        parameters: activeTemplate.variables.length > 0 ? templateParams : undefined,
        hospitalName: templateHospitalName.trim() || undefined,
        doctorName: templateDoctorName.trim() || undefined,
      });
      setTemplateResult({ type: "success", msg: `Template "${activeTemplate.label}" sent to +${fullPhone}` });
      setTemplateParams(activeTemplate.variables.map(() => ""));
      setTemplatePhone("");
      setTemplateHospitalName("");
      setTemplateDoctorName("");
      fetchHistory();
    } catch (err) {
      console.error("Template send failed:", err);
      setTemplateResult({ type: "error", msg: "Failed to send template. Please try again." });
    } finally {
      setSendingTemplate(false);
    }
  };

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await healthiqureAPI.getMessageHistory({
        page,
        limit: 20,
        search: search || undefined,
        type: filterType !== "all" ? filterType : undefined,
        hospitalName: filterHospital || undefined,
        doctorName: filterDoctor || undefined,
      });
      const data = res.data;
      setHistory(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
      setHospitals(data.hospitals || []);
      setDoctors(data.doctors || []);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setHistoryLoading(false);
    }
  }, [page, search, filterType, filterHospital, filterDoctor]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);
  useEffect(() => {
    setPage(1);
  }, [search, filterType, filterHospital, filterDoctor]);

  const handleSend = async () => {
    const cleanPhone = phone.trim().replace(/\D/g, "");
    if (!cleanPhone) return;
    if (!message.trim() && !file) return;

    setSending(true);
    setSendResult(null);
    try {
      const fullPhone = cleanPhone.startsWith("91")
        ? cleanPhone
        : `91${cleanPhone}`;
      const formData = new FormData();
      formData.append("phone", fullPhone);
      if (message.trim()) formData.append("message", message.trim());
      if (hospitalName.trim())
        formData.append("hospitalName", hospitalName.trim());
      if (doctorName.trim()) formData.append("doctorName", doctorName.trim());
      if (file) formData.append("document", file);

      await healthiqureAPI.sendQuickMessage(formData);
      setSendResult({
        type: "success",
        msg: `Message sent to +${fullPhone}`,
      });
      setMessage("");
      setHospitalName("");
      setDoctorName("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      fetchHistory();
    } catch (err) {
      console.error("Send failed:", err);
      setSendResult({
        type: "error",
        msg: "Failed to send message. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await healthiqureAPI.deleteMessageHistory(id);
      setHistory((prev) => prev.filter((h) => h._id !== id));
      setTotal((prev) => prev - 1);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/40 to-orange-100/60">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200"
      >
        {sidebarOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </div>
        </div>
      )}
      <div className="hidden lg:block">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <header>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1">
              Quick Messages
            </h1>
            <p className="text-gray-500 text-sm">
              Send WhatsApp messages &amp; documents instantly and track your
              sent history
            </p>
          </header>

          {/* ===== Verified Templates Section ===== */}
          <div className="rounded-2xl shadow-lg border-2 border-green-200 bg-white transition-all duration-300 hover:shadow-xl hover:border-green-300 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-white" />
              <h3 className="font-bold text-white text-sm">
                Send Verified Template
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {/* Template selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {VERIFIED_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.name}
                    onClick={() => {
                      if (selectedTemplate === tpl.name) {
                        setSelectedTemplate(null);
                        setTemplateParams([]);
                        setTemplateResult(null);
                      } else {
                        setSelectedTemplate(tpl.name);
                        setTemplateParams(tpl.variables.map(() => ""));
                        setTemplateResult(null);
                        setTemplatePreviewOpen(false);
                      }
                    }}
                    className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedTemplate === tpl.name
                        ? "border-green-500 bg-green-50 shadow-md"
                        : "border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm text-gray-900">{tpl.label}</p>
                      {selectedTemplate === tpl.name && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Template: <span className="font-mono text-green-700">{tpl.name}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {tpl.variables.length > 0
                        ? `${tpl.variables.length} variable(s): ${tpl.variableLabels.join(", ")}`
                        : "No variables — sends as-is"}
                    </p>
                  </button>
                ))}
              </div>

              {/* Active template details */}
              {activeTemplate && (
                <div className="space-y-4 pt-2 border-t border-gray-100">
                  {/* Preview toggle */}
                  <button
                    onClick={() => setTemplatePreviewOpen(!templatePreviewOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    {templatePreviewOpen ? "Hide" : "Show"} Template Preview
                    <ChevronDown className={`w-4 h-4 transition-transform ${templatePreviewOpen ? "rotate-180" : ""}`} />
                  </button>

                  {templatePreviewOpen && (
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200 max-h-64 overflow-y-auto">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {getPreviewContent()}
                      </p>
                    </div>
                  )}

                  {/* Phone + Hospital + Doctor */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={templatePhone}
                          onChange={(e) => setTemplatePhone(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:bg-white transition-all"
                          maxLength={15}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">
                        Hospital Name
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="e.g. Apollo Hospital"
                          value={templateHospitalName}
                          onChange={(e) => setTemplateHospitalName(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">
                        Doctor Name
                      </label>
                      <div className="relative">
                        <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="e.g. Dr. Sharma"
                          value={templateDoctorName}
                          onChange={(e) => setTemplateDoctorName(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Variable inputs */}
                  {activeTemplate.variables.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Fill Template Variables
                      </p>
                      {activeTemplate.variables.map((v, i) => (
                        <div key={v}>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">
                            {v} — {activeTemplate.variableLabels[i]}
                          </label>
                          <input
                            type="text"
                            placeholder={`Enter ${activeTemplate.variableLabels[i]}`}
                            value={templateParams[i] || ""}
                            onChange={(e) => {
                              const updated = [...templateParams];
                              updated[i] = e.target.value;
                              setTemplateParams(updated);
                            }}
                            className="w-full max-w-md px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:bg-white transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Send template button */}
                  <button
                    onClick={handleTemplateSend}
                    disabled={
                      sendingTemplate ||
                      !templatePhone.trim() ||
                      (activeTemplate.variables.length > 0 &&
                        !templateParams.every((p) => p.trim() !== ""))
                    }
                    className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold text-sm shadow-md hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transform hover:-translate-y-0.5"
                  >
                    {sendingTemplate ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Send Template
                  </button>
                </div>
              )}

              {/* Template send result */}
              {templateResult && (
                <div
                  className={`px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium ${
                    templateResult.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {templateResult.type === "success" ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {templateResult.msg}
                </div>
              )}
            </div>
          </div>

          {/* Send Message Card */}
          <div className="rounded-2xl shadow-lg border-2 border-orange-200 bg-white transition-all duration-300 hover:shadow-xl hover:border-orange-300 overflow-hidden">
            <button
              onClick={() => setSendMessageOpen(!sendMessageOpen)}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-5 h-5 text-white" />
              <h3 className="font-bold text-white text-sm">
                Send WhatsApp Message
              </h3>
              <ChevronDown className={`w-5 h-5 text-white ml-auto transition-transform duration-200 ${sendMessageOpen ? 'rotate-180' : ''}`} />
            </button>

            {sendMessageOpen && (
            <>
            <div className="p-6 space-y-4">
              {/* Row 1: Phone + Hospital + Doctor */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white transition-all"
                      maxLength={15}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">
                    Hospital Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. Apollo Hospital"
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">
                    Doctor Name
                  </label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. Dr. Sharma"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Message */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">
                  Message
                </label>
                <textarea
                  rows={3}
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Row 3: Attachment + Send */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                <div className="flex-1 w-full">
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">
                    Attachment{" "}
                    <span className="text-gray-400 normal-case font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    ref={fileRef}
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
                  />
                  {file && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200 w-fit">
                      <Paperclip className="w-3 h-3 text-orange-500" />
                      <span className="truncate max-w-xs font-medium">
                        {file.name}
                      </span>
                      <span className="text-gray-400">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                      <button
                        onClick={() => {
                          setFile(null);
                          if (fileRef.current) fileRef.current.value = "";
                        }}
                        className="text-red-400 hover:text-red-600 ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSend}
                  disabled={
                    sending || !phone.trim() || (!message.trim() && !file)
                  }
                  className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-bold text-sm shadow-md hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transform hover:-translate-y-0.5"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send Message
                </button>
              </div>
            </div>

            {/* Send result toast */}
            {sendResult && (
              <div
                className={`mx-6 mb-4 px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium ${
                  sendResult.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {sendResult.type === "success" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                {sendResult.msg}
              </div>
            )}
            </>
            )}
          </div>

          {/* History Section */}
          <div className="rounded-2xl shadow-lg border-2 border-orange-200 bg-white transition-all duration-300 overflow-hidden">
            {/* History Header */}
            <div className="bg-gradient-to-r from-gray-50 to-orange-50 px-6 py-4 border-b border-orange-100">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Sent History</h3>
                    <p className="text-xs text-gray-500">
                      {total} messages sent
                    </p>
                  </div>
                </div>

                {/* Search */}
                <div className="relative w-full lg:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search phone, message..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
              </div>

              {/* Filters row */}
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mr-1">
                  <Filter className="w-3.5 h-3.5" />
                  Filters:
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="all">All Types</option>
                  <option value="text">Text</option>
                  <option value="template">Template</option>
                  <option value="document">Document</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                </select>
                <select
                  value={filterHospital}
                  onChange={(e) => setFilterHospital(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="">All Hospitals</option>
                  {hospitals.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <select
                  value={filterDoctor}
                  onChange={(e) => setFilterDoctor(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="">All Doctors</option>
                  {doctors.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {(filterType !== "all" || filterHospital || filterDoctor) && (
                  <button
                    onClick={() => {
                      setFilterType("all");
                      setFilterHospital("");
                      setFilterDoctor("");
                    }}
                    className="px-2.5 py-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* History Content */}
            {historyLoading ? (
              <div className="flex flex-col justify-center items-center py-20">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-3" />
                <p className="text-sm text-gray-400">Loading messages...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-orange-300" />
                </div>
                <p className="font-semibold text-gray-700">
                  No messages found
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Send your first message using the form above
                </p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-3 px-6 py-2.5 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-2">Phone</div>
                  <div className="col-span-4">Message</div>
                  <div className="col-span-1 text-center">Media</div>
                  <div className="col-span-2 text-center">Tags</div>
                  <div className="col-span-2 text-center">Status</div>
                  <div className="col-span-1 text-center">Action</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {history.map((item) => (
                    <div
                      key={item._id}
                      className="px-6 py-3.5 hover:bg-orange-50/40 transition-all duration-200 group"
                    >
                      {/* Desktop row */}
                      <div className="hidden md:grid grid-cols-12 gap-3 items-center">
                        {/* Phone */}
                        <div className="col-span-2">
                          <p className="font-semibold text-sm text-gray-800">
                            {formatPhone(item.phone)}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {timeAgo(item.createdAt)}
                          </p>
                        </div>

                        {/* Message */}
                        <div className="col-span-4 min-w-0">
                          {item.type === "template" ? (
                            <div
                              onClick={() => setExpandedMsg(item)}
                              className="cursor-pointer hover:opacity-80 transition-opacity"
                              title="Click to read full message"
                            >
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-100 text-green-700 border border-green-200 text-[11px] font-bold mb-1">
                                <FileText className="w-3 h-3" />
                                Template
                              </span>
                              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                {item.message}
                              </p>
                            </div>
                          ) : item.message ? (
                            <p
                              onClick={() => setExpandedMsg(item)}
                              className="text-sm text-gray-600 line-clamp-2 leading-relaxed cursor-pointer hover:text-gray-900 transition-colors"
                              title="Click to read full message"
                            >
                              {item.message}
                            </p>
                          ) : item.documentName ? (
                            <p className="text-sm text-gray-400 italic">
                              File only — no message
                            </p>
                          ) : (
                            <p className="text-sm text-gray-300">—</p>
                          )}
                          {item.error && (
                            <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {item.error}
                            </p>
                          )}
                        </div>

                        {/* Media */}
                        <div className="col-span-1 flex justify-center">
                          {item.documentUrl && item.type === "image" ? (
                            <button
                              onClick={() => setPreviewImage(item.documentUrl)}
                              className="w-10 h-10 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-200 cursor-pointer group/img"
                              title="Click to view"
                            >
                              <img
                                src={item.documentUrl}
                                alt={item.documentName || "image"}
                                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform"
                              />
                            </button>
                          ) : item.documentName ? (
                            <div
                              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-700 max-w-[100px]"
                              title={item.documentName}
                            >
                              {typeIcon(item.type)}
                              <span className="truncate">
                                {item.documentName.split(".").pop()?.toUpperCase()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </div>

                        {/* Tags */}
                        <div className="col-span-2 flex flex-col items-center gap-1">
                          {item.hospitalName && (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-1 max-w-full truncate">
                              <Building2 className="w-3 h-3 shrink-0" />
                              <span className="truncate">
                                {item.hospitalName}
                              </span>
                            </span>
                          )}
                          {item.doctorName && (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200 flex items-center gap-1 max-w-full truncate">
                              <Stethoscope className="w-3 h-3 shrink-0" />
                              <span className="truncate">
                                {item.doctorName}
                              </span>
                            </span>
                          )}
                          {!item.hospitalName && !item.doctorName && (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </div>

                        {/* Status */}
                        <div className="col-span-2 flex justify-center">
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-lg border-2 ${
                              item.status === "sent"
                                ? "bg-green-100 text-green-700 border-green-300"
                                : "bg-red-100 text-red-700 border-red-300"
                            }`}
                          >
                            {item.status === "sent" ? "Sent" : "Failed"}
                          </span>
                        </div>

                        {/* Delete */}
                        <div className="col-span-1 flex justify-center">
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Mobile card */}
                      <div className="md:hidden space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-sm text-gray-800">
                              {formatPhone(item.phone)}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              {timeAgo(item.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                                item.status === "sent"
                                  ? "bg-green-100 text-green-700 border-green-300"
                                  : "bg-red-100 text-red-700 border-red-300"
                              }`}
                            >
                              {item.status === "sent" ? "Sent" : "Failed"}
                            </span>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {item.message && (
                          <div onClick={() => setExpandedMsg(item)} className="cursor-pointer">
                            {item.type === "template" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-100 text-green-700 border border-green-200 text-[11px] font-bold mb-1">
                                <FileText className="w-3 h-3" />
                                Template
                              </span>
                            )}
                            <p className="text-sm text-gray-600 line-clamp-2 hover:text-gray-900 transition-colors">
                              {item.message}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-2 flex-wrap">
                          {item.documentUrl && item.type === "image" && (
                            <button
                              onClick={() => setPreviewImage(item.documentUrl)}
                              className="w-9 h-9 rounded-lg overflow-hidden border-2 border-gray-200"
                            >
                              <img
                                src={item.documentUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </button>
                          )}
                          {item.documentName && item.type !== "image" && (
                            <span className="text-[11px] px-2 py-0.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 flex items-center gap-1">
                              <Paperclip className="w-3 h-3" />{" "}
                              {item.documentName}
                            </span>
                          )}
                          {item.hospitalName && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-1">
                              <Building2 className="w-3 h-3" />{" "}
                              {item.hospitalName}
                            </span>
                          )}
                          {item.doctorName && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200 flex items-center gap-1">
                              <Stethoscope className="w-3 h-3" />{" "}
                              {item.doctorName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-xs text-gray-500 font-medium">
                      Page {page} of {totalPages} &middot; {total} total
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg border-2 border-gray-200 text-xs font-bold text-gray-600 hover:bg-white hover:border-orange-300 disabled:opacity-40 transition-all"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Prev
                      </button>
                      <button
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page >= totalPages}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg border-2 border-gray-200 text-xs font-bold text-gray-600 hover:bg-white hover:border-orange-300 disabled:opacity-40 transition-all"
                      >
                        Next <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Message Detail Modal */}
      {expandedMsg && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setExpandedMsg(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setExpandedMsg(null)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3">
              <p className="text-white font-bold text-sm">Message Details</p>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(85vh-48px)]">
              {/* To / Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold text-gray-800">{formatPhone(expandedMsg.phone)}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(expandedMsg.createdAt).toLocaleString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Tags */}
              {(expandedMsg.hospitalName || expandedMsg.doctorName) && (
                <div className="flex flex-wrap gap-2">
                  {expandedMsg.hospitalName && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {expandedMsg.hospitalName}
                    </span>
                  )}
                  {expandedMsg.doctorName && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-200 flex items-center gap-1">
                      <Stethoscope className="w-3 h-3" /> {expandedMsg.doctorName}
                    </span>
                  )}
                </div>
              )}

              {/* Full Message */}
              {expandedMsg.message && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {expandedMsg.message}
                  </p>
                </div>
              )}

              {/* Image preview inside modal */}
              {expandedMsg.documentUrl && expandedMsg.type === "image" && (
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={expandedMsg.documentUrl}
                    alt={expandedMsg.documentName || "image"}
                    className="w-full max-h-60 object-contain bg-gray-50"
                  />
                </div>
              )}

              {/* File badge */}
              {expandedMsg.documentName && expandedMsg.type !== "image" && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-50 border border-orange-200 text-sm text-orange-700 w-fit">
                  <Paperclip className="w-4 h-4" />
                  <span className="font-medium">{expandedMsg.documentName}</span>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-lg border-2 ${
                  expandedMsg.status === "sent"
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "bg-red-100 text-red-700 border-red-300"
                }`}>
                  {expandedMsg.status === "sent" ? "Sent" : "Failed"}
                </span>
                {expandedMsg.error && (
                  <span className="text-xs text-red-500">{expandedMsg.error}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 z-10 p-2 bg-white rounded-full shadow-xl hover:bg-red-50 transition-colors border-2 border-gray-200"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
