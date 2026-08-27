"use client";

import { useEffect, useId, useRef, useState, type SubmitEvent } from "react";

import Image from "next/image";
import Link from "next/link";

import type { ContentfulAsset, NavigationItem } from "@/types/content-types";

import BaseButton from "@/components/BaseButton/BaseButton";
import Calendar from "@/components/Calendar/Calendar";
import MobileNavigation from "@/components/MobileNavigation/MobileNavigation";

import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { useReservationStore } from "@/lib/store/reservationStore";

import calendarIcon from "@/assets/icons/calendar.svg";
import minusIcon from "@/assets/icons/minus.svg";
import plusIcon from "@/assets/icons/plus.svg";
import searchIcon from "@/assets/icons/search.svg";

import { HEADER_TEXT } from "./constants";
import styles from "./Header.module.scss";

export interface HeaderProps {
  logo: ContentfulAsset;
  siteName: string;
  navigationItems: NavigationItem[];
}

const MIN_COUNT = 1;
const MAX_COUNT = 9;

function formatMonthDayYear(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

export default function Header({
  logo,
  siteName,
  navigationItems,
}: HeaderProps) {
  const { checkIn, checkOut, rooms, guestsPerRoom, promoCode, setRooms, setGuestsPerRoom, setPromoCode } =
    useReservationStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);

  const headerRef = useRef<HTMLElement>(null);
  const searchPanelId = useId();

  useClickOutside(headerRef, () => setIsCalendarOpen(false), isCalendarOpen);

  // The mobile nav drawer is fixed-positioned so it can reach the bottom of
  // the viewport, so its top offset has to be measured rather than assumed —
  // anything sticky-stacked above the header (e.g. UtilityBar) shifts where
  // the header's own bottom edge actually lands.
  useEffect(() => {
    if (!isMenuOpen) return;

    function updateMenuTop() {
      if (headerRef.current) {
        setMenuTop(headerRef.current.getBoundingClientRect().bottom);
      }
    }

    updateMenuTop();
    window.addEventListener("resize", updateMenuTop);
    return () => window.removeEventListener("resize", updateMenuTop);
  }, [isMenuOpen]);

  const checkInLabel = formatMonthDayYear(checkIn);
  const checkOutLabel = checkOut ? formatMonthDayYear(checkOut) : HEADER_TEXT.selectADate;

  function handleSearchSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  const searchButton = (
    <button
      type="button"
      className={styles.iconButton}
      aria-expanded={isSearchOpen}
      aria-controls={searchPanelId}
      onClick={() => setIsSearchOpen((open) => !open)}
    >
      <Image
        src={searchIcon}
        alt={isSearchOpen ? HEADER_TEXT.closeSearch : HEADER_TEXT.openSearch}
        unoptimized
        width={20}
        height={20}
        className="tw:h-5 tw:w-5"
      />
    </button>
  );

  const calendarButton = (
    <button
      type="button"
      className={styles.iconButton}
      aria-expanded={isCalendarOpen}
      onClick={() => setIsCalendarOpen((open) => !open)}
    >
      <Image
        src={calendarIcon}
        alt={HEADER_TEXT.calendarIconAlt}
        unoptimized
        width={20}
        height={20}
        className="tw:h-5 tw:w-5"
      />
    </button>
  );

  return (
    <header
      ref={headerRef}
      className={`${styles.header} tw:relative tw:font-sans`}
    >
      {/* Mobile & tablet: search + calendar | logo | menu */}
      <div className="tw:grid tw:grid-cols-[1fr_auto_1fr] tw:items-center tw:px-4 tw:py-3 tw:xl:hidden">
        <div className="tw:flex tw:items-center tw:gap-3 tw:justify-self-start">
          {searchButton}
          {calendarButton}
        </div>

        <Link
          href="/"
          aria-label={siteName}
          className="tw:flex tw:flex-col tw:items-center"
        >
          <Image
            src={logo.url}
            alt={siteName}
            width={logo.width ?? 160}
            height={logo.height ?? 72}
            unoptimized
            className="tw:h-12 tw:w-auto"
          />
          <span
            className={`${styles.siteName} tw:text-xs tw:font-semibold tw:uppercase`}
          >
            {siteName}
          </span>
        </Link>

        <button
          type="button"
          className={`${styles.iconButton} tw:justify-self-end`}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span
            className={`${styles.menuIcon} ${isMenuOpen ? styles.menuIconOpen : ""}`}
            aria-hidden="true"
          >
            <span className={styles.menuIconBar} />
            <span className={styles.menuIconBar} />
            <span className={styles.menuIconBar} />
          </span>
          <span className="tw:sr-only">
            {isMenuOpen ? HEADER_TEXT.closeMenu : HEADER_TEXT.openMenu}
          </span>
        </button>
      </div>

      {isMenuOpen && (
        <div className={`${styles.mobileNavPanel} tw:xl:hidden`} style={{ top: menuTop }}>
          <MobileNavigation items={navigationItems} />
        </div>
      )}

      {/* Desktop: logo + title, booking bar, and search all in a single row */}
      <div className="tw:hidden tw:xl:flex tw:xl:items-center tw:xl:gap-6 tw:xl:px-8 tw:xl:py-3">
        <Link
          href="/"
          aria-label={siteName}
          className="tw:flex tw:flex-col tw:items-start"
        >
          <Image
            src={logo.url}
            alt={siteName}
            width={logo.width ?? 160}
            height={logo.height ?? 72}
            unoptimized
            className="tw:h-12 tw:w-auto"
          />
          <span
            className={`${styles.siteName} tw:text-xs tw:font-semibold tw:uppercase`}
          >
            {siteName}
          </span>
        </Link>

        <div className="tw:flex tw:flex-col">
          <span className={`${styles.fieldLabel} tw:text-xs tw:font-semibold`}>
            {HEADER_TEXT.checkInLabel}
          </span>
          <button
            type="button"
            className={`${styles.dateTrigger} tw:text-sm`}
            aria-expanded={isCalendarOpen}
            onClick={() => setIsCalendarOpen((open) => !open)}
          >
            {checkInLabel}
          </button>
        </div>
        <div className="tw:flex tw:flex-col">
          <span className={`${styles.fieldLabel} tw:text-xs tw:font-semibold`}>
            {HEADER_TEXT.checkOutLabel}
          </span>
          <button
            type="button"
            className={`${styles.dateTrigger} tw:text-sm`}
            aria-expanded={isCalendarOpen}
            onClick={() => setIsCalendarOpen((open) => !open)}
          >
            {checkOutLabel}
          </button>
        </div>
        {calendarButton}

        <div className="tw:flex tw:flex-col tw:gap-1">
          <span className={`${styles.fieldLabel} tw:text-xs tw:font-semibold`}>
            {HEADER_TEXT.roomsLabel}
          </span>
          <div className={styles.counter}>
            <button
              type="button"
              className={styles.counterButton}
              onClick={() => setRooms(Math.max(MIN_COUNT, rooms - 1))}
              disabled={rooms <= MIN_COUNT}
              aria-label={HEADER_TEXT.decreaseRooms}
            >
              <Image
                src={minusIcon}
                alt={HEADER_TEXT.decreaseIconAlt}
                unoptimized
                width={12}
                height={12}
                className="tw:h-3 tw:w-3"
              />
            </button>
            <span
              aria-live="polite"
              className="tw:w-4 tw:text-center tw:text-sm"
            >
              {rooms}
            </span>
            <button
              type="button"
              className={styles.counterButton}
              onClick={() => setRooms(Math.min(MAX_COUNT, rooms + 1))}
              disabled={rooms >= MAX_COUNT}
              aria-label={HEADER_TEXT.increaseRooms}
            >
              <Image
                src={plusIcon}
                alt={HEADER_TEXT.increaseIconAlt}
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
            {HEADER_TEXT.guestsPerRoomLabel}
          </span>
          <div className={styles.counter}>
            <button
              type="button"
              className={styles.counterButton}
              onClick={() => setGuestsPerRoom(Math.max(MIN_COUNT, guestsPerRoom - 1))}
              disabled={guestsPerRoom <= MIN_COUNT}
              aria-label={HEADER_TEXT.decreaseGuestsPerRoom}
            >
              <Image
                src={minusIcon}
                alt={HEADER_TEXT.decreaseIconAlt}
                unoptimized
                width={12}
                height={12}
                className="tw:h-3 tw:w-3"
              />
            </button>
            <span
              aria-live="polite"
              className="tw:w-4 tw:text-center tw:text-sm"
            >
              {guestsPerRoom}
            </span>
            <button
              type="button"
              className={styles.counterButton}
              onClick={() => setGuestsPerRoom(Math.min(MAX_COUNT, guestsPerRoom + 1))}
              disabled={guestsPerRoom >= MAX_COUNT}
              aria-label={HEADER_TEXT.increaseGuestsPerRoom}
            >
              <Image
                src={plusIcon}
                alt={HEADER_TEXT.increaseIconAlt}
                unoptimized
                width={12}
                height={12}
                className="tw:h-3 tw:w-3"
              />
            </button>
          </div>
        </div>

        <div className="tw:flex tw:flex-col">
          <label
            htmlFor="promo-code"
            className={`${styles.fieldLabel} tw:text-xs tw:font-semibold`}
          >
            {HEADER_TEXT.promoCodeLabel}
          </label>
          <input
            id="promo-code"
            type="text"
            value={promoCode}
            onChange={(event) => setPromoCode(event.target.value)}
            className="tw:border-b tw:border-black/40 tw:text-sm tw:outline-none"
          />
        </div>

        <BaseButton className="tw:ml-auto">{HEADER_TEXT.checkAvailability}</BaseButton>

        {searchButton}
      </div>

      {isCalendarOpen && (
        <div
          className={`${styles.calendarPanel} tw:absolute tw:left-0 tw:right-0 tw:top-full tw:z-20`}
        >
          <Calendar onUpdate={() => setIsCalendarOpen(false)} />
        </div>
      )}

      {isSearchOpen && (
        <div
          id={searchPanelId}
          className={`${styles.searchPanel} tw:px-4 tw:py-3 tw:xl:px-8`}
        >
          <form
            role="search"
            onSubmit={handleSearchSubmit}
            className="tw:flex tw:max-w-md tw:gap-2"
          >
            <label htmlFor={`${searchPanelId}-input`} className="tw:sr-only">
              {HEADER_TEXT.searchLabel}
            </label>
            <input
              id={`${searchPanelId}-input`}
              type="search"
              placeholder={HEADER_TEXT.searchPlaceholder}
              className="tw:flex-1 tw:border tw:border-black/20 tw:px-3 tw:py-2 tw:text-sm"
            />
            <button
              type="submit"
              className={`${styles.iconButton} tw:border tw:border-black/20 tw:px-3`}
            >
              <Image
                src={searchIcon}
                alt={HEADER_TEXT.submitSearch}
                unoptimized
                width={20}
                height={20}
                className="tw:h-5 tw:w-5"
              />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
