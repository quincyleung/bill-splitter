/**
 * Copies text. The Clipboard API only works on https, so on plain http (a phone
 * on the local network) it falls back to the older copy command. Returns
 * whether it worked.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (window.isSecureContext && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the older way.
  }

  const previousFocus = document.activeElement as HTMLElement | null;
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  field.remove();
  previousFocus?.focus();
  return copied;
}

/**
 * Opens the phone's share sheet (so the summary can go straight to a group chat) when
 * the browser has one, and copies the text otherwise. Closing the share sheet counts
 * as "cancelled", not a failure.
 */
export async function shareText(title: string, text: string): Promise<"shared" | "copied" | "cancelled" | "failed"> {
  if (window.isSecureContext && typeof navigator.share === "function") {
    try {
      await navigator.share({ title, text });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
      // Any other failure: fall back to copying.
    }
  }
  return (await copyText(text)) ? "copied" : "failed";
}
