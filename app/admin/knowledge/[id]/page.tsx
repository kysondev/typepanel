import { KnowledgeCollectionView } from "features/admin/components/knowledge-collection-view";

export default async function KnowledgeCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <KnowledgeCollectionView id={id} />;
}
