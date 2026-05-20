// Alpinejs components script
// 全局状态
document.addEventListener('alpine:init', () => {
    Alpine.store('somnia', {
        theme: localStorage.getItem('theme') || 'system',
        isDark: document.documentElement.classList.contains('dark'),
        menuOpen: false,
        swupReady: false,
        init() {
            // 监听系统主题变化
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (Alpine.store('somnia').theme === 'system') {
                    document.documentElement.classList.toggle('dark', e.matches);
                    Alpine.store('somnia').isDark = e.matches;
                    // Mermaid 重新渲染（如果已加载）
                    if (window.somnia && window.somnia.libs.mermaid.ok()) {
                        window.somnia.libs.mermaid.run();
                    }
                }
            });
        },
    });
})

// 处理页面数据 负责动态加载 js 等
function somniaData() {
    return {
        init() {
            const data = this.$el.dataset.somnia;
            if (data.trim() !== "[]") {
                console.log("[Somnia] [Data]", data.trim());
            }
            if (data.includes("katex")) {
                somnia.libs.katex.run(document.getElementById("content-wrapper"));
            }
            if (data.includes("home")) {
                document.body.classList.add("lg:is-home");
            } else {
                document.body.classList.remove("lg:is-home");
            }
        }
    }
}

Somnia.prototype.axd = {};
const axd = Somnia.prototype.axd;

// App 组件 Apline.js x-data
Somnia.prototype.axd.hi = function () {
    return {
        init() { console.log("[Somnia] [Hi]"); }
    }
}


Somnia.prototype.axd.theme = function () {
    return {
        isHovered: false,
        init() {
            // 已经内联防闪烁
            this.setTheme(Alpine.store('somnia').theme);
        },
        toggle() {
            // 循环切换
            const themes = ['system', 'light', 'dark'];
            const currentIndex = themes.indexOf(Alpine.store('somnia').theme);
            const newTheme = themes[(currentIndex + 1) % themes.length];

            this.setTheme(newTheme);
        },
        setTheme(newTheme) {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            // 保存
            localStorage.setItem('theme', newTheme);
            // 设置 HTML
            if (newTheme === 'dark' || (newTheme === 'system' && systemTheme === 'dark')) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            document.documentElement.setAttribute('data-theme', newTheme);

            Alpine.store('somnia').theme = newTheme;
            Alpine.store('somnia').isDark = document.documentElement.classList.contains('dark');

            // Mermaid 重新渲染（如果已加载）
            if (window.somnia && window.somnia.libs.mermaid.ok()) {
                window.somnia.libs.mermaid.run();
            }
        }
    }
}


Somnia.prototype.axd.search = function () {
    return {
        init() {
            this.$watch('keyword', (value) => {
                this.doSearch();
            });
        },
        planelOpen: false,
        keyword: "",
        results: [],
        searchInit() {
            somnia.libs.pagefind.load();
        },
        async doSearch() {
            this.results = await somnia.libs.pagefind.run(this.keyword);
        },
        seachBtnClick() {
            this.planelOpen = !this.planelOpen;
            this.searchInit();
            this.$nextTick(() => {
                this.$refs['search-mobile']?.focus();
            });
        }
    }
}

Somnia.prototype.axd.backToTop = function () {
    return {
        hide: true,
        onScroll() {
            const bannerHeight = window.innerHeight * (BANNER_HEIGHT / 100);
            if (document.body.scrollTop > bannerHeight || document.documentElement.scrollTop > bannerHeight) {
                this.hide = false;
            } else {
                this.hide = true;
            }
        }
    }
}
