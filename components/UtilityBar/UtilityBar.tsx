"use client";

import { useId, useRef, useState, type SubmitEvent } from "react";

import Image from "next/image";

import { useClickOutside } from "@/lib/hooks/useClickOutside";

import cardIcon from "@/assets/icons/card.svg";
import searchIcon from "@/assets/icons/search.svg";
import userIcon from "@/assets/icons/user.svg";

import { UTILITY_BAR_TEXT } from "./constants";
import styles from "./UtilityBar.module.scss";

export default function UtilityBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputId = useId();
  const barRef = useRef<HTMLDivElement>(null);

  useClickOutside(barRef, () => setIsSearchOpen(false), isSearchOpen);

  function handleSearchSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div
      ref={barRef}
      className={`${styles.bar} tw:flex tw:items-center tw:justify-end tw:gap-6 tw:px-4 tw:py-2 tw:md:px-8`}
    >
      <form role="search" onSubmit={handleSearchSubmit} className="tw:flex tw:items-center tw:gap-2">
        <button
          type="button"
          className={styles.iconButton}
          aria-expanded={isSearchOpen}
          aria-controls={searchInputId}
          onClick={() => setIsSearchOpen((open) => !open)}
        >
          <Image
            src={searchIcon}
            alt={isSearchOpen ? UTILITY_BAR_TEXT.closeSearch : UTILITY_BAR_TEXT.openSearch}
            unoptimized
            width={16}
            height={16}
            className={`${styles.icon} tw:h-4 tw:w-4`}
          />
        </button>
        <label htmlFor={searchInputId} className="tw:sr-only">
          {UTILITY_BAR_TEXT.searchLabel}
        </label>
        <input
          id={searchInputId}
          type="search"
          placeholder={UTILITY_BAR_TEXT.searchPlaceholder}
          className={`${styles.searchInput} ${isSearchOpen ? styles.searchInputOpen : ""}`}
        />
      </form>

      <button type="button" className={`${styles.link} tw:flex tw:items-center tw:gap-2`}>
        <Image src={userIcon} alt="" unoptimized width={16} height={16} className={`${styles.icon} tw:h-4 tw:w-4`} />
        {UTILITY_BAR_TEXT.signIn}
      </button>

      <button type="button" className={`${styles.link} tw:flex tw:items-center tw:gap-2`}>
        <Image src={cardIcon} alt="" unoptimized width={16} height={16} className={`${styles.icon} tw:h-4 tw:w-4`} />
        {UTILITY_BAR_TEXT.joinRewards}
      </button>
    </div>
  );
}
