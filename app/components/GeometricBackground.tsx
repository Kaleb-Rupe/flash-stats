export function GeometricBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/90 to-emerald-950/60" />
      <svg
        className="fixed left-1/2 top-0 w-full h-full -translate-x-1/2 stroke-emerald-900/80 [mask-image:radial-gradient(64rem_34rem_at_center,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="geometric"
            width={150}
            height={150}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
            <path
              d="M100 100L0 200M100 100l100 100M100 100L0 0m100 100l100-100"
              fill="none"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          strokeWidth={0}
          fill="url(#geometric)"
        />
      </svg>
    </div>
  );
}
