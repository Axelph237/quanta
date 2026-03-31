import { useEffect, useState } from "react";

type DeviceType = "mobile" | "desktop";

export function useDeviceType() {
    const [deviceType, setDeviceType] = useState<DeviceType | undefined>(undefined);

    useEffect(() => {
        let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        // Screen resolution method
        if (!isMobile) {
            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;
            isMobile = (screenWidth < 768 || screenHeight < 768) && (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDeviceType(isMobile ? "mobile" : "desktop");
    }, []);

    return deviceType;
}