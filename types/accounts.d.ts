enum Role {
  ADMIN = "admins",
  USER = "user",
}

interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  provider?: "email" | "google" | "github";
  photoURL?: string;
  updatedAt: Date;
  isVerified?: "true" | "false";
  createdAt: Date;
  isActive: boolean;
}

interface AuthContextType {
  user: UserAccount | null;
  loading: boolean;
  login: (email: string, password: string, turnstileToken?: string) => Promise<UserAccount>;
  loginWithGoogle: () => Promise<UserAccount>;
  loginWithGithub: () => Promise<UserAccount>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  hasRole: (roles: string | string[]) => boolean;
  getDashboardUrl: (userRole: string) => string;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  showInactiveModal: boolean;
  setShowInactiveModal: (show: boolean) => void;
}

interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
}
