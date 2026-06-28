import { Terminal, Code, CheckCircle } from 'lucide-react';

export function DocsPage() {
  return (
    <div className="pt-28 px-6 max-w-4xl mx-auto min-h-screen text-gray-200">
      <h1 className="text-4xl font-bold text-white mb-6">API Documentation</h1>
      
      <p className="text-xl text-gray-400 mb-12">
        Integrate the Ad Performance Predictor directly into your own applications using our FastAPI REST endpoints.
      </p>

      <div className="space-y-8">
        <section className="bg-[#151515] p-6 sm:p-8 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-md font-bold text-sm tracking-widest">POST</span>
            <code className="text-lg text-white">/predict</code>
          </div>
          <p className="text-gray-400 mb-6">Analyzes an ad copy and returns performance and ethical metrics.</p>

          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-gray-500" /> Request Body (JSON)
          </h4>
          <pre className="bg-black p-4 rounded-xl border border-gray-800 text-green-400 font-mono text-sm overflow-x-auto mb-6">
{`{
  "ad_text": "Buy now before time runs out!",
  "image_url": ""
}`}
          </pre>

          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <Code className="w-4 h-4 text-gray-500" /> Response (JSON)
          </h4>
          <pre className="bg-black p-4 rounded-xl border border-gray-800 text-blue-400 font-mono text-sm overflow-x-auto">
{`{
  "performance_score": 85,
  "creepiness": 0.42,
  "urgency": 0.95,
  "ethical_flags": ["High Urgency"]
}`}
          </pre>
        </section>

        <section className="bg-[#151515] p-6 sm:p-8 rounded-2xl border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#4da5fc]" /> Authentication
          </h3>
          <p className="text-gray-400">
            Currently, the API is open for local development on <code className="text-white bg-black px-2 py-1 rounded">localhost:8000</code>. In a production environment, you will need to pass an API key in the Authorization header.
          </p>
        </section>
      </div>
    </div>
  );
}
