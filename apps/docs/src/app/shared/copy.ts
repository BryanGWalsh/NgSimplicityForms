/**
 * Handles clicks on the copy buttons that the Markdown renderer and demo frame add to code blocks.
 * Returns true when the click was handled.
 */
export function handleCopyClick(event: MouseEvent): boolean {
  const button = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>('[data-copy]');
  if (!button) return false;
  const code = button.parentElement?.querySelector('pre')?.textContent ?? '';
  navigator.clipboard?.writeText(code).then(
    () => {
      const icon = button.querySelector('i');
      icon?.classList.replace('bi-clipboard', 'bi-check2');
      button.setAttribute('aria-label', 'Copied');
      setTimeout(() => {
        icon?.classList.replace('bi-check2', 'bi-clipboard');
        button.setAttribute('aria-label', 'Copy code');
      }, 1500);
    },
    () => undefined
  );
  return true;
}
