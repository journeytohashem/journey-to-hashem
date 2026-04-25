import { useState, useEffect, useRef } from 'react';
import { LEARNING_PATH } from '../data/lessons';
import LessonPlayer from '../components/LessonPlayer';
import { migrate, CURRENT_SCHEMA, DEFAULT_V4_STATE } from '../lib/migrate';
import {
  MAX_HEARTS, regenerateHearts, consumeHeart, computeLessonXP,
  shouldAutoFreeze, applyStreakFreeze, maybeRefreshWeeklyFreeze,
  getTodayKey, isNewDay,
} from '../lib/gameplay';
import Icon from '../components/Icon';



// ── HEBREW DATE (approximate — demo only) ────────────────
// Note: uses a fixed-month-length anchor model. Cheshvan/Kislev variable lengths,
// leap years with Adar I, and edge cases near Rosh Hashana are not handled.
// Dates may be off by 1–2 days near month boundaries or in leap years.
// For production, use a proper Hebrew calendar library (e.g. hebcal.com API).
function getHebrewDate() {
  const now = new Date();
  // Anchor: 15 Nissan 5785 = April 13, 2025 (verified)
  const anchor = new Date(2025, 3, 13);
  const diffDays = Math.floor((now - anchor) / 86400000);
  // Fixed month lengths — approximate (ignores variable Cheshvan/Kislev and Adar I)
  const MONTHS = [
    {name:'Nissan',days:30},{name:'Iyar',days:29},{name:'Sivan',days:30},
    {name:'Tammuz',days:29},{name:'Av',days:30},{name:'Elul',days:29},
    {name:'Tishrei',days:30},{name:'Cheshvan',days:29},{name:'Kislev',days:30},
    {name:'Tevet',days:29},{name:'Shevat',days:30},{name:'Adar',days:29},
  ];
  let hDay = 15, hMonth = 0, hYear = 5785;
  if (diffDays >= 0) {
    let remaining = diffDays;
    while (remaining > 0) {
      const daysLeft = MONTHS[hMonth].days - hDay;
      if (remaining <= daysLeft) { hDay += remaining; remaining = 0; }
      else { remaining -= (daysLeft + 1); hDay = 1; hMonth++; if (hMonth >= 12) { hMonth = 0; hYear++; } }
    }
  } else {
    let remaining = Math.abs(diffDays);
    while (remaining > 0) {
      if (remaining < hDay) { hDay -= remaining; remaining = 0; }
      else { remaining -= hDay; hMonth--; if (hMonth < 0) { hMonth = 11; hYear--; } hDay = MONTHS[hMonth].days; }
    }
  }
  const ordinals = ['','א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ז׳','ח׳','ט׳','י׳','י״א','י״ב','י״ג','י״ד','ט״ו','ט״ז','י״ז','י״ח','י״ט','כ׳','כ״א','כ״ב','כ״ג','כ״ד','כ״ה','כ״ו','כ״ז','כ״ח','כ״ט','ל׳'];
  return `${ordinals[hDay]} ${MONTHS[hMonth].name} ${hYear}`;
}

// ── SHABBAT DETECTION (approximate — demo only) ───────────
// Uses Friday 18:00 local time as a fixed approximation for candle lighting.
// Actual Shabbat start depends on geographic sunset, which varies by location
// and season. For production, use a zmanim API (e.g. hebcal.com/zmanim).
function isShabbat() {
  const now = new Date();
  const day = now.getDay(); // 5 = Friday, 6 = Saturday
  const hour = now.getHours();
  // Approximate: Friday after 6 PM or all of Saturday
  return (day === 6) || (day === 5 && hour >= 18);
}

// ── PARASHA OF THE WEEK (approximate — demo only) ─────────
// Advances by simple weekly offset from a fixed anchor. Does not account for
// holiday schedule differences, Israel vs. diaspora splits, or combined portions
// that vary year to year. May diverge from the actual reading schedule by 1–2 weeks.
const WEEKLY_PARASHA = [
  'Achrei Mot','Kedoshim','Emor','Behar','Bechukotai',
  'Bamidbar','Nasso','Beha\'alotcha','Shelach','Korach',
  'Chukat','Balak','Pinchas','Matot-Masei','Devarim',
  'Va\'etchanan','Eikev','Re\'eh','Shoftim','Ki Teitzei',
  'Ki Tavo','Nitzavim-Vayelech','Ha\'azinu','Vezot HaBracha',
  'Bereishit','Noach','Lech Lecha','Vayera','Chayei Sarah',
  'Toldot','Vayetzei','Vayishlach','Vayeshev','Miketz',
  'Vayigash','Vayechi','Shemot','Va\'era','Bo',
  'Beshalach','Yitro','Mishpatim','Terumah','Tetzaveh',
  'Ki Tisa','Vayakhel-Pekudei','Vayikra','Tzav','Shemini',
  'Tazria-Metzora','Achrei Mot',
];

function getParasha() {
  // Anchor: Shabbat April 19 2025 = Achrei Mot (diaspora)
  const anchor = new Date(2025, 3, 19);
  const now = new Date();
  const weeksSince = Math.floor((now - anchor) / (7 * 86400000));
  const idx = ((weeksSince % WEEKLY_PARASHA.length) + WEEKLY_PARASHA.length) % WEEKLY_PARASHA.length;
  return WEEKLY_PARASHA[idx]; // approximate — see note above
}



// ── MAGEN DAVID SVG ───────────────────────────────────────
function MagenDavid({size=64}){
  return(
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,8 92,77 8,77" fill="none" stroke="#C9A252" strokeWidth="4" strokeLinejoin="round"/>
      <polygon points="50,92 8,23 92,23" fill="none" stroke="#C9A252" strokeWidth="4" strokeLinejoin="round"/>
    </svg>
  );
}

// ── SHARE UTILITY ─────────────────────────────────────────
function shareApp(title='Journey to Hashem', text='I\'ve been learning Torah on Journey to Hashem — check it out!') {
  if(navigator.share){
    navigator.share({title, text, url: window.location.href}).catch(()=>{});
  } else {
    navigator.clipboard?.writeText(window.location.href).then(()=>alert('Link copied to clipboard!')).catch(()=>alert('Share: ' + window.location.href));
  }
}

// ── DATA ──────────────────────────────────────────────────

const QUIZ_QUESTIONS = [
  { id:'q1', question:"Where are you in your Jewish journey?", options:["Just curious / exploring","Culturally Jewish, not very observant","Somewhat observant","Observant and want to go deeper","Orthodox / deeply learned"] },
  { id:'q2', question:"What draws you to learning Torah?", options:["I want to understand my heritage","I'm becoming more observant","I want to connect with my community","I'm seeking spiritual meaning","I already learn regularly and want to go deeper"] },
  { id:'q3', question:"Which area interests you most right now?", options:["Jewish history and identity","Prayer and connecting to G-d","Shabbat and holidays","Torah study and text","Jewish ethics and philosophy"] },
  { id:'q4', question:"How do you learn best?", options:["Reading at my own pace","Short daily lessons (5–10 min)","Audio and video content","Live classes with a teacher","Discussion with others"] },
  { id:'q5', question:"How much time can you dedicate daily?", options:["5 minutes","10–15 minutes","30 minutes","1 hour or more"] },
];

const COMMUNITY_POSTS = [
  { id:1, initials:'RY', name:'Rabbi Yosef', badge:'Rabbi', time:'2 hours ago', text:"Beautiful thought for this week's parasha: the Torah begins with the letter Bet (ב) not Aleph (א) to teach us that the world was created for the sake of blessing (bracha). Everything begins with blessing.", likes:24 },
  { id:2, initials:'MG', name:'Miriam G.', badge:'', time:'5 hours ago', text:'First time doing Havdalah on my own last night. I cried. Something about the spices and the candle flame... I finally understood why people say Shabbat is a taste of the next world.', likes:41 },
  { id:3, initials:'DK', name:'David K.', badge:'', time:'Yesterday', text:"I'm just starting out and feeling overwhelmed by how much there is to learn. Any advice on where to focus first? The lessons here are incredible but I want to know what to prioritize.", likes:18 },
  { id:4, initials:'SL', name:'Sara L.', badge:'Educator', time:'Yesterday', text:"Responding to David: Start with Shabbat. Just one Shabbat dinner a week, with candles, kiddush, and a real meal with family. Everything else grows from there. Don't try to do it all at once.", likes:33 },
  { id:5, initials:'AH', name:'Avi H.', badge:'', time:'2 days ago', text:"The Modeh Ani prayer changed my mornings completely. Saying those words before I even check my phone — it reorients everything. Highly recommend starting there.", likes:29 },
];

const DAILY_INSIGHTS = [
  { text:"A person is obligated to say: the world was created for my sake.", source:"Talmud, Sanhedrin 4:5" },
  { text:"Who is wise? One who learns from every person.", source:"Pirkei Avot 4:1" },
  { text:"In every generation, a person is obligated to see himself as if he personally left Egypt.", source:"Passover Haggadah" },
  { text:"The seal of G-d is truth.", source:"Talmud, Shabbat 55a" },
  { text:"A person should always be as soft as a reed and not as hard as a cedar.", source:"Talmud, Ta'anit 20a" },
  { text:"Do not judge your fellow until you have reached his place.", source:"Pirkei Avot 2:4" },
  { text:"It is not upon you to finish the work, nor are you free to desist from it.", source:"Pirkei Avot 2:16" },
];

function getPathFromAnswers(a) {
  const q1 = a[0]??0;
  if(q1<=1) return {name:"The Seeker's Path",weeks:8,description:"A gentle introduction to Jewish heritage, designed for those curious and open to discovery."};
  if(q1===2) return {name:"The Returner's Path",weeks:6,description:"A meaningful journey back to your roots, bridging modern life with timeless Jewish wisdom."};
  return {name:"The Scholar's Path",weeks:4,description:"An immersive deep-dive into Torah study and halacha for the dedicated learner."};
}
function getDailyInsight(){return DAILY_INSIGHTS[new Date().getDay()%DAILY_INSIGHTS.length];}

// ── SEARCH ────────────────────────────────────────────────
function SearchOverlay({ onClose, onOpenLesson }) {
  const [q, setQ] = useState('');
  const allLessons = LEARNING_PATH.flatMap(u => u.lessons.map(l => ({...l, unitTitle:u.title})));
  const results = q.length < 2 ? [] : allLessons
    .filter(l => {
      const s = q.toLowerCase();
      return l.title.toLowerCase().includes(s)
        || l.hook?.body?.toLowerCase().includes(s)
        || l.wrap?.toLowerCase().includes(s)
        || l.teachSlides?.some(ts => ts.title?.toLowerCase().includes(s) || ts.body?.toLowerCase().includes(s))
        || l.questions?.some(qs => qs.prompt?.toLowerCase().includes(s));
    })
    .map(l => ({type:'lesson', item:l}));
  return (
    <div className="search-overlay fade-in">
      <div className="search-header">
        <input className="search-input" placeholder="Search lessons..." autoFocus value={q} onChange={e=>setQ(e.target.value)}/>
        <button className="btn-back-text" onClick={onClose}>Cancel</button>
      </div>
      <div className="search-results">
        {q.length < 2 && <div className="search-empty" style={{paddingTop:60}}><div style={{fontSize:32,marginBottom:12}}><Icon name="search"/></div>Search lessons</div>}
        {q.length >= 2 && results.length === 0 && <div className="search-empty">No results for "{q}"</div>}
        {results.map((r, i) => (
          <button key={i} className="search-result-item" style={{width:'100%',textAlign:'left'}} onClick={() => {const unit=LEARNING_PATH.find(u=>u.lessons.some(l=>l.id===r.item.id));onOpenLesson(r.item,unit);onClose();}}>
            <span className="search-result-icon"><Icon name={r.item.iconName}/></span>
            <div><div className="search-result-title">{r.item.title}</div><div className="search-result-sub">{r.item.unitTitle}</div></div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── BOTTOM NAV ────────────────────────────────────────────
const TABS = [
  {id:'home',iconName:'nav_home',label:'Home'},
  {id:'learn',iconName:'nav_learn',label:'Learn'},
  {id:'community',iconName:'nav_community',label:'Community'},
  {id:'profile',iconName:'nav_profile',label:'Profile'},
];
function BottomNav({activeTab,onChange}){
  return(
    <nav className="bottom-nav">
      {TABS.map(t=>(
        <button key={t.id} className={`nav-tab${activeTab===t.id?' nav-tab-active':''}`} onClick={()=>onChange(t.id)}>
          <span className="nav-icon"><Icon name={t.iconName} size={22}/></span>
          <span className="nav-label">{t.label}</span>
          {activeTab===t.id && <span className="nav-active-dot"/>}
        </button>
      ))}
    </nav>
  );
}

// ── ONBOARDING ────────────────────────────────────────────
function StepDots({total, current}){
  return(
    <div className="onboarding-step-dots">
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} className={`step-dot${i===current?' step-dot-active':i<current?' step-dot-done':''}`}/>
      ))}
    </div>
  );
}

function Welcome({onBegin, onSkip, onTryDemo}){
  const FEATURES = [
    {icon:'📚', title:`${LEARNING_PATH.flatMap(u=>u.lessons).length} Structured Lessons`, text:'Eight units covering the foundations of Jewish faith, Shabbat, prayer, holidays, Torah study, Kashrut, the Jewish lifecycle, and ethics.'},
    {icon:'🗺️', title:'Structured Learning Path', text:'A clear progression from the basics to advanced topics — each lesson builds on the last.'},
    {icon:'🔥', title:'Streaks & Badges', text:'Daily progress, XP, and milestones to keep you coming back — one lesson at a time'},
    {icon:'🕍', title:'Rabbi-Centered', text:'Built with traditional Orthodox teachers — Sephardi, Chabad, and Yeshivish. Real Torah, not watered-down content.'},
  ];

  const FAQ_ITEMS = [
    {q:'When are the native apps launching?', a:"The web app is available now — start learning today. Native iOS and Android apps are coming Q3 2026. Join the waitlist to be first to know."},
    {q:'Who is this for?', a:'Anyone on a path back to Judaism — baalei teshuva, curious beginners, committed learners without access to a consistent teacher, or Jews anywhere in the world who want real Torah in their pocket.'},
    {q:'What hashkafa is this?', a:"Journey to Hashem is built with traditional Orthodox teachers across Sephardi, Chabad, and Yeshivish backgrounds. It's not tied to one hashkafa — it's built to give learners access to authentic Torah and let them find the teacher who speaks to them."},
    {q:'Will it be free?', a:'The core learning content will be free. Advanced units, premium features, and one-on-one access to teachers may be paid. Our goal is accessibility first.'},
    {q:'Can I teach on the platform?', a:'Yes. We\'re actively looking for serious teachers to build this with us. Use the "Teach on the platform" form above.'},
  ];

  const [faqOpen,setFaqOpen]=useState(null);
  const [teacherForm,setTeacherForm]=useState({name:'',email:''});
  const [teacherDone,setTeacherDone]=useState(false);
  const [teacherLoading,setTeacherLoading]=useState(false);
  const [teacherError,setTeacherError]=useState('');
  const [learnerForm,setLearnerForm]=useState({name:'',email:''});
  const [learnerDone,setLearnerDone]=useState(false);
  const [learnerLoading,setLearnerLoading]=useState(false);
  const [learnerError,setLearnerError]=useState('');

  const scrollTo=(id)=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'});

  const submitTeacher=async()=>{
    if(!teacherForm.name||!teacherForm.email) return;
    setTeacherLoading(true); setTeacherError('');
    try{
      const res=await fetch('/api/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({formName:'rabbi-interest',signup_type:'teacher',...teacherForm}),
      });
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||'Submission failed');
      setTeacherDone(true);
      try{window.posthog?.capture('rabbi_interest',{name:teacherForm.name});}catch{}
    }catch(e){
      setTeacherError(e.message||'Something went wrong. Please try again.');
    }finally{setTeacherLoading(false);}
  };

  const submitLearner=async()=>{
    if(!learnerForm.name||!learnerForm.email) return;
    setLearnerLoading(true); setLearnerError('');
    try{
      const res=await fetch('/api/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({formName:'user-waitlist',signup_type:'learner',...learnerForm}),
      });
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||'Submission failed');
      setLearnerDone(true);
      try{window.posthog?.capture('waitlist_signup',{name:learnerForm.name});}catch{}
    }catch(e){
      setLearnerError(e.message||'Something went wrong. Please try again.');
    }finally{setLearnerLoading(false);}
  };

  return(
    <div className="screen-full onboarding-screen fade-in" style={{overflowY:'auto',justifyContent:'flex-start'}}>

      {/* ── Hero + features + CTAs ── */}
      <div className="onboarding-content">
        <div className="logo-area">
          <div className="logo-star"><MagenDavid size={64}/></div>
          <h1 className="logo-title">Journey to Hashem</h1>
          <p className="logo-tagline">Find your path home</p>
        </div>
        <p className="welcome-subtext">Built by someone on his own journey —<br/>for everyone still finding theirs.</p>
        <div className="welcome-features">
          {FEATURES.map((f,i)=>(
            <div key={i} className="welcome-feature" style={{animationDelay:`${0.1+i*0.07}s`}}>
              <span className="welcome-feature-icon">{f.icon}</span>
              <div>
                <div className="welcome-feature-title">{f.title}</div>
                <div className="welcome-feature-text">{f.text}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-primary btn-large" onClick={onTryDemo}>Start Learning Free →</button>
        <button className="btn-secondary" style={{width:'100%',marginTop:10,padding:'14px'}} onClick={()=>scrollTo('learner-waitlist')}>Get notified when native apps launch</button>
        <div className="welcome-divider">
          <div className="welcome-divider-line"/>
          <span className="welcome-divider-text">Are you an educator?</span>
          <div className="welcome-divider-line"/>
        </div>
        <button className="welcome-skip" onClick={()=>scrollTo('rabbi-teacher')}>I'm a rabbi or teacher →</button>
      </div>

      {/* ── Change 4 — For Rabbis & Teachers ── */}
      <section id="rabbi-teacher" style={{padding:'32px 20px',borderTop:'1px solid rgba(201,168,76,0.15)'}}>
        <div style={{maxWidth:390,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:26,fontWeight:600,color:'var(--gold)',marginBottom:12,letterSpacing:'-0.3px'}}>For Rabbis &amp; Teachers</h2>
          <p style={{fontSize:14,color:'var(--text-dim)',lineHeight:1.7,marginBottom:20}}>Journey to Hashem is built to give serious Jewish educators a platform to reach learners who don't have a yeshiva or a consistent teacher nearby. If you teach — whether you're a rabbi, a rebbetzin, or a learned community member — we want to build this with you.</p>
          {teacherDone?(
            <div style={{textAlign:'center',padding:'18px 0'}}>
              <div style={{fontSize:24,marginBottom:8}}>✅</div>
              <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:17,color:'var(--gold)'}}>Thank you — we'll be in touch.</div>
            </div>
          ):(
            <div style={{background:'rgba(201,168,76,0.05)',border:'1px solid rgba(201,168,76,0.18)',borderRadius:'var(--radius-lg)',padding:16}}>
              <input className="pitch-input" placeholder="Your name" value={teacherForm.name} onChange={e=>setTeacherForm(f=>({...f,name:e.target.value}))} style={{marginBottom:8}}/>
              <input className="pitch-input" type="email" placeholder="Email address" value={teacherForm.email} onChange={e=>setTeacherForm(f=>({...f,email:e.target.value}))} style={{marginBottom:12}}/>
              <button
                className={`btn-primary${(!teacherForm.name||!teacherForm.email||teacherLoading)?' btn-disabled':''}`}
                disabled={!teacherForm.name||!teacherForm.email||teacherLoading}
                onClick={submitTeacher}
              >{teacherLoading?'Sending…':'Teach on the platform'}</button>
              {teacherError&&<p style={{color:'#e05252',fontSize:12,marginTop:6}}>{teacherError}</p>}
            </div>
          )}
        </div>
      </section>

      {/* ── Change 5 — FAQ ── */}
      <section style={{padding:'32px 20px',borderTop:'1px solid rgba(201,168,76,0.15)'}}>
        <div style={{maxWidth:390,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:26,fontWeight:600,color:'var(--gold)',marginBottom:20,letterSpacing:'-0.3px'}}>Questions</h2>
          {FAQ_ITEMS.map((item,i)=>(
            <div key={i} style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
              <button
                onClick={()=>setFaqOpen(faqOpen===i?null:i)}
                style={{width:'100%',textAlign:'left',padding:'14px 0',display:'flex',justifyContent:'space-between',alignItems:'center',background:'none',border:'none',cursor:'pointer',color:'var(--text-body)',fontSize:14,fontWeight:500,lineHeight:1.4}}
              >
                <span>{item.q}</span>
                <span style={{color:'var(--gold)',fontSize:18,marginLeft:12,flexShrink:0,transition:'transform 0.2s',display:'inline-block',transform:faqOpen===i?'rotate(45deg)':'rotate(0deg)'}}>+</span>
              </button>
              {faqOpen===i&&<p style={{fontSize:13,color:'var(--text-dim)',lineHeight:1.7,paddingBottom:14,margin:0}}>{item.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Change 6 — Learner waitlist form ── */}
      <section id="learner-waitlist" style={{padding:'32px 20px',borderTop:'1px solid rgba(201,168,76,0.15)'}}>
        <div style={{maxWidth:390,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:26,fontWeight:600,color:'var(--gold)',marginBottom:8,letterSpacing:'-0.3px'}}>Join the Waitlist</h2>
          <p style={{fontSize:14,color:'var(--text-dim)',lineHeight:1.6,marginBottom:20}}>Be first to know when we launch. No spam — just updates on our progress.</p>
          {learnerDone?(
            <div style={{textAlign:'center',padding:'18px 0'}}>
              <div style={{fontSize:24,marginBottom:8}}>✅</div>
              <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:17,color:'var(--gold)'}}>You're on the list!</div>
              <div style={{fontSize:13,color:'var(--text-dim)',marginTop:4}}>We'll be in touch.</div>
            </div>
          ):(
            <>
              <input className="pitch-input" placeholder="Your name" value={learnerForm.name} onChange={e=>setLearnerForm(f=>({...f,name:e.target.value}))} style={{marginBottom:8}}/>
              <input className="pitch-input" type="email" placeholder="Email address" value={learnerForm.email} onChange={e=>setLearnerForm(f=>({...f,email:e.target.value}))} style={{marginBottom:12}}/>
              <button
                className={`btn-primary${(!learnerForm.name||!learnerForm.email||learnerLoading)?' btn-disabled':''}`}
                disabled={!learnerForm.name||!learnerForm.email||learnerLoading}
                onClick={submitLearner}
              >{learnerLoading?'Sending…':'Join the waitlist →'}</button>
              {learnerError&&<p style={{color:'#e05252',fontSize:12,marginTop:6}}>{learnerError}</p>}
            </>
          )}
        </div>
      </section>

      {/* ── Change 3 — Footer ── */}
      <footer style={{padding:'24px 20px 40px',borderTop:'1px solid rgba(255,255,255,0.06)',textAlign:'center'}}>
        <p style={{fontSize:12,color:'var(--text-dim)',margin:'0 0 4px',letterSpacing:'0.2px'}}>Native apps coming Q3 2026</p>
        <p style={{fontSize:12,color:'var(--text-dim)',margin:0,letterSpacing:'0.2px'}}>Founded by Salomon Elie · Miami · 2026</p>
      </footer>

    </div>
  );
}

function Quiz({onComplete}){
  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState([]);
  const [selected,setSelected]=useState(null);
  const [animDir,setAnimDir]=useState('right');
  const q=QUIZ_QUESTIONS[current];
  const isLast=current===QUIZ_QUESTIONS.length-1;
  const pct=((current)/QUIZ_QUESTIONS.length)*100;

  const handleNext=()=>{
    if(selected===null)return;
    const newAns=[...answers,selected];
    setAnimDir('right');
    if(isLast){try{window.posthog?.capture('quiz_completed',{answers:newAns});}catch{}onComplete(newAns);}
    else{setAnswers(newAns);setCurrent(c=>c+1);setSelected(null);}
  };

  const handleBack=()=>{
    if(current===0)return;
    setAnimDir('left');
    setAnswers(a=>a.slice(0,-1));
    setCurrent(c=>c-1);
    setSelected(answers[current-1]??null);
  };

  return(
    <div className="screen-full onboarding-screen fade-in">
      <div className="onboarding-content quiz-content">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
          <StepDots total={QUIZ_QUESTIONS.length} current={current}/>
          <span className="quiz-step">{current+1} / {QUIZ_QUESTIONS.length}</span>
        </div>
        <div className="quiz-progress-track"><div className="quiz-progress-fill" style={{width:`${pct}%`}}/></div>
        <h2 className="quiz-question" key={current} style={{animation:'fadeIn 0.3s ease both'}}>{q.question}</h2>
        <div className="quiz-options">
          {q.options.map((opt,i)=>(
            <button key={i} className={`quiz-option${selected===i?' quiz-option-selected':''}`} onClick={()=>setSelected(i)}>
              <div className="quiz-option-inner">
                <span>{opt}</span>
                <span className="quiz-option-check">{selected===i?'✓':''}</span>
              </div>
            </button>
          ))}
        </div>
        <div style={{display:'flex',gap:10,width:'100%'}}>
          {current>0&&<button className="btn-secondary" style={{flex:'0 0 auto'}} onClick={handleBack}>← Back</button>}
          <button className={`btn-primary${selected===null?' btn-disabled':''}`} onClick={handleNext} disabled={selected===null} style={{flex:1}}>
            {isLast?'See My Path →':'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PathReady({path, answers, onStart}){
  if(!path)return null;
  const level = answers[0]??0;
  const startUnitIdx = level>=3 ? Math.min(4, LEARNING_PATH.length-1) : 0;
  const firstUnit = LEARNING_PATH[startUnitIdx];
  const previewLessons = firstUnit.lessons.slice(0,3);
  const timeLabel = answers[4]===0?'5 min/day':answers[4]===1?'10–15 min/day':answers[4]===2?'30 min/day':'1+ hr/day';
  return(
    <div className="screen-full onboarding-screen fade-in">
      <div className="onboarding-content">
        <div className="path-ready-icon">✨</div>
        <p className="path-ready-label">Your learning path</p>
        <h2 className="path-ready-name">{path.name}</h2>
        <p className="path-ready-description">{path.description}</p>
        <div className="path-ready-meta">
          <div className="path-meta-item"><span className="path-meta-value">{path.weeks}</span><span className="path-meta-label">weeks</span></div>
          <div className="path-meta-divider"/>
          <div className="path-meta-item"><span className="path-meta-value">{LEARNING_PATH.flatMap(u=>u.lessons).length}</span><span className="path-meta-label">lessons</span></div>
          <div className="path-meta-divider"/>
          <div className="path-meta-item"><span className="path-meta-value">{timeLabel}</span><span className="path-meta-label">your pace</span></div>
        </div>
        <div className="path-preview">
          <div className="path-preview-title">{level>=3?`You'll dive into ${firstUnit.title}`:'You\'ll start with'}</div>
          {previewLessons.map((l,i)=>(
            <div key={l.id} className="path-preview-lesson">
              <span className="path-preview-icon"><Icon name={l.iconName}/></span>
              <span className={i===0?'path-preview-name':'path-preview-locked'}>{l.title}</span>
              {i===0&&<span style={{marginLeft:'auto',fontSize:10,color:'var(--gold)',fontWeight:700,background:'rgba(201,168,76,0.12)',padding:'2px 8px',borderRadius:20}}>FIRST</span>}
            </div>
          ))}
        </div>
        <button className="btn-primary btn-large" onClick={onStart}>Start My Journey →</button>
      </div>
    </div>
  );
}

// ── HOME TAB ──────────────────────────────────────────────
function UserWaitlistCard(){
  const [form,setForm]=useState({name:'',email:''});
  const [done,setDone]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  if(done)return(
    <div className="home-card" style={{textAlign:'center',padding:'18px 16px'}}>
      <Icon name="check_circle" size={20} style={{marginBottom:6,display:'block'}}/>
      <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:17,color:'var(--gold)'}}>You're on the list!</div>
      <div style={{fontSize:13,color:'var(--text-dim)',marginTop:4}}>We'll be in touch.</div>
    </div>
  );
  return(
    <div className="home-card">
      <div className="home-card-header"><span className="home-card-icon"><Icon name="envelope"/></span><span className="home-card-title">Join the Waitlist</span></div>
      <p style={{fontSize:13,color:'var(--text-dim)',margin:'4px 0 12px'}}>Be first to know when we launch.</p>
      <input className="pitch-input" placeholder="Your name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={{marginBottom:8}}/>
      <input className="pitch-input" placeholder="Email address" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} style={{marginBottom:12}}/>
      <button
        className={`btn-primary${(!form.name||!form.email||loading)?' btn-disabled':''}`}
        disabled={!form.name||!form.email||loading}
        onClick={async()=>{
          setLoading(true);
          setError('');
          try{
            const res=await fetch('/api/submit',{
              method:'POST',
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify({formName:'user-waitlist',signup_type:'learner',...form})
            });
            const data=await res.json();
            if(!res.ok) throw new Error(data.error||'Submission failed');
            setDone(true);
          }catch(e){
            setError(e.message||'Something went wrong. Please try again.');
          }finally{
            setLoading(false);
          }
        }}
      >{loading?'Sending…':'Join →'}</button>
      {error&&<p style={{color:'#e05252',fontSize:12,marginTop:6}}>{error}</p>}
    </div>
  );
}

function HomeTab({state,onOpenLesson,onGoTab,onSearch,onOpenPitch}){
  const {completedLessons,currentStreak,totalXP,userName}=state;
  const [showReminder,setShowReminder]=useState(true);
  const allLessons=LEARNING_PATH.flatMap(u=>u.lessons);
  const curIdx=allLessons.findIndex(l=>!completedLessons.includes(l.id));
  const curLesson=curIdx>=0?allLessons[curIdx]:null;
  const curUnit=curLesson?LEARNING_PATH.find(u=>u.lessons.some(l=>l.id===curLesson.id)):null;
  const insight=getDailyInsight();
  const shabbat=isShabbat();
  const parasha=getParasha();
  const greeting=(()=>{const h=new Date().getHours();if(h<12)return'Good morning';if(h<17)return'Good afternoon';return'Good evening';})();
  const showStreakReminder=currentStreak>0&&showReminder&&!shabbat;

  return(
    <div className="tab-screen fade-in">
      <div className="home-hero">
        <div className="home-top-row">
          <div>
            <p className="home-greeting">{greeting}{userName?`, ${userName}`:''}</p>
            <h2 className="home-name">{shabbat?<>Shabbat Shalom <MagenDavid size={18}/></>:'Journey to Hashem'}</h2>
            <p className="home-date">{getHebrewDate()} · {new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
            <button className="home-search-btn" onClick={()=>shareApp()} title="Share app"><Icon name="share"/></button>
            <button className="home-search-btn" onClick={onSearch} title="Search"><Icon name="search"/></button>
          </div>
        </div>
        <div className="home-streak-bar">
          <span className="home-streak-icon"><Icon name="streak"/></span>
          <div className="home-streak-text">
            <div className="home-streak-num">{currentStreak} day{currentStreak!==1?'s':''}</div>
            <div className="home-streak-label">learning streak · {totalXP} XP total</div>
          </div>
        </div>
        {state.streakFreezeAvailable && (
          <div style={{
            display:'flex', alignItems:'center', gap:10,
            padding:'10px 14px', marginTop:10,
            background:'rgba(120, 180, 220, 0.08)',
            border:'1px solid rgba(120, 180, 220, 0.2)',
            borderRadius:'var(--radius-lg)',
            fontSize:13, color:'var(--text-body)',
          }}>
            <Icon name="freeze" size={18}/>
            <span><strong>Streak freeze ready.</strong> We'll auto-apply it if you miss a day.</span>
          </div>
        )}
        {!state.streakFreezeAvailable && state.streakFreezeUsedAt && (
          <div style={{
            display:'flex', alignItems:'center', gap:10,
            padding:'10px 14px', marginTop:10,
            background:'rgba(255,255,255,0.03)',
            border:'1px solid rgba(255,255,255,0.08)',
            borderRadius:'var(--radius-lg)',
            fontSize:12, color:'var(--text-dim)',
          }}>
            <Icon name="freeze" size={16}/>
            <span>Streak freeze used on {state.streakFreezeUsedAt}. Refreshes Sunday.</span>
          </div>
        )}
      </div>

      {shabbat&&(
        <div className="shabbat-banner">
          <span className="shabbat-banner-icon"><Icon name="candle"/></span>
          <div className="shabbat-banner-text">
            <div className="shabbat-banner-title">Shabbat Shalom</div>
            <div className="shabbat-banner-sub">Shabbat is a day of rest — come back after nightfall to continue learning.</div>
          </div>
        </div>
      )}

      {showStreakReminder&&(
        <div className="streak-reminder">
          <Icon name="bell" size={18}/>
          <span className="streak-reminder-text">Don't break your {currentStreak}-day streak — complete a lesson today!</span>
          <button className="streak-reminder-close" onClick={()=>setShowReminder(false)}>×</button>
        </div>
      )}

      {!shabbat&&curLesson&&(
        <button className="home-cta" onClick={()=>onOpenLesson(curLesson,curUnit)}>
          <div>
            <div className="home-cta-label">Continue Learning</div>
            <div className="home-cta-title">{curLesson.title}</div>
          </div>
          <span className="home-cta-arrow">→</span>
        </button>
      )}
      {!shabbat&&!curLesson&&(
        <div className="home-cta home-cta-done">
          <div>
            <div className="home-cta-label" style={{color:'var(--gold)'}}>Core Curriculum Complete <Icon name="trophy" size={14}/></div>
            <div className="home-cta-title" style={{fontSize:13,color:'var(--text-dim)'}}>Units 9+ coming soon — revisit lessons below</div>
          </div>
          <span className="home-cta-arrow" style={{color:'var(--text-dim)'}}>✓</span>
        </div>
      )}

      <div className="section section-top">
        <div className="parasha-card">
          <div className="parasha-label"><Icon name="torah"/> This Week's Parasha (approx.)</div>
          <div className="parasha-name">Parashat {parasha}</div>
          <div className="parasha-detail">Approximate · may vary by location and year</div>
        </div>

        <UserWaitlistCard/>

        <div className="home-card">
          <div className="home-card-header"><span className="home-card-icon"><Icon name="sparkle"/></span><span className="home-card-title">Daily Insight</span></div>
          <div className="home-insight-text">"{insight.text}"</div>
          <div className="home-insight-source">— {insight.source}</div>
        </div>

        <div className="home-card" style={{display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer'}} onClick={()=>onGoTab('community')}>
          <div>
            <div className="home-card-title" style={{fontSize:11,color:'var(--gold)',textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:4}}><Icon name="community"/> Community</div>
            <div style={{fontSize:14,color:'var(--text-body)'}}>5 new posts today</div>
            <div style={{fontSize:12,color:'var(--text-dim)',marginTop:2}}>Discussing Parashat {parasha}</div>
          </div>
          <span style={{color:'var(--text-dim)',fontSize:22}}>›</span>
        </div>

        <button className="pitch-home-btn" onClick={onOpenPitch}>
          <span className="pitch-home-btn-icon"><Icon name="synagogue"/></span>
          <div className="pitch-home-btn-text">
            <div className="pitch-home-btn-title">Are you a Rabbi or Educator?</div>
            <div className="pitch-home-btn-sub">Partner with Journey to Hashem →</div>
          </div>
        </button>
      </div>
    </div>
  );
}


// ── LEARN TAB ─────────────────────────────────────────────
const NODE_OFFSETS=[0,1,0,-1,0];
function PathMap({completedLessons,bookmarks,onLessonTap}){
  const completedSet=new Set(completedLessons);
  const allLessons=LEARNING_PATH.flatMap(u=>u.lessons);
  const curIdx=allLessons.findIndex(l=>!completedSet.has(l.id));
  const curId=curIdx>=0?allLessons[curIdx].id:null;
  const getState=id=>completedSet.has(id)?'completed':id===curId?'current':'locked';
  return(
    <div className="path-map">
      {LEARNING_PATH.map(unit=>(
        <div key={unit.id} className="path-unit">
          <div className="unit-divider">
            <div className="unit-divider-line"/>
            <div className="unit-divider-badge">
              <span className="unit-badge-level">{unit.level}</span>
              <span className="unit-badge-title">{unit.title}</span>
            </div>
            <div className="unit-divider-line"/>
          </div>
          <div className="unit-nodes">
            <div className="unit-nodes-track"/>
            {unit.lessons.map((lesson,i)=>{
              const st=getState(lesson.id);
              const shift=NODE_OFFSETS[i]*56;
              const isBookmarked=bookmarks&&bookmarks.includes(lesson.id);
              return(
                <div key={lesson.id} className="node-row">
                  <div className="node-col" style={{transform:`translateX(${shift}px)`}}>
                    <button className={`lesson-node node-${st}`} onClick={()=>st!=='locked'&&onLessonTap(lesson,unit)} disabled={st==='locked'}>
                      <span className="node-icon"><Icon name={lesson.iconName} size={28}/></span>
                      {st==='completed'&&<span className="node-check"><Icon name="check"/></span>}
                      {isBookmarked&&st!=='completed'&&<span className="node-bookmark"><Icon name="bookmark"/></span>}
                    </button>
                    <span className={`node-label label-${st}`}>{lesson.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
function LearnTab({state,onOpenLesson}){
  const {completedLessons,currentStreak,dailyLessonsCompleted,totalXP,pathName,bookmarks}=state;
  const DAILY_GOAL=3;
  const allLessons=LEARNING_PATH.flatMap(u=>u.lessons);
  const curIdx=allLessons.findIndex(l=>!completedLessons.includes(l.id));
  const curLesson=curIdx>=0?allLessons[curIdx]:null;
  const curUnit=curLesson?LEARNING_PATH.find(u=>u.lessons.some(l=>l.id===curLesson.id)):null;
  const dailyPct=Math.min((dailyLessonsCompleted/DAILY_GOAL)*100,100);
  return(
    <div className="tab-screen learn-tab">
      <div className="learn-header">
        <div className="learn-header-top">
          <div className="streak-counter"><span className="streak-icon"><Icon name="streak"/></span><span className="streak-number">{currentStreak} day{currentStreak!==1?'s':''}</span></div>
          <div className="xp-counter"><span className="xp-icon"><Icon name="xp"/></span><span className="xp-number">{totalXP} XP</span></div>
        </div>
        <p className="daily-goal-text">{dailyLessonsCompleted}/{DAILY_GOAL} lessons today</p>
        <div className="daily-goal-bar"><div className="daily-goal-fill" style={{width:`${dailyPct}%`}}/></div>
      </div>
      {curLesson?(
        <div className="section section-top">
          <h3 className="section-title">Continue Your Path</h3>
          <button className="continue-card" onClick={()=>onOpenLesson(curLesson,curUnit)}>
            <div className="continue-card-content">
              <p className="continue-unit">{curUnit?.title}</p>
              <p className="continue-lesson">{curLesson.title}</p>
            </div>
            <span className="btn-continue">Continue →</span>
          </button>
        </div>
      ):(
        <div className="section section-top">
          <div className="all-complete-card">
            <div className="all-complete-trophy"><Icon name="trophy" size={40}/></div>
            <h3 className="all-complete-title">Core Curriculum Complete</h3>
            <p className="all-complete-subtitle">You've finished all {allLessons.length} lessons — {LEARNING_PATH.map(u=>u.title.split('—')[0].trim()).join(', ')}.</p>
            <div className="all-complete-divider"/>
            <div className="all-complete-coming">
              <Icon name="sparkle" size={16}/>
              <span>Units 9+ are in development</span>
            </div>
            <p className="all-complete-hint">In the meantime, revisit any lesson on the path below — review deepens understanding.</p>
          </div>
        </div>
      )}
      <div className="section">
        <h3 className="section-title">Your Learning Path</h3>
        <p className="section-subtitle">{pathName}</p>
        <PathMap completedLessons={completedLessons} bookmarks={bookmarks} onLessonTap={onOpenLesson}/>
      </div>
    </div>
  );
}

// ── CONGRATS ──────────────────────────────────────────────
function CongratsScreen({lesson, xpEarned, streak, newBadges, totalXP, replay, heartsLeft, wrongAnswers, ranOutOfHearts, onContinue}){
  const [visible,setVisible]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setVisible(true),80);return()=>clearTimeout(t);},[]);
  const level=getLevel(totalXP);
  const perfect = wrongAnswers === 0 && !ranOutOfHearts && !replay;

  return(
    <div className="screen-full congrats-screen fade-in">
      <div className={`congrats-card${visible?' visible':''}`}>
        <div className="congrats-sparkle"><Icon name={perfect?'celebration':'check'}/></div>
        <h2 className="congrats-title">
          {replay ? 'Reviewed!' : ranOutOfHearts ? 'Lesson complete' : perfect ? 'Perfect Lesson!' : 'Lesson complete'}
        </h2>
        <p className="congrats-sub">
          {replay
            ? `You've already earned XP for "${lesson.title}".`
            : ranOutOfHearts
              ? `You ran out of hearts — no XP this time, but "${lesson.title}" is still marked complete. Hearts refill tomorrow.`
              : perfect
                ? `No mistakes on "${lesson.title}" — +${xpEarned} XP including bonuses!`
                : `+${xpEarned} XP on "${lesson.title}".`}
        </p>
        {!replay && !ranOutOfHearts && (
          <div className="congrats-stats">
            <div className="pitch-stat"><span className="pitch-stat-value">+{xpEarned}</span><span className="pitch-stat-label">XP</span></div>
            <div className="pitch-stat"><span className="pitch-stat-value">{streak}</span><span className="pitch-stat-label">Streak</span></div>
            <div className="pitch-stat"><span className="pitch-stat-value">{heartsLeft}</span><span className="pitch-stat-label">Hearts</span></div>
            <div className="pitch-stat"><span className="pitch-stat-value" style={{fontSize:14}}>{level.name}</span><span className="pitch-stat-label">Level</span></div>
          </div>
        )}
        {newBadges.length>0 && (
          <div className="congrats-badges">
            <p className="congrats-badges-label">New badge{newBadges.length>1?'s':''} unlocked!</p>
            <div className="congrats-badges-row">
              {newBadges.map(b=>(
                <div key={b.id} className="congrats-badge">
                  <div className="congrats-badge-icon">{b.icon}</div>
                  <div className="congrats-badge-name">{b.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <button className="btn-primary btn-large" onClick={onContinue}>Continue</button>
      </div>
    </div>
  );
}


// ── COMMUNITY TAB ─────────────────────────────────────────
function CommunityTab({state}){
  const [activeSection,setActiveSection]=useState('feed');

  return(
    <div className="tab-screen fade-in" style={{position:'relative'}}>
      <div className="community-header">
        <div><h2 className="tab-title">Community</h2><p className="tab-subtitle">Learn and grow together</p></div>
      </div>

      {/* Section toggle */}
      <div style={{display:'flex',gap:8,padding:'14px 20px 4px'}}>
        {['feed','leaderboard'].map(s=>(
          <button key={s} onClick={()=>setActiveSection(s)} style={{padding:'7px 16px',borderRadius:100,fontSize:13,fontWeight:600,transition:'all 0.2s',background:activeSection===s?'var(--gold)':'rgba(255,255,255,0.05)',color:activeSection===s?'var(--navy)':'var(--text-dim)',border:'none'}}>
            {s==='feed'?<><Icon name="community"/> Feed</>:<><Icon name="trophy"/> Leaderboard</>}
          </button>
        ))}
      </div>

      {activeSection==='feed'&&(
        <div style={{padding:'48px 24px',textAlign:'center'}}>
          <div style={{fontSize:40,marginBottom:16}}>💬</div>
          <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,color:'var(--gold)',marginBottom:10}}>Community coming soon</div>
          <p style={{fontSize:14,color:'var(--text-dim)',lineHeight:1.7,maxWidth:300,margin:'0 auto'}}>Real discussions with learners and rabbis are on the way. Keep learning — the community launches with the full app.</p>
        </div>
      )}

      {activeSection==='leaderboard'&&(
        <div style={{padding:'48px 24px',textAlign:'center'}}>
          <div style={{fontSize:40,marginBottom:16}}>🏆</div>
          <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,color:'var(--gold)',marginBottom:10}}>Leaderboard coming soon</div>
          <p style={{fontSize:14,color:'var(--text-dim)',lineHeight:1.7,maxWidth:300,margin:'0 auto 24px'}}>Compete with real learners when the community launches. Here's where you stand right now:</p>
          <div className="leaderboard-row me" style={{borderRadius:'var(--radius-lg)',padding:'14px 16px',maxWidth:320,margin:'0 auto'}}>
            <span className="leaderboard-rank">🏅</span>
            <div className="leaderboard-avatar" style={{background:'linear-gradient(135deg,#4a90d9,#7bb3f0)',color:'#fff'}}>{(state?.userName||'Y').charAt(0).toUpperCase()}</div>
            <div style={{flex:1,textAlign:'left'}}>
              <div className="leaderboard-name">{state?.userName||'You'} <span style={{fontSize:10,color:'var(--gold)',marginLeft:6,fontWeight:700}}>YOU</span></div>
              <div className="leaderboard-streak"><Icon name="streak"/> {state?.currentStreak||0} day streak</div>
            </div>
            <span className="leaderboard-xp">{state?.totalXP||0} XP</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PROFILE TAB ───────────────────────────────────────────
const SETTINGS=['Language','Observance Level','About'];
function ProfileTab({state,onReset,onOpenPitch,onUpdateName}){
  const {completedLessons,currentStreak,totalXP,pathName,userName,earnedBadges}=state;
  const [editing,setEditing]=useState(false);
  const [nameVal,setNameVal]=useState(userName||'');
  const [showNotifs,setShowNotifs]=useState(false);
  const [notifs,setNotifs]=useState({daily:true,streak:true,shabbat:true});
  const bookmarkedLessons=LEARNING_PATH.flatMap(u=>u.lessons).filter(l=>(state.bookmarks||[]).includes(l.id));
  const level=getLevel(totalXP);
  const nextLevel=XP_LEVELS[XP_LEVELS.indexOf(level)+1];
  const levelPct=nextLevel?Math.round(((totalXP-level.min)/(nextLevel.min-level.min))*100):100;
  const earnedSet=new Set(earnedBadges||[]);

  const saveName=()=>{
    setEditing(false);
    if(nameVal.trim()) onUpdateName(nameVal.trim());
  };

  return(
    <div className="tab-screen profile-tab fade-in">
      <div className="profile-hero">
        <div className="profile-avatar">{nameVal ? nameVal.charAt(0).toUpperCase() : '?'}</div>
        {editing
          ?<input className="name-edit-input" value={nameVal} onChange={e=>setNameVal(e.target.value)} onBlur={saveName} onKeyDown={e=>e.key==='Enter'&&saveName()} autoFocus/>
          :<h2 className="profile-name" onClick={()=>setEditing(true)} style={{cursor:'pointer'}}>{nameVal||'Tap to set name'} <Icon name="pencil"/></h2>
        }
        <p className="profile-path-label">{pathName||'Learning Path'}</p>
        <button className="share-btn" style={{marginTop:8}} onClick={()=>shareApp(`${nameVal||'I'} am on Journey to Hashem`,`I've completed ${completedLessons.length} lessons on @JourneyToHashem — join me!`)}>
          <Icon name="share"/> Share My Progress
        </button>
      </div>

      <div className="xp-level-bar">
        <div className="xp-level-info">
          <div className="xp-level-name">{level.name} <span style={{fontSize:13,fontFamily:'Cormorant Garamond,serif',color:'var(--gold-light)',fontStyle:'italic'}}>{level.hebrew}</span></div>
          <div className="xp-bar-track"><div className="xp-bar-fill" style={{width:`${levelPct}%`}}/></div>
          <div className="xp-level-sub">{totalXP} XP{nextLevel?` · ${nextLevel.min-totalXP} to ${nextLevel.name}`:' · Max Level'}</div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card"><span className="stat-icon"><Icon name="streak"/></span><span className="stat-value">{currentStreak}</span><span className="stat-label">Day Streak</span></div>
        <div className="stat-card"><span className="stat-icon"><Icon name="xp"/></span><span className="stat-value">{totalXP}</span><span className="stat-label">Total XP</span></div>
        <div className="stat-card"><span className="stat-icon"><Icon name="check_circle"/></span><span className="stat-value">{completedLessons.length}</span><span className="stat-label">Lessons</span></div>
      </div>

      <div className="section">
        <h3 className="section-title">Badges <span style={{fontSize:13,color:'var(--text-dim)',fontFamily:'Inter,sans-serif',fontWeight:400}}>{earnedSet.size}/{ALL_BADGES.length}</span></h3>
      </div>
      <div className="badges-grid">
        {ALL_BADGES.map(b=>{
          const earned=earnedSet.has(b.id);
          return(
            <div key={b.id} className={`badge-card${earned?' earned':' locked'}`}>
              <span className={`badge-icon${earned?'':' locked-icon'}`}>{b.icon}</span>
              <span className="badge-name">{b.name}</span>
              <span className="badge-desc">{b.desc}</span>
              {earned&&<span className="badge-earned-tag">Earned</span>}
            </div>
          );
        })}
      </div>

      <div className="section">
        <h3 className="section-title">Progress</h3>
        {LEARNING_PATH.map(unit=>{
          const done=unit.lessons.filter(l=>completedLessons.includes(l.id)).length;
          return(
            <div key={unit.id} className="unit-progress">
              <div className="unit-progress-row"><span className="unit-progress-name">{unit.title}</span><span className="unit-progress-count">{done}/{unit.lessons.length}</span></div>
              <div className="unit-progress-bar"><div className="unit-progress-fill" style={{width:`${(done/unit.lessons.length)*100}%`}}/></div>
            </div>
          );
        })}
      </div>

      {bookmarkedLessons.length>0&&(
        <div className="section">
          <h3 className="section-title">Bookmarked</h3>
          {bookmarkedLessons.map(l=>(
            <div key={l.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
              <span style={{fontSize:20,display:'inline-flex',alignItems:'center'}}><Icon name={l.iconName} size={20}/></span>
              <span style={{fontSize:14,color:'var(--text-body)'}}>{l.title}</span>
            </div>
          ))}
        </div>
      )}

      <div className="section">
        <h3 className="section-title">Settings</h3>
        <div className="settings-list">
          <button className="settings-item" onClick={()=>setShowNotifs(true)}><span><Icon name="bell"/> Notifications</span><span className="settings-chevron">›</span></button>
          <div className="settings-item" style={{cursor:'default'}}><span>🌐 Language</span><span style={{fontSize:12,color:'var(--text-dim)'}}>English</span></div>
          <div className="settings-item" style={{cursor:'default'}}><span>✡️ Observance Level</span><span style={{fontSize:12,color:'var(--text-dim)'}}>All levels</span></div>
          <button className="settings-item" onClick={()=>alert('Journey to Hashem v1.2.0\nBuilt by Salomon Elie · Miami · 2026')}><span>ℹ️ About</span><span className="settings-chevron">›</span></button>
          <button className="settings-item" onClick={onOpenPitch} style={{color:'var(--gold)'}}><span><Icon name="synagogue"/> Partner With Us — For Rabbis</span><span className="settings-chevron">›</span></button>
          <button className="settings-item" onClick={()=>{
            try{
              const raw=localStorage.getItem('jth-v4')||'{}';
              const encoded=btoa(unescape(encodeURIComponent(raw)));
              const body=`My Journey to Hashem progress backup:%0A%0A${encoded}%0A%0ATo restore, paste this into your browser console at journeytohashem.com:%0AlocalStorage.setItem('jth-v4', decodeURIComponent(escape(atob('${encoded}'))))`;
              window.location.href=`mailto:?subject=My%20Journey%20to%20Hashem%20Progress&body=${body}`;
            }catch(e){alert('Unable to create backup. Please try again.');}
          }}><span>📤 Back Up My Progress</span><span className="settings-chevron">›</span></button>
          <button className="settings-item settings-item-danger" onClick={onReset}><span><Icon name="reset"/> Reset Progress</span><span className="settings-chevron">›</span></button>
        </div>
      </div>

      {showNotifs&&(
        <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowNotifs(false);}}>
          <div className="modal-sheet">
            <div className="modal-handle"/>
            <h3 className="modal-title">Notifications</h3>
            <div style={{padding:'24px 0',textAlign:'center'}}>
              <div style={{fontSize:32,marginBottom:12}}>🔔</div>
              <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:17,color:'var(--gold)',marginBottom:8}}>Push notifications coming soon</div>
              <p style={{fontSize:13,color:'var(--text-dim)',lineHeight:1.7}}>Daily reminders, streak protection, and Shabbat times will be available when the native apps launch.</p>
            </div>
            <div style={{marginTop:8}}>
              <button className="btn-primary" onClick={()=>setShowNotifs(false)}>Got it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── RABBI PITCH SCREEN ───────────────────────────────────
function RabbiPitchScreen({onBack}){
  const [showContact,setShowContact]=useState(false);
  const [contactForm,setContactForm]=useState({name:'',synagogue:'',email:'',phone:'',message:''});
  const [submitted,setSubmitted]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [submitError,setSubmitError]=useState('');

  const handleSubmit=async()=>{
    if(!contactForm.name||!contactForm.email) return;
    setSubmitting(true);
    setSubmitError('');
    try{
      const res=await fetch('/api/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({formName:'rabbi-interest',signup_type:'teacher',...contactForm})
      });
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||'Submission failed');
      setSubmitted(true);
      setTimeout(()=>{setShowContact(false);setSubmitted(false);},2000);
    }catch(e){
      setSubmitError(e.message||'Something went wrong. Please try again.');
    }finally{
      setSubmitting(false);
    }
  };

  const RABBI_BENEFITS=[
    'Your teachings reach Jews worldwide — 24/7, not just on Shabbat morning',
    'Upload shiurim once; students can replay, bookmark, and share them',
    'Full analytics: who listened, how long, what topics resonate',
    'Your congregation gets a dedicated learning track tied to your curriculum',
    'Co-brand the platform with your synagogue or yeshiva name',
    'Earn a revenue share from premium subscriptions in your community',
    'Help secular and distant Jews find their way back — at scale',
  ];

  const REVENUE_MODELS=[
    {icon:'🆓', title:'Free Tier', desc:'Full access to foundational lessons and community feed', price:'Free forever'},
    {icon:'✨', title:'Premium — $9.99/mo', desc:'Advanced units, full audio library, offline mode', price:'$9.99 / month'},
    {icon:'🕍', title:'Synagogue Plan', desc:'Branded community hub, congregation analytics, custom content tools', price:'$149 / month'},
    {icon:'🎓', title:'Yeshiva / School', desc:'Full curriculum integration, student progress dashboards, bulk licensing', price:'Custom pricing'},
  ];

  // Timeline uses relative phase labels — no hardcoded calendar dates that expire
  const TIMELINE=[
    {phase:'Phase 1 — Now',   future:false, title:'Prototype & Rabbi Partnerships',  desc:'Onboarding founding rabbis, building content pipeline, finalizing curriculum structure'},
    {phase:'Phase 2 — ~3 mo', future:true,  title:'Soft Launch — 500 Users',         desc:'iOS & Android apps, core learning path, audio library with 20+ shiurim, community Q&A'},
    {phase:'Phase 3 — ~6 mo', future:true,  title:'Community & Monetization',        desc:'Synagogue plans, leaderboards, push notifications, Stripe integration, rabbi revenue share'},
    {phase:'Phase 4 — ~12 mo',future:true,  title:'Scale — 50,000 Users',            desc:'Hebrew content track, Sephardic curriculum, Spanish localization, partnerships with major organizations'},
    {phase:'Phase 5 — ~24 mo',future:true,  title:'Global Platform',                 desc:'The home for Jewish learning online — 500k+ users across 40+ countries'},
  ];

  return(
    <div className="screen-full fade-in">
      <div className="pitch-screen">
        {/* Hero */}
        <div className="pitch-hero">
          <button className="pitch-back" onClick={onBack}>← Back to App</button>
          <div className="pitch-hero-tag"><span className="pitch-hero-tag-dot"/>For Rabbis & Jewish Educators</div>
          <h1 className="pitch-hero-title">Bring your teachings<br/>to <span>every Jew</span>,<br/>everywhere.</h1>
          <p className="pitch-hero-sub">Journey to Hashem is building the world's most accessible Jewish learning platform — and we're looking for founding rabbi partners to shape it.</p>
          <div className="pitch-hero-stats">
            <div className="pitch-stat"><span className="pitch-stat-value">3.2M</span><span className="pitch-stat-label">Unaffiliated US Jews</span></div>
            <div className="pitch-stat"><span className="pitch-stat-value">85%</span><span className="pitch-stat-label">Never attended a shiur</span></div>
            <div className="pitch-stat"><span className="pitch-stat-value">1</span><span className="pitch-stat-label">App to change that</span></div>
          </div>
        </div>

        {/* The Problem */}
        <div className="pitch-section">
          <h2 className="pitch-section-title">The Problem</h2>
          <p className="pitch-section-sub">Millions of Jews want to connect with their heritage — but synagogue attendance is declining, access to qualified rabbis is limited, and existing apps are either too dry or too basic.</p>
          <div className="pitch-value-grid">
            {[
              {icon:'📉', title:'Declining Engagement', desc:'Synagogue attendance has dropped 30% in a generation'},
              {icon:'🌍', title:'Global Disconnect', desc:'Most diaspora Jews have no connection to Jewish learning'},
              {icon:'📱', title:'Mobile-First World', desc:'People learn on phones — Jewish content hasn\'t caught up'},
              {icon:'🚪', title:'High Barrier', desc:'Finding a rabbi, scheduling a class — most never start'},
            ].map((v,i)=>(
              <div key={i} className="pitch-value-item">
                <div className="pitch-value-icon">{v.icon}</div>
                <div className="pitch-value-title">{v.title}</div>
                <div className="pitch-value-desc">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* The Solution */}
        <div className="pitch-section" style={{paddingTop:28}}>
          <h2 className="pitch-section-title">The Solution</h2>
          <p className="pitch-section-sub">A beautifully designed learning platform that makes daily Jewish learning as easy as checking Instagram — sourced from primary texts, built with real rabbis at the center.</p>
          {[
            {icon:'📚', title:'Structured Learning Path', body:`${LEARNING_PATH.flatMap(u=>u.lessons).length}+ lessons across ${LEARNING_PATH.length} units — foundations of faith, Shabbat, prayer, holidays, Torah study, Kashrut, lifecycle, and ethics — with XP, streaks, and badges to keep learners engaged.`},
            {icon:'🎙️', title:'Rabbi Audio Integration', body:'Every lesson includes a rabbi voice commentary. Your shiurim become permanent, searchable, shareable assets — not one-time Saturday morning talks.'},
            {icon:'💬', title:'Community & Q&A', body:'A moderated community feed where learners ask questions and rabbis answer — building real relationships at scale.'},
            {icon:'📊', title:'Analytics Dashboard', body:'See exactly which topics resonate, where learners drop off, and which of your congregants are engaging — data you\'ve never had before.'},
          ].map((c,i)=>(
            <div key={i} className="pitch-card pitch-card-gold">
              <div className="pitch-card-icon">{c.icon}</div>
              <div className="pitch-card-title">{c.title}</div>
              <div className="pitch-card-body">{c.body}</div>
            </div>
          ))}
        </div>

        {/* Why Partner */}
        <div className="pitch-section" style={{paddingTop:28}}>
          <h2 className="pitch-section-title">Why Partner With Us</h2>
          <p className="pitch-section-sub">Founding rabbi partners get exclusive benefits — and help shape the platform from day one.</p>
          <div className="pitch-card">
            {RABBI_BENEFITS.map((b,i)=>(
              <div key={i} className="pitch-rabbi-benefit">
                <span className="pitch-rabbi-benefit-check">✓</span>
                <span className="pitch-rabbi-benefit-text">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Model */}
        <div className="pitch-section" style={{paddingTop:28}}>
          <h2 className="pitch-section-title">Revenue Model</h2>
          <p className="pitch-section-sub">Sustainable freemium model — free tier drives growth, premium tiers generate revenue shared with partner rabbis.</p>
          <div className="pitch-card">
            {REVENUE_MODELS.map((m,i)=>(
              <div key={i} className="pitch-model-row">
                <div className="pitch-model-icon">{m.icon}</div>
                <div>
                  <div className="pitch-model-title">{m.title}</div>
                  <div className="pitch-model-desc">{m.desc}</div>
                  <div className="pitch-model-price">{m.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="pitch-section" style={{paddingTop:28}}>
          <h2 className="pitch-section-title">Roadmap</h2>
          <p className="pitch-section-sub">We're building in phases — rabbis who join now shape the product from the ground up.</p>
          <div className="pitch-timeline">
            {TIMELINE.map((t,i)=>(
              <div key={i} className="pitch-timeline-item">
                <div className={`pitch-timeline-dot${t.future?' future':''}`}/>
                <div className="pitch-timeline-phase">{t.phase}</div>
                <div className="pitch-timeline-title">{t.title}</div>
                <div className="pitch-timeline-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="pitch-section" style={{paddingTop:28}}>
          <h2 className="pitch-section-title">What People Are Saying</h2>
          <p className="pitch-section-sub">Early feedback from beta users and advisors.</p>
          {[
            {initials:'RD',name:'Rabbi Daniel Feldman',role:'Educator · Teaneck, NJ',quote:"This is exactly what our community's young adults need. Most of them aren't coming to shul — but they ARE on their phones. Meet them where they are."},
            {initials:'SA',name:'Sarah A.',role:'Beta User · Miami, FL',quote:"I grew up culturally Jewish but knew almost nothing about actual practice. I've completed 8 lessons in two weeks and finally feel connected to my heritage."},
            {initials:'MB',name:'Michael B.',role:'Beta User · New York, NY',quote:"The daily structure got me from zero to actually understanding what I'm saying in services. For the first time in my life, it feels like mine."},
          ].map((t,i)=>(
            <div key={i} className="testimonial-card">
              <div className="stars">★★★★★</div>
              <div className="testimonial-quote">"{t.quote}"</div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initials}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The Ask */}
        <div className="pitch-section" style={{paddingTop:28}}>
          <h2 className="pitch-section-title">What We're Asking</h2>
          <p className="pitch-section-sub">We're not asking for money. We're asking for your partnership, your content, and your endorsement.</p>
          {[
            {icon:'🎙️', title:'Record 3–5 Audio Shiurim', body:'Short commentaries (8–15 min) tied to our existing lesson units. One recording session, permanent impact.'},
            {icon:'📣', title:'Share With Your Community', body:'Introduce Journey to Hashem to your congregation. Help us reach the Jews who aren\'t in the pews yet.'},
            {icon:'💡', title:'Shape the Curriculum', body:'Founding rabbi partners review and guide our content — ensuring halachic accuracy and pedagogical quality.'},
          ].map((c,i)=>(
            <div key={i} className="pitch-card">
              <div className="pitch-card-icon">{c.icon}</div>
              <div className="pitch-card-title">{c.title}</div>
              <div className="pitch-card-body">{c.body}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="pitch-cta-section">
          <div className="pitch-cta-title">Ready to bring Torah to the world?</div>
          <p className="pitch-cta-sub">We're onboarding a small cohort of founding rabbi partners before our public launch. Spots are limited.</p>
          <div className="pitch-cta-buttons">
            <button className="btn-primary btn-large" onClick={()=>setShowContact(true)}>Express Interest →</button>
            <button className="btn-secondary" style={{width:'100%',padding:'14px'}} onClick={onBack}>← Explore the App First</button>
          </div>
        </div>

        {/* Contact Modal */}
        {showContact&&(
          <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowContact(false);}}>
            <div className="modal-sheet">
              <div className="modal-handle"/>
              {!submitted?(<>
                <h3 className="modal-title">Express Interest</h3>
                <div className="pitch-contact-modal-body">
                  <input className="pitch-input" placeholder="Your name" value={contactForm.name} onChange={e=>setContactForm(f=>({...f,name:e.target.value}))}/>
                  <input className="pitch-input" placeholder="Synagogue / Yeshiva / Organization" value={contactForm.synagogue} onChange={e=>setContactForm(f=>({...f,synagogue:e.target.value}))}/>
                  <input className="pitch-input" placeholder="Email address" type="email" value={contactForm.email} onChange={e=>setContactForm(f=>({...f,email:e.target.value}))}/>
                  <input className="pitch-input" placeholder="Phone number (preferred for follow-up)" type="tel" value={contactForm.phone} onChange={e=>setContactForm(f=>({...f,phone:e.target.value}))}/>
                  <textarea className="modal-textarea" placeholder="Tell us about your community and what you'd bring to this partnership..." value={contactForm.message} onChange={e=>setContactForm(f=>({...f,message:e.target.value}))} rows={3}/>
                </div>
                <div className="modal-actions" style={{marginTop:14}}>
                  <button className="btn-secondary" style={{flex:1}} onClick={()=>setShowContact(false)}>Cancel</button>
                  <button className={`btn-primary${(!contactForm.name||!contactForm.email||submitting)?' btn-disabled':''}`} style={{flex:2}} onClick={handleSubmit} disabled={!contactForm.name||!contactForm.email||submitting}>{submitting?'Sending…':'Submit →'}</button>
                </div>
                {submitError&&<p style={{color:'#e05252',fontSize:12,marginTop:6,textAlign:'center'}}>{submitError}</p>}
              </>):(
                <div style={{textAlign:'center',padding:'20px 0'}}>
                  <div style={{fontSize:48,marginBottom:12}}>✅</div>
                  <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,color:'var(--gold)',marginBottom:8}}>Thank You!</div>
                  <p style={{fontSize:14,color:'var(--text-dim)',lineHeight:1.6}}>We'll be in touch within 48 hours to schedule a conversation.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── GAMIFICATION DATA ─────────────────────────────────────
const XP_LEVELS = [
  { name:'Beginner',     hebrew:'מַתְחִיל',   min:0,   max:50  },
  { name:'Student',      hebrew:'תַּלְמִיד',  min:50,  max:120 },
  { name:'Learner',      hebrew:'לוֹמֵד',    min:120, max:220 },
  { name:'Scholar',      hebrew:'חָכָם',     min:220, max:360 },
  { name:'Torah Scholar',hebrew:'תַּלְמִיד חָכָם', min:360, max:550 },
  { name:'Rabbi',        hebrew:'רַב',        min:550, max:999 },
];

function getLevel(xp){
  return XP_LEVELS.find((l,i)=>xp>=l.min&&(xp<l.max||i===XP_LEVELS.length-1))||XP_LEVELS[0];
}

const ALL_BADGES = [
  { id:'first_step',    icon:'🌱', name:'First Step',       desc:'Complete your first lesson',       check:(s)=>s.completedLessons.length>=1 },
  { id:'shabbat_soul',  icon:'🕯️', name:'Shabbat Soul',     desc:'Complete the Shabbat unit',        check:(s)=>['u5l1','u5l2','u5l3','u5l4','u5l5'].every(id=>s.completedLessons.includes(id)) },
  { id:'streak_3',      icon:'🔥', name:'On Fire',          desc:'3-day learning streak',            check:(s)=>s.currentStreak>=3 },
  { id:'streak_7',      icon:'⚡', name:'Lightning Streak', desc:'7-day learning streak',            check:(s)=>s.currentStreak>=7 },
  { id:'scholar_50',    icon:'⭐', name:'50 XP',            desc:'Earn 50 XP',                       check:(s)=>s.totalXP>=50 },
  { id:'scholar_100',   icon:'💫', name:'100 XP',           desc:'Earn 100 XP',                      check:(s)=>s.totalXP>=100 },
  { id:'half_path',     icon:'📚', name:'Halfway There',    desc:`Complete ${Math.floor(LEARNING_PATH.flatMap(u=>u.lessons).length/2)} lessons`, check:(s)=>s.completedLessons.length>=Math.floor(LEARNING_PATH.flatMap(u=>u.lessons).length/2) },
  { id:'full_path',     icon:'🏆', name:'Path Complete',    desc:`Complete all ${LEARNING_PATH.flatMap(u=>u.lessons).length} lessons`, check:(s)=>s.completedLessons.length>=LEARNING_PATH.flatMap(u=>u.lessons).length },
  { id:'bookmarker',    icon:'🔖', name:'Bookworm',         desc:'Bookmark 3 lessons',               check:(s)=>(s.bookmarks||[]).length>=3 },
  { id:'foundations',   icon:'✡️', name:'Foundation Stone', desc:'Complete Foundations of Faith',    check:(s)=>['u1l1','u1l2','u1l3','u1l4','u1l5'].every(id=>s.completedLessons.includes(id)) },
  { id:'daily_3',       icon:'📅', name:'Daily 3',          desc:'Complete 3 lessons in one day',    check:(s)=>s.dailyLessonsCompleted>=3 },
];

function getEarnedBadges(state){
  return ALL_BADGES.filter(b=>b.check(state));
}

function getNewBadges(prevState, nextState){
  const prev = new Set(getEarnedBadges(prevState).map(b=>b.id));
  return getEarnedBadges(nextState).filter(b=>!prev.has(b.id));
}

const LEADERBOARD = [
  { initials:'RY', name:'Rabbi Yosef',  xp:340, streak:21, me:false },
  { initials:'SL', name:'Sara L.',      xp:280, streak:14, me:false },
  { initials:'MG', name:'Miriam G.',    xp:190, streak:9,  me:false },
  { initials:'ME', name:'You',          xp:0,   streak:0,  me:true  },
  { initials:'AH', name:'Avi H.',       xp:130, streak:5,  me:false },
  { initials:'DK', name:'David K.',     xp:80,  streak:3,  me:false },
  { initials:'JB', name:'Jacob B.',     xp:60,  streak:2,  me:false },
];

// ── RETURNING USER SCREEN ────────────────────────────────
function ReturningUserScreen({state, onContinue}){
  const {userName,currentStreak,totalXP,completedLessons,pathName}=state;
  const level=getLevel(totalXP);
  const allLessons=LEARNING_PATH.flatMap(u=>u.lessons);
  const curIdx=allLessons.findIndex(l=>!completedLessons.includes(l.id));
  const nextLesson=curIdx>=0?allLessons[curIdx]:null;
  const greeting=(()=>{const h=new Date().getHours();if(h<12)return'Welcome back';if(h<17)return'Good afternoon';return'Good evening';})();

  return(
    <div className="screen-full returning-screen fade-in">
      <div className="returning-content">
        <div className="returning-avatar">{(userName||'J').charAt(0).toUpperCase()}</div>
        <h2 className="returning-title">{greeting}{userName?`, ${userName}`:''}!</h2>
        <p className="returning-sub">
          {currentStreak>0
            ? `You're on a ${currentStreak}-day streak 🔥 — keep it going!`
            : 'Ready to continue your journey?'
          }
        </p>
        <div className="returning-stats">
          <div className="pitch-stat" style={{textAlign:'center'}}>
            <span className="pitch-stat-value">{completedLessons.length}</span>
            <span className="pitch-stat-label">Lessons</span>
          </div>
          <div style={{width:1,background:'rgba(255,255,255,0.08)',margin:'0 4px'}}/>
          <div className="pitch-stat" style={{textAlign:'center'}}>
            <span className="pitch-stat-value">{totalXP}</span>
            <span className="pitch-stat-label">XP</span>
          </div>
          <div style={{width:1,background:'rgba(255,255,255,0.08)',margin:'0 4px'}}/>
          <div className="pitch-stat" style={{textAlign:'center'}}>
            <span className="pitch-stat-value" style={{fontSize:16,paddingTop:4}}>{level.name}</span>
            <span className="pitch-stat-label">Level</span>
          </div>
        </div>
        {nextLesson&&(
          <div style={{width:'100%',background:'rgba(201,168,76,0.07)',border:'1px solid rgba(201,168,76,0.18)',borderRadius:'var(--radius-lg)',padding:'14px 18px',textAlign:'center'}}>
            <div style={{fontSize:11,color:'var(--gold)',textTransform:'uppercase',letterSpacing:'0.8px',fontWeight:700,marginBottom:4}}>Next Up</div>
            <div style={{fontSize:16,color:'var(--text-body)',fontFamily:'Cormorant Garamond,serif',fontWeight:600}}>{nextLesson.title}</div>
          </div>
        )}
        <button className="btn-primary btn-large" onClick={onContinue}>Continue Learning →</button>
        <p style={{fontSize:12,color:'var(--text-dim)',textAlign:'center'}}>{getHebrewDate()}</p>
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────
const DEFAULT_STATE = DEFAULT_V4_STATE;

function App(){
  const showDemoBanner = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('demo') === 'true'
    : false;
  // Landing/onboarding is opt-in via ?view=landing for pre-launch marketing.
  // New users by default open directly in the app (see DEFAULT_V4_STATE).
  // Read URL after mount to avoid an SSR/client hydration mismatch — this adds a
  // tiny flash for the landing URL, but keeps the default app path hydration-clean.
  const [showLanding, setShowLanding] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (new URLSearchParams(window.location.search).get('view') === 'landing') {
      setShowLanding(true);
    }
  }, []);

  // Initialize with defaults (no localStorage read) so SSR and first client render
  // agree. Real state loads in the hydration useEffect below.
  const [state,setState]=useState(()=>migrate(null));
  const [hydrated,setHydrated]=useState(false);
  const [previewMode,setPreviewMode]=useState(false);
  const [currentView,setCurrentView]=useState(null);
  const [showSearch,setShowSearch]=useState(false);
  const openRabbiPage=()=>window.open('/for-rabbis','_blank');
  const capture=(event,props={})=>{try{if(typeof window!=='undefined'&&window.posthog)window.posthog.capture(event,props);}catch{}};
  const openLesson=(l,u)=>{capture('lesson_started',{lesson_id:l.id,lesson_title:l.title,unit:u?.title});setCurrentView({type:'lesson',lesson:l,unit:u});};
  const [badgeToast,setBadgeToast]=useState(null);
  const [showReturning,setShowReturning]=useState(false);

  // One-time hydration from localStorage — runs after mount so server HTML and
  // first client render match. Any flash of default state is harmless since the
  // default is Home (same destination most users are heading to).
  useEffect(()=>{
    try{
      const raw = localStorage.getItem('jth-v4');
      if (raw) {
        setState(migrate(JSON.parse(raw)));
      } else {
        const oldRaw = localStorage.getItem('jth-v3');
        if (oldRaw) {
          const migrated = migrate(JSON.parse(oldRaw));
          localStorage.setItem('jth-v4', JSON.stringify(migrated));
          setState(migrated);
        }
      }
      const raw2 = localStorage.getItem('jth-v4') || localStorage.getItem('jth-v3');
      const saved = raw2 ? JSON.parse(raw2) : null;
      if (saved?.onboardingComplete && saved?.completedLessons?.length>0) {
        setShowReturning(true);
      }
    }catch{}
    setHydrated(true);
  }, []);

  useEffect(()=>{
    if (!hydrated) return;
    try { localStorage.setItem('jth-v4', JSON.stringify(state)); } catch {}
  }, [state, hydrated]);

  // Hearts regen + streak freeze tick
  useEffect(() => {
    const tick = () => {
      setState(prev => {
        const todayKey = getTodayKey();
        let next = { ...prev, ...regenerateHearts(prev) };
        next = maybeRefreshWeeklyFreeze(next, todayKey);
        if (shouldAutoFreeze(next, todayKey)) {
          next = applyStreakFreeze(next, todayKey);
        }
        return next;
      });
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const update=u=>setState(prev=>({...prev,...u}));

  const updateWithBadgeCheck=(updates)=>{
    setState(prev=>{
      const next={...prev,...updates};
      const newBadges=getNewBadges(prev,next);
      if(newBadges.length>0){
        next.earnedBadges=[...new Set([...(prev.earnedBadges||[]),...newBadges.map(b=>b.id)])];
        setTimeout(()=>{
          setBadgeToast(newBadges[0]);
          setTimeout(()=>setBadgeToast(null),3000);
        },800);
      }
      return next;
    });
  };

  const handleReset=()=>{
    if(window.confirm('Reset all progress and start over?')){
      localStorage.removeItem('jth-v3');
      localStorage.removeItem('jth-v4');
      setState(DEFAULT_STATE);
      setCurrentView(null);
      setBadgeToast(null);
      setShowReturning(false);
      setPreviewMode(false);
    }
  };

  // Preview mode — session-only, never persisted to localStorage
  const handleTryDemo=()=>{
    setPreviewMode(true);
    setShowLanding(false);
    update({onboardingComplete:true,activeTab:'home',pathName:"The Seeker's Path"});
  };
  const handleBackToLanding=()=>{
    setPreviewMode(false);
    setCurrentView(null);
    setShowReturning(false);
    setShowLanding(true);
    update({onboardingStep:'welcome'});
  };

  const handleLessonComplete = (lesson, { wrongAnswers, ranOutOfHearts }) => {
    const alreadyCompleted = state.completedLessons.includes(lesson.id);
    const todayKey = getTodayKey();

    if (alreadyCompleted) {
      setCurrentView({
        type: 'congrats', lesson, xpEarned: 0, streak: state.currentStreak,
        newBadges: [], replay: true, heartsLeft: state.hearts,
        wrongAnswers, ranOutOfHearts,
      });
      return;
    }

    let newStreak = state.currentStreak;
    if (!state.lastActiveDate) newStreak = 1;
    else if (state.lastActiveDate === todayKey) newStreak = state.currentStreak;
    else {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yKey = getTodayKey(y);
      newStreak = state.lastActiveDate === yKey ? state.currentStreak + 1 : 1;
    }
    const isFirstOfDay = state.lastActiveDate !== todayKey;
    const xpEarned = computeLessonXP({
      wrongAnswers, isFirstOfDay, streak: newStreak, ranOutOfHearts,
    });

    const heartsAfter = Math.max(0, state.hearts - wrongAnswers);

    const newCompleted = [...new Set([...state.completedLessons, lesson.id])];
    const newDaily = state.lastActiveDate === todayKey ? state.dailyLessonsCompleted + 1 : 1;
    const newPerfect = (wrongAnswers === 0 && !ranOutOfHearts) ? state.perfectLessons + 1 : state.perfectLessons;

    const updates = {
      completedLessons: newCompleted,
      totalXP: state.totalXP + xpEarned,
      currentStreak: newStreak,
      dailyLessonsCompleted: newDaily,
      lastActiveDate: todayKey,
      hearts: heartsAfter,
      perfectLessons: newPerfect,
    };
    capture('lesson_completed',{lesson_id:lesson.id,lesson_title:lesson.title,xp:xpEarned,perfect:wrongAnswers===0&&!ranOutOfHearts,streak:newStreak});
    updateWithBadgeCheck(updates);
    const nextState = { ...state, ...updates };
    const newBadges = getNewBadges(state, nextState);
    setCurrentView({
      type: 'congrats', lesson, xpEarned, streak: newStreak, newBadges,
      replay: false, heartsLeft: heartsAfter, wrongAnswers, ranOutOfHearts,
    });
  };

  const handleToggleBookmark=lessonId=>{
    const bookmarks=state.bookmarks||[];
    const newBookmarks=bookmarks.includes(lessonId)?bookmarks.filter(id=>id!==lessonId):[...bookmarks,lessonId];
    updateWithBadgeCheck({bookmarks:newBookmarks});
  };

  const handleUpdateName=name=>update({userName:name});

  // Returning user screen
  if(showReturning&&state.onboardingComplete) return(
    <div className="app-container">
      {showDemoBanner&&<div className="demo-banner">
        <span className="demo-label"><Icon name="phone"/> DEMO MODE</span>
        <button className="demo-reset" onClick={handleReset}>Reset</button>
      </div>}
      <ReturningUserScreen state={state} onContinue={()=>setShowReturning(false)}/>
    </div>
  );


  // Overlay views
  if(showSearch) return(
    <div className="app-container">
      <SearchOverlay
        onClose={()=>setShowSearch(false)}
        onOpenLesson={(l,u)=>{setShowSearch(false);openLesson(l,u);}}
      />
    </div>
  );

  if(currentView){
    if(currentView.type==='lesson') return(
      <div className="app-container">
        <LessonPlayer
          lesson={currentView.lesson}
          unit={currentView.unit}
          hearts={state.hearts}
          onClose={() => setCurrentView(null)}
          onComplete={(result) => handleLessonComplete(currentView.lesson, result)}
          isBookmarked={(state.bookmarks || []).includes(currentView.lesson.id)}
          onToggleBookmark={() => handleToggleBookmark(currentView.lesson.id)}
        />
      </div>
    );
    if(currentView.type==='congrats') return(
      <div className="app-container">
        <CongratsScreen
          lesson={currentView.lesson}
          xpEarned={currentView.xpEarned}
          streak={currentView.streak}
          newBadges={currentView.newBadges || []}
          totalXP={state.totalXP}
          replay={currentView.replay || false}
          heartsLeft={currentView.heartsLeft}
          wrongAnswers={currentView.wrongAnswers}
          ranOutOfHearts={currentView.ranOutOfHearts}
          onContinue={() => setCurrentView(null)}
        />
      </div>
    );
  }

  if(showLanding || !state.onboardingComplete){
    // If opened via ?view=landing and there's no step set yet, start at 'welcome'.
    const step = state.onboardingStep || 'welcome';
    const exitLanding = (patch) => { setShowLanding(false); update(patch); };
    return(
      <div className="app-container">
        {showDemoBanner&&<div className="demo-banner">
          <span className="demo-label"><Icon name="phone"/> DEMO MODE</span>
          <button className="demo-reset" onClick={handleReset}>Reset</button>
        </div>}
        {step==='welcome'&&<Welcome onBegin={()=>update({onboardingStep:'quiz'})} onSkip={()=>exitLanding({onboardingComplete:true,activeTab:'home',pathName:"The Seeker's Path"})} onTryDemo={handleTryDemo}/>}
        {step==='quiz'&&<Quiz onComplete={ans=>{const path=getPathFromAnswers(ans);update({quizAnswers:ans,selectedPath:path,pathName:path.name,onboardingStep:'path-ready'});}}/>}
        {step==='path-ready'&&<PathReady path={state.selectedPath} answers={state.quizAnswers||[]} onStart={()=>exitLanding({onboardingComplete:true,activeTab:'home'})}/>}
      </div>
    );
  }

  return(
    <div className="app-container">
      {showDemoBanner&&<div className="demo-banner">
        <span className="demo-label"><Icon name="phone"/> DEMO MODE</span>
        <button className="demo-reset" onClick={handleReset}>Reset Demo</button>
      </div>}
      {previewMode&&(
        <button
          onClick={handleBackToLanding}
          style={{position:'absolute',top:10,left:10,zIndex:200,background:'rgba(13,27,42,0.85)',border:'1px solid rgba(201,168,76,0.25)',borderRadius:100,padding:'5px 12px',color:'rgba(201,168,76,0.7)',fontSize:11,cursor:'pointer',letterSpacing:'0.3px',backdropFilter:'blur(8px)',WebkitBackdropFilter:'blur(8px)'}}
        >← Landing</button>
      )}
      {badgeToast&&(
        <div className="badge-toast">
          <span className="badge-toast-icon">{badgeToast.icon}</span>
          <div>
            <div className="badge-toast-label"><Icon name="medal"/> Badge Unlocked!</div>
            <div className="badge-toast-name">{badgeToast.name}</div>
          </div>
        </div>
      )}
      <div className="tab-content">
        <div key={state.activeTab} className="tab-view">
          {state.activeTab==='home'&&<HomeTab state={state} onOpenLesson={openLesson} onGoTab={t=>update({activeTab:t})} onSearch={()=>setShowSearch(true)} onOpenPitch={openRabbiPage}/>}
          {state.activeTab==='learn'&&<LearnTab state={state} onOpenLesson={openLesson}/>}
          {state.activeTab==='community'&&<CommunityTab state={state}/>}
          {state.activeTab==='profile'&&<ProfileTab state={state} onReset={handleReset} onOpenPitch={openRabbiPage} onUpdateName={handleUpdateName}/>}
        </div>
      </div>
      <BottomNav activeTab={state.activeTab} onChange={tab=>update({activeTab:tab})}/>
    </div>
  );
}

export default App;
