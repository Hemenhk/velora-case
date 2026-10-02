"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFlow } from "@/lib/store";
import { contactSchema, type ContactValues } from "@/lib/schemas";
import { endTime, formatLongDate, parseSlot } from "@/lib/slots";
import { capitalize } from "@/lib/utils";
import { Field, StepBody, StepFooter, StepIntro } from "../primitives";

export function DetailsStep() {
  const slot = useFlow((s) => s.slot);
  const contact = useFlow((s) => s.contact);
  const setContact = useFlow((s) => s.setContact);
  const next = useFlow((s) => s.next);
  const goTo = useFlow((s) => s.goTo);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: contact ?? { firstName: "", phone: "", email: "" },
  });

  const onSubmit = async (values: ContactValues) => {
    await new Promise((r) => setTimeout(r, 900)); // mocked booking request
    setContact(values);
    next();
  };

  return (
    <>
      <StepBody>
        <StepIntro title="Nästan klart" lead="Vart ska vi skicka bekräftelsen och länken till samtalet?" />

        {slot && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-plum/10">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blush text-berry">
              <CalendarClock className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[16px] font-semibold leading-tight">{capitalize(formatLongDate(parseSlot(slot)))}</p>
              <p className="mt-0.5 text-[14px] tabular-nums text-plum/60">
                {slot.slice(11)}–{endTime(slot)} · Videosamtal
              </p>
            </div>
            <Button variant="link" size="sm" className="px-2" onClick={() => goTo("booking")}>
              Ändra
            </Button>
          </div>
        )}

        <form
          id="details-form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-4"
        >
          <Field
            id="firstName"
            label="Förnamn"
            autoComplete="given-name"
            autoCapitalize="words"
            enterKeyHint="next"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Field
            id="phone"
            label="Mobilnummer"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="070 123 45 67"
            enterKeyHint="next"
            hint="Hit skickar vi länken till samtalet och en påminnelse."
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Field
            id="email"
            label="E-post"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="namn@exempel.se"
            enterKeyHint="done"
            error={errors.email?.message}
            {...register("email")}
          />
        </form>

        <p className="mt-6 text-[13px] leading-relaxed text-plum/60">
          När du bokar delar vi dina svar med vårdpersonalen du ska träffa. Läs mer i våra{" "}
          <a href="#" className="font-semibold text-plum underline underline-offset-2">
            användarvillkor
          </a>{" "}
          och hur vi{" "}
          <a href="#" className="font-semibold text-plum underline underline-offset-2">
            hanterar personuppgifter
          </a>
          .
        </p>
      </StepBody>
      <StepFooter>
        <Button size="lg" type="submit" form="details-form" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              Bokar …
            </>
          ) : (
            "Boka samtalet"
          )}
        </Button>
      </StepFooter>
    </>
  );
}