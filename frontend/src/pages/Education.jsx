import Sidebar from "../components/Sidebar";
import { useState } from "react";

const C = {
bg:"#0d0d14",
card:"#181826",
border:"#252538",
text:"#e8e8f0"
};

const lessons = [
{
title:"Stock Market Basics",
desc:"Learn how the stock market works."
},
{
title:"Technical Analysis",
desc:"Understand charts, patterns and indicators."
},
{
title:"Risk Management",
desc:"Protect your capital with smart strategies."
},
{
title:"Long-Term Investing",
desc:"Build wealth with long-term investments."
}
];

function Education(){

const [activeNav,setActiveNav] = useState("");

return(

<div style={{display:"flex",minHeight:"100vh",background:C.bg,color:C.text}}>

<Sidebar activeNav={activeNav} onNavChange={setActiveNav}/>

<div style={{flex:1,padding:"40px"}}>

<h2 style={{fontSize:"26px",marginBottom:"20px"}}>
Trading Education
</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(2,1fr)",
gap:"20px"
}}>

{lessons.map((l,i)=>(

<div
key={i}
style={{
background:C.card,
border:`1px solid ${C.border}`,
padding:"20px",
borderRadius:"12px"
}}
>

<h3>{l.title}</h3>
<p style={{color:"#aaa"}}>{l.desc}</p>

</div>

))}

</div>

</div>

</div>

);

}

export default Education;