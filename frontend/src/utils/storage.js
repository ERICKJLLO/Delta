const ONBOARDING_KEY = "delta_onboarding";
const USER_KEY = "delta_user";
const SESSION_KEY = "delta_session";

export function getOnboardingData() {
  try {
    return JSON.parse(sessionStorage.getItem(ONBOARDING_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveOnboardingData(data) {
  const current = getOnboardingData();
  sessionStorage.setItem(
    ONBOARDING_KEY,
    JSON.stringify({ ...current, ...data })
  );
}

export function clearOnboardingData() {
  sessionStorage.removeItem(ONBOARDING_KEY);
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function activateAccount({ business, plan, password }) {
  const user = {
    email: business.email.trim().toLowerCase(),
    password,
    companyName: business.companyName,
    nit: business.nit,
    contactName: business.contactName,
    contactName: business.contactName,
    planId: plan.id,
    planName: plan.name,
    activatedAt: new Date().toISOString(),
  };
  saveUser(user);
  clearOnboardingData();
  return user;
}
