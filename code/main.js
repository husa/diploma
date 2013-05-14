//(function main() {
  function distance( a, b) {
    var i = 0,
      n = a.length,
      ret = 0;

    if (n !== b.length) return;
    for (; i < n; i++) {
      ret += Math.pow(b[i] - a[i], 2);
    }
    return Math.pow(ret, 0.5);
  }

  function normaMatrix(A) {
    var res = 0,
      i = 0, j = 0,
      n = A.length, m = A[0].length;

    for (; i < n; i++) {
      for (; j < m; j++) {
        res += A[i][j]*A[i][j];
      }
    }
    return Math.pow(res, 1/2);
  }

  function norma_(u) {
    return Math.pow(12*(u[0]*u[0] + u[1]*u[1] + u[2]*u[2]) - 8*u[0]*u[1] - 8*u[1]*u[2] - 8*u[0]*u[2], 0.5 );
  }

  function normaVector(A) {
    var res = 0,
      i = 0,
      n = A.length;

    for (; i < n; i++) {
      res += A[i]*A[i];
    }
    return Math.pow(res, 1/2);
  }

  function inverse(_A) {
    var temp,
    N = _A.length,
    E = [];
   
    for (var i = 0; i < N; i++)
      E[i] = [];
   
    for (i = 0; i < N; i++)
      for (var j = 0; j < N; j++) {
        E[i][j] = 0;
        if (i == j)
          E[i][j] = 1;
      }
   
    for (var k = 0; k < N; k++) {
      temp = _A[k][k];
   
      for (var j = 0; j < N; j++)
      {
        _A[k][j] /= temp;
        E[k][j] /= temp;
      }
   
      for (var i = k + 1; i < N; i++)
      {
        temp = _A[i][k];
   
        for (var j = 0; j < N; j++)
        {
          _A[i][j] -= _A[k][j] * temp;
          E[i][j] -= E[k][j] * temp;
        }
      }
    }
   
    for (var k = N - 1; k > 0; k--)
    {
      for (var i = k - 1; i >= 0; i--)
      {
        temp = _A[i][k];
   
        for (var j = 0; j < N; j++)
        {
          _A[i][j] -= _A[k][j] * temp;
          E[i][j] -= E[k][j] * temp;
        }
      }
    }
   
    for (var i = 0; i < N; i++)
      for (var j = 0; j < N; j++)
        _A[i][j] = E[i][j];
    return _A;
  }

  function F(u) {
    return [
      Math.pow(u[0], 2) + Math.pow( u[1] - u[2] , 2) - 5,
      Math.pow(u[1], 2) + Math.pow( u[0] - u[2] , 2) - 6,
      Math.pow(u[2], 2) + Math.pow( u[0] - u[1] , 2) - 7
    ];
  }

  function F_(u) {
    return [
      [ 2*u[0] ,          2*(u[1] - u[2]),  -2*(u[1] - u[2]) ],
      [ 2*(u[0] - u[2]),  2*u[1],           -2*(u[0] - u[2]) ],
      [ 2*(u[0] - u[1]),  -2*(u[0] - u[1]),          2*u[2] ]
    ];
  }

  function F__(u) {
    return [
      [ [2, 0, 0],  [0, 2, 0],  [0, -2, 2] ],
      [ [2, 0, -2], [0, 2, 0],  [-2, 0, 2] ],
      [ [2, -2, 0], [-2, 2, 0], [0, 0, 2]  ]
    ]
  }

  function max(a) {
    var i = 1, n = a.length, max = a[0];
    for (; i < n; i++) {
      if (a[i] > max) max = a[i];
    }
    return max;
  }

  function normaMatrix2(A) {
    var res = 0,
      i = 0, j = 0,
      n = A.length, m = A[0].length;

    for (; i < n; i++) {
      for (; j < m; j++) {
        res += normaVector(A[i][j])*normaVector(A[i][j]);
      }
    }
    return Math.pow(res, 1/2);
  }

  function check(u, r) {
    var d = normaVector( F(u) ),
      N = normaMatrix2(F__(u)),
      m = 1 / normaMatrix( inverse( F_(u) ) );
    console.log('q = ' , ((d * N) / (m*m)));
    console.log('r = ',  (2*d / m))
    return ((d * N) / (m*m)) < 1// && (2*d / m) < r;
  }

  function getCenter(cube) {
    var ret = [];
      i = 0, 
      n = cube.length;

    for (; i < n; i++) {
      ret.push( (cube[i][0] + cube[i][1]) / 2 );
    }
    return ret;
  }


  var Eps = 0.2,
      step = 100,
      rec = 0;

  function ES(cube) {
    var i = 0, j = 0, k = 0,
      n = cube.length,
      h = [],
      _cube = [],
      _a, _b, _x;

    rec++;

    for (; i < n; i++) {
      h[i] =  ( Math.abs(cube[i][0]) + Math.abs(cube[i][1]) ) / step;
    }


    for (i = 0; i < step; i++) {
      for (j = 0; j < step; j++) {
        for (k = 0; k < step; k++) {
          
          _cube = [
            [ cube[0][0] + i * h[0], cube[0][0] + (i+1) * h[0] ],
            [ cube[1][0] + j * h[1], cube[1][0] + (j+1) * h[1] ],
            [ cube[2][0] + k * h[2], cube[2][0] + (k+1) * h[2] ]
          ]

          //get center point of cube;
          _x = getCenter(_cube);

          // check if current point is valid for futher iterations
          if ( normaVector(F(_x)) < ( Eps ) && rec < 10) {
            if (check(_x)) {
              FOUND.push(_x)
              rec--;
            } else {
              ES(_cube);
            }
          }
          _cube = [];
        }
      }
    }

    // for (i = 0; i < step; i++) {

    //   //create small cube
    //   for (j = 0; j < n; j++) {
    //     _a = cube[j][0];
    //     _b = cube[j][1];
    //     _cube.push( [ _a + i*h[j] , _a + (i+1)*h[j] ] );
    //   }
      
    //   // get center point of cube;
    //   _x = getCenter(_cube);
    //   //console.log(_cube);
    //   // check if current point is valid for futher iterations
    //   if ( normaVector(F(_x)) < ( Eps ) && rec < 10) {
    //     if (check(_x, Eps/rec )) {
    //       console.log('done with "' + _x.join(', ') + '"');
    //     } else {
    //       ES(_cube);
    //     }
    //     rec--;
    //   }

    //   _cube = [];
    // }
  }

  var a = [1.7188, 2.0312, 2.3428 ]
  //var a = [1.7071, 1.9318, 2.2247 ]

  //var cube1 = [ [-1.72, 1.72], [-2.1, 2.1], [-2.35, 2.35] ];

  var cube1 = [ [-2.5,2.5], [-3,3], [-3,3] ];

  //var cube1 = [ [-5, 5], [-5, 5], [-5, 5] ];

  //ES(cube1);

  // a = Math.pow(2.1625,2) + Math.pow( (2.6312-2.4437), 2) - 5
  // b = Math.pow(2.4437,2) + Math.pow( (2.6312-2.1625), 2) - 6
  // c = Math.pow(2.6312,2) + Math.pow( (2.4437-2.1625), 2) - 7

  // a = [2.1625, 2.4437, 2.6312]

  // console.log( normaVector( a ) );

  // var res = ''
  // for (var i=0, n = FOUND.length; i < n; i++) {
  //   res += '[ ';
  //   for (var j = 0; j < 3; j++) {
  //     res += FOUND[i][j].toFixed(5) + ', '
  //   }
  //   res += '];\n'
  // }
  // console.log(res)

  //console.log(FOUND);

  //console.log(   F_( [ 2.225, 2.4299999999999997, 2.61 ] )   )

  //console.log(mul([ 2.225, 2.4299999999999997, 2.61 ]));

  //  N = 7.46;

  //console.log(normaMatrix2(F__(a)))

  // console.log( normaVector(F(  [ 2.1750000000000003, -0.44999999999999996,-0.22999999999999998 ]) ) )
  // console.log( normaVector(F(  [ 2.16, 2.63,0.34 ]) ) )

  // console.log(check([ 2.1750000000000003, -0.44999999999999996,-0.22999999999999998 ]))


















  // function f(x) {
  //   return Math.sin(x);
  // }
  // var eps = 0.1,
  //   n = 100,
  //   rec = 0,
  //   delta = 0.01;

  // function es_1(a, b) {
  //   var h = (a + b) / n,
  //     _a, _b, _c;

  //   rec++;


  //   for (var i = 0; i < n; i++) {
  //     _a = a + i*h;
  //     _b = _a + h;
  //     _c = (_a + _b) / 2;

  //     if (Math.abs( f(_c) ) < eps / rec) {

  //       if (f(_a)*f(_b) <= 0) {

  //         if (Math.abs(b - a) < delta ) {
  //           console.log('found in ', _a, _b, 'point is ', _c, rec);
  //           rec--;
  //           return; 
  //         } else {
  //           es_1(_a, _b);
  //         }
  //       }
  //     }
  //   }
  // }
  
  //es_1(0,10);
// x = [
//   [ -2.225, -2.4299999999999997, -2.67 ],
//   [ -2.225, -2.4299999999999997, -2.6100000000000003 ],
//   [ -2.225, 0.3899999999999999, 0.20999999999999974 ],
//   [ -0.2749999999999999, -0.44999999999999996, -2.67 ],
//   [ -0.22499999999999987, 2.4299999999999997, 0.20999999999999974 ],
//   [ -0.17499999999999982,    -0.3900000000000001,    -2.6100000000000003 ],
//   [ -0.17499999999999982, 2.4299999999999997, 0.20999999999999974 ],
//   [ 0.17500000000000027, -2.4299999999999997, -0.2100000000000002 ],
//   [ 0.2250000000000001, -2.4299999999999997, -0.2100000000000002 ],
//   [ 0.27500000000000013, 0.44999999999999996, 2.67 ],
//   [ 2.225, -0.3900000000000001, -0.2100000000000002 ],
//   [ 2.225, 2.4299999999999997, 2.61 ]

// ]

// for(var i in x) {
//   for (var j in x[i]) {
//     x[i][j] = x[i][j].toFixed(5);
//   }
//   console.log('done with "' + x[i].join(', ') + '"');  
//}


a1 = [ -2.225, -2.4299999999999997, -2.6100000000000003 ];
a2 = [ 2.225, -0.3900000000000001, -0.2100000000000002 ];

console.log(check(a1))
console.log(check(a2))




//}());