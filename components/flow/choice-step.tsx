"use client";

import { useId, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFlow } from "@/lib/store";
import type { ChoiceQuestion, Option } from "@/lib/quiz";
import { cn } from "@/lib/utils";
import { CareNote, StepBody, StepFooter, StepIntro } from "./primitives";

const EMPTY: string[] = [];

export function ChoiceStep({ question }: { question: ChoiceQuestion }) {
  const titleId = useId();
  const next = useFlow((s) => s.next);
  const setGoal = useFlow((s) => s.setGoal);
  const toggle = useFlow((s) => s.toggle);
  const goal = useFlow((s) => s.answers.goal);
  const multi = useFlow((s) => (question.kind === "multi" ? s.answers[question.id] : EMPTY));
  const advancing = useRef(false);

  const isSingle = question.kind === "single";
  const selected = isSingle ? (goal ? [goal] : EMPTY) : multi;

  const pick = (id: string) => {
    if (question.kind === "single") {
      // One tap answers and moves on, after a beat so the selection registers
      if (advancing.current) return;
      advancing.current = true;
      setGoal(id);
      window.setTimeout(next, 360);
    } else {
      toggle(question.id, id, question.exclusive);
    }
  };

  const note =
    question.kind === "multi" && selected.length ? (question.affirm?.(selected) ?? null) : null;

  return (
    <>
      <StepBody>
        <StepIntro id={titleId} title={question.title} lead={question.lead} />
        <div
          role={isSingle ? "radiogroup" : "group"}
          aria-labelledby={titleId}
          className="mt-6 flex flex-col gap-2.5"
        >
          {question.options.map((option, i) => (
            <OptionRow
              key={option.id}
              option={option}
              index={i}
              single={isSingle}
              selected={selected.includes(option.id)}
              onSelect={() => pick(option.id)}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">{note && <CareNote key={note} text={note} />}</AnimatePresence>
      </StepBody>
      {!isSingle && (
        <StepFooter>
          <Button size="lg" disabled={!selected.length} onClick={next}>
            Fortsätt
          </Button>
        </StepFooter>
      )}
    </>
  );
}

function OptionRow({
  option,
  index,
  single,
  selected,
  onSelect,
}: {
  option: Option;
  index: number;
  single: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      role={single ? "radio" : "checkbox"}
      aria-checked={selected}
      data-selected={selected}
      onClick={onSelect}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.035, duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      whileTap={{ scale: 0.985 }}
      className="flex min-h-14 w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left ring-1 ring-plum/10 outline-none transition-[box-shadow,background-color] duration-200 hover:ring-plum/25 focus-visible:ring-2 focus-visible:ring-berry/50 data-[selected=true]:bg-petal data-[selected=true]:ring-2 data-[selected=true]:ring-berry"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-medium leading-snug text-plum">{option.label}</span>
        {option.hint && <span className="mt-0.5 block text-[14px] text-plum/55">{option.hint}</span>}
      </span>
      <span
        aria-hidden
        className={cn(
          "grid size-6 shrink-0 place-items-center rounded-[7px] border-2 transition-colors duration-200",
          selected ? "border-berry bg-berry" : "border-plum/25 bg-white",
        )}
      >
        <motion.span
          initial={false}
          animate={{ scale: selected ? 1 : 0.3, opacity: selected ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
        >
          <Check className="size-3.5 text-white" strokeWidth={3.5} />
        </motion.span>
      </span>
    </motion.button>
  );
}