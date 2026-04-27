"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { clsx } from "clsx";

function parseDate(value?: string) {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

function formatValue(date?: Date) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatLabel(date?: Date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

type DatePickerFieldProps = {
  name: string;
  defaultValue?: string;
  ariaLabel: string;
  placeholder: string;
  buttonClassName?: string;
  popoverAlign?: "left" | "right";
};

export function DatePickerField({
  name,
  defaultValue,
  ariaLabel,
  placeholder,
  buttonClassName,
  popoverAlign = "left",
}: DatePickerFieldProps) {
  const fieldId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => parseDate(defaultValue));

  useEffect(() => {
    setSelectedDate(parseDate(defaultValue));
  }, [defaultValue]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const monthCaption = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }),
    [],
  );

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={formatValue(selectedDate)} />
      <button
        id={fieldId}
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
        className={clsx(
          "flex w-full items-center justify-between rounded-xl border border-violet-200 bg-white px-3 py-2 text-left text-sm text-slate-900 focus:border-violet-500",
          !selectedDate && "text-slate-400",
          buttonClassName,
        )}
      >
        <span>{selectedDate ? formatLabel(selectedDate) : placeholder}</span>
        <Calendar size={18} className="shrink-0 text-slate-500" />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby={fieldId}
          className={clsx(
            "absolute z-50 mt-2 w-[320px] rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/15",
            popoverAlign === "right" ? "right-0" : "left-0",
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{placeholder}</p>
            <button
              type="button"
              onClick={() => {
                setSelectedDate(undefined);
                setOpen(false);
              }}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <X size={14} />
              Clear
            </button>
          </div>

          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setOpen(false);
            }}
            showOutsideDays
            weekStartsOn={0}
            classNames={{
              root: "rdp-root",
              month: "space-y-3",
              month_caption: "flex items-center justify-center gap-2 text-sm font-semibold text-slate-900",
              caption_label: "text-sm font-semibold text-slate-900",
              nav: "flex items-center gap-1",
              button_previous:
                "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900",
              button_next:
                "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900",
              month_grid: "w-full border-collapse",
              weekdays: "grid grid-cols-7 gap-1",
              weekday: "text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500",
              week: "mt-1 grid grid-cols-7 gap-1",
              day: "h-10 w-10 p-0 font-medium",
              day_button:
                "h-10 w-10 rounded-xl text-sm text-slate-800 transition hover:bg-slate-100 aria-selected:bg-cyan-600 aria-selected:text-white",
              today: "font-bold text-cyan-700",
              selected: "bg-transparent",
              outside: "text-slate-300",
              disabled: "text-slate-300",
            }}
            components={{
              Chevron: ({ orientation, className }) =>
                orientation === "left" ? (
                  <ChevronLeft className={className} size={16} />
                ) : (
                  <ChevronRight className={className} size={16} />
                ),
              MonthCaption: ({ calendarMonth, ...props }) => (
                <div {...props}>
                  {monthCaption.format(calendarMonth.date)}
                </div>
              ),
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
