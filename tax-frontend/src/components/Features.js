import { FaChartLine, FaLock, FaBolt } from "react-icons/fa";

const features = [
  {
    icon: <FaChartLine className="w-8 h-8 text-lime-400" />,
    title: "Accurate Calculations",
    desc: "Get instant, precise results using the latest tax regulations.",
  },
  {
    icon: <FaLock className="w-8 h-8 text-lime-400" />,
    title: "Secure & Private",
    desc: "Your data stays safe with enterprise-grade security practices.",
  },
  {
    icon: <FaBolt className="w-8 h-8 text-lime-400" />,
    title: "Lightning Fast",
    desc: "Enjoy smooth and quick performance across all devices.",
  },
];

export default function Features() {
  return (
    <section id="features" className="mb-20">
      <h2 className="text-3xl font-semibold text-center mb-12 text-lime-400">
        Why Choose Us?
      </h2>
      <div className="grid md:grid-cols-3 gap-8 text-center">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="p-6 bg-gray-800/60 rounded-2xl border border-gray-700 shadow-lg hover:scale-[1.03] transition"
          >
            <div className="mb-4 flex justify-center">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-lime-400">{f.title}</h3>
            <p className="text-gray-300">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
