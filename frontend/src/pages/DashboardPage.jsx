import { Ico } from "../icons/index.jsx";
import { STATS_DATA, TABLE_DATA } from "../data/index.js";
import Spark from "../components/Spark.jsx";
import MBar from "../components/MBar.jsx";
import Donut from "../components/Donut.jsx";

const LINE_D = [
3200,3800,3400,4200,5100,4800,5400,6200,5800,6800,7200,8100,
7600,8400,9200,9800,10200,11000,10600,11400,12000,11800,12400,12847
];

const BAR_D = [
{ l:"Mon",v:8200 },
{ l:"Tue",v:9400 },
{ l:"Wed",v:7800 },
{ l:"Thu",v:10200 },
{ l:"Fri",v:11600 },
{ l:"Sat",v:9800 },
{ l:"Sun",v:12847 }
];

const PIE_D = [
{ l:"Housing",v:38,c:"#1d8cf8" },
{ l:"Policy",v:27,c:"#00c48c" },
{ l:"Zoning",v:22,c:"#9b7fea" },
{ l:"Business",v:13,c:"#3dabff" }
];

const ICO_MAP = {
Bot: Ico.Bot,
File: Ico.File,
Map: Ico.Map,
Star: Ico.Star
};

export default function DashboardPage() {

return (

<div className="dash-wrap">

<div className="dash-hd">

<div>
<div className="dash-title">Authority Dashboard</div>
<div className="dash-sub">
Maharashtra Region · Real-time civic intelligence
</div>
</div>

<div className="live-tag">
<div className="live-pip" />
Live
</div>

</div>

<div className="bento">

{STATS_DATA.map((s,i)=>{

const C = ICO_MAP[s.ic];

return (

<div key={i} className={`bc bs${i+1}`}>

<div className="stat-ico" style={{
background:s.g,
boxShadow:"0 4px 14px rgba(0,0,0,.35)"
}}>

<div style={{color:"white"}}>
<C/>
</div>

</div>

<div className="stat-n">{s.val}</div>
<div className="stat-l">{s.lbl}</div>
<div className="stat-d">↑ {s.d} vs yesterday</div>

</div>

)

})}

<div className="bc bline">

<div className="ct">
Daily Citizen Queries
<span className="cpill">Last 24 days</span>
</div>

<Spark data={LINE_D} color="#1d8cf8" h={108}/>

</div>

<div className="bc bpie">

<div className="ct">Query Breakdown</div>

<Donut data={PIE_D}/>

</div>

<div className="bc bbar">

<div className="ct">
Weekly Volume
<span className="cpill">This week</span>
</div>

<MBar data={BAR_D}/>

</div>

<div className="bc btbl">

<div className="bt-hd">

<div style={{
fontWeight:600,
fontSize:14,
color:"var(--white)"
}}>
Recent Citizen Queries
</div>

</div>

<div className="bt">

<table>

<thead>
<tr>
<th>Question</th>
<th>Category</th>
<th>Location</th>
<th>Time</th>
</tr>
</thead>

<tbody>

{TABLE_DATA.map((r,i)=>(

<tr key={i}>
<td style={{fontWeight:500}}>{r.q}</td>
<td>
<span className={`ctag ${r.cat}`}>{r.cat}</span>
</td>
<td style={{color:"var(--white3)"}}>{r.loc}</td>
<td style={{
color:"var(--white3)",
fontSize:12
}}>
{r.t}
</td>
</tr>

))}

</tbody>

</table>

</div>

</div>

</div>

</div>

)

}
