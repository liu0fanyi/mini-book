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
        this.innerHTML = `
<!-- Start extra link above the ToC -->
<!--
                &#x2192; <a class='part-title' href='https://github.com/kg4zow/mdbook-template/'>GitHub Repo</a>
                <hr/>
-->
<!-- End extra link above the ToC -->

<ol class="chapter"><li class="chapter-item expanded affix "><a href="introduction.html">Introduction</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded "><div>rcore</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="rcore/clipboard_1.html">rust-os基础设施</a></li><li class="chapter-item expanded "><a href="rcore/clipboard_2.html">batch批处理</a></li><li class="chapter-item expanded "><a href="rcore/clipboard_3.html">分时多任务</a></li><li class="chapter-item expanded "><a href="rcore/clipboard_4.html">地址空间</a></li><li class="chapter-item expanded "><a href="rcore/clipboard_5.html">进程管理</a></li><li class="chapter-item expanded "><a href="rcore/clipboard_6.html">文件系统</a></li><li class="chapter-item expanded "><a href="rcore/clipboard_7.html">进程间通信</a></li><li class="chapter-item expanded "><a href="rcore/clipboard_8.html">并发</a></li></ol></li><li class="chapter-item expanded "><div>arceos</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="arceos/clipboard_1.html">unikernel</a></li><li class="chapter-item expanded "><a href="arceos/clipboard_2.html">内存管理</a></li><li class="chapter-item expanded "><a href="arceos/clipboard_3.html">多任务</a></li><li class="chapter-item expanded "><a href="arceos/clipboard_4.html">驱动</a></li><li class="chapter-item expanded "><a href="arceos/clipboard_5.html">宏内核</a></li><li class="chapter-item expanded "><a href="arceos/clipboard_6.html">Hypervisor</a></li></ol></li></ol>

<!-- Start version-commit content below ToC (js) -->
                <hr/>
                <div class="part-title">Version</div>
                <div id="commit" class="version-commit-div">
                    <span class="version-commit-hash"><tt>25bcfca-dirty</tt></span><br/>
                    <span class="version-commit-time"><tt>2025-05-04 14:47:56 +0000</tt></span>
                </div>
                <div class="part-title">Generated</div>
                <div id="generated" class="version-commit-div">
                    <span class="version-commit-now"><tt>2025-05-05 04:17:35 +0000</tt></span>
                </div>
<!-- End version-commit content below ToC -->

`;
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
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
