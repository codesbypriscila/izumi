"use client";

import { Calendar, LoaderCircle } from "lucide-react";
import { useCallback, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Field } from "@/components/ui/Field";
import { Stepper } from "@/components/ui/Stepper";
import { seatings } from "@/data/site";
import { localeTags } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/I18nProvider";
import { ReservationSuccess } from "./ReservationSuccess";

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

interface Confirmation {
  name: string;
  email: string;
  summary: string;
  reference: string;
}

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
  const [submitting, setSubmitting] = useState(false);
  // Kept after closing so the dialog keeps its content during the exit animation.
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
    setSubmitting(true);
    // Demo only — no backend. Simulate the round-trip.
    await new Promise((r) => setTimeout(r, 1200));
    const formattedDate = new Date(`${form.date}T12:00`).toLocaleDateString(localeTags[locale], {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    setConfirmation({
      name: form.name.trim().split(" ")[0] ?? "",
      email: form.email,
      summary: `${formattedDate} · ${form.seating} · ${form.guests} ${form.guests === 1 ? t.success.guest : t.success.guests}`,
      reference: `IZM-${Math.floor(1000 + Math.random() * 9000)}`,
    });
    setSubmitting(false);
    setModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setForm(EMPTY);
    setTouched({});
  }, []);

  return (
    <>
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-8">
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
            disabled={submitting}
            icon={submitting ? null : undefined}
            className="w-full sm:w-auto"
          >
            {submitting ? (
              <span className="flex items-center gap-2.5">
                <LoaderCircle aria-hidden className="size-4 animate-spin" />
                {t.submitting}
              </span>
            ) : (
              t.submit
            )}
          </Button>
        </div>
      </form>

      {confirmation && <ReservationSuccess open={modalOpen} onClose={closeModal} {...confirmation} />}
    </>
  );
}
