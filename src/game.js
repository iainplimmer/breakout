var BreakOut = (function() {

    //  Set our constants first......
    const refreshRateInMilliseconds = 1;
    const canvasWidth = 400;
    const canvasHeight = 300;
    const increment = 1;

    //  Create any common variables that are needed here
    var canvas;
    var ctx;     
    var x_increment = increment;
    var y_increment = increment;

    //  Stores the current ball position
    var ball = {
        x : canvasWidth / 2,
        y : canvasHeight / 2,
        radius : 10
    }

    //  Function to call that sets up the game canvas
    function Setup () {
        canvas = document.getElementById('GameCanvas');
        ctx = canvas.getContext("2d");
        canvas.width  = canvasWidth;    
        canvas.height = canvasHeight;
        
        //  Draw the game
        RefreshFrame();
    }

    //  The main loop that the game will run on is here, we clear the canvas, 
    //  draw the ball, check for collisions, game over and then call it all again.
    function RefreshFrame () {

        if (ball.x == (canvasWidth - ball.radius) || ball.x == ball.radius) {
            x_increment = -x_increment;
        }
        
        if (ball.y == (canvasHeight - ball.radius) || ball.y == ball.radius) {
            y_increment = -y_increment;
        }

        ball.x = ball.x + x_increment;
        ball.y = ball.y + y_increment;

        ClearCanvas (); 
        DrawBall(ball.x, ball.y, ball.radius);
        
        setTimeout(RefreshFrame, refreshRateInMilliseconds);
    }

    //  Draws a crude ball on the canvas
    function DrawBall (x, y, radius) {
        ctx.beginPath();
        ctx.arc(x,y,radius,0,2*Math.PI);
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.stroke();
    }

    function ClearCanvas () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } 

    return {
        Setup : Setup
    };

})();