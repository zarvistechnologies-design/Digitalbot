"use client";
import Sidebar from "@/components/Sidebar";
import { healthiqureAPI } from "@/lib/api";
import {
  Download,
  Eye,
  FileImage,
  FileText,
  Loader2,
  MapPin,
  Menu,
  Phone,
  RefreshCw,
  Search,
  X
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// Types
interface MediaItem {
  id: string;
  type?: string; // 'image' | 'document' | 'video'
  mime_type?: string;
}

interface BotSession {
  _id: string;
  phone: string;
  language: string | null;
  state: string;
  location: string | null;
  service: string | null;
  subChoice: string | null;
  mediaUrls: (string | MediaItem)[];
  userInput: string | null;
  patientInfo?: {
    name?: string;
    age?: string;
    gender?: string;
    type?: string;
  };
  lastActivity: string;
  createdAt: string;
  _source?: 'live' | 'history';
  _historyId?: string;
}

// Normalize media entry (handles both old string IDs and new {id, type} objects)
function getMediaId(entry: string | MediaItem): string {
  if (typeof entry === 'string') return entry;
  return entry.id || '';
}

function getMediaType(entry: string | MediaItem): 'image' | 'document' | 'video' {
  if (typeof entry === 'object' && entry.type) {
    return entry.type as 'image' | 'document' | 'video';
  }
  return 'document'; // default for old string-only entries
}

// Fetch media via axios (with auth header) and return a blob URL
async function fetchMediaBlob(mediaId: string): Promise<string | null> {
  try {
    const res = await healthiqureAPI.getMediaBlob(mediaId);
    // res.data is already a Blob when responseType: 'blob'
    const blob = res.data instanceof Blob ? res.data : new Blob([res.data]);
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

const serviceLabels: Record<string, string> = {
  doctor: "Doctor Consultation",
  pharmacy: "Pharmacy / Medicines",
  lab: "Laboratory Tests",
  ecg: "ECG",
  ultrasound: "Ultrasound",
  skin: "Skin Clinic",
  hospital: "Hospital Admission",
  emergency: "Emergency Help",
};

const serviceColors: Record<string, string> = {
  doctor: "bg-blue-100 text-blue-700 border-blue-200",
  pharmacy: "bg-green-100 text-green-700 border-green-200",
  lab: "bg-orange-100 text-orange-700 border-orange-200",
  ecg: "bg-red-100 text-red-700 border-red-200",
  ultrasound: "bg-teal-100 text-teal-700 border-teal-200",
  skin: "bg-pink-100 text-pink-700 border-pink-200",
  hospital: "bg-orange-100 text-orange-700 border-orange-200",
  emergency: "bg-red-100 text-red-800 border-red-300",
};

function formatPhone(phone: string) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) {
    return `+91 ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

function getFileIcon(type: string) {
  if (type === "image") return FileImage;
  return FileText;
}

export default function BotDocumentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<BotSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterService, setFilterService] = useState("all");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  // Cache of blob URLs keyed by media ID
  const [blobUrls, setBlobUrls] = useState<Record<string, string>>({});
  const [loadingMedia, setLoadingMedia] = useState<Record<string, boolean>>({});

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 50 };
      if (filterLocation !== "all") params.location = filterLocation;
      if (filterService !== "all") params.service = filterService;

      const res = await healthiqureAPI.getDocuments(params);
      setSessions(res.data?.data || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  }, [page, filterLocation, filterService]);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  // Fetch a single media blob and cache it
  const loadMedia = useCallback(async (mediaId: string) => {
    if (blobUrls[mediaId] || loadingMedia[mediaId]) return blobUrls[mediaId] || null;
    setLoadingMedia(prev => ({ ...prev, [mediaId]: true }));
    const url = await fetchMediaBlob(mediaId);
    if (url) setBlobUrls(prev => ({ ...prev, [mediaId]: url }));
    setLoadingMedia(prev => ({ ...prev, [mediaId]: false }));
    return url;
  }, [blobUrls, loadingMedia]);

  // Handle View click — fetch blob and open directly in new tab
  const handleView = useCallback(async (mediaId: string) => {
    const url = blobUrls[mediaId] || await loadMedia(mediaId);
    if (url) window.open(url, '_blank');
  }, [blobUrls, loadMedia]);

  // Handle Download click — fetch blob and trigger download
  const handleDownload = useCallback(async (mediaId: string, filename: string) => {
    const url = blobUrls[mediaId] || await loadMedia(mediaId);
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [blobUrls, loadMedia]);

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(blobUrls).forEach(url => URL.revokeObjectURL(url));
    };
  }, [blobUrls]);

  // Total document count
  const totalDocs = sessions.reduce((sum, s) => sum + (s.mediaUrls?.length || 0), 0);

  // Filter by search
  const filtered = sessions.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.phone.includes(q) || s.patientInfo?.name?.toLowerCase().includes(q) || s.service?.toLowerCase().includes(q);
  });

  // Group by service
  const byService: Record<string, { count: number; sessions: number }> = {};
  sessions.forEach((s) => {
    const svc = s.service || "unknown";
    if (!byService[svc]) byService[svc] = { count: 0, sessions: 0 };
    byService[svc].count += s.mediaUrls?.length || 0;
    byService[svc].sessions += 1;
  });

  if (loading && sessions.length === 0) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-100">
        <div className="hidden lg:block"><Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /></div>
        <main className="flex-1 lg:ml-60 p-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-lg text-slate-600 font-medium">Loading documents...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-100">
      {/* Mobile Menu */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-slate-200">
        {sidebarOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
      </button>
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}>
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}
      <div className="hidden lg:block"><Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /></div>

      <main className="flex-1 lg:ml-60 p-4 sm:p-6 md:p-8 pt-20 lg:pt-8">
        <div className="container mx-auto max-w-7xl">

          {/* Header */}
          <header className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-orange-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  Bot Documents
                </h1>
                <p className="text-slate-600 text-sm sm:text-base">Prescriptions, reports & files uploaded by patients through the WhatsApp bot</p>
              </div>
              <button onClick={fetchDocuments} className="p-2 bg-white rounded-xl border border-slate-300 shadow-md hover:bg-orange-50 transition-colors self-start">
                <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </header>

          {/* Stats Cards */}
          <section className="mb-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg">
                <p className="text-slate-500 text-xs font-medium mb-1">Total Documents</p>
                <p className="text-3xl font-bold text-slate-800">{totalDocs}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg">
                <p className="text-slate-500 text-xs font-medium mb-1">Patients with Docs</p>
                <p className="text-3xl font-bold text-slate-800">{total}</p>
              </div>
              {Object.entries(byService).slice(0, 2).map(([svc, data]) => (
                <div key={svc} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg">
                  <p className="text-slate-500 text-xs font-medium mb-1">{serviceLabels[svc] || svc}</p>
                  <p className="text-3xl font-bold text-slate-800">{data.count} <span className="text-sm font-normal text-slate-400">docs</span></p>
                </div>
              ))}
            </div>
          </section>

          {/* Filters */}
          <section className="mb-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-lg">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by phone or patient name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <select value={filterLocation} onChange={(e) => { setFilterLocation(e.target.value); setPage(1); }} className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-slate-50">
                    <option value="all">All Locations</option>
                    <option value="bordumsa">Bordumsa</option>
                    <option value="miao">Miao</option>
                    <option value="other">Other</option>
                  </select>
                  <select value={filterService} onChange={(e) => { setFilterService(e.target.value); setPage(1); }} className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-slate-50">
                    <option value="all">All Services</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="lab">Lab</option>
                    <option value="hospital">Hospital</option>
                    <option value="doctor">Doctor</option>
                    <option value="ultrasound">Ultrasound</option>
                    <option value="skin">Skin</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Document Cards */}
          <section className="space-y-4">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-lg text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No documents found</p>
                <p className="text-slate-400 text-sm mt-1">Patients haven&apos;t uploaded any documents yet, or try changing filters</p>
              </div>
            ) : (
              filtered.map((session) => (
                <div key={session._id} className="bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all p-5">
                  {/* Patient info header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-md shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800">{formatPhone(session.phone)}</span>
                        {session.patientInfo?.name && (
                          <span className="text-sm text-slate-600">- {session.patientInfo.name}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        {session.location && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {session.location.charAt(0).toUpperCase() + session.location.slice(1)}
                          </span>
                        )}
                        {session.service && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${serviceColors[session.service] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                            {serviceLabels[session.service] || session.service}
                          </span>
                        )}
                        {session._source === 'history' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">Past Query</span>
                        )}
                        <span className="text-xs text-slate-400">{new Date(session.lastActivity).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold">
                        {session.mediaUrls.length} file{session.mediaUrls.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* User input context */}
                  {session.userInput && (
                    <div className="mb-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-500 font-semibold mb-1">Patient&apos;s Message:</p>
                      <p className="text-sm text-slate-700">{session.userInput}</p>
                    </div>
                  )}

                  {/* Document grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {session.mediaUrls.map((entry, i) => {
                      const mediaId = getMediaId(entry);
                      const mediaType = getMediaType(entry);
                      const IconComp = getFileIcon(mediaType);
                      const isImage = mediaType === 'image';
                      const isValid = mediaId && mediaId !== 'media_uploaded';
                      const cachedBlob = blobUrls[mediaId];
                      const isLoading = loadingMedia[mediaId];

                      if (!isValid) {
                        return (
                          <div key={i} className="h-40 bg-slate-50 flex flex-col items-center justify-center gap-2 p-4 border border-slate-200 rounded-xl">
                            <IconComp className="w-10 h-10 text-slate-300" />
                            <p className="text-xs text-slate-400 font-medium">Media unavailable</p>
                          </div>
                        );
                      }

                      return (
                        <div key={i} className="relative group border border-slate-200 rounded-xl overflow-hidden hover:border-orange-300 transition-colors">
                          {isImage ? (
                            <div className="relative h-40 bg-slate-100">
                              {cachedBlob ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={cachedBlob} alt={`Document ${i + 1}`} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                  {isLoading ? (
                                    <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
                                  ) : (
                                    <button onClick={() => loadMedia(mediaId)} className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-xs font-semibold hover:bg-orange-200 transition-colors">
                                      Load Image
                                    </button>
                                  )}
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                <button onClick={() => handleView(mediaId)} disabled={isLoading} className="p-2 bg-white rounded-full shadow-lg hover:bg-orange-50">
                                  {isLoading ? <Loader2 className="w-4 h-4 text-slate-400 animate-spin" /> : <Eye className="w-4 h-4 text-slate-700" />}
                                </button>
                                <button onClick={() => handleDownload(mediaId, `document-${i + 1}`)} disabled={isLoading} className="p-2 bg-white rounded-full shadow-lg hover:bg-orange-50">
                                  {isLoading ? <Loader2 className="w-4 h-4 text-slate-400 animate-spin" /> : <Download className="w-4 h-4 text-slate-700" />}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="h-40 bg-slate-50 flex flex-col items-center justify-center gap-2 p-4">
                              <IconComp className="w-10 h-10 text-orange-400" />
                              <p className="text-xs text-slate-500 font-medium text-center truncate w-full">
                                {mediaType === 'video' ? 'Video' : 'Document'} {i + 1}
                                {mediaId !== 'media_uploaded' && <span className="block text-slate-400 text-[10px]">ID: {mediaId.slice(-8)}</span>}
                              </p>
                              <div className="flex gap-2 mt-1">
                                <button onClick={() => handleView(mediaId)} disabled={isLoading} className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-orange-50 transition-colors">
                                  {isLoading ? <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" /> : <Eye className="w-3.5 h-3.5 text-slate-600" />}
                                </button>
                                <button onClick={() => handleDownload(mediaId, `document-${i + 1}`)} disabled={isLoading} className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-orange-50 transition-colors">
                                  {isLoading ? <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" /> : <Download className="w-3.5 h-3.5 text-slate-600" />}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Pagination */}
          {total > 50 && (
            <section className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-orange-50 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-slate-600 font-medium">
                Page {page} of {Math.ceil(total / 50)}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(total / 50)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-orange-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </section>
          )}
        </div>
      </main>


    </div>
  );
}
