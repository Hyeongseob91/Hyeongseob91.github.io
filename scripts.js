$(document).ready(function () {
    // Transition effect for navbar and back-to-top icon
    let top_cover_height = $(".row.cover.top").outerHeight()
    $(window).on("scroll", function () {
        // checks if window is scrolled more than height of the cover, adds/removes solid class
        if ($(this).scrollTop() > top_cover_height) {
            $('.navbar').addClass('solid');
            $('.navbar-container').addClass('solid');
        } else {
            $('.navbar').removeClass('solid');
            $('.navbar-container').removeClass('solid');
        }

    });


    // Scrolling effect for Arrow icons
    $("#scrollIcon").click(function (e) {
        e.preventDefault();
        scrollTo("#about");
    });
    $("#nav-about").click(function (e) {
        e.preventDefault();
        scrollTo("#about");
    });
    $("#nav-skills").click(function (e) {
        e.preventDefault();
        scrollTo("#skills");
    });
    $("#nav-portfolio").click(function (e) {
        e.preventDefault();
        scrollTo("#portfolio");
    });
    $("#nav-contact").click(function (e) {
        e.preventDefault();
        scrollTo("#contact");
    });
    $(".navbar-brand").click(function (e) {
        e.preventDefault();
        scrollTo("body");
    });

    function scrollTo(selector) {
        $('html, body').animate({
            scrollTop: parseInt($(selector).offset().top)
        }, 500);
    }
});
