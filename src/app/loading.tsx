export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-16 md:pt-20" aria-hidden="true">
      {/* Top bar placeholder */}
      <div className="h-px w-full bg-[#F4F4F2]/5" />

      <div className="px-5 md:px-10 lg:px-16 py-10 md:py-14 flex flex-col gap-8 animate-pulse">
        {/* Heading block */}
        <div className="flex flex-col gap-3 max-w-xs">
          <div className="h-2.5 w-20 bg-[#F4F4F2]/8 rounded-full" />
          <div className="h-7 w-48 bg-[#F4F4F2]/10 rounded-sm" />
        </div>

        {/* Content grid — 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="aspect-[3/4] bg-[#F4F4F2]/6 rounded-sm" />
              <div className="h-2.5 w-3/4 bg-[#F4F4F2]/8 rounded-full" />
              <div className="h-2.5 w-1/3 bg-[#F4F4F2]/6 rounded-full" />
            </div>
          ))}
        </div>

        {/* Second row — hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="aspect-[3/4] bg-[#F4F4F2]/6 rounded-sm" />
              <div className="h-2.5 w-2/3 bg-[#F4F4F2]/8 rounded-full" />
              <div className="h-2.5 w-1/4 bg-[#F4F4F2]/6 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
