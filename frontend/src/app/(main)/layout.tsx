import Appshell from '@/features/appshell/appshell';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Appshell>{children}</Appshell>;
}
