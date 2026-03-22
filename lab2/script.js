let coursesData = [];
let scheduleData = [];

async function loadData() {
    const response = await fetch('data.json');
    const data = await response.json();
    coursesData = data.courses;
    scheduleData = data.schedule;
}

// courses.html
function initCoursesPage() {
    const grid = document.querySelector('.courses-grid');
    if (!grid) return;

    // генерація курсів через цикл for
    grid.innerHTML = '';

    for (let i = 0; i < coursesData.length; i++) {
        const course = coursesData[i];

        // Завдання 1: Цикл for + умовний оператор if-else для стилю
        const card = document.createElement('article');
        card.classList.add('courses-card');

        // if-else: виділення пройдених курси іншим стилем
        if (course.completed) {
            card.style.borderColor = '#2c3e50';
            card.style.backgroundColor = '#eaf0fb';
        } else {
            card.style.borderColor = '#ccc';
            card.style.backgroundColor = '#fff';
        }

        card.innerHTML = `
            <img src="${course.img}" alt="${course.alt}">
            <h3>${course.title}</h3>
            <p>Рівень: ${course.level}</p>
            <p>Тривалість: ${course.duration}</p>
            <p>Викладач: ${course.teacher}</p>
            ${course.completed ? '<p style="color:#2c3e50;font-weight:bold;">✔ Пройдено</p>' : ''}
            <button class="btn start-btn" data-id="${course.id}" data-title="${course.title}" data-completed="${course.completed}">
                ${course.completed ? 'Курс пройдено' : 'Розпочати курс'}
            </button>
        `;

        grid.appendChild(card);
    }

    // Завдання 2: Обробка події кліку на кнопку "Розпочати курс" / "Курс пройдено"
    // querySelectorAll + цикл for для додавання обробників до всіх кнопок
    const startBtns = document.querySelectorAll('.start-btn');

    for (let i = 0; i < startBtns.length; i++) {
        startBtns[i].addEventListener('click', function () {
            const courseId = parseInt(this.dataset.id);
            const isCompleted = this.dataset.completed === 'true';
            const card = this.closest('.courses-card');

            // if-else: перевірка поточного стану курсу
            if (!isCompleted) {
                // Курс не пройдено → блок з описом вище (до заголовку)
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 8px 20px rgba(44,62,80,0.18)';
                card.style.borderColor = '#2c3e50';
                card.style.transition = 'all 0.4s ease';

                this.textContent = 'Курс пройдено';
                this.style.backgroundColor = '#27ae60';
                this.dataset.completed = 'true';

                // мітка "Пройдено" якщо ще немає
                if (!card.querySelector('.done-label')) {
                    const doneLabel = document.createElement('p');
                    doneLabel.classList.add('done-label');
                    doneLabel.style.color = '#27ae60';
                    doneLabel.style.fontWeight = 'bold';
                    doneLabel.textContent = '✔ Пройдено';
                    card.insertBefore(doneLabel, this);
                }
            } else {
                // курс вже пройдено → в початковий стан
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
                card.style.borderColor = '#ccc';
                card.style.backgroundColor = '#fff';

                this.textContent = 'Розпочати курс';
                this.style.backgroundColor = '';
                this.dataset.completed = 'false';

                const doneLabel = card.querySelector('.done-label');
                if (doneLabel) doneLabel.remove();
            }
        });
    }

    // Завдання 3: Візуальна шкала прогресу навчання
    // кількість пройдених курсів відносно загальних
    const progressSection = document.getElementById('progress-section');
    if (progressSection) {
        updateProgressBar();
    }
}

function updateProgressBar() {
    const progressSection = document.getElementById('progress-section');
    if (!progressSection) return;

    // Підрахунок пройдених курсів з поточного стану кнопок
    const allBtns = document.querySelectorAll('.start-btn');
    let completedCount = 0;

    for (let i = 0; i < allBtns.length; i++) {
        if (allBtns[i].dataset.completed === 'true') {
            completedCount++;
        }
    }

    const total = coursesData.length;
    const percent = Math.round((completedCount / total) * 100);

    progressSection.innerHTML = `
        <h3>📊 Ваш прогрес навчання</h3>
        <p>Пройдено курсів: <strong>${completedCount}</strong> з <strong>${total}</strong> (${percent}%)</p>
        <div class="progress-bar">
            <div class="progress-fill" id="main-progress-fill" style="width: ${percent}%; transition: width 0.6s ease;"></div>
        </div>
    `;
}


// schedule.html
function initSchedulePage() {
    const tableBody = document.getElementById('schedule-body');
    if (!tableBody) return;

    // Завдання 1: do...while для виведення розкладу (автоматично показує лише активні)
    tableBody.innerHTML = '';
    let i = 0;

    do {
        const row = scheduleData[i];

        // if-else: показуємо лише активні заняття; неактивні сірим
        const tr = document.createElement('tr');

        if (row.active) {
            tr.innerHTML = `
                <td>${row.course}</td>
                <td>${row.days}</td>
                <td>${row.time}</td>
                <td><span style="color:#27ae60;">✔ Активний</span></td>
            `;
        } else {
            tr.style.opacity = '0.4';
            tr.innerHTML = `
                <td>${row.course}</td>
                <td>${row.days}</td>
                <td>${row.time}</td>
                <td><span style="color:#e74c3c;">✖ Призупинено</span></td>
            `;
        }

        tableBody.appendChild(tr);
        i++;
    } while (i < scheduleData.length);

    // Завдання 2: Кнопка оновлення розкладу (симулює автоматичне оновлення)
    const refreshBtn = document.getElementById('refresh-schedule');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function () {
            // Випадкова зміна статус одного заняття для демонстрації do...while
            const randomIndex = Math.floor(Math.random() * scheduleData.length);
            scheduleData[randomIndex].active = !scheduleData[randomIndex].active;
            initSchedulePage(); // перерендер таблиці

            const msg = document.getElementById('schedule-msg');
            if (msg) {
                msg.textContent = `✅ Розклад оновлено! Змінено статус курсу: "${scheduleData[randomIndex].course}"`;
                msg.style.color = '#2c3e50';
                setTimeout(() => { msg.textContent = ''; }, 3000);
            }
        });
    }
}


// profile.html
function initProfilePage() {
    // Завдання 3: Динамічна шкала прогресу + журнал тренувань (тут — пройдених курсів)
    const progressFill = document.getElementById('progress-fill-dynamic');
    if (progressFill) {
        // анімація шкали при завантаженні
        setTimeout(() => {
            progressFill.style.width = '70%';
        }, 300);
    }

    // Завдання 2: Кнопка "Розпочати курс" на сторінці профілю
    const startCourseBtn = document.getElementById('start-course-btn');
    const courseBlock = document.getElementById('current-course-block');

    if (startCourseBtn && courseBlock) {
        startCourseBtn.addEventListener('click', function () {
            // переміщуємо блок вище (анімовано)
            courseBlock.style.transform = 'translateY(-10px)';
            courseBlock.style.boxShadow = '0 8px 24px rgba(44,62,80,0.15)';
            courseBlock.style.transition = 'all 0.4s ease';
            courseBlock.style.borderLeft = '4px solid #2c3e50';

            startCourseBtn.textContent = '▶ Тривалість курсу...';
            startCourseBtn.disabled = true;
            startCourseBtn.style.opacity = '0.7';

            // таймер навчання
            startTimer('course-timer');
        });
    }

    // кнопка "Курс пройдено" — змінює фон блоку та виводить "Пройдено"
    const doneCourseBtn = document.getElementById('done-course-btn');
    if (doneCourseBtn && courseBlock) {
        doneCourseBtn.addEventListener('click', function () {
            courseBlock.style.backgroundColor = '#eafbea';
            courseBlock.style.borderLeft = '4px solid #27ae60';
            courseBlock.style.transition = 'background-color 0.5s ease';

            const doneText = document.getElementById('course-done-text');
            if (doneText) {
                doneText.textContent = '✔ Пройдено';
                doneText.style.color = '#27ae60';
                doneText.style.fontWeight = 'bold';
                doneText.style.display = 'block';
            }

            // оновлення шкали прогресу до 100%
            if (progressFill) {
                progressFill.style.width = '100%';
                progressFill.style.backgroundColor = '#27ae60';
            }

            const progressText = document.getElementById('progress-text');
            if (progressText) progressText.textContent = 'JavaScript — 100%';

            doneCourseBtn.disabled = true;
            doneCourseBtn.style.opacity = '0.6';
            if (startCourseBtn) {
                startCourseBtn.disabled = true;
                startCourseBtn.style.opacity = '0.6';
            }

            stopTimer('course-timer');
        });
    }

    // Завдання 3: Журнал пройдених курсів — список з яким можна взаємодіяти
    renderTrainingLog();
}

// таймер навчання
let timerIntervals = {};

function startTimer(timerId) {
    const timerEl = document.getElementById(timerId);
    if (!timerEl) return;

    timerEl.style.display = 'block';
    let seconds = 0;

    timerIntervals[timerId] = setInterval(() => {
        seconds++;
        const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        timerEl.textContent = `⏱ Час навчання: ${mins}:${secs}`;
    }, 1000);
}

function stopTimer(timerId) {
    if (timerIntervals[timerId]) {
        clearInterval(timerIntervals[timerId]);
        const timerEl = document.getElementById(timerId);
        if (timerEl) {
            timerEl.textContent += ' (зупинено)';
        }
    }
}

// журнал пройдених курсів
const trainingLog = [
    { course: "HTML & CSS", type: "Фронтенд", date: "2025-12-10", duration: "6 тижнів" },
    { course: "Вступ до програмування", type: "Основи", date: "2025-10-01", duration: "4 тижні" }
];

function renderTrainingLog() {
    const logList = document.getElementById('training-log-list');
    if (!logList) return;

    logList.innerHTML = '';

    // цикл for для відображення журналу
    for (let i = 0; i < trainingLog.length; i++) {
        const entry = trainingLog[i];
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${entry.course}</strong> — ${entry.type} 
            <span style="color:#888;">(${entry.date}, ${entry.duration})</span>
        `;
        li.style.padding = '8px 0';
        li.style.borderBottom = '1px solid #eee';
        logList.appendChild(li);
    }
}


// СТОРІНКА: index.html (Головна)
function initIndexPage() {
    // наведення на переваги — показуємо опис при hover
    const advantageItems = document.querySelectorAll('.advantages li');

    for (let i = 0; i < advantageItems.length; i++) {
        advantageItems[i].style.cursor = 'pointer';
        advantageItems[i].style.transition = 'all 0.2s ease';

        advantageItems[i].addEventListener('mouseover', function () {
            this.style.paddingLeft = '15px';
            this.style.color = '#2c3e50';
            this.style.fontWeight = 'bold';
        });

        advantageItems[i].addEventListener('mouseout', function () {
            this.style.paddingLeft = '0';
            this.style.color = '';
            this.style.fontWeight = '';
        });
    }
}

// ІНІЦІАЛІЗАЦІЯ
document.addEventListener('DOMContentLoaded', async function () {
    await loadData(); // спочатку завантажуємо дані з JSON

    const page = document.body.dataset.page;

    if (page === 'courses') {
        initCoursesPage();
        document.addEventListener('click', function (e) {
            if (e.target.classList.contains('start-btn')) {
                setTimeout(updateProgressBar, 100);
            }
        });
    }

    if (page === 'schedule') initSchedulePage();
    if (page === 'profile') initProfilePage();
    if (page === 'index') initIndexPage();
});