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
        }
    });

})();
