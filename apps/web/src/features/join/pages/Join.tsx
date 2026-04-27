import { useState } from 'react';

export const Join = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #e8eef8 0%, #f0f7f4 50%, #e8f4f0 100%)' }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5">
        <span className="text-gray-900 font-semibold text-lg tracking-tight">PrecisionCRM</span>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600 font-medium">
          <a href="#" className="hover:text-gray-900 transition-colors">Platform</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Vision</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Community</a>
        </div>
        <button
          onClick={() => document.getElementById('waitlist-email')?.focus()}
          className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          Join Waitlist
        </button>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-4 pt-10 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/70 border border-gray-200 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-600 tracking-widest uppercase mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
          Join 2,000+ businesses ready to scale.
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight max-w-3xl mb-6">
          The Future of Collaborative{' '}
          <span className="text-blue-600">WhatsApp CRM</span>{' '}
          is Almost Here.
        </h1>

        {/* Subheadline */}
        <p className="text-gray-500 text-base max-w-md mb-10 leading-relaxed">
          Streamline team communication, manage leads, and grow your business with the most intuitive WhatsApp integration for enterprise teams.
        </p>

        {/* Email form */}
        {submitted ? (
          <div className="bg-white rounded-2xl shadow-md px-8 py-6 flex items-center gap-3 text-green-700 font-semibold text-base">
            <span className="text-2xl">🎉</span>
            You're on the list! We'll be in touch soon.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-md"
          >
            <input
              id="waitlist-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your business email"
              className="flex-1 px-5 py-4 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
            />
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-6 py-4 transition-colors whitespace-nowrap"
            >
              Join Waitlist
            </button>
          </form>
        )}

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-16 w-full max-w-3xl">
          {/* Card 1 — Kinetic Collaboration */}
          <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-6 text-left relative overflow-hidden">
            <span
              className="absolute -top-4 -left-2 text-[120px] font-black text-blue-100 select-none leading-none pointer-events-none"
              aria-hidden="true"
            >
              RC
            </span>
            <div className="relative z-10">
              <div className="mb-4">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <circle cx="16" cy="8" r="3" fill="#22c55e" />
                  <circle cx="8" cy="20" r="3" fill="#22c55e" />
                  <circle cx="24" cy="20" r="3" fill="#22c55e" />
                  <circle cx="16" cy="16" r="2.5" fill="#16a34a" />
                  <line x1="16" y1="11" x2="16" y2="13.5" stroke="#22c55e" strokeWidth="1.5" />
                  <line x1="10.5" y1="18.5" x2="13.5" y2="16.5" stroke="#22c55e" strokeWidth="1.5" />
                  <line x1="21.5" y1="18.5" x2="18.5" y2="16.5" stroke="#22c55e" strokeWidth="1.5" />
                </svg>
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Kinetic Collaboration</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Watch your team interact with customers in real-time, zero lag, total transparency.
              </p>
            </div>
          </div>

          {/* Card 2 — Built for Scale */}
          <div className="bg-green-50/80 border border-green-100 rounded-2xl p-6 text-left">
            <div className="flex items-center gap-1 mb-4">
              <div className="flex -space-x-2">
                {['bg-orange-400', 'bg-blue-500', 'bg-purple-500'].map((color, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {['A', 'B', 'C'][i]}
                  </div>
                ))}
              </div>
              <span className="ml-2 bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
                +1.2k
              </span>
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-2">Built for Scale</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Engineered to handle 10,000+ daily chats without breaking a sweat. Enterprise reliability, consumer ease.
            </p>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className="bg-white px-8 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-14">
            <div>
              <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-3">
                Core Capabilities
              </p>
              <h2 className="text-4xl font-extrabold text-gray-900 leading-tight max-w-xs">
                Engineered for the modern collaborative enterprise.
              </h2>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs md:pt-10">
              Everything you need to turn WhatsApp into a high-performance sales engine.
            </p>
          </div>

          {/* Capabilities grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
            {/* Shared Inboxes */}
            <div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h4 className="text-gray-900 font-bold text-base mb-2">Shared Inboxes</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Centralized communication for your entire team. No more siloed conversations or missed replies.
              </p>
            </div>

            {/* Analytics */}
            <div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h4 className="text-gray-900 font-bold text-base mb-2">Analytics</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Data-driven insights to track performance and growth. Monitor response times and conversion rates in real-time.
              </p>
            </div>

            {/* Sales Pipeline */}
            <div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <h4 className="text-gray-900 font-bold text-base mb-2">Sales Pipeline</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Visual deal tracking from lead to close. Manage your WhatsApp funnel with intuitive drag-and-drop boards.
              </p>
            </div>

            {/* Team Management */}
            <div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              </div>
              <h4 className="text-gray-900 font-bold text-base mb-2">Team Management</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Role-based access and workload balancing. Ensure the right leads always reach the right team members.
              </p>
            </div>

            {/* Workspaces */}
            <div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h4 className="text-gray-900 font-bold text-base mb-2">Workspaces</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Multiple business environments managed under one account. Perfect for agencies and multi-brand corporations.
              </p>
            </div>

            {/* And more... CTA card */}
            <div className="bg-blue-700 rounded-2xl p-6 flex flex-col items-start justify-center">
              <h4 className="text-white font-bold text-lg mb-2">And more...</h4>
              <p className="text-blue-200 text-sm leading-relaxed">
                We're building the future of CRM.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 px-8 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-sm tracking-widest uppercase">Precision Architect CRM</p>
            <p className="text-xs mt-1 tracking-widest uppercase">© 2024 Precision Architect CRM. Built for Kinetic Collaboration.</p>
          </div>
          <div className="flex items-center gap-6 text-xs font-semibold tracking-widest uppercase">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">API Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
