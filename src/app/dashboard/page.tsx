import { Layout } from "@/components/Layout";
import { DashboardClient } from "@/components/DashboardClient";
import { type Locale } from "@/lib/translations";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale: Locale = lang === "it" ? "it" : "en";

  return (
    <Layout locale={locale}>
      <DashboardClient locale={locale} />
    </Layout>
  );
}
