# Layer	           Analogy	               Why separate it?
   API	         The Receptionist	      So the Engine doesn't have to deal with user logins or security.
   Queue	         The Waiting Line	      So the Engine never gets overwhelmed by spikes in traffic.
   Engine	      The High-Speed Chef	   It only does math. It doesn't talk to users or databases.
   PubSub/WS	   The Live Broadcast	   To keep the UI fast without slowing down the core logic.
   DB Processor   The Accountant	         To save records permanently without making the traders wait.



# 🎒 Backpack Exchange Clone

A high-performance, real-time cryptocurrency trading interface built with **React**, **TypeScript**, and **WebSockets**. This project focuses on low-latency order book updates and precise trade execution visualization.

---

## ⚡ Features

- **Live Order Book**: Real-time visualization of Bids and Asks using WebSocket streams.
- **Aggressive Trade Logic**: LTP (Last Traded Price) coloring based on trade execution (Buy at Ask = Green, Sell at Bid = Red).
- **High Performance**: Optimized rendering to handle high-frequency tick data without UI lag.
- **Backpack UI/UX**: Clean, minimalist, and dark-themed interface inspired by the Backpack Exchange.

---

## 🏗️ Technical Architecture

### 1. Data Flow
- **WebSocket Consumer**: Connects to the exchange's pub/sub server.
- **OrderBook Sorter**: Automatically sorts Bids (descending) and Asks (ascending) to find the 'Best' prices.
- **Spread Calculation**: Real-time calculation of the gap between the highest Bid and lowest Ask.

### 2. LTP & Color Logic
The center price (LTP) color is determined by market aggression:
- **Green** (`#22c55e`): Triggered when a trade hits the **Best Ask**, indicating aggressive buying.
- **Red** (`#ef4444`): Triggered when a trade hits the **Best Bid**, indicating aggressive selling.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org) / React
- **Language**: [TypeScript](https://typescriptlang.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **State**: React Hooks (useState, useEffect, useMemo)
- **Icons**: Lucide React

---

## 💻 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com
   cd backpack-clone