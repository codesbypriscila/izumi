"use client";

import { Calendar, Check, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Field } from "@/components/ui/Field";
import { Stepper } from "@/components/ui/Stepper";
import { seatings } from "@/data/site";
import { localeTags } from "@/i18n/config";
import { format, type Dictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/I18nProvider";
import { easeExpo } from "@/lib/animations";

interface FormState {
  name: string;
  email: string;
  date: string;
  seating: string;
  guests: number;
  notes: string;
}

type ErrorKey = keyof Dictionary["form"]["errors"];
type Errors = Partial<Record<keyof FormState, ErrorKey>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EMPTY: FormState = { name: "", email: "", date: "", seating: "20:30", guests: 2, notes: "" };

const today = () => new Date().toISOString().slice(0, 10);

/** Returns error keys (not messages) so errors re-translate when the language changes. */
function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (form.name.trim().length < 2) errors.name = "name";
  if (!EMAIL_RE.test(form.email)) errors.email = "email";
  if (!form.date) errors.date = "date";
  else if (form.date < today()) errors.date = "past";
  else if ([0, 1].includes(new Date(`${form.date}T12:00`).getDay())) errors.date = "closed";
  if (!form.seating) errors.seating = "seating";
  return errors;
}

export function ReservationForm() {
  const { locale, dict } = useI18n();
  const t = dict.form;
  const [form, setForm] = useState<FormState>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [reference, setReference] = useState("");

  const errors = validate(form);
  const show = (key: keyof FormState) => {
    const error = touched[key] ? errors[key] : undefined;
    return error ? t.errors[error] : undefined;
  };
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));
  const touch = (key: keyof FormState) => () => setTouched((tc) => ({ ...tc, [key]: true }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, date: true, seating: true });
    if (Object.keys(errors).length > 0) return;
    setStatus("submitting");
    // Demo only — no backend. Simulate the round-trip.
    await new Promise((r) => setTimeout(r, 1200));
    setReference(`IZM-${Math.floor(1000 + Math.random() * 9000)}`);
    setStatus("success");
  };

  const reset = () => {
    setForm(EMPTY);
    setTouched({});
    setStatus("idle");
  };

  const formattedDate = form.date
    ? new Date(`${form.date}T12:00`).toLocaleDateString(localeTags[locale], { weekday: "short", day: "numeric", month: "short" })
    : "";

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status !== "success" ? (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            className="flex flex-col gap-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: easeExpo }}
          >
            <div className="grid gap-8 sm:grid-cols-2">
              <Field
                label={t.name}
                name="name"
                autoComplete="name"
                placeholder={t.namePlaceholder}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                onBlur={touch("name")}
                error={show("name")}
                valid={touched.name && !errors.name}
              />
              <Field
                label={t.email}
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t.emailPlaceholder}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                onBlur={touch("email")}
                error={show("email")}
                valid={touched.email && !errors.email}
              />
            </div>

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-[1fr_1.2fr_0.9fr] lg:grid-cols-2 xl:grid-cols-[1fr_1.2fr_0.9fr]">
              <Field
                label={t.date}
                name="date"
                type="date"
                lang={locale}
                min={today()}
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                onBlur={touch("date")}
                error={show("date")}
                icon={Calendar}
                className="[&_input]:min-h-[1.75rem]"
              />
              <fieldset className="flex flex-col gap-2.5">
                <legend className="label-caps mb-2.5 text-[0.625rem] text-muted">{t.seating}</legend>
                <div className="flex flex-wrap gap-2">
                  {seatings.map((s) => (
                    <Chip
                      key={s.time}
                      selected={form.seating === s.time}
                      disabled={!s.available}
                      onClick={() => set("seating", s.time)}
                      aria-label={s.available ? s.time : `${s.time} — ${t.soldOut}`}
                      className="px-4 py-2"
                    >
                      {s.time}
                    </Chip>
                  ))}
                </div>
              </fieldset>
              <Stepper
                label={t.guests}
                addLabel={t.addGuest}
                removeLabel={t.removeGuest}
                value={form.guests}
                min={1}
                max={8}
                onChange={(v) => set("guests", v)}
              />
            </div>

            <Field
              label={t.notes}
              name="notes"
              placeholder={t.notesPlaceholder}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />

            <div className="flex flex-col-reverse items-start gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted">{t.policy}</p>
              <Button
                type="submit"
                disabled={status === "submitting"}
                icon={status === "submitting" ? null : undefined}
                className="w-full sm:w-auto"
              >
                {status === "submitting" ? (
                  <span className="flex items-center gap-2.5">
                    <LoaderCircle aria-hidden className="size-4 animate-spin" />
                    {t.submitting}
                  </span>
                ) : (
                  t.submit
                )}
              </Button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            role="status"
            className="paper flex flex-col items-center gap-4 rounded-[4px] px-6 py-12 text-center text-ink md:py-16"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: easeExpo }}
          >
            <motion.span
              className="grid size-14 place-items-center rounded-full bg-red text-paper"
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 12, delay: 0.25 }}
            >
              <Check aria-hidden className="size-6" />
            </motion.span>
            <p className="font-display text-4xl italic">{format(t.success.title, { name: form.name.trim().split(" ")[0] ?? "" })}</p>
            <p className="text-sm leading-relaxed text-sumi">
              {formattedDate} · {form.seating} · {form.guests} {form.guests === 1 ? t.success.guest : t.success.guests}
              <br />
              {format(t.success.confirmation, { email: form.email })}
            </p>
            <p className="label-caps text-[0.625rem] font-bold text-red">
              {t.success.reference} · {reference}
            </p>
            <button type="button" onClick={reset} className="mt-2 text-xs text-sumi underline underline-offset-4 hover:text-ink">
              {t.success.another}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
