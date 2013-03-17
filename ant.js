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
            this.explore(grid, Math.random());
    };

    this.returnHome = function(grid)
    {
        if(pathOut.length == 0)
            returning = false;

        var nextPos = pathOut.pop();

        grid.changeAreaPheremoneValueDecay(
            xPos,
            yPos,
            constants.ANT_ADD_PHEREMONE_AMT,
            constants.PHEREMONE_DISPERSE_DECAY
        );

        xPos = nextPos[0];
        yPos = nextPos[1];
    };

    this.explore = function(grid, randVal)
    {
        var selectedDirection = -1;
        var availableSpaces;
        var weightedRand;
        var totalPheremoneValue;

        var availableSpacesInfo = this.findAvailableSpaces(grid);
        totalPheremoneValue = availableSpacesInfo[0];
        availableSpaces = availableSpacesInfo[1];

        if(availableSpaces.length == 0)
            return;

        pathOut.push([xPos, yPos]);

        weightedRand = randVal * totalPheremoneValue;
        for(var i in availableSpaces)
        {
            weightedRand -= availableSpaces[i][0];
            if(weightedRand <= 0)
            {
                selectedDirection = availableSpaces[i][1];
                break;
            }
        }

        this.moveDirection(selectedDirection);
        this.checkForFood(grid);
    };

    this.findAvailableSpaces = function(grid)
    {
        var surroundingValues = grid.getSurroundingPheremoneValues(xPos, yPos);
        var availableSpaces = new Array();
        var totalPheremoneValue = 0;

        var includeSpace = function(index)
        {
            var surroundingValue = surroundingValues[index];

            if(surroundingValue < 0)
                return;

            availableSpaces.push([totalPheremoneValue, index]);

            if(surroundingValue == 0)
                totalPheremoneValue += constants.MIN_PHEREMONE_VALUE_CHANCE;
            else
                totalPheremoneValue += surroundingValue;
        }

        includeSpace(constants.UP_INDEX);
        includeSpace(constants.RIGHT_INDEX);
        includeSpace(constants.DOWN_INDEX);
        includeSpace(constants.LEFT_INDEX);

        return [totalPheremoneValue, availableSpaces];
    };

    this.moveDirection = function(direction)
    {
        switch(direction)
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
    };

    this.checkForFood = function(grid)
    {
        if(grid.getPosFoodValue(xPos, yPos) > 0)
        {
            grid.changePosFoodValue(xPos, yPos, -1);
            returning = true;
        }
    };

    this.getXPos = function()
    {
        return xPos;
    };

    this.getYPos = function()
    {
        return yPos;
    };

    this.debugSetState = function(newReturning)
    {
        returning = newReturning;
    };

    this.debugPushToPathOut = function(newPos)
    {
        pathOut.push(newPos);
    };

    this.debugGetPathOut = function()
    {
        return pathOut;
    }

    this.debugIsReturning = function()
    {
        return returning;
    };

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
