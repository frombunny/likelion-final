const PENDING_SIGN_UP_KEY = "pendingSignUp";

export const savePendingSignUp = (payload) => {
  sessionStorage.setItem(PENDING_SIGN_UP_KEY, JSON.stringify(payload));
};

export const loadPendingSignUp = () => {
  const raw = sessionStorage.getItem(PENDING_SIGN_UP_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    sessionStorage.removeItem(PENDING_SIGN_UP_KEY);
    return null;
  }
};

export const clearPendingSignUp = () => {
  sessionStorage.removeItem(PENDING_SIGN_UP_KEY);
};
