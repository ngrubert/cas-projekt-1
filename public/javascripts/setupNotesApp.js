'use strict';

$('#cancel-btn').click(function() {
    window.location.replace('/');
});

$('#stylesheet-selector').on('change', function() {
    var selectedStylesheet = $('#stylesheet-selector').val();
    sessionStorage.setItem('cssname', selectedStylesheet);
    $('#css-style').attr("href", '/css/' + selectedStylesheet + '.css');
})

function loadStylesheet() {
    var current_stylesheet = sessionStorage.getItem('cssname');
    if (!current_stylesheet) {
        sessionStorage.setItem('cssname', 'default');
    }
    var current_stylesheet = sessionStorage.getItem('cssname');
    $('#css-style').attr('href', '/css/' + current_stylesheet + '.css');
    $('#stylesheet-selector').val(current_stylesheet).change();
}
loadStylesheet();