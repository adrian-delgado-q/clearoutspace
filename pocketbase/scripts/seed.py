#!/usr/bin/env python3
"""
seed.py — Seeds the listings collection with sample data if it is empty.
Safe to run on every boot (idempotent — checks record count first).
"""
import json, os, sys, urllib.request, urllib.error

PB       = os.environ.get("PB_HTTP", "http://localhost:8090")
EMAIL    = os.environ.get("PB_SUPERUSER_EMAIL")
PASSWORD = os.environ.get("PB_SUPERUSER_PASSWORD")

if not EMAIL or not PASSWORD:
    print("[seed] Error: PB_SUPERUSER_EMAIL and PB_SUPERUSER_PASSWORD must be set.")
    sys.exit(1)


def pb_request(path, method="GET", data=None, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = token
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(PB + path, data=body, headers=headers, method=method)
    try:
        res = urllib.request.urlopen(req)
        return json.loads(res.read()), res.status
    except urllib.error.HTTPError as e:
        return json.loads(e.read()), e.code


def authenticate():
    data, status = pb_request(
        "/api/collections/_superusers/auth-with-password",
        method="POST",
        data={"identity": EMAIL, "password": PASSWORD},
    )
    if status != 200:
        print("[seed] Auth failed:", data)
        sys.exit(1)
    return data["token"]


SAMPLE_LISTINGS = [
    {
        "title": "IKEA KALLAX Shelf Unit (2x4)",
        "slug": "ikea-kallax-shelf-2x4",
        "price": 60, "currency": "CAD",
        "area": "North York",
        "availableUntil": "2026-03-15",
        "pickupWindowText": "Weekends 10am-4pm",
        "pickupNotes": "Ground floor unit, no elevator needed.",
        "condition": "Good",
        "dimensions": "77cm W x 147cm H x 39cm D",
        "description": "<p>White KALLAX 2x4 shelf in good condition. A few minor scuffs on the base but otherwise solid. Includes 2 door inserts. Buyer must bring help to carry.</p>",
        "status": "Available", "category": "Furniture",
        "tags": "ikea,shelf,storage,kallax", "isFeatured": True, "managedBy": True,
    },
    {
        "title": "Dyson V8 Cordless Vacuum",
        "slug": "dyson-v8-cordless-vacuum",
        "price": 175, "currency": "CAD",
        "area": "Etobicoke",
        "availableUntil": "2026-03-20",
        "pickupWindowText": "Evenings after 6pm or Saturdays",
        "pickupNotes": "Comes with all original attachments and charger.",
        "condition": "Like New",
        "dimensions": "N/A",
        "description": "<p>Dyson V8 Animal in like-new condition. All attachments included. Battery holds 30+ minutes on low suction.</p>",
        "status": "Available", "category": "Appliances",
        "tags": "dyson,vacuum,cordless", "isFeatured": True, "managedBy": True,
    },
    {
        "title": "Queen Bed Frame with Upholstered Headboard",
        "slug": "queen-bed-frame-upholstered-headboard",
        "price": 120, "currency": "CAD",
        "area": "Scarborough",
        "availableUntil": "2026-03-10",
        "pickupWindowText": "Flexible, contact to arrange",
        "pickupNotes": "Disassembled and ready. Buyer brings own transport.",
        "condition": "Good",
        "dimensions": "160cm W x 210cm L",
        "description": "<p>Grey upholstered queen bed frame with tall wingback headboard. Slats included, no box spring needed. Minor wear on legs.</p>",
        "status": "Pending", "category": "Furniture",
        "tags": "bed,queen,bedroom,frame", "isFeatured": False, "managedBy": True,
    },
    {
        "title": "Nespresso Vertuo Next Coffee Machine",
        "slug": "nespresso-vertuo-next",
        "price": 55, "currency": "CAD",
        "area": "Downtown Toronto",
        "availableUntil": "2026-04-01",
        "pickupWindowText": "Weekdays 5-8pm, Sundays anytime",
        "pickupNotes": "Machine has been descaled and cleaned. No pods included.",
        "condition": "Like New",
        "dimensions": "16cm W x 33cm H x 42cm D",
        "description": "<p>Nespresso Vertuo Next in Matte Black. Works perfectly. Descaled twice, always used filtered water. Original box available.</p>",
        "status": "Available", "category": "Kitchen",
        "tags": "nespresso,coffee,kitchen", "isFeatured": False, "managedBy": False,
    },
]


def main():
    token = authenticate()

    # Check if listings collection already has records
    data, status = pb_request("/api/collections/listings/records?perPage=1", token=token)
    if status != 200:
        print("[seed] Could not read listings collection — run setup.py first")
        sys.exit(1)

    total = data.get("totalItems", 0)
    if total > 0:
        print(f"[seed] Collection already has {total} record(s) — skipping seed")
        return

    print("[seed] Collection is empty, seeding sample data...")
    headers_auth = token
    for listing in SAMPLE_LISTINGS:
        res, status = pb_request("/api/collections/listings/records", method="POST", data=listing, token=token)
        if status == 200:
            print(f"[seed]   + {res['title']}")
        else:
            print(f"[seed]   ! Failed to create '{listing['title']}': {res}")

    print("[seed] Done")


if __name__ == "__main__":
    main()
