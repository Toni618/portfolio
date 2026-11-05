export default function Marquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-white/[0.03] py-5">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {row.map((t, i) => (
              <span key={`${k}-${i}`} className="mx-8 flex items-center gap-8 text-2xl font-bold uppercase tracking-widest text-white/30">
                {t}
                <span className="text-neon-pink">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
