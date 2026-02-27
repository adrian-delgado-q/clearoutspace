#!/usr/bin/env python3
"""
setup.py — Creates PocketBase collections if they do not already exist.
Safe to run on every boot (idempotent).
"""
import json, os, sys, urllib.request, urllib.error

PB       = os.environ.get("PB_HTTP", "http://localhost:8090")
EMAIL    = os.environ.get("PB_SUPERUSER_EMAIL")
PASSWORD = os.environ.get("PB_SUPERUSER_PASSWORD")

if not EMAIL or not PASSWORD:
    print("[setup] Error: PB_SUPERUSER_EMAIL and PB_SUPERUSER_PASSWORD must be set.")
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
        print("[setup] Auth failed:", data)
        sys.exit(1)
    return data["token"]


def collection_exists(token, name):
    _, status = pb_request(f"/api/collections/{name}", token=token)
    return status == 200


def create_listings_collection(token):
    collection = {
        "name": "listings",
        "type": "base",
        "fields": [
            {"name": "title",            "type": "text",   "required": True},
            {"name": "slug",             "type": "text",   "required": True, "unique": True},
            {"name": "price",            "type": "number", "required": True},
            {"name": "currency",         "type": "select", "required": True, "values": ["CAD", "USD"], "maxSelect": 1},
            {"name": "area",             "type": "text"},
            {"name": "availableUntil", "type": "date"},
            {"name": "pickupWindowText", "type": "text"},
            {"name": "pickupNotes",      "type": "text"},
            {"name": "condition",        "type": "select", "values": ["New", "Like New", "Good", "Fair"], "maxSelect": 1},
            {"name": "dimensions",       "type": "text"},
            {"name": "description",      "type": "editor"},
            {"name": "images",           "type": "file", "maxSelect": 10, "mimeTypes": ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]},
            {"name": "status",           "type": "select", "required": True, "values": ["Available", "Pending", "Sold"], "maxSelect": 1, "presentable": True},
            {"name": "category",         "type": "text"},
            {"name": "tags",             "type": "text"},
            {"name": "isFeatured",       "type": "bool"},
            {"name": "managedBy",        "type": "bool"},
            {"name": "created",          "type": "autodate", "onCreate": True, "onUpdate": False},
            {"name": "updated",          "type": "autodate", "onCreate": True, "onUpdate": True},
        ],
        "listRule":   "",
        "viewRule":   "",
        "createRule": None,
        "updateRule": None,
        "deleteRule": None,
    }
    data, status = pb_request("/api/collections", method="POST", data=collection, token=token)
    if status == 200:
        print(f"[setup] Collection 'listings' created (id: {data.get('id')})")
    else:
        print("[setup] Failed to create 'listings':", data)
        sys.exit(1)


def main():
    token = authenticate()

    if collection_exists(token, "listings"):
        print("[setup] Collection 'listings' already exists — skipping")
    else:
        create_listings_collection(token)


if __name__ == "__main__":
    main()
