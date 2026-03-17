import { useEffect, useState } from "react";

export function useViewportSize() {
    const [size, setSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

    // WidthGreaterThan
    const wgt = (w: number) => size.width >= w;

    useEffect(() => {
        const updateSize = () => {
            const viewportWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

            setSize({
                width: viewportWidth,
                height: viewportHeight
            })
        }
        updateSize();

        window.addEventListener("resize", updateSize);

        return () => window.removeEventListener("resize", updateSize)
    }, [])

    // is*: based on TailwindCSS responsive breakpoints
    return {...size, isSm: wgt(640), isMd: wgt(768), isLg: wgt(1024), isXL: wgt(1280), is2XL: wgt(1536) }
}