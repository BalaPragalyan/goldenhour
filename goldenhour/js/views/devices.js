// GoldenHour Device Status View
// Hardware health check, connection monitoring, and troubleshooting diagnostics

const DevicesView = {
  currentFilter: 'all',

  render(container) {
    const I = window.GoldenHourIcons;
    const store = window.GoldenHourStore;
    const state = store.getAll();
    const devices = state.devices;

    const filteredDevices = devices.filter(d => {
      if (this.currentFilter === 'connected') return d.status === 'Connected';
      if (this.currentFilter === 'attention') return d.status === 'Signal Unstable';
      if (this.currentFilter === 'disconnected') return d.status === 'Disconnected';
      return true;
    });

    container.innerHTML = `
      <div class="space-y-8 pb-16">
        
        <!-- PAGE HEADER -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e3260] pb-6">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900/40 text-purple-400 border border-purple-500/30">
                TELEMETRY BUS & SENSORS
              </span>
              <span class="text-xs text-slate-400">Continuous Heartbeat & Impedance Verification</span>
            </div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Device Status
            </h1>
            <p class="text-sm text-slate-300 mt-1">
              Check whether the monitoring devices and communication systems are connected, reporting data, and ready for use.
            </p>
          </div>

          <button onclick="window.GoldenHourApp.runHealthCheck()" class="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all flex items-center gap-2">
            ${I.refresh('w-4 h-4')}
            Run System Health Check
          </button>
        </div>


        <!-- DEVICE READINESS SUMMARY -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div class="clinical-card p-5 border-l-4 border-l-emerald-500 space-y-1">
            <div class="text-[11px] text-slate-400 uppercase font-semibold">Connected Devices</div>
            <div class="text-3xl font-extrabold text-emerald-400 telemetry-num">4</div>
            <div class="text-[11px] text-slate-400">Reporting data within spec</div>
          </div>

          <div class="clinical-card p-5 border-l-4 border-l-amber-500 space-y-1">
            <div class="text-[11px] text-slate-400 uppercase font-semibold">Requiring Attention</div>
            <div class="text-3xl font-extrabold text-amber-400 telemetry-num">1</div>
            <div class="text-[11px] text-amber-300/80">EtCO₂ Microstream Unstable</div>
          </div>

          <div class="clinical-card p-5 border-l-4 border-l-slate-600 space-y-1">
            <div class="text-[11px] text-slate-400 uppercase font-semibold">Disconnected Devices</div>
            <div class="text-3xl font-extrabold text-slate-400 telemetry-num">0</div>
            <div class="text-[11px] text-slate-500">No hardware faults logged</div>
          </div>

          <div class="clinical-card p-5 border-l-4 border-l-blue-500 space-y-1">
            <div class="text-[11px] text-slate-400 uppercase font-semibold">Last System Health Check</div>
            <div class="text-xl font-bold text-slate-200 telemetry-num">10:11 AM</div>
            <div class="text-[11px] text-emerald-400 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Verified normal
            </div>
          </div>

        </div>

        <!-- CLINICAL SAFETY BOUNDARY NOTICE -->
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 flex items-start gap-3">
          ${I.info('w-5 h-5 text-blue-400 shrink-0 mt-0.5')}
          <div>
            <strong class="text-white">Clinical Readiness Distinction:</strong>
            Do not claim that a device is clinically ready merely because it is connected. Connection status (technical link) and clinical readiness (proper sensor placement, physiological contact, signal interpretation) are separate concepts.
          </div>
        </div>


        <!-- STATUS LEGEND & FILTER TOOLBAR -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0e172e] p-4 rounded-xl border border-slate-800">
          
          <!-- Legend with Textual Status alongside color -->
          <div class="flex flex-wrap items-center gap-4 text-xs">
            <span class="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Status Legend:</span>
            
            <span class="flex items-center gap-1.5 text-emerald-400">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <strong>Green:</strong> Connected & reporting
            </span>

            <span class="flex items-center gap-1.5 text-amber-400">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <strong>Amber:</strong> Signal requires attention
            </span>

            <span class="flex items-center gap-1.5 text-red-400">
              <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <strong>Red:</strong> Confirmed fault / failure
            </span>

            <span class="flex items-center gap-1.5 text-slate-400">
              <span class="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
              <strong>Gray:</strong> Disconnected / unavailable
            </span>
          </div>

          <!-- Filter buttons -->
          <div class="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button onclick="window.GoldenHourViews.devices.setFilter('all')" class="px-2.5 py-1 rounded text-xs font-semibold ${this.currentFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}">
              All (${devices.length})
            </button>
            <button onclick="window.GoldenHourViews.devices.setFilter('connected')" class="px-2.5 py-1 rounded text-xs font-semibold ${this.currentFilter === 'connected' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}">
              Connected
            </button>
            <button onclick="window.GoldenHourViews.devices.setFilter('attention')" class="px-2.5 py-1 rounded text-xs font-semibold ${this.currentFilter === 'attention' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}">
              Attention (1)
            </button>
          </div>

        </div>


        <!-- DEVICE STATUS TABLE / LIST -->
        <div class="clinical-card overflow-hidden shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-[#101f42] text-slate-300 uppercase tracking-wider text-[10px] font-bold border-b border-[#1e3260]">
                <tr>
                  <th class="py-3.5 px-4">Device Name & ID</th>
                  <th class="py-3.5 px-4">Connection State</th>
                  <th class="py-3.5 px-4">Latest Update</th>
                  <th class="py-3.5 px-4">Signal Quality</th>
                  <th class="py-3.5 px-4">Power / Battery</th>
                  <th class="py-3.5 px-4">Clinical Readiness Status</th>
                  <th class="py-3.5 px-4 text-right">Diagnostic Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                ${filteredDevices.map(d => `
                  <tr class="hover:bg-[#152244] transition-colors cursor-pointer group" onclick="window.GoldenHourApp.openDeviceDrawer('${d.id}')">
                    
                    <td class="py-4 px-4">
                      <div class="font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                        ${d.name}
                      </div>
                      <div class="text-[10px] text-slate-400 font-mono mt-0.5">${d.id} &bull; ${d.channel}</div>
                    </td>

                    <td class="py-4 px-4 whitespace-nowrap">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        d.status === 'Connected' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        d.status === 'Signal Unstable' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-red-950 text-red-400 border border-red-800'
                      }">
                        <span class="w-2 h-2 rounded-full ${
                          d.status === 'Connected' ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'
                        }"></span>
                        ${d.status}
                      </span>
                    </td>

                    <td class="py-4 px-4 font-mono text-slate-200">
                      ${d.lastUpdate}
                    </td>

                    <td class="py-4 px-4">
                      <div class="flex items-center gap-2">
                        <div class="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div class="h-full ${
                            parseInt(d.signalQuality) > 80 ? 'bg-emerald-500' : 'bg-amber-500'
                          }" style="width: ${d.signalQuality}"></div>
                        </div>
                        <span class="font-mono text-slate-300">${d.signalQuality}</span>
                      </div>
                    </td>

                    <td class="py-4 px-4 font-mono text-slate-300">
                      ${d.batteryLevel}
                    </td>

                    <td class="py-4 px-4 text-slate-300 max-w-xs">
                      ${d.clinicalReadiness}
                    </td>

                    <td class="py-4 px-4 text-right">
                      <button onclick="event.stopPropagation(); window.GoldenHourApp.openDeviceDrawer('${d.id}')" class="px-3 py-1.5 rounded bg-slate-800 group-hover:bg-blue-600 group-hover:text-white text-slate-300 border border-slate-700 transition-all font-semibold">
                        ${d.actionText} &rarr;
                      </button>
                    </td>

                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  },

  setFilter(filter) {
    this.currentFilter = filter;
    this.render(document.getElementById('view-container'));
  }
};

window.GoldenHourViews = window.GoldenHourViews || {};
window.GoldenHourViews.devices = DevicesView;
