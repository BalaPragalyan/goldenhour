// GoldenHour Centralized Reactive State Store
// Bridges all views with synchronized operational and clinical telemetry data

class StateStore {
  constructor() {
    this.listeners = new Map();
    this.state = {
      userRole: 'Paramedic', // 'Paramedic' | 'Emergency Physician' | 'Hospital Coordinator' | 'Ambulance Operations' | 'Hospital Administrator'
      activeAmbulanceId: 'AMB-07',
      selectedHospital: 'City Trauma Centre',
      
      // Network & Telemetry Connection
      networkStatus: 'Connected', // 'Connected' | 'Weak Connection' | 'Offline / Safe Mode' | 'Syncing' | 'Synced'
      lastServerSync: '10:08 AM',
      pendingRecordsCount: 12,
      syncedRecordsCount: 48,
      lastRecordedPatientReading: '10:10 AM',
      syncStatusMessage: 'All telemetry channels streaming normally',
      isOfflineQueueActive: false,
      
      // Patient Record GH-1042
      patient: {
        id: 'GH-1042',
        status: 'In Transit',
        priority: 'High — Review Required',
        ambulanceId: 'AMB-07',
        receivingHospital: 'City Trauma Centre',
        departureTime: '10:00 AM',
        initialEta: '10:25 AM',
        updatedEta: '10:36 AM',
        remainingMinutes: 25,
        remainingDistance: '8.4 km',
        lastUpdate: '10:11 AM',
        lastGpsUpdate: '10:11 AM',
        trafficNotice: 'Congestion detected on A4 arterial route (+11 min recalculation applied at 10:10 AM)',
        
        // Clinical Case Details (strictly marked as reported/suspected)
        suspectedInjury: 'Lower-limb trauma',
        injuryLocation: 'Left lower extremity (tibia/fibula region)',
        mechanismOfInjury: 'Road traffic accident (motor vehicle collision with roadway barrier)',
        reportedSymptoms: 'Severe localized pain, swelling, deformity, unable to bear weight',
        consciousness: 'Alert, GCS 14 (E4 V4 M6) — mild transient confusion following impact',
        visibleBleeding: 'Superficial skin tear controlled with sterile pressure dressing; no arterial spurting',
        assessmentStatus: 'Initial ambulance assessment — Reported / Suspected until clinically confirmed',
        paramedicNotes: 'Patient was restrained driver. Airbag deployed. Rapid extrication completed. Leg splinted in anatomical position with distal pulse present (dorsalis pedis palpable). IV access established (18G left antecubital).',
        
        // Care Requirements
        careRequirements: [
          { id: 1, title: 'Oxygen or respiratory support', detail: 'High-flow O₂ via non-rebreather mask (12 L/min) due to transient SpO₂ desaturation to 88%', status: 'Active in transit' },
          { id: 2, title: 'Bleeding-control measures', detail: 'Sterile pressure dressings applied to minor tibial laceration; bleeding arrested', status: 'Stabilized' },
          { id: 3, title: 'Immobilization / injury support', detail: 'Rigid vacuum splint applied to left lower limb; cervical spine precautions maintained', status: 'Secured' },
          { id: 4, title: 'Continuous monitoring', detail: 'ECG lead II telemetry, continuous pulse oximetry, automated NIBP q5min, capnography', status: 'Active' },
          { id: 5, title: 'Requested specialty review', detail: 'Orthopedic trauma surgery team review requested upon trauma bay arrival', status: 'Hospital Notification Sent' },
          { id: 6, title: 'Trauma bay preparation notes', detail: 'Prepare Trauma Bay 2 with rapid fluid warmer and lower-limb x-ray / CT standby', status: 'Hospital Preparing' }
        ]
      },
      
      // Vital Signs
      vitals: {
        bp: {
          name: 'Blood Pressure',
          value: '120/80',
          unit: 'mmHg',
          systolic: 120,
          diastolic: 80,
          time: '10:10 AM',
          status: 'neutral', // 'neutral' | 'warning' | 'critical'
          freshness: 'fresh', // 'fresh' | 'stale' | 'missing'
          device: 'BP Cuff (NIBP-CUFF-118)',
          helper: 'Review blood pressure alongside the patient\'s overall clinical condition.',
          history: [124, 122, 125, 120, 118, 120],
          historyLabels: ['10:00', '10:02', '10:04', '10:06', '10:08', '10:10']
        },
        spo2: {
          name: 'Oxygen Saturation',
          value: 88,
          unit: '%',
          time: '10:11 AM',
          status: 'warning',
          freshness: 'fresh',
          device: 'SpO₂ Sensor (SPO2-PROBE-402)',
          helper: 'A low reading may require prompt clinical assessment. Interpretation depends on the patient and clinical context.',
          alertText: 'Clinical Review Advisory: Desaturation below 90% threshold. Oxygen supplementation ongoing.',
          history: [96, 95, 94, 91, 89, 88],
          historyLabels: ['10:01', '10:03', '10:05', '10:07', '10:09', '10:11']
        },
        pulse: {
          name: 'Pulse Rate',
          value: 120,
          unit: 'bpm',
          time: '10:11 AM',
          status: 'warning',
          freshness: 'fresh',
          device: 'ECG Monitor (ECG-DEV-901)',
          helper: 'Review the pulse alongside other measurements and the patient\'s reported condition.',
          alertText: 'Tachycardia: 120 bpm recorded. Correlate with acute pain and blood loss assessment.',
          history: [102, 108, 112, 115, 118, 120],
          historyLabels: ['10:01', '10:03', '10:05', '10:07', '10:09', '10:11']
        },
        etco2: {
          name: 'End-Tidal CO₂',
          value: 42,
          unit: 'mmHg',
          time: '10:09 AM',
          status: 'neutral',
          freshness: 'stale', // Note: 10:09 AM is > 2 mins old, sensor is unstable
          device: 'Capnography (CAPNO-LINE-772)',
          helper: 'Interpret this measurement in the context of the patient\'s condition, breathing support, and clinical assessment.',
          staleNotice: 'Sensor signal unstable since 10:09 AM. Measurement may not reflect current ventilation.',
          history: [38, 39, 40, 41, 42, 42],
          historyLabels: ['09:59', '10:01', '10:03', '10:05', '10:07', '10:09']
        }
      },
      
      // Monitoring Devices
      devices: [
        {
          id: 'ECG-DEV-901',
          name: 'ECG Telemetry Unit (3-Lead)',
          status: 'Connected',
          color: 'green',
          indicator: 'Green',
          lastUpdate: '10:11 AM',
          signalQuality: '98%',
          batteryLevel: '84%',
          firmware: 'v4.12.0',
          channel: 'Secure BLE 5.3',
          actionText: 'View waveforms',
          clinicalReadiness: 'Sensor applied and rhythm verified (Sinus Tachycardia)',
          recentEvents: [
            { time: '10:11 AM', event: 'Continuous rhythm packet confirmed (60 packets/sec)' },
            { time: '10:00 AM', event: 'Lead II impedance check passed (2.1 kΩ)' }
          ],
          troubleshooting: [
            'Ensure all 3 electrode patches have fresh conductive hydrogel.',
            'Confirm lead wires are free from tension during vehicle motion.',
            'Keep telemetry gateway within 3 meters of monitor.'
          ]
        },
        {
          id: 'SPO2-PROBE-402',
          name: 'Pulse Oximeter Finger Probe',
          status: 'Connected',
          color: 'green',
          indicator: 'Green',
          lastUpdate: '10:11 AM',
          signalQuality: '95%',
          batteryLevel: '79%',
          firmware: 'v2.8.4',
          channel: 'Direct USB Optic',
          actionText: 'View readings',
          clinicalReadiness: 'Plethysmograph wave synchronized with arterial pulse',
          recentEvents: [
            { time: '10:11 AM', event: 'Low SpO₂ alert (88%) forwarded to hospital queue' },
            { time: '10:01 AM', event: 'Sensor recalibrated after movement artefact' }
          ],
          troubleshooting: [
            'Verify finger probe is seated firmly on index or middle digit.',
            'Check for peripheral vasoconstriction or cold extremities.',
            'Wipe sensor optic lens with non-abrasive alcohol wipe.'
          ]
        },
        {
          id: 'NIBP-CUFF-118',
          name: 'Automated Blood Pressure Cuff',
          status: 'Connected',
          color: 'green',
          indicator: 'Green',
          lastUpdate: '10:10 AM',
          signalQuality: '92%',
          batteryLevel: '91%',
          firmware: 'v3.0.1',
          channel: 'Oscillometric Pneumatic',
          actionText: 'View readings',
          clinicalReadiness: 'Standard adult cuff calibrated; next auto-cycle at 10:15 AM',
          recentEvents: [
            { time: '10:10 AM', event: 'Cycle completed: 120/80 mmHg (MAP 93 mmHg)' },
            { time: '10:05 AM', event: 'Cycle completed: 118/78 mmHg' }
          ],
          troubleshooting: [
            'Ensure pneumatic tube is unkinked and firmly clicked into port.',
            'Align artery mark over brachial artery 2cm above antecubital fossa.',
            'Instruct patient to keep arm relaxed during inflation cycle.'
          ]
        },
        {
          id: 'CAPNO-LINE-772',
          name: 'EtCO₂ Microstream Capnograph',
          status: 'Signal Unstable',
          color: 'amber',
          indicator: 'Amber',
          lastUpdate: '10:09 AM',
          signalQuality: '62%',
          batteryLevel: '45%',
          firmware: 'v1.9.0',
          channel: 'Infrared Sidestream',
          actionText: 'Check connection',
          clinicalReadiness: 'Partial airway sampling; moisture trap filter nearing saturation threshold',
          recentEvents: [
            { time: '10:09 AM', event: 'Warning: Sample line flow restriction detected' },
            { time: '10:07 AM', event: 'Baseline zero calibration drifted +1.2 mmHg' }
          ],
          troubleshooting: [
            'Inspect sidestream sampling line for condensation or patient secretions.',
            'Replace the Orange FilterLine cartridge if color indicator shows saturation.',
            'Check nasal prong positioning under oxygen delivery mask.'
          ]
        },
        {
          id: 'GPS-TELEMETRY-07',
          name: 'Ambulance High-Gain GPS Gateway',
          status: 'Connected',
          color: 'green',
          indicator: 'Green',
          lastUpdate: '10:11 AM',
          signalQuality: '99%',
          batteryLevel: 'Vehicle Bus (13.8V)',
          firmware: 'v5.0.2',
          channel: 'Multi-Constellation GNSS',
          actionText: 'View location',
          clinicalReadiness: '11 satellites in view; RTK differential accuracy ±1.2m',
          recentEvents: [
            { time: '10:11 AM', event: 'Position lock updated: Lat 51.5074, Lng -0.1278' },
            { time: '10:10 AM', event: 'Traffic re-route telemetry sent to hospital dispatch' }
          ],
          troubleshooting: [
            'Verify roof-mounted dome antenna has clear sky line of sight.',
            'Check vehicle ignition voltage supply.',
            'Re-seat SMA antenna connector on gateway rear panel.'
          ]
        }
      ],
      
      // Hospitals in Directory
      hospitals: [
        {
          id: 'HOSP-TRAUMA-01',
          name: 'City Trauma Centre',
          type: 'Major Trauma Centre (Level 1)',
          travelTimeMinutes: 25,
          distanceKm: 8.4,
          etaDisplay: '10:36 AM',
          specialtyAvailability: '24/7 Orthopedic Trauma, Vascular & Neurosurgery Verified',
          emergencyDepartment: 'Adult Trauma Bay 2 Reserved for GH-1042',
          facilities: ['Trauma Resuscitation Bays', 'Dual CT Scanners', 'Interventional Radiology', 'ICU 12 Beds'],
          acceptanceStatus: 'Accepting',
          statusBadge: 'Accepting',
          badgeColor: 'green',
          lastStatusUpdate: '10:05 AM',
          verifiedTime: 'Verified by Trauma Coordinator Dr. R. Vance',
          notes: 'Pre-arrival notification acknowledged. Resus team briefed on lower-limb trauma.'
        },
        {
          id: 'HOSP-GEN-02',
          name: 'Nearby General Hospital',
          type: 'District General Hospital',
          travelTimeMinutes: 5,
          distanceKm: 2.1,
          etaDisplay: '10:16 AM',
          specialtyAvailability: 'Emergency Dept open; On-call Orthopedic Specialist requires phone confirmation',
          emergencyDepartment: 'Standard Emergency Department (High volume)',
          facilities: ['Standard ED Resus (1 bed)', 'Single CT Scanner', 'General Surgery On-Call'],
          acceptanceStatus: 'Unknown — Confirmation Required',
          statusBadge: 'Unknown',
          badgeColor: 'amber',
          lastStatusUpdate: '09:42 AM',
          verifiedTime: 'Last telemetry ping 29 mins ago',
          notes: 'Closer distance, but trauma specialist availability is currently unconfirmed.'
        },
        {
          id: 'HOSP-REG-03',
          name: 'Regional Trauma Centre',
          type: 'Regional Emergency & Specialty Centre',
          travelTimeMinutes: 9,
          distanceKm: 4.8,
          etaDisplay: '10:20 AM',
          specialtyAvailability: 'Comprehensive Trauma & Limb Reconstruction Team Verified',
          emergencyDepartment: 'Trauma Resus Open & Staffed',
          facilities: ['2 Trauma Bays Open', 'CT Imaging Clear', 'Ortho-trauma Active'],
          acceptanceStatus: 'Accepting',
          statusBadge: 'Accepting',
          badgeColor: 'green',
          lastStatusUpdate: '10:08 AM',
          verifiedTime: 'Live bed management integration verified',
          notes: 'Fast travel corridor via express bypass. Full surgical staff standing by.'
        },
        {
          id: 'HOSP-COMM-04',
          name: 'Suburban Community Clinic',
          type: 'Urgent Treatment Centre',
          travelTimeMinutes: 7,
          distanceKm: 3.2,
          etaDisplay: '10:18 AM',
          specialtyAvailability: 'Minor injuries only; No acute surgical or trauma capabilities',
          emergencyDepartment: 'Walk-in Urgent Care only',
          facilities: ['Plain X-Ray', 'Minor Suturing Suite'],
          acceptanceStatus: 'Not Accepting (Redirect Required)',
          statusBadge: 'Not Accepting',
          badgeColor: 'red',
          lastStatusUpdate: '09:55 AM',
          verifiedTime: 'Clinical redirect flag active',
          notes: 'Not suitable for moderate or severe vehicular trauma.'
        }
      ],
      
      // Priority Queue Items
      priorityQueue: [
        {
          id: 'REC-0891',
          name: 'Critical Vital Alert: SpO₂ Desaturation (88%)',
          patientId: 'GH-1042',
          category: 'Clinical Alert',
          priority: 'Critical',
          timeCreated: '10:11 AM',
          status: 'Transmitted',
          retryCount: 0,
          details: 'Automatic alert forwarded immediately across dedicated telemetry slot.'
        },
        {
          id: 'REC-0890',
          name: 'Continuous 3-Lead ECG Segment (10-sec telemetry)',
          patientId: 'GH-1042',
          category: 'Vital Signs',
          priority: 'Critical',
          timeCreated: '10:11 AM',
          status: 'Transmitted',
          retryCount: 0,
          details: 'Sinus rhythm @ 120 bpm, ST-segment normal, no acute ischemic morphology.'
        },
        {
          id: 'REC-0889',
          name: 'NIBP Automated Measurement (120/80 mmHg)',
          patientId: 'GH-1042',
          category: 'Vital Signs',
          priority: 'High',
          timeCreated: '10:10 AM',
          status: 'Transmitted',
          retryCount: 0,
          details: 'Oscillometric cuff measurement completed.'
        },
        {
          id: 'REC-0888',
          name: 'Traffic Re-route Notification (ETA revised to 10:36 AM)',
          patientId: 'GH-1042',
          category: 'Navigation',
          priority: 'High',
          timeCreated: '10:10 AM',
          status: 'Transmitted',
          retryCount: 0,
          details: 'Arterial congestion delay flagged to trauma coordinator.'
        },
        {
          id: 'REC-0887',
          name: 'Paramedic Clinical Narrative & Mechanism Note',
          patientId: 'GH-1042',
          category: 'Handover Note',
          priority: 'High',
          timeCreated: '10:08 AM',
          status: 'Queued (In Flight)',
          retryCount: 1,
          details: 'Initial assessment documentation being verified by receiving gateway.'
        },
        {
          id: 'REC-0886',
          name: 'High-Res Photo: Splinted Lower Limb Anatomy',
          patientId: 'GH-1042',
          category: 'MediCapture',
          priority: 'Normal',
          timeCreated: '10:07 AM',
          status: 'Queued',
          retryCount: 0,
          details: '3.4 MB encrypted image queued behind higher-priority vitals.'
        },
        {
          id: 'REC-0885',
          name: 'Vehicle Telemetry & Cabin Ambient Sensor Log',
          patientId: 'AMB-07',
          category: 'Operations',
          priority: 'Normal',
          timeCreated: '10:06 AM',
          status: 'Queued',
          retryCount: 0,
          details: 'Non-clinical routine fleet diagnostics.'
        }
      ],
      
      // MediCapture Media Library
      mediaItems: [
        {
          id: 'MED-1042-01',
          patientId: 'GH-1042',
          ambulanceId: 'AMB-07',
          category: 'Visible injury',
          description: 'Initial assessment of left lower leg showing deformity and localized swelling prior to vacuum splinting.',
          fileType: 'image/jpeg',
          fileName: 'limb_assessment_01.jpg',
          fileSize: '2.8 MB',
          captureTime: '10:04 AM',
          uploadedBy: 'Paramedic J. Mercer (ID: PM-449)',
          authorizationStatus: 'Authorized by Attending Paramedic for Trauma Bay Consultation',
          encryptionState: 'AES-256 Client Encrypted',
          uploadStatus: 'Server Confirmed (Available to Receiving Team)',
          thumbnailUrl: 'assets/sample_splint.svg',
          isPendingUpload: false
        },
        {
          id: 'MED-1042-02',
          patientId: 'GH-1042',
          ambulanceId: 'AMB-07',
          category: 'Medical equipment or device',
          description: 'Monitor snapshot showing EtCO₂ trace and 12-lead baseline rhythm at scene.',
          fileType: 'image/png',
          fileName: 'ecg_scene_strip.png',
          fileSize: '1.4 MB',
          captureTime: '10:06 AM',
          uploadedBy: 'Nurse Practitioner C. Ross (ID: NP-112)',
          authorizationStatus: 'Direct Clinical Telemetry Attachment',
          encryptionState: 'AES-256 Client Encrypted',
          uploadStatus: 'Server Confirmed (Available to Receiving Team)',
          thumbnailUrl: 'assets/sample_monitor.svg',
          isPendingUpload: false
        }
      ],
      
      // Activity Timeline Feed
      activityTimeline: [
        {
          id: 'EV-106',
          time: '10:11 AM',
          title: 'Oxygen Saturation Alert Transmitted',
          source: 'Telemetry Gateway (SPO2-PROBE-402)',
          type: 'warning',
          description: 'SpO₂ reading of 88% received and flagged for emergency clinical review.'
        },
        {
          id: 'EV-105',
          time: '10:11 AM',
          title: 'GPS Position & Speed Lock Updated',
          source: 'GPS-TELEMETRY-07',
          type: 'info',
          description: 'Vehicle traveling 54 km/h southbound on A4; ETA maintained at 10:36 AM.'
        },
        {
          id: 'EV-104',
          time: '10:10 AM',
          title: 'Route Delay Recalculation',
          source: 'Traffic Telemetry Engine',
          type: 'notice',
          description: 'Heavy traffic on bypass added +11 min to hospital transit. ETA revised from 10:25 to 10:36 AM.'
        },
        {
          id: 'EV-103',
          time: '10:08 AM',
          title: 'Hospital Trauma Bay Pre-Alert Acknowledged',
          source: 'City Trauma Centre ED Coordinator',
          type: 'success',
          description: 'Hospital coordinator acknowledged receipt of pre-arrival telemetry. Trauma Bay 2 reserved.'
        },
        {
          id: 'EV-102',
          time: '10:05 AM',
          title: 'Initial ETA Generated',
          source: 'Dispatch Navigation Gateway',
          type: 'info',
          description: 'Initial estimated arrival time calculated as 10:25 AM under normal flow.'
        },
        {
          id: 'EV-101',
          time: '10:00 AM',
          title: 'Ambulance Departs Scene',
          source: 'AMB-07 Crew',
          type: 'info',
          description: 'Patient GH-1042 loaded and en route to City Trauma Centre.'
        }
      ],
      
      // Notification Alerts
      notifications: [
        {
          id: 'NOTIF-1',
          unread: true,
          time: '10:11 AM',
          level: 'critical',
          title: 'Vital Sign Alert: Low SpO₂ (88%)',
          text: 'Patient GH-1042 oxygen saturation is below 90%. Review clinical assessment and supplemental O₂.'
        },
        {
          id: 'NOTIF-2',
          unread: true,
          time: '10:10 AM',
          level: 'warning',
          title: 'ETA Revised Due to Traffic (+11 min)',
          text: 'Estimated arrival at City Trauma Centre shifted from 10:25 AM to 10:36 AM.'
        },
        {
          id: 'NOTIF-3',
          unread: false,
          time: '10:09 AM',
          level: 'warning',
          title: 'Device Signal Warning: EtCO₂ Sensor',
          text: 'Capnograph signal quality dropped to 62%. Check sampling line for blockage.'
        },
        {
          id: 'NOTIF-4',
          unread: false,
          time: '10:08 AM',
          level: 'success',
          title: 'Hospital Pre-Arrival Acknowledged',
          text: 'City Trauma Centre confirmed readiness for incoming patient GH-1042.'
        }
      ]
    };
  }

  // Reactive listener subscription
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    return () => {
      this.listeners.get(key).delete(callback);
    };
  }

  // State update & notification dispatcher
  notify(key) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach(cb => cb(this.state));
    }
    // Also notify global wildcard listeners
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(cb => cb(this.state));
    }
  }

  get(key) {
    return this.state[key];
  }

  getAll() {
    return this.state;
  }

  setRole(newRole) {
    this.state.userRole = newRole;
    this.notify('userRole');
  }

  // Update selected hospital and propagate new travel times and ETA!
  selectHospital(hospitalId) {
    const hosp = this.state.hospitals.find(h => h.id === hospitalId);
    if (!hosp) return;
    
    this.state.selectedHospital = hosp.name;
    this.state.patient.receivingHospital = hosp.name;
    this.state.patient.remainingMinutes = hosp.travelTimeMinutes;
    this.state.patient.remainingDistance = `${hosp.distanceKm} km`;
    this.state.patient.updatedEta = hosp.etaDisplay;
    
    // Add event log
    this.state.activityTimeline.unshift({
      id: `EV-${Date.now()}`,
      time: '10:12 AM',
      title: `Receiving Destination Updated: ${hosp.name}`,
      source: `Authorized User (${this.state.userRole})`,
      type: 'notice',
      description: `Hospital destination changed to ${hosp.name}. ETA recalculated to ${hosp.etaDisplay} (${hosp.travelTimeMinutes} min travel).`
    });

    this.notify('selectedHospital');
    this.notify('patient');
    this.notify('activityTimeline');
  }

  // Set Network State (5 modes)
  setNetworkStatus(newStatus) {
    this.state.networkStatus = newStatus;
    
    if (newStatus === 'Connected') {
      this.state.syncStatusMessage = 'All telemetry channels streaming normally';
      this.state.isOfflineQueueActive = false;
    } else if (newStatus === 'Weak Connection') {
      this.state.syncStatusMessage = 'Bandwidth constrained. Critical vitals prioritized; large attachments throttled.';
      this.state.isOfflineQueueActive = false;
    } else if (newStatus === 'Offline / Safe Mode') {
      this.state.syncStatusMessage = 'Connection interrupted. Local records are being preserved. Live updates to the hospital may be delayed.';
      this.state.isOfflineQueueActive = true;
    } else if (newStatus === 'Syncing') {
      this.state.syncStatusMessage = 'Connection restored. Syncing pending offline records to receiving system...';
    } else if (newStatus === 'Synced') {
      this.state.syncedRecordsCount += this.state.pendingRecordsCount;
      this.state.pendingRecordsCount = 0;
      this.state.lastServerSync = '10:12 AM';
      this.state.syncStatusMessage = 'All pending pre-hospital telemetry records synchronized and verified by receiving server.';
      this.state.isOfflineQueueActive = false;
    }

    this.notify('networkStatus');
  }

  // Add offline record to queue
  addOfflineRecord(recordTitle, category = 'Vital Signs', priority = 'High') {
    const newRecord = {
      id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      name: recordTitle,
      patientId: this.state.patient.id,
      category: category,
      priority: priority,
      timeCreated: '10:12 AM',
      status: this.state.networkStatus === 'Offline / Safe Mode' ? 'Stored Locally (Safe Mode)' : 'Transmitted',
      retryCount: 0,
      details: 'Recorded in vehicle telemetry local secure cache.'
    };
    
    this.state.priorityQueue.unshift(newRecord);
    if (this.state.networkStatus === 'Offline / Safe Mode') {
      this.state.pendingRecordsCount += 1;
    } else {
      this.state.syncedRecordsCount += 1;
    }
    
    this.notify('priorityQueue');
    this.notify('networkStatus');
  }

  // Add new media item
  addMediaItem(item) {
    this.state.mediaItems.unshift(item);
    
    // Also push a priority queue entry for media transfer
    this.state.priorityQueue.push({
      id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `Media Attachment: ${item.fileName}`,
      patientId: item.patientId,
      category: 'MediCapture',
      priority: 'Normal',
      timeCreated: item.captureTime,
      status: this.state.networkStatus === 'Offline / Safe Mode' ? 'Queued (Offline)' : 'Transmitted',
      retryCount: 0,
      details: `${item.fileSize} encrypted attachment. Category: ${item.category}`
    });

    this.notify('mediaItems');
    this.notify('priorityQueue');
  }

  // Override record priority
  overridePriority(recordId, newPriority, reason) {
    const rec = this.state.priorityQueue.find(r => r.id === recordId);
    if (rec) {
      const oldPriority = rec.priority;
      rec.priority = newPriority;
      
      this.state.activityTimeline.unshift({
        id: `EV-${Date.now()}`,
        time: '10:12 AM',
        title: `Priority Override: ${rec.id} (${oldPriority} -> ${newPriority})`,
        source: `Authorized User (${this.state.userRole})`,
        type: 'notice',
        description: `Reason logged in audit trail: "${reason}"`
      });

      this.notify('priorityQueue');
      this.notify('activityTimeline');
    }
  }

  // Mark all notifications as read
  markNotificationsRead() {
    this.state.notifications.forEach(n => n.unread = false);
    this.notify('notifications');
  }
}

// Global singleton instance
window.GoldenHourStore = new StateStore();
