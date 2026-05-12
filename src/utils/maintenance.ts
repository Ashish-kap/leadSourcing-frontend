import { useEffect, useMemo, useState } from "react";

export type MaintenanceDisplayStatus = "hidden" | "upcoming" | "active";

export interface MaintenanceStatus {
  status: MaintenanceDisplayStatus;
  isVisible: boolean;
  isUpcoming: boolean;
  isActive: boolean;
  startAt: Date | null;
  endAt: Date | null;
  durationMinutes: number;
  durationLabel: string;
  message: string;
  userTimeZone: string;
  isIndiaTimeZone: boolean;
  shouldShowIndiaTimeReference: boolean;
  localDateLabel: string;
  localTimeRangeLabel: string;
  localEndTimeLabel: string;
  localStartLabel: string;
  localEndLabel: string;
  indiaStartLabel: string;
  indiaEndLabel: string;
  indiaEndTimeLabel: string;
  indiaTimeRangeLabel: string;
}

interface MaintenanceConfig {
  startAt: Date;
  endAt: Date;
  noticeBeforeMinutes: number;
  durationMinutes: number;
  message: string;
}

const INDIA_TIME_ZONE = "Asia/Kolkata";
const DEFAULT_MESSAGE =
  "Scheduled maintenance is planned while we deploy improvements.";

let hasWarnedInvalidConfig = false;

const hiddenMaintenanceStatus: MaintenanceStatus = {
  status: "hidden",
  isVisible: false,
  isUpcoming: false,
  isActive: false,
  startAt: null,
  endAt: null,
  durationMinutes: 0,
  durationLabel: "",
  message: "",
  userTimeZone: "",
  isIndiaTimeZone: false,
  shouldShowIndiaTimeReference: false,
  localDateLabel: "",
  localTimeRangeLabel: "",
  localEndTimeLabel: "",
  localStartLabel: "",
  localEndLabel: "",
  indiaStartLabel: "",
  indiaEndLabel: "",
  indiaEndTimeLabel: "",
  indiaTimeRangeLabel: "",
};

function warnInvalidConfig(reason: string) {
  if (!import.meta.env.DEV || hasWarnedInvalidConfig) return;
  hasWarnedInvalidConfig = true;
  console.warn(`[maintenance] ${reason}`);
}

function isEnabled(value: string | undefined) {
  return value?.trim().toLowerCase() === "true";
}

function parseMinutes(value: string | undefined, fieldName: string) {
  const minutes = Number(value);

  if (!Number.isFinite(minutes) || minutes <= 0) {
    warnInvalidConfig(`${fieldName} must be a positive number of minutes.`);
    return null;
  }

  return Math.floor(minutes);
}

function parseNoticeBeforeMinutes(value: string | undefined) {
  if (!value?.trim()) return 0;

  const minutes = Number(value);

  if (!Number.isFinite(minutes) || minutes < 0) {
    warnInvalidConfig(
      "VITE_MAINTENANCE_NOTICE_BEFORE_MINUTES must be zero or a positive number. Falling back to 0."
    );
    return 0;
  }

  return Math.floor(minutes);
}

function normalizeIstTime(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) return null;
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);

  if (!match) return null;

  const [, hourValue, minuteValue, secondValue = "00"] = match;
  const hour = Number(hourValue);
  const minute = Number(minuteValue);
  const second = Number(secondValue);

  if (
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    second < 0 ||
    second > 59
  ) {
    return null;
  }

  return `${String(hour).padStart(2, "0")}:${minuteValue}:${secondValue}`;
}

function getMaintenanceConfig(): MaintenanceConfig | null {
  if (!isEnabled(import.meta.env.VITE_MAINTENANCE_ENABLED)) return null;

  const date = import.meta.env.VITE_MAINTENANCE_START_DATE_IST?.trim();
  const time = normalizeIstTime(import.meta.env.VITE_MAINTENANCE_START_TIME_IST);
  const durationMinutes = parseMinutes(
    import.meta.env.VITE_MAINTENANCE_DURATION_MINUTES,
    "VITE_MAINTENANCE_DURATION_MINUTES"
  );

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    warnInvalidConfig(
      "VITE_MAINTENANCE_START_DATE_IST must be set as YYYY-MM-DD."
    );
    return null;
  }

  if (!time) {
    warnInvalidConfig(
      "VITE_MAINTENANCE_START_TIME_IST must be set as H:mm, HH:mm, H:mm:ss, or HH:mm:ss."
    );
    return null;
  }

  if (!durationMinutes) return null;

  const startAt = new Date(`${date}T${time}+05:30`);

  if (Number.isNaN(startAt.getTime())) {
    warnInvalidConfig("Maintenance start date/time is invalid.");
    return null;
  }

  const endAt = new Date(startAt.getTime() + durationMinutes * 60_000);
  const noticeBeforeMinutes = parseNoticeBeforeMinutes(
    import.meta.env.VITE_MAINTENANCE_NOTICE_BEFORE_MINUTES
  );
  const message =
    import.meta.env.VITE_MAINTENANCE_MESSAGE?.trim() || DEFAULT_MESSAGE;

  return {
    startAt,
    endAt,
    noticeBeforeMinutes,
    durationMinutes,
    message,
  };
}

function getUserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

function normalizeIndiaTimeZoneName(value: string, timeZone: string) {
  if (timeZone === INDIA_TIME_ZONE || timeZone === "Asia/Calcutta") {
    return value.replace("GMT+5:30", "IST");
  }

  return value;
}

function isIndiaCompatibleTimeZone(timeZone: string) {
  return timeZone === INDIA_TIME_ZONE || timeZone === "Asia/Calcutta";
}

function withTimeZone(
  options: Intl.DateTimeFormatOptions,
  timeZone?: string
) {
  return timeZone ? { ...options, timeZone } : options;
}

function formatDate(date: Date, timeZone?: string) {
  return new Intl.DateTimeFormat(
    "en-US",
    withTimeZone(
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      },
      timeZone
    )
  ).format(date);
}

function formatDateTime(date: Date, timeZone?: string) {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  };

  if (timeZone) options.timeZone = timeZone;

  try {
    return normalizeIndiaTimeZoneName(
      new Intl.DateTimeFormat("en-US", options).format(date),
      timeZone || ""
    );
  } catch {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(date);
  }
}

function formatTimeWithoutZone(date: Date, timeZone?: string) {
  return new Intl.DateTimeFormat(
    "en-US",
    withTimeZone(
      {
        hour: "numeric",
        minute: "2-digit",
      },
      timeZone
    )
  ).format(date);
}

function formatTime(date: Date, timeZone?: string) {
  return normalizeIndiaTimeZoneName(
    new Intl.DateTimeFormat(
      "en-US",
      withTimeZone(
        {
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short",
        },
        timeZone
      )
    ).format(date),
    timeZone || ""
  );
}

function formatDateKey(date: Date, timeZone?: string) {
  return new Intl.DateTimeFormat(
    "en-CA",
    withTimeZone(
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      },
      timeZone
    )
  ).format(date);
}

function formatSentenceTimeRange(
  startAt: Date,
  endAt: Date,
  timeZone?: string
) {
  const startsAndEndsSameDay =
    formatDateKey(startAt, timeZone) === formatDateKey(endAt, timeZone);

  if (!startsAndEndsSameDay) {
    return `${formatDateTime(startAt, timeZone)} to ${formatDateTime(
      endAt,
      timeZone
    )}`;
  }

  return `${formatTimeWithoutZone(startAt, timeZone)} to ${formatTime(
    endAt,
    timeZone
  )}`;
}

function formatCompactTimeRange(startAt: Date, endAt: Date, timeZone?: string) {
  const startsAndEndsSameDay =
    formatDateKey(startAt, timeZone) === formatDateKey(endAt, timeZone);

  if (!startsAndEndsSameDay) {
    return `${formatDateTime(startAt, timeZone)} - ${formatDateTime(
      endAt,
      timeZone
    )}`;
  }

  return `${formatTimeWithoutZone(startAt, timeZone)} - ${formatTime(
    endAt,
    timeZone
  )}`;
}

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const hourLabel = `${hours} ${hours === 1 ? "hour" : "hours"}`;

  if (!remainingMinutes) return hourLabel;

  return `${hourLabel} ${remainingMinutes} ${
    remainingMinutes === 1 ? "minute" : "minutes"
  }`;
}

export function getMaintenanceStatus(now = new Date()): MaintenanceStatus {
  const config = getMaintenanceConfig();

  if (!config) return hiddenMaintenanceStatus;

  const nowMs = now.getTime();
  const startMs = config.startAt.getTime();
  const endMs = config.endAt.getTime();
  const noticeStartMs = startMs - config.noticeBeforeMinutes * 60_000;

  let status: MaintenanceDisplayStatus = "hidden";

  if (nowMs >= startMs && nowMs < endMs) {
    status = "active";
  } else if (nowMs >= noticeStartMs && nowMs < startMs) {
    status = "upcoming";
  }

  if (status === "hidden") return hiddenMaintenanceStatus;

  const userTimeZone = getUserTimeZone();
  const isIndiaTimeZone = isIndiaCompatibleTimeZone(userTimeZone);

  return {
    status,
    isVisible: true,
    isUpcoming: status === "upcoming",
    isActive: status === "active",
    startAt: config.startAt,
    endAt: config.endAt,
    durationMinutes: config.durationMinutes,
    durationLabel: formatDuration(config.durationMinutes),
    message: config.message,
    userTimeZone,
    isIndiaTimeZone,
    shouldShowIndiaTimeReference: !isIndiaTimeZone,
    localDateLabel: formatDate(config.startAt, userTimeZone),
    localTimeRangeLabel: formatSentenceTimeRange(
      config.startAt,
      config.endAt,
      userTimeZone
    ),
    localEndTimeLabel: formatTime(config.endAt, userTimeZone),
    localStartLabel: formatDateTime(config.startAt, userTimeZone),
    localEndLabel: formatDateTime(config.endAt, userTimeZone),
    indiaStartLabel: formatDateTime(config.startAt, INDIA_TIME_ZONE),
    indiaEndLabel: formatDateTime(config.endAt, INDIA_TIME_ZONE),
    indiaEndTimeLabel: formatTime(config.endAt, INDIA_TIME_ZONE),
    indiaTimeRangeLabel: formatCompactTimeRange(
      config.startAt,
      config.endAt,
      INDIA_TIME_ZONE
    ),
  };
}

export function useMaintenanceStatus() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 30_000);

    return () => window.clearInterval(intervalId);
  }, []);

  return useMemo(() => getMaintenanceStatus(now), [now]);
}
