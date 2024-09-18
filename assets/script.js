import { calendar } from './shifts.js';
//import { shifts } from './shifts.js';

const users = [
    //['simone_moretti', 'simone94', 'simone', 'moretti'],
    ['test', 'test', 'simone', 'moretti'],
    ['emmanuele_motta', 'emmanuele00', 'emmanuele', 'motta'],
    ['fabio_paganoni', 'fabio00', 'fabio', 'paganoni'],
    ['carlo_munafo', 'carlo00', 'carlo', 'munafo'],
    ['rosario_scerra', 'rosarios00', 'rosarios', 'scerra'],
    ['rosario_buttice', 'rosariob00', 'rosariob', 'buttice'],
    ['alessandro_alecce', 'alessandro00', 'alessandro', 'alecce'],
    //['username', 'password', 'realname', 'realsurname'],
]

//console.log(users);

/**
 * header timer
 */

function updateDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // I mesi in JavaScript sono indicizzati da 0 (gennaio) a 11 (dicembre)
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const dateString = `${day}/${month}/${year}`;
    const timeString = `${hours}:${minutes}:${seconds}`;

    document.getElementById('currentDateTime').innerText = `${dateString} ${timeString}`;
}

// Aggiorna la data e l'ora ogni secondo
setInterval(updateDateTime, 1000);

// Aggiorna la data e l'ora immediatamente quando la pagina viene caricata
updateDateTime();

/**
 * index login script
 */
let found = false;

document.getElementById('login_form').addEventListener('submit', function (event) {
    event.preventDefault(); // Previene l'invio del modulol

    const userData = [];
    let tempString;

    let username = document.getElementById('username').value;

    let password = document.getElementById('password').value;

    if (username && password) {
        tempString = username + ' ' + password;
        //console.log('user data: ', tempString);
        userData.push(username);
        userData.push(password);
        //console.log(userData);
    }
    else {
        alert('some record is empty');
    }

    users.forEach(element => {
        if (element[0] == username && element[1] == password) {
            found = true;
            userData.push(element[2]);
            userData.push(element[3]);
            //console.log('element: ', element[0], ' user: ', username, ' real name: ', userData[2], ' surname: ', userData[3]);
        }
    });
    if (!found) { alert('user not found!'); }

    // injected user's container

    const personalArea = document.getElementById('logged_user');

    //console.log(personalArea);
    if (found) {
        //console.log(calendar);

        document.getElementById('login_container').remove();

        personalArea.classList.remove('d-none');

        const htmlContent = `
        <h4 id="h4_greetings">Ciao ${userData[2]}!</h4>
        <div>
            <select name="shifts" id="shifts_select" class="p-1 rounded-2">
                <option selected disabled>2024</option>
                <option value="october_2024">Ottobre</option>
                <option value="september_2024">Settembre</option>
                <option value="august_2024">Agosto</option>
                <option disabled>old 2024...</option>
            </select>
            <br>
            <small class="ps-1">Seleziona un mese</small>
        </div>
        <div id="month_image" class="container my-2">
        </div>
        `;
        personalArea.innerHTML = htmlContent;

        setTimeout(() => {
            document.getElementById('h4_greetings').remove();
        }, 3000);

        //let spanPosition;

        document.getElementById('shifts_select').addEventListener('change', (event) => {
            event.preventDefault();
            console.log('month: ', event.target.value);

            const tempImg = `
            <img id="shifts-img" class="position-relative" src="./assets/img/months/${event.target.value}.jpg" alt="${event.target.value}_image">
            <span id="span-position" class="position-absolute">
            <b>Chiudi</b>
                <i class="fa fa-solid fa-close"></i>
            </span>
            `;

            const selectedMonth = calendar.find(element => element.month === event.target.value);
            if (selectedMonth && selectedMonth.schedule) {
                const user = userData[2]; // 'simone'
                let shiftsTable = `
                <div id="shifts_table" class="container  my-2">
                    <table class="table">
                        <thead>
                            <tr class="text-center">
                                <th>Giorno</th>
                                <th>Turno Diurno</th>
                                <th>Turno Notturno</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                selectedMonth.schedule.forEach(shift => {
                    const dayShift = shift.dayShift.map(person => person === user ? `<span style="border: solid .5px white; border-radius: 6px; padding: .1rem .25rem;"><b><i>${person}</i></b></span>` : `<span class="text-white">${person}</span>`).join(' , ');
                    const nightShift = shift.nightShift.map(person => person === user ? `<span style="border: solid .5px white; border-radius: 6px; padding: .1rem .25rem;"><b><i>${person}</i></b></span>` : `<span class="text-white">${person}</span>`).join(' , ');

                    shiftsTable += `
                        <tr class="text-center">
                            <td>${shift.day}</td>
                            <td id="td-day-${shift.day}" class="td-box"><span>${dayShift}</span></td>
                            <td id="td-night-${shift.day}" class="td-box"><span>${nightShift}</span></td>
                        </tr>
                    `;
                });

                shiftsTable += `
                        </tbody>
                    </table>
                </div>
                <div>
                    <small class="p-1 border-1">Per il momento i ps non sono considerati. <b>Arriveranno a breve!</b><sub> stay tuned</sub></small>
                </div>
                `;

                document.getElementById('month_image').innerHTML = tempImg + shiftsTable;
            } else {
                document.getElementById('month_image').innerHTML = tempImg + '<p class="ms-1 my-1 p-1 border border-1 text-dark d-inline-block">Nessun dato disponibile per il mese selezionato.</p>';
            }

            const tableCells = document.querySelectorAll('td[id^="td-"]');
            //console.log(tableCells);
            tableCells.forEach(element => {
                element.classList.add('td-box');
                if (element.getAttribute('id').startsWith('td-day-')) {
                    //console.log('starts with day!', element.getAttribute('id'));
                    element.classList.add('td-day');
                }
                else {
                    //console.log('starts with night!', element.getAttribute('id'));
                    element.classList.add('td-night');
                }

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            const spanPosition = document.getElementById('span-position');
            if (spanPosition) {
                spanPosition.addEventListener('click', (e) => {
                    console.log(e.target);
                    document.getElementById('shifts-img').remove();
                    spanPosition.remove();
                });
            }
        });
    }
});

/**
 * form script
 */

document.getElementById('shiftForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const monthSelect = document.getElementById('shifts_select');
    const selectedMonth = monthSelect.value;
    const day = document.getElementById('day').value;
    const dayShift1 = document.getElementById('dayShift1').value.trim();
    const dayShift2 = document.getElementById('dayShift2').value.trim();
    const nightShift1 = document.getElementById('nightShift1').value.trim();
    const nightShift2 = document.getElementById('nightShift2').value.trim();

    const monthData = calendar.find(element => element.month === selectedMonth);
    if (monthData) {
        monthData.schedule.push({ day: parseInt(day), dayShift: [dayShift1, dayShift2], nightShift: [nightShift1, nightShift2] });
        console.log(monthData.schedule);
        alert('Turno aggiunto con successo!');
    } else {
        alert('Seleziona un mese valido.');
    }
});
