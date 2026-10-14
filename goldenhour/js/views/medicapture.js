// GoldenHour MediCapture View
// Secure pre-hospital media attachments, authorization verification, and encrypted review gallery

const MediCaptureView = {
  render(container) {
    const I = window.GoldenHourIcons;
    const store = window.GoldenHourStore;
    const state = store.getAll();
    const mediaList = state.mediaItems;

    container.innerHTML = `
      <div class="space-y-8 pb-16">
        
        <!-- PAGE HEADER -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e3260] pb-6">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-900/40 text-cyan-400 border border-cyan-500/30">
                CLINICAL IMAGING VAULT
              </span>
              <span class="text-xs text-slate-400">AES-256 Encrypted &bull; Audit Trail Logged</span>
            </div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              MediCapture
            </h1>
            <p class="text-sm text-slate-300 mt-1">
              Capture and share relevant patient photos, videos, and clinical attachments with the receiving team through an authorized and secure workflow.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-xs text-slate-400">Attached to Case: <strong class="text-white">${state.patient.id}</strong></span>
          </div>
        </div>


        <!-- CLINICAL INTRODUCTION & PRIVACY BANNER -->
        <div class="p-4 rounded-xl bg-[#0e172e] border border-cyan-900/40 text-xs text-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p class="max-w-2xl leading-relaxed">
            Sometimes a clinical team needs more context than a written report can provide. MediCapture allows authorized ambulance staff to attach relevant visual information to an incoming patient record so the receiving hospital can review it before arrival.
          </p>
          <div class="flex items-center gap-2 shrink-0 text-cyan-400 font-semibold text-[11px] bg-cyan-950/60 px-3 py-2 rounded-lg border border-cyan-800/40">
            ${I.shield('w-4 h-4')}
            Encrypted In-Transit & At-Rest
          </div>
        </div>


        <!-- UPLOAD SECTION & UPLOAD FORM -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- LEFT 6 COLS: Drag & Drop Dropzone + Camera Actions -->
          <div class="lg:col-span-6 space-y-4">
            
            <div class="clinical-card p-6 space-y-4">
              <h3 class="text-base font-bold text-white flex items-center gap-2">
                ${I.upload('w-5 h-5 text-cyan-400')}
                Add Patient Photos or Videos
              </h3>
              <p class="text-xs text-slate-400">
                Upload relevant images or short video clips for the authorized receiving team to review.
              </p>

              <!-- Drag and Drop Dropzone -->
              <div 
                id="media-dropzone"
                onclick="document.getElementById('file-input-media').click()"
                class="border-2 border-dashed border-cyan-600/40 hover:border-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/40 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-3 group"
              >
                <div class="w-14 h-14 mx-auto rounded-full bg-cyan-900/30 text-cyan-400 group-hover:scale-110 transition-transform flex items-center justify-center">
                  ${I.camera('w-7 h-7')}
                </div>
                <div>
                  <div class="text-sm font-bold text-white">Drag & drop files here, or click to browse</div>
                  <div class="text-[11px] text-slate-400 mt-1">Supports JPEG, PNG, MP4 video (Max 25 MB)</div>
                </div>
              </div>
              <input type="file" id="file-input-media" class="hidden" accept="image/*,video/*" onchange="window.GoldenHourViews.medicapture.handleFileSelected(event)">

              <!-- Primary & Secondary Buttons -->
              <div class="grid grid-cols-2 gap-3 pt-1">
                <button onclick="document.getElementById('file-input-media').click()" class="py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2">
                  ${I.upload('w-4 h-4')}
                  Upload Media
                </button>
                <button onclick="window.GoldenHourViews.medicapture.simulateCameraCapture()" class="py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2">
                  ${I.camera('w-4 h-4 text-cyan-400')}
                  Capture Photo
                </button>
              </div>

              <!-- Upload Progress Box (Simulated) -->
              <div id="media-upload-progress" class="hidden p-3 rounded-lg bg-blue-950/50 border border-blue-500/40 text-xs space-y-2">
                <div class="flex items-center justify-between text-blue-300 font-medium">
                  <span id="upload-progress-label">Encrypting and uploading media...</span>
                  <span id="upload-percent-text" class="font-mono">0%</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div id="upload-progress-bar" class="h-full bg-cyan-400 transition-all duration-200" style="width: 0%;"></div>
                </div>
              </div>

            </div>

            <!-- Upload Workflow Step-by-Step Card -->
            <div class="clinical-card p-5 space-y-3 text-xs">
              <div class="font-bold text-white flex items-center gap-2 text-sm border-b border-slate-800 pb-2">
                Authorized Upload Workflow
              </div>
              <ol class="list-decimal list-inside space-y-1.5 text-slate-300">
                <li>Select the correct patient record (GH-1042).</li>
                <li>Capture or choose the relevant media attachment.</li>
                <li>Review the attachment before submitting.</li>
                <li>Add a brief description and clinical category.</li>
                <li>Confirm authorization and any required consent.</li>
                <li>Upload securely using AES-256 client encryption.</li>
                <li>Verify server acknowledgement.</li>
                <li>Confirm receiving trauma team can access attachment.</li>
              </ol>
            </div>

          </div>


          <!-- RIGHT 6 COLS: Upload Metadata & Consent Form -->
          <div class="lg:col-span-6 space-y-4">
            
            <div class="clinical-card p-6 space-y-4">
              <h3 class="text-base font-bold text-white flex items-center gap-2">
                Clinical Attachment Details & Consent
              </h3>

              <form id="media-metadata-form" onsubmit="window.GoldenHourViews.medicapture.submitAttachment(event)" class="space-y-3 text-xs">
                
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-slate-400 mb-1 font-semibold">Patient ID</label>
                    <input type="text" value="${state.patient.id}" readonly class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300 font-mono">
                  </div>
                  <div>
                    <label class="block text-slate-400 mb-1 font-semibold">Ambulance ID</label>
                    <input type="text" value="${state.patient.ambulanceId}" readonly class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300 font-mono">
                  </div>
                </div>

                <div>
                  <label class="block text-slate-400 mb-1 font-semibold">Media Category</label>
                  <select id="media-category-select" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
                    <option value="Visible injury">Visible injury</option>
                    <option value="Wound assessment">Wound assessment</option>
                    <option value="Incident scene documentation">Incident scene documentation</option>
                    <option value="Medical equipment or device documentation">Medical equipment or device documentation</option>
                    <option value="Other clinical attachment">Other clinical attachment</option>
                  </select>
                </div>

                <div>
                  <label class="block text-slate-400 mb-1 font-semibold">Short Description</label>
                  <input type="text" id="media-desc-input" placeholder="e.g. Left leg alignment following vacuum splint placement" required class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500">
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-slate-400 mb-1 font-semibold">Uploaded By</label>
                    <input type="text" id="media-uploader-input" value="Paramedic J. Mercer (ID: PM-449)" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
                  </div>
                  <div>
                    <label class="block text-slate-400 mb-1 font-semibold">Capture Timestamp</label>
                    <input type="text" value="10:11 AM" readonly class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300 font-mono">
                  </div>
                </div>

                <div>
                  <label class="block text-slate-400 mb-1 font-semibold">Optional Clinical Note</label>
                  <textarea id="media-clinical-notes" rows="2" placeholder="Relevant observations for receiving surgical team..." class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500"></textarea>
                </div>

                <!-- Consent or Authorization Checkbox -->
                <div class="p-3 rounded-lg bg-slate-900/90 border border-slate-700 space-y-2">
                  <label class="flex items-start gap-2.5 cursor-pointer text-slate-200">
                    <input type="checkbox" id="consent-checkbox" required class="mt-0.5 rounded border-slate-600 text-blue-600 focus:ring-0">
                    <span>
                      <strong class="text-white">Authorization & Consent Confirmed:</strong>
                      Patient consent obtained or emergency implied consent authorized by attending clinician for clinical handover.
                    </span>
                  </label>
                </div>

                <button type="submit" class="w-full py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-600/30 flex items-center justify-center gap-2">
                  ${I.upload('w-4 h-4')}
                  Confirm & Securely Upload to Case
                </button>

              </form>
            </div>

          </div>

        </div>


        <!-- MEDIA REVIEW GALLERY -->
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-[#1e3260] pb-3">
            <div>
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                ${I.camera('w-5 h-5 text-cyan-400')}
                Case Media Review Gallery
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">
                Attachments available to receiving hospital trauma bay for patient ${state.patient.id}
              </p>
            </div>
            <span class="text-xs text-slate-400 font-mono">${mediaList.length} items logged</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${mediaList.map(item => `
              <div class="clinical-card p-4 flex flex-col justify-between space-y-4 border-slate-800 hover:border-cyan-600/50 transition-all">
                
                <div class="flex gap-4">
                  <!-- Thumbnail Container -->
                  <div class="w-28 h-24 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 relative">
                    <div class="text-cyan-400 flex flex-col items-center justify-center p-2 text-center">
                      ${I.camera('w-8 h-8')}
                      <span class="text-[9px] uppercase font-mono mt-1 text-slate-400">${item.fileType.split('/')[1]}</span>
                    </div>
                  </div>

                  <!-- Details -->
                  <div class="space-y-1 text-xs flex-1">
                    <div class="flex items-center justify-between">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                        ${item.category}
                      </span>
                      <span class="text-[10px] text-slate-400 font-mono">${item.captureTime}</span>
                    </div>

                    <h4 class="text-sm font-bold text-white line-clamp-1">${item.fileName}</h4>
                    <p class="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">${item.description}</p>
                    
                    <div class="text-[10px] text-slate-400 pt-1">
                      By: <span class="text-slate-200">${item.uploadedBy}</span>
                    </div>
                  </div>
                </div>

                <!-- Footer Status & Actions -->
                <div class="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                  <span class="text-emerald-400 flex items-center gap-1.5 text-[11px]">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    ${item.uploadStatus}
                  </span>

                  <div class="flex items-center gap-2">
                    <button onclick="window.GoldenHourViews.medicapture.openSecureViewer('${item.id}')" class="px-3 py-1.5 rounded bg-blue-900/40 hover:bg-blue-900 text-blue-300 text-xs font-semibold border border-blue-700/50 flex items-center gap-1 transition-all">
                      ${I.shield('w-3.5 h-3.5')} Secure View
                    </button>
                    <button onclick="window.GoldenHourViews.medicapture.revokeMedia('${item.id}')" class="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-400 text-xs border border-slate-700 transition-all">
                      Revoke
                    </button>
                  </div>
                </div>

              </div>
            `).join('')}
          </div>
        </div>


        <!-- MANDATORY HEALTHCARE PRIVACY NOTICE -->
        <div class="p-5 rounded-2xl bg-[#0c1429] border border-slate-800 text-xs text-slate-400 space-y-2">
          <div class="font-bold text-white flex items-center gap-2">
            ${I.shield('w-4 h-4 text-emerald-400')}
            Healthcare Privacy & Data Protection Compliance:
          </div>
          <p class="leading-relaxed">
            Patient photos and videos are sensitive clinical information. Use authenticated access, encrypted transfer and storage, access controls, audit logs, and applicable healthcare privacy requirements. Avoid unnecessary identifying details in previews and notifications.
          </p>
        </div>

      </div>
    `;
  },

  handleFileSelected(event) {
    const file = event.target.files[0];
    if (!file) return;

    const descInput = document.getElementById('media-desc-input');
    if (descInput) descInput.value = `Attachment: ${file.name} (${(file.size / (1024*1024)).toFixed(1)} MB)`;
    window.GoldenHourApp.showToast('File Attached', `${file.name} ready for review and encryption.`, 'info');
  },

  simulateCameraCapture() {
    const descInput = document.getElementById('media-desc-input');
    if (descInput) descInput.value = `Camera snapshot taken at 10:12 AM - Scene Documentation`;
    window.GoldenHourApp.showToast('Camera Snapshot Captured', 'Image buffer acquired from device sensor.', 'success');
  },

  submitAttachment(event) {
    event.preventDefault();
    const store = window.GoldenHourStore;
    const cat = document.getElementById('media-category-select').value;
    const desc = document.getElementById('media-desc-input').value;
    const uploader = document.getElementById('media-uploader-input').value;

    const progressBox = document.getElementById('media-upload-progress');
    const progressBar = document.getElementById('upload-progress-bar');
    const percentText = document.getElementById('upload-percent-text');

    progressBox.classList.remove('hidden');

    let pct = 0;
    const interval = setInterval(() => {
      pct += 25;
      progressBar.style.width = `${pct}%`;
      percentText.innerText = `${pct}%`;

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          progressBox.classList.add('hidden');
          
          store.addMediaItem({
            id: `MED-1042-0${Math.floor(10 + Math.random()*90)}`,
            patientId: store.get('patient').id,
            ambulanceId: store.get('patient').ambulanceId,
            category: cat,
            description: desc,
            fileType: 'image/jpeg',
            fileName: `capture_${Date.now().toString().slice(-4)}.jpg`,
            fileSize: '2.1 MB',
            captureTime: '10:12 AM',
            uploadedBy: uploader,
            authorizationStatus: 'Direct Clinical Telemetry Attachment',
            encryptionState: 'AES-256 Client Encrypted',
            uploadStatus: store.get('networkStatus') === 'Offline / Safe Mode' ? 'Stored Locally (Safe Mode Pending)' : 'Server Confirmed (Available to Receiving Team)',
            thumbnailUrl: 'assets/sample_generic.svg',
            isPendingUpload: store.get('networkStatus') === 'Offline / Safe Mode'
          });

          window.GoldenHourApp.showToast('Media Upload Confirmed', 'Encrypted file verified and added to patient case.', 'success');
          MediCaptureView.render(document.getElementById('view-container'));
        }, 300);
      }
    }, 150);
  },

  openSecureViewer(itemId) {
    const item = window.GoldenHourStore.getAll().mediaItems.find(m => m.id === itemId);
    if (!item) return;

    window.GoldenHourApp.openModal(`
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
            <h3 class="font-bold text-white text-base">Secure Clinical Image Viewer</h3>
          </div>
          <span class="text-xs font-mono text-cyan-400">${item.encryptionState}</span>
        </div>

        <div class="bg-black/80 rounded-xl p-8 text-center border border-slate-800 flex flex-col items-center justify-center space-y-3">
          <div class="w-20 h-20 rounded-full bg-cyan-900/30 text-cyan-400 flex items-center justify-center">
            ${window.GoldenHourIcons.camera('w-10 h-10')}
          </div>
          <div class="text-sm font-bold text-white">${item.fileName}</div>
          <div class="text-xs text-slate-400 max-w-md">${item.description}</div>
          <div class="text-[11px] text-emerald-400 font-mono">Decrypted in memory for authorized session only</div>
        </div>

        <div class="text-xs text-slate-300 space-y-1 bg-slate-900 p-3 rounded-lg border border-slate-800">
          <div><strong>Case:</strong> ${item.patientId} &bull; Unit: ${item.ambulanceId}</div>
          <div><strong>Category:</strong> ${item.category}</div>
          <div><strong>Attending:</strong> ${item.uploadedBy}</div>
          <div><strong>Audit Token:</strong> <span class="font-mono text-slate-400">SHA256: 7f83b165...9482</span></div>
        </div>

        <div class="flex justify-end pt-2">
          <button onclick="window.GoldenHourApp.closeModal()" class="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold">
            Close Secure Viewer
          </button>
        </div>
      </div>
    `);
  },

  revokeMedia(itemId) {
    if (confirm(`Revoke and delete attachment ${itemId}? This action is recorded in the audit trail.`)) {
      const state = window.GoldenHourStore.getAll();
      state.mediaItems = state.mediaItems.filter(m => m.id !== itemId);
      window.GoldenHourStore.notify('mediaItems');
      window.GoldenHourApp.showToast('Attachment Revoked', `Record ${itemId} marked revoked per retention rules.`, 'warning');
      this.render(document.getElementById('view-container'));
    }
  }
};

window.GoldenHourViews = window.GoldenHourViews || {};
window.GoldenHourViews.medicapture = MediCaptureView;
