"use client";

import { AnimatePresence, MotionConfig, motion, type Variants } from "motion/react";
import { useFlow } from "@/lib/store";
import { QUESTIONS, STEPS, type StepId } from "@/lib/quiz";
import { ChoiceStep } from "./choice-step";
import { DesktopAside, FlowHeader } from "./chrome";
import { WelcomeStep } from "./steps/welcome";
import { BodyStep } from "./steps/body";
import { AnalyzingStep } from "./steps/analyzing";
import { ResultStep } from "./steps/result";
import { DetailsStep } from "./steps/details";
import { BookingStep } from "./steps/booking";
import { ConfirmationStep } from "./steps/confirmation";

const ease = [0.32, 0.72, 0, 1] as const;

/** Direction-aware push, like a navigation stack: forward slides left, back slides right. */
const slide: Variants = {
  enter: (dir: number) => ({ x: dir * 32, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.42, ease } },
  exit: (dir: number) => ({ x: dir * -32, opacity: 0, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }),
};

function StepView({ step }: { step: StepId }) {
  switch (step) {
    case "welcome":
      return <WelcomeStep />;
    case "goal":
      return <ChoiceStep question={QUESTIONS.goal} />;
    case "motivation":
      return <ChoiceStep question={QUESTIONS.motivation} />;
    case "body":
      return <BodyStep />;
    case "history":
      return <ChoiceStep question={QUESTIONS.history} />;
    case "conditions":
      return <ChoiceStep question={QUESTIONS.conditions} />;
    case "safety":
      return <ChoiceStep question={QUESTIONS.safety} />;
    case "analyzing":
      return <AnalyzingStep />;
    case "result":
      return <ResultStep />;
    case "booking":
      return <BookingStep />;
    case "details":
      return <DetailsStep />;
    case "confirmation":
      return <ConfirmationStep />;
  }
}

export function Flow() {
  const step = useFlow((s) => STEPS[s.index]);
  const direction = useFlow((s) => s.direction);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh bg-blush text-plum lg:mx-auto lg:grid lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_480px] lg:items-start lg:gap-16 lg:px-10 lg:py-12">
        <DesktopAside />
        <main className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col [--surface:var(--color-blush)] lg:min-h-[min(860px,calc(100dvh-6rem))] lg:rounded-[2rem] lg:bg-blush-50  lg:ring-1 lg:ring-plum/6 lg:[--surface:var(--color-blush-50)]">
          <FlowHeader />
          <AnimatePresence
            mode="wait"
            initial={false}
            custom={direction}
            onExitComplete={() => window.scrollTo({ top: 0 })}
          >
            <motion.div
              key={step}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-1 flex-col"
            >
              <StepView step={step} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </MotionConfig>
  );
}