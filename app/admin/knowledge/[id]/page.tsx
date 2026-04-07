import { KnowledgeCollectionView } from "features/admin/components/knowledge-collection-view";

export default function KnowledgeCollectionPage({ params }: { params: { id: string } }) {
  return <KnowledgeCollectionView id={params.id} />;
}
