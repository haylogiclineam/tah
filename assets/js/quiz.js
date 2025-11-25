(function () {
    const quizForm = document.getElementById('quizForm');
    const resultBox = document.getElementById('resultBox');
    const progressBar = document.querySelector('.progress-bar');
    const certBtn = document.getElementById('certificateBtn');
  
    // 1. Получаем параметры module и test из URL
    const params = new URLSearchParams(window.location.search);
    const moduleId = params.get("module");
    const testId = params.get("test");
  
    if (!moduleId || !testId) {
      alert("URL must include ?module=X&test=Y");
      return;
    }
  
    // 2. Загружаем JSON с тестом
    fetch(`assets/tests/module${moduleId}/test${testId}.json`)
      .then(res => res.json())
      .then(data => buildQuiz(data));
  
    function buildQuiz(data) {
      document.querySelector(".quiz-header h1").textContent = data.title;
  
      data.questions.forEach((q, index) => {
        const block = document.createElement("div");
        block.className = "question";
  
        let html = `<p class="q-title">${index + 1}. ${q.question}</p>`;
  
        if (q.type === "choice") {
          for (let key in q.options) {
            html += `
              <label>
                <input type="radio" name="${q.id}" value="${key}">
                ${key}) ${q.options[key]}
              </label><br>
            `;
          }
        }
  
        if (q.type === "boolean") {
          html += `
            <label>
              <input type="radio" name="${q.id}" value="YES"> Այո
            </label><br>
            <label>
              <input type="radio" name="${q.id}" value="NO"> Ոչ
            </label><br>
          `;
        }
  
        block.innerHTML = html;
        quizForm.appendChild(block);
      });

      const submitBtn = document.createElement("button");
        submitBtn.type = "submit";
        submitBtn.textContent = "Ավարտել թեստը";
        submitBtn.className = "btn";
        quizForm.appendChild(submitBtn);
  
      activateEvents(data);
    }
  
    function activateEvents(data) {
      // Прогресс
      quizForm.addEventListener('change', () => {
        const total = data.questions.length;
        const answered = quizForm.querySelectorAll('input:checked').length;
        progressBar.style.width = (answered / total) * 100 + '%';
      });
  
      // Submit
      quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
  
        let score = 0;
  
        data.questions.forEach(q => {
          const userInput = quizForm.elements[q.id];
          if (!userInput) return;
  
          const userValue = userInput.value;
          if (userValue === q.answer) score++;
        });
  
        const cur = localStorage.getItem('currentUser');
        let userName = "User";
        if (cur) {
          try {
            const user = JSON.parse(cur);
            userName = user.name || user.email || "User";
          } catch {}
        }
  
        resultBox.style.display = 'block';
        if (score >= data.passingScore) {
          resultBox.textContent = `Շնորհավորում ենք, ${userName}! Դուք հավաքեցիք ${score}/${data.questions.length} և անցաք թեստը։`;
          certBtn.style.display = 'inline-block';
        } else {
          resultBox.textContent = `Դուք հավաքեցիք ${score}/${data.questions.length} միավոր։ Փորձեք կրկին։`;
        }
  
        quizForm.querySelector('button').disabled = true;
      });
  
      // Сертификат
      certBtn.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
  
        const cur = localStorage.getItem('currentUser');
        let userName = "User";
        if (cur) {
          try {
            const user = JSON.parse(cur);
            userName = user.name || user.email || "User";
          } catch {}
        }
  
        doc.setFontSize(22);
        doc.text("Certificate of Completion", 60, 40);
        doc.setFontSize(16);
        doc.text(`This certifies that`, 85, 60);
        doc.setFontSize(18);
        doc.text(userName, 85, 75);
        doc.setFontSize(14);
        doc.text("has successfully completed the module quiz.", 50, 90);
        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 60, 110);
  
        doc.save(`Certificate_${userName}.pdf`);
      });
    }
  })();
  