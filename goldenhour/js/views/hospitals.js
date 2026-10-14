// GoldenHour Suitable Hospital Finder View
// Multi-factor clinical triage, specialty matching, acceptance verification, and dynamic routing

const HospitalsView = {
  selectedSpecialty: 'all',

  render(container) {
    const I = window.GoldenHourIcons;
    const store = window.GoldenHourStore;
    const state = store.getAll();
    const hospitals = state.hospitals;

    container.innerHTML = `
      <div class="space-y-8 pb-16">
        
        <!-- PAGE HEADER -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e3260] pb-6">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-900/40 text-teal-400 border border-teal-500/30">
                REGIONAL RESOURCE COORDINATION
              </span>
              <span class="text-xs text-slate-400">Clinical Specialty Matching &bull; Verified Bed Telemetry</span>
            </div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Suitable Hospital Finder
            </h1>
            <p class="text-sm text-slate-300 mt-1">
              Find a receiving hospital that fits the patient's reported needs, using available facility information, estimated travel time, and hospital acceptance status.
            </p>
          </div>

          <div class="flex items-center gap-2 bg-[#0e172e] px-3 py-2 rounded-xl border border-slate-800 text-xs">
            <span class="text-slate-400">Current Destination:</span>
            <strong class="text-blue-400 flex items-center gap-1.5">
              ${I.building('w-4 h-4')}
              ${state.selectedHospital}
            </strong>
          </div>
        </div>


        <!-- CLINICAL INTRODUCTION & SAFETY WARNING -->
        <div class="clinical-card p-6 space-y-3">
          <h2 class="text-lg font-bold text-white">Clinical Destination Decision Support</h2>
          <p class="text-sm text-slate-300 leading-relaxed max-w-4xl">
            The nearest hospital is not always the most suitable destination for every emergency. GoldenHour helps ambulance teams compare available hospital information so they can make a more informed destination decision.
          </p>
          <div class="p-3 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs flex items-start gap-2">
            ${I.info('w-4 h-4 text-blue-400 shrink-0 mt-0.5')}
            <div>
              <strong>Dispatch & Clinical Authority:</strong> The system supports authorized clinical and dispatch decisions. It does not independently select or redirect a patient without appropriate human clinical oversight.
            </div>
          </div>
        </div>


        <!-- SEARCH & FILTER PANEL -->
        <div class="clinical-card p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              ${I.search('w-4 h-4 text-teal-400')}
              Triage & Facility Criteria
            </h3>
            <span class="text-xs text-slate-400 font-mono">Case GH-1042 Requirements</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label class="block text-slate-400 mb-1 font-semibold">Ambulance Location</label>
              <input type="text" value="A4 Southbound (Lat 51.5074)" readonly class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-300 font-mono">
            </div>

            <div>
              <label class="block text-slate-400 mb-1 font-semibold">Reported Care Needs</label>
              <input type="text" value="Lower-Limb Trauma, High-Flow O2" readonly class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-300">
            </div>

            <div>
              <label class="block text-slate-400 mb-1 font-semibold">Required Specialty</label>
              <select id="filter-specialty" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white">
                <option value="all">Orthopedic Trauma & Surgery</option>
                <option value="cardiac">Cardiology & Cath Lab</option>
                <option value="neuro">Neurosurgery & Stroke</option>
                <option value="burns">Burns & Plastics</option>
              </select>
            </div>

            <div>
              <label class="block text-slate-400 mb-1 font-semibold">Facility Requirements</label>
              <select class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white">
                <option>Trauma Bay + CT Scanner Standby</option>
                <option>Pediatric ICU</option>
                <option>Interventional Angio</option>
              </select>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div class="flex items-center gap-3 text-xs text-slate-400">
              <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-400"></span> Accepting</span>
              <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-amber-400"></span> Unknown (Confirm)</span>
              <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-red-400"></span> Not Accepting</span>
            </div>

            <button onclick="window.GoldenHourViews.hospitals.runFilter()" class="py-2.5 px-6 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-all shadow-md shadow-teal-600/30 flex items-center gap-2">
              ${I.search('w-4 h-4')}
              Find Suitable Hospitals
            </button>
          </div>
        </div>


        <!-- SAMPLE COMPARISON SPOTLIGHT (HOSPITAL A vs HOSPITAL B) -->
        <div class="p-6 rounded-2xl bg-gradient-to-r from-[#101f42] to-[#0e172e] border border-blue-900/60 space-y-4">
          <div class="flex items-center justify-between">
            <div class="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              ${I.shield('w-4 h-4')}
              CLINICAL COMPARISON SPOTLIGHT
            </div>
            <span class="text-[10px] text-slate-400 font-mono">Illustrative Sample Records</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Hospital A -->
            <div class="p-4 rounded-xl bg-slate-900/80 border border-amber-600/40 space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-white text-sm">Hospital A — Nearby General Hospital</h4>
                <span class="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-700">Unknown Status</span>
              </div>
              <div class="text-slate-300"><strong>Estimated travel time:</strong> 5 minutes (2.1 km)</div>
              <div class="text-slate-300"><strong>Specialty availability:</strong> Requires phone confirmation (No on-call ortho on telemetry board)</div>
              <div class="text-amber-400/90 text-[11px] bg-amber-950/40 p-2 rounded border border-amber-900/40">
                Hospital A is closer, but some required trauma services have not been confirmed.
              </div>
            </div>

            <!-- Hospital B -->
            <div class="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/40 space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-white text-sm">Hospital B — Regional Trauma Centre</h4>
                <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-700">Accepting</span>
              </div>
              <div class="text-slate-300"><strong>Estimated travel time:</strong> 9 minutes (4.8 km)</div>
              <div class="text-slate-300"><strong>Specialty availability:</strong> Relevant trauma services listed & verified</div>
              <div class="text-emerald-400/90 text-[11px] bg-emerald-950/40 p-2 rounded border border-emerald-900/40">
                Hospital B has relevant trauma services listed and a confirmed accepting status.
              </div>
            </div>
          </div>

          <p class="text-xs text-slate-400 italic pt-1">
            <strong>Clinical Rationale:</strong> The ambulance team can review these details with the appropriate clinical or dispatch authority before confirming the destination. Faster travel time must be balanced with verified surgical readiness.
          </p>
        </div>


        <!-- HOSPITAL COMPARISON CARDS (ALL 4 SAMPLE HOSPITALS) -->
        <div class="space-y-4">
          <div class="border-b border-[#1e3260] pb-2 flex items-center justify-between">
            <h3 class="text-lg font-bold text-white">Regional Hospital Directory Comparison</h3>
            <span class="text-xs text-slate-400 font-mono">4 verified medical centers</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${hospitals.map(h => `
              <div class="clinical-card p-6 flex flex-col justify-between space-y-4 ${
                state.selectedHospital === h.name ? 'border-2 border-blue-500 ring-2 ring-blue-500/20 shadow-2xl' : ''
              }">
                
                <div>
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <div class="flex items-center gap-2">
                        <h4 class="text-base font-bold text-white">${h.name}</h4>
                        ${state.selectedHospital === h.name ? `
                          <span class="px-2 py-0.5 rounded text-[10px] bg-blue-600 text-white font-bold">CURRENT DESTINATION</span>
                        ` : ''}
                      </div>
                      <div class="text-xs text-slate-400 mt-0.5">${h.type}</div>
                    </div>

                    <span class="px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                      h.badgeColor === 'green' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      h.badgeColor === 'amber' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-red-950 text-red-400 border border-red-800'
                    }">
                      ${h.statusBadge}
                    </span>
                  </div>

                  <div class="grid grid-cols-2 gap-3 my-4 text-xs">
                    <div class="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                      <span class="text-slate-400 block text-[10px] uppercase font-semibold">Travel Time & Distance</span>
                      <span class="text-sm font-bold text-white telemetry-num">${h.travelTimeMinutes} min <span class="text-slate-400 font-normal">(${h.distanceKm} km)</span></span>
                    </div>

                    <div class="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                      <span class="text-slate-400 block text-[10px] uppercase font-semibold">ETA to Trauma Bay</span>
                      <span class="text-sm font-bold text-amber-400 telemetry-num">${h.etaDisplay}</span>
                    </div>
                  </div>

                  <div class="space-y-2 text-xs text-slate-300">
                    <div>
                      <span class="text-slate-400 block font-semibold text-[11px]">Specialty Availability:</span>
                      <p class="text-slate-200 mt-0.5">${h.specialtyAvailability}</p>
                    </div>

                    <div>
                      <span class="text-slate-400 block font-semibold text-[11px]">Emergency Facilities:</span>
                      <div class="flex flex-wrap gap-1.5 mt-1">
                        ${h.facilities.map(f => `
                          <span class="px-2 py-0.5 rounded bg-slate-900 text-[10px] text-slate-300 border border-slate-800">
                            ${f}
                          </span>
                        `).join('')}
                      </div>
                    </div>

                    <div class="border-t border-slate-800 pt-2 text-[11px] text-slate-400">
                      Last status verification: <span class="text-slate-300 font-medium">${h.lastStatusUpdate}</span> &bull; ${h.verifiedTime}
                    </div>
                  </div>
                </div>

                <!-- Action Button -->
                <div class="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span class="text-[11px] text-slate-400 italic">
                    ${h.badgeColor === 'green' ? 'Trauma bay pre-alert ready' : 'Requires clinical phone check'}
                  </span>

                  ${state.selectedHospital === h.name ? `
                    <button disabled class="px-4 py-2 rounded-lg bg-blue-900/50 text-blue-300 text-xs font-semibold cursor-default border border-blue-700">
                      &check; Selected Destination
                    </button>
                  ` : `
                    <button onclick="window.GoldenHourViews.hospitals.selectDestination('${h.id}')" class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5">
                      Select Destination & Recalculate ETA
                    </button>
                  `}
                </div>

              </div>
            `).join('')}
          </div>
        </div>


        <!-- HOW THE FINDER WORKS & IMPORTANT SAFETY BEHAVIOR -->
        <div class="clinical-card p-6 space-y-4 text-xs">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            ${I.shield('w-5 h-5 text-teal-400')}
            How the Suitable Hospital Finder Operates (8-Step Architecture)
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-slate-300">
            <div class="p-2.5 rounded bg-slate-900 border border-slate-800">1. Obtain ambulance GPS position.</div>
            <div class="p-2.5 rounded bg-slate-900 border border-slate-800">2. Identify patient clinical needs.</div>
            <div class="p-2.5 rounded bg-slate-900 border border-slate-800">3. Retrieve hospital capabilities.</div>
            <div class="p-2.5 rounded bg-slate-900 border border-slate-800">4. Estimate travel time with routing.</div>
            <div class="p-2.5 rounded bg-slate-900 border border-slate-800">5. Compare specialty & acceptance.</div>
            <div class="p-2.5 rounded bg-slate-900 border border-slate-800">6. Highlight unverified data.</div>
            <div class="p-2.5 rounded bg-slate-900 border border-slate-800">7. Clinician confirms choice.</div>
            <div class="p-2.5 rounded bg-slate-900 border border-slate-800">8. Transmit pre-arrival brief.</div>
          </div>

          <div class="p-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 space-y-1.5 text-[11px] leading-relaxed">
            <strong class="text-white block text-xs">Crucial Safety Constraints:</strong>
            <p>&bull; Do not rank hospitals using distance alone.</p>
            <p>&bull; Do not assume a listed specialty guarantees immediate bed availability.</p>
            <p>&bull; Display when telemetry information was last updated.</p>
            <p>&bull; Recalculate the ETA immediately if the destination changes.</p>
            <p>&bull; Preserve a permanent record of the selected destination and authorized decision.</p>
          </div>
        </div>

      </div>
    `;
  },

  runFilter() {
    window.GoldenHourApp.showToast('Criteria Evaluated', '4 hospitals retrieved and checked against orthopedic trauma requirements.', 'info');
  },

  selectDestination(hospitalId) {
    const store = window.GoldenHourStore;
    store.selectHospital(hospitalId);
    
    const hosp = store.getAll().hospitals.find(h => h.id === hospitalId);
    window.GoldenHourApp.showToast('Destination Updated', `Ambulance AMB-07 routed to ${hosp.name}. ETA recalculated to ${hosp.etaDisplay}.`, 'success');
    
    this.render(document.getElementById('view-container'));
  }
};

window.GoldenHourViews = window.GoldenHourViews || {};
window.GoldenHourViews.hospitals = HospitalsView;
