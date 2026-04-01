import { useEffect, useState } from "react";

type DeviceType = "mobile" | "desktop";

export function useDeviceType(): DeviceType | undefined {
    const getDeviceType = () => {
        try {
            let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            // Screen resolution method
            if (!isMobile) {
                const screenWidth = window.screen.width;
                const screenHeight = window.screen.height;
                isMobile = (screenWidth < 768 || screenHeight < 768) && (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
            }
            return isMobile ? "mobile" : "desktop";
        } catch {
            return undefined;
        }
    }

    const [deviceType, setDeviceType] = useState<DeviceType | undefined>(getDeviceType());

    useEffect(() => {
        if (deviceType === undefined) {
            setDeviceType(getDeviceType());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return deviceType;
}