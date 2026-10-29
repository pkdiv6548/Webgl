import "./style.css";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
let activeFilter = "All";
let activeQuery = "";
let toastTimer;

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function filterTalent() {
  let visible = 0;
  $$(".talent-card").forEach((card) => {
    const categoryMatch = activeFilter === "All" || card.dataset.category === activeFilter;
    const queryMatch = !activeQuery || (card.dataset.search + " " + card.textContent).toLowerCase().includes(activeQuery.toLowerCase());
    const show = categoryMatch && queryMatch;
    card.hidden = !show;
    if (show) visible++;
  });
  $("#emptyState").hidden = visible !== 0;
  $("#talentGrid").classList.toggle("filtered-grid", activeFilter !== "All" || Boolean(activeQuery));
  $$(".filter-pill").forEach((button) => {
    const active = button.dataset.filter === activeFilter;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function setFilter(filter) {
  activeFilter = filter;
  activeQuery = "";
  $("#searchInput").value = "";
  filterTalent();
  $("#talent").scrollIntoView({ behavior: "smooth", block: "start" });
}

$("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  activeQuery = $("#searchInput").value.trim();
  activeFilter = "All";
  filterTalent();
  $("#talent").scrollIntoView({ behavior: "smooth", block: "start" });
  if (activeQuery) showToast("Showing talent matches for “" + activeQuery + "”.");
});
$$("[data-search]").forEach((button) => button.addEventListener("click", () => {
  $("#searchInput").value = button.dataset.search;
  activeQuery = button.dataset.search;
  activeFilter = "All";
  filterTalent();
  $("#talent").scrollIntoView({ behavior: "smooth", block: "start" });
}));
$("#talentFilters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  activeQuery = "";
  $("#searchInput").value = "";
  filterTalent();
});
$("#clearFilters").addEventListener("click", () => setFilter("All"));
$$(".category-card").forEach((button) => button.addEventListener("click", () => setFilter(button.dataset.category)));

$$(".save-btn").forEach((button) => button.addEventListener("click", () => {
  const saved = button.getAttribute("aria-pressed") !== "true";
  button.setAttribute("aria-pressed", String(saved));
  button.textContent = saved ? "♥" : "♡";
  button.classList.toggle("saved", saved);
  showToast(saved ? "Profile saved for this session." : "Profile removed from saved list.");
}));

const dialog = $("#actionDialog");
function openDialog(kind) {
  const copy = {
    join: ["Find your people.", "Choose how you'd like to use Freelance and start exploring the possibilities."],
    login: ["Welcome back.", "The sign-in flow is a placeholder in this frontend-only demo."],
    post: ["Share your next project.", "Project publishing is not connected yet. This demo shows where the flow will begin."],
    hire: ["Find your next collaborator.", "Tell us a little about your needs to preview the hiring journey."]
  };
  const [heading, description] = copy[kind] || copy.join;
  $("#dialogHeading").textContent = heading;
  $("#dialogText").textContent = description;
  $("#demoRole").value = kind === "hire" || kind === "post" ? "Hire independent talent" : "Find freelance work";
  $("#formNote").textContent = "Demo only — nothing will be sent or saved.";
  $("#demoForm").hidden = kind === "post";
  if (typeof dialog.showModal === "function") dialog.showModal();
  else showToast(description);
}
$("#joinBtn").addEventListener("click", () => openDialog("join"));
$("#ctaJoin").addEventListener("click", () => openDialog("join"));
$("#loginBtn").addEventListener("click", () => openDialog("login"));
$("#postProjectBtn").addEventListener("click", () => openDialog("post"));
$("#ctaHire").addEventListener("click", () => openDialog("hire"));
$("#browseTalent").addEventListener("click", () => { setFilter("All"); showToast("Explore the profiles and filter by skill."); });
$("#allCategories").addEventListener("click", () => showToast("More skill categories can be added as the marketplace expands."));
$("#viewProjects").addEventListener("click", () => showToast("These are sample project listings. A live project board needs a backend."));
$$(".job-action").forEach((button) => button.addEventListener("click", () => openDialog("post")));
$("#closeAction").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
$("#demoForm").addEventListener("submit", (event) => {
  event.preventDefault();
  $("#formNote").textContent = "Thanks! This demo does not send or store your information.";
  showToast("Demo form checked — no information was submitted.");
});

$("#menuToggle").addEventListener("click", () => {
  const nav = $(".main-nav");
  const open = nav.classList.toggle("nav-open");
  $("#menuToggle").setAttribute("aria-expanded", String(open));
});
$$(".main-nav a").forEach((link) => link.addEventListener("click", () => $(".main-nav").classList.remove("nav-open")));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$(".talent-card, .category-card, .steps article, .job-card").forEach((item) => {
  item.classList.add("reveal");
  revealObserver.observe(item);
});

filterTalent();
