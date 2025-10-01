import React, { useState, useEffect } from "react";
import { Zap } from "lucide-react";

const OFFERS = [
  "Early Bird – Save 40%",
  "Pro Advantage – Limited Deal",
  "Launch Special – First 100",
  "Kickstart Plan – Save Big",
  "Starter Boost – Discount Deal",
  "Exclusive – Unlock Premium Now",
  "Founders Special – Lifetime Save",
  "Scale Saver – Pay Less",
  "Premium Unlock – Limited Offer",
  "Deal of Month – Save 30%",
  "Flash Sale – Ending Soon",
  "Power Pack – Save Now",
  "One-Time – Lock Your Price",
];

const COUNTDOWN_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const PAUSE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const DAILY_CYCLE = 24 * 60 * 60 * 1000; // 24 hours total cycle

interface TimerState {
  currentCycleStart: number; // When current 24-hour cycle started
  isInCountdownPhase: boolean; // true = countdown, false = pause
  currentOfferIndex: number;
  currentBlockIndex: number; // Track which block we're currently in
}

// Helper function to calculate current phase
const getCurrentPhase = (now: number, cycleStart: number) => {
  // Safety check for invalid inputs
  if (!now || !cycleStart || isNaN(now) || isNaN(cycleStart)) {
    return {
      phase: "countdown",
      timeLeft: COUNTDOWN_DURATION,
      blockIndex: 0,
    };
  }

  const timeInCycle = (now - cycleStart) % DAILY_CYCLE;

  // Calculate which 3-hour block we're in (including 15-min breaks)
  const blockDuration = COUNTDOWN_DURATION + PAUSE_DURATION; // 3h 15min
  const blockIndex = Math.floor(timeInCycle / blockDuration);
  const timeInBlock = timeInCycle % blockDuration;

  if (timeInBlock < COUNTDOWN_DURATION) {
    // In 3-hour countdown phase
    return {
      phase: "countdown",
      timeLeft: COUNTDOWN_DURATION - timeInBlock,
      blockIndex,
    };
  } else {
    // In 15-minute pause phase
    return {
      phase: "pause",
      timeLeft: blockDuration - timeInBlock,
      blockIndex,
    };
  }
};

export const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });
  const [isPaused, setIsPaused] = useState(false);
//   const [currentOffer, setCurrentOffer] = useState("");

  // Initialize or restore timer state
  useEffect(() => {
    const initializeTimer = () => {
      const stored = localStorage.getItem("offerTimerState");
      let state: TimerState;
      const now = Date.now();

      if (stored) {
        state = JSON.parse(stored);

        // Check if we need to start a new daily cycle (every 24 hours)
        const timeSinceCycleStart = now - state.currentCycleStart;
        if (timeSinceCycleStart >= DAILY_CYCLE) {
          // Start new daily cycle
          const randomIndex = Math.floor(Math.random() * OFFERS.length);
          state = {
            currentCycleStart: now,
            isInCountdownPhase: true,
            currentOfferIndex: randomIndex,
            currentBlockIndex: 0,
          };
        }
      } else {
        // First time initialization - start at 12 PM today
        const today = new Date();
        today.setHours(12, 0, 0, 0); // 12:00 PM
        const cycleStart = today.getTime();

        // If it's already past 12 PM today, start the cycle
        const randomIndex = Math.floor(Math.random() * OFFERS.length);
        state = {
          currentCycleStart: cycleStart,
          isInCountdownPhase: true,
          currentOfferIndex: randomIndex,
          currentBlockIndex: 0,
        };
      }

      localStorage.setItem("offerTimerState", JSON.stringify(state));
    //   setCurrentOffer(OFFERS[state.currentOfferIndex]);
      return state;
    };

    initializeTimer();

    // Update timer every second
    const interval = setInterval(() => {
      const now = Date.now();
      const stored = localStorage.getItem("offerTimerState");
      if (!stored) return;

      const currentState: TimerState = JSON.parse(stored);

      // Safety check for invalid cycle start time
      if (
        !currentState.currentCycleStart ||
        isNaN(currentState.currentCycleStart)
      ) {
        const today = new Date();
        today.setHours(12, 0, 0, 0);
        currentState.currentCycleStart = today.getTime();
        localStorage.setItem("offerTimerState", JSON.stringify(currentState));
      }

      const phase = getCurrentPhase(now, currentState.currentCycleStart);

      // Update offer if we're in a new block (every 3h 15min)
      if (phase.blockIndex !== currentState.currentBlockIndex) {
        let newOfferIndex = Math.floor(Math.random() * OFFERS.length);
        // Ensure different offer
        do {
          newOfferIndex = Math.floor(Math.random() * OFFERS.length);
        } while (
          newOfferIndex === currentState.currentOfferIndex &&
          OFFERS.length > 1
        );

        currentState.currentBlockIndex = phase.blockIndex;
        currentState.currentOfferIndex = newOfferIndex;
        // setCurrentOffer(OFFERS[newOfferIndex]);
        localStorage.setItem("offerTimerState", JSON.stringify(currentState));
      }

      // Update timer display with safety checks
      const timeLeft = Math.max(0, phase.timeLeft); // Ensure non-negative
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      // Ensure we have valid numbers
      setTimeLeft({
        hours: isNaN(hours) ? 0 : hours,
        minutes: isNaN(minutes) ? 0 : minutes,
        seconds: isNaN(seconds) ? 0 : seconds,
      });
      setIsPaused(phase.phase === "pause");
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  // Don't render anything during pause phase
  if (isPaused) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-lg p-3 border border-primary/20">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Zap className="h-3 w-3 text-primary animate-pulse" />
          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Deal Ends In
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="flex flex-col items-center bg-gradient-to-br from-primary/15 to-primary/5 rounded-md px-3 py-2 min-w-[3rem] border border-primary/10">
            <span className="text-xl font-bold text-foreground tabular-nums leading-none">
              {formatNumber(timeLeft.hours)}
            </span>
            <span className="text-[8px] text-muted-foreground uppercase tracking-wide leading-none mt-0.5">
              Hours
            </span>
          </div>
          <span className="text-muted-foreground/60 font-bold text-lg">:</span>
          <div className="flex flex-col items-center bg-gradient-to-br from-primary/15 to-primary/5 rounded-md px-3 py-2 min-w-[3rem] border border-primary/10">
            <span className="text-xl font-bold text-foreground tabular-nums leading-none">
              {formatNumber(timeLeft.minutes)}
            </span>
            <span className="text-[8px] text-muted-foreground uppercase tracking-wide leading-none mt-0.5">
              Minutes
            </span>
          </div>
          <span className="text-muted-foreground/60 font-bold text-lg">:</span>
          <div className="flex flex-col items-center bg-gradient-to-br from-primary/15 to-primary/5 rounded-md px-3 py-2 min-w-[3rem] border border-primary/10">
            <span className="text-xl font-bold text-foreground tabular-nums leading-none">
              {formatNumber(timeLeft.seconds)}
            </span>
            <span className="text-[8px] text-muted-foreground uppercase tracking-wide leading-none mt-0.5">
              Seconds
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
