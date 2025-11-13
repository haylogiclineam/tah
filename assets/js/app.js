(function(){
  document.addEventListener('DOMContentLoaded', ()=>{
    const cur = localStorage.getItem('currentUser');
    const loginBtn = document.querySelector('.login-btn');
    const greeting = document.querySelector('.user-greeting');
    const logoutBtn = document.querySelector('.logout-btn');

    if (cur) {
      try {
        const user = JSON.parse(cur);

        // hide login button
        if (loginBtn) loginBtn.style.display = 'none';

        // show greeting
        if (greeting) {
          greeting.textContent = 'Բարի գալուստ, ' + (user.name || user.email);
          greeting.style.display = 'inline';
        }

        // show logout button
        if (logoutBtn) logoutBtn.style.display = 'inline';

      } catch(e){
        console.error('Error parsing user', e);
      }
    }

    // handle logout click
    if (logoutBtn) {
      logoutBtn.addEventListener('click', ()=>{
        localStorage.removeItem('currentUser');
        location.reload(); // reload page so login button reappears
      });
    }
  });
})();
