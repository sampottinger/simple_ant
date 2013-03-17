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
    context.fillRect(0, 0, constants.GRID_WIDTH, constants.GRID_HEIGHT);

    var maxX = grid.getXSize();
    var maxY = grid.getYSize();

    // Draw food
    for(var y=0; y<maxY; y++)
    {
        for(var x=0; x<maxX; x++)
        {
            var foodValue = grid.getPosFoodValue(x, y);
            if(foodValue > 0)
            {
                context.fillStyle = "#7D3E3E";
                context.beginPath();
                context.arc(x,y,1*foodValue,0,Math.PI*2,true);
                context.fill();
                context.closePath();

                context.fillStyle = "#C0C0C0";
                context.fillRect(
                    x-1,
                    y-1,
                    3,
                    3
                );
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
