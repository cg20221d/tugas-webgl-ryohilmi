function main() {
    let canvas = document.getElementById("kanvas");
    let gl = canvas.getContext("webgl");
  
    let vertices = [
      0.5, 0.5,
      0.0, 0.0,
      -0.5, 0.5,
      0.0, 1.0
    ];
  
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
