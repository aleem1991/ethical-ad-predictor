'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Plus, Paperclip, Image as ImageIcon, FileCode,
  Sparkles, Zap, Bolt, Users, Activity, DollarSign, AlertTriangle,
  SendHorizontal, Loader2, AlertCircle, ShieldAlert, CheckCircle2, Clock
} from 'lucide-react'

// CHAT INPUT
function ChatInput({ 
  onSend, 
  placeholder = "What do you want to build?",
  loading = false 
}: {
  onSend?: (payload: { message: string, messageB?: string, age: number, income: number, gender: string, hour: number, dayOfWeek: number }) => void
  placeholder?: string
  loading?: boolean
}) {
  const [message, setMessage] = useState('')
  const [messageB, setMessageB] = useState('')
  const [isABTest, setIsABTest] = useState(false)
  const [age, setAge] = useState<number>(35)
  const [income, setIncome] = useState<number>(60000)
  const [gender, setGender] = useState<string>('All')
  const [hour, setHour] = useState<number>(9)
  const [dayOfWeek, setDayOfWeek] = useState<number>(0)
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [message])

  const handleSubmit = () => {
    if (message.trim() && !loading) {
      onSend?.({ message, messageB: isABTest ? messageB : undefined, age, income, gender, hour, dayOfWeek })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="relative w-full max-w-[680px] mx-auto">
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
      <div className="relative rounded-2xl bg-white/[0.02] backdrop-blur-3xl ring-1 ring-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/[0.05]">
        
        {/* Toggle Mode */}
        <div className="flex items-center justify-center pt-4 pb-2">
          <div className="bg-[#1a1a1e] rounded-full p-1 flex ring-1 ring-white/10">
            <button onClick={() => setIsABTest(false)} title="Switch to single ad prediction mode" aria-label="Single Ad Mode" className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!isABTest ? 'bg-[#1488fc] text-white shadow-lg' : 'text-[#8a8a8f] hover:text-white'}`}>Single Ad</button>
            <button onClick={() => setIsABTest(true)} title="Compare two ads side-by-side" aria-label="A/B Test Mode" className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${isABTest ? 'bg-[#1488fc] text-white shadow-lg' : 'text-[#8a8a8f] hover:text-white'}`}>A/B Test</button>
          </div>
        </div>

        {/* Demographic Controls */}
        <div className="flex flex-wrap items-center gap-4 px-5 pt-2 pb-2 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-[#8a8a8f]" />
            <span className="text-xs font-medium text-[#8a8a8f]">Audience:</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <label className="text-[#a0a0a5]">Age:</label>
            <input 
              type="number" 
              title="Target audience age"
              aria-label="Target age"
              value={age} 
              onChange={(e) => setAge(Number(e.target.value))}
              className="bg-[#1a1a1e] border border-white/10 rounded-md px-2 py-1 text-white w-16 focus:outline-none focus:border-[#4da5fc]"
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <label className="text-[#a0a0a5]">Income (USD):</label>
            <input 
              type="number" 
              title="Target audience average income"
              aria-label="Target income"
              value={income} 
              onChange={(e) => setIncome(Number(e.target.value))}
              className="bg-[#1a1a1e] border border-white/10 rounded-md px-2 py-1 text-white w-24 focus:outline-none focus:border-[#4da5fc]"
            />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <label className="text-[#a0a0a5]">Gender:</label>
            <select 
              value={gender} 
              onChange={(e) => setGender(e.target.value)}
              className="bg-[#1a1a1e] border border-white/10 rounded-md px-2 py-1 text-white focus:outline-none focus:border-[#4da5fc] transition-all"
            >
              <option value="All" className="bg-[#1a1a1e]">All</option>
              <option value="Male" className="bg-[#1a1a1e]">Male</option>
              <option value="Female" className="bg-[#1a1a1e]">Female</option>
            </select>
          </div>

          <div className="flex items-center gap-3 border-l border-white/10 pl-4 ml-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-[#8a8a8f]" />
              <span className="text-xs font-medium text-[#8a8a8f]">Schedule:</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <label className="text-[#a0a0a5]">Day:</label>
              <select 
                value={dayOfWeek} 
                onChange={(e) => setDayOfWeek(Number(e.target.value))}
                className="bg-[#1a1a1e] border border-white/10 rounded-md px-2 py-1 text-white focus:outline-none focus:border-[#4da5fc] transition-all"
              >
                <option value={0} className="bg-[#1a1a1e]">Monday</option>
                <option value={1} className="bg-[#1a1a1e]">Tuesday</option>
                <option value={2} className="bg-[#1a1a1e]">Wednesday</option>
                <option value={3} className="bg-[#1a1a1e]">Thursday</option>
                <option value={4} className="bg-[#1a1a1e]">Friday</option>
                <option value={5} className="bg-[#1a1a1e]">Saturday</option>
                <option value={6} className="bg-[#1a1a1e]">Sunday</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <label className="text-[#a0a0a5]">Time:</label>
              <select 
                value={hour} 
                onChange={(e) => setHour(Number(e.target.value))}
                className="bg-[#1a1a1e] border border-white/10 rounded-md px-2 py-1 text-white focus:outline-none focus:border-[#4da5fc] transition-all"
              >
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={i} className="bg-[#1a1a1e]">{i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isABTest ? "Ad Copy A..." : placeholder}
            disabled={loading}
            title="Enter your ad copy here (Press Enter to analyze)"
            aria-label="Ad copy input"
            className="w-full resize-none bg-transparent text-[15px] text-white placeholder-[#5a5a5f] px-5 pt-5 pb-3 focus:outline-none min-h-[80px]"
            style={{ height: '80px' }}
          />
          {isABTest && (
            <textarea
              value={messageB}
              onChange={(e) => setMessageB(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ad Copy B..."
              disabled={loading}
              className="w-full resize-none bg-transparent border-t border-white/[0.05] text-[15px] text-white placeholder-[#5a5a5f] px-5 pt-5 pb-3 focus:outline-none min-h-[80px]"
              style={{ height: '80px' }}
            />
          )}
        </div>

        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          <div className="flex items-center gap-1">
            <div className="relative">
              <button
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                title="Add attachments (images, files, code)"
                aria-label="Add attachments"
                className="flex items-center justify-center size-8 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-[#8a8a8f] hover:text-white transition-all duration-200 active:scale-95"
              >
                <Plus className={`size-4 transition-transform duration-200 ${showAttachMenu ? 'rotate-45' : ''}`} />
              </button>

              {showAttachMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowAttachMenu(false)} />
                  <div className="absolute bottom-full left-0 mb-2 z-50 bg-[#1a1a1e]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="p-1.5 min-w-[180px]">
                      {[
                        { icon: <Paperclip className="size-4" />, label: 'Upload file' },
                        { icon: <ImageIcon className="size-4" />, label: 'Add image' },
                        { icon: <FileCode className="size-4" />, label: 'Import code' }
                      ].map((item, i) => (
                        <button key={i} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#a0a0a5] hover:bg-white/5 hover:text-white transition-all duration-150">
                          {item.icon}
                          <span className="text-sm">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 text-[#8a8a8f] hover:text-white hover:bg-white/5 active:scale-95">
              <Zap className="size-4 text-blue-400" />
              <span>Hybrid Multi-Modal Engine</span>
            </button>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              disabled={!message.trim() || loading}
              title={message.trim() ? "Click to analyze ad copy" : "Please enter ad copy first"}
              aria-label="Analyze ad copy"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[#1488fc] hover:bg-[#1a94ff] text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-[0_0_20px_rgba(20,136,252,0.3)] shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Predict CTR</span>
                  <SendHorizontal className="size-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Ray Background
function RayBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
      <div className="absolute inset-0 bg-[#0f0f0f]" />
      <div 
        className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[4000px] h-[1800px] sm:w-[6000px]"
        style={{
          background: `radial-gradient(circle at center 800px, rgba(20, 136, 252, 0.8) 0%, rgba(20, 136, 252, 0.35) 14%, rgba(20, 136, 252, 0.18) 18%, rgba(20, 136, 252, 0.08) 22%, rgba(17, 17, 20, 0.2) 25%)`
        }}
      />
      <div 
        className="absolute top-[65%] left-1/2 w-[1600px] h-[1600px] sm:top-[65%] sm:w-[3043px] sm:h-[2865px]"
        style={{ transform: 'translate(-50%) rotate(180deg)' }}
      >
        <div className="absolute w-full h-full rounded-full -mt-[13px]" style={{ background: 'radial-gradient(43.89% 25.74% at 50.02% 97.24%, #111114 0%, #0f0f0f 100%)', border: '16px solid white', transform: 'rotate(180deg)', zIndex: 5 }} />
        <div className="absolute w-full h-full rounded-full bg-[#0f0f0f] -mt-[11px]" style={{ border: '23px solid #b7d7f6', transform: 'rotate(180deg)', zIndex: 4 }} />
        <div className="absolute w-full h-full rounded-full bg-[#0f0f0f] -mt-[8px]" style={{ border: '23px solid #8fc1f2', transform: 'rotate(180deg)', zIndex: 3 }} />
        <div className="absolute w-full h-full rounded-full bg-[#0f0f0f] -mt-[4px]" style={{ border: '23px solid #64acf6', transform: 'rotate(180deg)', zIndex: 2 }} />
        <div className="absolute w-full h-full rounded-full bg-[#0f0f0f]" style={{ border: '20px solid #1172e2', boxShadow: '0 -15px 24.8px rgba(17, 114, 226, 0.6)', transform: 'rotate(180deg)', zIndex: 1 }} />
      </div>
    </div>
  )
}

// ANNOUNCEMENT BADGE COMPONENT
function AnnouncementBadge({ text, href = "#" }: { text: string; href?: string }) {
  const content = (
    <>
      <span className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none opacity-70 mix-blend-overlay" style={{ background: 'radial-gradient(ellipse at center top, rgba(255, 255, 255, 0.15) 0%, transparent 70%)' }} />
      <span className="absolute -top-px left-1/2 -translate-x-1/2 h-[2px] w-[100px] opacity-60" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(37, 119, 255, 0.8) 20%, rgba(126, 93, 225, 0.8) 50%, rgba(59, 130, 246, 0.8) 80%, transparent 100%)', filter: 'blur(0.5px)' }} />
      <Bolt className="size-4 relative z-10 text-white" />
      <span className="relative z-10 text-white font-medium">{text}</span>
    </>
  )

  const className = "relative inline-flex items-center gap-2 px-5 py-2 min-h-[40px] rounded-full text-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
  const style = {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
    backdropFilter: 'blur(20px) saturate(140%)',
    boxShadow: 'inset 0 1px rgba(255,255,255,0.2), inset 0 -1px rgba(0,0,0,0.1), 0 8px 32px -8px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.08)'
  }

  return href !== '#' ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>{content}</a>
  ) : (
    <button className={className} style={style}>{content}</button>
  )
}

// MAIN BOLT CHAT COMPONENT
interface BoltChatProps {
  title?: string
  subtitle?: string
  announcementText?: string
  announcementHref?: string
  placeholder?: string
  onSend?: (payload: { message: string, messageB?: string, age: number, income: number, gender: string, hour: number, dayOfWeek: number }) => void
  loading?: boolean
  result?: any
}

export function BoltStyleChat({
  title = "Predict",
  subtitle = "AI-powered analysis of ad copy performance and ethical risks.",
  announcementText = "Hybrid Multi-Modal (NLP + Demographics)",
  announcementHref = "#",
  placeholder = "🔥 Limited time offer! Based on your recent activity...",
  onSend,
  loading = false,
  result = null
}: BoltChatProps) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-y-auto overflow-x-hidden bg-[#0f0f0f] py-20">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <RayBackground />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-4 mt-8">
        {/* Announcement badge */}
        <div className="mb-6">
          <AnnouncementBadge text={announcementText} href={announcementHref} />
        </div>

        {/* Title section */}
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-1">
            {title}{' '}
            <span className="bg-gradient-to-b from-[#4da5fc] via-[#4da5fc] to-white bg-clip-text text-transparent italic pr-2">
              Ad CTR
            </span>
          </h1>
          <p className="text-base font-semibold sm:text-lg text-[#8a8a8f]">{subtitle}</p>
        </div>

        {/* Chat input */}
        <div className="w-full max-w-[700px] mb-6 sm:mb-8 mt-2">
          <ChatInput placeholder={placeholder} onSend={onSend} loading={loading} />
        </div>

        {/* Results Area */}
        {result && !result.is_ab_test && (
          <div className="w-full max-w-[700px] animate-in slide-in-from-bottom-6 fade-in duration-500 ease-out">
            <div className="rounded-2xl bg-[#1e1e22]/80 backdrop-blur-md ring-1 ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6">
              
              <h3 className="text-white font-medium text-lg mb-4 flex items-center gap-2">
                <Sparkles className="size-5 text-[#4da5fc]" />
                Analysis Results
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Performance Card */}
                <div className="bg-white/[0.03] backdrop-blur-2xl rounded-xl p-5 border border-white/[0.1] shadow-2xl flex flex-col items-center justify-center text-center">
                  <span className="text-[#8a8a8f] text-sm font-medium mb-2">Predicted Click-Through Probability</span>
                  <div className={`text-5xl font-bold ${
                    result.predicted_performance_score > 70 ? 'text-emerald-400' : 
                    result.predicted_performance_score > 40 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {result.predicted_performance_score}%
                  </div>
                </div>

                {/* Ethical Risks Card */}
                <div className="bg-white/[0.03] backdrop-blur-2xl rounded-xl p-5 border border-white/[0.1] shadow-2xl flex flex-col justify-center">
                  <span className="text-[#8a8a8f] text-sm font-medium mb-3 text-center">Ethical Risk Assessment</span>
                  
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-[#a0a0a5] text-sm flex items-center gap-2"><ShieldAlert className="size-4 text-[#8a8a8f]" /> Creepiness Risk</span>
                      {result.ethical_risk_assessment.creepiness_score > 0 ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-rose-400 bg-rose-400/10 px-2 py-1 rounded-md border border-rose-400/20">
                          High ({result.ethical_risk_assessment.creepiness_score})
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20">
                          <CheckCircle2 className="size-3.5" /> Low
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#a0a0a5] text-sm flex items-center gap-2"><AlertCircle className="size-4 text-[#8a8a8f]" /> Urgency/Scarcity</span>
                      {result.ethical_risk_assessment.urgency_score > 0 ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/20">
                          High ({result.ethical_risk_assessment.urgency_score})
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20">
                          <CheckCircle2 className="size-3.5" /> Low
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#a0a0a5] text-sm flex items-center gap-2"><Activity className="size-4 text-[#8a8a8f]" /> Medical Claims</span>
                      {result.ethical_risk_assessment.medical_claims_score > 0 ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-rose-400 bg-rose-400/10 px-2 py-1 rounded-md border border-rose-400/20">
                          High ({result.ethical_risk_assessment.medical_claims_score})
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20">
                          <CheckCircle2 className="size-3.5" /> Low
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#a0a0a5] text-sm flex items-center gap-2"><DollarSign className="size-4 text-[#8a8a8f]" /> Financial Promises</span>
                      {result.ethical_risk_assessment.financial_promises_score > 0 ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-rose-400 bg-rose-400/10 px-2 py-1 rounded-md border border-rose-400/20">
                          High ({result.ethical_risk_assessment.financial_promises_score})
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20">
                          <CheckCircle2 className="size-3.5" /> Low
                        </span>
                      )}
                    </div>
                  </div>

                  {result.ethical_risk_assessment.fairness_warning && (
                    <div className="mt-4 pt-4 border-t border-white/[0.05]">
                      <span className="text-amber-400 text-xs font-bold mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                        <AlertTriangle className="size-3.5" /> Fairness Warning
                      </span>
                      <p className="text-sm text-white/90 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                        {result.ethical_risk_assessment.fairness_warning}
                      </p>
                    </div>
                  )}

                  {result.suggested_rewrite && (
                    <div className="mt-4 pt-4 border-t border-white/[0.05]">
                      <span className="text-[#8a8a8f] text-xs font-medium mb-2 flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-purple-400" /> AI Rewrite Suggestion
                      </span>
                      <p className="text-sm text-white italic bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
                        "{result.suggested_rewrite}"
                      </p>
                    </div>
                  )}

                </div>
                
                {/* SHAP Values Explainable AI Card */}
                {result.shap_breakdown && (
                  <div className="bg-white/[0.03] backdrop-blur-2xl rounded-xl p-5 border border-white/[0.1] shadow-2xl md:col-span-2">
                    <span className="text-[#8a8a8f] text-sm font-medium mb-4 block">Why did you get this score? (Explainable AI)</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(result.shap_breakdown).map(([feature, impact]: [string, any], idx) => (
                        <div key={idx} className="flex flex-col p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] shadow-inner">
                          <span className="text-[#a0a0a5] text-xs font-medium uppercase tracking-wider mb-2 truncate" title={feature}>{feature}</span>
                          <span className={`text-lg font-bold flex items-center gap-1 ${
                            impact > 0 ? 'text-emerald-400' : impact < 0 ? 'text-rose-400' : 'text-zinc-400'
                          }`}>
                            {impact > 0 ? '↑' : impact < 0 ? '↓' : '-'} {Math.abs(impact).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Counterfactual Advice Panel */}
                {result.counterfactual_advice && (
                  <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 backdrop-blur-3xl rounded-xl p-5 border border-white/[0.15] shadow-2xl md:col-span-2">
                    <span className="text-white text-sm font-semibold mb-2 flex items-center gap-1.5">
                      <Zap className="size-4 text-blue-400" /> How to Improve (AI Advice)
                    </span>
                    <p className="text-sm text-white/90 leading-relaxed">
                      {result.counterfactual_advice}
                    </p>
                  </div>
                )}

                {/* Audience Insights Graph */}
                {result.audience_insights && (
                  <div className="bg-white/[0.03] backdrop-blur-2xl rounded-xl p-5 border border-white/[0.1] shadow-2xl md:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[#8a8a8f] text-sm font-medium">Audience Insights</span>
                      <span className="text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
                        Top Demo: {
                          result.audience_insights.age_performance.reduce((max: any, obj: any) => obj.score > max.score ? obj : max, result.audience_insights.age_performance[0]).label
                        } / {
                          result.audience_insights.income_performance.reduce((max: any, obj: any) => obj.score > max.score ? obj : max, result.audience_insights.income_performance[0]).label
                        }
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Age Chart */}
                      <div>
                        <span className="text-[#a0a0a5] text-xs font-medium uppercase tracking-wider mb-4 block">Performance by Age</span>
                        <div className="flex items-end gap-2 h-32">
                          {result.audience_insights.age_performance.map((item: any, idx: number) => {
                            const maxScore = Math.max(...result.audience_insights.age_performance.map((i:any) => i.score));
                            const height = `${(item.score / maxScore) * 100}%`;
                            const isMax = item.score === maxScore;
                            return (
                              <div key={idx} className="flex-1 flex flex-col items-center justify-end gap-2 h-full group">
                                <div className="text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">{item.score}%</div>
                                <div className={`w-full rounded-t-sm transition-all duration-500 ${isMax ? 'bg-[#1488fc]' : 'bg-white/10 group-hover:bg-white/20'}`} style={{ height }} />
                                <div className={`text-[10px] whitespace-nowrap ${isMax ? 'text-white font-semibold' : 'text-[#8a8a8f]'}`}>{item.label}</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Income Chart */}
                      <div>
                        <span className="text-[#a0a0a5] text-xs font-medium uppercase tracking-wider mb-4 block">Performance by Income (USD)</span>
                        <div className="flex items-end gap-2 h-32">
                          {result.audience_insights.income_performance.map((item: any, idx: number) => {
                            const maxScore = Math.max(...result.audience_insights.income_performance.map((i:any) => i.score));
                            const height = `${(item.score / maxScore) * 100}%`;
                            const isMax = item.score === maxScore;
                            return (
                              <div key={idx} className="flex-1 flex flex-col items-center justify-end gap-2 h-full group">
                                <div className="text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">{item.score}%</div>
                                <div className={`w-full rounded-t-sm transition-all duration-500 ${isMax ? 'bg-emerald-500' : 'bg-white/10 group-hover:bg-white/20'}`} style={{ height }} />
                                <div className={`text-[10px] whitespace-nowrap ${isMax ? 'text-white font-semibold' : 'text-[#8a8a8f]'}`}>{item.label}</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* A/B Test Results Area */}
        {result && result.is_ab_test && (
          <div className="w-full max-w-[900px] animate-in slide-in-from-bottom-6 fade-in duration-500 ease-out mt-4">
            <div className="rounded-2xl bg-[#1e1e22]/80 backdrop-blur-md ring-1 ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6">
              
              <div className="flex items-center justify-center mb-6 bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <div className="text-center">
                  <span className="text-sm text-[#a0a0a5] uppercase tracking-wider font-semibold">🏆 Winner</span>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    Ad {result.winner}
                  </h2>
                  {result.expected_lift > 0 && (
                    <p className="text-emerald-400 font-medium text-sm mt-1">Expected to generate {result.expected_lift}% more clicks</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Ad A */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-center font-semibold text-lg text-white mb-2">Ad A</h3>
                  
                  <div className="bg-white/[0.03] backdrop-blur-2xl rounded-xl p-5 border border-white/[0.1] shadow-2xl flex flex-col items-center justify-center text-center">
                    <span className="text-[#8a8a8f] text-sm font-medium mb-2">Click Probability</span>
                    <div className={`text-5xl font-bold ${
                      result.ad_a.predicted_performance_score > 70 ? 'text-emerald-400' : 
                      result.ad_a.predicted_performance_score > 40 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {result.ad_a.predicted_performance_score}%
                    </div>
                  </div>

                  {result.ad_a.shap_breakdown && (
                    <div className="bg-white/[0.03] backdrop-blur-2xl rounded-xl p-5 border border-white/[0.1] shadow-2xl">
                      <span className="text-[#8a8a8f] text-sm font-medium mb-4 block">Explainable AI</span>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(result.ad_a.shap_breakdown).map(([feature, impact]: [string, any], idx) => (
                          <div key={idx} className="flex flex-col p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] shadow-inner">
                            <span className="text-[#a0a0a5] text-xs font-medium uppercase tracking-wider mb-2 truncate" title={feature}>{feature}</span>
                            <span className={`text-lg font-bold flex items-center gap-1 ${
                              impact > 0 ? 'text-emerald-400' : impact < 0 ? 'text-rose-400' : 'text-zinc-400'
                            }`}>
                              {impact > 0 ? '↑' : impact < 0 ? '↓' : '-'} {Math.abs(impact).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.ad_a.ethical_risk_assessment?.fairness_warning && (
                    <div className="bg-white/[0.03] backdrop-blur-2xl rounded-xl p-5 border border-amber-500/20 shadow-lg">
                      <span className="text-amber-400 text-xs font-bold mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                        <AlertTriangle className="size-3.5" /> Fairness Warning (Ad A)
                      </span>
                      <p className="text-sm text-white/90 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                        {result.ad_a.ethical_risk_assessment.fairness_warning}
                      </p>
                    </div>
                  )}

                  {result.ad_a.suggested_rewrite && (
                    <div className="bg-white/[0.03] backdrop-blur-2xl rounded-xl p-5 border border-purple-500/20 shadow-lg">
                      <span className="text-[#8a8a8f] text-xs font-medium mb-3 flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-purple-400" /> AI Rewrite Suggestion (Ad A)
                      </span>
                      <p className="text-sm text-white italic bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
                        "{result.ad_a.suggested_rewrite}"
                      </p>
                    </div>
                  )}

                  {result.ad_a.counterfactual_advice && (
                    <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 backdrop-blur-3xl rounded-xl p-5 border border-white/[0.15] shadow-2xl">
                      <span className="text-white text-sm font-semibold mb-2 flex items-center gap-1.5">
                        <Zap className="size-4 text-blue-400" /> How to Improve (Ad A)
                      </span>
                      <p className="text-sm text-white/90 leading-relaxed">
                        {result.ad_a.counterfactual_advice}
                      </p>
                    </div>
                  )}

                </div>

                {/* Ad B */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-center font-semibold text-lg text-white mb-2">Ad B</h3>
                  
                  <div className="bg-white/[0.03] backdrop-blur-2xl rounded-xl p-5 border border-white/[0.1] shadow-2xl flex flex-col items-center justify-center text-center">
                    <span className="text-[#8a8a8f] text-sm font-medium mb-2">Click Probability</span>
                    <div className={`text-5xl font-bold ${
                      result.ad_b.predicted_performance_score > 70 ? 'text-emerald-400' : 
                      result.ad_b.predicted_performance_score > 40 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {result.ad_b.predicted_performance_score}%
                    </div>
                  </div>

                  {result.ad_b.shap_breakdown && (
                    <div className="bg-white/[0.03] backdrop-blur-2xl rounded-xl p-5 border border-white/[0.1] shadow-2xl">
                      <span className="text-[#8a8a8f] text-sm font-medium mb-4 block">Explainable AI</span>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(result.ad_b.shap_breakdown).map(([feature, impact]: [string, any], idx) => (
                          <div key={idx} className="flex flex-col p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] shadow-inner">
                            <span className="text-[#a0a0a5] text-xs font-medium uppercase tracking-wider mb-2 truncate" title={feature}>{feature}</span>
                            <span className={`text-lg font-bold flex items-center gap-1 ${
                              impact > 0 ? 'text-emerald-400' : impact < 0 ? 'text-rose-400' : 'text-zinc-400'
                            }`}>
                              {impact > 0 ? '↑' : impact < 0 ? '↓' : '-'} {Math.abs(impact).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.ad_b.ethical_risk_assessment?.fairness_warning && (
                    <div className="bg-white/[0.03] backdrop-blur-2xl rounded-xl p-5 border border-amber-500/20 shadow-lg">
                      <span className="text-amber-400 text-xs font-bold mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                        <AlertTriangle className="size-3.5" /> Fairness Warning (Ad B)
                      </span>
                      <p className="text-sm text-white/90 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                        {result.ad_b.ethical_risk_assessment.fairness_warning}
                      </p>
                    </div>
                  )}

                  {result.ad_b.suggested_rewrite && (
                    <div className="bg-white/[0.03] backdrop-blur-2xl rounded-xl p-5 border border-purple-500/20 shadow-lg">
                      <span className="text-[#8a8a8f] text-xs font-medium mb-3 flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-purple-400" /> AI Rewrite Suggestion (Ad B)
                      </span>
                      <p className="text-sm text-white italic bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
                        "{result.ad_b.suggested_rewrite}"
                      </p>
                    </div>
                  )}

                  {result.ad_b.counterfactual_advice && (
                    <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 backdrop-blur-3xl rounded-xl p-5 border border-white/[0.15] shadow-2xl">
                      <span className="text-white text-sm font-semibold mb-2 flex items-center gap-1.5">
                        <Zap className="size-4 text-blue-400" /> How to Improve (Ad B)
                      </span>
                      <p className="text-sm text-white/90 leading-relaxed">
                        {result.ad_b.counterfactual_advice}
                      </p>
                    </div>
                  )}

                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
