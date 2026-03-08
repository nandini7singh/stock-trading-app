import { useState } from "react";
import Sidebar from "../components/Sidebar";

import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
ResponsiveContainer
} from "recharts";

function MarketWatch(){

const [activeNav,setActiveNav] = useState("Market Watch")

const stocks = [
{_id:1,name:"Apple",symbol:"AAPL",price:189,change:1.5},
{_id:2,name:"Tesla",symbol:"TSLA",price:175,change:-2.1},
{_id:3,name:"Nvidia",symbol:"NVDA",price:822,change:4.3},
{_id:4,name:"Amazon",symbol:"AMZN",price:186,change:-0.8}
]

const [selectedStock,setSelectedStock] = useState(stocks[0])

const chartData = [
{time:"9:00",price:selectedStock.price-20},
{time:"10:00",price:selectedStock.price-10},
{time:"11:00",price:selectedStock.price+5},
{time:"12:00",price:selectedStock.price-2},
{time:"1:00",price:selectedStock.price+10},
{time:"2:00",price:selectedStock.price+4},
{time:"3:00",price:selectedStock.price}
]

return(

<div style={{display:"flex",minHeight:"100vh",background:"#0d0d14",color:"#e8e8f0"}}>

<Sidebar activeNav={activeNav} onNavChange={setActiveNav}/>

<div style={{padding:"30px",width:"100%"}}>

<h2 style={{fontSize:"26px",marginBottom:"20px"}}>
Market Watch
</h2>

<div style={{display:"grid",gridTemplateColumns:"350px 1fr",gap:"20px"}}>

{/* WATCHLIST */}
<div style={{
background:"#181826",
borderRadius:"14px",
border:"1px solid #252538",
padding:"20px"
}}>

{stocks.map(stock=>(

<div
key={stock._id}

onClick={()=>setSelectedStock(stock)}

style={{
display:"grid",
gridTemplateColumns:"1fr 80px",
alignItems:"center",
padding:"12px",
cursor:"pointer",
borderBottom:"1px solid #252538",
background:selectedStock._id === stock._id ? "#13131f" : "transparent"
}}

>

<div>
<b>{stock.name}</b>
<p style={{fontSize:"12px",color:"#6b6b8a"}}>
{stock.symbol}
</p>
</div>

<div style={{color:stock.change>0?"#00e676":"#ff4560"}}>
${stock.price}
</div>

</div>

))}

</div>

{/* STOCK CHART */}

<div style={{
background:"#181826",
borderRadius:"14px",
border:"1px solid #252538",
padding:"20px"
}}>

<h3 style={{marginBottom:"10px"}}>
{selectedStock.name} Chart
</h3>

<ResponsiveContainer width="100%" height={400}>

<LineChart data={chartData}>

<CartesianGrid strokeDasharray="3 3" />

<XAxis dataKey="time"/>

<YAxis/>

<Tooltip/>

<Line
type="monotone"
dataKey="price"
stroke="#7c5cfc"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>

</div>

</div>

</div>

)

}

export default MarketWatch;