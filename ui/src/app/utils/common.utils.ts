import { User } from "../types/Entity.Types";

export function loggedInUser(): User {
  const user = localStorage.getItem('shoppr_session');
  return user ? JSON.parse(atob(user)) : null;
}
