import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";
import Sidebar from "../components/Sidebar";
import { Search, Bell } from "lucide-react";

const C = {
  bg: "#0d0d14",
  surface: "#13131f",
  border: "#252538",
  text: "#e8e8f0"
};

function History() {

  const [orders, setOrders] = useState([]);
  const [activeNav, setActiveNav] = useState("History");

  useEffect(() => {
    axios.get("/orders")
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  }, []);

  return (

<div style={{display:"flex", minHeight:"100vh", background:C.bg, color:C.text}}>

{/* Sidebar */}
<Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

{/* Page content */}
<div style={{flex:1}}>

<div className="p-10">

<h2 className="text-2xl font-bold mb-6">
Trade History
</h2>

{orders.length === 0 ? (

<div className="bg-[#181826] p-6 rounded-xl border border-[#252538]">
No trades yet
</div>

) : (

orders.map(order => (

<div
key={order._id}
className="bg-[#181826] border border-[#252538] rounded-xl p-5 mb-4 hover:bg-[#13131f] transition"
>

<h3 className="font-semibold text-lg mb-2">
{order.stock?.name}
</h3>

<p className="text-gray-400">
Quantity: {order.quantity}
</p>

<p className="mt-1">

Type:

<span
className={
order.type === "buy"
? "text-green-400 ml-2 font-semibold"
: "text-red-400 ml-2 font-semibold"
}
>
{order.type}
</span>

</p>

</div>

))

)}

</div>

</div>

</div>

);

}

export default History;