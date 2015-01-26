$(function() {
    var move = new buzz.sound('/sounds/finger', {
        formats: ['wav']
    });
    var confirm = new buzz.sound('/sounds/confirm', {
        formats: ['wav']
    });
    var selected = 0;

    function select(index) {
        $('tr').find('img').addClass('hidden');
        $('tr').eq(index).find('img').removeClass('hidden');
    }

    $('body').keydown(function(e) {
        if (e.keyCode == 13) {
            confirm.play();
            setTimeout(function() {
                var href = $('tr').eq(selected).find('a').attr('href');
                window.location.href = href;
            },800);
        } else if (e.keyCode == 38 && selected !== 0) {
            selected--;
            move.play();
            select(selected);
        } else if (e.keyCode == 40 && selected !== 2) {
            selected++;
            move.play();
            select(selected);
        }
    });
});