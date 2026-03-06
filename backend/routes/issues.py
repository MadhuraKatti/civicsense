from fastapi import APIRouter

router = APIRouter(tags=["issues"])

ISSUES = [
    {"id":"i1","title":"Pothole – Gangapur Road","type":"road","lat":20.003,"lng":73.768,"severity":"high","zone":"R2"},
    {"id":"i2","title":"Pipeline Leak – Trimbak Road","type":"water","lat":19.993,"lng":73.789,"severity":"medium","zone":"C1"},
    {"id":"i3","title":"Street Light Failure – Panchavati","type":"electricity","lat":19.999,"lng":73.780,"severity":"low","zone":"heritage"},
    {"id":"i4","title":"Drainage Block – Ram Ghat Road","type":"drainage","lat":19.996,"lng":73.778,"severity":"high","zone":"heritage"},
    {"id":"i5","title":"Illegal Construction – Satpur","type":"zoning","lat":19.978,"lng":73.745,"severity":"medium","zone":"I1"},
]

@router.get("/issues")
def get_issues():
    return {"issues": ISSUES, "count": len(ISSUES)}
