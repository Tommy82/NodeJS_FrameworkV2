EnterAsTab = function () {
    this.ENTER_KEY = 13;
};

EnterAsTab.prototype.init = function () {
    this.listenOnEnterKey();
};

EnterAsTab.prototype.listenOnEnterKey = function () {

    let me = this;
    $('form input').on('keypress', function (event) {

            if (event.which === me.ENTER_KEY) {

                if (!event.shiftKey)
                    me.findNextFocusableElement(this);
                else
                    me.findPreviousFocusableElement(this);

                event.preventDefault();
            }
        }
    );
};

EnterAsTab.prototype.findNextFocusableElement = function (element) {
    this.findFocusableElement(element, this.increaseIndex);
};

EnterAsTab.prototype.findPreviousFocusableElement = function (element) {
    this.findFocusableElement(element, this.decreaseIndex);
};

EnterAsTab.prototype.findFocusableElement = function (element, callable) {

    let tabAbles = $("*[tabindex != '-1']:visible");
    let index = tabAbles.index(element);
    let counter = 1;
    let nextElement = undefined;

    try {

        while (true) {

            if ((nextElement = tabAbles.eq(index + counter)).length === 0) {
                break;
            }

            if (this.isFocusableElement(nextElement)) {

                let newIndex = callable.call(this, index, counter);
                tabAbles.eq(newIndex).focus();

                break;
            } else {
                counter++;
            }
        }
    } catch (error) {
        console.log(error);
    }

};

EnterAsTab.prototype.increaseIndex = function (index, counter) {
    return (index + counter);
};

EnterAsTab.prototype.decreaseIndex = function (index, counter) {
    return index - counter;
};

EnterAsTab.prototype.isFocusableElement = function (element) {

    return ['SELECT', 'TEXTAREA'].indexOf(element.prop('tagName')) > -1 ||
        element.is(':text') ||
        element.is(':checkbox') ||
        element.is(':radio');
};

let enterAsTab = new EnterAsTab();
enterAsTab.init();