/**
 * Gets the value of a CSS variable
 * @param varName The name of the CSS variable (e.g. "--page-padding")
 * @param element The element to get the CSS variable from (defaults to document.documentElement)
 * @returns The value of the CSS variable
 */
export function cssvar(varName: string, element: HTMLElement = document.documentElement) {
  const styles = window.getComputedStyle(element);
  const raw = styles.getPropertyValue(varName);
  return raw;
}

/**
 * Converts a CSS value to pixels
 * @param raw The CSS value to convert (e.g. "1rem", "1vw", "1vh", "1px")
 * @returns The value in pixels
 */
export function csstopx(raw: string) {
  // If it's already computed (px from calc/rem/etc.)
  if (raw.endsWith("px")) return parseFloat(raw);

  // rem → px
  if (raw.endsWith("rem")) {
    const base = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return parseFloat(raw) * base;
  }

  // vw → px
  if (raw.endsWith("vw")) {
    return (parseFloat(raw) / 100) * window.innerWidth;
  }

  // vh → px
  if (raw.endsWith("vh")) {
    return (parseFloat(raw) / 100) * window.innerHeight;
  }

  // fallback: try direct number
  const num = parseFloat(raw);
  return isNaN(num) ? null : num;
}
