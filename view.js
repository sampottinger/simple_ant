var usingNode = typeof window === 'undefined';
var view = {};

if(usingNode)
{
    var constants = require("./constants");
}

var drawGrid = function(grid, ants)
{
    var canvas = $(constants.DISPLAY_CANVAS_ID)[0];
    var context = canvas.getContext("2d");

    context.strokeStyle = "#FFFFFF";
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);

    var maxX = grid.getXSize();
    var maxY = grid.getYSize();

    // Draw food
    context.fillStyle = "#7D3E3E";
    for(int y=0; y<maxY; y++)
    {
        for(int x=0; x<maxX; x++)
        {
            var foodValue = grid.getPosFoodValue(x, y);
            if(foodValue > 0)
            {
                context.beginPath();
                context.arc(x,y,2*foodValue,0,Math.PI*2,true);
                context.fill();
                context.closePath();
            }
        }
    }

    // Draw ants
    context.fillStyle = "#000000";
    for(var i in ants)
    {
        var ant = ants[i];
        context.fillRect(
            ant.getXPos()-1,
            ant.getYPos()-1,
            3,
            3
        );
    }
};

if(usingNode)
{
    exports.drawGrid = drawGrid;
}
else
{
    view.drawGrid = drawGrid;
}
