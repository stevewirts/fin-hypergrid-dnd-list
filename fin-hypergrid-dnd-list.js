/* global PolymerGestures */
'use strict';

(function() {
    var noop = function() {

    };
    Polymer('fin-hypergrid-dnd-list', { /* jshint ignore:line  */
        attached: function() {
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

        //I've just been dragged over this is the notification
        handleDragHoverEnter: function(dragged, x, y) {
            noop(dragged, x, y);
        },

        //I've just had a dragging operation leave me and
        //begin hovering over another drag target
        handleDragHoverExit: function(dragged, x, y) {
            noop(dragged, x, y);
            this.correctItemState();
        },

        //I'm being dragged over
        handleDragOver: function(dragged, x, y) {
            var self = this;
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
                if (this.isTransition) {
                    return;
                }
                this.isTransition = true;
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
                        self.isTransition = false;
                    }, 210);
                });
            }
        },
        handleDrag: function(e) {
            if (!this.dragFodder) {
                return;
            }
            var dragFodderRect = this.dragFodder.getBoundingClientRect();
            var cxo = dragFodderRect.width / 2;
            var cyo = dragFodderRect.height / 2;

            var globalX = (e.x || e.clientX) - this.dragEventStart[0];
            var globalY = (e.y || e.clientY) - this.dragEventStart[1];
            //var sx = this.dragItemStart[0];
            //var sy = this.dragItemStart[1];
            this.setCssLocation(this.dragFodder.style, globalX, globalY);

            //lets check for a drag over....
            this.dragFodder.style.display = 'none';
            var dropTarget = document.elementFromPoint(globalX + cxo, globalY + cyo);
            this.dragFodder.style.display = '';
            if (dropTarget && dropTarget.handleDragOver) {
                if (this.currentDropTarget !== dropTarget) {
                    if (this.currentDropTarget) {
                        this.currentDropTarget.handleDragHoverExit(this.dragFodder, globalX + cxo, globalY + cyo);
                    }
                    this.currentDropTarget = dropTarget;
                    this.currentDropTarget.handleDragHoverEnter(this.dragFodder, globalX + cxo, globalY + cyo);
                }
                dropTarget.handleDragOver(this.dragFodder, globalX + cxo, globalY + cyo);
            }
        },

        //lets notify the drop target of a drop
        //the dropItem contains it's source, dragSource
        handleDrop: function(e) {

            noop(e);

            var dropTarget = this.currentDropTarget;
            var dragFodder = this.dragFodder;

            dropTarget.listItemDropped(dragFodder);
        },

        //ive had a list item dropped on me do the proper thing
        listItemDropped: function(listItem) {

            var self = this;
            var sourceList = listItem.dragSource;

            noop(listItem, sourceList);
            var dropSpacer = this.$.ulist.querySelector('li.spacer.beBig');

            var items = this.$.ulist.querySelectorAll('li').array();
            var sourceItem = listItem.dragItem;
            var insertIndex = items.indexOf(dropSpacer) / 2;


            var targetRect = dropSpacer.getBoundingClientRect();
            var targetTop = targetRect.top;
            var targetLeft = targetRect.left;

            listItem.style.webkitTransition = '-webkit-transform 150ms ease-in';
            listItem.style.MozTransition = '-moz-transform 150ms ease-in';
            listItem.style.msTransition = '-ms-transform 150ms ease-in';
            listItem.style.oTransition = '-o-transform 150ms ease-in';
            listItem.style.transition = 'transform 150ms ease-in';

            requestAnimationFrame(function() {
                self.setCssLocation(listItem.style, targetLeft, targetTop);
                setTimeout(function() {
                    listItem.parentElement.removeChild(listItem);
                    dropSpacer.classList.remove('beBig');
                    dropSpacer.classList.add('beSmall');
                    self.list.splice(insertIndex, 0, sourceItem);
                }, 170);
            });




            //this.correctItemState();

            //remove the item from body
        },
        initiateItemDrag: function(li, e) {
            e.preventDefault();
            var goAwayer = li.nextElementSibling;
            var bounds = li.getBoundingClientRect();

            var self = this;
            var parent = this.$.ulist;
            var parentBounds = parent.getBoundingClientRect();
            //li.classList.add('level3');
            li.style.width = parentBounds.width + 'px';
            // if (this.dragFodder) {
            //     document.body.removeChild(this.dragFodder);
            // }

            //let' attach the this as the drag source to
            //the item were dragging around
            li.dragSource = this;
            li.dragIndex = parseInt(li.getAttribute('value'));
            li.dragItem = this.list[li.dragIndex];

            this.list.splice(li.dragIndex, 1);

            this.dragFodder = li;
            this.dragEventStart = [(e.x || e.clientX) - bounds.left, (e.y || e.clientY) - bounds.top];
            //this.dragItemStart = [bounds.left - parentBounds.left, bounds.top - parentBounds.top];

            //lets insert this guy and do a transition to
            //shrink his height
            //goAwayer.classList.remove('transition');
            goAwayer.classList.add('beBig');
            goAwayer.classList.remove('beSmall');

            document.body.appendChild(li);
            PolymerGestures.addEventListener(li, 'track', function(e) {
                self.handleDrag(e);
            });

            PolymerGestures.addEventListener(li, 'trackend', function(e) {
                self.handleDrop(e);
            });

            // PolymerGestures.addEventListener(li, 'up', function(e) {
            //     console.log('up', e);
            // });

            requestAnimationFrame(function() {
                //goAwayer.classList.remove('beBig');
                //goAwayer.classList.add('beSmall');
                //goAwayer.classList.add('transition');
                //wait a little longer than the transition
                //and remove the spacer so as not to have
                //duplicate spacers
                setTimeout(function() {
                    goAwayer.classList.remove('transition');
                }, 210);
            });
            //make the new guy generate touch events

        },
        setCssLocation: function(style, x, y) {
            style.position = 'fixed';
            style.zIndex = 10;
            style.top = 0;
            style.left = 0;
            style.webkitTransform = 'translate(' + x + 'px, ' + y + 'px)';
            style.MozTransform = 'translate(' + x + 'px, ' + y + 'px)';
            style.mmsTransform = 'translate(' + x + 'px, ' + y + 'px)';
            style.oTransform = 'translate(' + x + 'px, ' + y + 'px)';
            style.transform = 'translate(' + x + 'px, ' + y + 'px)';
            style.border = '1px solid #bbbbbb';
            style.boxShadow = '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)';
        },

        //I no longer have a drop prospect, it has hovered over another drop prospect, correct my expansion state
        correctItemState: function() {
            var spacer = this.$.ulist.querySelector('li.spacer.beBig');
            if (spacer) {
                requestAnimationFrame(function() {
                    spacer.classList.remove('beBig');
                    spacer.classList.add('beSmall');
                    spacer.classList.add('transition');
                    //wait a little longer than the transition
                    //and remove the spacer so as not to have
                    //duplicate spacers
                    setTimeout(function() {
                        spacer.classList.remove('transition');
                    }, 210);
                });
            }
        }
    });

})();
