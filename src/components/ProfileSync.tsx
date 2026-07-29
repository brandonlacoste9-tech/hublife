import { useEffect } from "react";
import { useUser } from "@clerk/react";
import { bindClerkUser } from "../lib/profile";

/** Keep thin network profile bound to Clerk identity when signed in. */
export function ProfileSync() {
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const name =
      user.firstName ||
      user.username ||
      user.primaryEmailAddress?.emailAddress?.split("@")[0] ||
      null;
    bindClerkUser(user.id, name);
  }, [isLoaded, isSignedIn, user]);

  return null;
}
