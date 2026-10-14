// GoldenHour Doctor Portal View
// Unified Emergency Physician & Trauma Bay Command Hub — All case details and orders in one screen

const DoctorView = {
  doctorOrders: [
    { id: 'ORD-1', title: 'Activate Level 1 Trauma Team', dept: 'Trauma Resus Bay 2', status: 'Active', confirmedBy: 'Dr. R. Vance (ER Attending)' },
    { id: 'ORD-2', title: 'Reserve 4 Units O-Negative PRBCs & Rapid Infuser', dept: 'Blood Bank', status: 'Standby', confirmedBy: 'Dr. R. Vance' },
    { id: 'ORD-3', title: 'Standby CT Trauma Angiography', dept: 'Radiology Suite 1', status: 'Standby', confirmedBy: 'Pending Arrival' },
    { id: 'ORD-4', title: 'Orthopedic Trauma Surgeon On-Call Alerted', dept: 'Surgical Services', status: 'Confirmed', confirmedBy: 'Dr. K. Patel (Ortho On-Call)' },
    { id: 'ORD-5', title: 'Authorize IV Analgesia (Morphine 5mg titrated in transit)', dept: 'Ambulance AMB-07', status: 'Authorized', confirmedBy: 'Dr. R. Vance' }
  ],

  render(container) {
    const I = window.GoldenHourIcons;
    const store = window.GoldenHourStore;
    const state = store.getAll();
    const p = state.patient;
    const v = state.vitals;

    container.innerHTML = `
      <div class="space-y-6 pb-16">
        
        <!-- DOCTOR PORTAL COMMAND HEADER -->
        <div class="clinical-card p-6 border-l-4 border-l-red-500 shadow-2xl relative overflow-hidden bg-gradient-to-r from-[#0c1429] via-[#0e172e] to-[#122044]">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-2.5">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-red-950 text-red-300 border border-red-500/60 flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-red-500 beacon-red"></span>
                  INCOMING TRAUMA ALERT &bull; BAY 2 RESERVED
                </span>
                <span class="px-2.5 py-1 rounded text-xs bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                  Unit: ${p.ambulanceId} (Paramedic J. Mercer)
                </span>
                <span class="text-xs text-slate-400 font-mono">
                  Departed: 10:00 AM
                </span>
              </div>

              <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                Patient ${p.id}
                <span class="text-lg font-normal text-slate-400">| Adult Male (~38y)</span>
              </h1>

              <div class="text-xs text-slate-300 flex flex-wrap items-center gap-4">
                <span><strong>Suspected Injury:</strong> <span class="text-amber-300 font-semibold">${p.suspectedInjury}</span></span>
                <span>&bull;</span>
                <span><strong>Mechanism:</strong> ${p.mechanismOfInjury}</span>
                <span>&bull;</span>
                <span><strong>Consciousness:</strong> <span class="text-emerald-300">${p.consciousness}</span></span>
              </div>
            </div>

            <!-- Prominent Countdown & Hospital Pre-Alert Confirmation -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800 shrink-0">
              <div class="text-center sm:text-right pr-2">
                <div class="text-[11px] uppercase tracking-wider font-semibold text-slate-400">ESTIMATED TRAUMA BAY ETA</div>
                <div class="text-3xl font-extrabold text-amber-400 telemetry-num">${p.updatedEta}</div>
                <div class="text-xs text-amber-300 font-medium">${p.remainingMinutes} min remaining (${p.remainingDistance})</div>
              </div>

              <div class="border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4 flex flex-col justify-center">
                <button onclick="window.GoldenHourViews.doctor.confirmHospitalReadiness()" id="doc-ack-btn" class="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2">
                  ${I.checkCircle('w-4 h-4')}
                  Acknowledge & Confirm Bay 2 Ready
                </button>
                <div class="text-[10px] text-slate-400 text-center mt-1">Transmits confirmation to ambulance HUD</div>
              </div>
            </div>

          </div>
        </div>


        <!-- UNIFIED CLINICAL DETAILS GRID (ALL IN ONE SCREEN) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- LEFT 8 COLUMNS: Vitals Telemetry + Injuries + Doctor Directives -->
          <div class="lg:col-span-8 space-y-6">
            
            <!-- 1. LIVE VITALS MONITOR BAR (4 KEY CHANNELS) -->
            <div class="clinical-card p-5 space-y-4 shadow-xl">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 class="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  ${I.activity('w-4 h-4 text-blue-400')}
                  Live Telemetry Monitor (Ambulance AMB-07 Stream)
                </h3>
                <span class="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 beacon-green"></span>
                  Streaming Live (10:11 AM)
                </span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                <!-- SpO2 Alert -->
                <div class="p-3.5 rounded-xl bg-red-950/60 border border-red-500/60 space-y-1">
                  <div class="flex items-center justify-between text-[11px] text-red-300 font-semibold">
                    <span>SpO₂ Oximetry</span>
                    <span class="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                  </div>
                  <div class="flex items-baseline gap-1">
                    <span class="text-3xl font-extrabold text-red-400 telemetry-num">${v.spo2.value}</span>
                    <span class="text-xs text-red-300 font-bold">%</span>
                  </div>
                  <div class="text-[10px] text-red-300 font-medium">Critical Desaturation (&darr;)</div>
                  <div class="text-[10px] text-slate-400 pt-1 border-t border-red-900/40">O₂ Non-Rebreather 12L</div>
                </div>

                <!-- Pulse Rate -->
                <div class="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 space-y-1">
                  <div class="flex items-center justify-between text-[11px] text-amber-300 font-semibold">
                    <span>Pulse (HR)</span>
                    <span class="text-[10px] text-slate-400">Lead II</span>
                  </div>
                  <div class="flex items-baseline gap-1">
                    <span class="text-3xl font-extrabold text-amber-400 telemetry-num">${v.pulse.value}</span>
                    <span class="text-xs text-amber-300 font-bold">bpm</span>
                  </div>
                  <div class="text-[10px] text-amber-300 font-medium">Sinus Tachycardia (&uarr;)</div>
                  <div class="text-[10px] text-slate-400 pt-1 border-t border-amber-900/40">Pain / Trauma Response</div>
                </div>

                <!-- Blood Pressure -->
                <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div class="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span>Blood Pressure</span>
                    <span class="text-emerald-400 text-[10px]">Normal</span>
                  </div>
                  <div class="flex items-baseline gap-1">
                    <span class="text-2xl font-extrabold text-white telemetry-num">${v.bp.value}</span>
                    <span class="text-xs text-slate-400 font-bold">mmHg</span>
                  </div>
                  <div class="text-[10px] text-slate-400 font-mono">MAP: 93 mmHg</div>
                  <div class="text-[10px] text-slate-400 pt-1 border-t border-slate-800">Auto Cycle 10:10 AM</div>
                </div>

                <!-- EtCO2 -->
                <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div class="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span>EtCO₂ Capno</span>
                    <span class="text-amber-400 text-[10px]">Unstable</span>
                  </div>
                  <div class="flex items-baseline gap-1">
                    <span class="text-2xl font-extrabold text-slate-300 telemetry-num">${v.etco2.value}</span>
                    <span class="text-xs text-slate-400 font-bold">mmHg</span>
                  </div>
                  <div class="text-[10px] text-amber-400">Sampling Line Moisture</div>
                  <div class="text-[10px] text-slate-400 pt-1 border-t border-slate-800">Freshness: 10:09 AM</div>
                </div>

              </div>
            </div>


            <!-- 2. CLINICAL INJURY, MECHANISM & FIELD ASSESSMENT -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <!-- Injury & Mechanism -->
              <div class="clinical-card p-5 space-y-3 text-xs">
                <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 class="font-bold text-white text-xs uppercase tracking-wider">Reported Trauma Details</h4>
                  <span class="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800">Suspected</span>
                </div>

                <div class="space-y-2 text-slate-300">
                  <div>
                    <span class="text-slate-400 font-semibold">Anatomical Location:</span>
                    <div class="text-white font-medium mt-0.5">${p.injuryLocation}</div>
                  </div>
                  <div>
                    <span class="text-slate-400 font-semibold">Mechanism of Injury:</span>
                    <div class="text-white font-medium mt-0.5">${p.mechanismOfInjury}</div>
                  </div>
                  <div>
                    <span class="text-slate-400 font-semibold">Distal Neurovascular:</span>
                    <div class="text-emerald-300 font-medium mt-0.5">Dorsalis pedis pulse palpable; sensation intact.</div>
                  </div>
                  <div>
                    <span class="text-slate-400 font-semibold">Bleeding & Wound Care:</span>
                    <div class="text-slate-200 mt-0.5">Superficial tibial laceration dressed; bleeding arrested.</div>
                  </div>
                </div>
              </div>

              <!-- Care in Progress by Paramedic -->
              <div class="clinical-card p-5 space-y-3 text-xs">
                <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 class="font-bold text-white text-xs uppercase tracking-wider">Paramedic Field Interventions</h4>
                  <span class="text-[10px] font-mono text-blue-400">En Route Actions</span>
                </div>

                <div class="space-y-2 text-slate-300">
                  <div class="flex items-start gap-2">
                    <span class="text-emerald-400 font-bold">&check;</span>
                    <div><strong>Rigid Vacuum Splint:</strong> Left lower extremity immobilized in anatomical alignment.</div>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-emerald-400 font-bold">&check;</span>
                    <div><strong>Airway & Breathing:</strong> High-flow O₂ non-rebreather mask at 12 L/min for SpO₂ 88%.</div>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-emerald-400 font-bold">&check;</span>
                    <div><strong>Vascular Access:</strong> 18G cannula placed in left antecubital fossa; Normal Saline running TKO.</div>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-emerald-400 font-bold">&check;</span>
                    <div><strong>C-Spine Precautions:</strong> Rigid cervical collar applied at vehicle extrication.</div>
                  </div>
                </div>
              </div>

            </div>


            <!-- 3. DOCTOR DIRECTIVES & PRE-ARRIVAL ORDERS -->
            <div class="clinical-card p-5 space-y-4 shadow-xl border-blue-900/50">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 class="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                    ${I.shield('w-4 h-4 text-emerald-400')}
                    Trauma Bay Directives & Pre-Arrival Doctor Orders
                  </h3>
                  <p class="text-xs text-slate-400 mt-0.5">Instant transmission to hospital departments and ambulance crew</p>
                </div>
                <button onclick="window.GoldenHourViews.doctor.addNewOrderModal()" class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all">
                  + Add Directive
                </button>
              </div>

              <div class="space-y-2.5">
                ${this.doctorOrders.map(ord => `
                  <div class="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4 text-xs">
                    <div class="space-y-0.5">
                      <div class="font-bold text-white flex items-center gap-2">
                        <span>${ord.title}</span>
                        <span class="text-[10px] font-mono text-slate-400">(${ord.id})</span>
                      </div>
                      <div class="text-[11px] text-slate-400">
                        Target: <strong class="text-blue-300">${ord.dept}</strong> &bull; Auth: <span class="text-slate-300">${ord.confirmedBy}</span>
                      </div>
                    </div>

                    <div class="flex items-center gap-2 shrink-0">
                      <span class="px-2.5 py-1 rounded text-[10px] font-bold ${
                        ord.status === 'Active' || ord.status === 'Confirmed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        ord.status === 'Authorized' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                        'bg-amber-950 text-amber-300 border border-amber-800'
                      }">
                        ${ord.status}
                      </span>
                      <button onclick="window.GoldenHourViews.doctor.toggleOrderStatus('${ord.id}')" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700">
                        Toggle
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>


          <!-- RIGHT 4 COLUMNS: Tracking Mini-HUD + Pre-Hospital Media + AI Quick Query -->
          <div class="lg:col-span-4 space-y-6">
            
            <!-- 1. LIVE TRACKING MINI-HUD -->
            <div class="clinical-card p-5 space-y-3">
              <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 class="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  ${I.mapPin('w-4 h-4 text-emerald-400')}
                  Ambulance En Route Progress
                </h4>
                <a href="#/tracking" class="text-blue-400 hover:underline text-xs font-semibold">Open Full Map &rarr;</a>
              </div>

              <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div class="flex justify-between">
                  <span class="text-slate-400">Current Position:</span>
                  <span class="text-white font-mono font-semibold">A4 Arterial Southbound</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Transit Speed:</span>
                  <span class="text-emerald-400 font-mono font-semibold">54 km/h</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Distance Remaining:</span>
                  <span class="text-white font-mono font-semibold">${p.remainingDistance}</span>
                </div>
                <div class="p-2 rounded bg-amber-950/60 border border-amber-800/40 text-[11px] text-amber-300">
                  ${p.trafficNotice}
                </div>
              </div>
            </div>

            <!-- 2. MEDICAPTURE ATTACHMENTS (VISUAL INSPECTION FOR DOCTOR) -->
            <div class="clinical-card p-5 space-y-3 text-xs">
              <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 class="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  ${I.camera('w-4 h-4 text-cyan-400')}
                  Field Clinical Images (${state.mediaItems.length})
                </h4>
                <a href="#/medicapture" class="text-cyan-400 hover:underline text-xs">View Vault</a>
              </div>

              <div class="space-y-2">
                ${state.mediaItems.map(item => `
                  <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                    <div class="w-10 h-10 rounded bg-black flex items-center justify-center text-cyan-400 shrink-0 border border-slate-800">
                      ${I.camera('w-5 h-5')}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-bold text-white truncate text-[11px]">${item.fileName}</div>
                      <div class="text-[10px] text-slate-400 truncate">${item.category} &bull; ${item.captureTime}</div>
                    </div>
                    <button onclick="window.GoldenHourViews.medicapture.openSecureViewer('${item.id}')" class="px-2.5 py-1 rounded bg-blue-900/50 hover:bg-blue-900 text-blue-300 text-[11px] font-semibold border border-blue-700/60">
                      Inspect
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- 3. QUICK CHAT SHORTCUT TO LIFELINK AI -->
            <div class="clinical-card p-5 space-y-3 text-xs bg-gradient-to-b from-indigo-950/30 to-[#0e172e]">
              <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 class="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  ${I.bot('w-4 h-4 text-indigo-400')}
                  LifeLink AI Clinical Assistant
                </h4>
                <a href="#/lifelink" class="text-indigo-400 hover:underline text-xs font-semibold">Open Chatbot &rarr;</a>
              </div>

              <p class="text-slate-300 text-[11px] leading-relaxed">
                Emergency physician assistant loaded with Case GH-1042 vitals and pre-hospital protocol data.
              </p>

              <div class="space-y-1.5">
                <button onclick="window.GoldenHourApp.navigate('lifelink')" class="w-full text-left p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-indigo-300 flex items-center justify-between">
                  <span>&bull; Handover SBAR Summary</span>
                  <span>&rarr;</span>
                </button>
                <button onclick="window.GoldenHourApp.navigate('lifelink')" class="w-full text-left p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-indigo-300 flex items-center justify-between">
                  <span>&bull; SpO₂ Desaturation Protocol</span>
                  <span>&rarr;</span>
                </button>
                <button onclick="window.GoldenHourApp.navigate('lifelink')" class="w-full text-left p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-indigo-300 flex items-center justify-between">
                  <span>&bull; Trauma Team Prep Checklist</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    `;
  },

  confirmHospitalReadiness() {
    const btn = document.getElementById('doc-ack-btn');
    if (btn) {
      btn.innerHTML = `${window.GoldenHourIcons.checkCircle('w-4 h-4 text-white')} Confirmed &bull; Trauma Bay 2 Armed`;
      btn.className = 'px-5 py-3 rounded-lg bg-emerald-700 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-default';
    }

    window.GoldenHourStore.getAll().activityTimeline.unshift({
      id: `EV-${Date.now()}`,
      time: '10:14 AM',
      title: 'Doctor Portal Pre-Arrival Confirmation',
      source: 'Dr. R. Vance (Emergency Physician)',
      type: 'success',
      description: 'Trauma Bay 2 confirmed fully armed and ready. Blood bank and orthopedic surgical team notified.'
    });
    window.GoldenHourStore.notify('activityTimeline');

    window.GoldenHourApp.showToast('Bay 2 Confirmed Armed', 'Confirmation packet forwarded to Ambulance AMB-07 crew.', 'success');
  },

  toggleOrderStatus(orderId) {
    const ord = this.doctorOrders.find(o => o.id === orderId);
    if (!ord) return;
    ord.status = ord.status === 'Active' || ord.status === 'Confirmed' ? 'Standby' : 'Confirmed';
    this.render(document.getElementById('view-container'));
    window.GoldenHourApp.showToast('Directive Updated', `${ord.title} status set to ${ord.status}`, 'info');
  },

  addNewOrderModal() {
    window.GoldenHourApp.openModal(`
      <div class="space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h3 class="font-bold text-white text-base">Issue Doctor Directive / Pre-Arrival Order</h3>
          <p class="text-xs text-slate-400 mt-0.5">Dispatches priority alert to hospital departments and ambulance</p>
        </div>

        <form onsubmit="window.GoldenHourViews.doctor.saveNewOrder(event)" class="space-y-3 text-xs">
          <div>
            <label class="block text-slate-400 mb-1 font-semibold">Directive Title</label>
            <input type="text" id="new-ord-title" required placeholder="e.g. Prepare Pelvic Binder and FAST Ultrasound" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white">
          </div>
          <div>
            <label class="block text-slate-400 mb-1 font-semibold">Target Department</label>
            <select id="new-ord-dept" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white">
              <option>Trauma Resus Bay 2</option>
              <option>Ambulance AMB-07 (In Transit)</option>
              <option>Blood Bank Transfusion Service</option>
              <option>CT / Interventional Radiology</option>
              <option>Vascular Surgery On-Call</option>
            </select>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" onclick="window.GoldenHourApp.closeModal()" class="px-4 py-2 rounded bg-slate-800 text-slate-300">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold">Dispatch Directive</button>
          </div>
        </form>
      </div>
    `);
  },

  saveNewOrder(e) {
    e.preventDefault();
    const title = document.getElementById('new-ord-title').value;
    const dept = document.getElementById('new-ord-dept').value;

    this.doctorOrders.unshift({
      id: `ORD-${this.doctorOrders.length + 1}`,
      title: title,
      dept: dept,
      status: 'Active',
      confirmedBy: 'Dr. R. Vance (Attending Physician)'
    });

    window.GoldenHourApp.closeModal();
    window.GoldenHourApp.showToast('Directive Dispatched', `New order dispatched to ${dept}`, 'success');
    this.render(document.getElementById('view-container'));
  }
};

window.GoldenHourViews = window.GoldenHourViews || {};
window.GoldenHourViews.doctor = DoctorView;
