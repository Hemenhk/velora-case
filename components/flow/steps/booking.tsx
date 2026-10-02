"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Clock, Video, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFlow } from "@/lib/store";
import {
  buildDays,
  firstAvailable,
  formatLongDate,
  formatWeekday,
  groupSlots,
  parseSlot,
  relativeDay,
  type Day,
} from "@/lib/slots";
import { capitalize, cn } from "@/lib/utils";
import { StepBody, StepFooter, StepIntro } from "../primitives";

export function BookingStep() {
  const slot = useFlow((s) => s.slot);
  const setSlot = useFlow((s) => s.setSlot);
  const next = useFlow((s) => s.next);

  const days = useMemo(() => buildDays(), []);
  const first = useMemo(() => firstAvailable(days), [days]);
  const [dayKey, setDayKey] = useState(() => slot?.slice(0, 10) ?? first?.slice(0, 10) ?? days[0].key);
  const day = days.find((d) => d.key === dayKey) ?? days[0];
  const groups = groupSlots(day.slots);
  const selectedDate = slot ? parseSlot(slot) : null;

  const pickFirst = () => {
    if (!first) return;
    setDayKey(first.slice(0, 10));
    setSlot(first);
  };

  return (
    <>
      <StepBody>
        <StepIntro title="Välj en tid som passar dig" />
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[15px] font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Video className="size-[18px]" /> Videosamtal
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-[18px]" /> 15 min, kostnadsfritt
          </span>
        </div>

        {first && slot !== first && (
          <button
            type="button"
            onClick={pickFirst}
            className="mt-5 flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 text-left ring-1 ring-plum/10 outline-none transition-[box-shadow,transform] duration-200 hover:ring-plum/25 focus-visible:ring-2 focus-visible:ring-berry/50 active:scale-[0.99]"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blush text-berry">
              <Zap className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold text-muted-foreground">Första lediga tid</span>
              <span className="block text-[17px] font-semibold">
                {capitalize(relativeDay(parseSlot(first)))} kl. {first.slice(11)}
              </span>
            </span>
            <span className="text-[16px] font-semibold text-berry">Välj</span>
          </button>
        )}

        <DayStrip days={days} value={dayKey} onChange={setDayKey} />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={dayKey}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            className="mt-5"
          >
            <p className="text-[17px] font-semibold">{capitalize(formatLongDate(day.date))}</p>
            {groups.map((group) => (
              <div key={group.label} className="mt-4">
                <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {group.label}
                </p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {group.slots.map((time) => {
                    const value = `${day.key}T${time}`;
                    const selected = slot === value;
                    return (
                      <motion.button
                        key={time}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        aria-pressed={selected}
                        onClick={() => setSlot(selected ? null : value)}
                        className={cn(
                          "h-12 rounded-xl text-[16px] font-semibold tabular-nums ring-1 outline-none transition-[background-color,box-shadow,color] duration-200 focus-visible:ring-2 focus-visible:ring-berry/50",
                          selected
                            ? "bg-berry text-white ring-berry"
                            : "bg-white text-plum ring-plum/10 hover:ring-plum/30",
                        )}
                      >
                        {time}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
            {!groups.length && (
              <p className="mt-3 rounded-2xl bg-white/60 p-4 text-[15px] font-medium text-muted-foreground ring-1 ring-plum/8">
                Inga lediga tider den här dagen. Välj en annan dag ovan.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
        <p className="mt-6 text-[14px] font-medium text-muted-foreground">Tiderna visas i svensk tid.</p>
      </StepBody>

      <StepFooter>
        <AnimatePresence initial={false}>
          {selectedDate && slot && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden text-center text-[15px]"
            >
              <span className="mb-3 inline-block rounded-full bg-white px-4 py-2 ring-1 ring-plum/10">
                <span className="font-semibold">{capitalize(formatLongDate(selectedDate))}</span> kl.{" "}
                <span className="tabular-nums">{slot.slice(11)}</span>
              </span>
            </motion.p>
          )}
        </AnimatePresence>
        <Button size="lg" disabled={!slot} onClick={next}>
          {slot ? "Fortsätt" : "Välj en tid ovan"}
        </Button>
      </StepFooter>
    </>
  );
}

/**
 * Horizontally scrolling day picker, kept inside the same content width as the rest of the step.
 * Each day is a fully rounded pill: weekday on top, the date in a circle below.
 */
function DayStrip({ days, value, onChange }: { days: Day[]; value: string; onChange: (key: string) => void }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const mounted = useRef(false);

  // Bring the selected day into view inside the strip only, without scrolling the page
  useEffect(() => {
    const strip = stripRef.current;
    const el = selectedRef.current;
    if (!strip || !el) return;
    const start = el.offsetLeft;
    const end = start + el.offsetWidth;
    const visible = start >= strip.scrollLeft && end <= strip.scrollLeft + strip.clientWidth;
    if (!visible) {
      strip.scrollTo({
        left: start - (strip.clientWidth - el.offsetWidth) / 2,
        behavior: mounted.current ? "smooth" : "auto",
      });
    }
    mounted.current = true;
  }, [value]);

  return (
    <div
      ref={stripRef}
      role="tablist"
      aria-label="Välj dag"
      className="no-scrollbar relative mt-6 flex snap-x snap-mandatory gap-2 overflow-x-auto py-0.5"
    >
      {days.map((d, i) => {
        const selected = d.key === value;
        const empty = !d.slots.length;
        return (
          <button
            key={d.key}
            ref={selected ? selectedRef : undefined}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-label={`${capitalize(formatLongDate(d.date))}${empty ? ", inga lediga tider" : ""}`}
            disabled={empty}
            onClick={() => onChange(d.key)}
            className={cn(
              "flex h-[88px] w-[54px] shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-full ring-1 ring-inset outline-none transition-[background-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-berry/60 disabled:opacity-40",
              selected ? "bg-berry ring-berry" : "bg-white ring-plum/10 hover:ring-plum/25",
            )}
          >
            <span
              className={cn(
                "text-[13px] font-semibold leading-none",
                selected ? "text-white" : i === 0 ? "text-berry" : "text-muted-foreground",
              )}
            >
              {i === 0 ? "Idag" : capitalize(formatWeekday(d.date))}
            </span>
            <span
              className={cn(
                "grid size-9 place-items-center rounded-full text-[17px] font-semibold tabular-nums leading-none transition-colors duration-200",
                selected ? "bg-white text-berry" : "bg-blush text-plum",
              )}
            >
              {d.date.getDate()}
            </span>
          </button>
        );
      })}
    </div>
  );
}