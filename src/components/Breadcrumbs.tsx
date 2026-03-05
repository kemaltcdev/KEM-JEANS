import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap" style={{ scrollbarWidth: "none" }}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5 shrink-0">
              {i > 0 && (
                <span className="text-[#F4F4F2]/20 text-[10px] select-none" aria-hidden="true">
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="text-[#F4F4F2]/50 text-[11px] tracking-wide font-medium"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-[#F4F4F2]/30 text-[11px] tracking-wide transition-colors duration-150 hover:text-[#B89F5B] focus-visible:outline-none focus-visible:text-[#B89F5B]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
