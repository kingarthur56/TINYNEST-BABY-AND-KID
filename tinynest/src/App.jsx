import { useState, useEffect, useRef } from "react";

// ── STYLES ──────────────────────────────────────────────────────────────────
const injectStyles = () => {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&family=Pacifico&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Nunito',sans-serif;background:#FFF8F0;overflow-x:hidden;}
    :root{
      --cream:#FFF8F0;--peach:#FFD6B8;--coral:#FF7B5C;--coral-dark:#e05a3a;
      --mint:#B8EFD8;--mint-dark:#3DC98A;--sky:#C3E8FF;--sky-dark:#4AAFE8;
      --lav:#E0D5FF;--lav-dark:#8B6FE8;--yellow:#FFF0A0;--yellow-dark:#F5C842;
      --dark:#2D2235;--mid:#6B5E7A;--soft:#A89BB8;--white:#fff;
    }
    @keyframes blobFloat{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-28px) scale(1.05);}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
    @keyframes heroFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
    @keyframes spin{to{transform:rotate(360deg);}}
    @keyframes checkPop{0%{transform:scale(0);}70%{transform:scale(1.3);}100%{transform:scale(1);}}
    @keyframes slideIn{from{transform:translateX(100%);opacity:0;}to{transform:translateX(0);opacity:1;}}
    @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,123,92,0.4);}50%{box-shadow:0 0 0 12px rgba(255,123,92,0);}}
    .fade-up{animation:fadeUp .5s ease forwards;}
    .hero-float{animation:heroFloat 4s ease-in-out infinite;}
    .blob{position:fixed;border-radius:50%;filter:blur(70px);opacity:.28;pointer-events:none;z-index:0;}
  `;
  const el = document.createElement("style");
  el.textContent = css;
  document.head.appendChild(el);
};

// ── DATA ─────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id:1, name:"Organic Cotton Crib Set", brand:"SnugSleep", price:34, old:65, emoji:"🛏️", bg:"linear-gradient(135deg,#FFE8D6,#FFD6B8)", badge:"NEW", stars:5, reviews:128, age:"0-12m" },
  { id:2, name:"Soft Elephant Plush Toy", brand:"PlushPal", price:12, old:28, emoji:"🧸", bg:"linear-gradient(135deg,#D6F5E8,#B8EFD8)", badge:"SALE", stars:4, reviews:94, age:"1-3y" },
  { id:3, name:"Infant Car Seat — Grey", brand:"SafeRide", price:78, old:180, emoji:"🚗", bg:"linear-gradient(135deg,#C3E8FF,#A0D4FF)", badge:null, stars:5, reviews:215, age:"0-12m" },
  { id:4, name:"Floral Dress Set — 2T", brand:"LittleThreads", price:18, old:40, emoji:"👗", bg:"linear-gradient(135deg,#E0D5FF,#D0C0FF)", badge:"NEW", stars:5, reviews:67, age:"1-3y" },
  { id:5, name:"Anti-Colic Bottle 3-Pack", brand:"NurtureWell", price:22, old:38, emoji:"🍼", bg:"linear-gradient(135deg,#FFF0A0,#FFE060)", badge:null, stars:4, reviews:183, age:"0-12m" },
  { id:6, name:"Kids Art Kit — 50pcs", brand:"ColorSplash", price:16, old:35, emoji:"🎨", bg:"linear-gradient(135deg,#FFD6E0,#FFB8CC)", badge:"SALE", stars:5, reviews:304, age:"3-6y" },
  { id:7, name:"Wooden Block Set", brand:"PlayWood", price:29, old:55, emoji:"🧱", bg:"linear-gradient(135deg,#FFF0A0,#FFD6B8)", badge:null, stars:5, reviews:148, age:"1-3y" },
  { id:8, name:"Rain Boots — Size 7", brand:"SplashKids", price:15, old:32, emoji:"🥾", bg:"linear-gradient(135deg,#B8EFD8,#C3E8FF)", badge:"SALE", stars:4, reviews:72, age:"3-6y" },
];

const CATEGORIES = [
  { icon:"👶", name:"Newborn", count:"4,820" },
  { icon:"👕", name:"Clothing", count:"12,400" },
  { icon:"🧸", name:"Toys", count:"8,950" },
  { icon:"🛏️", name:"Nursery", count:"3,200" },
  { icon:"🍼", name:"Feeding", count:"2,700" },
  { icon:"🛁", name:"Bath Time", count:"1,880" },
  { icon:"🚗", name:"Travel", count:"5,100" },
  { icon:"📚", name:"Books", count:"6,200" },
];

const AGE_FILTERS = ["All Ages","0-12m","1-3y","3-6y","6-12y"];

// ── COMPONENTS ────────────────────────────────────────────────────────────────

// Cart notification toast
function Toast({ message, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position:"fixed", top:86, right:24, zIndex:9999,
      background:var_c("--dark"), color:"#fff",
      padding:"13px 22px", borderRadius:16, fontWeight:700,
      animation:"slideIn .3s ease", boxShadow:"0 8px 28px rgba(0,0,0,0.2)",
      display:"flex", alignItems:"center", gap:10, fontSize:"0.9rem"
    }}>
      <span style={{fontSize:"1.3rem"}}>🛒</span> {message}
    </div>
  );
}

function var_c(v) { return `var(${v})`; }

// Stars renderer
function Stars({ n }) {
  return <span style={{color:var_c("--yellow-dark"), fontSize:"0.82rem"}}>
    {"★".repeat(n)}{"☆".repeat(5-n)}
  </span>;
}

// Product Card
function ProductCard({ product, onAdd, onWish, wished }) {
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    setAdded(true);
    onAdd(product);
    setTimeout(() => setAdded(false), 1500);
  };
  return (
    <div className="fade-up" style={{
      background:"#fff", borderRadius:22, overflow:"hidden",
      boxShadow:"0 4px 18px rgba(0,0,0,0.07)",
      transition:"transform .25s, box-shadow .25s", cursor:"pointer",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow="0 16px 40px rgba(0,0,0,0.13)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 4px 18px rgba(0,0,0,0.07)"; }}
    >
      <div style={{ height:190, background:product.bg, display:"flex", alignItems:"center",
        justifyContent:"center", fontSize:"4rem", position:"relative" }}>
        {product.badge && (
          <span style={{
            position:"absolute", top:12, left:12,
            background: product.badge==="NEW" ? var_c("--coral") : var_c("--mint-dark"),
            color:"#fff", fontSize:"0.68rem", fontWeight:800,
            padding:"3px 9px", borderRadius:12
          }}>{product.badge}</span>
        )}
        {product.emoji}
        <button onClick={e => { e.stopPropagation(); onWish(product.id); }} style={{
          position:"absolute", top:10, right:10, background:"#fff", border:"none",
          borderRadius:"50%", width:32, height:32, cursor:"pointer", fontSize:"1rem",
          boxShadow:"0 2px 8px rgba(0,0,0,0.1)", display:"flex", alignItems:"center",
          justifyContent:"center", transition:"transform .15s"
        }}>{wished ? "❤️" : "🤍"}</button>
      </div>
      <div style={{ padding:"14px 16px 18px" }}>
        <div style={{ fontSize:"0.72rem", color:var_c("--soft"), fontWeight:700, textTransform:"uppercase", letterSpacing:".5px" }}>{product.brand}</div>
        <div style={{ fontWeight:800, fontSize:"0.95rem", margin:"3px 0 6px" }}>{product.name}</div>
        <Stars n={product.stars} /><span style={{ fontSize:"0.78rem", color:var_c("--soft"), marginLeft:4 }}>({product.reviews})</span>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:10 }}>
          <div>
            <span style={{ fontWeight:800, fontSize:"1.05rem", color:var_c("--coral") }}>${product.price}</span>
            <span style={{ fontSize:"0.8rem", color:var_c("--soft"), textDecoration:"line-through", marginLeft:5 }}>${product.old}</span>
          </div>
          <button onClick={handleAdd} style={{
            background: added ? var_c("--mint-dark") : var_c("--dark"),
            color:"#fff", border:"none", borderRadius:12,
            padding:"7px 14px", fontFamily:"'Nunito',sans-serif", fontWeight:800,
            fontSize:"0.8rem", cursor:"pointer", transition:"background .2s"
          }}>{added ? "✓ Added!" : "+ Add"}</button>
        </div>
      </div>
    </div>
  );
}

// ── CART DRAWER ───────────────────────────────────────────────────────────────
function CartDrawer({ cart, onClose, onRemove, onCheckout }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:500, display:"flex"
    }}>
      <div onClick={onClose} style={{ flex:1, background:"rgba(45,34,53,0.5)", backdropFilter:"blur(4px)" }} />
      <div style={{
        width:380, background:"#fff", height:"100%", overflowY:"auto",
        boxShadow:"-12px 0 48px rgba(0,0,0,0.15)", animation:"slideIn .3s ease",
        display:"flex", flexDirection:"column"
      }}>
        <div style={{ padding:"24px", borderBottom:`2px solid var(--peach)`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.6rem", color:var_c("--dark") }}>🛒 Your Cart</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:"1.5rem", cursor:"pointer", color:var_c("--mid") }}>✕</button>
        </div>
        {cart.length === 0 ? (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:var_c("--soft") }}>
            <span style={{ fontSize:"4rem" }}>🧸</span>
            <p style={{ marginTop:12, fontWeight:700 }}>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div style={{ flex:1, padding:"16px 24px", display:"flex", flexDirection:"column", gap:14 }}>
              {cart.map(item => (
                <div key={item.id} style={{ display:"flex", gap:12, alignItems:"center", background:"#FFF8F0", borderRadius:14, padding:12 }}>
                  <div style={{ width:52, height:52, borderRadius:10, background:item.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.8rem", flexShrink:0 }}>{item.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800, fontSize:"0.88rem" }}>{item.name}</div>
                    <div style={{ color:var_c("--coral"), fontWeight:800, fontSize:"0.95rem" }}>${item.price} × {item.qty}</div>
                  </div>
                  <button onClick={() => onRemove(item.id)} style={{ background:"none", border:"none", color:var_c("--soft"), cursor:"pointer", fontSize:"1.2rem" }}>🗑️</button>
                </div>
              ))}
            </div>
            <div style={{ padding:"20px 24px", borderTop:`2px solid var(--peach)` }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontWeight:800, fontSize:"1.1rem", marginBottom:16 }}>
                <span>Total</span>
                <span style={{ color:var_c("--coral") }}>${total.toFixed(2)}</span>
              </div>
              <button onClick={onCheckout} style={{
                width:"100%", padding:"15px", background:var_c("--coral"),
                color:"#fff", border:"none", borderRadius:50, fontFamily:"'Nunito',sans-serif",
                fontWeight:800, fontSize:"1rem", cursor:"pointer",
                animation:"pulse 2s infinite", transition:"transform .15s"
              }}>🔐 Proceed to Checkout →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── CHECKOUT FLOW ─────────────────────────────────────────────────────────────
function CheckoutModal({ cart, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1=delivery, 2=payment, 3=review, 4=success
  const [form, setForm] = useState({
    firstName:"", lastName:"", email:"", phone:"",
    address:"", city:"", zip:"", country:"",
    cardNumber:"", expiry:"", cvv:"", cardName:"",
    method:"card"
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = total > 50 ? 0 : 4.99;
  const tax = total * 0.08;
  const grand = total + shipping + tax;

  const upd = (k, v) => setForm(f => ({...f, [k]: v}));

  const fmtCard = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExp  = v => v.replace(/\D/g,"").slice(0,4).replace(/^(\d{2})(\d)/,"$1/$2");

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.firstName) e.firstName = "Required";
      if (!form.email || !form.email.includes("@")) e.email = "Valid email required";
      if (!form.address) e.address = "Required";
      if (!form.city) e.city = "Required";
      if (!form.zip) e.zip = "Required";
    }
    if (step === 2 && form.method === "card") {
      if (form.cardNumber.replace(/\s/g,"").length < 16) e.cardNumber = "Enter 16 digits";
      if (!form.expiry || form.expiry.length < 5) e.expiry = "Required";
      if (!form.cvv || form.cvv.length < 3) e.cvv = "Required";
      if (!form.cardName) e.cardName = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const place = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(4); }, 2200);
  };

  const inputStyle = (err) => ({
    width:"100%", padding:"12px 16px", borderRadius:12,
    border: err ? "2px solid #FF4444" : "2px solid #F0E8E0",
    background:"#FFF8F0", fontFamily:"'Nunito',sans-serif",
    fontSize:"0.95rem", color:var_c("--dark"), outline:"none",
    transition:"border-color .2s"
  });

  const labelStyle = { fontSize:"0.8rem", fontWeight:800, color:var_c("--mid"), marginBottom:4, display:"block" };

  const steps = ["Delivery","Payment","Review","Done"];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:600, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(45,34,53,0.6)", backdropFilter:"blur(6px)", padding:20 }}>
      <div style={{ background:"#fff", borderRadius:28, width:"100%", maxWidth:560, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 32px 80px rgba(0,0,0,0.2)", animation:"fadeUp .35s ease" }}>

        {/* Header */}
        <div style={{ padding:"22px 28px", borderBottom:"2px solid #FFF0E8", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"#fff", zIndex:10 }}>
          <div style={{ fontFamily:"'Pacifico',cursive", fontSize:"1.3rem", color:var_c("--coral") }}>🐣 TinyNest Checkout</div>
          {step < 4 && <button onClick={onClose} style={{ background:"none", border:"none", fontSize:"1.3rem", cursor:"pointer", color:var_c("--soft") }}>✕</button>}
        </div>

        {/* Step indicator */}
        {step < 4 && (
          <div style={{ padding:"16px 28px 0", display:"flex", gap:0 }}>
            {steps.slice(0,3).map((s, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", flex: i < 2 ? 1 : "none" }}>
                <div style={{
                  width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center",
                  justifyContent:"center", fontWeight:800, fontSize:"0.8rem", flexShrink:0,
                  background: step > i+1 ? var_c("--mint-dark") : step === i+1 ? var_c("--coral") : "#F0E8E0",
                  color: step >= i+1 ? "#fff" : var_c("--soft"),
                  transition:"all .3s"
                }}>{step > i+1 ? "✓" : i+1}</div>
                <span style={{ marginLeft:6, fontSize:"0.78rem", fontWeight:700, color: step === i+1 ? var_c("--dark") : var_c("--soft") }}>{s}</span>
                {i < 2 && <div style={{ flex:1, height:2, background: step > i+1 ? var_c("--mint-dark") : "#F0E8E0", margin:"0 10px", transition:"background .3s" }} />}
              </div>
            ))}
          </div>
        )}

        <div style={{ padding:"24px 28px 28px" }}>

          {/* ── STEP 1: DELIVERY ── */}
          {step === 1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <h3 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.3rem", color:var_c("--dark") }}>📦 Delivery Details</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {[["firstName","First Name"],["lastName","Last Name"]].map(([k,l]) => (
                  <div key={k}>
                    <label style={labelStyle}>{l}</label>
                    <input value={form[k]} onChange={e=>upd(k,e.target.value)} placeholder={l} style={inputStyle(errors[k])}/>
                    {errors[k] && <span style={{color:"#FF4444",fontSize:"0.75rem"}}>{errors[k]}</span>}
                  </div>
                ))}
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input value={form.email} onChange={e=>upd("email",e.target.value)} placeholder="you@email.com" style={inputStyle(errors.email)}/>
                {errors.email && <span style={{color:"#FF4444",fontSize:"0.75rem"}}>{errors.email}</span>}
              </div>
              <div>
                <label style={labelStyle}>Phone (optional)</label>
                <input value={form.phone} onChange={e=>upd("phone",e.target.value)} placeholder="+1 555 000 0000" style={inputStyle()}/>
              </div>
              <div>
                <label style={labelStyle}>Street Address</label>
                <input value={form.address} onChange={e=>upd("address",e.target.value)} placeholder="123 Maple Street" style={inputStyle(errors.address)}/>
                {errors.address && <span style={{color:"#FF4444",fontSize:"0.75rem"}}>{errors.address}</span>}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                {[["city","City"],["zip","Zip Code"],["country","Country"]].map(([k,l]) => (
                  <div key={k}>
                    <label style={labelStyle}>{l}</label>
                    <input value={form[k]} onChange={e=>upd(k,e.target.value)} placeholder={l} style={inputStyle(errors[k])}/>
                    {errors[k] && <span style={{color:"#FF4444",fontSize:"0.75rem"}}>{errors[k]}</span>}
                  </div>
                ))}
              </div>
              {/* Shipping options */}
              <div style={{ background:"#FFF8F0", borderRadius:16, padding:16 }}>
                <div style={{ fontWeight:800, fontSize:"0.88rem", marginBottom:10 }}>🚚 Shipping Method</div>
                {[["standard","Standard (3-5 days)","$4.99"],["express","Express (1-2 days)","$12.99"],["free","Free (5-7 days, orders $50+)","FREE"]].map(([v,l,p]) => (
                  <label key={v} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, cursor:"pointer" }}>
                    <input type="radio" name="ship" value={v} defaultChecked={v==="standard"} style={{accentColor:var_c("--coral")}}/>
                    <span style={{ fontSize:"0.88rem", fontWeight:700 }}>{l}</span>
                    <span style={{ marginLeft:"auto", color:v==="free"?var_c("--mint-dark"):var_c("--coral"), fontWeight:800, fontSize:"0.88rem" }}>{p}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: PAYMENT ── */}
          {step === 2 && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <h3 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.3rem", color:var_c("--dark") }}>💳 Payment Method</h3>

              {/* Method tabs */}
              <div style={{ display:"flex", gap:10 }}>
                {[["card","💳 Card"],["paypal","🅿️ PayPal"],["apple","🍎 Apple Pay"]].map(([v,l]) => (
                  <button key={v} onClick={()=>upd("method",v)} style={{
                    flex:1, padding:"10px 8px", borderRadius:12, fontFamily:"'Nunito',sans-serif",
                    fontWeight:800, fontSize:"0.82rem", cursor:"pointer",
                    border: form.method===v ? `2px solid var(--coral)` : "2px solid #F0E8E0",
                    background: form.method===v ? "#FFF0EB" : "#fff",
                    color: form.method===v ? var_c("--coral") : var_c("--mid"),
                    transition:"all .2s"
                  }}>{l}</button>
                ))}
              </div>

              {form.method === "card" && (
                <>
                  <div>
                    <label style={labelStyle}>Card Number</label>
                    <div style={{ position:"relative" }}>
                      <input value={form.cardNumber} onChange={e=>upd("cardNumber",fmtCard(e.target.value))}
                        placeholder="4242 4242 4242 4242" maxLength={19} style={{...inputStyle(errors.cardNumber), paddingRight:50}}/>
                      <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", fontSize:"1.4rem" }}>💳</span>
                    </div>
                    {errors.cardNumber && <span style={{color:"#FF4444",fontSize:"0.75rem"}}>{errors.cardNumber}</span>}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    <div>
                      <label style={labelStyle}>Expiry Date</label>
                      <input value={form.expiry} onChange={e=>upd("expiry",fmtExp(e.target.value))} placeholder="MM/YY" maxLength={5} style={inputStyle(errors.expiry)}/>
                      {errors.expiry && <span style={{color:"#FF4444",fontSize:"0.75rem"}}>{errors.expiry}</span>}
                    </div>
                    <div>
                      <label style={labelStyle}>CVV</label>
                      <input value={form.cvv} onChange={e=>upd("cvv",e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="•••" maxLength={4} style={inputStyle(errors.cvv)}/>
                      {errors.cvv && <span style={{color:"#FF4444",fontSize:"0.75rem"}}>{errors.cvv}</span>}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Name on Card</label>
                    <input value={form.cardName} onChange={e=>upd("cardName",e.target.value)} placeholder="Jane Doe" style={inputStyle(errors.cardName)}/>
                    {errors.cardName && <span style={{color:"#FF4444",fontSize:"0.75rem"}}>{errors.cardName}</span>}
                  </div>
                </>
              )}
              {form.method === "paypal" && (
                <div style={{ background:"#FFF8F0", borderRadius:16, padding:28, textAlign:"center" }}>
                  <div style={{ fontSize:"3rem" }}>🅿️</div>
                  <p style={{ fontWeight:700, color:var_c("--mid"), marginTop:10 }}>You'll be redirected to PayPal to complete payment securely.</p>
                </div>
              )}
              {form.method === "apple" && (
                <div style={{ background:"#FFF8F0", borderRadius:16, padding:28, textAlign:"center" }}>
                  <div style={{ fontSize:"3rem" }}>🍎</div>
                  <p style={{ fontWeight:700, color:var_c("--mid"), marginTop:10 }}>Use Face ID or Touch ID to pay instantly with Apple Pay.</p>
                </div>
              )}

              {/* Security badges */}
              <div style={{ display:"flex", gap:10, justifyContent:"center", marginTop:4 }}>
                {["🔒 SSL Secured","✅ PCI Compliant","🛡️ Buyer Protection"].map(b => (
                  <span key={b} style={{ fontSize:"0.72rem", fontWeight:700, color:var_c("--soft"), background:"#F5F0FA", padding:"4px 10px", borderRadius:20 }}>{b}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 3: REVIEW ── */}
          {step === 3 && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <h3 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.3rem", color:var_c("--dark") }}>🧾 Order Review</h3>

              {/* Items */}
              <div style={{ background:"#FFF8F0", borderRadius:16, padding:16, display:"flex", flexDirection:"column", gap:10 }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <div style={{ width:44,height:44,borderRadius:10,background:item.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.6rem",flexShrink:0 }}>{item.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:800, fontSize:"0.88rem" }}>{item.name}</div>
                      <div style={{ color:var_c("--soft"), fontSize:"0.78rem" }}>Qty: {item.qty}</div>
                    </div>
                    <div style={{ fontWeight:800, color:var_c("--coral") }}>${(item.price*item.qty).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              {/* Address summary */}
              <div style={{ background:"#F5F0FA", borderRadius:16, padding:14 }}>
                <div style={{ fontWeight:800, fontSize:"0.82rem", color:var_c("--mid"), marginBottom:6 }}>📦 SHIPPING TO</div>
                <div style={{ fontWeight:700, fontSize:"0.9rem" }}>{form.firstName} {form.lastName}</div>
                <div style={{ color:var_c("--mid"), fontSize:"0.85rem" }}>{form.address}, {form.city}, {form.zip}</div>
                <div style={{ color:var_c("--soft"), fontSize:"0.82rem" }}>{form.email}</div>
              </div>

              {/* Price breakdown */}
              <div style={{ background:"#FFF8F0", borderRadius:16, padding:16 }}>
                {[["Subtotal",`$${total.toFixed(2)}`],["Shipping",shipping===0?"FREE 🎉":`$${shipping.toFixed(2)}`],["Tax (8%)",`$${tax.toFixed(2)}`]].map(([l,v]) => (
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:"0.9rem", color:var_c("--mid"), fontWeight:700 }}>
                    <span>{l}</span><span style={{ color: l==="Shipping"&&shipping===0 ? var_c("--mint-dark") : var_c("--dark") }}>{v}</span>
                  </div>
                ))}
                <div style={{ borderTop:"2px dashed #F0E8E0", paddingTop:10, display:"flex", justifyContent:"space-between", fontWeight:900, fontSize:"1.1rem" }}>
                  <span>Total</span><span style={{ color:var_c("--coral") }}>${grand.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ fontSize:"0.78rem", color:var_c("--soft"), textAlign:"center", lineHeight:1.6 }}>
                By placing your order you agree to our Terms of Service and Privacy Policy. Your payment is protected by 256-bit SSL encryption.
              </div>
            </div>
          )}

          {/* ── STEP 4: SUCCESS ── */}
          {step === 4 && (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:"5rem", animation:"checkPop .5s ease" }}>🎉</div>
              <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2rem", color:var_c("--dark"), marginTop:16 }}>Order Placed!</h2>
              <p style={{ color:var_c("--mid"), marginTop:10, lineHeight:1.7 }}>
                Thank you, <strong>{form.firstName || "friend"}</strong>! 💛<br/>
                Your order is confirmed. A receipt has been sent to <strong>{form.email || "your email"}</strong>.
              </p>
              <div style={{ background:"#FFF8F0", borderRadius:16, padding:20, margin:"20px 0", textAlign:"left" }}>
                <div style={{ fontWeight:800, fontSize:"0.88rem", color:var_c("--mid"), marginBottom:10 }}>ORDER #TN-{Math.floor(Math.random()*90000)+10000}</div>
                {cart.map(i => (
                  <div key={i.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                    <span style={{ fontSize:"1.6rem" }}>{i.emoji}</span>
                    <span style={{ fontWeight:700, fontSize:"0.88rem" }}>{i.name}</span>
                    <span style={{ marginLeft:"auto", color:var_c("--coral"), fontWeight:800 }}>${i.price}</span>
                  </div>
                ))}
                <div style={{ borderTop:"2px dashed #F0E8E0", paddingTop:10, fontWeight:900, display:"flex", justifyContent:"space-between" }}>
                  <span>Total Paid</span><span style={{ color:var_c("--coral") }}>${grand.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:16 }}>
                {["📦 Preparing","✈️ Shipping","🏠 Delivered"].map((s,i) => (
                  <div key={i} style={{ textAlign:"center" }}>
                    <div style={{ width:44,height:44,borderRadius:"50%",background:i===0?var_c("--coral"):"#F0E8E0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",margin:"0 auto 4px" }}>{s.split(" ")[0]}</div>
                    <div style={{ fontSize:"0.7rem", color:i===0?var_c("--coral"):var_c("--soft"), fontWeight:700 }}>{s.split(" ")[1]}</div>
                  </div>
                ))}
              </div>
              <button onClick={onSuccess} style={{
                width:"100%", padding:"15px", background:var_c("--coral"),
                color:"#fff", border:"none", borderRadius:50, fontFamily:"'Nunito',sans-serif",
                fontWeight:800, fontSize:"1rem", cursor:"pointer"
              }}>🛍️ Continue Shopping</button>
            </div>
          )}

          {/* Navigation buttons */}
          {step < 4 && (
            <div style={{ display:"flex", gap:12, marginTop:22 }}>
              {step > 1 && (
                <button onClick={()=>setStep(s=>s-1)} style={{
                  flex:1, padding:"13px", background:"#F5F0FA", color:var_c("--mid"),
                  border:"none", borderRadius:50, fontFamily:"'Nunito',sans-serif",
                  fontWeight:800, fontSize:"0.95rem", cursor:"pointer"
                }}>← Back</button>
              )}
              <button onClick={step === 3 ? place : next} disabled={loading} style={{
                flex:2, padding:"13px", background: loading ? "#ccc" : var_c("--coral"),
                color:"#fff", border:"none", borderRadius:50, fontFamily:"'Nunito',sans-serif",
                fontWeight:800, fontSize:"0.95rem", cursor:loading?"not-allowed":"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8
              }}>
                {loading ? <><span style={{ width:18,height:18,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block" }}/> Processing…</> :
                  step === 3 ? "🔐 Place Order" : "Continue →"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function TinyNest() {
  useEffect(() => { injectStyles(); }, []);

  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [wished, setWished] = useState(new Set());
  const [ageFilter, setAgeFilter] = useState("All Ages");
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [toast, setToast] = useState(null);

  const addToCart = (product) => {
    setCart(c => {
      const ex = c.find(i => i.id === product.id);
      if (ex) return c.map(i => i.id === product.id ? {...i, qty: i.qty+1} : i);
      return [...c, {...product, qty:1}];
    });
    setToast(`${product.emoji} Added to cart!`);
  };

  const removeFromCart = (id) => setCart(c => c.filter(i => i.id !== id));

  const toggleWish = (id) => setWished(w => {
    const n = new Set(w);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const cartCount = cart.reduce((s,i) => s+i.qty, 0);

  const filtered = ageFilter === "All Ages"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.age === ageFilter);

  const v = (css) => css;

  return (
    <div style={{ minHeight:"100vh", background:"#FFF8F0", fontFamily:"'Nunito',sans-serif", position:"relative" }}>

      {/* Blobs */}
      <div className="blob" style={{ width:380,height:380,background:"#FFD6B8",top:-80,left:-100,animationDuration:"8s" }} />
      <div className="blob" style={{ width:300,height:300,background:"#B8EFD8",top:"40%",right:-80,animationDuration:"10s",animationDelay:"2s" }} />
      <div className="blob" style={{ width:260,height:260,background:"#E0D5FF",bottom:"10%",left:"10%",animationDuration:"9s",animationDelay:"4s" }} />

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Cart Drawer */}
      {showCart && <CartDrawer cart={cart} onClose={()=>setShowCart(false)} onRemove={removeFromCart}
        onCheckout={() => { setShowCart(false); setShowCheckout(true); }} />}

      {/* Checkout Modal */}
      {showCheckout && <CheckoutModal cart={cart} onClose={() => setShowCheckout(false)}
        onSuccess={() => { setShowCheckout(false); setCart([]); }} />}

      {/* ── NAV ── */}
      <nav style={{
        position:"sticky", top:0, zIndex:200,
        background:"rgba(255,248,240,0.9)", backdropFilter:"blur(14px)",
        borderBottom:"2px solid #FFD6B8",
        padding:"0 5%", display:"flex", alignItems:"center", justifyContent:"space-between", height:68
      }}>
        <div style={{ fontFamily:"'Pacifico',cursive", fontSize:"1.6rem", color:"#FF7B5C", display:"flex", alignItems:"center", gap:8, cursor:"pointer" }} onClick={()=>setPage("home")}>
          🐣 TinyNest
        </div>
        <div style={{ display:"flex", gap:28 }}>
          {["Shop","Sell","Deals","Blog"].map(l => (
            <span key={l} onClick={()=>setPage(l.toLowerCase())} style={{
              cursor:"pointer", fontWeight:700, fontSize:"0.95rem",
              color: page===l.toLowerCase() ? "#FF7B5C" : "#6B5E7A",
              transition:"color .2s", textDecoration: page===l.toLowerCase()?"underline":"none"
            }}>{l}</span>
          ))}
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <button onClick={() => setShowCart(true)} style={{
            position:"relative", background:"#FFD6B8", border:"none", borderRadius:50,
            padding:"9px 18px", fontFamily:"'Nunito',sans-serif", fontWeight:800,
            fontSize:"0.9rem", cursor:"pointer", display:"flex", alignItems:"center", gap:6
          }}>
            🛒 Cart
            {cartCount > 0 && (
              <span style={{
                background:"#FF7B5C", color:"#fff", borderRadius:"50%",
                width:20, height:20, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:"0.72rem", fontWeight:900
              }}>{cartCount}</span>
            )}
          </button>
          <button style={{ padding:"9px 22px", borderRadius:50, background:"#FF7B5C", color:"#fff", border:"none", fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.9rem", cursor:"pointer" }}>Sign Up</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"70px 5% 50px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"center", position:"relative", zIndex:1 }}>
        <div className="fade-up">
          <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"clamp(2.6rem,5vw,4rem)", lineHeight:1.1, color:"#2D2235" }}>
            The Marketplace Made for{" "}
            <span style={{ color:"#FF7B5C", borderBottom:"5px solid #F5C842", paddingBottom:2 }}>Little Ones</span> 🍼
          </h1>
          <p style={{ marginTop:18, fontSize:"1.1rem", color:"#6B5E7A", lineHeight:1.7, maxWidth:440 }}>
            Buy & sell quality baby gear, kids clothes, toys and more — safely, affordably, and sustainably. Join 50,000+ happy parents.
          </p>
          <div style={{ marginTop:22, background:"#fff", borderRadius:50, display:"flex", boxShadow:"0 8px 28px rgba(0,0,0,0.1)", border:"2px solid #FFD6B8", overflow:"hidden", maxWidth:500 }}>
            <input placeholder="Search strollers, clothes, toys..." style={{ flex:1, padding:"13px 20px", border:"none", outline:"none", fontFamily:"'Nunito',sans-serif", fontSize:"0.95rem", background:"transparent" }}/>
            <button style={{ background:"#FF7B5C", color:"#fff", border:"none", padding:"12px 24px", fontFamily:"'Nunito',sans-serif", fontWeight:800, cursor:"pointer" }}>Search 🔍</button>
          </div>
          <div style={{ display:"flex", gap:12, marginTop:22 }}>
            <button style={{ padding:"14px 30px", borderRadius:50, background:"#FF7B5C", color:"#fff", border:"none", fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.95rem", cursor:"pointer" }}>🛍️ Shop Now</button>
            <button style={{ padding:"14px 30px", borderRadius:50, background:"#B8EFD8", color:"#2D2235", border:"none", fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.95rem", cursor:"pointer" }}>💚 Start Selling</button>
          </div>
          <div style={{ display:"flex", gap:28, marginTop:28 }}>
            {[["50K+","Happy Parents"],["120K+","Listings"],["4.9★","Avg Rating"]].map(([n,l]) => (
              <div key={l} style={{ textAlign:"center" }}>
                <strong style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.7rem", color:"#FF7B5C", display:"block" }}>{n}</strong>
                <span style={{ fontSize:"0.8rem", color:"#A89BB8", fontWeight:700 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual */}
        <div style={{ display:"flex", justifyContent:"center", position:"relative" }}>
          <div className="hero-float" style={{ width:260, borderRadius:26, background:"#fff", boxShadow:"0 20px 60px rgba(0,0,0,0.12)", overflow:"hidden" }}>
            <div style={{ height:180, background:"linear-gradient(135deg,#B8EFD8,#C3E8FF)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"5rem" }}>🛒</div>
            <div style={{ padding:16 }}>
              <span style={{ background:"#FFF0A0", color:"#2D2235", fontSize:"0.72rem", fontWeight:800, padding:"3px 10px", borderRadius:20 }}>🔥 Trending</span>
              <div style={{ fontWeight:800, marginTop:6 }}>Maxi-Cosi Stroller</div>
              <div style={{ color:"#FF7B5C", fontWeight:800, fontSize:"1.1rem", marginTop:4 }}>$89 <span style={{ color:"#A89BB8", fontSize:".85rem", fontWeight:400, textDecoration:"line-through" }}>$220</span></div>
            </div>
          </div>
          {[
            { style:{ top:16, right:-16 }, content:<>🌟 Just Sold! <span style={{color:"#FF7B5C"}}>+$45</span></> },
            { style:{ bottom:40, left:-24 }, content:<>💚 Eco-Friendly<br/><span style={{color:"#A89BB8",fontSize:".75rem"}}>Pre-loved</span></> },
          ].map((b,i) => (
            <div key={i} className="hero-float" style={{ position:"absolute", ...b.style, background:"#fff", borderRadius:14, padding:"10px 14px", boxShadow:"0 8px 24px rgba(0,0,0,0.1)", fontWeight:700, fontSize:"0.82rem", animationDelay:`${i*0.8}s` }}>{b.content}</div>
          ))}
        </div>
      </div>

      {/* Trust bar */}
      <div style={{ background:"#2D2235", padding:"16px 5%", display:"flex", gap:32, justifyContent:"center", flexWrap:"wrap", position:"relative", zIndex:1 }}>
        {["🔒 Secure Pay","🚚 Fast Delivery","💚 Eco Friendly","↩️ Easy Returns","✅ Verified Sellers"].map(t => (
          <div key={t} style={{ color:"#fff", fontWeight:700, fontSize:"0.88rem", display:"flex", alignItems:"center", gap:6 }}>{t}</div>
        ))}
      </div>

      {/* ── CATEGORIES ── */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"60px 5% 40px", position:"relative", zIndex:1 }}>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2.2rem", color:"#2D2235" }}>Shop by Category 🎀</h2>
        <p style={{ color:"#6B5E7A", marginBottom:28, marginTop:6 }}>Everything your little one needs, all in one place.</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:14 }}>
          {CATEGORIES.map(c => (
            <div key={c.name} className="fade-up" onClick={() => setAgeFilter("All Ages")} style={{
              background:"#fff", borderRadius:18, padding:"20px 12px", textAlign:"center",
              cursor:"pointer", border:"2px solid transparent", transition:"all .25s",
              boxShadow:"0 4px 14px rgba(0,0,0,0.06)"
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="#FF7B5C"; e.currentTarget.style.transform="translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="transparent"; e.currentTarget.style.transform=""; }}>
              <span style={{ fontSize:"2.2rem", display:"block", marginBottom:8 }}>{c.icon}</span>
              <div style={{ fontWeight:800, fontSize:"0.88rem" }}>{c.name}</div>
              <div style={{ fontSize:"0.74rem", color:"#A89BB8", marginTop:2 }}>{c.count}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"0 5% 60px", position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:14, marginBottom:16 }}>
          <div>
            <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2.2rem", color:"#2D2235", marginBottom:0 }}>Featured Deals ✨</h2>
            <p style={{ color:"#6B5E7A", fontSize:"0.95rem" }}>Hand-picked for quality and value</p>
          </div>
          <button style={{ padding:"9px 22px", borderRadius:50, background:"transparent", border:"2px solid #FF7B5C", color:"#FF7B5C", fontFamily:"'Nunito',sans-serif", fontWeight:800, cursor:"pointer" }}>View All →</button>
        </div>

        {/* Age filter pills */}
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:24 }}>
          {AGE_FILTERS.map(a => (
            <button key={a} onClick={() => setAgeFilter(a)} style={{
              padding:"7px 18px", borderRadius:50, fontWeight:700, fontSize:"0.85rem",
              cursor:"pointer", fontFamily:"'Nunito',sans-serif",
              background: ageFilter===a ? "#FF7B5C" : "#fff",
              color: ageFilter===a ? "#fff" : "#6B5E7A",
              border: ageFilter===a ? "2px solid #FF7B5C" : "2px solid #FFD6B8",
              transition:"all .2s"
            }}>{a}</button>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:20 }}>
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} onWish={toggleWish} wished={wished.has(p.id)} />
          ))}
        </div>
      </section>

      {/* ── SELL BANNER ── */}
      <div style={{
        maxWidth:1100, margin:"0 auto 60px", padding:"0 5%", position:"relative", zIndex:1
      }}>
        <div style={{
          background:"linear-gradient(135deg,#FF7B5C 0%,#FF4F8B 100%)",
          borderRadius:28, padding:"46px 48px",
          display:"grid", gridTemplateColumns:"1fr auto", gap:30, alignItems:"center", overflow:"hidden", position:"relative"
        }}>
          <div style={{ position:"absolute", right:-60, top:-60, width:260, height:260, background:"rgba(255,255,255,0.08)", borderRadius:"50%" }} />
          <div>
            <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.9rem", color:"#fff" }}>Turn Baby Gear into Cash 💰</h2>
            <p style={{ color:"rgba(255,255,255,0.85)", marginTop:8, fontSize:"1rem" }}>List pre-loved items in 60 seconds. Zero listing fees.</p>
            <button style={{ marginTop:20, background:"#fff", color:"#FF7B5C", padding:"13px 28px", borderRadius:50, fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.95rem", cursor:"pointer", border:"none" }}>🚀 Start Selling Today</button>
          </div>
          <div style={{ fontSize:"4rem", animation:"heroFloat 3s ease-in-out infinite" }}>👗🧸🛍️</div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"0 5% 60px", position:"relative", zIndex:1 }}>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2.2rem", color:"#2D2235" }}>How TinyNest Works 🌟</h2>
        <p style={{ color:"#6B5E7A", marginBottom:28, marginTop:6 }}>Simple, safe, and fast.</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:20 }}>
          {[["📸","List Your Item","Snap a photo, set your price — live in 60 seconds."],
            ["🔔","Get Notified","Instant alerts when buyers message or purchase."],
            ["📦","Ship or Meet","Discounted labels or safe local pickup."],
            ["💸","Get Paid Fast","Funds released within 24 hours of delivery."]].map(([icon,title,desc],i) => (
            <div key={i} className="fade-up" style={{ background:"#fff", borderRadius:22, padding:"30px 18px", textAlign:"center", boxShadow:"0 4px 16px rgba(0,0,0,0.06)", position:"relative" }}>
              <div style={{ position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)", background:"#FF7B5C", color:"#fff", width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"0.82rem" }}>{i+1}</div>
              <div style={{ fontSize:"2.6rem", marginBottom:12 }}>{icon}</div>
              <h3 style={{ fontWeight:800, marginBottom:6 }}>{title}</h3>
              <p style={{ fontSize:"0.88rem", color:"#6B5E7A", lineHeight:1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:"#2D2235", color:"#fff", padding:"44px 5% 28px", position:"relative", zIndex:1 }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:36, marginBottom:36, maxWidth:1200, margin:"0 auto 36px" }}>
          <div>
            <div style={{ fontFamily:"'Pacifico',cursive", fontSize:"1.5rem", color:"#FF7B5C", marginBottom:12 }}>🐣 TinyNest</div>
            <p style={{ fontSize:"0.88rem", color:"rgba(255,255,255,0.5)", lineHeight:1.7, maxWidth:230 }}>The safest marketplace for baby & kids items. Trusted by 50,000+ families worldwide.</p>
          </div>
          {[["Shop",["New Arrivals","Trending","Flash Deals","Categories"]],
            ["Sell",["Start Selling","Seller Guide","Pricing","Success Stories"]],
            ["Help",["Help Center","Safety Tips","Contact Us","Privacy Policy"]]].map(([title,links]) => (
            <div key={title}>
              <h4 style={{ fontWeight:800, marginBottom:12, fontSize:"0.9rem", color:"rgba(255,255,255,0.75)" }}>{title}</h4>
              {links.map(l => <div key={l} style={{ marginBottom:7 }}><a href="#" style={{ color:"rgba(255,255,255,0.45)", textDecoration:"none", fontSize:"0.88rem" }}>{l}</a></div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", maxWidth:1200, margin:"0 auto", flexWrap:"wrap", gap:10 }}>
          <p style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.35)" }}>© 2026 TinyNest Ltd. Made with 💛 for little ones everywhere.</p>
          <p style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.35)" }}>🌍 Worldwide · 🔒 Stripe · 📱 iOS & Android</p>
        </div>
      </footer>

    </div>
  );
}
