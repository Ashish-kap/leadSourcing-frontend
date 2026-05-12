/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAINTENANCE_ENABLED?: string;
  readonly VITE_MAINTENANCE_START_DATE_IST?: string;
  readonly VITE_MAINTENANCE_START_TIME_IST?: string;
  readonly VITE_MAINTENANCE_DURATION_MINUTES?: string;
  readonly VITE_MAINTENANCE_NOTICE_BEFORE_MINUTES?: string;
  readonly VITE_MAINTENANCE_MESSAGE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
