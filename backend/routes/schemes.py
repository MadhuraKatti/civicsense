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
    age = int(user.get("age", 0))

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

        # AGE MIN
        if "age_min" in rules and age < rules["age_min"]:
            eligible = False

# AGE MAX
        if "age_max" in rules and age > rules["age_max"]:
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
               if property_status in ["own residential", "own commercial"]:
                 eligible = False

        if eligible:
            results.append({
                "name": s.name,
                "description": s.description,
                "benefit": s.benefit,
                "category": s.category,
                "deadline": s.deadline,
                "apply_link": s.apply_link
            })

    return {
        "count": len(results),
        "schemes": results
    }