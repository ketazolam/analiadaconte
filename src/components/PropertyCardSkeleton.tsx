const PropertyCardSkeleton = ({ variant = "grid" }: { variant?: "grid" | "list" }) => {
  if (variant === "list") {
    return (
      <div
        className="flex h-[180px] animate-pulse"
        style={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
      >
        <div className="w-[260px] flex-shrink-0" style={{ backgroundColor: "hsl(var(--muted))" }} />
        <div className="flex-1 p-5 space-y-3">
          <div className="h-3 w-16 rounded" style={{ backgroundColor: "hsl(var(--muted))" }} />
          <div className="h-5 w-3/4 rounded" style={{ backgroundColor: "hsl(var(--muted))" }} />
          <div className="h-3 w-1/2 rounded" style={{ backgroundColor: "hsl(var(--muted))" }} />
          <div className="h-7 w-1/3 rounded" style={{ backgroundColor: "hsl(var(--muted))" }} />
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-3 w-12 rounded" style={{ backgroundColor: "hsl(var(--muted))" }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="animate-pulse"
      style={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
    >
      <div className="h-[240px]" style={{ backgroundColor: "hsl(var(--muted))" }} />
      <div className="p-5 space-y-3">
        <div className="h-2.5 w-16 rounded" style={{ backgroundColor: "hsl(var(--muted))" }} />
        <div className="h-5 w-3/4 rounded" style={{ backgroundColor: "hsl(var(--muted))" }} />
        <div className="h-3 w-1/2 rounded" style={{ backgroundColor: "hsl(var(--muted))" }} />
        <div className="flex gap-4 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-3 w-12 rounded" style={{ backgroundColor: "hsl(var(--muted))" }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;
