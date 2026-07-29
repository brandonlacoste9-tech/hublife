import { Show, SignInButton, UserButton, useUser } from "@clerk/react";

/**
 * Compact Clerk auth for the HubLife header.
 * Only mounted when VITE_CLERK_PUBLISHABLE_KEY is present.
 */
export function AuthChip() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <span className="auth-chip auth-chip-loading">…</span>;
  }

  return (
    <div className="auth-chip">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button type="button" className="auth-sign-in">
            Sign in
          </button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <div className="auth-user">
          <UserButton
            appearance={{
              elements: {
                avatarBox: { width: 32, height: 32 },
              },
            }}
          />
          <span className="auth-name">
            {user?.firstName ||
              user?.username ||
              user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
              "You"}
          </span>
        </div>
      </Show>
    </div>
  );
}
