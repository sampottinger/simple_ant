var usingNode = typeof window === 'undefined';
var ant = {};

if(usingNode)
{
    var constants = require("./constants");
}

function Ant(xPos, yPos)
{
    this.takeStep = function(grid)
    {
        if(returning)
            this.returnHome(grid);
        else
            this.explore(grid);
    }

    this.returnHome = function(grid)
    {
        grid.changeFoodValue(xPos, yPos, constants.ANT_ADD_PHEREMONE_AMT);
        var nextPos = pathOut.pop();
        xPos = nextPos[0];
        yPos = nextPos[1];
        if(pathOut.length == 0)
            returning = false;
    }

    this.explore = function(grid)
    {
        var surroundingValues = grid.getSurroundingValues(xPos, yPos);
        var availableSpaces = new Array();
        var totalPheremoneValue = 0;
        var availableSpacesCount = 0;
        var selectedDirection = -1;

        var includeSpace = function(index)
        {
            var surroundingValue = surroundingValues[index];

            if(surroundingValue < 0)
                return;

            availableSpaces.push([totalPheremoneValue, index]);
            totalPheremoneValue += constants.MIN_PHEREMONE_VALUE_CHANCE;
            availableSpacesCount++;
        }

        includeSpace(constants.UP_INDEX);
        includeSpace(constants.RIGHT_INDEX);
        includeSpace(constants.DOWN_INDEX);
        includeSpace(constants.LEFT_INDEX);

        if(availableSpacesCount <= 0)
            return;

        pathOut.push([xPos, yPos]);

        var weightedRand = Math.random() * totalPheremoneValue;
        for(var i in availableSpaces)
        {
            weightedRand -= availableSpaces[i][0];
            if(weightedRand <= 0)
            {
                selectedDirection = availableSpaces[i][1];
                break;
            }
        }

        switch(selectedDirection)
        {
        case constants.UP_INDEX:
            yPos--;
            break;
        case constants.RIGHT_INDEX:
            xPos++;
            break;
        case constants.DOWN_INDEX:
            yPos++;
            break;
        case constants.LEFT_INDEX:
            xPos--;
            break;
        default:
            throw "No direction selected for ant";
        }

        if(grid.getFoodValue(xPos, yPos) > 0)
            returning = true;
    }

    var curReturnIndex;
    var returning = false;
    var pathOut = new Array();
}

if(usingNode)
{
    exports.Ant = Ant;
}
else
{
    ant.Ant = Ant;
}
