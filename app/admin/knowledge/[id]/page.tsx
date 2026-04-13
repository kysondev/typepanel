import { KnowledgeCollectionView } from "features/core/admin/components/knowledge-collection-view";

export default async function KnowledgeCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <KnowledgeCollectionView id={id} />;
}
