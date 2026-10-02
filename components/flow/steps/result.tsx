"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { ArrowRight, HeartHandshake, TestTube, Video, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFlow } from "@/lib/store";
import { assess, personalSummary } from "@/lib/quiz";
import { buildDays, firstAvailable, parseSlot, relativeDay } from "@/lib/slots";
import { cn } from "@/lib/utils";
import { StepBody, StepFooter, StepHeading } from "../primitives";

type JourneyStep = { icon: LucideIcon; title: string; detail: string };

const JOURNEY: JourneyStep[] = [
  { icon: Video, title: "Samtal med vården", detail: "15 min via video. Du behöver inte förbereda något." },
  { icon: TestTube, title: "Hälsokontroll", detail: "Blodprover nära dig, så att behandlingen blir säker." },
  { icon: HeartHandshake, title: "Behandling och stöd", detail: "Din plan, med vårdteamet vid din sida." },
];

export function ResultStep() {
  const answers = useFlow((s) => s.answers);
  const next = useFlow((s) => s.next);
  const goTo = useFlow((s) => s.goTo);
  const { eligible } = assess(answers);
  const summary = personalSummary(answers);

  const firstSlot = useMemo(() => firstAvailable(buildDays()), []);
  const firstSlotLabel = firstSlot ? `${relativeDay(parseSlot(firstSlot))} kl. ${firstSlot.slice(11)}` : null;

  if (!eligible) {
    return (
      <>
        <StepBody className="pt-8">
          <StepHeading as="h1" className="text-[32px]">
            Tack för dina svar
          </StepHeading>
          <p className="mt-5 text-[17px] leading-relaxed text-plum/80">
            Utifrån det du har berättat är medicinsk behandling kanske inte rätt för dig just nu. Det
            handlar bara om vad som är medicinskt säkert, inte om dig.
          </p>
          <p className="mt-8 rounded-2xl bg-white/65 p-4 text-[15px] font-medium leading-snug text-muted-foreground ring-1 ring-plum/8">
            Prototypen visar bara flödet för den som kan få behandling. Ändra dina svar för att se det,
            till exempel en vikt som ger BMI 30 eller högre.
          </p>
        </StepBody>
        <StepFooter>
          <Button size="lg" variant="secondary" onClick={() => goTo("body")}>
            Ändra mina svar
          </Button>
        </StepFooter>
      </>
    );
  }

  return (
    <>
      <StepBody className="pt-8">
        <StepHeading as="h1" className="text-[36px] leading-[1.06]">
          Medicinsk behandling kan passa dig
        </StepHeading>
        {summary && (
          <p className="mt-5 text-[18px] leading-relaxed text-pretty text-plum/80">
            {summary} Vi hjälper dig dit.
          </p>
        )}

        <section className="mt-10 rounded-3xl bg-white px-6 py-7 ring-1 ring-plum/8">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-berry">Nästa steg</p>
          <h2 className="mt-2 font-display text-[24px] font-medium leading-tight text-balance">
            Ett kostnadsfritt samtal med vården
          </h2>

          <ol className="mt-7 flex flex-col">
            {JOURNEY.map((step, i) => (
              <JourneyRow key={step.title} step={step} index={i} last={i === JOURNEY.length - 1} />
            ))}
          </ol>
        </section>

        <figure className="mt-10 px-1">
          <blockquote className="font-display text-[19px] leading-snug text-plum">
            ”Velora är dom första som har tagit mig på allvar.”
          </blockquote>
          <figcaption className="mt-2 text-[14px] font-medium text-muted-foreground">
            Nathalie, omdöme på Trustpilot
          </figcaption>
        </figure>
      </StepBody>
      <StepFooter note={firstSlotLabel ? `Första lediga tid: ${firstSlotLabel}` : undefined}>
        <Button size="lg" onClick={next}>
          Välj en tid
          <ArrowRight />
        </Button>
      </StepFooter>
    </>
  );
}

/** One stop on the journey. The first stop is what the person books now, so it is highlighted. */
function JourneyRow({ step, index, last }: { step: JourneyStep; index: number; last: boolean }) {
  const current = index === 0;
  const Icon = step.icon;
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className={cn("relative flex gap-4", !last && "pb-6")}
    >
      {!last && (
        <span
          aria-hidden
          className={cn(
            "absolute top-12 bottom-1 left-6 w-0.5 -translate-x-1/2 rounded-full",
            current ? "bg-gradient-to-b from-berry/40 to-plum/10" : "bg-plum/10",
          )}
        />
      )}
      <span
        className={cn(
          "grid size-12 shrink-0 place-items-center rounded-full",
          current ? "bg-berry text-white" : "bg-blush text-berry",
        )}
      >
        <Icon className="size-[22px]" strokeWidth={2} />
      </span>
      <div className="min-w-0 pt-0.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-[17px] font-semibold leading-snug">{step.title}</p>
          {current && (
            <span className="rounded-full bg-petal px-2 py-0.5 text-[12px] font-semibold text-berry">
              Gratis
            </span>
          )}
        </div>
        <p className="mt-1 text-[15px] leading-snug text-muted-foreground">{step.detail}</p>
      </div>
    </motion.li>
  );
}