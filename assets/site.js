/* Backcountry Hunting Logistics - concept demo interactions */
(function(){
  // mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var links  = document.getElementById('navlinks');
  if(toggle && links){
    toggle.addEventListener('click', function(){
      var open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded','false');
      });
    });
  }

  // current year
  document.querySelectorAll('[data-year]').forEach(function(el){
    el.textContent = new Date().getFullYear();
  });

  // scroll reveal (respects ?noanim + reduced motion)
  var noanim = /[?&]noanim/.test(location.search) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // stagger reveals that share a grid row
  document.querySelectorAll('.grid').forEach(function(g){
    var i = 0;
    Array.prototype.forEach.call(g.children, function(c){
      if(c.classList.contains('reveal')){
        c.style.transitionDelay = (i * 90) + 'ms'; i++;
      }
    });
  });

  var els = document.querySelectorAll('.reveal');
  if(noanim || !('IntersectionObserver' in window)){
    els.forEach(function(el){ el.classList.add('is-in'); el.style.transitionDelay = '0ms'; });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){ io.observe(el); });
  }

  // stat counters: <span data-count="12" data-suffix="+">
  var counters = document.querySelectorAll('[data-count]');
  function runCounter(el){
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var t0 = null, dur = 1300;
    function step(ts){
      if(!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if(counters.length){
    if(noanim || !('IntersectionObserver' in window)){
      counters.forEach(function(el){
        el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
      });
    } else {
      var cio = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){ runCounter(e.target); cio.unobserve(e.target); }
        });
      }, {threshold:0.5});
      counters.forEach(function(el){ cio.observe(el); });
    }
  }

  // contact form -> compose a real email to the outfitter (demo: no backend)
  var form = document.getElementById('bookform');
  if(form){
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      var f = ev.target;
      var name = (f.name_ && f.name_.value || '').trim();
      var email = (f.email && f.email.value || '').trim();
      var phone = (f.phone && f.phone.value || '').trim();
      var hunt = (f.hunt && f.hunt.value || '').trim();
      var msg  = (f.message && f.message.value || '').trim();
      var subject = 'Hunt inquiry' + (hunt ? ': ' + hunt : '') + (name ? ' (' + name + ')' : '');
      var body = 'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + phone +
                 '\nHunt of interest: ' + hunt + '\n\n' + msg + '\n';
      window.location.href = 'mailto:520bhl@gmail.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var note = document.getElementById('formnote');
      if(note){ note.style.display='block'; }
    });
  }

  // FAQ accordion: <div class="faq"><button class="faq-q">…</button><div class="faq-a">…</div></div>
  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click', function(){
      var item = q.parentElement;
      var wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item.open').forEach(function(o){ o.classList.remove('open'); });
      if(!wasOpen) item.classList.add('open');
    });
  });

  // gallery lightbox
  var figs = document.querySelectorAll('.gallery figure');
  if(figs.length){
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = '<button class="lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-prev" aria-label="Previous">&lsaquo;</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button class="lb-next" aria-label="Next">&rsaquo;</button>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img'), lbCap = lb.querySelector('figcaption'), cur = 0;
    function show(i){
      cur = (i + figs.length) % figs.length;
      var f = figs[cur], im = f.querySelector('img'), cap = f.querySelector('figcaption');
      lbImg.src = im.src; lbImg.alt = im.alt || '';
      var capParts = cap ? Array.prototype.map.call(cap.children, function(c){ return c.textContent.trim(); }).filter(Boolean) : [];
      lbCap.textContent = capParts.length ? capParts.join(' · ') : (cap ? cap.textContent.trim() : '');
      lb.classList.add('open'); document.body.style.overflow = 'hidden';
    }
    function hide(){ lb.classList.remove('open'); document.body.style.overflow = ''; }
    figs.forEach(function(f, i){
      f.style.cursor = 'zoom-in';
      f.addEventListener('click', function(){ show(i); });
    });
    lb.querySelector('.lb-close').addEventListener('click', hide);
    lb.querySelector('.lb-prev').addEventListener('click', function(e){ e.stopPropagation(); show(cur - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function(e){ e.stopPropagation(); show(cur + 1); });
    lb.addEventListener('click', function(e){ if(e.target === lb) hide(); });
    document.addEventListener('keydown', function(e){
      if(!lb.classList.contains('open')) return;
      if(e.key === 'Escape') hide();
      if(e.key === 'ArrowLeft') show(cur - 1);
      if(e.key === 'ArrowRight') show(cur + 1);
    });
  }
})();
