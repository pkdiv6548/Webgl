import "./style.css";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let activeFilter="All",activeQuery="",toastTimer;
function toast(message){const el=$("#toast");if(!el)return;el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),3200)}
function filterTalent(){let count=0;const cards=Array.from(document.querySelectorAll(".talent-card"));cards.forEach(card=>{const category=activeFilter==="All"||card.dataset.category===activeFilter;const query=!activeQuery||(card.dataset.search+" "+card.textContent).toLowerCase().includes(activeQuery.toLowerCase());card.hidden=!(category&&query);if(!card.hidden)count++});const empty=$("#emptyState");if(empty)empty.hidden=count!==0;const result=$("#resultCount");if(result)result.textContent=count+" sample profile"+(count===1?"":"s");Array.from(document.querySelectorAll(".filter-pill")).forEach(b=>{const filter=b.dataset.filter;const n=filter==="All"?cards.length:cards.filter(card=>card.dataset.category===filter).length;const badge=b.querySelector("span");if(badge)badge.textContent=String(n);const on=filter===activeFilter;b.classList.toggle("active",on);b.setAttribute("aria-pressed",String(on))})}
const searchForm=$("#searchForm");if(searchForm){const input=$("#searchInput");const params=new URLSearchParams(location.search);if(input&&params.has("q"))input.value=params.get("q");activeQuery=input?.value.trim()||"";searchForm.addEventListener("submit",e=>{if($("#talentFilters")){e.preventDefault();activeQuery=input.value.trim();activeFilter="All";filterTalent();toast(activeQuery?"Showing results for “"+activeQuery+"”.":"Showing all talent.");}else if(input&&input.value.trim()){e.preventDefault();location.href="talent.html?q="+encodeURIComponent(input.value.trim())}})}
$("#talentFilters")?.addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;activeFilter=b.dataset.filter;activeQuery="";if($("#searchInput"))$("#searchInput").value="";filterTalent()});
$$(".save-btn").forEach(b=>b.addEventListener("click",()=>{const saved=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(saved));b.textContent=saved?"♥":"♡";b.classList.toggle("saved",saved);toast(saved?"Profile saved for this session.":"Profile removed from saved list.")}));
function filterProjects(){const val=$("#projectFilter")?.value||"All";let count=0;Array.from(document.querySelectorAll(".project-list-card")).forEach(card=>{card.hidden=val!=="All"&&card.dataset.category!==val;if(!card.hidden)count++});const empty=$("#projectEmptyState");if(empty)empty.hidden=count!==0}$("#projectFilter")?.addEventListener("change",filterProjects);
const projectData=[["Build a brand identity for a climate startup","Shape a visual system including logo, typography, color and brand guidelines."],["Launch-ready landing page in React","Turn polished design screens into a fast, responsive and accessible marketing website."],["Make complex ideas feel simple","Create onboarding copy, help content and in-product messaging with a product team."],["Build a practical SEO content plan","Audit existing content and map search intent into a 90-day editorial roadmap."],["Refresh a boutique tour operator website","Improve destination pages, itinerary structure and enquiry journeys for a travel company."],["Organize a small team workspace","Set up a project hub, reusable templates and simple status reporting."],["Build a 7-day itinerary and supplier comparison","Research a destination, compare transport and activities, document assumptions and deliver a client-ready itinerary."],["Audit 30 hotel listings and guest information","Check descriptions, amenities, check-in details and cancellation information across accommodation channels."],["Create destination pages for a tour operator","Write five SEO-aware destination landing pages with practical visitor information and clear enquiry calls to action."]];
const pd=$("#projectDialog");$$(".project-details").forEach(b=>b.addEventListener("click",()=>{const d=projectData[Number(b.dataset.project)];if(!d)return;$("#projectDialogTitle").textContent=d[0];$("#projectDialogText").textContent=d[1];pd?.showModal()}));$("#closeProjectDialog")?.addEventListener("click",()=>pd.close());pd?.addEventListener("click",e=>{if(e.target===pd)pd.close()});
$("#menuToggle")?.addEventListener("click",()=>{const nav=$(".main-nav");if(!nav)return;const open=nav.classList.toggle("nav-open");$("#menuToggle").setAttribute("aria-expanded",String(open))});$$(".main-nav a").forEach(a=>a.addEventListener("click",()=>$(".main-nav")?.classList.remove("nav-open")));
function demoForm(id,noteId,message){const f=$(id);f?.addEventListener("submit",e=>{e.preventDefault();const n=$(noteId);if(n)n.textContent=message;toast(message)})}
demoForm("#contactForm","#contactFormNote","Demo only — no enquiry was sent or stored.");
demoForm("#joinForm","#joinNote","Demo only — no account was created or stored.");
demoForm("#loginForm","#loginNote","Demo only — authentication is not connected.");
$$(".talent-card,.category-detail,.category-card,.workflow article,.project-list-card").forEach(el=>{el.classList.add("reveal");if("IntersectionObserver"in window){const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in-view");o.unobserve(e.target)}}),{threshold:.08});o.observe(el)}else el.classList.add("in-view")});

const adminTable=$("#adminRows");
if(adminTable){
 let adminSection="members";
 const rows=Array.from(adminTable.querySelectorAll("tr"));
 const adminTabs=$$(".admin-tab");
 function updateAdminCounts(){
  const pending=rows.filter(row=>row.querySelector(".status-pending")).length;
  const reviewPending=rows.filter(row=>row.dataset.adminSection==="reviews"&&row.querySelector(".status-pending")).length;
  const pendingCount=$("#pendingCount");if(pendingCount)pendingCount.textContent=String(pending);
  const reviewBadge=$("#reviewBadge");if(reviewBadge)reviewBadge.textContent=String(reviewPending);
  adminTabs.forEach(tab=>{const badge=tab.querySelector("span");if(!badge)return;const section=tab.dataset.adminTab;const count=rows.filter(row=>row.dataset.adminSection===section&&(section!=="reviews"||row.querySelector(".status-pending"))).length;badge.textContent=String(count)});
 }
 function filterAdminRows(){
  const query=$("#adminSearch")?.value.trim().toLowerCase()||"";let visible=0;
  rows.forEach(row=>{const section=row.dataset.adminSection===adminSection;const match=!query||((row.dataset.search||"")+" "+row.textContent).toLowerCase().includes(query);row.hidden=!(section&&match);if(!row.hidden)visible++});
  const empty=$("#adminEmpty");if(empty)empty.hidden=visible!==0;
 }
 adminTabs.forEach(tab=>tab.addEventListener("click",()=>{adminSection=tab.dataset.adminTab;adminTabs.forEach(item=>{const active=item===tab;item.classList.toggle("active",active);item.setAttribute("aria-selected",String(active))});filterAdminRows()}));
 $("#adminSearch")?.addEventListener("input",filterAdminRows);
 adminTable.addEventListener("click",e=>{
  const button=e.target.closest("[data-admin-action]");if(!button||button.disabled)return;
  const row=button.closest("tr");const status=row?.querySelector(".status");
  if(status){
   status.className="status status-reviewed";status.textContent="Reviewed";
   row.dataset.search=(row.dataset.search||"")+" reviewed complete";
  }
  button.disabled=true;button.textContent="Reviewed";
  updateAdminCounts();filterAdminRows();
  toast("Demo action completed for this session only. No real record was changed.");
 });
 updateAdminCounts();filterAdminRows();
}

filterTalent();filterProjects();
