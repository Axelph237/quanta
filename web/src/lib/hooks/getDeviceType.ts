type DeviceType = "mobile" | "desktop";

export function getDeviceType(): DeviceType {
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // Screen resolution method
    if (!isMobile) {
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        isMobile = (screenWidth < 768 || screenHeight < 768) && (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
    }

    return isMobile ? "mobile" : "desktop";
}