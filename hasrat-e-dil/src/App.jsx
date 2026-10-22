import { useState } from "react";
import "./App.css";
import { db } from "./firebase";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";

function App() {
  const [page, setPage] = useState("login"); // login, proposal, wish, thanks, admin
  const [password, setPassword] = useState("");
  const [wish, setWish] = useState("");
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);

  const handleLogin = () => {
    const p = password.toLowerCase().trim();
    if (p === "yesiamyours") {
      setPage("proposal");
    } else if (p === "admin123") {
      setPage("admin");
      fetchWishes();
    } else {
      alert("Galat password jaan 💔 Hint: yesiamyours");
    }
  };

  const fetchWishes = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "wishes"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setWishes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.log(e); }
    setLoading(false);
  };

  const saveWish = async () => {
    if (!wish.trim()) return alert("Pehle hasrat to likho ❤️");
    setLoading(true);
    try {
      await addDoc(collection(db, "wishes"), {
        text: wish,
        createdAt: serverTimestamp(),
        date: new Date().toLocaleString()
      });
      setPage("thanks");
    } catch (e) { alert(e.message); }
    setLoading(false);
  };

  const handleTeddyClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 5) {
      const pass = prompt("Admin password:");
      if (pass === "admin123") { setPage("admin"); fetchWishes(); }
      setClickCount(0);
    }
  };

  const moveNoButton = () => {
    setNoBtnPos({ x: Math.random() * 160 - 80, y: Math.random() * 160 - 80 });
  };

  if (page === "login") {
    return (
      <div className="proposal-container">
        <div className="proposal-box">
          <img src="/teddy.jpg" alt="teddy" className="teddy-proposal" onClick={handleTeddyClick} />
          <h1>Meri Hasrat-e-Dil 💖</h1>
          <p className="proposal-sub">Apne dil ka password dalo</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Password..."
            className="login-input"
          />
          <button onClick={handleLogin} className="yes-btn full">Dil Khol Do 🔓</button>
          <small className="hint">Password: yesiamyours</small>
        </div>
      </div>
    );
  }

  if (page === "proposal") {
    return (
      <div className="proposal-container">
        <div className="proposal-box">
          <img src="/teddy.jpg" alt="teddy" className="teddy-proposal" onClick={handleTeddyClick} />
          <h1 className="proposal-title">Kya Ap Mere Sath<br/>Zindagi Guzarna Chahti Hain? 💍</h1>
          <p className="proposal-sub">Meri hasrat-e-dil sirf aap ho...</p>
          <div className="proposal-btns">
            <button className="yes-btn" onClick={() => setPage("wish")}>Haan! Bilkul 💖</button>
            <button className="no-btn" style={{ transform: `translate(${noBtnPos.x}px, ${noBtnPos.y}px)` }} onMouseEnter={moveNoButton} onClick={moveNoButton}>Nahi 🙈</button>
          </div>
          <div className="hearts">💖 ✨ 💕 ✨ 💖</div>
        </div>
      </div>
    );
  }

  if (page === "admin") {
    return (
      <div className="admin-container">
        <div className="admin-box">
          <h1>Saari Hasratein 💌 ({wishes.length})</h1>
          <button className="logout-btn" onClick={() => setPage("login")}>Logout</button>
          <div className="wishes-list">
            {loading ? <p>Loading...</p> : wishes.map(w => (
              <div key={w.id} className="wish-card"><p>{w.text}</p><span>{w.date}</span></div>
            ))}
            {wishes.length === 0 && !loading && <p className="empty">Abhi koi wish nahi</p>}
          </div>
        </div>
      </div>
    );
  }

  if (page === "thanks") {
    return (
      <div className="proposal-container">
        <div className="proposal-box">
          <img src="/teddy.jpg" alt="teddy" className="teddy-small" />
          <h1 className="thanks-title">Qabool Hai! 💖</h1>
          <p className="thanks-text">Aapki hasrat mere dil me mehfooz ho gayi hai, hamesha ke liye...</p>
          <div className="hearts-big">💖💍✨</div>
          <button className="yes-btn full" onClick={() => { setWish(""); setPage("wish"); }}>Ek Aur Hasrat Likho</button>
          <button className="logout-btn-small full-mt" onClick={() => setPage("login")}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="content-box">
        <img src="/teddy.jpg" alt="teddy" className="teddy-small" />
        <h1>Meri Hasrat-e-Dil</h1>
        <p className="subtitle">Ab apni sari hasratein yahan likh do ✨</p>
        <textarea value={wish} onChange={(e) => setWish(e.target.value)} placeholder="Mere liye kya hasrat hai...? 💭❤️" className="hasrat-input" />
        <button onClick={saveWish} disabled={loading} className="send-btn">{loading ? "Bhej raha hu..." : "Hasrat Bhej Do 📩"}</button>
        <button onClick={() => setPage("proposal")} className="back-btn">Back</button>
      </div>
    </div>
  );
}
export default App;