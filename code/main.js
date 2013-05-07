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
			Math.pow(u[0], 2) + Math.pow( u[1] - u[2] , 2) - 3,
			Math.pow(u[1], 2) + Math.pow( u[0] - u[2] , 2) - 4,
			Math.pow(u[2], 2) + Math.pow( u[0] - u[1] , 2) - 5
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

	}

	function max(a) {
		var i = 1, n = a.length, max = a[0];
		for (; i < n; i++) {
			if (a[i] > max) max = a[i];
		}
		return max;
	}

	function check(u, r) {
		var d = normaVector( F(u) ),
			N = 2,
			m = 1 / normaMatrix( inverse( F_(u) ) );

		console.log((2*d / m));
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


	var Eps = 2,
		step = 10000,
		rec = 0;
		
	function ES(cube) {
		var	i = 0, j = 0, 
			n = cube.length,
			h = [],
			_cube = [],
			_a, _b, _x;

		rec++;

		for (; i < n; i++) {
			h[i] =  ( Math.abs(cube[i][0]) + Math.abs(cube[i][1]) ) / step;
		}

		for (i = 0; i < step; i++) {
			//create small cube
			for (j = 0; j < n; j++) {
				_a = cube[j][0];
				_b = cube[j][1];
				_cube.push( [ _a + i*h[j] , _a + (i+1)*h[j] ] );
			}
			
			// get center point of cube;
			_x = getCenter(_cube);

			// check if current point is valid for futher iterations
			if ( normaVector(F(_x)) < ( Eps ) && rec < 10) {
				if (check(_x, Eps/rec )) {
					console.log('done with "' + _x.join(', ') + '"');
				} else {
					ES(_cube);
				}
				rec--;
			}

			_cube = [];
		}
	}

	var a = [1.7188, 2.0312, 2.3428 ]
	//var a = [1.7071, 1.9318, 2.2247 ]

	var cube1 = [ [-1.72, 1.72], [-2.1, 2.1], [-2.35, 2.35] ];
	//var cube1 = [ [-2,2], [-3,3], [-3,3] ];
	//var cube1 = [ [-5, 5], [-5, 5], [-5, 5] ];

	//ES(cube1)
 

	function f(x) {
		return Math.sin(x);
	}
	var eps = 0.1,
		step = 10000,
		rec = 0,
		delta = 0.01;

	function es_1(a, b) {
		var	h = (a + b) / step,
			_a, _b, _c;

		rec++;


		for (var i = 0; i < step; i++) {
			_a = a + i*h;
			_b = _a + h;
			_c = (_a + _b) / 2;

			if (Math.abs( f(_c) ) < eps / rec) {

				if (f(_a)*f(_b) <= 0) {

					if (Math.abs(b - a) < delta ) {
						console.log('found in ', _a, _b);
						rec--;
						return;	
					} else {
						es_1(_a, _b);
					}
				}
				//console.log('found in ', _a, _b, rec);
				//console.log('deep', rec);
				
			}
		} 

	}
	
	es_1(0,10);

//}());