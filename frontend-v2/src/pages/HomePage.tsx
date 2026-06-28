import { useState, useEffect } from 'react';
import { BoltStyleChat } from "@/components/ui/bolt-style-chat";

export function HomePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSend = async (payload: { message: string, messageB?: string, age: number, income: number, gender: string, hour: number, dayOfWeek: number }) => {
    setLoading(true);
    setResult(null);
    
    try {
      const isABTest = !!payload.messageB;
      const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const endpoint = isABTest ? `${baseUrl}/ab_test` : `${baseUrl}/predict`;
      
      const body = isABTest ? {
        ad_text_a: payload.message,
        ad_text_b: payload.messageB,
        target_age: payload.age,
        area_income: payload.income,
        target_gender: payload.gender,
        hour: payload.hour,
        day_of_week: payload.dayOfWeek
      } : {
        ad_text: payload.message, 
        image_url: "",
        target_age: payload.age,
        area_income: payload.income,
        target_gender: payload.gender,
        hour: payload.hour,
        day_of_week: payload.dayOfWeek
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const finalResult = { ...data, is_ab_test: isABTest };
      setResult(finalResult);
      
      // Save to LocalStorage
      const historyItem = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        is_ab_test: isABTest,
        payload,
        result: finalResult
      };
      
      try {
        const existingHistory = JSON.parse(localStorage.getItem('ad_history') || '[]');
        const newHistory = [historyItem, ...existingHistory];
        localStorage.setItem('ad_history', JSON.stringify(newHistory));
      } catch (e) {
        console.error("Failed to save history to localStorage", e);
      }
      
    } catch (err: any) {
      alert('Error: ' + (err.message || 'Failed to connect to the backend.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] overflow-hidden pt-20">
      {/* Interactive Mouse Glow */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
        }}
      />
      
      {/* Interactive Trust Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-blue-700/30 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[60%] bg-cyan-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-emerald-700/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="relative z-10">
        <BoltStyleChat 
          onSend={handleSend}
          loading={loading}
          result={result}
        />
      </div>
    </div>
  );
}
