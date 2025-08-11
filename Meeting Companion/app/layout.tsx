import "./../styles/globals.css";
export const metadata = { title: "Meeting Companion", description: "Private meeting bot and summaries" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
