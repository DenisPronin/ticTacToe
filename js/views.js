var FieldView = Backbone.View.extend({
    tagName: 'td',
    className: 'fieldCell',

    events: {
        click: 'addSymbol'
    },

    initialize: function(){
        _.bindAll(this, 'render', 'addSymbol');
        this.model.bind('change', this.render);
    },

    render: function(){
        if(this.model.get('complete')){
            this.$el.addClass('complete');
        }
        this.$el.addClass(this.model.get('symbol'));
        this.$el.attr('id', this.model.get('row') + '_' + this.model.get('col'));
        return this;
    },

    endRendering: function(){
        this.undelegateEvents();
    },

    addSymbol: function(){
        if(!this.model.get('symbol')){
            var board = this.model.get('board');
            if(board){
                var count = board.get('count_moves');
                var symbol = board.get('symbols')[count%2];
                this.model.set('symbol', symbol);
                board.addMove();
                board.parseGameEnd(this.model);
            }
        }
    }
});

var BoardView = Backbone.View.extend({
    el: $('#game_container'),

    initialize: function(){
        _.bindAll(this, 'render');

        this.model = new Board();
        this.model.on('change', this.checkGameEnd, this);
        this.model.on('change:width change:height change:win_length', this.render, this);

        this.fields_views = [];

        this.render();
    },

    render: function(){
        var self = this;

        var width = self.model.get('width');
        var height = self.model.get('height');

        self.$el.empty();
        var $table = $('<table id="gameBoard"></table>');
        for (var i = 0; i < height; i++) {
            var $tr = $('<tr id="' + i + '"></tr>');
            for (var j = 0; j < width; j++) {
                var field = new Field({
                    row: i,
                    col: j,
                    board: this.model
                });

                this.model.get('fields').add(field);

                var fieldView = new FieldView({
                    model: field
                });
                $tr.append(fieldView.render().el);
                this.fields_views.push(fieldView);
            }
            $table.append($tr);
        }
        self.$el.append($table);
    },

    checkGameEnd: function(){
        if(this.model.get('game_over')){
            _.each(this.fields_views, function(field_view){
                field_view.endRendering();
            });
        }
    }
});

var SettingsView = Backbone.View.extend({
    el: $('#modalSettings'),

    events: {
        "click #saveSettings": "saveSettings"
    },

    initialize: function(){
        this.model = app.boardView.model;
        this.model.on('change', this.render, this);
        this.render();
    },

    render: function(){
        this.$el.find('#width_board').val(this.model.get('width'));
        this.$el.find('#height_board').val(this.model.get('height'));
        this.$el.find('#win_length').val(this.model.get('win_length'));
    },

    saveSettings: function(){
        this.model.set('width', this.$el.find('#width_board').val());
        this.model.set('height', this.$el.find('#height_board').val());
        this.model.set('win_length', this.$el.find('#win_length').val());
        this.$el.modal('hide');
    }
});