import UsersTab from "features/core/admin/components/user-tab";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  return <UsersTab page={page} />;
}
