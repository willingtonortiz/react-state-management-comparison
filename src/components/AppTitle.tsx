import { PropsWithChildren } from "react";

export function AppTitle({ children }: PropsWithChildren) {
  return (
    <h1 className="text-2xl font-semibold text-center text-gray-600">
      {children}
    </h1>
  );
}
