import ThemeCustomizer from "../../components/theme/ThemeCustomizer";


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <ThemeCustomizer />
    </>
  );
}
