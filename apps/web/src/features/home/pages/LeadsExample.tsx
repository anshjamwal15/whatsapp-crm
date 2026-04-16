/**
 * Example: Leads page using the Sidebar component
 * This demonstrates how to use the AppLayout with the Sidebar
 * in another screen/page with a different layout
 */

import { AppLayout } from '@/layouts';
import { Plus, Filter, Download, Search } from 'lucide-react';

export const LeadsExample = () => {
  return (
    <AppLayout
      workspaceName="Precision HQ"
      workspaceLabel="ACTIVE WORKSPACE"
      onNewBroadcast={() => {
        console.log('Opening new broadcast dialog');
        // TODO: Implement broadcast dialog
      }}
      onHelpCenter={() => {
        console.log('Opening help center');
        // TODO: Navigate to help center or open in new tab
      }}
    >
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
            <p className="text-sm text-gray-600 mt-1">Manage and track your leads</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                className="bg-transparent ml-2 text-sm w-full outline-none"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
              <Plus className="w-4 h-4" />
              Add Lead
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Leads Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                    Name
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                    Email
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                    Company
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                    Added
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: 'Alice Johnson',
                    email: 'alice@example.com',
                    company: 'Tech Corp',
                    status: 'New',
                    added: '2 days ago',
                  },
                  {
                    name: 'Bob Smith',
                    email: 'bob@example.com',
                    company: 'Innovation Inc',
                    status: 'Contacted',
                    added: '5 days ago',
                  },
                  {
                    name: 'Carol White',
                    email: 'carol@example.com',
                    company: 'Future Systems',
                    status: 'Qualified',
                    added: '1 week ago',
                  },
                  {
                    name: 'David Brown',
                    email: 'david@example.com',
                    company: 'Digital Solutions',
                    status: 'Proposal Sent',
                    added: '2 weeks ago',
                  },
                ].map((lead, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-gray-900">
                        {lead.name}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-600">{lead.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-600">{lead.company}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          lead.status === 'New'
                            ? 'bg-blue-100 text-blue-700'
                            : lead.status === 'Contacted'
                            ? 'bg-yellow-100 text-yellow-700'
                            : lead.status === 'Qualified'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-600">{lead.added}</p>
                    </td>
                    <td className="py-4 px-6">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing 1 to 4 of 24 leads
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                Previous
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                3
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};
