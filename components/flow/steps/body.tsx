"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFlow } from "@/lib/store";
import { bodySchema, toNumber, type BodyValues } from "@/lib/schemas";
import { Field, StepBody, StepFooter, StepIntro } from "../primitives";

export function BodyStep() {
  const saved = useFlow((s) => s.answers.body);
  const setBody = useFlow((s) => s.setBody);
  const next = useFlow((s) => s.next);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BodyValues>({
    resolver: zodResolver(bodySchema),
    mode: "onTouched",
    defaultValues: saved,
  });

  const numeric = { setValueAs: toNumber };
  const onSubmit = (values: BodyValues) => {
    setBody(values);
    next();
  };

  return (
    <>
      <StepBody>
        <StepIntro
          title="Lite om dig"
          lead="Med ålder, längd och vikt kan vi se om medicinsk behandling kan vara rätt för dig."
        />
        <form id="body-form" noValidate onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
          <Field
            id="age"
            label="Ålder"
            unit="år"
            inputMode="numeric"
            autoComplete="off"
            enterKeyHint="next"
            error={errors.age?.message}
            {...register("age", numeric)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              id="height"
              label="Längd"
              unit="cm"
              inputMode="decimal"
              autoComplete="off"
              enterKeyHint="next"
              error={errors.height?.message}
              {...register("height", numeric)}
            />
            <Field
              id="weight"
              label="Vikt"
              unit="kg"
              inputMode="decimal"
              autoComplete="off"
              enterKeyHint="done"
              error={errors.weight?.message}
              {...register("weight", numeric)}
            />
          </div>
        </form>
        <p className="mt-6 flex gap-2 text-[14px] leading-snug text-plum/60">
          <Lock className="mt-0.5 size-4 shrink-0" />
          Dina svar är skyddade och används bara av vårdpersonalen som bedömer dig.
        </p>
      </StepBody>
      <StepFooter>
        <Button size="lg" type="submit" form="body-form">
          Fortsätt
        </Button>
      </StepFooter>
    </>
  );
}