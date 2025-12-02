export default function useTailwind() {

    function cssvar(varName: string, element: HTMLElement = document.documentElement) {
        const styles = window.getComputedStyle(element);
        const raw = styles.getPropertyValue(varName);
        return raw;
    }

    function csstopx(raw: string) {
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

    return {
        cssvar,
        csstopx
    };
}


