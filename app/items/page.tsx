import ItemViewer from "@/app/components/item-viewer";
import {
  buildAffixOptions,
  buildGradeOptions,
  buildItemCatalog,
} from "@/lib/item-data";

export default function ItemsPage() {
  const items = buildItemCatalog();
  const grades = buildGradeOptions();
  const prefixes = buildAffixOptions("prefix");
  const suffixes = buildAffixOptions("suffix");

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 pt-6 text-sm text-muted-foreground">
        Merchant DB-style item inspector with grade, prefix, suffix, and prestige controls.
      </div>
      <ItemViewer
        items={items}
        grades={grades}
        prefixes={prefixes}
        suffixes={suffixes}
        initialItemId={items[0]?.id}
        initialGradeId={grades[0]?.id ?? "0"}
        initialPrefixId="0"
        initialSuffixId="0"
        initialPrestige={0}
      />
    </main>
  );
}
