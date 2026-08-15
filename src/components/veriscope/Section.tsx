import { useReveal } from "@/hooks/use-reveal";

export function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section id={id} className={`px-5 sm:px-6 ${className}`}>
      <div ref={reveal.ref} className={`mx-auto w-full max-w-3xl ${reveal.className}`}>
        {children}
      </div>
    </section>
  );
}

export function DiamondMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    >
      <path d="M12 2.5 21.5 12 12 21.5 2.5 12z" />
      <path d="M12 7.2 16.8 12 12 16.8 7.2 12z" opacity="0.55" />
    </svg>
  );
}
