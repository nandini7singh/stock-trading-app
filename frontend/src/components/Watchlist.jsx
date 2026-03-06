function Watchlist(){

  const stocks = [
    {symbol:"TCS", price:3500},
    {symbol:"INFY", price:1500},
    {symbol:"RELIANCE", price:2700}
  ];

  return(

    <div style={{
      width:"65%",
      background:"#ffffff",
      padding:"15px",
      borderRadius:"8px",
      border:"1px solid #eee"
    }}>

      <h3>Watchlist</h3>

      {stocks.map((stock,index)=>(
        <div key={index}
        style={{
          display:"flex",
          justifyContent:"space-between",
          padding:"10px",
          borderBottom:"1px solid #eee"
        }}>
          <span>{stock.symbol}</span>
          <span>₹{stock.price}</span>

          <button style={{
            background:"#2c6fb7",
            color:"white",
            border:"none",
            padding:"5px 10px",
            borderRadius:"4px"
          }}>
            View Chart
          </button>

        </div>
      ))}

    </div>

  );
}

export default Watchlist;