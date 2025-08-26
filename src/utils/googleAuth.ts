// Google OAuth utility functions

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

export interface GoogleAuthResponse {
  credential: string;
}

export const initializeGoogleAuth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if Google API is already loaded
    if (window.google && window.google.accounts) {
      resolve();
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => {
      // Initialize Google Sign-In
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
        callback: () => {}, // Will be overridden in component
      });
      resolve();
    };
    script.onerror = () =>
      reject(new Error("Failed to load Google Sign-In script"));
    document.head.appendChild(script);
  });
};

export const signInWithGoogle = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.accounts) {
      reject(new Error("Google Sign-In not initialized"));
      return;
    }

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
      callback: (response: GoogleAuthResponse) => {
        if (response.credential) {
          resolve(response.credential);
        } else {
          reject(new Error("No credential received from Google"));
        }
      },
    });

    // Prompt the user to sign in
    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback to popup if prompt is not displayed
        window.google.accounts.id.renderButton(document.createElement("div"), {
          theme: "outline",
          size: "large",
          type: "standard",
          width: 250,
        });

        // Trigger popup manually
        window.google.accounts.oauth2
          .initTokenClient({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
            scope: "profile email",
            callback: (response: any) => {
              if (response.access_token) {
                resolve(response.access_token);
              } else {
                reject(new Error("OAuth failed"));
              }
            },
          })
          .requestAccessToken();
      }
    });
  });
};

export const signInWithGooglePopup = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.accounts) {
      reject(new Error("Google Sign-In not initialized"));
      return;
    }

    // Create a temporary button and trigger click
    const tempDiv = document.createElement("div");
    tempDiv.style.display = "none";
    document.body.appendChild(tempDiv);

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
      callback: (response: GoogleAuthResponse) => {
        document.body.removeChild(tempDiv);
        if (response.credential) {
          resolve(response.credential);
        } else {
          reject(new Error("No credential received from Google"));
        }
      },
    });

    window.google.accounts.id.renderButton(tempDiv, {
      theme: "outline",
      size: "large",
      type: "standard",
    });

    // Programmatically click the button
    setTimeout(() => {
      const button = tempDiv.querySelector('div[role="button"]') as HTMLElement;
      if (button) {
        button.click();
      } else {
        document.body.removeChild(tempDiv);
        reject(new Error("Could not render Google Sign-In button"));
      }
    }, 100);
  });
};
