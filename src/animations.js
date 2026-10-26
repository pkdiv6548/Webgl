import { gsap } from "gsap";

export function startIntro() {
  const preloader = document.querySelector(".preloader");
  const shell = document.querySelector(".site-shell");
  const intro = document.querySelector(".intro");
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.to(".preloader-mark", { opacity: 1, y: 0, duration: 0.5, startAt: { y: 18 } })
    .to(".preloader-track i", { scaleX: 1, duration: 0.75, ease: "power2.inOut" }, "-=0.2")
    .to(preloader, { autoAlpha: 0, duration: 0.65, delay: 0.15, onComplete: () => preloader?.remove() })
    .fromTo(shell, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, "-=0.2")
    .fromTo(".intro .eyebrow", { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65 }, "-=0.1")
    .fromTo(".intro h1", { y: 35, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.85 }, "-=0.4")
    .fromTo(".intro-copy", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, "-=0.5")
    .fromTo(".showcase", { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, "-=0.35");
}

export function animateProjectChange() {
  gsap.fromTo(".project-meta > *", { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.04, ease: "power2.out", overwrite: true });
}

export function initPageMotion() {
  gsap.fromTo(".subpage-main > *", { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.75, stagger: 0.08, ease: "power3.out" });
  gsap.fromTo(".about-block", { y: 25, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.12, delay: 0.2, ease: "power3.out" });
}