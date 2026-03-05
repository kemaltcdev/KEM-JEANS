"use client";

export default function FreeShippingProgress({
  subtotalKM,
  thresholdKM = 150,
}: {
  subtotalKM: number;
  thresholdKM?: number;
}) {
  const reached = subtotalKM >= thresholdKM;
  const remaining = Math.max(0, thresholdKM - subtotalKM);
  const pct = Math.min(100, (subtotalKM / thresholdKM) * 100);

  /* Format: show integer if whole, else 2 decimals */
  const fmt = (n: number) => (n % 1 === 0 ? String(n) : n.toFixed(2));

  return (
    <div className="flex flex-col gap-2">
      {/* Message */}
      <p className="text-[#F4F4F2]/50 text-[11px] tracking-wide leading-snug">
        {reached ? (
          <span className="text-[#7A9B76] font-medium">
            Besplatna dostava je aktivna.
          </span>
        ) : (
          <>
            Još{" "}
            <span className="text-[#B89F5B] font-semibold">{fmt(remaining)} KM</span>
            {" "}do besplatne dostave.
          </>
        )}
      </p>

      {/* Track */}
      <div className="h-0.5 bg-[#F4F4F2]/8 rounded-full overflow-hidden">
        <div
          role="progressbar"
          aria-label="Napredak ka besplatnoj dostavi"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          className={`h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none ${
            reached ? "bg-[#7A9B76]" : "bg-[#B89F5B]"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
