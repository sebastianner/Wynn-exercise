"use client";

import { useState } from "react";

import Image from "next/image";

import { useReservationStore } from "@/lib/store/reservationStore";

import chevronLeftIcon from "@/assets/icons/chevron-left.svg";
import chevronRightIcon from "@/assets/icons/chevron-right.svg";
import minusIcon from "@/assets/icons/minus.svg";
import plusIcon from "@/assets/icons/plus.svg";

import { CALENDAR_TEXT, WEEKDAY_LABELS } from "./constants";
import styles from "./Calendar.module.scss";

export interface CalendarProps {
  /** How many months to render, side by side on desktop / stacked on mobile. */
  monthsToShow?: number;
  /** Called after check-in/check-out, rooms, guests, and promo code are committed to the reservation store. */
  onUpdate?: () => void;
  /** Called after the draft has been reset back to the reservation store's current values. */
  onReset?: () => void;
}

const MIN_COUNT = 1;
const MAX_COUNT = 9;
const DEFAULT_MONTHS_TO_SHOW = 3;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBeforeDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

function isWithinRange(day: Date, start: Date, end: Date): boolean {
  const time = startOfDay(day).getTime();
  return time > startOfDay(start).getTime() && time < startOfDay(end).getTime();
}

function getMonthGrid(year: number, month: number): (Date | null)[][] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = new Date(year, month, 1).getDay();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, month, day));
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export default function Calendar({ monthsToShow = DEFAULT_MONTHS_TO_SHOW, onUpdate, onReset }: CalendarProps) {
  const reservation = useReservationStore();
  const today = startOfDay(new Date());
  const earliestMonth = addMonths(today, 0);

  const [viewStart, setViewStart] = useState(earliestMonth);
  const [checkIn, setCheckIn] = useState<Date>(() => reservation.checkIn);
  const [checkOut, setCheckOut] = useState<Date | null>(() => reservation.checkOut);
  const [activeField, setActiveField] = useState<"checkIn" | "checkOut">("checkIn");
  const [rooms, setRooms] = useState(() => reservation.rooms);
  const [guestsPerRoom, setGuestsPerRoom] = useState(() => reservation.guestsPerRoom);
  const [promoCode, setPromoCode] = useState(() => reservation.promoCode);

  const canGoToPreviousMonth =
    viewStart.getFullYear() > earliestMonth.getFullYear() ||
    (viewStart.getFullYear() === earliestMonth.getFullYear() && viewStart.getMonth() > earliestMonth.getMonth());

  function handleSelectDay(day: Date) {
    if (isBeforeDay(day, today)) return;

    if (activeField === "checkIn") {
      setCheckIn(day);
      if (checkOut !== null && !isBeforeDay(day, checkOut)) {
        setCheckOut(null);
      }
      setActiveField("checkOut");
      return;
    }

    // Picking check-out: only accept a date strictly after check-in.
    if (!isBeforeDay(checkIn, day)) return;
    setCheckOut(day);
  }

  function handleReset() {
    setViewStart(earliestMonth);
    setCheckIn(reservation.checkIn);
    setCheckOut(reservation.checkOut);
    setActiveField("checkIn");
    setRooms(reservation.rooms);
    setGuestsPerRoom(reservation.guestsPerRoom);
    setPromoCode(reservation.promoCode);
    onReset?.();
  }

  function handleUpdate() {
    reservation.setDates(checkIn, checkOut);
    reservation.setRooms(rooms);
    reservation.setGuestsPerRoom(guestsPerRoom);
    reservation.setPromoCode(promoCode);
    onUpdate?.();
  }

  const months = Array.from({ length: monthsToShow }, (_, index) => addMonths(viewStart, index));

  return (
    <div className={styles.calendar}>
      <div className="tw:flex tw:flex-col tw:gap-4 tw:border-b tw:border-black/10 tw:px-4 tw:py-4 tw:md:flex-row tw:md:items-end tw:md:gap-6 tw:md:px-6">
        <div className="tw:flex tw:flex-col tw:gap-1">
          <span className={`${styles.fieldLabel} tw:text-xs tw:font-semibold`}>{CALENDAR_TEXT.checkInLabel}</span>
          <button
            type="button"
            className={`${styles.dateField} ${activeField === "checkIn" ? styles.dateFieldActive : ""}`}
            aria-label={`${CALENDAR_TEXT.checkInLabel}, ${formatShortDate(checkIn)}`}
            aria-pressed={activeField === "checkIn"}
            onClick={() => setActiveField("checkIn")}
          >
            {formatShortDate(checkIn)}
          </button>
        </div>
        <div className="tw:flex tw:flex-col tw:gap-1">
          <span className={`${styles.fieldLabel} tw:text-xs tw:font-semibold`}>{CALENDAR_TEXT.checkOutLabel}</span>
          <button
            type="button"
            className={`${styles.dateField} ${activeField === "checkOut" ? styles.dateFieldActive : ""}`}
            aria-label={`${CALENDAR_TEXT.checkOutLabel}, ${checkOut ? formatShortDate(checkOut) : CALENDAR_TEXT.selectADate}`}
            aria-pressed={activeField === "checkOut"}
            onClick={() => setActiveField("checkOut")}
          >
            {checkOut ? formatShortDate(checkOut) : CALENDAR_TEXT.selectADate}
          </button>
        </div>

        <div className="tw:flex tw:flex-col tw:gap-1">
          <span className={`${styles.fieldLabel} tw:text-xs tw:font-semibold`}>{CALENDAR_TEXT.roomsLabel}</span>
          <div className={styles.counter}>
            <button
              type="button"
              className={styles.counterButton}
              onClick={() => setRooms((n) => Math.max(MIN_COUNT, n - 1))}
              disabled={rooms <= MIN_COUNT}
              aria-label={CALENDAR_TEXT.decreaseRooms}
            >
              <Image
                src={minusIcon}
                alt={CALENDAR_TEXT.decreaseIconAlt}
                unoptimized
                width={12}
                height={12}
                className="tw:h-3 tw:w-3"
              />
            </button>
            <span aria-live="polite" className="tw:w-4 tw:text-center tw:text-sm">
              {rooms}
            </span>
            <button
              type="button"
              className={styles.counterButton}
              onClick={() => setRooms((n) => Math.min(MAX_COUNT, n + 1))}
              disabled={rooms >= MAX_COUNT}
              aria-label={CALENDAR_TEXT.increaseRooms}
            >
              <Image
                src={plusIcon}
                alt={CALENDAR_TEXT.increaseIconAlt}
                unoptimized
                width={12}
                height={12}
                className="tw:h-3 tw:w-3"
              />
            </button>
          </div>
        </div>

        <div className="tw:flex tw:flex-col tw:gap-1">
          <span className={`${styles.fieldLabel} tw:text-xs tw:font-semibold`}>
            {CALENDAR_TEXT.guestsPerRoomLabel}
          </span>
          <div className={styles.counter}>
            <button
              type="button"
              className={styles.counterButton}
              onClick={() => setGuestsPerRoom((n) => Math.max(MIN_COUNT, n - 1))}
              disabled={guestsPerRoom <= MIN_COUNT}
              aria-label={CALENDAR_TEXT.decreaseGuestsPerRoom}
            >
              <Image
                src={minusIcon}
                alt={CALENDAR_TEXT.decreaseIconAlt}
                unoptimized
                width={12}
                height={12}
                className="tw:h-3 tw:w-3"
              />
            </button>
            <span aria-live="polite" className="tw:w-4 tw:text-center tw:text-sm">
              {guestsPerRoom}
            </span>
            <button
              type="button"
              className={styles.counterButton}
              onClick={() => setGuestsPerRoom((n) => Math.min(MAX_COUNT, n + 1))}
              disabled={guestsPerRoom >= MAX_COUNT}
              aria-label={CALENDAR_TEXT.increaseGuestsPerRoom}
            >
              <Image
                src={plusIcon}
                alt={CALENDAR_TEXT.increaseIconAlt}
                unoptimized
                width={12}
                height={12}
                className="tw:h-3 tw:w-3"
              />
            </button>
          </div>
        </div>

        <div className="tw:flex tw:flex-col">
          <label htmlFor="calendar-promo-code" className={`${styles.fieldLabel} tw:text-xs tw:font-semibold`}>
            {CALENDAR_TEXT.promoCodeLabel}
          </label>
          <input
            id="calendar-promo-code"
            type="text"
            value={promoCode}
            onChange={(event) => setPromoCode(event.target.value)}
            className="tw:border-b tw:border-black/40 tw:text-sm tw:outline-none"
          />
        </div>
      </div>

      <div className="tw:relative tw:px-4 tw:py-4 tw:md:px-6">
        <div className={`${styles.months} tw:md:max-h-none tw:md:flex-row tw:md:gap-6 tw:md:overflow-visible`}>
          {months.map((month) => (
            <div className={styles.month} key={`${month.getFullYear()}-${month.getMonth()}`}>
              <p className={styles.monthTitle}>{formatMonthYear(month)}</p>
              <div className={styles.weekdayRow}>
                {WEEKDAY_LABELS.map((label) => (
                  <span key={label} className={styles.weekdayLabel}>
                    {label}
                  </span>
                ))}
              </div>
              {getMonthGrid(month.getFullYear(), month.getMonth()).map((week, weekIndex) => (
                <div className={styles.week} key={weekIndex}>
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return <span key={dayIndex} className={styles.dayEmpty} />;
                    }

                    const isPast = isBeforeDay(day, today);
                    const isCheckIn = isSameDay(day, checkIn);
                    const isCheckOut = checkOut !== null && isSameDay(day, checkOut);
                    const isInRange = checkOut !== null && isWithinRange(day, checkIn, checkOut);
                    const hasRange = checkOut !== null;
                    const isSelected = isCheckIn || isCheckOut || isInRange;

                    return (
                      <button
                        key={dayIndex}
                        type="button"
                        aria-label={formatDayLabel(day)}
                        aria-pressed={isCheckIn || isCheckOut}
                        disabled={isPast}
                        onClick={() => handleSelectDay(day)}
                        className={[
                          styles.day,
                          isPast && styles.dayPast,
                          isSelected && styles.daySelected,
                          isCheckIn && hasRange && styles.dayRoundLeft,
                          isCheckOut && styles.dayRoundRight,
                          isCheckIn && !hasRange && styles.dayRoundFull,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>

        <button
          type="button"
          className={`${styles.navButton} ${styles.navButtonPrev} tw:hidden tw:md:flex`}
          onClick={() => setViewStart((month) => addMonths(month, -1))}
          disabled={!canGoToPreviousMonth}
          aria-label={CALENDAR_TEXT.showPreviousMonth}
        >
          <Image src={chevronLeftIcon} alt="" unoptimized width={16} height={16} className="tw:h-4 tw:w-4" />
        </button>
        <button
          type="button"
          className={`${styles.navButton} ${styles.navButtonNext} tw:hidden tw:md:flex`}
          onClick={() => setViewStart((month) => addMonths(month, 1))}
          aria-label={CALENDAR_TEXT.showNextMonth}
        >
          <Image src={chevronRightIcon} alt="" unoptimized width={16} height={16} className="tw:h-4 tw:w-4" />
        </button>
      </div>

      <div className="tw:flex tw:flex-wrap tw:justify-end tw:gap-3 tw:border-t tw:border-black/10 tw:px-4 tw:py-4 tw:md:px-6">
        <button type="button" className={styles.resetButton} onClick={handleReset}>
          {CALENDAR_TEXT.reset}
        </button>
        <button type="button" className={styles.updateButton} onClick={handleUpdate}>
          {CALENDAR_TEXT.update}
        </button>
      </div>
    </div>
  );
}
