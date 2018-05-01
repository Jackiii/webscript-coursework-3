window.addEventListener('load', initialize);

// Caches sessions locally for search purposes.
let sessionList = [];

// Initialization function ---------------------------------------------------------------------------------

function initialize() {
    document.getElementById('submit').addEventListener('click', postSession);
    document.getElementById('unitButton').addEventListener('click', postUnit);
    document.getElementById('unitSelect').addEventListener('change', loadSessions);
    document.getElementById('sessSearch').addEventListener('input', loadSessions);
    
    loadSessions();
    loadUnits();
    addCoord();
    addWeekNos();
}

// Post to database functions ------------------------------------------------------------------------------

// Posts a unitname to the server for inserting into database.
async function postUnit() {
    console.log('postUnit called');
    let element = document.getElementById('unitAdd');
    if (element.value != '' && checkUnit(element.value)) {
        let url = '/api/addUnit?unit=' + encodeURIComponent(element.value);
        const response = await fetch(url, {method: 'POST'});
        loadUnits();
    }
    element.value = '';
}

// Posts session data to the server for inserting into database.
async function postSession() {
    console.log('postSession called');

    let unit = document.getElementById('unitSelect').value;
    let week = document.getElementById('weekSelect').value;
    let type = document.getElementById('typeSelect').value;
    let coord = document.getElementById('coordSelect').value;
    let topic = document.getElementById('topicTA').value;
    let desc = document.getElementById('descTA').value;
    let hmwk = document.getElementById('hmwkTA').value;
    let date = document.getElementById('dateInput').value;

    if (unit == 'unit' || week == 'Select Week' || type == 'Type' || coord == 'coord'
     || topic == '' || desc == '') {
        // Turns background red if fields left empty.
        document.getElementById('inputs').style.backgroundColor = 'red';
    } else {
        document.getElementById('inputs').style.backgroundColor = 'transparent';
        let url = '/api/addSession?unit=' + encodeURIComponent(unit)
        + '&week=' + encodeURIComponent(week) + '&type='
         + encodeURIComponent(type) + '&coord=' + encodeURIComponent(coord)
          + '&topic=' + encodeURIComponent(topic) + '&desc=' + encodeURIComponent(desc)
          + '&hmwk=' + encodeURIComponent(hmwk) + '&date=' + encodeURIComponent(date);
        const response = await fetch(url, { method: 'POST' });

        clearFields();
        loadSessions();
    }    
}

// Posts session data to server for updating an existing session in the database.
async function editSession(event) {
    console.log('editSession called');
    let child = document.getElementById('div' + event.target.dataset.i).children;
    let unit;
    // Checks if outputs are searched outputs or not to prevent unitnames changing.
    if (child.length == 10) {
        unit = child[7].value;
    } else {
        unit = document.getElementById('unitSelect').value;
    }
    const url = '/api/editSession?id=' + encodeURIComponent(event.target.dataset.id)
     + '&unit=' + encodeURIComponent(unit)
      + '&week=' + encodeURIComponent(child[0].value) + '&type=' + encodeURIComponent(child[1].value)
       + '&coord=' + encodeURIComponent(child[2].value) + '&topic=' + encodeURIComponent(child[3].value)
        + '&desc=' + encodeURIComponent(child[4].value) + '&hmwk=' + encodeURIComponent(child[5].value)
         + '&date=' + encodeURIComponent(child[6].value);

    const response = await fetch(url, {method: 'POST'});
    if (response.ok) {
        loadSessions();
    } else {
        console.error('error removing session', response.status, response.statusText);
        console.log(response.status);
        window.bod.innerHTML = 'sorry, something went wrong...';
    }
}

// Posts ID to the server to delete that session from the database.
async function removeSession(event) {
    console.log('removeSession called');
    const url = '/api/removeSession?id=' + encodeURIComponent(event.target.dataset.id);

    const response = await fetch(url, {method: 'POST'});
    if (response.ok) {
        loadSessions();
    } else {
        console.error('error removing session', response.status, response.statusText);
        console.log(response.status);
        window.bod.innerHTML = 'sorry, something went wrong...';
    }
}

// Get from database functions ----------------------------------------------------------------------------

// Gets units from the server.
async function loadUnits() {
    console.log('loadUnits called');
    const url = '/api/units';
    const response = await fetch(url);
    if (response.ok) {
        putUnitsInOutput(await response.json());
    } else {
        console.error('error getting units', response.status, response.statusText);
        console.log(response.status);
        window.bod.innerHTML = 'sorry, something went wrong...';
    }
}

// Gets sessions from the server.
async function loadSessions() {
    console.log('loadSessions called');
    const url = '/api/sessions';
    const response = await fetch(url);
    if (response.ok) {
        sessionList = await response.json();
        // Forks depending on whether search has been used.
        if (document.getElementById('sessSearch').value == '') {
            getSessionsFromUnit();
        } else {
            searchSessions();
        }
    } else {
        console.error('error getting sessions', response.status, response.statusText);
        console.log(response.status);
        window.bod.innerHTML = 'sorry, something went wrong...';
    }
}

// Output data functions ------------------------------------------------------------------------------------

// Outputs sessions into the selectbox.
function putUnitsInOutput(unitTable) {
    console.log('putUnitsInOutput called');
    let element = document.getElementById('unitSelect');
    for (let i = 0; i < unitTable.length; i++) {
        let node = document.createElement('OPTION');
        node.innerText = unitTable[i].unitName;
        element.appendChild(node);
    }
}

// Outputs sessions into the outputs div.
function putSessionsInOutput(sessionTable, showUnit = false) {
    console.log('putSessionsInOutput called');
    //**Clear all entries in the div.**
    let element = document.getElementById('outputs');
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }

    for (let i = 0; i < sessionTable.length; i++) {
        // Alternates background for better readability.
        let background;
        if (i%2 == 0) {
            background = '#660066';
        } else {
            background = '#696969';
        }
        let container = document.createElement('DIV');
        container.id = 'div' + i;
        container.classList.add('container');
        container.style.backgroundColor = background;
        let node = document.createElement('TEXTAREA');
        node.innerText = sessionTable[i].sessWeek;
        container.appendChild(node);
        node = document.createElement('TEXTAREA');
        node.innerText = sessionTable[i].sessType;
        container.appendChild(node);
        node = document.createElement('TEXTAREA');
        node.innerText = sessionTable[i].sessCoord;
        container.appendChild(node);
        node = document.createElement('TEXTAREA');
        node.innerText = sessionTable[i].sessTopic;
        container.appendChild(node);
        node = document.createElement('TEXTAREA');
        node.innerText = sessionTable[i].sessDesc;
        container.appendChild(node);
        node = document.createElement('TEXTAREA');
        node.innerText = sessionTable[i].sessHmwk;
        container.appendChild(node);
        node = document.createElement('TEXTAREA');
        let date = new Date(sessionTable[i].sessDate);
        node.innerText = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
        container.appendChild(node);
        // Shows unit in event of being returned from a search.
        if (showUnit) {
            node = document.createElement('TEXTAREA');
            node.readOnly = 'true';
            node.innerText = sessionTable[i].unitName;
            container.appendChild(node);
        }
        let btnEdit = document.createElement('BUTTON');
        btnEdit.innerText = 'Edit';
        btnEdit.dataset.i = i;
        btnEdit.dataset.id = sessionTable[i].sessId;
        btnEdit.onclick = editSession;
        container.appendChild(btnEdit);
        let btnDelete = document.createElement('BUTTON');
        btnDelete.innerText = 'Delete';
        btnDelete.dataset.id = sessionTable[i].sessId;
        btnDelete.onclick = removeSession;
        container.appendChild(btnDelete);
        element.appendChild(container);
    }
}

// Local data handling functions ---------------------------------------------------------------------------

// Filters sessions to all sessions from a given unit.
function getSessionsFromUnit() {
    console.log('getSessionsFromUnit called');
    let sessionUnitList = [];
    for (let i = 0; i < sessionList.length; i++) {
        if (sessionList[i].unitName == document.getElementById('unitSelect').value) {
            sessionUnitList.push(sessionList[i]);
        }
    }
    putSessionsInOutput(sessionUnitList);
}

// Searches all sessions and returns a list of them that contain the search term.
function searchSessions() {
    console.log('searchSessions called');
    let search = document.getElementById('sessSearch').value;
    // If used to prevent issue with backspacing to an empty string.
    if (search == '') {
        getSessionsFromUnit();
    } else {
        let foundSessions = [];
        for (let i = 0; i < sessionList.length; i++) {
            let sess = sessionList[i];
            if (sess.sessWeek.toString().includes(search) || sess.sessType.includes(search)
             || sess.sessCoord.includes(search) || sess.sessTopic.includes(search) || sess.sessDesc.includes(search)
              || sess.sessHmwk.includes(search) || sess.sessDate.toString().includes(search))  {
                foundSessions.push(sessionList[i]);
            }
        }   
        putSessionsInOutput(foundSessions, true);
    }   
}

// Additional functions ------------------------------------------------------------------------------------

// Returns whether entered unit already exists.
function checkUnit(unit) {
    let element = document.getElementById('unitSelect');
    for(let i = 0; i < element.children.length; i++){
        if (element[i].value == unit){
            return false;
        }
    }
    return true;
}

// Empties session data entry fields.
function clearFields() {
    let div = document.getElementById('inputs').children;
    for (let i = 0; i < div.length; i++) {
        let divLow = div[i].tagName.toLowerCase();
        if (divLow == 'select') {
            div[i].selectedIndex = 0;
        } else if (divLow.tagName == 'textarea') {
            div[i].innerHTML = '';
        } else {
            div[i].value = '';
        }
    }
}

// Adds the 24 week numbers to the week selectbox.
function addWeekNos() {
    for (let i = 1; i < 25; i++) {
        let node = document.createElement('OPTION');
        let textnode = document.createTextNode('' + i);
        node.appendChild(textnode);
        document.getElementById('weekSelect').appendChild(node);
    }
}

// Adds default coordinators to the coord selectbox.
function addCoord() {
    let element = document.getElementById('coordSelect');
    let node = document.createElement('OPTION');
    node.innerText = 'Rich Boakes';
    element.appendChild(node);
    node = document.createElement('OPTION');
    node.innerText = 'Jacek Kopecky';
    element.appendChild(node);
    node = document.createElement('OPTION');
    node.innerText = 'Matt Dennis';
    element.appendChild(node);
}