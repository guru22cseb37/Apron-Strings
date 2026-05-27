"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";

export default function AudioPlayer() {
  const { audioTrack } = useApp();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const vinylNoiseRef = useRef<AudioBufferSourceNode | null>(null);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);
  const activeGainNodesRef = useRef<GainNode[]>([]);

  // Stop all active sound generators
  const stopAllSound = () => {
    if (activeIntervalRef.current) {
      clearInterval(activeIntervalRef.current);
      activeIntervalRef.current = null;
    }
    if (vinylNoiseRef.current) {
      try {
        vinylNoiseRef.current.stop();
      } catch (e) {}
      vinylNoiseRef.current = null;
    }
    activeOscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {}
    });
    activeOscillatorsRef.current = [];
    activeGainNodesRef.current = [];
  };

  // Helper to safely create oscillators
  const playTone = (freq: number, startTime: number, duration: number, vol: number, type: OscillatorType = "sine") => {
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state === "suspended") return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      // Low pass filter to make it cozy and warm
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(type === "triangle" ? 600 : 1200, startTime);

      // Smooth volume envelope: soft attack, slow decay
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration - 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);

      activeOscillatorsRef.current.push(osc);
      activeGainNodesRef.current.push(gain);
    } catch (e) {
      console.error("Tone playback failed", e);
    }
  };

  // Synthesize soft procedural vinyl crackle record loops
  const startVinylCrackle = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 2; // 2 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Populate buffer with standard white noise mixed with random pop impulses
      for (let i = 0; i < bufferSize; i++) {
        let randVal = Math.random() * 2 - 1;
        // Inject vintage crackle clicks
        if (Math.random() > 0.9998) {
          randVal += (Math.random() > 0.5 ? 1.5 : -1.5);
        }
        data[i] = randVal;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.003, ctx.currentTime); // extremely quiet background crackle

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      vinylNoiseRef.current = noise;
    } catch (e) {
      console.error("Vinyl crackle failed", e);
    }
  };

  useEffect(() => {
    // 1. Terminate any ongoing sounds
    stopAllSound();

    if (audioTrack === "None") {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
        audioCtxRef.current = null;
      }
      return;
    }

    // 2. Initialize Audio Context if missing
    if (!audioCtxRef.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        audioCtxRef.current = new AudioContextClass();
      } catch (err) {
        console.error("Web Audio creation failed", err);
        return;
      }
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // 3. Play selected track
    if (audioTrack === "Bells") {
      // SETUP: Calming Pentatonic Bells
      const notes = [261.63, 293.66, 329.63, 392.00, 440.00]; // C4, D4, E4, G4, A4

      const playBells = () => {
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        playTone(randomNote, ctx.currentTime, 5.0, 0.015, "sine");
      };

      // Trigger bell chimes randomly
      activeIntervalRef.current = setInterval(() => {
        if (Math.random() > 0.4) {
          playBells();
        }
      }, 3500);

      // Play initial chime
      playBells();
    } 
    else if (audioTrack === "Waltz") {
      // SETUP: Parisian Waltz Chord Progression (3/4 tempo)
      // Chord: Cmaj9 -> Am7 -> Fmaj7 -> G7 (0.8s per beat, 2.4s per measure)
      const waltzChords = [
        { bass: 65.41, chord: [261.63, 329.63, 392.00, 493.88] }, // C2 + C4-E4-G4-B4
        { bass: 55.00, chord: [220.00, 261.63, 329.63, 392.00] }, // A1 + A3-C4-E4-G4
        { bass: 87.31, chord: [349.23, 440.00, 523.25, 659.25] }, // F2 + F4-A4-C5-E5
        { bass: 98.00, chord: [293.66, 392.00, 493.88, 587.33] }, // G2 + D4-G4-B4-F5
      ];

      let measureCount = 0;

      const playWaltzMeasure = () => {
        const chord = waltzChords[measureCount % waltzChords.length];
        const now = ctx.currentTime;

        // Beat 1: Warm low bass note
        playTone(chord.bass, now, 2.2, 0.02, "sine");

        // Beat 2 & 3: Soft, filtered triadic chords
        chord.chord.forEach((freq) => {
          playTone(freq, now + 0.8, 1.2, 0.006, "triangle");
          playTone(freq, now + 1.6, 1.2, 0.006, "triangle");
        });

        measureCount++;
      };

      // Loop every 2.4 seconds
      activeIntervalRef.current = setInterval(playWaltzMeasure, 2400);
      playWaltzMeasure();
    } 
    else if (audioTrack === "Lofi") {
      // SETUP: Cozy Baking Lofi (sweeping seventh chords + procedural crackle)
      startVinylCrackle();

      // Slow seventh chords (each chord lasts 4.5 seconds)
      const lofiChords = [
        [220.00, 261.63, 329.63, 392.00], // Am7 (A3-C4-E4-G4)
        [293.66, 349.23, 440.00, 523.25], // Dm7 (D4-F4-A4-C5)
        [196.00, 293.66, 392.00, 493.88], // G7  (G3-D4-G4-B4)
        [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4-E4-G4-B4)
      ];

      let chordCount = 0;

      const playLofiChord = () => {
        const chord = lofiChords[chordCount % lofiChords.length];
        const now = ctx.currentTime;

        // Play rolling chords smoothly (arpeggiated over 0.3s)
        chord.forEach((freq, idx) => {
          playTone(freq, now + idx * 0.1, 4.2, 0.012, "sine");
        });

        chordCount++;
      };

      // Loop every 4.5 seconds
      activeIntervalRef.current = setInterval(playLofiChord, 4500);
      playLofiChord();
    }

    return () => {
      stopAllSound();
    };
  }, [audioTrack]);

  return null;
}
