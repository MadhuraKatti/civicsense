def civic_ai(message: str):

    m = message.lower()

    if "far" in m or "zoning" in m:
        return {
            "summary": "Based on Maharashtra DCR 2017 regulations.",
            "rules": [
                "FAR: 1.5× for most residential zones",
                "Maximum height: G+3 (~12m)",
                "Minimum setbacks required on all sides"
            ],
            "permits": [
                "Building Permission — NMC",
                "Fire Safety NOC"
            ],
            "refs": [
                "MH DCR 2017",
                "NMC Building Bye-Laws"
            ]
        }

    if "scheme" in m:
        return {
            "summary": "Several government schemes support housing and businesses.",
            "rules": [],
            "permits": [],
            "refs": [
                "PMAY",
                "PM Mudra Yojana"
            ]
        }

    return {
        "summary": "I can help with zoning rules, permits, and schemes.",
        "rules": [],
        "permits": [],
        "refs": []
    }