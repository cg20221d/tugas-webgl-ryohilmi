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

  var segments = [];

  transformChar(number9, (point) => {
    point[0] = (point[0] - 0.75) / 1.55;
    point[1] = (point[1] + 0.825) / 1.55;
    return point;
  });

  transformChar(number2, (point) => {
    point[0] = (point[0] + 0.65) / 1.65;
    point[1] = (point[1] + 0.9) / 1.65;
    return point;
  });

  transformChar(letterH, (point) => {
    point[0] = (point[0] - 0.9) / 1.9;
    point[1] = (point[1] - 0.9) / 1.9;
    return point;
  });

  transformChar(letterO, (point) => {
    point[0] = (point[0] + 0.6) / 1.6;
    point[1] = (point[1] - 0.9) / 1.9;
    return point;
  });

  function transformChar(char, transformation) {
    char.forEach((x) => {
      let newA = [];
      x.forEach((y) => {
        let c = [];
        y.forEach((z) => {
          c.push(transformation(z));
        });
        newA.push(c);
      });

      segments.push(newA);
    });
  }

  let vertices = [];
  let numPoints = 50;
  let numberLength = number2.length + number9.length;

  segments.forEach((segment, j) => {
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
      varying vec2 pos;
      attribute vec2 aPosition;
      uniform bool isShadow;
  
      void main() {
        pos = aPosition;
        float x = isShadow ? aPosition.x + 0.02 : aPosition.x;
        float y = isShadow ? aPosition.y - 0.02 : aPosition.y;
        gl_Position = vec4(x, y, 0.0, 1.0);
      }
    `;

  // Fragment shader
  const fragmentShaderCode = `
      precision mediump float;
      varying vec2 pos;
      uniform bool isShadow;

      float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
      }

      void main() {
        float r = isShadow ? 0.05 : map(pos.x + (pos.y * 0.2) + 0.8, 0.0, 1.5, 0.1, 0.36);
        float g = isShadow ? 0.035 : map(pos.x + (pos.y * 0.2) + 0.8, 0.0, 1.5, 0.92, 0.47);
        float b = isShadow ? 0.09 : map(pos.x + (pos.y * 0.2) + 0.8, 0.0, 1.5, 0.85, 0.92); 
        float a = isShadow ? 1.0 : 1.0;  
        gl_FragColor = vec4(r, g, b, a);
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

  let locationOfIsShadow = gl.getUniformLocation(shaderProgram, "isShadow");

  gl.clearColor(0.13, 0.1, 0.25, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform1f(locationOfIsShadow, true);
  for (let i = numberLength; i < segments.length; i++) {
    gl.drawArrays(gl.TRIANGLE_STRIP, numPoints * i * 2, numPoints * 2);
  }

  gl.uniform1f(locationOfIsShadow, false);
  for (let i = 0; i < segments.length; i++) {
    gl.drawArrays(
      i > segments.length / 2 ? gl.TRIANGLE_STRIP : gl.LINE_STRIP,
      numPoints * i * 2,
      numPoints * 2
    );
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
