/* =====================================================
   Project Detail Page - TOC Generator & Scroll Spy
   ===================================================== */

(function () {
  const content = document.querySelector('.report-content');
  if (!content) return;

  // Collect h2, h3 and h4 headings (skip the Contents title and highlight boxes)
  const headings = Array.from(content.querySelectorAll('h2, h3, h4')).filter(
    (h) => !h.closest('.project-toc') && !h.closest('.section--highlight')
  );
  if (headings.length === 0) return;

  // Ensure each heading has an id
  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = 'section-' + index;
    }
  });

  // ─── A. Inline TOC (Contents section) — h2 > h3 > h4 ───
  const inlineTocList = document.getElementById('project-toc-list');
  if (inlineTocList) {
    headings.forEach((heading) => {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + heading.id;
      a.textContent = heading.textContent;
      li.appendChild(a);

      if (heading.tagName === 'H2') {
        inlineTocList.appendChild(li);
      } else if (heading.tagName === 'H3') {
        var parentLi = inlineTocList.lastElementChild;
        if (parentLi) {
          var subList = parentLi.querySelector(':scope > ol');
          if (!subList) {
            subList = document.createElement('ol');
            parentLi.appendChild(subList);
          }
          subList.appendChild(li);
        }
      } else if (heading.tagName === 'H4') {
        // h4 → nest under last h3's sub-list
        var h2Li = inlineTocList.lastElementChild;
        if (h2Li) {
          var h3List = h2Li.querySelector(':scope > ol');
          if (h3List && h3List.lastElementChild) {
            var h3Li = h3List.lastElementChild;
            var h4List = h3Li.querySelector(':scope > ol');
            if (!h4List) {
              h4List = document.createElement('ol');
              h3Li.appendChild(h4List);
            }
            h4List.appendChild(li);
          }
        }
      }
    });
  }

  // ─── B. Sidebar minimap TOC ───
  const tocList = document.getElementById('toc-list');
  if (!tocList) return;

  headings.forEach((heading) => {
    const li = document.createElement('li');
    li.className = 'report-toc__item';

    const a = document.createElement('a');
    a.className = 'report-toc__link';
    if (heading.tagName === 'H3') {
      a.classList.add('report-toc__link--h3');
    }
    if (heading.tagName === 'H4') {
      a.classList.add('report-toc__link--h4');
    }
    a.href = '#' + heading.id;
    a.textContent = heading.textContent;

    // Smooth scroll
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById(heading.id);
      if (target) {
        var headerOffset = 80;
        var pos = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
        history.pushState(null, null, '#' + heading.id);
      }
    });

    li.appendChild(a);
    tocList.appendChild(li);
  });

  // ─── C. Scroll Spy ───
  var tocLinks = tocList.querySelectorAll('.report-toc__link');

  function updateActiveLink() {
    var scrollPos = window.scrollY + 100;
    var currentIndex = 0;
    headings.forEach(function (heading, index) {
      if (heading.offsetTop <= scrollPos) {
        currentIndex = index;
      }
    });
    tocLinks.forEach(function (link, index) {
      link.classList.toggle('report-toc__link--active', index === currentIndex);
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateActiveLink();
})();

/* =====================================================
   Image Lightbox Modal
   ===================================================== */
(function () {
  // Create lightbox DOM
  var lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML =
    '<button class="lightbox__close">&times;</button>' +
    '<img class="lightbox__image" src="" alt="">' +
    '<div class="lightbox__caption"></div>';
  document.body.appendChild(lightbox);

  var lbImg = lightbox.querySelector('.lightbox__image');
  var lbCaption = lightbox.querySelector('.lightbox__caption');
  var lbClose = lightbox.querySelector('.lightbox__close');

  function openLightbox(src, caption) {
    lbImg.src = src;
    lbCaption.textContent = caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });

  // Intercept all content images (replace window.open with lightbox)
  var content = document.querySelector('.report-content');
  if (!content) return;

  content.addEventListener('click', function (e) {
    var img = e.target.closest('img');
    if (!img) return;

    e.preventDefault();
    e.stopPropagation();

    // Find caption from figcaption or gallery span
    var caption = '';
    var figure = img.closest('figure');
    if (figure) {
      var fc = figure.querySelector('figcaption');
      if (fc) caption = fc.textContent;
    } else {
      var item = img.closest('.project-gallery__item');
      if (item) {
        var sp = item.querySelector('span');
        if (sp) caption = sp.textContent;
      }
    }

    openLightbox(img.src, caption);
    return false;
  });

  // Remove all inline onclick="window.open(...)" from images
  var imgs = content.querySelectorAll('img[onclick]');
  for (var i = 0; i < imgs.length; i++) {
    imgs[i].removeAttribute('onclick');
  }
})();
