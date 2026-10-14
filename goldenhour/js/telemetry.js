// GoldenHour Realistic Telemetry Stream Simulator
// Simulates live ambulance telemetry without altering baseline clinical conditions inappropriately

class TelemetrySimulator {
  constructor(store) {
    this.store = store;
    this.isRunning = true;
    this.intervalId = null;
    
    // Waypoints along route from incident site to City Trauma Centre
    this.routeCoordinates = [
      [51.5033, -0.1195], // Departure: Scene
      [51.5050, -0.1220],
      [51.5074, -0.1278], // Current Position (10:11 AM)
      [51.5100, -0.1340],
      [51.5135, -0.1410],
      [51.5180, -0.1490],
      [51.5225, -0.1560], // City Trauma Centre destination
    ];
    this.currentWaypointIndex = 2; // at 10:11 AM position
  }

  start() {
    if (this.intervalId) return;
    
    this.intervalId = setInterval(() => {
      if (!this.isRunning) return;
      this.tick();
    }, 4000); // Pulse every 4 seconds
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  toggle() {
    this.isRunning = !this.isRunning;
    return this.isRunning;
  }

  tick() {
    const state = this.store.getAll();
    
    // Only update live measurements if not in Safe Mode/Offline
    if (state.networkStatus !== 'Offline / Safe Mode') {
      // Subtle realistic pulse variation (118 - 122 bpm)
      const currentPulse = state.vitals.pulse.value;
      const pulseDelta = (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.7 ? 1 : 0);
      const newPulse = Math.min(124, Math.max(116, currentPulse + pulseDelta));
      state.vitals.pulse.value = newPulse;
      state.vitals.pulse.history.push(newPulse);
      if (state.vitals.pulse.history.length > 8) state.vitals.pulse.history.shift();

      // Subtle SpO2 variation around 88% (87 - 89%)
      const currentSpO2 = state.vitals.spo2.value;
      const spo2Delta = (Math.random() > 0.6 ? 1 : -1) * (Math.random() > 0.8 ? 1 : 0);
      const newSpO2 = Math.min(90, Math.max(87, currentSpO2 + spo2Delta));
      state.vitals.spo2.value = newSpO2;
      state.vitals.spo2.history.push(newSpO2);
      if (state.vitals.spo2.history.length > 8) state.vitals.spo2.history.shift();
      
      this.store.notify('vitals');
    }
  }

  getCurrentPosition() {
    return this.routeCoordinates[this.currentWaypointIndex];
  }

  getDestinationPosition() {
    return this.routeCoordinates[this.routeCoordinates.length - 1];
  }

  getDeparturePosition() {
    return this.routeCoordinates[0];
  }

  getFullRoute() {
    return this.routeCoordinates;
  }
}

window.GoldenHourTelemetry = new TelemetrySimulator(window.GoldenHourStore);
