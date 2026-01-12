import { Libre_Baskerville, Bytesized, Outfit, DM_Mono } from "next/font/google";

export const libreBasker = Libre_Baskerville({
  weight: "400",
  variable: "--font-libre-baskerville",
});

export const bytesized = Bytesized({
  weight: "400",
  variable: "--font-bytesized",
});

export const outfit = Outfit({
  weight: ["400", "700"],
  variable: "--font-outfit",
});

export const dmMono = DM_Mono({
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});
