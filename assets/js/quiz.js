(function(){
    const quizForm = document.getElementById('quizForm');
    const resultBox = document.getElementById('resultBox');
    const progressBar = document.querySelector('.progress-bar');
    const certBtn = document.getElementById('certificateBtn');

    quizForm.addEventListener('change', ()=>{
      const total = quizForm.querySelectorAll('.question').length;
      const answered = quizForm.querySelectorAll('input:checked').length;
      progressBar.style.width = ((answered/total)*100) + '%';
    });

    quizForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      let score = 0;
      const answers = { q1: 'b', q2: 'c', q3: 'b' };
      for (let key in answers) {
        const userAns = quizForm.elements[key].value;
        if (userAns === answers[key]) score++;
      }

      const cur = localStorage.getItem('currentUser');
      let userName = 'User';
      if (cur) {
        try {
          const user = JSON.parse(cur);
          userName = user.name || user.email || 'User';
        } catch {}
      }

      resultBox.style.display = 'block';
      if (score >= 2) {
        resultBox.textContent = `Շնորհավորում ենք, ${userName}! Դուք հավաքեցիք ${score}/3 և հաջողությամբ անցաք թեստը։`;
        certBtn.style.display = 'inline-block';
      } else {
        resultBox.textContent = `Դուք հավաքեցիք ${score}/3 միավոր։ Փորձեք կրկին։`;
      }

      quizForm.querySelector('button').disabled = true;
    });

    // certificate generation (ENGLISH VERSION)
    certBtn.addEventListener('click', ()=>{
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      const cur = localStorage.getItem('currentUser');
      let userName = 'User';
      if (cur) {
        try {
          const user = JSON.parse(cur);
          userName = user.name || user.email || 'User';
        } catch {}
      }

      doc.setFontSize(22);
      doc.text("Certificate of Completion", 60, 40);
      doc.setFontSize(16);
      doc.text(`This certifies that`, 85, 60);
      doc.setFontSize(18);
      doc.text(userName, 85, 75);
      doc.setFontSize(14);
      doc.text("has successfully completed the", 70, 90);
      doc.text("‘Cybersecurity Fundamentals’ Quiz.", 60, 105);
      doc.setFontSize(12);
      doc.text(`Date of Completion: ${new Date().toLocaleDateString('en-GB')}`, 60, 125);
      doc.text("Issued by: HayLogic Line", 60, 140);
      doc.text("www.hl.am", 60, 155);

      doc.save(`Certificate_${userName}.pdf`);
    });
})();