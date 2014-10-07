var Field = Backbone.Model.extend({
    defaults: {
        row: 0,
        col: 0,
        symbol: "",
        complete: false,
        board: null
    }
});

var Fields = Backbone.Collection.extend({
    model: Field
});

var Board = Backbone.Model.extend({
    defaults: {
        width: 5,
        height: 5,
        win_length: 3,
        fields: new Fields(),
        symbols: ['cross', 'zero'],
        count_moves: 0,
        game_over: false
    },

    addMove: function(){
        var _count = this.get('count_moves');
        this.set('count_moves', ++_count);
    },

    parseGameEnd: function(field){
        var field_row = field.get('row');
        var field_col = field.get('col');
        var current_symbol = field.get('symbol');

        var win_length = this.get('win_length');

        // check vertical lines
        var checkMethods = [this.checkVerticalLines, this.checkHorizontalLines,
            this.checkTopToBottomDiagonalLines, this.checkBottomToTopDiagonalLines
        ];
        for (var i = 0; i < checkMethods.length; i++) {
            var method = checkMethods[i];
            var hasWin = method.apply(this, [field_row, field_col, current_symbol, win_length]);
            if(hasWin){
                break;
            }
        }
    },

    checkVerticalLines: function(field_row, field_col, current_symbol, win_length){
        for(var i = 0; i < win_length; i++){
            var vertical_line = _.filter(this.get('fields').models, function(f){
                return f.get('col') == field_col &&
                    f.get('row') > field_row - win_length + i &&
                    f.get('row') <= field_row + i &&
                    f.get('symbol') == current_symbol;
            });
            if(vertical_line.length >= win_length){
                console.log('WIN!!!');
                this.win(vertical_line);
                return true;
            }
        }
        return false;
    },

    checkHorizontalLines: function(field_row, field_col, current_symbol, win_length){
        for(var i = 0; i < win_length; i++){
            var horizontal_line = _.filter(this.get('fields').models, function(f){
                return f.get('row') == field_row &&
                    f.get('col') > field_col - win_length + i &&
                    f.get('col') <= field_col + i &&
                    f.get('symbol') == current_symbol;
            });
            if(horizontal_line.length >= win_length){
                console.log('WIN!!!');
                this.win(horizontal_line);
                return true;
            }
        }
        return false;
    },

    checkTopToBottomDiagonalLines: function(field_row, field_col, current_symbol, win_length){
        var kx = field_col - field_row;
        for(var i = 0; i < win_length; i++){
            var diagonal_line = _.filter(this.get('fields').models, function(f){
                return (f.get('col') > field_col - win_length - i &&
                    f.get('col') <= field_col - i &&
                    f.get('row') > field_row - win_length - i &&
                    f.get('row') <= field_row - i ||

                    f.get('col') < field_col + win_length + i &&
                    f.get('col') >= field_col + i &&
                    f.get('row') < field_row + win_length + i &&
                    f.get('row') >= field_row + i) &&
                    kx == (f.get('col') - f.get('row')) &&
                    f.get('symbol') == current_symbol;
            });
            if(diagonal_line.length >= win_length){
                console.log('WIN!!!');
                this.win(diagonal_line);
                return true;
            }
        }
        return false;
    },

    checkBottomToTopDiagonalLines: function(field_row, field_col, current_symbol, win_length){
        var kx = field_row + field_col;
        for(var i = 0; i < win_length; i++){
            var diagonal_line = _.filter(this.get('fields').models, function(f){
                return (f.get('col') > field_col - win_length - i &&
                    f.get('col') <= field_col - i &&
                    f.get('row') < field_row + win_length + i &&
                    f.get('row') >= field_row + i ||

                    f.get('col') < field_col + win_length + i &&
                    f.get('col') >= field_col + i &&
                    f.get('row') > field_row - win_length - i &&
                    f.get('row') <= field_row - i) &&
                    kx == (f.get('col') + f.get('row')) &&
                    f.get('symbol') == current_symbol;
            });
            if(diagonal_line.length >= win_length){
                console.log('WIN!!!');
                this.win(diagonal_line);
                return true;
            }
        }
        return false;
    },

    win: function(line){
        _.each(line, function(field){
            field.set('complete', true);
        });
        this.set('game_over', true);
    }
});

