def match_schemes(profile):

    schemes = [
        {
            "name": "PM Awas Yojana",
            "ministry": "Ministry of Housing",
            "desc": "Affordable housing scheme",
            "benefit": "Interest subsidy up to ₹2.67L",
            "cat": "Housing",
            "dl": "31 Mar 2026"
        },
        {
            "name": "PM Mudra Yojana",
            "ministry": "Ministry of Finance",
            "desc": "Loans for small businesses",
            "benefit": "Loans up to ₹10L",
            "cat": "Business",
            "dl": "Rolling"
        }
    ]

    results = []

    for s in schemes:

        score = 60

        if profile["inc"] in ["Below ₹1L","₹1L–₹3L","₹3L–₹6L"]:
            score += 20

        if profile["occ"] in ["Self-Employed","Business Owner"]:
            score += 10

        if score > 80:
            status = "likely"
        elif score > 60:
            status = "possible"
        else:
            status = "unlikely"

        results.append({
            "name": s["name"],
            "ministry": s["ministry"],
            "desc": s["desc"],
            "score": score,
            "status": status,
            "benefit": s["benefit"],
            "cat": s["cat"],
            "dl": s["dl"]
        })

    return results