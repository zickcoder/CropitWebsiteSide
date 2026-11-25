import { AuthedAdminPage } from "@/components/admin/AuthedAdminPage";
import { AdsContent } from "@/components/admin/AdsContent";

export default function AdminAdsPage() {
  return (
    <AuthedAdminPage>
      <AdsContent />
    </AuthedAdminPage>
  );
}
