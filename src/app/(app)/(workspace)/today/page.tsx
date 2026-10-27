import { ProtectedPlaceholder } from "@/components/layout/protected-placeholder";

export default function TodayPage() {
  return (
    <ProtectedPlaceholder
      title="Tonight"
      description="Tonight’s dinner will appear here."
    />
  );
}
