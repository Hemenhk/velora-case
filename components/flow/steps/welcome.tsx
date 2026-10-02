// "use client";

// import { ArrowRight, ShieldCheck, Stethoscope, Users, Video } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useFlow } from "@/lib/store";
// import { StepBody, StepFooter, StepHeading } from "../primitives";

// const BENEFITS = [
//   { icon: Stethoscope, title: "Legitimerade läkare", detail: "Behandling anpassad efter din hälsa" },
//   { icon: Video, title: "Första samtalet är gratis", detail: "15 minuter via video, utan förpliktelser" },
//   { icon: ShieldCheck, title: "Tryggt och diskret", detail: "Bara vårdpersonal ser dina svar" },
// ];

// export function WelcomeStep() {
//   const next = useFlow((s) => s.next);
//   return (
//     <>
//       <StepBody className="pt-5">
//         <p className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[13px] font-semibold text-berry ring-1 ring-berry/15">
//           Medicinsk viktminskning
//         </p>
//         <StepHeading as="h1" className="mt-4 text-[36px] leading-[1.04] sm:text-[40px]">
//           Gå ner i vikt med vården vid din sida
//         </StepHeading>
//         <p className="mt-4 text-[17px] leading-relaxed text-pretty text-plum/75">
//           Svara på sex korta frågor så ser du direkt om behandling kan passa dig. Sedan bokar du ett
//           kostnadsfritt samtal med vårdpersonal.
//         </p>

//         <ul className="mt-6 divide-y divide-plum/8 overflow-hidden rounded-2xl bg-white ring-1 ring-plum/8">
//           {BENEFITS.map(({ icon: Icon, title, detail }) => (
//             <li key={title} className="flex items-center gap-3.5 px-4 py-3.5">
//               <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blush text-berry">
//                 <Icon className="size-5" />
//               </span>
//               <div className="min-w-0">
//                 <p className="text-[16px] font-semibold leading-tight">{title}</p>
//                 <p className="mt-0.5 text-[14px] text-plum/60">{detail}</p>
//               </div>
//             </li>
//           ))}
//         </ul>

//         <p className="mt-5 flex items-center gap-2 text-[14px] text-plum/70">
//           <Users className="size-4 shrink-0 text-berry" />
//           <span>
//             <span className="font-semibold text-plum">Över 5 000 personer</span> har börjat här
//           </span>
//         </p>
//       </StepBody>
//       <StepFooter note="Tar ungefär 2 minuter">
//         <Button size="lg" onClick={next}>
//           Kom igång
//           <ArrowRight />
//         </Button>
//       </StepFooter>
//     </>
//   );
// }
"use client";

import { motion, type Variants } from "motion/react";
import { ArrowRight, ShieldCheck, Stethoscope, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFlow } from "@/lib/store";
import { StepBody, StepFooter, StepHeading } from "../primitives";

const BENEFITS = [
  { icon: Stethoscope, title: "Legitimerade läkare", detail: "Behandling anpassad efter din hälsa" },
  { icon: Video, title: "Första samtalet är gratis", detail: "15 minuter via video, utan förpliktelser" },
  { icon: ShieldCheck, title: "Tryggt och diskret", detail: "Bara vårdpersonal ser dina svar" },
];

const ease = [0.32, 0.72, 0, 1] as const;

/** One orchestrated entrance: heading, text, card and proof rise in after each other. */
const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.08 + i * 0.09, duration: 0.55, ease } }),
};

export function WelcomeStep() {
  const next = useFlow((s) => s.next);
  return (
    <>
      <StepBody className="pt-8">
        <motion.div custom={0} variants={rise} initial="hidden" animate="show">
          <StepHeading as="h1" className="text-[38px] leading-[1.04] tracking-[-0.02em] sm:text-[42px]">
            Gå ner i vikt med vården <span className="text-berry">vid din sida</span>
          </StepHeading>
        </motion.div>

        <motion.p
          custom={1}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-5 text-[17px] leading-relaxed text-pretty text-plum/80"
        >
          Du behöver inte klara det på egen hand. Svara på sex korta frågor så ser du direkt om
          medicinsk behandling kan passa dig.
        </motion.p>

        <motion.ul
          custom={2}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-8 divide-y divide-plum/8 overflow-hidden rounded-3xl bg-white shadow-[0_24px_48px_-32px_rgb(117_26_75/0.35)] ring-1 ring-plum/8"
        >
          {BENEFITS.map(({ icon: Icon, title, detail }) => (
            <li key={title} className="flex items-center gap-4 px-5 py-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-blush text-berry">
                <Icon className="size-5" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <p className="text-[16px] font-semibold leading-tight">{title}</p>
                <p className="mt-1 text-[14px] font-medium leading-snug text-muted-foreground">{detail}</p>
              </div>
            </li>
          ))}
        </motion.ul>

        <motion.p
          custom={3}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-6 flex items-center justify-center gap-2 text-[14px] font-medium text-muted-foreground"
        >
          <Users className="size-4 shrink-0 text-berry" />
          <span>
            <span className="font-semibold text-plum">Över 5 000 personer</span> har börjat här
          </span>
        </motion.p>
      </StepBody>
      <StepFooter note="Tar ungefär 2 minuter">
        <Button size="lg" onClick={next}>
          Se om behandling passar mig
          <ArrowRight />
        </Button>
      </StepFooter>
    </>
  );
}