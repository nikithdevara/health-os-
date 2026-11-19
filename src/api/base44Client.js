const mockAuth = {
  isAuthenticated: async () => true,
  me: async () => ({
    id: "demo-user",
    email: "demo@healthos.io",
    full_name: "HealthOS Member",
    role: "member",
  }),
  hasToken: () => true,
  getToken: () => "demo-token",
  logout: () => {
    if (typeof window !== "undefined") window.location.href = "/";
  },
  redirectToLogin: (returnTo) => {
    if (typeof window !== "undefined") window.location.href = returnTo || "/";
  },
  register: async () => ({ access_token: "demo-token" }),
  verifyOtp: async () => ({ access_token: "demo-token" }),
  resendOtp: async () => ({}),
  resetPassword: async () => ({}),
  requestPasswordReset: async () => ({}),
  loginWithPassword: async () => ({ access_token: "demo-token" }),
  getMfaInfo: async () => ({ auth_config: {} }),
  loginWithOtp: async () => ({ access_token: "demo-token" }),
  loginWithTotp: async () => ({ access_token: "demo-token" }),
};

export const db = globalThis.__B44_DB__ || {
  auth: mockAuth,
  entities: new Proxy({}, {
    get: () => ({
      filter: async () => [],
      get: async () => null,
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
    }),
  }),
  integrations: {
    Core: {
      UploadFile: async () => ({ file_url: "" }),
    },
  },
};

if (globalThis.__B44_DB__) {
  if (!globalThis.__B44_DB__.auth) {
    globalThis.__B44_DB__.auth = mockAuth;
  } else {
    for (const [key, val] of Object.entries(mockAuth)) {
      if (typeof globalThis.__B44_DB__.auth[key] !== "function") {
        globalThis.__B44_DB__.auth[key] = val;
      }
    }
  }
} else {
  globalThis.__B44_DB__ = db;
}

export const base44 = db;
export default db;
