import { create } from "zustand";
import { devtools } from "zustand/middleware";

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const result = startOfDay(date);
  result.setDate(result.getDate() + days);
  return result;
}

const DEFAULT_STAY_NIGHTS = 3;

function defaultState() {
  const checkIn = startOfDay(new Date());
  return {
    checkIn,
    checkOut: addDays(checkIn, DEFAULT_STAY_NIGHTS),
    rooms: 1,
    guestsPerRoom: 2,
    promoCode: "",
  };
}

export interface ReservationState {
  checkIn: Date;
  checkOut: Date | null;
  rooms: number;
  guestsPerRoom: number;
  promoCode: string;
  setDates: (checkIn: Date, checkOut: Date | null) => void;
  setRooms: (rooms: number) => void;
  setGuestsPerRoom: (guestsPerRoom: number) => void;
  setPromoCode: (promoCode: string) => void;
  reset: () => void;
}

/**
 * Single demo store for the reservation widget (Header's booking bar + Calendar).
 * Header reads/writes rooms, guests, and promo code directly; Calendar owns date
 * selection and commits check-in/check-out here when the user presses "Update".
 *
 * Wrapped in the `devtools` middleware so state and actions are inspectable in
 * the Redux DevTools browser extension (search for "ReservationStore").
 */
export const useReservationStore = create<ReservationState>()(
  devtools(
    (set) => ({
      ...defaultState(),
      setDates: (checkIn, checkOut) => set({ checkIn, checkOut }, false, "reservation/setDates"),
      setRooms: (rooms) => set({ rooms }, false, "reservation/setRooms"),
      setGuestsPerRoom: (guestsPerRoom) => set({ guestsPerRoom }, false, "reservation/setGuestsPerRoom"),
      setPromoCode: (promoCode) => set({ promoCode }, false, "reservation/setPromoCode"),
      reset: () => set(defaultState(), false, "reservation/reset"),
    }),
    { name: "ReservationStore", enabled: process.env.NODE_ENV === "development" },
  ),
);
