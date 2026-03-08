import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Search, Bell } from "lucide-react";

const C = {
  bg: "#0d0d14",
  surface: "#13131f",
  card: "#181826",
  border: "#252538",
  text: "#e8e8f0",
  muted: "#6b6b8a",
  green: "#00e676",
};

function Portfolio() {

  const [portfolio, setPortfolio] = useState([]);
  const [totalValue,setTotalValue] = useState(0);
  const [activeNav,setActiveNav] = useState("Portfolio");

  useEffect(() => {

    axios.get("/orders")
    .then(res => {

      const orders = res.data;
      const portfolioMap = {};

      orders.forEach(order => {

        const symbol = order.stock.symbol;

        if(!portfolioMap[symbol]){

          portfolioMap[symbol] = {
            name:order.stock.name,
            symbol:order.stock.symbol,
            shares:0,
            price:order.stock.price
          };

        }

        if(order.type === "buy"){
          portfolioMap[symbol].shares += order.quantity;
        }

        if(order.type === "sell"){
          portfolioMap[symbol].shares -= order.quantity;
        }

      });

      const portfolioArray =
        Object.values(portfolioMap).filter(s => s.shares > 0);

      setPortfolio(portfolioArray);

      // calculate total value
      let total = 0;

      portfolioArray.forEach(stock=>{
        total += stock.shares * stock.price;
      });

      setTotalValue(total);

    })

    .catch(err => console.log(err));

  }, []);


return (

<div style={{display:"flex",minHeight:"100vh",background:C.bg,color:C.text}}>

{/* Sidebar */}
<Sidebar activeNav={activeNav} onNavChange={setActiveNav}/>

{/* Right side */}
<div style={{flex:1,display:"flex",flexDirection:"column"}}>

{/* Topbar */}
<header
style={{
background:C.surface,
borderBottom:`1px solid ${C.border}`,
padding:"0 28px",
height:60,
display:"flex",
alignItems:"center",
gap:16
}}
>

<Search size={14} />

<input
placeholder="Search stocks..."
style={{
background:C.card,
border:`1px solid ${C.border}`,
padding:"6px 10px",
borderRadius:8,
color:C.text
}}
/>

<div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
<span style={{color:C.green,fontSize:12}}>Market Open</span>
<Bell size={18}/>
</div>

</header>

{/* Page Content */}
<div style={{padding:"30px"}}>

<h2 style={{fontSize:"24px",marginBottom:"20px"}}>
My Portfolio
</h2>

{/* Portfolio Stats */}

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr 1fr",
gap:"20px",
marginBottom:"30px"
}}>

{/* TOTAL VALUE */}
<div style={{
background:C.card,
border:`1px solid ${C.border}`,
borderRadius:"14px",
padding:"20px"
}}>

<p style={{color:C.muted,fontSize:"13px"}}>
Total Portfolio Value
</p>

<h2 style={{fontSize:"28px",marginTop:"10px"}}>
${totalValue.toFixed(2)}
</h2>

</div>


{/* TODAY PROFIT (demo) */}

<div style={{
background:C.card,
border:`1px solid ${C.border}`,
borderRadius:"14px",
padding:"20px"
}}>

<p style={{color:C.muted,fontSize:"13px"}}>
Today's P/L
</p>

<h2 style={{fontSize:"28px",marginTop:"10px",color:C.green}}>
+$0.00
</h2>

</div>


{/* BUYING POWER */}

<div style={{
background:C.card,
border:`1px solid ${C.border}`,
borderRadius:"14px",
padding:"20px"
}}>

<p style={{color:C.muted,fontSize:"13px"}}>
Buying Power
</p>

<h2 style={{fontSize:"28px",marginTop:"10px"}}>
$100000
</h2>

</div>

</div>


{/* Portfolio Table */}

<table
style={{
width:"100%",
background:C.card,
border:`1px solid ${C.border}`,
borderRadius:"12px"
}}
>

<thead style={{background:C.surface,color:C.muted}}>
<tr>
<th style={{padding:"12px"}}>Stock</th>
<th>Symbol</th>
<th>Shares</th>
<th>Price</th>
<th>Total</th>
<th></th>
</tr>
</thead>

<tbody>

{portfolio.map(stock => (

<tr
key={stock.symbol}
style={{
borderTop:`1px solid ${C.border}`
}}
>

<td style={{padding:"12px"}}>
{stock.name}
</td>

<td>
{stock.symbol}
</td>

<td>
{stock.shares}
</td>

<td>
${stock.price}
</td>

<td style={{color:C.green,fontWeight:"600"}}>
${(stock.shares * stock.price).toFixed(2)}
</td>

<td>

<Link to="/marketwatch">

<button
style={{
background:"#7c5cfc",
border:"none",
padding:"6px 12px",
borderRadius:"8px",
color:"#fff",
cursor:"pointer"
}}
>
View Chart
</button>

</Link>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</div>

);
}

export default Portfolio;