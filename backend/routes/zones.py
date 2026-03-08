from fastapi import APIRouter

router = APIRouter()

@router.get("/zones")
def get_zones():

    return [
        {
            "id":1,
            "name":"Gangapur Road",
            "type":"Commercial",
            "far":2.5,
            "ht":"18m (G+5)",
            "permits":[
                "Building Permission",
                "Fire Safety NOC"
            ],
            "x":36,
            "y":12,
            "w":20,
            "h":32,
            "color":"#00c48c"
        },
        {
            "id":2,
            "name":"College Road",
            "type":"Residential",
            "far":1.5,
            "ht":"12m (G+3)",
            "permits":[
                "Building Permission"
            ],
            "x":8,
            "y":20,
            "w":22,
            "h":25,
            "color":"#1d8cf8"
        }
    ]