#!/usr/bin/env python3
"""
notus_kyc_flow.py
Fluxo KYC com Notus API:
- Lê body JSON (que define a categoria do documento)
- Cria sessão
- Faz upload (1 ou 2 arquivos, conforme categoria)
- Chama process
- Poll a cada 10s até status != VERIFYING

Categorias suportadas:
  - PASSPORT           → requer --front
  - DRIVERS_LICENSE    → requer --front e --back
  - IDENTITY_CARD      → requer --front e --back

Usage:
  export NOTUS_API_KEY="sk_..."
  python notus_kyc_flow.py --body body.json --front front.jpg [--back back.jpg]
"""

import argparse
import json
import os
import time
from typing import Dict, Any
import requests

BASE_URL = "https://api.notus.team/api/v1"
DEFAULT_POLL_INTERVAL = 10  # seconds


def log(msg: str):
    """Imprime mensagens com timestamp."""
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {msg}")


def load_body(path: str) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def print_http_response(label: str, resp: requests.Response):
    log(f"{label} - HTTP {resp.status_code}")
    print("Headers:")
    for k, v in resp.headers.items():
        print(f"  {k}: {v}")
    print("Body:")
    try:
        print(json.dumps(resp.json(), indent=2))
    except Exception:
        print(resp.text)
    print("-" * 80)


def check_success(resp: requests.Response, context: str):
    if not (200 <= resp.status_code < 300):
        raise SystemExit(f"ERROR: {context} failed with HTTP {resp.status_code}")


def create_session(api_key: str, body: Dict[str, Any]) -> requests.Response:
    url = f"{BASE_URL}/kyc/individual-verification-sessions/standard"
    headers = {"x-api-key": api_key, "Content-Type": "application/json"}
    log("[Create Session] POST body:")
    print(json.dumps(body, indent=2))
    print("-" * 80)
    resp = requests.post(url, headers=headers, json=body, timeout=30)
    print_http_response("[Create Session] Response", resp)
    check_success(resp, "Create session")
    return resp


def upload_to_presigned(url: str, fields: Dict[str, Any], file_path: str) -> requests.Response:
    """Performs multipart/form-data POST to the presigned S3 URL."""
    data = dict(fields)
    log(f"[Upload to S3] POST body fields for {file_path}:")
    print(json.dumps(data, indent=2))
    print("-" * 80)
    with open(file_path, "rb") as f:
        files = {"file": (os.path.basename(file_path), f)}
        resp = requests.post(url, data=data, files=files, timeout=60)
    print_http_response(f"[Upload to S3] Response for {file_path}", resp)
    check_success(resp, f"Upload {file_path}")
    return resp


def process_session(api_key: str, session_id: str) -> requests.Response:
    url = f"{BASE_URL}/kyc/individual-verification-sessions/standard/{session_id}/process"
    headers = {"x-api-key": api_key, "Content-Type": "application/json"}
    body = {}
    log("[Process Session] POST body:")
    print(json.dumps(body, indent=2))
    print("-" * 80)
    resp = requests.post(url, headers=headers, json=body, timeout=30)
    print_http_response("[Process Session] Response", resp)
    check_success(resp, "Process session")
    return resp


def get_session_result(api_key: str, session_id: str) -> requests.Response:
    url = f"{BASE_URL}/kyc/individual-verification-sessions/standard/{session_id}"
    headers = {"x-api-key": api_key}
    log("[Get Session Result] Requesting current status...")
    resp = requests.get(url, headers=headers, timeout=20)
    print_http_response("[Get Session Result] Response", resp)
    check_success(resp, "Get result")
    return resp


def extract_category(body: Dict[str, Any]) -> str:
    """Obtém a categoria do documento do body."""
    if "document" in body and isinstance(body["document"], dict):
        return body["document"].get("category", "").upper()
    if "documentCategory" in body:
        return str(body["documentCategory"]).upper()
    return ""


def main():
    parser = argparse.ArgumentParser(description="NotusLabs KYC flow helper")
    parser.add_argument("--body", required=True, help="Path to JSON body for Create session")
    parser.add_argument("--front", required=True, help="Path to front (or single) image file")
    parser.add_argument("--back", required=False, help="Path to back image file (if applicable)")
    parser.add_argument("--api-key", default=None, help="Notus API key (env NOTUS_API_KEY if not provided)")
    parser.add_argument("--poll-interval", type=int, default=DEFAULT_POLL_INTERVAL, help="Polling interval seconds")
    args = parser.parse_args()

    api_key = args.api_key or os.getenv("NOTUS_API_KEY")
    if not api_key:
        raise SystemExit("ERROR: API key not provided. Set NOTUS_API_KEY or use --api-key.")

    # 1) Load body
    body = load_body(args.body)
    category = extract_category(body)

    if category not in ("PASSPORT", "DRIVERS_LICENSE", "IDENTITY_CARD"):
        raise SystemExit(f"ERROR: Unknown or missing document category '{category}' in body.")

    log(f"Detected document category: {category}")

    # Validate presence of --back if required
    if category in ("DRIVERS_LICENSE", "IDENTITY_CARD") and not args.back:
        raise SystemExit(f"ERROR: Category '{category}' requires both --front and --back images.")

    # 2) Create session
    create_resp = create_session(api_key, body)
    created = create_resp.json()

    # Extract sessionId
    session_id = (
        created.get("session", {}).get("id")
        or created.get("sessionId")
        or created.get("id")
        or created.get("session_id")
    )
    if not session_id:
        raise SystemExit("ERROR: Could not locate session id in create response.")
    log(f"Session ID: {session_id}")

    # Extract presigned uploads
    front_upload = (
        created.get("frontDocumentUpload")
        or created.get("documentUpload")
        or created.get("data", {}).get("frontDocumentUpload")
    )
    back_upload = (
        created.get("backDocumentUpload")
        or created.get("data", {}).get("backDocumentUpload")
    )

    if category == "PASSPORT":
        if not front_upload:
            raise SystemExit("ERROR: Missing presigned upload for PASSPORT.")
        upload_to_presigned(front_upload["url"], front_upload.get("fields", {}), args.front)
    else:
        if not front_upload or not back_upload:
            raise SystemExit("ERROR: Missing front/back presigned uploads in response.")
        upload_to_presigned(front_upload["url"], front_upload.get("fields", {}), args.front)
        upload_to_presigned(back_upload["url"], back_upload.get("fields", {}), args.back)

    # 3) Process session
    process_resp = process_session(api_key, session_id)
    log("Process session completed.")
    #print(json.dumps(process_resp.json(), indent=2))
    print(process_resp)
    print("-" * 80)

    # 4) Poll for status
    log(f"Polling for result every {args.poll_interval} seconds...")
    while True:
        res = get_session_result(api_key, session_id)
        result_json = res.json()
        status = (
            result_json.get("session", {}).get("status")
            or result_json.get("status")
            or result_json.get("data", {}).get("session", {}).get("status")
        )
        log(f"Current status = {status}")
        if status and status != "VERIFYING":
            log("Final status reached.")
            print(json.dumps(result_json, indent=2))
            break
        time.sleep(args.poll_interval)


if __name__ == "__main__":
    main()

