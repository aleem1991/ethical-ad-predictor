import { Brain, ShieldCheck, AlertTriangle } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="pt-28 px-6 max-w-4xl mx-auto min-h-screen text-gray-200">
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
        How it <span className="bg-gradient-to-b from-[#4da5fc] to-white bg-clip-text text-transparent italic">Works</span>
      </h1>
      
      <p className="text-xl text-gray-400 mb-12">
        Our Ad Performance & Ethics Predictor leverages an advanced XGBoost machine learning model to evaluate your ad copy across three critical dimensions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-[#151515] p-6 rounded-2xl border border-gray-800">
          <Brain className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Performance Score</h3>
          <p className="text-gray-400">Predicts how likely users are to click on your ad based on historical engagement patterns and linguistic analysis.</p>
        </div>
        
        <div className="bg-[#151515] p-6 rounded-2xl border border-gray-800">
          <ShieldCheck className="w-8 h-8 text-green-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Creepiness Factor</h3>
          <p className="text-gray-400">Evaluates if the ad feels too invasive, overly personalized, or crosses privacy boundaries.</p>
        </div>
        
        <div className="bg-[#151515] p-6 rounded-2xl border border-gray-800">
          <AlertTriangle className="w-8 h-8 text-orange-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Urgency Level</h3>
          <p className="text-gray-400">Measures the use of FOMO (Fear Of Missing Out) or manipulative pressure tactics.</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#4da5fc]/10 to-transparent p-8 rounded-2xl border border-[#4da5fc]/20">
        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
        <p className="text-gray-300 leading-relaxed">
          We believe that effective advertising shouldn't come at the cost of consumer trust. By pre-screening your copy with our XGBoost engine, you can strike the perfect balance between high-converting copy and ethical marketing practices.
        </p>
      </div>
    </div>
  );
}
