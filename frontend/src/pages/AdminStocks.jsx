import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";

function AdminStocks() {

  const [stocks,setStocks] = useState([]);
  const [name,setName] = useState("");
  const [symbol,setSymbol] = useState("");
  const [price,setPrice] = useState("");

  useEffect(()=>{
    fetchStocks();
  },[]);

  const fetchStocks = async()=>{

    const {data} = await axios.get("/stocks");

    setStocks(data);

  };

  const addStock = async(e)=>{

    e.preventDefault();

    await axios.post("/stocks",{
      name,
      symbol,
      price
    });

    alert("Stock Added");

    setName("");
    setSymbol("");
    setPrice("");

    fetchStocks();

  };

  const deleteStock = async(id)=>{

    await axios.delete(`/stocks/${id}`);

    fetchStocks();

  };

  return(

    <div style={{padding:"40px"}}>

      <h2>Admin Stock Manager</h2>

      {/* ADD STOCK FORM */}

      <form onSubmit={addStock}>

        <input
        placeholder="Stock Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        />

        <input
        placeholder="Symbol"
        value={symbol}
        onChange={(e)=>setSymbol(e.target.value)}
        />

        <input
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e)=>setPrice(e.target.value)}
        />

        <button type="submit">Add Stock</button>

      </form>

      <hr/>

      {/* STOCK LIST */}

      {stocks.map((stock)=>(
        <div key={stock._id} style={{margin:"10px 0"}}>

          {stock.name} ({stock.symbol}) - ₹{stock.price}

          <button
          onClick={()=>deleteStock(stock._id)}
          style={{marginLeft:"10px"}}
          >
            Delete
          </button>

        </div>
      ))}

    </div>

  );
}

export default AdminStocks;