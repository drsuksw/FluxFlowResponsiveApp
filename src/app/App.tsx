import React, { useState, useMemo } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Coffee, Menu, X, Star, MapPin, Clock, Calendar, Users,
  ChevronRight, Search, Heart, ArrowRight, Phone, Check,
  LogOut, User, SlidersHorizontal, ChevronLeft, Tag,
  Utensils, Instagram, Mail, Facebook, Info,
  ShoppingCart, Trash2, Plus, Minus, ShoppingBag,
  FileText, Truck, Store, AlertTriangle, CreditCard,
  Wallet, Building2, Bike, ChevronDown, Package, CircleCheck,
  ConciergeBell,
} from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const display = "'Playfair Display', Georgia, serif";

// ─── Types ────────────────────────────────────────────────────────────────────
type AuthUser = { name: string; email: string; type: "member" | "non-member" };
type AppPage = "auth" | "beranda" | "produk" | "reservasi" | "pembayaran";
type CartItem = { productId: number; quantity: number; note: string };
type PurchaseType = "pickup" | "delivery";

// ─── Data ─────────────────────────────────────────────────────────────────────
const PROMOS = [
  {
    id: 1, badge: "PROMO MINGGUAN", code: "SENIN30",
    title: "Hemat 30% Setiap Senin",
    subtitle: "Nikmati semua minuman kopi dengan diskon spesial di hari Senin",
    image: "1461023058943-07fcbe16d735",
  },
  {
    id: 2, badge: "PROMO SPESIAL", code: "DESSERTB1G1",
    title: "Buy 1 Get 1 Dessert",
    subtitle: "Setiap pembelian dessert pertama, dapatkan satu dessert gratis",
    image: "1509440159596-0249088772ff",
  },
  {
    id: 3, badge: "PROMO PAGI", code: "EARLYBIRD20",
    title: "Early Bird Breakfast",
    subtitle: "Sarapan pagi jam 07.00–09.00 hemat 20% untuk semua menu",
    image: "1495474472287-4d71bcdd2085",
  },
];

const PRODUCTS = [
  { id: 1, name: "Espresso Classico", category: "Kopi", price: 28000, rating: 4.8, reviews: 124, image: "1509042239860-f550ce710b93", desc: "Espresso murni dengan crema tebal, cita rasa bold dan intense" },
  { id: 2, name: "Cappuccino Velluto", category: "Kopi", price: 38000, rating: 4.9, reviews: 203, image: "1461023058943-07fcbe16d735", desc: "Espresso lembut dengan busa susu yang creamy dan hangat" },
  { id: 3, name: "Caramel Brulee Latte", category: "Kopi", price: 45000, rating: 4.7, reviews: 89, image: "1638543284847-3a6bed3e1689", desc: "Latte dengan sirup karamel brulee dan topping karamel crunchy" },
  { id: 4, name: "Cold Brew Nitro", category: "Kopi", price: 42000, rating: 4.6, reviews: 67, image: "1531835207745-506a1bc035d8", desc: "Cold brew disajikan dengan gas nitrogen untuk tekstur yang creamy" },
  { id: 5, name: "Matcha Latte Uji", category: "Minuman Non-Kopi", price: 40000, rating: 4.8, reviews: 156, image: "1515823064-d6e0c04616a7", desc: "Matcha premium grade ceremonial dari Uji, Kyoto dengan susu oat" },
  { id: 6, name: "Teh Tarik Spesial", category: "Minuman Non-Kopi", price: 25000, rating: 4.5, reviews: 78, image: "1556679343-c7306c1976bc", desc: "Teh hitam kuat yang dipadukan susu kental manis, ditarik sempurna" },
  { id: 7, name: "Smoothie Mangga Harum", category: "Minuman Non-Kopi", price: 35000, rating: 4.6, reviews: 45, image: "1570696516188-ade861b84a49", desc: "Mangga harum manis segar diblender dengan yogurt dan madu" },
  { id: 8, name: "Nasi Goreng FluxFlow", category: "Makanan Berat", price: 65000, rating: 4.9, reviews: 312, image: "1512058564366-18510be2db19", desc: "Nasi goreng spesial dengan telur mata sapi, ayam suwir, dan kerupuk" },
  { id: 9, name: "Pasta Carbonara", category: "Makanan Berat", price: 72000, rating: 4.7, reviews: 134, image: "1555949258-eb67b1ef0ceb", desc: "Fettuccine saus carbonara creamy dengan beef bacon dan parmesan" },
  { id: 10, name: "Sandwich Reuben", category: "Makanan Berat", price: 58000, rating: 4.5, reviews: 91, image: "1528736235302-52922df5c122", desc: "Corned beef, sauerkraut, swiss cheese, dan saus thousand island" },
  { id: 11, name: "Croissant Almond", category: "Cemilan", price: 32000, rating: 4.8, reviews: 178, image: "1555507036-ab1f4038808a", desc: "Croissant mentega berlapis dengan krim almond dan irisan almond" },
  { id: 12, name: "Cheese Cake New York", category: "Dessert", price: 48000, rating: 4.9, reviews: 267, image: "1533134242443-d4fd215305ad", desc: "Cheesecake creamy gaya New York dengan topping berry sauce" },
  { id: 13, name: "Tiramisu Classico", category: "Dessert", price: 52000, rating: 4.8, reviews: 198, image: "1571877227200-a0d98ea607e9", desc: "Tiramisu Italia asli dengan ladyfinger, mascarpone, dan espresso" },
  { id: 14, name: "Waffle Strawberry", category: "Cemilan", price: 45000, rating: 4.6, reviews: 112, image: "1488477181946-6428a0291777", desc: "Waffle renyah dengan topping strawberry segar dan whipped cream" },
];

const LOCATIONS = [
  { id: 1, name: "FluxFlow Sudirman", address: "Jl. Jend. Sudirman No. 45, Jakarta Pusat", hours: "07.00 – 22.00", image: "1554118811-1e0d58224f24", capacity: "80 kursi", phone: "+62 21 5555-1001", desc: "Cafe flagship kami di jantung bisnis Jakarta" },
  { id: 2, name: "FluxFlow Kemang", address: "Jl. Kemang Raya No. 12, Jakarta Selatan", hours: "08.00 – 23.00", image: "1559925393-8be0ec4767c8", capacity: "60 kursi", phone: "+62 21 5555-1002", desc: "Suasana bohemian di kawasan trendi Kemang" },
  { id: 3, name: "FluxFlow Bintaro", address: "Jl. Bintaro Utama 3A No. 8, Tangerang Selatan", hours: "07.00 – 21.00", image: "1445116572660-236099ec97a0", capacity: "70 kursi", phone: "+62 21 5555-1003", desc: "Oasis ketenangan di tengah kesibukan Bintaro" },
];

const TIME_SLOTS = [
  "08:00","08:30","09:00","09:30","10:00","10:30",
  "11:00","11:30","12:00","12:30","13:00","13:30",
  "14:00","14:30","15:00","15:30","16:00","16:30",
  "17:00","17:30","18:00","18:30","19:00","19:30",
  "20:00","20:30",
];
const UNAVAILABLE = new Set(["09:00","09:30","12:00","12:30","19:00"]);

const CATEGORIES = ["Semua","Kopi","Minuman Non-Kopi","Makanan Berat","Cemilan","Dessert"];

const TESTIMONIALS = [
  { name: "Anindya Putri", rating: 5, text: "Suasana cafenya sangat nyaman dan cozy. Kopi-kopinya enak banget, saya selalu balik ke sini setiap minggu!", avatar: "AP" },
  { name: "Rizky Firmansyah", rating: 5, text: "Tiramisu FluxFlow adalah yang terbaik yang pernah saya cicipi di Jakarta. Highly recommended!", avatar: "RF" },
  { name: "Sari Dewi", rating: 4, text: "Pelayanannya ramah, tempatnya bersih dan instagramable. Reservasinya juga mudah banget lewat app ini.", avatar: "SD" },
  { name: "Budi Santoso", rating: 5, text: "Cold brew nitro di sini benar-benar beda level. Texture-nya creamy banget. Wajib dicoba!", avatar: "BS" },
];

// ─── Utils ────────────────────────────────────────────────────────────────────
function formatRupiah(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

// ─── Star Rating ─────────────────────────────────────────────────────────────
function StarRating({ rating, small }: { rating: number; small?: boolean }) {
  return (
    <div className={cn("flex items-center gap-0.5", small ? "text-xs" : "text-sm")}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={small ? 10 : 12}
          className={i <= Math.floor(rating) ? "fill-amber-500 text-amber-500" : "fill-muted text-muted-foreground/30"}
        />
      ))}
      <span className="ml-1 text-muted-foreground text-xs">{rating}</span>
    </div>
  );
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────
function MiniCalendar({ selected, onSelect }: { selected: Date | null; onSelect: (d: Date) => void }) {
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date(); today.setHours(0,0,0,0);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const maxDate = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const monthName = viewDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <div className="bg-card rounded-2xl p-4 border border-border">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
          <ChevronLeft size={15} />
        </button>
        <span className="font-semibold text-sm capitalize" style={{ fontFamily: display }}>{monthName}</span>
        <button onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
          <ChevronRight size={15} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {["Min","Sen","Sel","Rab","Kam","Jum","Sab"].map(d => (
          <div key={d} className="text-center text-[10px] text-muted-foreground font-medium py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dt = new Date(day); dt.setHours(0,0,0,0);
          const isPast = dt < today;
          const tooFar = dt > maxDate;
          const disabled = isPast || tooFar;
          const isSelected = selected?.toDateString() === day.toDateString();
          const isToday = dt.getTime() === today.getTime();
          return (
            <button key={i} disabled={disabled} onClick={() => !disabled && onSelect(day)}
              className={cn(
                "w-8 h-8 rounded-full text-xs flex items-center justify-center mx-auto transition-all",
                disabled && "text-muted-foreground/25 cursor-not-allowed",
                isSelected && "bg-primary text-primary-foreground font-semibold shadow-sm",
                isToday && !isSelected && "border-2 border-accent text-accent font-semibold",
                !disabled && !isSelected && "hover:bg-secondary cursor-pointer"
              )}>
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ user, page, onNavigate, onLogout, cartCount, onCartOpen }: {
  user: AuthUser; page: AppPage;
  onNavigate: (p: AppPage) => void; onLogout: () => void;
  cartCount: number; onCartOpen: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems: { label: string; page: AppPage }[] = [
    { label: "Beranda", page: "beranda" },
    { label: "Produk", page: "produk" },
    { label: "Reservasi", page: "reservasi" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => onNavigate("beranda")} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Coffee size={15} className="text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight" style={{ fontFamily: display }}>FluxFlow</span>
            </button>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <button key={item.page} onClick={() => onNavigate(item.page)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    page === item.page
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  )}>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2">
              {user.type === "non-member" && (
                <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
                  Non-Member
                </span>
              )}
              {/* Cart button */}
              <button onClick={onCartOpen}
                className="relative p-2.5 rounded-xl hover:bg-secondary transition-colors">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-2 text-sm pl-1 border-l border-border ml-1">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center border border-border">
                  <User size={13} className="text-muted-foreground" />
                </div>
                <span className="font-medium text-sm max-w-[120px] truncate">{user.name}</span>
              </div>
              <button onClick={onLogout}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-secondary">
                <LogOut size={13} /> Keluar
              </button>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              {/* Mobile cart */}
              <button onClick={onCartOpen} className="relative p-2 rounded-xl hover:bg-secondary transition-colors">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button className="p-2 rounded-xl hover:bg-secondary transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-card border-b border-border shadow-lg">
            <div className="p-4 space-y-1">
              {navItems.map(item => (
                <button key={item.page}
                  onClick={() => { onNavigate(item.page); setMobileOpen(false); }}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    page === item.page ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                  )}>
                  {item.label}
                </button>
              ))}
              <div className="border-t border-border pt-3 mt-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <User size={13} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      {user.type === "non-member" && (
                        <p className="text-xs text-muted-foreground">Non-Member</p>
                      )}
                    </div>
                  </div>
                  <button onClick={onLogout}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground px-3 py-2 rounded-xl hover:bg-secondary transition-colors">
                    <LogOut size={13} /> Keluar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
function CartDrawer({
  cart, open, onClose, onUpdateQty, onRemove, onClear, onUpdateNote, onCheckout,
}: {
  cart: CartItem[]; open: boolean; onClose: () => void;
  onUpdateQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  onClear: () => void;
  onUpdateNote: (id: number, note: string) => void;
  onCheckout: () => void;
}) {
  const [expandedNote, setExpandedNote] = useState<number | null>(null);

  const total = cart.reduce((sum, item) => {
    const p = PRODUCTS.find(x => x.id === item.productId);
    return sum + (p?.price ?? 0) * item.quantity;
  }, 0);
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      )}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full sm:w-[420px] bg-card z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingCart size={18} className="text-accent" />
            <span className="font-bold text-lg" style={{ fontFamily: display }}>Keranjang</span>
            {itemCount > 0 && (
              <span className="bg-accent text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount} item
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-secondary transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
                <ShoppingBag size={32} className="text-muted-foreground/40" />
              </div>
              <div>
                <p className="font-semibold text-base" style={{ fontFamily: display }}>Keranjang Masih Kosong</p>
                <p className="text-muted-foreground text-sm mt-1">Tambahkan produk dari halaman menu untuk mulai berbelanja.</p>
              </div>
              <button onClick={onClose} className="flex items-center gap-1.5 text-accent text-sm font-semibold hover:underline">
                Lihat Menu <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {cart.map(item => {
                const product = PRODUCTS.find(p => p.id === item.productId);
                if (!product) return null;
                const noteOpen = expandedNote === item.productId;
                return (
                  <div key={item.productId} className="p-4 hover:bg-secondary/20 transition-colors">
                    <div className="flex gap-3">
                      {/* Image */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-amber-100 flex-shrink-0">
                        <img
                          src={`https://images.unsplash.com/photo-${product.image}?w=120&h=120&fit=crop&auto=format`}
                          alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-sm leading-snug truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                          </div>
                          <button onClick={() => onRemove(item.productId)}
                            className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-muted-foreground transition-colors flex-shrink-0">
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 bg-secondary rounded-xl p-0.5">
                            <button onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-card flex items-center justify-center hover:bg-background shadow-sm transition-colors">
                              <Minus size={11} />
                            </button>
                            <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                            <button onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-card flex items-center justify-center hover:bg-background shadow-sm transition-colors">
                              <Plus size={11} />
                            </button>
                          </div>
                          <p className="text-sm font-bold text-accent">{formatRupiah(product.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Note section */}
                    <div className="mt-2.5 ml-0">
                      {item.note && !noteOpen && (
                        <div className="flex items-start gap-1.5 bg-amber-50 border border-amber-200/60 rounded-lg px-2.5 py-1.5 mb-1.5">
                          <FileText size={11} className="text-accent mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-foreground/70 italic leading-relaxed">{item.note}</p>
                          <button onClick={() => setExpandedNote(item.productId)}
                            className="ml-auto text-[10px] text-accent hover:underline flex-shrink-0 font-medium">Edit</button>
                        </div>
                      )}
                      {noteOpen ? (
                        <div className="space-y-1.5">
                          <textarea
                            autoFocus
                            value={item.note}
                            onChange={e => onUpdateNote(item.productId, e.target.value)}
                            placeholder="Contoh: gula sedikit, es banyak, tanpa topping, ekstra shot..."
                            rows={2}
                            className="w-full px-3 py-2 rounded-xl border border-accent/40 bg-amber-50/50 text-xs outline-none focus:ring-2 focus:ring-accent/25 resize-none placeholder:text-muted-foreground/50 transition-all"
                          />
                          <button onClick={() => setExpandedNote(null)}
                            className="text-[10px] font-semibold text-accent hover:underline">Selesai</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setExpandedNote(item.productId)}
                          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-accent transition-colors">
                          <FileText size={11} />
                          {item.note ? "" : "Tambah catatan"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-border px-5 py-5 flex-shrink-0 space-y-3.5 bg-card">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({itemCount} item)</span>
                <span className="font-semibold">{formatRupiah(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pajak (10%)</span>
                <span className="font-semibold">{formatRupiah(Math.round(total * 0.1))}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg text-accent" style={{ fontFamily: display }}>
                  {formatRupiah(Math.round(total * 1.1))}
                </span>
              </div>
            </div>
            <button onClick={() => { onClose(); onCheckout(); }}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-2xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2">
              <ShoppingBag size={16} /> Lanjutkan ke Pembayaran
            </button>
            <button onClick={onClear}
              className="w-full text-xs text-muted-foreground hover:text-red-500 transition-colors text-center py-1 flex items-center justify-center gap-1.5">
              <Trash2 size={11} /> Kosongkan Keranjang
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Delivery Warning Modal ───────────────────────────────────────────────────
function DeliveryWarningModal({ onClose, onUsePickup }: { onClose: () => void; onUsePickup: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-3xl p-7 max-w-sm w-full shadow-2xl border border-border">
        <div className="w-14 h-14 bg-amber-50 border-4 border-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-amber-600" />
        </div>
        <h2 className="text-xl font-bold text-center mb-2" style={{ fontFamily: display }}>
          Delivery Service — Khusus Mobile
        </h2>
        <p className="text-muted-foreground text-sm text-center leading-relaxed mb-5">
          Layanan <span className="font-semibold text-foreground">Delivery Service</span> saat ini hanya tersedia
          melalui <span className="font-semibold text-foreground">Aplikasi Mobile FluxFlow</span>.
          Silakan unduh aplikasi kami di App Store atau Google Play untuk menikmati pengiriman ke lokasi Anda.
        </p>
        <div className="flex items-center gap-2 bg-secondary rounded-2xl p-3 mb-5">
          <Bike size={16} className="text-accent flex-shrink-0" />
          <p className="text-xs text-muted-foreground leading-snug">
            Unduh FluxFlow App dan nikmati pengiriman cepat ke mana saja dalam jangkauan layanan kami.
          </p>
        </div>
        <div className="space-y-2.5">
          <button className="w-full py-3 bg-primary text-primary-foreground rounded-2xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <Bike size={15} /> Unduh Aplikasi Mobile
          </button>
          <button onClick={onUsePickup}
            className="w-full py-3 border-2 border-border rounded-2xl text-sm font-semibold hover:bg-secondary transition-all">
            Gunakan Pickup sebagai gantinya
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Payment Page ─────────────────────────────────────────────────────────────
type PaymentMethod = "card" | "transfer" | "gopay" | "ovo" | "dana" | "cash";

function PaymentPage({ cart, user, onSuccess, onBack, onUpdateQty }: {
  cart: CartItem[]; user: AuthUser;
  onSuccess: () => void; onBack: () => void;
  onUpdateQty: (id: number, qty: number) => void;
}) {
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("pickup");
  const [showDeliveryWarn, setShowDeliveryWarn] = useState(false);
  const [pickupLocation, setPickupLocation] = useState(LOCATIONS[0].id);
  const [payMethod, setPayMethod] = useState<PaymentMethod>("card");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState(user.name);
  // Transfer bank
  const [selectedBank, setSelectedBank] = useState("BCA");
  // Billing
  const [billingName, setBillingName] = useState(user.name !== "Tamu" ? user.name : "");
  const [billingPhone, setBillingPhone] = useState("");
  const [billingEmail, setBillingEmail] = useState(user.email || "");
  // Order note
  const [orderNote, setOrderNote] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderRef] = useState(() => "FF-" + Math.random().toString(36).slice(2, 8).toUpperCase());

  const subtotal = cart.reduce((s, i) => {
    const p = PRODUCTS.find(x => x.id === i.productId);
    return s + (p?.price ?? 0) * i.quantity;
  }, 0);
  const tax = Math.round(subtotal * 0.1);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + tax - discount;
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const VALID_PROMOS = new Set(PROMOS.map(p => p.code));

  const handleApplyPromo = () => {
    if (VALID_PROMOS.has(promoCode.toUpperCase())) {
      setPromoApplied(true); setPromoError("");
    } else {
      setPromoError("Kode promo tidak valid atau sudah kedaluwarsa."); setPromoApplied(false);
    }
  };

  const handleDeliveryClick = () => {
    if (purchaseType !== "delivery") setShowDeliveryWarn(true);
  };

  const canPlaceOrder = billingName.trim() && billingPhone.trim() &&
    (payMethod !== "card" || (cardNumber && cardExpiry && cardCvv));

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring/40 transition-all placeholder:text-muted-foreground/55";
  const sectionTitle = "text-base font-bold mb-4" ;

  if (orderPlaced) {
    const loc = LOCATIONS.find(l => l.id === pickupLocation);
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-green-200">
            <CircleCheck size={44} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: display }}>Pesanan Diterima!</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Terima kasih, <span className="font-semibold text-foreground">{billingName}</span>. Pesanan Anda sedang diproses.
          </p>

          {/* Receipt card */}
          <div className="bg-card border border-border rounded-2xl p-5 text-left mb-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Nomor Pesanan</p>
                <p className="font-bold text-xl mt-0.5" style={{ fontFamily: display }}>{orderRef}</p>
              </div>
              <span className="bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase">
                Dikonfirmasi
              </span>
            </div>
            <div className="border-t border-border pt-4 space-y-2.5">
              {cart.map(item => {
                const p = PRODUCTS.find(x => x.id === item.productId);
                if (!p) return null;
                return (
                  <div key={item.productId} className="flex justify-between items-start gap-2 text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{p.name} <span className="text-muted-foreground">×{item.quantity}</span></p>
                      {item.note && <p className="text-xs text-muted-foreground italic truncate">{item.note}</p>}
                    </div>
                    <p className="font-semibold flex-shrink-0">{formatRupiah(p.price * item.quantity)}</p>
                  </div>
                );
              })}
              <div className="border-t border-border pt-2 mt-2 space-y-1">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span><span>{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Pajak (10%)</span><span>{formatRupiah(tax)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Diskon Promo</span><span>-{formatRupiah(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-1">
                  <span>Total</span>
                  <span className="text-accent" style={{ fontFamily: display }}>{formatRupiah(total)}</span>
                </div>
              </div>
            </div>
            <div className="border-t border-border pt-4 mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Store size={13} className="text-accent flex-shrink-0" />
                <span className="text-muted-foreground">Pickup di</span>
                <span className="font-medium">{loc?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard size={13} className="text-accent flex-shrink-0" />
                <span className="text-muted-foreground">Pembayaran via</span>
                <span className="font-medium capitalize">{payMethod === "card" ? "Kartu" : payMethod === "transfer" ? `Transfer ${selectedBank}` : payMethod.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={13} className="text-accent flex-shrink-0" />
                <span className="text-muted-foreground">Estimasi siap</span>
                <span className="font-medium">15–20 menit</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
            Konfirmasi pesanan dikirim ke <span className="font-medium">{billingPhone}</span>.
            Harap datang ke kasir dengan menunjukkan nomor pesanan Anda.
          </p>
          <button onClick={onSuccess}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-2xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <ArrowRight size={16} /> Kembali ke Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-16 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-secondary transition-colors flex-shrink-0">
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 className="font-bold text-xl leading-none" style={{ fontFamily: display }}>Pembayaran</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{itemCount} item · {formatRupiah(total)}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

          {/* LEFT: Payment form */}
          <div className="space-y-5">

            {/* 1. Purchase Type */}
            <div className="bg-card rounded-2xl p-5 border border-border">
              <h2 className={sectionTitle} style={{ fontFamily: display }}>Jenis Pemesanan</h2>
              <div className="grid grid-cols-2 gap-3">
                {/* Pickup */}
                <button
                  onClick={() => setPurchaseType("pickup")}
                  className={cn(
                    "flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all",
                    purchaseType === "pickup"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40"
                  )}>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
                    purchaseType === "pickup" ? "bg-primary text-primary-foreground" : "bg-secondary")}>
                    <Store size={18} />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm">Pickup</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Ambil di kasir</p>
                  </div>
                  {purchaseType === "pickup" && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check size={11} className="text-primary-foreground" />
                    </div>
                  )}
                </button>

                {/* Delivery */}
                <button
                  onClick={handleDeliveryClick}
                  className={cn(
                    "flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all relative overflow-hidden",
                    purchaseType === "delivery"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40"
                  )}>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
                    purchaseType === "delivery" ? "bg-primary text-primary-foreground" : "bg-secondary")}>
                    <ConciergeBell size={18} />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm">Delivery Service</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Antar ke meja</p>
                  </div>
                  {/* Mobile-only badge */}
                  <span className="text-[9px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                    📱 Mobile Only
                  </span>
                </button>
              </div>

              {/* Pickup location selector */}
              {purchaseType === "pickup" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Pilih Lokasi Pickup</label>
                  <div className="relative">
                    <select value={pickupLocation} onChange={e => setPickupLocation(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring/30 appearance-none cursor-pointer">
                      {LOCATIONS.map(l => (
                        <option key={l.id} value={l.id}>{l.name} — {l.address}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                  {(() => {
                    const loc = LOCATIONS.find(l => l.id === pickupLocation);
                    return loc ? (
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground bg-secondary/60 rounded-xl px-3 py-2">
                        <Clock size={11} className="text-accent" /> Jam operasional: {loc.hours}
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>

            {/* 2. Payment Method */}
            <div className="bg-card rounded-2xl p-5 border border-border">
              <h2 className={sectionTitle} style={{ fontFamily: display }}>Metode Pembayaran</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                {([
                  { id: "card" as PaymentMethod, icon: CreditCard, label: "Kartu" },
                  { id: "transfer" as PaymentMethod, icon: Building2, label: "Transfer" },
                  { id: "gopay" as PaymentMethod, icon: Wallet, label: "GoPay" },
                  { id: "ovo" as PaymentMethod, icon: Wallet, label: "OVO" },
                  { id: "dana" as PaymentMethod, icon: Wallet, label: "DANA" },
                  { id: "cash" as PaymentMethod, icon: Package, label: "Tunai" },
                ] as const).map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 text-xs font-semibold transition-all",
                      payMethod === m.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                    )}>
                    <m.icon size={18} />
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Card form */}
              {payMethod === "card" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nama di Kartu</label>
                    <input value={cardName} onChange={e => setCardName(e.target.value)}
                      placeholder="NAMA LENGKAP" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nomor Kartu</label>
                    <div className="relative">
                      <input value={cardNumber}
                        onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="0000 0000 0000 0000" maxLength={19} className={inputCls} />
                      <CreditCard size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Berlaku Hingga</label>
                      <input value={cardExpiry} onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY" maxLength={5} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">CVV</label>
                      <input value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        placeholder="•••" maxLength={3} type="password" className={inputCls} />
                    </div>
                  </div>
                </div>
              )}

              {/* Transfer bank */}
              {payMethod === "transfer" && (
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Pilih Bank</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["BCA","Mandiri","BNI","BRI"].map(b => (
                      <button key={b} onClick={() => setSelectedBank(b)}
                        className={cn("py-2.5 rounded-xl border-2 text-sm font-bold transition-all",
                          selectedBank === b ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/30")}>
                        {b}
                      </button>
                    ))}
                  </div>
                  <div className="bg-secondary/60 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Nomor Virtual Account {selectedBank}</p>
                    <p className="font-bold text-lg tracking-widest" style={{ fontFamily: display }}>
                      {selectedBank === "BCA" ? "7855" : selectedBank === "Mandiri" ? "8885" : selectedBank === "BNI" ? "9885" : "1234"} 0000 {Math.floor(Math.random() * 9000 + 1000)}
                    </p>
                    <p className="text-xs text-muted-foreground">Bayar sebelum <span className="font-semibold text-foreground">24 jam</span> setelah pesanan dibuat</p>
                  </div>
                </div>
              )}

              {/* E-wallet */}
              {(payMethod === "gopay" || payMethod === "ovo" || payMethod === "dana") && (
                <div className="bg-secondary/60 rounded-xl p-4 flex flex-col items-center gap-3">
                  <div className="w-32 h-32 bg-white rounded-xl border border-border flex items-center justify-center">
                    <div className="grid grid-cols-7 gap-0.5">
                      {Array.from({ length: 49 }).map((_, i) => (
                        <div key={i} className={cn("w-3 h-3 rounded-sm",
                          [0,1,2,3,4,5,6,7,14,21,28,35,42,43,44,45,46,47,48,8,15,24,31,38,10,17,26,33,40].includes(i)
                            ? "bg-foreground" : "bg-white")} />
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">Scan QR {payMethod.toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">Buka aplikasi {payMethod.toUpperCase()} dan scan kode di atas</p>
                  </div>
                </div>
              )}

              {/* Cash */}
              {payMethod === "cash" && (
                <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Package size={14} className="text-amber-600" /> Bayar Tunai saat Pickup
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Siapkan uang pas atau kembalian akan diberikan oleh kasir kami.
                    Total yang harus dibayar: <span className="font-bold text-foreground">{formatRupiah(total)}</span>
                  </p>
                </div>
              )}
            </div>

            {/* 3. Billing info */}
            <div className="bg-card rounded-2xl p-5 border border-border">
              <h2 className={sectionTitle} style={{ fontFamily: display }}>Informasi Pemesan</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nama Lengkap</label>
                  <input value={billingName} onChange={e => setBillingName(e.target.value)}
                    placeholder="Nama pemesan" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nomor Telepon / WhatsApp</label>
                  <input value={billingPhone} onChange={e => setBillingPhone(e.target.value)}
                    placeholder="+62 8xx-xxxx-xxxx" type="tel" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email <span className="font-normal text-muted-foreground/60">(opsional)</span></label>
                  <input value={billingEmail} onChange={e => setBillingEmail(e.target.value)}
                    placeholder="email@contoh.com" type="email" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Catatan Pesanan <span className="font-normal text-muted-foreground/60">(opsional)</span></label>
                  <textarea value={orderNote} onChange={e => setOrderNote(e.target.value)}
                    placeholder="Contoh: tolong siapkan tas kertas, pesanan untuk acara, dll."
                    rows={2} className={cn(inputCls, "resize-none")} />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="space-y-4">
            <div className="bg-card rounded-2xl p-5 border border-border sticky top-32">
              <h2 className={sectionTitle} style={{ fontFamily: display }}>Ringkasan Pesanan</h2>

              {/* Items */}
              {cart.length === 0 ? (
                <div className="text-center py-6 mb-4">
                  <ShoppingBag size={28} className="mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">Keranjang kosong</p>
                </div>
              ) : (
                <div className="space-y-1 mb-4 max-h-72 overflow-y-auto -mx-1 px-1">
                  {cart.map(item => {
                    const p = PRODUCTS.find(x => x.id === item.productId);
                    if (!p) return null;
                    return (
                      <div key={item.productId} className="flex items-center gap-2.5 py-2.5 border-b border-border/50 last:border-0">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-amber-100 flex-shrink-0">
                          <img src={`https://images.unsplash.com/photo-${p.image}?w=80&h=80&fit=crop&auto=format`}
                            alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold leading-snug truncate">{p.name}</p>
                          {item.note && (
                            <p className="text-[10px] text-muted-foreground italic truncate mt-0.5">
                              <FileText size={8} className="inline mr-0.5" />{item.note}
                            </p>
                          )}
                          <p className="text-xs text-accent font-bold mt-0.5">{formatRupiah(p.price * item.quantity)}</p>
                        </div>
                        {/* Qty controls */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
                            className={cn(
                              "w-6 h-6 rounded-lg flex items-center justify-center transition-colors text-xs font-bold",
                              item.quantity === 1
                                ? "bg-red-50 text-red-400 hover:bg-red-100"
                                : "bg-secondary hover:bg-muted"
                            )}>
                            {item.quantity === 1 ? <Trash2 size={10} /> : <Minus size={10} />}
                          </button>
                          <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
                            className="w-6 h-6 rounded-lg bg-secondary hover:bg-muted flex items-center justify-center transition-colors">
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Promo code */}
              <div className="border-t border-border pt-4 mb-4">
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Kode Promo</label>
                <div className="flex gap-2">
                  <input value={promoCode} onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoError(""); setPromoApplied(false); }}
                    placeholder="SENIN30"
                    className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring/30 transition-all placeholder:text-muted-foreground/50" />
                  <button onClick={handleApplyPromo}
                    className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
                    Terapkan
                  </button>
                </div>
                {promoError && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertTriangle size={10} /> {promoError}</p>}
                {promoApplied && <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1"><Check size={10} /> Diskon 10% berhasil diterapkan!</p>}
              </div>

              {/* Price breakdown */}
              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({itemCount} item)</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pajak (10%)</span>
                  <span>{formatRupiah(tax)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Diskon Promo</span>
                    <span>-{formatRupiah(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-1">
                  <span>Total</span>
                  <span className="text-accent" style={{ fontFamily: display }}>{formatRupiah(total)}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => canPlaceOrder && setOrderPlaced(true)}
                disabled={!canPlaceOrder}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold text-base mt-4 flex items-center justify-center gap-2 transition-all",
                  canPlaceOrder
                    ? "bg-primary text-primary-foreground hover:opacity-90 shadow-md"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}>
                <Check size={17} /> Bayar Sekarang · {formatRupiah(total)}
              </button>
              {!canPlaceOrder && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Lengkapi informasi pemesan {payMethod === "card" ? "dan data kartu " : ""}untuk melanjutkan
                </p>
              )}

              {/* Security note */}
              <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-muted-foreground">
                <Info size={11} /> Pembayaran aman & terenkripsi
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeliveryWarn && (
        <DeliveryWarningModal
          onClose={() => setShowDeliveryWarn(false)}
          onUsePickup={() => { setPurchaseType("pickup"); setShowDeliveryWarn(false); }}
        />
      )}
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ onNavigate }: { onNavigate: (p: AppPage) => void }) {
  return (
    <footer className="bg-foreground text-primary-foreground mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Coffee size={15} className="text-primary-foreground" />
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: display }}>FluxFlow</span>
            </div>
            <p className="text-sm text-primary-foreground/55 leading-relaxed mb-4">
              Tempat terbaik untuk menikmati kopi, kuliner, dan kehangatan bersama.
            </p>
            <div className="flex gap-2">
              {[Instagram, Facebook, Mail].map((Icon, i) => (
                <button key={i} className="w-8 h-8 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Navigasi</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/55">
              {([["Beranda","beranda"],["Produk","produk"],["Reservasi","reservasi"]] as [string, AppPage][]).map(([label, p]) => (
                <li key={p}>
                  <button onClick={() => onNavigate(p)} className="hover:text-primary-foreground transition-colors">{label}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Lokasi</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/55">
              {LOCATIONS.map(l => <li key={l.id}>{l.name}</li>)}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Jam Operasional</h4>
            <ul className="space-y-1.5 text-sm text-primary-foreground/55">
              <li>Senin – Jumat: 07.00 – 22.00</li>
              <li>Sabtu – Minggu: 07.00 – 23.00</li>
              <li className="pt-2 text-primary-foreground/70">+62 21 5555-1000</li>
              <li className="text-primary-foreground/70">hello@fluxflow.id</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/35">
          <p>© 2024 FluxFlow. Semua hak dilindungi.</p>
          <p>Dibuat dengan cinta di Jakarta</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Auth Page ────────────────────────────────────────────────────────────────
function AuthPage({ onAuth }: { onAuth: (u: AuthUser) => void }) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPass) { setError("Mohon isi semua field"); return; }
    const raw = loginEmail.split("@")[0].replace(/[^a-zA-Z\s]/g, " ").trim();
    const name = raw.charAt(0).toUpperCase() + raw.slice(1) || "Pengguna";
    onAuth({ name, email: loginEmail, type: "member" });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPass || !regConfirm) { setError("Mohon isi semua field"); return; }
    if (regPass !== regConfirm) { setError("Password tidak cocok"); return; }
    if (regPass.length < 6) { setError("Password minimal 6 karakter"); return; }
    onAuth({ name: regName, email: regEmail, type: "member" });
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring/50 transition-all placeholder:text-muted-foreground/60";

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left panel */}
      <div className="hidden md:block relative">
        <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&h=1200&fit=crop&auto=format"
          alt="Interior FluxFlow Cafe" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/75 via-foreground/50 to-foreground/30" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-foreground/20 backdrop-blur-sm rounded-xl border border-primary-foreground/30 flex items-center justify-center">
              <Coffee size={18} className="text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary-foreground" style={{ fontFamily: display }}>FluxFlow</span>
          </div>
          <div>
            <div className="inline-block text-xs font-semibold tracking-widest uppercase text-accent bg-accent/20 border border-accent/30 px-3 py-1 rounded-full mb-4">
              Sejak 2016
            </div>
            <h2 className="text-3xl font-bold text-primary-foreground mb-3 leading-snug" style={{ fontFamily: display }}>
              Tempat di mana setiap momen menjadi kenangan.
            </h2>
            <p className="text-primary-foreground/65 text-sm leading-relaxed">
              Kopi premium, makanan lezat, dan suasana hangat menunggu Anda di setiap sudut FluxFlow.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col justify-center items-center px-6 py-12 bg-background">
        <div className="md:hidden flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <Coffee size={17} className="text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold" style={{ fontFamily: display }}>FluxFlow</span>
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: display }}>
            {tab === "login" ? "Selamat Datang Kembali" : "Buat Akun Baru"}
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            {tab === "login" ? "Masuk ke akun FluxFlow Anda" : "Bergabung dengan keluarga FluxFlow"}
          </p>

          <div className="flex bg-secondary rounded-2xl p-1 mb-6">
            {(["login","register"] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError(""); }}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                  tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}>
                {t === "login" ? "Masuk" : "Daftar"}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
              <span className="mt-0.5 text-red-400">⚠</span> {error}
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input type="email" value={loginEmail} placeholder="nama@email.com"
                  onChange={e => { setLoginEmail(e.target.value); setError(""); }}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <input type="password" value={loginPass} placeholder="••••••••"
                  onChange={e => { setLoginPass(e.target.value); setError(""); }}
                  className={inputClass} />
              </div>
              <button type="submit"
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all mt-1">
                Masuk
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Nama Lengkap</label>
                <input type="text" value={regName} placeholder="Nama Anda"
                  onChange={e => { setRegName(e.target.value); setError(""); }}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input type="email" value={regEmail} placeholder="nama@email.com"
                  onChange={e => { setRegEmail(e.target.value); setError(""); }}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <input type="password" value={regPass} placeholder="Minimal 6 karakter"
                  onChange={e => { setRegPass(e.target.value); setError(""); }}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Konfirmasi Password</label>
                <input type="password" value={regConfirm} placeholder="Ulangi password"
                  onChange={e => { setRegConfirm(e.target.value); setError(""); }}
                  className={inputClass} />
              </div>
              <button type="submit"
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all">
                Daftar Sekarang
              </button>
            </form>
          )}

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">atau</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button onClick={() => onAuth({ name: "Tamu", email: "", type: "non-member" })}
            className="w-full py-2.5 border-2 border-border rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-primary/30 transition-all">
            Lanjutkan sebagai Non-Member
          </button>
          <p className="text-xs text-muted-foreground/70 text-center mt-2.5 leading-relaxed">
            Non-Member tidak dapat mengakses fitur Reservasi
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Beranda Page ─────────────────────────────────────────────────────────────
function BerandaPage({ user, onNavigate }: { user: AuthUser; onNavigate: (p: AppPage) => void }) {
  const [activePromo, setActivePromo] = useState(0);

  return (
    <div className="pt-16 overflow-x-hidden">
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[520px] flex items-end pb-16 sm:items-center sm:pb-0">
        <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&h=900&fit=crop&auto=format"
          alt="Interior FluxFlow Cafe"
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/50 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
          <div className="max-w-xl">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-accent bg-accent/25 border border-accent/30 px-3 py-1 rounded-full mb-5">
              Selamat Datang di FluxFlow
            </span>
            <h1 className="text-5xl sm:text-6xl font-bold text-primary-foreground leading-[1.1] mb-5" style={{ fontFamily: display }}>
              Rasa yang Mengalir,<br /><em>Momen yang Berharga</em>
            </h1>
            <p className="text-primary-foreground/75 text-lg mb-8 leading-relaxed max-w-md">
              Nikmati kopi premium, kuliner pilihan, dan suasana hangat di setiap sudut FluxFlow.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => onNavigate("produk")}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-2xl font-semibold hover:opacity-90 transition-all shadow-lg">
                Lihat Menu <ArrowRight size={16} />
              </button>
              {user.type === "member" && (
                <button onClick={() => onNavigate("reservasi")}
                  className="flex items-center gap-2 bg-primary-foreground/15 backdrop-blur-sm text-primary-foreground border border-primary-foreground/25 px-7 py-3.5 rounded-2xl font-semibold hover:bg-primary-foreground/25 transition-all">
                  Buat Reservasi
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-primary text-primary-foreground py-5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-primary-foreground/15">
            {[
              { label: "Pelanggan Puas", value: "15.000+" },
              { label: "Menu Pilihan", value: "80+" },
              { label: "Cabang Aktif", value: "3" },
              { label: "Tahun Beroperasi", value: "8+" },
            ].map(stat => (
              <div key={stat.label} className="text-center px-4">
                <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: display }}>{stat.value}</p>
                <p className="text-xs text-primary-foreground/60 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promos */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-accent">Penawaran</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-1" style={{ fontFamily: display }}>Promo Spesial</h2>
          </div>
          <div className="flex gap-1.5 pb-1">
            {PROMOS.map((_, i) => (
              <button key={i} onClick={() => setActivePromo(i)}
                className={cn("h-2 rounded-full transition-all duration-300", i === activePromo ? "bg-primary w-6" : "bg-border w-2 hover:bg-muted-foreground/40")} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROMOS.map((promo, i) => (
            <div key={promo.id} onClick={() => setActivePromo(i)}
              className={cn(
                "relative overflow-hidden rounded-2xl cursor-pointer group transition-all duration-300",
                i === 0 ? "md:col-span-2 h-64" : "h-52",
                activePromo === i ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:shadow-lg"
              )}>
              <img
                src={`https://images.unsplash.com/photo-${promo.image}?w=800&h=400&fit=crop&auto=format`}
                alt={promo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-amber-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <span className="text-[10px] font-bold tracking-widest bg-accent text-primary-foreground px-2.5 py-0.5 rounded-full mb-2 inline-block uppercase">
                  {promo.badge}
                </span>
                <h3 className="text-white font-bold text-xl leading-tight" style={{ fontFamily: display }}>{promo.title}</h3>
                <p className="text-white/75 text-sm mt-1">{promo.subtitle}</p>
                <div className="mt-2.5 inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs px-2.5 py-1 rounded-lg">
                  <Tag size={10} /> Kode: <span className="font-bold">{promo.code}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-secondary/40 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-accent">Menu Kami</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-1" style={{ fontFamily: display }}>Menu Unggulan</h2>
            </div>
            <button onClick={() => onNavigate("produk")}
              className="flex items-center gap-1 text-sm text-accent hover:text-primary font-semibold transition-colors">
              Lihat Semua <ChevronRight size={15} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRODUCTS.slice(0, 4).map(p => (
              <div key={p.id} className="bg-card rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300 border border-border/60">
                <div className="relative overflow-hidden bg-amber-100 h-44">
                  <img src={`https://images.unsplash.com/photo-${p.image}?w=400&h=300&fit=crop&auto=format`}
                    alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2 left-2 text-[10px] bg-card/90 text-foreground px-2 py-0.5 rounded-full font-medium">{p.category}</span>
                </div>
                <div className="p-3.5">
                  <h3 className="font-semibold text-sm leading-snug">{p.name}</h3>
                  <StarRating rating={p.rating} small />
                  <p className="text-sm font-bold text-accent mt-1">{formatRupiah(p.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-accent">Tentang Kami</span>
            <h2 className="text-4xl font-bold mt-2 mb-5 leading-tight" style={{ fontFamily: display }}>
              Lebih dari Sekadar Kedai Kopi
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
              FluxFlow lahir dari kecintaan mendalam terhadap kopi dan kehangatan kebersamaan.
              Sejak 2016, kami telah menjadi tempat di mana cerita-cerita indah tercipta —
              dari pertemuan pertama hingga perayaan penting.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
              Setiap cangkir yang kami sajikan adalah hasil dari biji kopi pilihan petani lokal
              terbaik, diracik dengan penuh dedikasi oleh barista berpengalaman kami.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Coffee, text: "Biji Kopi Premium" },
                { icon: Heart, text: "Dibuat dengan Cinta" },
                { icon: Utensils, text: "Chef Berpengalaman" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm font-medium bg-secondary px-3 py-2 rounded-xl">
                  <Icon size={13} className="text-accent" /> {text}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=500&fit=crop&auto=format"
              alt="Kopi premium FluxFlow"
              className="rounded-2xl w-full object-cover h-80 md:h-96 bg-amber-100" />
            <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
                  <Star size={16} className="fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <p className="font-bold text-xl leading-none" style={{ fontFamily: display }}>4.9</p>
                  <p className="text-xs text-muted-foreground">Rating Pelanggan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="bg-secondary/40 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest uppercase text-accent">Temukan Kami</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-1" style={{ fontFamily: display }}>Lokasi Kami</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {LOCATIONS.map(loc => (
              <div key={loc.id} className="bg-card rounded-2xl overflow-hidden border border-border/60 hover:shadow-lg transition-all duration-300 group">
                <div className="relative h-44 overflow-hidden bg-amber-100">
                  <img src={`https://images.unsplash.com/photo-${loc.image}?w=500&h=300&fit=crop&auto=format`}
                    alt={loc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-base mb-1" style={{ fontFamily: display }}>{loc.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{loc.desc}</p>
                  <div className="space-y-1.5">
                    {[
                      { icon: MapPin, val: loc.address },
                      { icon: Clock, val: loc.hours },
                      { icon: Phone, val: loc.phone },
                    ].map(({ icon: Icon, val }) => (
                      <div key={val} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Icon size={11} className="text-accent mt-0.5 flex-shrink-0" /> {val}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest uppercase text-accent">Ulasan Pelanggan</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-1" style={{ fontFamily: display }}>Apa Kata Mereka</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-card rounded-2xl p-5 border border-border/60 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <div className="flex mt-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={10} className="fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Reservasi */}
      {user.type === "member" && (
        <section className="max-w-6xl mx-auto px-6 pb-4">
          <div className="relative rounded-3xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1400&h=450&fit=crop&auto=format"
              alt="Reservasi di FluxFlow" className="w-full h-64 object-cover bg-amber-100" />
            <div className="absolute inset-0 bg-foreground/65" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-3" style={{ fontFamily: display }}>
                Siap untuk Pengalaman Tak Terlupakan?
              </h2>
              <p className="text-primary-foreground/75 mb-6 max-w-md text-sm">
                Reservasi meja sekarang dan kami akan menyiapkan segalanya untuk Anda.
              </p>
              <button onClick={() => onNavigate("reservasi")}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-2xl font-semibold hover:opacity-90 transition-all shadow-lg">
                Reservasi Sekarang <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────
function FilterSidebar({ selectedCategory, onCategoryChange, priceMax, onPriceMaxChange }: {
  selectedCategory: string; onCategoryChange: (c: string) => void;
  priceMax: number; onPriceMaxChange: (v: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-3">Kategori</h3>
        <div className="space-y-0.5">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => onCategoryChange(cat)}
              className={cn(
                "w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-all",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground font-medium"
                  : "hover:bg-secondary text-foreground"
              )}>
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3">Harga Maksimum</h3>
        <input type="range" min={20000} max={100000} step={5000} value={priceMax}
          onChange={e => onPriceMaxChange(Number(e.target.value))}
          className="w-full accent-primary" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
          <span>Rp 20.000</span>
          <span className="font-semibold text-foreground">{formatRupiah(priceMax)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Produk Page ──────────────────────────────────────────────────────────────
function ProdukPage({ cart, onAddToCart, onUpdateQty, onRemove, onCartOpen }: {
  cart: CartItem[];
  onAddToCart: (id: number) => void;
  onUpdateQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  onCartOpen: () => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceMax, setPriceMax] = useState(100000);
  const [sortBy, setSortBy] = useState<"default"|"price-asc"|"price-desc"|"rating">("default");
  const [filterOpen, setFilterOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [addedFlash, setAddedFlash] = useState<number | null>(null);

  const getCartItem = (id: number) => cart.find(c => c.productId === id);
  const cartTotal = cart.reduce((sum, item) => {
    const p = PRODUCTS.find(x => x.id === item.productId);
    return sum + (p?.price ?? 0) * item.quantity;
  }, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const handleAdd = (id: number) => {
    onAddToCart(id);
    setAddedFlash(id);
    setTimeout(() => setAddedFlash(null), 1200);
  };

  const filtered = useMemo(() => {
    let r = PRODUCTS.filter(p =>
      (selectedCategory === "Semua" || p.category === selectedCategory) &&
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase())) &&
      p.price <= priceMax
    );
    if (sortBy === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [selectedCategory, searchQuery, priceMax, sortBy]);

  const toggleWishlist = (id: number) => {
    setWishlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="bg-secondary/50 border-b border-border py-10">
        <div className="max-w-6xl mx-auto px-6">
          <span className="text-xs font-bold tracking-widest uppercase text-accent">Menu</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-1" style={{ fontFamily: display }}>Produk & Menu Kami</h1>
          <p className="text-muted-foreground mt-2 text-sm">Temukan cita rasa terbaik dari {PRODUCTS.length} menu pilihan kami</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari menu..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-ring/30 transition-all" />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-ring/30 cursor-pointer hidden sm:block">
            <option value="default">Urutkan</option>
            <option value="price-asc">Harga Terendah</option>
            <option value="price-desc">Harga Tertinggi</option>
            <option value="rating">Rating Terbaik</option>
          </select>
          <button onClick={() => setFilterOpen(!filterOpen)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all md:hidden",
              filterOpen ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card"
            )}>
            <SlidersHorizontal size={14} /> Filter
          </button>
        </div>

        {/* Sticky cart summary bar */}
        {cartCount > 0 && (
          <button onClick={onCartOpen}
            className="w-full flex items-center justify-between bg-primary text-primary-foreground px-5 py-3.5 rounded-2xl mb-5 hover:opacity-95 transition-all shadow-md group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
                <ShoppingCart size={15} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold leading-none">{cartCount} item di keranjang</p>
                <p className="text-xs text-primary-foreground/70 mt-0.5">Tap untuk lihat & edit keranjang</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base" style={{ fontFamily: display }}>{formatRupiah(cartTotal)}</span>
              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        )}

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <div className="w-56 flex-shrink-0 hidden md:block">
            <FilterSidebar selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory}
              priceMax={priceMax} onPriceMaxChange={setPriceMax} />
          </div>

          {/* Mobile filter drawer */}
          {filterOpen && (
            <div className="md:hidden fixed inset-0 z-50">
              <div className="absolute inset-0 bg-foreground/30" onClick={() => setFilterOpen(false)} />
              <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-lg" style={{ fontFamily: display }}>Filter</h3>
                  <button onClick={() => setFilterOpen(false)} className="p-1.5 hover:bg-secondary rounded-lg"><X size={18} /></button>
                </div>
                <FilterSidebar selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory}
                  priceMax={priceMax} onPriceMaxChange={setPriceMax} />
                <button onClick={() => setFilterOpen(false)}
                  className="w-full mt-5 py-3 bg-primary text-primary-foreground rounded-xl font-semibold">
                  Terapkan ({filtered.length} produk)
                </button>
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-5">
              Menampilkan <span className="font-semibold text-foreground">{filtered.length}</span> produk
            </p>

            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <Coffee size={44} className="mx-auto text-muted-foreground/25 mb-3" />
                <p className="text-muted-foreground">Tidak ada produk yang sesuai filter.</p>
                <button onClick={() => { setSelectedCategory("Semua"); setSearchQuery(""); setPriceMax(100000); }}
                  className="mt-3 text-accent text-sm hover:underline font-medium">Reset filter</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map(product => {
                  const cartItem = getCartItem(product.id);
                  const inCart = !!cartItem;
                  const isFlash = addedFlash === product.id;
                  return (
                    <div key={product.id}
                      className={cn(
                        "bg-card rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300 border-2",
                        inCart ? "border-accent/40 shadow-sm" : "border-border/60"
                      )}>
                      <div className="relative overflow-hidden bg-amber-100 h-44">
                        <img src={`https://images.unsplash.com/photo-${product.image}?w=400&h=300&fit=crop&auto=format`}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {/* Wishlist */}
                        <button onClick={() => toggleWishlist(product.id)}
                          className="absolute top-2 right-2 w-7 h-7 bg-card/90 rounded-full flex items-center justify-center hover:bg-card shadow-sm transition-all">
                          <Heart size={13} className={wishlist.has(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
                        </button>
                        <span className="absolute top-2 left-2 text-[10px] bg-card/90 px-2 py-0.5 rounded-full font-medium">{product.category}</span>
                        {/* In-cart badge */}
                        {inCart && (
                          <div className="absolute bottom-2 left-2 bg-accent text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {cartItem.quantity} di keranjang
                          </div>
                        )}
                      </div>
                      <div className="p-3.5">
                        <h3 className="font-semibold text-sm leading-snug">{product.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{product.desc}</p>
                        <div className="flex items-center justify-between mt-2">
                          <StarRating rating={product.rating} small />
                          <span className="text-xs text-muted-foreground">{product.reviews} ulasan</span>
                        </div>
                        <div className="flex items-center justify-between mt-2.5">
                          <span className="font-bold text-sm text-accent">{formatRupiah(product.price)}</span>
                          {/* Cart controls */}
                          {inCart ? (
                            <div className="flex items-center gap-1 bg-secondary rounded-xl p-0.5">
                              <button
                                onClick={() => onUpdateQty(product.id, cartItem.quantity - 1)}
                                className="w-7 h-7 rounded-lg bg-card flex items-center justify-center hover:bg-background shadow-sm transition-colors">
                                <Minus size={11} />
                              </button>
                              <span className="w-6 text-center text-sm font-bold">{cartItem.quantity}</span>
                              <button
                                onClick={() => onUpdateQty(product.id, cartItem.quantity + 1)}
                                className="w-7 h-7 rounded-lg bg-card flex items-center justify-center hover:bg-background shadow-sm transition-colors">
                                <Plus size={11} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAdd(product.id)}
                              className={cn(
                                "text-xs px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1",
                                isFlash
                                  ? "bg-green-500 text-white scale-95"
                                  : "bg-primary text-primary-foreground hover:opacity-90"
                              )}>
                              {isFlash ? <><Check size={11} /> Ditambahkan!</> : <><Plus size={11} /> Keranjang</>}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reservasi Page ───────────────────────────────────────────────────────────
interface ResState {
  locationId: number | null; date: Date | null; partySize: number;
  timeSlot: string; name: string; phone: string; notes: string;
}

function ReservasiPage({ user }: { user: AuthUser }) {
  const [step, setStep] = useState(1);
  const [bookingRef] = useState(() => Math.random().toString(36).slice(2, 9).toUpperCase());
  const [res, setRes] = useState<ResState>({
    locationId: null, date: null, partySize: 2,
    timeSlot: "", name: user.name !== "Tamu" ? user.name : "", phone: "", notes: "",
  });

  const selectedLoc = LOCATIONS.find(l => l.id === res.locationId);

  const formatDateFull = (d: Date) =>
    d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const STEPS = [
    { n: 1, label: "Pilih Lokasi" },
    { n: 2, label: "Tanggal & Waktu" },
    { n: 3, label: "Detail Tamu" },
    { n: 4, label: "Konfirmasi" },
  ];

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-primary-foreground/55">Reservasi Meja</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-1" style={{ fontFamily: display }}>Buat Reservasi Anda</h1>
          <p className="text-primary-foreground/60 mt-2 text-sm">Kami siap menyambut Anda dengan layanan terbaik</p>

          {/* Step indicator */}
          <div className="flex items-start justify-center mt-8 gap-0">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex items-start">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2",
                    step > s.n ? "bg-accent border-accent text-primary-foreground" :
                    step === s.n ? "bg-primary-foreground border-primary-foreground text-primary" :
                    "bg-transparent border-primary-foreground/25 text-primary-foreground/40"
                  )}>
                    {step > s.n ? <Check size={16} /> : s.n}
                  </div>
                  <span className={cn(
                    "text-[10px] mt-1.5 font-medium w-16 text-center leading-tight hidden sm:block",
                    step === s.n ? "text-primary-foreground" : "text-primary-foreground/40"
                  )}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn(
                    "h-0.5 w-12 sm:w-20 mx-1 mt-5 transition-all",
                    step > s.n ? "bg-accent" : "bg-primary-foreground/20"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Step 1 – Pilih Lokasi */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: display }}>Pilih Lokasi Cafe</h2>
            <p className="text-muted-foreground text-sm mb-6">Pilih cabang FluxFlow yang ingin Anda kunjungi</p>
            <div className="space-y-4">
              {LOCATIONS.map(loc => (
                <button key={loc.id} onClick={() => setRes(r => ({ ...r, locationId: loc.id }))}
                  className={cn(
                    "w-full text-left rounded-2xl overflow-hidden border-2 transition-all group",
                    res.locationId === loc.id ? "border-primary shadow-md" : "border-border hover:border-primary/40 hover:shadow-sm"
                  )}>
                  <div className="flex">
                    <div className="relative w-32 sm:w-52 flex-shrink-0 bg-amber-100">
                      <img src={`https://images.unsplash.com/photo-${loc.image}?w=300&h=220&fit=crop&auto=format`}
                        alt={loc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 min-h-[120px]" />
                    </div>
                    <div className="flex-1 p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-base" style={{ fontFamily: display }}>{loc.name}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">{loc.desc}</p>
                        </div>
                        {res.locationId === loc.id && (
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check size={12} className="text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="mt-3 space-y-1.5">
                        {[
                          { icon: MapPin, val: loc.address },
                          { icon: Clock, val: loc.hours },
                          { icon: Users, val: `Kapasitas: ${loc.capacity}` },
                        ].map(({ icon: Icon, val }) => (
                          <div key={val} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Icon size={11} className="text-accent flex-shrink-0" /> {val}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button onClick={() => res.locationId && setStep(2)} disabled={!res.locationId}
                className={cn(
                  "flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold transition-all",
                  res.locationId ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"
                )}>
                Lanjutkan <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 – Tanggal & Waktu */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: display }}>Pilih Tanggal & Waktu</h2>
            <p className="text-muted-foreground text-sm mb-6">Kapan Anda ingin datang ke <span className="font-medium text-foreground">{selectedLoc?.name}</span>?</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5">
                {/* Party size */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Jumlah Tamu</label>
                  <div className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3 w-fit">
                    <button onClick={() => setRes(r => ({ ...r, partySize: Math.max(1, r.partySize - 1) }))}
                      className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center hover:bg-muted transition-colors text-lg font-bold leading-none">−</button>
                    <div className="flex items-center gap-2 min-w-[64px] justify-center">
                      <Users size={14} className="text-accent" />
                      <span className="font-bold text-xl" style={{ fontFamily: display }}>{res.partySize}</span>
                    </div>
                    <button onClick={() => setRes(r => ({ ...r, partySize: Math.min(20, r.partySize + 1) }))}
                      className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center hover:bg-muted transition-colors text-lg font-bold leading-none">+</button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">Maksimal 20 tamu per reservasi</p>
                </div>

                {/* Calendar */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Pilih Tanggal</label>
                  <MiniCalendar selected={res.date} onSelect={d => setRes(r => ({ ...r, date: d, timeSlot: "" }))} />
                </div>
              </div>

              {/* Time slots */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Pilih Jam{res.date && (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      {res.date.toLocaleDateString("id-ID", { day: "numeric", month: "long" })}
                    </span>
                  )}
                </label>
                {!res.date ? (
                  <div className="bg-secondary/50 rounded-2xl p-8 text-center border border-border">
                    <Calendar size={32} className="mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">Pilih tanggal terlebih dahulu untuk melihat ketersediaan waktu</p>
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-2xl p-4">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {TIME_SLOTS.map(slot => {
                        const busy = UNAVAILABLE.has(slot);
                        const sel = res.timeSlot === slot;
                        return (
                          <button key={slot} disabled={busy} onClick={() => !busy && setRes(r => ({ ...r, timeSlot: slot }))}
                            className={cn(
                              "py-2 rounded-xl text-xs font-medium transition-all",
                              busy && "bg-muted/40 text-muted-foreground/30 cursor-not-allowed line-through",
                              sel && "bg-primary text-primary-foreground shadow-sm",
                              !busy && !sel && "bg-secondary hover:bg-primary/15 cursor-pointer"
                            )}>
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-4 mt-3.5 pt-3 border-t border-border text-xs text-muted-foreground">
                      {[
                        { color: "bg-secondary", label: "Tersedia" },
                        { color: "bg-muted/50", label: "Penuh" },
                        { color: "bg-primary", label: "Dipilih" },
                      ].map(({ color, label }) => (
                        <div key={label} className="flex items-center gap-1.5">
                          <div className={cn("w-3 h-3 rounded", color)} /> {label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button onClick={() => setStep(1)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-border text-sm font-semibold hover:bg-secondary transition-all">
                <ChevronLeft size={16} /> Kembali
              </button>
              <button onClick={() => (res.date && res.timeSlot) && setStep(3)}
                disabled={!res.date || !res.timeSlot}
                className={cn(
                  "flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold transition-all",
                  (res.date && res.timeSlot) ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"
                )}>
                Lanjutkan <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 – Detail Tamu */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: display }}>Detail Tamu</h2>
            <p className="text-muted-foreground text-sm mb-6">Lengkapi informasi untuk konfirmasi reservasi</p>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Nama Lengkap</label>
                  <input type="text" value={res.name} placeholder="Nama pemesan"
                    onChange={e => setRes(r => ({ ...r, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-ring/30 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Nomor Telepon / WhatsApp</label>
                  <input type="tel" value={res.phone} placeholder="+62 8xx-xxxx-xxxx"
                    onChange={e => setRes(r => ({ ...r, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-ring/30 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Permintaan Khusus <span className="font-normal text-muted-foreground">(opsional)</span>
                  </label>
                  <textarea value={res.notes} rows={4}
                    placeholder="Contoh: kursi dekat jendela, perayaan ulang tahun, kursi bayi, dll."
                    onChange={e => setRes(r => ({ ...r, notes: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-ring/30 transition-all resize-none" />
                </div>
              </div>

              {/* Summary card */}
              <div className="bg-secondary/60 rounded-2xl p-5 border border-border h-fit">
                <h3 className="font-semibold text-sm mb-4" style={{ fontFamily: display }}>Ringkasan</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { icon: MapPin, label: selectedLoc?.name, sub: selectedLoc?.address },
                    { icon: Calendar, label: res.date ? formatDateFull(res.date) : "-" },
                    { icon: Clock, label: res.timeSlot ? `${res.timeSlot} WIB` : "-" },
                    { icon: Users, label: `${res.partySize} Tamu` },
                  ].map(({ icon: Icon, label, sub }) => (
                    <div key={String(label)} className="flex items-start gap-2.5">
                      <Icon size={13} className="text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-xs leading-snug">{label}</p>
                        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-border text-sm font-semibold hover:bg-secondary transition-all">
                <ChevronLeft size={16} /> Kembali
              </button>
              <button onClick={() => (res.name.trim() && res.phone.trim()) && setStep(4)}
                disabled={!res.name.trim() || !res.phone.trim()}
                className={cn(
                  "flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold transition-all",
                  (res.name.trim() && res.phone.trim()) ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"
                )}>
                Konfirmasi Reservasi <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4 – Konfirmasi */}
        {step === 4 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-green-200">
              <Check size={36} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: display }}>Reservasi Berhasil!</h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
              Terima kasih, <span className="font-semibold text-foreground">{res.name}</span>. Konfirmasi akan dikirim ke {res.phone} dalam waktu singkat.
            </p>

            <div className="bg-card border border-border rounded-2xl p-6 text-left max-w-md mx-auto mb-6 shadow-sm">
              <div className="flex items-start justify-between mb-4 gap-3">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Nomor Reservasi</p>
                  <p className="font-bold text-2xl tracking-wide mt-0.5" style={{ fontFamily: display }}>#{bookingRef}</p>
                </div>
                <span className="bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                  Terkonfirmasi
                </span>
              </div>

              <div className="space-y-3.5 border-t border-border pt-4">
                {[
                  { icon: MapPin, label: "Lokasi", value: selectedLoc?.name, sub: selectedLoc?.address },
                  { icon: Calendar, label: "Tanggal", value: res.date ? formatDateFull(res.date) : "" },
                  { icon: Clock, label: "Jam", value: `${res.timeSlot} WIB` },
                  { icon: Users, label: "Tamu", value: `${res.partySize} Orang` },
                  { icon: Phone, label: "Kontak", value: res.phone },
                  ...(res.notes ? [{ icon: Info, label: "Permintaan Khusus", value: res.notes }] : []),
                ].map(({ icon: Icon, label, value, sub }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-medium mt-0.5">{value}</p>
                      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-6 max-w-xs mx-auto leading-relaxed">
              Harap datang 5–10 menit sebelum waktu reservasi. Reservasi akan ditahan selama 15 menit.
            </p>

            <button
              onClick={() => {
                setStep(1);
                setRes({ locationId: null, date: null, partySize: 2, timeSlot: "", name: user.name !== "Tamu" ? user.name : "", phone: "", notes: "" });
              }}
              className="bg-primary text-primary-foreground px-10 py-3.5 rounded-2xl font-semibold hover:opacity-90 transition-all">
              Buat Reservasi Baru
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Member Gate Modal ────────────────────────────────────────────────────────
function MemberGateModal({ onClose, onLogin }: { onClose: () => void; onLogin: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-border">
        <div className="w-16 h-16 bg-amber-50 border-4 border-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Coffee size={26} className="text-amber-700" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2" style={{ fontFamily: display }}>Fitur Member Eksklusif</h2>
        <p className="text-muted-foreground text-sm text-center mb-6 leading-relaxed">
          Fitur Reservasi hanya tersedia untuk Member FluxFlow. Silakan login atau daftar untuk menikmati layanan reservasi kami.
        </p>
        <div className="space-y-2.5">
          <button onClick={onLogin}
            className="w-full py-3 bg-primary text-primary-foreground rounded-2xl font-semibold hover:opacity-90 transition-all">
            Login sebagai Member
          </button>
          <button onClick={onClose}
            className="w-full py-3 border-2 border-border rounded-2xl text-sm font-semibold hover:bg-secondary transition-all">
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [page, setPage] = useState<AppPage>("auth");
  const [showGate, setShowGate] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const navigate = (p: AppPage) => {
    if (p === "reservasi" && user?.type === "non-member") { setShowGate(true); return; }
    setPage(p);
    setCartOpen(false);
  };

  const addToCart = (productId: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId, quantity: 1, note: "" }];
    });
  };

  const updateQty = (productId: number, qty: number) => {
    if (qty <= 0) { setCart(prev => prev.filter(i => i.productId !== productId)); return; }
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity: qty } : i));
  };

  const updateNote = (productId: number, note: string) => {
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, note } : i));
  };

  const removeFromCart = (productId: number) => setCart(prev => prev.filter(i => i.productId !== productId));
  const clearCart = () => setCart([]);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  if (!user) return <AuthPage onAuth={u => { setUser(u); setPage("beranda"); }} />;

  // PaymentPage fills the whole screen (no Navbar/Footer overlay needed)
  if (page === "pembayaran") {
    return (
      <>
        <Navbar
          user={user} page={page}
          onNavigate={navigate}
          onLogout={() => { setUser(null); setPage("auth"); setCart([]); }}
          cartCount={cartCount}
          onCartOpen={() => setCartOpen(true)}
        />
        <PaymentPage
          cart={cart} user={user}
          onSuccess={() => { clearCart(); navigate("produk"); }}
          onBack={() => navigate("produk")}
          onUpdateQty={updateQty}
        />
        <CartDrawer
          cart={cart} open={cartOpen}
          onClose={() => setCartOpen(false)}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
          onClear={clearCart}
          onUpdateNote={updateNote}
          onCheckout={() => navigate("pembayaran")}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar
        user={user} page={page}
        onNavigate={navigate}
        onLogout={() => { setUser(null); setPage("auth"); setCart([]); }}
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
      />
      {page === "beranda" && <BerandaPage user={user} onNavigate={navigate} />}
      {page === "produk" && (
        <ProdukPage
          cart={cart}
          onAddToCart={addToCart}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
          onCartOpen={() => setCartOpen(true)}
        />
      )}
      {page === "reservasi" && <ReservasiPage user={user} />}
      <Footer onNavigate={navigate} />
      <CartDrawer
        cart={cart} open={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onClear={clearCart}
        onUpdateNote={updateNote}
        onCheckout={() => navigate("pembayaran")}
      />
      {showGate && <MemberGateModal onClose={() => setShowGate(false)} onLogin={() => { setShowGate(false); setUser(null); setPage("auth"); }} />}
    </div>
  );
}
