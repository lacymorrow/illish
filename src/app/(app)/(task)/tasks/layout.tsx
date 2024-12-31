import { stackServerApp } from "@/lib/stack";
import "@/styles/globals.css";
import { StackProvider, StackTheme } from "@stackframe/stack";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <StackProvider app={stackServerApp}>
        <StackTheme>{children}</StackTheme>
      </StackProvider>
    </>
  );
}
