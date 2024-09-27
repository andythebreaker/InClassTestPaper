setInterval(function () {
    const btn = document.querySelector('.btn-60');
    btn.classList.add('animate-jello');
    setTimeout(function () {
        btn.classList.remove('animate-jello');
    }, 800);
}, 1600);

document.getElementById('FULLSCREENANDCLEAR').addEventListener('click', function () {
    if (document.getElementById('STRONGFC').classList.contains('CONTAINERSVGSTRONG')) {
        document.getElementById('STRONGFC').classList.remove('CONTAINERSVGSTRONG');
    } else {
        document.getElementById('STRONGFC').classList.add('CONTAINERSVGSTRONG');
    }
});

// Get the SVG path element by its ID
var InClassTestPaperROW1 = document.getElementById('InClassTestPaperROW1');
//InClassTestPaperROW2~18
var InClassTestPaperROW2 = document.getElementById('InClassTestPaperROW2');
var InClassTestPaperROW3 = document.getElementById('InClassTestPaperROW3');
var InClassTestPaperROW4 = document.getElementById('InClassTestPaperROW4');
var InClassTestPaperROW5 = document.getElementById('InClassTestPaperROW5');
var InClassTestPaperROW6 = document.getElementById('InClassTestPaperROW6');
var InClassTestPaperROW7 = document.getElementById('InClassTestPaperROW7');
var InClassTestPaperROW8 = document.getElementById('InClassTestPaperROW8');
var InClassTestPaperROW9 = document.getElementById('InClassTestPaperROW9');
var InClassTestPaperROW10 = document.getElementById('InClassTestPaperROW10');
var InClassTestPaperROW11 = document.getElementById('InClassTestPaperROW11');
var InClassTestPaperROW12 = document.getElementById('InClassTestPaperROW12');
var InClassTestPaperROW13 = document.getElementById('InClassTestPaperROW13');
var InClassTestPaperROW14 = document.getElementById('InClassTestPaperROW14');
var InClassTestPaperROW15 = document.getElementById('InClassTestPaperROW15');
var InClassTestPaperROW16 = document.getElementById('InClassTestPaperROW16');
var InClassTestPaperROW17 = document.getElementById('InClassTestPaperROW17');
var InClassTestPaperROW18 = document.getElementById('InClassTestPaperROW18');

function ICTPaddTEXT(InClassTestPaperROW0, mytext) {
    // Check if the SVG path element exists
    if (InClassTestPaperROW0) {
        // Get the value of the 'd' attribute
        var dAttribute = InClassTestPaperROW0.getAttribute('d');

        // Output the value of the 'd' attribute
        console.log("The value of the 'd' attribute is:", dAttribute);

        function getMinMaxCoordinatesFromSVGPath(dAttribute) {
            var translateX = 0;
            var translateY = 0;

            // Get the transform attribute
            var transformAttribute = InClassTestPaperROW0.getAttribute('transform');

            // Parse the translate values if transform attribute exists
            if (transformAttribute) {
                var matrixMatch = transformAttribute.match(/matrix\(([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+)\)/);
                if (matrixMatch) {
                    translateX = parseFloat(matrixMatch[5]) || 0;
                    translateY = parseFloat(matrixMatch[6]) || 0;
                }
            }

            // Split the d attribute into individual path commands
            var pathCommands = dAttribute.split(/[MLHVCSQTZ]/i).filter(Boolean);

            // Initialize min and max values
            var xMin = Number.POSITIVE_INFINITY;
            var xMax = Number.NEGATIVE_INFINITY;
            var yMin = Number.POSITIVE_INFINITY;
            var yMax = Number.NEGATIVE_INFINITY;

            // Iterate over path commands to find min and max values
            pathCommands.forEach(function (command) {
                updateMinMaxCoordinates(command);
            });

            // Return min and max coordinates
            return {
                xMin: xMin,
                xMax: xMax,
                yMin: yMin,
                yMax: yMax
            };

            function updateMinMaxCoordinates(command) {
                var coordinates = command.trim().split(/[ ,]+/);

                for (var i = 0; i < coordinates.length; i += 2) {
                    var x = parseFloat(coordinates[i]) + translateX; // Add translateX
                    var y = parseFloat(coordinates[i + 1]) - translateY; // Add translateY

                    if (!isNaN(x) && !isNaN(y)) {
                        xMin = Math.min(xMin, x);
                        xMax = Math.max(xMax, x);
                        yMin = Math.min(yMin, y);
                        yMax = Math.max(yMax, y);
                    }
                }
            }
        }

        // Usage example:
        var minMaxCoordinates = getMinMaxCoordinatesFromSVGPath(dAttribute);
        console.log("x-min:", Math.abs(minMaxCoordinates.xMin));
        console.log("x-max:", Math.abs(minMaxCoordinates.xMax));
        console.log("y-min:", Math.abs(minMaxCoordinates.yMin));
        console.log("y-max:", Math.abs(minMaxCoordinates.yMax));
        var centerxy = { x: (Math.abs(minMaxCoordinates.xMin) + Math.abs(minMaxCoordinates.xMax)) / 2, y: (Math.abs(minMaxCoordinates.yMin) + Math.abs(minMaxCoordinates.yMax)) / 2 };
        console.log(centerxy);

        let textElem = document.createElementNS(InClassTestPaperROW0.namespaceURI, "text");
        textElem.setAttribute("x", centerxy.x);
        textElem.setAttribute("y", centerxy.y);
        // Centre text horizontally at x,y
        textElem.setAttribute("text-anchor", "middle");
        // Give it a class that will determine the text size, colour, etc
        textElem.classList.add("label-text");
        // Set the text
        textElem.textContent = mytext;
        // Add this text element directly after the label background path
        InClassTestPaperROW0.after(textElem);

    } else {
        console.error("SVG path element with ID 'InClassTestPaperROW0' not found.");
    }
}

ICTPaddTEXT(InClassTestPaperROW1, "我愛品涵");
ICTPaddTEXT(InClassTestPaperROW2, "我愛黃昱燕");
ICTPaddTEXT(InClassTestPaperROW18, "我愛李佳俐");