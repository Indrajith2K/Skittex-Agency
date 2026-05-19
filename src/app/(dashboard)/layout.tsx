import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Header />
        <main className="main-padding" style={{ flex: 1, width: '100%', maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
