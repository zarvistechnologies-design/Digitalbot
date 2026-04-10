"use client";
import Sidebar from "@/components/Sidebar";
import { healthiqureAPI } from "@/lib/api";
import {
    AlertCircle,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    File,
    FileText,
    Image,
    Loader2,
    Menu,
    Paperclip,
    Phone,
    Search,
    Send,
    Trash2,
    Video,
    X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface HistoryItem {
  _id: string;
  phone: string;
  message: string;
  type: string;
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
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function typeIcon(type: string) {
  switch (type) {
    case "image": return <Image className="w-4 h-4 text-blue-500" />;
    case "video": return <Video className="w-4 h-4 text-purple-500" />;
    case "audio": return <FileText className="w-4 h-4 text-yellow-600" />;
    case "document": return <File className="w-4 h-4 text-orange-500" />;
    default: return <Send className="w-4 h-4 text-green-500" />;
  }
}

export default function QuickMessagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Send form state
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await healthiqureAPI.getMessageHistory({
        page,
        limit: 30,
        search: search || undefined,
        type: filterType !== "all" ? filterType : undefined,
      });
      const data = res.data;
      setHistory(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setHistoryLoading(false);
    }
  }, [page, search, filterType]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);
  useEffect(() => { setPage(1); }, [search, filterType]);

  const handleSend = async () => {
    const cleanPhone = phone.trim().replace(/\D/g, "");
    if (!cleanPhone) return;
    if (!message.trim() && !file) return;

    setSending(true);
    setSendResult(null);
    try {
      const fullPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
      const formData = new FormData();
      formData.append("phone", fullPhone);
      if (message.trim()) formData.append("message", message.trim());
      if (file) formData.append("document", file);

      await healthiqureAPI.sendQuickMessage(formData);
      setSendResult({ type: "success", msg: `Message sent to +${fullPhone}` });
      setMessage("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      fetchHistory();
    } catch (err) {
      console.error("Send failed:", err);
      setSendResult({ type: "error", msg: "Failed to send message. Please try again." });
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-100">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-slate-200"
      >
        {sidebarOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
      </button>
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}>
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}
      <div className="hidden lg:block">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      <main className="flex-1 lg:ml-60 p-4 sm:p-6 md:p-8 pt-20 lg:pt-8">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-green-600 to-green-600 bg-clip-text text-transparent mb-2">
              Quick Messages
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Send WhatsApp messages &amp; documents to any number and view sent history
            </p>
          </header>

          {/* Send Message Panel */}
          <div className="mb-6 bg-white rounded-2xl p-5 border border-green-200 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Send className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-slate-800">Send WhatsApp Message</h3>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="sm:w-56">
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
                      maxLength={15}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Message</label>
                  <textarea
                    rows={2}
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onInput={(e) => {
                      const t = e.target as HTMLTextAreaElement;
                      t.style.height = "auto";
                      t.style.height = t.scrollHeight + "px";
                    }}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all resize-none overflow-hidden"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
                <div className="flex-1 w-full">
                  <label className="text-xs font-medium text-slate-600 mb-1 block">
                    Attach Document / Image / Video (optional)
                  </label>
                  <div className="relative">
                    <input
                      ref={fileRef}
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 border border-slate-200 rounded-xl cursor-pointer"
                      accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
                    />
                  </div>
                  {file && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                      <Paperclip className="w-3 h-3" />
                      <span className="truncate max-w-xs">{file.name}</span>
                      <span className="text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                      <button onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ""; }} className="text-red-400 hover:text-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSend}
                  disabled={sending || !phone.trim() || (!message.trim() && !file)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send Message
                </button>
              </div>
            </div>

            {sendResult && (
              <p className={`text-xs font-medium mt-3 flex items-center gap-1 ${sendResult.type === "success" ? "text-green-600" : "text-red-600"}`}>
                {sendResult.type === "success" ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {sendResult.msg}
              </p>
            )}
          </div>

          {/* History Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-500" />
                <h3 className="font-semibold text-slate-800">Sent History</h3>
                <span className="text-xs text-slate-400">({total} messages)</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search phone, message..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="all">All Types</option>
                  <option value="text">Text</option>
                  <option value="document">Document</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                </select>
              </div>
            </div>

            {historyLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Send className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="font-medium">No messages sent yet</p>
                <p className="text-sm mt-1">Send your first message above</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-slate-100">
                  {history.map((item) => (
                    <div key={item._id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          {typeIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-sm text-slate-800">
                              {formatPhone(item.phone)}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              item.status === "sent" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                              {item.status.toUpperCase()}
                            </span>
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase">
                              {item.type}
                            </span>
                          </div>
                          {item.message && (
                            <p className="text-sm text-slate-600 line-clamp-2">{item.message}</p>
                          )}
                          {item.documentName && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-orange-600">
                              <Paperclip className="w-3 h-3" />
                              <span className="truncate max-w-xs">{item.documentName}</span>
                            </div>
                          )}
                          {item.error && (
                            <p className="text-xs text-red-500 mt-1">{item.error}</p>
                          )}
                          <p className="text-[11px] text-slate-400 mt-1">{timeAgo(item.createdAt)}</p>
                        </div>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="shrink-0 p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                      Page {page} of {totalPages} ({total} total)
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                      >
                        <ChevronLeft className="w-3 h-3" /> Prev
                      </button>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                      >
                        Next <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
