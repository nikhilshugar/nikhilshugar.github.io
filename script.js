document.getElementById("year").textContent = String(new Date().getFullYear());

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var header = document.querySelector(".site-header");
var pageSections = Array.prototype.slice.call(document.querySelectorAll("main > section"));
var rail = document.querySelector(".section-rail");
var railLinks = Array.prototype.slice.call(document.querySelectorAll(".rail-link"));
var railFrame = null;

function updateSectionRail() {
  railFrame = null;
  var headerHeight = header.offsetHeight;
  var marker = window.scrollY + headerHeight + (window.innerHeight - headerHeight) * 0.36;
  var activeSection = pageSections[0];

  pageSections.forEach(function (section) {
    if (section.offsetTop <= marker) activeSection = section;
  });

  // At the very bottom of the page, the last section is always the active one
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    activeSection = pageSections[pageSections.length - 1];
  }

  railLinks.forEach(function (link) {
    var isActive = link.dataset.section === activeSection.id;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });

  var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  var progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
  rail.style.setProperty("--rail-progress", progress.toFixed(4));
}

function queueRailUpdate() {
  if (railFrame === null) railFrame = window.requestAnimationFrame(updateSectionRail);
}

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

var reveals = document.querySelectorAll(".reveal");
if (reduceMotion || !("IntersectionObserver" in window)) {
  reveals.forEach(function (item) { item.classList.add("is-visible"); });
} else {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: "0px 0px -5% 0px" });

  reveals.forEach(function (item) { observer.observe(item); });
}

var copyButton = document.querySelector(".copy-email");
var copyStatus = document.querySelector(".copy-status");
var copyTimer = null;

function showCopyStatus(text) {
  copyStatus.textContent = text;
  window.clearTimeout(copyTimer);
  copyTimer = window.setTimeout(function () { copyStatus.textContent = ""; }, 2400);
}

copyButton.addEventListener("click", function () {
  var email = copyButton.dataset.email;
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(email).then(function () {
      showCopyStatus("Copied");
    }, function () {
      showCopyStatus("Couldn’t copy. Select the address instead.");
    });
  } else {
    var field = document.createElement("textarea");
    field.value = email;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(field);
    showCopyStatus(ok ? "Copied" : "Couldn’t copy. Select the address instead.");
  }
});
