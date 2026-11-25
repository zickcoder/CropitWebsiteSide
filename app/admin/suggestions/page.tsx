import { AuthedAdminPage } from "@/components/admin/AuthedAdminPage";
import { SuggestionsContent } from "@/components/admin/SuggestionsContent";

export default function AdminSuggestionsPage() {
  return (
    <AuthedAdminPage>
      <SuggestionsContent />
    </AuthedAdminPage>
  );
}
