import Sidebar from "../components/Sidebar";
import { useState } from "react";

const C = {
  bg: "#0d0d14",
  card: "#181826",
  border: "#252538",
  text: "#e8e8f0",
  green: "#00e676",
  red: "#ff5252"
};

const stocks = [
  { name: "Reliance", symbol: "RELIANCE", price: 2820, change: "+1.5%" },
  { name: "TCS", symbol: "TCS", price: 3500, change: "+0.8%" },
  { name: "Infosys", symbol: "INFY", price: 1500, change: "-0.5%" },
  { name: "HDFC Bank", symbol: "HDFCBANK", price: 1650, change: "+2.1%" },
];

function Markets() {

const [activeNav,setActiveNav] = useState("");

return (

<div style={{display:"flex",minHeight:"100vh",background:C.bg,color:C.text}}>

<Sidebar activeNav={activeNav} onNavChange={setActiveNav}/>

<div style={{flex:1,padding:"40px"}}>

<h2 style={{fontSize:"26px",marginBottom:"20px"}}>
Market Overview
</h2>

<table
style={{
width:"100%",
background:C.card,
border:`1px solid ${C.border}`,
borderRadius:"10px"
}}
>

<thead>
<tr style={{color:"#888"}}>
<th style={{padding:"12px"}}>Stock</th>
<th>Symbol</th>
<th>Price</th>
<th>Change</th>
</tr>
</thead>

<tbody>

{stocks.map(stock => (

<tr key={stock.symbol} style={{borderTop:`1px solid ${C.border}`}}>

<td style={{padding:"12px"}}>{stock.name}</td>

<td>{stock.symbol}</td>

<td>₹{stock.price}</td>

<td style={{color:stock.change.includes("+") ? C.green : C.red}}>
{stock.change}
</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

);

}

export default Markets;