(function () {
    function init3DCoverflow(root) {
        var track = root.querySelector('.coverflow-track');
        if (!track) return;

        var cards = Array.from(track.querySelectorAll('.cf-card'));
        var prevBtn = root.querySelector('.cf-prev');
        var nextBtn = root.querySelector('.cf-next');

        if (cards.length === 0) return;

        function updateCoverflow() {
            var trackRect = track.getBoundingClientRect();
            var trackCenter = trackRect.left + trackRect.width / 2;

            var closestCard = null;
            var minDistance = Infinity;

            cards.forEach(function (card) {
                var cardRect = card.getBoundingClientRect();
                var cardCenter = cardRect.left + cardRect.width / 2;
                var distance = Math.abs(trackCenter - cardCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestCard = card;
                }
            });

            cards.forEach(function (card) {
                if (card === closestCard) {
                    card.classList.add('cf-active');
                } else {
                    card.classList.remove('cf-active');
                }
            });
        }

        var isDown = false;
        var startX = 0;
        var scrollLeft = 0;

        track.addEventListener('mousedown', function (e) {
            isDown = true;
            track.classList.add('is-dragging');
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });

        track.addEventListener('mouseleave', function () {
            isDown = false;
            track.classList.remove('is-dragging');
        });

        track.addEventListener('mouseup', function () {
            isDown = false;
            track.classList.remove('is-dragging');
        });

        track.addEventListener('mousemove', function (e) {
            if (!isDown) return;
            e.preventDefault();
            var x = e.pageX - track.offsetLeft;
            var walk = (x - startX) * 1.5;
            track.scrollLeft = scrollLeft - walk;
        });

        track.addEventListener('wheel', function (e) {
            if (e.deltaY !== 0) {
                e.preventDefault();
                track.scrollLeft += e.deltaY * 1.2;
            }
        }, { passive: false });

        function scrollByCard(direction) {
            var cardWidth = cards[0].offsetWidth + 24;
            track.scrollBy({
                left: direction * cardWidth,
                behavior: 'smooth'
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                scrollByCard(-1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                scrollByCard(1);
            });
        }

        track.addEventListener('scroll', updateCoverflow, { passive: true });
        window.addEventListener('resize', updateCoverflow);

        updateCoverflow();
    }

    function initTabs() {
        var tabLinks = document.querySelectorAll('.tab-links');
        var tabContents = document.querySelectorAll('.tab-contents');

        tabLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                var tabName = e.currentTarget.getAttribute('onclick') 
                    ? e.currentTarget.getAttribute('onclick').match(/'([^']+)'/)[1]
                    : null;

                if (!tabName) return;

                tabLinks.forEach(function (tab) {
                    tab.classList.remove('active-link');
                });

                tabContents.forEach(function (content) {
                    content.classList.remove('active-tab');
                });

                e.currentTarget.classList.add('active-link');
                var targetContent = document.getElementById(tabName);
                if (targetContent) {
                    targetContent.classList.add('active-tab');
                }
            });
        });
    }

    function initNavbarScroll() {
        var nav = document.querySelector('nav');
        if (!nav) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > 20) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
        }, { passive: true });
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.coverflow').forEach(init3DCoverflow);
        initTabs();
        initNavbarScroll();
    });
})();