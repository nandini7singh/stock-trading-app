function TrendingStocks() {

  const stocks = [
    {name:"TCS", price:3500},
    {name:"Infosys", price:1500},
    {name:"Reliance", price:2700},
    {name:"HDFC Bank", price:1600},
    {name:"ICICI Bank", price:950}
  ];

  return (

    <div style={{
      width:"30%",
      background:"#f4f6f8",
      padding:"15px",
      borderRadius:"8px"
    }}>

      <h3>Trending Stocks</h3>

      {stocks.map((stock,index)=>(
        <div key={index}
        style={{
          display:"flex",
          justifyContent:"space-between",
          padding:"8px 0",
          borderBottom:"1px solid #ddd"
        }}>
          <span>{stock.name}</span>
          <span>₹{stock.price}</span>
        </div>
      ))}

    </div>

  );
}

export default TrendingStocks;