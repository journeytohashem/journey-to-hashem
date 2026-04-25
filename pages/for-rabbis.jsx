import { useState } from 'react';
import Head from 'next/head';
import { LEARNING_PATH } from '../data/lessons/index.js';

export default function ForRabbis() {
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

  const TIMELINE=[
    {phase:'Phase 1 — Now',   future:false, title:'Prototype & Rabbi Partnerships',  desc:'Onboarding founding rabbis, building content pipeline, finalizing curriculum structure'},
    {phase:'Phase 2 — ~3 mo', future:true,  title:'Soft Launch — 500 Users',         desc:'iOS & Android apps, core learning path, audio library with 20+ shiurim, community Q&A'},
    {phase:'Phase 3 — ~6 mo', future:true,  title:'Community & Monetization',        desc:'Synagogue plans, leaderboards, push notifications, Stripe integration, rabbi revenue share'},
    {phase:'Phase 4 — ~12 mo',future:true,  title:'Scale — 50,000 Users',            desc:'Hebrew content track, Sephardic curriculum, Spanish localization, partnerships with major organizations'},
    {phase:'Phase 5 — ~24 mo',future:true,  title:'Global Platform',                 desc:'The home for Jewish learning online — 500k+ users across 40+ countries'},
  ];

  return(
    <>
      <Head>
        <title>For Rabbis & Jewish Educators — Journey to Hashem</title>
        <meta name="description" content="Partner with Journey to Hashem. Bring your teachings to Jews worldwide. Join as a founding rabbi partner and help shape the platform from day one."/>
        <meta property="og:title" content="For Rabbis & Jewish Educators — Journey to Hashem"/>
        <meta property="og:description" content="Bring your teachings to every Jew, everywhere. Join as a founding rabbi partner."/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
      </Head>
      <div className="screen-full fade-in">
        <div className="pitch-screen">
          {/* Hero */}
          <div className="pitch-hero">
            <button className="pitch-back" onClick={()=>window.location.href='/'}>← Back to App</button>
            <div className="pitch-hero-tag"><span className="pitch-hero-tag-dot"/>For Rabbis &amp; Jewish Educators</div>
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
              <button className="btn-secondary" style={{width:'100%',padding:'14px'}} onClick={()=>window.location.href='/'}>← Explore the App First</button>
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
    </>
  );
}
