import { Sidebar } from "@/components/shell/sidebar";
import { DevicesProvider } from "@/lib/devices-store";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <DevicesProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">{children}</div>
      </div>
    </DevicesProvider>
  );
}
