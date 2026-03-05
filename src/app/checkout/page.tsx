"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCartStore, selectSubtotal } from "@/store/cartStore";
import FreeShippingProgress from "@/components/FreeShippingProgress";
import { formatPriceKM } from "@/lib/formatPrice";
import { copy } from "@/lib/copy";
import { trackBeginCheckout } from "@/lib/analytics";

/* ─── Types ─────────────────────────────────────────────────────────────────── */

type DeliveryMethod = "standard" | "express";
type PaymentMethod = "pouzecem" | "karticom";

interface FormData {
  ime: string; telefon: string; email: string; grad: string;
  adresa: string; postanski: string; napomena: string;
}
interface CardData { broj: string; datum: string; cvc: string; }
type Errors = Partial<Record<keyof FormData, string>>;

/* ─── Constants ─────────────────────────────────────────────────────────────── */

const FREE_SHIPPING = 150;
const BASE_SHIPPING = 9;
const EXPRESS_SURCHARGE = 5;

const REQUIRED: (keyof FormData)[] = ["ime", "telefon", "grad", "adresa"];
const ERROR_MSG = "Ovo polje je obavezno.";

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

function formatCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}
function formatCvc(v: string) { return v.replace(/\D/g, "").slice(0, 4); }

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function CheckoutPage() {
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [success, setSuccess] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  /* Hydrate store on mount */
  useEffect(() => {
    useCartStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  /* Track begin_checkout once after hydration */
  const checkoutTracked = useRef(false);
  useEffect(() => {
    if (!hydrated || checkoutTracked.current) return;
    const s = useCartStore.getState();
    if (s.items.length === 0) return;
    checkoutTracked.current = true;
    const sub = selectSubtotal(s);
    const ship = sub >= FREE_SHIPPING ? 0 : BASE_SHIPPING;
    trackBeginCheckout(s.items, sub + ship);
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore(selectSubtotal);

  /* Step 1 */
  const [form, setForm] = useState<FormData>({ ime: "", telefon: "", email: "", grad: "", adresa: "", postanski: "", napomena: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [delivery, setDelivery] = useState<DeliveryMethod>("standard");

  /* Step 2 */
  const [payment, setPayment] = useState<PaymentMethod>("pouzecem");
  const [card, setCard] = useState<CardData>({ broj: "", datum: "", cvc: "" });
  const [cardErrors, setCardErrors] = useState<Partial<CardData>>({});

  /* Calculations */
  const shippingBase = subtotal >= FREE_SHIPPING ? 0 : BASE_SHIPPING;
  const shippingExtra = delivery === "express" ? EXPRESS_SURCHARGE : 0;
  const shipping = shippingBase + shippingExtra;
  const total = subtotal + shipping;

  /* ── Validation ── */
  const validateStep1 = (): boolean => {
    const e: Errors = {};
    REQUIRED.forEach((k) => { if (!form[k].trim()) e[k] = ERROR_MSG; });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    if (payment !== "karticom") return true;
    const e: Partial<CardData> = {};
    if (card.broj.replace(/\s/g, "").length < 16) e.broj = ERROR_MSG;
    if (card.datum.length < 5) e.datum = ERROR_MSG;
    if (card.cvc.length < 3) e.cvc = ERROR_MSG;
    setCardErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validateStep1()) setStep(2); };
  const handleConfirm = () => { if (validateStep2()) { clearCart(); setSuccess(true); } };

  const setField = (k: keyof FormData, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  /* ── Input component ── */
  const Field = ({
    label, id, type = "text", value, onChange, error, placeholder, required, textarea, rows,
  }: {
    label: string; id: keyof FormData; type?: string; value: string;
    onChange: (v: string) => void; error?: string; placeholder?: string;
    required?: boolean; textarea?: boolean; rows?: number;
  }) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[#F4F4F2]/70 text-xs uppercase tracking-[0.15em] font-medium">
        {label}{required && <span className="text-[#B89F5B] ml-0.5">*</span>}
      </label>
      {textarea ? (
        <textarea
          id={id} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} rows={rows ?? 3}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full bg-[#1A1A1A] text-[#F4F4F2] placeholder-[#F4F4F2]/20 text-sm tracking-wide px-4 py-3 border outline-none resize-none transition-colors duration-200 focus:border-[#B89F5B] focus:ring-1 focus:ring-[#B89F5B] ${error ? "border-red-500/50" : "border-[#F4F4F2]/10 hover:border-[#F4F4F2]/20"}`}
        />
      ) : (
        <input
          id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} autoComplete="off"
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full bg-[#1A1A1A] text-[#F4F4F2] placeholder-[#F4F4F2]/20 text-sm tracking-wide px-4 py-3 border outline-none transition-colors duration-200 focus:border-[#B89F5B] focus:ring-1 focus:ring-[#B89F5B] ${error ? "border-red-500/50" : "border-[#F4F4F2]/10 hover:border-[#F4F4F2]/20"}`}
        />
      )}
      {error && <p id={`${id}-error`} role="alert" className="text-red-400/70 text-xs tracking-wide">{error}</p>}
    </div>
  );

  /* ── Order summary ── */
  const OrderSummary = ({ sidebar = false }: { sidebar?: boolean }) => (
    <div className={sidebar ? "p-6" : "px-5 pb-5 pt-4"}>
      {/* Free shipping progress */}
      <div className="mb-5 pb-4 border-b border-[#F4F4F2]/8">
        <FreeShippingProgress subtotalKM={subtotal} />
      </div>

      {/* Items */}
      <div className="flex flex-col gap-3 mb-5">
        {items.map((item) => (
          <div key={`${item.slug}__${item.size}__${item.color}`} className="flex items-center gap-3">
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} className="w-12 h-14 object-cover" loading="lazy" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#B89F5B] text-[#0E0E0E] text-[9px] font-bold flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#F4F4F2] text-xs font-medium tracking-wide truncate">{item.name}</p>
            </div>
            <span className="shrink-0 text-[#F4F4F2] text-xs font-semibold">{formatPriceKM(item.priceKM * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-[#F4F4F2]/8 pt-4 flex flex-col gap-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-[#F4F4F2]/45 tracking-wide">{copy.checkout.subtotal}</span>
          <span className="text-[#F4F4F2]">{formatPriceKM(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#F4F4F2]/45 tracking-wide">{copy.checkout.shipping}</span>
          {shipping === 0
            ? <span className="text-[#B89F5B] text-xs font-semibold">Besplatno</span>
            : <span className="text-[#F4F4F2]">{formatPriceKM(shipping)}</span>}
        </div>
        <div className="border-t border-[#F4F4F2]/8 pt-3 flex justify-between items-baseline">
          <span className="text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.12em]">{copy.checkout.total}</span>
          <span className="text-[#F4F4F2] text-lg font-bold">
            {formatPriceKM(total)}
          </span>
        </div>
      </div>
    </div>
  );

  /* ─── Hydration guard ── */
  if (!hydrated) return <div className="min-h-screen bg-[#0E0E0E]" />;

  /* ─── Success state ── */
  if (success) return (
    <div className="min-h-screen bg-[#0E0E0E] flex flex-col items-center justify-center px-5 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#B89F5B]/15">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B89F5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <p className="text-[#B89F5B] text-xs tracking-[0.25em] uppercase font-medium mb-3">— Hvala!</p>
      <h1 className="text-[#F4F4F2] text-2xl md:text-3xl font-bold uppercase tracking-widest mb-4">
        Narudžba je zaprimljena
      </h1>
      <p className="text-[#F4F4F2]/50 text-sm font-light tracking-wide leading-relaxed max-w-sm mb-8">
        Hvala! Poslat ćemo vam potvrdu i detalje dostave.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 bg-[#F4F4F2] text-[#0E0E0E] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:bg-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
      >
        Nazad na shop
      </Link>
    </div>
  );

  /* ─── Main checkout ── */
  return (
    <div className="min-h-screen bg-[#0E0E0E]">
      <main className="pt-20 md:pt-24 pb-10">
        {/* Header */}
        <div className="px-5 md:px-10 lg:px-16 py-6 md:py-8 border-b border-[#F4F4F2]/8">
          <Link href="/" className="text-[#F4F4F2] text-sm font-bold uppercase tracking-[0.3em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]">
            KEM JEANS
          </Link>
        </div>

        <div className="px-5 md:px-10 lg:px-16 py-8 md:flex md:gap-10 lg:gap-16 items-start">

          {/* ── Left: Form ── */}
          <div className="flex-1 min-w-0">

            {/* Stepper */}
            <div className="flex items-center gap-0 mb-8" role="tablist" aria-label="Koraci checkout-a">
              {(["Podaci", "Plaćanje"] as const).map((label, i) => {
                const n = (i + 1) as 1 | 2;
                const active = step === n;
                const done = step > n;
                return (
                  <div key={label} className="flex items-center">
                    <div className="flex items-center gap-2.5">
                      <span className={`flex h-7 w-7 items-center justify-center text-xs font-bold border transition-all duration-300 ${
                        done ? "bg-[#B89F5B] border-[#B89F5B] text-[#0E0E0E]"
                        : active ? "border-[#F4F4F2] text-[#F4F4F2]"
                        : "border-[#F4F4F2]/20 text-[#F4F4F2]/30"
                      }`}>
                        {done ? "✓" : n}
                      </span>
                      <span className={`text-xs uppercase tracking-[0.15em] font-medium transition-colors duration-300 ${active ? "text-[#F4F4F2]" : done ? "text-[#B89F5B]" : "text-[#F4F4F2]/30"}`}>
                        {label}
                      </span>
                    </div>
                    {i < 1 && <span className="mx-4 h-px w-8 md:w-12 bg-[#F4F4F2]/15" aria-hidden="true" />}
                  </div>
                );
              })}
            </div>

            {/* Mobile: collapsible summary */}
            <div className="md:hidden bg-[#1A1A1A] border border-[#F4F4F2]/8 mb-6">
              <button
                onClick={() => setSummaryOpen((v) => !v)}
                aria-expanded={summaryOpen}
                aria-controls="mobile-summary"
                className="flex items-center justify-between w-full px-5 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B89F5B]"
              >
                <div className="flex items-center gap-2 text-[#F4F4F2]/70 text-xs tracking-wide">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  Prikaži sažetak
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"
                    className={`transition-transform duration-200 ${summaryOpen ? "rotate-180" : ""}`}>
                    <path d="M2 4l4 4 4-4"/>
                  </svg>
                </div>
                <span className="text-[#F4F4F2] text-sm font-bold">{formatPriceKM(total)}</span>
              </button>
              <div
                id="mobile-summary"
                className={`overflow-hidden transition-all duration-300 ease-out ${summaryOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="border-t border-[#F4F4F2]/8">
                  <OrderSummary />
                </div>
              </div>
            </div>

            {/* ── STEP 1: Podaci ── */}
            {step === 1 && (
              <section aria-labelledby="step1-heading">
                <h1 id="step1-heading" className="text-[#F4F4F2] text-xl font-bold uppercase tracking-widest mb-6">
                  Podaci za dostavu
                </h1>

                <div className="flex flex-col gap-4 mb-8">
                  <Field label="Ime i prezime" id="ime" value={form.ime} onChange={(v) => setField("ime", v)} error={errors.ime} placeholder="Npr. Adnan Kovačević" required />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Telefon" id="telefon" type="tel" value={form.telefon} onChange={(v) => setField("telefon", v)} error={errors.telefon} placeholder="+387 61 000 000" required />
                    <Field label="Email (opcionalno)" id="email" type="email" value={form.email} onChange={(v) => setField("email", v)} placeholder="adnan@email.com" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Grad" id="grad" value={form.grad} onChange={(v) => setField("grad", v)} error={errors.grad} placeholder="Sarajevo" required />
                    <Field label="Poštanski broj (opcionalno)" id="postanski" value={form.postanski} onChange={(v) => setField("postanski", v)} placeholder="71000" />
                  </div>
                  <Field label="Adresa" id="adresa" value={form.adresa} onChange={(v) => setField("adresa", v)} error={errors.adresa} placeholder="Ulica i broj" required />
                  <Field label="Napomena (opcionalno)" id="napomena" value={form.napomena} onChange={(v) => setField("napomena", v)} placeholder="Posebne napomene za dostavu..." textarea />
                </div>

                {/* Delivery method */}
                <div className="mb-8">
                  <p className="text-[#F4F4F2]/70 text-xs uppercase tracking-[0.15em] font-medium mb-3">
                    Način dostave
                  </p>
                  <fieldset className="flex flex-col gap-3" aria-label="Odaberi način dostave">
                    <legend className="sr-only">Način dostave</legend>
                    {([
                      { value: "standard", label: "Standardna dostava (1–3 radna dana)", price: shippingBase === 0 ? "Besplatno" : `${BASE_SHIPPING} KM` },
                      { value: "express", label: "Brza dostava (24–48h)", price: `${(shippingBase === 0 ? 0 : BASE_SHIPPING) + EXPRESS_SURCHARGE} KM` },
                    ] as { value: DeliveryMethod; label: string; price: string }[]).map((opt) => (
                      <label
                        key={opt.value}
                        htmlFor={`delivery-${opt.value}`}
                        className={`flex items-center justify-between gap-3 p-4 border cursor-pointer transition-all duration-200 ${
                          delivery === opt.value ? "border-[#B89F5B] bg-[#B89F5B]/8" : "border-[#F4F4F2]/10 bg-[#1A1A1A] hover:border-[#F4F4F2]/25"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio" id={`delivery-${opt.value}`} name="delivery"
                            value={opt.value} checked={delivery === opt.value}
                            onChange={() => setDelivery(opt.value)}
                            className="accent-[#B89F5B] w-4 h-4 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
                          />
                          <span className="text-[#F4F4F2] text-sm tracking-wide">{opt.label}</span>
                        </div>
                        <span className={`text-xs font-semibold tracking-wide ${delivery === opt.value ? "text-[#B89F5B]" : "text-[#F4F4F2]/50"}`}>
                          {opt.price}
                        </span>
                      </label>
                    ))}
                  </fieldset>
                </div>

                {items.length === 0 ? (
                  <div className="w-full py-4 text-center text-[#F4F4F2]/40 text-xs tracking-wide border border-[#F4F4F2]/10">
                    Korpa je prazna.{" "}
                    <Link href="/shop" className="text-[#B89F5B] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89F5B]">
                      Nastavite kupovinu
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleNext}
                    className="w-full py-4 bg-[#F4F4F2] text-[#0E0E0E] text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
                  >
                    Nastavi na plaćanje
                  </button>
                )}
              </section>
            )}

            {/* ── STEP 2: Plaćanje ── */}
            {step === 2 && (
              <section aria-labelledby="step2-heading">
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setStep(1)}
                    aria-label="Nazad na podatke"
                    className="text-[#F4F4F2]/40 hover:text-[#F4F4F2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M19 12H5M12 5l-7 7 7 7"/>
                    </svg>
                  </button>
                  <h1 id="step2-heading" className="text-[#F4F4F2] text-xl font-bold uppercase tracking-widest">
                    Način plaćanja
                  </h1>
                </div>

                {/* Delivery recap */}
                <div className="bg-[#1A1A1A] border border-[#F4F4F2]/8 px-4 py-3 mb-6 flex items-center gap-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B89F5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                  <span className="text-[#F4F4F2]/55 text-xs tracking-wide">
                    {delivery === "standard" ? "Standardna dostava (1–3 radna dana)" : "Brza dostava (24–48h)"}
                  </span>
                </div>

                {/* Payment method */}
                <fieldset className="flex flex-col gap-3 mb-6" aria-label="Odaberi način plaćanja">
                  <legend className="text-[#F4F4F2]/70 text-xs uppercase tracking-[0.15em] font-medium mb-1">Plaćanje</legend>
                  {([
                    { value: "pouzecem", label: "Pouzećem", desc: "Plaćate gotovinom pri preuzimanju" },
                    { value: "karticom", label: "Karticom", desc: "Visa, Mastercard" },
                  ] as { value: PaymentMethod; label: string; desc: string }[]).map((opt) => (
                    <label
                      key={opt.value}
                      htmlFor={`payment-${opt.value}`}
                      className={`flex items-start gap-3 p-4 border cursor-pointer transition-all duration-200 ${
                        payment === opt.value ? "border-[#B89F5B] bg-[#B89F5B]/8" : "border-[#F4F4F2]/10 bg-[#1A1A1A] hover:border-[#F4F4F2]/25"
                      }`}
                    >
                      <input
                        type="radio" id={`payment-${opt.value}`} name="payment"
                        value={opt.value} checked={payment === opt.value}
                        onChange={() => setPayment(opt.value)}
                        className="accent-[#B89F5B] w-4 h-4 mt-0.5 cursor-pointer"
                      />
                      <div>
                        <span className="text-[#F4F4F2] text-sm tracking-wide font-medium block">{opt.label}</span>
                        <span className="text-[#F4F4F2]/40 text-xs tracking-wide">{opt.desc}</span>
                      </div>
                    </label>
                  ))}
                </fieldset>

                {/* Card form */}
                {payment === "karticom" && (
                  <div className="flex flex-col gap-4 mb-6 p-4 bg-[#1A1A1A] border border-[#F4F4F2]/8">
                    <p className="text-[#F4F4F2]/50 text-xs tracking-wide">Samo UI — bez stvarne integracije.</p>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="card-broj" className="text-[#F4F4F2]/70 text-xs uppercase tracking-[0.15em] font-medium">
                        Broj kartice <span className="text-[#B89F5B]">*</span>
                      </label>
                      <input
                        id="card-broj" type="text" inputMode="numeric" placeholder="0000 0000 0000 0000"
                        value={card.broj} maxLength={19}
                        aria-invalid={!!cardErrors.broj}
                        aria-describedby={cardErrors.broj ? "card-broj-error" : undefined}
                        onChange={(e) => { setCard((c) => ({ ...c, broj: formatCard(e.target.value) })); setCardErrors((e2) => ({ ...e2, broj: undefined })); }}
                        className={`w-full bg-[#0E0E0E] text-[#F4F4F2] placeholder-[#F4F4F2]/20 text-sm tracking-widest px-4 py-3 border outline-none transition-colors focus:border-[#B89F5B] focus:ring-1 focus:ring-[#B89F5B] ${cardErrors.broj ? "border-red-500/50" : "border-[#F4F4F2]/10"}`}
                      />
                      {cardErrors.broj && <p id="card-broj-error" role="alert" className="text-red-400/70 text-xs">{cardErrors.broj}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="card-datum" className="text-[#F4F4F2]/70 text-xs uppercase tracking-[0.15em] font-medium">
                          Datum isteka <span className="text-[#B89F5B]">*</span>
                        </label>
                        <input
                          id="card-datum" type="text" inputMode="numeric" placeholder="MM/GG"
                          value={card.datum} maxLength={5}
                          aria-invalid={!!cardErrors.datum}
                          aria-describedby={cardErrors.datum ? "card-datum-error" : undefined}
                          onChange={(e) => { setCard((c) => ({ ...c, datum: formatExpiry(e.target.value) })); setCardErrors((e2) => ({ ...e2, datum: undefined })); }}
                          className={`w-full bg-[#0E0E0E] text-[#F4F4F2] placeholder-[#F4F4F2]/20 text-sm tracking-widest px-4 py-3 border outline-none transition-colors focus:border-[#B89F5B] focus:ring-1 focus:ring-[#B89F5B] ${cardErrors.datum ? "border-red-500/50" : "border-[#F4F4F2]/10"}`}
                        />
                        {cardErrors.datum && <p id="card-datum-error" role="alert" className="text-red-400/70 text-xs">{cardErrors.datum}</p>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="card-cvc" className="text-[#F4F4F2]/70 text-xs uppercase tracking-[0.15em] font-medium">
                          CVC <span className="text-[#B89F5B]">*</span>
                        </label>
                        <input
                          id="card-cvc" type="text" inputMode="numeric" placeholder="000"
                          value={card.cvc} maxLength={4}
                          aria-invalid={!!cardErrors.cvc}
                          aria-describedby={cardErrors.cvc ? "card-cvc-error" : undefined}
                          onChange={(e) => { setCard((c) => ({ ...c, cvc: formatCvc(e.target.value) })); setCardErrors((e2) => ({ ...e2, cvc: undefined })); }}
                          className={`w-full bg-[#0E0E0E] text-[#F4F4F2] placeholder-[#F4F4F2]/20 text-sm tracking-widest px-4 py-3 border outline-none transition-colors focus:border-[#B89F5B] focus:ring-1 focus:ring-[#B89F5B] ${cardErrors.cvc ? "border-red-500/50" : "border-[#F4F4F2]/10"}`}
                        />
                        {cardErrors.cvc && <p id="card-cvc-error" role="alert" className="text-red-400/70 text-xs">{cardErrors.cvc}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Trust */}
                <div className="flex items-center gap-2 mb-6 text-[#F4F4F2]/30">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
                  </svg>
                  <span className="text-xs tracking-wide">Vaši podaci su sigurni i zaštićeni.</span>
                </div>

                {items.length === 0 ? (
                  <div className="w-full py-4 text-center text-[#F4F4F2]/40 text-xs tracking-wide border border-[#F4F4F2]/10">
                    Korpa je prazna.{" "}
                    <Link href="/shop" className="text-[#B89F5B] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89F5B]">
                      Nastavite kupovinu
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleConfirm}
                    className="w-full py-4 bg-[#F4F4F2] text-[#0E0E0E] text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#B89F5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89F5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
                  >
                    Potvrdi narudžbu — {formatPriceKM(total)}
                  </button>
                )}

                <p className="text-center text-[#F4F4F2]/20 text-xs tracking-wide mt-4">
                  Klikom potvrđujete narudžbu i prihvatate uslove korištenja.
                </p>
              </section>
            )}
          </div>

          {/* ── Desktop sidebar ── */}
          <aside
            className="hidden md:block w-80 lg:w-96 shrink-0 sticky top-24 bg-[#1A1A1A] border border-[#F4F4F2]/8"
            aria-label="Sažetak narudžbe"
          >
            <div className="px-6 py-5 border-b border-[#F4F4F2]/8">
              <p className="text-[#F4F4F2] text-xs font-bold uppercase tracking-[0.2em]">{copy.checkout.orderSummary}</p>
            </div>
            <OrderSummary sidebar />
          </aside>
        </div>
      </main>
    </div>
  );
}
