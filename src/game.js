var BreakOut = (function() {

    //  Set our constants first......
    const refreshRateInMilliseconds = 1;
    const canvasWidth = 400;
    const canvasHeight = 300;
    const increment = 1;

    //  Create any common variables that are needed here
    var canvas;
    var ctx;    
    var ball;                    //  Current ball object state
    var x_increment = increment; //  Current ball X position
    var y_increment = increment; //  Current ball Y position
    var player = {               //  Current player information   
        score : 0,
        lives : 3
    }
    
    //  Function to call that sets up the game canvas
    function Setup () {
        canvas = document.getElementById('GameCanvas');
        ctx = canvas.getContext("2d");
        canvas.width  = canvasWidth;    
        canvas.height = canvasHeight;
        
        //  Create the ball and start the game loop
        ResetBall();
        setTimeout(RefreshFrame, refreshRateInMilliseconds);
    }

    function ResetBall () {
        ball = {
            x : canvasWidth / 2,
            y : canvasHeight / 2,
            radius : 10
        }
        x_increment = increment;
        y_increment = increment;
    }

    //  The main loop that the game will run on is here, we clear the canvas, 
    //  draw the ball, check for collisions, game over and then call it all again.
    function RefreshFrame () {

        //  Hits any wall
        if (ball.x == (canvasWidth - ball.radius) || ball.x == ball.radius) {
            x_increment = -x_increment;
        }
        
        //  Hits the top
        if (ball.y == ball.radius) {
            y_increment = -y_increment;
        }

        //  Goes off the bottom of the screen completely
        if (ball.y == canvasHeight + ball.radius){
            ResetBall();
            player.lives--;
        }

        ClearCanvas (); 
        DrawBall(ball.x, ball.y, ball.radius);

        ball.x = ball.x - x_increment;
        ball.y = ball.y - y_increment;

        player.score++
        document.getElementById('Score').innerText = player.score;
        document.getElementById('Lives').innerText = player.lives;

        //  Check if the player has any lives left
        if (player.lives > 0) {
            setTimeout(RefreshFrame, refreshRateInMilliseconds);
        }
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