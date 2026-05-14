import heroTiger from "../../assets/hero-tiger.jpg";
import g10 from "../../assets/savanna/gallery-10.jpg";
import g11 from "../../assets/savanna/gallery-11.jpg";
import g12 from "../../assets/savanna/gallery-12.jpg";
import g9 from "../../assets/savanna/gallery-9.jpg";
import savannaDining from "../../assets/savanna/savanna-dining.jpg";
import savannaExterior from "../../assets/savanna/savanna-exterior.jpg";
import savannaGarden from "../../assets/savanna/savanna-garden.jpg";
import savannaHero from "../../assets/savanna/savanna-hero.jpg";
import savannaPool from "../../assets/savanna/savanna-pool.jpg";
import savannaRoom1 from "../../assets/savanna/savanna-room-1.jpg";
import savannaRoom2 from "../../assets/savanna/savanna-room-2.jpg";
import savannaView from "../../assets/savanna/savanna-view.jpg";
import events from "../../assets/events.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { cn } from "../../lib/utils";
import { format } from "date-fns";
import {
  ArrowRight,
  Baby,
  Calendar as CalendarIcon,
  Check,
  Clock,
  Gift,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  ParkingSquare,
  Phone,
  RefreshCw,
  Shield,
  ShoppingBag,
  Star,
  Target,
  UtensilsCrossed,
  Wallet,
  Waves,
  Wifi,
} from "lucide-react";
import {
  FaInstagram as Instagram,
  FaFacebookF as Facebook,
  FaLinkedin as Linkedin,
  FaTwitter as Twitter,
  FaYoutube as Youtube,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { z } from "zod";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { Toaster } from "../../components/ui/sonner";
import { Helmet } from "react-helmet-async";

const scrollToForm = () => {
  document
    .getElementById("lead-form")
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
};

/* ---------------- TOP BAR ---------------- */
function TopBar() {
  return (
    <div className="hidden md:flex items-center justify-between px-8 py-2 bg-secondary text-secondary-foreground text-xs">
      <div className="flex items-center gap-6">
        <a
          href="tel:+917900008944"
          className="flex items-center gap-2 hover:text-primary transition"
        >
          <Phone className="size-3.5" /> +91 7900008944
        </a>
        <a
          href="mailto:info@hotaality.com"
          className="flex items-center gap-2 hover:text-primary transition"
        >
          <Mail className="size-3.5" /> info@hotaality.com
        </a>
      </div>
      <div className="text-primary tracking-[0.25em]">LUXURY HOSPITALITY</div>
    </div>
  );
}

function Nav() {
  const links = [
    { label: "About", href: "#about" },
    { label: "Rooms", href: "#rooms" },
    { label: "Amenities", href: "#amenities" },
    { label: "Events", href: "#events" },
    { label: "Offers", href: "#offers" },
    { label: "Contact", href: "#contact" },
  ];
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav
      className={cn(
        "sticky top-0 z-40 flex items-center justify-between px-5 md:px-10 py-4 transition-all",
        scrolled
          ? "bg-secondary/95 backdrop-blur-md border-b border-primary/20 shadow-lg"
          : "bg-secondary/80 backdrop-blur-sm",
      )}
    >
      <a className="flex items-center gap-3 text-secondary-foreground" href="/">
        <img
          src="/assets/hotel-logo.jpeg"
          alt="Hotaality Logo"
          className="size-11 rounded-sm object-contain shadow bg-white"
        />
        <div className="leading-tight">
          <div className="font-serif text-xl text-secondary-foreground tracking-wide">
            Hotaality
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary">
            Discover Your Stay
          </div>
        </div>
      </a>
      <div className="hidden lg:flex items-center gap-7 text-sm text-secondary-foreground/90">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="hover:text-primary transition"
          >
            {l.label}
          </a>
        ))}
      </div>
      <Button
        onClick={scrollToForm}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-wider text-xs px-5"
      >
        GET BEST RATE
      </Button>
    </nav>
  );
}

/* ---------------- LEAD FORM ---------------- */
const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  date: z.date().optional(),
  guests: z.string().min(1),
  room: z.string().min(1),
  notes: z.string().max(400).optional(),
});

function LeadForm({
  variant = "card",
  ctaLabel = "Get Your Free Package Quote",
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState();
  const [guests, setGuests] = useState("");
  const [room, setRoom] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const parsed = leadSchema.safeParse({
      name,
      phone,
      date,
      guests,
      room,
      notes,
    });
    if (!parsed.success) {
      const errs = {};
      parsed.error.issues.forEach((i) => {
        errs[i.path[0]] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      // NOTE: Replace these with your actual EmailJS credentials
      await emailjs.send(
        "service_jimcorbett", // SERVICE_ID
        "template_y803ggl", // TEMPLATE_ID
        {
          from_name: name,
          from_phone: phone,
          travel_date: date ? format(date, "dd MMM yyyy") : "Not specified",
          guests: guests || "Not specified",
          room_type: room || "Not specified",
          notes: notes || "No extra notes",
        },
        "HlvTAvB3Snzbe4bqO", // PUBLIC_KEY
      );
      setDone(true);
      toast.success("Inquiry sent successfully!");
    } catch (err) {
      console.error("EmailJS Error:", err);
      toast.error("Failed to send inquiry. Please try again or call us.");
    } finally {
      setLoading(false);
    }
  };

  const wrapClass =
    variant === "card"
      ? "bg-card text-card-foreground rounded-lg shadow-2xl border border-primary/20 p-6 md:p-7"
      : "bg-card/95 text-card-foreground rounded-lg shadow-2xl border border-primary/30 p-6 md:p-8";

  if (done) {
    return (
      <div className={wrapClass}>
        <div className="flex flex-col items-center text-center py-8">
          <div className="size-16 rounded-full bg-primary/15 text-primary flex items-center justify-center mb-4">
            <Check className="size-8" />
          </div>
          <h3 className="font-serif text-2xl mb-2">Thank you!</h3>
          <p className="text-muted-foreground">
            Our team will call you within 15 minutes with the best available
            rate for Savanna Retreat.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={wrapClass}>
      <div className="mb-5">
        <h3 className="font-serif text-2xl md:text-[26px] text-secondary leading-tight">
          Get the Best Rate for Your Dates
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          No spam. No payment. Just a quick callback.
        </p>
      </div>

      <div className="space-y-3.5">
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Full Name *
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="mt-1"
            maxLength={80}
            disabled={loading}
          />
          {errors.name && (
            <p className="text-xs text-destructive mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            WhatsApp Number *
          </Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="10-digit mobile"
            className="mt-1"
            maxLength={10}
            inputMode="numeric"
            disabled={loading}
          />
          {errors.phone && (
            <p className="text-xs text-destructive mt-1">{errors.phone}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Travel Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  className={cn(
                    "w-full justify-start mt-1 font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="size-4 mr-2" />
                  {date ? format(date, "dd MMM yyyy") : "Pick date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 pointer-events-auto"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) =>
                    d < new Date(new Date().setHours(0, 0, 0, 0)) || loading
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Guests
            </Label>
            <Select value={guests} onValueChange={setGuests} disabled={loading}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-2">1–2 Guests</SelectItem>
                <SelectItem value="3-4">3–4 Guests</SelectItem>
                <SelectItem value="5+">5+ Guests</SelectItem>
                <SelectItem value="group">Group / Bulk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Room Preference
          </Label>
          <Select value={room} onValueChange={setRoom} disabled={loading}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select room type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="without-balcony">Premium Room</SelectItem>
              <SelectItem value="with-balcony">
                Premium Room With Balcony
              </SelectItem>
              <SelectItem value="not-sure">Not Sure — Suggest Best</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Special Request (optional)
          </Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anniversary, kid-friendly room, late check-in…"
            className="mt-1 min-h-[60px]"
            maxLength={400}
            disabled={loading}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full mt-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-wider h-11"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            SENDING... <RefreshCw className="size-4 animate-spin" />
          </span>
        ) : (
          <>
            {ctaLabel} <ArrowRight className="size-4" />
          </>
        )}
      </Button>

      <div className="mt-6 pt-4 border-t border-primary/10 flex flex-col items-center">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
          Or call us directly
        </p>
        <a
          href="tel:+917900008944"
          className="flex items-center gap-2.5 text-secondary text-lg font-sans hover:text-primary transition-colors"
        >
          <Phone className="size-5 text-primary" /> +91 7900008944
        </a>
      </div>

      <p className="flex items-center gap-2 justify-center text-xs text-muted-foreground mt-3">
        <Shield className="size-3.5 text-primary" /> Your info is safe. We'll
        call within 15 minutes.
      </p>
    </form>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary">
      <div className="absolute inset-0 z-0">
        <img
          src={heroTiger}
          alt="Savanna Retreat Jim Corbett"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/60 to-transparent" />
      </div>
      <div className="relative z-10 px-5 md:px-10 py-14 md:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div className="text-secondary-foreground">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary mb-5">
            <MapPin className="size-3.5" /> Jim Corbett · Uttarakhand
          </div>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] mb-4">
            A Serene Escape in the Heart of the Wild
          </h1>
          <p className="font-serif text-2xl md:text-3xl text-primary mb-5">
            Savanna Retreat by Hotaality
          </p>
          <p className="text-secondary-foreground/80 max-w-xl mb-7 leading-relaxed">
            Elegant rooms. Warm hospitality. Tranquil surroundings — right in
            the lap of Jim Corbett National Park.
          </p>
          <ul className="space-y-2.5 text-sm">
            {[
              "Best Rate — Book direct for prices lower than OTAs",
              "Free Cancellation — Up to 7 days before arrival",
              "24x7 Guest Support",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center mt-0.5 shrink-0">
                  <Check className="size-3" />
                </span>
                <span className="text-secondary-foreground/90">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div id="lead-form" className="scroll-mt-28">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}

/* ---------------- SOCIAL PROOF ---------------- */
function SocialProof() {
  const stats = [
    ["4,000+", "Happy Guests"],
    ["12 Yrs", "Local Expertise"],
    ["4.9★", "Google Rated"],
    ["98%", "Would Recommend"],
  ];
  return (
    <section className="bg-secondary text-secondary-foreground py-8 border-y border-primary/20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 md:px-10 max-w-6xl mx-auto">
        {stats.map(([n, l]) => (
          <div key={l} className="text-center">
            <div className="font-serif text-3xl md:text-4xl text-primary">
              {n}
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-secondary-foreground/70 mt-1">
              {l}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- PROPERTY ---------------- */
function Property() {
  return (
    <section
      id="about"
      className="px-5 md:px-10 py-16 md:py-24 max-w-6xl mx-auto scroll-mt-20"
    >
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="grid grid-cols-2 gap-3">
          <img
            src={savannaRoom1}
            alt="Savanna Retreat Room"
            className="rounded-md aspect-[4/5] object-cover col-span-1 row-span-2"
          />
          <img
            src={savannaRoom2}
            alt="Savanna Retreat Room"
            className="rounded-md aspect-[4/5] object-cover col-span-1 row-span-1"
          />
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
            Our Jim Corbett Property
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-secondary mb-5">
            Savanna Retreat
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Wake up to birdsong and the sounds of the jungle. Savanna Retreat is
            designed for guests who want genuine comfort without losing touch
            with nature. Elegant rooms, attentive staff, and everything you need
            — all in one place.
          </p>
          <ul className="space-y-3 mb-7">
            {[
              ["🌿", "Located close to Bijrani & Dhikala safari zones"],
              ["🏊", "Swimming pool on property"],
              ["🍽️", "Multi-cuisine restaurant"],
              ["👨‍👩‍👧", "Perfect for families, couples & corporate groups"],
            ].map(([i, t]) => (
              <li key={t} className="flex items-start gap-3 text-secondary">
                <span className="text-xl leading-none">{i}</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <Button
            onClick={scrollToForm}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-wider"
          >
            ENQUIRE ABOUT THIS PROPERTY <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- ROOMS ---------------- */
function Rooms() {
  const rooms = [
    {
      img: savannaRoom1,
      badge: "PREMIUM ROOM",
      highlights: ["King Bed", "AC", "Room Service", "Window View"],
      desc: "Spacious, nature-inspired room with a king-size bed and seating area.",
    },
    {
      img: savannaRoom2,
      badge: "PREMIUM ROOM WITH BALCONY",
      highlights: [
        "King Bed",
        "Premium Amenities",
        "AC",
        "Room Service",
        "Balcony View",
      ],
      desc: "Elevated comfort with premium furnishings — ideal for a special getaway.",
    },
  ];
  return (
    <section
      id="rooms"
      className="bg-muted/40 py-16 md:py-24 px-5 md:px-10 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-secondary">
            Rooms & Suites
          </h2>
          <p className="text-muted-foreground mt-3">
            Comfort crafted for every kind of traveller
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-7">
          {rooms.map((r) => (
            <div
              key={r.badge}
              className="bg-card rounded-lg overflow-hidden shadow-md border border-border hover:shadow-xl transition group"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={r.img}
                  alt={r.badge}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-[11px] font-semibold tracking-[0.2em] px-3 py-1.5 rounded-sm">
                  {r.badge}
                </span>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {r.highlights.map((h) => (
                    <span
                      key={h}
                      className="text-[11px] uppercase tracking-wider bg-secondary/10 text-secondary px-2.5 py-1 rounded"
                    >
                      {h}
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-5">{r.desc}</p>
                <Button
                  onClick={scrollToForm}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold tracking-wider w-full"
                >
                  ENQUIRE NOW <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- AMENITIES ---------------- */
function Amenities() {
  const items = [
    [Waves, "Swimming Pool", "Open-air pool surrounded by greenery."],
    [
      UtensilsCrossed,
      "Multi-Cuisine Restaurant",
      "Indian, Continental & local flavours.",
    ],
    [Baby, "Kid-Zone", "Safe, fun space for little explorers."],
    [ShoppingBag, "Souvenir Shop", "Take a piece of Corbett home."],
    [Target, "Indoor & Outdoor Activities", "Games, bonfire nights & more."],
    [ParkingSquare, "Secure Parking", "Ample on-property parking."],
    [Wifi, "Free WiFi 24x7", "Stay connected, your way."],
  ];
  return (
    <section
      id="amenities"
      className="px-5 md:px-10 py-16 md:py-24 max-w-6xl mx-auto scroll-mt-20"
    >
      <div className="text-center mb-12">
        <h2 className="font-serif text-4xl md:text-5xl text-secondary">
          Everything You Need, Right Here
        </h2>
        <p className="text-muted-foreground mt-3">
          Hospitality That Goes Beyond Comfort
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map(([Icon, title, desc]) => {
          const I = Icon;
          return (
            <div
              key={title}
              className="bg-card border border-border rounded-md p-6 hover:border-primary/50 hover:shadow-md transition"
            >
              <div className="size-11 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
                <I className="size-5" />
              </div>
              <h3 className="font-serif text-xl text-secondary mb-1">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- EVENTS STRIP ---------------- */
function EventsStrip() {
  return (
    <section
      id="events"
      className="relative py-20 md:py-32 overflow-hidden bg-secondary scroll-mt-20"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={events}
          alt="Weddings & events"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-transparent" />
      </div>

      <div className="relative z-10 px-5 md:px-10 max-w-6xl mx-auto">
        <div className="max-w-2xl bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl">
          <div className="text-primary text-xs uppercase tracking-[0.4em] mb-4 font-semibold">
            Celebrate with us
          </div>
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6 leading-[1.1]">
            Unforgettable <br />
            <span className="text-primary italic">Moments.</span>
          </h2>
          <p className="text-white/80 text-lg mb-10 leading-relaxed">
            From fairytale weddings to high-impact corporate retreats, Savanna
            Retreat provides the perfect canvas for your most cherished events
            in the heart of the wild.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-7 text-base rounded-full transition-all hover:scale-105"
            >
              PLAN YOUR EVENT
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHY BOOK DIRECT (OFFERS) ---------------- */
function WhyDirect() {
  const items = [
    {
      icon: Wallet,
      title: "Best Rate Guarantee",
      desc: "Save up to 20% by cutting out the middleman. No hidden OTA fees.",
      badge: "SAVE 20%",
    },
    {
      icon: Gift,
      title: "Direct Member Perks",
      desc: "Enjoy a complimentary welcome drink and priority early check-in.",
      badge: "EXCLUSVE",
    },
    {
      icon: RefreshCw,
      title: "Flexible Rescheduling",
      desc: "Life happens. Modify your dates with zero hassle for direct bookings.",
      badge: "FLEXIBLE",
    },
    {
      icon: Headphones,
      title: "VIP Concierge",
      desc: "A dedicated travel expert to assist with safari permits and custom plans.",
      badge: "24/7",
    },
  ];
  return (
    <section
      id="offers"
      className="bg-white py-20 md:py-32 px-5 md:px-10 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <div className="text-primary text-xs uppercase tracking-[0.3em] mb-3 font-bold">
              Special Offers
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-secondary leading-tight">
              The Luxury of <br />
              Booking Direct.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm border-l-2 border-primary/30 pl-6 py-2">
            Why settle for standard when you can have the VIP experience? Unlock
            these exclusive benefits only on our website.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map(({ icon: Icon, title, desc, badge }) => (
            <div
              key={title}
              className="group relative border border-secondary/5 rounded-2xl p-8 hover:bg-secondary transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
            >
              {/* Decorative Background Element */}
              <div className="absolute -right-4 -top-4 size-24 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <Icon className="size-7" />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase py-1 px-3 rounded-full bg-primary/10 text-primary group-hover:bg-white/20 group-hover:text-white">
                    {badge}
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-secondary mb-4 group-hover:text-white transition-colors">
                  {title}
                </h3>
                <p className="text-muted-foreground group-hover:text-white/70 transition-colors leading-relaxed">
                  {desc}
                </p>

                <div className="mt-8 flex items-center gap-2 text-primary font-bold text-sm group-hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                  LEARN MORE <ArrowRight className="size-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- REVIEWS ---------------- */
function Reviews() {
  const reviews = [
    [
      "Stunning resort. Clean pool, amazing food, staff went above and beyond.",
      "Priya & Arjun, Mumbai",
    ],
    [
      "Saved ₹4,000 by booking directly. Rooms were beautiful, food incredible.",
      "Rohan Mehta, Bengaluru",
    ],
    [
      "Perfect for families. Kids loved the Kid-Zone, we loved the pool. Returning soon!",
      "The Sharma Family, Delhi NCR",
    ],
  ];
  return (
    <section className="px-5 md:px-10 py-16 md:py-24 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-serif text-4xl md:text-5xl text-secondary">
          Guests Who Loved It
        </h2>
        <p className="text-muted-foreground mt-3">
          4.9★ Google Rating · 4,000+ Stays
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map(([quote, who]) => (
          <div
            key={who}
            className="bg-card border border-border rounded-md p-6 shadow-sm"
          >
            <div className="flex gap-0.5 text-primary mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <p className="text-secondary leading-relaxed mb-4">"{quote}"</p>
            <p className="text-sm text-muted-foreground">— {who}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- PROPERTY GALLERY ---------------- */
function PropertyGallery() {
  const images = [
    {
      src: savannaRoom2,
      span: "md:col-span-2 md:row-span-2",
    },
    { src: savannaExterior, span: "" },
    { src: savannaPool, span: "" },
    { src: g10, span: "" },
    {
      src: savannaHero,
      span: "",
    },
    { src: savannaRoom1, span: "md:col-span-2" },
    { src: savannaDining, span: "" },
    { src: savannaGarden, span: "" },
    { src: savannaView, span: "" },
    { src: g9, span: "" },
    { src: g11, span: "" },
    { src: g12, span: "" },
  ];
  return (
    <section className="px-5 md:px-10 py-16 md:py-24 bg-secondary/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-secondary">
            Property Gallery
          </h2>
          <p className="text-muted-foreground mt-3">
            Explore the beauty of Savanna Retreat Jim Corbett — where luxury
            meets the wild.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className={cn(
                "relative overflow-hidden rounded-lg group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500",
                img.span,
              )}
            >
              <img
                src={img.src}
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110 aspect-square md:aspect-auto"
                style={{ minHeight: "200px" }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-end p-5">
                <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- INLINE LEAD FORM ---------------- */
function InlineLead() {
  return (
    <section
      id="contact"
      className="relative py-16 md:py-24 px-5 md:px-10 overflow-hidden bg-secondary scroll-mt-20"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={savannaHero}
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-secondary/80" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        <div className="text-secondary-foreground">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
            Best Direct Rate
          </div>
          <h2 className="font-serif text-4xl md:text-5xl mb-5 leading-tight">
            Ready to Plan Your Jim Corbett Stay?
          </h2>
          <p className="text-secondary-foreground/80 max-w-md">
            Fill in your details — our team will call you within 15 minutes with
            the best available rate.
          </p>
        </div>
        <LeadForm variant="panel" ctaLabel="GET BEST RATE NOW" />
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ() {
  const items = [
    [
      "Where exactly is Savanna Retreat located?",
      "Savanna Retreat is located in Jim Corbett, Uttarakhand — close to Bijrani and Dhikala safari zones. Exact pin and directions are shared on enquiry.",
    ],
    [
      "What is the check-in and check-out time?",
      "Standard check-in is 2:00 PM and check-out is 11:00 AM. Early check-in / late check-out can be arranged subject to availability.",
    ],
    [
      "Is breakfast/meals included in the stay?",
      "Most plans include breakfast. We also offer MAP (breakfast + dinner) and AP (all meals) plans. Our team will help pick the right plan for you.",
    ],
    [
      "Can you help arrange safari permits for guests?",
      "Yes — our concierge can assist with safari bookings (Bijrani, Jhirna, Dhikala, etc.) subject to forest department availability.",
    ],
    [
      "What is your cancellation policy?",
      "Free cancellation up to 7 days before check-in. Cancellations within 7 days are subject to applicable charges.",
    ],
  ];
  return (
    <section className="px-5 md:px-10 py-16 md:py-24 max-w-3xl mx-auto">
      <h2 className="font-serif text-4xl md:text-5xl text-secondary text-center mb-10">
        Quick Answers
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {items.map(([q, a], i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="font-serif text-lg text-secondary text-left">
              {q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */
function FinalCTA() {
  return (
    <section className="bg-secondary text-secondary-foreground py-16 md:py-20 px-5 md:px-10 text-center border-t border-primary/20">
      <h2 className="font-serif text-4xl md:text-5xl mb-3">
        Don't Wait — Rooms Fill Up Fast
      </h2>
      <p className="text-secondary-foreground/75 max-w-2xl mx-auto mb-7">
        Especially on weekends & holidays. Lock in your dates today.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={scrollToForm}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-wider"
        >
          GET BEST RATE <ArrowRight className="size-4" />
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold tracking-wider"
        >
          <a href="tel:+917900008944">
            <Phone className="size-4" /> CALL NOW: +91 7900008944
          </a>
        </Button>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground/85 pt-14 pb-6 px-5 md:px-10 border-t border-primary/15">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/assets/hotel-logo.jpeg"
              alt="Hotaality Logo"
              className="size-11 rounded-sm object-contain bg-white"
            />
            <div className="font-serif text-2xl text-secondary-foreground">
              Hotaality
            </div>
          </div>
          <p className="text-sm text-secondary-foreground/70 mb-3">
            A Brand of Hotaality RevTech Private Limited
          </p>
          <p className="text-sm leading-relaxed">
            898, 8th Floor, Gaur City Mall, Sector-4, Greater Noida West, Gautam
            Buddha Nagar – 201306
          </p>
        </div>
        <div>
          <h4 className="text-primary uppercase text-xs tracking-[0.25em] mb-4">
            Contact
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="size-3.5 text-primary" /> Reservations:{" "}
              <a href="tel:+917900008944" className="hover:text-primary">
                +91 7900008944
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-3.5 text-primary" /> Travel/Wedding:{" "}
              <a href="tel:+919211283334" className="hover:text-primary">
                +91 9211283334
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-3.5 text-primary" /> Corporate:{" "}
              <a href="tel:+919211283334" className="hover:text-primary">
                +91 9211283334
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-3.5 text-primary" /> Hotel Registration:{" "}
              <a href="tel:+919211283335" className="hover:text-primary">
                +91 9211283335
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-3.5 text-primary" />{" "}
              <a
                href="mailto:info@hotaality.com"
                className="hover:text-primary"
              >
                info@hotaality.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-3.5 text-primary" /> Support: 24x7
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-primary uppercase text-xs tracking-[0.25em] mb-4">
            Popular Cities
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-primary">
                Jim Corbett
              </a>
            </li>
            <li>
              <a
                href="https://hotaality.com/hotel-details/HOTEL-Lucknow-001"
                className="hover:text-primary"
              >
                Lucknow
              </a>
            </li>
            <li>
              <a
                href="https://hotaality.com/hotel-details/HOTEL-SHRAVASTI-001"
                className="hover:text-primary"
              >
                Shravasti
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-primary/15 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-secondary-foreground/65">
        <div className="flex flex-wrap gap-4">
          <a
            href="https://hotaality.com/privacy-policy"
            className="hover:text-primary"
          >
            Privacy Policy
          </a>
          <a
            href="https://hotaality.com/refund-and-cancellation-policy"
            className="hover:text-primary"
          >
            Refund Policy
          </a>
          <a
            href="https://hotaality.com/terms-and-conditions"
            className="hover:text-primary"
          >
            Terms & Conditions
          </a>
        </div>
        <div className="flex gap-3">
          <a
            href="https://www.facebook.com/hotaalityrevtech"
            aria-label="Facebook"
          >
            <Facebook className="size-4 hover:text-primary" />
          </a>
          <a href="https://www.instagram.com/hotaality" aria-label="Instagram">
            <Instagram className="size-4 hover:text-primary" />
          </a>
          <a href="https://www.youtube.com/@hotaality" aria-label="YouTube">
            <Youtube className="size-4 hover:text-primary" />
          </a>
          <a href="https://x.com/hotaality" aria-label="Twitter">
            <Twitter className="size-4 hover:text-primary" />
          </a>
          <a
            href="https://www.linkedin.com/company/hotaality"
            aria-label="LinkedIn"
          >
            <Linkedin className="size-4 hover:text-primary" />
          </a>
        </div>
        <div>© 2026 Hotaality Group of Hotels. All rights reserved.</div>
      </div>
    </footer>
  );
}

/* ---------------- FLOATING ELEMENTS ---------------- */
function WhatsAppFAB() {
  return (
    <a
      href="https://wa.me/917900008944"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-20 md:bottom-6 right-5 z-50 size-14 rounded-full bg-[oklch(0.65_0.18_150)] text-white shadow-2xl flex items-center justify-center hover:scale-110 transition"
    >
      <MessageCircle className="size-6" />
    </a>
  );
}

function MobileSticky() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-secondary border-t border-primary/30 px-3 py-2.5 flex gap-2 shadow-2xl">
      <Button
        asChild
        variant="outline"
        className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
      >
        <a href="tel:+917900008944">
          <Phone className="size-4" /> Call Now
        </a>
      </Button>
      <Button
        onClick={scrollToForm}
        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
      >
        GET BEST RATE <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}

/* ---------------- APP ---------------- */
export default function JimcorbettLandingPage() {
  return (
    <>
      <Helmet>
        <title>
          Hotel Savanna Retreat Jim Corbett | Resorts in Jim Corbett | Corporate
          Events | Conferences | Destination Wedding | Events | Jeep Safari
        </title>

        <meta
          name="description"
          content="Luxury Resort in Jim Corbett for Family Stays, Corporate Offsites, Destination Weddings & Jeep Safari. Serving Delhi NCR & Pan India. Get Free Quote!"
        />

        {/* <link rel="canonical" href="https://www.bhrhotelsindia.com/" /> */}
      </Helmet>
      <div className="bg-background text-foreground scroll-smooth">
        <TopBar />
        <Nav />
        <Hero />
        <SocialProof />
        <Property />
        <Rooms />
        <Amenities />
        <EventsStrip />
        <WhyDirect />
        <Reviews />
        <PropertyGallery />
        <InlineLead />
        <FAQ />
        <FinalCTA />
        <Footer />
        {/* <WhatsAppFAB /> */}
        <MobileSticky />
        <Toaster />
      </div>
    </>
  );
}
