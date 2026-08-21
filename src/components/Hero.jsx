import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Award, ChevronDown } from "lucide-react";
import * as THREE from "three";

import sambitImg from "../assets/sambit-panda.jpg";
import nilsuImg from "../assets/nilsu-pattnaik.jpg";

export default function App() {
  return <Hero />;
}

function bookDemo() {
  window.open(
    "https://docs.google.com/forms/d/e/1FAIpQLSd368-GnfJjgbQdIeAiU6ro68983N8OPo6upy5n0kDI9YClkA/viewform?usp=dialog",
    "_blank"
  );
}

/* -------------------------------------------------------------------- */
/* Enhanced Procedural 3D Geometry Builders                             */
/* -------------------------------------------------------------------- */

// OPTIMIZATION: Pass materials in so they are created once, not 64 times.
function buildBoardHalf(colStart, colCount, lightMat, darkMat, tileGeo) {
  const half = new THREE.Group();

  for (let col = 0; col < colCount; col++) {
    for (let row = 0; row < 8; row++) {
      const globalCol = colStart + col;
      const isLight = (globalCol + row) % 2 === 0;

      // Share the exact same material instance across all tiles
      const tile = new THREE.Mesh(tileGeo, isLight ? lightMat : darkMat);
      tile.position.set(globalCol - 3.5, 0, row - 3.5);
      tile.receiveShadow = true;
      half.add(tile);
    }
  }
  return half;
}

function buildPawn() {
  const group = new THREE.Group();

  const profile = [
    new THREE.Vector2(0.48, 0),
    new THREE.Vector2(0.48, 0.08),
    new THREE.Vector2(0.38, 0.12),
    new THREE.Vector2(0.28, 0.38),
    new THREE.Vector2(0.32, 0.42),
    new THREE.Vector2(0.18, 0.65),
    new THREE.Vector2(0.18, 0.72),
    new THREE.Vector2(0.28, 0.76),
    new THREE.Vector2(0.22, 0.8),
  ];
  
  // OPTIMIZATION: Dropped segments from 64 to 32. Visually identical, half the geometry.
  const bodyGeo = new THREE.LatheGeometry(profile, 32); 
  const material = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.88,
    roughness: 0.15,
    emissive: 0xd97706,
    emissiveIntensity: 0.2,
  });

  const body = new THREE.Mesh(bodyGeo, material);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // OPTIMIZATION: Dropped from 48x48 to 32x32.
  const headGeo = new THREE.SphereGeometry(0.24, 32, 32);
  const head = new THREE.Mesh(headGeo, material);
  head.position.y = 0.8 + 0.19;
  head.castShadow = true;
  head.receiveShadow = true;
  group.add(head);

  return group;
}

/* -------------------------------------------------------------------- */
/* Responsive 3D Canvas Engine                                          */
/* -------------------------------------------------------------------- */

function ChessHero3D({ progress }) {
  const mountRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      isMobile ? 48 : 38,
      width / height,
      0.1,
      100
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    
    // OPTIMIZATION: Capped at 1.5 to prevent 4K/Retina displays from choking the GPU.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); 
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    /* --- LIGHTING --- */
    const ambientLight = new THREE.AmbientLight(0x2d3748, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff1d6, 2.8);
    keyLight.position.set(6, 12, 7);
    keyLight.castShadow = true;
    // OPTIMIZATION: Lowered shadow map from 2048 to 1024. Massive performance boost.
    keyLight.shadow.mapSize.width = 1024; 
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 3.8, 25);
    rimLight.position.set(-7, 6, -5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xd97706, 1.2);
    fillLight.position.set(-4, -2, 4);
    scene.add(fillLight);

    /* --- SHARED BOARD ASSETS --- */
    const boardGroup = new THREE.Group();
    
    // Create Geometries and Materials exactly once
    const tileGeo = new THREE.BoxGeometry(0.96, 0.12, 0.96);
    const lightMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.25,
      metalness: 0.35,
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.45,
      metalness: 0.15,
    });

    const leftHalf = buildBoardHalf(0, 4, lightMat, darkMat, tileGeo);
    const leftPivot = new THREE.Group();
    leftHalf.position.x = 2;
    leftPivot.position.x = -2;
    leftPivot.add(leftHalf);

    const rightHalf = buildBoardHalf(4, 4, lightMat, darkMat, tileGeo);
    boardGroup.add(leftPivot);
    boardGroup.add(rightHalf);
    boardGroup.position.y = -0.4;
    scene.add(boardGroup);

    /* --- GOLDEN FRAME --- */
    const frameGeo = new THREE.TorusGeometry(5.65, 0.05, 16, 4);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1,
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.rotation.x = Math.PI / 2;
    frame.rotation.z = Math.PI / 4;
    frame.position.y = -0.4;
    frame.scale.set(1, 1.414, 1);
    scene.add(frame);

    /* --- HERO PAWN --- */
    const pawn = buildPawn();
    pawn.scale.setScalar(0.001);
    pawn.position.set(0, -4, 0);
    scene.add(pawn);

    /* --- DUST PARTICLES --- */
    // OPTIMIZATION: Dropped max particles slightly to save render passes.
    const sparkleCount = isMobile ? 40 : 80; 
    const sparklePositions = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.0 + Math.random() * 4.0;
      sparklePositions[i * 3] = Math.cos(angle) * radius;
      sparklePositions[i * 3 + 1] = Math.random() * 5 - 1.5;
      sparklePositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const sparkleGeo = new THREE.BufferGeometry();
    sparkleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(sparklePositions, 3)
    );
    const sparkleMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: isMobile ? 0.06 : 0.08,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
    scene.add(sparkles);

    camera.position.set(0, isMobile ? 11 : 9, isMobile ? 15 : 13);
    camera.lookAt(0, -0.4, 0);

    const clock = new THREE.Clock();

    engineRef.current = {
      leftPivot, boardGroup, pawn, camera, sparkles, 
      sparkleMat, renderer, scene, clock,
      targetProgress: 0, currentProgress: 0, isMobile,
    };

    function onResize() {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      const mobileCheck = w < 768;

      if (engineRef.current) engineRef.current.isMobile = mobileCheck;

      camera.fov = mobileCheck ? 48 : 38;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      
      // Cleanup all materials and geometries to prevent memory leaks
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.targetProgress = progress;
    }
  }, [progress]);

  useEffect(() => {
    let frameId;
    const lerp = THREE.MathUtils.lerp;
    const clamp01 = THREE.MathUtils.clamp;
    const mapRange = (v, a, b) => clamp01((v - a) / (b - a), 0, 1);

    const renderLoop = () => {
      if (engineRef.current) {
        const {
          leftPivot, boardGroup, pawn, camera, sparkles,
          sparkleMat, renderer, scene, clock, isMobile,
        } = engineRef.current;

        const t = clock.getElapsedTime();

        engineRef.current.currentProgress = lerp(
          engineRef.current.currentProgress,
          engineRef.current.targetProgress,
          0.065
        );

        const p = engineRef.current.currentProgress;

        // PHASE 1: Board Unfolds
        const openAmt = mapRange(p, 0, 0.45);
        leftPivot.rotation.z = lerp(Math.PI, 0, easeOutCubic(openAmt));
        boardGroup.scale.setScalar(lerp(isMobile ? 0.45 : 0.55, isMobile ? 0.8 : 1, easeOutCubic(openAmt)));
        boardGroup.rotation.y = lerp(-0.4, 0, easeOutCubic(openAmt));

        // PHASE 2: Pawn Emerges
        const riseAmt = mapRange(p, 0.35, 0.75);
        const easedRise = easeOutBack(riseAmt);
        pawn.scale.setScalar(Math.max(0.001, lerp(0.001, isMobile ? 1.15 : 1.45, easedRise)));
        pawn.position.y = lerp(-4, isMobile ? 0.05 : 0.2, easeOutCubic(riseAmt));
        pawn.rotation.y = lerp(0, Math.PI * 2.5, riseAmt);

        // PHASE 3: Camera Dynamics
        const revealAmt = mapRange(p, 0.6, 1.0);
        const autoOrbit = t * 0.12;

        const baseRadius = isMobile ? 15 : 13;
        const targetRadius = isMobile ? 8.0 : 6.5;
        const orbitRadius = lerp(baseRadius, targetRadius, easeOutCubic(revealAmt));
        const orbitHeight = lerp(isMobile ? 10 : 9, isMobile ? 4.0 : 3.2, easeOutCubic(revealAmt));
        const angle = lerp(0, Math.PI * 0.35, revealAmt) + autoOrbit;

        camera.position.set(
          Math.sin(angle) * orbitRadius,
          orbitHeight,
          Math.cos(angle) * orbitRadius
        );
        camera.lookAt(0, lerp(-0.4, isMobile ? 0.2 : 0.5, revealAmt), 0);

        sparkleMat.opacity = lerp(0, 0.95, revealAmt);
        sparkles.rotation.y = t * 0.08;
      }

      if (engineRef.current?.renderer && engineRef.current?.scene) {
        engineRef.current.renderer.render(
          engineRef.current.scene,
          engineRef.current.camera
        );
      }

      frameId = requestAnimationFrame(renderLoop);
    };

    frameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return <div ref={mountRef} className="w-full h-full pointer-events-none" />;
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}
function easeOutBack(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

/* -------------------------------------------------------------------- */
/* Hero Layout & Content                                                */
/* -------------------------------------------------------------------- */

function Hero() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollableHeight = rect.height - window.innerHeight;
      if (totalScrollableHeight <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(
        1,
        Math.max(0, currentScroll / totalScrollableHeight)
      );
      setScrollProgress(progress);
    }

    // Passive listener ensures the scroll thread isn't blocked by React
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const coaches = [
    {
      name: "Sambit Panda",
      title: "International Master",
      rating: "Peak FIDE: 2452",
      desc: "9th International Master from Odisha. National Champion and international tournament veteran.",
      img: sambitImg,
    },
    {
      name: "Nilsu Pattnaik",
      title: "Commonwealth Medalist",
      rating: "FIDE Rated 2200+",
      desc: "Specialist in strategic mastery, deep calculation, and tactical endgame technique.",
      img: nilsuImg,
    },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 pt-10">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <section ref={containerRef} className="relative h-[240vh] sm:h-[260vh] lg:h-[280vh] z-10 ">
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
          <div className="container mx-auto px-4 sm:px-6 h-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center">
            
            <div className="lg:col-span-6 z-20 flex flex-col justify-center space-y-4 sm:space-y-6 pt-16 sm:pt-20 lg:pt-0">
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.15]">
                Train with FIDE Masters &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
                  AI-Driven Syllabus
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                Elevate calculation, opening repertoire, and positional play under direct guidance from international grandmasters.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={bookDemo}
                  className="inline-flex items-center justify-center px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm sm:text-base"
                >
                  Book Free Demo
                  <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-1 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>1-on-1 Live Classes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Personal Roadmap</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Engine Review</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 sm:pt-6 border-t border-slate-800">
                <div>
                  <div className="text-xl sm:text-3xl font-bold text-amber-400">50+</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">FIDE Coaches</div>
                </div>
                <div>
                  <div className="text-xl sm:text-3xl font-bold text-amber-400">100+</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Active Students</div>
                </div>
                <div>
                  <div className="text-xl sm:text-3xl font-bold text-amber-400">98%</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Win Rate</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 h-[40vh] sm:h-[50vh] lg:h-[85vh] relative z-10 w-full">
              <ChessHero3D progress={scrollProgress} />
              
              <div 
                className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 text-[11px] sm:text-xs text-amber-300/80 bg-slate-900/80 border border-amber-500/20 px-3 sm:px-4 py-1.5 rounded-full backdrop-blur-md transition-opacity duration-300 pointer-events-none flex items-center gap-1.5 whitespace-nowrap"
                style={{ opacity: scrollProgress > 0.85 ? 0 : 1 }}
              >
                <span>Scroll to unfold board</span>
                <ChevronDown className="w-3.5 h-3.5 animate-bounce text-amber-400" />
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="relative z-20 bg-slate-900/90 border-t border-slate-800 py-16 sm:py-24 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2 sm:space-y-3">
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              Learn From Certified Champions
            </h2>
            <p className="text-slate-400 text-xs sm:text-base">
              Get mentored directly by international titles and grandmaster-trained coaches.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-10">
            {coaches.map((coach, index) => (
              <div
                key={index}
                className="group relative bg-slate-950/60 rounded-2xl border border-slate-800 p-5 sm:p-6 transition-all duration-300 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/5 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 sm:mb-6 border border-slate-800">
                    <img
                      src={coach.img}
                      alt={coach.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-amber-500/30 flex items-center space-x-1.5">
                      <Award className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-400" />
                      <span className="text-[11px] sm:text-xs font-medium text-amber-200">
                        {coach.rating}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {coach.name}
                  </h3>
                  <p className="text-amber-400 font-medium text-xs sm:text-sm mb-2 sm:mb-3">
                    {coach.title}
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                    {coach.desc}
                  </p>
                </div>

                <button
                  onClick={bookDemo}
                  className="w-full py-2.5 sm:py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-medium hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all text-xs sm:text-sm cursor-pointer"
                >
                  Book Session with {coach.name.split(" ")[0]}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}