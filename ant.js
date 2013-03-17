var usingNode = typeof window === 'undefined';
var ant = {};

if(usingNode)
{
    var constants = require("./constants");
    var cbuffer = require("./cbuffer");
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
        if(xPos == constants.GRID_X_CENTER && yPos == constants.GRID_Y_CENTER)
            returning = false;

        grid.changeAreaPheremoneValueDecay(
            xPos,
            yPos,
            constants.ANT_ADD_PHEREMONE_AMT,
            constants.PHEREMONE_DISPERSE_DECAY
        );

        if(xPos > constants.GRID_X_CENTER)
            xPos--;
        if(xPos < constants.GRID_X_CENTER)
            xPos++;
        if(yPos > constants.GRID_Y_CENTER)
            yPos--;
        if(yPos < constants.GRID_Y_CENTER)
            yPos++;
    };

    this.explore = function(grid, randVal)
    {
        var selectedDirection = -1;
        var availableSpaces;
        var weightedRand;
        var totalPheremoneValue;

        var availableSpacesInfo = this.findAvailableSpaces(grid, true);
        totalPheremoneValue = availableSpacesInfo[0];
        availableSpaces = availableSpacesInfo[1];

        if(availableSpaces.length == 0)
            return;

        recentLocs.push(grid.getPosIndex(xPos, yPos));

        weightedRand = randVal * totalPheremoneValue;
        for(var i in availableSpaces)
        {
            if(weightedRand < availableSpaces[i][0])
            {
                selectedDirection = availableSpaces[i][1];
                break;
            }
        }

        this.moveDirection(selectedDirection);
        this.checkForFood(grid);
    };

    this.findAvailableSpaces = function(grid, checkingRecent)
    {
        var surroundingValues = grid.getSurroundingPheremoneValues(xPos, yPos);
        var availableSpaces = new Array();
        var totalPheremoneValue = 0;

        var includeSpace = function(index)
        {
            var surroundingValue = surroundingValues[index];

            if(surroundingValue < 0)
                return;

            if(surroundingValue == 0)
                totalPheremoneValue += constants.MIN_PHEREMONE_VALUE_CHANCE;
            else
                totalPheremoneValue += surroundingValue;

            availableSpaces.push([totalPheremoneValue, index]);
        }

        if(!checkingRecent || recentLocs.indexOf(grid.getPosIndex(xPos, yPos-1)) == -1)
            includeSpace(constants.UP_INDEX);
        if(!checkingRecent || recentLocs.indexOf(grid.getPosIndex(xPos+1, yPos)) == -1)
            includeSpace(constants.RIGHT_INDEX);
        if(!checkingRecent || recentLocs.indexOf(grid.getPosIndex(xPos, yPos+1)) == -1)
            includeSpace(constants.DOWN_INDEX);
        if(!checkingRecent || recentLocs.indexOf(grid.getPosIndex(xPos-1, yPos)) == -1)
            includeSpace(constants.LEFT_INDEX);

        if(availableSpaces.length > 0 || !checkingRecent)
            return [totalPheremoneValue, availableSpaces];
        else
            return this.findAvailableSpaces(grid, false);
    };

    this.moveDirection = function(direction)
    {
        if(facingDirection == -1)
            facingDirection = direction;

        switch(direction)
        {
        case constants.UP_INDEX:
            this.faceUp();
            break;
        case constants.RIGHT_INDEX:
            this.faceRight();
            break;
        case constants.DOWN_INDEX:
            this.faceDown();
            break;
        case constants.LEFT_INDEX:
            this.faceLeft();
            break;
        default:
            throw "No direction selected for ant";
        }

        switch(facingDirection)
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

    this.faceUp = function()
    {
        if(facingDirection == constants.DOWN_INDEX)
            facingDirection = Math.random() < 0.5 ? constants.LEFT_INDEX : constants.RIGHT_INDEX;
        else
            facingDirection = constants.UP_INDEX;
    }

    this.faceRight = function()
    {
        if(facingDirection == constants.LEFT_INDEX)
            facingDirection = Math.random() < 0.5 ? constants.UP_INDEX : constants.DOWN_INDEX;
        else
            facingDirection = constants.RIGHT_INDEX;
    }

    this.faceDown = function()
    {
        if(facingDirection == constants.UP_INDEX)
            facingDirection = Math.random() < 0.5 ? constants.LEFT_INDEX : constants.RIGHT_INDEX;
        else
            facingDirection = constants.DOWN_INDEX;
    }

    this.faceLeft = function()
    {
        if(facingDirection == constants.RIGHT_INDEX)
            facingDirection = Math.random() < 0.5 ? constants.UP_INDEX : constants.DOWN_INDEX;
        else
            facingDirection = constants.LEFT_INDEX;
    }

    this.checkForFood = function(grid)
    {
        for(var y=yPos-2; y<yPos+2; y++)
        {
            for(var x=xPos-2; x<xPos+2; x++)
            {
                if(grid.getPosFoodValue(x, y) > 0)
                {
                    grid.changePosFoodValue(x, y, -1);
                    returning = true;
                }
            }
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

    this.debugIsReturning = function()
    {
        return returning;
    };

    var returning = false;
    var recentLocs = new cbuffer.CBuffer(5);
    var facingDirection = -1;
}

if(usingNode)
{
    exports.Ant = Ant;
}
else
{
    ant.Ant = Ant;
}
