/**
 * Logic for an ant-inspired automaton.
 * 
 * Logic for an automaton that does actuation for a pheromone-based internally
 * optimizing resource gathering network simulation.
 *
 * @author Sam Pottinger
 * @license GNU GPL v3
**/

var usingNode = typeof window === 'undefined';
var ant = {};


if(usingNode)
{
    var constants = require("./constants");
    var cbuffer = require("./cbuffer");
}


/**
 * Ant automaton.
 *
 * Ant automaton that follows and lays pheromone trails. Agent part of a larger
 * complex adaptive system for internally optimizing food gathering structure.
 * 
 * @param {int} xPos: The x position to create the ant at.
 * @param {int} yPos: The y position to create the ant at.
**/
function Ant(xPos, yPos)
{
    /**
     * Take a step, either in finding food or bringing food back to nest.
     *
     * @param {ants_grid.AntsGrid} grid The grid to take a step on.
    **/
    this.takeStep = function(grid)
    {
        if(returning)
            this.returnHome(grid);
        else
            this.explore(grid, Math.random());
    };

    /**
     * Take a step towards bringing a piece of food back.
     *
     * Take a step towards brining a piece of food this ant picked up back to
     * its nest (center of the grid).
     *
     * @param {ants_grid.AntsGrid} grid The grid to take a step on.
    **/
    this.returnHome = function(grid)
    {
        if(xPos == constants.GRID_X_CENTER && yPos == constants.GRID_Y_CENTER)
            returning = false;

        var phereOffset = constants.EVAPORATION_RATE * stepsRemainingTillHome;

        grid.changeAreaPheremoneValueDecay(
            xPos,
            yPos,
            constants.ANT_ADD_PHEREMONE_AMT + phereOffset,
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

        stepsRemainingTillHome--;
    };

    /**
     * Take a pheromone-following / random walk to find food.
     *
     * @param {ants_grid.AntsGrid} grid The grid to take a step on.
     * @param {float} Random value between [0, 1).
    **/
    this.explore = function(grid, randVal)
    {
        var selectedDirection = -1;
        var availableSpaces;
        var weightedRand;
        var totalPheremoneValue;

        var availableSpacesInfo = this.findPossibleSpaces(grid, true);
        totalPheremoneValue = availableSpacesInfo[0];
        availableSpaces = availableSpacesInfo[1];

        if(availableSpaces.length == 0)
            return;

        recntLocs.push(grid.getPosIndex(xPos, yPos));

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

    /**
     * Find the spaces where this ant can step next.
     *
     * @param {ants_grid.AntsGrid} grid The grid the ant is on.
     * @param {bool} avoidRec Avoid the last five locations this ant has
     *      visited.
     * @return {Array} Array of 2 element arrays of form
     *      [totalPheremoneValue, availableSpaces] where totalPheremoneValue is
     *      sum of the pheromone that surrounding this ant and availableSpaces
     *      is an array of form [probability, constants.*_INDEX] where
     *      probability is the weighted probability that the ant should go in
     *      the corresponding direction indicated by UP_INDEX, RIGHT_INDEX,
     *      DOWN_INDEX, or LEFT_INDEX.
    **/
    this.findPossibleSpaces = function(grid, avoidRec)
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

        // TODO: Breaking style here
        if(!avoidRec || recntLocs.indexOf(grid.getPosIndex(xPos, yPos-1)) == -1)
            includeSpace(constants.UP_INDEX);
        if(!avoidRec || recntLocs.indexOf(grid.getPosIndex(xPos+1, yPos)) == -1)
            includeSpace(constants.RIGHT_INDEX);
        if(!avoidRec || recntLocs.indexOf(grid.getPosIndex(xPos, yPos+1)) == -1)
            includeSpace(constants.DOWN_INDEX);
        if(!avoidRec || recntLocs.indexOf(grid.getPosIndex(xPos-1, yPos)) == -1)
            includeSpace(constants.LEFT_INDEX);

        if(availableSpaces.length > 0 || !avoidRec)
            return [totalPheremoneValue, availableSpaces];
        else
            return this.findPossibleSpaces(grid, false);
    };

    /**
     * Move towards a given direction.
     *
     * Move this steering-like agent (steering agent with 90deg granularity)
     * towards a given direction.
     *
     * @param {int} direction Directional constant to move towards from
     *      constants (UP_INDEX, RIGHT_INDEX, DOWN_INDEX, LEFT_INDEX).
    **/
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

    /**
     * Move towards facing north / up
    **/
    this.faceUp = function()
    {
        if(facingDirection == constants.DOWN_INDEX)
            facingDirection = Math.random() < 0.5 ? constants.LEFT_INDEX : constants.RIGHT_INDEX;
        else
            facingDirection = constants.UP_INDEX;
    }

    /**
     * Move towards facing right / west
    **/
    this.faceRight = function()
    {
        if(facingDirection == constants.LEFT_INDEX)
            facingDirection = Math.random() < 0.5 ? constants.UP_INDEX : constants.DOWN_INDEX;
        else
            facingDirection = constants.RIGHT_INDEX;
    }

    /**
     * Move towards facing south / down
    **/
    this.faceDown = function()
    {
        if(facingDirection == constants.UP_INDEX)
            facingDirection = Math.random() < 0.5 ? constants.LEFT_INDEX : constants.RIGHT_INDEX;
        else
            facingDirection = constants.DOWN_INDEX;
    }

    /**
     * Move towards facing west / left
    **/
    this.faceLeft = function()
    {
        if(facingDirection == constants.RIGHT_INDEX)
            facingDirection = Math.random() < 0.5 ? constants.UP_INDEX : constants.DOWN_INDEX;
        else
            facingDirection = constants.LEFT_INDEX;
    }

    /**
     * Check to see if this ant has found food.
    **/
    this.checkForFood = function(grid)
    {
        for(var y=yPos-constants.FOOD_RAD; y<yPos+constants.FOOD_RAD; y++)
        {
            for(var x=xPos-constants.FOOD_RAD; x<xPos+constants.FOOD_RAD; x++)
            {
                if(grid.getPosFoodValue(x, y) > 0)
                {
                    grid.changePosFoodValue(x, y, -1);
                    returning = true;
                    stepsRemainingTillHome = this.calculateStepsTillHome();
                }
            }
        }
    };

    this.calculateStepsTillHome = function()
    {
        var deltaX = Math.abs(constants.GRID_X_CENTER - xPos);
        var deltaY = Math.abs(constants.GRID_Y_CENTER - yPos);
        return Math.max(deltaX, deltaY);
    }

    /**
     * Get this ant's current x position.
     *
     * @return {int} The current x coordinate of this ant.
    **/
    this.getXPos = function()
    {
        return xPos;
    };

    /**
     * Get this ant's current y position.
     *
     * @return {int} The current y coordinate of this ant.
    **/
    this.getYPos = function()
    {
        return yPos;
    };

    /**
     * Set the returning / food finding state of this ant.
     *
     * @param {bool} newReturning true if the ant should be returning with food
     *      and false if the ant should be looking for food.
    **/
    this.debugSetState = function(newReturning)
    {
        returning = newReturning;
    };

    /**
     * Determine if this ant is looking for food or returning with food.
     *
     * @return {bool} true if the ant is returning with food and false if the
     *      ant is looking for food.
    **/
    this.debugIsReturning = function()
    {
        return returning;
    };

    var returning = false;
    var recntLocs = new cbuffer.CBuffer(5);
    var facingDirection = -1;
    var stepsRemainingTillHome = 0;
}

if(usingNode)
{
    exports.Ant = Ant;
}
else
{
    ant.Ant = Ant;
}
