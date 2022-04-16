var canvas = document.querySelector("canvas");

canvas.width = "1000";
canvas.height = "1000";

const ctx = canvas.getContext("2d");

// gridState nxn array of 0s
function gridEmptyState(n) {
    let grid = [];
    for (let i = 0; i < n; i++) {
        grid.push([]);
        for (let j = 0; j < n; j++) {
            grid[i].push(0);
        }
    }
    return grid;
}

let gridState = gridEmptyState(1000);
let oldGridState = gridState;

// function fadeOutRectangle(x, y, w, h, r, g, b) {
//     var steps = 2,
//         dr = (255 - r) / steps, // how much red should be added each time
//         dg = (255 - g) / steps, // green
//         db = (255 - b) / steps, // blue
//         i = 0, // step counter
//         interval = setInterval(function() {
//             ctx.fillStyle = 'rgb(' + Math.round(r + dr * i) + ','
//                                    + Math.round(g + dg * i) + ','
//                                    + Math.round(b + db * i) + ')';
//             ctx.fillRect(x, y, w, h); // will redraw the area each time
//             i++;
//             if(i === steps) { // stop if done
//                 ctx.fillStyle = "white";
//                 ctx.fillRect(x, y, w, h);
//                 clearInterval(interval);
//             }
//         }, 5);
// }


// draw gridState on canvas
function drawGridState(n) {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (gridState[i][j] === 1) {
                ctx.fillStyle = "red";
                ctx.fillRect(i * 10, j * 10, 10, 10);
            }
            else{
                ctx.fillStyle = "white";
                ctx.fillRect(i * 10, j * 10, 10, 10);
            }
        }
    }
}


// draw nxn grid on canvas
function drawEmptyGrid(n) {
    for (let i = 1; i < n-1; i++) {
        for (let j = 1; j < n-1; j++) {
            ctx.beginPath();
            ctx.rect(i * canvas.width / n, j * canvas.height / n, canvas.width / n, canvas.height / n);
            ctx.stroke();
        }
    }
}

// click on grid(x,y) fill grid with color
// function clickGrid(n, x, y) {
    //     ctx.fillStyle = "black";
    //     ctx.fillRect(x * canvas.width / n, y * canvas.height / n, canvas.width / n, canvas.height / n);
    // }
    
    function getCoords(e) {
        const { x, y } = e.target.getBoundingClientRect();
        const mouseX = e.clientX - x;
        const mouseY = e.clientY - y;
        
        return [Math.floor(mouseX / 10), Math.floor(mouseY / 10)];
    }
    
    var drawing = false;
    
    // canvas mousedown event listener to fill grid with color
    canvas.addEventListener("mousedown", (e) => {
        drawing = true;
        const [x, y] = getCoords(e);
        // clickGrid(20, x, y);
        if (gridState[x][y] === 0) {
            gridState[x][y] = 1;
        }
        else {
            gridState[x][y] = 0;
        }
    drawGridState(100);
    // drawEmptyGrid(100);
    console.log(x,y);
});

// canvas mouseup event to stop drawing
canvas.addEventListener("mouseup", (e) => {
    drawing = false;
});

// canvas mouseaway event to stop drawing
canvas.addEventListener("mouseleave", (e) => {
    drawing = false;
});


// canvas mousemove event listener to fill grid with color
canvas.addEventListener("mousemove", (e) => {
    if (drawing) {
        const [x, y] = getCoords(e);
        // clickGrid(20, x, y);
        gridState[x][y] = 1;
        drawGridState(100);
        // drawEmptyGrid(100)
        console.log(x,y);
    }
});


// check game of life conditions and return new gridState
function checkGameOfLife(n) {
    let newGrid = gridEmptyState(n);
    for (let i = 1; i < n-1; i++) {
        for (let j = 1; j < n-1; j++) {
            let neighbors = 0;
            for (let k = -1; k <= 1; k++) {
                for (let l = -1; l <= 1; l++) {
                    if (k === 0 && l === 0) {
                        continue;
                    }
                    if (gridState[i+k][j+l] === 1) {
                        neighbors++;
                    }
                }
            }
            if (gridState[i][j] === 1) {
                if (neighbors < 2 || neighbors > 3) {
                    newGrid[i][j] = 0;
                } else {
                    newGrid[i][j] = 1;
                }
            } else {
                if (neighbors === 3) {
                    newGrid[i][j] = 1;
                }
            }
        }
    }
    return newGrid;
}

// check if oldGridState === gridState
function checkGridState(n) {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (gridState[i][j] !== oldGridState[i][j]) {
                return false;
            }
            
        }
    }
    return true;
}


// run game of life every 1 second 
function runGameOfLife() {
    let gen = 0;
    let mainLoop = setInterval(() => {
        drawGridState(100);
        // drawEmptyGrid(100);
        oldGridState = gridState;
        gridState = checkGameOfLife(100);
        
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (checkGridState(100)) {
            clearInterval(mainLoop);
            console.log("Game Over");
        }
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(`Generation: ${gen}`, 20, 16);
        
        gen += 1;
        console.log("generation: " + gen);
    }, 100);
    
}

drawGridState(100);
// drawEmptyGrid(100);

// ctx.fillStyle = "black";
// ctx.fillRect(0, 0, canvas.width, canvas.height);


// fadeOutRectangle(0,0, canvas.width, canvas.width, 255, 0, 0);
// fadeOutRectangle(0, 0, canvas.width, canvas.height);