(function () {

    // ===== INJECT CSS =====
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --primary: #1a6d38;
            --secondary: #f9a825;
            --dark: #333333;
            --artistic-brown: #8B4513;
            --safari-orange: #FF8C00;
            --nature-green: #228B22;
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .translation-loading {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(255,255,255,0.9); backdrop-filter: blur(10px);
            display: none; flex-direction: column; align-items: center;
            justify-content: center; z-index: 10000; gap: 20px;
        }
        .translation-loading.active { display: flex; }
        .loading-spinner {
            width: 50px; height: 50px;
            border: 4px solid rgba(139,69,19,0.2);
            border-top-color: var(--safari-orange);
            border-radius: 50%; animation: nb-spin 1s linear infinite;
        }
        @keyframes nb-spin { to { transform: rotate(360deg); } }
        .premium-navbar {
            position: fixed; top: 0; width: 100%;
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            z-index: 1000; padding: 15px 0;
            transition: var(--transition);
            border-bottom: 1px solid rgba(139,69,19,0.1);
        }
        .premium-navbar.scrolled {
            padding: 10px 0; background: rgba(255,255,255,0.98);
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .nav-container {
            width: 90%; max-width: 1200px; margin: 0 auto;
            display: flex; justify-content: space-between; align-items: center;
        }
        .nav-logo {
            display: flex; align-items: center; gap: 12px;
            text-decoration: none; color: var(--artistic-brown);
            font-family: 'Cinzel', serif; transition: var(--transition);
        }
        .nav-logo:hover { transform: scale(1.05); color: var(--safari-orange); }
        .nav-logo .logo-img { height: 70px; width: auto; }
        .nav-logo .logo-text { font-weight: 800; font-size: 1.9rem; color: #8B4513; }
        .desktop-nav { display: flex; align-items: center; gap: 30px; }
        .nav-menu { display: flex; list-style: none; gap: 25px; margin: 0; padding: 0; }
        .nav-item { position: relative; }
        .nav-link {
            display: flex; align-items: center; gap: 8px;
            text-decoration: none; color: var(--dark); font-weight: 500;
            padding: 10px 15px; border-radius: 25px;
            transition: var(--transition); font-family: 'Poppins', sans-serif;
        }
        .nav-link:hover, .nav-link.active {
            background: linear-gradient(135deg, var(--safari-orange), var(--secondary));
            color: white; transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(249,168,37,0.3);
        }
        .dropdown-parent { position: relative; }
        .dropdown {
            position: absolute; top: 100%; left: 0;
            background: rgba(255,255,255,0.97); backdrop-filter: blur(20px);
            border-radius: 15px; padding: 15px; min-width: 220px;
            opacity: 0; visibility: hidden; transform: translateY(15px);
            transition: var(--transition);
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            border: 1px solid rgba(139,69,19,0.1);
        }
        .dropdown-parent:hover .dropdown {
            opacity: 1; visibility: visible; transform: translateY(5px);
        }
        .dropdown-item {
            display: flex; align-items: center; gap: 12px;
            padding: 12px 15px; text-decoration: none; color: var(--dark);
            border-radius: 10px; transition: var(--transition); margin-bottom: 5px;
        }
        .dropdown-item:hover {
            background: linear-gradient(135deg, var(--safari-orange), var(--secondary));
            color: white; transform: translateX(5px);
        }
        .mobile-menu-btn {
            display: none !important;
            flex-direction: column; gap: 4px;
            background: none; border: none; cursor: pointer; padding: 8px;
            z-index: 1001;
        }
        .menu-line {
            width: 25px; height: 3px; background: var(--artistic-brown);
            border-radius: 2px; transition: var(--transition); display: block;
        }
        .mobile-menu-btn.active .menu-line:nth-child(1) { transform: rotate(45deg) translate(6px,6px); }
        .mobile-menu-btn.active .menu-line:nth-child(2) { opacity: 0; }
        .mobile-menu-btn.active .menu-line:nth-child(3) { transform: rotate(-45deg) translate(6px,-6px); }
        .sidebar-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); backdrop-filter: blur(5px);
            z-index: 1999; opacity: 0; visibility: hidden; transition: var(--transition);
        }
        .sidebar-overlay.active { opacity: 1; visibility: visible; }
        .premium-sidebar {
            position: fixed; top: 0; right: -400px; width: 320px; height: 100vh;
            background: rgba(255,255,255,0.98); backdrop-filter: blur(20px);
            z-index: 2000; transition: var(--transition);
            box-shadow: -5px 0 30px rgba(0,0,0,0.15);
            display: flex; flex-direction: column;
        }
        .premium-sidebar.active { right: 0; }
        .sidebar-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 25px; border-bottom: 1px solid rgba(139,69,19,0.1); flex-shrink: 0;
        }
        .sidebar-logo {
            display: flex; align-items: center; gap: 10px;
            color: var(--artistic-brown); font-weight: 700;
            font-size: 1.2rem; font-family: 'Cinzel', serif;
        }
        .sidebar-logo-icon { font-size: 1.6rem; color: var(--safari-orange); }
        .close-sidebar {
            background: none; border: none; font-size: 1.5rem;
            color: var(--artistic-brown); cursor: pointer; transition: var(--transition); padding: 5px;
        }
        .close-sidebar:hover { color: var(--safari-orange); transform: rotate(90deg); }
        .sidebar-content { flex: 1; padding: 20px; overflow-y: auto; }
        .sidebar-nav { list-style: none; padding: 0; margin: 0; }
        .sidebar-item { margin-bottom: 8px; }
        .sidebar-link {
            display: flex; align-items: center; gap: 12px;
            padding: 14px 18px; text-decoration: none; color: var(--dark);
            border-radius: 12px; transition: var(--transition); font-weight: 500;
            font-family: 'Poppins', sans-serif; font-size: 0.95rem;
        }
        .sidebar-link:hover, .sidebar-link.active {
            background: linear-gradient(135deg, var(--safari-orange), var(--secondary));
            color: white; transform: translateX(5px);
        }
        .sidebar-dropdown-toggle { justify-content: space-between; }
        .dropdown-arrow { transition: var(--transition); margin-left: auto; }
        .sidebar-dropdown-toggle.active .dropdown-arrow { transform: rotate(180deg); }
        .sidebar-dropdown { max-height: 0; overflow: hidden; transition: var(--transition); margin-left: 15px; }
        .sidebar-dropdown.active { max-height: 500px; }
        .sidebar-footer { padding: 20px; border-top: 1px solid rgba(139,69,19,0.1); flex-shrink: 0; }
        .sidebar-social { display: flex; justify-content: center; gap: 12px; }
        .social-link {
            display: flex; align-items: center; justify-content: center;
            width: 40px; height: 40px;
            background: linear-gradient(135deg, var(--safari-orange), var(--secondary));
            color: white; border-radius: 50%; text-decoration: none; transition: var(--transition);
        }
        .social-link:hover { transform: translateY(-3px) scale(1.1); }
        .mobile-language-selector {
            margin-top: 20px; padding-top: 18px;
            border-top: 1px solid rgba(139,69,19,0.1);
        }
        .mobile-language-selector label {
            display: block; font-weight: 600; color: var(--artistic-brown);
            margin-bottom: 8px; font-family: 'Poppins', sans-serif; font-size: 0.9rem;
        }
        .sidebar-language {
            width: 100%; padding: 10px 14px;
            border: 1px solid rgba(139,69,19,0.2); border-radius: 10px;
            font-family: 'Poppins', sans-serif; font-size: 0.9rem;
            background: white; color: black; cursor: pointer;
        }
        .language-selector { position: relative; margin-left: 15px; }
        .current-language {
            display: flex; align-items: center; gap: 8px; padding: 10px 15px;
            background: rgba(139,69,19,0.07); border: 1px solid rgba(139,69,19,0.2);
            border-radius: 20px; color: var(--dark); cursor: pointer;
            transition: var(--transition); font-weight: 500; font-size: 0.9rem;
            font-family: 'Poppins', sans-serif;
        }
        .current-language:hover { border-color: var(--safari-orange); }
        .language-flag { font-size: 1.1rem; }
        .language-dropdown {
            position: absolute; top: 100%; right: 0;
            background: rgba(255,255,255,0.98); backdrop-filter: blur(20px);
            border-radius: 15px; padding: 12px; min-width: 190px;
            opacity: 0; visibility: hidden; transform: translateY(15px);
            transition: var(--transition);
            border: 1px solid rgba(139,69,19,0.15);
            box-shadow: 0 20px 60px rgba(0,0,0,0.15); z-index: 1001;
        }
        .language-selector:hover .language-dropdown {
            opacity: 1; visibility: visible; transform: translateY(5px);
        }
        .language-option {
            display: flex; align-items: center; gap: 10px;
            padding: 10px 12px; color: var(--dark); text-decoration: none;
            border-radius: 10px; transition: var(--transition);
            margin-bottom: 4px; font-size: 0.88rem; font-family: 'Poppins', sans-serif;
        }
        .language-option:hover, .language-option.active {
            background: linear-gradient(135deg, var(--safari-orange), var(--secondary));
            color: white; transform: translateX(3px);
        }
        .floating-language-btn {
            position: fixed; bottom: 20px; left: 20px;
            z-index: 999; display: none; flex-direction: column; align-items: flex-start;
        }
        .floating-language-main {
            height: 52px; border-radius: 26px;
            background: linear-gradient(135deg, var(--nature-green), var(--primary));
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; box-shadow: 0 6px 20px rgba(0,0,0,0.2);
            transition: var(--transition); border: 3px solid white;
            color: white; font-size: 0.95rem; padding: 0 18px; gap: 8px;
            font-family: 'Poppins', sans-serif;
        }
        .floating-language-main:hover { transform: scale(1.05); }
        .floating-language-main.active {
            background: linear-gradient(135deg, var(--safari-orange), var(--secondary));
        }
        .floating-language-dropdown {
            position: absolute; bottom: 62px; left: 0;
            background: rgba(255,255,255,0.97); backdrop-filter: blur(20px);
            border-radius: 15px; padding: 12px; min-width: 190px;
            opacity: 0; visibility: hidden; transform: translateY(10px);
            transition: var(--transition);
            box-shadow: 0 15px 50px rgba(0,0,0,0.15);
            border: 1px solid rgba(139,69,19,0.1);
        }
        .floating-language-dropdown.active {
            opacity: 1; visibility: visible; transform: translateY(0);
        }
        .floating-language-option {
            display: flex; align-items: center; gap: 10px;
            padding: 10px 12px; text-decoration: none; color: var(--dark);
            border-radius: 10px; transition: var(--transition);
            margin-bottom: 4px; font-size: 0.88rem; font-family: 'Poppins', sans-serif;
        }
        .floating-language-option:hover, .floating-language-option.active {
            background: linear-gradient(135deg, var(--safari-orange), var(--secondary));
            color: white; transform: translateX(4px);
        }
        .floating-button-text { font-size: 0.88rem; font-weight: 600; white-space: nowrap; }

        @media (max-width: 1024px) {
            .desktop-nav { display: none !important; }
            .mobile-menu-btn { display: flex !important; }
            .floating-language-btn { display: flex !important; }
        }
        @media (min-width: 1025px) {
            .mobile-menu-btn { display: none !important; }
            .floating-language-btn { display: none !important; }
            .desktop-nav { display: flex !important; }
        }
        @media (max-width: 480px) {
            .premium-sidebar { width: 290px; }
        }
    `;
    document.head.appendChild(style);

    // ===== INJECT HTML =====
    var placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    placeholder.innerHTML = `
        <div class="translation-loading" id="translationLoading">
            <div class="loading-spinner"></div>
            <p data-i18n="translation.loading">Translating content...</p>
        </div>

        <nav class="premium-navbar" id="premiumNavbar">
            <div class="nav-container">
                <a href="index.html" class="nav-logo">
                    <img src="assets/images/logo.png" alt="MMexy Tanzania Logo" class="logo-img">
                    <span class="logo-text">MMexy</span>
                </a>
                <div class="desktop-nav">
                    <ul class="nav-menu">
                        <li class="nav-item">
                            <a href="index.html" class="nav-link" data-i18n="nav.home">
                                <i class="fas fa-home"></i><span>Home</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="about-us.html" class="nav-link" data-i18n="nav.about">
                                <i class="fas fa-info-circle"></i><span>About</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="contact.html" class="nav-link" data-i18n="nav.contact">
                                <i class="fas fa-envelope"></i><span>Contact Us</span>
                            </a>
                        </li>
                        <li class="nav-item dropdown-parent">
                            <a href="#" class="nav-link">
                                <i class="fas fa-map-marked-alt"></i>
                                <span data-i18n="nav.destinations">Destinations</span>
                                <i class="fas fa-chevron-down" style="font-size:0.8rem;"></i>
                            </a>
                            <div class="dropdown">
                                <a href="mountain-climbing.html" class="dropdown-item"><i class="fas fa-mountain"></i><span data-i18n="nav.mountain_climbing">Mountain Climbing</span></a>
                                <a href="tanzania-safaris.html" class="dropdown-item"><i class="fas fa-binoculars"></i><span data-i18n="nav.safaris">Tanzania Safaris</span></a>
                                <a href="zanzibar-beaches.html" class="dropdown-item"><i class="fas fa-umbrella-beach"></i><span data-i18n="nav.zanzibar">Zanzibar Beaches</span></a>
                                <a href="cultural-tourism.html" class="dropdown-item"><i class="fas fa-music"></i><span data-i18n="nav.cultural">Cultural Tourism</span></a>
                                <a href="waterfall-tourism.html" class="dropdown-item"><i class="fas fa-water"></i><span data-i18n="nav.waterfalls">Waterfall Tourism</span></a>
                                <a href="historical-sites.html" class="dropdown-item"><i class="fas fa-landmark"></i><span data-i18n="nav.historical">Historical Sites</span></a>
                            </div>
                        </li>
                    </ul>
                    <div class="language-selector">
                        <div class="current-language">
                            <span class="language-flag">🇺🇸</span>
                            <span>English</span>
                            <i class="fas fa-chevron-down" style="font-size:0.8rem;"></i>
                        </div>
                        <div class="language-dropdown">
                            <a href="#" class="language-option active" data-lang="en"><span class="language-flag">🇺🇸</span><span>English</span></a>
                            <a href="#" class="language-option" data-lang="sw"><span class="language-flag">🇹🇿</span><span>Kiswahili</span></a>
                            <a href="#" class="language-option" data-lang="fr"><span class="language-flag">🇫🇷</span><span>Français</span></a>
                            <a href="#" class="language-option" data-lang="de"><span class="language-flag">🇩🇪</span><span>Deutsch</span></a>
                            <a href="#" class="language-option" data-lang="es"><span class="language-flag">🇪🇸</span><span>Español</span></a>
                            <a href="#" class="language-option" data-lang="it"><span class="language-flag">🇮🇹</span><span>Italiano</span></a>
                            <a href="#" class="language-option" data-lang="pt"><span class="language-flag">🇵🇹</span><span>Português</span></a>
                            <a href="#" class="language-option" data-lang="ru"><span class="language-flag">🇷🇺</span><span>Русский</span></a>
                            <a href="#" class="language-option" data-lang="zh"><span class="language-flag">🇨🇳</span><span>中文</span></a>
                            <a href="#" class="language-option" data-lang="ja"><span class="language-flag">🇯🇵</span><span>日本語</span></a>
                        </div>
                    </div>
                </div>
                <button class="mobile-menu-btn" id="mobileMenuBtn" type="button">
                    <span class="menu-line"></span>
                    <span class="menu-line"></span>
                    <span class="menu-line"></span>
                </button>
            </div>
        </nav>

        <div class="sidebar-overlay" id="sidebarOverlay"></div>

        <div class="premium-sidebar" id="premiumSidebar">
            <div class="sidebar-header">
                <div class="sidebar-logo">
                    <i class="fas fa-mountain sidebar-logo-icon"></i>
                    <span>MMexy Tanzania</span>
                </div>
                <button class="close-sidebar" id="closeSidebar" type="button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="sidebar-content">
                <ul class="sidebar-nav">
                    <li class="sidebar-item">
                        <a href="index.html" class="sidebar-link">
                            <i class="fas fa-home"></i><span data-i18n="nav.home">Home</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a href="about-us.html" class="sidebar-link">
                            <i class="fas fa-info-circle"></i><span data-i18n="nav.about">About Us</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a href="contact.html" class="sidebar-link">
                            <i class="fas fa-envelope"></i><span data-i18n="nav.contact">Contact Us</span>
                        </a>
                    </li>
                    <li class="sidebar-item">
                        <a href="#" class="sidebar-link sidebar-dropdown-toggle" id="destinationsToggle">
                            <i class="fas fa-map-marked-alt"></i>
                            <span data-i18n="nav.destinations">Destinations</span>
                            <i class="fas fa-chevron-down dropdown-arrow"></i>
                        </a>
                        <div class="sidebar-dropdown" id="destinationsDropdown">
                            <a href="mountain-climbing.html" class="sidebar-link"><i class="fas fa-mountain"></i><span data-i18n="nav.mountain_climbing">Mountain Climbing</span></a>
                            <a href="tanzania-safaris.html" class="sidebar-link"><i class="fas fa-binoculars"></i><span data-i18n="nav.safaris">Tanzania Safaris</span></a>
                            <a href="zanzibar-beaches.html" class="sidebar-link"><i class="fas fa-umbrella-beach"></i><span data-i18n="nav.zanzibar">Zanzibar Beaches</span></a>
                            <a href="cultural-tourism.html" class="sidebar-link"><i class="fas fa-music"></i><span data-i18n="nav.cultural">Cultural Tourism</span></a>
                            <a href="waterfall-tourism.html" class="sidebar-link"><i class="fas fa-water"></i><span data-i18n="nav.waterfalls">Waterfall Tourism</span></a>
                            <a href="historical-sites.html" class="sidebar-link"><i class="fas fa-landmark"></i><span data-i18n="nav.historical">Historical Sites</span></a>
                        </div>
                    </li>
                </ul>
                <div class="mobile-language-selector">
                    <label for="sidebarLanguage">Language:</label>
                    <select class="sidebar-language" id="sidebarLanguage">
                        <option value="en">🇺🇸 English</option>
                        <option value="sw">🇹🇿 Kiswahili</option>
                        <option value="fr">🇫🇷 Français</option>
                        <option value="de">🇩🇪 Deutsch</option>
                        <option value="es">🇪🇸 Español</option>
                        <option value="it">🇮🇹 Italiano</option>
                        <option value="pt">🇵🇹 Português</option>
                        <option value="ru">🇷🇺 Русский</option>
                        <option value="zh">🇨🇳 中文</option>
                        <option value="ja">🇯🇵 日本語</option>
                    </select>
                </div>
            </div>
            <div class="sidebar-footer">
                <div class="sidebar-social">
                    <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
                    <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="social-link"><i class="fab fa-youtube"></i></a>
                </div>
            </div>
        </div>

        <div class="floating-language-btn" id="floatingLanguageBtn">
            <div class="floating-language-dropdown" id="floatingLanguageDropdown">
                <a href="#" class="floating-language-option active" data-lang="en"><span>🇺🇸</span><span>English</span></a>
                <a href="#" class="floating-language-option" data-lang="sw"><span>🇹🇿</span><span>Kiswahili</span></a>
                <a href="#" class="floating-language-option" data-lang="fr"><span>🇫🇷</span><span>Français</span></a>
                <a href="#" class="floating-language-option" data-lang="de"><span>🇩🇪</span><span>Deutsch</span></a>
                <a href="#" class="floating-language-option" data-lang="es"><span>🇪🇸</span><span>Español</span></a>
                <a href="#" class="floating-language-option" data-lang="it"><span>🇮🇹</span><span>Italiano</span></a>
                <a href="#" class="floating-language-option" data-lang="pt"><span>🇵🇹</span><span>Português</span></a>
                <a href="#" class="floating-language-option" data-lang="ru"><span>🇷🇺</span><span>Русский</span></a>
                <a href="#" class="floating-language-option" data-lang="zh"><span>🇨🇳</span><span>中文</span></a>
                <a href="#" class="floating-language-option" data-lang="ja"><span>🇯🇵</span><span>日本語</span></a>
            </div>
            <button class="floating-language-main" id="floatingLanguageMain" type="button">
                <i class="fas fa-language"></i>
                <span class="floating-button-text">Language</span>
            </button>
        </div>
    `;

    // ===== AUTO MARK ACTIVE PAGE =====
    var page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .sidebar-link, .dropdown-item').forEach(function (link) {
        var href = (link.getAttribute('href') || '').split('/').pop();
        if (href && href !== '#' && href === page) {
            link.classList.add('active');
        }
    });

    // ===== SCROLL EFFECT =====
    window.addEventListener('scroll', function () {
        var navbar = document.getElementById('premiumNavbar');
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ===== SIDEBAR FUNCTIONS =====
    function openSidebar() {
        document.getElementById('mobileMenuBtn').classList.add('active');
        document.getElementById('premiumSidebar').classList.add('active');
        document.getElementById('sidebarOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        document.getElementById('mobileMenuBtn').classList.remove('active');
        document.getElementById('premiumSidebar').classList.remove('active');
        document.getElementById('sidebarOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }

    // hamburger button
    document.getElementById('mobileMenuBtn').addEventListener('click', function (e) {
        e.stopPropagation();
        var sidebar = document.getElementById('premiumSidebar');
        if (sidebar.classList.contains('active')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    document.getElementById('closeSidebar').addEventListener('click', closeSidebar);
    document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);

    // destinations dropdown in sidebar
    document.getElementById('destinationsToggle').addEventListener('click', function (e) {
        e.preventDefault();
        this.classList.toggle('active');
        document.getElementById('destinationsDropdown').classList.toggle('active');
    });

    // ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeSidebar();
    });

    // ===== LANGUAGE SELECTORS =====
    // desktop
    document.querySelectorAll('.language-option').forEach(function (opt) {
        opt.addEventListener('click', function (e) {
            e.preventDefault();
            var lang = this.getAttribute('data-lang');
            if (typeof window.changeLanguage === 'function') window.changeLanguage(lang);
        });
    });

    // sidebar select
    document.getElementById('sidebarLanguage').addEventListener('change', function () {
        if (typeof window.changeLanguage === 'function') window.changeLanguage(this.value);
        closeSidebar();
    });

    // floating button
    var floatingMain = document.getElementById('floatingLanguageMain');
    var floatingDropdown = document.getElementById('floatingLanguageDropdown');

    floatingMain.addEventListener('click', function (e) {
        e.stopPropagation();
        floatingMain.classList.toggle('active');
        floatingDropdown.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
        if (!floatingMain.contains(e.target) && !floatingDropdown.contains(e.target)) {
            floatingMain.classList.remove('active');
            floatingDropdown.classList.remove('active');
        }
    });

    document.querySelectorAll('.floating-language-option').forEach(function (opt) {
        opt.addEventListener('click', function (e) {
            e.preventDefault();
            var lang = this.getAttribute('data-lang');
            if (typeof window.changeLanguage === 'function') window.changeLanguage(lang);
            floatingMain.classList.remove('active');
            floatingDropdown.classList.remove('active');
        });
    });

    // ===== INIT SAVED LANGUAGE (after page scripts load) =====
    window.addEventListener('load', function () {
        var saved = localStorage.getItem('preferredLanguage') || 'en';
        if (saved !== 'en' && typeof window.changeLanguage === 'function') {
            window.changeLanguage(saved);
        }
    });

})();