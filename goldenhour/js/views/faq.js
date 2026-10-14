// GoldenHour Frequently Asked Questions View
// 18 Comprehensive clinical & technical Q&As in an accessible accordion with instant search & contact modal

const FaqView = {
  searchQuery: '',
  activeAccordion: null,

  faqItems: [
    {
      id: 1,
      cat: 'general',
      q: 'What is GoldenHour?',
      a: 'GoldenHour is a pre-hospital emergency telemetry gateway designed to transmit available patient vital signs, emergency information, and ambulance updates to the receiving hospital during transport.'
    },
    {
      id: 2,
      cat: 'general',
      q: 'Why is GoldenHour important?',
      a: 'Hospitals may have limited information about an incoming patient before the ambulance arrives. GoldenHour helps share relevant information earlier so the receiving team can review the case and prepare according to its protocols.'
    },
    {
      id: 3,
      cat: 'general',
      q: 'What does the name GoldenHour mean?',
      a: 'The name reflects the importance of timely assessment and treatment during emergencies. It does not mean every patient has exactly one hour to survive. Appropriate care depends on the nature of the emergency and the patient\'s condition.'
    },
    {
      id: 4,
      cat: 'telemetry',
      q: 'Which vital signs can GoldenHour display?',
      a: 'The interface is designed to support measurements such as blood pressure, oxygen saturation, pulse, ECG information, and end-tidal carbon dioxide when supported by the connected devices and integration. The actual measurements available depend on the equipment and system configuration.'
    },
    {
      id: 5,
      cat: 'telemetry',
      q: 'How does the incoming patient dashboard work?',
      a: 'The dashboard brings together the available patient measurements, reported injury details, care requirements, transport information, and estimated arrival time. Authorized staff can review the information before the patient arrives.'
    },
    {
      id: 6,
      cat: 'connectivity',
      q: 'What happens if the ambulance loses internet connectivity?',
      a: 'When the system supports offline operation, eligible records are stored locally and queued for synchronization. The interface displays the connection state, last successful update, and pending records. The hospital may not receive new information until connectivity returns.'
    },
    {
      id: 7,
      cat: 'connectivity',
      q: 'Does the hospital receive updates instantly?',
      a: 'Updates can be transmitted when connectivity and the relevant integrations are available. Network interruptions, device issues, and server delays can affect delivery. The system must display timestamps and confirmed transmission status rather than guarantee uninterrupted real-time delivery.'
    },
    {
      id: 8,
      cat: 'tracking',
      q: 'How does ambulance tracking work?',
      a: 'The tracking system uses available GPS information to display the ambulance\'s latest location and estimate its arrival time using route information. ETA can change because of traffic, route changes, or delays.'
    },
    {
      id: 9,
      cat: 'tracking',
      q: 'Can the hospital see whether monitoring devices are connected?',
      a: 'Yes, when supported by the relevant device integrations. The Device Status page displays connection states and available diagnostic information for supported equipment. A connected device does not automatically mean that its readings are clinically reliable.'
    },
    {
      id: 10,
      cat: 'media',
      q: 'What is MediCapture?',
      a: 'MediCapture allows authorized users to attach relevant patient photos, videos, and clinical documentation to an incoming patient record for secure review by the appropriate receiving team. Access and sharing should follow applicable privacy, authorization, and consent requirements.'
    },
    {
      id: 11,
      cat: 'connectivity',
      q: 'How does Priority Selection work?',
      a: 'Priority Selection organizes the transmission queue so that configured, time-sensitive information can be sent before less urgent files when bandwidth is limited. Priority rules should be approved, auditable, and designed to prevent less urgent records from being lost or indefinitely delayed.'
    },
    {
      id: 12,
      cat: 'ai',
      q: 'What does LifeLink AI do?',
      a: 'LifeLink AI helps organize available emergency information into draft summaries, handover notes, trend descriptions, and missing-information alerts. Healthcare professionals must review generated content before using it for consequential clinical communication or decisions.'
    },
    {
      id: 13,
      cat: 'triage',
      q: 'How does Suitable Hospital Finder choose hospitals?',
      a: 'It compares available information about travel time, relevant specialties, emergency facilities, and hospital acceptance status. Unknown or outdated information is shown explicitly. Authorized clinical and dispatch personnel remain responsible for the destination decision.'
    },
    {
      id: 14,
      cat: 'ai',
      q: 'Can GoldenHour recommend treatment?',
      a: 'GoldenHour is designed to support communication, monitoring visibility, and clinical coordination. It should not independently diagnose a patient or prescribe treatment. Clinical decisions remain with qualified healthcare professionals.'
    },
    {
      id: 15,
      cat: 'security',
      q: 'Is patient information secure?',
      a: 'The production system should use appropriate authentication, role-based access, encrypted data transfer and storage, audit logging, and retention policies. Patient information must be handled according to applicable privacy and healthcare requirements. Do not claim regulatory certification or compliance unless it has been independently verified.'
    },
    {
      id: 16,
      cat: 'devices',
      q: 'Does GoldenHour require a particular monitoring device?',
      a: 'Device support depends on the implemented hardware interfaces and software integrations. The production product should clearly list supported devices and explain how their data is validated and transmitted.'
    },
    {
      id: 17,
      cat: 'devices',
      q: 'What happens if a sensor stops reporting data?',
      a: 'The system should indicate that the sensor is disconnected, unavailable, or no longer providing fresh readings. It must not substitute an old measurement for a current one without a clear timestamp and stale-data warning.'
    },
    {
      id: 18,
      cat: 'general',
      q: 'Can multiple hospitals receive information?',
      a: 'The system can be designed to support authorized sharing with the selected receiving hospital and other approved recipients, depending on the implemented integrations and permissions. Access should be limited to authorized parties.'
    }
  ],

  render(container) {
    const I = window.GoldenHourIcons;

    const filteredFaqs = this.faqItems.filter(item => {
      if (!this.searchQuery) return true;
      const qLower = this.searchQuery.toLowerCase();
      return item.q.toLowerCase().includes(qLower) || item.a.toLowerCase().includes(qLower);
    });

    container.innerHTML = `
      <div class="space-y-8 pb-16">
        
        <!-- PAGE HEADER -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e3260] pb-6">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/40 text-blue-400 border border-blue-500/30">
                KNOWLEDGE BASE & CLINICAL PROTOCOLS
              </span>
              <span class="text-xs text-slate-400">18 Common Inquiries Verified</span>
            </div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Frequently Asked Questions
            </h1>
            <p class="text-sm text-slate-300 mt-1">
              Learn how GoldenHour connects ambulance teams with receiving hospitals and how its core features work.
            </p>
          </div>

          <!-- Instant Search Input -->
          <div class="relative w-full md:w-72">
            <input 
              type="text" 
              id="faq-search-input"
              value="${this.searchQuery}"
              placeholder="Search questions & topics..." 
              oninput="window.GoldenHourViews.faq.handleSearch(event)"
              class="w-full bg-[#0e172e] border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400"
            >
            <div class="absolute left-3 top-2.5 text-slate-400">
              ${I.search('w-4 h-4')}
            </div>
          </div>
        </div>


        <!-- ACCORDION LIST -->
        <div class="clinical-card p-6 space-y-3">
          ${filteredFaqs.length === 0 ? `
            <div class="py-12 text-center text-slate-400 text-sm">
              No questions found matching "${this.searchQuery}". Try searching for "offline", "SpO2", or "tracking".
            </div>
          ` : filteredFaqs.map(item => `
            <div class="border border-slate-800 rounded-xl overflow-hidden transition-all bg-[#0b132b]/60">
              <button 
                onclick="window.GoldenHourViews.faq.toggle(${item.id})"
                class="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-900/80 transition-colors"
              >
                <span class="font-bold text-white text-sm flex items-center gap-3">
                  <span class="text-xs font-mono text-blue-400 font-normal">#${item.id}</span>
                  ${item.q}
                </span>
                <span class="text-slate-400 shrink-0 transform transition-transform ${this.activeAccordion === item.id ? 'rotate-180' : ''}">
                  ${I.chevronDown('w-4 h-4')}
                </span>
              </button>

              <div class="${this.activeAccordion === item.id ? 'block' : 'hidden'} p-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-900/40">
                ${item.a}
              </div>
            </div>
          `).join('')}
        </div>


        <!-- FAQ CLOSING SECTION: CONTACT TEAM -->
        <section class="rounded-2xl bg-gradient-to-r from-[#101f42] to-[#152a5a] border border-[#1e3260] p-8 text-center space-y-4">
          <div class="max-w-xl mx-auto space-y-2">
            <h3 class="text-2xl font-bold text-white">Still have questions?</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              Contact our team to learn more about GoldenHour's emergency communication workflow, supported devices, and integration requirements.
            </p>
          </div>
          <button onclick="window.GoldenHourViews.faq.openContactModal()" class="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/30 inline-flex items-center gap-2">
            ${I.messageSquare('w-4 h-4')}
            Contact the Team
          </button>
        </section>

      </div>
    `;
  },

  handleSearch(event) {
    this.searchQuery = event.target.value;
    this.render(document.getElementById('view-container'));
    const input = document.getElementById('faq-search-input');
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  },

  toggle(id) {
    this.activeAccordion = this.activeAccordion === id ? null : id;
    this.render(document.getElementById('view-container'));
  },

  openContactModal() {
    window.GoldenHourApp.openModal(`
      <div class="space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h3 class="font-bold text-white text-base">Contact the GoldenHour Team</h3>
          <p class="text-xs text-slate-400 mt-0.5">Integration inquiries, hardware interoperability, and trials</p>
        </div>

        <form onsubmit="window.GoldenHourViews.faq.submitContact(event)" class="space-y-3 text-xs">
          <div>
            <label class="block text-slate-400 mb-1 font-semibold">Your Name & Hospital / Agency</label>
            <input type="text" required placeholder="e.g. Dr. Alex Morgan, St. Jude Emergency Dept" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white">
          </div>
          <div>
            <label class="block text-slate-400 mb-1 font-semibold">Work Email</label>
            <input type="email" required placeholder="name@emergency.health.org" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white">
          </div>
          <div>
            <label class="block text-slate-400 mb-1 font-semibold">Area of Interest</label>
            <select class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white">
              <option>Ambulance Gateway Deployment</option>
              <option>Hospital Trauma Bay Screen Integration</option>
              <option>Supported Monitor Protocols (HL7 / FHIR)</option>
              <option>Safe Mode Offline Resilience Testing</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-400 mb-1 font-semibold">Message</label>
            <textarea rows="3" required placeholder="How can we assist your emergency services organization?" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"></textarea>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" onclick="window.GoldenHourApp.closeModal()" class="px-4 py-2 rounded bg-slate-800 text-slate-300">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold">Send Inquiry</button>
          </div>
        </form>
      </div>
    `);
  },

  submitContact(e) {
    e.preventDefault();
    window.GoldenHourApp.closeModal();
    window.GoldenHourApp.showToast('Message Sent', 'Our clinical solutions engineering team will reply promptly.', 'success');
  }
};

window.GoldenHourViews = window.GoldenHourViews || {};
window.GoldenHourViews.faq = FaqView;
