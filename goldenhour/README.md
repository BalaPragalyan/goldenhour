# GoldenHour — Pre-Hospital Emergency Telemetry Gateway

> **"Every Second Before Arrival Matters."**
> A modern, responsive healthcare technology website and operational emergency dashboard connecting ambulances with receiving hospitals in real time.

---

## 🚑 Project Overview

When an ambulance transports an injured patient, the hospital often does not know the patient's condition until physical arrival, leaving trauma teams with little time to prepare.

**GoldenHour** bridges this critical pre-hospital communication gap by streaming available patient vital signs, injury details, GPS tracking, and AI-synthesized handover summaries to the receiving trauma center while the ambulance is en route.

---

## 🌟 Core Modules & Capabilities

1. **Home Overview (`#/home`)**
   - Live telemetry hero preview with animated radar beacon.
   - Clinical challenge explanation ("The Emergency Starts Before the Hospital Door").
   - 4-step pipeline: Capture → Transmit → Coordinate → Prepare.
   - 8 core capability cards and dependable communication architecture.

2. **Incoming Patient (`#/patient`)**
   - 3-column operational trauma dashboard for Patient **GH-1042** (Ambulance **AMB-07**).
   - 4 vital sign cards with live waveforms and freshness status:
     - **Blood Pressure:** 120/80 mmHg (MAP 93 mmHg)
     - **SpO₂:** 88% (*Clinical Warning: Desaturation alert*)
     - **Pulse:** 120 bpm (*Elevated: Sinus Tachycardia*)
     - **EtCO₂:** 42 mmHg (*Unstable Sidestream Sampling notice*)
   - Reported injury details (Suspected lower-limb trauma, RTA mechanism).
   - Reported care requirements & resource preparation notes.
   - ETA timeline with traffic delay progression.
   - Chronological activity feed and audit trail.

3. **Network Loss Safe Mode (`#/network`)**
   - 5 distinct connection states: `Connected`, `Weak Connection`, `Offline / Safe Mode`, `Syncing`, `Synced`.
   - Local storage queue inspector (12 pending records, 48 synced).
   - Interactive simulator: Add test offline vitals, simulate cellular disconnect, and watch live synchronization with duplicate suppression.

4. **Live Ambulance Tracking (`#/tracking`)**
   - Full interactive Leaflet map with dark emergency theme.
   - Real-time ambulance marker with animated pulsing beacon, departure point, and destination trauma bay pin.
   - Live telemetry summary (54 km/h speed, 8.4 km remaining, 25 min travel time).
   - Route deviation & traffic congestion notices (+11 min on A4 arterial route).
   - Interactive controls: Recenter, view full route, switch destination, and test GPS signal loss.

5. **Device Status & Diagnostics (`#/devices`)**
   - Health check summary: 4 Connected, 1 Attention, 0 Disconnected.
   - Diagnostic table: ECG (3-lead), SpO₂, BP Cuff, EtCO₂ Microstream, and GNSS Gateway.
   - Slide-over diagnostic drawer with battery levels, signal qualities, event logs, and step-by-step troubleshooting checklists.
   - Clear distinction between *hardware connection* and *clinical readiness*.

6. **MediCapture Vault (`#/medicapture`)**
   - Drag-and-drop secure clinical attachment uploader & simulated camera snapshot.
   - Metadata classification: Visible injury, Wound assessment, Scene documentation, Equipment, and Other clinical attachments.
   - Patient consent / emergency authorization verification.
   - Encrypted media review gallery with secure modal viewer and revocation audit trail.

7. **Priority Selection (`#/priority`)**
   - 3-tier weighted fair queuing: **Critical** (Immediate Review), **High** (Clinical Updates), and **Normal** (Routine Media/Logs).
   - Anti-starvation safeguards ensuring routine records receive bandwidth windows.
   - Interactive transmission queue monitor with manual priority escalation/downgrade and mandatory clinical reason audit logging.

8. **LifeLink AI Assistant (`#/lifelink`)**
   - **Feature 1:** Pre-Hospital SBAR Clinical Handover Summary.
   - **Feature 2:** Vital-Sign Trend Analysis (SpO₂ drop & tachycardia correlation).
   - **Feature 3:** Missing Information Assistant (Audits unrecorded items vs assessed normal).
   - **Feature 4:** Hospital Preparation Brief for receiving trauma team.
   - **Feature 5:** AI Explanation & Citation Panel with source timestamps.
   - Human-in-the-loop review, inline draft editing, and clinician sign-off workflow.
   - Mandatory AI clinical disclaimer.

9. **Suitable Hospital Finder (`#/hospitals`)**
   - Clinical triage criteria & facility search (Trauma bay, CT scanner, specialty care).
   - Comparative spotlight: **Hospital A** (Nearby General Hospital - 5 min, unknown ortho status) vs. **Hospital B** (Regional Trauma Centre - 9 min, verified accepting).
   - Dynamic destination selection that updates the global store, recalculates ETA, and re-routes ambulance telemetry.

10. **Reviews & Feedback (`#/feedback`)**
    - Operational feedback collection with role selection, 5-point rating scale, and feature checkboxes.
    - Fictional sample feedback summaries illustrating pre-hospital communication themes.

11. **Frequently Asked Questions (`#/faq`)**
    - 18 comprehensive clinical & technical Q&As in an accessible accordion.
    - Instant real-time search filter and interactive Contact Team modal.

---

## 🚀 Running GoldenHour Locally

You can run GoldenHour directly in any browser:

### Option A: Local Python Server (Recommended)
```powershell
& "C:\Users\jaiha\AppData\Local\Python\bin\python3.exe" server.py
```
Then open your browser to `http://localhost:5173/`.

### Option B: Direct File Loading
Open `index.html` directly in your browser. All scripts, icons, and styles are self-contained.
