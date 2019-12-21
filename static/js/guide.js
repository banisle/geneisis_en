$(function () {
    includeLayout();
});

function includeLayout() {
    var includeArea = $('[data-inc]');
    var self, url;
    $.each(includeArea, function () {
        self = $(this);
        url = self.data("inc");

        console.log( url );
        self.load(url, function () {
            self.removeAttr("data-inc");
        });
    });
}