// GoldenHour Application Master Orchestrator
// Global router, top telemetry bar, role switcher, notification center, and interactive modals

class GoldenHourApplication {
  constructor() {
    this.currentView = 'home';
    this.store = window.GoldenHourStore;
  }

  init() {
    // Subscribe to store updates to keep global top bar and notifications in sync
    this.store.subscribe('*', () => this.updateGlobalStatusBar());
    
    // Start background telemetry simulator
    if (window.GoldenHourTelemetry) {
      window.GoldenHourTelemetry.start();
    }

    // Read URL hash or default to home
    const hash = window.location.hash.replace('#/', '') || 'home';
    this.navigate(hash);
    this.updateGlobalStatusBar();

    // Handle hash change
    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#/', '') || 'home';
      this.navigate(h);
    });
  }

  navigate(viewName) {
    if (!window.GoldenHourViews || !window.GoldenHourViews[viewName]) {
      viewName = 'home';
    }
    this.currentView = viewName;
    window.location.hash = `#/${viewName}`;

    // Update active state in sidebar & mobile nav
    document.querySelectorAll('[data-nav-target]').forEach(el => {
      if (el.getAttribute('data-nav-target') === viewName) {
        el.classList.add('bg-blue-900/40', 'text-white', 'border-l-2', 'border-l-blue-400');
        el.classList.remove('text-slate-400');
      } else {
        el.classList.remove('bg-blue-900/40', 'text-white', 'border-l-2', 'border-l-blue-400');
        el.classList.add('text-slate-400');
      }
    });

    const container = document.getElementById('view-container');
    if (container) {
      container.innerHTML = '';
      window.GoldenHourViews[viewName].render(container);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  updateGlobalStatusBar() {
    const state = this.store.getAll();

    // Top status network badge
    const netEl = document.getElementById('global-network-badge');
    if (netEl) {
      let colorClass = 'bg-emerald-950 text-emerald-400 border-emerald-800';
      let dotClass = 'bg-emerald-400 beacon-green';

      if (state.networkStatus === 'Weak Connection') {
        colorClass = 'bg-amber-950 text-amber-300 border-amber-800';
        dotClass = 'bg-amber-400 beacon-amber';
      } else if (state.networkStatus === 'Offline / Safe Mode') {
        colorClass = 'bg-red-950 text-red-300 border-red-800';
        dotClass = 'bg-red-400 beacon-red';
      } else if (state.networkStatus === 'Syncing') {
        colorClass = 'bg-blue-950 text-blue-300 border-blue-800';
        dotClass = 'bg-blue-400 animate-spin';
      }

      netEl.className = `hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClass}`;
      netEl.innerHTML = `<span class="w-2 h-2 rounded-full ${dotClass}"></span> ${state.networkStatus}`;
    }

    // Destination Hospital badge
    const hospEl = document.getElementById('global-hospital-badge');
    if (hospEl) {
      hospEl.innerText = state.selectedHospital;
    }

    // Ambulance ID
    const ambEl = document.getElementById('global-ambulance-id');
    if (ambEl) {
      ambEl.innerText = state.activeAmbulanceId;
    }

    // Last Sync
    const syncEl = document.getElementById('global-last-sync');
    if (syncEl) {
      syncEl.innerText = state.lastServerSync;
    }

    // Role
    const roleSelect = document.getElementById('global-role-select');
    if (roleSelect && roleSelect.value !== state.userRole) {
      roleSelect.value = state.userRole;
    }

    // Notifications Badge Count
    const unreadCount = state.notifications.filter(n => n.unread).length;
    const badgeEl = document.getElementById('notif-badge-count');
    if (badgeEl) {
      if (unreadCount > 0) {
        badgeEl.classList.remove('hidden');
        badgeEl.innerText = unreadCount;
      } else {
        badgeEl.classList.add('hidden');
      }
    }
  }

  handleRoleChange(event) {
    const newRole = event.target.value;
    this.store.setRole(newRole);
    this.showToast('User Role Updated', `Operating environment adjusted for ${newRole}.`, 'info');
  }

  // Live Toast Messages
  showToast(title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const I = window.GoldenHourIcons;

    let borderCol = 'border-blue-500/60 bg-[#0e172e]';
    let iconSvg = I.info('w-5 h-5 text-blue-400');

    if (type === 'success') {
      borderCol = 'border-emerald-500/60 bg-[#0c1a1f]';
      iconSvg = I.checkCircle('w-5 h-5 text-emerald-400');
    } else if (type === 'warning') {
      borderCol = 'border-amber-500/60 bg-[#1f1a0c]';
      iconSvg = I.alertTriangle('w-5 h-5 text-amber-400');
    } else if (type === 'critical') {
      borderCol = 'border-red-500/60 bg-[#240c0c]';
      iconSvg = I.alertTriangle('w-5 h-5 text-red-400');
    }

    toast.className = `toast max-w-sm w-full p-4 rounded-xl border ${borderCol} shadow-2xl flex items-start gap-3 text-xs`;
    toast.innerHTML = `
      <div class="shrink-0 mt-0.5">${iconSvg}</div>
      <div class="flex-1 space-y-0.5">
        <strong class="text-white font-bold block">${title}</strong>
        <p class="text-slate-300 leading-snug">${message}</p>
      </div>
      <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white shrink-0 text-sm font-bold">&times;</button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // Modal Dialogs
  openModal(contentHtml) {
    const modalBackdrop = document.getElementById('global-modal');
    const modalBody = document.getElementById('global-modal-content');
    if (!modalBackdrop || !modalBody) return;

    modalBody.innerHTML = contentHtml;
    modalBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    const modalBackdrop = document.getElementById('global-modal');
    if (modalBackdrop) modalBackdrop.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }

  // Notifications Drawer
  toggleNotificationsDrawer() {
    const drawer = document.getElementById('notifications-drawer');
    if (!drawer) return;
    
    if (drawer.classList.contains('translate-x-full')) {
      drawer.classList.remove('translate-x-full');
      this.renderNotificationsList();
    } else {
      drawer.classList.add('translate-x-full');
    }
  }

  renderNotificationsList() {
    const container = document.getElementById('notifications-list');
    if (!container) return;
    const notifs = this.store.getAll().notifications;

    container.innerHTML = notifs.map(n => `
      <div class="p-3 rounded-lg ${n.unread ? 'bg-slate-900 border-l-4 border-l-blue-500' : 'bg-slate-950 opacity-70'} border border-slate-800 text-xs space-y-1">
        <div class="flex items-center justify-between">
          <strong class="text-white">${n.title}</strong>
          <span class="text-[10px] text-slate-400 font-mono">${n.time}</span>
        </div>
        <p class="text-slate-300 text-[11px] leading-snug">${n.text}</p>
      </div>
    `).join('');
  }

  markAllNotificationsRead() {
    this.store.markNotificationsRead();
    this.renderNotificationsList();
    this.showToast('Notifications Cleared', 'All alerts marked as acknowledged.', 'info');
  }

  // Device Detail Slide-Over Drawer
  openDeviceDrawer(deviceId) {
    const d = this.store.getAll().devices.find(item => item.id === deviceId);
    if (!d) return;

    this.openModal(`
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div class="text-[10px] text-slate-400 uppercase font-mono">${d.id} &bull; ${d.channel}</div>
            <h3 class="text-lg font-bold text-white">${d.name}</h3>
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-bold ${
            d.status === 'Connected' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
            'bg-amber-950 text-amber-300 border border-amber-800'
          }">
            ${d.status}
          </span>
        </div>

        <div class="grid grid-cols-3 gap-3 text-xs">
          <div class="p-2.5 rounded bg-slate-900 border border-slate-800">
            <span class="text-slate-400 block text-[10px]">Signal Quality</span>
            <span class="text-white font-bold text-sm">${d.signalQuality}</span>
          </div>
          <div class="p-2.5 rounded bg-slate-900 border border-slate-800">
            <span class="text-slate-400 block text-[10px]">Power / Battery</span>
            <span class="text-white font-bold text-sm">${d.batteryLevel}</span>
          </div>
          <div class="p-2.5 rounded bg-slate-900 border border-slate-800">
            <span class="text-slate-400 block text-[10px]">Latest Packet</span>
            <span class="text-white font-bold text-sm font-mono">${d.lastUpdate}</span>
          </div>
        </div>

        <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
          <strong class="text-slate-300">Clinical Readiness State:</strong>
          <p class="text-slate-400">${d.clinicalReadiness}</p>
        </div>

        <div class="space-y-2 text-xs">
          <strong class="text-white block">Step-by-Step Troubleshooting Checklist:</strong>
          <ul class="list-disc list-inside space-y-1 text-slate-300">
            ${d.troubleshooting.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>

        <div class="space-y-2 text-xs pt-2 border-t border-slate-800">
          <strong class="text-slate-400 uppercase text-[10px] block">Recent Telemetry Events:</strong>
          ${d.recentEvents.map(e => `
            <div class="flex items-center justify-between text-[11px] text-slate-400 font-mono bg-slate-950 p-1.5 rounded">
              <span>${e.event}</span>
              <span class="text-blue-400">${e.time}</span>
            </div>
          `).join('')}
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button onclick="window.GoldenHourApp.closeModal()" class="px-4 py-2 rounded bg-slate-800 text-white text-xs font-semibold">
            Close Panel
          </button>
        </div>
      </div>
    `);
  }

  runHealthCheck() {
    this.showToast('System Health Check Completed', 'All 5 telemetry gateways and bus adapters polled. Result: 4 Normal, 1 Unstable.', 'info');
  }

  openHospitalSelector() {
    const hospitals = this.store.getAll().hospitals;
    this.openModal(`
      <div class="space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h3 class="font-bold text-white text-base">Select Receiving Hospital Destination</h3>
          <p class="text-xs text-slate-400 mt-0.5">Will recalculate ETA and update trauma pre-alert</p>
        </div>

        <div class="space-y-3">
          ${hospitals.map(h => `
            <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 transition-all flex items-center justify-between text-xs cursor-pointer" onclick="window.GoldenHourStore.selectHospital('${h.id}'); window.GoldenHourApp.closeModal(); window.GoldenHourApp.navigate(window.GoldenHourApp.currentView);">
              <div>
                <div class="font-bold text-white text-sm">${h.name}</div>
                <div class="text-[11px] text-slate-400">${h.type} &bull; ${h.travelTimeMinutes} min travel (${h.distanceKm} km)</div>
                <div class="text-[10px] text-emerald-400 mt-0.5">${h.specialtyAvailability}</div>
              </div>
              <button class="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs">
                Select
              </button>
            </div>
          `).join('')}
        </div>

        <div class="flex justify-end pt-2">
          <button onclick="window.GoldenHourApp.closeModal()" class="px-4 py-2 rounded bg-slate-800 text-white text-xs">Cancel</button>
        </div>
      </div>
    `);
  }

  openAlertThresholdsModal() {
    this.openModal(`
      <div class="space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h3 class="font-bold text-white text-base">Configurable Clinical Alert Thresholds</h3>
          <p class="text-xs text-slate-400 mt-0.5">Adaptable to individual patient physiology and protocols</p>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-slate-400 mb-1 font-semibold">SpO₂ Desaturation Warning Threshold</label>
            <input type="text" value="< 90% (Active alert: 88%)" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
          </div>
          <div>
            <label class="block text-slate-400 mb-1 font-semibold">Pulse Tachycardia Alert Threshold</label>
            <input type="text" value="> 110 bpm (Active alert: 120 bpm)" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
          </div>
          <div>
            <label class="block text-slate-400 mb-1 font-semibold">Systolic BP Hypotension Alert Threshold</label>
            <input type="text" value="< 90 mmHg (Current: 120 mmHg)" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
          </div>
        </div>

        <div class="p-3 rounded bg-blue-950/40 border border-blue-800/40 text-blue-300 text-[11px]">
          Thresholds are configured per clinical protocol rather than presenting one fixed universal limit.
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button onclick="window.GoldenHourApp.closeModal()" class="px-4 py-2 rounded bg-blue-600 text-white text-xs font-semibold">Save Configuration</button>
        </div>
      </div>
    `);
  }
}

window.GoldenHourApp = new GoldenHourApplication();

document.addEventListener('DOMContentLoaded', () => {
  window.GoldenHourApp.init();
});
