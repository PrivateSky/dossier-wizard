function buildCSB() {
    const baseURL = getBaseURL();
    const req = new XMLHttpRequest();
    const transactionId = document.getElementById('transactionId').value;
    const url = `${baseURL}/buildCSB/${transactionId}`;

    req.open("POST", url, true);
    req.onload = function (oEvent) {
        const content = document.getElementsByClassName('content')[0];

        const response = document.createElement('div');

        response.innerHTML = `
        <p> CSB was successfully created. The seed is:  ${req.response}</p>
        `;

        content.appendChild(response);
    };

    req.send();
}