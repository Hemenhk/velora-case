
"use client";

import { motion } from "motion/react";
import { RotateCcw, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFlow } from "@/lib/store";
import { endTime, parseSlot } from "@/lib/slots";
import { capitalize, formatPhone } from "@/lib/utils";
import { StepBody, StepHeading } from "../primitives";

const WHAT_NEXT = [
  { title: "Bekräftelse på SMS och e-post", body: "Med länk till samtalet och en kalenderinbjudan." },
  { title: "Påminnelse innan samtalet", body: "Vi skickar ett SMS en timme innan." },
  {
    title: "Ert samtal, 15 minuter",
    body: "Sitt gärna någonstans där du kan prata ostört. Du behöver inte förbereda något.",
  },
];

const weekdayFormat = new Intl.DateTimeFormat("sv-SE", { weekday: "long" });
const monthFormat = new Intl.DateTimeFormat("sv-SE", { month: "short" });

export function ConfirmationStep() {
  const slot = useFlow((s) => s.slot);
  const contact = useFlow((s) => s.contact);
  const restart = useFlow((s) => s.restart);
  if (!slot || !contact) return null;

  const date = parseSlot(slot);
  const weekday = capitalize(weekdayFormat.format(date));
  const month = monthFormat.format(date).replace(".", "");

  return (
    <StepBody className="pt-8">
      <Celebration />

      <StepHeading as="h1" className="mt-7 text-[34px] leading-[1.06]">
        Du är bokad, {contact.firstName}
      </StepHeading>
      <p className="mt-3 text-[17px] leading-relaxed text-plum/80">
        Vi ser fram emot att träffa dig. Allt du behöver kommer på SMS och e-post.
      </p>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
        className="mt-8 rounded-3xl bg-white p-4 ring-1 ring-plum/8"
        aria-label="Ditt samtal"
      >
        <div className="flex items-center gap-4">
          {/* Calendar-style date tile */}
          <div className="w-16 shrink-0 overflow-hidden rounded-2xl text-center ring-1 ring-inset ring-plum/10">
            <p className="bg-berry py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white">{month}</p>
            <p className="py-2 font-display text-[30px] font-medium leading-none tabular-nums text-plum">
              {date.getDate()}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[18px] font-semibold leading-snug">{weekday}</p>
            <p className="text-[17px] tabular-nums leading-snug">
              kl. {slot.slice(11)}–{endTime(slot)}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-[14px] font-medium text-muted-foreground">
              <Video className="size-4 shrink-0" /> Videosamtal med vårdpersonal
            </p>
          </div>
        </div>
        <p className="mt-4 border-t border-dashed border-plum/15 pt-3.5 text-[14px] font-medium leading-relaxed text-muted-foreground">
          Länk och bekräftelse skickas till{" "}
          <span className="whitespace-nowrap text-plum">{formatPhone(contact.phone)}</span> och{" "}
          <span className="break-all text-plum">{contact.email}</span>
        </p>
      </motion.section>

      <h2 className="mt-10 font-display text-[23px] font-medium">Det här händer nu</h2>
      <ol className="mt-4 flex flex-col gap-4">
        {WHAT_NEXT.map((item, i) => (
          <li key={item.title} className="flex gap-3.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-[13px] font-semibold tabular-nums text-berry ring-1 ring-plum/10">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[16px] font-semibold leading-snug">{item.title}</p>
              <p className="mt-0.5 text-[15px] leading-snug text-muted-foreground">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-7 text-[14px] font-medium leading-relaxed text-muted-foreground">
        Behöver du byta tid? Använd länken i SMS:et, så hittar du en ny tid på en minut.
      </p>

      <div className="mt-10 flex justify-center">
        <Button variant="ghost" size="sm" onClick={restart} className="text-muted-foreground">
          <RotateCcw className="size-4" />
          Starta om demot
        </Button>
      </div>
    </StepBody>
  );
}

/* ------------------------------------------------------------------
   Celebration: the emoji pops in while a small burst of confetti in
   the brand colours flies out behind it.
   ------------------------------------------------------------------ */

const CONFETTI_COLORS = ["#a71e67", "#751a4b", "#c95a94", "#e3a6c4"];
const CONFETTI = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2 + (i % 2 ? 0.2 : -0.1);
  const distance = 58 + (i % 3) * 12;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    rotate: (i % 2 ? 1 : -1) * (120 + i * 15),
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    round: i % 3 === 0,
  };
});

function Celebration() {
  return (
    <div className="relative size-24">
      {CONFETTI.map((piece, i) => (
        <motion.span
          key={i}
          aria-hidden
          className={piece.round ? "absolute top-1/2 left-1/2 size-2 rounded-full" : "absolute top-1/2 left-1/2 h-2.5 w-1.5 rounded-[2px]"}
          style={{ backgroundColor: piece.color, marginLeft: -4, marginTop: -5 }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4, rotate: 0 }}
          animate={{ x: piece.x, y: piece.y, opacity: [0, 1, 1, 0], scale: 1, rotate: piece.rotate }}
          transition={{ delay: 0.18, duration: 1.1, ease: [0.16, 1, 0.3, 1], opacity: { delay: 0.18, duration: 1.1, times: [0, 0.1, 0.65, 1] } }}
        />
      ))}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        className="relative grid size-24 place-items-center rounded-full bg-white ring-1 ring-plum/8"
      >
        <motion.span
          aria-hidden
          className="select-none text-[52px] leading-none"
          initial={{ rotate: -25, scale: 0.6 }}
          animate={{ rotate: [-25, 12, -6, 0], scale: 1 }}
          transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
        >
          🎉
        </motion.span>
      </motion.div>
    </div>
  );
}