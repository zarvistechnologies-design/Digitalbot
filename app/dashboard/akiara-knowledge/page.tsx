"use client";
import Sidebar from "@/components/Sidebar";
import {
    BookOpen,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Home,
    Menu,
    Package,
    Phone,
    Play,
    Search,
    Shield,
    Ticket,
    Video,
    Wrench,
    X,
} from "lucide-react";
import { useState } from "react";

// ============================================================
// COMPLETE KNOWLEDGE BASE DATA (from Devika Agent KB v1.1)
// ============================================================

interface TroubleshootingItem {
  issue: string;
  triggers: string;
  videoUrl: string;
  steps?: string;
}

const miniVideos: TroubleshootingItem[] = [
  { issue: "Back side stitching loose", triggers: "peeche ki silai dhili, bobbin thread, neeche ka thread, back side loose", videoUrl: "http://youtu.be/YJJn8caCxZs" },
  { issue: "Needle thread breaking", triggers: "thread toot raha, needle thread break, dhaga tootta hai, sui ka dhaga", videoUrl: "http://youtu.be/JNZKCRbjbKY" },
  { issue: "Cloth not stitching", triggers: "kapda silai nahi, cloth not moving, stitching nahi, machine chal nahi", videoUrl: "http://youtube/kW1EMB7BbFY" },
  { issue: "Button Problem", triggers: "button problem, button issue, button not working, button stuck", videoUrl: "", steps: "Ask customer to send video explaining the issue." },
  { issue: "No Stitch", triggers: "not stitches, no stitch, stitching problem, stitch issue", videoUrl: "https://youtube.com/shorts/YJJn8caCxZs", steps: "Step 1: Re-thread the machine properly. Step 2: Check bottom bobbin placement — https://youtu.be/L1OJ5p2PJpg" },
  { issue: "Foot Pedal Not Working", triggers: "pedal not working, foot control issue, pedal kaam nahi kar raha", videoUrl: "", steps: "Ask customer to send video explaining the issue." },
  { issue: "Machine Noisy", triggers: "noise issue, sound problem, awaaz aa rahi hai", videoUrl: "", steps: "Ask customer to send video explaining the issue." },
  { issue: "Speed Issue", triggers: "speed problem, slow/fast issue, speed control problem", videoUrl: "", steps: "Ask customer to send video explaining the issue." },
  { issue: "Machine Stops Midway", triggers: "stops suddenly, ruk rahi hai machine", videoUrl: "https://youtube.com/shorts/YJJn8caCxZs", steps: "4 steps: 1. Thread issue video, 2. Bottom bobbin holder placement — https://youtube.com/shorts/pGWixrBAGMw, 3. Replace bent needle — https://youtube.com/shorts/KcvyfR1n90A, 4. Remove stuck thread & avoid thick fabric." },
  { issue: "Burning Smell", triggers: "burning smell, jalne ki smell", videoUrl: "", steps: "Connect with Agent immediately." },
  { issue: "Machine Bobbin Refill Issue", triggers: "bobbin refill problem, bobbin jam, bobbin issue", videoUrl: "https://youtu.be/mjEjJdpTAjI" },
  { issue: "Fabric Not Moving", triggers: "fabric not moving, kapda nahi chal raha", videoUrl: "", steps: "Ask customer to send video." },
  { issue: "Needle Stuck", triggers: "needle jam, sui fas gayi", videoUrl: "https://youtube.com/shorts/KcvyfR1n90A" },
  { issue: "Light Not Working", triggers: "light issue, bulb not working, light nahi jal rahi", videoUrl: "", steps: "Ask customer to send video." },
  { issue: "Adapter Issue", triggers: "adapter problem, charger issue, adapter not working", videoUrl: "", steps: "Ask customer to send video." },
  { issue: "No Power", triggers: "no power, power nahi aa raha", videoUrl: "", steps: "Ask customer to send video." },
  { issue: "Needle Bar Damage", triggers: "needle bar issue, needle rod damage, sui rod problem", videoUrl: "", steps: "Ask customer to send video." },
  { issue: "Machine Stuck", triggers: "needle jam, Machine Stuck, handwheel turning", videoUrl: "https://youtube.com/shorts/pGWixrBAGMw", steps: "1. Fix bobbin placement, 2. Replace bent needle — https://youtube.com/shorts/KcvyfR1n90A, 3. Share close-up needle photo." },
  { issue: "Thread stuck in Thread pool gap", triggers: "Thread Jam, Thread Fasna, Dhaga Jam, Dhaga Fasna", videoUrl: "https://youtu.be/PKpdViwXplc" },
  { issue: "Demo Video (Hindi)", triggers: "Demo, Mini Demo, how to use, Silai Demo", videoUrl: "https://youtu.be/nLES3YK_bao" },
  { issue: "Demo Video (English)", triggers: "Demo, Mini Demo, how to use, Tutorial", videoUrl: "https://youtu.be/x_Zlm6b27Vs" },
];

const yumeVideos: TroubleshootingItem[] = [
  { issue: "Thread Breaking", triggers: "thread breaking, dhaga toot raha hai, Yume not working", videoUrl: "https://youtube.com/shorts/mG-1GgbCeeE" },
  { issue: "Stitch Improper", triggers: "improper stitch, loose stitch, tight stitch, silai kharab", videoUrl: "https://youtu.be/hkwRfUE5Hik", steps: "Step 1: Check upper thread & bobbin filled. Step 2: Re-thread through all 7 points. Step 3: Remove spring from reel holder." },
  { issue: "Stitches Not Coming", triggers: "no stitch, stitch not forming, silai nahi ho rahi", videoUrl: "https://youtu.be/hkwRfUE5Hik", steps: "Step 1: Re-thread properly. Step 2: Check bottom bobbin — https://youtu.be/OQ_fAkhflds" },
  { issue: "Needle Breaking", triggers: "needle breaking, sui toot rahi hai", videoUrl: "https://youtube.com/shorts/4uADaftAtXY" },
  { issue: "Bobbin Refill", triggers: "bobbin issue, lower thread, bobbin refill", videoUrl: "https://youtu.be/guI0b6JROUw" },
  { issue: "Skipped Zig Zag Stitches v2", triggers: "skipped stitch, gap stitch, stitch skip", videoUrl: "https://youtube.com/shorts/z9f7J-0Y2zU" },
  { issue: "Stitches Skipped v3", triggers: "skipped stitch, gap stitch, stitch skip", videoUrl: "https://youtube.com/shorts/WtJnIhL8JSM" },
  { issue: "Thread Breaking v2", triggers: "thread breaking, dhaga toot raha", videoUrl: "https://www.youtube.com/shorts/mG-1GgbCeeE" },
  { issue: "Demo", triggers: "Demo, Yume Demo, how to use, Tutorial", videoUrl: "https://youtu.be/fupg6dGKSJk" },
  { issue: "Sound Issue v2", triggers: "Sound issue, Unusual sound", videoUrl: "https://youtube.com/shorts/tNyylzNHj04" },
  { issue: "Needle Size (Fabric Type)", triggers: "needle size, fabric needle, kaunsa needle", videoUrl: "https://youtu.be/VQdDGI4DtNg" },
  { issue: "Presser Foot Replacement", triggers: "presser foot change, foot replace", videoUrl: "https://youtu.be/LJ8JIe9DOZU" },
  { issue: "Reverse Restriction (Pattern 6-17-1)", triggers: "reverse issue, pattern reverse, ulta silai", videoUrl: "https://youtube.com/shorts/Ud-MrdjuFPc" },
  { issue: "Pico Stitch", triggers: "pico stitch, pico silai, edge stitch", videoUrl: "https://youtu.be/IO6TjUig2VE" },
  { issue: "Button Hole", triggers: "button hole, button silai", videoUrl: "https://youtu.be/A2QLLOqefoU" },
  { issue: "Interlock Stitch", triggers: "interlock stitch, lock stitch, majboot silai", videoUrl: "https://youtu.be/FQhvFqtTHmg" },
  { issue: "Hemming Stitch", triggers: "hemming stitch, hem silai, fold stitch", videoUrl: "https://youtu.be/B53BCXNkyoI" },
  { issue: "Applique Stitch", triggers: "applique stitch, design silai, decorative", videoUrl: "https://youtu.be/aNxE9J3RGjw" },
  { issue: "Darning Stitch", triggers: "darning stitch, repair silai, hole repair", videoUrl: "https://youtu.be/Vix7qOjI2Vk" },
  { issue: "Shell Tuck Stitch", triggers: "shell tuck stitch, shell design", videoUrl: "https://youtu.be/Vix7qOjI2Vk" },
  { issue: "Reverse Stitching Issue", triggers: "reverse issue, back stitch, ulta silai", videoUrl: "https://youtube.com/shorts/nAZuynu9TQs" },
];

const duoVideos: TroubleshootingItem[] = [
  { issue: "Thread Break / Tension Issue v2", triggers: "thread breaking, dhaga toot raha hai", videoUrl: "https://youtube.com/shorts/VrmmAy-G4H4", steps: "Step 1: Re-thread properly. Step 2: Keep 4\" extra length. Step 3: Use good quality thread. Step 4: Change bent needle. Step 5: Watch video." },
  { issue: "Machine Stuck", triggers: "machine stuck, jammed, handwheel stuck", videoUrl: "https://www.youtube.com/watch?v=iGTUqw1Plls" },
  { issue: "Stitch Improper", triggers: "improper stitch, loose stitch, tight stitch", videoUrl: "https://youtu.be/iGTUqw1Plls", steps: "Step 1: Check upper & bobbin filled. Step 2: Re-thread. Step 3: Remove spring from reel holder." },
  { issue: "Stitches Not Coming", triggers: "no stitch, stitch not forming, silai nahi ho rahi", videoUrl: "https://youtu.be/iGTUqw1Plls", steps: "Step 1: Re-thread. Step 2: Check bottom bobbin — https://youtu.be/4Wis7BnJiNQ" },
  { issue: "Needle Breaking", triggers: "needle breaking, sui toot rahi hai", videoUrl: "https://youtu.be/IQ47DKELxys" },
  { issue: "Tension Adjustment", triggers: "tension issue, loose tight stitch", videoUrl: "https://youtu.be/aKe8loGMFAk" },
  { issue: "Bobbin Refill", triggers: "bobbin issue, lower thread, bobbin refill", videoUrl: "https://youtu.be/_Mpgu_pbILw" },
  { issue: "Pico Stitch", triggers: "pico stitch, pico silai, edge stitch", videoUrl: "https://youtu.be/qOqC451XItk" },
  { issue: "Button Hole", triggers: "button hole, button silai", videoUrl: "https://youtu.be/LFXhn46MbG4" },
  { issue: "Interlock Stitch", triggers: "interlock stitch, lock stitch", videoUrl: "https://youtu.be/NgiqWPDeB2o" },
  { issue: "Hemming Stitch", triggers: "hemming stitch, hem silai, fold stitch", videoUrl: "https://youtu.be/bbeKkSeKN0g" },
  { issue: "Applique Stitch", triggers: "applique stitch, design silai", videoUrl: "https://youtu.be/3mRNlg9VHdE" },
  { issue: "Needle Screw Fitting", triggers: "needle screw loose, needle fix, screw tight", videoUrl: "https://youtube.com/shorts/Arkp1uwLUBo" },
  { issue: "Thread Stuck Between Gap", triggers: "thread stuck, dhaga fas gaya, gap jam", videoUrl: "https://youtu.be/qNiW_fSLpyk" },
  { issue: "Needle Removal Inside Machine", triggers: "remove needle, needle nikalna, stuck needle", videoUrl: "https://youtu.be/KvfRByP-l24" },
  { issue: "Bottom Bobbin Handling", triggers: "bobbin kaise lagaye, neeche dhaga, bobbin set", videoUrl: "https://youtu.be/KvfRByP-l24" },
  { issue: "Presser Foot Replacement", triggers: "presser foot change, foot replace", videoUrl: "https://youtu.be/gWbawkkzzK8" },
  { issue: "Needle Replacement", triggers: "needle replace, sui change, new needle", videoUrl: "https://youtu.be/dt2M_6_vCp0" },
  { issue: "Sound Issue v5", triggers: "Awaaz aarahi hai, sound issue", videoUrl: "https://youtube.com/shorts/IgFFqizyRqs" },
  { issue: "Stitches Skipped v3", triggers: "skipped stitch, gap stitch, stitch skip", videoUrl: "https://www.youtube.com/shorts/WtJnIhL8JSM" },
];

const otherProductVideos: TroubleshootingItem[] = [
  { issue: "Soup Maker", triggers: "soup maker", videoUrl: "https://www.youtube.com/watch?v=Mkv8fAnYTAQ" },
  { issue: "Car Vacuum Cleaner", triggers: "car vacuum", videoUrl: "https://www.youtube.com/watch?v=s3vVUu1Rpgs" },
  { issue: "Floor Vacuum Cleaner", triggers: "floor vacuum", videoUrl: "https://www.youtube.com/watch?v=BTHMcOdH0og" },
];

const warrantyData = [
  { product: "Akiara Mini", duration: "1 Year", transferable: "No" },
  { product: "Akiara Duo", duration: "2 Years", transferable: "No" },
  { product: "Akiara Yume", duration: "2 Years", transferable: "No" },
];

const repairData = [
  { detail: "Parts Cost", withinWarranty: "FREE", afterWarranty: "FREE" },
  { detail: "Labor Cost", withinWarranty: "FREE", afterWarranty: "₹500" },
  { detail: "Repair Time", withinWarranty: "3-7 working days", afterWarranty: "3-7 working days" },
  { detail: "If Unrepairable", withinWarranty: "Replacement", afterWarranty: "Case-by-case" },
  { detail: "Repair Warranty", withinWarranty: "N/A (under warranty)", afterWarranty: "90 days on repair" },
  { detail: "Home Visit Charge", withinWarranty: "FREE", afterWarranty: "₹500" },
];

const homeServiceCities = ["Mumbai", "Pune", "Thane", "Delhi", "Bangalore", "Hyderabad"];

const escalationTriggers = [
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

const usefulLinks = [
  { label: "Warranty Registration", url: "https://akiara.in/pages/warranty-registration" },
  { label: "Live Demo", url: "https://akiara.in/pages/demo-view" },
  { label: "Bulk Enquiry", url: "https://akiara.in/pages/enquiry-form" },
  { label: "Mini Accessories", url: "https://akiara.in/collections/mini-sewing-machine-accessories" },
  { label: "Yume Accessories", url: "https://akiara.in/products/akiara-sewing-machine-presser-feet-set-5-pieces-hemmer-1-8-inch-round-hemmer-overcast-satin-stitch-zigzag-foot" },
  { label: "Vacuum Accessories", url: "https://akiara.in/collections/floor-vacuum" },
  { label: "Product Complaint", url: "https://akiara.in/pages/product-complaint" },
  { label: "Cold Press Juicer Accessories", url: "https://akiara.in/collections/cold-press-juicer-accessories" },
  { label: "Support Page (All Videos)", url: "https://support.akiara.in/" },
  { label: "Live Demo Booking (Calendly)", url: "https://calendly.com/akiara" },
  { label: "FAQ Sheet", url: "https://docs.google.com/spreadsheets/d/1rEzAduvlfakYkwPAw6AFn36WfYThBiE7/edit?gid=492778659#gid=492778659" },
];

// ============================================================
// COMPONENTS
// ============================================================

function VideoTable({ items, title, icon }: { items: TroubleshootingItem[]; title: string; icon: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = items.filter((item) => {
    const q = searchTerm.toLowerCase();
    return item.issue.toLowerCase().includes(q) || item.triggers.toLowerCase().includes(q);
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">{items.length} issues</span>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>
      {open && (
        <div className="px-5 pb-5">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search issues or trigger phrases..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-300 focus:outline-none"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">#</th>
                  <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Issue</th>
                  <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Trigger Phrases</th>
                  <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Video / Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, index) => (
                  <tr key={index} className="border-t border-slate-100 hover:bg-orange-50/50">
                    <td className="px-3 py-2 text-slate-400">{index + 1}</td>
                    <td className="px-3 py-2 font-medium text-slate-700">{item.issue}</td>
                    <td className="px-3 py-2 text-slate-500 text-xs max-w-xs">{item.triggers}</td>
                    <td className="px-3 py-2">
                      {item.videoUrl ? (
                        <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100 transition">
                          <Play className="w-3 h-3" /> Watch
                        </a>
                      ) : (
                        <span className="text-xs text-amber-600 italic">{item.steps || "Ask for video"}</span>
                      )}
                      {item.steps && item.videoUrl && <p className="text-xs text-slate-400 mt-1 max-w-xs">{item.steps}</p>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AkiaraKnowledgePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"videos" | "policies" | "escalation" | "links">("videos");

  const tabs = [
    { id: "videos" as const, label: "Troubleshooting Videos", icon: Video },
    { id: "policies" as const, label: "Warranty & Policies", icon: Shield },
    { id: "escalation" as const, label: "Escalation Rules", icon: Ticket },
    { id: "links" as const, label: "Useful Links", icon: ExternalLink },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-100">
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-orange-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Devika Knowledge Base
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">Complete reference for Akiara chat agent — troubleshooting, policies, and escalation rules</p>
          </header>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-orange-50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* TROUBLESHOOTING VIDEOS TAB */}
          {activeTab === "videos" && (
            <div className="space-y-4">
              <VideoTable items={miniVideos} title="Akiara Mini Machine" icon={<Package className="w-5 h-5 text-orange-500" />} />
              <VideoTable items={yumeVideos} title="Akiara Yume Machine" icon={<Package className="w-5 h-5 text-blue-500" />} />
              <VideoTable items={duoVideos} title="Akiara Duo Machine" icon={<Package className="w-5 h-5 text-purple-500" />} />
              <VideoTable items={otherProductVideos} title="Other Products" icon={<Package className="w-5 h-5 text-green-500" />} />

              {/* Devika Operating Instructions */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-500" /> Devika Operating Instructions
                </h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="bg-orange-50 rounded-xl p-4">
                    <p className="font-semibold text-slate-800 mb-2">Step 1 — Video First</p>
                    <p>Match issue against troubleshooting video links and share the most relevant video. Ask customer to try steps in the video first.</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="font-semibold text-slate-800 mb-2">Step 2 — Customer Video</p>
                    <p>If customer has already tried all relevant videos and reconnects, request them to send a 30-second short video showing the issue.</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4">
                    <p className="font-semibold text-slate-800 mb-2">Step 3 — Escalate</p>
                    <p>If Steps 1 and 2 completed and issue still unresolved, transfer to human agent. Inform: &quot;You will receive a call back within 24 hours.&quot; Do NOT mention home service/repair/demo.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WARRANTY & POLICIES TAB */}
          {activeTab === "policies" && (
            <div className="space-y-4">
              {/* Warranty */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-500" /> Warranty Policy
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
                    {warrantyData.map((w) => (
                      <tr key={w.product} className="border-t border-slate-100">
                        <td className="px-3 py-2 font-medium text-slate-700">{w.product}</td>
                        <td className="px-3 py-2 text-slate-600">{w.duration}</td>
                        <td className="px-3 py-2 text-slate-600">{w.transferable}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="font-semibold text-green-800 text-sm mb-2">Covers</p>
                    <ul className="text-xs text-green-700 space-y-1">
                      <li>• Manufacturing defects</li>
                      <li>• Hardware failures under normal use</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3">
                    <p className="font-semibold text-red-800 text-sm mb-2">Does NOT Cover</p>
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

              {/* Repair Policy */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-orange-500" /> Repair Policy
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
                    {repairData.map((r) => (
                      <tr key={r.detail} className="border-t border-slate-100">
                        <td className="px-3 py-2 font-medium text-slate-700">{r.detail}</td>
                        <td className="px-3 py-2 text-green-600">{r.withinWarranty}</td>
                        <td className="px-3 py-2 text-slate-600">{r.afterWarranty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Return Policy */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-500" /> Return Policy
                </h3>
                <p className="text-sm text-slate-600 mb-3">Always ask: &quot;Which platform did you purchase from — Amazon, Flipkart, or Akiara.in?&quot;</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Platform</th>
                      <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Contact</th>
                      <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Time Window</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-100"><td className="px-3 py-2 font-medium">Amazon</td><td className="px-3 py-2">Contact Amazon directly</td><td className="px-3 py-2">7-10 days</td></tr>
                    <tr className="border-t border-slate-100"><td className="px-3 py-2 font-medium">Flipkart</td><td className="px-3 py-2">Contact Flipkart directly</td><td className="px-3 py-2">7-10 days</td></tr>
                    <tr className="border-t border-slate-100"><td className="px-3 py-2 font-medium">Akiara.in</td><td className="px-3 py-2">Contact Akiara Customer Service</td><td className="px-3 py-2">Case assessed</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Home Service Policy */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Home className="w-5 h-5 text-orange-500" /> Home Service Policy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="font-semibold text-slate-800 text-sm mb-2">Cities Covered</p>
                    <div className="flex flex-wrap gap-2">
                      {homeServiceCities.map((c) => (
                        <span key={c} className="px-2 py-1 bg-white rounded-full text-xs font-semibold text-slate-600 border border-slate-200">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="font-semibold text-slate-800 text-sm mb-2">Service Charges</p>
                    <p className="text-xs text-slate-600">Within Warranty: <span className="font-bold text-green-600">FREE</span></p>
                    <p className="text-xs text-slate-600 mt-1">Outside Warranty: <span className="font-bold text-orange-600">₹500/visit</span></p>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs text-amber-800"><strong>Important:</strong> Products eligible: Duo and Yume (standard). Mini on case-by-case basis. Always troubleshoot first. Do NOT commit to home visit prior — only create ticket to L2.</p>
                </div>
              </div>

              {/* Home Demo Policy */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-orange-500" /> Home Demo Policy
                </h3>
                <div className="text-sm text-slate-600 space-y-2">
                  <p>• Products eligible: <strong>Duo and Yume only</strong> (NOT Mini)</p>
                  <p>• One demo per customer</p>
                  <p>• Available cities: {homeServiceCities.join(", ")}</p>
                  <p>• Do NOT arrange home visit yourself — gather info and create ticket to L2</p>
                </div>
              </div>

              {/* Live Demo Policy */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-orange-500" /> Live Demo Policy
                </h3>
                <div className="text-sm text-slate-600 space-y-2">
                  <p>• All machines eligible (Mini, Yume, Duo)</p>
                  <p>• Unlimited bookings</p>
                  <p>• Platform: Google Meet</p>
                  <p>• Days: Monday – Sunday, 10 AM – 6 PM</p>
                  <p>• Booking: <a href="https://calendly.com/akiara" target="_blank" rel="noopener noreferrer" className="text-orange-600 underline hover:text-orange-700">calendly.com/akiara</a></p>
                </div>
              </div>
            </div>
          )}

          {/* ESCALATION TAB */}
          {activeTab === "escalation" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-red-500" /> When to Create Ticket &amp; Escalate
                </h3>
                <div className="space-y-2">
                  {escalationTriggers.map((trigger, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${trigger.includes('HIGH PRIORITY') ? 'bg-red-50 border border-red-200' : 'bg-slate-50'}`}>
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <p className={`text-sm ${trigger.includes('HIGH PRIORITY') ? 'text-red-700 font-semibold' : 'text-slate-700'}`}>{trigger}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Escalation Handling Steps</h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex items-center justify-center">1</span>
                    <p>Acknowledge the customer&apos;s concern empathetically.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex items-center justify-center">2</span>
                    <p>Inform that a ticket has been created and a human agent will contact them shortly.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex items-center justify-center">3</span>
                    <p>Do NOT make any promises regarding timelines or outcomes.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex items-center justify-center">4</span>
                    <p>Create ticket immediately with all available details.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full text-xs font-bold flex items-center justify-center">5</span>
                    <p className="font-semibold">For safety issues (shock, fire, smoke) — treat as HIGH PRIORITY and flag urgently.</p>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-4">
                  <p className="text-xs text-amber-800"><strong>Rule:</strong> When in doubt about whether to escalate, ALWAYS escalate. Never handle complaints, returns, replacements, legal threats, or safety issues alone.</p>
                </div>
              </div>

              {/* Information Collection */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Information Collection Flow</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Step</th>
                      <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Action</th>
                      <th className="text-left px-3 py-2 text-slate-500 font-semibold text-xs">Mandatory</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-100"><td className="px-3 py-2">1</td><td className="px-3 py-2">Ask which product (Mini, Yume, Duo)</td><td className="px-3 py-2 text-green-600 font-semibold">Yes</td></tr>
                    <tr className="border-t border-slate-100"><td className="px-3 py-2">2</td><td className="px-3 py-2">Ask for Order ID</td><td className="px-3 py-2 text-amber-600">Preferred, not blocking</td></tr>
                    <tr className="border-t border-slate-100"><td className="px-3 py-2">3</td><td className="px-3 py-2">Proceed with solution</td><td className="px-3 py-2 text-green-600 font-semibold">Yes</td></tr>
                  </tbody>
                </table>
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs text-amber-800"><strong>Address / Phone:</strong> Only collect for Home Demo or Home Service bookings. Do NOT collect for general queries, return queries, troubleshooting, or live demos.</p>
                </div>
              </div>
            </div>
          )}

          {/* USEFUL LINKS TAB */}
          {activeTab === "links" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-orange-500" /> Quick Links &amp; Resources
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {usefulLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition group"
                  >
                    <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-orange-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-orange-700">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
