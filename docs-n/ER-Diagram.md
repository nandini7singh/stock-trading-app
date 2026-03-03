
## Entity-Relationship Diagram

The following ER diagram illustrates the core data model for the SB Stocks paper trading application:

```mermaid
erDiagram
    USER ||--o{ PORTFOLIO : owns
    USER ||--o{ WATCHLIST : maintains
    USER ||--o{ ORDER : places
    USER ||--|| LEDGER : has
    USER {
        string user_id PK
        string email
        string password_hash
        string full_name
        datetime created_at
        datetime last_login
        string status
    }
    
    PORTFOLIO ||--o{ HOLDING : contains
    PORTFOLIO {
        string portfolio_id PK
        string user_id FK
        decimal total_value
        decimal total_cost
        decimal unrealized_pnl
        datetime updated_at
    }
    
    HOLDING }o--|| STOCK : references
    HOLDING {
        string holding_id PK
        string portfolio_id FK
        string symbol FK
        int quantity
        decimal average_cost
        decimal current_price
        decimal unrealized_pnl
        datetime last_updated
    }
    
    STOCK ||--o{ MARKET_DATA : has
    STOCK {
        string symbol PK
        string company_name
        string exchange
        string sector
        string status
    }
    
    MARKET_DATA {
        string data_id PK
        string symbol FK
        decimal price
        decimal open
        decimal high
        decimal low
        decimal close
        bigint volume
        datetime timestamp
    }
    
    ORDER }o--|| STOCK : targets
    ORDER ||--o{ TRADE : generates
    ORDER {
        string order_id PK
        string user_id FK
        string symbol FK
        string order_type
        string side
        int quantity
        decimal limit_price
        string status
        datetime placed_at
        datetime updated_at
    }
    
    TRADE }o--|| LEDGER : affects
    TRADE {
        string trade_id PK
        string order_id FK
        string user_id FK
        string symbol FK
        string side
        int quantity
        decimal price
        decimal total_amount
        datetime executed_at
    }
    
    LEDGER ||--o{ TRANSACTION : records
    LEDGER {
        string ledger_id PK
        string user_id FK
        decimal cash_balance
        decimal total_deposits
        decimal total_withdrawals
        datetime updated_at
    }
    
    TRANSACTION {
        string transaction_id PK
        string ledger_id FK
        string type
        decimal amount
        string description
        string related_trade_id
        datetime timestamp
    }
    
    WATCHLIST ||--o{ WATCHLIST_ITEM : contains
    WATCHLIST {
        string watchlist_id PK
        string user_id FK
        string name
        datetime created_at
    }
    
    WATCHLIST_ITEM }o--|| STOCK : monitors
    WATCHLIST_ITEM {
        string item_id PK
        string watchlist_id FK
        string symbol FK
        datetime added_at
    }
```

### Key Entities

- **USER:** Core entity representing registered users with authentication credentials
- **PORTFOLIO:** Aggregated view of a user's holdings and overall performance
- **HOLDING:** Individual stock positions with quantity and cost basis tracking
- **STOCK:** Master list of tradable instruments
- **MARKET_DATA:** Real-time and historical price information
- **ORDER:** User-initiated trading instructions (market, limit, stop orders)
- **TRADE:** Executed transactions resulting from filled orders
- **LEDGER:** Virtual cash account for each user
- **TRANSACTION:** Detailed cash flow records (deposits, withdrawals, trade settlements)
- **WATCHLIST:** User-curated lists of stocks to monitor
- **WATCHLIST_ITEM:** Individual stocks within a watchlist

### Relationships

- Each USER can have one PORTFOLIO and one LEDGER
- A PORTFOLIO contains multiple HOLDINGs
- Each HOLDING references a specific STOCK
- ORDERs are placed by USERs and target specific STOCKs
- Filled ORDERs generate TRADEs that update the LEDGER and PORTFOLIO
- MARKET_DATA provides pricing information for STOCKs
- WATCHLISTs organize stocks for monitoring without trading

### Design Considerations

- **Auditability:** TRANSACTION and TRADE tables maintain complete history
- **Data Integrity:** Foreign key constraints ensure referential integrity
- **Performance:** Indexed on user_id, symbol, and timestamp fields
- **Scalability:** Separates market data from user-specific trading data