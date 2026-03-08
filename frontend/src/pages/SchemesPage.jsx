import { useState } from "react";
import { Ico } from "../icons/index.jsx";
import { checkSchemes } from "../api/api";

const FIELDS = [
{ k: "age",  lbl: "Age", type: "n" },
{ k: "inc",  lbl: "Annual Income",    type: "s", opts: ["Below ₹1L","₹1L–₹3L","₹3L–₹6L","₹6L–₹12L","Above ₹12L"] },
{ k: "occ",  lbl: "Occupation",       type: "s", opts: ["Salaried","Self-Employed","Business Owner","Student","Farmer","Unemployed"] },
{ k: "city", lbl: "City",             type: "i" },
{ k: "prop", lbl: "Property Status",  type: "s", opts: ["No Property","Renting","Own Residential","Own Commercial"] },
{ k: "dis",  lbl: "Disability Status",type: "s", opts: ["No","Yes — PwD Certificate","Partial Disability"] },
];

export default function SchemesPage() {

const [done, setDone] = useState(false);
const [schemes, setSchemes] = useState([]);

const [form, setForm] = useState({
age: "",
inc: "",
occ: "",
city: "Nashik",
prop: "",
dis: "No"
});



/* ---------------- AGE RANGE → NUMBER ---------------- */

const parseAge = (range) => {

if (!range) return 0

if (range.includes("–")) {
return parseInt(range.split("–")[0])
}

if (range.includes("+")) {
return parseInt(range.replace("+",""))
}

return parseInt(range)

}



/* ---------------- ANALYSE ---------------- */

const analyse = async () => {

try {

const payload = {
...form,
age: parseInt(form.age)
}

const res = await checkSchemes(payload)

setSchemes(res.schemes || [])
setDone(true)

} catch (err) {

console.error(err)

}

};



return (

<div className="sch-wrap">

{/* LEFT PANEL */}

<div className="sfc">

<div className="sfc-top">

<div className="sfc-title">
Eligibility <br/> Checker
</div>

<div className="sfc-sub">
Complete your profile to discover schemes you qualify for.
</div>

<div className="sfc-div"/>

</div>

<div className="sfc-fields">

{FIELDS.map(f => (

<div key={f.k}>

<label className="flbl">{f.lbl}</label>

{f.type === "s" ? (

<select
className="fsel"
value={form[f.k]}
onChange={e => setForm({ ...form, [f.k]: e.target.value })}
>

<option value="">Select…</option>

{f.opts.map(o => (
<option key={o} value={o}>{o}</option>
))}

</select>

) : f.type === "n" ? (

<input
type="number"
className="finp"
value={form[f.k]}
onChange={e => setForm({ ...form, [f.k]: e.target.value })}
placeholder={`Enter ${f.lbl}`}
/>

) : (

<input
className="finp"
value={form[f.k]}
onChange={e => setForm({ ...form, [f.k]: e.target.value })}
placeholder={`Enter ${f.lbl}`}
/>

)}

</div>

))}

<button className="chkbtn" onClick={analyse}>
Analyse My Eligibility →
</button>

</div>

</div>



{/* RIGHT PANEL */}

<div className="src">

{!done ? (

<div className="empty">

<div className="empty-ico">🏛️</div>

<div
style={{
fontFamily: "'Syne',sans-serif",
fontSize: 20,
fontWeight: 700,
color: "var(--white)"
}}
>
Find Your Schemes
</div>

<div
style={{
fontSize: 13,
color: "var(--white3)",
maxWidth: 300,
lineHeight: 1.6
}}
>
Fill in your profile and let CivicSense AI match you with
the right government schemes.
</div>

</div>

) : (

<>

<div className="sr-hd">

<div className="sr-title">
Matched Schemes
</div>

<div className="sr-badge">
{schemes.length} Matches
</div>

</div>

{schemes.length === 0 && (

<div className="empty">

<div className="empty-ico">❌</div>

<div style={{color:"white"}}>
No schemes found for this profile
</div>

</div>

)}

{schemes.map((s,i)=>(

<div
key={i}
className="sc likely"
style={{animationDelay:`${i*0.05}s`}}
>

<div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>

<div>

<div className="sc-name">
{s.name}
</div>

<div className="sc-min">
{s.ministry}
</div>

</div>

<div className="sc-st likely">
Eligible
</div>

</div>

<div className="sc-desc">
{s.description}
</div>

<div className="sc-ben">
💰 {s.benefit}
</div>

<div className="sc-foot">

<div className="sctags">

<span className="sctag cat">
{s.category}
</span>

<span className="sctag dl">
Due: {s.deadline}
</span>

</div>

<a
  href={s.apply_link}
  target="_blank"
  rel="noopener noreferrer"
>
  <button className="aplbtn">
    Apply Now →
  </button>
</a>

</div>

</div>

))}

</>

)}

</div>

</div>

)

}