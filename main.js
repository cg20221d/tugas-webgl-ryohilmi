function main() {
  let canvas = document.getElementById("kanvas");
  let gl = canvas.getContext("webgl");

  let number9 = [
    // '9'
    [
      [
        [0, 0.65],
        [0.65, 0.65],
        [0.65, -0.25],
        [0, -0.25],
      ],
      [
        [0, 0.55],
        [0.55, 0.55],
        [0.55, -0.15],
        [0, -0.15],
      ],
    ],
    [
      [
        [0, 0.65],
        [-0.65, 0.65],
        [-0.65, -0.25],
        [0, -0.25],
      ],
      [
        [0, 0.55],
        [-0.55, 0.55],
        [-0.55, -0.15],
        [0, -0.15],
      ],
    ],
    [
      [
        [-0.0, 0.65],
        [0.7, 0.65],
        [0.7, -0.55],
        [-0.3, -0.75],
      ],
      [
        [-0.0, 0.55],
        [0.6, 0.55],
        [0.6, -0.45],
        [-0.3, -0.75],
      ],
    ],
  ];

  let number2 = [
    // '2'
    [
      [
        [0, 0.65],
        [-0.65, 0.65],
        [-0.65, 0.15],
        [-0.1, 0.15],
      ],
      [
        [0, 0.55],
        [-0.55, 0.55],
        [-0.55, 0.15],
        [-0.1, 0.15],
      ],
    ],
    [
      [
        [-0.0, 0.65],
        [0.7, 0.65],
        [0.7, -0.55],
        [-0.5, -0.75],
      ],
      [
        [-0.0, 0.55],
        [0.6, 0.55],
        [0.6, -0.45],
        [-0.5, -0.65],
      ],
    ],
    [
      [
        [-0.5, -0.65],
        [-0.5, -0.65],
        [0.5, -0.65],
        [0.5, -0.7],
      ],
      [
        [-0.5, -0.75],
        [-0.5, -0.75],
        [0.5, -0.65],
        [0.5, -0.75],
      ],
    ],
  ];

  let letterH = [
    // 'H'
    [
      [
        [-0.5, 0.05],
        [-0.5, 0.05],
        [0.5, 0.05],
        [0.5, 0.1],
      ],
      [
        [-0.5, 0.15],
        [-0.5, 0.15],
        [0.5, 0.05],
        [0.5, 0.15],
      ],
    ],
    [
      [
        [-0.6, 0.75],
        [-0.35, 0.75],
        [-0.35, -0.75],
        [-0.6, -0.75],
      ],
      [
        [-0.6, 0.75],
        [-0.45, 0.55],
        [-0.45, -0.55],
        [-0.6, -0.75],
      ],
    ],
    [
      [
        [0.6, 0.75],
        [0.35, 0.75],
        [0.35, -0.75],
        [0.6, -0.75],
      ],
      [
        [0.6, 0.75],
        [0.45, 0.55],
        [0.45, -0.55],
        [0.6, -0.75],
      ],
    ],
  ];

  let letterO = [
    [
      [
        [0, 0.75],
        [0.75, 0.75],
        [0.75, -0.75],
        [0, -0.75],
      ],
      [
        [0, 0.65],
        [0.7, 0.65],
        [0.7, -0.65],
        [0, -0.65],
      ],
    ],
    [
      [
        [0, 0.75],
        [-0.75, 0.75],
        [-0.75, -0.75],
        [0, -0.75],
      ],
      [
        [0, 0.65],
        [-0.7, 0.65],
        [-0.7, -0.65],
        [0, -0.65],
      ],
    ],
  ];

  let newA = [];

  a.forEach((x) => {
    let oper = (val) => val - 0.4;
    newA.push([oper(x[0]), x[1]]);
  });

  console.log(newA);

  let vertices = [];
  let numPoints = 50;

  segments.forEach((segment, i) => {
    let outerVertices = getPointsOnBezierCurve(segment[0], 0, numPoints);
    let innerVertices = getPointsOnBezierCurve(segment[1], 0, numPoints);

    for (let i = 0; i < outerVertices.length; i += 2) {
      vertices.push(outerVertices[i]);
      vertices.push(outerVertices[i + 1]);
      vertices.push(innerVertices[i]);
      vertices.push(innerVertices[i + 1]);
    }
  });

  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Vertex shader
  const vertexShaderCode = `
      attribute vec2 aPosition;
  
      void main() {
        float x = aPosition.x;
        float y = aPosition.y;
        gl_PointSize = 10.0;
        gl_Position = vec4(x, y, 0.0, 1.0);
      }
    `;

  // Fragment shader
  const fragmentShaderCode = `
      precision mediump float;
      void main() {
        float r = 0.0;
        float g = 0.0;
        float b = 1.0;   
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `;

  let vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShaderObject, vertexShaderCode);
  gl.compileShader(vertexShaderObject);

  let fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShaderObject, fragmentShaderCode);
  gl.compileShader(fragmentShaderObject);

  let shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShaderObject);
  gl.attachShader(shaderProgram, fragmentShaderObject);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  // Mengajari GPU bagaimana caranya mengoleksi
  // nilai posisi dari ARRAY_BUFFER
  // untuk setiap verteks yang sedang diproses
  let aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPosition);

  gl.clearColor(1.0, 0.65, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  for (let i = 0; i < segments.length; i++) {
    gl.drawArrays(gl.TRIANGLE_STRIP, numPoints * i * 2, numPoints * 2);
  }
}

function getPointOnBezierCurve(points, offset, t) {
  const invT = 1 - t;
  return v2.add(
    v2.mult(points[offset + 0], invT * invT * invT),
    v2.mult(points[offset + 1], 3 * t * invT * invT),
    v2.mult(points[offset + 2], 3 * invT * t * t),
    v2.mult(points[offset + 3], t * t * t)
  );
}

function getPointsOnBezierCurve(points, offset, numPoints) {
  let cpoints = [];
  for (let i = 0; i < numPoints; ++i) {
    const t = i / (numPoints - 1);
    cpoints.push(getPointOnBezierCurve(points, offset, t));
  }

  cpoints = cpoints.reduce((a, b) => {
    return a.concat(b);
  }, []);

  return cpoints;
}

const v2 = (function () {
  // adds 1 or more v2s
  function add(a, ...args) {
    const n = a.slice();
    [...args].forEach((p) => {
      n[0] += p[0];
      n[1] += p[1];
    });
    return n;
  }

  function mult(a, s) {
    if (Array.isArray(s)) {
      let t = s;
      s = a;
      a = t;
    }
    if (Array.isArray(s)) {
      return [a[0] * s[0], a[1] * s[1]];
    } else {
      return [a[0] * s, a[1] * s];
    }
  }

  return {
    add: add,
    mult: mult,
  };
})();
