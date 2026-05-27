import FingerprintJS from "@fingerprintjs/fingerprintjs";

let visitorIdPromise: Promise<string> | null = null;

export const getVisitorId = (): Promise<string> => {
  if (!visitorIdPromise) {
    visitorIdPromise = (async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        return result.visitorId || "";
      } catch {
        return "";
      }
    })();
  }
  return visitorIdPromise;
};

export const primeFingerprint = (): void => {
  void getVisitorId();
};
