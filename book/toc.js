// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="notes/notes.html">Notes</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="notes/new-philosopher.html">New Philosopher</a></li><li class="chapter-item expanded "><a href="notes/lessons-learned.html">Lessons Learned</a></li><li class="chapter-item expanded "><a href="notes/api-adapter-pattern.html">API Adapter Pattern</a></li><li class="chapter-item expanded "><a href="notes/hybrid-serverless-traditional.html">Hybrid Serverless Traditional</a></li><li class="chapter-item expanded "><a href="notes/typesafe-manifesto.html">Typesafe Manifesto</a></li><li class="chapter-item expanded "><a href="notes/ideas-vs-execution.html">Ideas vs Execution</a></li><li class="chapter-item expanded "><a href="notes/on-character.html">On Character</a></li><li class="chapter-item expanded "><a href="notes/more.html">More</a></li></ol></li><li class="chapter-item expanded "><a href="custom/notes.html">Custom</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="custom/api.html">API</a></li><li class="chapter-item expanded "><a href="custom/frontend.html">Frontend</a></li><li class="chapter-item expanded "><a href="custom/styling.html">Styling</a></li><li class="chapter-item expanded "><a href="custom/backend.html">Backend</a></li><li class="chapter-item expanded "><a href="custom/data.html">Data</a></li><li class="chapter-item expanded "><a href="custom/platform.html">Platform</a></li><li class="chapter-item expanded "><a href="custom/release.html">Release</a></li><li class="chapter-item expanded "><a href="custom/operations.html">Operations</a></li><li class="chapter-item expanded "><a href="custom/languages.html">Languages</a></li><li class="chapter-item expanded "><a href="custom/execution.html">Execution</a></li><li class="chapter-item expanded "><a href="custom/more.html">More</a></li></ol></li><li class="chapter-item expanded "><a href="about.html">About</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
