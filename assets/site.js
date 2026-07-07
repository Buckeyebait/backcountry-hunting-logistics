/* Backcountry Hunting Logistics — concept demo interactions */
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
  var els = document.querySelectorAll('.reveal');
  if(noanim || !('IntersectionObserver' in window)){
    els.forEach(function(el){ el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){ io.observe(el); });
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
      var subject = 'Hunt inquiry' + (hunt ? ' — ' + hunt : '') + (name ? ' (' + name + ')' : '');
      var body = 'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + phone +
                 '\nHunt of interest: ' + hunt + '\n\n' + msg + '\n';
      window.location.href = 'mailto:520bhl@gmail.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var note = document.getElementById('formnote');
      if(note){ note.style.display='block'; }
    });
  }
})();
