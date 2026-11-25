// Plain pass-through layout — auth guard lives in AuthedAdminPage server component.
// This layout intentionally has NO redirect so /admin/login can render without looping.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
