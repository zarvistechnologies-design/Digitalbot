"use client";

import Sidebar from "@/components/Sidebar";
import { hospitalityAPI } from "@/lib/api";
import {
  BedDouble,
  CheckCircle2,
  Clock3,
  Hotel,
  Loader2,
  Menu,
  Plus,
  Search,
  Settings,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

export type HospitalitySection =
  | "overview"
  | "calendar"
  | "rooms"
  | "restaurant"
  | "bookings"
  | "guests"
  | "settings";
type BookingType = "hotel_room" | "restaurant_table";
type ModalId = "roomType" | "room" | "table" | BookingType | null;

interface Property {
  _id: string;
  propertyName: string;
  address: string;
  phone: string;
  timezone: string;
  currency: string;
  taxPercent: number;
  checkInTime: string;
  checkOutTime: string;
  restaurantName: string;
  tableSlotMinutes: number;
  restaurantHours: Array<{
    day: number;
    enabled: boolean;
    open: string;
    close: string;
  }>;
  hotelPolicies: string;
  restaurantPolicies: string;
  voicePhoneKey?: string;
}
interface RoomType {
  _id: string;
  name: string;
  code: string;
  description: string;
  baseRate: number;
  maxAdults: number;
  maxChildren: number;
  amenities: string[];
  active: boolean;
  roomCount: number;
}
interface Room {
  _id: string;
  number: string;
  floor: string;
  status: "active" | "cleaning" | "maintenance" | "out_of_service";
  notes: string;
  roomTypeId: RoomType | string;
}
interface DiningTable {
  _id: string;
  name: string;
  area: string;
  capacity: number;
  shape: "round" | "square" | "rectangle" | "counter";
  status: "active" | "occupied" | "cleaning" | "out_of_service";
  notes: string;
}
interface Booking {
  _id: string;
  bookingType: BookingType;
  confirmationCode: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  source: string;
  status: string;
  specialRequests: string;
  roomTypeId?: Partial<RoomType> | string;
  roomId?: Partial<Room> | string;
  tableId?: Partial<DiningTable> | string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  nights?: number;
  totalAmount: number;
  currency: string;
  reservationDate?: string;
  startAt?: string;
  partySize?: number;
  createdAt: string;
}
interface Summary {
  roomCount: number;
  availableRooms: number;
  occupiedRooms: number;
  occupancyPercent: number;
  tableCount: number;
  arrivals: number;
  departures: number;
  tableBookings: number;
  bookedRevenue: number;
}

const emptySummary: Summary = {
  roomCount: 0,
  availableRooms: 0,
  occupiedRooms: 0,
  occupancyPercent: 0,
  tableCount: 0,
  arrivals: 0,
  departures: 0,
  tableBookings: 0,
  bookedRevenue: 0,
};
const today = () => new Date().toISOString().slice(0, 10);
const tomorrow = () =>
  new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
const fieldClass =
  "h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-zinc-100";
const labelClass = "grid gap-1.5 text-xs font-semibold text-zinc-600";
const cardClass = "rounded-lg border border-zinc-200 bg-white shadow-sm";

export const hospitalitySections: HospitalitySection[] = [
  "overview",
  "calendar",
  "rooms",
  "restaurant",
  "bookings",
  "guests",
  "settings",
];

const sectionCopy: Record<
  HospitalitySection,
  { eyebrow: string; title: string; description: string; icon: ReactNode }
> = {
  overview: {
    eyebrow: "Hotel & restaurant CRM",
    title: "Hospitality overview",
    description:
      "Live rooms, tables, guests, and reservations for staff and your voice agent.",
    icon: <Hotel className="h-5 w-5" />,
  },
  calendar: {
    eyebrow: "Hotel & restaurant CRM",
    title: "Operations calendar",
    description: "Room nights and dining reservations for one selected date.",
    icon: <Clock3 className="h-5 w-5" />,
  },
  rooms: {
    eyebrow: "Hotel inventory",
    title: "Rooms and rates",
    description: "Manage room types, rates, capacity, and every physical room.",
    icon: <BedDouble className="h-5 w-5" />,
  },
  restaurant: {
    eyebrow: "Restaurant inventory",
    title: "Restaurant tables",
    description:
      "Manage tables, dining areas, seating capacity, and live status.",
    icon: <UtensilsCrossed className="h-5 w-5" />,
  },
  bookings: {
    eyebrow: "Reservations",
    title: "Bookings",
    description:
      "Hotel stays and table reservations created by staff or the voice agent.",
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  guests: {
    eyebrow: "Guest CRM",
    title: "Guests",
    description: "Guest profiles built automatically from booking history.",
    icon: <Users className="h-5 w-5" />,
  },
  settings: {
    eyebrow: "Workspace setup",
    title: "Settings",
    description: "Operational facts, policies, timings, and voice-agent tools.",
    icon: <Settings className="h-5 w-5" />,
  },
};

function sectionPath(section: HospitalitySection) {
  return section === "overview"
    ? "/dashboard/hospitality"
    : `/dashboard/hospitality/${section}`;
}

function safeSection(section?: string): HospitalitySection {
  return hospitalitySections.includes(section as HospitalitySection)
    ? (section as HospitalitySection)
    : "overview";
}

function pretty(value = "") {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
function money(value: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
}
function relationName(value: unknown, fallback = "—") {
  return value && typeof value === "object" && "name" in value
    ? String(value.name)
    : fallback;
}
function relationId(value: unknown) {
  return value && typeof value === "object" && "_id" in value
    ? String(value._id)
    : String(value || "");
}

function Status({ value }: { value: string }) {
  const color = ["active", "confirmed"].includes(value)
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : ["checked_in", "seated", "occupied"].includes(value)
      ? "border-sky-200 bg-sky-50 text-sky-700"
      : ["cancelled", "out_of_service"].includes(value)
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-amber-200 bg-amber-50 text-amber-700";
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${color}`}
    >
      {pretty(value)}
    </span>
  );
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="grid min-h-48 place-items-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
      <div>
        <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-orange-100 text-orange-700">
          ◇
        </div>
        <h3 className="mt-3 text-sm font-bold">{title}</h3>
        <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-500">{body}</p>
      </div>
    </div>
  );
}

function Modal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-zinc-950/50 p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-zinc-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-md border border-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

function BookingRow({
  booking,
  onStatus,
  compact = false,
}: {
  booking: Booking;
  onStatus?: (status: string) => void;
  compact?: boolean;
}) {
  const hotel = booking.bookingType === "hotel_room";
  const room =
    booking.roomId && typeof booking.roomId === "object"
      ? booking.roomId.number
      : "Unassigned";
  const date = hotel
    ? `${booking.checkIn} → ${booking.checkOut}`
    : `${booking.reservationDate} · ${booking.startAt?.slice(11, 16) || ""}`;
  const allowed = hotel
    ? [
        "pending",
        "confirmed",
        "checked_in",
        "checked_out",
        "cancelled",
        "no_show",
      ]
    : ["pending", "confirmed", "seated", "completed", "cancelled", "no_show"];
  return (
    <div className="flex flex-wrap items-center gap-3 px-5 py-4">
      <div
        className={`grid h-10 w-10 place-items-center rounded-md ${hotel ? "bg-sky-50 text-sky-700" : "bg-orange-50 text-orange-700"}`}
      >
        {hotel ? (
          <Hotel className="h-5 w-5" />
        ) : (
          <UtensilsCrossed className="h-5 w-5" />
        )}
      </div>
      <div className="min-w-52 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <strong className="text-sm">{booking.guestName}</strong>
          <span className="text-[10px] font-bold text-zinc-400">
            {booking.confirmationCode}
          </span>
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          {hotel
            ? `${relationName(booking.roomTypeId)} · Room ${room}`
            : `${relationName(booking.tableId)} · ${booking.partySize} guests`}{" "}
          · {date}
        </p>
      </div>
      {hotel && !compact && (
        <strong className="text-sm">
          {money(booking.totalAmount, booking.currency)}
        </strong>
      )}
      {onStatus ? (
        <select
          className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-xs"
          value={booking.status}
          onChange={(event) => onStatus(event.target.value)}
        >
          {allowed.map((status) => (
            <option key={status} value={status}>
              {pretty(status)}
            </option>
          ))}
        </select>
      ) : (
        <Status value={booking.status} />
      )}
    </div>
  );
}

export default function HospitalityWorkspace({
  section = "overview",
}: {
  section?: HospitalitySection;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState<ModalId>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [property, setProperty] = useState<Property | null>(null);
  const [summary, setSummary] = useState<Summary>(emptySummary);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [recent, setRecent] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | BookingType>("all");
  const [calendarDate, setCalendarDate] = useState(today());
  const [roomTypeForm, setRoomTypeForm] = useState({
    name: "",
    code: "",
    baseRate: "",
    maxAdults: "2",
    maxChildren: "1",
    amenities: "",
    description: "",
  });
  const [roomForm, setRoomForm] = useState({
    number: "",
    floor: "",
    roomTypeId: "",
    notes: "",
  });
  const [tableForm, setTableForm] = useState({
    name: "",
    area: "Main dining",
    capacity: "2",
    shape: "square",
    notes: "",
  });
  const [hotelForm, setHotelForm] = useState({
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    checkIn: today(),
    checkOut: tomorrow(),
    adults: "2",
    children: "0",
    optionId: "",
    specialRequests: "",
  });
  const [diningForm, setDiningForm] = useState({
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    date: today(),
    time: "19:00",
    partySize: "2",
    optionId: "",
    specialRequests: "",
  });
  const activeSection = safeSection(section);
  const pageCopy = sectionCopy[activeSection];

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [workspace, overview, typeRows, roomRows, tableRows, bookingRows] =
        await Promise.all([
          hospitalityAPI.getWorkspace(),
          hospitalityAPI.getSummary(),
          hospitalityAPI.getRoomTypes(),
          hospitalityAPI.getRooms(),
          hospitalityAPI.getTables(),
          hospitalityAPI.getBookings(),
        ]);
      setProperty(workspace.data.property);
      setSummary(overview.data.summary);
      setRecent(overview.data.recentBookings || []);
      setRoomTypes(typeRows.data.roomTypes || []);
      setRooms(roomRows.data.rooms || []);
      setTables(tableRows.data.tables || []);
      setBookings(bookingRows.data.bookings || []);
    } catch (error: any) {
      if (error.response?.status === 403) router.replace("/dashboard");
      setNotice(
        error.response?.data?.error ||
          "Could not load the hospitality workspace.",
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!token) {
      router.replace("/login");
      return;
    }
    if (
      user?.selectedService &&
      user.selectedService !== "hospitality-crm" &&
      user.role !== "admin"
    ) {
      router.replace("/dashboard");
      return;
    }
    void load();
  }, [load, router]);

  async function mutate(action: () => Promise<unknown>, success: string) {
    setSaving(true);
    try {
      await action();
      setNotice(success);
      await load();
      return true;
    } catch (error: any) {
      setNotice(error.response?.data?.error || "Could not save this change.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        if (typeFilter !== "all" && booking.bookingType !== typeFilter)
          return false;
        const query = search.trim().toLowerCase();
        return (
          !query ||
          [
            booking.confirmationCode,
            booking.guestName,
            booking.guestPhone,
          ].some((value) => value.toLowerCase().includes(query))
        );
      }),
    [bookings, search, typeFilter],
  );

  const guests = useMemo(() => {
    const rows = new Map<
      string,
      {
        name: string;
        phone: string;
        email: string;
        stays: number;
        dining: number;
        spend: number;
        lastVisit: string;
      }
    >();
    bookings.forEach((booking) => {
      const guest = rows.get(booking.guestPhone) || {
        name: booking.guestName,
        phone: booking.guestPhone,
        email: booking.guestEmail,
        stays: 0,
        dining: 0,
        spend: 0,
        lastVisit: booking.createdAt,
      };
      if (booking.bookingType === "hotel_room") {
        guest.stays += 1;
        guest.spend += booking.totalAmount || 0;
      } else guest.dining += 1;
      if (booking.createdAt > guest.lastVisit)
        guest.lastVisit = booking.createdAt;
      rows.set(booking.guestPhone, guest);
    });
    return [...rows.values()].sort((a, b) =>
      b.lastVisit.localeCompare(a.lastVisit),
    );
  }, [bookings]);

  const calendarRooms = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.bookingType === "hotel_room" &&
          !["cancelled", "no_show"].includes(booking.status) &&
          Boolean(
            booking.checkIn &&
            booking.checkOut &&
            booking.checkIn <= calendarDate &&
            booking.checkOut > calendarDate,
          ),
      ),
    [bookings, calendarDate],
  );
  const calendarTables = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.bookingType === "restaurant_table" &&
          !["cancelled", "no_show"].includes(booking.status) &&
          booking.reservationDate === calendarDate,
      ),
    [bookings, calendarDate],
  );

  if (loading && !property)
    return (
      <div className="grid min-h-screen place-items-center bg-zinc-50">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      {!sidebarOpen && (
        <button
          aria-label="Open navigation"
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-4 z-40 grid h-11 w-11 place-items-center rounded-md border border-zinc-200 bg-white shadow-sm lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="lg:pl-64">
        <header className="border-b border-zinc-200 bg-white">
          <div className="flex flex-wrap items-end justify-between gap-4 px-4 pb-6 pt-20 sm:px-6 lg:px-8 lg:pt-7">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-orange-700">
                {pageCopy.icon}
                {pageCopy.eyebrow}
              </div>
              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                {activeSection === "overview"
                  ? property?.propertyName || pageCopy.title
                  : pageCopy.title}
              </h1>
              <p className="mt-2 text-sm text-zinc-500">
                {pageCopy.description}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setModal("restaurant_table")}
                className="h-10 rounded-md border border-zinc-300 bg-white px-4 text-xs font-bold"
              >
                Book table
              </button>
              <button
                onClick={() => setModal("hotel_room")}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-orange-600 px-4 text-xs font-bold text-white"
              >
                <Plus className="h-4 w-4" />
                New stay
              </button>
            </div>
          </div>
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {notice && (
            <div className="mt-4 flex items-center justify-between rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
              <span>{notice}</span>
              <button onClick={() => setNotice("")}>
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {activeSection === "overview" && (
            <div className="mt-6 grid gap-5">
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  [
                    "Room occupancy",
                    `${summary.occupancyPercent}%`,
                    `${summary.occupiedRooms} occupied · ${summary.availableRooms} free`,
                  ],
                  [
                    "Today’s movement",
                    summary.arrivals + summary.departures,
                    `${summary.arrivals} arrivals · ${summary.departures} departures`,
                  ],
                  [
                    "Restaurant today",
                    summary.tableBookings,
                    `${summary.tableCount} tables configured`,
                  ],
                  [
                    "Booked room revenue",
                    money(summary.bookedRevenue, property?.currency),
                    "Confirmed and completed stays",
                  ],
                ].map(([label, value, detail]) => (
                  <article key={label} className={`${cardClass} p-5`}>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">
                      {label}
                    </p>
                    <strong className="mt-3 block text-3xl">{value}</strong>
                    <p className="mt-2 text-xs text-zinc-500">{detail}</p>
                  </article>
                ))}
              </section>
              <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
                <article className={`${cardClass} overflow-hidden`}>
                  <header className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
                    <div>
                      <h2 className="text-sm font-bold">Recent reservations</h2>
                      <p className="mt-1 text-xs text-zinc-500">
                        Both operations in one queue
                      </p>
                    </div>
                    <Link
                      href={sectionPath("bookings")}
                      className="text-xs font-bold text-orange-700"
                    >
                      View all →
                    </Link>
                  </header>
                  {recent.length ? (
                    <div className="divide-y divide-zinc-100">
                      {recent.map((booking) => (
                        <BookingRow
                          key={booking._id}
                          booking={booking}
                          compact
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-5">
                      <Empty
                        title="No reservations yet"
                        body="Create a stay or table reservation. Voice-agent bookings will appear automatically."
                      />
                    </div>
                  )}
                </article>
                <article className={`${cardClass} p-5`}>
                  <h2 className="text-sm font-bold">Live inventory</h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Exactly what your AI sees
                  </p>
                  <div className="mt-5 grid gap-3">
                    {[
                      ["Room types", roomTypes.length, "rooms"],
                      ["Individual rooms", rooms.length, "rooms"],
                      ["Dining tables", tables.length, "restaurant"],
                      ["Known guests", guests.length, "guests"],
                    ].map(([label, value, tab]) => (
                      <Link
                        key={label}
                        href={sectionPath(tab as HospitalitySection)}
                        className="flex justify-between rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-bold"
                      >
                        <span>{label}</span>
                        <span>{value} →</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-5 rounded-md bg-orange-50 p-4 text-xs leading-5 text-orange-900">
                    <strong className="block">Only two voice tools</strong>
                    Availability is checked first; booking is confirmed only
                    after the creation tool succeeds.
                  </div>
                </article>
              </section>
            </div>
          )}

          {activeSection === "calendar" && (
            <div className="mt-6 grid gap-5">
              <section
                className={`${cardClass} flex flex-wrap items-center justify-between gap-4 p-5`}
              >
                <div>
                  <h2 className="text-sm font-bold">Operations calendar</h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Room nights and dining reservations for one date.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCalendarDate(today())}
                    className="rounded-md border border-zinc-300 px-3 text-xs font-bold"
                  >
                    Today
                  </button>
                  <input
                    type="date"
                    value={calendarDate}
                    onChange={(event) => setCalendarDate(event.target.value)}
                    className={`${fieldClass} w-auto`}
                  />
                </div>
              </section>
              <div className="grid gap-5 xl:grid-cols-2">
                <section className={`${cardClass} overflow-hidden`}>
                  <header className="border-b border-zinc-200 px-5 py-4">
                    <h3 className="text-sm font-bold">Room board</h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      {calendarRooms.length} reserved ·{" "}
                      {Math.max(0, rooms.length - calendarRooms.length)} free
                    </p>
                  </header>
                  {rooms.length ? (
                    <div className="grid gap-3 p-5 sm:grid-cols-2">
                      {rooms.map((room) => {
                        const booking = calendarRooms.find(
                          (item) => relationId(item.roomId) === room._id,
                        );
                        return (
                          <article
                            key={room._id}
                            className={`rounded-md border p-4 ${booking ? "border-sky-200 bg-sky-50" : room.status === "active" ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}
                          >
                            <div className="flex justify-between">
                              <strong className="text-sm">
                                Room {room.number}
                              </strong>
                              <Status
                                value={booking ? booking.status : room.status}
                              />
                            </div>
                            <p className="mt-2 text-xs text-zinc-600">
                              {booking
                                ? `${booking.guestName} · ${booking.confirmationCode}`
                                : room.status === "active"
                                  ? "Available to book"
                                  : pretty(room.status)}
                            </p>
                            <p className="mt-1 text-[11px] text-zinc-400">
                              {relationName(room.roomTypeId)}
                            </p>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-5">
                      <Empty
                        title="No rooms"
                        body="Add room types and physical rooms first."
                      />
                    </div>
                  )}
                </section>
                <section className={`${cardClass} overflow-hidden`}>
                  <header className="border-b border-zinc-200 px-5 py-4">
                    <h3 className="text-sm font-bold">Restaurant service</h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      {calendarTables.length} reservations
                    </p>
                  </header>
                  {calendarTables.length ? (
                    <div className="divide-y divide-zinc-100">
                      {calendarTables.map((booking) => (
                        <BookingRow
                          key={booking._id}
                          booking={booking}
                          compact
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-5">
                      <Empty
                        title="No table bookings"
                        body="There are no dining reservations for this date."
                      />
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}

          {activeSection === "rooms" && (
            <div className="mt-6 grid gap-5 xl:grid-cols-[.9fr_1.3fr]">
              <section className={`${cardClass} h-fit overflow-hidden`}>
                <header className="flex items-center justify-between border-b border-zinc-200 p-5">
                  <div>
                    <h2 className="text-sm font-bold">Room types & rates</h2>
                    <p className="mt-1 text-xs text-zinc-500">
                      The AI quotes these prices.
                    </p>
                  </div>
                  <button
                    onClick={() => setModal("roomType")}
                    className="inline-flex h-9 items-center gap-1 rounded-md bg-zinc-950 px-3 text-xs font-bold text-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add type
                  </button>
                </header>
                {roomTypes.length ? (
                  <div className="divide-y divide-zinc-100">
                    {roomTypes.map((type) => (
                      <article key={type._id} className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold">{type.name}</h3>
                              <Status
                                value={
                                  type.active ? "active" : "out_of_service"
                                }
                              />
                            </div>
                            <p className="mt-1 text-xs text-zinc-500">
                              {type.code} · {type.roomCount} rooms ·{" "}
                              {type.maxAdults} adults + {type.maxChildren}{" "}
                              children
                            </p>
                          </div>
                          <strong className="text-sm">
                            {money(type.baseRate, property?.currency)}
                            <span className="block text-right text-[10px] font-normal text-zinc-400">
                              per night
                            </span>
                          </strong>
                        </div>
                        {type.amenities.length > 0 && (
                          <p className="mt-3 text-xs text-zinc-500">
                            {type.amenities.join(" · ")}
                          </p>
                        )}
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => {
                              const rate = window.prompt(
                                "Nightly rate",
                                String(type.baseRate),
                              );
                              if (rate !== null)
                                void mutate(
                                  () =>
                                    hospitalityAPI.updateRoomType(type._id, {
                                      baseRate: Number(rate),
                                    }),
                                  "Room rate updated.",
                                );
                            }}
                            className="rounded-md border border-zinc-300 px-3 py-1.5 text-[11px] font-bold"
                          >
                            Edit rate
                          </button>
                          <button
                            onClick={() =>
                              void mutate(
                                () =>
                                  hospitalityAPI.updateRoomType(type._id, {
                                    active: !type.active,
                                  }),
                                type.active
                                  ? "Room type paused."
                                  : "Room type activated.",
                              )
                            }
                            className="rounded-md border border-zinc-300 px-3 py-1.5 text-[11px] font-bold"
                          >
                            {type.active ? "Pause" : "Activate"}
                          </button>
                          <button
                            onClick={() =>
                              window.confirm(`Delete ${type.name}?`) &&
                              void mutate(
                                () => hospitalityAPI.deleteRoomType(type._id),
                                "Room type deleted.",
                              )
                            }
                            className="px-2 text-[11px] font-bold text-rose-600"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="p-5">
                    <Empty
                      title="No room types"
                      body="Add Standard, Deluxe, Suite, or any room category you sell."
                    />
                  </div>
                )}
              </section>
              <section className={`${cardClass} h-fit overflow-hidden`}>
                <header className="flex items-center justify-between border-b border-zinc-200 p-5">
                  <div>
                    <h2 className="text-sm font-bold">Physical rooms</h2>
                    <p className="mt-1 text-xs text-zinc-500">
                      Control current operating status.
                    </p>
                  </div>
                  <button
                    disabled={!roomTypes.length}
                    onClick={() => setModal("room")}
                    className="inline-flex h-9 items-center gap-1 rounded-md bg-orange-600 px-3 text-xs font-bold text-white disabled:opacity-40"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add room
                  </button>
                </header>
                {rooms.length ? (
                  <div className="divide-y divide-zinc-100">
                    {rooms.map((room) => (
                      <div
                        key={room._id}
                        className="flex flex-wrap items-center gap-3 px-5 py-4"
                      >
                        <div className="grid h-10 w-10 place-items-center rounded-md bg-zinc-100 text-sm font-bold">
                          {room.number}
                        </div>
                        <div className="min-w-40 flex-1">
                          <strong className="block text-sm">
                            {relationName(room.roomTypeId)}
                          </strong>
                          <span className="text-xs text-zinc-500">
                            Floor {room.floor || "—"}
                          </span>
                        </div>
                        <select
                          value={room.status}
                          onChange={(event) =>
                            void mutate(
                              () =>
                                hospitalityAPI.updateRoom(room._id, {
                                  status: event.target.value,
                                }),
                              `Room ${room.number} updated.`,
                            )
                          }
                          className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-xs"
                        >
                          <option value="active">Available</option>
                          <option value="cleaning">Cleaning</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="out_of_service">Out of service</option>
                        </select>
                        <button
                          onClick={() =>
                            window.confirm(`Delete room ${room.number}?`) &&
                            void mutate(
                              () => hospitalityAPI.deleteRoom(room._id),
                              "Room deleted.",
                            )
                          }
                          className="text-rose-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-5">
                    <Empty
                      title="No physical rooms"
                      body="Add every room number after creating room types."
                    />
                  </div>
                )}
              </section>
            </div>
          )}

          {activeSection === "restaurant" && (
            <section className={`${cardClass} mt-6 overflow-hidden`}>
              <header className="flex items-center justify-between border-b border-zinc-200 p-5">
                <div>
                  <h2 className="text-sm font-bold">Dining tables</h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    {tables.length} tables ·{" "}
                    {tables.reduce((sum, table) => sum + table.capacity, 0)}{" "}
                    seats
                  </p>
                </div>
                <button
                  onClick={() => setModal("table")}
                  className="inline-flex h-9 items-center gap-1 rounded-md bg-orange-600 px-3 text-xs font-bold text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add table
                </button>
              </header>
              {tables.length ? (
                <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tables.map((table) => (
                    <article
                      key={table._id}
                      className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                    >
                      <div className="flex justify-between">
                        <div className="grid h-11 w-11 place-items-center rounded-md bg-white font-bold shadow-sm">
                          {table.name}
                        </div>
                        <Status value={table.status} />
                      </div>
                      <h3 className="mt-4 text-sm font-bold">
                        {table.capacity} seats
                      </h3>
                      <p className="mt-1 text-xs text-zinc-500">
                        {table.area} · {pretty(table.shape)}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <select
                          value={table.status}
                          onChange={(event) =>
                            void mutate(
                              () =>
                                hospitalityAPI.updateTable(table._id, {
                                  status: event.target.value,
                                }),
                              `${table.name} updated.`,
                            )
                          }
                          className="h-9 min-w-0 flex-1 rounded-md border border-zinc-300 bg-white px-2 text-xs"
                        >
                          <option value="active">Available</option>
                          {table.status === "occupied" && (
                            <option value="occupied" disabled>
                              Occupied now
                            </option>
                          )}
                          <option value="cleaning">Cleaning</option>
                          <option value="out_of_service">Out of service</option>
                        </select>
                        <button
                          onClick={() =>
                            window.confirm(`Delete ${table.name}?`) &&
                            void mutate(
                              () => hospitalityAPI.deleteTable(table._id),
                              "Table deleted.",
                            )
                          }
                          className="text-rose-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="p-5">
                  <Empty
                    title="No dining tables"
                    body="Add each table and its seating capacity for accurate availability."
                  />
                </div>
              )}
            </section>
          )}

          {activeSection === "bookings" && (
            <section className={`${cardClass} mt-6 overflow-hidden`}>
              <header className="flex flex-wrap items-end gap-3 border-b border-zinc-200 p-5">
                <div className="min-w-48 flex-1">
                  <h2 className="text-sm font-bold">All reservations</h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Search confirmation, guest, or phone.
                  </p>
                </div>
                <label className="relative min-w-56">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className={`${fieldClass} pl-9`}
                    placeholder="Search reservations"
                  />
                </label>
                <select
                  value={typeFilter}
                  onChange={(event) =>
                    setTypeFilter(event.target.value as typeof typeFilter)
                  }
                  className={`${fieldClass} w-auto`}
                >
                  <option value="all">All bookings</option>
                  <option value="hotel_room">Hotel stays</option>
                  <option value="restaurant_table">Restaurant</option>
                </select>
              </header>
              {filteredBookings.length ? (
                <div className="divide-y divide-zinc-100">
                  {filteredBookings.map((booking) => (
                    <BookingRow
                      key={booking._id}
                      booking={booking}
                      onStatus={(status) =>
                        void mutate(
                          () =>
                            hospitalityAPI.updateBookingStatus(
                              booking._id,
                              status,
                            ),
                          `${booking.confirmationCode} updated.`,
                        )
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="p-5">
                  <Empty
                    title="No matching bookings"
                    body="Dashboard and voice-agent reservations are stored together."
                  />
                </div>
              )}
            </section>
          )}

          {activeSection === "guests" && (
            <section className={`${cardClass} mt-6 overflow-hidden`}>
              <header className="border-b border-zinc-200 p-5">
                <h2 className="text-sm font-bold">Guest directory</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Built automatically from every reservation.
                </p>
              </header>
              {guests.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-zinc-50 text-[10px] uppercase tracking-wide text-zinc-500">
                      <tr>
                        <th className="px-5 py-3">Guest</th>
                        <th className="px-5 py-3">Contact</th>
                        <th className="px-5 py-3">Stays</th>
                        <th className="px-5 py-3">Dining</th>
                        <th className="px-5 py-3">Booked value</th>
                        <th className="px-5 py-3">Last activity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {guests.map((guest) => (
                        <tr key={guest.phone}>
                          <td className="px-5 py-4 font-bold">{guest.name}</td>
                          <td className="px-5 py-4">
                            <span className="block text-xs">{guest.phone}</span>
                            <span className="text-[11px] text-zinc-400">
                              {guest.email || "No email"}
                            </span>
                          </td>
                          <td className="px-5 py-4">{guest.stays}</td>
                          <td className="px-5 py-4">{guest.dining}</td>
                          <td className="px-5 py-4 font-bold">
                            {money(guest.spend, property?.currency)}
                          </td>
                          <td className="px-5 py-4 text-xs text-zinc-500">
                            {new Date(guest.lastVisit).toLocaleDateString(
                              "en-IN",
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-5">
                  <Empty
                    title="No guest profiles"
                    body="Guest profiles appear automatically after the first reservation."
                  />
                </div>
              )}
            </section>
          )}

          {activeSection === "settings" && property && (
            <SettingsPanel
              property={property}
              saving={saving}
              onSave={(data) =>
                void mutate(
                  () => hospitalityAPI.updateWorkspace(data),
                  "Hospitality settings saved.",
                )
              }
            />
          )}
        </div>
      </main>

      {modal === "roomType" && (
        <Modal
          title="Add room type"
          subtitle="Create a sellable room category and confirmed rate."
          onClose={() => setModal(null)}
        >
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              if (
                await mutate(
                  () =>
                    hospitalityAPI.createRoomType({
                      ...roomTypeForm,
                      baseRate: Number(roomTypeForm.baseRate),
                      maxAdults: Number(roomTypeForm.maxAdults),
                      maxChildren: Number(roomTypeForm.maxChildren),
                      amenities: roomTypeForm.amenities
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    }),
                  "Room type created.",
                )
              ) {
                setRoomTypeForm({
                  name: "",
                  code: "",
                  baseRate: "",
                  maxAdults: "2",
                  maxChildren: "1",
                  amenities: "",
                  description: "",
                });
                setModal(null);
              }
            }}
            className="grid gap-4 p-6 sm:grid-cols-2"
          >
            <Field label="Room type">
              <input
                required
                className={fieldClass}
                value={roomTypeForm.name}
                onChange={(e) =>
                  setRoomTypeForm({ ...roomTypeForm, name: e.target.value })
                }
                placeholder="Deluxe King"
              />
            </Field>
            <Field label="Code">
              <input
                className={fieldClass}
                value={roomTypeForm.code}
                onChange={(e) =>
                  setRoomTypeForm({ ...roomTypeForm, code: e.target.value })
                }
                placeholder="DLX"
              />
            </Field>
            <Field label="Nightly rate">
              <input
                required
                type="number"
                min="0"
                className={fieldClass}
                value={roomTypeForm.baseRate}
                onChange={(e) =>
                  setRoomTypeForm({ ...roomTypeForm, baseRate: e.target.value })
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Adults">
                <input
                  type="number"
                  min="1"
                  className={fieldClass}
                  value={roomTypeForm.maxAdults}
                  onChange={(e) =>
                    setRoomTypeForm({
                      ...roomTypeForm,
                      maxAdults: e.target.value,
                    })
                  }
                />
              </Field>
              <Field label="Children">
                <input
                  type="number"
                  min="0"
                  className={fieldClass}
                  value={roomTypeForm.maxChildren}
                  onChange={(e) =>
                    setRoomTypeForm({
                      ...roomTypeForm,
                      maxChildren: e.target.value,
                    })
                  }
                />
              </Field>
            </div>
            <Field label="Amenities" wide>
              <input
                className={fieldClass}
                value={roomTypeForm.amenities}
                onChange={(e) =>
                  setRoomTypeForm({
                    ...roomTypeForm,
                    amenities: e.target.value,
                  })
                }
                placeholder="Wi-Fi, breakfast, balcony"
              />
            </Field>
            <ModalActions saving={saving} onCancel={() => setModal(null)} />
          </form>
        </Modal>
      )}
      {modal === "room" && (
        <Modal
          title="Add physical room"
          subtitle="Link a room number to its sellable room type."
          onClose={() => setModal(null)}
        >
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              if (
                await mutate(
                  () => hospitalityAPI.createRoom(roomForm),
                  "Room added.",
                )
              ) {
                setRoomForm({
                  number: "",
                  floor: "",
                  roomTypeId: "",
                  notes: "",
                });
                setModal(null);
              }
            }}
            className="grid gap-4 p-6 sm:grid-cols-2"
          >
            <Field label="Room number">
              <input
                required
                className={fieldClass}
                value={roomForm.number}
                onChange={(e) =>
                  setRoomForm({ ...roomForm, number: e.target.value })
                }
                placeholder="101"
              />
            </Field>
            <Field label="Floor">
              <input
                className={fieldClass}
                value={roomForm.floor}
                onChange={(e) =>
                  setRoomForm({ ...roomForm, floor: e.target.value })
                }
                placeholder="1"
              />
            </Field>
            <Field label="Room type" wide>
              <select
                required
                className={fieldClass}
                value={roomForm.roomTypeId}
                onChange={(e) =>
                  setRoomForm({ ...roomForm, roomTypeId: e.target.value })
                }
              >
                <option value="">Select type</option>
                {roomTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </Field>
            <ModalActions saving={saving} onCancel={() => setModal(null)} />
          </form>
        </Modal>
      )}
      {modal === "table" && (
        <Modal
          title="Add dining table"
          subtitle="Capacity determines which guest parties can book it."
          onClose={() => setModal(null)}
        >
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              if (
                await mutate(
                  () =>
                    hospitalityAPI.createTable({
                      ...tableForm,
                      capacity: Number(tableForm.capacity),
                    }),
                  "Dining table added.",
                )
              ) {
                setTableForm({
                  name: "",
                  area: "Main dining",
                  capacity: "2",
                  shape: "square",
                  notes: "",
                });
                setModal(null);
              }
            }}
            className="grid gap-4 p-6 sm:grid-cols-2"
          >
            <Field label="Table name">
              <input
                required
                className={fieldClass}
                value={tableForm.name}
                onChange={(e) =>
                  setTableForm({ ...tableForm, name: e.target.value })
                }
                placeholder="T-01"
              />
            </Field>
            <Field label="Dining area">
              <input
                required
                className={fieldClass}
                value={tableForm.area}
                onChange={(e) =>
                  setTableForm({ ...tableForm, area: e.target.value })
                }
              />
            </Field>
            <Field label="Seats">
              <input
                required
                type="number"
                min="1"
                className={fieldClass}
                value={tableForm.capacity}
                onChange={(e) =>
                  setTableForm({ ...tableForm, capacity: e.target.value })
                }
              />
            </Field>
            <Field label="Shape">
              <select
                className={fieldClass}
                value={tableForm.shape}
                onChange={(e) =>
                  setTableForm({ ...tableForm, shape: e.target.value })
                }
              >
                <option value="square">Square</option>
                <option value="round">Round</option>
                <option value="rectangle">Rectangle</option>
                <option value="counter">Counter</option>
              </select>
            </Field>
            <ModalActions saving={saving} onCancel={() => setModal(null)} />
          </form>
        </Modal>
      )}
      {(modal === "hotel_room" || modal === "restaurant_table") && (
        <BookingModal
          type={modal}
          roomTypes={roomTypes.filter(
            (item) => item.active && item.roomCount > 0,
          )}
          tables={tables.filter((item) => item.status === "active")}
          hotel={hotelForm}
          setHotel={setHotelForm}
          dining={diningForm}
          setDining={setDiningForm}
          saving={saving}
          onClose={() => setModal(null)}
          onSubmit={async (event) => {
            event.preventDefault();
            const data =
              modal === "hotel_room"
                ? {
                    bookingType: modal,
                    ...hotelForm,
                    adults: Number(hotelForm.adults),
                    children: Number(hotelForm.children),
                  }
                : {
                    bookingType: modal,
                    ...diningForm,
                    partySize: Number(diningForm.partySize),
                  };
            if (
              await mutate(
                () => hospitalityAPI.createBooking(data),
                "Reservation confirmed.",
              )
            )
              setModal(null);
          }}
        />
      )}
    </div>
  );
}

function Field({
  label,
  wide = false,
  children,
}: {
  label: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={`${labelClass} ${wide ? "sm:col-span-2" : ""}`}>
      {label}
      {children}
    </label>
  );
}
function ModalActions({
  saving,
  onCancel,
}: {
  saving: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex justify-end gap-2 border-t border-zinc-200 pt-4 sm:col-span-2">
      <button
        type="button"
        onClick={onCancel}
        className="h-10 rounded-md border border-zinc-300 px-4 text-xs font-bold"
      >
        Cancel
      </button>
      <button
        disabled={saving}
        className="h-10 rounded-md bg-orange-600 px-5 text-xs font-bold text-white disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

function BookingModal({
  type,
  roomTypes,
  tables,
  hotel,
  setHotel,
  dining,
  setDining,
  saving,
  onClose,
  onSubmit,
}: {
  type: BookingType;
  roomTypes: RoomType[];
  tables: DiningTable[];
  hotel: Record<string, string>;
  setHotel: (value: any) => void;
  dining: Record<string, string>;
  setDining: (value: any) => void;
  saving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const current = type === "hotel_room" ? hotel : dining;
  const update = (key: string, value: string) =>
    type === "hotel_room"
      ? setHotel({ ...hotel, [key]: value })
      : setDining({ ...dining, [key]: value });
  return (
    <Modal
      title={
        type === "hotel_room"
          ? "Create hotel reservation"
          : "Create table reservation"
      }
      subtitle="Inventory is rechecked when saved, preventing double bookings."
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="grid gap-4 p-6 sm:grid-cols-2">
        <Field label="Guest name">
          <input
            required
            className={fieldClass}
            value={current.guestName}
            onChange={(e) => update("guestName", e.target.value)}
          />
        </Field>
        <Field label="Phone number">
          <input
            required
            className={fieldClass}
            value={current.guestPhone}
            onChange={(e) => update("guestPhone", e.target.value)}
          />
        </Field>
        <Field label="Email (optional)" wide>
          <input
            type="email"
            className={fieldClass}
            value={current.guestEmail}
            onChange={(e) => update("guestEmail", e.target.value)}
          />
        </Field>
        {type === "hotel_room" ? (
          <>
            <Field label="Check-in">
              <input
                required
                type="date"
                className={fieldClass}
                value={hotel.checkIn}
                onChange={(e) => update("checkIn", e.target.value)}
              />
            </Field>
            <Field label="Check-out">
              <input
                required
                type="date"
                className={fieldClass}
                value={hotel.checkOut}
                onChange={(e) => update("checkOut", e.target.value)}
              />
            </Field>
            <Field label="Room type">
              <select
                required
                className={fieldClass}
                value={hotel.optionId}
                onChange={(e) => update("optionId", e.target.value)}
              >
                <option value="">Select room type</option>
                {roomTypes.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name} · {money(item.baseRate)}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Adults">
                <input
                  type="number"
                  min="1"
                  className={fieldClass}
                  value={hotel.adults}
                  onChange={(e) => update("adults", e.target.value)}
                />
              </Field>
              <Field label="Children">
                <input
                  type="number"
                  min="0"
                  className={fieldClass}
                  value={hotel.children}
                  onChange={(e) => update("children", e.target.value)}
                />
              </Field>
            </div>
          </>
        ) : (
          <>
            <Field label="Date">
              <input
                required
                type="date"
                className={fieldClass}
                value={dining.date}
                onChange={(e) => update("date", e.target.value)}
              />
            </Field>
            <Field label="Time">
              <input
                required
                type="time"
                className={fieldClass}
                value={dining.time}
                onChange={(e) => update("time", e.target.value)}
              />
            </Field>
            <Field label="Party size">
              <input
                required
                type="number"
                min="1"
                className={fieldClass}
                value={dining.partySize}
                onChange={(e) => update("partySize", e.target.value)}
              />
            </Field>
            <Field label="Table">
              <select
                required
                className={fieldClass}
                value={dining.optionId}
                onChange={(e) => update("optionId", e.target.value)}
              >
                <option value="">Select table</option>
                {tables.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name} · {item.capacity} seats · {item.area}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}
        <Field label="Special requests" wide>
          <textarea
            value={current.specialRequests}
            onChange={(e) => update("specialRequests", e.target.value)}
            className={`${fieldClass} h-20 py-2`}
          />
        </Field>
        <ModalActions saving={saving} onCancel={onClose} />
      </form>
    </Modal>
  );
}

function SettingsPanel({
  property,
  saving,
  onSave,
}: {
  property: Property;
  saving: boolean;
  onSave: (data: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState({
    propertyName: property.propertyName,
    address: property.address,
    phone: property.phone,
    timezone: property.timezone,
    currency: property.currency,
    taxPercent: String(property.taxPercent),
    checkInTime: property.checkInTime,
    checkOutTime: property.checkOutTime,
    restaurantName: property.restaurantName,
    tableSlotMinutes: String(property.tableSlotMinutes),
    hotelPolicies: property.hotelPolicies,
    restaurantPolicies: property.restaurantPolicies,
  });
  const [hours, setHours] = useState(property.restaurantHours);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return (
    <div className="mt-6 grid gap-5">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave({
            ...form,
            taxPercent: Number(form.taxPercent),
            tableSlotMinutes: Number(form.tableSlotMinutes),
            restaurantHours: hours,
          });
        }}
        className={`${cardClass} overflow-hidden`}
      >
        <header className="border-b border-zinc-200 p-5">
          <h2 className="text-sm font-bold">Property settings</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Operational facts used by staff and the AI.
          </p>
        </header>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Hotel name">
            <input
              className={fieldClass}
              value={form.propertyName}
              onChange={(e) =>
                setForm({ ...form, propertyName: e.target.value })
              }
            />
          </Field>
          <Field label="Contact phone">
            <input
              className={fieldClass}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="Address" wide>
            <input
              className={fieldClass}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </Field>
          <Field label="Timezone">
            <input
              className={fieldClass}
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Currency">
              <input
                maxLength={3}
                className={fieldClass}
                value={form.currency}
                onChange={(e) =>
                  setForm({ ...form, currency: e.target.value.toUpperCase() })
                }
              />
            </Field>
            <Field label="Tax %">
              <input
                type="number"
                min="0"
                max="100"
                className={fieldClass}
                value={form.taxPercent}
                onChange={(e) =>
                  setForm({ ...form, taxPercent: e.target.value })
                }
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Check-in">
              <input
                type="time"
                className={fieldClass}
                value={form.checkInTime}
                onChange={(e) =>
                  setForm({ ...form, checkInTime: e.target.value })
                }
              />
            </Field>
            <Field label="Check-out">
              <input
                type="time"
                className={fieldClass}
                value={form.checkOutTime}
                onChange={(e) =>
                  setForm({ ...form, checkOutTime: e.target.value })
                }
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Restaurant">
              <input
                className={fieldClass}
                value={form.restaurantName}
                onChange={(e) =>
                  setForm({ ...form, restaurantName: e.target.value })
                }
              />
            </Field>
            <Field label="Slot minutes">
              <input
                type="number"
                min="15"
                step="15"
                className={fieldClass}
                value={form.tableSlotMinutes}
                onChange={(e) =>
                  setForm({ ...form, tableSlotMinutes: e.target.value })
                }
              />
            </Field>
          </div>
          <fieldset className="sm:col-span-2">
            <legend className="text-xs font-bold text-zinc-600">
              Restaurant weekly hours
            </legend>
            <div className="mt-3 grid gap-2 lg:grid-cols-2">
              {hours.map((entry, index) => (
                <div
                  key={entry.day}
                  className="grid grid-cols-[110px_1fr_1fr] items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3"
                >
                  <label className="flex items-center gap-2 text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={entry.enabled}
                      onChange={(e) =>
                        setHours(
                          hours.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, enabled: e.target.checked }
                              : item,
                          ),
                        )
                      }
                    />
                    {days[entry.day]}
                  </label>
                  <input
                    type="time"
                    disabled={!entry.enabled}
                    className={`${fieldClass} h-9 px-2 text-xs`}
                    value={entry.open}
                    onChange={(e) =>
                      setHours(
                        hours.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, open: e.target.value }
                            : item,
                        ),
                      )
                    }
                  />
                  <input
                    type="time"
                    disabled={!entry.enabled}
                    className={`${fieldClass} h-9 px-2 text-xs`}
                    value={entry.close}
                    onChange={(e) =>
                      setHours(
                        hours.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, close: e.target.value }
                            : item,
                        ),
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </fieldset>
          <Field label="Hotel policies" wide>
            <textarea
              className={`${fieldClass} h-28 py-3`}
              value={form.hotelPolicies}
              onChange={(e) =>
                setForm({ ...form, hotelPolicies: e.target.value })
              }
              placeholder="Cancellation, ID, children, pets, and payment policies"
            />
          </Field>
          <Field label="Restaurant policies" wide>
            <textarea
              className={`${fieldClass} h-28 py-3`}
              value={form.restaurantPolicies}
              onChange={(e) =>
                setForm({ ...form, restaurantPolicies: e.target.value })
              }
              placeholder="Holding time, large groups, and cancellation policies"
            />
          </Field>
        </div>
        <footer className="flex justify-end border-t border-zinc-200 bg-zinc-50 p-4">
          <button
            disabled={saving}
            className="h-10 rounded-md bg-orange-600 px-5 text-xs font-bold text-white disabled:opacity-50"
          >
            Save settings
          </button>
        </footer>
      </form>
      <section className={`${cardClass} p-5`}>
        <div className="flex justify-between">
          <div>
            <h2 className="text-sm font-bold">Voice-agent tools</h2>
            <p className="mt-1 text-xs text-zinc-500">
              The agent needs exactly these two tools.
            </p>
          </div>
          <span className="h-fit rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase text-emerald-700">
            2 tools
          </span>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <ToolCard
            name="check_availability"
            path="POST /api/hospitality/check-availability"
            description="Returns live room totals or suitable tables for the requested dates, time, and guest count."
          />
          <ToolCard
            name="create_booking"
            path="POST /api/hospitality/create-booking"
            description="Rechecks inventory, prevents conflicts, creates the reservation, and returns its confirmation code."
          />
        </div>
        {!property.voicePhoneKey && (
          <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            Connect a voice phone number to this workspace before using the
            tools.
          </p>
        )}
      </section>
    </div>
  );
}

function ToolCard({
  name,
  path,
  description,
}: {
  name: string;
  path: string;
  description: string;
}) {
  return (
    <article className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
      <strong className="text-xs">{name}</strong>
      <code className="mt-2 block break-all text-[11px] text-orange-700">
        {path}
      </code>
      <p className="mt-2 text-xs leading-5 text-zinc-500">{description}</p>
    </article>
  );
}
