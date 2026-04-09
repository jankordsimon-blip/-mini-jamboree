import React, { useState } from "react";

type NewsItem = {
  date: string;
  title: string;
  text: string;
  image?: string;
  credit?: string;
};

type Props = {
  items: NewsItem[];
};

export default function NewsFeed({ items }: Props) {
  const [index, setIndex] = useState(0);

  if (!items.length) return null;

  const item = items[index];
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            Latest updates
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            News & announcements
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Stay up to date with the latest information on registration, program,
            travel, and event logistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => hasPrev && setIndex(index - 1)}
            disabled={!hasPrev}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-xl text-slate-900 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous update"
          >
            ←
          </button>

          <button
            type="button"
            onClick={() => hasNext && setIndex(index + 1)}
            disabled={!hasNext}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-xl text-slate-900 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next update"
          >
            →
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {item.image && (
  <div className="relative h-72 w-full overflow-hidden md:h-96">
    <img
      src={item.image}
      alt={item.title}
      className="h-full w-full object-cover"
    />

    {item.credit && (
      <div className="pointer-events-none absolute bottom-3 left-3 text-xs text-white/70 backdrop-blur-sm bg-black/20 px-2 py-1 rounded-md">
        Photo: {item.credit}
      </div>
    )}
  </div>
 )}

        <div className="p-6 md:p-8">
          <p className="text-sm font-semibold text-emerald-700">{item.date}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            {item.title}
          </h3>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
            {item.text}
          </p>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              Update {index + 1} of {items.length}
            </p>

            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    i === index ? "bg-emerald-500" : "bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to update ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}