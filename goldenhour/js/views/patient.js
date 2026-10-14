// GoldenHour Incoming Patient View
// 3-Column operational trauma bay dashboard with real-time telemetry and clinical governance

const PatientView = {
  render(container) {
    const I = window.GoldenHourIcons;
    const store = window.GoldenHourStore;
    const state = store.getAll();
    const p = state.patient;
    const v = state.vitals;

    container.innerHTML = `
      <div class="space-y-8 pb-16">
        
        <!-- PAGE HEADER -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e3260] pb-6">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/40 text-blue-400 border border-blue-500/30">
                ACTIVE INCOMING CASE
              </span>
              <span class="text-xs text-slate-400">Prototype Demo Data &bull; Non-Identified Clinical Workflow</span>
            </div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Incoming Patient
              <span class="text-base font-semibold px-3 py-1 rounded-full bg-red-950 text-red-400 border border-red-500/50 flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-red-500 beacon-red"></span>
                ${p.priority}
              </span>
            </h1>
            <p class="text-sm text-slate-300 mt-1">
              A clear view of the patient's reported condition, available measurements, injury details, and expected arrival.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button onclick="window.GoldenHourApp.navigate('doctor')" class="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-emerald-600/30">
              ${I.shield('w-4 h-4')}
              Doctor Portal
            </button>
            <button onclick="window.GoldenHourApp.navigate('tracking')" class="px-4 py-2.5 rounded-lg bg-[#152244] hover:bg-[#1a2c59] text-white text-xs font-semibold border border-blue-800/60 transition-all flex items-center gap-2 shadow-sm">
              ${I.mapPin('w-4 h-4 text-emerald-400')}
              Live Tracking
            </button>
            <button onclick="window.GoldenHourApp.navigate('lifelink')" class="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2">
              ${I.bot('w-4 h-4')}
              LifeLink AI
            </button>
          </div>
        </div>

        <!-- SECTION A: PATIENT OVERVIEW STRIP -->
        <div class="clinical-card p-6 border-l-4 border-l-red-500 shadow-xl relative overflow-hidden">
          <div class="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            ${I.ambulance('w-64 h-64 text-white')}
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 relative z-10 text-xs">
            <div>
              <div class="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Patient ID</div>
              <div class="text-base font-bold text-white mt-0.5 telemetry-num">${p.id}</div>
              <div class="text-[10px] text-slate-400 mt-0.5">Adult Male (~38y)</div>
            </div>

            <div>
              <div class="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Transit Status</div>
              <div class="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ${p.status}
              </div>
              <div class="text-[10px] text-slate-400 mt-0.5">Departed 10:00 AM</div>
            </div>

            <div>
              <div class="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Ambulance ID</div>
              <div class="text-sm font-bold text-slate-200 mt-0.5">${p.ambulanceId}</div>
              <div class="text-[10px] text-slate-400 mt-0.5">Paramedic J. Mercer</div>
            </div>

            <div>
              <div class="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Receiving Hospital</div>
              <div class="text-sm font-bold text-blue-400 mt-0.5">${p.receivingHospital}</div>
              <div class="text-[10px] text-slate-400 mt-0.5">Trauma Bay 2 Reserved</div>
            </div>

            <div>
              <div class="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Last Update</div>
              <div class="text-sm font-bold text-slate-200 mt-0.5 telemetry-num">${p.lastUpdate}</div>
              <div class="text-[10px] text-emerald-400 mt-0.5">Telemetric Link Active</div>
            </div>

            <div>
              <div class="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Estimated Arrival</div>
              <div class="text-base font-bold text-amber-400 mt-0.5 telemetry-num">${p.updatedEta}</div>
              <div class="text-[10px] text-amber-300/80 mt-0.5 font-medium">${p.remainingMinutes} min remaining</div>
            </div>

            <div class="flex items-center lg:justify-end col-span-2 sm:col-span-1 lg:col-span-1">
              <button onclick="window.GoldenHourApp.openHospitalSelector()" class="w-full lg:w-auto px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center justify-center gap-1 transition-all">
                Change Dest.
              </button>
            </div>
          </div>
        </div>



        <!-- SECTION B: VITAL SIGNS MONITORING -->
        <section class="space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                ${I.activity('w-5 h-5 text-blue-400')}
                Patient Vital Signs
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">
                Review the latest available measurements reported by connected monitoring devices. Each reading includes value, unit, timestamp, and connection/freshness status.
              </p>
            </div>

            <div class="flex items-center gap-2 text-xs">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span> Live (&lt;30s)
              </span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span> Stale (&gt;2m)
              </span>
              <button onclick="window.GoldenHourApp.openAlertThresholdsModal()" class="px-2.5 py-1 rounded bg-blue-950 hover:bg-blue-900 text-blue-400 border border-blue-800 text-xs">
                Alert Thresholds &bull; Settings
              </button>
            </div>
          </div>

          <!-- 4 VITAL SIGN CARDS -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            
            <!-- 1. Blood Pressure -->
            <div class="clinical-card p-5 space-y-3 relative">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-white uppercase tracking-wider">${v.bp.name} (BP)</span>
                <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Fresh &bull; ${v.bp.time}
                </span>
              </div>

              <div>
                <div class="flex items-baseline gap-1.5">
                  <span class="text-3xl font-extrabold text-white telemetry-num">${v.bp.value}</span>
                  <span class="text-sm font-semibold text-slate-400">${v.bp.unit}</span>
                </div>
                <div class="text-[11px] text-slate-400 mt-0.5">
                  Mean Arterial Pressure (MAP): <strong class="text-slate-200">93 mmHg</strong>
                </div>
              </div>

              <!-- Sparkline Canvas -->
              <div class="h-14 bg-slate-950/60 rounded p-1 border border-slate-900">
                <canvas id="chart-bp" class="w-full h-full"></canvas>
              </div>

              <div class="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 leading-tight">
                ${v.bp.helper}
              </div>
              
              <div class="text-[10px] text-slate-400 flex items-center justify-between">
                <span>Sensor: ${v.bp.device}</span>
                <span class="text-emerald-400">Oscillometric</span>
              </div>
            </div>

            <!-- 2. SpO2 (Oxygen Saturation) - WARNING CARD -->
            <div class="clinical-card-critical p-5 space-y-3 relative shadow-lg shadow-red-950/30">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-red-300 uppercase tracking-wider flex items-center gap-1">
                  ${I.alertTriangle('w-4 h-4 text-red-400')}
                  ${v.spo2.name} (SpO₂)
                </span>
                <span class="px-2 py-0.5 rounded text-[10px] bg-red-950 text-red-300 border border-red-500/50 flex items-center gap-1 font-bold">
                  <span class="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span> Clinical Warning
                </span>
              </div>

              <div>
                <div class="flex items-baseline gap-1.5">
                  <span id="live-spo2-val" class="text-3xl font-extrabold text-red-400 telemetry-num">${v.spo2.value}</span>
                  <span class="text-sm font-semibold text-red-300">${v.spo2.unit}</span>
                  <span class="text-[11px] text-red-400/90 ml-2 font-mono">(&darr; Desaturation)</span>
                </div>
                <div class="text-[11px] text-red-300 mt-0.5 font-medium">
                  Latest Reading: ${v.spo2.time} &bull; Sensor Active
                </div>
              </div>

              <!-- Sparkline Canvas -->
              <div class="h-14 bg-red-950/40 rounded p-1 border border-red-900/60">
                <canvas id="chart-spo2" class="w-full h-full"></canvas>
              </div>

              <div class="text-[11px] text-red-200/90 bg-red-950/60 p-2 rounded border border-red-800/60 leading-tight">
                <strong>Clinical Review Alert:</strong> ${v.spo2.helper}
              </div>

              <div class="text-[10px] text-red-300/80 flex items-center justify-between">
                <span>Sensor: ${v.spo2.device}</span>
                <span class="text-red-400 font-semibold">Prompt Review Req.</span>
              </div>
            </div>

            <!-- 3. Pulse Rate (Tachycardia warning) -->
            <div class="clinical-card-warning p-5 space-y-3 relative">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  ${I.heart('w-4 h-4 text-amber-400')}
                  ${v.pulse.name}
                </span>
                <span class="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-500/50 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Elevated &bull; ${v.pulse.time}
                </span>
              </div>

              <div>
                <div class="flex items-baseline gap-1.5">
                  <span id="live-pulse-val" class="text-3xl font-extrabold text-amber-400 telemetry-num">${v.pulse.value}</span>
                  <span class="text-sm font-semibold text-amber-300">${v.pulse.unit}</span>
                  <span class="text-[11px] text-amber-400 ml-2 font-mono">(&uarr; Tachycardia)</span>
                </div>
                <div class="text-[11px] text-amber-300/90 mt-0.5">
                  Lead II Rhythm: Sinus Tachycardia
                </div>
              </div>

              <!-- Sparkline Canvas -->
              <div class="h-14 bg-amber-950/40 rounded p-1 border border-amber-900/60">
                <canvas id="chart-pulse" class="w-full h-full"></canvas>
              </div>

              <div class="text-[11px] text-amber-200/90 border-t border-amber-800/50 pt-2 leading-tight">
                ${v.pulse.helper}
              </div>

              <div class="text-[10px] text-amber-300/80 flex items-center justify-between">
                <span>Sensor: ${v.pulse.device}</span>
                <span class="text-amber-400 font-medium">Impedance Normal</span>
              </div>
            </div>

            <!-- 4. End-Tidal CO2 (STALE/UNSTABLE SENSOR CARD) -->
            <div class="clinical-card p-5 space-y-3 relative border-amber-800/40">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-slate-300 uppercase tracking-wider">End-Tidal CO₂ (EtCO₂)</span>
                <span class="px-2 py-0.5 rounded text-[10px] bg-amber-950/70 text-amber-400 border border-amber-600/50 flex items-center gap-1 font-semibold">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Stale (&gt;2m ago)
                </span>
              </div>

              <div>
                <div class="flex items-baseline gap-1.5">
                  <span class="text-3xl font-extrabold text-slate-300 telemetry-num">${v.etco2.value}</span>
                  <span class="text-sm font-semibold text-slate-400">${v.etco2.unit}</span>
                  <span class="text-[10px] text-amber-400 ml-2 font-mono">(Signal Unstable)</span>
                </div>
                <div class="text-[11px] text-amber-400/90 mt-0.5">
                  Last verified: ${v.etco2.time} &bull; Unstable flow
                </div>
              </div>

              <!-- Sparkline Canvas -->
              <div class="h-14 bg-slate-950/60 rounded p-1 border border-slate-900">
                <canvas id="chart-etco2" class="w-full h-full"></canvas>
              </div>

              <div class="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 leading-tight">
                ${v.etco2.helper}
              </div>

              <div class="text-[10px] text-amber-400/90 flex items-center justify-between">
                <span>Sensor: ${v.etco2.device}</span>
                <button onclick="window.GoldenHourApp.openDeviceDrawer('CAPNO-LINE-772')" class="text-amber-400 underline hover:text-amber-300">
                  Check Signal &rarr;
                </button>
              </div>
            </div>

          </div>
        </section>


        <!-- MAIN 3-COLUMN CLINICAL DASHBOARD LAYOUT (ON WIDE SCREENS) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- COLUMN 1 (4 cols): Injury & Mechanism Assessment -->
          <div class="lg:col-span-4 space-y-6">
            
            <!-- SECTION C: INJURY INFORMATION -->
            <div class="clinical-card p-6 space-y-4">
              <div class="border-b border-[#1e3260] pb-3">
                <div class="text-[10px] font-bold text-blue-400 uppercase tracking-wider">SECTION C</div>
                <h3 class="text-lg font-bold text-white flex items-center gap-2">
                  Reported Injury Details
                </h3>
                <p class="text-[11px] text-slate-400 mt-0.5">
                  Initial pre-hospital clinical assessment from ambulance crew.
                </p>
              </div>

              <!-- MANDATORY CLINICAL DISCLAIMER -->
              <div class="p-3 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs flex items-start gap-2">
                ${I.info('w-4 h-4 text-blue-400 shrink-0 mt-0.5')}
                <div>
                  <strong>Clinical Notice:</strong> Label details as reported or suspected until clinically confirmed by the receiving trauma team. Do not present as a confirmed diagnosis.
                </div>
              </div>

              <div class="space-y-3 text-xs">
                <div>
                  <span class="text-slate-400 block font-medium">Suspected Injury Type:</span>
                  <span class="text-white font-semibold text-sm">${p.suspectedInjury}</span>
                  <span class="ml-1 text-[10px] text-amber-400 font-normal">(Suspected)</span>
                </div>

                <div>
                  <span class="text-slate-400 block font-medium">Injury Location:</span>
                  <span class="text-slate-200 font-medium">${p.injuryLocation}</span>
                </div>

                <div>
                  <span class="text-slate-400 block font-medium">Mechanism of Injury:</span>
                  <span class="text-slate-200 font-medium">${p.mechanismOfInjury}</span>
                </div>

                <div>
                  <span class="text-slate-400 block font-medium">Reported Symptoms:</span>
                  <span class="text-slate-200 font-medium">${p.reportedSymptoms}</span>
                </div>

                <div>
                  <span class="text-slate-400 block font-medium">Consciousness / Responsiveness:</span>
                  <span class="text-slate-200 font-medium">${p.consciousness}</span>
                </div>

                <div>
                  <span class="text-slate-400 block font-medium">Visible Bleeding / External Concerns:</span>
                  <span class="text-slate-200 font-medium">${p.visibleBleeding}</span>
                </div>

                <div>
                  <span class="text-slate-400 block font-medium">Assessment Status:</span>
                  <span class="inline-block px-2 py-0.5 mt-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    ${p.assessmentStatus}
                  </span>
                </div>

                <div class="border-t border-slate-800 pt-3">
                  <span class="text-slate-400 block font-medium mb-1">Additional Notes from Paramedic:</span>
                  <p class="text-slate-300 italic bg-slate-900/80 p-3 rounded border border-slate-800 text-[11px] leading-relaxed">
                    "${p.paramedicNotes}"
                  </p>
                </div>
              </div>

              <button onclick="window.GoldenHourApp.navigate('medicapture')" class="w-full py-2 px-3 rounded bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 border border-blue-700/50 text-xs font-medium flex items-center justify-center gap-1.5 transition-all">
                ${I.camera('w-4 h-4')}
                View Attached MediCapture Photos (2)
              </button>
            </div>

          </div>


          <!-- COLUMN 2 (4 cols): Care Requirements & Clinical Support Required -->
          <div class="lg:col-span-4 space-y-6">
            
            <!-- SECTION D: TREATMENT AND CLINICAL SUPPORT REQUIRED -->
            <div class="clinical-card p-6 space-y-4">
              <div class="border-b border-[#1e3260] pb-3">
                <div class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">SECTION D</div>
                <h3 class="text-lg font-bold text-white flex items-center gap-2">
                  Reported Care Requirements
                </h3>
                <p class="text-[11px] text-slate-400 mt-0.5">
                  Care and resources identified by ambulance team for hospital review.
                </p>
              </div>

              <!-- Clinical Authority Disclaimer -->
              <div class="p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs">
                <strong>Clinical Support Notice:</strong> All care requirements must come from authorized clinical staff. GoldenHour supports decisions rather than independently prescribing treatment.
              </div>

              <div class="space-y-3">
                ${p.careRequirements.map(item => `
                  <div class="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-1">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-bold text-white">${item.title}</span>
                      <span class="px-2 py-0.5 rounded text-[10px] ${
                        item.status.includes('Active') ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        item.status.includes('Preparing') ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-blue-950 text-blue-400 border border-blue-800'
                      }">
                        ${item.status}
                      </span>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed">${item.detail}</p>
                  </div>
                `).join('')}
              </div>

              <div class="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300 space-y-1">
                <strong>Hospital Action:</strong>
                <p>Review ambulance report and prepare appropriate assessment resources according to local hospital trauma protocols.</p>
              </div>
            </div>

          </div>


          <!-- COLUMN 3 (4 cols): Estimated Hospital Arrival & Activity Feed -->
          <div class="lg:col-span-4 space-y-6">
            
            <!-- SECTION E: ESTIMATED HOSPITAL ARRIVAL (ETA) -->
            <div class="clinical-card p-6 space-y-4">
              <div class="border-b border-[#1e3260] pb-3">
                <div class="text-[10px] font-bold text-amber-400 uppercase tracking-wider">SECTION E</div>
                <h3 class="text-lg font-bold text-white flex items-center gap-2">
                  Estimated Hospital Arrival
                </h3>
                <p class="text-[11px] text-slate-400 mt-0.5">
                  Track ambulance journey with live arrival projections.
                </p>
              </div>

              <!-- Main ETA Callout -->
              <div class="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 to-[#0e172e] border border-amber-500/40 space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-400">ESTIMATED TIME OF ARRIVAL</span>
                  <span class="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-600/60 font-semibold">
                    Traffic Revised
                  </span>
                </div>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-extrabold text-amber-400 telemetry-num">${p.updatedEta}</span>
                  <span class="text-sm font-semibold text-slate-300">(${p.remainingMinutes} min remaining)</span>
                </div>
                <div class="text-[11px] text-slate-300 flex items-center gap-1.5">
                  ${I.mapPin('w-3.5 h-3.5 text-blue-400')}
                  <span>Dest: <strong class="text-white">${p.receivingHospital}</strong></span>
                </div>
                <div class="text-[10px] text-amber-300/80 bg-amber-950/60 p-2 rounded border border-amber-800/40">
                  <strong>Notice:</strong> ${p.trafficNotice}
                </div>
              </div>

              <!-- Sample ETA Progression Timeline -->
              <div class="space-y-2 pt-1 text-xs">
                <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">ETA Revision Progression:</div>
                
                <div class="relative pl-5 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                  <div class="relative">
                    <span class="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                    <span class="font-bold text-slate-300 font-mono">10:00 AM:</span> Ambulance departs scene for hospital.
                  </div>
                  <div class="relative">
                    <span class="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                    <span class="font-bold text-slate-300 font-mono">10:05 AM:</span> Initial estimated arrival time: 10:25 AM.
                  </div>
                  <div class="relative">
                    <span class="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span class="font-bold text-amber-400 font-mono">10:10 AM:</span> Traffic congestion on bypass causes estimate update.
                  </div>
                  <div class="relative">
                    <span class="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span class="font-bold text-emerald-400 font-mono">10:11 AM:</span> Updated ETA confirmed: 10:36 AM.
                  </div>
                  <div class="relative opacity-60">
                    <span class="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                    <span class="font-bold text-slate-400 font-mono">Before Arrival:</span> Hospital staff review telemetry & prepare trauma bay.
                  </div>
                </div>
              </div>

              <div class="text-[10px] text-slate-500 italic border-t border-slate-800 pt-2">
                ETA is an estimate, not a guaranteed arrival time. Route factors and traffic subject to change.
              </div>
            </div>

            <!-- SECTION F: INCOMING PATIENT ACTIVITY TIMELINE -->
            <div class="clinical-card p-6 space-y-4">
              <div class="border-b border-[#1e3260] pb-3 flex items-center justify-between">
                <div>
                  <div class="text-[10px] font-bold text-blue-400 uppercase tracking-wider">SECTION F</div>
                  <h3 class="text-base font-bold text-white">Chronological Activity Feed</h3>
                </div>
                <span class="text-[10px] text-slate-400 font-mono">Live Audit Trail</span>
              </div>

              <div class="space-y-3 max-h-80 overflow-y-auto pr-1">
                ${state.activityTimeline.map(ev => `
                  <div class="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 text-xs space-y-1">
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-white">${ev.title}</span>
                      <span class="text-[10px] font-mono text-slate-400">${ev.time}</span>
                    </div>
                    <div class="text-[11px] text-slate-300 leading-snug">${ev.description}</div>
                    <div class="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <span>Source:</span> <span class="text-blue-400">${ev.source}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

        </div>

      </div>
    `;

    // Render Canvas Sparklines for vitals
    setTimeout(() => {
      this.initSparklines(v);
    }, 50);
  },

  initSparklines(v) {
    if (typeof Chart === 'undefined') return;

    const createSparkline = (canvasId, data, color, bgColor) => {
      const el = document.getElementById(canvasId);
      if (!el) return;
      const ctx = el.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['', '', '', '', '', ''],
          datasets: [{
            data: data,
            borderColor: color,
            backgroundColor: bgColor,
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointRadius: 2,
            pointBackgroundColor: color
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } },
          animation: false
        }
      });
    };

    createSparkline('chart-bp', v.bp.history, '#3b82f6', 'rgba(59, 130, 246, 0.15)');
    createSparkline('chart-spo2', v.spo2.history, '#ef4444', 'rgba(239, 68, 68, 0.2)');
    createSparkline('chart-pulse', v.pulse.history, '#f59e0b', 'rgba(245, 158, 11, 0.2)');
    createSparkline('chart-etco2', v.etco2.history, '#94a3b8', 'rgba(148, 163, 184, 0.1)');
  }
};

window.GoldenHourViews = window.GoldenHourViews || {};
window.GoldenHourViews.patient = PatientView;
