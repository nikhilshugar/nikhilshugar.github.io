document.getElementById("year").textContent = String(new Date().getFullYear());

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var reveals = document.querySelectorAll(".reveal");
var pageSections = Array.prototype.slice.call(document.querySelectorAll("main > section"));
var rail = document.querySelector(".section-rail");
var railLinks = Array.prototype.slice.call(document.querySelectorAll(".rail-link"));
var railFrame = null;

function updateSectionRail() {
  railFrame = null;
  var headerHeight = document.querySelector(".site-header").offsetHeight;
  var marker = window.scrollY + headerHeight + (window.innerHeight - headerHeight) * 0.36;
  var activeSection = pageSections[0];

  pageSections.forEach(function (section) {
    if (section.offsetTop <= marker) activeSection = section;
  });

  railLinks.forEach(function (link) {
    var isActive = link.dataset.section === activeSection.id;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });

  var activeIndex = pageSections.indexOf(activeSection);
  var sectionPosition = activeIndex;
  var nextSection = pageSections[activeIndex + 1];
  if (nextSection) {
    var sectionSpan = nextSection.offsetTop - activeSection.offsetTop;
    var sectionOffset = window.scrollY + headerHeight - activeSection.offsetTop;
    sectionPosition += Math.min(1, Math.max(0, sectionOffset / sectionSpan));
  }
  var progress = pageSections.length > 1 ? sectionPosition / (pageSections.length - 1) : 0;
  rail.style.setProperty("--rail-progress", progress.toFixed(4));
}

function queueRailUpdate() {
  if (railFrame === null) railFrame = window.requestAnimationFrame(updateSectionRail);
}

var fullPageWheel = window.matchMedia("(min-width: 881px) and (min-height: 720px) and (pointer: fine)");
var wheelLocked = false;
var wheelUnlockTimer = null;

function nearestSectionIndex() {
  var headerHeight = document.querySelector(".site-header").offsetHeight;
  var marker = window.scrollY + headerHeight + 8;
  var nearestIndex = 0;
  var nearestDistance = Infinity;

  pageSections.forEach(function (section, index) {
    var distance = Math.abs(section.offsetTop - marker);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  return nearestIndex;
}

window.addEventListener("wheel", function (event) {
  if (!fullPageWheel.matches || event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX) || Math.abs(event.deltaY) < 8) return;

  event.preventDefault();

  if (wheelLocked) {
    window.clearTimeout(wheelUnlockTimer);
    wheelUnlockTimer = window.setTimeout(function () { wheelLocked = false; }, 240);
    return;
  }

  var currentIndex = nearestSectionIndex();
  var nextIndex = Math.max(0, Math.min(pageSections.length - 1, currentIndex + (event.deltaY > 0 ? 1 : -1)));
  if (nextIndex === currentIndex) return;

  wheelLocked = true;
  var headerHeight = document.querySelector(".site-header").offsetHeight;
  var targetTop = Math.max(0, pageSections[nextIndex].offsetTop - headerHeight);
  window.scrollTo({ top: targetTop, behavior: reduceMotion ? "auto" : "smooth" });
  wheelUnlockTimer = window.setTimeout(function () { wheelLocked = false; }, 720);
}, { passive: false });

window.addEventListener("scroll", queueRailUpdate, { passive: true });
window.addEventListener("resize", queueRailUpdate);
updateSectionRail();

var contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var formData = new FormData(contactForm);
  var senderName = String(formData.get("name") || "");
  var senderEmail = String(formData.get("email") || "");
  var subject = String(formData.get("subject") || "Portfolio inquiry");
  var message = String(formData.get("message") || "");
  var body = "Hi Nikhil,\n\n" + message + "\n\nFrom: " + senderName + " (" + senderEmail + ")";
  window.location.href = "mailto:nikhilhugar45@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
});

if (reduceMotion || !("IntersectionObserver" in window)) {
  reveals.forEach(function (item) {
    item.classList.add("is-visible");
    item.classList.add("is-settled");
  });
} else {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        window.setTimeout(function () {
          entry.target.classList.add("is-settled");
        }, 760);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: "0px 0px -5% 0px" });

  reveals.forEach(function (item) { observer.observe(item); });
}
