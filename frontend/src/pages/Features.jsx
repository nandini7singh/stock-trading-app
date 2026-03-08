import Sidebar from "../components/Sidebar";
import { useState } from "react";

const C = {
  bg:"#0d0d14",
  card:"#181826",
  border:"#252538",
  text:"#e8e8f0"
};

const features = [
  {
    title:"Real-Time Market Data",
    desc:"Track live stock prices and market trends instantly."
  },
  {
    title:"Portfolio Management",
    desc:"Monitor your investments and profit/loss in one place."
  },
  {
    title:"Paper Trading",
    desc:"Practice trading without risking real money."
  },
  {
    title:"Stock Analytics",
    desc:"Analyze stocks using charts and performance metrics."
  }
];

function Features(){

const [activeNav,setActiveNav] = useState("");

return(

<div style={{display:"flex",minHeight:"100vh",background:C.bg,color:C.text}}>

<Sidebar activeNav={activeNav} onNavChange={setActiveNav}/>

<div style={{flex:1,padding:"40px"}}>

<h2 style={{fontSize:"26px",marginBottom:"20px"}}>
Platform Features
</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(2,1fr)",
gap:"20px"
}}>

{features.map((f,i)=>(

<div
key={i}
style={{
background:C.card,
border:`1px solid ${C.border}`,
borderRadius:"12px",
padding:"20px"
}}
>

<h3>{f.title}</h3>
<p style={{color:"#aaa"}}>{f.desc}</p>

</div>

))}

</div>

</div>

</div>

);

}

export default Features;