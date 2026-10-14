// GoldenHour Home Page View
// Cleaned, high-impact emergency telemetry overview (Safe Mode removed, Doctor Portal highlighted)

const HomeView = {
  render(container) {
    const I = window.GoldenHourIcons;
    const store = window.GoldenHourStore;
    const state = store.getAll();

    container.innerHTML = `
      <div class="space-y-14 pb-16">
        
        <!-- HERO SECTION -->
        <section class="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#101f42] to-[#0a1128] border border-[#1e3260] p-8 md:p-12 shadow-2xl">
          <div class="absolute inset-0 telemetry-grid-bg opacity-30 pointer-events-none"></div>
          
          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <!-- Hero Copy -->
            <div class="lg:col-span-7 space-y-5">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                PRE-HOSPITAL EMERGENCY TELEMETRY
              </div>

              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
                Every Second Before Arrival Matters.
              </h1>

              <p class="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                GoldenHour connects ambulances with receiving hospitals in real time, sharing patient vital signs, emergency details, and estimated arrival times so medical teams can prepare before the patient reaches the trauma bay.
              </p>

              <div class="flex flex-wrap items-center gap-3 pt-2">
                <button onclick="window.GoldenHourApp.navigate('doctor')" class="px-6 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2">
                  ${I.shield('w-5 h-5')}
                  Open Doctor Portal
                </button>
                <button onclick="window.GoldenHourApp.navigate('patient')" class="px-6 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2">
                  ${I.activity('w-5 h-5')}
                  Emergency Dashboard
                </button>
              </div>

              <div class="pt-4 border-t border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>From the ambulance to the trauma bay. One connected emergency response.</span>
              </div>
            </div>

            <!-- Hero Live Product Visual Preview -->
            <div class="lg:col-span-5">
              <div class="bg-[#0b132b] rounded-xl border border-blue-900/50 shadow-2xl p-5 space-y-4 relative">
                
                <!-- Card Header -->
                <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-red-500 beacon-red"></span>
                    <div>
                      <div class="text-xs font-bold text-white tracking-wider flex items-center gap-1.5">
                        PATIENT ${state.patient.id}
                        <span class="text-[10px] font-normal px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/60">HIGH PRIORITY</span>
                      </div>
                      <div class="text-[11px] text-slate-400">Unit: ${state.patient.ambulanceId} &bull; ${state.patient.status}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-[10px] text-slate-400">ESTIMATED ARRIVAL</div>
                    <div class="text-sm font-bold text-amber-400 telemetry-num">${state.patient.updatedEta} <span class="text-[10px] font-normal text-slate-400">(${state.patient.remainingMinutes} min)</span></div>
                  </div>
                </div>

                <!-- Mini Vitals Strip in Hero Preview -->
                <div class="grid grid-cols-2 gap-2.5">
                  <!-- SpO2 Alert -->
                  <div class="p-2.5 rounded-lg bg-red-950/40 border border-red-500/40">
                    <div class="flex items-center justify-between text-[11px] text-red-300">
                      <span>SpO₂ Oximetry</span>
                      <span class="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                    </div>
                    <div class="flex items-baseline gap-1 mt-1">
                      <span class="text-2xl font-bold text-red-400 telemetry-num">${state.vitals.spo2.value}</span>
                      <span class="text-xs text-red-300">%</span>
                    </div>
                    <div class="text-[10px] text-red-300 font-medium">Critical Desaturation (&darr;)</div>
                  </div>

                  <!-- Pulse -->
                  <div class="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30">
                    <div class="flex items-center justify-between text-[11px] text-amber-300">
                      <span>Pulse Rate</span>
                      <span class="text-[10px] text-slate-400">Lead II</span>
                    </div>
                    <div class="flex items-baseline gap-1 mt-1">
                      <span class="text-2xl font-bold text-amber-400 telemetry-num">${state.vitals.pulse.value}</span>
                      <span class="text-xs text-amber-300">bpm</span>
                    </div>
                    <div class="text-[10px] text-amber-300">Sinus Tachycardia</div>
                  </div>

                  <!-- BP -->
                  <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div class="text-[11px] text-slate-400">Blood Pressure</div>
                    <div class="flex items-baseline gap-1 mt-1">
                      <span class="text-xl font-bold text-slate-200 telemetry-num">${state.vitals.bp.value}</span>
                      <span class="text-xs text-slate-400">mmHg</span>
                    </div>
                    <div class="text-[10px] text-slate-500">Auto NIBP 10:10 AM</div>
                  </div>

                  <!-- EtCO2 -->
                  <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div class="flex items-center justify-between text-[11px] text-slate-400">
                      <span>EtCO₂ Capno</span>
                      <span class="text-[10px] text-amber-400">Unstable</span>
                    </div>
                    <div class="flex items-baseline gap-1 mt-1">
                      <span class="text-xl font-bold text-slate-200 telemetry-num">${state.vitals.etco2.value}</span>
                      <span class="text-xs text-slate-400">mmHg</span>
                    </div>
                    <div class="text-[10px] text-amber-400">Freshness 2m ago</div>
                  </div>
                </div>

                <!-- Destination Preview -->
                <div class="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-400 flex items-center gap-1.5">
                      ${I.mapPin('w-3.5 h-3.5 text-blue-400')}
                      Dest: <strong class="text-white">${state.selectedHospital}</strong>
                    </span>
                    <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">Bay 2 Ready</span>
                  </div>
                  <div class="text-[10px] text-blue-400 font-mono">
                    8.4 km remaining &bull; ETA: ${state.patient.updatedEta}
                  </div>
                </div>

                <!-- Quick Doctor Portal Link -->
                <div class="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                  <span class="text-slate-400">Attending: Dr. R. Vance</span>
                  <button onclick="window.GoldenHourApp.navigate('doctor')" class="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1">
                    Doctor Command View &rarr;
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>


        <!-- THE CHALLENGE BEFORE ARRIVAL -->
        <section class="space-y-6">
          <div class="max-w-3xl">
            <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              The Emergency Starts Before the Hospital Door.
            </h2>
            <p class="text-slate-300 mt-2 text-sm leading-relaxed">
              When an ambulance transports an injured patient, pre-hospital information is vital for the receiving trauma team. GoldenHour sends live measurements and updates during transport so specialists can mobilize before arrival.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
            <div class="clinical-card p-6 space-y-2">
              <div class="w-10 h-10 rounded-lg bg-blue-900/30 border border-blue-500/30 flex items-center justify-center text-blue-400">
                ${I.activity('w-5 h-5')}
              </div>
              <h3 class="text-base font-bold text-white">Know the Condition</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Stream vital signs, waveform trends, and initial assessment in real time.
              </p>
            </div>

            <div class="clinical-card p-6 space-y-2">
              <div class="w-10 h-10 rounded-lg bg-amber-900/30 border border-amber-500/30 flex items-center justify-center text-amber-400">
                ${I.clock('w-5 h-5')}
              </div>
              <h3 class="text-base font-bold text-white">Know Arrival Time</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Follow GPS location updates with automatic traffic congestion recalculations.
              </p>
            </div>

            <div class="clinical-card p-6 space-y-2">
              <div class="w-10 h-10 rounded-lg bg-emerald-900/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                ${I.shield('w-5 h-5')}
              </div>
              <h3 class="text-base font-bold text-white">Prepare the Team</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Issue pre-arrival doctor directives, reserve blood units, and prime trauma bays.
              </p>
            </div>
          </div>
        </section>


        <!-- CORE CAPABILITIES (STREAMLINED, SAFE MODE REMOVED, DOCTOR PORTAL ADDED) -->
        <section class="space-y-6 pt-2">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-white tracking-tight">Operational Systems</h2>
            <span class="text-xs text-slate-400 font-mono">Integrated Platform</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <!-- Doctor Portal -->
            <div onclick="window.GoldenHourApp.navigate('doctor')" class="clinical-card p-5 hover:bg-[#152244] cursor-pointer transition-all border-l-4 border-l-emerald-500 group flex flex-col justify-between">
              <div>
                <div class="w-10 h-10 rounded-lg bg-emerald-900/40 text-emerald-400 flex items-center justify-center mb-3">
                  ${I.shield('w-5 h-5')}
                </div>
                <h3 class="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">Doctor Portal</h3>
                <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                  Single-screen command hub for trauma physicians to view vitals, injuries, tracking, and issue pre-orders.
                </p>
              </div>
              <div class="text-xs font-semibold text-emerald-400 mt-4 flex items-center gap-1">
                Open Portal &rarr;
              </div>
            </div>

            <!-- Incoming Patient -->
            <div onclick="window.GoldenHourApp.navigate('patient')" class="clinical-card p-5 hover:bg-[#152244] cursor-pointer transition-all group flex flex-col justify-between">
              <div>
                <div class="w-10 h-10 rounded-lg bg-blue-900/40 text-blue-400 flex items-center justify-center mb-3">
                  ${I.activity('w-5 h-5')}
                </div>
                <h3 class="text-base font-bold text-white group-hover:text-blue-400 transition-colors">Incoming Patient</h3>
                <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                  3-column trauma dashboard with SpO₂ 88% warning, BP, pulse waveforms, and injury details.
                </p>
              </div>
              <div class="text-xs font-medium text-blue-400 mt-4 flex items-center gap-1">
                Open Dashboard &rarr;
              </div>
            </div>

            <!-- Live Tracking -->
            <div onclick="window.GoldenHourApp.navigate('tracking')" class="clinical-card p-5 hover:bg-[#152244] cursor-pointer transition-all group flex flex-col justify-between">
              <div>
                <div class="w-10 h-10 rounded-lg bg-emerald-900/40 text-emerald-400 flex items-center justify-center mb-3">
                  ${I.mapPin('w-5 h-5')}
                </div>
                <h3 class="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">Live Tracking</h3>
                <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                  Google Maps API tracking stream with traffic routing, ETA updates, and vehicle telemetry.
                </p>
              </div>
              <div class="text-xs font-medium text-emerald-400 mt-4 flex items-center gap-1">
                Open Map &rarr;
              </div>
            </div>

            <!-- LifeLink AI Chatbot -->
            <div onclick="window.GoldenHourApp.navigate('lifelink')" class="clinical-card p-5 hover:bg-[#152244] cursor-pointer transition-all group flex flex-col justify-between">
              <div>
                <div class="w-10 h-10 rounded-lg bg-indigo-900/40 text-indigo-400 flex items-center justify-center mb-3">
                  ${I.bot('w-5 h-5')}
                </div>
                <h3 class="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">LifeLink AI Chatbot</h3>
                <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                  Conversational clinical chatbot with case history, SBAR handovers, and protocol analysis.
                </p>
              </div>
              <div class="text-xs font-medium text-indigo-400 mt-4 flex items-center gap-1">
                Launch Chatbot &rarr;
              </div>
            </div>

            <!-- Priority Selection -->
            <div onclick="window.GoldenHourApp.navigate('priority')" class="clinical-card p-5 hover:bg-[#152244] cursor-pointer transition-all group flex flex-col justify-between">
              <div>
                <div class="w-10 h-10 rounded-lg bg-red-900/40 text-red-400 flex items-center justify-center mb-3">
                  ${I.layers('w-5 h-5')}
                </div>
                <h3 class="text-base font-bold text-white group-hover:text-red-400 transition-colors">Priority Queue</h3>
                <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                  Records and events transmission queue with priority filtering and manual override audit logs.
                </p>
              </div>
              <div class="text-xs font-medium text-red-400 mt-4 flex items-center gap-1">
                View Queue &rarr;
              </div>
            </div>

            <!-- MediCapture -->
            <div onclick="window.GoldenHourApp.navigate('medicapture')" class="clinical-card p-5 hover:bg-[#152244] cursor-pointer transition-all group flex flex-col justify-between">
              <div>
                <div class="w-10 h-10 rounded-lg bg-cyan-900/40 text-cyan-400 flex items-center justify-center mb-3">
                  ${I.camera('w-5 h-5')}
                </div>
                <h3 class="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">MediCapture Vault</h3>
                <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                  Encrypted clinical photo/video uploader and secure trauma bay review gallery.
                </p>
              </div>
              <div class="text-xs font-medium text-cyan-400 mt-4 flex items-center gap-1">
                Media Vault &rarr;
              </div>
            </div>

            <!-- Device Status -->
            <div onclick="window.GoldenHourApp.navigate('devices')" class="clinical-card p-5 hover:bg-[#152244] cursor-pointer transition-all group flex flex-col justify-between">
              <div>
                <div class="w-10 h-10 rounded-lg bg-purple-900/40 text-purple-400 flex items-center justify-center mb-3">
                  ${I.cpu('w-5 h-5')}
                </div>
                <h3 class="text-base font-bold text-white group-hover:text-purple-400 transition-colors">Device Status</h3>
                <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                  Health monitoring for ECG, SpO₂, NIBP, EtCO₂, and GNSS telemetry units.
                </p>
              </div>
              <div class="text-xs font-medium text-purple-400 mt-4 flex items-center gap-1">
                Diagnostics &rarr;
              </div>
            </div>

            <!-- Hospital Finder -->
            <div onclick="window.GoldenHourApp.navigate('hospitals')" class="clinical-card p-5 hover:bg-[#152244] cursor-pointer transition-all group flex flex-col justify-between">
              <div>
                <div class="w-10 h-10 rounded-lg bg-teal-900/40 text-teal-400 flex items-center justify-center mb-3">
                  ${I.building('w-5 h-5')}
                </div>
                <h3 class="text-base font-bold text-white group-hover:text-teal-400 transition-colors">Hospital Finder</h3>
                <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                  Compare regional receiving facilities by travel time, verified specialty, and acceptance status.
                </p>
              </div>
              <div class="text-xs font-medium text-teal-400 mt-4 flex items-center gap-1">
                Compare Centers &rarr;
              </div>
            </div>

          </div>
        </section>

      </div>
    `;
  }
};

window.GoldenHourViews = window.GoldenHourViews || {};
window.GoldenHourViews.home = HomeView;
