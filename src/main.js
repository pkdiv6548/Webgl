import { gsap } from "gsap";
import { projects } from "./data.js";
import { ProjectScene } from "./scene.js";
import { startIntro, animateProjectChange, initPageMotion } from "./animations.js";
import "./style.css";

const $ = (selector) => document.querySelector(selector);

function bootGallery() {
  const root = $("#webgl-root");
  if (!root) return;

  let activeIndex = 0;
  let scene;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const updateProject = (index, navigateScene = true) => {
    activeIndex = (index + projects.length) % projects.length;
    const project = projects[activeIndex];
    $("#currentIndex").textContent = String(activeIndex + 1).padStart(2, "0");
    $("#totalCount").textContent = String(projects.length).padStart(2, "0");
    $("#projectType").textContent = project.type + " / " + project.year;
    $("#projectTitle").innerHTML = project.name.replace(" ", "<br /><em>") + (project.name.includes(" ") ? "</em>" : "");
    $("#projectDescription").textContent = project.description;
    $("#projectTags").replaceChildren(...project.scope.map((tag) => {
      const span = document.createElement("span");
      span.textContent = tag;
      return span;
    }));
    $("#galleryProgress").querySelectorAll("button").forEach((button, i) => {
      button.classList.toggle("is-active", i === activeIndex);
      button.setAttribute("aria-current", i === activeIndex ? "true" : "false");
    });
    $("#sceneStatus").textContent = "PROJECT " + String(activeIndex + 1).padStart(2, "0") + " / INTERACTIVE 3D";
    if (navigateScene && scene) scene.goTo(activeIndex);
    animateProjectChange();
  };

  projects.forEach((project, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "progress-tick" + (index === 0 ? " is-active" : "");
    button.setAttribute("aria-label", "Show project " + (index + 1) + ": " + project.name);
    button.addEventListener("click", () => updateProject(index));
    $("#galleryProgress").appendChild(button);
  });

  try {
    scene = new ProjectScene(root, (index) => {
      updateProject(index, true);
      openProjectDialog();
    });
  } catch (error) {
    console.error("WebGL scene could not start:", error);
    $("#sceneStatus").textContent = "3D UNAVAILABLE — SHOWING PROJECT INDEX";
    root.classList.add("webgl-failed");
  }

  $("#prevProject").addEventListener("click", () => updateProject(activeIndex - 1));
  $("#nextProject").addEventListener("click", () => updateProject(activeIndex + 1));

  const dialog = $("#projectDialog");
  function openProjectDialog() {
    const project = projects[activeIndex];
    $("#dialogNumber").textContent = String(activeIndex + 1).padStart(2, "0");
    $("#dialogTitle").textContent = project.name;
    $("#dialogDescription").textContent = project.description;
    $("#dialogScope").textContent = project.scope.join(", ");
    $("#dialogYear").textContent = project.year;
    dialog.showModal();
    gsap.fromTo(dialog, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3 });
  }
  $("#openProject").addEventListener("click", openProjectDialog);
  $("#closeDialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  const motionToggle = $("#motionToggle");
  motionToggle.addEventListener("click", () => {
    const enabled = motionToggle.getAttribute("aria-pressed") !== "true";
    motionToggle.setAttribute("aria-pressed", String(enabled));
    motionToggle.innerHTML = '<span class="sound-dot"></span> MOTION ' + (enabled ? "ON" : "OFF");
    scene?.setMotion(enabled && !reducedMotion);
    document.body.classList.toggle("motion-paused", !enabled);
  });
  if (reducedMotion) {
    scene?.setMotion(false);
    motionToggle.setAttribute("aria-pressed", "false");
    motionToggle.innerHTML = '<span class="sound-dot"></span> MOTION OFF';
  }

  let keyLock = false;
  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" && !keyLock) {
      updateProject(activeIndex + 1);
      keyLock = true;
      setTimeout(() => { keyLock = false; }, 100);
    } else if (event.key === "ArrowLeft" && !keyLock) {
      updateProject(activeIndex - 1);
      keyLock = true;
      setTimeout(() => { keyLock = false; }, 100);
    } else if (event.key === "Escape" && dialog.open) {
      dialog.close();
    }
  });

  startIntro();
}

if (document.querySelector("#webgl-root")) bootGallery();
else initPageMotion();

const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  if (link.getAttribute("href") === window.location.pathname.split("/").pop()) link.classList.add("active");
});