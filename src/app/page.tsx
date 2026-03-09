import { Layout } from "@/components/Layout";
import { MinerForm } from "@/components/MinerForm";
import { type Locale, t } from "@/lib/translations";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale: Locale = lang === "it" ? "it" : "en";

  return (
    <Layout locale={locale}>
      <div className="text-center px-1">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-bitcoin-orange mb-2 tracking-tight">
          {t(locale, "app.subtitle")}
        </h1>
        <p className="text-gray-400 mb-6 sm:mb-10 max-w-lg mx-auto leading-relaxed text-sm sm:text-base">
          {t(locale, "app.description")}
        </p>
        <MinerForm locale={locale} />
      </div>
    </Layout>
  );
}
