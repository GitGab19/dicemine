import { Layout } from "@/components/Layout";
import { SettingsGate } from "@/components/SettingsGate";
import { type Locale } from "@/lib/translations";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale: Locale = lang === "it" ? "it" : "en";

  return (
    <Layout locale={locale}>
      <SettingsGate locale={locale} />
    </Layout>
  );
}
