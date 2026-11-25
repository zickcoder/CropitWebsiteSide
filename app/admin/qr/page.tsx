import { AuthedAdminPage } from "@/components/admin/AuthedAdminPage";
import { QrContent } from "@/components/admin/QrContent";

export default function AdminQrPage() {
  return (
    <AuthedAdminPage>
      <QrContent />
    </AuthedAdminPage>
  );
}
