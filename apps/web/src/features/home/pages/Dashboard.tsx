import { useUser } from '@/hooks';
import { AppLayout } from '@/layouts';
import { Users, TrendingUp, Clock, AlertCircle } from 'lucide-react';

/**
 * CRM Dashboard page
 */
export const Dashboard = () => {
  const user = useUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to access the dashboard</p>
      </div>
    );
  }

  return (
    <AppLayout
      onNewBroadcast={() => console.log('New Broadcast clicked')}
      onHelpCenter={() => console.log('Help Center clicked')}
      onNotificationClick={() => console.log('Notifications clicked')}
      onSettingsClick={() => console.log('Settings clicked')}
    >
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 w-full">
          {/* Dashboard Title and Actions */}
          <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back. Here's what's happening with your leads today.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">View Follow-ups</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
              📥 Open Inbox
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
              + New Contact
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">+12%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">42</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide mt-2">New Leads Today</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">156</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide mt-2">Open Conversations</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Alert</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">08</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide mt-2">Follow-ups Due Today</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">2m 45s</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide mt-2">Avg Response Time</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Leads by Stage */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Leads by Stage</h2>
                <p className="text-sm text-gray-600">Current pipeline distribution across 5 stages</p>
              </div>
              <button className="text-sm text-gray-600 hover:text-gray-900">Last 30 Days</button>
            </div>

            <div className="space-y-4">
              {[
                { label: 'New Inquiry', value: 320, color: 'bg-blue-600' },
                { label: 'Initial Contact', value: 214, color: 'bg-blue-500' },
                { label: 'Proposal Sent', value: 105, color: 'bg-blue-400' },
                { label: 'Negotiation', value: 58, color: 'bg-blue-300' },
                { label: 'Closing', value: 32, color: 'bg-green-600' },
              ].map((stage) => (
                <div key={stage.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{stage.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{stage.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${stage.color} h-2 rounded-full`} style={{ width: `${(stage.value / 320) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-6 pt-6 border-t border-gray-200">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white"></div>
                ))}
              </div>
              <span className="text-xs text-gray-600">+4</span>
              <span className="text-xs text-gray-500 ml-auto">"Pipeline velocity increased by 8.6% since last week"</span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { icon: '👤', title: 'New lead from +1 (555) 0123', time: '2 minutes ago', source: 'Source: Facebook Ads' },
                { icon: '📊', title: 'Sarah assigned to Project Echo', time: '45 minutes ago', source: 'Automation: Round Robin' },
                { icon: '📁', title: 'Lead moved to "Negotiation"', time: '2 hours ago', source: 'By Marcus Chen' },
                { icon: '📞', title: 'Missed call from Unknown', time: '3 hours ago', source: 'Logged to CRM' },
              ].map((activity, idx) => (
                <div key={idx} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className="text-lg">{activity.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time} • {activity.source}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">View All Notifications</button>
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Team Performance</h2>
              <p className="text-sm text-gray-600">Live collaboration metrics</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span className="text-gray-600">Live: 4 Members Online</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Team Member</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Active Chats</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Avg. Response</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Workload</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Marcus Chen', role: 'Account Manager', status: 'AVAILABLE', chats: '12 Chats', response: '1m 15s', workload: 45 },
                  { name: 'Sarah Lopez', role: 'Support Lead', status: 'IN CALL', chats: '24 Chats', response: '3m 42s', workload: 85 },
                  { name: 'David Wong', role: 'Sales Associate', status: 'OFFLINE', chats: '0 Chats', response: '--', workload: 0 },
                ].map((member, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        member.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                        member.status === 'IN CALL' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">{member.chats}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{member.response}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${
                              member.workload > 70 ? 'bg-orange-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${member.workload}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{member.workload}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex -space-x-2">
              {[1, 2].map((i) => (
                <div key={i} className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white"></div>
              ))}
            </div>
            <span className="text-xs text-gray-600">2 Team members live</span>
          </div>
        </div>
        </div>
      </main>
    </AppLayout>
  );
};
