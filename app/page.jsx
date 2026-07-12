"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowDownRight, Box, ChevronRight, CircleGauge, Cpu, Crosshair, Eye, Gauge, ScanLine, Sparkles, Target, Waves } from "lucide-react";

const ModelViewer = dynamic(() => import("./model-viewer"), { ssr: false, loading: () => <div className="scene-loading">INITIALISING 3D STATION…</div> });

const solutions = [
  { id:"lvdt", label:"01 / BASELINE", name:"Contact LVDT", short:"CONTACT", type:"Current station", source:"/models/contact_lvdt_station.glb", accent:"#ff6f62", icon:Activity, description:"A low-force probe rides the crest. Vibration, fin deflection and mechanical contact become noise in the measurement.", proof:"Mechanical bounce creates false process variation.", precision:"± 0.18 mm", repeat:"62%", trace:"Peak only", status:"NOISE EXPOSED", metric:"0.142 mm σ", tags:["Contact probe","Single-point sample","1 kHz signal"] },
  { id:"laser", label:"02 / UPGRADE", name:"Laser triangulation", short:"LASER", type:"Optical height gauge", source:"/models/laser_triangulation_station.glb", accent:"#65e6db", icon:ScanLine, description:"A fixed optical head measures crest distance without touching the fin. The scan plane stays stable while the conveyor advances.", proof:"Non-contact geometry turns bounce into a clean signal.", precision:"± 0.03 mm", repeat:"96%", trace:"Height + position", status:"STABLE TRACK", metric:"0.021 mm σ", tags:["Non-contact","Continuous scan","Industrial laser"] },
  { id:"vision", label:"03 / SCALE", name:"Stereo vision + encoder", short:"VISION", type:"Full-profile reconstruction", source:"/models/stereo_vision_encoder_station.glb", accent:"#9eabff", icon:Eye, description:"Two synchronized cameras reconstruct the fin profile. Conveyor encoder pulses attach every measurement to its exact physical position.", proof:"A complete, traceable profile is ready for SPC and root-cause review.", precision:"± 0.05 mm", repeat:"94%", trace:"Full 3D profile", status:"PROFILE LOCKED", metric:"0.034 mm σ", tags:["Stereo cameras","Encoder sync","Profile trace"] }
];

function Wave({ solution, playing }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => { if (!playing) return; const i=setInterval(()=>setPhase(p=>(p+1)%1000),70); return()=>clearInterval(i);},[playing]);
  const path=useMemo(()=>Array.from({length:130},(_,i)=>{const x=(i/129)*660; const smooth=52+Math.sin(i*.24+phase*.05)*21; const bounce=solution.id==="lvdt" ? Math.sin(i*1.45+phase*.34)*16+Math.cos(i*.61)*6 : Math.sin(i*1.8+phase*.22)*1.5; return `${i?"L":"M"}${x.toFixed(1)} ${(smooth+bounce).toFixed(1)}`;}).join(" "),[phase,solution.id]);
  const reference=useMemo(()=>Array.from({length:130},(_,i)=>{const x=(i/129)*660; return `${i?"L":"M"}${x.toFixed(1)} ${(52+Math.sin(i*.24+phase*.05)*21).toFixed(1)}`;}).join(" "),[phase]);
  return <div className="wave"><div className="wave-head"><span><Activity size={14}/> LIVE SENSOR SIGNAL</span><strong style={{color:solution.accent}}>{solution.status}</strong></div><svg viewBox="0 0 660 104" preserveAspectRatio="none"><path d="M0 18H660M0 52H660M0 86H660" className="wave-grid"/><path d={path} className="wave-raw" style={{stroke:solution.accent}}/><path d={reference} className="wave-filter"/></svg><div className="wave-foot"><span><i style={{background:solution.accent}}/>Raw input</span><span><i className="teal"/>Filtered geometry</span><b>{solution.metric}</b></div></div>;
}

export default function Home(){
  const [selected,setSelected]=useState("lvdt"); const [playing,setPlaying]=useState(true); const solution=solutions.find(x=>x.id===selected); const Icon=solution.icon;
  return <main style={{"--accent":solution.accent}}>
    <nav><a className="brand"><span>F</span> FIN<span className="slash">//</span>SIGHT</a><div className="nav-middle"><b>FIN-HEIGHT INSPECTION</b><span>DIGITAL TWIN / CONCEPT DEMO</span></div><div className="online"><i/> LIVE SIMULATION</div></nav>
    <section className="hero">
      <div className="hero-copy"><p className="kicker"><Sparkles size={13}/> QUALITY INSPECTION, MADE VISIBLE</p><h1>Measure the fin.<br/><em>Trust the decision.</em></h1><p className="intro">A live digital twin built around your industrial inspection station—designed to make the contact-measurement risk and non-contact opportunity impossible to ignore.</p><div className="hero-actions"><button onClick={()=>document.getElementById("twin").scrollIntoView({behavior:"smooth"})}>Explore the station <ArrowDownRight size={17}/></button><span>DRAG THE MODEL TO INSPECT</span></div></div>
      <div className="hero-index"><span>01</span><p>ONE PART<br/>THREE WAYS<br/>TO MEASURE</p><div/></div>
    </section>
    <section id="twin" className="twin">
      <div className="twin-top"><div><p className="kicker">INTERACTIVE 3D DIGITAL TWIN</p><h2>The station tells the story.</h2></div><div className="model-note"><Box size={17}/><span>Built from your Blender industrial station<br/><b>Drag to rotate · scroll to zoom</b></span></div></div>
      <div className="solution-tabs">{solutions.map(item=>{const ItemIcon=item.icon;return <button key={item.id} onClick={()=>setSelected(item.id)} className={item.id===selected?"active":""}><span>{item.label}</span><b><ItemIcon size={15}/>{item.name}</b><small>{item.type}</small></button>})}</div>
      <div className="stage"><div className="scanlines"/><div className="stage-label"><p>{solution.label}</p><h3>{solution.name}</h3><span><Icon size={14}/>{solution.type}</span></div><div className="model"><ModelViewer source={solution.source} accent={solution.accent}/></div><div className="stage-data"><div><span>ACCURACY</span><b>{solution.precision}</b></div><div><span>REPEATABILITY</span><b>{solution.repeat}</b></div><div><span>DATA CAPTURE</span><b>{solution.trace}</b></div></div><button className={playing?"play on":"play"} onClick={()=>setPlaying(!playing)}>{playing?"||":"▶"} <span>{playing?"LIVE RUN":"PAUSED"}</span></button></div>
      <div className="under-stage"><div><p className="small-label">WHAT CHANGES</p><h3>{solution.proof}</h3></div><div className="tag-list">{solution.tags.map(tag=><span key={tag}>{tag}</span>)}</div></div>
    </section>
    <section className="evidence"><div className="evidence-intro"><p className="kicker">SEE THE SIGNAL, NOT THE SALES PITCH</p><h2>Same radiator.<br/>Different confidence.</h2><p>Every solution feeds the same acquisition, DSP and SPC logic from your HMI concept. Only the quality of the measurement changes.</p></div><Wave solution={solution} playing={playing}/></section>
    <section className="decision"><div className="decision-title"><p className="kicker">THE DEMONSTRATION FLOW</p><h2>Turn a technical review<br/>into an investment decision.</h2></div><div className="decision-steps"><article><b>01</b><Crosshair/><h3>Expose the problem</h3><p>Start with contact LVDT. The raw trace makes mechanical bounce visible.</p></article><article><b>02</b><ScanLine/><h3>Change one variable</h3><p>Switch to laser. The same geometry becomes stable without touching the fin.</p></article><article><b>03</b><CircleGauge/><h3>Scale the outcome</h3><p>Show stereo vision plus encoder: a full profile ready for traceability and SPC.</p></article></div></section>
    <section className="pipeline"><div><p className="kicker">YOUR EXISTING HMI LOGIC</p><h2>Not a replacement.<br/>A better source of truth.</h2></div><div className="pipeline-flow"><span><Cpu/> 1 kHz acquisition</span><i><ChevronRight/></i><span><Waves/> DSP / peak geometry</span><i><ChevronRight/></i><span><Gauge/> SPC + anomaly</span><i><ChevronRight/></i><span><Target/> PLC decision</span></div></section>
    <footer><div className="brand"><span>F</span> FIN<span className="slash">//</span>SIGHT</div><p>RADIATOR FIN HEIGHT · DIGITAL TWIN CONCEPT · 2026</p></footer>
  </main>
}
