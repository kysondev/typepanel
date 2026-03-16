import { MoreVertical, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getUsers } from "features/admin/actions/user.action";
import { Button } from "features/common/components/ui/button";
import Link from "next/link";

export default async function UsersTab({ page = 1 }: { page?: number }) {
  const limit = 10;
  const usersRes = await getUsers(page, limit);

  const users = usersRes.success ? (usersRes.data?.users ?? []) : [];
  const totalPages = usersRes.success ? (usersRes.data?.totalPages ?? 1) : 1;
  const totalCount = usersRes.success ? (usersRes.data?.totalCount ?? 0) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-neutral-500 text-sm">
            Manage access and roles for all platform members.
          </p>
        </div>
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-900 transition-colors"
            size={16}
          />
          <input
            placeholder="Search users..."
            className="bg-white border border-neutral-200 rounded-lg py-2 pl-10 pr-4 text-sm w-full md:w-64 focus:ring-2 focus:ring-neutral-100 outline-none transition-all placeholder:text-neutral-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50">
              <th className="px-6 py-4 text-[13px] font-bold text-neutral-900">
                Name
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-neutral-900">
                Email Address
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-neutral-900">
                Role
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-neutral-900 text-right pr-8">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="group hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-neutral-900">
                      {user.name || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600 font-medium">
                      {user.email}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        user.role === "admin"
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right pr-8">
                    <button className="text-neutral-400 hover:text-[#0A0A0A] transition-colors p-1 rounded-md hover:bg-neutral-100">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-neutral-500 text-sm"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/30 flex items-center justify-between">
          <p className="text-xs text-neutral-500 font-medium">
            Showing{" "}
            <span className="text-neutral-900">{(page - 1) * limit + 1}</span>{" "}
            to{" "}
            <span className="text-neutral-900">
              {Math.min(page * limit, totalCount)}
            </span>{" "}
            of <span className="text-neutral-900">{totalCount}</span> users
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg"
              disabled={page <= 1}
              asChild={page > 1}
            >
              {page > 1 ? (
                <Link href={`/admin/users?page=${page - 1}`}>
                  <ChevronLeft size={16} />
                </Link>
              ) : (
                <ChevronLeft size={16} />
              )}
            </Button>
            <div className="text-xs font-bold text-neutral-900 px-2">
              {page} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg"
              disabled={page >= totalPages}
              asChild={page < totalPages}
            >
              {page < totalPages ? (
                <Link href={`/admin/users?page=${page + 1}`}>
                  <ChevronRight size={16} />
                </Link>
              ) : (
                <ChevronRight size={16} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
