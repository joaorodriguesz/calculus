let xValues = [];
let yValues = [];
const TYPE = { LINEAR: "linear", QUADRATIC: "quadratic" };

const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

function addPoint() {
    const x = parseFloat(document.getElementById('x').value);
    const y = parseFloat(document.getElementById('y').value);

    if (!isNaN(x) && !isNaN(y)) {
        xValues.push(x);
        yValues.push(y);

        updateTable();

        document.getElementById('x').value = '';
        document.getElementById('y').value = '';
    } else {
        alert('Por favor, insira valores numéricos válidos.');
    }
}

function updateTable() {
    const pointsDiv = document.getElementById('points');
    let table = '';
    if (xValues.length > 0) {
        table = '<table class="table table-sm table-hover">';
        table += '<thead>';
        table += '<tr>';
        table += '<th>X</th>';
        table += '<th>Y</th>';
        table += '<th>X*Y</th>';
        table += '<th>X²</th>';
        // table += '<th></th>';
        table += '</tr>';
        table += '</thead>';
        table += '<tbody>';
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        for (let i = 0; i < xValues.length; i++) {
            const xy = xValues[i] * yValues[i];
            const x2 = xValues[i] * xValues[i];
            sumX += xValues[i];
            sumY += yValues[i];
            sumXY += xy;
            sumX2 += x2;
            table += '<tr>';
            table += `<td>${xValues[i]}</td>`;
            table += `<td>${yValues[i]}</td>`;
            table += `<td>${xy.toFixed(2)}</td>`;
            table += `<td>${x2.toFixed(2)}</td>`;
            // table += `<td><button class="btn btn-danger btn-sm" onclick="removePoint(${i})">Remover</button></td>`;
            table += '</tr>';
        }

        if (xValues.length > 2) {
            table += '<tr>';
            table += `<td><strong>∑X = ${sumX.toFixed(2)}</strong></td>`;
            table += `<td><strong>∑Y = ${sumY.toFixed(2)}</strong></td>`;
            table += `<td><strong>∑XY = ${sumXY.toFixed(2)}</strong></td>`;
            table += `<td><strong>∑X² = ${sumX2.toFixed(2)}</strong></td>`;
            // table += `<td></td>`;
            table += '</tr>';
        }

        table += '</tbody>';
        table += '</table>';
    }
    pointsDiv.innerHTML = table;
}

function clearAll() {
    xValues = [];
    yValues = [];
    updateTable();
    document.getElementById('result').innerText = '';
    clearCanvas();
    location.reload();
}

function removePoint(index) {
    xValues.splice(index, 1);
    yValues.splice(index, 1);
    updateTable();
}

function fitFirstDegree() {
    if (xValues.length < 2) {
        alert('Pelo menos 2 pontos são necessários.');
        return;
    }

    const data = xValues.map((x, i) => [x, yValues[i]]);
    const result = regression.linear(data);
    const a = result.equation[0];
    const b = result.equation[1];

    document.getElementById('result').innerText = `Primeiro Grau: y = ${a.toFixed(2)}x + ${b.toFixed(2)}`;

    clearCanvas();
    drawGrid();
    drawAxisNumbers();
    desenharFuncaoPrimeiroGrau(a, b);
    plotPoints();
}

function fitSecondDegree() {
    if (xValues.length < 3) {
        alert('Pelo menos 3 pontos são necessários.');
        return;
    }

    const data = xValues.map((x, i) => [x, yValues[i]]);
    const result = regression.polynomial(data, { order: 2 });
    const a = result.equation[0];
    const b = result.equation[1];
    const c = result.equation[2];

    document.getElementById('result').innerText = `Segundo Grau: y = ${a.toFixed(2)}x² + ${b.toFixed(2)}x + ${c.toFixed(2)}`;

    clearCanvas();
    drawGrid();
    drawAxisNumbers();
    desenharFuncaoSegundoGrau(a, b, c);
    plotPoints();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawGrid() {
    const step = 50;
    ctx.beginPath();
    for (let i = step; i < canvas.width; i += step) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
    }
    ctx.strokeStyle = "#ddd";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.strokeStyle = "#000";
    ctx.stroke();
}

function drawAxisNumbers() {
    const step = 50;
    const scale = 1;

    for (let i = canvas.width / 2 + step; i < canvas.width; i += step) {
        ctx.fillText(
            ((i - canvas.width / 2) / step) * scale,
            i,
            canvas.height / 2 + 15
        );
    }
    for (let i = canvas.width / 2 - step; i > 0; i -= step) {
        ctx.fillText(
            (-(canvas.width / 2 - i) / step) * scale,
            i,
            canvas.height / 2 + 15
        );
    }
    for (let i = canvas.height / 2 + step; i < canvas.height; i += step) {
        ctx.fillText(
            (-(i - canvas.height / 2) / step) * scale,
            canvas.width / 2 - 20,
            i
        );
    }
    for (let i = canvas.height / 2 - step; i > 0; i -= step) {
        ctx.fillText(
            ((canvas.height / 2 - i) / step) * scale,
            canvas.width / 2 - 20,
            i
        );
    }
}

function plotPoints() {
    for (let i = 0; i < xValues.length; i++) {
        plotPoint(xValues[i], yValues[i]);
    }
}

function plotPoint(x, y, color = "red") {
    const scale = 50;
    ctx.beginPath();
    ctx.arc(
        canvas.width / 2 + x * scale,
        canvas.height / 2 - y * scale,
        5,
        0,
        2 * Math.PI
    );
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillText(
        `(${x.toFixed(2)}, ${y.toFixed(2)})`,
        canvas.width / 2 + x * scale,
        canvas.height / 2 - y * scale - 10
    );
}

function drawLine(x1, y1, x2, y2, color = "green") {
    const scale = 50;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 + x1 * scale, canvas.height / 2 - y1 * scale);
    ctx.lineTo(canvas.width / 2 + x2 * scale, canvas.height / 2 - y2 * scale);
    ctx.strokeStyle = color;
    ctx.stroke();
}

function desenharFuncaoPrimeiroGrau(a, b) {
    const step = 0.1;
    let lastX = -10;
    let lastY = a * lastX + b;

    for (let x = -10; x <= 10; x += step) {
        const y = a * x + b;
        drawLine(lastX, lastY, x, y, "red");
        lastX = x;
        lastY = y;
    }
}

function desenharFuncaoSegundoGrau(a, b, c) {
    const step = 0.1;
    let lastX = -10;
    let lastY = a * lastX * lastX + b * lastX + c;

    for (let x = -10; x <= 10; x += step) {
        const y = a * x * x + b * x + c;
        drawLine(lastX, lastY, x, y, "green");
        lastX = x;
        lastY = y;
    }
}

drawGrid();
drawAxisNumbers();
