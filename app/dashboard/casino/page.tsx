"use client";

import Sidebar from "@/components/Sidebar";
import { AlertTriangle, CalendarCheck, CheckCircle2, Crown, Filter, Languages, Menu, MessageCircle, Search, ShieldCheck, Sparkles, Users, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

export type CasinoSection = "Reservations" | "VIP Guests" | "Membership" | "Messages" | "Grievances";
const initialReservations = [
  { id:"BC-7412", guest:"Arjun Mehta", initials:"AM", type:"Baccarat · VIP Room", time:"7:30 PM", party:4, status:"Confirmed", vip:true },
  { id:"RS-3098", guest:"Kavitha Raj", initials:"KR", type:"The Kingsbury Grill", time:"8:00 PM", party:2, status:"Confirmed", vip:false },
  { id:"BC-8821", guest:"Chen Wei", initials:"CW", type:"Blackjack · Main Floor", time:"8:45 PM", party:3, status:"Waitlisted", vip:false },
  { id:"EV-4024", guest:"Daniel Wong", initials:"DW", type:"Saturday Showcase", time:"9:00 PM", party:6, status:"Pending", vip:true },
];
const vipGuests = [
  ["Arjun Mehta","AM","Diamond","Baccarat · Private Salon","Nadeesha","Tonight, 7:30 PM"],
  ["Daniel Wong","DW","Platinum","Blackjack · Airport transfer","Kasun","Tonight, 9:00 PM"],
  ["Sofia Laurent","SL","Gold","Roulette · French cuisine","Amaya","22 Jul, 8:00 PM"],
];
const messages = [
  ["Nimal Perera","WhatsApp","Can you confirm my table for tonight?","English","2m","2"],
  ["Kavitha Raj","Web chat","உணவக முன்பதிவை மாற்ற வேண்டும்.","Tamil","31m","1"],
];
const grievances = [
  ["GR-1084","Daniel Wong","Airport transfer delay","High","Guest Relations","18 min","In progress"],
  ["GR-1083","Ravi Fernando","Membership points discrepancy","Medium","Loyalty Desk","1 hr","Assigned"],
  ["GR-1081","Meena Kumar","Restaurant service feedback","Low","F&B Manager","3 hr","Awaiting guest"],
];
const members = [
  { id:"BL-294810", name:"Arjun Mehta", initials:"AM", phone:"+94 77 284 0193", tier:"Diamond", points:"184,250", status:"Active", lastVisit:"12 Jul 2026", preference:"Baccarat", host:"Nadeesha" },
  { id:"BL-183492", name:"Daniel Wong", initials:"DW", phone:"+65 9123 8804", tier:"Platinum", points:"96,840", status:"Active", lastVisit:"09 Jul 2026", preference:"Blackjack", host:"Kasun" },
  { id:"BL-746205", name:"Sofia Laurent", initials:"SL", phone:"+33 6 44 18 9021", tier:"Gold", points:"42,600", status:"Active", lastVisit:"28 Jun 2026", preference:"Roulette", host:"Amaya" },
  { id:"BL-518034", name:"Nimal Perera", initials:"NP", phone:"+94 71 992 8471", tier:"Silver", points:"18,920", status:"Active", lastVisit:"15 Jul 2026", preference:"Poker", host:"Guest Services" },
];

export function CasinoOperationsView({ initialSection = "Reservations" }: { initialSection?: CasinoSection }) {
  const [sidebarOpen,setSidebarOpen] = useState(false), [section] = useState<CasinoSection>(initialSection), [query,setQuery] = useState(""), [modal,setModal] = useState(false);
  const [reservationData,setReservationData] = useState(initialReservations);
  const [notice,setNotice] = useState("");
  const [selectedVip,setSelectedVip] = useState<string[] | null>(null);
  const [selectedMessage,setSelectedMessage] = useState<string[] | null>(null);
  const [chatReply,setChatReply] = useState("");
  const [grievanceModal,setGrievanceModal] = useState(false);
  const [grievanceData,setGrievanceData] = useState(grievances);
  const rows = useMemo(() => reservationData.filter(r => `${r.guest} ${r.id} ${r.type}`.toLowerCase().includes(query.toLowerCase())),[query,reservationData]);
  const displayedVipGuests = useMemo(() => [
    ...vipGuests,
    ...reservationData
      .filter(reservation => reservation.vip && !vipGuests.some(guest => guest[0] === reservation.guest))
      .map(reservation => [reservation.guest,reservation.initials,"VIP",reservation.type,"Guest Relations",`Today, ${reservation.time}`]),
  ],[reservationData]);

  useEffect(() => {
    const stored = localStorage.getItem("casino-demo-reservations");
    if (stored) try { setReservationData(JSON.parse(stored)); } catch {}
    const storedGrievances = localStorage.getItem("casino-demo-grievances");
    if (storedGrievances) try { setGrievanceData(JSON.parse(storedGrievances)); } catch {}
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const createReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const guest = String(data.get("guest") || "Guest");
    const next = [{
      id: `BC-${Math.floor(1000 + Math.random() * 9000)}`,
      guest,
      initials: guest.split(" ").map(part => part[0]).join("").slice(0,2).toUpperCase(),
      type: String(data.get("type") || "Gaming table"),
      time: String(data.get("time") || "8:00 PM"),
      party: Number(data.get("party")) || 1,
      status: "Confirmed",
      vip: data.get("vip") === "on",
    }, ...reservationData];
    setReservationData(next);
    localStorage.setItem("casino-demo-reservations", JSON.stringify(next));
    setModal(false);
    setNotice(`Reservation created for ${guest}`);
  };
  const createGrievance = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const guest = String(data.get("guest") || "Guest");
    const ticket = `GR-${Math.floor(1000 + Math.random() * 9000)}`;
    const next = [[ticket,guest,String(data.get("issue")),String(data.get("priority")),String(data.get("owner")),"Just now","Assigned"],...grievanceData];
    setGrievanceData(next);
    localStorage.setItem("casino-demo-grievances",JSON.stringify(next));
    setGrievanceModal(false);
    setNotice(`Grievance ticket ${ticket} created`);
  };
  return <div className="min-h-screen bg-[#f7f7f5] text-slate-900 lg:ml-64">
    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
    <header className="sticky top-0 z-20 flex h-20 items-center gap-4 border-b border-slate-200 bg-white/90 px-5 backdrop-blur md:px-8"><button className="rounded-xl border p-2 lg:hidden" onClick={()=>setSidebarOpen(true)}><Menu className="h-5 w-5"/></button><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-amber-700">Bally&apos;s Casino Colombo</p><h1 className="font-serif text-2xl font-semibold">Guest Operations</h1></div><span className="ml-auto hidden rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 sm:block">● AI concierge online</span></header>
    <main className="p-5 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
        [CalendarCheck,String(68 + Math.max(0,reservationData.length-initialReservations.length)),"Tonight’s reservations","23 gaming · 45 dining","bg-amber-50 text-amber-700"],[Crown,String(24 + Math.max(0,displayedVipGuests.length-vipGuests.length)),"VIP arrivals","Priority guest arrivals","bg-violet-50 text-violet-700"],[MessageCircle,"3","Unread messages","WhatsApp · Web chat","bg-blue-50 text-blue-700"],[ShieldCheck,String(2 + Math.max(0,grievanceData.length-grievances.length)),"Open grievances","1 high-priority case","bg-rose-50 text-rose-700"]
      ].map(([I,v,l,n,c])=>{const Icon=I as typeof Crown;return <div key={l as string} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className={`grid h-10 w-10 place-items-center rounded-xl ${c}`}><Icon className="h-5 w-5"/></span><p className="mt-4 text-3xl font-semibold">{v as string}</p><p className="mt-1 text-sm font-semibold">{l as string}</p><p className="mt-1 text-xs text-slate-500">{n as string}</p></div>})}</div>
      {section==="Reservations"&&<Panel title="Reservations & waitlist" subtitle="Gaming, dining, rooms and event bookings" action={<><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search booking" className="rounded-xl border py-2 pl-9 pr-3 text-xs"/></div><button className="rounded-xl border px-3 text-xs"><Filter className="inline h-4 w-4"/> Filter</button><button onClick={()=>setModal(true)} className="rounded-xl bg-[#153d31] px-4 py-2 text-xs font-semibold text-white">+ New reservation</button></>}><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead className="bg-slate-50 text-[10px] uppercase text-slate-500"><tr>{["Guest","Booking","Time","Party","Status"].map(x=><th key={x} className="px-5 py-3">{x}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.id} className="border-t text-sm"><td className="px-5 py-4"><div className="flex items-center gap-3"><b className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xs">{r.initials}</b><div><p className="flex items-center gap-1 font-semibold">{r.guest}{r.vip&&<Crown className="h-3 w-3 fill-amber-500 text-amber-500"/>}</p><small className="text-slate-400">{r.id}</small></div></div></td><td className="px-5 text-xs text-slate-600">{r.type}</td><td className="px-5 text-xs font-semibold">{r.time}</td><td className="px-5 text-xs">{r.party} guests</td><td className="px-5"><Badge text={r.status}/></td></tr>)}</tbody></table></div></Panel>}

      {section==="VIP Guests"&&<div className="mt-6 grid gap-4 lg:grid-cols-3">{displayedVipGuests.map(v=><div key={v[0]} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex"><b className="grid h-12 w-12 place-items-center rounded-full bg-[#153d31] text-white">{v[1]}</b><span className="ml-auto h-fit rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-700">{v[2]}</span></div><h3 className="mt-4 font-serif text-lg font-semibold">{v[0]}</h3><p className="text-xs text-slate-500">Host: {v[4]}</p><div className="mt-4 rounded-xl bg-slate-50 p-3"><small className="font-bold uppercase text-slate-400">Preferences</small><p className="mt-1 text-xs">{v[3]}</p></div><p className="mt-4 text-xs text-amber-700">Next arrival · {v[5]}</p><button onClick={()=>setSelectedVip(v)} className="mt-5 w-full rounded-xl border py-2 text-xs font-semibold transition hover:border-amber-500 hover:bg-amber-50">Open guest profile</button></div>)}</div>}

      {section==="Membership"&&<MembershipDemo onNotice={setNotice}/>}

      {section==="Messages"&&<Panel title="Omnichannel inbox" subtitle="WhatsApp and web-chat conversations">{messages.map(m=><button onClick={()=>setSelectedMessage(m)} key={m[0]} className="flex w-full items-center gap-4 border-t p-5 text-left hover:bg-slate-50"><span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-700"><MessageCircle className="h-5 w-5"/></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{m[0]} <small className="ml-2 rounded bg-slate-100 px-2 py-1 text-slate-500">{m[1]}</small></p><p className="mt-1 truncate text-xs text-slate-500">{m[2]}</p></div><span className="text-[10px] text-slate-400"><Languages className="inline h-3 w-3"/> {m[3]} · {m[4]}</span>{m[5]&&<b className="grid h-5 w-5 place-items-center rounded-full bg-amber-600 text-[9px] text-white">{m[5]}</b>}</button>)}</Panel>}

      {section==="Grievances"&&<Panel title="Grievances & escalations" subtitle="Audit-ready guest issues and ownership" action={<button onClick={()=>setGrievanceModal(true)} className="rounded-xl bg-[#153d31] px-4 py-2 text-xs font-semibold text-white">+ Capture grievance</button>}>{grievanceData.map(g=><div key={g[0]} className="grid gap-3 border-t p-5 md:grid-cols-[1fr_.7fr_.4fr_auto] md:items-center"><div><p className="text-sm font-semibold">{g[2]} {g[3]==="High"&&<AlertTriangle className="inline h-4 w-4 text-rose-500"/>}</p><small className="text-slate-500">{g[0]} · {g[1]}</small></div><p className="text-xs"><small className="block uppercase text-slate-400">Owner</small>{g[4]}</p><p className="text-xs"><small className="block uppercase text-slate-400">Open</small>{g[5]}</p><Badge text={g[6]}/></div>)}</Panel>}
    </main>
    {notice&&<div className="fixed bottom-5 right-5 z-[70] rounded-xl bg-[#153d31] px-5 py-3 text-sm font-semibold text-white shadow-xl">{notice.replace(/^demo\s+/i,"")}</div>}
    {selectedVip&&<div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/50 p-4" onMouseDown={e=>{if(e.target===e.currentTarget)setSelectedVip(null)}}><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start"><div className="grid h-14 w-14 place-items-center rounded-full bg-[#153d31] text-lg font-bold text-white">{selectedVip[1]}</div><button aria-label="Close profile" onClick={()=>setSelectedVip(null)} className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5"/></button></div><div className="mt-4 flex items-center gap-3"><h2 className="font-serif text-2xl font-semibold">{selectedVip[0]}</h2><span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-700">{selectedVip[2]}</span></div><p className="mt-1 text-xs text-slate-500">VIP host · {selectedVip[4]}</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><ProfileDetail label="Preferences" value={selectedVip[3]}/><ProfileDetail label="Next arrival" value={selectedVip[5]}/><ProfileDetail label="Membership status" value="Active"/><ProfileDetail label="Guest visits" value="28 lifetime visits"/></div></div></div>}
    {selectedMessage&&<div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/50 p-4" onMouseDown={event=>{if(event.target===event.currentTarget)setSelectedMessage(null)}}><div className="flex h-[620px] max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-[#f6f3ed] shadow-2xl"><div className="flex items-center gap-3 bg-[#153d31] p-4 text-white"><span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 font-bold">{selectedMessage[0].split(" ").map(part=>part[0]).join("")}</span><div><p className="text-sm font-semibold">{selectedMessage[0]}</p><p className="text-[10px] text-white/60">{selectedMessage[1]} · {selectedMessage[3]} · online</p></div><button onClick={()=>setSelectedMessage(null)} className="ml-auto rounded-lg p-2 hover:bg-white/10"><X className="h-5 w-5"/></button></div><div className="flex-1 space-y-4 overflow-y-auto p-5"><p className="text-center text-[10px] text-slate-400">Today</p><ChatBubble text={selectedMessage[3]==="Tamil"?"வணக்கம், இன்று இரவு எனது உணவக முன்பதிவை மாற்ற முடியுமா?":"Hello, I have a reservation for tonight."} time="7:42 PM"/><ChatBubble agent text={selectedMessage[3]==="Tamil"?"நிச்சயமாக. உங்கள் முன்பதிவு பெயர் அல்லது குறிப்பு எண்ணைப் பகிர முடியுமா?":"Of course. Could you share the reservation name or booking reference?"} time="7:42 PM"/><ChatBubble text={selectedMessage[2]} time="7:43 PM"/><ChatBubble agent text={selectedMessage[3]==="Tamil"?"உங்கள் முன்பதிவைக் கண்டுபிடித்தேன். அதை இரவு 9:00 மணிக்கு மாற்றியுள்ளேன்.":"I found your booking and confirmed the requested update. Is there anything else I can arrange?"} time="7:43 PM"/></div><form onSubmit={event=>{event.preventDefault();if(!chatReply.trim())return;setNotice("Demo reply sent");setChatReply("");}} className="flex gap-2 border-t bg-white p-4"><input value={chatReply} onChange={event=>setChatReply(event.target.value)} placeholder="Type a reply..." className="min-w-0 flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-amber-500"/><button className="rounded-xl bg-[#153d31] px-5 text-xs font-semibold text-white">Send</button></form></div></div>}
    {grievanceModal&&<div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/50 p-4"><form onSubmit={createGrievance} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start"><div><h2 className="font-serif text-xl font-semibold">Capture grievance</h2><p className="mt-1 text-xs text-slate-500">Create a trackable guest complaint ticket.</p></div><button type="button" onClick={()=>setGrievanceModal(false)} className="ml-auto rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5"/></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><Field name="guest" label="Guest name" required/><Field name="phone" label="Phone or member ID" required/><label className="text-xs font-semibold">Priority<select name="priority" className="mt-2 w-full rounded-xl border px-3 py-2.5 font-normal"><option>Medium</option><option>High</option><option>Low</option></select></label><label className="text-xs font-semibold">Assign to<select name="owner" className="mt-2 w-full rounded-xl border px-3 py-2.5 font-normal"><option>Guest Relations</option><option>Loyalty Desk</option><option>Security</option><option>F&amp;B Manager</option></select></label></div><label className="mt-4 block text-xs font-semibold">Issue description<textarea name="issue" required className="mt-2 h-24 w-full rounded-xl border p-3 font-normal outline-none focus:border-amber-500" placeholder="Describe what happened, including time and location"/></label><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={()=>setGrievanceModal(false)} className="rounded-xl border px-4 py-2.5 text-xs font-semibold">Cancel</button><button type="submit" className="rounded-xl bg-[#153d31] px-4 py-2.5 text-xs font-semibold text-white">Create ticket</button></div></form></div>}
    {modal&&<div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/50 p-4"><form onSubmit={createReservation} className="w-full max-w-lg rounded-2xl bg-white p-6"><div className="flex"><div><h2 className="font-serif text-xl font-semibold">New reservation</h2><p className="text-xs text-slate-500">Create a gaming, dining or event booking.</p></div><button type="button" className="ml-auto" onClick={()=>setModal(false)}><X/></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><Field name="guest" label="Guest name" required/><Field name="phone" label="Phone number" required/><Field name="type" label="Booking type" required/><Field name="party" label="Number of guests" type="number" required/><Field name="date" label="Date" type="date" required/><Field name="time" label="Time" type="time" required/></div><label className="mt-4 flex items-center gap-2 text-xs font-semibold"><input name="vip" type="checkbox"/>VIP guest</label><textarea name="notes" placeholder="Guest preferences or VIP instructions" className="mt-4 h-20 w-full rounded-xl border p-3 text-sm"/><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={()=>setModal(false)} className="rounded-xl border px-4 py-2 text-xs">Cancel</button><button type="submit" className="rounded-xl bg-[#153d31] px-4 py-2 text-xs text-white">Create reservation</button></div></form></div>}
  </div>;
}

export default function CasinoOperations() { return <CasinoOperationsView />; }

function Badge({text}:{text:string}) { const c=["Confirmed","Assigned"].includes(text)?"bg-emerald-50 text-emerald-700":["Waitlisted","Pending","In progress"].includes(text)?"bg-amber-50 text-amber-700":"bg-slate-100 text-slate-600";return <span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold ${c}`}>{text}</span> }
function Panel({title,subtitle,action,children}:{title:string,subtitle:string,action?:React.ReactNode,children:React.ReactNode}) { return <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b p-5 md:flex-row md:items-center"><div><h2 className="font-serif text-lg font-semibold">{title}</h2><p className="text-xs text-slate-500">{subtitle}</p></div>{action&&<div className="flex gap-2 md:ml-auto">{action}</div>}</div>{children}</section> }
function Field({name,label,type="text",required=false}:{name:string,label:string,type?:string,required?:boolean}) { return <label className="text-xs font-semibold">{label}<input name={name} type={type} required={required} className="mt-2 w-full rounded-xl border px-3 py-2.5 font-normal outline-none focus:border-amber-500"/></label> }
function ProfileDetail({label,value}:{label:string,value:string}) { return <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-xs font-medium text-slate-700">{value}</p></div> }
function ChatBubble({text,time,agent=false}:{text:string,time:string,agent?:boolean}) { return <div className={`flex ${agent?"justify-end":"justify-start"}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs leading-5 shadow-sm ${agent?"rounded-br-md bg-[#dcefe7] text-slate-800":"rounded-bl-md bg-white text-slate-700"}`}><p>{text}</p><p className="mt-1 text-right text-[9px] text-slate-400">{time}{agent&&" · ✓✓"}</p></div></div> }
function MembershipDemo({onNotice}:{onNotice:(message:string)=>void}) {
  const [search,setSearch] = useState("");
  const [selectedMember,setSelectedMember] = useState<(typeof members)[number] | null>(null);
  const results = members.filter(member => `${member.id} ${member.name} ${member.phone} ${member.tier}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_320px]">
    <Panel title="Casino membership directory" subtitle="Search by member name, ID, phone number or tier" action={<div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/><input value={search} onChange={event=>setSearch(event.target.value)} placeholder="Search members" className="rounded-xl border py-2 pl-9 pr-3 text-xs outline-none focus:border-amber-500"/></div>}>
      <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500"><tr>{["Member","Tier","Points","Last visit","Preference","Status"].map(label=><th key={label} className="px-5 py-3">{label}</th>)}</tr></thead><tbody>{results.map(member=><tr onClick={()=>setSelectedMember(member)} key={member.id} className="cursor-pointer border-t border-slate-100 text-xs hover:bg-amber-50/30"><td className="px-5 py-4"><div className="flex items-center gap-3 text-left"><b className="grid h-9 w-9 place-items-center rounded-full bg-[#153d31] text-white">{member.initials}</b><span><strong className="block text-sm text-slate-900">{member.name}</strong><small className="text-slate-500">{member.id} · {member.phone}</small></span></div></td><td className="px-5"><span className="rounded-full bg-amber-50 px-2.5 py-1 font-bold text-amber-700">{member.tier}</span></td><td className="px-5 font-semibold">{member.points}</td><td className="px-5 text-slate-500">{member.lastVisit}</td><td className="px-5">{member.preference}</td><td className="px-5"><span className="text-emerald-700">● {member.status}</span></td></tr>)}</tbody></table>{results.length===0&&<div className="py-12 text-center text-sm text-slate-500">No members match “{search}”.</div>}</div>
    </Panel>
    <div className="mt-6 rounded-2xl bg-[#153d31] p-6 text-white shadow-sm"><Sparkles className="text-amber-300"/><h3 className="mt-4 font-serif text-xl">Membership summary</h3><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white/10 p-3"><p className="text-2xl font-semibold">1,284</p><p className="text-[10px] text-white/55">Total members</p></div><div className="rounded-xl bg-white/10 p-3"><p className="text-2xl font-semibold">94</p><p className="text-[10px] text-white/55">VIP members</p></div></div><div className="mt-6 space-y-3">{["Identity verification required","Sensitive balances remain masked","Every lookup is audit logged"].map(item=><p key={item} className="flex gap-2 text-xs text-white/75"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300"/>{item}</p>)}</div></div>
    {selectedMember&&<div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/50 p-4" onMouseDown={event=>{if(event.target===event.currentTarget)setSelectedMember(null)}}><div className="w-full max-w-md rounded-2xl bg-white p-6 text-slate-900 shadow-2xl"><div className="flex items-start"><b className="grid h-14 w-14 place-items-center rounded-full bg-[#153d31] text-lg text-white">{selectedMember.initials}</b><button onClick={()=>setSelectedMember(null)} aria-label="Close member profile" className="ml-auto rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5"/></button></div><div className="mt-4 flex items-center gap-3"><h2 className="font-serif text-2xl font-semibold">{selectedMember.name}</h2><span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-700">{selectedMember.tier}</span></div><p className="mt-1 text-xs text-slate-500">{selectedMember.id} · {selectedMember.phone}</p><div className="mt-6 grid grid-cols-2 gap-3"><ProfileDetail label="Loyalty points" value={selectedMember.points}/><ProfileDetail label="Account status" value={selectedMember.status}/><ProfileDetail label="Last visit" value={selectedMember.lastVisit}/><ProfileDetail label="Preferred game" value={selectedMember.preference}/><ProfileDetail label="Assigned host" value={selectedMember.host}/><ProfileDetail label="Member since" value="March 2023"/></div></div></div>}
  </div>;
}
