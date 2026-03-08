import Sidebar from "../components/Sidebar";
import { useState } from "react";

const C = {
  bg:"#0d0d14",
  card:"#181826",
  border:"#252538",
  text:"#e8e8f0"
};

function Pricing(){

const [activeNav,setActiveNav] = useState("");

return(

<div style={{display:"flex",minHeight:"100vh",background:C.bg,color:C.text}}>

<Sidebar activeNav={activeNav} onNavChange={setActiveNav}/>

<div style={{flex:1,padding:"40px"}}>

<h2 style={{fontSize:"26px",marginBottom:"20px"}}>
Pricing Plans
</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:"20px"
}}>

{/* Free */}

<div style={{
background:C.card,
border:`1px solid ${C.border}`,
padding:"20px",
borderRadius:"12px"
}}>
<h3>Free</h3>
<h1>₹0</h1>
<p>Paper Trading</p>
<p>Market Data</p>
</div>

{/* Pro */}

<div style={{
background:C.card,
border:`1px solid ${C.border}`,
padding:"20px",
borderRadius:"12px"
}}>
<h3>Pro</h3>
<h1>₹499/mo</h1>
<p>Advanced Analytics</p>
<p>Portfolio Insights</p>
</div>

{/* Enterprise */}

<div style={{
background:C.card,
border:`1px solid ${C.border}`,
padding:"20px",
borderRadius:"12px"
}}>
<h3>Enterprise</h3>
<h1>Custom</h1>
<p>API Access</p>
<p>Institutional Tools</p>
</div>

</div>

</div>

</div>

);

}

export default Pricing;