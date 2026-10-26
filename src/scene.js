import * as THREE from "three";
import { projects } from "./data.js";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export class ProjectScene {
  constructor(root, onSelect) {
    this.root = root;
    this.onSelect = onSelect;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#100d19");
    this.scene.fog = new THREE.FogExp2("#100d19", 0.045);
    this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    this.camera.position.set(0, 1.25, 12.7);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.root.appendChild(this.renderer.domElement);
    this.cards = [];
    this.rotation = 0;
    this.targetRotation = 0;
    this.dragging = false;
    this.pointerX = 0;
    this.pointerY = 0;
    this.lastX = 0;
    this.velocity = 0;
    this.motionEnabled = true;
    this.clock = new THREE.Clock();
    this.createLights();
    this.createRoom();
    this.createCards();
    this.resize();
    this.bind();
    this.animate();
  }

  createLights() {
    this.scene.add(new THREE.AmbientLight("#b8a6ff", 1.5));
    const key = new THREE.PointLight("#9b75ff", 55, 34);
    key.position.set(-5, 4, 5);
    this.scene.add(key);
    const rim = new THREE.PointLight("#5d4ab3", 42, 30);
    rim.position.set(5, 2, -4);
    this.scene.add(rim);
    const top = new THREE.PointLight("#d8caff", 28, 25);
    top.position.set(0, 8, 0);
    this.scene.add(top);
  }

  createRoom() {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 90),
      new THREE.MeshStandardMaterial({ color: "#171321", roughness: 0.35, metalness: 0.32 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.65;
    this.scene.add(floor);

    const grid = new THREE.GridHelper(70, 56, "#574879", "#2b2438");
    grid.position.y = -2.62;
    grid.material.transparent = true;
    grid.material.opacity = 0.28;
    this.scene.add(grid);

    const ceiling = new THREE.GridHelper(70, 48, "#413456", "#2b2438");
    ceiling.position.y = 7.5;
    ceiling.material.transparent = true;
    ceiling.material.opacity = 0.15;
    this.scene.add(ceiling);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(5.6, 0.012, 6, 120),
      new THREE.MeshBasicMaterial({ color: "#8065c9", transparent: true, opacity: 0.6 })
    );
    ring.position.y = -2.58;
    ring.rotation.x = Math.PI / 2;
    this.scene.add(ring);
  }

  makeCardTexture(project, index) {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 820;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 640, 820);
    gradient.addColorStop(0, project.color);
    gradient.addColorStop(1, project.accent);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 640, 820);

    ctx.globalAlpha = 0.16;
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.arc(320 + Math.cos(i * 0.8) * 100, 340 + Math.sin(i * 0.8) * 120, 95 + i * 30, 0, Math.PI * 2);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    ctx.strokeStyle = "rgba(255,255,255,.42)";
    ctx.lineWidth = 2;
    ctx.strokeRect(26, 26, 588, 768);

    ctx.fillStyle = "rgba(16,13,25,.9)";
    ctx.font = "500 20px monospace";
    ctx.fillText("FORM®  /  SELECTED WORK", 42, 62);
    ctx.fillText(String(index + 1).padStart(2, "0") + " — " + project.year, 42, 98);

    ctx.save();
    ctx.translate(320, 390);
    ctx.rotate(-0.11);
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,.88)";
    ctx.font = "800 74px Arial, sans-serif";
    const label = project.short.split(" ");
    label.forEach((word, i) => ctx.fillText(word, 0, (i - (label.length - 1) / 2) * 78));
    ctx.restore();

    ctx.fillStyle = "rgba(16,13,25,.86)";
    ctx.font = "500 18px monospace";
    ctx.fillText(project.type, 42, 740);
    ctx.fillText("CONCEPT / DIGITAL", 42, 770);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(this.renderer.capabilities.getMaxAnisotropy(), 4);
    return texture;
  }

  createCards() {
    const radius = window.innerWidth < 700 ? 5.8 : 7.25;
    projects.forEach((project, index) => {
      const group = new THREE.Group();
      const texture = this.makeCardTexture(project, index);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.48,
        metalness: 0.08,
        side: THREE.DoubleSide
      });
      const card = new THREE.Mesh(new THREE.PlaneGeometry(2.52, 3.52), material);
      card.position.z = 0.035;
      group.add(card);

      const backing = new THREE.Mesh(
        new THREE.BoxGeometry(2.58, 3.58, 0.09),
        new THREE.MeshStandardMaterial({ color: "#211a31", roughness: 0.32, metalness: 0.18 })
      );
      group.add(backing);

      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(2.61, 3.61, 0.1)),
        new THREE.LineBasicMaterial({ color: "#b39aff", transparent: true, opacity: 0.72 })
      );
      group.add(edge);

      const angle = (index / projects.length) * Math.PI * 2;
      group.position.set(Math.sin(angle) * radius, 0.05 + Math.sin(angle * 2) * 0.16, -Math.cos(angle) * radius);
      group.rotation.y = angle;
      group.userData = { index, angle, project };
      this.scene.add(group);
      this.cards.push(group);
    });
  }

  bind() {
    this.onPointerDown = (event) => {
      this.dragging = true;
      this.pointerX = event.clientX;
      this.lastX = event.clientX;
      this.velocity = 0;
      this.root.classList.add("is-dragging");
      this.renderer.domElement.setPointerCapture?.(event.pointerId);
    };
    this.onPointerMove = (event) => {
      const rect = this.root.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(rect.width, 1) * 2 - 1;
      const y = (event.clientY - rect.top) / Math.max(rect.height, 1) * 2 - 1;
      this.pointerX = x;
      this.pointerY = y;
      if (this.dragging) {
        const delta = event.clientX - this.lastX;
        this.targetRotation += delta * 0.0048;
        this.velocity = delta * 0.0009;
        this.lastX = event.clientX;
      }
    };
    this.onPointerUp = () => {
      this.dragging = false;
      this.root.classList.remove("is-dragging");
    };
    this.onWheel = (event) => {
      if (Math.abs(event.deltaY) > 0) this.targetRotation += Math.sign(event.deltaY) * 0.16;
    };
    this.onClick = (event) => {
      if (this.dragging) return;
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const hits = this.raycaster.intersectObjects(this.cards, true);
      if (hits.length) {
        let parent = hits[0].object;
        while (parent && parent.userData.index === undefined) parent = parent.parent;
        if (parent?.userData.index !== undefined) this.onSelect(parent.userData.index);
      }
    };
    this.root.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    this.root.addEventListener("wheel", this.onWheel, { passive: true });
    this.renderer.domElement.addEventListener("click", this.onClick);
    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.onResize = () => this.resize();
    window.addEventListener("resize", this.onResize);
  }

  goTo(index) {
    const angle = (index / projects.length) * Math.PI * 2;
    this.targetRotation = -angle;
  }

  setMotion(enabled) {
    this.motionEnabled = enabled;
  }

  resize() {
    if (!this.renderer) return;
    const width = Math.max(this.root.clientWidth, 1);
    const height = Math.max(this.root.clientHeight, 1);
    this.camera.aspect = width / height;
    this.camera.fov = width < 600 ? 43 : 34;
    this.camera.position.z = width < 600 ? 15.8 : 12.7;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 600 ? 1.25 : 1.7));
  }

  animate() {
    this.frame = requestAnimationFrame(() => this.animate());
    const elapsed = this.clock.getElapsedTime();
    if (this.motionEnabled && !this.dragging) {
      this.targetRotation += this.velocity;
      this.velocity *= 0.92;
    }
    this.rotation += (this.targetRotation - this.rotation) * 0.055;
    this.cards.forEach((group, index) => {
      const angle = group.userData.angle + this.rotation;
      const radius = window.innerWidth < 700 ? 5.8 : 7.25;
      group.position.x = Math.sin(angle) * radius;
      group.position.z = -Math.cos(angle) * radius;
      group.position.y = 0.08 + Math.sin(elapsed * 0.45 + index * 0.6) * (this.motionEnabled ? 0.12 : 0.025);
      group.rotation.y = angle;
      group.rotation.x = Math.sin(elapsed * 0.35 + index) * (this.motionEnabled ? 0.025 : 0);
      const frontness = clamp((group.position.z + radius) / (radius * 2), 0.45, 1);
      group.scale.setScalar(0.88 + frontness * 0.12);
    });
    this.camera.position.x += (this.pointerX * 0.22 - this.camera.position.x) * 0.025;
    this.camera.position.y += ((1.25 - this.pointerY * 0.12) - this.camera.position.y) * 0.025;
    this.camera.lookAt(0, 0, 0);
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    cancelAnimationFrame(this.frame);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    this.root.removeEventListener("pointerdown", this.onPointerDown);
    this.root.removeEventListener("wheel", this.onWheel);
    this.renderer.domElement.removeEventListener("click", this.onClick);
    this.renderer.dispose();
    this.cards.forEach((card) => {
      card.traverse((object) => {
        object.geometry?.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => { material.map?.dispose(); material.dispose(); });
        }
      });
    });
  }
}