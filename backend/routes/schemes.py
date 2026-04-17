import json
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models import Scheme

router = APIRouter(prefix="/schemes")


class ProfileRequest(BaseModel):
    age: int = 0
    inc: str = ""
    occ: str = ""
    city: str = "Nashik"
    prop: str = ""
    dis: str = "No"


@router.post("/check")
def check_eligibility(profile: ProfileRequest, db: Session = Depends(get_db)):
    schemes = db.query(Scheme).all()
    results = []

    # ── Income map ─────────────────────────────────────────────────
    income_map = {
        "Below ₹1L":  100_000,
        "₹1L–₹3L":    300_000,
        "₹3L–₹6L":    600_000,
        "₹6L–₹12L": 1_200_000,
        "Above ₹12L": 2_000_000,
    }

    age             = profile.age
    income          = income_map.get(profile.inc, 0)
    occupation      = profile.occ.lower()
    disability      = profile.dis.lower()
    property_status = profile.prop.lower()

    for s in schemes:
        # FIX: rules is stored as a JSON string — parse it before use
        try:
            rules = json.loads(s.rules) if isinstance(s.rules, str) else (s.rules or {})
        except (json.JSONDecodeError, TypeError):
            rules = {}

        eligible = True

        if "age_min" in rules and age < rules["age_min"]:
            eligible = False
        if "age_max" in rules and age > rules["age_max"]:
            eligible = False
        if "income_max" in rules and income > rules["income_max"]:
            eligible = False
        if "occupation" in rules and occupation != rules["occupation"].lower():
            eligible = False
        if "disability_required" in rules:
            if rules["disability_required"] == "yes" and "yes" not in disability:
                eligible = False
        if "property_required" in rules:
            if rules["property_required"] == "no_pucca_house":
                if property_status in ["own residential", "own commercial"]:
                    eligible = False

        if eligible:
            results.append(
                {
                    "name":       s.name,
                    "description": s.description,
                    "benefit":    s.benefit,
                    "category":   s.category,
                    "deadline":   s.deadline,
                    "apply_link": s.apply_link,
                }
            )

    return {"count": len(results), "schemes": results}
