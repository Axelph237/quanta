import { useEffect, useState } from "react";

export function useViewportSize() {
    const [size, setSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

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

    return size
}