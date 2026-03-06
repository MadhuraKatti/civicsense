from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Scheme

router = APIRouter(prefix="/schemes")


@router.post("/check")
def check_eligibility(user: dict, db: Session = Depends(get_db)):

    schemes = db.query(Scheme).all()
    results = []

    # -------- AGE PARSING --------
    age_value = user.get("age", "0")

    if isinstance(age_value, str) and "–" in age_value:
        age = int(age_value.split("–")[0])
    else:
        age = int(age_value)

    # -------- INCOME PARSING --------
    income_map = {
        "Below ₹1L": 100000,
        "₹1L–₹3L": 300000,
        "₹3L–₹6L": 600000,
        "₹6L–₹12L": 1200000,
        "Above ₹12L": 2000000
    }

    income = income_map.get(user.get("inc"), 0)

    occupation = user.get("occ", "").lower()
    disability = user.get("dis", "").lower()
    property_status = user.get("prop", "").lower()

    # -------- SCHEME LOOP --------
    for s in schemes:

        rules = s.rules or {}
        eligible = True

        if "age_min" in rules and age < rules["age_min"]:
            eligible = False

        if "income_max" in rules and income > rules["income_max"]:
            eligible = False

        if "occupation" in rules and occupation != rules["occupation"]:
            eligible = False

        if "disability_required" in rules:
            if rules["disability_required"] == "yes" and disability == "no":
                eligible = False

        if "property_required" in rules:
            if rules["property_required"] == "no_pucca_house":
                if property_status not in ["no property", "renting"]:
                    eligible = False

        if eligible:
            results.append({
                "name": s.name,
                "description": s.description,
                "benefit": s.benefit,
                "category": s.category,
                "deadline": s.deadline
            })

    return {
        "count": len(results),
        "schemes": results
    }