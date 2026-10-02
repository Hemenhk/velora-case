"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display font-semibold lowercase leading-none tracking-[-0.03em] text-plum",
        className,
      )}
    >
      velora
    </span>
  );
}

/** Each step's heading takes focus when it appears, so screen readers announce the new step. */
export function StepHeading({
  as: Tag = "h2",
  id,
  className,
  children,
}: {
  as?: "h1" | "h2";
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);
  return (
    <Tag
      ref={ref}
      id={id}
      tabIndex={-1}
      className={cn(
        "font-display text-[30px] font-medium leading-[1.1] tracking-[-0.015em] text-balance text-plum outline-none",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function StepIntro({ title, lead, id }: { title: string; lead?: string; id?: string }) {
  return (
    <div>
      <StepHeading id={id}>{title}</StepHeading>
      {lead && <p className="mt-3 text-[16px] leading-relaxed text-pretty text-plum/70">{lead}</p>}
    </div>
  );
}

export function StepBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex-1 px-5 pt-4 pb-6 sm:px-7", className)}>{children}</div>;
}

/** Sticky bottom action area, thumb-reachable, clear of the home indicator. */
export function StepFooter({ note, children }: { note?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="surface-fade sticky bottom-0 z-10 mt-auto px-5 pt-8 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-7 lg:rounded-b-[2rem]">
      {children}
      {note && <p className="mt-3 text-center text-[13px] text-muted-foreground font-medium">{note}</p>}
    </div>
  );
}

/** A short reply in the care team's voice, so answering feels like a conversation. */
export function CareNote({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      className="mt-5 flex gap-3 rounded-2xl bg-white/65 p-4 ring-1 ring-plum/8"
      role="status"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-berry font-display text-[17px] font-semibold leading-none text-white">
        v
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-berry">Från vårdteamet</p>
        <p className="mt-0.5 text-[15px] leading-snug text-plum/85">{text}</p>
      </div>
    </motion.div>
  );
}

type FieldProps = React.ComponentProps<typeof Input> & {
  id: string;
  label: string;
  unit?: string;
  hint?: string;
  error?: string;
};

export function Field({ id, label, unit, hint, error, className, ...props }: FieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={[error && errorId, hint && hintId].filter(Boolean).join(" ") || undefined}
          className={cn(unit && "pr-12", className)}
          {...props}
        />
        {unit && (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[15px] text-plum/45">
            {unit}
          </span>
        )}
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[14px] leading-snug text-danger"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !error && (
        <p id={hintId} className="text-[13px] text-plum/55">
          {hint}
        </p>
      )}
    </div>
  );
}