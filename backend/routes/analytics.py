from fastapi import APIRouter

router = APIRouter()

@router.get("/analytics/dashboard")
def dashboard():

    return {
        "stats":[
            {"label":"Total Queries","value":12847,"change":12},
            {"label":"Policy Questions","value":5234,"change":8},
            {"label":"Zone Lookups","value":4102,"change":10},
            {"label":"Scheme Searches","value":3511,"change":5}
        ],

        "line":[3200,3800,3400,4200,5100,4800,5400,6200],

        "bar":[
            {"l":"Mon","v":8200},
            {"l":"Tue","v":9400},
            {"l":"Wed","v":7800},
            {"l":"Thu","v":10200},
            {"l":"Fri","v":11600}
        ],

        "pie":[
            {"l":"Housing","v":38},
            {"l":"Policy","v":27},
            {"l":"Zoning","v":22},
            {"l":"Business","v":13}
        ],

        "recent":[
            {
                "q":"FAR limits for commercial zones?",
                "cat":"Zoning",
                "loc":"Nashik",
                "t":"10:32 AM"
            },
            {
                "q":"PMAY eligibility requirements",
                "cat":"Schemes",
                "loc":"Nashik",
                "t":"11:10 AM"
            }
        ]
    }