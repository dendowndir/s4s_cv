"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // === Scene setup ===
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight,
    );
    mountRef.current.appendChild(renderer.domElement);

    const loader = new GLTFLoader();
    let modelRef: THREE.Object3D | null = null;
    // Raycaster + mouse for click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    // Audio elements / fallback
    let audioEl: HTMLAudioElement | null = null;
    let audioCtx: AudioContext | null = null;
    let oscillator: OscillatorNode | null = null;
    // load from Next.js public/ — reference assets by root-relative path
    loader.load("/models/low_poly_rat.glb", (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.5, 0.5, 0.5);
      model.position.set(0, 0, 0);
      scene.add(model);
      modelRef = model;
    });

    camera.position.z = 5;

    // === Light ===
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 5);
    scene.add(light);

    camera.position.z = 3;

    // === Animation loop ===
    const animate = () => {
      if (modelRef) {
        modelRef.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    try {
      audioEl = new Audio("/sounds/dog_bark.mp3");
      audioEl.preload = "auto";
    } catch (e) {
      audioEl = null;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!mountRef.current || !modelRef) return;
      const rect = renderer.domElement.getBoundingClientRect();
      // convert mouse to normalized device coordinates (-1 to +1)
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(modelRef, true);
      if (intersects.length > 0) {
        // play HTML audio if available, otherwise use WebAudio beep fallback
        if (audioEl) {
          // play returns a promise; ignore failures (autoplay policies) because this is a user gesture
          audioEl.currentTime = 0;
          void audioEl.play().catch(() => {
            // fallback to generated beep
            if (!audioCtx)
              audioCtx = new (
                window.AudioContext || (window as any).webkitAudioContext
              )();
            oscillator = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            oscillator.type = "sine";
            oscillator.frequency.value = 880;
            gain.gain.value = 0.1;
            oscillator.connect(gain);
            gain.connect(audioCtx.destination);
            oscillator.start();
            setTimeout(() => {
              oscillator?.stop();
              oscillator?.disconnect();
              gain.disconnect();
              oscillator = null;
            }, 150);
          });
        } else {
          if (!audioCtx)
            audioCtx = new (
              window.AudioContext || (window as any).webkitAudioContext
            )();
          oscillator = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          oscillator.type = "sine";
          oscillator.frequency.value = 880;
          gain.gain.value = 0.1;
          oscillator.connect(gain);
          gain.connect(audioCtx.destination);
          oscillator.start();
          setTimeout(() => {
            oscillator?.stop();
            oscillator?.disconnect();
            gain.disconnect();
            oscillator = null;
          }, 150);
        }
      }
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    // === Cleanup ===
    return () => {
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      // stop any oscillator if running
      try {
        oscillator?.stop();
        oscillator?.disconnect();
        audioCtx?.close();
      } catch (e) {
        // ignore
      }
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "400px" }} />;
}
