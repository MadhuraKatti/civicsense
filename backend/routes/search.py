from fastapi import APIRouter, Query

router = APIRouter(tags=["search"])

DATA = [
    {"id":"s1","type":"zone",   "title":"Zone R1 – Low Density Residential","description":"Single-family homes, max 2 floors, 40% FAR"},
    {"id":"s2","type":"zone",   "title":"Zone R2 – Medium Density Residential","description":"Apartments up to 4 floors, 80% FAR"},
    {"id":"s3","type":"zone",   "title":"Zone C1 – Neighbourhood Commercial","description":"Small shops and offices, mixed use permitted"},
    {"id":"s4","type":"zone",   "title":"Zone C2 – General Commercial","description":"Malls, hotels, large offices"},
    {"id":"s5","type":"zone",   "title":"Zone I1 – Light Industrial","description":"Manufacturing, warehouses, no heavy industry"},
    {"id":"s6","type":"scheme", "title":"PM Awas Yojana (Urban)","description":"Affordable housing subsidy for EWS/LIG families"},
    {"id":"s7","type":"scheme", "title":"Pradhan Mantri Ujjwala Yojana","description":"Free LPG connection for BPL households"},
    {"id":"s8","type":"scheme", "title":"Mudra Yojana – Shishu Loan","description":"Business loans up to ₹50,000 for micro enterprises"},
    {"id":"s9","type":"scheme", "title":"Atal Pension Yojana","description":"Government-backed pension for unorganised sector workers"},
    {"id":"s10","type":"issue", "title":"Gangapur Road Pothole Repair","description":"Critical road damage near Gangapur Dam approach"},
    {"id":"s11","type":"issue", "title":"Old Nashik Water Pipeline Leak","description":"Water wastage on Trimbak Road near temple area"},
    {"id":"s12","type":"issue", "title":"Panchavati Drainage Blockage","description":"Flooding during monsoon on Ram Ghat Road"},
    {"id":"s13","type":"alert", "title":"Zoning Bylaw Amendment 2024","description":"FSI limits revised for Satpur MIDC zone"},
    {"id":"s14","type":"alert", "title":"New Property Tax Rates Effective April","description":"NMC revises property tax slabs for residential properties"},
    {"id":"s15","type":"location","title":"Nashik Municipal Corporation Office","description":"Main NMC office, Rajwada Chowk, Nashik"},
    {"id":"s16","type":"location","title":"Gangapur Dam Catchment Area","description":"Protected water catchment – restricted construction zone"},
    {"id":"s17","type":"location","title":"Panchavati Heritage Zone","description":"Ram Ghat area – special heritage building regulations apply"},
    {"id":"s18","type":"location","title":"Satpur MIDC Industrial Area","description":"Dedicated industrial zone, western Nashik"},
]

@router.get("/search")
def search(q: str = Query("", min_length=0)):
    if not q.strip():
        return {"results": [], "query": q}
    q_lower = q.lower()
    results = [
        item for item in DATA
        if q_lower in item["title"].lower() or q_lower in item["description"].lower()
    ][:12]
    return {"results": results, "query": q, "count": len(results)}
