// GoldenHour Priority Selection View
// Clean, streamlined Records & Events Transmission Queue Table (All introductory text removed per user specification)

const PriorityView = {
  currentFilter: 'all',
  searchQuery: '',

  render(container) {
    const I = window.GoldenHourIcons;
    const store = window.GoldenHourStore;
    const state = store.getAll();
    const queue = state.priorityQueue;

    const filteredQueue = queue.filter(item => {
      // Filter tab
      let matchesTab = true;
      if (this.currentFilter === 'critical') matchesTab = item.priority === 'Critical';
      else if (this.currentFilter === 'high') matchesTab = item.priority === 'High';
      else if (this.currentFilter === 'normal') matchesTab = item.priority === 'Normal';
      else if (this.currentFilter === 'pending') matchesTab = item.status.includes('Queued') || item.status.includes('Safe');

      // Search query
      let matchesSearch = true;
      if (this.searchQuery) {
        const sq = this.searchQuery.toLowerCase();
        matchesSearch = item.name.toLowerCase().includes(sq) || item.id.toLowerCase().includes(sq) || item.category.toLowerCase().includes(sq);
      }

      return matchesTab && matchesSearch;
    });

    container.innerHTML = `
      <div class="space-y-6 pb-16">
        
        <!-- PAGE HEADER (CLEAN & MINIMAL) -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e3260] pb-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Transmission Priority Records & Events
            </h1>
            <p class="text-xs text-slate-400 mt-1">
              Active telemetry packet queue for Case ${state.patient.id} (${state.patient.ambulanceId})
            </p>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-xs text-slate-400 font-mono">
              Total Records: <strong class="text-white">${queue.length}</strong>
            </span>
          </div>
        </div>


        <!-- TOOLBAR: FILTER TABS & LIVE SEARCH -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0c1429] p-3 rounded-xl border border-slate-800">
          
          <!-- Filter Tabs -->
          <div class="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            <button onclick="window.GoldenHourViews.priority.setFilter('all')" class="px-3 py-1.5 rounded-lg ${this.currentFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'} transition-all">
              All Records (${queue.length})
            </button>
            <button onclick="window.GoldenHourViews.priority.setFilter('critical')" class="px-3 py-1.5 rounded-lg ${this.currentFilter === 'critical' ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'} transition-all flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-red-400"></span>
              Critical (${queue.filter(q => q.priority === 'Critical').length})
            </button>
            <button onclick="window.GoldenHourViews.priority.setFilter('high')" class="px-3 py-1.5 rounded-lg ${this.currentFilter === 'high' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'} transition-all flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-amber-400"></span>
              High (${queue.filter(q => q.priority === 'High').length})
            </button>
            <button onclick="window.GoldenHourViews.priority.setFilter('normal')" class="px-3 py-1.5 rounded-lg ${this.currentFilter === 'normal' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'} transition-all">
              Normal (${queue.filter(q => q.priority === 'Normal').length})
            </button>
            <button onclick="window.GoldenHourViews.priority.setFilter('pending')" class="px-3 py-1.5 rounded-lg ${this.currentFilter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'} transition-all">
              Pending / In Flight
            </button>
          </div>

          <!-- Instant Search Box -->
          <div class="relative w-full sm:w-64">
            <input 
              type="text" 
              id="priority-search-input"
              value="${this.searchQuery}"
              placeholder="Search records by name or ID..."
              oninput="window.GoldenHourViews.priority.handleSearch(event)"
              class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            >
            <div class="absolute left-2.5 top-2 text-slate-500">
              ${I.search('w-3.5 h-3.5')}
            </div>
          </div>

        </div>


        <!-- RECORDS & EVENTS QUEUE TABLE -->
        <div class="clinical-card overflow-hidden shadow-2xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-[#101f42] text-slate-300 uppercase tracking-wider text-[10px] font-bold border-b border-[#1e3260]">
                <tr>
                  <th class="py-3.5 px-4">Record / Telemetry Event</th>
                  <th class="py-3.5 px-4">Patient ID</th>
                  <th class="py-3.5 px-4">Category</th>
                  <th class="py-3.5 px-4">Assigned Priority</th>
                  <th class="py-3.5 px-4">Time Created</th>
                  <th class="py-3.5 px-4">Transmission Status</th>
                  <th class="py-3.5 px-4">Retries</th>
                  <th class="py-3.5 px-4 text-right">Authorized Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                ${filteredQueue.length === 0 ? `
                  <tr>
                    <td colspan="8" class="py-8 text-center text-slate-400">
                      No records found matching current criteria.
                    </td>
                  </tr>
                ` : filteredQueue.map(item => `
                  <tr class="hover:bg-[#152244] transition-colors">
                    
                    <td class="py-3.5 px-4">
                      <div class="font-bold text-white flex items-center gap-2">
                        ${item.name}
                      </div>
                      <div class="text-[10px] text-slate-400 font-mono mt-0.5">${item.id} &bull; ${item.details}</div>
                    </td>

                    <td class="py-3.5 px-4 font-mono text-slate-300 font-semibold">
                      ${item.patientId}
                    </td>

                    <td class="py-3.5 px-4 text-slate-300">
                      <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                        ${item.category}
                      </span>
                    </td>

                    <td class="py-3.5 px-4 whitespace-nowrap">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        item.priority === 'Critical' ? 'bg-red-950 text-red-300 border border-red-500/60' :
                        item.priority === 'High' ? 'bg-amber-950 text-amber-300 border border-amber-500/60' :
                        'bg-slate-800 text-slate-300 border border-slate-700'
                      }">
                        ${item.priority === 'Critical' ? '<span class="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>' : ''}
                        ${item.priority}
                      </span>
                    </td>

                    <td class="py-3.5 px-4 font-mono text-slate-300">
                      ${item.timeCreated}
                    </td>

                    <td class="py-3.5 px-4">
                      <span class="px-2 py-0.5 rounded text-[10px] font-semibold ${
                        item.status.includes('Transmitted') ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        item.status.includes('Queued') ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                        'bg-amber-950 text-amber-300 border border-amber-800'
                      }">
                        ${item.status}
                      </span>
                    </td>

                    <td class="py-3.5 px-4 font-mono text-slate-400">
                      ${item.retryCount}
                    </td>

                    <td class="py-3.5 px-4 text-right whitespace-nowrap">
                      <button onclick="window.GoldenHourViews.priority.openOverrideModal('${item.id}')" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all">
                        Change Priority
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

  setFilter(f) {
    this.currentFilter = f;
    this.render(document.getElementById('view-container'));
  },

  handleSearch(e) {
    this.searchQuery = e.target.value;
    this.render(document.getElementById('view-container'));
    const input = document.getElementById('priority-search-input');
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  },

  openOverrideModal(recordId) {
    const item = window.GoldenHourStore.getAll().priorityQueue.find(r => r.id === recordId);
    if (!item) return;

    window.GoldenHourApp.openModal(`
      <div class="space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h3 class="font-bold text-white text-base">Authorized Priority Override</h3>
          <p class="text-xs text-slate-400 mt-0.5">Record: ${item.id} &bull; ${item.name}</p>
        </div>

        <form onsubmit="window.GoldenHourViews.priority.confirmOverride(event, '${item.id}')" class="space-y-4 text-xs">
          <div>
            <label class="block text-slate-400 mb-1 font-semibold">Current Priority</label>
            <input type="text" value="${item.priority}" readonly class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300 font-bold">
          </div>

          <div>
            <label class="block text-slate-400 mb-1 font-semibold">Select New Priority</label>
            <select id="new-priority-select" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-semibold">
              <option value="Critical" ${item.priority === 'Critical' ? 'selected' : ''}>Critical — Immediate Review</option>
              <option value="High" ${item.priority === 'High' ? 'selected' : ''}>High — Important Clinical Update</option>
              <option value="Normal" ${item.priority === 'Normal' ? 'selected' : ''}>Normal — Routine Transfer</option>
            </select>
          </div>

          <div>
            <label class="block text-slate-400 mb-1 font-semibold">Reason for Override (Audit Logged)</label>
            <textarea id="priority-reason-input" required rows="2" placeholder="State reason for manual change..." class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button" onclick="window.GoldenHourApp.closeModal()" class="px-4 py-2 rounded bg-slate-800 text-slate-300 font-semibold">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold">Confirm Override</button>
          </div>
        </form>
      </div>
    `);
  },

  confirmOverride(event, recordId) {
    event.preventDefault();
    const newPri = document.getElementById('new-priority-select').value;
    const reason = document.getElementById('priority-reason-input').value;

    window.GoldenHourStore.overridePriority(recordId, newPri, reason);
    window.GoldenHourApp.closeModal();
    window.GoldenHourApp.showToast('Priority Overridden', `${recordId} set to ${newPri}.`, 'info');
    this.render(document.getElementById('view-container'));
  }
};

window.GoldenHourViews = window.GoldenHourViews || {};
window.GoldenHourViews.priority = PriorityView;
