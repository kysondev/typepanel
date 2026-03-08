import { MoreVertical, Search } from "lucide-react";

export default function UsersTab() {
  const users = [
    {
      name: "Kyson Weng",
      email: "email@kyson.dev",
      role: "Admin",
    },
    {
      name: "Test User",
      email: "testuser@typepanel.xyz",
      role: "User",
    },
  ];

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
            {users.map((user) => (
              <tr
                key={user.email}
                className="group hover:bg-neutral-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-neutral-900">
                    {user.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-neutral-600 font-medium">
                    {user.email}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[13px] font-medium text-neutral-600">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right pr-8">
                  <button className="text-neutral-400 hover:text-[#0A0A0A] transition-colors p-1 rounded-md hover:bg-neutral-100">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
