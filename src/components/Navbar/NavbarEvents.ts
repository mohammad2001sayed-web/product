export type NavbarSnapshot = {
  userName: string;
  isAuthenticated: boolean;
  wishlistCount: number;
  cartCount: number;
};

export const NAVBAR_STATE_CHANGE = "navbar-state-change";

export function announceNavbarState(snapshot: NavbarSnapshot) {
  window.dispatchEvent(new CustomEvent<NavbarSnapshot>(NAVBAR_STATE_CHANGE, { detail: snapshot }));
}
