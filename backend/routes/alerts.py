from fastapi import APIRouter

router = APIRouter(tags=["alerts"])

ALERTS = [
    {"id":"a1","title":"Zoning Bylaw Amendment 2024","description":"FSI limits revised for Satpur MIDC zone. Effective 1 April 2024.","type":"policy","location":"Satpur MIDC","severity":"high","timestamp":"2h ago"},
    {"id":"a2","title":"New Property Tax Rates","description":"NMC revises residential property tax slabs. Submit objections by March 31.","type":"tax","location":"All Nashik zones","severity":"high","timestamp":"5h ago"},
    {"id":"a3","title":"Gangapur Road Closure","description":"Road closed for resurfacing near Dam approach. Use alternate via Trimbak Road.","type":"infrastructure","location":"Gangapur Road","severity":"medium","timestamp":"1d ago"},
    {"id":"a4","title":"Heritage Zone Regulation Update","description":"New guidelines for construction near Ram Ghat area under heritage protection rules.","type":"heritage","location":"Panchavati","severity":"medium","timestamp":"2d ago"},
    {"id":"a5","title":"PM Awas Yojana Applications Open","description":"New round of applications open for affordable housing scheme. Last date: 15 April.","type":"scheme","location":"All zones","severity":"low","timestamp":"3d ago"},
    {"id":"a6","title":"NMC Online Portal Maintenance","description":"Citizen portal down for scheduled maintenance on Saturday 2–6 AM.","type":"system","location":"Online","severity":"info","timestamp":"3d ago"},
]

@router.get("/alerts")
def get_alerts():
    return {"alerts": ALERTS, "count": len(ALERTS)}
