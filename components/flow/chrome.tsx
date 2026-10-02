
// "use client";

// import { AnimatePresence, motion } from "motion/react";
// import {
//   CalendarCheck,
//   Check,
//   ChevronLeft,
//   HeartPulse,
//   Lock,
//   Target,
//   UserRound,
//   type LucideIcon,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useFlow, useStep } from "@/lib/store";
// import { CHAPTERS, PHASES, QUESTION_STEPS, phaseOf, type StepId } from "@/lib/quiz";
// import { cn } from "@/lib/utils";
// import { Wordmark } from "./primitives";

// export function FlowHeader() {
//   const step = useStep();
//   const index = useFlow((s) => s.index);
//   const back = useFlow((s) => s.back);
//   const canGoBack = index > 0 && step !== "analyzing" && step !== "confirmation";
//   const showStepper = step !== "welcome";

//   return (
//     <header className="surface-glass sticky top-[env(safe-area-inset-top,0px)] z-30 lg:top-0 lg:rounded-t-[2rem]">
//       <div className="grid h-14 grid-cols-[2.75rem_1fr_2.75rem] items-center px-2 sm:px-4">
//         <div>
//           {canGoBack && (
//             <Button variant="ghost" size="icon" aria-label="Tillbaka" onClick={back}>
//               <ChevronLeft className="size-6" strokeWidth={2.25} />
//             </Button>
//           )}
//         </div>
//         <Wordmark className="justify-self-center text-[26px] lg:invisible" />
//         <span />
//       </div>
//       <AnimatePresence initial={false}>
//         {showStepper && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             className="overflow-hidden"
//           >
//             <FlowStepper step={step} />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// }

// /* ------------------------------------------------------------------
//    Stepper: one indicator per chapter plus booking, joined by progress
//    bars. Each bar fills as the questions in the chapter before it are
//    answered; when it is full, that chapter's indicator turns into a check.
//    ------------------------------------------------------------------ */

// type StepperItem = { label: string; icon: LucideIcon };

// const STEPPER: StepperItem[] = [
//   { label: CHAPTERS[0], icon: Target },
//   { label: CHAPTERS[1], icon: UserRound },
//   { label: CHAPTERS[2], icon: HeartPulse },
//   { label: "Boka tid", icon: CalendarCheck },
// ];

// const AFTER_QUESTIONS: StepId[] = ["analyzing", "result", "booking", "details", "confirmation"];

// /** Number of questions finished in chapters up to and including `chapter`. */
// const chapterEnd = (chapter: number) => QUESTION_STEPS.filter((q) => q.chapter <= chapter).length;

// type NodeState = "done" | "current" | "todo";

// function FlowStepper({ step }: { step: StepId }) {
//   const position = QUESTION_STEPS.findIndex((q) => q.id === step);
//   const answered = position >= 0 ? position : AFTER_QUESTIONS.includes(step) ? QUESTION_STEPS.length : 0;
//   const booked = step === "confirmation";

//   const states: NodeState[] = STEPPER.map((_, i) => {
//     const isLast = i === STEPPER.length - 1;
//     const done = isLast ? booked : answered >= chapterEnd(i);
//     if (done) return "done";
//     const previousDone = i === 0 || answered >= chapterEnd(i - 1);
//     return previousDone ? "current" : "todo";
//   });

//   const fills = CHAPTERS.map((_, chapter) => {
//     const start = chapter === 0 ? 0 : chapterEnd(chapter - 1);
//     const end = chapterEnd(chapter);
//     return Math.min(1, Math.max(0, (answered - start) / (end - start)));
//   });

//   const currentLabel = STEPPER[states.indexOf("current")]?.label;

//   return (
//     <div className="px-8 pt-1 pb-8 sm:px-10">
//       <ol className="flex items-center" aria-label="Hur långt du har kommit">
//         {STEPPER.map((item, i) => (
//           <StepperNode
//             key={item.label}
//             item={item}
//             state={states[i]}
//             fill={i < fills.length ? fills[i] : null}
//           />
//         ))}
//       </ol>
//       <p className="sr-only" aria-live="polite">
//         {booked ? "Alla steg är klara" : currentLabel ? `Du är på steget ${currentLabel}` : ""}
//       </p>
//     </div>
//   );
// }

// function StepperNode({ item, state, fill }: { item: StepperItem; state: NodeState; fill: number | null }) {
//   const Icon = item.icon;
//   return (
//     <>
//       <li
//         aria-current={state === "current" ? "step" : undefined}
//         className="relative flex shrink-0 flex-col items-center"
//       >
//         <span
//           className={cn(
//             "relative grid size-8 place-items-center rounded-full transition-[background-color,box-shadow,color] duration-300",
//             state === "done" && "bg-berry text-white",
//             state === "current" && "bg-berry text-white ring-4 ring-berry/20",
//             state === "todo" && "bg-white text-plum/45 ring-1 ring-inset ring-plum/12",
//           )}
//         >
//           <AnimatePresence mode="popLayout" initial={false}>
//             <motion.span
//               key={state === "done" ? "check" : "icon"}
//               initial={{ scale: 0.4, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.4, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 500, damping: 30 }}
//               className="grid place-items-center"
//             >
//               {state === "done" ? (
//                 <Check className="size-4" strokeWidth={3} />
//               ) : (
//                 <Icon className="size-4" strokeWidth={2.25} />
//               )}
//             </motion.span>
//           </AnimatePresence>
//         </span>
//         <span
//           className={cn(
//             "absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap text-[12px] font-semibold leading-none transition-colors duration-300",
//             state === "todo" ? "text-muted-foreground" : "text-plum",
//           )}
//         >
//           {item.label}
//           <span className="sr-only">
//             {state === "done" ? ", klart" : state === "current" ? ", pågår" : ", kommer sen"}
//           </span>
//         </span>
//       </li>
//       {fill !== null && (
//         <li aria-hidden className="mx-2 h-1 flex-1 overflow-hidden rounded-full bg-plum/10">
//           <motion.div
//             className="h-full rounded-full bg-berry"
//             initial={false}
//             animate={{ width: `${fill * 100}%` }}
//             transition={{ type: "spring", stiffness: 180, damping: 28 }}
//           />
//         </li>
//       )}
//     </>
//   );
// }

// /** Desktop only: the whole journey at a glance, next to the flow. */
// export function DesktopAside() {
//   const phase = phaseOf(useStep());
//   return (
//     <aside className="sticky top-12 hidden flex-col gap-10 self-start pt-4 lg:flex">
//       <Wordmark className="text-[36px]" />
//       <div className="max-w-md">
//         <p className="font-display text-[44px] font-medium leading-[1.04] tracking-[-0.02em] text-balance text-plum">
//           Vård som utgår från dig och din kropp.
//         </p>
//         <p className="mt-4 max-w-sm text-[17px] leading-relaxed text-plum/70">
//           Legitimerade läkare och sjuksköterskor tar fram en behandling som utgår från din hälsa, och
//           följer dig hela vägen.
//         </p>
//       </div>
//       <ol className="flex max-w-sm flex-col gap-1">
//         {PHASES.map((p, i) => {
//           const state = i < phase ? "done" : i === phase ? "current" : "todo";
//           return (
//             <li
//               key={p.label}
//               aria-current={state === "current" ? "step" : undefined}
//               className={cn(
//                 "flex items-center gap-4 rounded-2xl px-4 py-3 transition-colors duration-300",
//                 state === "current" && "bg-white/70 ring-1 ring-plum/8",
//               )}
//             >
//               <span
//                 className={cn(
//                   "grid size-8 shrink-0 place-items-center rounded-full text-[14px] font-semibold tabular-nums transition-colors duration-300",
//                   state === "todo" ? "bg-plum/8 text-plum/50" : "bg-berry text-white",
//                 )}
//               >
//                 {state === "done" ? <Check className="size-4" strokeWidth={3} /> : i + 1}
//               </span>
//               <div>
//                 <p className={cn("text-[16px] font-semibold", state === "todo" ? "text-plum/55" : "text-plum")}>
//                   {p.label}
//                 </p>
//                 <p className="text-[14px] text-plum/55">{p.detail}</p>
//               </div>
//             </li>
//           );
//         })}
//       </ol>
//       <p className="flex max-w-sm items-center gap-2 text-[14px] text-plum/60">
//         <Lock className="size-4 shrink-0" />
//         Dina svar ses bara av vårdpersonalen som bedömer dig.
//       </p>
//     </aside>
//   );
// }
"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  CalendarCheck,
  Check,
  ChevronLeft,
  HeartPulse,
  Lock,
  Target,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFlow, useStep } from "@/lib/store";
import { CHAPTERS, PHASES, QUESTION_STEPS, phaseOf, type StepId } from "@/lib/quiz";
import { cn } from "@/lib/utils";
import { Wordmark } from "./primitives";

export function FlowHeader() {
  const step = useStep();
  const index = useFlow((s) => s.index);
  const back = useFlow((s) => s.back);
  const canGoBack = index > 0 && step !== "analyzing" && step !== "confirmation";
  // Hidden on the first and last screens: before the flow starts, and once the booking is done
  const showStepper = step !== "welcome" && step !== "confirmation";

  return (
    <header className="surface-glass sticky top-[env(safe-area-inset-top,0px)] z-30 lg:top-0 lg:rounded-t-[2rem]">
      <div className="grid h-14 grid-cols-[2.75rem_1fr_2.75rem] items-center px-2 sm:px-4">
        <div>
          {canGoBack && (
            <Button variant="ghost" size="icon" aria-label="Tillbaka" onClick={back}>
              <ChevronLeft className="size-6" strokeWidth={2.25} />
            </Button>
          )}
        </div>
        <Wordmark className="justify-self-center text-[26px] lg:invisible" />
        <span />
      </div>
      <AnimatePresence initial={false}>
        {showStepper && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <FlowStepper step={step} />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ------------------------------------------------------------------
   Stepper: one indicator per chapter plus booking, joined by progress
   bars. Each bar fills as the questions in the chapter before it are
   answered; when it is full, that chapter's indicator turns into a check.
   ------------------------------------------------------------------ */

type StepperItem = { label: string; icon: LucideIcon };

const STEPPER: StepperItem[] = [
  { label: CHAPTERS[0], icon: Target },
  { label: CHAPTERS[1], icon: UserRound },
  { label: CHAPTERS[2], icon: HeartPulse },
  { label: "Boka tid", icon: CalendarCheck },
];

const AFTER_QUESTIONS: StepId[] = ["analyzing", "result", "booking", "details"];

/** Number of questions finished in chapters up to and including `chapter`. */
const chapterEnd = (chapter: number) => QUESTION_STEPS.filter((q) => q.chapter <= chapter).length;

type NodeState = "done" | "current" | "todo";

function FlowStepper({ step }: { step: StepId }) {
  const position = QUESTION_STEPS.findIndex((q) => q.id === step);
  const answered = position >= 0 ? position : AFTER_QUESTIONS.includes(step) ? QUESTION_STEPS.length : 0;

  const states: NodeState[] = STEPPER.map((_, i) => {
    const isLast = i === STEPPER.length - 1;
    const done = !isLast && answered >= chapterEnd(i);
    if (done) return "done";
    const previousDone = i === 0 || answered >= chapterEnd(i - 1);
    return previousDone ? "current" : "todo";
  });

  const fills = CHAPTERS.map((_, chapter) => {
    const start = chapter === 0 ? 0 : chapterEnd(chapter - 1);
    const end = chapterEnd(chapter);
    return Math.min(1, Math.max(0, (answered - start) / (end - start)));
  });

  const currentLabel = STEPPER[states.indexOf("current")]?.label;

  return (
    <div className="px-8 pt-1 pb-8 sm:px-10">
      <ol className="flex items-center" aria-label="Hur långt du har kommit">
        {STEPPER.map((item, i) => (
          <StepperNode
            key={item.label}
            item={item}
            state={states[i]}
            fill={i < fills.length ? fills[i] : null}
          />
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">
        {currentLabel ? `Du är på steget ${currentLabel}` : ""}
      </p>
    </div>
  );
}

function StepperNode({ item, state, fill }: { item: StepperItem; state: NodeState; fill: number | null }) {
  const Icon = item.icon;
  return (
    <>
      <li
        aria-current={state === "current" ? "step" : undefined}
        className="relative flex shrink-0 flex-col items-center"
      >
        <span
          className={cn(
            "relative grid size-8 place-items-center rounded-full transition-[background-color,box-shadow,color] duration-300",
            state === "done" && "bg-berry text-white",
            state === "current" && "bg-berry text-white ring-4 ring-berry/20",
            state === "todo" && "bg-white text-plum/45 ring-1 ring-inset ring-plum/12",
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={state === "done" ? "check" : "icon"}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="grid place-items-center"
            >
              {state === "done" ? (
                <Check className="size-4" strokeWidth={3} />
              ) : (
                <Icon className="size-4" strokeWidth={2.25} />
              )}
            </motion.span>
          </AnimatePresence>
        </span>
        <span
          className={cn(
            "absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap text-[12px] font-semibold leading-none transition-colors duration-300",
            state === "todo" ? "text-muted-foreground" : "text-plum",
          )}
        >
          {item.label}
          <span className="sr-only">
            {state === "done" ? ", klart" : state === "current" ? ", pågår" : ", kommer sen"}
          </span>
        </span>
      </li>
      {fill !== null && (
        <li aria-hidden className="mx-2 h-1 flex-1 overflow-hidden rounded-full bg-plum/10">
          <motion.div
            className="h-full rounded-full bg-berry"
            initial={false}
            animate={{ width: `${fill * 100}%` }}
            transition={{ type: "spring", stiffness: 180, damping: 28 }}
          />
        </li>
      )}
    </>
  );
}

/** Desktop only: the whole journey at a glance, next to the flow. */
export function DesktopAside() {
  const phase = phaseOf(useStep());
  return (
    <aside className="sticky top-12 hidden flex-col gap-10 self-start pt-4 lg:flex">
      <Wordmark className="text-[36px]" />
      <div className="max-w-md">
        <p className="font-display text-[44px] font-medium leading-[1.04] tracking-[-0.02em] text-balance text-plum">
          Vård som utgår från dig och din kropp.
        </p>
        <p className="mt-4 max-w-sm text-[17px] leading-relaxed text-plum/70">
          Legitimerade läkare och sjuksköterskor tar fram en behandling som utgår från din hälsa, och
          följer dig hela vägen.
        </p>
      </div>
      <ol className="flex max-w-sm flex-col gap-1">
        {PHASES.map((p, i) => {
          const state = i < phase ? "done" : i === phase ? "current" : "todo";
          return (
            <li
              key={p.label}
              aria-current={state === "current" ? "step" : undefined}
              className={cn(
                "flex items-center gap-4 rounded-2xl px-4 py-3 transition-colors duration-300",
                state === "current" && "bg-white/70 ring-1 ring-plum/8",
              )}
            >
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full text-[14px] font-semibold tabular-nums transition-colors duration-300",
                  state === "todo" ? "bg-plum/8 text-plum/50" : "bg-berry text-white",
                )}
              >
                {state === "done" ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </span>
              <div>
                <p className={cn("text-[16px] font-semibold", state === "todo" ? "text-plum/55" : "text-plum")}>
                  {p.label}
                </p>
                <p className="text-[14px] text-plum/55">{p.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="flex max-w-sm items-center gap-2 text-[14px] text-plum/60">
        <Lock className="size-4 shrink-0" />
        Dina svar ses bara av vårdpersonalen som bedömer dig.
      </p>
    </aside>
  );
}