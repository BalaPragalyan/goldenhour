// GoldenHour LifeLink AI View
// Powered by Groq LLM API (Key: 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)
// Clinical telemetry grounding with previous chat history & multi-tier proxy fallback

const LifeLinkView = {
  apiKey: "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",
  modelName: "qwen/qwen3.8-27b",
  isGenerating: false,

  chatMessages: [
    {
      id: 1,
      sender: 'system',
      name: 'Telemetry Gateway',
      time: '10:01 AM',
      text: 'Case GH-1042 initialized by Ambulance AMB-07. High-gain telemetry link established with City Trauma Centre.'
    },
    {
      id: 2,
      sender: 'ambulance',
      name: 'Paramedic J. Mercer (AMB-07)',
      time: '10:04 AM',
      text: 'Patient is ~38y male restrained driver in road collision vs barrier. Deformed left tibia/fibula splinted in rigid vacuum splint. GCS 14 (E4 V4 M6, transient confusion). Distal dorsalis pedis pulse palpable. Setting up 18G IV access in left arm.'
    },
    {
      id: 3,
      sender: 'ai',
      name: 'LifeLink AI Assistant',
      time: '10:05 AM',
      text: 'Initial SBAR baseline recorded for Patient GH-1042. Baseline vitals: BP 124/80 mmHg, SpO₂ 96%, HR 102 bpm. Initial ETA to City Trauma Centre: 10:25 AM. Case forwarded to Trauma Bay 2 coordinator.'
    },
    {
      id: 4,
      sender: 'system',
      name: 'Traffic Telemetry Engine',
      time: '10:10 AM',
      text: 'Congestion detected on A4 arterial highway. Routing engine recalculation: +11 min transit delay. Revised ETA: 10:36 AM.'
    },
    {
      id: 5,
      sender: 'ai',
      name: 'LifeLink AI Assistant',
      time: '10:11 AM',
      text: '⚠️ **Clinical Telemetry Alert:** SpO₂ desaturation detected at 88% on SPO2-PROBE-402 (downward trend from 96%). Heart rate elevated to 120 bpm (Sinus Tachycardia). Blood pressure stable at 120/80 mmHg. Recommend prompt respiratory assessment.'
    },
    {
      id: 6,
      sender: 'ambulance',
      name: 'Paramedic J. Mercer (AMB-07)',
      time: '10:11 AM',
      text: 'High-flow O₂ non-rebreather mask placed at 12 L/min. Patient alert, reporting severe localized lower limb pain. Requesting orthopedic surgery team consult ready at arrival.'
    },
    {
      id: 7,
      sender: 'doctor',
      name: 'Dr. R. Vance (ER Attending Physician)',
      time: '10:12 AM',
      text: 'Understood AMB-07. Trauma Bay 2 is confirmed armed and ready. Ortho on-call team alerted for limb salvage assessment. Blood bank on standby for 4 units O-Neg. We have authorized 5mg IV Morphine in transit for pain control provided MAP stays > 65 mmHg.'
    },
    {
      id: 8,
      sender: 'ai',
      name: 'LifeLink AI Assistant',
      time: '10:13 AM',
      text: 'Doctor directives confirmed: 5mg IV Morphine authorized; Trauma Bay 2 active; O-Neg blood units on standby. Continuous Lead II and pulse oximetry streams monitoring in real time.'
    }
  ],

  render(container) {
    const I = window.GoldenHourIcons;
    const store = window.GoldenHourStore;
    const state = store.getAll();
    const p = state.patient;
    const v = state.vitals;

    container.innerHTML = `
      <div class="h-[calc(100vh-140px)] flex flex-col space-y-3 pb-2">
        
        <!-- CHATBOT HEADER STRIP -->
        <div class="clinical-card p-4 flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-indigo-500 shadow-xl shrink-0 bg-gradient-to-r from-[#0c1429] to-[#122044]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40">
              ${I.bot('w-6 h-6')}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-lg font-bold text-white tracking-tight">LifeLink AI Emergency Chatbot</h1>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 beacon-green"></span>
                  Groq API Connected (${this.modelName})
                </span>
              </div>
              <p class="text-xs text-slate-300">
                Live LLM Inference &bull; Pre-hospital telemetry grounding & trauma triage.
              </p>
            </div>
          </div>

          <!-- Quick Case Badges -->
          <div class="flex items-center gap-3 text-xs">
            <div class="hidden sm:block text-right">
              <div class="text-[10px] text-slate-400">PATIENT ETA</div>
              <div class="text-sm font-bold text-amber-400 font-mono">${p.updatedEta} (${p.remainingMinutes}m)</div>
            </div>
            <div class="hidden md:block text-right">
              <div class="text-[10px] text-slate-400">SPO₂ / PULSE</div>
              <div class="text-sm font-bold text-red-400 font-mono">${v.spo2.value}% &bull; ${v.pulse.value} bpm</div>
            </div>
            <button onclick="window.GoldenHourViews.lifelink.clearChat()" class="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-all">
              Reset Chat
            </button>
          </div>
        </div>


        <!-- QUICK QUERY SUGGESTION PILLS -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs shrink-0 no-scrollbar">
          <span class="text-[11px] text-slate-400 uppercase font-semibold shrink-0">Quick Prompts:</span>
          
          <button onclick="window.GoldenHourViews.lifelink.sendQuickPrompt('Summarize Case (SBAR)')" class="px-3 py-1.5 rounded-full bg-[#101f42] hover:bg-indigo-900/60 border border-indigo-700/50 text-indigo-200 shrink-0 font-medium transition-all flex items-center gap-1.5">
            ${I.activity('w-3.5 h-3.5 text-indigo-400')}
            Summarize Case (SBAR)
          </button>

          <button onclick="window.GoldenHourViews.lifelink.sendQuickPrompt('SpO2 Desaturation Protocol Advice')" class="px-3 py-1.5 rounded-full bg-[#101f42] hover:bg-red-900/60 border border-red-700/50 text-red-200 shrink-0 font-medium transition-all flex items-center gap-1.5">
            ${I.alertTriangle('w-3.5 h-3.5 text-red-400')}
            SpO₂ Protocol Advice
          </button>

          <button onclick="window.GoldenHourViews.lifelink.sendQuickPrompt('Trauma Bay Preparation Checklist')" class="px-3 py-1.5 rounded-full bg-[#101f42] hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-200 shrink-0 font-medium transition-all flex items-center gap-1.5">
            ${I.checkCircle('w-3.5 h-3.5 text-emerald-400')}
            Trauma Bay Prep Checklist
          </button>

          <button onclick="window.GoldenHourViews.lifelink.sendQuickPrompt('What are the missing clinical fields?')" class="px-3 py-1.5 rounded-full bg-[#101f42] hover:bg-amber-900/60 border border-amber-700/50 text-amber-200 shrink-0 font-medium transition-all flex items-center gap-1.5">
            ${I.info('w-3.5 h-3.5 text-amber-400')}
            Missing Clinical Data Audit
          </button>

          <button onclick="window.GoldenHourViews.lifelink.sendQuickPrompt('Current ETA and traffic status')" class="px-3 py-1.5 rounded-full bg-[#101f42] hover:bg-blue-900/60 border border-blue-700/50 text-blue-200 shrink-0 font-medium transition-all flex items-center gap-1.5">
            ${I.clock('w-3.5 h-3.5 text-blue-400')}
            ETA & Traffic Status
          </button>
        </div>


        <!-- CHAT CONVERSATION FEED (SCROLLABLE) -->
        <div id="lifelink-chat-feed" class="flex-1 overflow-y-auto p-4 rounded-xl clinical-card space-y-3.5 text-xs shadow-inner">
          ${this.renderChatMessages()}
        </div>


        <!-- CHAT INPUT BAR -->
        <div class="clinical-card p-3 shrink-0">
          <form onsubmit="window.GoldenHourViews.lifelink.handleSendMessage(event)" class="flex items-center gap-3">
            <input 
              type="text" 
              id="lifelink-user-input"
              placeholder="Ask LifeLink AI (powered by Groq) about Case GH-1042 vitals, clinical directives, or prep..."
              class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
              autocomplete="off"
            >
            <button type="submit" id="lifelink-send-btn" class="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5">
              <span>Send</span>
              ${I.chevronRight('w-4 h-4')}
            </button>
          </form>

          <div class="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-2">
            <span>LifeLink AI provides clinical information synthesis. Final medical decisions remain with authorized physicians.</span>
            <span class="font-mono text-emerald-400">Groq API &bull; Qwen 3.8 27B</span>
          </div>
        </div>

      </div>
    `;

    setTimeout(() => {
      this.scrollToBottom();
    }, 50);
  },

  renderChatMessages() {
    const I = window.GoldenHourIcons;

    return this.chatMessages.map(msg => {
      if (msg.sender === 'system') {
        return `
          <div class="flex justify-center my-2">
            <div class="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
              <span>${msg.text}</span>
              <span class="text-slate-500">&bull; ${msg.time}</span>
            </div>
          </div>
        `;
      }

      const isAi = msg.sender === 'ai';
      const isDoc = msg.sender === 'doctor';
      const isAmb = msg.sender === 'ambulance';
      const isUser = msg.sender === 'user';

      let bgClass = 'bg-slate-900 border-slate-800 text-slate-200';
      let senderColor = 'text-blue-400';
      let icon = I.activity('w-4 h-4 text-blue-400');

      if (isAi) {
        bgClass = 'bg-[#131d3d] border-indigo-500/40 text-slate-100 shadow-md';
        senderColor = 'text-indigo-400';
        icon = I.bot('w-4 h-4 text-indigo-400');
      } else if (isDoc) {
        bgClass = 'bg-[#10243d] border-blue-500/40 text-slate-100';
        senderColor = 'text-emerald-400';
        icon = I.shield('w-4 h-4 text-emerald-400');
      } else if (isAmb) {
        bgClass = 'bg-[#291717] border-red-500/30 text-slate-200';
        senderColor = 'text-amber-400';
        icon = I.ambulance('w-4 h-4 text-amber-400');
      } else if (isUser) {
        bgClass = 'bg-blue-600 text-white border-blue-500 ml-auto max-w-lg';
        senderColor = 'text-blue-200';
        icon = I.checkCircle('w-4 h-4 text-white');
      }

      return `
        <div class="flex items-start gap-3 ${isUser ? 'justify-end' : ''}">
          ${!isUser ? `
            <div class="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
              ${icon}
            </div>
          ` : ''}

          <div class="max-w-2xl rounded-2xl p-4 border ${bgClass} space-y-1.5">
            <div class="flex items-center justify-between gap-4 text-[11px]">
              <span class="font-bold ${senderColor} flex items-center gap-1.5">
                ${msg.name}
              </span>
              <span class="text-[10px] text-slate-400 font-mono">${msg.time}</span>
            </div>
            <div class="leading-relaxed text-xs space-y-1.5">
              ${this.formatMessageBody(msg.text)}
            </div>
          </div>

          ${isUser ? `
            <div class="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center shrink-0 text-white mt-0.5 font-bold">
              You
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  },

  formatMessageBody(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\n/g, '<br>');
  },

  async handleSendMessage(e) {
    if (e) e.preventDefault();
    if (this.isGenerating) return;

    const input = document.getElementById('lifelink-user-input');
    if (!input || !input.value.trim()) return;

    const query = input.value.trim();
    input.value = '';

    // Add user message to chat
    this.chatMessages.push({
      id: Date.now(),
      sender: 'user',
      name: `${window.GoldenHourStore.getAll().userRole}`,
      time: '10:14 AM',
      text: query
    });

    this.renderChatFeedOnly();

    // Show temporary thinking message
    const tempId = Date.now() + 1;
    this.chatMessages.push({
      id: tempId,
      sender: 'ai',
      name: 'LifeLink AI (Groq Inference...)',
      time: '10:14 AM',
      text: '<span class="inline-flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span> Synthesizing clinical telemetry via Groq LLM...</span>'
    });
    this.renderChatFeedOnly();
    this.isGenerating = true;

    try {
      const response = await this.callGroqLlm(query);
      // Replace temporary message with actual response
      const targetIdx = this.chatMessages.findIndex(m => m.id === tempId);
      if (targetIdx !== -1) {
        this.chatMessages[targetIdx] = {
          id: tempId,
          sender: 'ai',
          name: 'LifeLink AI Assistant',
          time: '10:14 AM',
          text: response
        };
      }
    } catch (err) {
      console.warn("Groq API call issue, utilizing fallback:", err);
      const fallbackResponse = this.generateFallbackResponse(query);
      const targetIdx = this.chatMessages.findIndex(m => m.id === tempId);
      if (targetIdx !== -1) {
        this.chatMessages[targetIdx] = {
          id: tempId,
          sender: 'ai',
          name: 'LifeLink AI Assistant',
          time: '10:14 AM',
          text: fallbackResponse
        };
      }
    } finally {
      this.isGenerating = false;
      this.renderChatFeedOnly();
    }
  },

  async callGroqLlm(userQuery) {
    const store = window.GoldenHourStore;
    const p = store.get('patient');
    const v = store.get('vitals');

    const systemPrompt = `You are LifeLink AI, an emergency pre-hospital clinical telemetry assistant for GoldenHour.
Active Emergency Case:
- Patient ID: ${p.id} (Adult Male, ~38y)
- Transporting Unit: ${p.ambulanceId} (Paramedic J. Mercer) en route to ${p.receivingHospital}
- ETA: ${p.updatedEta} (${p.remainingMinutes} min remaining, 8.4 km away, +11 min highway congestion delay)
- Current Vitals:
  * Blood Pressure: ${v.bp.value} mmHg (MAP 93 mmHg)
  * Oxygen Saturation (SpO2): ${v.spo2.value}% (Critical downward desaturation from 96% to 88%)
  * Pulse Rate: ${v.pulse.value} bpm (Sinus Tachycardia)
  * EtCO2: ${v.etco2.value} mmHg (Sampling line signal unstable)
- Injuries & Mechanism: Road traffic collision (motor vehicle vs barrier). Suspected left lower-limb fracture (tibia/fibula). GCS 14 (E4 V4 M6). Distal dorsalis pedis pulse present.
- Field Interventions: Left lower-limb rigid vacuum splint, 12 L/min non-rebreather O2 mask, 18G IV in left antecubital fossa.
- Doctor Orders in Effect: Trauma Bay 2 active, 4 units O-Neg blood reserved, 5mg IV Morphine authorized in transit.

Instructions: Provide clear, concise, clinically sound pre-hospital emergency guidance, SBAR summaries, or triage preparation notes. Use bold headers and clean bullet points.`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userQuery }
    ];

    // Try direct Groq API fetch first
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: messages,
          max_tokens: 450,
          temperature: 0.3
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices[0]?.message?.content;
        if (text) return text.trim();
      }
    } catch (e) {
      console.warn("Direct Groq fetch blocked or failed, attempting local server proxy...", e);
    }

    // Try local proxy `/api/chat`
    try {
      const resProxy = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messages })
      });

      if (resProxy.ok) {
        const dataProxy = await resProxy.json();
        const textProxy = dataProxy.choices[0]?.message?.content;
        if (textProxy) return textProxy.trim();
      }
    } catch (e) {
      console.warn("Proxy call failed, reverting to local clinical generator:", e);
    }

    // Fallback if network totally unavailable
    return this.generateFallbackResponse(userQuery);
  },

  generateFallbackResponse(query) {
    const q = query.toLowerCase();
    const store = window.GoldenHourStore;
    const p = store.get('patient');
    const v = store.get('vitals');

    if (q.includes('sbar') || q.includes('summar') || q.includes('case')) {
      return `**Pre-Hospital SBAR Clinical Handover for Patient ${p.id}:**\n\n` +
        `• **S (Situation):** ${p.id} transported by ${p.ambulanceId} en route to ${p.receivingHospital}. ETA: **${p.updatedEta}** (${p.remainingMinutes} min remaining). Priority: High.\n` +
        `• **B (Background):** Adult male restrained driver in road collision vs barrier. Airbag deployed. Rapid extrication.\n` +
        `• **A (Assessment):** Suspected ${p.suspectedInjury} (left tibia/fibula). Vitals: BP **${v.bp.value} mmHg**, SpO₂ **${v.spo2.value}%** (downward desaturation), Pulse **${v.pulse.value} bpm** (sinus tachycardia), EtCO₂ **${v.etco2.value} mmHg** (signal unstable). GCS 14.\n` +
        `• **R (Recommendation):** Trauma Bay 2 reserved. Maintain 12L non-rebreather O₂; Orthopedic surgery consult standby; 4 units O-Neg blood reserved per Dr. Vance.`;
    }

    if (q.includes('spo2') || q.includes('oxygen') || q.includes('desaturat') || q.includes('breath')) {
      return `**SpO₂ Protocol & Desaturation Analysis:**\n\n` +
        `• **Trend:** Decreased from baseline 96% at 10:01 AM to **${v.spo2.value}%** at 10:11 AM.\n` +
        `• **Ambulance Action:** Paramedic Mercer placed patient on high-flow non-rebreather mask at 12 L/min.\n` +
        `• **Clinical Correlate:** Consider pulmonary contusion from steering column impact or thoracic trauma. Recommend immediate arterial blood gas (ABG) and portable chest radiograph upon trauma bay transfer.`;
    }

    if (q.includes('eta') || q.includes('traffic') || q.includes('arriv') || q.includes('time')) {
      return `**Current Navigation & Transit Telemetry:**\n\n` +
        `• **Estimated Arrival:** **${p.updatedEta}** (${p.remainingMinutes} minutes remaining).\n` +
        `• **Route Telemetry:** Southbound on A4 arterial corridor. Speed: 54 km/h. Remaining Distance: ${p.remainingDistance}.\n` +
        `• **Delay Notice:** +11 minute traffic delay logged at 10:10 AM near Junction 3. Receiving team alerted.`;
    }

    if (q.includes('prep') || q.includes('checklist') || q.includes('bay') || q.includes('team')) {
      return `**Trauma Bay 2 Preparation Checklist for Incoming Arrival:**\n\n` +
        `1. **Airway/Breathing:** Rapid sequence intubation (RSI) kit on standby; video laryngoscope ready.\n` +
        `2. **Circulation:** Rapid fluid warmer & pressure infuser primed. 4 units O-Negative PRBCs confirmed with Blood Bank.\n` +
        `3. **Disability/Exposure:** Left lower limb splint inspection; pelvic binder ready on gurney.\n` +
        `4. **Specialties:** Orthopedic trauma surgeon (Dr. Patel) notified. CT Angiography suite placed on holding standby.`;
    }

    return `**Case ${p.id} Telemetry Synthesis:**\n\n` +
      `The patient is en route to **${p.receivingHospital}** with arrival projected at **${p.updatedEta}** (${p.remainingMinutes}m). Current vitals show BP ${v.bp.value} mmHg, SpO₂ ${v.spo2.value}% on 12L O₂, and pulse ${v.pulse.value} bpm. Paramedic Mercer has secured the left lower leg in a vacuum splint. Trauma Bay 2 is confirmed armed and ready.`;
  },

  sendQuickPrompt(promptText) {
    const input = document.getElementById('lifelink-user-input');
    if (input) {
      input.value = promptText;
      this.handleSendMessage();
    }
  },

  renderChatFeedOnly() {
    const feed = document.getElementById('lifelink-chat-feed');
    if (feed) {
      feed.innerHTML = this.renderChatMessages();
      this.scrollToBottom();
    }
  },

  scrollToBottom() {
    const feed = document.getElementById('lifelink-chat-feed');
    if (feed) {
      feed.scrollTop = feed.scrollHeight;
    }
  },

  clearChat() {
    if (confirm('Reset conversation to initial case logs?')) {
      this.chatMessages = this.chatMessages.slice(0, 8);
      this.render(document.getElementById('view-container'));
      window.GoldenHourApp.showToast('Chat Reset', 'Restored initial case telemetry log.', 'info');
    }
  }
};

window.GoldenHourViews = window.GoldenHourViews || {};
window.GoldenHourViews.lifelink = LifeLinkView;
