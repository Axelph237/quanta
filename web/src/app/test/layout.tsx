"use client";

import CircuitScriptLoader from "@/lib/circuit/quantumCircuitClient";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CircuitScriptLoader />
      {children}
    </>
  );
}
