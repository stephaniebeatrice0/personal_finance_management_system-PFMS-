import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; expired?: string }>;
}) {
  const { callbackUrl, expired } = await searchParams;
  return <LoginForm callbackUrl={callbackUrl} expired={Boolean(expired)} />;
}
