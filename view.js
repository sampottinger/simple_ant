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
    context.fillRect(0, 0, constants.GRID_WIDTH * 3, constants.GRID_HEIGHT * 3);

    var maxX = grid.getXSize();
    var maxY = grid.getYSize();

    var foodDrawList = new Array();
    var pheremoneDrawList = new Array();

    // Get object locations
    for(var y=0; y<maxY; y++)
    {
        for(var x=0; x<maxX; x++)
        {
            var foodValue = grid.getPosFoodValue(x, y);
            if(foodValue > 0)
                foodDrawList.push([x, y, foodValue]);

            var pheremoneValue = grid.getPosPheremoneValue(x, y);
            if(pheremoneValue > 0.4)
                pheremoneDrawList.push([x, y]);
        }
    }

    // Draw food halo
    for(var i in foodDrawList)
    {
        var foodDrawParams = foodDrawList[i];
        var x = foodDrawParams[0];
        var y = foodDrawParams[1];
        var foodValue = foodDrawParams[2];

        console.log("here");

        context.fillStyle = "#7D3E3E";
        context.beginPath();
        context.arc(x * 2, y * 2, foodValue/3, 0, Math.PI*2, true);
        context.fill();
        context.closePath();
    }

    // Draw food center
    for(var i in foodDrawList)
    {
        var foodDrawParams = foodDrawList[i];
        var x = foodDrawParams[0];
        var y = foodDrawParams[1];

        context.fillStyle = "#C0C0C0";
        context.fillRect((x-1) * 2, (y-1) * 2, 6, 6);
    }

    // Draw pheromone
    for(var i in pheremoneDrawList)
    {
        var pheremoneDrawParams = pheremoneDrawList[i];
        var x = pheremoneDrawParams[0];
        var y = pheremoneDrawParams[1];

        context.fillStyle = "rgba(129, 178, 129, 0.5)";
        context.fillRect(x * 2, y * 2, 2, 2);
    }

    // Draw ants
    context.fillStyle = "#000000";
    for(var i in ants)
    {
        var ant = ants[i];
        context.fillRect(
            ant.getXPos() * 2,
            ant.getYPos() * 2,
            1,
            1
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
