// GoldenHour Reviews and Feedback View
// Operational feedback collection, 5-point rating scale, and theme summaries

const FeedbackView = {
  isSubmitting: false,
  selectedRating: 4,

  render(container) {
    const I = window.GoldenHourIcons;
    const store = window.GoldenHourStore;
    const state = store.getAll();

    container.innerHTML = `
      <div class="space-y-8 pb-16">
        
        <!-- PAGE HEADER -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e3260] pb-6">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/40 text-blue-400 border border-blue-500/30">
                CLINICAL USABILITY & GOVERNANCE
              </span>
              <span class="text-xs text-slate-400">Continuous Workflow Refinement</span>
            </div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Feedback That Helps Us Improve
            </h1>
            <p class="text-sm text-slate-300 mt-1">
              Tell us about your experience with GoldenHour. Your feedback helps us improve communication, usability, and reliability across the emergency workflow.
            </p>
          </div>
        </div>


        <!-- FEEDBACK FORM & SIDEBAR THEMES -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- LEFT 7 COLS: ACCESSIBLE FEEDBACK FORM -->
          <div class="lg:col-span-7 space-y-4">
            
            <div class="clinical-card p-6 space-y-5">
              <div class="border-b border-slate-800 pb-3">
                <h3 class="text-base font-bold text-white flex items-center gap-2">
                  ${I.messageSquare('w-5 h-5 text-blue-400')}
                  Submit Operational Feedback
                </h3>
                <p class="text-xs text-slate-400 mt-0.5">All responses are anonymized and reviewed by system engineers.</p>
              </div>

              <!-- Success Alert (Hidden until submission) -->
              <div id="feedback-success-banner" class="hidden p-4 rounded-xl bg-emerald-950/70 border border-emerald-500 text-emerald-200 text-xs flex items-start gap-3">
                ${I.checkCircle('w-5 h-5 text-emerald-400 shrink-0 mt-0.5')}
                <div>
                  <strong class="font-bold text-white">Thank you for sharing your feedback.</strong>
                  <p class="mt-0.5">Your input has been recorded for review by the GoldenHour clinical ergonomics group.</p>
                </div>
              </div>

              <form id="feedback-form" onsubmit="window.GoldenHourViews.feedback.handleSubmit(event)" class="space-y-5 text-xs">
                
                <!-- 1. Your Role -->
                <div>
                  <label class="block text-slate-300 font-semibold mb-1">1. Your Role in the Response Workflow</label>
                  <select id="fb-role" required class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white">
                    <option value="Ambulance nurse or paramedic">Ambulance nurse or paramedic</option>
                    <option value="Emergency physician">Emergency physician</option>
                    <option value="Hospital coordinator">Hospital emergency coordinator</option>
                    <option value="Ambulance operations team">Ambulance operations team</option>
                    <option value="Hospital administrator">Hospital administrator</option>
                    <option value="Other">Other clinical / technical staff</option>
                  </select>
                </div>

                <!-- 2. Overall Experience (5-point rating scale with clear text labels) -->
                <div>
                  <label class="block text-slate-300 font-semibold mb-2">2. Overall Experience Rating</label>
                  <div class="grid grid-cols-5 gap-2">
                    ${[
                      { val: 1, label: '1 — Poor' },
                      { val: 2, label: '2 — Fair' },
                      { val: 3, label: '3 — Good' },
                      { val: 4, label: '4 — Very Good' },
                      { val: 5, label: '5 — Excellent' }
                    ].map(r => `
                      <button 
                        type="button" 
                        onclick="window.GoldenHourViews.feedback.setRating(${r.val})"
                        id="rating-btn-${r.val}"
                        class="p-2.5 rounded-lg border text-center transition-all ${
                          r.val === 4 ? 'bg-blue-600 border-blue-400 text-white font-bold' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                        }"
                      >
                        <div class="text-sm font-extrabold mb-0.5">${r.val}</div>
                        <div class="text-[10px] leading-tight">${r.label.split('— ')[1]}</div>
                      </button>
                    `).join('')}
                  </div>
                </div>

                <!-- 3. Which feature did you use? (Checkbox options) -->
                <div>
                  <label class="block text-slate-300 font-semibold mb-2">3. Which Feature(s) Did You Use?</label>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                    ${[
                      'Incoming Patient',
                      'Network Loss Safe Mode',
                      'Live Tracking',
                      'Device Status',
                      'MediCapture',
                      'Priority Selection',
                      'LifeLink AI',
                      'Suitable Hospital Finder'
                    ].map(feature => `
                      <label class="flex items-center gap-2 p-2 rounded bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer">
                        <input type="checkbox" name="feature_used" value="${feature}" checked class="rounded border-slate-700 text-blue-600 focus:ring-0">
                        <span class="text-xs">${feature}</span>
                      </label>
                    `).join('')}
                  </div>
                </div>

                <!-- 4. What worked well? -->
                <div>
                  <label class="block text-slate-300 font-semibold mb-1">4. What Worked Well?</label>
                  <textarea id="fb-worked-well" rows="3" required placeholder="Tell us what helped you complete your work." class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500"></textarea>
                </div>

                <!-- 5. What could be improved? -->
                <div>
                  <label class="block text-slate-300 font-semibold mb-1">5. What Could Be Improved?</label>
                  <textarea id="fb-improved" rows="3" placeholder="Describe a problem or suggest an improvement." class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500"></textarea>
                </div>

                <!-- 6. Optional Reference -->
                <div>
                  <label class="block text-slate-300 font-semibold mb-1">6. Optional Reference Identifier</label>
                  <input type="text" id="fb-ref" placeholder="e.g. Shift Ref #B-204 (Do NOT enter patient names or MRNs)" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 font-mono">
                  <div class="text-[10px] text-slate-500 mt-1">Non-identifying feedback reference only.</div>
                </div>

                <!-- Privacy & Non-Identification Notice -->
                <div class="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
                  <strong>Privacy Notice:</strong> Do not request or submit patient names, medical record numbers, or unnecessary clinical details. Feedback is governed under healthcare data protection protocols.
                </div>

                <!-- Submit Button -->
                <button type="submit" id="fb-submit-btn" class="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2">
                  ${I.messageSquare('w-4 h-4')}
                  Submit Feedback
                </button>

              </form>
            </div>

          </div>


          <!-- RIGHT 5 COLS: SAMPLE FEEDBACK THEMES SUMMARY -->
          <div class="lg:col-span-5 space-y-4">
            
            <div class="clinical-card p-6 space-y-4">
              <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <div class="text-[10px] font-bold text-blue-400 uppercase tracking-wider">FICTIONAL PROTOTYPE DATA</div>
                  <h3 class="text-base font-bold text-white">Feedback Themes Summary</h3>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700">Sample Records</span>
              </div>

              <p class="text-xs text-slate-400 leading-relaxed">
                Illustrative feedback themes from ambulance and trauma coordinators evaluating pre-hospital telemetry:
              </p>

              <div class="space-y-3">
                
                <div class="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-white">Theme: Easier Access to Patient Data</span>
                    <span class="text-[10px] text-blue-400 font-mono">ER Physician</span>
                  </div>
                  <p class="text-slate-300 text-[11px] leading-relaxed">
                    "Being able to see the downward SpO₂ trend 20 minutes before arrival allowed us to have high-flow respiratory equipment and blood gas analyzers prepped in Bay 2."
                  </p>
                </div>

                <div class="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-white">Theme: Clearer Visibility of Arrival Estimates</span>
                    <span class="text-[10px] text-amber-400 font-mono">Ambulance Paramedic</span>
                  </div>
                  <p class="text-slate-300 text-[11px] leading-relaxed">
                    "When we hit highway congestion, the GPS automatically revised our ETA to 10:36 AM. Hospital staff didn't have to keep calling us while we were attending to the leg splint."
                  </p>
                </div>

                <div class="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-white">Theme: Better Understanding of Connectivity</span>
                    <span class="text-[10px] text-emerald-400 font-mono">Ambulance Operations</span>
                  </div>
                  <p class="text-slate-300 text-[11px] leading-relaxed">
                    "Safe Mode clearly showed that 12 records were held safely on the vehicle during cellular tunnel dead-zones, preventing panic and duplicate inputs."
                  </p>
                </div>

                <div class="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-white">Theme: Handover Workflow Refinements</span>
                    <span class="text-[10px] text-teal-400 font-mono">Trauma Coordinator</span>
                  </div>
                  <p class="text-slate-300 text-[11px] leading-relaxed">
                    "LifeLink AI organized the clinical narrative into SBAR format cleanly. The requirement for manual clinician approval ensures safety while saving vital charting minutes."
                  </p>
                </div>

              </div>

              <!-- Disclaimer about fictional reviews -->
              <div class="p-3 rounded bg-slate-900 text-[11px] text-slate-500 italic border border-slate-800">
                Notice: Clearly labeled sample feedback summaries for system demonstration. Do not publish invented patient stories or clinical outcome claims as genuine reviews.
              </div>
            </div>

          </div>

        </div>

      </div>
    `;
  },

  setRating(val) {
    this.selectedRating = val;
    for (let i = 1; i <= 5; i++) {
      const btn = document.getElementById(`rating-btn-${i}`);
      if (btn) {
        if (i === val) {
          btn.className = 'p-2.5 rounded-lg border text-center transition-all bg-blue-600 border-blue-400 text-white font-bold';
        } else {
          btn.className = 'p-2.5 rounded-lg border text-center transition-all bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600';
        }
      }
    }
  },

  handleSubmit(event) {
    event.preventDefault();
    const btn = document.getElementById('fb-submit-btn');
    const banner = document.getElementById('feedback-success-banner');

    btn.disabled = true;
    btn.innerHTML = `<span class="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></span> Submitting...`;

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = `${window.GoldenHourIcons.messageSquare('w-4 h-4')} Submit Feedback`;
      banner.classList.remove('hidden');
      banner.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('feedback-form').reset();
      window.GoldenHourApp.showToast('Feedback Submitted', 'Thank you for helping refine the GoldenHour platform.', 'success');
    }, 700);
  }
};

window.GoldenHourViews = window.GoldenHourViews || {};
window.GoldenHourViews.feedback = FeedbackView;
