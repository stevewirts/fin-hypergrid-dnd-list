/* global PolymerGestures */
'use strict';

(function() {

    Polymer('fin-hypergrid-dnd-list', { /* jshint ignore:line  */
        ready: function() {
            // populate the element’s data model
            // (the salutations array)
            this.label = this.label || 'title';
            this.list = this.list || [
                'list item one',
                'list item two',
                'list item three',
                'list item four',
                'list item one',
                'list item two',
                'list item three',
                'list item four',
                'list item one',
                'list item two',
                'list item three',
                'list item four',
                'list item one',
                'list item two',
                'list item three',
                'list item four',
                'list item one',
                'list item two',
                'list item three',
                'list item four',
                'list item one',
                'list item two',
                'list item three',
                'list item four'
            ];
            // var events = [
            //     // base events
            //     'down',
            //     'up',
            //     'trackstart',
            //     'track',
            //     'trackend',
            //     'tap',
            //     'hold',
            //     'holdpulse',
            //     'release'
            // ];
            var parent = this.parentElement;
            var self = this;
            parent.oncontextmenu = function() {
                return false;
            };
            PolymerGestures.addEventListener(this.$.ulist, 'trackstart', function(e) {
                var li = e.path[0];
                if (li.nodeName !== 'LI') {
                    return; // not a list item; ignore
                }
                self.initiateItemDrag(li, e);
            });
        },
        getRowHeights: function() {
            var bounds = this.$.ulist.getBoundingClientRect();
            var items = this.$.ulist.querySelectorAll('li.item').array();
            var boundries = items.map(function(e) {
                return e.getBoundingClientRect().top - bounds.top;
            });
            var last = items[items.length - 1];
            boundries.push(boundries[boundries.length - 1] + last.getBoundingClientRect().height);
            boundries[0] = 0;
            return boundries;

        },
        dragHover: function(dragged, x, y) {
            var bounds = this.$.ulist.getBoundingClientRect();
            //var items = this.$.ulist.querySelectorAll('li.item').array();
            var boundries = this.getRowHeights();
            var localY = y - bounds.top;
            var minValue = 1000000;
            var minIndex = 0;
            for (var i = 0; i < boundries.length; i++) {
                var distance = Math.abs(localY - boundries[i]);
                if (distance < minValue) {
                    minIndex = i;
                    minValue = distance;
                }
            }
            var overRow = minIndex;
            if (this.overRow !== overRow) {
                var spacers = this.$.ulist.querySelectorAll('li.spacer');
                //shrink previous if it exists
                if (this.overRow || this.overRow === 0) {
                    var previous = this.$.ulist.querySelector('li.spacer.beBig');
                    if (previous) {
                        previous.classList.add('transition');
                        requestAnimationFrame(function() {
                            previous.classList.remove('beBig');
                            previous.classList.add('beSmall');
                        });
                    }
                }

                //expand current
                this.overRow = overRow;
                var spacer = spacers[overRow];
                spacer.classList.add('transition');
                requestAnimationFrame(function() {
                    spacer.classList.remove('beSmall');
                    spacer.classList.add('beBig');
                    setTimeout(function() {
                        spacer.classList.remove('transition');
                    }, 110);
                });
            }
        },
        handleDrag: function(e) {
            if (!this.dragFodder) {
                return;
            }
            var globalX = e.x || e.clientX;
            var globalY = e.y || e.clientY;
            //var sx = this.dragItemStart[0];
            //var sy = this.dragItemStart[1];
            this.setCssLocation(this.dragFodder.style, globalX, globalY);

            //lets check for a drag over....
            var dropTarget = document.elementFromPoint(globalX, globalY);
            if (dropTarget && dropTarget.dragHover) {
                dropTarget.dragHover(this.dragFodder, globalX, globalY);
            }
        },
        initiateItemDrag: function(li, e) {
            e.preventDefault();
            var self = this;
            var parent = this.$.ulist;
            var bounds = li.getBoundingClientRect();
            var parentBounds = parent.getBoundingClientRect();
            li.classList.add('level3');
            li.style.width = parentBounds.width + 'px';
            if (this.dragFodder) {
                this.shadowRoot.removeChild(this.dragFodder);
            }
            this.dragFodder = li;
            this.dragEventStart = [e.x || e.clientX, e.y || e.clientY];
            this.dragItemStart = [bounds.left - parentBounds.left, bounds.top - parentBounds.top - 4];

            //lets insert this guy and do a transition to
            //shrink his height
            var goAwayer = li.nextElementSibling;
            goAwayer.classList.remove('transition');
            goAwayer.classList.add('beBig');
            document.body.appendChild(li);
            this.setCssLocation(li.style, this.dragItemStart[0], this.dragItemStart[1]);
            PolymerGestures.addEventListener(li, 'track', function(e) {
                self.handleDrag(e);
            });
            requestAnimationFrame(function() {
                goAwayer.classList.remove('beBig');
                goAwayer.classList.add('beSmall');
                goAwayer.classList.add('transition');
                //wait a little longer than the transition
                //and remove the spacer so as not to have
                //duplicate spacers
                setTimeout(function() {
                    parent.removeChild(goAwayer);
                }, 110);
            });
            //make the new guy generate touch events

        },
        setCssLocation: function(style, x, y) {
            style.position = 'absolute';
            style.top = 0;
            style.left = 0;
            style.webkitTransform = 'translate(' + x + 'px, ' + y + 'px)';
            style.MozTransform = 'translate(' + x + 'px, ' + y + 'px)';
            style.mmsTransform = 'translate(' + x + 'px, ' + y + 'px)';
            style.oTransform = 'translate(' + x + 'px, ' + y + 'px)';
            style.transform = 'translate(' + x + 'px, ' + y + 'px)';

            style.lineHeight = '46px';
            style.listStyleType = 'none';
            style.fontFamily = 'Roboto, sans-serif';
            style.borderBottom = '1px solid #e0e0e0';
            style.texttransform = 'capitalize';
            style.cursor = 'move';
            style.backgroundColor = 'white';
            style.color = 'black';

        }
    });

})();
