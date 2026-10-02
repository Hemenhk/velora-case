"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useFlow } from "@/lib/store";
import { cn } from "@/lib/utils";
import { StepBody, StepHeading } from "../primitives";

const CHECKS = ["Dina mål", "Din hälsa", "Din säkerhet"];
const DURATION = 2.3;

/** A short, honest pause: the answers are reviewed against the treatment criteria. */
export function AnalyzingStep() {
  const next = useFlow((s) => s.next);
  const [done, setDone] = useState(0);

  useEffect(() => {
    const timers = [600, 1150, 1700].map((ms, i) => window.setTimeout(() => setDone(i + 1), ms));
    const end = window.setTimeout(next, DURATION * 1000);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(end);
    };
  }, [next]);

  return (
    <StepBody className="flex flex-col items-center justify-center pb-24 text-center">
      <div className="relative grid size-24 place-items-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle cx="50" cy="50" r="45" fill="none" strokeWidth="5" className="stroke-plum/10" />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            className="stroke-berry"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: DURATION - 0.2, ease: "easeInOut" }}
          />
        </svg>
        <span className="font-display text-[34px] font-semibold leading-none text-berry">v</span>
      </div>
      <StepHeading className="mt-8">Vi går igenom dina svar</StepHeading>
      <ul className="mt-6 flex w-full max-w-[220px] flex-col gap-3" aria-live="polite">
        {CHECKS.map((label, i) => (
          <li key={label} className="flex items-center gap-3 text-[16px]">
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full transition-colors duration-300",
                i < done ? "bg-berry text-white" : "bg-plum/10",
              )}
            >
              {i < done && (
                <motion.span initial={{ scale: 0.4 }} animate={{ scale: 1 }}>
                  <Check className="size-3.5" strokeWidth={3.5} />
                </motion.span>
              )}
            </span>
            <span className={cn("transition-colors", i < done ? "text-plum" : "text-plum/45")}>{label}</span>
          </li>
        ))}
      </ul>
    </StepBody>
  );
}