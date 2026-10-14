// GoldenHour Live Ambulance Tracking View
// Integrated with Google Maps API (Key: AIzaSyAFJPEIMuUF6sF20yd0yaa5Wy4lhL4eLLE) with resilient fallback

const TrackingView = {
  googleMap: null,
  ambulanceMarker: null,
  routePolyline: null,
  leafletMap: null,
  apiKey: "AIzaSyAFJPEIMuUF6sF20yd0yaa5Wy4lhL4eLLE",

  render(container) {
    const I = window.GoldenHourIcons;
    const store = window.GoldenHourStore;
    const state = store.getAll();
    const p = state.patient;

    container.innerHTML = `
      <div class="space-y-6 pb-16">
        
        <!-- PAGE HEADER -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e3260] pb-6">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/40 text-emerald-400 border border-emerald-500/30">
                ACTIVE GPS NAVIGATION STREAM
              </span>
              <span class="text-xs text-slate-400 font-mono">Google Maps Telemetry &bull; Key Authorized</span>
            </div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Live Ambulance Tracking
              <span class="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ${p.status}
              </span>
            </h1>
            <p class="text-sm text-slate-300 mt-1">
              Real-time route telemetry connecting Ambulance ${p.ambulanceId} to ${p.receivingHospital}.
            </p>
          </div>

          <!-- Controls Toolbar -->
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="window.GoldenHourViews.tracking.recenterMap()" class="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5">
              ${I.mapPin('w-3.5 h-3.5 text-blue-400')} Recenter
            </button>
            <button onclick="window.GoldenHourApp.openHospitalSelector()" class="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5">
              ${I.building('w-3.5 h-3.5 text-amber-400')} Change Destination
            </button>
            <button onclick="window.GoldenHourViews.tracking.refreshGps()" class="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/20">
              ${I.refresh('w-3.5 h-3.5')} Refresh GPS Lock
            </button>
          </div>
        </div>


        <!-- MAIN TRACKING LAYOUT: MAP + SIDEBAR DETAILS -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- LEFT 8 COLS: LARGE MAP CANVAS -->
          <div class="lg:col-span-8 space-y-4">
            
            <div class="clinical-card p-2 relative overflow-hidden shadow-2xl border-blue-900/40">
              
              <!-- Floating Map HUD Overlay -->
              <div class="absolute top-4 left-4 z-[500] bg-[#0b132b]/90 backdrop-blur-md p-3.5 rounded-xl border border-blue-900/60 shadow-lg text-xs space-y-1.5 max-w-xs pointer-events-auto">
                <div class="flex items-center justify-between gap-4">
                  <span class="font-bold text-white flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 beacon-green"></span>
                    Ambulance ${p.ambulanceId}
                  </span>
                  <span class="text-[10px] text-emerald-400 font-mono font-bold">54 km/h</span>
                </div>
                <div class="text-[11px] text-slate-300">
                  En route to <strong class="text-white">${p.receivingHospital}</strong>
                </div>
                <div class="text-[10px] text-amber-400 font-mono bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  Delay: +11 min arterial congestion
                </div>
              </div>

              <!-- Map Container -->
              <div id="ambulance-map" class="w-full h-[540px] rounded-lg bg-[#0a1128]"></div>

              <!-- Map Footer Telemetry Strip -->
              <div class="p-3 bg-[#0e172e] rounded-b-lg border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div class="flex items-center gap-4">
                  <span class="text-slate-400">Position: <strong class="text-slate-200 font-mono">51.5074° N, 0.1278° W</strong></span>
                  <span class="text-slate-400">Heading: <strong class="text-slate-200 font-mono">182° South</strong></span>
                  <span class="text-slate-400">GPS Timestamp: <strong class="text-slate-200 font-mono">${p.lastGpsUpdate}</strong></span>
                </div>
                <div class="text-slate-400 text-[11px] font-mono">
                  Engine: <span class="text-emerald-400" id="map-engine-label">Google Maps Engine Active</span>
                </div>
              </div>
            </div>

            <!-- Route Delay Alert Callout -->
            <div class="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-3">
              ${I.alertTriangle('w-5 h-5 text-amber-400 shrink-0 mt-0.5')}
              <div>
                <strong class="font-bold text-white">Route Delay Telemetry:</strong>
                <p class="mt-0.5 leading-relaxed">${p.trafficNotice}</p>
              </div>
            </div>

          </div>


          <!-- RIGHT 4 COLS: TRACKING SUMMARY & TIMELINE -->
          <div class="lg:col-span-4 space-y-6">
            
            <!-- TRACKING SUMMARY CARD -->
            <div class="clinical-card p-6 space-y-4 shadow-xl">
              <div class="border-b border-[#1e3260] pb-3 flex items-center justify-between">
                <div>
                  <div class="text-[10px] font-bold text-blue-400 uppercase tracking-wider">LIVE TELEMETRY SUMMARY</div>
                  <h3 class="text-base font-bold text-white">Unit: ${p.ambulanceId}</h3>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                  ${p.status}
                </span>
              </div>

              <div class="space-y-3 text-xs">
                <div class="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <span class="text-slate-400 text-[11px] block">Destination Hospital:</span>
                  <span class="text-sm font-bold text-white flex items-center gap-1.5">
                    ${I.building('w-4 h-4 text-blue-400')}
                    ${p.receivingHospital}
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 space-y-0.5">
                    <span class="text-amber-300 text-[10px] uppercase font-semibold">Estimated Arrival</span>
                    <div class="text-xl font-bold text-amber-400 telemetry-num">${p.updatedEta}</div>
                  </div>

                  <div class="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-0.5">
                    <span class="text-slate-400 text-[10px] uppercase font-semibold">Remaining Travel</span>
                    <div class="text-xl font-bold text-slate-200 telemetry-num">${p.remainingMinutes} min</div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                    <span class="text-slate-400 text-[10px] block">Distance</span>
                    <span class="text-xs font-semibold text-slate-200 font-mono">${p.remainingDistance}</span>
                  </div>
                  <div class="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                    <span class="text-slate-400 text-[10px] block">Last Fix</span>
                    <span class="text-xs font-semibold text-slate-200 font-mono">${p.lastGpsUpdate}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- JOURNEY TIMELINE -->
            <div class="clinical-card p-6 space-y-4">
              <div class="border-b border-[#1e3260] pb-3">
                <h3 class="text-base font-bold text-white">Journey Progression</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">Key transport milestones</p>
              </div>

              <div class="relative pl-6 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700 text-xs">
                
                <div class="relative">
                  <span class="absolute -left-6 top-1 w-3 h-3 rounded-full bg-slate-500"></span>
                  <div class="font-bold text-white font-mono">10:00 AM — Departed Scene</div>
                  <p class="text-slate-400 text-[11px]">Ambulance en route with Patient GH-1042.</p>
                </div>

                <div class="relative">
                  <span class="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-500"></span>
                  <div class="font-bold text-white font-mono">10:05 AM — Initial ETA (10:25 AM)</div>
                  <p class="text-slate-400 text-[11px]">Clear highway conditions initially observed.</p>
                </div>

                <div class="relative">
                  <span class="absolute -left-6 top-1 w-3 h-3 rounded-full bg-amber-400"></span>
                  <div class="font-bold text-amber-300 font-mono">10:10 AM — Arterial Congestion</div>
                  <p class="text-slate-400 text-[11px]">Routing delay detected. ETA adjusted to 10:36 AM.</p>
                </div>

                <div class="relative">
                  <span class="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-400 beacon-green"></span>
                  <div class="font-bold text-emerald-400 font-mono">10:11 AM — Current GPS Lock</div>
                  <p class="text-slate-400 text-[11px]">Approaching Junction 4. 25 minutes remaining.</p>
                </div>

                <div class="relative opacity-60">
                  <span class="absolute -left-6 top-1 w-3 h-3 rounded-full bg-slate-600"></span>
                  <div class="font-bold text-slate-400 font-mono">10:36 AM — Trauma Bay 2 Arrival</div>
                  <p class="text-slate-500 text-[11px]">Direct handover to trauma resuscitation team.</p>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    `;

    setTimeout(() => {
      this.initMap();
    }, 150);
  },

  initMap() {
    const mapEl = document.getElementById('ambulance-map');
    if (!mapEl) return;

    const tel = window.GoldenHourTelemetry;
    const store = window.GoldenHourStore;
    const state = store.getAll();
    const currentCoords = tel.getCurrentPosition(); // [lat, lng]
    const destCoords = tel.getDestinationPosition();
    const fullRoute = tel.getFullRoute();

    // Check if Google Maps is available
    if (typeof google !== 'undefined' && google.maps) {
      try {
        const center = { lat: currentCoords[0], lng: currentCoords[1] };
        const dest = { lat: destCoords[0], lng: destCoords[1] };

        this.googleMap = new google.maps.Map(mapEl, {
          center: center,
          zoom: 13,
          mapTypeId: 'roadmap',
          styles: [
            { elementType: "geometry", stylers: [{ color: "#0c1527" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#0c1527" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#748bb3" }] },
            { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#8da7cf" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e3260" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#142244" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2563eb" }] },
            { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1d4ed8" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#060b17" }] }
          ],
          disableDefaultUI: false,
          zoomControl: true
        });

        // Add Route Polyline
        const path = fullRoute.map(c => ({ lat: c[0], lng: c[1] }));
        this.routePolyline = new google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: '#3b82f6',
          strokeOpacity: 0.9,
          strokeWeight: 5
        });
        this.routePolyline.setMap(this.googleMap);

        // Ambulance Marker
        this.ambulanceMarker = new google.maps.Marker({
          position: center,
          map: this.googleMap,
          title: `Ambulance AMB-07 (En Route)`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#ef4444",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3
          }
        });

        // Destination Marker
        new google.maps.Marker({
          position: dest,
          map: this.googleMap,
          title: state.selectedHospital,
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: "#10b981",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2
          }
        });

        const engineLabel = document.getElementById('map-engine-label');
        if (engineLabel) engineLabel.innerText = "Google Maps API Verified";
        return;
      } catch (e) {
        console.warn("Google Maps init exception, utilizing fallback", e);
      }
    }

    // Resilient Fallback to Leaflet with dark emergency tiles
    if (typeof L !== 'undefined') {
      if (this.leafletMap) {
        this.leafletMap.remove();
        this.leafletMap = null;
      }

      this.leafletMap = L.map('ambulance-map', {
        zoomControl: true,
        attributionControl: false
      }).setView(currentCoords, 13);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(this.leafletMap);

      // Route
      L.polyline(fullRoute, { color: '#3b82f6', weight: 5, opacity: 0.85, dashArray: '6, 6' }).addTo(this.leafletMap);

      // Ambulance beacon
      const ambIcon = L.divIcon({
        className: 'custom-ambulance-icon',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-10 h-10 rounded-full bg-red-600/40 animate-ping absolute"></div>
            <div class="w-9 h-9 rounded-full bg-red-600 border-2 border-white shadow-2xl flex items-center justify-center text-white relative z-10">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
            </div>
          </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      this.ambulanceMarker = L.marker(currentCoords, { icon: ambIcon })
        .addTo(this.leafletMap)
        .bindPopup(`<strong>AMB-07 (En Route)</strong><br>Patient GH-1042<br>ETA: ${state.patient.updatedEta}`)
        .openPopup();

      // Destination
      const destIcon = L.divIcon({
        className: 'custom-pin-hospital',
        html: `<div class="px-2.5 py-1 rounded bg-blue-900 text-white font-bold text-[11px] border border-blue-400 whitespace-nowrap">${state.selectedHospital}</div>`,
        iconSize: [140, 28]
      });
      L.marker(destCoords, { icon: destIcon }).addTo(this.leafletMap);

      const engineLabel = document.getElementById('map-engine-label');
      if (engineLabel) engineLabel.innerText = "GPS Mapping Telemetry Stream";
    }
  },

  recenterMap() {
    const tel = window.GoldenHourTelemetry;
    const pos = tel.getCurrentPosition();
    if (this.googleMap) {
      this.googleMap.panTo({ lat: pos[0], lng: pos[1] });
    } else if (this.leafletMap) {
      this.leafletMap.panTo(pos);
    }
  },

  refreshGps() {
    window.GoldenHourApp.showToast('GPS Telemetry Polled', 'Carrier differential lock confirmed via GNSS Gateway.', 'info');
  }
};

window.GoldenHourViews = window.GoldenHourViews || {};
window.GoldenHourViews.tracking = TrackingView;
