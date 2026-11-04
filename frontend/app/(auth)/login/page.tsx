import { LoginForm } from '@/components/auth/login-form';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; expired?: string }>;
}) {
  const { from, expired } = await searchParams;
  return <LoginForm from={from} expired={Boolean(expired)} />;
}
