export function setAlert(message, type) {
    localStorage.setItem('reload', true);
    localStorage.setItem('msm', message);
    localStorage.setItem('type', type);
}
function checkAlert() {
    const isReload = localStorage.getItem('reload');
    const message = localStorage.getItem('msm');
    const type = localStorage.getItem('type');

    if (isReload) {
        showAlert(message, type);
        localStorage.removeItem('reload');
        localStorage.removeItem('msm');
        localStorage.removeItem('type');
    }
}

function showAlert(message, type) {
    const alertDiv = document.getElementById('alerts');
    if (alertDiv) {
        var alert =
            `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
        <div>${message}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
        setTimeout(function () {
            alertDiv.innerHTML = alert;
        }, 800);

        setTimeout(function () {
            alertDiv.innerHTML = '';
        }, 3000);
    } else {
        setAlert(message, type);
    }

}


document.addEventListener('dynamicContentLoaded', () => {
    checkAlert();
});
