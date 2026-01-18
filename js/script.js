"use strict";
var Core;
(function (Core) {
    var Slider = (function () {
        function Slider() {
            // Durations
            this.durations = {
                auto: 5000,
                slide: 1400
            };
            // DOM
            this.dom = {
                wrapper: null,
                container: null,
                project: null,
                current: null,
                next: null,
                arrow: null,
                titles: null
            };
            // Misc stuff
            this.length = 0;
            this.current = 0;
            this.next = 0;
            this.isAuto = true;
            this.working = false;
            this.pendingProcess = null;
            this.dom.wrapper = $('.stack');
            this.dom.titles = $('.titles');
            this.dom.project = this.dom.wrapper.find('.picture');
            this.dom.activezone = this.dom.titles.find('.active-zone');
            this.length = this.dom.project.length;
            this.init();
            this.events();
            //this.auto = setInterval(this.updateNext.bind(this), this.durations.auto);
        }
        /**
         * Set initial z-indexes & get current project
         */
        Slider.prototype.init = function () {
            this.dom.project.css('z-index', 10);
            this.dom.current = $(this.dom.project[this.current]);
            this.dom.next = $(this.dom.project[this.current + 1]);
            this.dom.current.css('z-index', 30);
            this.dom.next.css('z-index', 20);

            //fallback
            if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
                $('body').addClass('outdated');
            }
            if (document.documentMode || /Edge/.test(navigator.userAgent)) {
                $('body').addClass('outdated');
            }
        };
        Slider.prototype.clear = function () {
            this.dom.arrow.off('click');
            if (this.isAuto)
                clearInterval(this.auto);
        };
        /**
         * Initialize events
         */
        Slider.prototype.events = function () {
            var self = this;
            this.dom.activezone.on('mouseover', function () {
                var btn = $(this);

                // On annule tout timeout d'attente précédent
                if (self.pendingProcess) {
                    clearTimeout(self.pendingProcess);
                }
                var waitAndProcess = function () {
                    if (self.working) {
                        self.pendingProcess = setTimeout(waitAndProcess, 100);
                    } else {
                        self.pendingProcess = null;
                        self.processBtn(btn);
                    }
                };

                waitAndProcess();
            });
        };
        Slider.prototype.processBtn = function (btn) {
            if (btn.data('index') === 'me')
                this.next = 0;
            if (btn.data('index') === 'se')
                this.next = 1;
            if (btn.data('index') === 'ca')
                this.next = 2;
            this.process();
        };

        /**
         * Process, calculate and switch beetween slides
         */
        Slider.prototype.process = function () {
            if (this.current !== this.next) {
                var self = this;
                this.working = true;
                this.dom.next = $(this.dom.project[this.next]);
                this.dom.current.css('z-index', 30);
                self.dom.next.css('z-index', 20);
                // Hide current
                this.dom.current.addClass('hide');
                setTimeout(function () {
                    self.dom.current.css('z-index', 10);
                    self.dom.next.css('z-index', 30);
                    self.dom.current.removeClass('hide');
                    self.dom.current = self.dom.next;
                    self.current = self.next;
                    self.working = false;
                }, this.durations.slide);
            }
        };
        return Slider;
    }());
    Core.Slider = Slider;
})(Core || (Core = {}));
document.addEventListener('DOMContentLoaded', function () {
    new Core.Slider();
});
