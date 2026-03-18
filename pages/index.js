import { useState, useRef, useEffect, useCallback } from 'react'
import Head from 'next/head'

const BOOKS = [
  { id:'spin', emoji:'🔄', color:'#f4b740', title:'SPIN Selling', author:'Neil Rackham', xp:50,
    quote:'"Ask the right questions instead of giving the right answers."',
    summary:'SPIN: Situation, Problem, Implication, Need-Payoff. Ask questions that make the buyer convince themselves.',
    techniques:[
      {icon:'📋', name:'Situation Questions', desc:'Gather facts briefly. Keep short.'},
      {icon:'🔍', name:'Problem Questions', desc:'Uncover pain. Where deals are born.'},
      {icon:'⚡', name:'Implication Questions', desc:'Amplify pain. Make the problem feel urgent.'},
      {icon:'💡', name:'Need-Payoff Questions', desc:'Let them say they need you.'},
    ]},
  { id:'voss', emoji:'🎯', color:'#ef4444', title:'Never Split the Difference', author:'Chris Voss', xp:60,
    quote:'"No deal is better than a bad deal."',
    summary:'FBI negotiator tactics. Emotions drive decisions. Master tactical empathy.',
    techniques:[
      {icon:'🪞', name:'Tactical Mirroring', desc:'Repeat last 3 words as a question.'},
      {icon:'🏷️', name:'Labeling', desc:'Name their emotion to lower defenses.'},
      {icon:'❓', name:'Calibrated Questions', desc:'Ask How or What never Why.'},
      {icon:'🎙️', name:'Late Night FM Voice', desc:'Slow down, speak calm and deep.'},
    ]},
  { id:'wolf', emoji:'🐺', color:'#10b981', title:'Way of the Wolf', author:'Jordan Belfort', xp:55,
    quote:'"Act as if. Project certainty before you feel it."',
    summary:'Straight Line System. Control conversation from open to close.',
    techniques:[
      {icon:'📏', name:'The Straight Line', desc:'Every digression takes you off. Bring it back.'},
      {icon:'🔢', name:'The 3 Tens', desc:'Rate product, you, company 1-10. Fix lowest.'},
      {icon:'🎭', name:'Tonality Mastery', desc:'90% is tone. Scarcity, certainty, sincerity.'},
      {icon:'⚡', name:'Pattern Interrupt', desc:'Laugh slightly then reframe objections.'},
    ]},
  { id:'challenger', emoji:'🏆', color:'#8b5cf6', title:'The Challenger Sale', author:'Dixon and Adamson', xp:55,
    quote:'"Best salespeople challenge customers."',
    summary:'TEACH something new. TAILOR to what matters. TAKE CONTROL.',
    techniques:[
      {icon:'🎓', name:'Commercial Teaching', desc:'Open with something they did not know.'},
      {icon:'⚖️', name:'Constructive Tension', desc:'Challenge assumptions. Make them think.'},
      {icon:'🎯', name:'Tailored Messaging', desc:'CFO cost. CMO leads. CEO growth.'},
      {icon:'✊', name:'Take Control', desc:'Do not accept stalls.'},
    ]},
  { id:'carnegie', emoji:'🤝', color:'#06b6d4', title:'How to Win Friends', author:'Dale Carnegie', xp:45,
    quote:'"Be interested in others not interesting."',
    summary:'People buy from people they like. Make them feel important.',
    techniques:[
      {icon:'📛', name:'Use Their Name', desc:'Sweetest sound to anyone is their name.'},
      {icon:'👂', name:'Genuine Listening', desc:'Actually listen and reference it later.'},
      {icon:'💬', name:'Talk in Their Interest', desc:'You would be able to X not this does X.'},
      {icon:'🕊️', name:'Avoid Arguments', desc:'You cannot win arguments with customers.'},
    ]},
  { id:'pink', emoji:'🧬', color:'#ec4899', title:'To Sell is Human', author:'Daniel Pink', xp:45,
    quote:'"Treat people as intelligent adults."',
    summary:'New ABC: Attunement, Buoyancy, Clarity. Serve first sell second.',
    techniques:[
      {icon:'🔭', name:'Attunement', desc:'What does YES feel like from their side?'},
      {icon:'🌊', name:'Buoyancy', desc:'What is the best that could happen?'},
      {icon:'💎', name:'Clarity', desc:'One clear message beats five good ones.'},
      {icon:'🎬', name:'The Pixar Pitch', desc:'Once upon a time... Stories sell.'},
    ]},
  { id:'blount', emoji:'🔥', color:'#f97316', title:'Fanatical Prospecting', author:'Jeb Blount', xp:50,
    quote:'"Empty pipeline is the top reason for failure."',
    summary:'Prospect every day. Embrace rejection. Master 30-second opening.',
    techniques:[
      {icon:'⏱️', name:'The 30-Second Rule', desc:'30 seconds to earn 30 more.'},
      {icon:'⭐', name:'Golden Hours', desc:'8-11am and 4-6pm for prospecting only.'},
      {icon:'🛡️', name:'Embrace the Reflex No', desc:'Not interested is a reflex not a decision.'},
      {icon:'3️⃣', name:'Triple-Touch', desc:'Call email LinkedIn within one week.'},
    ]},
  { id:'tracy', emoji:'🧠', color:'#84cc16', title:'Psychology of Selling', author:'Brian Tracy', xp:45,
    quote:'"The more you like yourself the better you sell."',
    summary:'Selling is 80% psychology. Self-image determines results.',
    techniques:[
      {icon:'🪞', name:'The Self-Concept', desc:'Visualize top 1% before every call.'},
      {icon:'🔁', name:'Ask 5 Times', desc:'Average sale closes on 5th ask.'},
      {icon:'🎤', name:'Power of Questions', desc:'70% listen 30% talk.'},
      {icon:'👔', name:'Look the Part', desc:'People judge in 30 seconds.'},
    ]},
  { id:'klaff', emoji:'🚀', color:'#a78bfa', title:'Pitch Anything', author:'Oren Klaff', xp:60,
    quote:'"Frame it right and they need to buy."',
    summary:'Frame yourself as the prize not the pursuer.',
    techniques:[
      {icon:'🖼️', name:'Frame Control', desc:'Set your frame first. Walk in as the prize.'},
      {icon:'🐊', name:'Croc Brain Hook', desc:'Start with NEW or UNEXPECTED.'},
      {icon:'🏆', name:'Prize Framing', desc:'Let me see if you qualify.'},
      {icon:'⌛', name:'Time Pressure Frame', desc:'Scarcity must be REAL.'},
    ]},
  { id:'gogiver', emoji:'🎁', color:'#14b8a6', title:'The Go-Giver', author:'Bob Burg', xp:45,
    quote:'"Give more value than you take in payment."',
    summary:'Focus on giving. Those who give most paradoxically outsell everyone.',
    techniques:[
      {icon:'💝', name:'Law of Value', desc:'If they pay 100 they should feel they got 500.'},
      {icon:'🔗', name:'Connector Mindset', desc:'How can I connect them to what they truly need?'},
      {icon:'🎁', name:'Give First', desc:'Share insight before pitching. Always.'},
      {icon:'✨', name:'Authentic Enthusiasm', desc:'Genuine passion converts.'},
    ]},
] 
onst PERSONAS = [
  { id:'us_tech', flag:'🇺🇸', label:'US Tech Founder', desc:'Silicon Valley. Busy, questions ROI',
    system:"You are a busy Silicon Valley startup founder. Use jargon like bandwidth and circle back. Question ROI. Say things like I am swamped. Raise 2 to 3 objections. Respond in 1 to 3 sentences max."},
  { id:'uk_exec', flag:'🇬🇧', label:'UK Business Exec', desc:'Formal, dry wit, hard to read',
    system:"You are a British business executive. Polite but reserved with dry humor. Use words like quite and rather. Skeptical of overselling. 1 to 3 sentences max."},
  { id:'india_it', flag:'🇮🇳', label:'Indian IT Manager', desc:'Expert negotiator, wants best deal',
    system:"You are an Indian IT procurement manager. Sharp negotiator. Ask about discounts. Say things like what is the best price. 1 to 3 sentences max."},
  { id:'tough_ceo', flag:'💼', label:'Tough CEO', desc:'No-nonsense. 2 minutes max',
    system:"You are a no-nonsense CEO. 2 minutes max. Cut people off if vague. Say get to the point. Respect directness. 1 to 3 sentences max."},
  { id:'friendly', flag:'😊', label:'Friendly Manager', desc:'Likes you but cannot decide alone',
    system:"You are a friendly mid-level manager. Enthusiastic but always need to run it by my boss. 1 to 3 sentences max."},
  { id:'skeptic', flag:'🤨', label:'Deep Skeptic', desc:'Been burned before. Trusts nobody',
    system:"You are a deeply skeptical buyer burned by vendors before. Say prove it and that is what the last company said. 1 to 3 sentences max."},
]

const DIFFICULTIES = [
  { id:'easy', label:'Rookie', color:'#22c55e', desc:'Patient, curious, open' },
  { id:'medium', label:'Pro', color:'#f4b740', desc:'Skeptical, raises objections' },
  { id:'hard', label:'Elite', color:'#ef4444', desc:'Brutal, impatient, high pressure' },
]

const PRODUCTS = [
  { id:'saas', label:'SaaS Software', emoji:'💻' },
  { id:'insurance', label:'Insurance', emoji:'🛡️' },
  { id:'marketing', label:'Marketing Agency', emoji:'📣' },
  { id:'finance', label:'Finance Product', emoji:'💰' },
  { id:'recruit', label:'Recruitment', emoji:'👥' },
  { id:'custom', label:'My Own Product', emoji:'✏️' },
]

const MISSIONS = [
  { id:'m1', icon:'🔄', title:'SPIN Master', xp:80, book:'SPIN Selling', desc:'Use all 4 SPIN question types', check:'Asked Situation Problem Implication AND Need-Payoff questions' },
  { id:'m2', icon:'🪞', title:'Mirror Warrior', xp:70, book:'Never Split the Difference', desc:'Mirror the client 3 or more times', check:'Repeated last 3 words as a question at least 3 times' },
  { id:'m3', icon:'🛡️', title:'Objection Crusher', xp:75, book:'Fanatical Prospecting', desc:'Handle 3 objections without hanging up', check:'Addressed at least 3 separate objections' },
  { id:'m4', icon:'🎓', title:'The Challenger', xp:90, book:'The Challenger Sale', desc:'Teach the prospect something new first', check:'Led with an insight before pitching' },
  { id:'m5', icon:'🔁', title:'The Closer', xp:85, book:'Psychology of Selling', desc:'Ask for commitment 5 different ways', check:'Asked for a close at least 5 times' },
  { id:'m6', icon:'🏆', title:'Prize Frame', xp:80, book:'Pitch Anything', desc:'Make the client qualify for your product', check:'Asked questions to see if they qualify' },
  { id:'m7', icon:'🎬', title:'Storyteller', xp:65, book:'To Sell is Human', desc:'Use the Pixar pitch structure', check:'Told a story with problem journey and resolution' },
  { id:'m8', icon:'🎁', title:'Giver First', xp:60, book:'The Go-Giver', desc:'Give value before pitching anything', check:'Shared useful insight before mentioning product' },
]

const OBJECTIONS = [
  { obj:"It is too expensive.", answer:"I understand. If price was not a factor would this solve your problem? Then the question is ROI not cost. What would solving this be worth per month?", book:"SPIN Selling", technique:"Need-Payoff Question" },
  { obj:"We are happy with our current provider.", answer:"Most of our best clients said the same before switching. On a scale of 1 to 10 how happy are you? What would a 10 look like?", book:"Never Split the Difference", technique:"Calibrated Question" },
  { obj:"I need to think about it.", answer:"Absolutely. What specifically? Is it the investment, the timing, or how it works?", book:"The Challenger Sale", technique:"Taking Control" },
  { obj:"Send me some information.", answer:"Before I do, what is the number one thing you would want to know more about?", book:"Fanatical Prospecting", technique:"Redirect the Stall" },
  { obj:"We do not have budget right now.", answer:"When does your next budget cycle open? And if something saved more than it costs would that change the conversation?", book:"Psychology of Selling", technique:"The 5th Ask" },
  { obj:"I am not the decision maker.", answer:"If YOU were the decision maker would this interest you? Great. What would YOU need to see to recommend it?", book:"Way of the Wolf", technique:"The Straight Line" },
  { obj:"We tried something similar and it did not work.", answer:"What specifically did not work? So if we could address that exact issue would you be open to a fresh look?", book:"Never Split the Difference", technique:"Labeling the Past Pain" },
  { obj:"Your competitor is cheaper.", answer:"Cheaper usually means fewer features less support or different clients. Which matters most lowest cost or best outcome?", book:"Pitch Anything", technique:"Frame Control" },
]

const LEVELS = [
  { level:1, title:'Cold Caller', minXP:0, color:'#6b7280' },
  { level:2, title:'Prospect Hunter', minXP:100, color:'#22c55e' },
  { level:3, title:'Objection Handler', minXP:300, color:'#06b6d4' },
  { level:4, title:'Deal Closer', minXP:600, color:'#f4b740' },
  { level:5, title:'Top Performer', minXP:1000, color:'#ef4444' },
  { level:6, title:'Sales Legend', minXP:1800, color:'#a78bfa' },
  { level:7, title:'Wolf of the Call', minXP:3000, color:'#f97316' },
]

function getLevelInfo(xp) {
  let cur = LEVELS[0], nxt = LEVELS[1]
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXP) { cur = LEVELS[i]; nxt = LEVELS[i+1] || null }
  }
  const pct = nxt ? ((xp - cur.minXP) / (nxt.minXP - cur.minXP)) * 100 : 100
  return { cur, nxt, pct }
}

function fmtTime(s) {
  return String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0')
}

function useLocalStorage(key, init) {
  const [val, setVal] = useState(init)
  useEffect(() => {
    try { const s = localStorage.getItem(key); if (s) setVal(JSON.parse(s)) } catch {}
  }, [key])
  const save = useCallback((v) => {
    setVal(v); try { localStorage.setItem(key, JSON.stringify(v)) } catch {}
  }, [key])
  return [val, save]
}

function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState(null)
  const [transcript, setTranscript] = useState('')
  const mediaRef = useRef(null)
  const chunksRef = useRef([])
  const recognitionRef = useRef(null)

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      mr.ondataavailable = e => chunksRef.current.push(e.data)
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioURL(URL.createObjectURL(blob))
        stream.getTracks().forEach(t => t.stop())
      }
      mr.start()
      mediaRef.current = mr
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition
        const rec = new SR()
        rec.continuous = true
        rec.interimResults = true
        rec.lang = 'en-US'
        let final = ''
        rec.onresult = e => {
          let interim = ''
          for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) final += e.results[i][0].transcript + ' '
            else interim += e.results[i][0].transcript
          }
          setTranscript(final + interim)
        }
        rec.start()
        recognitionRef.current = rec
      }
      setIsRecording(true)
    } catch (err) {
      alert('Microphone access denied.')
    }
  }, [])

  const stop = useCallback(() => {
    mediaRef.current?.stop()
    recognitionRef.current?.stop()
    setIsRecording(false)
  }, [])

  const reset = useCallback(() => {
    setAudioURL(null); setTranscript(''); setIsRecording(false)
  }, [])

  return { isRecording, audioURL, transcript, start, stop, reset }
}
export default function SalesAcademy() {
  const [tab, setTab] = useState('home')
  const [xp, setXp] = useLocalStorage('sa_xp', 0)
  const [doneBooks, setDoneBooks] = useLocalStorage('sa_books', [])
  const [doneMissions, setDoneMissions] = useLocalStorage('sa_missions', [])
  const [history, setHistory] = useLocalStorage('sa_history', [])

  const addXP = (n) => setXp(prev => prev + n)
  const markBook = (id) => {
    if (doneBooks.includes(id)) return
    const b = BOOKS.find(x => x.id === id)
    setDoneBooks([...doneBooks, id])
    addXP(b ? b.xp : 50)
  }
  const markMission = (id) => {
    if (doneMissions.includes(id)) return
    const m = MISSIONS.find(x => x.id === id)
    setDoneMissions([...doneMissions, id])
    addXP(m ? m.xp : 75)
  }
  const addCall = (result) => {
    const updated = [result, ...history].slice(0, 30)
    setHistory(updated)
    addXP(Math.floor(result.score / 5))
  }
  const { cur: lvl, nxt: nextLvl, pct } = getLevelInfo(xp)
  const sharedProps = { xp, lvl, nextLvl, pct, doneBooks, doneMissions, history, markBook, markMission, addCall }

  return (
    <>
      <Head>
        <title>Sales Academy</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#06060f" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <div style={{ minHeight:'100vh', maxWidth:640, margin:'0 auto', display:'flex', flexDirection:'column', background:'#06060f', color:'#e8e8f2', fontFamily:'sans-serif' }}>
        <div style={{ flex:1, overflowY:'auto', paddingBottom:72 }}>
          {tab === 'home' && <HomeTab {...sharedProps} setTab={setTab} />}
          {tab === 'learn' && <LearnTab {...sharedProps} />}
          {tab === 'practice' && <PracticeTab {...sharedProps} />}
          {tab === 'skills' && <SkillsTab />}
          {tab === 'profile' && <ProfileTab {...sharedProps} />}
        </div>
        <nav style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:640, background:'rgba(6,6,15,.97)', borderTop:'1px solid #1c1c30', display:'flex', zIndex:100 }}>
          {[['home','🏠','Home'],['learn','📚','Books'],['practice','📞','Calls'],['skills','⚡','Skills'],['profile','👤','Profile']].map(([id,icon,label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ flex:1, padding:'10px 0 12px', background:'none', border:'none', display:'flex', flexDirection:'column', alignItems:'center', gap:3, cursor:'pointer' }}>
              <span style={{ fontSize:20 }}>{icon}</span>
              <span style={{ fontSize:9, letterSpacing:1, textTransform:'uppercase', color: tab===id ? '#9d7bff' : '#5a5a7a', fontWeight: tab===id ? 700 : 400 }}>{label}</span>
            </button>
          ))}
        </nav>
      </div>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse { 0%,100%{opacity:.25;transform:scale(.7)} 50%{opacity:1;transform:scale(1)} }
        @keyframes recPulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.5)} 50%{box-shadow:0 0 0 12px rgba(239,68,68,0)} }
        @keyframes waveBar { 0%,100%{transform:scaleY(.2)} 50%{transform:scaleY(1)} }
        .fadeUp { animation: fadeUp .3s ease forwards }
      `}</style>
    </>
  )
}

function HomeTab({ xp, lvl, nextLvl, pct, doneBooks, doneMissions, history, setTab }) {
  const todayBook = BOOKS[new Date().getDay() % BOOKS.length]
  const todayMission = MISSIONS[new Date().getDay() % MISSIONS.length]
  const avgScore = history.length ? Math.round(history.reduce((a,b) => a+b.score, 0)/history.length) : 0
  return (
    <div className="fadeUp" style={{ padding:'28px 18px' }}>
      <div style={{ marginBottom:28 }}>
        <p style={{ fontSize:10, letterSpacing:5, color:'#5a5a7a', textTransform:'uppercase', marginBottom:8 }}>Sales Academy</p>
        <h1 style={{ fontSize:38, lineHeight:1, fontWeight:900, marginBottom:10 }}>
          MASTER<br/>
          <span style={{ background:'linear-gradient(120deg,#6c47ff,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>THE CALL.</span>
        </h1>
        <p style={{ fontSize:13, color:'#5a5a7a', lineHeight:1.7 }}>10 legendary books · AI practice calls · Voice recording · Real feedback</p>
      </div>
      <div style={{ background:'linear-gradient(135deg,#12123a,#0e0e1c)', border:'1px solid ' + lvl.color + '55', borderRadius:16, padding:'20px', marginBottom:18 }}>
        <div style={{ display:'flex', gap:14, alignItems:'center', marginBottom:14 }}>
          <div style={{ width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,' + lvl.color + ',#6c47ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:700, color:'#fff' }}>{lvl.level}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:16, color:lvl.color }}>{lvl.title}</div>
            <div style={{ fontSize:12, color:'#5a5a7a', marginTop:2 }}>{xp} XP{nextLvl ? ' · ' + (nextLvl.minXP - xp) + ' to ' + nextLvl.title : ' · MAX'}</div>
          </div>
        </div>
        <div style={{ background:'#06060f', borderRadius:4, height:6, overflow:'hidden' }}>
          <div style={{ height:'100%', width: pct + '%', background:'linear-gradient(90deg,' + lvl.color + ',#9d7bff)', borderRadius:4, transition:'width 1s ease' }} />
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:18 }}>
        {[['📞','Calls',history.length],['⭐','Avg',avgScore||'—'],['📚','Books', doneBooks.length + '/' + BOOKS.length]].map(([icon,label,val]) => (
          <div key={label} style={{ background:'#0e0e1c', border:'1px solid #1c1c30', borderRadius:12, padding:'14px 10px', textAlign:'center' }}>
            <div style={{ fontSize:20 }}>{icon}</div>
            <div style={{ fontSize:22, fontWeight:700, margin:'4px 0' }}>{val}</div>
            <div style={{ fontSize:10, color:'#5a5a7a', textTransform:'uppercase', letterSpacing:1 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'#0e0e1c', border:'1px solid ' + todayBook.color + '33', borderRadius:14, padding:'18px', marginBottom:14 }}>
        <p style={{ fontSize:10, letterSpacing:3, color:todayBook.color, textTransform:'uppercase', marginBottom:12 }}>Today's Book</p>
        <div style={{ display:'flex', gap:12 }}>
          <span style={{ fontSize:30 }}>{todayBook.emoji}</span>
          <div>
            <div style={{ fontWeight:700, fontSize:15 }}>{todayBook.title}</div>
            <div style={{ fontSize:12, color:'#5a5a7a', marginBottom:10 }}>by {todayBook.author}</div>
            <div style={{ fontSize:13, fontStyle:'italic', color:'#9a9ab8', borderLeft:'3px solid ' + todayBook.color, paddingLeft:12, lineHeight:1.7 }}>{todayBook.quote}</div>
          </div>
        </div>
        <button onClick={() => setTab('learn')} style={{ marginTop:14, width:'100%', padding:'10px', background:todayBook.color + '15', border:'1px solid ' + todayBook.color + '40', borderRadius:8, color:todayBook.color, fontSize:12, letterSpacing:2, textTransform:'uppercase', cursor:'pointer' }}>
          Read All 4 Techniques
        </button>
      </div>
      <div style={{ background:'#0e0e1c', border:'1px solid #252540', borderRadius:14, padding:'18px', marginBottom:14 }}>
        <p style={{ fontSize:10, letterSpacing:3, color:'#f4b740', textTransform:'uppercase', marginBottom:12 }}>Daily Mission</p>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <span style={{ fontSize:28 }}>{todayMission.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700 }}>{todayMission.title}</div>
            <div style={{ fontSize:12, color:'#5a5a7a' }}>{todayMission.desc} · +{todayMission.xp} XP</div>
          </div>
          {doneMissions.includes(todayMission.id) && <span style={{ color:'#22c55e', fontSize:20 }}>✓</span>}
        </div>
        <button onClick={() => setTab('practice')} style={{ marginTop:14, width:'100%', padding:'13px', background:'linear-gradient(135deg,#6c47ff,#9d7bff)', border:'none', borderRadius:10, color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer' }}>
          Start Practice Call
        </button>
      </div>
      {history.length > 0 && (
        <div>
          <p style={{ fontSize:10, letterSpacing:3, color:'#5a5a7a', textTransform:'uppercase', marginBottom:10 }}>Recent Calls</p>
          {history.slice(0,3).map((c,i) => {
            const sc = c.score>=80 ? '#22c55e' : c.score>=60 ? '#f4b740' : '#ef4444'
            return (
              <div key={i} style={{ background:'#0e0e1c', border:'1px solid #1c1c30', borderRadius:10, padding:'12px 16px', marginBottom:8, display:'flex', gap:12, alignItems:'center' }}>
                <div style={{ width:40, height:40, borderRadius:'50%', border:'2px solid ' + sc, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14, color:sc }}>{c.score}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:13 }}>{c.persona}</div>
                  <div style={{ fontSize:11, color:'#5a5a7a' }}>{c.product} · {c.duration}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function LearnTab({ doneBooks, markBook }) {
  const [selected, setSelected] = useState(null)
  const [openTech, setOpenTech] = useState(null)
  if (selected) {
    const b = BOOKS.find(x => x.id === selected)
    const done = doneBooks.includes(selected)
    return (
      <div className="fadeUp" style={{ padding:'20px' }}>
        <button onClick={() => { setSelected(null); setOpenTech(null) }} style={{ background:'none', border:'none', color:'#5a5a7a', fontSize:14, marginBottom:18, padding:0, cursor:'pointer' }}>Back</button>
        <div style={{ background:b.color + '10', border:'1px solid ' + b.color + '35', borderRadius:16, padding:'22px', marginBottom:20 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>{b.emoji}</div>
          <div style={{ fontSize:24, fontWeight:900, color:b.color, marginBottom:4 }}>{b.title}</div>
          <div style={{ fontSize:13, color:'#5a5a7a', marginBottom:16 }}>by {b.author} · +{b.xp} XP</div>
          <div style={{ fontSize:14, color:'#b0b0c8', lineHeight:1.8, background:'#06060f', padding:16, borderRadius:10, marginBottom:16 }}>{b.summary}</div>
          <div style={{ fontSize:13, fontStyle:'italic', color:'#9a9ab8', borderLeft:'3px solid ' + b.color, paddingLeft:14, lineHeight:1.7 }}>{b.quote}</div>
        </div>
        <p style={{ fontSize:10, letterSpacing:3, color:'#5a5a7a', textTransform:'uppercase', marginBottom:14 }}>4 Core Techniques</p>
        {b.techniques.map((t,i) => (
          <div key={i} onClick={() => setOpenTech(openTech===i ? null : i)} style={{ background:'#0e0e1c', border:'1px solid ' + (openTech===i ? b.color + '55' : '#1c1c30'), borderRadius:12, padding:'16px', marginBottom:10, cursor:'pointer' }}>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <span style={{ fontSize:22 }}>{t.icon}</span>
              <div style={{ flex:1, fontWeight:700, fontSize:14, color: openTech===i ? b.color : '#e8e8f2' }}>{t.name}</div>
              <span style={{ color:'#5a5a7a' }}>{openTech===i ? 'Hide' : 'Show'}</span>
            </div>
            {openTech===i && <div style={{ marginTop:12, fontSize:13, color:'#9a9ab8', lineHeight:1.8, borderTop:'1px solid ' + b.color + '22', paddingTop:12 }}>{t.desc}</div>}
          </div>
        ))}
        {!done
          ? <button onClick={() => markBook(selected)} style={{ width:'100%', marginTop:8, padding:14, background:'linear-gradient(135deg,' + b.color + ',#9d7bff)', border:'none', borderRadius:10, color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer' }}>Mark as Studied · Earn {b.xp} XP</button>
          : <div style={{ textAlign:'center', padding:14, color:'#22c55e', fontWeight:700 }}>Completed</div>
        }
      </div>
    )
  }
  return (
    <div className="fadeUp" style={{ padding:'20px' }}>
      <div style={{ marginBottom:24 }}>
        <p style={{ fontSize:10, letterSpacing:4, color:'#5a5a7a', textTransform:'uppercase', marginBottom:6 }}>Sales Library</p>
        <h2 style={{ fontSize:30, fontWeight:900, lineHeight:1.1, marginBottom:8 }}>10 BOOKS. ZERO FLUFF.</h2>
        <p style={{ fontSize:13, color:'#5a5a7a' }}>Each book condensed into 4 techniques. {doneBooks.length}/{BOOKS.length} completed.</p>
      </div>
      {BOOKS.map(b => {
        const done = doneBooks.includes(b.id)
        return (
          <div key={b.id} onClick={() => setSelected(b.id)} style={{ background:'#0e0e1c', border:'1px solid ' + (done ? b.color + '44' : '#1c1c30'), borderRadius:14, padding:'16px', marginBottom:10, cursor:'pointer', display:'flex', gap:14, alignItems:'center' }}>
            <span style={{ fontSize:28 }}>{b.emoji}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14, color: done ? b.color : '#e8e8f2' }}>{b.title}</div>
              <div style={{ fontSize:11, color:'#5a5a7a' }}>by {b.author}</div>
            </div>
            {done ? <span style={{ color:'#22c55e', fontSize:18 }}>✓</span> : <span style={{ fontSize:11, color:b.color, fontWeight:700 }}>+{b.xp} XP</span>}
          </div>
        )
      })}
    </div>
  )
}
function PracticeTab({ doneMissions, markMission, addCall }) {
  const [screen, setScreen] = useState('setup')
  const [persona, setPersona] = useState(null)
  const [diff, setDiff] = useState(null)
  const [product, setProduct] = useState(null)
  const [customProd, setCustomProd] = useState('')
  const [mission, setMission] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [callTime, setCallTime] = useState(0)
  const [score, setScore] = useState(null)
  const [rateLimited, setRateLimited] = useState(false)
  const timerRef = useRef(null)
  const chatRef = useRef(null)
  const voice = useVoiceRecorder()

  useEffect(() => {
    if (screen === 'call') { timerRef.current = setInterval(() => setCallTime(t => t+1), 1000) }
    else clearInterval(timerRef.current)
    return () => clearInterval(timerRef.current)
  }, [screen])

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTo({ top:chatRef.current.scrollHeight, behavior:'smooth' }) }, [messages])

  const p = PERSONAS.find(x => x.id === persona)
  const d = DIFFICULTIES.find(x => x.id === diff)
  const prod = product === 'custom' ? customProd : (PRODUCTS.find(x => x.id === product) || {}).label

  const buildSystem = () => {
    const dn = diff === 'easy' ? 'Be patient and open.' : diff === 'medium' ? 'Be moderately skeptical, raise 2 to 3 objections.' : 'Be very tough, impatient, challenge everything.'
    const mn = mission ? ' The salesperson is working on: ' + mission.check + '. Create situations that test this skill.' : ''
    return (p ? p.system : '') + ' You are being sold: ' + prod + '. Difficulty: ' + (d ? d.label : '') + '. ' + dn + mn + ' Answer the phone with a brief in-character greeting.'
  }

  const startCall = async () => {
    if (!persona || !diff || !product) return
    if (product === 'custom' && !customProd.trim()) return
    setScreen('call'); setMessages([]); setCallTime(0); setLoading(true)
    try {
      const res = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ system: buildSystem(), messages: [{ role:'user', content:'Phone rings. Pick up.' }] }) })
      const data = await res.json()
      if (data.error === 'rate_limit') { setRateLimited(true); setScreen('setup'); setLoading(false); return }
      setMessages([{ role:'assistant', content: data.content || 'Hello?' }])
    } catch (e) { setMessages([{ role:'assistant', content:'Hello?' }]) }
    setLoading(false)
  }

  const send = async () => {
    if (!input.trim() || loading) return
    const um = { role:'user', content: input.trim() }
    const nxt = [...messages, um]
    setMessages(nxt); setInput(''); setLoading(true)
    try {
      const res = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ system: buildSystem(), messages: nxt.map(m => ({ role:m.role, content:m.content })) }) })
      const data = await res.json()
      if (data.error === 'rate_limit') { setRateLimited(true); setScreen('setup'); setLoading(false); return }
      setMessages([...nxt, { role:'assistant', content: data.content || '...' }])
    } catch (e) { setMessages([...nxt, { role:'assistant', content:'Say that again?' }]) }
    setLoading(false)
  }

  const endCall = async () => {
    if (voice.isRecording) voice.stop()
    setLoading(true)
    try {
      const transcript = messages.map(m => (m.role==='user' ? 'Salesperson' : 'Client') + ': ' + m.content).join('\n')
      const res = await fetch('/api/analyze', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ transcript, persona: p ? p.label : '', product: prod, difficulty: d ? d.label : '', voiceTranscript: voice.transcript || null, mission: mission || null }) })
      const data = await res.json()
      setScore(data)
      addCall({ score: data.score, grade: data.grade, persona: p ? p.label : '', product: prod, duration: fmtTime(callTime) })
      if (mission && data.missionCompleted) markMission(mission.id)
    } catch (e) { setScore({ score:60, grade:'C', verdict:'Good effort!', strengths:['Stayed on the call'], improvements:['Be more specific'], bookTip:{ book:'SPIN Selling', technique:'Implication Questions', why:'Would have created more urgency' }, missionCompleted:false }) }
    setLoading(false); setScreen('feedback')
  }

  const reset = () => { setScreen('setup'); setMessages([]); setScore(null); setCallTime(0); setMission(null); voice.reset() }

  if (screen === 'setup') return (
    <div className="fadeUp" style={{ padding:'20px' }}>
      <p style={{ fontSize:10, letterSpacing:4, color:'#5a5a7a', textTransform:'uppercase', marginBottom:6 }}>Call Simulator</p>
      <h2 style={{ fontSize:26, fontWeight:900, marginBottom:20 }}>CONFIGURE CALL</h2>
      {rateLimited && (
        <div style={{ background:'#1a0505', border:'1px solid #ef4444', borderRadius:12, padding:'16px', marginBottom:18 }}>
          <div style={{ fontWeight:700, color:'#ef4444', marginBottom:6 }}>Free Plan Limit Reached</div>
          <div style={{ fontSize:13, color:'#fca5a5', lineHeight:1.6 }}>3 free calls per day. Come back tomorrow!</div>
        </div>
      )}
      <div style={{ marginBottom:22 }}>
        <p style={{ fontSize:10, letterSpacing:3, color:'#f4b740', textTransform:'uppercase', marginBottom:10 }}>Optional Mission</p>
        {MISSIONS.slice(0,4).map(m => {
          const done = doneMissions.includes(m.id)
          return (
            <div key={m.id} onClick={() => !done && setMission(mission && mission.id===m.id ? null : m)} style={{ padding:'12px 14px', border:'1px solid ' + (mission && mission.id===m.id ? '#f4b740' : done ? '#1a2a1a' : '#1c1c30'), borderRadius:10, cursor: done ? 'default' : 'pointer', background: mission && mission.id===m.id ? '#1a0e00' : '#0e0e1c', display:'flex', gap:12, alignItems:'center', opacity: done ? .5 : 1, marginBottom:8 }}>
              <span style={{ fontSize:20 }}>{m.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color: mission && mission.id===m.id ? '#f4b740' : '#e8e8f2' }}>{m.title}</div>
                <div style={{ fontSize:11, color:'#5a5a7a' }}>{m.desc} · +{m.xp} XP</div>
              </div>
              {(done || (mission && mission.id===m.id)) && <span style={{ color: done ? '#22c55e' : '#f4b740' }}>✓</span>}
            </div>
          )
        })}
      </div>
      <div style={{ marginBottom:18 }}>
        <p style={{ fontSize:10, letterSpacing:3, color:'#9d7bff', textTransform:'uppercase', marginBottom:10 }}>01 Your Client</p>
        {PERSONAS.map(per => (
          <div key={per.id} onClick={() => setPersona(per.id)} style={{ padding:'12px 16px', border:'1px solid ' + (persona===per.id ? '#6c47ff' : '#1c1c30'), borderRadius:10, cursor:'pointer', background: persona===per.id ? 'rgba(108,71,255,.1)' : '#0e0e1c', display:'flex', gap:12, alignItems:'center', marginBottom:8 }}>
            <span style={{ fontSize:20 }}>{per.flag}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color: persona===per.id ? '#9d7bff' : '#e8e8f2' }}>{per.label}</div>
              <div style={{ fontSize:11, color:'#5a5a7a' }}>{per.desc}</div>
            </div>
            {persona===per.id && <span style={{ color:'#6c47ff' }}>✓</span>}
          </div>
        ))}
      </div>
      <div style={{ marginBottom:18 }}>
        <p style={{ fontSize:10, letterSpacing:3, color:'#9d7bff', textTransform:'uppercase', marginBottom:10 }}>02 Difficulty</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
          {DIFFICULTIES.map(dif => (
            <div key={dif.id} onClick={() => setDiff(dif.id)} style={{ padding:'14px 10px', border:'1px solid ' + (diff===dif.id ? dif.color : '#1c1c30'), borderRadius:10, cursor:'pointer', background: diff===dif.id ? dif.color + '12' : '#0e0e1c', textAlign:'center' }}>
              <div style={{ fontWeight:700, fontSize:13, color: diff===dif.id ? dif.color : '#e8e8f2' }}>{dif.label}</div>
              <div style={{ fontSize:10, color:'#5a5a7a', marginTop:4 }}>{dif.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom:28 }}>
        <p style={{ fontSize:10, letterSpacing:3, color:'#9d7bff', textTransform:'uppercase', marginBottom:10 }}>03 Product</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          {PRODUCTS.map(pr => (
            <div key={pr.id} onClick={() => setProduct(pr.id)} style={{ padding:'12px 14px', border:'1px solid ' + (product===pr.id ? '#6c47ff' : '#1c1c30'), borderRadius:10, cursor:'pointer', background: product===pr.id ? 'rgba(108,71,255,.1)' : '#0e0e1c', display:'flex', gap:10, alignItems:'center' }}>
              <span style={{ fontSize:18 }}>{pr.emoji}</span>
              <span style={{ fontSize:13, fontWeight:600, color: product===pr.id ? '#9d7bff' : '#e8e8f2' }}>{pr.label}</span>
            </div>
          ))}
        </div>
        {product === 'custom' && <input value={customProd} onChange={e => setCustomProd(e.target.value)} placeholder="Describe your product..." style={{ marginTop:10, width:'100%', background:'#0e0e1c', border:'1px solid #6c47ff', borderRadius:8, padding:'12px 16px', color:'#e8e8f2', fontSize:13 }} />}
      </div>
      <button onClick={startCall} disabled={!persona||!diff||!product||(product==='custom'&&!customProd.trim())} style={{ width:'100%', padding:16, background: (persona&&diff&&product) ? 'linear-gradient(135deg,#6c47ff,#9d7bff)' : '#1c1c30', border:'none', borderRadius:12, color: (persona&&diff&&product) ? '#fff' : '#5a5a7a', fontWeight:700, fontSize:15, letterSpacing:1, cursor: (persona&&diff&&product) ? 'pointer' : 'not-allowed' }}>
        Start Call
      </button>
    </div>
  )

  if (screen === 'call') return (
    <div style={{ height:'calc(100dvh - 72px)', display:'flex', flexDirection:'column', background:'#06060f' }}>
      <div style={{ padding:'14px 18px', background:'#0e0e1c', borderBottom:'1px solid #1c1c30', display:'flex', gap:12, alignItems:'center' }}>
        <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#6c47ff,#9d7bff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{p ? p.flag : ''}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:14 }}>{p ? p.label : ''}</div>
          <div style={{ fontSize:11, color: mission ? '#f4b740' : '#5a5a7a' }}>{mission ? ('Mission: ' + mission.title) : ((d ? d.label : '') + ' · ' + prod)}</div>
        </div>
        <div style={{ fontFamily:'monospace', fontSize:18, fontWeight:700, color:'#9d7bff' }}>{fmtTime(callTime)}</div>
      </div>
      <div ref={chatRef} style={{ flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:12 }}>
        {messages.map((m,i) => (
          <div key={i} style={{ display:'flex', justifyContent: m.role==='user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth:'80%', padding:'12px 16px', borderRadius: m.role==='user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: m.role==='user' ? 'linear-gradient(135deg,#6c47ff,#5a35e0)' : '#0e0e1c', border: m.role==='user' ? 'none' : '1px solid #1c1c30', fontSize:14, lineHeight:1.6, color:'#e8e8f2' }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex' }}>
            <div style={{ padding:'12px 16px', background:'#0e0e1c', borderRadius:'16px 16px 16px 4px', border:'1px solid #1c1c30', display:'flex', gap:4 }}>
              {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'#9d7bff', animation:'pulse 1.2s ' + (i*.2) + 's infinite' }} />)}
            </div>
          </div>
        )}
      </div>
      <div style={{ padding:'10px 16px', background:'#0a0a18', borderTop:'1px solid #1c1c30' }}>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <button onClick={voice.isRecording ? voice.stop : voice.start} style={{ padding:'8px 14px', borderRadius:8, background: voice.isRecording ? '#ef4444' : '#1c1c30', border:'1px solid ' + (voice.isRecording ? '#ef4444' : '#252540'), color: voice.isRecording ? '#fff' : '#5a5a7a', fontSize:12, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' }}>
            {voice.isRecording ? 'Stop' : 'Record'}
          </button>
          {voice.audioURL && !voice.isRecording && <audio controls src={voice.audioURL} style={{ flex:1, height:32 }} />}
          {voice.transcript && <span style={{ fontSize:10, color:'#22c55e' }}>✓</span>}
        </div>
      </div>
      <div style={{ padding:'12px 16px 16px', background:'#0e0e1c', borderTop:'1px solid #1c1c30' }}>
        <div style={{ display:'flex', gap:8, marginBottom:8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && !e.shiftKey && send()} placeholder="Type your response..." style={{ flex:1, background:'#12121f', border:'1px solid #252540', borderRadius:10, padding:'12px 14px', color:'#e8e8f2', fontSize:14 }} />
          <button onClick={send} disabled={loading||!input.trim()} style={{ padding:'12px 18px', background:'linear-gradient(135deg,#6c47ff,#9d7bff)', border:'none', borderRadius:10, color:'#fff', fontWeight:700, fontSize:16, cursor:'pointer' }}>→</button>
        </div>
        <button onClick={endCall} disabled={loading||messages.length<3} style={{ width:'100%', padding:10, background: messages.length>=3 ? '#1a0505' : 'transparent', border:'1px solid ' + (messages.length>=3 ? '#7f1d1d' : '#1c1c30'), borderRadius:8, color: messages.length>=3 ? '#ef4444' : '#5a5a7a', fontSize:11, letterSpacing:3, textTransform:'uppercase', cursor: messages.length>=3 ? 'pointer' : 'not-allowed' }}>
          End Call and Get Feedback
        </button>
      </div>
    </div>
  )

  if (screen === 'feedback' && score) {
    const sc = score.score
    const scColor = sc>=80 ? '#22c55e' : sc>=60 ? '#f4b740' : '#ef4444'
    return (
      <div className="fadeUp" style={{ padding:'20px' }}>
        <div style={{ textAlign:'center', marginBottom:24, padding:'28px 20px', background:'#0e0e1c', borderRadius:16, border:'1px solid ' + scColor + '44' }}>
          <div style={{ fontSize:80, fontWeight:900, color:scColor, lineHeight:1 }}>{sc}</div>
          <div style={{ fontSize:13, color:'#5a5a7a' }}>out of 100</div>
          {score.grade && <div style={{ marginTop:6, fontSize:28, fontWeight:900, color:scColor }}>{score.grade}</div>}
          <div style={{ fontSize:15, fontWeight:700, color:scColor, marginTop:8 }}>{sc>=80 ? 'Elite' : sc>=60 ? 'Strong' : 'Keep Training'}</div>
          <div style={{ fontSize:13, color:'#9a9ab8', fontStyle:'italic', marginTop:8 }}>"{score.verdict}"</div>
          {mission && <div style={{ marginTop:12, padding:'10px 16px', background: score.missionCompleted ? '#052e16' : '#1a0505', border:'1px solid ' + (score.missionCompleted ? '#166534' : '#7f1d1d'), borderRadius:8, fontSize:13, color: score.missionCompleted ? '#22c55e' : '#ef4444', fontWeight:700 }}>
            {score.missionCompleted ? 'Mission Complete: ' + mission.title : 'Mission Incomplete'}
          </div>}
        </div>
        <div style={{ background:'#0e0e1c', border:'1px solid #1a2e1a', borderRadius:12, padding:'18px', marginBottom:12 }}>
          <p style={{ fontSize:10, letterSpacing:3, color:'#22c55e', textTransform:'uppercase', marginBottom:12 }}>Strengths</p>
          {(score.strengths || []).map((s,i) => <div key={i} style={{ fontSize:13, color:'#c0c0d8', marginBottom:8, paddingLeft:14, borderLeft:'2px solid #22c55e', lineHeight:1.7 }}>{s}</div>)}
        </div>
        <div style={{ background:'#0e0e1c', border:'1px solid #2a1a0a', borderRadius:12, padding:'18px', marginBottom:12 }}>
          <p style={{ fontSize:10, letterSpacing:3, color:'#f4b740', textTransform:'uppercase', marginBottom:12 }}>Improve</p>
          {(score.improvements || []).map((s,i) => <div key={i} style={{ fontSize:13, color:'#c0c0d8', marginBottom:8, paddingLeft:14, borderLeft:'2px solid #f4b740', lineHeight:1.7 }}>{s}</div>)}
        </div>
        {score.bookTip && (
          <div style={{ background:'#0e0e1c', border:'1px solid #252540', borderRadius:12, padding:'18px', marginBottom:12 }}>
            <p style={{ fontSize:10, letterSpacing:3, color:'#9d7bff', textTransform:'uppercase', marginBottom:12 }}>Book Tip</p>
            <div style={{ fontWeight:700, color:'#9d7bff', fontSize:14 }}>{score.bookTip.technique}</div>
            <div style={{ fontSize:12, color:'#5a5a7a', marginBottom:8 }}>from {score.bookTip.book}</div>
            <div style={{ fontSize:13, color:'#9a9ab8', lineHeight:1.7, fontStyle:'italic' }}>"{score.bookTip.why}"</div>
          </div>
        )}
        {score.nextCallFocus && (
          <div style={{ background:'#0a1a0a', border:'1px solid #22c55e44', borderRadius:12, padding:'18px', marginBottom:20 }}>
            <p style={{ fontSize:10, letterSpacing:3, color:'#22c55e', textTransform:'uppercase', marginBottom:10 }}>Focus Next Call</p>
            <div style={{ fontSize:14, fontWeight:600, color:'#86efac', lineHeight:1.7 }}>{score.nextCallFocus}</div>
          </div>
        )}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <button onClick={() => { setScreen('call'); setMessages([]); setCallTime(0); setScore(null); voice.reset(); startCall() }} style={{ padding:14, background:'linear-gradient(135deg,#6c47ff,#9d7bff)', border:'none', borderRadius:10, color:'#fff', fontWeight:700, cursor:'pointer' }}>Try Again</button>
          <button onClick={reset} style={{ padding:14, background:'#0e0e1c', border:'1px solid #252540', borderRadius:10, color:'#a0a0c0', cursor:'pointer' }}>New Setup</button>
        </div>
      </div>
    )
  }
  return null
}
function SkillsTab() {
  const [mode, setMode] = useState('menu')
  const [objIdx, setObjIdx] = useState(0)
  const [revealed, setReveal] = useState(false)
  const [techBook, setTechBook] = useState(null)

  if (mode === 'objections') {
    const o = OBJECTIONS[objIdx]
    return (
      <div className="fadeUp" style={{ padding:'20px' }}>
        <button onClick={() => { setMode('menu'); setObjIdx(0); setReveal(false) }} style={{ background:'none', border:'none', color:'#5a5a7a', fontSize:14, marginBottom:18, padding:0, cursor:'pointer' }}>Back</button>
        <p style={{ fontSize:10, letterSpacing:3, color:'#ef4444', textTransform:'uppercase', marginBottom:6 }}>Objection Drill</p>
        <p style={{ fontSize:13, color:'#5a5a7a', marginBottom:20 }}>{objIdx+1} of {OBJECTIONS.length}</p>
        <div style={{ background:'#1a0505', border:'1px solid #7f1d1d', borderRadius:14, padding:'22px', marginBottom:16 }}>
          <p style={{ fontSize:11, color:'#ef4444', letterSpacing:3, textTransform:'uppercase', marginBottom:10 }}>The Objection</p>
          <div style={{ fontSize:18, fontWeight:700, color:'#fca5a5', lineHeight:1.5 }}>"{o.obj}"</div>
        </div>
        {!revealed
          ? <button onClick={() => setReveal(true)} style={{ width:'100%', padding:16, background:'#0e0e1c', border:'1px solid #252540', borderRadius:12, color:'#5a5a7a', fontSize:14, cursor:'pointer' }}>Tap to Reveal Best Response</button>
          : <div className="fadeUp">
              <div style={{ background:'#052e16', border:'1px solid #166534', borderRadius:14, padding:'22px', marginBottom:12 }}>
                <p style={{ fontSize:11, color:'#22c55e', letterSpacing:3, textTransform:'uppercase', marginBottom:10 }}>Best Response</p>
                <div style={{ fontSize:14, color:'#bbf7d0', lineHeight:1.8, fontStyle:'italic' }}>"{o.answer}"</div>
              </div>
              <div style={{ background:'rgba(108,71,255,.08)', border:'1px solid rgba(108,71,255,.25)', borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', gap:10 }}>
                <span style={{ fontSize:20 }}>📚</span>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:'#9d7bff' }}>{o.technique}</div>
                  <div style={{ fontSize:11, color:'#5a5a7a' }}>from {o.book}</div>
                </div>
              </div>
            </div>
        }
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:8 }}>
          <button onClick={() => { setObjIdx(Math.max(0,objIdx-1)); setReveal(false) }} disabled={objIdx===0} style={{ padding:12, background:'#0e0e1c', border:'1px solid #1c1c30', borderRadius:10, color: objIdx===0 ? '#5a5a7a' : '#e8e8f2', cursor: objIdx===0 ? 'not-allowed' : 'pointer' }}>Prev</button>
          <button onClick={() => { if(objIdx<OBJECTIONS.length-1){setObjIdx(objIdx+1);setReveal(false)}else{setMode('menu');setObjIdx(0);setReveal(false)} }} style={{ padding:12, background:'linear-gradient(135deg,#6c47ff,#9d7bff)', border:'none', borderRadius:10, color:'#fff', fontWeight:700, cursor:'pointer' }}>
            {objIdx<OBJECTIONS.length-1 ? 'Next' : 'Done'}
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'techniques' && techBook) {
    const b = BOOKS.find(x => x.id === techBook)
    return (
      <div className="fadeUp" style={{ padding:'20px' }}>
        <button onClick={() => setMode('menu')} style={{ background:'none', border:'none', color:'#5a5a7a', fontSize:14, marginBottom:18, padding:0, cursor:'pointer' }}>Back</button>
        <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:24 }}>
          <span style={{ fontSize:32 }}>{b.emoji}</span>
          <div>
            <div style={{ fontSize:20, fontWeight:900, color:b.color }}>{b.title}</div>
            <div style={{ fontSize:12, color:'#5a5a7a' }}>by {b.author}</div>
          </div>
        </div>
        {b.techniques.map((t,i) => (
          <div key={i} style={{ background:'#0e0e1c', border:'1px solid ' + b.color + '30', borderRadius:12, padding:'18px', marginBottom:12 }}>
            <div style={{ display:'flex', gap:10, marginBottom:10 }}>
              <span style={{ fontSize:24 }}>{t.icon}</span>
              <div style={{ fontWeight:700, fontSize:15, color:b.color }}>{t.name}</div>
            </div>
            <div style={{ fontSize:13, color:'#9a9ab8', lineHeight:1.8 }}>{t.desc}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="fadeUp" style={{ padding:'20px' }}>
      <p style={{ fontSize:10, letterSpacing:4, color:'#5a5a7a', textTransform:'uppercase', marginBottom:6 }}>Skill Drills</p>
      <h2 style={{ fontSize:28, fontWeight:900, marginBottom:8 }}>SHARPEN YOUR EDGE</h2>
      <p style={{ fontSize:13, color:'#5a5a7a', marginBottom:24 }}>Drill specific skills until they become reflex.</p>
      <div onClick={() => setMode('objections')} style={{ background:'linear-gradient(135deg,#1a0505,#0e0e1c)', border:'1px solid #7f1d1d', borderRadius:14, padding:'20px', marginBottom:20, cursor:'pointer' }}>
        <div style={{ display:'flex', gap:14, alignItems:'center' }}>
          <span style={{ fontSize:32 }}>🛡️</span>
          <div>
            <div style={{ fontWeight:800, fontSize:16, color:'#ef4444' }}>Objection Handling Flashcards</div>
            <div style={{ fontSize:12, color:'#9a9ab8', marginTop:4 }}>8 real objections. Scripts every top rep memorises.</div>
          </div>
        </div>
      </div>
      <p style={{ fontSize:10, letterSpacing:3, color:'#5a5a7a', textTransform:'uppercase', marginBottom:12 }}>Techniques by Book</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:24 }}>
        {BOOKS.map(b => (
          <div key={b.id} onClick={() => { setTechBook(b.id); setMode('techniques') }} style={{ background:'#0e0e1c', border:'1px solid ' + b.color + '30', borderRadius:12, padding:'14px', cursor:'pointer', textAlign:'center' }}>
            <div style={{ fontSize:26, marginBottom:6 }}>{b.emoji}</div>
            <div style={{ fontSize:12, fontWeight:700, color:b.color, lineHeight:1.3 }}>{b.title}</div>
            <div style={{ fontSize:10, color:'#5a5a7a', marginTop:4 }}>4 techniques</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize:10, letterSpacing:3, color:'#5a5a7a', textTransform:'uppercase', marginBottom:12 }}>All Missions</p>
      {MISSIONS.map(m => (
        <div key={m.id} style={{ background:'#0e0e1c', border:'1px solid #1c1c30', borderRadius:10, padding:'12px 16px', marginBottom:8, display:'flex', gap:12, alignItems:'center' }}>
          <span style={{ fontSize:20 }}>{m.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:700 }}>{m.title}</div>
            <div style={{ fontSize:11, color:'#5a5a7a' }}>{m.book} · +{m.xp} XP</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProfileTab({ xp, lvl, nextLvl, pct, doneBooks, doneMissions, history }) {
  const avg = history.length ? Math.round(history.reduce((a,b) => a+b.score, 0)/history.length) : 0
  const best = history.length ? Math.max(...history.map(c => c.score)) : 0
  return (
    <div className="fadeUp" style={{ padding:'20px' }}>
      <div style={{ textAlign:'center', padding:'32px 20px', background:'linear-gradient(135deg,' + lvl.color + '15,#0e0e1c)', border:'1px solid ' + lvl.color + '44', borderRadius:16, marginBottom:22 }}>
        <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,' + lvl.color + ',#6c47ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, fontWeight:900, color:'#fff', margin:'0 auto 14px' }}>{lvl.level}</div>
        <div style={{ fontSize:24, fontWeight:900, letterSpacing:3, color:lvl.color }}>{lvl.title.toUpperCase()}</div>
        <div style={{ fontSize:13, color:'#5a5a7a', marginTop:4 }}>{xp} XP</div>
        <div style={{ background:'#06060f', borderRadius:4, height:6, overflow:'hidden', marginTop:14 }}>
          <div style={{ height:'100%', width: pct + '%', background:'linear-gradient(90deg,' + lvl.color + ',#9d7bff)', borderRadius:4 }} />
        </div>
        {nextLvl && <div style={{ fontSize:11, color:'#5a5a7a', marginTop:8 }}>{nextLvl.minXP - xp} XP to {nextLvl.title}</div>}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:22 }}>
        {[['📞','Calls',history.length,'#9d7bff'],['🏆','Best',best||'—','#f4b740'],['⭐','Avg',avg||'—','#22c55e'],['⚡','Missions', doneMissions.length + '/' + MISSIONS.length,'#ef4444']].map(([icon,label,val,color]) => (
          <div key={label} style={{ background:'#0e0e1c', border:'1px solid ' + color + '22', borderRadius:12, padding:'16px', textAlign:'center' }}>
            <div style={{ fontSize:22 }}>{icon}</div>
            <div style={{ fontSize:28, fontWeight:700, color, margin:'6px 0' }}>{val}</div>
            <div style={{ fontSize:10, color:'#5a5a7a', textTransform:'uppercase', letterSpacing:1 }}>{label}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize:10, letterSpacing:3, color:'#5a5a7a', textTransform:'uppercase', marginBottom:12 }}>Level Ladder</p>
      {LEVELS.map(l => (
        <div key={l.level} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 14px', background: lvl.level===l.level ? l.color + '10' : 'transparent', borderRadius:8, marginBottom:4 }}>
          <div style={{ width:30, height:30, borderRadius:'50%', background: xp>=l.minXP ? l.color : '#1c1c30', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color: xp>=l.minXP ? '#fff' : '#5a5a7a' }}>{l.level}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:700, color: xp>=l.minXP ? l.color : '#5a5a7a' }}>{l.title}</div>
            <div style={{ fontSize:11, color:'#5a5a7a' }}>{l.minXP} XP</div>
          </div>
          {xp>=l.minXP && <span style={{ color:l.color }}>✓</span>}
        </div>
      ))}
      {history.length > 0 && (
        <div>
          <p style={{ fontSize:10, letterSpacing:3, color:'#5a5a7a', textTransform:'uppercase', margin:'22px 0 12px' }}>Call History</p>
          {history.map((c,i) => {
            const sc = c.score>=80 ? '#22c55e' : c.score>=60 ? '#f4b740' : '#ef4444'
            return (
              <div key={i} style={{ background:'#0e0e1c', border:'1px solid #1c1c30', borderRadius:10, padding:'12px 16px', marginBottom:8, display:'flex', gap:12, alignItems:'center' }}>
                <div style={{ width:40, height:40, borderRadius:'50%', border:'2px solid ' + sc, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, color:sc }}>{c.score}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:13 }}>{c.persona}</div>
                  <div style={{ fontSize:11, color:'#5a5a7a' }}>{c.product} · {c.duration}</div>
                </div>
                {c.grade && <span style={{ fontSize:20, fontWeight:900, color:sc }}>{c.grade}</span>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
