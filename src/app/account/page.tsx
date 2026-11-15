import { Suspense } from "react";
import { AuthPage } from "@/src/components/AuthPage/AuthPage";

type AccountPageProps = {
  searchParams: Promise<{ registered?: string | string[] }>;
};

async function AccountPageContent({ searchParams }: AccountPageProps) {
  const params = await searchParams;
  return <AuthPage mode="login" registrationSuccess={params.registered === "1"} />;
}

export default function AccountPage({ searchParams }: AccountPageProps) {
  return (
    <Suspense fallback={<AuthPage mode="login" />}>
      <AccountPageContent searchParams={searchParams} />
    </Suspense>
  );
}
