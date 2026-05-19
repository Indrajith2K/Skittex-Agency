import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email?.toLowerCase() !== "indrajithgamedevelouper2021@gmail.com") {
    redirect("/login");
  }

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
