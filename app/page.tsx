export default function Home() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-[#89b4fa] mb-2">
          Welcome to Maya
        </h1>
        <p className="text-[#cdd6f4] text-lg">
          Your intelligent assistant — ready to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {[
          { title: "💬 Chat", desc: "Start a conversation with Maya." },
          { title: "📋 Tasks", desc: "Manage your to-dos and projects." },
          { title: "🔍 Search", desc: "Find anything instantly." },
          { title: "⚙️ Settings", desc: "Customize your experience." },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5 hover:border-[#89b4fa] transition-colors cursor-pointer"
          >
            <h2 className="text-lg font-semibold text-[#cdd6f4] mb-1">
              {card.title}
            </h2>
            <p className="text-sm text-[#a6adc8]">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
