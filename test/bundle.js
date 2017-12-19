/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BigInteger; });
/* unused harmony export Classic */
/* unused harmony export Montgomery */
/* harmony export (immutable) */ __webpack_exports__["b"] = nbi;
/* harmony export (immutable) */ __webpack_exports__["c"] = parseBigInt;
/* unused harmony export intAt */
/* unused harmony export nbv */
/* unused harmony export nbits */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(2);
// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.
// Basic JavaScript BN library - subset useful for RSA encryption.

// Bits per digit
var dbits;
// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary & 0xffffff) == 0xefcafe);
//#region
var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
//#endregion
// (public) Constructor
var BigInteger = /** @class */ (function () {
    function BigInteger(a, b, c) {
        if (a != null) {
            if ("number" == typeof a) {
                this.fromNumber(a, b, c);
            }
            else if (b == null && "string" != typeof a) {
                this.fromString(a, 256);
            }
            else {
                this.fromString(a, b);
            }
        }
    }
    //#region PUBLIC
    // BigInteger.prototype.toString = bnToString;
    // (public) return string representation in given radix
    BigInteger.prototype.toString = function (b) {
        if (this.s < 0) {
            return "-" + this.negate().toString(b);
        }
        var k;
        if (b == 16) {
            k = 4;
        }
        else if (b == 8) {
            k = 3;
        }
        else if (b == 2) {
            k = 1;
        }
        else if (b == 32) {
            k = 5;
        }
        else if (b == 4) {
            k = 2;
        }
        else {
            return this.toRadix(b);
        }
        var km = (1 << k) - 1;
        var d;
        var m = false;
        var r = "";
        var i = this.t;
        var p = this.DB - (i * this.DB) % k;
        if (i-- > 0) {
            if (p < this.DB && (d = this[i] >> p) > 0) {
                m = true;
                r = Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* int2char */])(d);
            }
            while (i >= 0) {
                if (p < k) {
                    d = (this[i] & ((1 << p) - 1)) << (k - p);
                    d |= this[--i] >> (p += this.DB - k);
                }
                else {
                    d = (this[i] >> (p -= k)) & km;
                    if (p <= 0) {
                        p += this.DB;
                        --i;
                    }
                }
                if (d > 0) {
                    m = true;
                }
                if (m) {
                    r += Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* int2char */])(d);
                }
            }
        }
        return m ? r : "0";
    };
    // BigInteger.prototype.negate = bnNegate;
    // (public) -this
    BigInteger.prototype.negate = function () {
        var r = nbi();
        BigInteger.ZERO.subTo(this, r);
        return r;
    };
    // BigInteger.prototype.abs = bnAbs;
    // (public) |this|
    BigInteger.prototype.abs = function () {
        return (this.s < 0) ? this.negate() : this;
    };
    // BigInteger.prototype.compareTo = bnCompareTo;
    // (public) return + if this > a, - if this < a, 0 if equal
    BigInteger.prototype.compareTo = function (a) {
        var r = this.s - a.s;
        if (r != 0) {
            return r;
        }
        var i = this.t;
        r = i - a.t;
        if (r != 0) {
            return (this.s < 0) ? -r : r;
        }
        while (--i >= 0) {
            if ((r = this[i] - a[i]) != 0) {
                return r;
            }
        }
        return 0;
    };
    // BigInteger.prototype.bitLength = bnBitLength;
    // (public) return the number of bits in "this"
    BigInteger.prototype.bitLength = function () {
        if (this.t <= 0) {
            return 0;
        }
        return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM));
    };
    // BigInteger.prototype.mod = bnMod;
    // (public) this mod a
    BigInteger.prototype.mod = function (a) {
        var r = nbi();
        this.abs().divRemTo(a, null, r);
        if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
            a.subTo(r, r);
        }
        return r;
    };
    // BigInteger.prototype.modPowInt = bnModPowInt;
    // (public) this^e % m, 0 <= e < 2^32
    BigInteger.prototype.modPowInt = function (e, m) {
        var z;
        if (e < 256 || m.isEven()) {
            z = new Classic(m);
        }
        else {
            z = new Montgomery(m);
        }
        return this.exp(e, z);
    };
    // BigInteger.prototype.clone = bnClone;
    // (public)
    BigInteger.prototype.clone = function () {
        var r = nbi();
        this.copyTo(r);
        return r;
    };
    // BigInteger.prototype.intValue = bnIntValue;
    // (public) return value as integer
    BigInteger.prototype.intValue = function () {
        if (this.s < 0) {
            if (this.t == 1) {
                return this[0] - this.DV;
            }
            else if (this.t == 0) {
                return -1;
            }
        }
        else if (this.t == 1) {
            return this[0];
        }
        else if (this.t == 0) {
            return 0;
        }
        // assumes 16 < DB < 32
        return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0];
    };
    // BigInteger.prototype.byteValue = bnByteValue;
    // (public) return value as byte
    BigInteger.prototype.byteValue = function () {
        return (this.t == 0) ? this.s : (this[0] << 24) >> 24;
    };
    // BigInteger.prototype.shortValue = bnShortValue;
    // (public) return value as short (assumes DB>=16)
    BigInteger.prototype.shortValue = function () {
        return (this.t == 0) ? this.s : (this[0] << 16) >> 16;
    };
    // BigInteger.prototype.signum = bnSigNum;
    // (public) 0 if this == 0, 1 if this > 0
    BigInteger.prototype.signum = function () {
        if (this.s < 0) {
            return -1;
        }
        else if (this.t <= 0 || (this.t == 1 && this[0] <= 0)) {
            return 0;
        }
        else {
            return 1;
        }
    };
    // BigInteger.prototype.toByteArray = bnToByteArray;
    // (public) convert to bigendian byte array
    BigInteger.prototype.toByteArray = function () {
        var i = this.t;
        var r = [];
        r[0] = this.s;
        var p = this.DB - (i * this.DB) % 8;
        var d;
        var k = 0;
        if (i-- > 0) {
            if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p) {
                r[k++] = d | (this.s << (this.DB - p));
            }
            while (i >= 0) {
                if (p < 8) {
                    d = (this[i] & ((1 << p) - 1)) << (8 - p);
                    d |= this[--i] >> (p += this.DB - 8);
                }
                else {
                    d = (this[i] >> (p -= 8)) & 0xff;
                    if (p <= 0) {
                        p += this.DB;
                        --i;
                    }
                }
                if ((d & 0x80) != 0) {
                    d |= -256;
                }
                if (k == 0 && (this.s & 0x80) != (d & 0x80)) {
                    ++k;
                }
                if (k > 0 || d != this.s) {
                    r[k++] = d;
                }
            }
        }
        return r;
    };
    // BigInteger.prototype.equals = bnEquals;
    BigInteger.prototype.equals = function (a) {
        return (this.compareTo(a) == 0);
    };
    // BigInteger.prototype.min = bnMin;
    BigInteger.prototype.min = function (a) {
        return (this.compareTo(a) < 0) ? this : a;
    };
    // BigInteger.prototype.max = bnMax;
    BigInteger.prototype.max = function (a) {
        return (this.compareTo(a) > 0) ? this : a;
    };
    // BigInteger.prototype.and = bnAnd;
    BigInteger.prototype.and = function (a) {
        var r = nbi();
        this.bitwiseTo(a, __WEBPACK_IMPORTED_MODULE_0__util__["d" /* op_and */], r);
        return r;
    };
    // BigInteger.prototype.or = bnOr;
    BigInteger.prototype.or = function (a) {
        var r = nbi();
        this.bitwiseTo(a, __WEBPACK_IMPORTED_MODULE_0__util__["f" /* op_or */], r);
        return r;
    };
    // BigInteger.prototype.xor = bnXor;
    BigInteger.prototype.xor = function (a) {
        var r = nbi();
        this.bitwiseTo(a, __WEBPACK_IMPORTED_MODULE_0__util__["g" /* op_xor */], r);
        return r;
    };
    // BigInteger.prototype.andNot = bnAndNot;
    BigInteger.prototype.andNot = function (a) {
        var r = nbi();
        this.bitwiseTo(a, __WEBPACK_IMPORTED_MODULE_0__util__["e" /* op_andnot */], r);
        return r;
    };
    // BigInteger.prototype.not = bnNot;
    // (public) ~this
    BigInteger.prototype.not = function () {
        var r = nbi();
        for (var i = 0; i < this.t; ++i) {
            r[i] = this.DM & ~this[i];
        }
        r.t = this.t;
        r.s = ~this.s;
        return r;
    };
    // BigInteger.prototype.shiftLeft = bnShiftLeft;
    // (public) this << n
    BigInteger.prototype.shiftLeft = function (n) {
        var r = nbi();
        if (n < 0) {
            this.rShiftTo(-n, r);
        }
        else {
            this.lShiftTo(n, r);
        }
        return r;
    };
    // BigInteger.prototype.shiftRight = bnShiftRight;
    // (public) this >> n
    BigInteger.prototype.shiftRight = function (n) {
        var r = nbi();
        if (n < 0) {
            this.lShiftTo(-n, r);
        }
        else {
            this.rShiftTo(n, r);
        }
        return r;
    };
    // BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
    // (public) returns index of lowest 1-bit (or -1 if none)
    BigInteger.prototype.getLowestSetBit = function () {
        for (var i = 0; i < this.t; ++i) {
            if (this[i] != 0) {
                return i * this.DB + Object(__WEBPACK_IMPORTED_MODULE_0__util__["c" /* lbit */])(this[i]);
            }
        }
        if (this.s < 0) {
            return this.t * this.DB;
        }
        return -1;
    };
    // BigInteger.prototype.bitCount = bnBitCount;
    // (public) return number of set bits
    BigInteger.prototype.bitCount = function () {
        var r = 0;
        var x = this.s & this.DM;
        for (var i = 0; i < this.t; ++i) {
            r += Object(__WEBPACK_IMPORTED_MODULE_0__util__["a" /* cbit */])(this[i] ^ x);
        }
        return r;
    };
    // BigInteger.prototype.testBit = bnTestBit;
    // (public) true iff nth bit is set
    BigInteger.prototype.testBit = function (n) {
        var j = Math.floor(n / this.DB);
        if (j >= this.t) {
            return (this.s != 0);
        }
        return ((this[j] & (1 << (n % this.DB))) != 0);
    };
    // BigInteger.prototype.setBit = bnSetBit;
    // (public) this | (1<<n)
    BigInteger.prototype.setBit = function (n) {
        return this.changeBit(n, __WEBPACK_IMPORTED_MODULE_0__util__["f" /* op_or */]);
    };
    // BigInteger.prototype.clearBit = bnClearBit;
    // (public) this & ~(1<<n)
    BigInteger.prototype.clearBit = function (n) {
        return this.changeBit(n, __WEBPACK_IMPORTED_MODULE_0__util__["e" /* op_andnot */]);
    };
    // BigInteger.prototype.flipBit = bnFlipBit;
    // (public) this ^ (1<<n)
    BigInteger.prototype.flipBit = function (n) {
        return this.changeBit(n, __WEBPACK_IMPORTED_MODULE_0__util__["g" /* op_xor */]);
    };
    // BigInteger.prototype.add = bnAdd;
    // (public) this + a
    BigInteger.prototype.add = function (a) {
        var r = nbi();
        this.addTo(a, r);
        return r;
    };
    // BigInteger.prototype.subtract = bnSubtract;
    // (public) this - a
    BigInteger.prototype.subtract = function (a) {
        var r = nbi();
        this.subTo(a, r);
        return r;
    };
    // BigInteger.prototype.multiply = bnMultiply;
    // (public) this * a
    BigInteger.prototype.multiply = function (a) {
        var r = nbi();
        this.multiplyTo(a, r);
        return r;
    };
    // BigInteger.prototype.divide = bnDivide;
    // (public) this / a
    BigInteger.prototype.divide = function (a) {
        var r = nbi();
        this.divRemTo(a, r, null);
        return r;
    };
    // BigInteger.prototype.remainder = bnRemainder;
    // (public) this % a
    BigInteger.prototype.remainder = function (a) {
        var r = nbi();
        this.divRemTo(a, null, r);
        return r;
    };
    // BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
    // (public) [this/a,this%a]
    BigInteger.prototype.divideAndRemainder = function (a) {
        var q = nbi();
        var r = nbi();
        this.divRemTo(a, q, r);
        return [q, r];
    };
    // BigInteger.prototype.modPow = bnModPow;
    // (public) this^e % m (HAC 14.85)
    BigInteger.prototype.modPow = function (e, m) {
        var i = e.bitLength();
        var k;
        var r = nbv(1);
        var z;
        if (i <= 0) {
            return r;
        }
        else if (i < 18) {
            k = 1;
        }
        else if (i < 48) {
            k = 3;
        }
        else if (i < 144) {
            k = 4;
        }
        else if (i < 768) {
            k = 5;
        }
        else {
            k = 6;
        }
        if (i < 8) {
            z = new Classic(m);
        }
        else if (m.isEven()) {
            z = new Barrett(m);
        }
        else {
            z = new Montgomery(m);
        }
        // precomputation
        var g = [];
        var n = 3;
        var k1 = k - 1;
        var km = (1 << k) - 1;
        g[1] = z.convert(this);
        if (k > 1) {
            var g2 = nbi();
            z.sqrTo(g[1], g2);
            while (n <= km) {
                g[n] = nbi();
                z.mulTo(g2, g[n - 2], g[n]);
                n += 2;
            }
        }
        var j = e.t - 1;
        var w;
        var is1 = true;
        var r2 = nbi();
        var t;
        i = nbits(e[j]) - 1;
        while (j >= 0) {
            if (i >= k1) {
                w = (e[j] >> (i - k1)) & km;
            }
            else {
                w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
                if (j > 0) {
                    w |= e[j - 1] >> (this.DB + i - k1);
                }
            }
            n = k;
            while ((w & 1) == 0) {
                w >>= 1;
                --n;
            }
            if ((i -= n) < 0) {
                i += this.DB;
                --j;
            }
            if (is1) {
                g[w].copyTo(r);
                is1 = false;
            }
            else {
                while (n > 1) {
                    z.sqrTo(r, r2);
                    z.sqrTo(r2, r);
                    n -= 2;
                }
                if (n > 0) {
                    z.sqrTo(r, r2);
                }
                else {
                    t = r;
                    r = r2;
                    r2 = t;
                }
                z.mulTo(r2, g[w], r);
            }
            while (j >= 0 && (e[j] & (1 << i)) == 0) {
                z.sqrTo(r, r2);
                t = r;
                r = r2;
                r2 = t;
                if (--i < 0) {
                    i = this.DB - 1;
                    --j;
                }
            }
        }
        return z.revert(r);
    };
    // BigInteger.prototype.modInverse = bnModInverse;
    // (public) 1/this % m (HAC 14.61)
    BigInteger.prototype.modInverse = function (m) {
        var ac = m.isEven();
        if ((this.isEven() && ac) || m.signum() == 0) {
            return BigInteger.ZERO;
        }
        var u = m.clone();
        var v = this.clone();
        var a = nbv(1);
        var b = nbv(0);
        var c = nbv(0);
        var d = nbv(1);
        while (u.signum() != 0) {
            while (u.isEven()) {
                u.rShiftTo(1, u);
                if (ac) {
                    if (!a.isEven() || !b.isEven()) {
                        a.addTo(this, a);
                        b.subTo(m, b);
                    }
                    a.rShiftTo(1, a);
                }
                else if (!b.isEven()) {
                    b.subTo(m, b);
                }
                b.rShiftTo(1, b);
            }
            while (v.isEven()) {
                v.rShiftTo(1, v);
                if (ac) {
                    if (!c.isEven() || !d.isEven()) {
                        c.addTo(this, c);
                        d.subTo(m, d);
                    }
                    c.rShiftTo(1, c);
                }
                else if (!d.isEven()) {
                    d.subTo(m, d);
                }
                d.rShiftTo(1, d);
            }
            if (u.compareTo(v) >= 0) {
                u.subTo(v, u);
                if (ac) {
                    a.subTo(c, a);
                }
                b.subTo(d, b);
            }
            else {
                v.subTo(u, v);
                if (ac) {
                    c.subTo(a, c);
                }
                d.subTo(b, d);
            }
        }
        if (v.compareTo(BigInteger.ONE) != 0) {
            return BigInteger.ZERO;
        }
        if (d.compareTo(m) >= 0) {
            return d.subtract(m);
        }
        if (d.signum() < 0) {
            d.addTo(m, d);
        }
        else {
            return d;
        }
        if (d.signum() < 0) {
            return d.add(m);
        }
        else {
            return d;
        }
    };
    // BigInteger.prototype.pow = bnPow;
    // (public) this^e
    BigInteger.prototype.pow = function (e) {
        return this.exp(e, new NullExp());
    };
    // BigInteger.prototype.gcd = bnGCD;
    // (public) gcd(this,a) (HAC 14.54)
    BigInteger.prototype.gcd = function (a) {
        var x = (this.s < 0) ? this.negate() : this.clone();
        var y = (a.s < 0) ? a.negate() : a.clone();
        if (x.compareTo(y) < 0) {
            var t = x;
            x = y;
            y = t;
        }
        var i = x.getLowestSetBit();
        var g = y.getLowestSetBit();
        if (g < 0) {
            return x;
        }
        if (i < g) {
            g = i;
        }
        if (g > 0) {
            x.rShiftTo(g, x);
            y.rShiftTo(g, y);
        }
        while (x.signum() > 0) {
            if ((i = x.getLowestSetBit()) > 0) {
                x.rShiftTo(i, x);
            }
            if ((i = y.getLowestSetBit()) > 0) {
                y.rShiftTo(i, y);
            }
            if (x.compareTo(y) >= 0) {
                x.subTo(y, x);
                x.rShiftTo(1, x);
            }
            else {
                y.subTo(x, y);
                y.rShiftTo(1, y);
            }
        }
        if (g > 0) {
            y.lShiftTo(g, y);
        }
        return y;
    };
    // BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
    // (public) test primality with certainty >= 1-.5^t
    BigInteger.prototype.isProbablePrime = function (t) {
        var i;
        var x = this.abs();
        if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
            for (i = 0; i < lowprimes.length; ++i) {
                if (x[0] == lowprimes[i]) {
                    return true;
                }
            }
            return false;
        }
        if (x.isEven()) {
            return false;
        }
        i = 1;
        while (i < lowprimes.length) {
            var m = lowprimes[i];
            var j = i + 1;
            while (j < lowprimes.length && m < lplim) {
                m *= lowprimes[j++];
            }
            m = x.modInt(m);
            while (i < j) {
                if (m % lowprimes[i++] == 0) {
                    return false;
                }
            }
        }
        return x.millerRabin(t);
    };
    //#endregion PUBLIC
    //#region PROTECTED
    // BigInteger.prototype.copyTo = bnpCopyTo;
    // (protected) copy this to r
    BigInteger.prototype.copyTo = function (r) {
        for (var i = this.t - 1; i >= 0; --i) {
            r[i] = this[i];
        }
        r.t = this.t;
        r.s = this.s;
    };
    // BigInteger.prototype.fromInt = bnpFromInt;
    // (protected) set from integer value x, -DV <= x < DV
    BigInteger.prototype.fromInt = function (x) {
        this.t = 1;
        this.s = (x < 0) ? -1 : 0;
        if (x > 0) {
            this[0] = x;
        }
        else if (x < -1) {
            this[0] = x + this.DV;
        }
        else {
            this.t = 0;
        }
    };
    // BigInteger.prototype.fromString = bnpFromString;
    // (protected) set from string and radix
    BigInteger.prototype.fromString = function (s, b) {
        var k;
        if (b == 16) {
            k = 4;
        }
        else if (b == 8) {
            k = 3;
        }
        else if (b == 256) {
            k = 8;
            /* byte array */
        }
        else if (b == 2) {
            k = 1;
        }
        else if (b == 32) {
            k = 5;
        }
        else if (b == 4) {
            k = 2;
        }
        else {
            this.fromRadix(s, b);
            return;
        }
        this.t = 0;
        this.s = 0;
        var i = s.length;
        var mi = false;
        var sh = 0;
        while (--i >= 0) {
            var x = (k == 8) ? (+s[i]) & 0xff : intAt(s, i);
            if (x < 0) {
                if (s.charAt(i) == "-") {
                    mi = true;
                }
                continue;
            }
            mi = false;
            if (sh == 0) {
                this[this.t++] = x;
            }
            else if (sh + k > this.DB) {
                this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
                this[this.t++] = (x >> (this.DB - sh));
            }
            else {
                this[this.t - 1] |= x << sh;
            }
            sh += k;
            if (sh >= this.DB) {
                sh -= this.DB;
            }
        }
        if (k == 8 && ((+s[0]) & 0x80) != 0) {
            this.s = -1;
            if (sh > 0) {
                this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
            }
        }
        this.clamp();
        if (mi) {
            BigInteger.ZERO.subTo(this, this);
        }
    };
    // BigInteger.prototype.clamp = bnpClamp;
    // (protected) clamp off excess high words
    BigInteger.prototype.clamp = function () {
        var c = this.s & this.DM;
        while (this.t > 0 && this[this.t - 1] == c) {
            --this.t;
        }
    };
    // BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
    // (protected) r = this << n*DB
    BigInteger.prototype.dlShiftTo = function (n, r) {
        var i;
        for (i = this.t - 1; i >= 0; --i) {
            r[i + n] = this[i];
        }
        for (i = n - 1; i >= 0; --i) {
            r[i] = 0;
        }
        r.t = this.t + n;
        r.s = this.s;
    };
    // BigInteger.prototype.drShiftTo = bnpDRShiftTo;
    // (protected) r = this >> n*DB
    BigInteger.prototype.drShiftTo = function (n, r) {
        for (var i = n; i < this.t; ++i) {
            r[i - n] = this[i];
        }
        r.t = Math.max(this.t - n, 0);
        r.s = this.s;
    };
    // BigInteger.prototype.lShiftTo = bnpLShiftTo;
    // (protected) r = this << n
    BigInteger.prototype.lShiftTo = function (n, r) {
        var bs = n % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << cbs) - 1;
        var ds = Math.floor(n / this.DB);
        var c = (this.s << bs) & this.DM;
        for (var i = this.t - 1; i >= 0; --i) {
            r[i + ds + 1] = (this[i] >> cbs) | c;
            c = (this[i] & bm) << bs;
        }
        for (var i = ds - 1; i >= 0; --i) {
            r[i] = 0;
        }
        r[ds] = c;
        r.t = this.t + ds + 1;
        r.s = this.s;
        r.clamp();
    };
    // BigInteger.prototype.rShiftTo = bnpRShiftTo;
    // (protected) r = this >> n
    BigInteger.prototype.rShiftTo = function (n, r) {
        r.s = this.s;
        var ds = Math.floor(n / this.DB);
        if (ds >= this.t) {
            r.t = 0;
            return;
        }
        var bs = n % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << bs) - 1;
        r[0] = this[ds] >> bs;
        for (var i = ds + 1; i < this.t; ++i) {
            r[i - ds - 1] |= (this[i] & bm) << cbs;
            r[i - ds] = this[i] >> bs;
        }
        if (bs > 0) {
            r[this.t - ds - 1] |= (this.s & bm) << cbs;
        }
        r.t = this.t - ds;
        r.clamp();
    };
    // BigInteger.prototype.subTo = bnpSubTo;
    // (protected) r = this - a
    BigInteger.prototype.subTo = function (a, r) {
        var i = 0;
        var c = 0;
        var m = Math.min(a.t, this.t);
        while (i < m) {
            c += this[i] - a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
        }
        if (a.t < this.t) {
            c -= a.s;
            while (i < this.t) {
                c += this[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c += this.s;
        }
        else {
            c += this.s;
            while (i < a.t) {
                c -= a[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c -= a.s;
        }
        r.s = (c < 0) ? -1 : 0;
        if (c < -1) {
            r[i++] = this.DV + c;
        }
        else if (c > 0) {
            r[i++] = c;
        }
        r.t = i;
        r.clamp();
    };
    // BigInteger.prototype.multiplyTo = bnpMultiplyTo;
    // (protected) r = this * a, r != this,a (HAC 14.12)
    // "this" should be the larger one if appropriate.
    BigInteger.prototype.multiplyTo = function (a, r) {
        var x = this.abs();
        var y = a.abs();
        var i = x.t;
        r.t = i + y.t;
        while (--i >= 0) {
            r[i] = 0;
        }
        for (i = 0; i < y.t; ++i) {
            r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
        }
        r.s = 0;
        r.clamp();
        if (this.s != a.s) {
            BigInteger.ZERO.subTo(r, r);
        }
    };
    // BigInteger.prototype.squareTo = bnpSquareTo;
    // (protected) r = this^2, r != this (HAC 14.16)
    BigInteger.prototype.squareTo = function (r) {
        var x = this.abs();
        var i = r.t = 2 * x.t;
        while (--i >= 0) {
            r[i] = 0;
        }
        for (i = 0; i < x.t - 1; ++i) {
            var c = x.am(i, x[i], r, 2 * i, 0, 1);
            if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
                r[i + x.t] -= x.DV;
                r[i + x.t + 1] = 1;
            }
        }
        if (r.t > 0) {
            r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
        }
        r.s = 0;
        r.clamp();
    };
    // BigInteger.prototype.divRemTo = bnpDivRemTo;
    // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
    // r != q, this != m.  q or r may be null.
    BigInteger.prototype.divRemTo = function (m, q, r) {
        var pm = m.abs();
        if (pm.t <= 0) {
            return;
        }
        var pt = this.abs();
        if (pt.t < pm.t) {
            if (q != null) {
                q.fromInt(0);
            }
            if (r != null) {
                this.copyTo(r);
            }
            return;
        }
        if (r == null) {
            r = nbi();
        }
        var y = nbi();
        var ts = this.s;
        var ms = m.s;
        var nsh = this.DB - nbits(pm[pm.t - 1]); // normalize modulus
        if (nsh > 0) {
            pm.lShiftTo(nsh, y);
            pt.lShiftTo(nsh, r);
        }
        else {
            pm.copyTo(y);
            pt.copyTo(r);
        }
        var ys = y.t;
        var y0 = y[ys - 1];
        if (y0 == 0) {
            return;
        }
        var yt = y0 * (1 << this.F1) + ((ys > 1) ? y[ys - 2] >> this.F2 : 0);
        var d1 = this.FV / yt;
        var d2 = (1 << this.F1) / yt;
        var e = 1 << this.F2;
        var i = r.t;
        var j = i - ys;
        var t = (q == null) ? nbi() : q;
        y.dlShiftTo(j, t);
        if (r.compareTo(t) >= 0) {
            r[r.t++] = 1;
            r.subTo(t, r);
        }
        BigInteger.ONE.dlShiftTo(ys, t);
        t.subTo(y, y); // "negative" y so we can replace sub with am later
        while (y.t < ys) {
            y[y.t++] = 0;
        }
        while (--j >= 0) {
            // Estimate quotient digit
            var qd = (r[--i] == y0) ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
            if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
                y.dlShiftTo(j, t);
                r.subTo(t, r);
                while (r[i] < --qd) {
                    r.subTo(t, r);
                }
            }
        }
        if (q != null) {
            r.drShiftTo(ys, q);
            if (ts != ms) {
                BigInteger.ZERO.subTo(q, q);
            }
        }
        r.t = ys;
        r.clamp();
        if (nsh > 0) {
            r.rShiftTo(nsh, r);
        } // Denormalize remainder
        if (ts < 0) {
            BigInteger.ZERO.subTo(r, r);
        }
    };
    // BigInteger.prototype.invDigit = bnpInvDigit;
    // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
    // justification:
    //         xy == 1 (mod m)
    //         xy =  1+km
    //   xy(2-xy) = (1+km)(1-km)
    // x[y(2-xy)] = 1-k^2m^2
    // x[y(2-xy)] == 1 (mod m^2)
    // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
    // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
    // JS multiply "overflows" differently from C/C++, so care is needed here.
    BigInteger.prototype.invDigit = function () {
        if (this.t < 1) {
            return 0;
        }
        var x = this[0];
        if ((x & 1) == 0) {
            return 0;
        }
        var y = x & 3; // y == 1/x mod 2^2
        y = (y * (2 - (x & 0xf) * y)) & 0xf; // y == 1/x mod 2^4
        y = (y * (2 - (x & 0xff) * y)) & 0xff; // y == 1/x mod 2^8
        y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff; // y == 1/x mod 2^16
        // last step - calculate inverse mod DV directly;
        // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
        y = (y * (2 - x * y % this.DV)) % this.DV; // y == 1/x mod 2^dbits
        // we really want the negative inverse, and -DV < y < DV
        return (y > 0) ? this.DV - y : -y;
    };
    // BigInteger.prototype.isEven = bnpIsEven;
    // (protected) true iff this is even
    BigInteger.prototype.isEven = function () {
        return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
    };
    // BigInteger.prototype.exp = bnpExp;
    // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
    BigInteger.prototype.exp = function (e, z) {
        if (e > 0xffffffff || e < 1) {
            return BigInteger.ONE;
        }
        var r = nbi();
        var r2 = nbi();
        var g = z.convert(this);
        var i = nbits(e) - 1;
        g.copyTo(r);
        while (--i >= 0) {
            z.sqrTo(r, r2);
            if ((e & (1 << i)) > 0) {
                z.mulTo(r2, g, r);
            }
            else {
                var t = r;
                r = r2;
                r2 = t;
            }
        }
        return z.revert(r);
    };
    // BigInteger.prototype.chunkSize = bnpChunkSize;
    // (protected) return x s.t. r^x < DV
    BigInteger.prototype.chunkSize = function (r) {
        return Math.floor(Math.LN2 * this.DB / Math.log(r));
    };
    // BigInteger.prototype.toRadix = bnpToRadix;
    // (protected) convert to radix string
    BigInteger.prototype.toRadix = function (b) {
        if (b == null) {
            b = 10;
        }
        if (this.signum() == 0 || b < 2 || b > 36) {
            return "0";
        }
        var cs = this.chunkSize(b);
        var a = Math.pow(b, cs);
        var d = nbv(a);
        var y = nbi();
        var z = nbi();
        var r = "";
        this.divRemTo(d, y, z);
        while (y.signum() > 0) {
            r = (a + z.intValue()).toString(b).substr(1) + r;
            y.divRemTo(d, y, z);
        }
        return z.intValue().toString(b) + r;
    };
    // BigInteger.prototype.fromRadix = bnpFromRadix;
    // (protected) convert from radix string
    BigInteger.prototype.fromRadix = function (s, b) {
        this.fromInt(0);
        if (b == null) {
            b = 10;
        }
        var cs = this.chunkSize(b);
        var d = Math.pow(b, cs);
        var mi = false;
        var j = 0;
        var w = 0;
        for (var i = 0; i < s.length; ++i) {
            var x = intAt(s, i);
            if (x < 0) {
                if (s.charAt(i) == "-" && this.signum() == 0) {
                    mi = true;
                }
                continue;
            }
            w = b * w + x;
            if (++j >= cs) {
                this.dMultiply(d);
                this.dAddOffset(w, 0);
                j = 0;
                w = 0;
            }
        }
        if (j > 0) {
            this.dMultiply(Math.pow(b, j));
            this.dAddOffset(w, 0);
        }
        if (mi) {
            BigInteger.ZERO.subTo(this, this);
        }
    };
    // BigInteger.prototype.fromNumber = bnpFromNumber;
    // (protected) alternate constructor
    BigInteger.prototype.fromNumber = function (a, b, c) {
        if ("number" == typeof b) {
            // new BigInteger(int,int,RNG)
            if (a < 2) {
                this.fromInt(1);
            }
            else {
                this.fromNumber(a, c);
                if (!this.testBit(a - 1)) {
                    // force MSB set
                    this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), __WEBPACK_IMPORTED_MODULE_0__util__["f" /* op_or */], this);
                }
                if (this.isEven()) {
                    this.dAddOffset(1, 0);
                } // force odd
                while (!this.isProbablePrime(b)) {
                    this.dAddOffset(2, 0);
                    if (this.bitLength() > a) {
                        this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
                    }
                }
            }
        }
        else {
            // new BigInteger(int,RNG)
            var x = [];
            var t = a & 7;
            x.length = (a >> 3) + 1;
            b.nextBytes(x);
            if (t > 0) {
                x[0] &= ((1 << t) - 1);
            }
            else {
                x[0] = 0;
            }
            this.fromString(x, 256);
        }
    };
    // BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
    // (protected) r = this op a (bitwise)
    BigInteger.prototype.bitwiseTo = function (a, op, r) {
        var i;
        var f;
        var m = Math.min(a.t, this.t);
        for (i = 0; i < m; ++i) {
            r[i] = op(this[i], a[i]);
        }
        if (a.t < this.t) {
            f = a.s & this.DM;
            for (i = m; i < this.t; ++i) {
                r[i] = op(this[i], f);
            }
            r.t = this.t;
        }
        else {
            f = this.s & this.DM;
            for (i = m; i < a.t; ++i) {
                r[i] = op(f, a[i]);
            }
            r.t = a.t;
        }
        r.s = op(this.s, a.s);
        r.clamp();
    };
    // BigInteger.prototype.changeBit = bnpChangeBit;
    // (protected) this op (1<<n)
    BigInteger.prototype.changeBit = function (n, op) {
        var r = BigInteger.ONE.shiftLeft(n);
        this.bitwiseTo(r, op, r);
        return r;
    };
    // BigInteger.prototype.addTo = bnpAddTo;
    // (protected) r = this + a
    BigInteger.prototype.addTo = function (a, r) {
        var i = 0;
        var c = 0;
        var m = Math.min(a.t, this.t);
        while (i < m) {
            c += this[i] + a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
        }
        if (a.t < this.t) {
            c += a.s;
            while (i < this.t) {
                c += this[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c += this.s;
        }
        else {
            c += this.s;
            while (i < a.t) {
                c += a[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c += a.s;
        }
        r.s = (c < 0) ? -1 : 0;
        if (c > 0) {
            r[i++] = c;
        }
        else if (c < -1) {
            r[i++] = this.DV + c;
        }
        r.t = i;
        r.clamp();
    };
    // BigInteger.prototype.dMultiply = bnpDMultiply;
    // (protected) this *= n, this >= 0, 1 < n < DV
    BigInteger.prototype.dMultiply = function (n) {
        this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
        ++this.t;
        this.clamp();
    };
    // BigInteger.prototype.dAddOffset = bnpDAddOffset;
    // (protected) this += n << w words, this >= 0
    BigInteger.prototype.dAddOffset = function (n, w) {
        if (n == 0) {
            return;
        }
        while (this.t <= w) {
            this[this.t++] = 0;
        }
        this[w] += n;
        while (this[w] >= this.DV) {
            this[w] -= this.DV;
            if (++w >= this.t) {
                this[this.t++] = 0;
            }
            ++this[w];
        }
    };
    // BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
    // (protected) r = lower n words of "this * a", a.t <= n
    // "this" should be the larger one if appropriate.
    BigInteger.prototype.multiplyLowerTo = function (a, n, r) {
        var i = Math.min(this.t + a.t, n);
        r.s = 0; // assumes a,this >= 0
        r.t = i;
        while (i > 0) {
            r[--i] = 0;
        }
        for (var j = r.t - this.t; i < j; ++i) {
            r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
        }
        for (var j = Math.min(a.t, n); i < j; ++i) {
            this.am(0, a[i], r, i, 0, n - i);
        }
        r.clamp();
    };
    // BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
    // (protected) r = "this * a" without lower n words, n > 0
    // "this" should be the larger one if appropriate.
    BigInteger.prototype.multiplyUpperTo = function (a, n, r) {
        --n;
        var i = r.t = this.t + a.t - n;
        r.s = 0; // assumes a,this >= 0
        while (--i >= 0) {
            r[i] = 0;
        }
        for (i = Math.max(n - this.t, 0); i < a.t; ++i) {
            r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
        }
        r.clamp();
        r.drShiftTo(1, r);
    };
    // BigInteger.prototype.modInt = bnpModInt;
    // (protected) this % n, n < 2^26
    BigInteger.prototype.modInt = function (n) {
        if (n <= 0) {
            return 0;
        }
        var d = this.DV % n;
        var r = (this.s < 0) ? n - 1 : 0;
        if (this.t > 0) {
            if (d == 0) {
                r = this[0] % n;
            }
            else {
                for (var i = this.t - 1; i >= 0; --i) {
                    r = (d * r + this[i]) % n;
                }
            }
        }
        return r;
    };
    // BigInteger.prototype.millerRabin = bnpMillerRabin;
    // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
    BigInteger.prototype.millerRabin = function (t) {
        var n1 = this.subtract(BigInteger.ONE);
        var k = n1.getLowestSetBit();
        if (k <= 0) {
            return false;
        }
        var r = n1.shiftRight(k);
        t = (t + 1) >> 1;
        if (t > lowprimes.length) {
            t = lowprimes.length;
        }
        var a = nbi();
        for (var i = 0; i < t; ++i) {
            // Pick bases at random, instead of starting at 2
            a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
            var y = a.modPow(r, this);
            if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
                var j = 1;
                while (j++ < k && y.compareTo(n1) != 0) {
                    y = y.modPowInt(2, this);
                    if (y.compareTo(BigInteger.ONE) == 0) {
                        return false;
                    }
                }
                if (y.compareTo(n1) != 0) {
                    return false;
                }
            }
        }
        return true;
    };
    // BigInteger.prototype.square = bnSquare;
    // (public) this^2
    BigInteger.prototype.square = function () {
        var r = nbi();
        this.squareTo(r);
        return r;
    };
    //#region ASYNC
    // Public API method
    BigInteger.prototype.gcda = function (a, callback) {
        var x = (this.s < 0) ? this.negate() : this.clone();
        var y = (a.s < 0) ? a.negate() : a.clone();
        if (x.compareTo(y) < 0) {
            var t = x;
            x = y;
            y = t;
        }
        var i = x.getLowestSetBit();
        var g = y.getLowestSetBit();
        if (g < 0) {
            callback(x);
            return;
        }
        if (i < g) {
            g = i;
        }
        if (g > 0) {
            x.rShiftTo(g, x);
            y.rShiftTo(g, y);
        }
        // Workhorse of the algorithm, gets called 200 - 800 times per 512 bit keygen.
        var gcda1 = function () {
            if ((i = x.getLowestSetBit()) > 0) {
                x.rShiftTo(i, x);
            }
            if ((i = y.getLowestSetBit()) > 0) {
                y.rShiftTo(i, y);
            }
            if (x.compareTo(y) >= 0) {
                x.subTo(y, x);
                x.rShiftTo(1, x);
            }
            else {
                y.subTo(x, y);
                y.rShiftTo(1, y);
            }
            if (!(x.signum() > 0)) {
                if (g > 0) {
                    y.lShiftTo(g, y);
                }
                setTimeout(function () { callback(y); }, 0); // escape
            }
            else {
                setTimeout(gcda1, 0);
            }
        };
        setTimeout(gcda1, 10);
    };
    // (protected) alternate constructor
    BigInteger.prototype.fromNumberAsync = function (a, b, c, callback) {
        if ("number" == typeof b) {
            if (a < 2) {
                this.fromInt(1);
            }
            else {
                this.fromNumber(a, c);
                if (!this.testBit(a - 1)) {
                    this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), __WEBPACK_IMPORTED_MODULE_0__util__["f" /* op_or */], this);
                }
                if (this.isEven()) {
                    this.dAddOffset(1, 0);
                }
                var bnp_1 = this;
                var bnpfn1_1 = function () {
                    bnp_1.dAddOffset(2, 0);
                    if (bnp_1.bitLength() > a) {
                        bnp_1.subTo(BigInteger.ONE.shiftLeft(a - 1), bnp_1);
                    }
                    if (bnp_1.isProbablePrime(b)) {
                        setTimeout(function () { callback(); }, 0); // escape
                    }
                    else {
                        setTimeout(bnpfn1_1, 0);
                    }
                };
                setTimeout(bnpfn1_1, 0);
            }
        }
        else {
            var x = [];
            var t = a & 7;
            x.length = (a >> 3) + 1;
            b.nextBytes(x);
            if (t > 0) {
                x[0] &= ((1 << t) - 1);
            }
            else {
                x[0] = 0;
            }
            this.fromString(x, 256);
        }
    };
    return BigInteger;
}());

//#region REDUCERS
//#region NullExp
var NullExp = /** @class */ (function () {
    function NullExp() {
    }
    // NullExp.prototype.convert = nNop;
    NullExp.prototype.convert = function (x) {
        return x;
    };
    // NullExp.prototype.revert = nNop;
    NullExp.prototype.revert = function (x) {
        return x;
    };
    // NullExp.prototype.mulTo = nMulTo;
    NullExp.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
    };
    // NullExp.prototype.sqrTo = nSqrTo;
    NullExp.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
    };
    return NullExp;
}());
// Modular reduction using "classic" algorithm
var Classic = /** @class */ (function () {
    function Classic(m) {
        this.m = m;
    }
    // Classic.prototype.convert = cConvert;
    Classic.prototype.convert = function (x) {
        if (x.s < 0 || x.compareTo(this.m) >= 0) {
            return x.mod(this.m);
        }
        else {
            return x;
        }
    };
    // Classic.prototype.revert = cRevert;
    Classic.prototype.revert = function (x) {
        return x;
    };
    // Classic.prototype.reduce = cReduce;
    Classic.prototype.reduce = function (x) {
        x.divRemTo(this.m, null, x);
    };
    // Classic.prototype.mulTo = cMulTo;
    Classic.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    };
    // Classic.prototype.sqrTo = cSqrTo;
    Classic.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
        this.reduce(r);
    };
    return Classic;
}());

//#endregion
//#region Montgomery
// Montgomery reduction
var Montgomery = /** @class */ (function () {
    function Montgomery(m) {
        this.m = m;
        this.mp = m.invDigit();
        this.mpl = this.mp & 0x7fff;
        this.mph = this.mp >> 15;
        this.um = (1 << (m.DB - 15)) - 1;
        this.mt2 = 2 * m.t;
    }
    // Montgomery.prototype.convert = montConvert;
    // xR mod m
    Montgomery.prototype.convert = function (x) {
        var r = nbi();
        x.abs().dlShiftTo(this.m.t, r);
        r.divRemTo(this.m, null, r);
        if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
            this.m.subTo(r, r);
        }
        return r;
    };
    // Montgomery.prototype.revert = montRevert;
    // x/R mod m
    Montgomery.prototype.revert = function (x) {
        var r = nbi();
        x.copyTo(r);
        this.reduce(r);
        return r;
    };
    // Montgomery.prototype.reduce = montReduce;
    // x = x/R mod m (HAC 14.32)
    Montgomery.prototype.reduce = function (x) {
        while (x.t <= this.mt2) {
            // pad x so am has enough room later
            x[x.t++] = 0;
        }
        for (var i = 0; i < this.m.t; ++i) {
            // faster way of calculating u0 = x[i]*mp mod DV
            var j = x[i] & 0x7fff;
            var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
            // use am to combine the multiply-shift-add into one call
            j = i + this.m.t;
            x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
            // propagate carry
            while (x[j] >= x.DV) {
                x[j] -= x.DV;
                x[++j]++;
            }
        }
        x.clamp();
        x.drShiftTo(this.m.t, x);
        if (x.compareTo(this.m) >= 0) {
            x.subTo(this.m, x);
        }
    };
    // Montgomery.prototype.mulTo = montMulTo;
    // r = "xy/R mod m"; x,y != r
    Montgomery.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    };
    // Montgomery.prototype.sqrTo = montSqrTo;
    // r = "x^2/R mod m"; x != r
    Montgomery.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
        this.reduce(r);
    };
    return Montgomery;
}());

//#endregion Montgomery
//#region Barrett
// Barrett modular reduction
var Barrett = /** @class */ (function () {
    function Barrett(m) {
        this.m = m;
        // setup Barrett
        this.r2 = nbi();
        this.q3 = nbi();
        BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
        this.mu = this.r2.divide(m);
    }
    // Barrett.prototype.convert = barrettConvert;
    Barrett.prototype.convert = function (x) {
        if (x.s < 0 || x.t > 2 * this.m.t) {
            return x.mod(this.m);
        }
        else if (x.compareTo(this.m) < 0) {
            return x;
        }
        else {
            var r = nbi();
            x.copyTo(r);
            this.reduce(r);
            return r;
        }
    };
    // Barrett.prototype.revert = barrettRevert;
    Barrett.prototype.revert = function (x) {
        return x;
    };
    // Barrett.prototype.reduce = barrettReduce;
    // x = x mod m (HAC 14.42)
    Barrett.prototype.reduce = function (x) {
        x.drShiftTo(this.m.t - 1, this.r2);
        if (x.t > this.m.t + 1) {
            x.t = this.m.t + 1;
            x.clamp();
        }
        this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
        this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
        while (x.compareTo(this.r2) < 0) {
            x.dAddOffset(1, this.m.t + 1);
        }
        x.subTo(this.r2, x);
        while (x.compareTo(this.m) >= 0) {
            x.subTo(this.m, x);
        }
    };
    // Barrett.prototype.mulTo = barrettMulTo;
    // r = x*y mod m; x,y != r
    Barrett.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    };
    // Barrett.prototype.sqrTo = barrettSqrTo;
    // r = x^2 mod m; x != r
    Barrett.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
        this.reduce(r);
    };
    return Barrett;
}());
//#endregion
//#endregion REDUCERS
// return new, unset BigInteger
function nbi() { return new BigInteger(null); }
function parseBigInt(str, r) {
    return new BigInteger(str, r);
}
// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.
// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i, x, w, j, c, n) {
    while (--n >= 0) {
        var v = x * this[i++] + w[j] + c;
        c = Math.floor(v / 0x4000000);
        w[j++] = v & 0x3ffffff;
    }
    return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i, x, w, j, c, n) {
    var xl = x & 0x7fff;
    var xh = x >> 15;
    while (--n >= 0) {
        var l = this[i] & 0x7fff;
        var h = this[i++] >> 15;
        var m = xh * l + h * xl;
        l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
        c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
        w[j++] = l & 0x3fffffff;
    }
    return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i, x, w, j, c, n) {
    var xl = x & 0x3fff;
    var xh = x >> 14;
    while (--n >= 0) {
        var l = this[i] & 0x3fff;
        var h = this[i++] >> 14;
        var m = xh * l + h * xl;
        l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
        c = (l >> 28) + (m >> 14) + xh * h;
        w[j++] = l & 0xfffffff;
    }
    return c;
}
if (j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    BigInteger.prototype.am = am2;
    dbits = 30;
}
else if (j_lm && (navigator.appName != "Netscape")) {
    BigInteger.prototype.am = am1;
    dbits = 26;
}
else {
    BigInteger.prototype.am = am3;
    dbits = 28;
}
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1 << dbits) - 1);
BigInteger.prototype.DV = (1 << dbits);
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
// Digit conversions
var BI_RC = [];
var rr;
var vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv) {
    BI_RC[rr++] = vv;
}
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) {
    BI_RC[rr++] = vv;
}
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) {
    BI_RC[rr++] = vv;
}
function intAt(s, i) {
    var c = BI_RC[s.charCodeAt(i)];
    return (c == null) ? -1 : c;
}
// return bigint initialized to value
function nbv(i) {
    var r = nbi();
    r.fromInt(i);
    return r;
}
// returns bit length of the integer x
function nbits(x) {
    var r = 1;
    var t;
    if ((t = x >>> 16) != 0) {
        x = t;
        r += 16;
    }
    if ((t = x >> 8) != 0) {
        x = t;
        r += 8;
    }
    if ((t = x >> 4) != 0) {
        x = t;
        r += 4;
    }
    if ((t = x >> 2) != 0) {
        x = t;
        r += 2;
    }
    if ((t = x >> 1) != 0) {
        x = t;
        r += 1;
    }
    return r;
}
// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = hex2b64;
/* harmony export (immutable) */ __webpack_exports__["a"] = b64tohex;
/* unused harmony export b64toBA */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(2);

var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64pad = "=";
function hex2b64(h) {
    var i;
    var c;
    var ret = "";
    for (i = 0; i + 3 <= h.length; i += 3) {
        c = parseInt(h.substring(i, i + 3), 16);
        ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
    }
    if (i + 1 == h.length) {
        c = parseInt(h.substring(i, i + 1), 16);
        ret += b64map.charAt(c << 2);
    }
    else if (i + 2 == h.length) {
        c = parseInt(h.substring(i, i + 2), 16);
        ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
    }
    while ((ret.length & 3) > 0) {
        ret += b64pad;
    }
    return ret;
}
// convert a base64 string to hex
function b64tohex(s) {
    var ret = "";
    var i;
    var k = 0; // b64 state, 0-3
    var slop = 0;
    for (i = 0; i < s.length; ++i) {
        if (s.charAt(i) == b64pad) {
            break;
        }
        var v = b64map.indexOf(s.charAt(i));
        if (v < 0) {
            continue;
        }
        if (k == 0) {
            ret += Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* int2char */])(v >> 2);
            slop = v & 3;
            k = 1;
        }
        else if (k == 1) {
            ret += Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* int2char */])((slop << 2) | (v >> 4));
            slop = v & 0xf;
            k = 2;
        }
        else if (k == 2) {
            ret += Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* int2char */])(slop);
            ret += Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* int2char */])(v >> 2);
            slop = v & 3;
            k = 3;
        }
        else {
            ret += Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* int2char */])((slop << 2) | (v >> 4));
            ret += Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* int2char */])(v & 0xf);
            k = 0;
        }
    }
    if (k == 1) {
        ret += Object(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* int2char */])(slop << 2);
    }
    return ret;
}
// convert a base64 string to a byte/number array
function b64toBA(s) {
    // piggyback on b64tohex for now, optimize later
    var h = b64tohex(s);
    var i;
    var a = [];
    for (i = 0; 2 * i < h.length; ++i) {
        a[i] = parseInt(h.substring(2 * i, 2 * i + 2), 16);
    }
    return a;
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = int2char;
/* harmony export (immutable) */ __webpack_exports__["d"] = op_and;
/* harmony export (immutable) */ __webpack_exports__["f"] = op_or;
/* harmony export (immutable) */ __webpack_exports__["g"] = op_xor;
/* harmony export (immutable) */ __webpack_exports__["e"] = op_andnot;
/* harmony export (immutable) */ __webpack_exports__["c"] = lbit;
/* harmony export (immutable) */ __webpack_exports__["a"] = cbit;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
function int2char(n) {
    return BI_RM.charAt(n);
}
//#region BIT_OPERATIONS
// (public) this & a
function op_and(x, y) {
    return x & y;
}
// (public) this | a
function op_or(x, y) {
    return x | y;
}
// (public) this ^ a
function op_xor(x, y) {
    return x ^ y;
}
// (public) this & ~a
function op_andnot(x, y) {
    return x & ~y;
}
// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
    if (x == 0) {
        return -1;
    }
    var r = 0;
    if ((x & 0xffff) == 0) {
        x >>= 16;
        r += 16;
    }
    if ((x & 0xff) == 0) {
        x >>= 8;
        r += 8;
    }
    if ((x & 0xf) == 0) {
        x >>= 4;
        r += 4;
    }
    if ((x & 3) == 0) {
        x >>= 2;
        r += 2;
    }
    if ((x & 1) == 0) {
        ++r;
    }
    return r;
}
// return number of 1 bits in x
function cbit(x) {
    var r = 0;
    while (x != 0) {
        x &= x - 1;
        ++r;
    }
    return r;
}
//#endregion BIT_OPERATIONS


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_JSEncrypt__ = __webpack_require__(4);


var keySizes = [128, 256, 512, 1024, 2048];

var pbkeys = [
  "-----BEGIN PUBLIC KEY-----\n" +
  "MCwwDQYJKoZIhvcNAQEBBQADGwAwGAIRAMfE82X6tlpNK7Bxbhg6nEECAwEAAQ==\n" +
  "-----END PUBLIC KEY-----",
  "-----BEGIN PUBLIC KEY-----\n" +
  "MDwwDQYJKoZIhvcNAQEBBQADKwAwKAIhAMLw0mRGv5KF+P0LsgNvfrM5AJdVBWqr\n" +
  "Q6Bf2gES5gwPAgMBAAE=\n" +
  "-----END PUBLIC KEY-----",
  "-----BEGIN PUBLIC KEY-----\n" +
  "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKEpu21RDTXxEly55HdkVV9SlFL3Hgpl\n" +
  "i6+IohAsnaqFnApsKi1R7fAd3tBLmeHV2tlxYIogtxpzfpcc+QBVDx8CAwEAAQ==\n" +
  "-----END PUBLIC KEY-----",
  "-----BEGIN PUBLIC KEY-----\n" +
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5LO5xVlO9g4PL1xdWudnihIAP\n" +
  "bMsixr396bIbBIwKBul98UWQ3UALbqByq2bXVuoIbl48UokxOVstenGCyyo026NF\n" +
  "h3Fg6Cnvj9ptvbmqk2i3eTOBrt+e26Z1sepsnQL5OojiVIbrWwS6v1pFCXpnnLLv\n" +
  "yy6GPt/kftbhazH3oQIDAQAB\n" +
  "-----END PUBLIC KEY-----",
  "-----BEGIN PUBLIC KEY-----\n" +
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtKrsFSnzYl19m5wTwYdu\n" +
  "/r1UVZJV+zkAFud6+XTInAy8HbCR9n59H9+54P+Af/fUE6rvEPc4H09Z63vQzIGM\n" +
  "iL6GlqzMmptv/KRDIhj7Mk3MXomvEVfUsXrz5IpO0lf6NSeGhz4PGZUkHZ30VRx3\n" +
  "Jd/a0KIhgftZHxzmMsh8iB/n781B18pCP2eOPTF+5gRCaW+0fVPBlb/mBlg8MJrd\n" +
  "ScGCAReQ9NfTq8slJ0aO1NWaaRRANPQcCMljnTIK1ssyXBaSHKfoWeGx141mWMRx\n" +
  "/LxyZ13Zc3lqgmICiKFqMrQl5UeV1IUXYpj5hO9f60LGpZVHDqqo/JdF3+VAheaf\n" +
  "QwIDAQAB\n" +
  "-----END PUBLIC KEY-----"
];

var prkeys = [
  "-----BEGIN RSA PRIVATE KEY-----\n" +
  "MGMCAQACEQDHxPNl+rZaTSuwcW4YOpxBAgMBAAECEQCqk6mhsmpyv17fK1dPeD3h\n" +
  "AgkA9Lo1aGRom0sCCQDQ+JpqE6KDIwIJAKstyIfBnA3rAggOsWwqCTdkAQIIOP95\n" +
  "RV9y2iQ=\n" +
  "-----END RSA PRIVATE KEY-----\n",
  "-----BEGIN RSA PRIVATE KEY-----\n" +
  "MIGqAgEAAiEAwvDSZEa/koX4/QuyA29+szkAl1UFaqtDoF/aARLmDA8CAwEAAQIh\n" +
  "AME2Z5Ez/hR/7PUBboKxM2U7hSaavytvocBdQjLvOUWhAhEA8HgiLHRk9KjJ2hp0\n" +
  "5q3BfQIRAM+H7dYUXRnKXjYoqiKueXsCEGnaaCirf/lXB6vzs3wMBr0CEHT2Xwzw\n" +
  "nSgT7dUIRhsVylECEFQRGFtZcKRmL8lqTBwECWI=\n" +
  "-----END RSA PRIVATE KEY-----\n",
  "-----BEGIN RSA PRIVATE KEY-----\n" +
  "MIIBOQIBAAJBAKEpu21RDTXxEly55HdkVV9SlFL3Hgpli6+IohAsnaqFnApsKi1R\n" +
  "7fAd3tBLmeHV2tlxYIogtxpzfpcc+QBVDx8CAwEAAQJAFn0VS07JEiLelhPWfpaA\n" +
  "lzmVuvICvh6nXEormygupBGiIPSXfIsTFid26yxt9wu4JHeRF0lq+Ozo55XpBQED\n" +
  "4QIhAM0E7ikuEa2bDsR2hQJhIz3SvzzyhE5dJcqFjRtKtMQvAiEAyT0C0gUyqCdN\n" +
  "YuRON1T7FUffarMdQXR+8tgRkhoCeBECID+ZKfAoVF+QXDJhub0VOQNyntRfPt+4\n" +
  "UYLTjwRKVm0NAiBuOCtuSoiHTxd0naU1aycmbboxn67bZeoOKkfdZL+LcQIgK6Xh\n" +
  "1wb9I/sNYv9ByJEGBNJRwtUEZrk5babLEdkUq90=\n" +
  "-----END RSA PRIVATE KEY-----\n",
  "-----BEGIN RSA PRIVATE KEY-----\n" +
  "MIICXgIBAAKBgQC5LO5xVlO9g4PL1xdWudnihIAPbMsixr396bIbBIwKBul98UWQ\n" +
  "3UALbqByq2bXVuoIbl48UokxOVstenGCyyo026NFh3Fg6Cnvj9ptvbmqk2i3eTOB\n" +
  "rt+e26Z1sepsnQL5OojiVIbrWwS6v1pFCXpnnLLvyy6GPt/kftbhazH3oQIDAQAB\n" +
  "AoGAA+EiGbPCS10e/L1D2uhH3UwDVs9jrhXV0yT7Oz+sI2WjrKTKXU+VUOf/aoeW\n" +
  "vvouKwEM7lyYTTSzaU+AY0oYVzv7HN9hWoVwi0NoPpd4V1RFfFb4+4DmXh+NZS7E\n" +
  "DX9+WY435Yc9Qj7uHoc8EoRk3QfWaZTXd69b/9tS4Yy/tnECQQDxHsSe7Qxd+6tf\n" +
  "/f4eO+bENCxIMbPU8GPWQCvq9eT9Av2I0LTTchmlhG1TSatq62zq+Unef8M/IOBs\n" +
  "j5z3issdAkEAxJpYiuAVXulViUOLdS3QX72owIQLxpFBAKQ9cPTafqc47ms4Swy2\n" +
  "FCa4MZfTJXrDX5pur+PNeP/ce6xZN5DzVQJBAJI1kgy8uU8UGKswnTNAJ4K6EFAG\n" +
  "s4Ff82orp3XmfWBeu9aGl9/PxHV1g8WJWoSPFZC2cXCWEJLrIKszun7wjpECQQCs\n" +
  "Z+mjh1RWUepHn+rozE9B1jDo+iLVc8V8CYszxhThIkWjlnTcI358d2PpYYmxAVHZ\n" +
  "QbU1G2CxbjZsYbwvJTatAkEAspmMlIyKWgrQkLJ4rbPespMJCGe6VYharl1Qc5CF\n" +
  "/2SgKSCuLfhA/Cur0nO3dxt6XJijk/r3+j+8L/m+wqud+A==\n" +
  "-----END RSA PRIVATE KEY-----\n",
  "-----BEGIN RSA PRIVATE KEY-----\n" +
  "MIIEpAIBAAKCAQEAtKrsFSnzYl19m5wTwYdu/r1UVZJV+zkAFud6+XTInAy8HbCR\n" +
  "9n59H9+54P+Af/fUE6rvEPc4H09Z63vQzIGMiL6GlqzMmptv/KRDIhj7Mk3MXomv\n" +
  "EVfUsXrz5IpO0lf6NSeGhz4PGZUkHZ30VRx3Jd/a0KIhgftZHxzmMsh8iB/n781B\n" +
  "18pCP2eOPTF+5gRCaW+0fVPBlb/mBlg8MJrdScGCAReQ9NfTq8slJ0aO1NWaaRRA\n" +
  "NPQcCMljnTIK1ssyXBaSHKfoWeGx141mWMRx/LxyZ13Zc3lqgmICiKFqMrQl5UeV\n" +
  "1IUXYpj5hO9f60LGpZVHDqqo/JdF3+VAheafQwIDAQABAoIBAQCS/++PWM7bXk5x\n" +
  "apD4ioXZZ5tS9PpYqoxUFoyMpGUF86asUZqyAUE1ygen9rxLYw5/4jkaiMx1TU9Q\n" +
  "tzGw9Eewi7Veq8LemVKJMe4dtE3PJFYBJe34IorAzdXcQlzX8RV4YmynZetLWXpF\n" +
  "Ttwa1Ept2rJjx0eURzrAgfcbot0Qs+c8bB0qnGC67PoL3DyYg8vX5PDmiiA2VZMG\n" +
  "EylVQS09toJn5ReaKCtjxJb/XFQjBeSP0xLjvZZftGDJgpwmmi7Sy/zAZoF4+7wf\n" +
  "8nihXk4ZfYC+beBj5U9pcUcs6LdNobUofWFRLSjueseRQBI0sKUslr3Ye4zhkrWM\n" +
  "CDnsSxBhAoGBANi0spS/Mc6xH1189mR7dJV9gy7KkGxheAstwCJr7WzbXqglhFm2\n" +
  "SvY9hrpE9OYWir5EqX6jM6VipSobTn0RpCsYUC/J1ISMyEA5UkPLP4jHQw6UUDN2\n" +
  "1fNAXffEyuju5ShP9Mk2unZstlUweKlFF7d1k7YAzWDIKnF6bOL06YC9AoGBANVt\n" +
  "XM4OH0zw8M97W04WwYGoa5s1Y5JYc4RMV200cr3iONVfLZgSP8thP1qPuoMM3OJg\n" +
  "Bqe6MRmo/VXhgVvpke04ZJ83LSz/SoqfVRNwxuCHqp3beJQPxrAp1d/L7Ey7f41U\n" +
  "QBE8pibFb8bbgOTUW5iyZbg7lLS8nghsn+BqYp//AoGBAJO/574o+YGOG+92wttR\n" +
  "nPRLhgSCEaQDdIBSqhwN7+v3SXtlUO6FrmhjHJelaj/yAJinYdS42v6Y2jlyMrpt\n" +
  "K7xCMHHUrzPMdL/tFRyp1+Ce0yZ+kov0Kv1V1nuWzi2wq8cndKM30Dvr9QjyKmJm\n" +
  "fDwWSyadN2oUL3P9X34CM64VAoGAbajAW1skN/tAL8r48dl9WWo4x8mZvJLX36z9\n" +
  "6q1dGzVF8FPz8EPIJW51B8n7keQlBedC5CElo0KRz/OK7LfI87La+Hd4LbuKCEmv\n" +
  "g8qZVLpALtWaUbD9bHxCWLfFVPOtqOcV+AVKdXdSZEFaK7j0yzM2Un/Ce07CgB+X\n" +
  "0c23mO8CgYAOqnUR/uPIzkvj/eIbO7pnhHoKZ4Ji2TrIBqjskzaFd0Tox9i3SWKa\n" +
  "cRdQciRIT1wkMdywnHFrJT1rwYXxcgfQXAku/vnYqAfvIzY7TyoL3pWX55O0Zrs7\n" +
  "05R9mA5TZmzUU9m/PzUrRjasOGYSKkCz4Y2qGlrKI3H0aE+p+R56kQ==\n" +
  "-----END RSA PRIVATE KEY-----\n"
];

keySizes.forEach(function(keySize, index){
    
    var jse = new __WEBPACK_IMPORTED_MODULE_0__src_JSEncrypt__["a" /* JSEncrypt */]({default_key_size:keySize});
    var openssl_public_key = pbkeys[index];
    var openssl_private_key = prkeys[index];
    
    describe('JSEncrypt - '+keySize+' bit', function(){
        //this.timeout(0); //Timout for test cases, zero means infinite. Needed for key sizes > 1024
        
        describe('#getKey()', function(){
            
            it('should be '+keySize+' bit long', function () {
                
                var key = jse.getKey();
                var length = key.n.bitLength();
                length = length%2===0 ? length: length+1;
                expect(length).to.equal(keySize);

            });
            
        });

        describe('#encrypt() | #decrypt()', function(){
            
            //Tom Wu's RSA Object use paddingpkcs #1, type 2
            var maxLength = (((jse.getKey().n.bitLength()+7)>>3)-11);
            var maxLengthBit = maxLength << 3;
            
            it('should encrypt/decrypt up to '+maxLengthBit+' bit', function () {

                var test = [];
                for (var i=0; i<maxLength;i++)
                    test.push('a');
                test = test.join('');

                var encrypted = jse.encrypt(test);
                expect(encrypted).to.be.ok();

                var decrypted = jse.decrypt(encrypted);
                expect(decrypted).to.be(test);

            });

            it('should fail to encrypt more than '+maxLengthBit+' bit', function(){
                
                var test = [];
                for (var i=0; i<(maxLength+1);i++)
                    test.push('a');
                test = test.join('');

                var encrypted = jse.encrypt(test);
                expect(encrypted).to.not.be.ok();
                
            });

        });
        
        describe('#getPublicKey()', function(){
            
            var pkey = jse.getPublicKey();
            
            it('should be a non-empty string', function(){
                
                expect(pkey).to.be.a('string');
                expect(pkey).to.not.be.empty();
                
            });
            
            it('should contain public header and footer and be wrapped at 64 chars', function(){
                //For small bit keys, the public key may contain only one line
                var regex = /-----BEGIN PUBLIC KEY-----\n((.{64}\n)+(.{1,64}\n)?)|(.{1,64}\n)-----END PUBLIC KEY-----/;
                expect(pkey).to.match(regex);

            });
            
        });
        
        describe('#getPrivateKey()', function(){
            
            var pkey = jse.getPrivateKey();
            
            it('should be a non-empty string', function(){
                
                expect(pkey).to.be.a('string');
                expect(pkey).to.not.be.empty();
                
            });
            
            it('should contain private header and footer and be wrapped at 64 chars', function(){
                
                var regex = /-----BEGIN RSA PRIVATE KEY-----\n(.{64}\n)+(.{1,64}\n)?-----END RSA PRIVATE KEY-----/;
                expect(pkey).to.match(regex);
                
            });
            
        });
        
        describe('#getPublicKeyB64()', function(){
            
            var pkey = jse.getPublicKeyB64();
            
            it('should be a non-empty string', function(){
                
                expect(pkey).to.be.a('string');
                expect(pkey).to.not.be.empty();
                
            });
            
            it('should not contain public header and footer,one line, base64 encoded', function(){
                
                //regex to match base64 encoded string, reference:
                //http://stackoverflow.com/a/5885097/1446321
                var regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
                expect(pkey).to.match(regex);
                
            });
            
        });
        
        describe('#getPrivateKeyB64()', function(){
            
            var pkey = jse.getPrivateKeyB64();
            
            it('should be a non-empty string', function(){
                
                expect(pkey).to.be.a('string');
                expect(pkey).to.not.be.empty();
                
            });
            
            it('should not contain private header and footer,one line, base64 encoded', function(){
                
                //regex to match base64 encoded string, reference:
                //http://stackoverflow.com/a/5885097/1446321
                var regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
                expect(pkey).to.match(regex);
                
            });
            
        });
        
        describe('#setPrivateKey()', function(){
            
            var tmp = new __WEBPACK_IMPORTED_MODULE_0__src_JSEncrypt__["a" /* JSEncrypt */]();
            tmp.setPrivateKey(openssl_private_key);
            
            it('should correctly set the private key parameters',function(){
                
                var params = ['n', 'e', 'd', 'p', 'q', 'dmp1', 'dmq1', 'coeff'];
                expect(tmp.key).to.be.ok();
                expect(tmp.key).to.have.keys(params);
                params.forEach(function(value,index){
                    expect(tmp.key[value]).to.be.ok();
                });
                
            });
            
            it('should both encrypt and decrypt',function(){
               
               var test = 'test';
               var enc = tmp.encrypt(test);
               expect(enc).to.be.ok();
               var dec = tmp.decrypt(enc);
               expect(dec).to.be(test);
                
            });
            
        });
        
        describe('#setPublicKey()', function(){
            
            var tmp = new __WEBPACK_IMPORTED_MODULE_0__src_JSEncrypt__["a" /* JSEncrypt */]();
            tmp.setPublicKey(openssl_public_key);
            
            it('should correctly set the public key parameters',function(){
                
                var pub_params = ['n', 'e'];
                var priv_params = ['d', 'p', 'q', 'dmp1', 'dmq1', 'coeff'];
                expect(tmp.key).to.be.ok();
                expect(tmp.key).to.have.keys(pub_params);
                pub_params.forEach(function(value,index){
                    expect(tmp.key[value]).to.be.ok();
                });
                priv_params.forEach(function(value,index){
                    expect(tmp.key[value]).to.not.be.ok();
                });
                
            });
            
            it('should only encrypt',function(){
               
               var test = 'test';
               var enc = tmp.encrypt(test);
               var dec = tmp.decrypt(enc);
               expect(enc).to.be.ok();
               expect(dec).to.not.be.ok();
                
            });
            
        });
        
    });
    
});



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JSEncrypt; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_jsbn_base64__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__JSEncryptRSAKey__ = __webpack_require__(5);


/**
 *
 * @param {Object} [options = {}] - An object to customize JSEncrypt behaviour
 * possible parameters are:
 * - default_key_size        {number}  default: 1024 the key size in bit
 * - default_public_exponent {string}  default: '010001' the hexadecimal representation of the public exponent
 * - log                     {boolean} default: false whether log warn/error or not
 * @constructor
 */
var JSEncrypt = /** @class */ (function () {
    function JSEncrypt(options) {
        options = options || {};
        this.default_key_size = parseInt(options.default_key_size, 10) || 1024;
        this.default_public_exponent = options.default_public_exponent || "010001"; // 65537 default openssl public exponent for rsa key type
        this.log = options.log || false;
        // The private and public key.
        this.key = null;
    }
    /**
     * Method to set the rsa key parameter (one method is enough to set both the public
     * and the private key, since the private key contains the public key paramenters)
     * Log a warning if logs are enabled
     * @param {Object|string} key the pem encoded string or an object (with or without header/footer)
     * @public
     */
    JSEncrypt.prototype.setKey = function (key) {
        if (this.log && this.key) {
            console.warn("A key was already set, overriding existing.");
        }
        this.key = new __WEBPACK_IMPORTED_MODULE_1__JSEncryptRSAKey__["a" /* JSEncryptRSAKey */](key);
    };
    /**
     * Proxy method for setKey, for api compatibility
     * @see setKey
     * @public
     */
    JSEncrypt.prototype.setPrivateKey = function (privkey) {
        // Create the key.
        this.setKey(privkey);
    };
    /**
     * Proxy method for setKey, for api compatibility
     * @see setKey
     * @public
     */
    JSEncrypt.prototype.setPublicKey = function (pubkey) {
        // Sets the public key.
        this.setKey(pubkey);
    };
    /**
     * Proxy method for RSAKey object's decrypt, decrypt the string using the private
     * components of the rsa key object. Note that if the object was not set will be created
     * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
     * @param {string} str base64 encoded crypted string to decrypt
     * @return {string} the decrypted string
     * @public
     */
    JSEncrypt.prototype.decrypt = function (str) {
        // Return the decrypted string.
        try {
            return this.getKey().decrypt(Object(__WEBPACK_IMPORTED_MODULE_0__lib_jsbn_base64__["a" /* b64tohex */])(str));
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Proxy method for RSAKey object's encrypt, encrypt the string using the public
     * components of the rsa key object. Note that if the object was not set will be created
     * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
     * @param {string} str the string to encrypt
     * @return {string} the encrypted string encoded in base64
     * @public
     */
    JSEncrypt.prototype.encrypt = function (str) {
        // Return the encrypted string.
        try {
            return Object(__WEBPACK_IMPORTED_MODULE_0__lib_jsbn_base64__["b" /* hex2b64 */])(this.getKey().encrypt(str));
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Getter for the current JSEncryptRSAKey object. If it doesn't exists a new object
     * will be created and returned
     * @param {callback} [cb] the callback to be called if we want the key to be generated
     * in an async fashion
     * @returns {JSEncryptRSAKey} the JSEncryptRSAKey object
     * @public
     */
    JSEncrypt.prototype.getKey = function (cb) {
        // Only create new if it does not exist.
        if (!this.key) {
            // Get a new private key.
            this.key = new __WEBPACK_IMPORTED_MODULE_1__JSEncryptRSAKey__["a" /* JSEncryptRSAKey */]();
            if (cb && {}.toString.call(cb) === "[object Function]") {
                this.key.generateAsync(this.default_key_size, this.default_public_exponent, cb);
                return;
            }
            // Generate the key.
            this.key.generate(this.default_key_size, this.default_public_exponent);
        }
        return this.key;
    };
    /**
     * Returns the pem encoded representation of the private key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the private key WITH header and footer
     * @public
     */
    JSEncrypt.prototype.getPrivateKey = function () {
        // Return the private representation of this key.
        return this.getKey().getPrivateKey();
    };
    /**
     * Returns the pem encoded representation of the private key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the private key WITHOUT header and footer
     * @public
     */
    JSEncrypt.prototype.getPrivateKeyB64 = function () {
        // Return the private representation of this key.
        return this.getKey().getPrivateBaseKeyB64();
    };
    /**
     * Returns the pem encoded representation of the public key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the public key WITH header and footer
     * @public
     */
    JSEncrypt.prototype.getPublicKey = function () {
        // Return the private representation of this key.
        return this.getKey().getPublicKey();
    };
    /**
     * Returns the pem encoded representation of the public key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the public key WITHOUT header and footer
     * @public
     */
    JSEncrypt.prototype.getPublicKeyB64 = function () {
        // Return the private representation of this key.
        return this.getKey().getPublicBaseKeyB64();
    };
    return JSEncrypt;
}());



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JSEncryptRSAKey; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_jsbn_base64__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_asn1js_hex__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_asn1js_base64__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lib_asn1js_asn1__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__lib_jsbn_rsa__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__lib_jsbn_jsbn__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__lib_jsrsasign_asn1_1_0__ = __webpack_require__(14);








/**
 * Create a new JSEncryptRSAKey that extends Tom Wu's RSA key object.
 * This object is just a decorator for parsing the key parameter
 * @param {string|Object} key - The key in string format, or an object containing
 * the parameters needed to build a RSAKey object.
 * @constructor
 */
var JSEncryptRSAKey = /** @class */ (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](JSEncryptRSAKey, _super);
    function JSEncryptRSAKey(key) {
        var _this = _super.call(this) || this;
        // Call the super constructor.
        //  RSAKey.call(this);
        // If a key key was provided.
        if (key) {
            // If this is a string...
            if (typeof key === "string") {
                _this.parseKey(key);
            }
            else if (JSEncryptRSAKey.hasPrivateKeyProperty(key) ||
                JSEncryptRSAKey.hasPublicKeyProperty(key)) {
                // Set the values for the key.
                _this.parsePropertiesFrom(key);
            }
        }
        return _this;
    }
    /**
     * Method to parse a pem encoded string containing both a public or private key.
     * The method will translate the pem encoded string in a der encoded string and
     * will parse private key and public key parameters. This method accepts public key
     * in the rsaencryption pkcs #1 format (oid: 1.2.840.113549.1.1.1).
     *
     * @todo Check how many rsa formats use the same format of pkcs #1.
     *
     * The format is defined as:
     * PublicKeyInfo ::= SEQUENCE {
     *   algorithm       AlgorithmIdentifier,
     *   PublicKey       BIT STRING
     * }
     * Where AlgorithmIdentifier is:
     * AlgorithmIdentifier ::= SEQUENCE {
     *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
     *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
     * }
     * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
     * RSAPublicKey ::= SEQUENCE {
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER   -- e
     * }
     * it's possible to examine the structure of the keys obtained from openssl using
     * an asn.1 dumper as the one used here to parse the components: http://lapo.it/asn1js/
     * @argument {string} pem the pem encoded string, can include the BEGIN/END header/footer
     * @private
     */
    JSEncryptRSAKey.prototype.parseKey = function (pem) {
        try {
            var modulus = 0;
            var public_exponent = 0;
            var reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
            var der = reHex.test(pem) ? __WEBPACK_IMPORTED_MODULE_2__lib_asn1js_hex__["a" /* Hex */].decode(pem) : __WEBPACK_IMPORTED_MODULE_3__lib_asn1js_base64__["a" /* Base64 */].unarmor(pem);
            var asn1 = __WEBPACK_IMPORTED_MODULE_4__lib_asn1js_asn1__["a" /* ASN1 */].decode(der);
            // Fixes a bug with OpenSSL 1.0+ private keys
            if (asn1.sub.length === 3) {
                asn1 = asn1.sub[2].sub[0];
            }
            if (asn1.sub.length === 9) {
                // Parse the private key.
                modulus = asn1.sub[1].getHexStringValue(); // bigint
                this.n = Object(__WEBPACK_IMPORTED_MODULE_6__lib_jsbn_jsbn__["c" /* parseBigInt */])(modulus, 16);
                public_exponent = asn1.sub[2].getHexStringValue(); // int
                this.e = parseInt(public_exponent, 16);
                var private_exponent = asn1.sub[3].getHexStringValue(); // bigint
                this.d = Object(__WEBPACK_IMPORTED_MODULE_6__lib_jsbn_jsbn__["c" /* parseBigInt */])(private_exponent, 16);
                var prime1 = asn1.sub[4].getHexStringValue(); // bigint
                this.p = Object(__WEBPACK_IMPORTED_MODULE_6__lib_jsbn_jsbn__["c" /* parseBigInt */])(prime1, 16);
                var prime2 = asn1.sub[5].getHexStringValue(); // bigint
                this.q = Object(__WEBPACK_IMPORTED_MODULE_6__lib_jsbn_jsbn__["c" /* parseBigInt */])(prime2, 16);
                var exponent1 = asn1.sub[6].getHexStringValue(); // bigint
                this.dmp1 = Object(__WEBPACK_IMPORTED_MODULE_6__lib_jsbn_jsbn__["c" /* parseBigInt */])(exponent1, 16);
                var exponent2 = asn1.sub[7].getHexStringValue(); // bigint
                this.dmq1 = Object(__WEBPACK_IMPORTED_MODULE_6__lib_jsbn_jsbn__["c" /* parseBigInt */])(exponent2, 16);
                var coefficient = asn1.sub[8].getHexStringValue(); // bigint
                this.coeff = Object(__WEBPACK_IMPORTED_MODULE_6__lib_jsbn_jsbn__["c" /* parseBigInt */])(coefficient, 16);
            }
            else if (asn1.sub.length === 2) {
                // Parse the public key.
                var bit_string = asn1.sub[1];
                var sequence = bit_string.sub[0];
                modulus = sequence.sub[0].getHexStringValue();
                this.n = Object(__WEBPACK_IMPORTED_MODULE_6__lib_jsbn_jsbn__["c" /* parseBigInt */])(modulus, 16);
                public_exponent = sequence.sub[1].getHexStringValue();
                this.e = parseInt(public_exponent, 16);
            }
            else {
                return false;
            }
            return true;
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Translate rsa parameters in a hex encoded string representing the rsa key.
     *
     * The translation follow the ASN.1 notation :
     * RSAPrivateKey ::= SEQUENCE {
     *   version           Version,
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER,  -- e
     *   privateExponent   INTEGER,  -- d
     *   prime1            INTEGER,  -- p
     *   prime2            INTEGER,  -- q
     *   exponent1         INTEGER,  -- d mod (p1)
     *   exponent2         INTEGER,  -- d mod (q-1)
     *   coefficient       INTEGER,  -- (inverse of q) mod p
     * }
     * @returns {string}  DER Encoded String representing the rsa private key
     * @private
     */
    JSEncryptRSAKey.prototype.getPrivateBaseKey = function () {
        var options = {
            array: [
                new __WEBPACK_IMPORTED_MODULE_7__lib_jsrsasign_asn1_1_0__["a" /* KJUR */].asn1.DERInteger({ int: 0 }),
                new __WEBPACK_IMPORTED_MODULE_7__lib_jsrsasign_asn1_1_0__["a" /* KJUR */].asn1.DERInteger({ bigint: this.n }),
                new __WEBPACK_IMPORTED_MODULE_7__lib_jsrsasign_asn1_1_0__["a" /* KJUR */].asn1.DERInteger({ int: this.e }),
                new __WEBPACK_IMPORTED_MODULE_7__lib_jsrsasign_asn1_1_0__["a" /* KJUR */].asn1.DERInteger({ bigint: this.d }),
                new __WEBPACK_IMPORTED_MODULE_7__lib_jsrsasign_asn1_1_0__["a" /* KJUR */].asn1.DERInteger({ bigint: this.p }),
                new __WEBPACK_IMPORTED_MODULE_7__lib_jsrsasign_asn1_1_0__["a" /* KJUR */].asn1.DERInteger({ bigint: this.q }),
                new __WEBPACK_IMPORTED_MODULE_7__lib_jsrsasign_asn1_1_0__["a" /* KJUR */].asn1.DERInteger({ bigint: this.dmp1 }),
                new __WEBPACK_IMPORTED_MODULE_7__lib_jsrsasign_asn1_1_0__["a" /* KJUR */].asn1.DERInteger({ bigint: this.dmq1 }),
                new __WEBPACK_IMPORTED_MODULE_7__lib_jsrsasign_asn1_1_0__["a" /* KJUR */].asn1.DERInteger({ bigint: this.coeff })
            ]
        };
        var seq = new __WEBPACK_IMPORTED_MODULE_7__lib_jsrsasign_asn1_1_0__["a" /* KJUR */].asn1.DERSequence(options);
        return seq.getEncodedHex();
    };
    /**
     * base64 (pem) encoded version of the DER encoded representation
     * @returns {string} pem encoded representation without header and footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPrivateBaseKeyB64 = function () {
        return Object(__WEBPACK_IMPORTED_MODULE_1__lib_jsbn_base64__["b" /* hex2b64 */])(this.getPrivateBaseKey());
    };
    /**
     * Translate rsa parameters in a hex encoded string representing the rsa public key.
     * The representation follow the ASN.1 notation :
     * PublicKeyInfo ::= SEQUENCE {
     *   algorithm       AlgorithmIdentifier,
     *   PublicKey       BIT STRING
     * }
     * Where AlgorithmIdentifier is:
     * AlgorithmIdentifier ::= SEQUENCE {
     *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
     *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
     * }
     * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
     * RSAPublicKey ::= SEQUENCE {
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER   -- e
     * }
     * @returns {string} DER Encoded String representing the rsa public key
     * @private
     */
    JSEncryptRSAKey.prototype.getPublicBaseKey = function () {
        var first_sequence = new __WEBPACK_IMPORTED_MODULE_7__lib_jsrsasign_asn1_1_0__["a" /* KJUR */].asn1.DERSequence({
            array: [
                new __WEBPACK_IMPORTED_MODULE_7__lib_jsrsasign_asn1_1_0__["a" /* KJUR */].asn1.DERObjectIdentifier({ oid: "1.2.840.113549.1.1.1" }),
                new __WEBPACK_IMPORTED_MODULE_7__lib_jsrsasign_asn1_1_0__["a" /* KJUR */].asn1.DERNull()
            ]
        });
        var second_sequence = new __WEBPACK_IMPORTED_MODULE_7__lib_jsrsasign_asn1_1_0__["a" /* KJUR */].asn1.DERSequence({
            array: [
                new __WEBPACK_IMPORTED_MODULE_7__lib_jsrsasign_asn1_1_0__["a" /* KJUR */].asn1.DERInteger({ bigint: this.n }),
                new __WEBPACK_IMPORTED_MODULE_7__lib_jsrsasign_asn1_1_0__["a" /* KJUR */].asn1.DERInteger({ int: this.e })
            ]
        });
        var bit_string = new __WEBPACK_IMPORTED_MODULE_7__lib_jsrsasign_asn1_1_0__["a" /* KJUR */].asn1.DERBitString({
            hex: "00" + second_sequence.getEncodedHex()
        });
        var seq = new __WEBPACK_IMPORTED_MODULE_7__lib_jsrsasign_asn1_1_0__["a" /* KJUR */].asn1.DERSequence({
            array: [
                first_sequence,
                bit_string
            ]
        });
        return seq.getEncodedHex();
    };
    /**
     * base64 (pem) encoded version of the DER encoded representation
     * @returns {string} pem encoded representation without header and footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPublicBaseKeyB64 = function () {
        return Object(__WEBPACK_IMPORTED_MODULE_1__lib_jsbn_base64__["b" /* hex2b64 */])(this.getPublicBaseKey());
    };
    /**
     * wrap the string in block of width chars. The default value for rsa keys is 64
     * characters.
     * @param {string} str the pem encoded string without header and footer
     * @param {Number} [width=64] - the length the string has to be wrapped at
     * @returns {string}
     * @private
     */
    JSEncryptRSAKey.wordwrap = function (str, width) {
        width = width || 64;
        if (!str) {
            return str;
        }
        var regex = "(.{1," + width + "})( +|$\n?)|(.{1," + width + "})";
        return str.match(RegExp(regex, "g")).join("\n");
    };
    /**
     * Retrieve the pem encoded private key
     * @returns {string} the pem encoded private key with header/footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPrivateKey = function () {
        var key = "-----BEGIN RSA PRIVATE KEY-----\n";
        key += JSEncryptRSAKey.wordwrap(this.getPrivateBaseKeyB64()) + "\n";
        key += "-----END RSA PRIVATE KEY-----";
        return key;
    };
    /**
     * Retrieve the pem encoded public key
     * @returns {string} the pem encoded public key with header/footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPublicKey = function () {
        var key = "-----BEGIN PUBLIC KEY-----\n";
        key += JSEncryptRSAKey.wordwrap(this.getPublicBaseKeyB64()) + "\n";
        key += "-----END PUBLIC KEY-----";
        return key;
    };
    /**
     * Check if the object contains the necessary parameters to populate the rsa modulus
     * and public exponent parameters.
     * @param {Object} [obj={}] - An object that may contain the two public key
     * parameters
     * @returns {boolean} true if the object contains both the modulus and the public exponent
     * properties (n and e)
     * @todo check for types of n and e. N should be a parseable bigInt object, E should
     * be a parseable integer number
     * @private
     */
    JSEncryptRSAKey.hasPublicKeyProperty = function (obj) {
        obj = obj || {};
        return (obj.hasOwnProperty("n") &&
            obj.hasOwnProperty("e"));
    };
    /**
     * Check if the object contains ALL the parameters of an RSA key.
     * @param {Object} [obj={}] - An object that may contain nine rsa key
     * parameters
     * @returns {boolean} true if the object contains all the parameters needed
     * @todo check for types of the parameters all the parameters but the public exponent
     * should be parseable bigint objects, the public exponent should be a parseable integer number
     * @private
     */
    JSEncryptRSAKey.hasPrivateKeyProperty = function (obj) {
        obj = obj || {};
        return (obj.hasOwnProperty("n") &&
            obj.hasOwnProperty("e") &&
            obj.hasOwnProperty("d") &&
            obj.hasOwnProperty("p") &&
            obj.hasOwnProperty("q") &&
            obj.hasOwnProperty("dmp1") &&
            obj.hasOwnProperty("dmq1") &&
            obj.hasOwnProperty("coeff"));
    };
    /**
     * Parse the properties of obj in the current rsa object. Obj should AT LEAST
     * include the modulus and public exponent (n, e) parameters.
     * @param {Object} obj - the object containing rsa parameters
     * @private
     */
    JSEncryptRSAKey.prototype.parsePropertiesFrom = function (obj) {
        this.n = obj.n;
        this.e = obj.e;
        if (obj.hasOwnProperty("d")) {
            this.d = obj.d;
            this.p = obj.p;
            this.q = obj.q;
            this.dmp1 = obj.dmp1;
            this.dmq1 = obj.dmq1;
            this.coeff = obj.coeff;
        }
    };
    return JSEncryptRSAKey;
}(__WEBPACK_IMPORTED_MODULE_5__lib_jsbn_rsa__["a" /* RSAKey */]));



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = __extends;
/* unused harmony export __assign */
/* unused harmony export __rest */
/* unused harmony export __decorate */
/* unused harmony export __param */
/* unused harmony export __metadata */
/* unused harmony export __awaiter */
/* unused harmony export __generator */
/* unused harmony export __exportStar */
/* unused harmony export __values */
/* unused harmony export __read */
/* unused harmony export __spread */
/* unused harmony export __await */
/* unused harmony export __asyncGenerator */
/* unused harmony export __asyncDelegator */
/* unused harmony export __asyncValues */
/* unused harmony export __makeTemplateObject */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Hex; });
// Hex JavaScript decoder
// Copyright (c) 2008-2013 Lapo Luchini <lapo@lapo.it>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
var decoder;
var Hex = {
    decode: function (a) {
        var i;
        if (decoder === undefined) {
            var hex = "0123456789ABCDEF";
            var ignore = " \f\n\r\t\u00A0\u2028\u2029";
            decoder = {};
            for (i = 0; i < 16; ++i) {
                decoder[hex.charAt(i)] = i;
            }
            hex = hex.toLowerCase();
            for (i = 10; i < 16; ++i) {
                decoder[hex.charAt(i)] = i;
            }
            for (i = 0; i < ignore.length; ++i) {
                decoder[ignore.charAt(i)] = -1;
            }
        }
        var out = [];
        var bits = 0;
        var char_count = 0;
        for (i = 0; i < a.length; ++i) {
            var c = a.charAt(i);
            if (c == "=") {
                break;
            }
            c = decoder[c];
            if (c == -1) {
                continue;
            }
            if (c === undefined) {
                throw new Error("Illegal character at offset " + i);
            }
            bits |= c;
            if (++char_count >= 2) {
                out[out.length] = bits;
                bits = 0;
                char_count = 0;
            }
            else {
                bits <<= 4;
            }
        }
        if (char_count) {
            throw new Error("Hex encoding incomplete: 4 bits missing");
        }
        return out;
    }
};


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Base64; });
// Base64 JavaScript decoder
// Copyright (c) 2008-2013 Lapo Luchini <lapo@lapo.it>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
var decoder;
var Base64 = {
    decode: function (a) {
        var i;
        if (decoder === undefined) {
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var ignore = "= \f\n\r\t\u00A0\u2028\u2029";
            decoder = Object.create(null);
            for (i = 0; i < 64; ++i) {
                decoder[b64.charAt(i)] = i;
            }
            for (i = 0; i < ignore.length; ++i) {
                decoder[ignore.charAt(i)] = -1;
            }
        }
        var out = [];
        var bits = 0;
        var char_count = 0;
        for (i = 0; i < a.length; ++i) {
            var c = a.charAt(i);
            if (c == "=") {
                break;
            }
            c = decoder[c];
            if (c == -1) {
                continue;
            }
            if (c === undefined) {
                throw new Error("Illegal character at offset " + i);
            }
            bits |= c;
            if (++char_count >= 4) {
                out[out.length] = (bits >> 16);
                out[out.length] = (bits >> 8) & 0xFF;
                out[out.length] = bits & 0xFF;
                bits = 0;
                char_count = 0;
            }
            else {
                bits <<= 6;
            }
        }
        switch (char_count) {
            case 1:
                throw new Error("Base64 encoding incomplete: at least 2 bits missing");
            case 2:
                out[out.length] = (bits >> 10);
                break;
            case 3:
                out[out.length] = (bits >> 16);
                out[out.length] = (bits >> 8) & 0xFF;
                break;
        }
        return out;
    },
    re: /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/,
    unarmor: function (a) {
        var m = Base64.re.exec(a);
        if (m) {
            if (m[1]) {
                a = m[1];
            }
            else if (m[2]) {
                a = m[2];
            }
            else {
                throw new Error("RegExp out of sync");
            }
        }
        return Base64.decode(a);
    }
};


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Stream */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ASN1; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__int10__ = __webpack_require__(10);
// ASN.1 JavaScript decoder
// Copyright (c) 2008-2014 Lapo Luchini <lapo@lapo.it>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
/*global oids */

var ellipsis = "\u2026";
var reTimeS = /^(\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
var reTimeL = /^(\d\d\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
function stringCut(str, len) {
    if (str.length > len) {
        str = str.substring(0, len) + ellipsis;
    }
    return str;
}
var Stream = /** @class */ (function () {
    function Stream(enc, pos) {
        this.hexDigits = "0123456789ABCDEF";
        if (enc instanceof Stream) {
            this.enc = enc.enc;
            this.pos = enc.pos;
        }
        else {
            // enc should be an array or a binary string
            this.enc = enc;
            this.pos = pos;
        }
    }
    Stream.prototype.get = function (pos) {
        if (pos === undefined) {
            pos = this.pos++;
        }
        if (pos >= this.enc.length) {
            throw new Error("Requesting byte offset " + pos + " on a stream of length " + this.enc.length);
        }
        return ("string" === typeof this.enc) ? this.enc.charCodeAt(pos) : this.enc[pos];
    };
    Stream.prototype.hexByte = function (b) {
        return this.hexDigits.charAt((b >> 4) & 0xF) + this.hexDigits.charAt(b & 0xF);
    };
    Stream.prototype.hexDump = function (start, end, raw) {
        var s = "";
        for (var i = start; i < end; ++i) {
            s += this.hexByte(this.get(i));
            if (raw !== true) {
                switch (i & 0xF) {
                    case 0x7:
                        s += "  ";
                        break;
                    case 0xF:
                        s += "\n";
                        break;
                    default:
                        s += " ";
                }
            }
        }
        return s;
    };
    Stream.prototype.isASCII = function (start, end) {
        for (var i = start; i < end; ++i) {
            var c = this.get(i);
            if (c < 32 || c > 176) {
                return false;
            }
        }
        return true;
    };
    Stream.prototype.parseStringISO = function (start, end) {
        var s = "";
        for (var i = start; i < end; ++i) {
            s += String.fromCharCode(this.get(i));
        }
        return s;
    };
    Stream.prototype.parseStringUTF = function (start, end) {
        var s = "";
        for (var i = start; i < end;) {
            var c = this.get(i++);
            if (c < 128) {
                s += String.fromCharCode(c);
            }
            else if ((c > 191) && (c < 224)) {
                s += String.fromCharCode(((c & 0x1F) << 6) | (this.get(i++) & 0x3F));
            }
            else {
                s += String.fromCharCode(((c & 0x0F) << 12) | ((this.get(i++) & 0x3F) << 6) | (this.get(i++) & 0x3F));
            }
        }
        return s;
    };
    Stream.prototype.parseStringBMP = function (start, end) {
        var str = "";
        var hi;
        var lo;
        for (var i = start; i < end;) {
            hi = this.get(i++);
            lo = this.get(i++);
            str += String.fromCharCode((hi << 8) | lo);
        }
        return str;
    };
    Stream.prototype.parseTime = function (start, end, shortYear) {
        var s = this.parseStringISO(start, end);
        var m = (shortYear ? reTimeS : reTimeL).exec(s);
        if (!m) {
            return "Unrecognized time: " + s;
        }
        if (shortYear) {
            // to avoid querying the timer, use the fixed range [1970, 2069]
            // it will conform with ITU X.400 [-10, +40] sliding window until 2030
            m[1] = +m[1];
            m[1] += (+m[1] < 70) ? 2000 : 1900;
        }
        s = m[1] + "-" + m[2] + "-" + m[3] + " " + m[4];
        if (m[5]) {
            s += ":" + m[5];
            if (m[6]) {
                s += ":" + m[6];
                if (m[7]) {
                    s += "." + m[7];
                }
            }
        }
        if (m[8]) {
            s += " UTC";
            if (m[8] != "Z") {
                s += m[8];
                if (m[9]) {
                    s += ":" + m[9];
                }
            }
        }
        return s;
    };
    Stream.prototype.parseInteger = function (start, end) {
        var v = this.get(start);
        var neg = (v > 127);
        var pad = neg ? 255 : 0;
        var len;
        var s = "";
        // skip unuseful bits (not allowed in DER)
        while (v == pad && ++start < end) {
            v = this.get(start);
        }
        len = end - start;
        if (len === 0) {
            return neg ? -1 : 0;
        }
        // show bit length of huge integers
        if (len > 4) {
            s = v;
            len <<= 3;
            while (((+s ^ pad) & 0x80) == 0) {
                s = +s << 1;
                --len;
            }
            s = "(" + len + " bit)\n";
        }
        // decode the integer
        if (neg) {
            v = v - 256;
        }
        var n = new __WEBPACK_IMPORTED_MODULE_0__int10__["a" /* Int10 */](v);
        for (var i = start + 1; i < end; ++i) {
            n.mulAdd(256, this.get(i));
        }
        return s + n.toString();
    };
    Stream.prototype.parseBitString = function (start, end, maxLength) {
        var unusedBit = this.get(start);
        var lenBit = ((end - start - 1) << 3) - unusedBit;
        var intro = "(" + lenBit + " bit)\n";
        var s = "";
        for (var i = start + 1; i < end; ++i) {
            var b = this.get(i);
            var skip = (i == end - 1) ? unusedBit : 0;
            for (var j = 7; j >= skip; --j) {
                s += (b >> j) & 1 ? "1" : "0";
            }
            if (s.length > maxLength) {
                return intro + stringCut(s, maxLength);
            }
        }
        return intro + s;
    };
    Stream.prototype.parseOctetString = function (start, end, maxLength) {
        if (this.isASCII(start, end)) {
            return stringCut(this.parseStringISO(start, end), maxLength);
        }
        var len = end - start;
        var s = "(" + len + " byte)\n";
        maxLength /= 2; // we work in bytes
        if (len > maxLength) {
            end = start + maxLength;
        }
        for (var i = start; i < end; ++i) {
            s += this.hexByte(this.get(i));
        }
        if (len > maxLength) {
            s += ellipsis;
        }
        return s;
    };
    Stream.prototype.parseOID = function (start, end, maxLength) {
        var s = "";
        var n = new __WEBPACK_IMPORTED_MODULE_0__int10__["a" /* Int10 */]();
        var bits = 0;
        for (var i = start; i < end; ++i) {
            var v = this.get(i);
            n.mulAdd(128, v & 0x7F);
            bits += 7;
            if (!(v & 0x80)) {
                if (s === "") {
                    n = n.simplify();
                    if (n instanceof __WEBPACK_IMPORTED_MODULE_0__int10__["a" /* Int10 */]) {
                        n.sub(80);
                        s = "2." + n.toString();
                    }
                    else {
                        var m = n < 80 ? n < 40 ? 0 : 1 : 2;
                        s = m + "." + (n - m * 40);
                    }
                }
                else {
                    s += "." + n.toString();
                }
                if (s.length > maxLength) {
                    return stringCut(s, maxLength);
                }
                n = new __WEBPACK_IMPORTED_MODULE_0__int10__["a" /* Int10 */]();
                bits = 0;
            }
        }
        if (bits > 0) {
            s += ".incomplete";
        }
        return s;
    };
    return Stream;
}());

var ASN1 = /** @class */ (function () {
    function ASN1(stream, header, length, tag, sub) {
        if (!(tag instanceof ASN1Tag)) {
            throw new Error("Invalid tag value.");
        }
        this.stream = stream;
        this.header = header;
        this.length = length;
        this.tag = tag;
        this.sub = sub;
    }
    ASN1.prototype.typeName = function () {
        switch (this.tag.tagClass) {
            case 0:// universal
                switch (this.tag.tagNumber) {
                    case 0x00:
                        return "EOC";
                    case 0x01:
                        return "BOOLEAN";
                    case 0x02:
                        return "INTEGER";
                    case 0x03:
                        return "BIT_STRING";
                    case 0x04:
                        return "OCTET_STRING";
                    case 0x05:
                        return "NULL";
                    case 0x06:
                        return "OBJECT_IDENTIFIER";
                    case 0x07:
                        return "ObjectDescriptor";
                    case 0x08:
                        return "EXTERNAL";
                    case 0x09:
                        return "REAL";
                    case 0x0A:
                        return "ENUMERATED";
                    case 0x0B:
                        return "EMBEDDED_PDV";
                    case 0x0C:
                        return "UTF8String";
                    case 0x10:
                        return "SEQUENCE";
                    case 0x11:
                        return "SET";
                    case 0x12:
                        return "NumericString";
                    case 0x13:
                        return "PrintableString"; // ASCII subset
                    case 0x14:
                        return "TeletexString"; // aka T61String
                    case 0x15:
                        return "VideotexString";
                    case 0x16:
                        return "IA5String"; // ASCII
                    case 0x17:
                        return "UTCTime";
                    case 0x18:
                        return "GeneralizedTime";
                    case 0x19:
                        return "GraphicString";
                    case 0x1A:
                        return "VisibleString"; // ASCII subset
                    case 0x1B:
                        return "GeneralString";
                    case 0x1C:
                        return "UniversalString";
                    case 0x1E:
                        return "BMPString";
                }
                return "Universal_" + this.tag.tagNumber.toString();
            case 1:
                return "Application_" + this.tag.tagNumber.toString();
            case 2:
                return "[" + this.tag.tagNumber.toString() + "]"; // Context
            case 3:
                return "Private_" + this.tag.tagNumber.toString();
        }
    };
    ASN1.prototype.content = function (maxLength) {
        if (this.tag === undefined) {
            return null;
        }
        if (maxLength === undefined) {
            maxLength = Infinity;
        }
        var content = this.posContent();
        var len = Math.abs(this.length);
        if (!this.tag.isUniversal()) {
            if (this.sub !== null) {
                return "(" + this.sub.length + " elem)";
            }
            return this.stream.parseOctetString(content, content + len, maxLength);
        }
        switch (this.tag.tagNumber) {
            case 0x01:// BOOLEAN
                return (this.stream.get(content) === 0) ? "false" : "true";
            case 0x02:// INTEGER
                return this.stream.parseInteger(content, content + len);
            case 0x03:// BIT_STRING
                return this.sub ? "(" + this.sub.length + " elem)" :
                    this.stream.parseBitString(content, content + len, maxLength);
            case 0x04:// OCTET_STRING
                return this.sub ? "(" + this.sub.length + " elem)" :
                    this.stream.parseOctetString(content, content + len, maxLength);
            // case 0x05: // NULL
            case 0x06:// OBJECT_IDENTIFIER
                return this.stream.parseOID(content, content + len, maxLength);
            // case 0x07: // ObjectDescriptor
            // case 0x08: // EXTERNAL
            // case 0x09: // REAL
            // case 0x0A: // ENUMERATED
            // case 0x0B: // EMBEDDED_PDV
            case 0x10: // SEQUENCE
            case 0x11:// SET
                if (this.sub !== null) {
                    return "(" + this.sub.length + " elem)";
                }
                else {
                    return "(no elem)";
                }
            case 0x0C:// UTF8String
                return stringCut(this.stream.parseStringUTF(content, content + len), maxLength);
            case 0x12: // NumericString
            case 0x13: // PrintableString
            case 0x14: // TeletexString
            case 0x15: // VideotexString
            case 0x16: // IA5String
            // case 0x19: // GraphicString
            case 0x1A:// VisibleString
                // case 0x1B: // GeneralString
                // case 0x1C: // UniversalString
                return stringCut(this.stream.parseStringISO(content, content + len), maxLength);
            case 0x1E:// BMPString
                return stringCut(this.stream.parseStringBMP(content, content + len), maxLength);
            case 0x17: // UTCTime
            case 0x18:// GeneralizedTime
                return this.stream.parseTime(content, content + len, (this.tag.tagNumber == 0x17));
        }
        return null;
    };
    ASN1.prototype.toString = function () {
        return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + ((this.sub === null) ? "null" : this.sub.length) + "]";
    };
    ASN1.prototype.toPrettyString = function (indent) {
        if (indent === undefined) {
            indent = "";
        }
        var s = indent + this.typeName() + " @" + this.stream.pos;
        if (this.length >= 0) {
            s += "+";
        }
        s += this.length;
        if (this.tag.tagConstructed) {
            s += " (constructed)";
        }
        else if ((this.tag.isUniversal() && ((this.tag.tagNumber == 0x03) || (this.tag.tagNumber == 0x04))) && (this.sub !== null)) {
            s += " (encapsulates)";
        }
        s += "\n";
        if (this.sub !== null) {
            indent += "  ";
            for (var i = 0, max = this.sub.length; i < max; ++i) {
                s += this.sub[i].toPrettyString(indent);
            }
        }
        return s;
    };
    ASN1.prototype.posStart = function () {
        return this.stream.pos;
    };
    ASN1.prototype.posContent = function () {
        return this.stream.pos + this.header;
    };
    ASN1.prototype.posEnd = function () {
        return this.stream.pos + this.header + Math.abs(this.length);
    };
    ASN1.prototype.toHexString = function () {
        return this.stream.hexDump(this.posStart(), this.posEnd(), true);
    };
    ASN1.decodeLength = function (stream) {
        var buf = stream.get();
        var len = buf & 0x7F;
        if (len == buf) {
            return len;
        }
        // no reason to use Int10, as it would be a huge buffer anyways
        if (len > 6) {
            throw new Error("Length over 48 bits not supported at position " + (stream.pos - 1));
        }
        if (len === 0) {
            return null;
        } // undefined
        buf = 0;
        for (var i = 0; i < len; ++i) {
            buf = (buf * 256) + stream.get();
        }
        return buf;
    };
    /**
     * Retrieve the hexadecimal value (as a string) of the current ASN.1 element
     * @returns {string}
     * @public
     */
    ASN1.prototype.getHexStringValue = function () {
        var hexString = this.toHexString();
        var offset = this.header * 2;
        var length = this.length * 2;
        return hexString.substr(offset, length);
    };
    ASN1.decode = function (str) {
        var stream;
        if (!(str instanceof Stream)) {
            stream = new Stream(str, 0);
        }
        else {
            stream = str;
        }
        var streamStart = new Stream(stream);
        var tag = new ASN1Tag(stream);
        var len = ASN1.decodeLength(stream);
        var start = stream.pos;
        var header = start - streamStart.pos;
        var sub = null;
        var getSub = function () {
            var ret = [];
            if (len !== null) {
                // definite length
                var end = start + len;
                while (stream.pos < end) {
                    ret[ret.length] = ASN1.decode(stream);
                }
                if (stream.pos != end) {
                    throw new Error("Content size is not correct for container starting at offset " + start);
                }
            }
            else {
                // undefined length
                try {
                    for (;;) {
                        var s = ASN1.decode(stream);
                        if (s.tag.isEOC()) {
                            break;
                        }
                        ret[ret.length] = s;
                    }
                    len = start - stream.pos; // undefined lengths are represented as negative values
                }
                catch (e) {
                    throw new Error("Exception while decoding undefined length content: " + e);
                }
            }
            return ret;
        };
        if (tag.tagConstructed) {
            // must have valid content
            sub = getSub();
        }
        else if (tag.isUniversal() && ((tag.tagNumber == 0x03) || (tag.tagNumber == 0x04))) {
            // sometimes BitString and OctetString are used to encapsulate ASN.1
            try {
                if (tag.tagNumber == 0x03) {
                    if (stream.get() != 0) {
                        throw new Error("BIT STRINGs with unused bits cannot encapsulate.");
                    }
                }
                sub = getSub();
                for (var i = 0; i < sub.length; ++i) {
                    if (sub[i].tag.isEOC()) {
                        throw new Error("EOC is not supposed to be actual content.");
                    }
                }
            }
            catch (e) {
                // but silently ignore when they don't
                sub = null;
            }
        }
        if (sub === null) {
            if (len === null) {
                throw new Error("We can't skip over an invalid tag with undefined length at offset " + start);
            }
            stream.pos = start + Math.abs(len);
        }
        return new ASN1(streamStart, header, len, tag, sub);
    };
    return ASN1;
}());

var ASN1Tag = /** @class */ (function () {
    function ASN1Tag(stream) {
        var buf = stream.get();
        this.tagClass = buf >> 6;
        this.tagConstructed = ((buf & 0x20) !== 0);
        this.tagNumber = buf & 0x1F;
        if (this.tagNumber == 0x1F) {
            var n = new __WEBPACK_IMPORTED_MODULE_0__int10__["a" /* Int10 */]();
            do {
                buf = stream.get();
                n.mulAdd(128, buf & 0x7F);
            } while (buf & 0x80);
            this.tagNumber = n.simplify();
        }
    }
    ASN1Tag.prototype.isUniversal = function () {
        return this.tagClass === 0x00;
    };
    ASN1Tag.prototype.isEOC = function () {
        return this.tagClass === 0x00 && this.tagNumber === 0x00;
    };
    return ASN1Tag;
}());


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Int10; });
// Big integer base-10 printing library
// Copyright (c) 2014 Lapo Luchini <lapo@lapo.it>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
var max = 10000000000000; // biggest integer that can still fit 2^53 when multiplied by 256
var Int10 = /** @class */ (function () {
    function Int10(value) {
        this.buf = [+value || 0];
    }
    Int10.prototype.mulAdd = function (m, c) {
        // assert(m <= 256)
        var b = this.buf;
        var l = b.length;
        var i;
        var t;
        for (i = 0; i < l; ++i) {
            t = b[i] * m + c;
            if (t < max) {
                c = 0;
            }
            else {
                c = 0 | (t / max);
                t -= c * max;
            }
            b[i] = t;
        }
        if (c > 0) {
            b[i] = c;
        }
    };
    Int10.prototype.sub = function (c) {
        // assert(m <= 256)
        var b = this.buf;
        var l = b.length;
        var i;
        var t;
        for (i = 0; i < l; ++i) {
            t = b[i] - c;
            if (t < 0) {
                t += max;
                c = 1;
            }
            else {
                c = 0;
            }
            b[i] = t;
        }
        while (b[b.length - 1] === 0) {
            b.pop();
        }
    };
    Int10.prototype.toString = function (base) {
        if ((base || 10) != 10) {
            throw new Error("only base 10 is supported");
        }
        var b = this.buf;
        var s = b[b.length - 1].toString();
        for (var i = b.length - 2; i >= 0; --i) {
            s += (max + b[i]).toString().substring(1);
        }
        return s;
    };
    Int10.prototype.valueOf = function () {
        var b = this.buf;
        var v = 0;
        for (var i = b.length - 1; i >= 0; --i) {
            v = v * max + b[i];
        }
        return v;
    };
    Int10.prototype.simplify = function () {
        var b = this.buf;
        return (b.length == 1) ? b[0] : this;
    };
    return Int10;
}());



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RSAKey; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__jsbn__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__rng__ = __webpack_require__(12);
// Depends on jsbn.js and rng.js
// Version 1.1: support utf-8 encoding in pkcs1pad2
// convert a (hex) string to a bignum object


// function linebrk(s,n) {
//   var ret = "";
//   var i = 0;
//   while(i + n < s.length) {
//     ret += s.substring(i,i+n) + "\n";
//     i += n;
//   }
//   return ret + s.substring(i,s.length);
// }
// function byte2Hex(b) {
//   if(b < 0x10)
//     return "0" + b.toString(16);
//   else
//     return b.toString(16);
// }
// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s, n) {
    if (n < s.length + 11) {
        console.error("Message too long for RSA");
        return null;
    }
    var ba = [];
    var i = s.length - 1;
    while (i >= 0 && n > 0) {
        var c = s.charCodeAt(i--);
        if (c < 128) {
            ba[--n] = c;
        }
        else if ((c > 127) && (c < 2048)) {
            ba[--n] = (c & 63) | 128;
            ba[--n] = (c >> 6) | 192;
        }
        else {
            ba[--n] = (c & 63) | 128;
            ba[--n] = ((c >> 6) & 63) | 128;
            ba[--n] = (c >> 12) | 224;
        }
    }
    ba[--n] = 0;
    var rng = new __WEBPACK_IMPORTED_MODULE_1__rng__["a" /* SecureRandom */]();
    var x = [];
    while (n > 2) {
        x[0] = 0;
        while (x[0] == 0) {
            rng.nextBytes(x);
        }
        ba[--n] = x[0];
    }
    ba[--n] = 2;
    ba[--n] = 0;
    return new __WEBPACK_IMPORTED_MODULE_0__jsbn__["a" /* BigInteger */](ba);
}
// "empty" RSA key constructor
var RSAKey = /** @class */ (function () {
    function RSAKey() {
        this.n = null;
        this.e = 0;
        this.d = null;
        this.p = null;
        this.q = null;
        this.dmp1 = null;
        this.dmq1 = null;
        this.coeff = null;
    }
    //#region PROTECTED
    // protected
    // RSAKey.prototype.doPublic = RSADoPublic;
    // Perform raw public operation on "x": return x^e (mod n)
    RSAKey.prototype.doPublic = function (x) {
        return x.modPowInt(this.e, this.n);
    };
    // RSAKey.prototype.doPrivate = RSADoPrivate;
    // Perform raw private operation on "x": return x^d (mod n)
    RSAKey.prototype.doPrivate = function (x) {
        if (this.p == null || this.q == null) {
            return x.modPow(this.d, this.n);
        }
        // TODO: re-calculate any missing CRT params
        var xp = x.mod(this.p).modPow(this.dmp1, this.p);
        var xq = x.mod(this.q).modPow(this.dmq1, this.q);
        while (xp.compareTo(xq) < 0) {
            xp = xp.add(this.p);
        }
        return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
    };
    //#endregion PROTECTED
    //#region PUBLIC
    // RSAKey.prototype.setPublic = RSASetPublic;
    // Set the public key fields N and e from hex strings
    RSAKey.prototype.setPublic = function (N, E) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = Object(__WEBPACK_IMPORTED_MODULE_0__jsbn__["c" /* parseBigInt */])(N, 16);
            this.e = parseInt(E, 16);
        }
        else {
            console.error("Invalid RSA public key");
        }
    };
    // RSAKey.prototype.encrypt = RSAEncrypt;
    // Return the PKCS#1 RSA encryption of "text" as an even-length hex string
    RSAKey.prototype.encrypt = function (text) {
        var m = pkcs1pad2(text, (this.n.bitLength() + 7) >> 3);
        if (m == null) {
            return null;
        }
        var c = this.doPublic(m);
        if (c == null) {
            return null;
        }
        var h = c.toString(16);
        if ((h.length & 1) == 0) {
            return h;
        }
        else {
            return "0" + h;
        }
    };
    // RSAKey.prototype.setPrivate = RSASetPrivate;
    // Set the private key fields N, e, and d from hex strings
    RSAKey.prototype.setPrivate = function (N, E, D) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = Object(__WEBPACK_IMPORTED_MODULE_0__jsbn__["c" /* parseBigInt */])(N, 16);
            this.e = parseInt(E, 16);
            this.d = Object(__WEBPACK_IMPORTED_MODULE_0__jsbn__["c" /* parseBigInt */])(D, 16);
        }
        else {
            console.error("Invalid RSA private key");
        }
    };
    // RSAKey.prototype.setPrivateEx = RSASetPrivateEx;
    // Set the private key fields N, e, d and CRT params from hex strings
    RSAKey.prototype.setPrivateEx = function (N, E, D, P, Q, DP, DQ, C) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = Object(__WEBPACK_IMPORTED_MODULE_0__jsbn__["c" /* parseBigInt */])(N, 16);
            this.e = parseInt(E, 16);
            this.d = Object(__WEBPACK_IMPORTED_MODULE_0__jsbn__["c" /* parseBigInt */])(D, 16);
            this.p = Object(__WEBPACK_IMPORTED_MODULE_0__jsbn__["c" /* parseBigInt */])(P, 16);
            this.q = Object(__WEBPACK_IMPORTED_MODULE_0__jsbn__["c" /* parseBigInt */])(Q, 16);
            this.dmp1 = Object(__WEBPACK_IMPORTED_MODULE_0__jsbn__["c" /* parseBigInt */])(DP, 16);
            this.dmq1 = Object(__WEBPACK_IMPORTED_MODULE_0__jsbn__["c" /* parseBigInt */])(DQ, 16);
            this.coeff = Object(__WEBPACK_IMPORTED_MODULE_0__jsbn__["c" /* parseBigInt */])(C, 16);
        }
        else {
            console.error("Invalid RSA private key");
        }
    };
    // RSAKey.prototype.generate = RSAGenerate;
    // Generate a new random private key B bits long, using public expt E
    RSAKey.prototype.generate = function (B, E) {
        var rng = new __WEBPACK_IMPORTED_MODULE_1__rng__["a" /* SecureRandom */]();
        var qs = B >> 1;
        this.e = parseInt(E, 16);
        var ee = new __WEBPACK_IMPORTED_MODULE_0__jsbn__["a" /* BigInteger */](E, 16);
        for (;;) {
            for (;;) {
                this.p = new __WEBPACK_IMPORTED_MODULE_0__jsbn__["a" /* BigInteger */](B - qs, 1, rng);
                if (this.p.subtract(__WEBPACK_IMPORTED_MODULE_0__jsbn__["a" /* BigInteger */].ONE).gcd(ee).compareTo(__WEBPACK_IMPORTED_MODULE_0__jsbn__["a" /* BigInteger */].ONE) == 0 && this.p.isProbablePrime(10)) {
                    break;
                }
            }
            for (;;) {
                this.q = new __WEBPACK_IMPORTED_MODULE_0__jsbn__["a" /* BigInteger */](qs, 1, rng);
                if (this.q.subtract(__WEBPACK_IMPORTED_MODULE_0__jsbn__["a" /* BigInteger */].ONE).gcd(ee).compareTo(__WEBPACK_IMPORTED_MODULE_0__jsbn__["a" /* BigInteger */].ONE) == 0 && this.q.isProbablePrime(10)) {
                    break;
                }
            }
            if (this.p.compareTo(this.q) <= 0) {
                var t = this.p;
                this.p = this.q;
                this.q = t;
            }
            var p1 = this.p.subtract(__WEBPACK_IMPORTED_MODULE_0__jsbn__["a" /* BigInteger */].ONE);
            var q1 = this.q.subtract(__WEBPACK_IMPORTED_MODULE_0__jsbn__["a" /* BigInteger */].ONE);
            var phi = p1.multiply(q1);
            if (phi.gcd(ee).compareTo(__WEBPACK_IMPORTED_MODULE_0__jsbn__["a" /* BigInteger */].ONE) == 0) {
                this.n = this.p.multiply(this.q);
                this.d = ee.modInverse(phi);
                this.dmp1 = this.d.mod(p1);
                this.dmq1 = this.d.mod(q1);
                this.coeff = this.q.modInverse(this.p);
                break;
            }
        }
    };
    // RSAKey.prototype.decrypt = RSADecrypt;
    // Return the PKCS#1 RSA decryption of "ctext".
    // "ctext" is an even-length hex string and the output is a plain string.
    RSAKey.prototype.decrypt = function (ctext) {
        var c = Object(__WEBPACK_IMPORTED_MODULE_0__jsbn__["c" /* parseBigInt */])(ctext, 16);
        var m = this.doPrivate(c);
        if (m == null) {
            return null;
        }
        return pkcs1unpad2(m, (this.n.bitLength() + 7) >> 3);
    };
    // Generate a new random private key B bits long, using public expt E
    RSAKey.prototype.generateAsync = function (B, E, callback) {
        var rng = new __WEBPACK_IMPORTED_MODULE_1__rng__["a" /* SecureRandom */]();
        var qs = B >> 1;
        this.e = parseInt(E, 16);
        var ee = new __WEBPACK_IMPORTED_MODULE_0__jsbn__["a" /* BigInteger */](E, 16);
        var rsa = this;
        // These functions have non-descript names because they were originally for(;;) loops.
        // I don't know about cryptography to give them better names than loop1-4.
        var loop1 = function () {
            var loop4 = function () {
                if (rsa.p.compareTo(rsa.q) <= 0) {
                    var t = rsa.p;
                    rsa.p = rsa.q;
                    rsa.q = t;
                }
                var p1 = rsa.p.subtract(__WEBPACK_IMPORTED_MODULE_0__jsbn__["a" /* BigInteger */].ONE);
                var q1 = rsa.q.subtract(__WEBPACK_IMPORTED_MODULE_0__jsbn__["a" /* BigInteger */].ONE);
                var phi = p1.multiply(q1);
                if (phi.gcd(ee).compareTo(__WEBPACK_IMPORTED_MODULE_0__jsbn__["a" /* BigInteger */].ONE) == 0) {
                    rsa.n = rsa.p.multiply(rsa.q);
                    rsa.d = ee.modInverse(phi);
                    rsa.dmp1 = rsa.d.mod(p1);
                    rsa.dmq1 = rsa.d.mod(q1);
                    rsa.coeff = rsa.q.modInverse(rsa.p);
                    setTimeout(function () { callback(); }, 0); // escape
                }
                else {
                    setTimeout(loop1, 0);
                }
            };
            var loop3 = function () {
                rsa.q = Object(__WEBPACK_IMPORTED_MODULE_0__jsbn__["b" /* nbi */])();
                rsa.q.fromNumberAsync(qs, 1, rng, function () {
                    rsa.q.subtract(__WEBPACK_IMPORTED_MODULE_0__jsbn__["a" /* BigInteger */].ONE).gcda(ee, function (r) {
                        if (r.compareTo(__WEBPACK_IMPORTED_MODULE_0__jsbn__["a" /* BigInteger */].ONE) == 0 && rsa.q.isProbablePrime(10)) {
                            setTimeout(loop4, 0);
                        }
                        else {
                            setTimeout(loop3, 0);
                        }
                    });
                });
            };
            var loop2 = function () {
                rsa.p = Object(__WEBPACK_IMPORTED_MODULE_0__jsbn__["b" /* nbi */])();
                rsa.p.fromNumberAsync(B - qs, 1, rng, function () {
                    rsa.p.subtract(__WEBPACK_IMPORTED_MODULE_0__jsbn__["a" /* BigInteger */].ONE).gcda(ee, function (r) {
                        if (r.compareTo(__WEBPACK_IMPORTED_MODULE_0__jsbn__["a" /* BigInteger */].ONE) == 0 && rsa.p.isProbablePrime(10)) {
                            setTimeout(loop3, 0);
                        }
                        else {
                            setTimeout(loop2, 0);
                        }
                    });
                });
            };
            setTimeout(loop2, 0);
        };
        setTimeout(loop1, 0);
    };
    return RSAKey;
}());

// Undo PKCS#1 (type 2, random) padding and, if valid, return the plaintext
function pkcs1unpad2(d, n) {
    var b = d.toByteArray();
    var i = 0;
    while (i < b.length && b[i] == 0) {
        ++i;
    }
    if (b.length - i != n - 1 || b[i] != 2) {
        return null;
    }
    ++i;
    while (b[i] != 0) {
        if (++i >= b.length) {
            return null;
        }
    }
    var ret = "";
    while (++i < b.length) {
        var c = b[i] & 255;
        if (c < 128) {
            ret += String.fromCharCode(c);
        }
        else if ((c > 191) && (c < 224)) {
            ret += String.fromCharCode(((c & 31) << 6) | (b[i + 1] & 63));
            ++i;
        }
        else {
            ret += String.fromCharCode(((c & 15) << 12) | ((b[i + 1] & 63) << 6) | (b[i + 2] & 63));
            i += 2;
        }
    }
    return ret;
}
// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
// function RSAEncryptB64(text) {
//  var h = this.encrypt(text);
//  if(h) return hex2b64(h); else return null;
// }
// public
// RSAKey.prototype.encrypt_b64 = RSAEncryptB64;


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SecureRandom; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__prng4__ = __webpack_require__(13);
// Random number generator - requires a PRNG backend, e.g. prng4.js

var rng_state;
var rng_pool = null;
var rng_pptr;
// Initialize the pool with junk if needed.
if (rng_pool == null) {
    rng_pool = [];
    rng_pptr = 0;
    var t = void 0;
    if (window.crypto && window.crypto.getRandomValues) {
        // Extract entropy (2048 bits) from RNG if available
        var z = new Uint32Array(256);
        window.crypto.getRandomValues(z);
        for (t = 0; t < z.length; ++t) {
            rng_pool[rng_pptr++] = z[t] & 255;
        }
    }
    // Use mouse events for entropy, if we do not have enough entropy by the time
    // we need it, entropy will be generated by Math.random.
    var onMouseMoveListener_1 = function (ev) {
        this.count = this.count || 0;
        if (this.count >= 256 || rng_pptr >= __WEBPACK_IMPORTED_MODULE_0__prng4__["b" /* rng_psize */]) {
            if (window.removeEventListener) {
                window.removeEventListener("mousemove", onMouseMoveListener_1, false);
            }
            else if (window.detachEvent) {
                window.detachEvent("onmousemove", onMouseMoveListener_1);
            }
            return;
        }
        try {
            var mouseCoordinates = ev.x + ev.y;
            rng_pool[rng_pptr++] = mouseCoordinates & 255;
            this.count += 1;
        }
        catch (e) {
            // Sometimes Firefox will deny permission to access event properties for some reason. Ignore.
        }
    };
    if (window.addEventListener) {
        window.addEventListener("mousemove", onMouseMoveListener_1, false);
    }
    else if (window.attachEvent) {
        window.attachEvent("onmousemove", onMouseMoveListener_1);
    }
}
function rng_get_byte() {
    if (rng_state == null) {
        rng_state = Object(__WEBPACK_IMPORTED_MODULE_0__prng4__["a" /* prng_newstate */])();
        // At this point, we may not have collected enough entropy.  If not, fall back to Math.random
        while (rng_pptr < __WEBPACK_IMPORTED_MODULE_0__prng4__["b" /* rng_psize */]) {
            var random = Math.floor(65536 * Math.random());
            rng_pool[rng_pptr++] = random & 255;
        }
        rng_state.init(rng_pool);
        for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) {
            rng_pool[rng_pptr] = 0;
        }
        rng_pptr = 0;
    }
    // TODO: allow reseeding after first request
    return rng_state.next();
}
var SecureRandom = /** @class */ (function () {
    function SecureRandom() {
    }
    SecureRandom.prototype.nextBytes = function (ba) {
        for (var i = 0; i < ba.length; ++i) {
            ba[i] = rng_get_byte();
        }
    };
    return SecureRandom;
}());



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Arcfour */
/* harmony export (immutable) */ __webpack_exports__["a"] = prng_newstate;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return rng_psize; });
// prng4.js - uses Arcfour as a PRNG
var Arcfour = /** @class */ (function () {
    function Arcfour() {
        this.i = 0;
        this.j = 0;
        this.S = [];
    }
    // Arcfour.prototype.init = ARC4init;
    // Initialize arcfour context from key, an array of ints, each from [0..255]
    Arcfour.prototype.init = function (key) {
        var i;
        var j;
        var t;
        for (i = 0; i < 256; ++i) {
            this.S[i] = i;
        }
        j = 0;
        for (i = 0; i < 256; ++i) {
            j = (j + this.S[i] + key[i % key.length]) & 255;
            t = this.S[i];
            this.S[i] = this.S[j];
            this.S[j] = t;
        }
        this.i = 0;
        this.j = 0;
    };
    // Arcfour.prototype.next = ARC4next;
    Arcfour.prototype.next = function () {
        var t;
        this.i = (this.i + 1) & 255;
        this.j = (this.j + this.S[this.i]) & 255;
        t = this.S[this.i];
        this.S[this.i] = this.S[this.j];
        this.S[this.j] = t;
        return this.S[(t + this.S[this.i]) & 255];
    };
    return Arcfour;
}());

// Plug in your RNG constructor here
function prng_newstate() {
    return new Arcfour();
}
// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
var rng_psize = 256;


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__jsbn_jsbn__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__yahoo__ = __webpack_require__(15);
/* asn1-1.0.13.js (c) 2013-2017 Kenji Urushima | kjur.github.com/jsrsasign/license
 */
/*
 * asn1.js - ASN.1 DER encoder classes
 *
 * Copyright (c) 2013-2017 Kenji Urushima (kenji.urushima@gmail.com)
 *
 * This software is licensed under the terms of the MIT License.
 * https://kjur.github.io/jsrsasign/license
 *
 * The above copyright and license notice shall be
 * included in all copies or substantial portions of the Software.
 */




/**
 * @fileOverview
 * @name asn1-1.0.js
 * @author Kenji Urushima kenji.urushima@gmail.com
 * @version asn1 1.0.13 (2017-Jun-02)
 * @since jsrsasign 2.1
 * @license <a href="https://kjur.github.io/jsrsasign/license/">MIT License</a>
 */

/**
 * kjur's class library name space
 * <p>
 * This name space provides following name spaces:
 * <ul>
 * <li>{@link KJUR.asn1} - ASN.1 primitive hexadecimal encoder</li>
 * <li>{@link KJUR.asn1.x509} - ASN.1 structure for X.509 certificate and CRL</li>
 * <li>{@link KJUR.crypto} - Java Cryptographic Extension(JCE) style MessageDigest/Signature
 * class and utilities</li>
 * </ul>
 * </p>
 * NOTE: Please ignore method summary and document of this namespace. This caused by a bug of jsdoc2.
 * @name KJUR
 * @namespace kjur's class library name space
 */
const KJUR = {};
/* harmony export (immutable) */ __webpack_exports__["a"] = KJUR;


/**
 * kjur's ASN.1 class library name space
 * <p>
 * This is ITU-T X.690 ASN.1 DER encoder class library and
 * class structure and methods is very similar to
 * org.bouncycastle.asn1 package of
 * well known BouncyCaslte Cryptography Library.
 * <h4>PROVIDING ASN.1 PRIMITIVES</h4>
 * Here are ASN.1 DER primitive classes.
 * <ul>
 * <li>0x01 {@link KJUR.asn1.DERBoolean}</li>
 * <li>0x02 {@link KJUR.asn1.DERInteger}</li>
 * <li>0x03 {@link KJUR.asn1.DERBitString}</li>
 * <li>0x04 {@link KJUR.asn1.DEROctetString}</li>
 * <li>0x05 {@link KJUR.asn1.DERNull}</li>
 * <li>0x06 {@link KJUR.asn1.DERObjectIdentifier}</li>
 * <li>0x0a {@link KJUR.asn1.DEREnumerated}</li>
 * <li>0x0c {@link KJUR.asn1.DERUTF8String}</li>
 * <li>0x12 {@link KJUR.asn1.DERNumericString}</li>
 * <li>0x13 {@link KJUR.asn1.DERPrintableString}</li>
 * <li>0x14 {@link KJUR.asn1.DERTeletexString}</li>
 * <li>0x16 {@link KJUR.asn1.DERIA5String}</li>
 * <li>0x17 {@link KJUR.asn1.DERUTCTime}</li>
 * <li>0x18 {@link KJUR.asn1.DERGeneralizedTime}</li>
 * <li>0x30 {@link KJUR.asn1.DERSequence}</li>
 * <li>0x31 {@link KJUR.asn1.DERSet}</li>
 * </ul>
 * <h4>OTHER ASN.1 CLASSES</h4>
 * <ul>
 * <li>{@link KJUR.asn1.ASN1Object}</li>
 * <li>{@link KJUR.asn1.DERAbstractString}</li>
 * <li>{@link KJUR.asn1.DERAbstractTime}</li>
 * <li>{@link KJUR.asn1.DERAbstractStructured}</li>
 * <li>{@link KJUR.asn1.DERTaggedObject}</li>
 * </ul>
 * <h4>SUB NAME SPACES</h4>
 * <ul>
 * <li>{@link KJUR.asn1.cades} - CAdES long term signature format</li>
 * <li>{@link KJUR.asn1.cms} - Cryptographic Message Syntax</li>
 * <li>{@link KJUR.asn1.csr} - Certificate Signing Request (CSR/PKCS#10)</li>
 * <li>{@link KJUR.asn1.tsp} - RFC 3161 Timestamping Protocol Format</li>
 * <li>{@link KJUR.asn1.x509} - RFC 5280 X.509 certificate and CRL</li>
 * </ul>
 * </p>
 * NOTE: Please ignore method summary and document of this namespace.
 * This caused by a bug of jsdoc2.
 * @name KJUR.asn1
 * @namespace
 */
if (typeof KJUR.asn1 == "undefined" || !KJUR.asn1) KJUR.asn1 = {};

/**
 * ASN1 utilities class
 * @name KJUR.asn1.ASN1Util
 * @class ASN1 utilities class
 * @since asn1 1.0.2
 */
KJUR.asn1.ASN1Util = new function() {
    this.integerToByteHex = function(i) {
        var h = i.toString(16);
        if ((h.length % 2) == 1) h = '0' + h;
        return h;
    };
    this.bigIntToMinTwosComplementsHex = function(bigIntegerValue) {
        var h = bigIntegerValue.toString(16);
        if (h.substr(0, 1) != '-') {
            if (h.length % 2 == 1) {
                h = '0' + h;
            } else {
                if (! h.match(/^[0-7]/)) {
                    h = '00' + h;
                }
            }
        } else {
            var hPos = h.substr(1);
            var xorLen = hPos.length;
            if (xorLen % 2 == 1) {
                xorLen += 1;
            } else {
                if (! h.match(/^[0-7]/)) {
                    xorLen += 2;
                }
            }
            var hMask = '';
            for (var i = 0; i < xorLen; i++) {
                hMask += 'f';
            }
            var biMask = new __WEBPACK_IMPORTED_MODULE_0__jsbn_jsbn__["a" /* BigInteger */](hMask, 16);
            var biNeg = biMask.xor(bigIntegerValue).add(__WEBPACK_IMPORTED_MODULE_0__jsbn_jsbn__["a" /* BigInteger */].ONE);
            h = biNeg.toString(16).replace(/^-/, '');
        }
        return h;
    };
    /**
     * get PEM string from hexadecimal data and header string
     * @name getPEMStringFromHex
     * @memberOf KJUR.asn1.ASN1Util
     * @function
     * @param {String} dataHex hexadecimal string of PEM body
     * @param {String} pemHeader PEM header string (ex. 'RSA PRIVATE KEY')
     * @return {String} PEM formatted string of input data
     * @description
     * This method converts a hexadecimal string to a PEM string with
     * a specified header. Its line break will be CRLF("\r\n").
     * @example
     * var pem  = KJUR.asn1.ASN1Util.getPEMStringFromHex('616161', 'RSA PRIVATE KEY');
     * // value of pem will be:
     * -----BEGIN PRIVATE KEY-----
     * YWFh
     * -----END PRIVATE KEY-----
     */
    this.getPEMStringFromHex = function(dataHex, pemHeader) {
        return hextopem(dataHex, pemHeader);
    };

    /**
     * generate ASN1Object specifed by JSON parameters
     * @name newObject
     * @memberOf KJUR.asn1.ASN1Util
     * @function
     * @param {Array} param JSON parameter to generate ASN1Object
     * @return {KJUR.asn1.ASN1Object} generated object
     * @since asn1 1.0.3
     * @description
     * generate any ASN1Object specified by JSON param
     * including ASN.1 primitive or structured.
     * Generally 'param' can be described as follows:
     * <blockquote>
     * {TYPE-OF-ASNOBJ: ASN1OBJ-PARAMETER}
     * </blockquote>
     * 'TYPE-OF-ASN1OBJ' can be one of following symbols:
     * <ul>
     * <li>'bool' - DERBoolean</li>
     * <li>'int' - DERInteger</li>
     * <li>'bitstr' - DERBitString</li>
     * <li>'octstr' - DEROctetString</li>
     * <li>'null' - DERNull</li>
     * <li>'oid' - DERObjectIdentifier</li>
     * <li>'enum' - DEREnumerated</li>
     * <li>'utf8str' - DERUTF8String</li>
     * <li>'numstr' - DERNumericString</li>
     * <li>'prnstr' - DERPrintableString</li>
     * <li>'telstr' - DERTeletexString</li>
     * <li>'ia5str' - DERIA5String</li>
     * <li>'utctime' - DERUTCTime</li>
     * <li>'gentime' - DERGeneralizedTime</li>
     * <li>'seq' - DERSequence</li>
     * <li>'set' - DERSet</li>
     * <li>'tag' - DERTaggedObject</li>
     * </ul>
     * @example
     * newObject({'prnstr': 'aaa'});
     * newObject({'seq': [{'int': 3}, {'prnstr': 'aaa'}]})
     * // ASN.1 Tagged Object
     * newObject({'tag': {'tag': 'a1',
     *                    'explicit': true,
     *                    'obj': {'seq': [{'int': 3}, {'prnstr': 'aaa'}]}}});
     * // more simple representation of ASN.1 Tagged Object
     * newObject({'tag': ['a1',
     *                    true,
     *                    {'seq': [
     *                      {'int': 3},
     *                      {'prnstr': 'aaa'}]}
     *                   ]});
     */
    this.newObject = function(param) {
        var _KJUR = KJUR,
            _KJUR_asn1 = _KJUR.asn1,
            _DERBoolean = _KJUR_asn1.DERBoolean,
            _DERInteger = _KJUR_asn1.DERInteger,
            _DERBitString = _KJUR_asn1.DERBitString,
            _DEROctetString = _KJUR_asn1.DEROctetString,
            _DERNull = _KJUR_asn1.DERNull,
            _DERObjectIdentifier = _KJUR_asn1.DERObjectIdentifier,
            _DEREnumerated = _KJUR_asn1.DEREnumerated,
            _DERUTF8String = _KJUR_asn1.DERUTF8String,
            _DERNumericString = _KJUR_asn1.DERNumericString,
            _DERPrintableString = _KJUR_asn1.DERPrintableString,
            _DERTeletexString = _KJUR_asn1.DERTeletexString,
            _DERIA5String = _KJUR_asn1.DERIA5String,
            _DERUTCTime = _KJUR_asn1.DERUTCTime,
            _DERGeneralizedTime = _KJUR_asn1.DERGeneralizedTime,
            _DERSequence = _KJUR_asn1.DERSequence,
            _DERSet = _KJUR_asn1.DERSet,
            _DERTaggedObject = _KJUR_asn1.DERTaggedObject,
            _newObject = _KJUR_asn1.ASN1Util.newObject;

        var keys = Object.keys(param);
        if (keys.length != 1)
            throw "key of param shall be only one.";
        var key = keys[0];

        if (":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":" + key + ":") == -1)
            throw "undefined key: " + key;

        if (key == "bool")    return new _DERBoolean(param[key]);
        if (key == "int")     return new _DERInteger(param[key]);
        if (key == "bitstr")  return new _DERBitString(param[key]);
        if (key == "octstr")  return new _DEROctetString(param[key]);
        if (key == "null")    return new _DERNull(param[key]);
        if (key == "oid")     return new _DERObjectIdentifier(param[key]);
        if (key == "enum")    return new _DEREnumerated(param[key]);
        if (key == "utf8str") return new _DERUTF8String(param[key]);
        if (key == "numstr")  return new _DERNumericString(param[key]);
        if (key == "prnstr")  return new _DERPrintableString(param[key]);
        if (key == "telstr")  return new _DERTeletexString(param[key]);
        if (key == "ia5str")  return new _DERIA5String(param[key]);
        if (key == "utctime") return new _DERUTCTime(param[key]);
        if (key == "gentime") return new _DERGeneralizedTime(param[key]);

        if (key == "seq") {
            var paramList = param[key];
            var a = [];
            for (var i = 0; i < paramList.length; i++) {
                var asn1Obj = _newObject(paramList[i]);
                a.push(asn1Obj);
            }
            return new _DERSequence({'array': a});
        }

        if (key == "set") {
            var paramList = param[key];
            var a = [];
            for (var i = 0; i < paramList.length; i++) {
                var asn1Obj = _newObject(paramList[i]);
                a.push(asn1Obj);
            }
            return new _DERSet({'array': a});
        }

        if (key == "tag") {
            var tagParam = param[key];
            if (Object.prototype.toString.call(tagParam) === '[object Array]' &&
                tagParam.length == 3) {
                var obj = _newObject(tagParam[2]);
                return new _DERTaggedObject({tag: tagParam[0],
                    explicit: tagParam[1],
                    obj: obj});
            } else {
                var newParam = {};
                if (tagParam.explicit !== undefined)
                    newParam.explicit = tagParam.explicit;
                if (tagParam.tag !== undefined)
                    newParam.tag = tagParam.tag;
                if (tagParam.obj === undefined)
                    throw "obj shall be specified for 'tag'.";
                newParam.obj = _newObject(tagParam.obj);
                return new _DERTaggedObject(newParam);
            }
        }
    };

    /**
     * get encoded hexadecimal string of ASN1Object specifed by JSON parameters
     * @name jsonToASN1HEX
     * @memberOf KJUR.asn1.ASN1Util
     * @function
     * @param {Array} param JSON parameter to generate ASN1Object
     * @return hexadecimal string of ASN1Object
     * @since asn1 1.0.4
     * @description
     * As for ASN.1 object representation of JSON object,
     * please see {@link newObject}.
     * @example
     * jsonToASN1HEX({'prnstr': 'aaa'});
     */
    this.jsonToASN1HEX = function(param) {
        var asn1Obj = this.newObject(param);
        return asn1Obj.getEncodedHex();
    };
};

/**
 * get dot noted oid number string from hexadecimal value of OID
 * @name oidHexToInt
 * @memberOf KJUR.asn1.ASN1Util
 * @function
 * @param {String} hex hexadecimal value of object identifier
 * @return {String} dot noted string of object identifier
 * @since jsrsasign 4.8.3 asn1 1.0.7
 * @description
 * This static method converts from hexadecimal string representation of
 * ASN.1 value of object identifier to oid number string.
 * @example
 * KJUR.asn1.ASN1Util.oidHexToInt('550406') &rarr; "2.5.4.6"
 */
KJUR.asn1.ASN1Util.oidHexToInt = function(hex) {
    var s = "";
    var i01 = parseInt(hex.substr(0, 2), 16);
    var i0 = Math.floor(i01 / 40);
    var i1 = i01 % 40;
    var s = i0 + "." + i1;

    var binbuf = "";
    for (var i = 2; i < hex.length; i += 2) {
        var value = parseInt(hex.substr(i, 2), 16);
        var bin = ("00000000" + value.toString(2)).slice(- 8);
        binbuf = binbuf + bin.substr(1, 7);
        if (bin.substr(0, 1) == "0") {
            var bi = new __WEBPACK_IMPORTED_MODULE_0__jsbn_jsbn__["a" /* BigInteger */](binbuf, 2);
            s = s + "." + bi.toString(10);
            binbuf = "";
        }
    };

    return s;
};

/**
 * get hexadecimal value of object identifier from dot noted oid value
 * @name oidIntToHex
 * @memberOf KJUR.asn1.ASN1Util
 * @function
 * @param {String} oidString dot noted string of object identifier
 * @return {String} hexadecimal value of object identifier
 * @since jsrsasign 4.8.3 asn1 1.0.7
 * @description
 * This static method converts from object identifier value string.
 * to hexadecimal string representation of it.
 * @example
 * KJUR.asn1.ASN1Util.oidIntToHex("2.5.4.6") &rarr; "550406"
 */
KJUR.asn1.ASN1Util.oidIntToHex = function(oidString) {
    var itox = function(i) {
        var h = i.toString(16);
        if (h.length == 1) h = '0' + h;
        return h;
    };

    var roidtox = function(roid) {
        var h = '';
        var bi = new __WEBPACK_IMPORTED_MODULE_0__jsbn_jsbn__["a" /* BigInteger */](roid, 10);
        var b = bi.toString(2);
        var padLen = 7 - b.length % 7;
        if (padLen == 7) padLen = 0;
        var bPad = '';
        for (var i = 0; i < padLen; i++) bPad += '0';
        b = bPad + b;
        for (var i = 0; i < b.length - 1; i += 7) {
            var b8 = b.substr(i, 7);
            if (i != b.length - 7) b8 = '1' + b8;
            h += itox(parseInt(b8, 2));
        }
        return h;
    };

    if (! oidString.match(/^[0-9.]+$/)) {
        throw "malformed oid string: " + oidString;
    }
    var h = '';
    var a = oidString.split('.');
    var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
    h += itox(i0);
    a.splice(0, 2);
    for (var i = 0; i < a.length; i++) {
        h += roidtox(a[i]);
    }
    return h;
};


// ********************************************************************
//  Abstract ASN.1 Classes
// ********************************************************************

// ********************************************************************

/**
 * base class for ASN.1 DER encoder object
 * @name KJUR.asn1.ASN1Object
 * @class base class for ASN.1 DER encoder object
 * @property {Boolean} isModified flag whether internal data was changed
 * @property {String} hTLV hexadecimal string of ASN.1 TLV
 * @property {String} hT hexadecimal string of ASN.1 TLV tag(T)
 * @property {String} hL hexadecimal string of ASN.1 TLV length(L)
 * @property {String} hV hexadecimal string of ASN.1 TLV value(V)
 * @description
 */
KJUR.asn1.ASN1Object = function() {
    var isModified = true;
    var hTLV = null;
    var hT = '00';
    var hL = '00';
    var hV = '';

    /**
     * get hexadecimal ASN.1 TLV length(L) bytes from TLV value(V)
     * @name getLengthHexFromValue
     * @memberOf KJUR.asn1.ASN1Object#
     * @function
     * @return {String} hexadecimal string of ASN.1 TLV length(L)
     */
    this.getLengthHexFromValue = function() {
        if (typeof this.hV == "undefined" || this.hV == null) {
            throw "this.hV is null or undefined.";
        }
        if (this.hV.length % 2 == 1) {
            throw "value hex must be even length: n=" + hV.length + ",v=" + this.hV;
        }
        var n = this.hV.length / 2;
        var hN = n.toString(16);
        if (hN.length % 2 == 1) {
            hN = "0" + hN;
        }
        if (n < 128) {
            return hN;
        } else {
            var hNlen = hN.length / 2;
            if (hNlen > 15) {
                throw "ASN.1 length too long to represent by 8x: n = " + n.toString(16);
            }
            var head = 128 + hNlen;
            return head.toString(16) + hN;
        }
    };

    /**
     * get hexadecimal string of ASN.1 TLV bytes
     * @name getEncodedHex
     * @memberOf KJUR.asn1.ASN1Object#
     * @function
     * @return {String} hexadecimal string of ASN.1 TLV
     */
    this.getEncodedHex = function() {
        if (this.hTLV == null || this.isModified) {
            this.hV = this.getFreshValueHex();
            this.hL = this.getLengthHexFromValue();
            this.hTLV = this.hT + this.hL + this.hV;
            this.isModified = false;
            //alert("first time: " + this.hTLV);
        }
        return this.hTLV;
    };

    /**
     * get hexadecimal string of ASN.1 TLV value(V) bytes
     * @name getValueHex
     * @memberOf KJUR.asn1.ASN1Object#
     * @function
     * @return {String} hexadecimal string of ASN.1 TLV value(V) bytes
     */
    this.getValueHex = function() {
        this.getEncodedHex();
        return this.hV;
    }

    this.getFreshValueHex = function() {
        return '';
    };
};

// == BEGIN DERAbstractString ================================================
/**
 * base class for ASN.1 DER string classes
 * @name KJUR.asn1.DERAbstractString
 * @class base class for ASN.1 DER string classes
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @property {String} s internal string of value
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERAbstractString = function(params) {
    KJUR.asn1.DERAbstractString.superclass.constructor.call(this);
    var s = null;
    var hV = null;

    /**
     * get string value of this string object
     * @name getString
     * @memberOf KJUR.asn1.DERAbstractString#
     * @function
     * @return {String} string value of this string object
     */
    this.getString = function() {
        return this.s;
    };

    /**
     * set value by a string
     * @name setString
     * @memberOf KJUR.asn1.DERAbstractString#
     * @function
     * @param {String} newS value by a string to set
     */
    this.setString = function(newS) {
        this.hTLV = null;
        this.isModified = true;
        this.s = newS;
        this.hV = stohex(this.s);
    };

    /**
     * set value by a hexadecimal string
     * @name setStringHex
     * @memberOf KJUR.asn1.DERAbstractString#
     * @function
     * @param {String} newHexString value by a hexadecimal string to set
     */
    this.setStringHex = function(newHexString) {
        this.hTLV = null;
        this.isModified = true;
        this.s = null;
        this.hV = newHexString;
    };

    this.getFreshValueHex = function() {
        return this.hV;
    };

    if (typeof params != "undefined") {
        if (typeof params == "string") {
            this.setString(params);
        } else if (typeof params['str'] != "undefined") {
            this.setString(params['str']);
        } else if (typeof params['hex'] != "undefined") {
            this.setStringHex(params['hex']);
        }
    }
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DERAbstractString, KJUR.asn1.ASN1Object);
// == END   DERAbstractString ================================================

// == BEGIN DERAbstractTime ==================================================
/**
 * base class for ASN.1 DER Generalized/UTCTime class
 * @name KJUR.asn1.DERAbstractTime
 * @class base class for ASN.1 DER Generalized/UTCTime class
 * @param {Array} params associative array of parameters (ex. {'str': '130430235959Z'})
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERAbstractTime = function(params) {
    KJUR.asn1.DERAbstractTime.superclass.constructor.call(this);
    var s = null;
    var date = null;

    // --- PRIVATE METHODS --------------------
    this.localDateToUTC = function(d) {
        utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var utcDate = new Date(utc);
        return utcDate;
    };

    /*
     * format date string by Data object
     * @name formatDate
     * @memberOf KJUR.asn1.AbstractTime;
     * @param {Date} dateObject
     * @param {string} type 'utc' or 'gen'
     * @param {boolean} withMillis flag for with millisections or not
     * @description
     * 'withMillis' flag is supported from asn1 1.0.6.
     */
    this.formatDate = function(dateObject, type, withMillis) {
        var pad = this.zeroPadding;
        var d = this.localDateToUTC(dateObject);
        var year = String(d.getFullYear());
        if (type == 'utc') year = year.substr(2, 2);
        var month = pad(String(d.getMonth() + 1), 2);
        var day = pad(String(d.getDate()), 2);
        var hour = pad(String(d.getHours()), 2);
        var min = pad(String(d.getMinutes()), 2);
        var sec = pad(String(d.getSeconds()), 2);
        var s = year + month + day + hour + min + sec;
        if (withMillis === true) {
            var millis = d.getMilliseconds();
            if (millis != 0) {
                var sMillis = pad(String(millis), 3);
                sMillis = sMillis.replace(/[0]+$/, "");
                s = s + "." + sMillis;
            }
        }
        return s + "Z";
    };

    this.zeroPadding = function(s, len) {
        if (s.length >= len) return s;
        return new Array(len - s.length + 1).join('0') + s;
    };

    // --- PUBLIC METHODS --------------------
    /**
     * get string value of this string object
     * @name getString
     * @memberOf KJUR.asn1.DERAbstractTime#
     * @function
     * @return {String} string value of this time object
     */
    this.getString = function() {
        return this.s;
    };

    /**
     * set value by a string
     * @name setString
     * @memberOf KJUR.asn1.DERAbstractTime#
     * @function
     * @param {String} newS value by a string to set such like "130430235959Z"
     */
    this.setString = function(newS) {
        this.hTLV = null;
        this.isModified = true;
        this.s = newS;
        this.hV = stohex(newS);
    };

    /**
     * set value by a Date object
     * @name setByDateValue
     * @memberOf KJUR.asn1.DERAbstractTime#
     * @function
     * @param {Integer} year year of date (ex. 2013)
     * @param {Integer} month month of date between 1 and 12 (ex. 12)
     * @param {Integer} day day of month
     * @param {Integer} hour hours of date
     * @param {Integer} min minutes of date
     * @param {Integer} sec seconds of date
     */
    this.setByDateValue = function(year, month, day, hour, min, sec) {
        var dateObject = new Date(Date.UTC(year, month - 1, day, hour, min, sec, 0));
        this.setByDate(dateObject);
    };

    this.getFreshValueHex = function() {
        return this.hV;
    };
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DERAbstractTime, KJUR.asn1.ASN1Object);
// == END   DERAbstractTime ==================================================

// == BEGIN DERAbstractStructured ============================================
/**
 * base class for ASN.1 DER structured class
 * @name KJUR.asn1.DERAbstractStructured
 * @class base class for ASN.1 DER structured class
 * @property {Array} asn1Array internal array of ASN1Object
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERAbstractStructured = function(params) {
    KJUR.asn1.DERAbstractString.superclass.constructor.call(this);
    var asn1Array = null;

    /**
     * set value by array of ASN1Object
     * @name setByASN1ObjectArray
     * @memberOf KJUR.asn1.DERAbstractStructured#
     * @function
     * @param {array} asn1ObjectArray array of ASN1Object to set
     */
    this.setByASN1ObjectArray = function(asn1ObjectArray) {
        this.hTLV = null;
        this.isModified = true;
        this.asn1Array = asn1ObjectArray;
    };

    /**
     * append an ASN1Object to internal array
     * @name appendASN1Object
     * @memberOf KJUR.asn1.DERAbstractStructured#
     * @function
     * @param {ASN1Object} asn1Object to add
     */
    this.appendASN1Object = function(asn1Object) {
        this.hTLV = null;
        this.isModified = true;
        this.asn1Array.push(asn1Object);
    };

    this.asn1Array = new Array();
    if (typeof params != "undefined") {
        if (typeof params['array'] != "undefined") {
            this.asn1Array = params['array'];
        }
    }
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DERAbstractStructured, KJUR.asn1.ASN1Object);


// ********************************************************************
//  ASN.1 Object Classes
// ********************************************************************

// ********************************************************************
/**
 * class for ASN.1 DER Boolean
 * @name KJUR.asn1.DERBoolean
 * @class class for ASN.1 DER Boolean
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERBoolean = function() {
    KJUR.asn1.DERBoolean.superclass.constructor.call(this);
    this.hT = "01";
    this.hTLV = "0101ff";
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DERBoolean, KJUR.asn1.ASN1Object);

// ********************************************************************
/**
 * class for ASN.1 DER Integer
 * @name KJUR.asn1.DERInteger
 * @class class for ASN.1 DER Integer
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>int - specify initial ASN.1 value(V) by integer value</li>
 * <li>bigint - specify initial ASN.1 value(V) by BigInteger object</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERInteger = function(params) {
    KJUR.asn1.DERInteger.superclass.constructor.call(this);
    this.hT = "02";

    /**
     * set value by Tom Wu's BigInteger object
     * @name setByBigInteger
     * @memberOf KJUR.asn1.DERInteger#
     * @function
     * @param {BigInteger} bigIntegerValue to set
     */
    this.setByBigInteger = function(bigIntegerValue) {
        this.hTLV = null;
        this.isModified = true;
        this.hV = KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
    };

    /**
     * set value by integer value
     * @name setByInteger
     * @memberOf KJUR.asn1.DERInteger
     * @function
     * @param {Integer} integer value to set
     */
    this.setByInteger = function(intValue) {
        var bi = new __WEBPACK_IMPORTED_MODULE_0__jsbn_jsbn__["a" /* BigInteger */](String(intValue), 10);
        this.setByBigInteger(bi);
    };

    /**
     * set value by integer value
     * @name setValueHex
     * @memberOf KJUR.asn1.DERInteger#
     * @function
     * @param {String} hexadecimal string of integer value
     * @description
     * <br/>
     * NOTE: Value shall be represented by minimum octet length of
     * two's complement representation.
     * @example
     * new KJUR.asn1.DERInteger(123);
     * new KJUR.asn1.DERInteger({'int': 123});
     * new KJUR.asn1.DERInteger({'hex': '1fad'});
     */
    this.setValueHex = function(newHexString) {
        this.hV = newHexString;
    };

    this.getFreshValueHex = function() {
        return this.hV;
    };

    if (typeof params != "undefined") {
        if (typeof params['bigint'] != "undefined") {
            this.setByBigInteger(params['bigint']);
        } else if (typeof params['int'] != "undefined") {
            this.setByInteger(params['int']);
        } else if (typeof params == "number") {
            this.setByInteger(params);
        } else if (typeof params['hex'] != "undefined") {
            this.setValueHex(params['hex']);
        }
    }
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DERInteger, KJUR.asn1.ASN1Object);

// ********************************************************************
/**
 * class for ASN.1 DER encoded BitString primitive
 * @name KJUR.asn1.DERBitString
 * @class class for ASN.1 DER encoded BitString primitive
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>bin - specify binary string (ex. '10111')</li>
 * <li>array - specify array of boolean (ex. [true,false,true,true])</li>
 * <li>hex - specify hexadecimal string of ASN.1 value(V) including unused bits</li>
 * <li>obj - specify {@link KJUR.asn1.ASN1Util.newObject}
 * argument for "BitString encapsulates" structure.</li>
 * </ul>
 * NOTE1: 'params' can be omitted.<br/>
 * NOTE2: 'obj' parameter have been supported since
 * asn1 1.0.11, jsrsasign 6.1.1 (2016-Sep-25).<br/>
 * @example
 * // default constructor
 * o = new KJUR.asn1.DERBitString();
 * // initialize with binary string
 * o = new KJUR.asn1.DERBitString({bin: "1011"});
 * // initialize with boolean array
 * o = new KJUR.asn1.DERBitString({array: [true,false,true,true]});
 * // initialize with hexadecimal string (04 is unused bits)
 * o = new KJUR.asn1.DEROctetString({hex: "04bac0"});
 * // initialize with ASN1Util.newObject argument for encapsulated
 * o = new KJUR.asn1.DERBitString({obj: {seq: [{int: 3}, {prnstr: 'aaa'}]}});
 * // above generates a ASN.1 data like this:
 * // BIT STRING, encapsulates {
 * //   SEQUENCE {
 * //     INTEGER 3
 * //     PrintableString 'aaa'
 * //     }
 * //   }
 */
KJUR.asn1.DERBitString = function(params) {
    if (params !== undefined && typeof params.obj !== "undefined") {
        var o = KJUR.asn1.ASN1Util.newObject(params.obj);
        params.hex = "00" + o.getEncodedHex();
    }
    KJUR.asn1.DERBitString.superclass.constructor.call(this);
    this.hT = "03";

    /**
     * set ASN.1 value(V) by a hexadecimal string including unused bits
     * @name setHexValueIncludingUnusedBits
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {String} newHexStringIncludingUnusedBits
     */
    this.setHexValueIncludingUnusedBits = function(newHexStringIncludingUnusedBits) {
        this.hTLV = null;
        this.isModified = true;
        this.hV = newHexStringIncludingUnusedBits;
    };

    /**
     * set ASN.1 value(V) by unused bit and hexadecimal string of value
     * @name setUnusedBitsAndHexValue
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {Integer} unusedBits
     * @param {String} hValue
     */
    this.setUnusedBitsAndHexValue = function(unusedBits, hValue) {
        if (unusedBits < 0 || 7 < unusedBits) {
            throw "unused bits shall be from 0 to 7: u = " + unusedBits;
        }
        var hUnusedBits = "0" + unusedBits;
        this.hTLV = null;
        this.isModified = true;
        this.hV = hUnusedBits + hValue;
    };

    /**
     * set ASN.1 DER BitString by binary string<br/>
     * @name setByBinaryString
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {String} binaryString binary value string (i.e. '10111')
     * @description
     * Its unused bits will be calculated automatically by length of
     * 'binaryValue'. <br/>
     * NOTE: Trailing zeros '0' will be ignored.
     * @example
     * o = new KJUR.asn1.DERBitString();
     * o.setByBooleanArray("01011");
     */
    this.setByBinaryString = function(binaryString) {
        binaryString = binaryString.replace(/0+$/, '');
        var unusedBits = 8 - binaryString.length % 8;
        if (unusedBits == 8) unusedBits = 0;
        for (var i = 0; i <= unusedBits; i++) {
            binaryString += '0';
        }
        var h = '';
        for (var i = 0; i < binaryString.length - 1; i += 8) {
            var b = binaryString.substr(i, 8);
            var x = parseInt(b, 2).toString(16);
            if (x.length == 1) x = '0' + x;
            h += x;
        }
        this.hTLV = null;
        this.isModified = true;
        this.hV = '0' + unusedBits + h;
    };

    /**
     * set ASN.1 TLV value(V) by an array of boolean<br/>
     * @name setByBooleanArray
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {array} booleanArray array of boolean (ex. [true, false, true])
     * @description
     * NOTE: Trailing falses will be ignored in the ASN.1 DER Object.
     * @example
     * o = new KJUR.asn1.DERBitString();
     * o.setByBooleanArray([false, true, false, true, true]);
     */
    this.setByBooleanArray = function(booleanArray) {
        var s = '';
        for (var i = 0; i < booleanArray.length; i++) {
            if (booleanArray[i] == true) {
                s += '1';
            } else {
                s += '0';
            }
        }
        this.setByBinaryString(s);
    };

    /**
     * generate an array of falses with specified length<br/>
     * @name newFalseArray
     * @memberOf KJUR.asn1.DERBitString
     * @function
     * @param {Integer} nLength length of array to generate
     * @return {array} array of boolean falses
     * @description
     * This static method may be useful to initialize boolean array.
     * @example
     * o = new KJUR.asn1.DERBitString();
     * o.newFalseArray(3) &rarr; [false, false, false]
     */
    this.newFalseArray = function(nLength) {
        var a = new Array(nLength);
        for (var i = 0; i < nLength; i++) {
            a[i] = false;
        }
        return a;
    };

    this.getFreshValueHex = function() {
        return this.hV;
    };

    if (typeof params != "undefined") {
        if (typeof params == "string" && params.toLowerCase().match(/^[0-9a-f]+$/)) {
            this.setHexValueIncludingUnusedBits(params);
        } else if (typeof params['hex'] != "undefined") {
            this.setHexValueIncludingUnusedBits(params['hex']);
        } else if (typeof params['bin'] != "undefined") {
            this.setByBinaryString(params['bin']);
        } else if (typeof params['array'] != "undefined") {
            this.setByBooleanArray(params['array']);
        }
    }
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DERBitString, KJUR.asn1.ASN1Object);

// ********************************************************************
/**
 * class for ASN.1 DER OctetString<br/>
 * @name KJUR.asn1.DEROctetString
 * @class class for ASN.1 DER OctetString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * This class provides ASN.1 OctetString simple type.<br/>
 * Supported "params" attributes are:
 * <ul>
 * <li>str - to set a string as a value</li>
 * <li>hex - to set a hexadecimal string as a value</li>
 * <li>obj - to set a encapsulated ASN.1 value by JSON object
 * which is defined in {@link KJUR.asn1.ASN1Util.newObject}</li>
 * </ul>
 * NOTE: A parameter 'obj' have been supported
 * for "OCTET STRING, encapsulates" structure.
 * since asn1 1.0.11, jsrsasign 6.1.1 (2016-Sep-25).
 * @see KJUR.asn1.DERAbstractString - superclass
 * @example
 * // default constructor
 * o = new KJUR.asn1.DEROctetString();
 * // initialize with string
 * o = new KJUR.asn1.DEROctetString({str: "aaa"});
 * // initialize with hexadecimal string
 * o = new KJUR.asn1.DEROctetString({hex: "616161"});
 * // initialize with ASN1Util.newObject argument
 * o = new KJUR.asn1.DEROctetString({obj: {seq: [{int: 3}, {prnstr: 'aaa'}]}});
 * // above generates a ASN.1 data like this:
 * // OCTET STRING, encapsulates {
 * //   SEQUENCE {
 * //     INTEGER 3
 * //     PrintableString 'aaa'
 * //     }
 * //   }
 */
KJUR.asn1.DEROctetString = function(params) {
    if (params !== undefined && typeof params.obj !== "undefined") {
        var o = KJUR.asn1.ASN1Util.newObject(params.obj);
        params.hex = o.getEncodedHex();
    }
    KJUR.asn1.DEROctetString.superclass.constructor.call(this, params);
    this.hT = "04";
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DEROctetString, KJUR.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER Null
 * @name KJUR.asn1.DERNull
 * @class class for ASN.1 DER Null
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERNull = function() {
    KJUR.asn1.DERNull.superclass.constructor.call(this);
    this.hT = "05";
    this.hTLV = "0500";
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DERNull, KJUR.asn1.ASN1Object);

// ********************************************************************
/**
 * class for ASN.1 DER ObjectIdentifier
 * @name KJUR.asn1.DERObjectIdentifier
 * @class class for ASN.1 DER ObjectIdentifier
 * @param {Array} params associative array of parameters (ex. {'oid': '2.5.4.5'})
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>oid - specify initial ASN.1 value(V) by a oid string (ex. 2.5.4.13)</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERObjectIdentifier = function(params) {
    var itox = function(i) {
        var h = i.toString(16);
        if (h.length == 1) h = '0' + h;
        return h;
    };
    var roidtox = function(roid) {
        var h = '';
        var bi = new __WEBPACK_IMPORTED_MODULE_0__jsbn_jsbn__["a" /* BigInteger */](roid, 10);
        var b = bi.toString(2);
        var padLen = 7 - b.length % 7;
        if (padLen == 7) padLen = 0;
        var bPad = '';
        for (var i = 0; i < padLen; i++) bPad += '0';
        b = bPad + b;
        for (var i = 0; i < b.length - 1; i += 7) {
            var b8 = b.substr(i, 7);
            if (i != b.length - 7) b8 = '1' + b8;
            h += itox(parseInt(b8, 2));
        }
        return h;
    }

    KJUR.asn1.DERObjectIdentifier.superclass.constructor.call(this);
    this.hT = "06";

    /**
     * set value by a hexadecimal string
     * @name setValueHex
     * @memberOf KJUR.asn1.DERObjectIdentifier#
     * @function
     * @param {String} newHexString hexadecimal value of OID bytes
     */
    this.setValueHex = function(newHexString) {
        this.hTLV = null;
        this.isModified = true;
        this.s = null;
        this.hV = newHexString;
    };

    /**
     * set value by a OID string<br/>
     * @name setValueOidString
     * @memberOf KJUR.asn1.DERObjectIdentifier#
     * @function
     * @param {String} oidString OID string (ex. 2.5.4.13)
     * @example
     * o = new KJUR.asn1.DERObjectIdentifier();
     * o.setValueOidString("2.5.4.13");
     */
    this.setValueOidString = function(oidString) {
        if (! oidString.match(/^[0-9.]+$/)) {
            throw "malformed oid string: " + oidString;
        }
        var h = '';
        var a = oidString.split('.');
        var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
        h += itox(i0);
        a.splice(0, 2);
        for (var i = 0; i < a.length; i++) {
            h += roidtox(a[i]);
        }
        this.hTLV = null;
        this.isModified = true;
        this.s = null;
        this.hV = h;
    };

    /**
     * set value by a OID name
     * @name setValueName
     * @memberOf KJUR.asn1.DERObjectIdentifier#
     * @function
     * @param {String} oidName OID name (ex. 'serverAuth')
     * @since 1.0.1
     * @description
     * OID name shall be defined in 'KJUR.asn1.x509.OID.name2oidList'.
     * Otherwise raise error.
     * @example
     * o = new KJUR.asn1.DERObjectIdentifier();
     * o.setValueName("serverAuth");
     */
    this.setValueName = function(oidName) {
        var oid = KJUR.asn1.x509.OID.name2oid(oidName);
        if (oid !== '') {
            this.setValueOidString(oid);
        } else {
            throw "DERObjectIdentifier oidName undefined: " + oidName;
        }
    };

    this.getFreshValueHex = function() {
        return this.hV;
    };

    if (params !== undefined) {
        if (typeof params === "string") {
            if (params.match(/^[0-2].[0-9.]+$/)) {
                this.setValueOidString(params);
            } else {
                this.setValueName(params);
            }
        } else if (params.oid !== undefined) {
            this.setValueOidString(params.oid);
        } else if (params.hex !== undefined) {
            this.setValueHex(params.hex);
        } else if (params.name !== undefined) {
            this.setValueName(params.name);
        }
    }
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DERObjectIdentifier, KJUR.asn1.ASN1Object);

// ********************************************************************
/**
 * class for ASN.1 DER Enumerated
 * @name KJUR.asn1.DEREnumerated
 * @class class for ASN.1 DER Enumerated
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>int - specify initial ASN.1 value(V) by integer value</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 * @example
 * new KJUR.asn1.DEREnumerated(123);
 * new KJUR.asn1.DEREnumerated({int: 123});
 * new KJUR.asn1.DEREnumerated({hex: '1fad'});
 */
KJUR.asn1.DEREnumerated = function(params) {
    KJUR.asn1.DEREnumerated.superclass.constructor.call(this);
    this.hT = "0a";

    /**
     * set value by Tom Wu's BigInteger object
     * @name setByBigInteger
     * @memberOf KJUR.asn1.DEREnumerated#
     * @function
     * @param {BigInteger} bigIntegerValue to set
     */
    this.setByBigInteger = function(bigIntegerValue) {
        this.hTLV = null;
        this.isModified = true;
        this.hV = KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
    };

    /**
     * set value by integer value
     * @name setByInteger
     * @memberOf KJUR.asn1.DEREnumerated#
     * @function
     * @param {Integer} integer value to set
     */
    this.setByInteger = function(intValue) {
        var bi = new __WEBPACK_IMPORTED_MODULE_0__jsbn_jsbn__["a" /* BigInteger */](String(intValue), 10);
        this.setByBigInteger(bi);
    };

    /**
     * set value by integer value
     * @name setValueHex
     * @memberOf KJUR.asn1.DEREnumerated#
     * @function
     * @param {String} hexadecimal string of integer value
     * @description
     * <br/>
     * NOTE: Value shall be represented by minimum octet length of
     * two's complement representation.
     */
    this.setValueHex = function(newHexString) {
        this.hV = newHexString;
    };

    this.getFreshValueHex = function() {
        return this.hV;
    };

    if (typeof params != "undefined") {
        if (typeof params['int'] != "undefined") {
            this.setByInteger(params['int']);
        } else if (typeof params == "number") {
            this.setByInteger(params);
        } else if (typeof params['hex'] != "undefined") {
            this.setValueHex(params['hex']);
        }
    }
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DEREnumerated, KJUR.asn1.ASN1Object);

// ********************************************************************
/**
 * class for ASN.1 DER UTF8String
 * @name KJUR.asn1.DERUTF8String
 * @class class for ASN.1 DER UTF8String
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERUTF8String = function(params) {
    KJUR.asn1.DERUTF8String.superclass.constructor.call(this, params);
    this.hT = "0c";
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DERUTF8String, KJUR.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER NumericString
 * @name KJUR.asn1.DERNumericString
 * @class class for ASN.1 DER NumericString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERNumericString = function(params) {
    KJUR.asn1.DERNumericString.superclass.constructor.call(this, params);
    this.hT = "12";
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DERNumericString, KJUR.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER PrintableString
 * @name KJUR.asn1.DERPrintableString
 * @class class for ASN.1 DER PrintableString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERPrintableString = function(params) {
    KJUR.asn1.DERPrintableString.superclass.constructor.call(this, params);
    this.hT = "13";
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DERPrintableString, KJUR.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER TeletexString
 * @name KJUR.asn1.DERTeletexString
 * @class class for ASN.1 DER TeletexString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERTeletexString = function(params) {
    KJUR.asn1.DERTeletexString.superclass.constructor.call(this, params);
    this.hT = "14";
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DERTeletexString, KJUR.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER IA5String
 * @name KJUR.asn1.DERIA5String
 * @class class for ASN.1 DER IA5String
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERIA5String = function(params) {
    KJUR.asn1.DERIA5String.superclass.constructor.call(this, params);
    this.hT = "16";
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DERIA5String, KJUR.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER UTCTime
 * @name KJUR.asn1.DERUTCTime
 * @class class for ASN.1 DER UTCTime
 * @param {Array} params associative array of parameters (ex. {'str': '130430235959Z'})
 * @extends KJUR.asn1.DERAbstractTime
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string (ex.'130430235959Z')</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * <li>date - specify Date object.</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 * <h4>EXAMPLES</h4>
 * @example
 * d1 = new KJUR.asn1.DERUTCTime();
 * d1.setString('130430125959Z');
 *
 * d2 = new KJUR.asn1.DERUTCTime({'str': '130430125959Z'});
 * d3 = new KJUR.asn1.DERUTCTime({'date': new Date(Date.UTC(2015, 0, 31, 0, 0, 0, 0))});
 * d4 = new KJUR.asn1.DERUTCTime('130430125959Z');
 */
KJUR.asn1.DERUTCTime = function(params) {
    KJUR.asn1.DERUTCTime.superclass.constructor.call(this, params);
    this.hT = "17";

    /**
     * set value by a Date object<br/>
     * @name setByDate
     * @memberOf KJUR.asn1.DERUTCTime#
     * @function
     * @param {Date} dateObject Date object to set ASN.1 value(V)
     * @example
     * o = new KJUR.asn1.DERUTCTime();
     * o.setByDate(new Date("2016/12/31"));
     */
    this.setByDate = function(dateObject) {
        this.hTLV = null;
        this.isModified = true;
        this.date = dateObject;
        this.s = this.formatDate(this.date, 'utc');
        this.hV = stohex(this.s);
    };

    this.getFreshValueHex = function() {
        if (typeof this.date == "undefined" && typeof this.s == "undefined") {
            this.date = new Date();
            this.s = this.formatDate(this.date, 'utc');
            this.hV = stohex(this.s);
        }
        return this.hV;
    };

    if (params !== undefined) {
        if (params.str !== undefined) {
            this.setString(params.str);
        } else if (typeof params == "string" && params.match(/^[0-9]{12}Z$/)) {
            this.setString(params);
        } else if (params.hex !== undefined) {
            this.setStringHex(params.hex);
        } else if (params.date !== undefined) {
            this.setByDate(params.date);
        }
    }
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DERUTCTime, KJUR.asn1.DERAbstractTime);

// ********************************************************************
/**
 * class for ASN.1 DER GeneralizedTime
 * @name KJUR.asn1.DERGeneralizedTime
 * @class class for ASN.1 DER GeneralizedTime
 * @param {Array} params associative array of parameters (ex. {'str': '20130430235959Z'})
 * @property {Boolean} withMillis flag to show milliseconds or not
 * @extends KJUR.asn1.DERAbstractTime
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string (ex.'20130430235959Z')</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * <li>date - specify Date object.</li>
 * <li>millis - specify flag to show milliseconds (from 1.0.6)</li>
 * </ul>
 * NOTE1: 'params' can be omitted.
 * NOTE2: 'withMillis' property is supported from asn1 1.0.6.
 */
KJUR.asn1.DERGeneralizedTime = function(params) {
    KJUR.asn1.DERGeneralizedTime.superclass.constructor.call(this, params);
    this.hT = "18";
    this.withMillis = false;

    /**
     * set value by a Date object
     * @name setByDate
     * @memberOf KJUR.asn1.DERGeneralizedTime#
     * @function
     * @param {Date} dateObject Date object to set ASN.1 value(V)
     * @example
     * When you specify UTC time, use 'Date.UTC' method like this:<br/>
     * o1 = new DERUTCTime();
     * o1.setByDate(date);
     *
     * date = new Date(Date.UTC(2015, 0, 31, 23, 59, 59, 0)); #2015JAN31 23:59:59
     */
    this.setByDate = function(dateObject) {
        this.hTLV = null;
        this.isModified = true;
        this.date = dateObject;
        this.s = this.formatDate(this.date, 'gen', this.withMillis);
        this.hV = stohex(this.s);
    };

    this.getFreshValueHex = function() {
        if (this.date === undefined && this.s === undefined) {
            this.date = new Date();
            this.s = this.formatDate(this.date, 'gen', this.withMillis);
            this.hV = stohex(this.s);
        }
        return this.hV;
    };

    if (params !== undefined) {
        if (params.str !== undefined) {
            this.setString(params.str);
        } else if (typeof params == "string" && params.match(/^[0-9]{14}Z$/)) {
            this.setString(params);
        } else if (params.hex !== undefined) {
            this.setStringHex(params.hex);
        } else if (params.date !== undefined) {
            this.setByDate(params.date);
        }
        if (params.millis === true) {
            this.withMillis = true;
        }
    }
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DERGeneralizedTime, KJUR.asn1.DERAbstractTime);

// ********************************************************************
/**
 * class for ASN.1 DER Sequence
 * @name KJUR.asn1.DERSequence
 * @class class for ASN.1 DER Sequence
 * @extends KJUR.asn1.DERAbstractStructured
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>array - specify array of ASN1Object to set elements of content</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERSequence = function(params) {
    KJUR.asn1.DERSequence.superclass.constructor.call(this, params);
    this.hT = "30";
    this.getFreshValueHex = function() {
        var h = '';
        for (var i = 0; i < this.asn1Array.length; i++) {
            var asn1Obj = this.asn1Array[i];
            h += asn1Obj.getEncodedHex();
        }
        this.hV = h;
        return this.hV;
    };
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DERSequence, KJUR.asn1.DERAbstractStructured);

// ********************************************************************
/**
 * class for ASN.1 DER Set
 * @name KJUR.asn1.DERSet
 * @class class for ASN.1 DER Set
 * @extends KJUR.asn1.DERAbstractStructured
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>array - specify array of ASN1Object to set elements of content</li>
 * <li>sortflag - flag for sort (default: true). ASN.1 BER is not sorted in 'SET OF'.</li>
 * </ul>
 * NOTE1: 'params' can be omitted.<br/>
 * NOTE2: sortflag is supported since 1.0.5.
 */
KJUR.asn1.DERSet = function(params) {
    KJUR.asn1.DERSet.superclass.constructor.call(this, params);
    this.hT = "31";
    this.sortFlag = true; // item shall be sorted only in ASN.1 DER
    this.getFreshValueHex = function() {
        var a = new Array();
        for (var i = 0; i < this.asn1Array.length; i++) {
            var asn1Obj = this.asn1Array[i];
            a.push(asn1Obj.getEncodedHex());
        }
        if (this.sortFlag == true) a.sort();
        this.hV = a.join('');
        return this.hV;
    };

    if (typeof params != "undefined") {
        if (typeof params.sortflag != "undefined" &&
            params.sortflag == false)
            this.sortFlag = false;
    }
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DERSet, KJUR.asn1.DERAbstractStructured);

// ********************************************************************
/**
 * class for ASN.1 DER TaggedObject
 * @name KJUR.asn1.DERTaggedObject
 * @class class for ASN.1 DER TaggedObject
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * Parameter 'tagNoNex' is ASN.1 tag(T) value for this object.
 * For example, if you find '[1]' tag in a ASN.1 dump,
 * 'tagNoHex' will be 'a1'.
 * <br/>
 * As for optional argument 'params' for constructor, you can specify *ANY* of
 * following properties:
 * <ul>
 * <li>explicit - specify true if this is explicit tag otherwise false
 *     (default is 'true').</li>
 * <li>tag - specify tag (default is 'a0' which means [0])</li>
 * <li>obj - specify ASN1Object which is tagged</li>
 * </ul>
 * @example
 * d1 = new KJUR.asn1.DERUTF8String({'str':'a'});
 * d2 = new KJUR.asn1.DERTaggedObject({'obj': d1});
 * hex = d2.getEncodedHex();
 */
KJUR.asn1.DERTaggedObject = function(params) {
    KJUR.asn1.DERTaggedObject.superclass.constructor.call(this);
    this.hT = "a0";
    this.hV = '';
    this.isExplicit = true;
    this.asn1Object = null;

    /**
     * set value by an ASN1Object
     * @name setString
     * @memberOf KJUR.asn1.DERTaggedObject#
     * @function
     * @param {Boolean} isExplicitFlag flag for explicit/implicit tag
     * @param {Integer} tagNoHex hexadecimal string of ASN.1 tag
     * @param {ASN1Object} asn1Object ASN.1 to encapsulate
     */
    this.setASN1Object = function(isExplicitFlag, tagNoHex, asn1Object) {
        this.hT = tagNoHex;
        this.isExplicit = isExplicitFlag;
        this.asn1Object = asn1Object;
        if (this.isExplicit) {
            this.hV = this.asn1Object.getEncodedHex();
            this.hTLV = null;
            this.isModified = true;
        } else {
            this.hV = null;
            this.hTLV = asn1Object.getEncodedHex();
            this.hTLV = this.hTLV.replace(/^../, tagNoHex);
            this.isModified = false;
        }
    };

    this.getFreshValueHex = function() {
        return this.hV;
    };

    if (typeof params != "undefined") {
        if (typeof params['tag'] != "undefined") {
            this.hT = params['tag'];
        }
        if (typeof params['explicit'] != "undefined") {
            this.isExplicit = params['explicit'];
        }
        if (typeof params['obj'] != "undefined") {
            this.asn1Object = params['obj'];
            this.setASN1Object(this.isExplicit, this.hT, this.asn1Object);
        }
    }
};
__WEBPACK_IMPORTED_MODULE_1__yahoo__["a" /* YAHOO */].lang.extend(KJUR.asn1.DERTaggedObject, KJUR.asn1.ASN1Object);

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*!
Copyright (c) 2011, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.9.0
*/
const YAHOO = {};
/* harmony export (immutable) */ __webpack_exports__["a"] = YAHOO;

YAHOO.lang = {
    /**
     * Utility to set up the prototype, constructor and superclass properties to
     * support an inheritance strategy that can chain constructors and methods.
     * Static members will not be inherited.
     *
     * @method extend
     * @static
     * @param {Function} subc   the object to modify
     * @param {Function} superc the object to inherit
     * @param {Object} overrides  additional properties/methods to add to the
     *                              subclass prototype.  These will override the
     *                              matching items obtained from the superclass
     *                              if present.
     */
    extend: function(subc, superc, overrides) {
        if (! superc || ! subc) {
            throw new Error("YAHOO.lang.extend failed, please check that " +
                "all dependencies are included.");
        }

        var F = function() {};
        F.prototype = superc.prototype;
        subc.prototype = new F();
        subc.prototype.constructor = subc;
        subc.superclass = superc.prototype;

        if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor = superc;
        }

        if (overrides) {
            var i;
            for (i in overrides) {
                subc.prototype[i] = overrides[i];
            }

            /*
             * IE will not enumerate native functions in a derived object even if the
             * function was overridden.  This is a workaround for specific functions
             * we care about on the Object prototype.
             * @property _IEEnumFix
             * @param {Function} r  the object to receive the augmentation
             * @param {Function} s  the object that supplies the properties to augment
             * @static
             * @private
             */
            var _IEEnumFix = function() {},
                ADD = ["toString", "valueOf"];
            try {
                if (/MSIE/.test(navigator.userAgent)) {
                    _IEEnumFix = function(r, s) {
                        for (i = 0; i < ADD.length; i = i + 1) {
                            var fname = ADD[i], f = s[fname];
                            if (typeof f === 'function' && f != Object.prototype[fname]) {
                                r[fname] = f;
                            }
                        }
                    };
                }
            } catch (ex) {};
            _IEEnumFix(subc.prototype, overrides);
        }
    }
};

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMmYzNjEwOGIwZDdlMDMyMTBhMWEiLCJ3ZWJwYWNrOi8vLy4vbGliL2pzYm4vanNibi50cyIsIndlYnBhY2s6Ly8vLi9saWIvanNibi9iYXNlNjQudHMiLCJ3ZWJwYWNrOi8vLy4vbGliL2pzYm4vdXRpbC50cyIsIndlYnBhY2s6Ly8vLi90ZXN0L3Rlc3QucnNhLmpzIiwid2VicGFjazovLy8uL3NyYy9KU0VuY3J5cHQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0pTRW5jcnlwdFJTQUtleS50cyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwid2VicGFjazovLy8uL2xpYi9hc24xanMvaGV4LnRzIiwid2VicGFjazovLy8uL2xpYi9hc24xanMvYmFzZTY0LnRzIiwid2VicGFjazovLy8uL2xpYi9hc24xanMvYXNuMS50cyIsIndlYnBhY2s6Ly8vLi9saWIvYXNuMWpzL2ludDEwLnRzIiwid2VicGFjazovLy8uL2xpYi9qc2JuL3JzYS50cyIsIndlYnBhY2s6Ly8vLi9saWIvanNibi9ybmcudHMiLCJ3ZWJwYWNrOi8vLy4vbGliL2pzYm4vcHJuZzQudHMiLCJ3ZWJwYWNrOi8vLy4vbGliL2pzcnNhc2lnbi9hc24xLTEuMC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvanNyc2FzaWduL3lhaG9vLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkVBO0FBQUEsNkJBQTZCO0FBQzdCLHVCQUF1QjtBQUN2Qiw2QkFBNkI7QUFFN0Isa0VBQWtFO0FBRVk7QUFFOUUsaUJBQWlCO0FBQ2pCLElBQUksS0FBSyxDQUFDO0FBRVYsNkJBQTZCO0FBQzdCLElBQU0sTUFBTSxHQUFHLGNBQWMsQ0FBQztBQUM5QixJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDO0FBRy9DLFNBQVM7QUFDVCxJQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDOXpCLElBQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzFELFlBQVk7QUFFWix1QkFBdUI7QUFDdkI7SUFDSSxvQkFBWSxDQUF3QixFQUFFLENBQXNCLEVBQUUsQ0FBc0I7UUFDaEYsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDWixFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDN0IsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLFFBQVEsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzVCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFXLENBQUMsQ0FBQztZQUNwQyxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFSCxnQkFBZ0I7SUFFZCw4Q0FBOEM7SUFDOUMsdURBQXVEO0lBQ2hELDZCQUFRLEdBQWYsVUFBZ0IsQ0FBUTtRQUNwQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDYixNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUNELElBQUksQ0FBQyxDQUFDO1FBQ04sRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDVixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNqQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsQ0FBQztRQUNELElBQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsQ0FBQztRQUNOLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNkLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNYLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxD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QyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLENBQUM7Z0JBQ0QsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDckIsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDTCxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsQ0FBQztnQkFDRCxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsQixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFBQyxDQUFDO2dCQUMxQixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsQixDQUFDO1FBQ0wsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFDM0IsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztR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RUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsRUFBRSxDQUFDLENBQUUsQ0FBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNqQyxFQUFFLEdBQUcsSUFBSSxDQUFDO2dCQUNkLENBQUM7Z0JBQ0QsUUFBUSxDQUFDO1lBQ2IsQ0FBQztZQUNELEVBQUUsR0FBRyxLQUFLLENBQUM7WUFDWCxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDVixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDNUQsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hDLENBQUM7WUFDRCxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ1IsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixFQUFFLElBQUksSUFBSSxDQUFD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QUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDdkIsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDekIsSUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUVqQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDbkMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDN0IsQ0FBQztRQUNELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQy9CLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDYixDQUFDO1FBQ0QsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNWLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUMsQ0FBQyxL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QUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNkLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDYixDQUFDO1FBQ0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUMzQixJQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM5RSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNuQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7UUFDTCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1YsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FB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LENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQzFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUNELENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFHRCw2REFBNkQ7SUFDN0QsMERBQTBEO0lBQzFELGtEQUFrRDtJQUMzQyxvQ0FBZSxHQUF0QixVQUF1QixDQUFZLEVBQUUsQ0FBUSxFQUFFLENBQVk7UUFDdkQsRUFBRSxDQUFDLENBQUM7UUFDSixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxzQkFBc0I7UUFDL0IsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNkLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDYixDQUFDO1FBQ0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUM3QyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBQ0QsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ1YsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUdELDJDQUEyQztJQUMzQyxpQ0FBaUM7SUFDdkIsMkJBQU0sR0FBaEIsVUFBaUIsQ0FBUTtRQUNyQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNULE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO1FBQ0QsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDcEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztvQkFDbkMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzlCLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDYixDQUFDO0lBR0QscURBQXFEO0lBQ3JELDhEQUE4RDtJQUNwRCxnQ0FBVyxHQUFyQixVQUFzQixDQUFRO1FBQzFCLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pDLElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNULE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUNELElBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDdkIsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDekIsQ0FBQztRQUNELElBQU0sQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDekIsaURBQWlEO1lBQ2pELENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNWLE9BQU8sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7b0JBQ3JDLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDekIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkMsTUFBTSxDQUFDLEtBQUssQ0FBQztvQkFDakIsQ0FBQztnQkFDTCxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDakIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsMENBQTBDO0lBQzFDLGtCQUFrQjtJQUNSLDJCQUFNLEdBQWhCO1FBQ0ksSUFBTSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQixNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVELGVBQWU7SUFFZixvQkFBb0I7SUFDYix5QkFBSSxHQUFYLFVBQVksQ0FBWSxFQUFFLFFBQStCO1FBQ3JELElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDcEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMzQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckIsSUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1osQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNOLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixDQUFDO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUM1QixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNSLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNaLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxDQUFDO1FBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckIsQ0FBQztRQUNELDhFQUE4RTtRQUM5RSxJQUFNLEtBQUssR0FBRztZQUNWLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFBQyxDQUFDO1lBQ3hELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFBQyxDQUFDO1lBQ3hELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDckIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNkLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQUMsQ0FBQztnQkFDaEMsVUFBVSxDQUFDLGNBQWEsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztZQUN6RCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN6QixDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBQ0YsVUFBVSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsb0NBQW9DO0lBQzdCLG9DQUFlLEdBQXRCLFVBQXVCLENBQVEsRUFBRSxDQUFxQixFQUFFLENBQXFCLEVBQUUsUUFBbUI7UUFDOUYsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDUixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDdEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLG9EQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2pFLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLENBQUM7Z0JBQ0QsSUFBTSxLQUFHLEdBQUcsSUFBSSxDQUFDO2dCQUNqQixJQUFNLFFBQU0sR0FBRztvQkFDWCxLQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDckIsRUFBRSxDQUFDLENBQUMsS0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQUMsS0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBRyxDQUFDLENBQUM7b0JBQUMsQ0FBQztvQkFDN0UsRUFBRSxDQUFDLENBQUMsS0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3pCLFVBQVUsQ0FBQyxjQUFhLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztvQkFDeEQsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixVQUFVLENBQUMsUUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUMxQixDQUFDO2dCQUNMLENBQUMsQ0FBQztnQkFDRixVQUFVLENBQUMsUUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzFCLENBQUM7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFNLENBQUMsR0FBWSxFQUFFLENBQUM7WUFDdEIsSUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoQixDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4QixDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2YsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFBQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUM7WUFDekQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDNUIsQ0FBQztJQUNMLENBQUM7SUE0QkwsaUJBQUM7QUFBRCxDQUFDOztBQUVELGtCQUFrQjtBQUVsQixpQkFBaUI7QUFFakI7SUFDSTtJQUVBLENBQUM7SUFFRCxvQ0FBb0M7SUFDN0IseUJBQU8sR0FBZCxVQUFlLENBQVk7UUFDdkIsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNiLENBQUM7SUFHRCxtQ0FBbUM7SUFDNUIsd0JBQU0sR0FBYixVQUFjLENBQVk7UUFDdEIsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNiLENBQUM7SUFHRCxvQ0FBb0M7SUFDN0IsdUJBQUssR0FBWixVQUFhLENBQVksRUFBRSxDQUFZLEVBQUUsQ0FBWTtRQUNqRCxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBR0Qsb0NBQW9DO0lBQzdCLHVCQUFLLEdBQVosVUFBYSxDQUFZLEVBQUUsQ0FBWTtRQUNuQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFDTCxjQUFDO0FBQUQsQ0FBQztBQWtCRCw4Q0FBOEM7QUFDOUM7SUFDSSxpQkFBc0IsQ0FBWTtRQUFaLE1BQUMsR0FBRCxDQUFDLENBQVc7SUFDbEMsQ0FBQztJQUVELHdDQUF3QztJQUNqQyx5QkFBTyxHQUFkLFVBQWUsQ0FBWTtRQUN2QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztJQUNMLENBQUM7SUFHRCxzQ0FBc0M7SUFDL0Isd0JBQU0sR0FBYixVQUFjLENBQVk7UUFDdEIsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNiLENBQUM7SUFHRCxzQ0FBc0M7SUFDL0Isd0JBQU0sR0FBYixVQUFjLENBQVk7UUFDdEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBR0Qsb0NBQW9DO0lBQzdCLHVCQUFLLEdBQVosVUFBYSxDQUFZLEVBQUUsQ0FBWSxFQUFFLENBQVk7UUFDakQsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBR0Qsb0NBQW9DO0lBQzdCLHVCQUFLLEdBQVosVUFBYSxDQUFZLEVBQUUsQ0FBWTtRQUNuQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBQ0wsY0FBQztBQUFELENBQUM7O0FBRUQsWUFBWTtBQUVaLG9CQUFvQjtBQUVwQix1QkFBdUI7QUFDdkI7SUFDSSxvQkFBc0IsQ0FBWTtRQUFaLE1BQUMsR0FBRCxDQUFDLENBQVc7UUFDOUIsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQztRQUM1QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQVFELDhDQUE4QztJQUM5QyxXQUFXO0lBQ0osNEJBQU8sR0FBZCxVQUFlLENBQVk7UUFDdkIsSUFBTSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDaEIsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVELDRDQUE0QztJQUM1QyxZQUFZO0lBQ0wsMkJBQU0sR0FBYixVQUFjLENBQVk7UUFDdEIsSUFBTSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDaEIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZixNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVELDRDQUE0QztJQUM1Qyw0QkFBNEI7SUFDckIsMkJBQU0sR0FBYixVQUFjLENBQVk7UUFDdEIsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNyQixvQ0FBb0M7WUFDcEMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixDQUFDO1FBQ0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ2hDLGdEQUFnRDtZQUNoRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1lBQ3RCLElBQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDaEcseURBQXlEO1lBQ3pELENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QyxrQkFBa0I7WUFDbEIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNsQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDYixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7UUFDRCxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDVixDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7SUFDTCxDQUFDO0lBR0QsMENBQTBDO0lBQzFDLDZCQUE2QjtJQUN0QiwwQkFBSyxHQUFaLFVBQWEsQ0FBWSxFQUFFLENBQVksRUFBRSxDQUFZO1FBQ2pELENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUdELDBDQUEwQztJQUMxQyw0QkFBNEI7SUFDckIsMEJBQUssR0FBWixVQUFhLENBQVksRUFBRSxDQUFZO1FBQ25DLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFFTCxpQkFBQztBQUFELENBQUM7O0FBRUQsdUJBQXVCO0FBR3ZCLGlCQUFpQjtBQUVqQiw0QkFBNEI7QUFDNUI7SUFDSSxpQkFBc0IsQ0FBWTtRQUFaLE1BQUMsR0FBRCxDQUFDLENBQVc7UUFDOUIsZ0JBQWdCO1FBQ2hCLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNoQixVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBTUQsOENBQThDO0lBQ3ZDLHlCQUFPLEdBQWQsVUFBZSxDQUFZO1FBQ3ZCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFNLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNoQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNmLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0lBQ0wsQ0FBQztJQUVELDRDQUE0QztJQUNyQyx3QkFBTSxHQUFiLFVBQWMsQ0FBWTtRQUN0QixNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVELDRDQUE0QztJQUM1QywwQkFBMEI7SUFDbkIsd0JBQU0sR0FBYixVQUFjLENBQVk7UUFDdEIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZCxDQUFDO1FBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN2RCxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQzlCLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFDRCxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEIsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUM5QixDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkIsQ0FBQztJQUNMLENBQUM7SUFHRCwwQ0FBMEM7SUFDMUMsMEJBQTBCO0lBQ25CLHVCQUFLLEdBQVosVUFBYSxDQUFZLEVBQUUsQ0FBWSxFQUFFLENBQVk7UUFDakQsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBR0QsMENBQTBDO0lBQzFDLHdCQUF3QjtJQUNqQix1QkFBSyxHQUFaLFVBQWEsQ0FBWSxFQUFFLENBQVk7UUFDbkMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUNMLGNBQUM7QUFBRCxDQUFDO0FBRUQsWUFBWTtBQUVaLHFCQUFxQjtBQUVyQiwrQkFBK0I7QUFDekIsaUJBQWtCLE1BQU0sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFaEQscUJBQXNCLEdBQVUsRUFBRSxDQUFRO0lBQzVDLE1BQU0sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUVELG9EQUFvRDtBQUNwRCwyQ0FBMkM7QUFDM0MsOENBQThDO0FBQzlDLG9FQUFvRTtBQUVwRSwwREFBMEQ7QUFDMUQsc0NBQXNDO0FBQ3RDLG9EQUFvRDtBQUNwRCxhQUFhLENBQVEsRUFBRSxDQUFRLEVBQUUsQ0FBWSxFQUFFLENBQVEsRUFBRSxDQUFRLEVBQUUsQ0FBUTtJQUN2RSxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2QsSUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDM0IsQ0FBQztJQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDYixDQUFDO0FBQ0QsZ0RBQWdEO0FBQ2hELDJEQUEyRDtBQUMzRCxpREFBaUQ7QUFDakQsYUFBYSxDQUFRLEVBQUUsQ0FBUSxFQUFFLENBQVksRUFBRSxDQUFRLEVBQUUsQ0FBUSxFQUFFLENBQVE7SUFDdkUsSUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUN0QixJQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ25CLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDZCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3pCLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMxQixJQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUM7UUFDNUQsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUM1QixDQUFDO0lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNiLENBQUM7QUFDRCxtREFBbUQ7QUFDbkQsdURBQXVEO0FBQ3ZELGFBQWEsQ0FBUSxFQUFFLENBQVEsRUFBRSxDQUFZLEVBQUUsQ0FBUSxFQUFFLENBQVEsRUFBRSxDQUFRO0lBQ3ZFLElBQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDdEIsSUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNuQixPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2QsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUN6QixJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDMUIsSUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzFCLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQzNCLENBQUM7SUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ2IsQ0FBQztBQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLElBQUksNkJBQTZCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0QsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0lBQzlCLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDZixDQUFDO0FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25ELFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUM5QixLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2YsQ0FBQztBQUFDLElBQUksQ0FBQyxDQUFDO0lBQ0osVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0lBQzlCLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDZixDQUFDO0FBRUQsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDO0FBQ2hDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDN0MsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUM7QUFFdkMsSUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzdDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDeEMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUM7QUFFNUMsb0JBQW9CO0FBQ3BCLElBQU0sS0FBSyxHQUFZLEVBQUUsQ0FBQztBQUMxQixJQUFJLEVBQUUsQ0FBQztBQUNQLElBQUksRUFBRSxDQUFDO0FBQ1AsRUFBRSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDekIsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLENBQUM7QUFDRCxFQUFFLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUMxQixLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDckIsQ0FBQztBQUNELEVBQUUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQzFCLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyQixDQUFDO0FBR0ssZUFBZ0IsQ0FBUSxFQUFFLENBQVE7SUFDcEMsSUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENB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LENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDVixFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEIsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO1lBQ3pCLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUM3QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDekIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDaEMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQzlCLENBQUM7SUFDTCxDQUFDO0lBQ0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1osSUFBTSxHQUFHLEdBQUcsSUFBSSwwREFBWSxFQUFFLENBQUM7SUFDL0IsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDWCxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFD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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsY0FBYztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLFNBQVM7QUFDekMsZ0NBQWdDLFlBQVk7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsV0FBVztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTSw4Q0FBOEMsYUFBYTtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTSw4Q0FBOEMsYUFBYTtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTSw4Q0FBOEMsYUFBYTtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTSw4Q0FBOEMsYUFBYTtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTSw4Q0FBOEMsYUFBYTtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTSw4Q0FBOEMsdUJBQXVCO0FBQ3RGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLHVCQUF1QjtBQUN6RCxrQ0FBa0Msb0RBQW9EO0FBQ3RGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsS0FBSztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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anMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHR2YXIgdGhyZXcgPSB0cnVlO1xuIFx0XHR0cnkge1xuIFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuIFx0XHRcdHRocmV3ID0gZmFsc2U7XG4gXHRcdH0gZmluYWxseSB7XG4gXHRcdFx0aWYodGhyZXcpIGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0fVxuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDMpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDJmMzYxMDhiMGQ3ZTAzMjEwYTFhIiwiLy8gQ29weXJpZ2h0IChjKSAyMDA1ICBUb20gV3Vcbi8vIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4vLyBTZWUgXCJMSUNFTlNFXCIgZm9yIGRldGFpbHMuXG5cbi8vIEJhc2ljIEphdmFTY3JpcHQgQk4gbGlicmFyeSAtIHN1YnNldCB1c2VmdWwgZm9yIFJTQSBlbmNyeXB0aW9uLlxuXG5pbXBvcnQge2NiaXQsIGludDJjaGFyLCBsYml0LCBvcF9hbmQsIG9wX2FuZG5vdCwgb3Bfb3IsIG9wX3hvcn0gZnJvbSBcIi4vdXRpbFwiO1xuaW1wb3J0IHtTZWN1cmVSYW5kb219IGZyb20gXCIuL3JuZ1wiO1xuLy8gQml0cyBwZXIgZGlnaXRcbmxldCBkYml0cztcblxuLy8gSmF2YVNjcmlwdCBlbmdpbmUgYW5hbHlzaXNcbmNvbnN0IGNhbmFyeSA9IDB4ZGVhZGJlZWZjYWZlO1xuY29uc3Qgal9sbSA9ICgoY2FuYXJ5ICYgMHhmZmZmZmYpID09IDB4ZWZjYWZlKTtcblxuXG4vLyNyZWdpb25cbmNvbnN0IGxvd3ByaW1lcyA9IFsyLCAzLCA1LCA3LCAxMSwgMTMsIDE3LCAxOSwgMjMsIDI5LCAzMSwgMzcsIDQxLCA0MywgNDcsIDUzLCA1OSwgNjEsIDY3LCA3MSwgNzMsIDc5LCA4MywgODksIDk3LCAxMDEsIDEwMywgMTA3LCAxMDksIDExMywgMTI3LCAxMzEsIDEzNywgMTM5LCAxNDksIDE1MSwgMTU3LCAxNjMsIDE2NywgMTczLCAxNzksIDE4MSwgMTkxLCAxOTMsIDE5NywgMTk5LCAyMTEsIDIyMywgMjI3LCAyMjksIDIzMywgMjM5LCAyNDEsIDI1MSwgMjU3LCAyNjMsIDI2OSwgMjcxLCAyNzcsIDI4MSwgMjgzLCAyOTMsIDMwNywgMzExLCAzMTMsIDMxNywgMzMxLCAzMzcsIDM0NywgMzQ5LCAzNTMsIDM1OSwgMzY3LCAzNzMsIDM3OSwgMzgzLCAzODksIDM5NywgNDAxLCA0MDksIDQxOSwgNDIxLCA0MzEsIDQzMywgNDM5LCA0NDMsIDQ0OSwgNDU3LCA0NjEsIDQ2MywgNDY3LCA0NzksIDQ4NywgNDkxLCA0OTksIDUwMywgNTA5LCA1MjEsIDUyMywgNTQxLCA1NDcsIDU1NywgNTYzLCA1NjksIDU3MSwgNTc3LCA1ODcsIDU5MywgNTk5LCA2MDEsIDYwNywgNjEzLCA2MTcsIDYxOSwgNjMxLCA2NDEsIDY0MywgNjQ3LCA2NTMsIDY1OSwgNjYxLCA2NzMsIDY3NywgNjgzLCA2OTEsIDcwMSwgNzA5LCA3MTksIDcyNywgNzMzLCA3MzksIDc0MywgNzUxLCA3NTcsIDc2MSwgNzY5LCA3NzMsIDc4NywgNzk3LCA4MDksIDgxMSwgODIxLCA4MjMsIDgyNywgODI5LCA4MzksIDg1MywgODU3LCA4NTksIDg2MywgODc3LCA4ODEsIDg4MywgODg3LCA5MDcsIDkxMSwgOTE5LCA5MjksIDkzNywgOTQxLCA5NDcsIDk1MywgOTY3LCA5NzEsIDk3NywgOTgzLCA5OTEsIDk5N107XG5jb25zdCBscGxpbSA9ICgxIDw8IDI2KSAvIGxvd3ByaW1lc1tsb3dwcmltZXMubGVuZ3RoIC0gMV07XG4vLyNlbmRyZWdpb25cblxuLy8gKHB1YmxpYykgQ29uc3RydWN0b3JcbmV4cG9ydCBjbGFzcyBCaWdJbnRlZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihhOm51bWJlcnxudW1iZXJbXXxzdHJpbmcsIGI/Om51bWJlcnxTZWN1cmVSYW5kb20sIGM/Om51bWJlcnxTZWN1cmVSYW5kb20pIHtcbiAgICAgICAgaWYgKGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKFwibnVtYmVyXCIgPT0gdHlwZW9mIGEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZyb21OdW1iZXIoYSwgYiwgYyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGIgPT0gbnVsbCAmJiBcInN0cmluZ1wiICE9IHR5cGVvZiBhKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mcm9tU3RyaW5nKGEsIDI1Nik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZnJvbVN0cmluZyhhLCBiIGFzIG51bWJlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgLy8jcmVnaW9uIFBVQkxJQ1xuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUudG9TdHJpbmcgPSBiblRvU3RyaW5nO1xuICAgIC8vIChwdWJsaWMpIHJldHVybiBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW4gZ2l2ZW4gcmFkaXhcbiAgICBwdWJsaWMgdG9TdHJpbmcoYjpudW1iZXIpOnN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLnMgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gXCItXCIgKyB0aGlzLm5lZ2F0ZSgpLnRvU3RyaW5nKGIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBrO1xuICAgICAgICBpZiAoYiA9PSAxNikge1xuICAgICAgICAgICAgayA9IDQ7XG4gICAgICAgIH0gZWxzZSBpZiAoYiA9PSA4KSB7XG4gICAgICAgICAgICBrID0gMztcbiAgICAgICAgfSBlbHNlIGlmIChiID09IDIpIHtcbiAgICAgICAgICAgIGsgPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKGIgPT0gMzIpIHtcbiAgICAgICAgICAgIGsgPSA1O1xuICAgICAgICB9IGVsc2UgaWYgKGIgPT0gNCkge1xuICAgICAgICAgICAgayA9IDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b1JhZGl4KGIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGttID0gKDEgPDwgaykgLSAxO1xuICAgICAgICBsZXQgZDtcbiAgICAgICAgbGV0IG0gPSBmYWxzZTtcbiAgICAgICAgbGV0IHIgPSBcIlwiO1xuICAgICAgICBsZXQgaSA9IHRoaXMudDtcbiAgICAgICAgbGV0IHAgPSB0aGlzLkRCIC0gKGkgKiB0aGlzLkRCKSAlIGs7XG4gICAgICAgIGlmIChpLS0gPiAwKSB7XG4gICAgICAgICAgICBpZiAocCA8IHRoaXMuREIgJiYgKGQgPSB0aGlzW2ldID4+IHApID4gMCkge1xuICAgICAgICAgICAgICAgIG0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHIgPSBpbnQyY2hhcihkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdoaWxlIChpID49IDApIHtcbiAgICAgICAgICAgICAgICBpZiAocCA8IGspIHtcbiAgICAgICAgICAgICAgICAgICAgZCA9ICh0aGlzW2ldICYgKCgxIDw8IHApIC0gMSkpIDw8IChrIC0gcCk7XG4gICAgICAgICAgICAgICAgICAgIGQgfD0gdGhpc1stLWldID4+IChwICs9IHRoaXMuREIgLSBrKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkID0gKHRoaXNbaV0gPj4gKHAgLT0gaykpICYga207XG4gICAgICAgICAgICAgICAgICAgIGlmIChwIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHAgKz0gdGhpcy5EQjtcbiAgICAgICAgICAgICAgICAgICAgICAgIC0taTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgICAgICAgICAgIHIgKz0gaW50MmNoYXIoZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtID8gciA6IFwiMFwiO1xuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUubmVnYXRlID0gYm5OZWdhdGU7XG4gICAgLy8gKHB1YmxpYykgLXRoaXNcbiAgICBwcm90ZWN0ZWQgbmVnYXRlKCk6QmlnSW50ZWdlciB7XG4gICAgICAgIGNvbnN0IHIgPSBuYmkoKTtcbiAgICAgICAgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHRoaXMsIHIpO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLmFicyA9IGJuQWJzO1xuICAgIC8vIChwdWJsaWMpIHx0aGlzfFxuICAgIHB1YmxpYyBhYnMoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5zIDwgMCkgPyB0aGlzLm5lZ2F0ZSgpIDogdGhpcztcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLmNvbXBhcmVUbyA9IGJuQ29tcGFyZVRvO1xuICAgIC8vIChwdWJsaWMpIHJldHVybiArIGlmIHRoaXMgPiBhLCAtIGlmIHRoaXMgPCBhLCAwIGlmIGVxdWFsXG4gICAgcHVibGljIGNvbXBhcmVUbyhhOkJpZ0ludGVnZXIpOm51bWJlciB7XG4gICAgICAgIGxldCByID0gdGhpcy5zIC0gYS5zO1xuICAgICAgICBpZiAociAhPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaSA9IHRoaXMudDtcbiAgICAgICAgciA9IGkgLSBhLnQ7XG4gICAgICAgIGlmIChyICE9IDApIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5zIDwgMCkgPyAtciA6IHI7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgICAgICAgICBpZiAoKHIgPSB0aGlzW2ldIC0gYVtpXSkgIT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUuYml0TGVuZ3RoID0gYm5CaXRMZW5ndGg7XG4gICAgLy8gKHB1YmxpYykgcmV0dXJuIHRoZSBudW1iZXIgb2YgYml0cyBpbiBcInRoaXNcIlxuICAgIHB1YmxpYyBiaXRMZW5ndGgoKSB7XG4gICAgICAgIGlmICh0aGlzLnQgPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuREIgKiAodGhpcy50IC0gMSkgKyBuYml0cyh0aGlzW3RoaXMudCAtIDFdIF4gKHRoaXMucyAmIHRoaXMuRE0pKTtcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLm1vZCA9IGJuTW9kO1xuICAgIC8vIChwdWJsaWMpIHRoaXMgbW9kIGFcbiAgICBwdWJsaWMgbW9kKGE6QmlnSW50ZWdlcik6QmlnSW50ZWdlciB7XG4gICAgICAgIGNvbnN0IHIgPSBuYmkoKTtcbiAgICAgICAgdGhpcy5hYnMoKS5kaXZSZW1UbyhhLCBudWxsLCByKTtcbiAgICAgICAgaWYgKHRoaXMucyA8IDAgJiYgci5jb21wYXJlVG8oQmlnSW50ZWdlci5aRVJPKSA+IDApIHtcbiAgICAgICAgICAgIGEuc3ViVG8ociwgcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RQb3dJbnQgPSBibk1vZFBvd0ludDtcbiAgICAvLyAocHVibGljKSB0aGlzXmUgJSBtLCAwIDw9IGUgPCAyXjMyXG4gICAgcHVibGljIG1vZFBvd0ludChlOm51bWJlciwgbTpCaWdJbnRlZ2VyKTpCaWdJbnRlZ2VyIHtcbiAgICAgICAgbGV0IHo7XG4gICAgICAgIGlmIChlIDwgMjU2IHx8IG0uaXNFdmVuKCkpIHtcbiAgICAgICAgICAgIHogPSBuZXcgQ2xhc3NpYyhtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHogPSBuZXcgTW9udGdvbWVyeShtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5leHAoZSwgeik7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5jbG9uZSA9IGJuQ2xvbmU7XG4gICAgLy8gKHB1YmxpYylcbiAgICBwcm90ZWN0ZWQgY2xvbmUoKTpCaWdJbnRlZ2VyIHtcbiAgICAgICAgY29uc3QgciA9IG5iaSgpO1xuICAgICAgICB0aGlzLmNvcHlUbyhyKTtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5pbnRWYWx1ZSA9IGJuSW50VmFsdWU7XG4gICAgLy8gKHB1YmxpYykgcmV0dXJuIHZhbHVlIGFzIGludGVnZXJcbiAgICBwcm90ZWN0ZWQgaW50VmFsdWUoKSB7XG4gICAgICAgIGlmICh0aGlzLnMgPCAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50ID09IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1swXSAtIHRoaXMuRFY7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMudCA9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1swXTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnQgPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYXNzdW1lcyAxNiA8IERCIDwgMzJcbiAgICAgICAgcmV0dXJuICgodGhpc1sxXSAmICgoMSA8PCAoMzIgLSB0aGlzLkRCKSkgLSAxKSkgPDwgdGhpcy5EQikgfCB0aGlzWzBdO1xuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUuYnl0ZVZhbHVlID0gYm5CeXRlVmFsdWU7XG4gICAgLy8gKHB1YmxpYykgcmV0dXJuIHZhbHVlIGFzIGJ5dGVcbiAgICBwcm90ZWN0ZWQgYnl0ZVZhbHVlKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMudCA9PSAwKSA/IHRoaXMucyA6ICh0aGlzWzBdIDw8IDI0KSA+PiAyNDtcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLnNob3J0VmFsdWUgPSBiblNob3J0VmFsdWU7XG4gICAgLy8gKHB1YmxpYykgcmV0dXJuIHZhbHVlIGFzIHNob3J0IChhc3N1bWVzIERCPj0xNilcbiAgICBwcm90ZWN0ZWQgc2hvcnRWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnQgPT0gMCkgPyB0aGlzLnMgOiAodGhpc1swXSA8PCAxNikgPj4gMTY7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5zaWdudW0gPSBiblNpZ051bTtcbiAgICAvLyAocHVibGljKSAwIGlmIHRoaXMgPT0gMCwgMSBpZiB0aGlzID4gMFxuICAgIHByb3RlY3RlZCBzaWdudW0oKSB7XG4gICAgICAgIGlmICh0aGlzLnMgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy50IDw9IDAgfHwgKHRoaXMudCA9PSAxICYmIHRoaXNbMF0gPD0gMCkpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLnRvQnl0ZUFycmF5ID0gYm5Ub0J5dGVBcnJheTtcbiAgICAvLyAocHVibGljKSBjb252ZXJ0IHRvIGJpZ2VuZGlhbiBieXRlIGFycmF5XG4gICAgcHVibGljIHRvQnl0ZUFycmF5KCk6bnVtYmVyW10ge1xuICAgICAgICBsZXQgaSA9IHRoaXMudDtcbiAgICAgICAgY29uc3QgciA9IFtdO1xuICAgICAgICByWzBdID0gdGhpcy5zO1xuICAgICAgICBsZXQgcCA9IHRoaXMuREIgLSAoaSAqIHRoaXMuREIpICUgODtcbiAgICAgICAgbGV0IGQ7XG4gICAgICAgIGxldCBrID0gMDtcbiAgICAgICAgaWYgKGktLSA+IDApIHtcbiAgICAgICAgICAgIGlmIChwIDwgdGhpcy5EQiAmJiAoZCA9IHRoaXNbaV0gPj4gcCkgIT0gKHRoaXMucyAmIHRoaXMuRE0pID4+IHApIHtcbiAgICAgICAgICAgICAgICByW2srK10gPSBkIHwgKHRoaXMucyA8PCAodGhpcy5EQiAtIHApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdoaWxlIChpID49IDApIHtcbiAgICAgICAgICAgICAgICBpZiAocCA8IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgZCA9ICh0aGlzW2ldICYgKCgxIDw8IHApIC0gMSkpIDw8ICg4IC0gcCk7XG4gICAgICAgICAgICAgICAgICAgIGQgfD0gdGhpc1stLWldID4+IChwICs9IHRoaXMuREIgLSA4KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkID0gKHRoaXNbaV0gPj4gKHAgLT0gOCkpICYgMHhmZjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHAgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcCArPSB0aGlzLkRCO1xuICAgICAgICAgICAgICAgICAgICAgICAgLS1pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgoZCAmIDB4ODApICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZCB8PSAtMjU2O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoayA9PSAwICYmICh0aGlzLnMgJiAweDgwKSAhPSAoZCAmIDB4ODApKSB7XG4gICAgICAgICAgICAgICAgICAgICsraztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGsgPiAwIHx8IGQgIT0gdGhpcy5zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJbaysrXSA9IGQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUuZXF1YWxzID0gYm5FcXVhbHM7XG4gICAgcHJvdGVjdGVkIGVxdWFscyhhOkJpZ0ludGVnZXIpOmJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKHRoaXMuY29tcGFyZVRvKGEpID09IDApO1xuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUubWluID0gYm5NaW47XG4gICAgcHJvdGVjdGVkIG1pbihhOkJpZ0ludGVnZXIpOkJpZ0ludGVnZXIge1xuICAgICAgICByZXR1cm4gKHRoaXMuY29tcGFyZVRvKGEpIDwgMCkgPyB0aGlzIDogYTtcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLm1heCA9IGJuTWF4O1xuICAgIHByb3RlY3RlZCBtYXgoYTpCaWdJbnRlZ2VyKTpCaWdJbnRlZ2VyIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmNvbXBhcmVUbyhhKSA+IDApID8gdGhpcyA6IGE7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5hbmQgPSBibkFuZDtcbiAgICBwcm90ZWN0ZWQgYW5kKGE6QmlnSW50ZWdlcik6QmlnSW50ZWdlciB7XG4gICAgICAgIGNvbnN0IHIgPSBuYmkoKTtcbiAgICAgICAgdGhpcy5iaXR3aXNlVG8oYSwgb3BfYW5kLCByKTtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5vciA9IGJuT3I7XG4gICAgcHJvdGVjdGVkIG9yKGE6QmlnSW50ZWdlcik6QmlnSW50ZWdlciB7XG4gICAgICAgIGNvbnN0IHIgPSBuYmkoKTtcbiAgICAgICAgdGhpcy5iaXR3aXNlVG8oYSwgb3Bfb3IsIHIpO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLnhvciA9IGJuWG9yO1xuICAgIHByb3RlY3RlZCB4b3IoYTpCaWdJbnRlZ2VyKTpCaWdJbnRlZ2VyIHtcbiAgICAgICAgY29uc3QgciA9IG5iaSgpO1xuICAgICAgICB0aGlzLmJpdHdpc2VUbyhhLCBvcF94b3IsIHIpO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLmFuZE5vdCA9IGJuQW5kTm90O1xuICAgIHByb3RlY3RlZCBhbmROb3QoYTpCaWdJbnRlZ2VyKTpCaWdJbnRlZ2VyIHtcbiAgICAgICAgY29uc3QgciA9IG5iaSgpO1xuICAgICAgICB0aGlzLmJpdHdpc2VUbyhhLCBvcF9hbmRub3QsIHIpO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLm5vdCA9IGJuTm90O1xuICAgIC8vIChwdWJsaWMpIH50aGlzXG4gICAgcHJvdGVjdGVkIG5vdCgpOkJpZ0ludGVnZXIge1xuICAgICAgICBjb25zdCByID0gbmJpKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50OyArK2kpIHtcbiAgICAgICAgICAgIHJbaV0gPSB0aGlzLkRNICYgfnRoaXNbaV07XG4gICAgICAgIH1cbiAgICAgICAgci50ID0gdGhpcy50O1xuICAgICAgICByLnMgPSB+dGhpcy5zO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLnNoaWZ0TGVmdCA9IGJuU2hpZnRMZWZ0O1xuICAgIC8vIChwdWJsaWMpIHRoaXMgPDwgblxuICAgIHByb3RlY3RlZCBzaGlmdExlZnQobjpudW1iZXIpIHtcbiAgICAgICAgY29uc3QgciA9IG5iaSgpO1xuICAgICAgICBpZiAobiA8IDApIHtcbiAgICAgICAgICAgIHRoaXMuclNoaWZ0VG8oLW4sIHIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sU2hpZnRUbyhuLCByKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLnNoaWZ0UmlnaHQgPSBiblNoaWZ0UmlnaHQ7XG4gICAgLy8gKHB1YmxpYykgdGhpcyA+PiBuXG4gICAgcHJvdGVjdGVkIHNoaWZ0UmlnaHQobjpudW1iZXIpIHtcbiAgICAgICAgY29uc3QgciA9IG5iaSgpO1xuICAgICAgICBpZiAobiA8IDApIHtcbiAgICAgICAgICAgIHRoaXMubFNoaWZ0VG8oLW4sIHIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yU2hpZnRUbyhuLCByKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLmdldExvd2VzdFNldEJpdCA9IGJuR2V0TG93ZXN0U2V0Qml0O1xuICAgIC8vIChwdWJsaWMpIHJldHVybnMgaW5kZXggb2YgbG93ZXN0IDEtYml0IChvciAtMSBpZiBub25lKVxuICAgIHByb3RlY3RlZCBnZXRMb3dlc3RTZXRCaXQoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50OyArK2kpIHtcbiAgICAgICAgICAgIGlmICh0aGlzW2ldICE9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaSAqIHRoaXMuREIgKyBsYml0KHRoaXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnMgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ICogdGhpcy5EQjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5iaXRDb3VudCA9IGJuQml0Q291bnQ7XG4gICAgLy8gKHB1YmxpYykgcmV0dXJuIG51bWJlciBvZiBzZXQgYml0c1xuICAgIHByb3RlY3RlZCBiaXRDb3VudCgpIHtcbiAgICAgICAgbGV0IHIgPSAwO1xuICAgICAgICBjb25zdCB4ID0gdGhpcy5zICYgdGhpcy5ETTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnQ7ICsraSkge1xuICAgICAgICAgICAgciArPSBjYml0KHRoaXNbaV0gXiB4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLnRlc3RCaXQgPSBiblRlc3RCaXQ7XG4gICAgLy8gKHB1YmxpYykgdHJ1ZSBpZmYgbnRoIGJpdCBpcyBzZXRcbiAgICBwcm90ZWN0ZWQgdGVzdEJpdChuOm51bWJlcikge1xuICAgICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihuIC8gdGhpcy5EQik7XG4gICAgICAgIGlmIChqID49IHRoaXMudCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnMgIT0gMCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICgodGhpc1tqXSAmICgxIDw8IChuICUgdGhpcy5EQikpKSAhPSAwKTtcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLnNldEJpdCA9IGJuU2V0Qml0O1xuICAgIC8vIChwdWJsaWMpIHRoaXMgfCAoMTw8bilcbiAgICBwcm90ZWN0ZWQgc2V0Qml0KG46bnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYW5nZUJpdChuLCBvcF9vcik7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5jbGVhckJpdCA9IGJuQ2xlYXJCaXQ7XG4gICAgLy8gKHB1YmxpYykgdGhpcyAmIH4oMTw8bilcbiAgICBwcm90ZWN0ZWQgY2xlYXJCaXQobjpudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlQml0KG4sIG9wX2FuZG5vdCk7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5mbGlwQml0ID0gYm5GbGlwQml0O1xuICAgIC8vIChwdWJsaWMpIHRoaXMgXiAoMTw8bilcbiAgICBwcm90ZWN0ZWQgZmxpcEJpdChuOm51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFuZ2VCaXQobiwgb3BfeG9yKTtcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLmFkZCA9IGJuQWRkO1xuICAgIC8vIChwdWJsaWMpIHRoaXMgKyBhXG4gICAgcHVibGljIGFkZChhOkJpZ0ludGVnZXIpIHtcbiAgICAgICAgY29uc3QgciA9IG5iaSgpO1xuICAgICAgICB0aGlzLmFkZFRvKGEsIHIpO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLnN1YnRyYWN0ID0gYm5TdWJ0cmFjdDtcbiAgICAvLyAocHVibGljKSB0aGlzIC0gYVxuICAgIHB1YmxpYyBzdWJ0cmFjdChhOkJpZ0ludGVnZXIpIHtcbiAgICAgICAgY29uc3QgciA9IG5iaSgpO1xuICAgICAgICB0aGlzLnN1YlRvKGEsIHIpO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5ID0gYm5NdWx0aXBseTtcbiAgICAvLyAocHVibGljKSB0aGlzICogYVxuICAgIHB1YmxpYyBtdWx0aXBseShhOkJpZ0ludGVnZXIpIHtcbiAgICAgICAgY29uc3QgciA9IG5iaSgpO1xuICAgICAgICB0aGlzLm11bHRpcGx5VG8oYSwgcik7XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUuZGl2aWRlID0gYm5EaXZpZGU7XG4gICAgLy8gKHB1YmxpYykgdGhpcyAvIGFcbiAgICBwdWJsaWMgZGl2aWRlKGE6QmlnSW50ZWdlcik6QmlnSW50ZWdlciB7XG4gICAgICAgIGNvbnN0IHIgPSBuYmkoKTtcbiAgICAgICAgdGhpcy5kaXZSZW1UbyhhLCByLCBudWxsKTtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5yZW1haW5kZXIgPSBiblJlbWFpbmRlcjtcbiAgICAvLyAocHVibGljKSB0aGlzICUgYVxuICAgIHByb3RlY3RlZCByZW1haW5kZXIoYTpCaWdJbnRlZ2VyKTpCaWdJbnRlZ2VyIHtcbiAgICAgICAgY29uc3QgciA9IG5iaSgpO1xuICAgICAgICB0aGlzLmRpdlJlbVRvKGEsIG51bGwsIHIpO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLmRpdmlkZUFuZFJlbWFpbmRlciA9IGJuRGl2aWRlQW5kUmVtYWluZGVyO1xuICAgIC8vIChwdWJsaWMpIFt0aGlzL2EsdGhpcyVhXVxuICAgIHByb3RlY3RlZCBkaXZpZGVBbmRSZW1haW5kZXIoYTpCaWdJbnRlZ2VyKSB7XG4gICAgICAgIGNvbnN0IHEgPSBuYmkoKTtcbiAgICAgICAgY29uc3QgciA9IG5iaSgpO1xuICAgICAgICB0aGlzLmRpdlJlbVRvKGEsIHEsIHIpO1xuICAgICAgICByZXR1cm4gW3EsIHJdO1xuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUubW9kUG93ID0gYm5Nb2RQb3c7XG4gICAgLy8gKHB1YmxpYykgdGhpc15lICUgbSAoSEFDIDE0Ljg1KVxuICAgIHB1YmxpYyBtb2RQb3coZTpCaWdJbnRlZ2VyLCBtOkJpZ0ludGVnZXIpIHtcbiAgICAgICAgbGV0IGkgPSBlLmJpdExlbmd0aCgpO1xuICAgICAgICBsZXQgaztcbiAgICAgICAgbGV0IHIgPSBuYnYoMSk7XG4gICAgICAgIGxldCB6OklSZWR1Y3Rpb247XG4gICAgICAgIGlmIChpIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9IGVsc2UgaWYgKGkgPCAxOCkge1xuICAgICAgICAgICAgayA9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8IDQ4KSB7XG4gICAgICAgICAgICBrID0gMztcbiAgICAgICAgfSBlbHNlIGlmIChpIDwgMTQ0KSB7XG4gICAgICAgICAgICBrID0gNDtcbiAgICAgICAgfSBlbHNlIGlmIChpIDwgNzY4KSB7XG4gICAgICAgICAgICBrID0gNTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGsgPSA2O1xuICAgICAgICB9XG4gICAgICAgIGlmIChpIDwgOCkge1xuICAgICAgICAgICAgeiA9IG5ldyBDbGFzc2ljKG0pO1xuICAgICAgICB9IGVsc2UgaWYgKG0uaXNFdmVuKCkpIHtcbiAgICAgICAgICAgIHogPSBuZXcgQmFycmV0dChtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHogPSBuZXcgTW9udGdvbWVyeShtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHByZWNvbXB1dGF0aW9uXG4gICAgICAgIGNvbnN0IGcgPSBbXTtcbiAgICAgICAgbGV0IG4gPSAzO1xuICAgICAgICBjb25zdCBrMSA9IGsgLSAxO1xuICAgICAgICBjb25zdCBrbSA9ICgxIDw8IGspIC0gMTtcbiAgICAgICAgZ1sxXSA9IHouY29udmVydCh0aGlzKTtcbiAgICAgICAgaWYgKGsgPiAxKSB7XG4gICAgICAgICAgICBjb25zdCBnMiA9IG5iaSgpO1xuICAgICAgICAgICAgei5zcXJUbyhnWzFdLCBnMik7XG4gICAgICAgICAgICB3aGlsZSAobiA8PSBrbSkge1xuICAgICAgICAgICAgICAgIGdbbl0gPSBuYmkoKTtcbiAgICAgICAgICAgICAgICB6Lm11bFRvKGcyLCBnW24gLSAyXSwgZ1tuXSk7XG4gICAgICAgICAgICAgICAgbiArPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGogPSBlLnQgLSAxO1xuICAgICAgICBsZXQgdztcbiAgICAgICAgbGV0IGlzMSA9IHRydWU7XG4gICAgICAgIGxldCByMiA9IG5iaSgpO1xuICAgICAgICBsZXQgdDtcbiAgICAgICAgaSA9IG5iaXRzKGVbal0pIC0gMTtcbiAgICAgICAgd2hpbGUgKGogPj0gMCkge1xuICAgICAgICAgICAgaWYgKGkgPj0gazEpIHtcbiAgICAgICAgICAgICAgICB3ID0gKGVbal0gPj4gKGkgLSBrMSkpICYga207XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHcgPSAoZVtqXSAmICgoMSA8PCAoaSArIDEpKSAtIDEpKSA8PCAoazEgLSBpKTtcbiAgICAgICAgICAgICAgICBpZiAoaiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdyB8PSBlW2ogLSAxXSA+PiAodGhpcy5EQiArIGkgLSBrMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuID0gaztcbiAgICAgICAgICAgIHdoaWxlICgodyAmIDEpID09IDApIHtcbiAgICAgICAgICAgICAgICB3ID4+PSAxO1xuICAgICAgICAgICAgICAgIC0tbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgoaSAtPSBuKSA8IDApIHtcbiAgICAgICAgICAgICAgICBpICs9IHRoaXMuREI7XG4gICAgICAgICAgICAgICAgLS1qO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzMSkge1x0Ly8gcmV0ID09IDEsIGRvbid0IGJvdGhlciBzcXVhcmluZyBvciBtdWx0aXBseWluZyBpdFxuICAgICAgICAgICAgICAgIGdbd10uY29weVRvKHIpO1xuICAgICAgICAgICAgICAgIGlzMSA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAobiA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgei5zcXJUbyhyLCByMik7XG4gICAgICAgICAgICAgICAgICAgIHouc3FyVG8ocjIsIHIpO1xuICAgICAgICAgICAgICAgICAgICBuIC09IDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChuID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB6LnNxclRvKHIsIHIyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0ID0gcjtcbiAgICAgICAgICAgICAgICAgICAgciA9IHIyO1xuICAgICAgICAgICAgICAgICAgICByMiA9IHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHoubXVsVG8ocjIsIGdbd10sIHIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aGlsZSAoaiA+PSAwICYmIChlW2pdICYgKDEgPDwgaSkpID09IDApIHtcbiAgICAgICAgICAgICAgICB6LnNxclRvKHIsIHIyKTtcbiAgICAgICAgICAgICAgICB0ID0gcjtcbiAgICAgICAgICAgICAgICByID0gcjI7XG4gICAgICAgICAgICAgICAgcjIgPSB0O1xuICAgICAgICAgICAgICAgIGlmICgtLWkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGkgPSB0aGlzLkRCIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgLS1qO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gei5yZXZlcnQocik7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RJbnZlcnNlID0gYm5Nb2RJbnZlcnNlO1xuICAgIC8vIChwdWJsaWMpIDEvdGhpcyAlIG0gKEhBQyAxNC42MSlcbiAgICBwdWJsaWMgbW9kSW52ZXJzZShtOkJpZ0ludGVnZXIpIHtcbiAgICAgICAgY29uc3QgYWMgPSBtLmlzRXZlbigpO1xuICAgICAgICBpZiAoKHRoaXMuaXNFdmVuKCkgJiYgYWMpIHx8IG0uc2lnbnVtKCkgPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIEJpZ0ludGVnZXIuWkVSTztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB1ID0gbS5jbG9uZSgpO1xuICAgICAgICBjb25zdCB2ID0gdGhpcy5jbG9uZSgpO1xuICAgICAgICBjb25zdCBhID0gbmJ2KDEpO1xuICAgICAgICBjb25zdCBiID0gbmJ2KDApO1xuICAgICAgICBjb25zdCBjID0gbmJ2KDApO1xuICAgICAgICBjb25zdCBkID0gbmJ2KDEpO1xuICAgICAgICB3aGlsZSAodS5zaWdudW0oKSAhPSAwKSB7XG4gICAgICAgICAgICB3aGlsZSAodS5pc0V2ZW4oKSkge1xuICAgICAgICAgICAgICAgIHUuclNoaWZ0VG8oMSwgdSk7XG4gICAgICAgICAgICAgICAgaWYgKGFjKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYS5pc0V2ZW4oKSB8fCAhYi5pc0V2ZW4oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYS5hZGRUbyh0aGlzLCBhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGIuc3ViVG8obSwgYik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYS5yU2hpZnRUbygxLCBhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFiLmlzRXZlbigpKSB7XG4gICAgICAgICAgICAgICAgICAgIGIuc3ViVG8obSwgYik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGIuclNoaWZ0VG8oMSwgYik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aGlsZSAodi5pc0V2ZW4oKSkge1xuICAgICAgICAgICAgICAgIHYuclNoaWZ0VG8oMSwgdik7XG4gICAgICAgICAgICAgICAgaWYgKGFjKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYy5pc0V2ZW4oKSB8fCAhZC5pc0V2ZW4oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYy5hZGRUbyh0aGlzLCBjKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQuc3ViVG8obSwgZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYy5yU2hpZnRUbygxLCBjKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFkLmlzRXZlbigpKSB7XG4gICAgICAgICAgICAgICAgICAgIGQuc3ViVG8obSwgZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGQuclNoaWZ0VG8oMSwgZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodS5jb21wYXJlVG8odikgPj0gMCkge1xuICAgICAgICAgICAgICAgIHUuc3ViVG8odiwgdSk7XG4gICAgICAgICAgICAgICAgaWYgKGFjKSB7XG4gICAgICAgICAgICAgICAgICAgIGEuc3ViVG8oYywgYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGIuc3ViVG8oZCwgYik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHYuc3ViVG8odSwgdik7XG4gICAgICAgICAgICAgICAgaWYgKGFjKSB7IGMuc3ViVG8oYSwgYyk7IH1cbiAgICAgICAgICAgICAgICBkLnN1YlRvKGIsIGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh2LmNvbXBhcmVUbyhCaWdJbnRlZ2VyLk9ORSkgIT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIEJpZ0ludGVnZXIuWkVSTztcbiAgICAgICAgfVxuICAgICAgICBpZiAoZC5jb21wYXJlVG8obSkgPj0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGQuc3VidHJhY3QobSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGQuc2lnbnVtKCkgPCAwKSB7XG4gICAgICAgICAgICBkLmFkZFRvKG0sIGQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGQuc2lnbnVtKCkgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZC5hZGQobSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZDtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUucG93ID0gYm5Qb3c7XG4gICAgLy8gKHB1YmxpYykgdGhpc15lXG4gICAgcHJvdGVjdGVkIHBvdyhlOm51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5leHAoZSwgbmV3IE51bGxFeHAoKSk7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5nY2QgPSBibkdDRDtcbiAgICAvLyAocHVibGljKSBnY2QodGhpcyxhKSAoSEFDIDE0LjU0KVxuICAgIHB1YmxpYyBnY2QoYTpCaWdJbnRlZ2VyKSB7XG4gICAgICAgIGxldCB4ID0gKHRoaXMucyA8IDApID8gdGhpcy5uZWdhdGUoKSA6IHRoaXMuY2xvbmUoKTtcbiAgICAgICAgbGV0IHkgPSAoYS5zIDwgMCkgPyBhLm5lZ2F0ZSgpIDogYS5jbG9uZSgpO1xuICAgICAgICBpZiAoeC5jb21wYXJlVG8oeSkgPCAwKSB7XG4gICAgICAgICAgICBjb25zdCB0ID0geDtcbiAgICAgICAgICAgIHggPSB5O1xuICAgICAgICAgICAgeSA9IHQ7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGkgPSB4LmdldExvd2VzdFNldEJpdCgpO1xuICAgICAgICBsZXQgZyA9IHkuZ2V0TG93ZXN0U2V0Qml0KCk7XG4gICAgICAgIGlmIChnIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIHg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgPCBnKSB7XG4gICAgICAgICAgICBnID0gaTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZyA+IDApIHtcbiAgICAgICAgICAgIHguclNoaWZ0VG8oZywgeCk7XG4gICAgICAgICAgICB5LnJTaGlmdFRvKGcsIHkpO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlICh4LnNpZ251bSgpID4gMCkge1xuICAgICAgICAgICAgaWYgKChpID0geC5nZXRMb3dlc3RTZXRCaXQoKSkgPiAwKSB7XG4gICAgICAgICAgICAgICAgeC5yU2hpZnRUbyhpLCB4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgoaSA9IHkuZ2V0TG93ZXN0U2V0Qml0KCkpID4gMCkge1xuICAgICAgICAgICAgICAgIHkuclNoaWZ0VG8oaSwgeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoeC5jb21wYXJlVG8oeSkgPj0gMCkge1xuICAgICAgICAgICAgICAgIHguc3ViVG8oeSwgeCk7XG4gICAgICAgICAgICAgICAgeC5yU2hpZnRUbygxLCB4KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgeS5zdWJUbyh4LCB5KTtcbiAgICAgICAgICAgICAgICB5LnJTaGlmdFRvKDEsIHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChnID4gMCkge1xuICAgICAgICAgICAgeS5sU2hpZnRUbyhnLCB5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geTtcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLmlzUHJvYmFibGVQcmltZSA9IGJuSXNQcm9iYWJsZVByaW1lO1xuICAgIC8vIChwdWJsaWMpIHRlc3QgcHJpbWFsaXR5IHdpdGggY2VydGFpbnR5ID49IDEtLjVedFxuICAgIHB1YmxpYyBpc1Byb2JhYmxlUHJpbWUodDpudW1iZXIpIHtcbiAgICAgICAgbGV0IGk7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLmFicygpO1xuICAgICAgICBpZiAoeC50ID09IDEgJiYgeFswXSA8PSBsb3dwcmltZXNbbG93cHJpbWVzLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbG93cHJpbWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHhbMF0gPT0gbG93cHJpbWVzW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoeC5pc0V2ZW4oKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGkgPSAxO1xuICAgICAgICB3aGlsZSAoaSA8IGxvd3ByaW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCBtID0gbG93cHJpbWVzW2ldO1xuICAgICAgICAgICAgbGV0IGogPSBpICsgMTtcbiAgICAgICAgICAgIHdoaWxlIChqIDwgbG93cHJpbWVzLmxlbmd0aCAmJiBtIDwgbHBsaW0pIHtcbiAgICAgICAgICAgICAgICBtICo9IGxvd3ByaW1lc1tqKytdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbSA9IHgubW9kSW50KG0pO1xuICAgICAgICAgICAgd2hpbGUgKGkgPCBqKSB7XG4gICAgICAgICAgICAgICAgaWYgKG0gJSBsb3dwcmltZXNbaSsrXSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHgubWlsbGVyUmFiaW4odCk7XG4gICAgfVxuXG5cbiAgLy8jZW5kcmVnaW9uIFBVQkxJQ1xuXG4gIC8vI3JlZ2lvbiBQUk9URUNURURcblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLmNvcHlUbyA9IGJucENvcHlUbztcbiAgICAvLyAocHJvdGVjdGVkKSBjb3B5IHRoaXMgdG8gclxuICAgIHB1YmxpYyBjb3B5VG8ocjpCaWdJbnRlZ2VyKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLnQgLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICAgICAgcltpXSA9IHRoaXNbaV07XG4gICAgICAgIH1cbiAgICAgICAgci50ID0gdGhpcy50O1xuICAgICAgICByLnMgPSB0aGlzLnM7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5mcm9tSW50ID0gYm5wRnJvbUludDtcbiAgICAvLyAocHJvdGVjdGVkKSBzZXQgZnJvbSBpbnRlZ2VyIHZhbHVlIHgsIC1EViA8PSB4IDwgRFZcbiAgICBwdWJsaWMgZnJvbUludCh4Om51bWJlcikge1xuICAgICAgICB0aGlzLnQgPSAxO1xuICAgICAgICB0aGlzLnMgPSAoeCA8IDApID8gLTEgOiAwO1xuICAgICAgICBpZiAoeCA+IDApIHtcbiAgICAgICAgICAgIHRoaXNbMF0gPSB4O1xuICAgICAgICB9IGVsc2UgaWYgKHggPCAtMSkge1xuICAgICAgICAgICAgdGhpc1swXSA9IHggKyB0aGlzLkRWO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50ID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUuZnJvbVN0cmluZyA9IGJucEZyb21TdHJpbmc7XG4gICAgLy8gKHByb3RlY3RlZCkgc2V0IGZyb20gc3RyaW5nIGFuZCByYWRpeFxuICAgIHByb3RlY3RlZCBmcm9tU3RyaW5nKHM6c3RyaW5nfG51bWJlcltdLCBiOm51bWJlcikge1xuICAgICAgICBsZXQgaztcbiAgICAgICAgaWYgKGIgPT0gMTYpIHtcbiAgICAgICAgICAgIGsgPSA0O1xuICAgICAgICB9IGVsc2UgaWYgKGIgPT0gOCkge1xuICAgICAgICAgICAgayA9IDM7XG4gICAgICAgIH0gZWxzZSBpZiAoYiA9PSAyNTYpIHtcbiAgICAgICAgICAgIGsgPSA4O1xuICAgICAgICAgICAgLyogYnl0ZSBhcnJheSAqL1xuICAgICAgICB9IGVsc2UgaWYgKGIgPT0gMikge1xuICAgICAgICAgICAgayA9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAoYiA9PSAzMikge1xuICAgICAgICAgICAgayA9IDU7XG4gICAgICAgIH0gZWxzZSBpZiAoYiA9PSA0KSB7XG4gICAgICAgICAgICBrID0gMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZnJvbVJhZGl4KHMgYXMgc3RyaW5nLCBiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnQgPSAwO1xuICAgICAgICB0aGlzLnMgPSAwO1xuICAgICAgICBsZXQgaSA9IHMubGVuZ3RoO1xuICAgICAgICBsZXQgbWkgPSBmYWxzZTtcbiAgICAgICAgbGV0IHNoID0gMDtcbiAgICAgICAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gKGsgPT0gOCkgPyAoK3NbaV0pICYgMHhmZiA6IGludEF0KHMgYXMgc3RyaW5nLCBpKTtcbiAgICAgICAgICAgIGlmICh4IDwgMCkge1xuICAgICAgICAgICAgICAgIGlmICgocyBhcyBzdHJpbmcpLmNoYXJBdChpKSA9PSBcIi1cIikge1xuICAgICAgICAgICAgICAgICAgICBtaSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWkgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChzaCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpc1t0aGlzLnQrK10gPSB4O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzaCArIGsgPiB0aGlzLkRCKSB7XG4gICAgICAgICAgICAgICAgdGhpc1t0aGlzLnQgLSAxXSB8PSAoeCAmICgoMSA8PCAodGhpcy5EQiAtIHNoKSkgLSAxKSkgPDwgc2g7XG4gICAgICAgICAgICAgICAgdGhpc1t0aGlzLnQrK10gPSAoeCA+PiAodGhpcy5EQiAtIHNoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXNbdGhpcy50IC0gMV0gfD0geCA8PCBzaDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNoICs9IGs7XG4gICAgICAgICAgICBpZiAoc2ggPj0gdGhpcy5EQikge1xuICAgICAgICAgICAgICAgIHNoIC09IHRoaXMuREI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGsgPT0gOCAmJiAoKCtzWzBdKSAmIDB4ODApICE9IDApIHtcbiAgICAgICAgICAgIHRoaXMucyA9IC0xO1xuICAgICAgICAgICAgaWYgKHNoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXNbdGhpcy50IC0gMV0gfD0gKCgxIDw8ICh0aGlzLkRCIC0gc2gpKSAtIDEpIDw8IHNoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xhbXAoKTtcbiAgICAgICAgaWYgKG1pKSB7XG4gICAgICAgICAgICBCaWdJbnRlZ2VyLlpFUk8uc3ViVG8odGhpcywgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLmNsYW1wID0gYm5wQ2xhbXA7XG4gICAgLy8gKHByb3RlY3RlZCkgY2xhbXAgb2ZmIGV4Y2VzcyBoaWdoIHdvcmRzXG4gICAgcHVibGljIGNsYW1wKCkge1xuICAgICAgICBjb25zdCBjID0gdGhpcy5zICYgdGhpcy5ETTtcbiAgICAgICAgd2hpbGUgKHRoaXMudCA+IDAgJiYgdGhpc1t0aGlzLnQgLSAxXSA9PSBjKSB7XG4gICAgICAgICAgICAtLXRoaXMudDtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUuZGxTaGlmdFRvID0gYm5wRExTaGlmdFRvO1xuICAgIC8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzIDw8IG4qREJcbiAgICBwdWJsaWMgZGxTaGlmdFRvKG46bnVtYmVyLCByOkJpZ0ludGVnZXIpIHtcbiAgICAgICAgbGV0IGk7XG4gICAgICAgIGZvciAoaSA9IHRoaXMudCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICByW2kgKyBuXSA9IHRoaXNbaV07XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gbiAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICByW2ldID0gMDtcbiAgICAgICAgfVxuICAgICAgICByLnQgPSB0aGlzLnQgKyBuO1xuICAgICAgICByLnMgPSB0aGlzLnM7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5kclNoaWZ0VG8gPSBibnBEUlNoaWZ0VG87XG4gICAgLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgPj4gbipEQlxuICAgIHB1YmxpYyBkclNoaWZ0VG8objpudW1iZXIsIHI6QmlnSW50ZWdlcikge1xuICAgICAgICBmb3IgKGxldCBpID0gbjsgaSA8IHRoaXMudDsgKytpKSB7XG4gICAgICAgICAgICByW2kgLSBuXSA9IHRoaXNbaV07XG4gICAgICAgIH1cbiAgICAgICAgci50ID0gTWF0aC5tYXgodGhpcy50IC0gbiwgMCk7XG4gICAgICAgIHIucyA9IHRoaXMucztcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLmxTaGlmdFRvID0gYm5wTFNoaWZ0VG87XG4gICAgLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgPDwgblxuICAgIHByb3RlY3RlZCBsU2hpZnRUbyhuOm51bWJlciwgcjpCaWdJbnRlZ2VyKSB7XG4gICAgICAgIGNvbnN0IGJzID0gbiAlIHRoaXMuREI7XG4gICAgICAgIGNvbnN0IGNicyA9IHRoaXMuREIgLSBicztcbiAgICAgICAgY29uc3QgYm0gPSAoMSA8PCBjYnMpIC0gMTtcbiAgICAgICAgY29uc3QgZHMgPSBNYXRoLmZsb29yKG4gLyB0aGlzLkRCKTtcbiAgICAgICAgbGV0IGMgPSAodGhpcy5zIDw8IGJzKSAmIHRoaXMuRE07XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMudCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICByW2kgKyBkcyArIDFdID0gKHRoaXNbaV0gPj4gY2JzKSB8IGM7XG4gICAgICAgICAgICBjID0gKHRoaXNbaV0gJiBibSkgPDwgYnM7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IGRzIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICAgIHJbaV0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJbZHNdID0gYztcbiAgICAgICAgci50ID0gdGhpcy50ICsgZHMgKyAxO1xuICAgICAgICByLnMgPSB0aGlzLnM7XG4gICAgICAgIHIuY2xhbXAoKTtcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLnJTaGlmdFRvID0gYm5wUlNoaWZ0VG87XG4gICAgLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgPj4gblxuICAgIHByb3RlY3RlZCByU2hpZnRUbyhuOm51bWJlciwgcjpCaWdJbnRlZ2VyKSB7XG4gICAgICAgIHIucyA9IHRoaXMucztcbiAgICAgICAgY29uc3QgZHMgPSBNYXRoLmZsb29yKG4gLyB0aGlzLkRCKTtcbiAgICAgICAgaWYgKGRzID49IHRoaXMudCkge1xuICAgICAgICAgICAgci50ID0gMDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBicyA9IG4gJSB0aGlzLkRCO1xuICAgICAgICBjb25zdCBjYnMgPSB0aGlzLkRCIC0gYnM7XG4gICAgICAgIGNvbnN0IGJtID0gKDEgPDwgYnMpIC0gMTtcbiAgICAgICAgclswXSA9IHRoaXNbZHNdID4+IGJzO1xuICAgICAgICBmb3IgKGxldCBpID0gZHMgKyAxOyBpIDwgdGhpcy50OyArK2kpIHtcbiAgICAgICAgICAgIHJbaSAtIGRzIC0gMV0gfD0gKHRoaXNbaV0gJiBibSkgPDwgY2JzO1xuICAgICAgICAgICAgcltpIC0gZHNdID0gdGhpc1tpXSA+PiBicztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYnMgPiAwKSB7XG4gICAgICAgICAgICByW3RoaXMudCAtIGRzIC0gMV0gfD0gKHRoaXMucyAmIGJtKSA8PCBjYnM7XG4gICAgICAgIH1cbiAgICAgICAgci50ID0gdGhpcy50IC0gZHM7XG4gICAgICAgIHIuY2xhbXAoKTtcbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLnN1YlRvID0gYm5wU3ViVG87XG4gICAgLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgLSBhXG4gICAgcHVibGljIHN1YlRvKGE6QmlnSW50ZWdlciwgcjpCaWdJbnRlZ2VyKSB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgbGV0IGMgPSAwO1xuICAgICAgICBjb25zdCBtID0gTWF0aC5taW4oYS50LCB0aGlzLnQpO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICAgIGMgKz0gdGhpc1tpXSAtIGFbaV07XG4gICAgICAgICAgICByW2krK10gPSBjICYgdGhpcy5ETTtcbiAgICAgICAgICAgIGMgPj49IHRoaXMuREI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGEudCA8IHRoaXMudCkge1xuICAgICAgICAgICAgYyAtPSBhLnM7XG4gICAgICAgICAgICB3aGlsZSAoaSA8IHRoaXMudCkge1xuICAgICAgICAgICAgICAgIGMgKz0gdGhpc1tpXTtcbiAgICAgICAgICAgICAgICByW2krK10gPSBjICYgdGhpcy5ETTtcbiAgICAgICAgICAgICAgICBjID4+PSB0aGlzLkRCO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYyArPSB0aGlzLnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjICs9IHRoaXMucztcbiAgICAgICAgICAgIHdoaWxlIChpIDwgYS50KSB7XG4gICAgICAgICAgICAgICAgYyAtPSBhW2ldO1xuICAgICAgICAgICAgICAgIHJbaSsrXSA9IGMgJiB0aGlzLkRNO1xuICAgICAgICAgICAgICAgIGMgPj49IHRoaXMuREI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjIC09IGEucztcbiAgICAgICAgfVxuICAgICAgICByLnMgPSAoYyA8IDApID8gLTEgOiAwO1xuICAgICAgICBpZiAoYyA8IC0xKSB7XG4gICAgICAgICAgICByW2krK10gPSB0aGlzLkRWICsgYztcbiAgICAgICAgfSBlbHNlIGlmIChjID4gMCkge1xuICAgICAgICAgICAgcltpKytdID0gYztcbiAgICAgICAgfVxuICAgICAgICByLnQgPSBpO1xuICAgICAgICByLmNsYW1wKCk7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5tdWx0aXBseVRvID0gYm5wTXVsdGlwbHlUbztcbiAgICAvLyAocHJvdGVjdGVkKSByID0gdGhpcyAqIGEsIHIgIT0gdGhpcyxhIChIQUMgMTQuMTIpXG4gICAgLy8gXCJ0aGlzXCIgc2hvdWxkIGJlIHRoZSBsYXJnZXIgb25lIGlmIGFwcHJvcHJpYXRlLlxuICAgIHB1YmxpYyBtdWx0aXBseVRvKGE6QmlnSW50ZWdlciwgcjpCaWdJbnRlZ2VyKSB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLmFicygpO1xuICAgICAgICBjb25zdCB5ID0gYS5hYnMoKTtcbiAgICAgICAgbGV0IGkgPSB4LnQ7XG4gICAgICAgIHIudCA9IGkgKyB5LnQ7XG4gICAgICAgIHdoaWxlICgtLWkgPj0gMCkge1xuICAgICAgICAgICAgcltpXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHkudDsgKytpKSB7XG4gICAgICAgICAgICByW2kgKyB4LnRdID0geC5hbSgwLCB5W2ldLCByLCBpLCAwLCB4LnQpO1xuICAgICAgICB9XG4gICAgICAgIHIucyA9IDA7XG4gICAgICAgIHIuY2xhbXAoKTtcbiAgICAgICAgaWYgKHRoaXMucyAhPSBhLnMpIHtcbiAgICAgICAgICAgIEJpZ0ludGVnZXIuWkVSTy5zdWJUbyhyLCByKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUuc3F1YXJlVG8gPSBibnBTcXVhcmVUbztcbiAgICAvLyAocHJvdGVjdGVkKSByID0gdGhpc14yLCByICE9IHRoaXMgKEhBQyAxNC4xNilcbiAgICBwdWJsaWMgc3F1YXJlVG8ocjpCaWdJbnRlZ2VyKSB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLmFicygpO1xuICAgICAgICBsZXQgaSA9IHIudCA9IDIgKiB4LnQ7XG4gICAgICAgIHdoaWxlICgtLWkgPj0gMCkge1xuICAgICAgICAgICAgcltpXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHgudCAtIDE7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgYyA9IHguYW0oaSwgeFtpXSwgciwgMiAqIGksIDAsIDEpO1xuICAgICAgICAgICAgaWYgKChyW2kgKyB4LnRdICs9IHguYW0oaSArIDEsIDIgKiB4W2ldLCByLCAyICogaSArIDEsIGMsIHgudCAtIGkgLSAxKSkgPj0geC5EVikge1xuICAgICAgICAgICAgICAgIHJbaSArIHgudF0gLT0geC5EVjtcbiAgICAgICAgICAgICAgICByW2kgKyB4LnQgKyAxXSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHIudCA+IDApIHtcbiAgICAgICAgICAgIHJbci50IC0gMV0gKz0geC5hbShpLCB4W2ldLCByLCAyICogaSwgMCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgci5zID0gMDtcbiAgICAgICAgci5jbGFtcCgpO1xuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUuZGl2UmVtVG8gPSBibnBEaXZSZW1UbztcbiAgICAvLyAocHJvdGVjdGVkKSBkaXZpZGUgdGhpcyBieSBtLCBxdW90aWVudCBhbmQgcmVtYWluZGVyIHRvIHEsIHIgKEhBQyAxNC4yMClcbiAgICAvLyByICE9IHEsIHRoaXMgIT0gbS4gIHEgb3IgciBtYXkgYmUgbnVsbC5cbiAgICBwdWJsaWMgZGl2UmVtVG8obTpCaWdJbnRlZ2VyLCBxOkJpZ0ludGVnZXIsIHI6QmlnSW50ZWdlcikge1xuICAgICAgICBjb25zdCBwbSA9IG0uYWJzKCk7XG4gICAgICAgIGlmIChwbS50IDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwdCA9IHRoaXMuYWJzKCk7XG4gICAgICAgIGlmIChwdC50IDwgcG0udCkge1xuICAgICAgICAgICAgaWYgKHEgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHEuZnJvbUludCgwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcHlUbyhyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAociA9PSBudWxsKSB7XG4gICAgICAgICAgICByID0gbmJpKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeSA9IG5iaSgpO1xuICAgICAgICBjb25zdCB0cyA9IHRoaXMucztcbiAgICAgICAgY29uc3QgbXMgPSBtLnM7XG4gICAgICAgIGNvbnN0IG5zaCA9IHRoaXMuREIgLSBuYml0cyhwbVtwbS50IC0gMV0pO1x0Ly8gbm9ybWFsaXplIG1vZHVsdXNcbiAgICAgICAgaWYgKG5zaCA+IDApIHtcbiAgICAgICAgICAgIHBtLmxTaGlmdFRvKG5zaCwgeSk7XG4gICAgICAgICAgICBwdC5sU2hpZnRUbyhuc2gsIHIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG0uY29weVRvKHkpO1xuICAgICAgICAgICAgcHQuY29weVRvKHIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHlzID0geS50O1xuICAgICAgICBjb25zdCB5MCA9IHlbeXMgLSAxXTtcbiAgICAgICAgaWYgKHkwID09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB5dCA9IHkwICogKDEgPDwgdGhpcy5GMSkgKyAoKHlzID4gMSkgPyB5W3lzIC0gMl0gPj4gdGhpcy5GMiA6IDApO1xuICAgICAgICBjb25zdCBkMSA9IHRoaXMuRlYgLyB5dDtcbiAgICAgICAgY29uc3QgZDIgPSAoMSA8PCB0aGlzLkYxKSAvIHl0O1xuICAgICAgICBjb25zdCBlID0gMSA8PCB0aGlzLkYyO1xuICAgICAgICBsZXQgaSA9IHIudDtcbiAgICAgICAgbGV0IGogPSBpIC0geXM7XG4gICAgICAgIGNvbnN0IHQgPSAocSA9PSBudWxsKSA/IG5iaSgpIDogcTtcbiAgICAgICAgeS5kbFNoaWZ0VG8oaiwgdCk7XG4gICAgICAgIGlmIChyLmNvbXBhcmVUbyh0KSA+PSAwKSB7XG4gICAgICAgICAgICByW3IudCsrXSA9IDE7XG4gICAgICAgICAgICByLnN1YlRvKHQsIHIpO1xuICAgICAgICB9XG4gICAgICAgIEJpZ0ludGVnZXIuT05FLmRsU2hpZnRUbyh5cywgdCk7XG4gICAgICAgIHQuc3ViVG8oeSwgeSk7XHQvLyBcIm5lZ2F0aXZlXCIgeSBzbyB3ZSBjYW4gcmVwbGFjZSBzdWIgd2l0aCBhbSBsYXRlclxuICAgICAgICB3aGlsZSAoeS50IDwgeXMpIHtcbiAgICAgICAgICAgIHlbeS50KytdID0gMDtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoLS1qID49IDApIHtcbiAgICAgICAgICAgIC8vIEVzdGltYXRlIHF1b3RpZW50IGRpZ2l0XG4gICAgICAgICAgICBsZXQgcWQgPSAoclstLWldID09IHkwKSA/IHRoaXMuRE0gOiBNYXRoLmZsb29yKHJbaV0gKiBkMSArIChyW2kgLSAxXSArIGUpICogZDIpO1xuICAgICAgICAgICAgaWYgKChyW2ldICs9IHkuYW0oMCwgcWQsIHIsIGosIDAsIHlzKSkgPCBxZCkge1x0Ly8gVHJ5IGl0IG91dFxuICAgICAgICAgICAgICAgIHkuZGxTaGlmdFRvKGosIHQpO1xuICAgICAgICAgICAgICAgIHIuc3ViVG8odCwgcik7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHJbaV0gPCAtLXFkKSB7XG4gICAgICAgICAgICAgICAgICAgIHIuc3ViVG8odCwgcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChxICE9IG51bGwpIHtcbiAgICAgICAgICAgIHIuZHJTaGlmdFRvKHlzLCBxKTtcbiAgICAgICAgICAgIGlmICh0cyAhPSBtcykge1xuICAgICAgICAgICAgICAgIEJpZ0ludGVnZXIuWkVSTy5zdWJUbyhxLCBxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByLnQgPSB5cztcbiAgICAgICAgci5jbGFtcCgpO1xuICAgICAgICBpZiAobnNoID4gMCkge1xuICAgICAgICAgICAgci5yU2hpZnRUbyhuc2gsIHIpO1xuICAgICAgICB9XHQvLyBEZW5vcm1hbGl6ZSByZW1haW5kZXJcbiAgICAgICAgaWYgKHRzIDwgMCkge1xuICAgICAgICAgICAgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHIsIHIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5pbnZEaWdpdCA9IGJucEludkRpZ2l0O1xuICAgIC8vIChwcm90ZWN0ZWQpIHJldHVybiBcIi0xL3RoaXMgJSAyXkRCXCI7IHVzZWZ1bCBmb3IgTW9udC4gcmVkdWN0aW9uXG4gICAgLy8ganVzdGlmaWNhdGlvbjpcbiAgICAvLyAgICAgICAgIHh5ID09IDEgKG1vZCBtKVxuICAgIC8vICAgICAgICAgeHkgPSAgMStrbVxuICAgIC8vICAgeHkoMi14eSkgPSAoMStrbSkoMS1rbSlcbiAgICAvLyB4W3koMi14eSldID0gMS1rXjJtXjJcbiAgICAvLyB4W3koMi14eSldID09IDEgKG1vZCBtXjIpXG4gICAgLy8gaWYgeSBpcyAxL3ggbW9kIG0sIHRoZW4geSgyLXh5KSBpcyAxL3ggbW9kIG1eMlxuICAgIC8vIHNob3VsZCByZWR1Y2UgeCBhbmQgeSgyLXh5KSBieSBtXjIgYXQgZWFjaCBzdGVwIHRvIGtlZXAgc2l6ZSBib3VuZGVkLlxuICAgIC8vIEpTIG11bHRpcGx5IFwib3ZlcmZsb3dzXCIgZGlmZmVyZW50bHkgZnJvbSBDL0MrKywgc28gY2FyZSBpcyBuZWVkZWQgaGVyZS5cbiAgICBwdWJsaWMgaW52RGlnaXQoKTpudW1iZXIge1xuICAgICAgICBpZiAodGhpcy50IDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeCA9IHRoaXNbMF07XG4gICAgICAgIGlmICgoeCAmIDEpID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGxldCB5ID0geCAmIDM7XHRcdC8vIHkgPT0gMS94IG1vZCAyXjJcbiAgICAgICAgeSA9ICh5ICogKDIgLSAoeCAmIDB4ZikgKiB5KSkgJiAweGY7XHQvLyB5ID09IDEveCBtb2QgMl40XG4gICAgICAgIHkgPSAoeSAqICgyIC0gKHggJiAweGZmKSAqIHkpKSAmIDB4ZmY7XHQvLyB5ID09IDEveCBtb2QgMl44XG4gICAgICAgIHkgPSAoeSAqICgyIC0gKCgoeCAmIDB4ZmZmZikgKiB5KSAmIDB4ZmZmZikpKSAmIDB4ZmZmZjtcdC8vIHkgPT0gMS94IG1vZCAyXjE2XG4gICAgICAgIC8vIGxhc3Qgc3RlcCAtIGNhbGN1bGF0ZSBpbnZlcnNlIG1vZCBEViBkaXJlY3RseTtcbiAgICAgICAgLy8gYXNzdW1lcyAxNiA8IERCIDw9IDMyIGFuZCBhc3N1bWVzIGFiaWxpdHkgdG8gaGFuZGxlIDQ4LWJpdCBpbnRzXG4gICAgICAgIHkgPSAoeSAqICgyIC0geCAqIHkgJSB0aGlzLkRWKSkgJSB0aGlzLkRWO1x0XHQvLyB5ID09IDEveCBtb2QgMl5kYml0c1xuICAgICAgICAvLyB3ZSByZWFsbHkgd2FudCB0aGUgbmVnYXRpdmUgaW52ZXJzZSwgYW5kIC1EViA8IHkgPCBEVlxuICAgICAgICByZXR1cm4gKHkgPiAwKSA/IHRoaXMuRFYgLSB5IDogLXk7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5pc0V2ZW4gPSBibnBJc0V2ZW47XG4gICAgLy8gKHByb3RlY3RlZCkgdHJ1ZSBpZmYgdGhpcyBpcyBldmVuXG4gICAgcHJvdGVjdGVkIGlzRXZlbigpIHtcbiAgICAgICAgcmV0dXJuICgodGhpcy50ID4gMCkgPyAodGhpc1swXSAmIDEpIDogdGhpcy5zKSA9PSAwO1xuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUuZXhwID0gYm5wRXhwO1xuICAgIC8vIChwcm90ZWN0ZWQpIHRoaXNeZSwgZSA8IDJeMzIsIGRvaW5nIHNxciBhbmQgbXVsIHdpdGggXCJyXCIgKEhBQyAxNC43OSlcbiAgICBwcm90ZWN0ZWQgZXhwKGU6bnVtYmVyLCB6OklSZWR1Y3Rpb24pIHtcbiAgICAgICAgaWYgKGUgPiAweGZmZmZmZmZmIHx8IGUgPCAxKSB7XG4gICAgICAgICAgICByZXR1cm4gQmlnSW50ZWdlci5PTkU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHIgPSBuYmkoKTtcbiAgICAgICAgbGV0IHIyID0gbmJpKCk7XG4gICAgICAgIGNvbnN0IGcgPSB6LmNvbnZlcnQodGhpcyk7XG4gICAgICAgIGxldCBpID0gbmJpdHMoZSkgLSAxO1xuICAgICAgICBnLmNvcHlUbyhyKTtcbiAgICAgICAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgICAgICAgICB6LnNxclRvKHIsIHIyKTtcbiAgICAgICAgICAgIGlmICgoZSAmICgxIDw8IGkpKSA+IDApIHtcbiAgICAgICAgICAgICAgICB6Lm11bFRvKHIyLCBnLCByKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdCA9IHI7XG4gICAgICAgICAgICAgICAgciA9IHIyO1xuICAgICAgICAgICAgICAgIHIyID0gdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gei5yZXZlcnQocik7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5jaHVua1NpemUgPSBibnBDaHVua1NpemU7XG4gICAgLy8gKHByb3RlY3RlZCkgcmV0dXJuIHggcy50LiByXnggPCBEVlxuICAgIHByb3RlY3RlZCBjaHVua1NpemUocjpudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5MTjIgKiB0aGlzLkRCIC8gTWF0aC5sb2cocikpO1xuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUudG9SYWRpeCA9IGJucFRvUmFkaXg7XG4gICAgLy8gKHByb3RlY3RlZCkgY29udmVydCB0byByYWRpeCBzdHJpbmdcbiAgICBwcm90ZWN0ZWQgdG9SYWRpeChiOm51bWJlcikge1xuICAgICAgICBpZiAoYiA9PSBudWxsKSB7XG4gICAgICAgICAgICBiID0gMTA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2lnbnVtKCkgPT0gMCB8fCBiIDwgMiB8fCBiID4gMzYpIHtcbiAgICAgICAgICAgIHJldHVybiBcIjBcIjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjcyA9IHRoaXMuY2h1bmtTaXplKGIpO1xuICAgICAgICBjb25zdCBhID0gTWF0aC5wb3coYiwgY3MpO1xuICAgICAgICBjb25zdCBkID0gbmJ2KGEpO1xuICAgICAgICBjb25zdCB5ID0gbmJpKCk7XG4gICAgICAgIGNvbnN0IHogPSBuYmkoKTtcbiAgICAgICAgbGV0IHIgPSBcIlwiO1xuICAgICAgICB0aGlzLmRpdlJlbVRvKGQsIHksIHopO1xuICAgICAgICB3aGlsZSAoeS5zaWdudW0oKSA+IDApIHtcbiAgICAgICAgICAgIHIgPSAoYSArIHouaW50VmFsdWUoKSkudG9TdHJpbmcoYikuc3Vic3RyKDEpICsgcjtcbiAgICAgICAgICAgIHkuZGl2UmVtVG8oZCwgeSwgeik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHouaW50VmFsdWUoKS50b1N0cmluZyhiKSArIHI7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5mcm9tUmFkaXggPSBibnBGcm9tUmFkaXg7XG4gICAgLy8gKHByb3RlY3RlZCkgY29udmVydCBmcm9tIHJhZGl4IHN0cmluZ1xuICAgIHB1YmxpYyBmcm9tUmFkaXgoczpzdHJpbmcsIGI6bnVtYmVyKSB7XG4gICAgICAgIHRoaXMuZnJvbUludCgwKTtcbiAgICAgICAgaWYgKGIgPT0gbnVsbCkge1xuICAgICAgICAgICAgYiA9IDEwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNzID0gdGhpcy5jaHVua1NpemUoYik7XG4gICAgICAgIGNvbnN0IGQgPSBNYXRoLnBvdyhiLCBjcyk7XG4gICAgICAgIGxldCBtaSA9IGZhbHNlO1xuICAgICAgICBsZXQgaiA9IDA7XG4gICAgICAgIGxldCB3ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gaW50QXQocywgaSk7XG4gICAgICAgICAgICBpZiAoeCA8IDApIHtcbiAgICAgICAgICAgICAgICBpZiAocy5jaGFyQXQoaSkgPT0gXCItXCIgJiYgdGhpcy5zaWdudW0oKSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3ID0gYiAqIHcgKyB4O1xuICAgICAgICAgICAgaWYgKCsraiA+PSBjcykge1xuICAgICAgICAgICAgICAgIHRoaXMuZE11bHRpcGx5KGQpO1xuICAgICAgICAgICAgICAgIHRoaXMuZEFkZE9mZnNldCh3LCAwKTtcbiAgICAgICAgICAgICAgICBqID0gMDtcbiAgICAgICAgICAgICAgICB3ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaiA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuZE11bHRpcGx5KE1hdGgucG93KGIsIGopKTtcbiAgICAgICAgICAgIHRoaXMuZEFkZE9mZnNldCh3LCAwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWkpIHtcbiAgICAgICAgICAgIEJpZ0ludGVnZXIuWkVSTy5zdWJUbyh0aGlzLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUuZnJvbU51bWJlciA9IGJucEZyb21OdW1iZXI7XG4gICAgLy8gKHByb3RlY3RlZCkgYWx0ZXJuYXRlIGNvbnN0cnVjdG9yXG4gICAgcHJvdGVjdGVkIGZyb21OdW1iZXIoYTpudW1iZXIsIGI6bnVtYmVyfFNlY3VyZVJhbmRvbSwgYz86bnVtYmVyfFNlY3VyZVJhbmRvbSkge1xuICAgICAgICBpZiAoXCJudW1iZXJcIiA9PSB0eXBlb2YgYikge1xuICAgICAgICAgICAgLy8gbmV3IEJpZ0ludGVnZXIoaW50LGludCxSTkcpXG4gICAgICAgICAgICBpZiAoYSA8IDIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZyb21JbnQoMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZnJvbU51bWJlcihhLCBjKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudGVzdEJpdChhIC0gMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZm9yY2UgTVNCIHNldFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJpdHdpc2VUbyhCaWdJbnRlZ2VyLk9ORS5zaGlmdExlZnQoYSAtIDEpLCBvcF9vciwgdGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRXZlbigpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZEFkZE9mZnNldCgxLCAwKTtcbiAgICAgICAgICAgICAgICB9IC8vIGZvcmNlIG9kZFxuICAgICAgICAgICAgICAgIHdoaWxlICghdGhpcy5pc1Byb2JhYmxlUHJpbWUoYikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kQWRkT2Zmc2V0KDIsIDApO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5iaXRMZW5ndGgoKSA+IGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3ViVG8oQmlnSW50ZWdlci5PTkUuc2hpZnRMZWZ0KGEgLSAxKSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBuZXcgQmlnSW50ZWdlcihpbnQsUk5HKVxuICAgICAgICAgICAgY29uc3QgeDpudW1iZXJbXSA9IFtdO1xuICAgICAgICAgICAgY29uc3QgdCA9IGEgJiA3O1xuICAgICAgICAgICAgeC5sZW5ndGggPSAoYSA+PiAzKSArIDE7XG4gICAgICAgICAgICBiLm5leHRCeXRlcyh4KTtcbiAgICAgICAgICAgIGlmICh0ID4gMCkge1xuICAgICAgICAgICAgICAgIHhbMF0gJj0gKCgxIDw8IHQpIC0gMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHhbMF0gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5mcm9tU3RyaW5nKHgsIDI1Nik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vIEJpZ0ludGVnZXIucHJvdG90eXBlLmJpdHdpc2VUbyA9IGJucEJpdHdpc2VUbztcbiAgICAvLyAocHJvdGVjdGVkKSByID0gdGhpcyBvcCBhIChiaXR3aXNlKVxuICAgIHByb3RlY3RlZCBiaXR3aXNlVG8oYTpCaWdJbnRlZ2VyLCBvcDooYTpudW1iZXIsIGI6bnVtYmVyKSA9PiBudW1iZXIsIHI6QmlnSW50ZWdlcikge1xuICAgICAgICBsZXQgaTtcbiAgICAgICAgbGV0IGY7XG4gICAgICAgIGNvbnN0IG0gPSBNYXRoLm1pbihhLnQsIHRoaXMudCk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBtOyArK2kpIHtcbiAgICAgICAgICAgIHJbaV0gPSBvcCh0aGlzW2ldLCBhW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYS50IDwgdGhpcy50KSB7XG4gICAgICAgICAgICBmID0gYS5zICYgdGhpcy5ETTtcbiAgICAgICAgICAgIGZvciAoaSA9IG07IGkgPCB0aGlzLnQ7ICsraSkge1xuICAgICAgICAgICAgICAgIHJbaV0gPSBvcCh0aGlzW2ldLCBmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHIudCA9IHRoaXMudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGYgPSB0aGlzLnMgJiB0aGlzLkRNO1xuICAgICAgICAgICAgZm9yIChpID0gbTsgaSA8IGEudDsgKytpKSB7XG4gICAgICAgICAgICAgICAgcltpXSA9IG9wKGYsIGFbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgci50ID0gYS50O1xuICAgICAgICB9XG4gICAgICAgIHIucyA9IG9wKHRoaXMucywgYS5zKTtcbiAgICAgICAgci5jbGFtcCgpO1xuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUuY2hhbmdlQml0ID0gYm5wQ2hhbmdlQml0O1xuICAgIC8vIChwcm90ZWN0ZWQpIHRoaXMgb3AgKDE8PG4pXG4gICAgcHJvdGVjdGVkIGNoYW5nZUJpdChuOm51bWJlciwgb3A6KGE6bnVtYmVyLCBiOm51bWJlcikgPT4gbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHIgPSBCaWdJbnRlZ2VyLk9ORS5zaGlmdExlZnQobik7XG4gICAgICAgIHRoaXMuYml0d2lzZVRvKHIsIG9wLCByKTtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5hZGRUbyA9IGJucEFkZFRvO1xuICAgIC8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzICsgYVxuICAgIHByb3RlY3RlZCBhZGRUbyhhOkJpZ0ludGVnZXIsIHI6QmlnSW50ZWdlcikge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGxldCBjID0gMDtcbiAgICAgICAgY29uc3QgbSA9IE1hdGgubWluKGEudCwgdGhpcy50KTtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgICBjICs9IHRoaXNbaV0gKyBhW2ldO1xuICAgICAgICAgICAgcltpKytdID0gYyAmIHRoaXMuRE07XG4gICAgICAgICAgICBjID4+PSB0aGlzLkRCO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhLnQgPCB0aGlzLnQpIHtcbiAgICAgICAgICAgIGMgKz0gYS5zO1xuICAgICAgICAgICAgd2hpbGUgKGkgPCB0aGlzLnQpIHtcbiAgICAgICAgICAgICAgICBjICs9IHRoaXNbaV07XG4gICAgICAgICAgICAgICAgcltpKytdID0gYyAmIHRoaXMuRE07XG4gICAgICAgICAgICAgICAgYyA+Pj0gdGhpcy5EQjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGMgKz0gdGhpcy5zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYyArPSB0aGlzLnM7XG4gICAgICAgICAgICB3aGlsZSAoaSA8IGEudCkge1xuICAgICAgICAgICAgICAgIGMgKz0gYVtpXTtcbiAgICAgICAgICAgICAgICByW2krK10gPSBjICYgdGhpcy5ETTtcbiAgICAgICAgICAgICAgICBjID4+PSB0aGlzLkRCO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYyArPSBhLnM7XG4gICAgICAgIH1cbiAgICAgICAgci5zID0gKGMgPCAwKSA/IC0xIDogMDtcbiAgICAgICAgaWYgKGMgPiAwKSB7XG4gICAgICAgICAgICByW2krK10gPSBjO1xuICAgICAgICB9IGVsc2UgaWYgKGMgPCAtMSkge1xuICAgICAgICAgICAgcltpKytdID0gdGhpcy5EViArIGM7XG4gICAgICAgIH1cbiAgICAgICAgci50ID0gaTtcbiAgICAgICAgci5jbGFtcCgpO1xuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUuZE11bHRpcGx5ID0gYm5wRE11bHRpcGx5O1xuICAgIC8vIChwcm90ZWN0ZWQpIHRoaXMgKj0gbiwgdGhpcyA+PSAwLCAxIDwgbiA8IERWXG4gICAgcHJvdGVjdGVkIGRNdWx0aXBseShuOm51bWJlcikge1xuICAgICAgICB0aGlzW3RoaXMudF0gPSB0aGlzLmFtKDAsIG4gLSAxLCB0aGlzLCAwLCAwLCB0aGlzLnQpO1xuICAgICAgICArK3RoaXMudDtcbiAgICAgICAgdGhpcy5jbGFtcCgpO1xuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUuZEFkZE9mZnNldCA9IGJucERBZGRPZmZzZXQ7XG4gICAgLy8gKHByb3RlY3RlZCkgdGhpcyArPSBuIDw8IHcgd29yZHMsIHRoaXMgPj0gMFxuICAgIHB1YmxpYyBkQWRkT2Zmc2V0KG46bnVtYmVyLCB3Om51bWJlcikge1xuICAgICAgICBpZiAobiA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHRoaXMudCA8PSB3KSB7XG4gICAgICAgICAgICB0aGlzW3RoaXMudCsrXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpc1t3XSArPSBuO1xuICAgICAgICB3aGlsZSAodGhpc1t3XSA+PSB0aGlzLkRWKSB7XG4gICAgICAgICAgICB0aGlzW3ddIC09IHRoaXMuRFY7XG4gICAgICAgICAgICBpZiAoKyt3ID49IHRoaXMudCkge1xuICAgICAgICAgICAgICAgIHRoaXNbdGhpcy50KytdID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICsrdGhpc1t3XTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHlMb3dlclRvID0gYm5wTXVsdGlwbHlMb3dlclRvO1xuICAgIC8vIChwcm90ZWN0ZWQpIHIgPSBsb3dlciBuIHdvcmRzIG9mIFwidGhpcyAqIGFcIiwgYS50IDw9IG5cbiAgICAvLyBcInRoaXNcIiBzaG91bGQgYmUgdGhlIGxhcmdlciBvbmUgaWYgYXBwcm9wcmlhdGUuXG4gICAgcHVibGljIG11bHRpcGx5TG93ZXJUbyhhOkJpZ0ludGVnZXIsIG46bnVtYmVyLCByOkJpZ0ludGVnZXIpIHtcbiAgICAgICAgbGV0IGkgPSBNYXRoLm1pbih0aGlzLnQgKyBhLnQsIG4pO1xuICAgICAgICByLnMgPSAwOyAvLyBhc3N1bWVzIGEsdGhpcyA+PSAwXG4gICAgICAgIHIudCA9IGk7XG4gICAgICAgIHdoaWxlIChpID4gMCkge1xuICAgICAgICAgICAgclstLWldID0gMDtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGogPSByLnQgLSB0aGlzLnQ7IGkgPCBqOyArK2kpIHtcbiAgICAgICAgICAgIHJbaSArIHRoaXMudF0gPSB0aGlzLmFtKDAsIGFbaV0sIHIsIGksIDAsIHRoaXMudCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBqID0gTWF0aC5taW4oYS50LCBuKTsgaSA8IGo7ICsraSkge1xuICAgICAgICAgICAgdGhpcy5hbSgwLCBhW2ldLCByLCBpLCAwLCBuIC0gaSk7XG4gICAgICAgIH1cbiAgICAgICAgci5jbGFtcCgpO1xuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHlVcHBlclRvID0gYm5wTXVsdGlwbHlVcHBlclRvO1xuICAgIC8vIChwcm90ZWN0ZWQpIHIgPSBcInRoaXMgKiBhXCIgd2l0aG91dCBsb3dlciBuIHdvcmRzLCBuID4gMFxuICAgIC8vIFwidGhpc1wiIHNob3VsZCBiZSB0aGUgbGFyZ2VyIG9uZSBpZiBhcHByb3ByaWF0ZS5cbiAgICBwdWJsaWMgbXVsdGlwbHlVcHBlclRvKGE6QmlnSW50ZWdlciwgbjpudW1iZXIsIHI6QmlnSW50ZWdlcikge1xuICAgICAgICAtLW47XG4gICAgICAgIGxldCBpID0gci50ID0gdGhpcy50ICsgYS50IC0gbjtcbiAgICAgICAgci5zID0gMDsgLy8gYXNzdW1lcyBhLHRoaXMgPj0gMFxuICAgICAgICB3aGlsZSAoLS1pID49IDApIHtcbiAgICAgICAgICAgIHJbaV0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IE1hdGgubWF4KG4gLSB0aGlzLnQsIDApOyBpIDwgYS50OyArK2kpIHtcbiAgICAgICAgICAgIHJbdGhpcy50ICsgaSAtIG5dID0gdGhpcy5hbShuIC0gaSwgYVtpXSwgciwgMCwgMCwgdGhpcy50ICsgaSAtIG4pO1xuICAgICAgICB9XG4gICAgICAgIHIuY2xhbXAoKTtcbiAgICAgICAgci5kclNoaWZ0VG8oMSwgcik7XG4gICAgfVxuXG5cbiAgICAvLyBCaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RJbnQgPSBibnBNb2RJbnQ7XG4gICAgLy8gKHByb3RlY3RlZCkgdGhpcyAlIG4sIG4gPCAyXjI2XG4gICAgcHJvdGVjdGVkIG1vZEludChuOm51bWJlcikge1xuICAgICAgICBpZiAobiA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkID0gdGhpcy5EViAlIG47XG4gICAgICAgIGxldCByID0gKHRoaXMucyA8IDApID8gbiAtIDEgOiAwO1xuICAgICAgICBpZiAodGhpcy50ID4gMCkge1xuICAgICAgICAgICAgaWYgKGQgPT0gMCkge1xuICAgICAgICAgICAgICAgIHIgPSB0aGlzWzBdICUgbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMudCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICAgICAgICAgIHIgPSAoZCAqIHIgKyB0aGlzW2ldKSAlIG47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUubWlsbGVyUmFiaW4gPSBibnBNaWxsZXJSYWJpbjtcbiAgICAvLyAocHJvdGVjdGVkKSB0cnVlIGlmIHByb2JhYmx5IHByaW1lIChIQUMgNC4yNCwgTWlsbGVyLVJhYmluKVxuICAgIHByb3RlY3RlZCBtaWxsZXJSYWJpbih0Om51bWJlcikge1xuICAgICAgICBjb25zdCBuMSA9IHRoaXMuc3VidHJhY3QoQmlnSW50ZWdlci5PTkUpO1xuICAgICAgICBjb25zdCBrID0gbjEuZ2V0TG93ZXN0U2V0Qml0KCk7XG4gICAgICAgIGlmIChrIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByID0gbjEuc2hpZnRSaWdodChrKTtcbiAgICAgICAgdCA9ICh0ICsgMSkgPj4gMTtcbiAgICAgICAgaWYgKHQgPiBsb3dwcmltZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0ID0gbG93cHJpbWVzLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhID0gbmJpKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdDsgKytpKSB7XG4gICAgICAgICAgICAvLyBQaWNrIGJhc2VzIGF0IHJhbmRvbSwgaW5zdGVhZCBvZiBzdGFydGluZyBhdCAyXG4gICAgICAgICAgICBhLmZyb21JbnQobG93cHJpbWVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxvd3ByaW1lcy5sZW5ndGgpXSk7XG4gICAgICAgICAgICBsZXQgeSA9IGEubW9kUG93KHIsIHRoaXMpO1xuICAgICAgICAgICAgaWYgKHkuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKSAhPSAwICYmIHkuY29tcGFyZVRvKG4xKSAhPSAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IGogPSAxO1xuICAgICAgICAgICAgICAgIHdoaWxlIChqKysgPCBrICYmIHkuY29tcGFyZVRvKG4xKSAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHkgPSB5Lm1vZFBvd0ludCgyLCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHkuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHkuY29tcGFyZVRvKG4xKSAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gQmlnSW50ZWdlci5wcm90b3R5cGUuc3F1YXJlID0gYm5TcXVhcmU7XG4gICAgLy8gKHB1YmxpYykgdGhpc14yXG4gICAgcHJvdGVjdGVkIHNxdWFyZSgpIHtcbiAgICAgICAgY29uc3QgciA9IG5iaSgpO1xuICAgICAgICB0aGlzLnNxdWFyZVRvKHIpO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICAvLyNyZWdpb24gQVNZTkNcblxuICAgIC8vIFB1YmxpYyBBUEkgbWV0aG9kXG4gICAgcHVibGljIGdjZGEoYTpCaWdJbnRlZ2VyLCBjYWxsYmFjazooeDpCaWdJbnRlZ2VyKSA9PiB2b2lkKSB7XG4gICAgICAgIGxldCB4ID0gKHRoaXMucyA8IDApID8gdGhpcy5uZWdhdGUoKSA6IHRoaXMuY2xvbmUoKTtcbiAgICAgICAgbGV0IHkgPSAoYS5zIDwgMCkgPyBhLm5lZ2F0ZSgpIDogYS5jbG9uZSgpO1xuICAgICAgICBpZiAoeC5jb21wYXJlVG8oeSkgPCAwKSB7XG4gICAgICAgICAgICBjb25zdCB0ID0geDtcbiAgICAgICAgICAgIHggPSB5O1xuICAgICAgICAgICAgeSA9IHQ7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGkgPSB4LmdldExvd2VzdFNldEJpdCgpO1xuICAgICAgICBsZXQgZyA9IHkuZ2V0TG93ZXN0U2V0Qml0KCk7XG4gICAgICAgIGlmIChnIDwgMCkge1xuICAgICAgICAgICAgY2FsbGJhY2soeCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgPCBnKSB7IGcgPSBpOyB9XG4gICAgICAgIGlmIChnID4gMCkge1xuICAgICAgICAgICAgeC5yU2hpZnRUbyhnLCB4KTtcbiAgICAgICAgICAgIHkuclNoaWZ0VG8oZywgeSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV29ya2hvcnNlIG9mIHRoZSBhbGdvcml0aG0sIGdldHMgY2FsbGVkIDIwMCAtIDgwMCB0aW1lcyBwZXIgNTEyIGJpdCBrZXlnZW4uXG4gICAgICAgIGNvbnN0IGdjZGExID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKChpID0geC5nZXRMb3dlc3RTZXRCaXQoKSkgPiAwKSB7IHguclNoaWZ0VG8oaSwgeCk7IH1cbiAgICAgICAgICAgIGlmICgoaSA9IHkuZ2V0TG93ZXN0U2V0Qml0KCkpID4gMCkgeyB5LnJTaGlmdFRvKGksIHkpOyB9XG4gICAgICAgICAgICBpZiAoeC5jb21wYXJlVG8oeSkgPj0gMCkge1xuICAgICAgICAgICAgICAgIHguc3ViVG8oeSwgeCk7XG4gICAgICAgICAgICAgICAgeC5yU2hpZnRUbygxLCB4KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgeS5zdWJUbyh4LCB5KTtcbiAgICAgICAgICAgICAgICB5LnJTaGlmdFRvKDEsIHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEoeC5zaWdudW0oKSA+IDApKSB7XG4gICAgICAgICAgICAgICAgaWYgKGcgPiAwKSB7IHkubFNoaWZ0VG8oZywgeSk7IH1cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtjYWxsYmFjayh5KTsgfSwgMCk7IC8vIGVzY2FwZVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGdjZGExLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgc2V0VGltZW91dChnY2RhMSwgMTApO1xuICAgIH1cblxuICAgIC8vIChwcm90ZWN0ZWQpIGFsdGVybmF0ZSBjb25zdHJ1Y3RvclxuICAgIHB1YmxpYyBmcm9tTnVtYmVyQXN5bmMoYTpudW1iZXIsIGI6bnVtYmVyfFNlY3VyZVJhbmRvbSwgYzpudW1iZXJ8U2VjdXJlUmFuZG9tLCBjYWxsYmFjazooKSA9PiB2b2lkKSB7XG4gICAgICAgIGlmIChcIm51bWJlclwiID09IHR5cGVvZiBiKSB7XG4gICAgICAgICAgICBpZiAoYSA8IDIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZyb21JbnQoMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZnJvbU51bWJlcihhLCBjKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudGVzdEJpdChhIC0gMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iaXR3aXNlVG8oQmlnSW50ZWdlci5PTkUuc2hpZnRMZWZ0KGEgLSAxKSwgb3Bfb3IsIHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0V2ZW4oKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRBZGRPZmZzZXQoMSwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGJucCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgY29uc3QgYm5wZm4xID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBibnAuZEFkZE9mZnNldCgyLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJucC5iaXRMZW5ndGgoKSA+IGEpIHsgYm5wLnN1YlRvKEJpZ0ludGVnZXIuT05FLnNoaWZ0TGVmdChhIC0gMSksIGJucCk7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJucC5pc1Byb2JhYmxlUHJpbWUoYikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge2NhbGxiYWNrKCk7IH0sIDApOyAvLyBlc2NhcGVcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoYm5wZm4xLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChibnBmbjEsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgeDpudW1iZXJbXSA9IFtdO1xuICAgICAgICAgICAgY29uc3QgdCA9IGEgJiA3O1xuICAgICAgICAgICAgeC5sZW5ndGggPSAoYSA+PiAzKSArIDE7XG4gICAgICAgICAgICBiLm5leHRCeXRlcyh4KTtcbiAgICAgICAgICAgIGlmICh0ID4gMCkgeyB4WzBdICY9ICgoMSA8PCB0KSAtIDEpOyB9IGVsc2UgeyB4WzBdID0gMDsgfVxuICAgICAgICAgICAgdGhpcy5mcm9tU3RyaW5nKHgsIDI1Nik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyNlbmRyZWdpb24gQVNZTkNcblxuICAvLyNlbmRyZWdpb24gUFJPVEVDVEVEXG5cbiAgICAvLyNyZWdpb24gRklFTERTXG5cbiAgICBwdWJsaWMgczpudW1iZXI7XG4gICAgcHVibGljIHQ6bnVtYmVyO1xuXG5cbiAgICBwdWJsaWMgREI6bnVtYmVyO1xuICAgIHB1YmxpYyBETTpudW1iZXI7XG4gICAgcHVibGljIERWOm51bWJlcjtcblxuICAgIHB1YmxpYyBGVjpudW1iZXI7XG4gICAgcHVibGljIEYxOm51bWJlcjtcbiAgICBwdWJsaWMgRjI6bnVtYmVyO1xuXG4gICAgcHVibGljIGFtOihpOm51bWJlciwgeDpudW1iZXIsIHc6QmlnSW50ZWdlciwgajpudW1iZXIsIGM6bnVtYmVyLCBuOm51bWJlcikgPT4gbnVtYmVyO1xuXG4gICAgW2luZGV4Om51bWJlcl06bnVtYmVyO1xuXG4gICAgcHVibGljIHN0YXRpYyBPTkU6QmlnSW50ZWdlcjtcbiAgICBwdWJsaWMgc3RhdGljIFpFUk86QmlnSW50ZWdlcjtcblxuICAgIC8vI2VuZHJlZ2lvbiBGSUVMRFNcbn1cblxuLy8jcmVnaW9uIFJFRFVDRVJTXG5cbi8vI3JlZ2lvbiBOdWxsRXhwXG5cbmNsYXNzIE51bGxFeHAge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgLy8gTnVsbEV4cC5wcm90b3R5cGUuY29udmVydCA9IG5Ob3A7XG4gICAgcHVibGljIGNvbnZlcnQoeDpCaWdJbnRlZ2VyKSB7XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cblxuXG4gICAgLy8gTnVsbEV4cC5wcm90b3R5cGUucmV2ZXJ0ID0gbk5vcDtcbiAgICBwdWJsaWMgcmV2ZXJ0KHg6QmlnSW50ZWdlcikge1xuICAgICAgICByZXR1cm4geDtcbiAgICB9XG5cblxuICAgIC8vIE51bGxFeHAucHJvdG90eXBlLm11bFRvID0gbk11bFRvO1xuICAgIHB1YmxpYyBtdWxUbyh4OkJpZ0ludGVnZXIsIHk6QmlnSW50ZWdlciwgcjpCaWdJbnRlZ2VyKSB7XG4gICAgICAgIHgubXVsdGlwbHlUbyh5LCByKTtcbiAgICB9XG5cblxuICAgIC8vIE51bGxFeHAucHJvdG90eXBlLnNxclRvID0gblNxclRvO1xuICAgIHB1YmxpYyBzcXJUbyh4OkJpZ0ludGVnZXIsIHI6QmlnSW50ZWdlcikge1xuICAgICAgICB4LnNxdWFyZVRvKHIpO1xuICAgIH1cbn1cblxuLy8jZW5kcmVnaW9uIE51bGxFeHBcblxuLy8jcmVnaW9uIENsYXNzaWNcblxuaW50ZXJmYWNlIElSZWR1Y3Rpb24ge1xuICAgIGNvbnZlcnQoeDpCaWdJbnRlZ2VyKTpCaWdJbnRlZ2VyO1xuXG4gICAgcmV2ZXJ0KHg6QmlnSW50ZWdlcik6QmlnSW50ZWdlcjtcblxuICAgIC8vIHJlZHVjZT8oeDpCaWdJbnRlZ2VyKTp2b2lkO1xuXG4gICAgbXVsVG8oeDpCaWdJbnRlZ2VyLCB5OkJpZ0ludGVnZXIsIHI6QmlnSW50ZWdlcik6dm9pZDtcblxuICAgIHNxclRvKHg6QmlnSW50ZWdlciwgcjpCaWdJbnRlZ2VyKTp2b2lkO1xufVxuXG4vLyBNb2R1bGFyIHJlZHVjdGlvbiB1c2luZyBcImNsYXNzaWNcIiBhbGdvcml0aG1cbmV4cG9ydCBjbGFzcyBDbGFzc2ljIGltcGxlbWVudHMgSVJlZHVjdGlvbiB7XG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIG06QmlnSW50ZWdlcikge1xuICAgIH1cblxuICAgIC8vIENsYXNzaWMucHJvdG90eXBlLmNvbnZlcnQgPSBjQ29udmVydDtcbiAgICBwdWJsaWMgY29udmVydCh4OkJpZ0ludGVnZXIpIHtcbiAgICAgICAgaWYgKHgucyA8IDAgfHwgeC5jb21wYXJlVG8odGhpcy5tKSA+PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4geC5tb2QodGhpcy5tKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvLyBDbGFzc2ljLnByb3RvdHlwZS5yZXZlcnQgPSBjUmV2ZXJ0O1xuICAgIHB1YmxpYyByZXZlcnQoeDpCaWdJbnRlZ2VyKSB7XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cblxuXG4gICAgLy8gQ2xhc3NpYy5wcm90b3R5cGUucmVkdWNlID0gY1JlZHVjZTtcbiAgICBwdWJsaWMgcmVkdWNlKHg6QmlnSW50ZWdlcikge1xuICAgICAgICB4LmRpdlJlbVRvKHRoaXMubSwgbnVsbCwgeCk7XG4gICAgfVxuXG5cbiAgICAvLyBDbGFzc2ljLnByb3RvdHlwZS5tdWxUbyA9IGNNdWxUbztcbiAgICBwdWJsaWMgbXVsVG8oeDpCaWdJbnRlZ2VyLCB5OkJpZ0ludGVnZXIsIHI6QmlnSW50ZWdlcikge1xuICAgICAgICB4Lm11bHRpcGx5VG8oeSwgcik7XG4gICAgICAgIHRoaXMucmVkdWNlKHIpO1xuICAgIH1cblxuXG4gICAgLy8gQ2xhc3NpYy5wcm90b3R5cGUuc3FyVG8gPSBjU3FyVG87XG4gICAgcHVibGljIHNxclRvKHg6QmlnSW50ZWdlciwgcjpCaWdJbnRlZ2VyKSB7XG4gICAgICAgIHguc3F1YXJlVG8ocik7XG4gICAgICAgIHRoaXMucmVkdWNlKHIpO1xuICAgIH1cbn1cblxuLy8jZW5kcmVnaW9uXG5cbi8vI3JlZ2lvbiBNb250Z29tZXJ5XG5cbi8vIE1vbnRnb21lcnkgcmVkdWN0aW9uXG5leHBvcnQgY2xhc3MgTW9udGdvbWVyeSBpbXBsZW1lbnRzIElSZWR1Y3Rpb24ge1xuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBtOkJpZ0ludGVnZXIpIHtcbiAgICAgICAgdGhpcy5tcCA9IG0uaW52RGlnaXQoKTtcbiAgICAgICAgdGhpcy5tcGwgPSB0aGlzLm1wICYgMHg3ZmZmO1xuICAgICAgICB0aGlzLm1waCA9IHRoaXMubXAgPj4gMTU7XG4gICAgICAgIHRoaXMudW0gPSAoMSA8PCAobS5EQiAtIDE1KSkgLSAxO1xuICAgICAgICB0aGlzLm10MiA9IDIgKiBtLnQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG1wOm51bWJlcjtcbiAgICBwcm90ZWN0ZWQgbXBsOm51bWJlcjtcbiAgICBwcm90ZWN0ZWQgbXBoOm51bWJlcjtcbiAgICBwcm90ZWN0ZWQgdW06bnVtYmVyO1xuICAgIHByb3RlY3RlZCBtdDI6bnVtYmVyO1xuXG4gICAgLy8gTW9udGdvbWVyeS5wcm90b3R5cGUuY29udmVydCA9IG1vbnRDb252ZXJ0O1xuICAgIC8vIHhSIG1vZCBtXG4gICAgcHVibGljIGNvbnZlcnQoeDpCaWdJbnRlZ2VyKSB7XG4gICAgICAgIGNvbnN0IHIgPSBuYmkoKTtcbiAgICAgICAgeC5hYnMoKS5kbFNoaWZ0VG8odGhpcy5tLnQsIHIpO1xuICAgICAgICByLmRpdlJlbVRvKHRoaXMubSwgbnVsbCwgcik7XG4gICAgICAgIGlmICh4LnMgPCAwICYmIHIuY29tcGFyZVRvKEJpZ0ludGVnZXIuWkVSTykgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLm0uc3ViVG8ociwgcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgLy8gTW9udGdvbWVyeS5wcm90b3R5cGUucmV2ZXJ0ID0gbW9udFJldmVydDtcbiAgICAvLyB4L1IgbW9kIG1cbiAgICBwdWJsaWMgcmV2ZXJ0KHg6QmlnSW50ZWdlcikge1xuICAgICAgICBjb25zdCByID0gbmJpKCk7XG4gICAgICAgIHguY29weVRvKHIpO1xuICAgICAgICB0aGlzLnJlZHVjZShyKTtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgLy8gTW9udGdvbWVyeS5wcm90b3R5cGUucmVkdWNlID0gbW9udFJlZHVjZTtcbiAgICAvLyB4ID0geC9SIG1vZCBtIChIQUMgMTQuMzIpXG4gICAgcHVibGljIHJlZHVjZSh4OkJpZ0ludGVnZXIpIHtcbiAgICAgICAgd2hpbGUgKHgudCA8PSB0aGlzLm10Mikge1xuICAgICAgICAgICAgLy8gcGFkIHggc28gYW0gaGFzIGVub3VnaCByb29tIGxhdGVyXG4gICAgICAgICAgICB4W3gudCsrXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm0udDsgKytpKSB7XG4gICAgICAgICAgICAvLyBmYXN0ZXIgd2F5IG9mIGNhbGN1bGF0aW5nIHUwID0geFtpXSptcCBtb2QgRFZcbiAgICAgICAgICAgIGxldCBqID0geFtpXSAmIDB4N2ZmZjtcbiAgICAgICAgICAgIGNvbnN0IHUwID0gKGogKiB0aGlzLm1wbCArICgoKGogKiB0aGlzLm1waCArICh4W2ldID4+IDE1KSAqIHRoaXMubXBsKSAmIHRoaXMudW0pIDw8IDE1KSkgJiB4LkRNO1xuICAgICAgICAgICAgLy8gdXNlIGFtIHRvIGNvbWJpbmUgdGhlIG11bHRpcGx5LXNoaWZ0LWFkZCBpbnRvIG9uZSBjYWxsXG4gICAgICAgICAgICBqID0gaSArIHRoaXMubS50O1xuICAgICAgICAgICAgeFtqXSArPSB0aGlzLm0uYW0oMCwgdTAsIHgsIGksIDAsIHRoaXMubS50KTtcbiAgICAgICAgICAgIC8vIHByb3BhZ2F0ZSBjYXJyeVxuICAgICAgICAgICAgd2hpbGUgKHhbal0gPj0geC5EVikge1xuICAgICAgICAgICAgICAgIHhbal0gLT0geC5EVjtcbiAgICAgICAgICAgICAgICB4Wysral0rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB4LmNsYW1wKCk7XG4gICAgICAgIHguZHJTaGlmdFRvKHRoaXMubS50LCB4KTtcbiAgICAgICAgaWYgKHguY29tcGFyZVRvKHRoaXMubSkgPj0gMCkge1xuICAgICAgICAgICAgeC5zdWJUbyh0aGlzLm0sIHgpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvLyBNb250Z29tZXJ5LnByb3RvdHlwZS5tdWxUbyA9IG1vbnRNdWxUbztcbiAgICAvLyByID0gXCJ4eS9SIG1vZCBtXCI7IHgseSAhPSByXG4gICAgcHVibGljIG11bFRvKHg6QmlnSW50ZWdlciwgeTpCaWdJbnRlZ2VyLCByOkJpZ0ludGVnZXIpIHtcbiAgICAgICAgeC5tdWx0aXBseVRvKHksIHIpO1xuICAgICAgICB0aGlzLnJlZHVjZShyKTtcbiAgICB9XG5cblxuICAgIC8vIE1vbnRnb21lcnkucHJvdG90eXBlLnNxclRvID0gbW9udFNxclRvO1xuICAgIC8vIHIgPSBcInheMi9SIG1vZCBtXCI7IHggIT0gclxuICAgIHB1YmxpYyBzcXJUbyh4OkJpZ0ludGVnZXIsIHI6QmlnSW50ZWdlcikge1xuICAgICAgICB4LnNxdWFyZVRvKHIpO1xuICAgICAgICB0aGlzLnJlZHVjZShyKTtcbiAgICB9XG5cbn1cblxuLy8jZW5kcmVnaW9uIE1vbnRnb21lcnlcblxuXG4vLyNyZWdpb24gQmFycmV0dFxuXG4vLyBCYXJyZXR0IG1vZHVsYXIgcmVkdWN0aW9uXG5jbGFzcyBCYXJyZXR0IGltcGxlbWVudHMgSVJlZHVjdGlvbiB7XG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIG06QmlnSW50ZWdlcikge1xuICAgICAgICAvLyBzZXR1cCBCYXJyZXR0XG4gICAgICAgIHRoaXMucjIgPSBuYmkoKTtcbiAgICAgICAgdGhpcy5xMyA9IG5iaSgpO1xuICAgICAgICBCaWdJbnRlZ2VyLk9ORS5kbFNoaWZ0VG8oMiAqIG0udCwgdGhpcy5yMik7XG4gICAgICAgIHRoaXMubXUgPSB0aGlzLnIyLmRpdmlkZShtKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcjI6QmlnSW50ZWdlcjtcbiAgICBwcm90ZWN0ZWQgcTM6QmlnSW50ZWdlcjtcbiAgICBwcm90ZWN0ZWQgbXU6QmlnSW50ZWdlcjtcblxuICAgIC8vIEJhcnJldHQucHJvdG90eXBlLmNvbnZlcnQgPSBiYXJyZXR0Q29udmVydDtcbiAgICBwdWJsaWMgY29udmVydCh4OkJpZ0ludGVnZXIpIHtcbiAgICAgICAgaWYgKHgucyA8IDAgfHwgeC50ID4gMiAqIHRoaXMubS50KSB7XG4gICAgICAgICAgICByZXR1cm4geC5tb2QodGhpcy5tKTtcbiAgICAgICAgfSBlbHNlIGlmICh4LmNvbXBhcmVUbyh0aGlzLm0pIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIHg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCByID0gbmJpKCk7XG4gICAgICAgICAgICB4LmNvcHlUbyhyKTtcbiAgICAgICAgICAgIHRoaXMucmVkdWNlKHIpO1xuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBCYXJyZXR0LnByb3RvdHlwZS5yZXZlcnQgPSBiYXJyZXR0UmV2ZXJ0O1xuICAgIHB1YmxpYyByZXZlcnQoeDpCaWdJbnRlZ2VyKSB7XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cblxuICAgIC8vIEJhcnJldHQucHJvdG90eXBlLnJlZHVjZSA9IGJhcnJldHRSZWR1Y2U7XG4gICAgLy8geCA9IHggbW9kIG0gKEhBQyAxNC40MilcbiAgICBwdWJsaWMgcmVkdWNlKHg6QmlnSW50ZWdlcikge1xuICAgICAgICB4LmRyU2hpZnRUbyh0aGlzLm0udCAtIDEsIHRoaXMucjIpO1xuICAgICAgICBpZiAoeC50ID4gdGhpcy5tLnQgKyAxKSB7XG4gICAgICAgICAgICB4LnQgPSB0aGlzLm0udCArIDE7XG4gICAgICAgICAgICB4LmNsYW1wKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tdS5tdWx0aXBseVVwcGVyVG8odGhpcy5yMiwgdGhpcy5tLnQgKyAxLCB0aGlzLnEzKTtcbiAgICAgICAgdGhpcy5tLm11bHRpcGx5TG93ZXJUbyh0aGlzLnEzLCB0aGlzLm0udCArIDEsIHRoaXMucjIpO1xuICAgICAgICB3aGlsZSAoeC5jb21wYXJlVG8odGhpcy5yMikgPCAwKSB7XG4gICAgICAgICAgICB4LmRBZGRPZmZzZXQoMSwgdGhpcy5tLnQgKyAxKTtcbiAgICAgICAgfVxuICAgICAgICB4LnN1YlRvKHRoaXMucjIsIHgpO1xuICAgICAgICB3aGlsZSAoeC5jb21wYXJlVG8odGhpcy5tKSA+PSAwKSB7XG4gICAgICAgICAgICB4LnN1YlRvKHRoaXMubSwgeCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vIEJhcnJldHQucHJvdG90eXBlLm11bFRvID0gYmFycmV0dE11bFRvO1xuICAgIC8vIHIgPSB4KnkgbW9kIG07IHgseSAhPSByXG4gICAgcHVibGljIG11bFRvKHg6QmlnSW50ZWdlciwgeTpCaWdJbnRlZ2VyLCByOkJpZ0ludGVnZXIpIHtcbiAgICAgICAgeC5tdWx0aXBseVRvKHksIHIpO1xuICAgICAgICB0aGlzLnJlZHVjZShyKTtcbiAgICB9XG5cblxuICAgIC8vIEJhcnJldHQucHJvdG90eXBlLnNxclRvID0gYmFycmV0dFNxclRvO1xuICAgIC8vIHIgPSB4XjIgbW9kIG07IHggIT0gclxuICAgIHB1YmxpYyBzcXJUbyh4OkJpZ0ludGVnZXIsIHI6QmlnSW50ZWdlcikge1xuICAgICAgICB4LnNxdWFyZVRvKHIpO1xuICAgICAgICB0aGlzLnJlZHVjZShyKTtcbiAgICB9XG59XG5cbi8vI2VuZHJlZ2lvblxuXG4vLyNlbmRyZWdpb24gUkVEVUNFUlNcblxuLy8gcmV0dXJuIG5ldywgdW5zZXQgQmlnSW50ZWdlclxuZXhwb3J0IGZ1bmN0aW9uIG5iaSgpIHsgcmV0dXJuIG5ldyBCaWdJbnRlZ2VyKG51bGwpOyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUJpZ0ludChzdHI6c3RyaW5nLCByOm51bWJlcikge1xuICAgIHJldHVybiBuZXcgQmlnSW50ZWdlcihzdHIsIHIpO1xufVxuXG4vLyBhbTogQ29tcHV0ZSB3X2ogKz0gKHgqdGhpc19pKSwgcHJvcGFnYXRlIGNhcnJpZXMsXG4vLyBjIGlzIGluaXRpYWwgY2FycnksIHJldHVybnMgZmluYWwgY2FycnkuXG4vLyBjIDwgMypkdmFsdWUsIHggPCAyKmR2YWx1ZSwgdGhpc19pIDwgZHZhbHVlXG4vLyBXZSBuZWVkIHRvIHNlbGVjdCB0aGUgZmFzdGVzdCBvbmUgdGhhdCB3b3JrcyBpbiB0aGlzIGVudmlyb25tZW50LlxuXG4vLyBhbTE6IHVzZSBhIHNpbmdsZSBtdWx0IGFuZCBkaXZpZGUgdG8gZ2V0IHRoZSBoaWdoIGJpdHMsXG4vLyBtYXggZGlnaXQgYml0cyBzaG91bGQgYmUgMjYgYmVjYXVzZVxuLy8gbWF4IGludGVybmFsIHZhbHVlID0gMipkdmFsdWVeMi0yKmR2YWx1ZSAoPCAyXjUzKVxuZnVuY3Rpb24gYW0xKGk6bnVtYmVyLCB4Om51bWJlciwgdzpCaWdJbnRlZ2VyLCBqOm51bWJlciwgYzpudW1iZXIsIG46bnVtYmVyKSB7XG4gICAgd2hpbGUgKC0tbiA+PSAwKSB7XG4gICAgICAgIGNvbnN0IHYgPSB4ICogdGhpc1tpKytdICsgd1tqXSArIGM7XG4gICAgICAgIGMgPSBNYXRoLmZsb29yKHYgLyAweDQwMDAwMDApO1xuICAgICAgICB3W2orK10gPSB2ICYgMHgzZmZmZmZmO1xuICAgIH1cbiAgICByZXR1cm4gYztcbn1cbi8vIGFtMiBhdm9pZHMgYSBiaWcgbXVsdC1hbmQtZXh0cmFjdCBjb21wbGV0ZWx5LlxuLy8gTWF4IGRpZ2l0IGJpdHMgc2hvdWxkIGJlIDw9IDMwIGJlY2F1c2Ugd2UgZG8gYml0d2lzZSBvcHNcbi8vIG9uIHZhbHVlcyB1cCB0byAyKmhkdmFsdWVeMi1oZHZhbHVlLTEgKDwgMl4zMSlcbmZ1bmN0aW9uIGFtMihpOm51bWJlciwgeDpudW1iZXIsIHc6QmlnSW50ZWdlciwgajpudW1iZXIsIGM6bnVtYmVyLCBuOm51bWJlcikge1xuICAgIGNvbnN0IHhsID0geCAmIDB4N2ZmZjtcbiAgICBjb25zdCB4aCA9IHggPj4gMTU7XG4gICAgd2hpbGUgKC0tbiA+PSAwKSB7XG4gICAgICAgIGxldCBsID0gdGhpc1tpXSAmIDB4N2ZmZjtcbiAgICAgICAgY29uc3QgaCA9IHRoaXNbaSsrXSA+PiAxNTtcbiAgICAgICAgY29uc3QgbSA9IHhoICogbCArIGggKiB4bDtcbiAgICAgICAgbCA9IHhsICogbCArICgobSAmIDB4N2ZmZikgPDwgMTUpICsgd1tqXSArIChjICYgMHgzZmZmZmZmZik7XG4gICAgICAgIGMgPSAobCA+Pj4gMzApICsgKG0gPj4+IDE1KSArIHhoICogaCArIChjID4+PiAzMCk7XG4gICAgICAgIHdbaisrXSA9IGwgJiAweDNmZmZmZmZmO1xuICAgIH1cbiAgICByZXR1cm4gYztcbn1cbi8vIEFsdGVybmF0ZWx5LCBzZXQgbWF4IGRpZ2l0IGJpdHMgdG8gMjggc2luY2Ugc29tZVxuLy8gYnJvd3NlcnMgc2xvdyBkb3duIHdoZW4gZGVhbGluZyB3aXRoIDMyLWJpdCBudW1iZXJzLlxuZnVuY3Rpb24gYW0zKGk6bnVtYmVyLCB4Om51bWJlciwgdzpCaWdJbnRlZ2VyLCBqOm51bWJlciwgYzpudW1iZXIsIG46bnVtYmVyKSB7XG4gICAgY29uc3QgeGwgPSB4ICYgMHgzZmZmO1xuICAgIGNvbnN0IHhoID0geCA+PiAxNDtcbiAgICB3aGlsZSAoLS1uID49IDApIHtcbiAgICAgICAgbGV0IGwgPSB0aGlzW2ldICYgMHgzZmZmO1xuICAgICAgICBjb25zdCBoID0gdGhpc1tpKytdID4+IDE0O1xuICAgICAgICBjb25zdCBtID0geGggKiBsICsgaCAqIHhsO1xuICAgICAgICBsID0geGwgKiBsICsgKChtICYgMHgzZmZmKSA8PCAxNCkgKyB3W2pdICsgYztcbiAgICAgICAgYyA9IChsID4+IDI4KSArIChtID4+IDE0KSArIHhoICogaDtcbiAgICAgICAgd1tqKytdID0gbCAmIDB4ZmZmZmZmZjtcbiAgICB9XG4gICAgcmV0dXJuIGM7XG59XG5cbmlmIChqX2xtICYmIChuYXZpZ2F0b3IuYXBwTmFtZSA9PSBcIk1pY3Jvc29mdCBJbnRlcm5ldCBFeHBsb3JlclwiKSkge1xuICAgIEJpZ0ludGVnZXIucHJvdG90eXBlLmFtID0gYW0yO1xuICAgIGRiaXRzID0gMzA7XG59IGVsc2UgaWYgKGpfbG0gJiYgKG5hdmlnYXRvci5hcHBOYW1lICE9IFwiTmV0c2NhcGVcIikpIHtcbiAgICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5hbSA9IGFtMTtcbiAgICBkYml0cyA9IDI2O1xufSBlbHNlIHsgLy8gTW96aWxsYS9OZXRzY2FwZSBzZWVtcyB0byBwcmVmZXIgYW0zXG4gICAgQmlnSW50ZWdlci5wcm90b3R5cGUuYW0gPSBhbTM7XG4gICAgZGJpdHMgPSAyODtcbn1cblxuQmlnSW50ZWdlci5wcm90b3R5cGUuREIgPSBkYml0cztcbkJpZ0ludGVnZXIucHJvdG90eXBlLkRNID0gKCgxIDw8IGRiaXRzKSAtIDEpO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuRFYgPSAoMSA8PCBkYml0cyk7XG5cbmNvbnN0IEJJX0ZQID0gNTI7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5GViA9IE1hdGgucG93KDIsIEJJX0ZQKTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLkYxID0gQklfRlAgLSBkYml0cztcbkJpZ0ludGVnZXIucHJvdG90eXBlLkYyID0gMiAqIGRiaXRzIC0gQklfRlA7XG5cbi8vIERpZ2l0IGNvbnZlcnNpb25zXG5jb25zdCBCSV9SQzpudW1iZXJbXSA9IFtdO1xubGV0IHJyO1xubGV0IHZ2O1xucnIgPSBcIjBcIi5jaGFyQ29kZUF0KDApO1xuZm9yICh2diA9IDA7IHZ2IDw9IDk7ICsrdnYpIHtcbiAgICBCSV9SQ1tycisrXSA9IHZ2O1xufVxucnIgPSBcImFcIi5jaGFyQ29kZUF0KDApO1xuZm9yICh2diA9IDEwOyB2diA8IDM2OyArK3Z2KSB7XG4gICAgQklfUkNbcnIrK10gPSB2djtcbn1cbnJyID0gXCJBXCIuY2hhckNvZGVBdCgwKTtcbmZvciAodnYgPSAxMDsgdnYgPCAzNjsgKyt2dikge1xuICAgIEJJX1JDW3JyKytdID0gdnY7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGludEF0KHM6c3RyaW5nLCBpOm51bWJlcikge1xuICAgIGNvbnN0IGMgPSBCSV9SQ1tzLmNoYXJDb2RlQXQoaSldO1xuICAgIHJldHVybiAoYyA9PSBudWxsKSA/IC0xIDogYztcbn1cblxuXG4vLyByZXR1cm4gYmlnaW50IGluaXRpYWxpemVkIHRvIHZhbHVlXG5leHBvcnQgZnVuY3Rpb24gbmJ2KGk6bnVtYmVyKSB7XG4gICAgY29uc3QgciA9IG5iaSgpO1xuICAgIHIuZnJvbUludChpKTtcbiAgICByZXR1cm4gcjtcbn1cblxuLy8gcmV0dXJucyBiaXQgbGVuZ3RoIG9mIHRoZSBpbnRlZ2VyIHhcbmV4cG9ydCBmdW5jdGlvbiBuYml0cyh4Om51bWJlcikge1xuICAgIGxldCByID0gMTtcbiAgICBsZXQgdDtcbiAgICBpZiAoKHQgPSB4ID4+PiAxNikgIT0gMCkge1xuICAgICAgICB4ID0gdDtcbiAgICAgICAgciArPSAxNjtcbiAgICB9XG4gICAgaWYgKCh0ID0geCA+PiA4KSAhPSAwKSB7XG4gICAgICAgIHggPSB0O1xuICAgICAgICByICs9IDg7XG4gICAgfVxuICAgIGlmICgodCA9IHggPj4gNCkgIT0gMCkge1xuICAgICAgICB4ID0gdDtcbiAgICAgICAgciArPSA0O1xuICAgIH1cbiAgICBpZiAoKHQgPSB4ID4+IDIpICE9IDApIHtcbiAgICAgICAgeCA9IHQ7XG4gICAgICAgIHIgKz0gMjtcbiAgICB9XG4gICAgaWYgKCh0ID0geCA+PiAxKSAhPSAwKSB7XG4gICAgICAgIHggPSB0O1xuICAgICAgICByICs9IDE7XG4gICAgfVxuICAgIHJldHVybiByO1xufVxuXG4vLyBcImNvbnN0YW50c1wiXG5CaWdJbnRlZ2VyLlpFUk8gPSBuYnYoMCk7XG5CaWdJbnRlZ2VyLk9ORSA9IG5idigxKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9qc2JuL2pzYm4udHMiLCJpbXBvcnQge2ludDJjaGFyfSBmcm9tIFwiLi91dGlsXCI7XG5cbmNvbnN0IGI2NG1hcCA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrL1wiO1xuY29uc3QgYjY0cGFkID0gXCI9XCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBoZXgyYjY0KGg6c3RyaW5nKSB7XG4gICAgbGV0IGk7XG4gICAgbGV0IGM7XG4gICAgbGV0IHJldCA9IFwiXCI7XG4gICAgZm9yIChpID0gMDsgaSArIDMgPD0gaC5sZW5ndGg7IGkgKz0gMykge1xuICAgICAgICBjID0gcGFyc2VJbnQoaC5zdWJzdHJpbmcoaSwgaSArIDMpLCAxNik7XG4gICAgICAgIHJldCArPSBiNjRtYXAuY2hhckF0KGMgPj4gNikgKyBiNjRtYXAuY2hhckF0KGMgJiA2Myk7XG4gICAgfVxuICAgIGlmIChpICsgMSA9PSBoLmxlbmd0aCkge1xuICAgICAgICBjID0gcGFyc2VJbnQoaC5zdWJzdHJpbmcoaSwgaSArIDEpLCAxNik7XG4gICAgICAgIHJldCArPSBiNjRtYXAuY2hhckF0KGMgPDwgMik7XG4gICAgfSBlbHNlIGlmIChpICsgMiA9PSBoLmxlbmd0aCkge1xuICAgICAgICBjID0gcGFyc2VJbnQoaC5zdWJzdHJpbmcoaSwgaSArIDIpLCAxNik7XG4gICAgICAgIHJldCArPSBiNjRtYXAuY2hhckF0KGMgPj4gMikgKyBiNjRtYXAuY2hhckF0KChjICYgMykgPDwgNCk7XG4gICAgfVxuICAgIHdoaWxlICgocmV0Lmxlbmd0aCAmIDMpID4gMCkge1xuICAgICAgICByZXQgKz0gYjY0cGFkO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxuXG4vLyBjb252ZXJ0IGEgYmFzZTY0IHN0cmluZyB0byBoZXhcbmV4cG9ydCBmdW5jdGlvbiBiNjR0b2hleChzOnN0cmluZykge1xuICAgIGxldCByZXQgPSBcIlwiO1xuICAgIGxldCBpO1xuICAgIGxldCBrID0gMDsgLy8gYjY0IHN0YXRlLCAwLTNcbiAgICBsZXQgc2xvcCA9IDA7XG4gICAgZm9yIChpID0gMDsgaSA8IHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYgKHMuY2hhckF0KGkpID09IGI2NHBhZCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdiA9IGI2NG1hcC5pbmRleE9mKHMuY2hhckF0KGkpKTtcbiAgICAgICAgaWYgKHYgPCAwKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoayA9PSAwKSB7XG4gICAgICAgICAgICByZXQgKz0gaW50MmNoYXIodiA+PiAyKTtcbiAgICAgICAgICAgIHNsb3AgPSB2ICYgMztcbiAgICAgICAgICAgIGsgPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKGsgPT0gMSkge1xuICAgICAgICAgICAgcmV0ICs9IGludDJjaGFyKChzbG9wIDw8IDIpIHwgKHYgPj4gNCkpO1xuICAgICAgICAgICAgc2xvcCA9IHYgJiAweGY7XG4gICAgICAgICAgICBrID0gMjtcbiAgICAgICAgfSBlbHNlIGlmIChrID09IDIpIHtcbiAgICAgICAgICAgIHJldCArPSBpbnQyY2hhcihzbG9wKTtcbiAgICAgICAgICAgIHJldCArPSBpbnQyY2hhcih2ID4+IDIpO1xuICAgICAgICAgICAgc2xvcCA9IHYgJiAzO1xuICAgICAgICAgICAgayA9IDM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXQgKz0gaW50MmNoYXIoKHNsb3AgPDwgMikgfCAodiA+PiA0KSk7XG4gICAgICAgICAgICByZXQgKz0gaW50MmNoYXIodiAmIDB4Zik7XG4gICAgICAgICAgICBrID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoayA9PSAxKSB7XG4gICAgICAgIHJldCArPSBpbnQyY2hhcihzbG9wIDw8IDIpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxuXG4vLyBjb252ZXJ0IGEgYmFzZTY0IHN0cmluZyB0byBhIGJ5dGUvbnVtYmVyIGFycmF5XG5leHBvcnQgZnVuY3Rpb24gYjY0dG9CQShzOnN0cmluZykge1xuICAgIC8vIHBpZ2d5YmFjayBvbiBiNjR0b2hleCBmb3Igbm93LCBvcHRpbWl6ZSBsYXRlclxuICAgIGNvbnN0IGggPSBiNjR0b2hleChzKTtcbiAgICBsZXQgaTtcbiAgICBjb25zdCBhID0gW107XG4gICAgZm9yIChpID0gMDsgMiAqIGkgPCBoLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGFbaV0gPSBwYXJzZUludChoLnN1YnN0cmluZygyICogaSwgMiAqIGkgKyAyKSwgMTYpO1xuICAgIH1cbiAgICByZXR1cm4gYTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9qc2JuL2Jhc2U2NC50cyIsImNvbnN0IEJJX1JNID0gXCIwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGludDJjaGFyKG46bnVtYmVyKSB7XG4gICAgcmV0dXJuIEJJX1JNLmNoYXJBdChuKTtcbn1cblxuLy8jcmVnaW9uIEJJVF9PUEVSQVRJT05TXG5cbi8vIChwdWJsaWMpIHRoaXMgJiBhXG5leHBvcnQgZnVuY3Rpb24gb3BfYW5kKHg6bnVtYmVyLCB5Om51bWJlcik6bnVtYmVyIHtcbiAgICByZXR1cm4geCAmIHk7XG59XG5cblxuLy8gKHB1YmxpYykgdGhpcyB8IGFcbmV4cG9ydCBmdW5jdGlvbiBvcF9vcih4Om51bWJlciwgeTpudW1iZXIpOm51bWJlciB7XG4gICAgcmV0dXJuIHggfCB5O1xufVxuXG4vLyAocHVibGljKSB0aGlzIF4gYVxuZXhwb3J0IGZ1bmN0aW9uIG9wX3hvcih4Om51bWJlciwgeTpudW1iZXIpOm51bWJlciB7XG4gICAgcmV0dXJuIHggXiB5O1xufVxuXG5cbi8vIChwdWJsaWMpIHRoaXMgJiB+YVxuZXhwb3J0IGZ1bmN0aW9uIG9wX2FuZG5vdCh4Om51bWJlciwgeTpudW1iZXIpOm51bWJlciB7XG4gICAgcmV0dXJuIHggJiB+eTtcbn1cblxuLy8gcmV0dXJuIGluZGV4IG9mIGxvd2VzdCAxLWJpdCBpbiB4LCB4IDwgMl4zMVxuZXhwb3J0IGZ1bmN0aW9uIGxiaXQoeDpudW1iZXIpIHtcbiAgICBpZiAoeCA9PSAwKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgbGV0IHIgPSAwO1xuICAgIGlmICgoeCAmIDB4ZmZmZikgPT0gMCkge1xuICAgICAgICB4ID4+PSAxNjtcbiAgICAgICAgciArPSAxNjtcbiAgICB9XG4gICAgaWYgKCh4ICYgMHhmZikgPT0gMCkge1xuICAgICAgICB4ID4+PSA4O1xuICAgICAgICByICs9IDg7XG4gICAgfVxuICAgIGlmICgoeCAmIDB4ZikgPT0gMCkge1xuICAgICAgICB4ID4+PSA0O1xuICAgICAgICByICs9IDQ7XG4gICAgfVxuICAgIGlmICgoeCAmIDMpID09IDApIHtcbiAgICAgICAgeCA+Pj0gMjtcbiAgICAgICAgciArPSAyO1xuICAgIH1cbiAgICBpZiAoKHggJiAxKSA9PSAwKSB7XG4gICAgICAgICsrcjtcbiAgICB9XG4gICAgcmV0dXJuIHI7XG59XG5cbi8vIHJldHVybiBudW1iZXIgb2YgMSBiaXRzIGluIHhcbmV4cG9ydCBmdW5jdGlvbiBjYml0KHg6bnVtYmVyKSB7XG4gICAgbGV0IHIgPSAwO1xuICAgIHdoaWxlICh4ICE9IDApIHtcbiAgICAgICAgeCAmPSB4IC0gMTtcbiAgICAgICAgKytyO1xuICAgIH1cbiAgICByZXR1cm4gcjtcbn1cblxuLy8jZW5kcmVnaW9uIEJJVF9PUEVSQVRJT05TXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvanNibi91dGlsLnRzIiwiaW1wb3J0IHtKU0VuY3J5cHR9IGZyb20gXCIuLi9zcmMvSlNFbmNyeXB0XCI7XG5cbnZhciBrZXlTaXplcyA9IFsxMjgsIDI1NiwgNTEyLCAxMDI0LCAyMDQ4XTtcblxudmFyIHBia2V5cyA9IFtcbiAgXCItLS0tLUJFR0lOIFBVQkxJQyBLRVktLS0tLVxcblwiICtcbiAgXCJNQ3d3RFFZSktvWklodmNOQVFFQkJRQURHd0F3R0FJUkFNZkU4Mlg2dGxwTks3QnhiaGc2bkVFQ0F3RUFBUT09XFxuXCIgK1xuICBcIi0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLVwiLFxuICBcIi0tLS0tQkVHSU4gUFVCTElDIEtFWS0tLS0tXFxuXCIgK1xuICBcIk1Ed3dEUVlKS29aSWh2Y05BUUVCQlFBREt3QXdLQUloQU1MdzBtUkd2NUtGK1AwTHNnTnZmck01QUpkVkJXcXJcXG5cIiArXG4gIFwiUTZCZjJnRVM1Z3dQQWdNQkFBRT1cXG5cIiArXG4gIFwiLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tXCIsXG4gIFwiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cXG5cIiArXG4gIFwiTUZ3d0RRWUpLb1pJaHZjTkFRRUJCUUFEU3dBd1NBSkJBS0VwdTIxUkRUWHhFbHk1NUhka1ZWOVNsRkwzSGdwbFxcblwiICtcbiAgXCJpNitJb2hBc25hcUZuQXBzS2kxUjdmQWQzdEJMbWVIVjJ0bHhZSW9ndHhwemZwY2MrUUJWRHg4Q0F3RUFBUT09XFxuXCIgK1xuICBcIi0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLVwiLFxuICBcIi0tLS0tQkVHSU4gUFVCTElDIEtFWS0tLS0tXFxuXCIgK1xuICBcIk1JR2ZNQTBHQ1NxR1NJYjNEUUVCQVFVQUE0R05BRENCaVFLQmdRQzVMTzV4VmxPOWc0UEwxeGRXdWRuaWhJQVBcXG5cIiArXG4gIFwiYk1zaXhyMzk2YkliQkl3S0J1bDk4VVdRM1VBTGJxQnlxMmJYVnVvSWJsNDhVb2t4T1ZzdGVuR0N5eW8wMjZORlxcblwiICtcbiAgXCJoM0ZnNkNudmo5cHR2Ym1xazJpM2VUT0JydCtlMjZaMXNlcHNuUUw1T29qaVZJYnJXd1M2djFwRkNYcG5uTEx2XFxuXCIgK1xuICBcInl5NkdQdC9rZnRiaGF6SDNvUUlEQVFBQlxcblwiICtcbiAgXCItLS0tLUVORCBQVUJMSUMgS0VZLS0tLS1cIixcbiAgXCItLS0tLUJFR0lOIFBVQkxJQyBLRVktLS0tLVxcblwiICtcbiAgXCJNSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQXRLcnNGU256WWwxOW01d1R3WWR1XFxuXCIgK1xuICBcIi9yMVVWWkpWK3prQUZ1ZDYrWFRJbkF5OEhiQ1I5bjU5SDkrNTRQK0FmL2ZVRTZydkVQYzRIMDlaNjN2UXpJR01cXG5cIiArXG4gIFwiaUw2R2xxek1tcHR2L0tSREloajdNazNNWG9tdkVWZlVzWHJ6NUlwTzBsZjZOU2VHaHo0UEdaVWtIWjMwVlJ4M1xcblwiICtcbiAgXCJKZC9hMEtJaGdmdFpIeHptTXNoOGlCL243ODFCMThwQ1AyZU9QVEYrNWdSQ2FXKzBmVlBCbGIvbUJsZzhNSnJkXFxuXCIgK1xuICBcIlNjR0NBUmVROU5mVHE4c2xKMGFPMU5XYWFSUkFOUFFjQ01sam5USUsxc3N5WEJhU0hLZm9XZUd4MTQxbVdNUnhcXG5cIiArXG4gIFwiL0x4eVoxM1pjM2xxZ21JQ2lLRnFNclFsNVVlVjFJVVhZcGo1aE85ZjYwTEdwWlZIRHFxby9KZEYzK1ZBaGVhZlxcblwiICtcbiAgXCJRd0lEQVFBQlxcblwiICtcbiAgXCItLS0tLUVORCBQVUJMSUMgS0VZLS0tLS1cIlxuXTtcblxudmFyIHBya2V5cyA9IFtcbiAgXCItLS0tLUJFR0lOIFJTQSBQUklWQVRFIEtFWS0tLS0tXFxuXCIgK1xuICBcIk1HTUNBUUFDRVFESHhQTmwrclphVFN1d2NXNFlPcHhCQWdNQkFBRUNFUUNxazZtaHNtcHl2MTdmSzFkUGVEM2hcXG5cIiArXG4gIFwiQWdrQTlMbzFhR1JvbTBzQ0NRRFErSnBxRTZLREl3SUpBS3N0eUlmQm5BM3JBZ2dPc1d3cUNUZGtBUUlJT1A5NVxcblwiICtcbiAgXCJSVjl5MmlRPVxcblwiICtcbiAgXCItLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLVxcblwiLFxuICBcIi0tLS0tQkVHSU4gUlNBIFBSSVZBVEUgS0VZLS0tLS1cXG5cIiArXG4gIFwiTUlHcUFnRUFBaUVBd3ZEU1pFYS9rb1g0L1F1eUEyOStzemtBbDFVRmFxdERvRi9hQVJMbURBOENBd0VBQVFJaFxcblwiICtcbiAgXCJBTUUyWjVFei9oUi83UFVCYm9LeE0yVTdoU2Fhdnl0dm9jQmRRakx2T1VXaEFoRUE4SGdpTEhSazlLakoyaHAwXFxuXCIgK1xuICBcIjVxM0JmUUlSQU0rSDdkWVVYUm5LWGpZb3FpS3VlWHNDRUduYWFDaXJmL2xYQjZ2enMzd01CcjBDRUhUMlh3endcXG5cIiArXG4gIFwiblNnVDdkVUlSaHNWeWxFQ0VGUVJHRnRaY0tSbUw4bHFUQndFQ1dJPVxcblwiICtcbiAgXCItLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLVxcblwiLFxuICBcIi0tLS0tQkVHSU4gUlNBIFBSSVZBVEUgS0VZLS0tLS1cXG5cIiArXG4gIFwiTUlJQk9RSUJBQUpCQUtFcHUyMVJEVFh4RWx5NTVIZGtWVjlTbEZMM0hncGxpNitJb2hBc25hcUZuQXBzS2kxUlxcblwiICtcbiAgXCI3ZkFkM3RCTG1lSFYydGx4WUlvZ3R4cHpmcGNjK1FCVkR4OENBd0VBQVFKQUZuMFZTMDdKRWlMZWxoUFdmcGFBXFxuXCIgK1xuICBcImx6bVZ1dklDdmg2blhFb3JteWd1cEJHaUlQU1hmSXNURmlkMjZ5eHQ5d3U0SkhlUkYwbHErT3pvNTVYcEJRRURcXG5cIiArXG4gIFwiNFFJaEFNMEU3aWt1RWEyYkRzUjJoUUpoSXozU3Z6enloRTVkSmNxRmpSdEt0TVF2QWlFQXlUMEMwZ1V5cUNkTlxcblwiICtcbiAgXCJZdVJPTjFUN0ZVZmZhck1kUVhSKzh0Z1JraG9DZUJFQ0lEK1pLZkFvVkYrUVhESmh1YjBWT1FOeW50UmZQdCs0XFxuXCIgK1xuICBcIlVZTFRqd1JLVm0wTkFpQnVPQ3R1U29pSFR4ZDBuYVUxYXljbWJib3huNjdiWmVvT0trZmRaTCtMY1FJZ0s2WGhcXG5cIiArXG4gIFwiMXdiOUkvc05ZdjlCeUpFR0JOSlJ3dFVFWnJrNWJhYkxFZGtVcTkwPVxcblwiICtcbiAgXCItLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLVxcblwiLFxuICBcIi0tLS0tQkVHSU4gUlNBIFBSSVZBVEUgS0VZLS0tLS1cXG5cIiArXG4gIFwiTUlJQ1hnSUJBQUtCZ1FDNUxPNXhWbE85ZzRQTDF4ZFd1ZG5paElBUGJNc2l4cjM5NmJJYkJJd0tCdWw5OFVXUVxcblwiICtcbiAgXCIzVUFMYnFCeXEyYlhWdW9JYmw0OFVva3hPVnN0ZW5HQ3l5bzAyNk5GaDNGZzZDbnZqOXB0dmJtcWsyaTNlVE9CXFxuXCIgK1xuICBcInJ0K2UyNloxc2Vwc25RTDVPb2ppVklicld3UzZ2MXBGQ1hwbm5MTHZ5eTZHUHQva2Z0Ymhhekgzb1FJREFRQUJcXG5cIiArXG4gIFwiQW9HQUErRWlHYlBDUzEwZS9MMUQydWhIM1V3RFZzOWpyaFhWMHlUN096K3NJMldqcktUS1hVK1ZVT2YvYW9lV1xcblwiICtcbiAgXCJ2dm91S3dFTTdseVlUVFN6YVUrQVkwb1lWenY3SE45aFdvVndpME5vUHBkNFYxUkZmRmI0KzREbVhoK05aUzdFXFxuXCIgK1xuICBcIkRYOStXWTQzNVljOVFqN3VIb2M4RW9SazNRZldhWlRYZDY5Yi85dFM0WXkvdG5FQ1FRRHhIc1NlN1F4ZCs2dGZcXG5cIiArXG4gIFwiL2Y0ZU8rYkVOQ3hJTWJQVThHUFdRQ3ZxOWVUOUF2MkkwTFRUY2htbGhHMVRTYXRxNjJ6cStVbmVmOE0vSU9Cc1xcblwiICtcbiAgXCJqNXozaXNzZEFrRUF4SnBZaXVBVlh1bFZpVU9MZFMzUVg3Mm93SVFMeHBGQkFLUTljUFRhZnFjNDdtczRTd3kyXFxuXCIgK1xuICBcIkZDYTRNWmZUSlhyRFg1cHVyK1BOZVAvY2U2eFpONUR6VlFKQkFKSTFrZ3k4dVU4VUdLc3duVE5BSjRLNkVGQUdcXG5cIiArXG4gIFwiczRGZjgyb3JwM1htZldCZXU5YUdsOS9QeEhWMWc4V0pXb1NQRlpDMmNYQ1dFSkxySUtzenVuN3dqcEVDUVFDc1xcblwiICtcbiAgXCJaK21qaDFSV1VlcEhuK3JvekU5QjFqRG8raUxWYzhWOENZc3p4aFRoSWtXamxuVGNJMzU4ZDJQcFlZbXhBVkhaXFxuXCIgK1xuICBcIlFiVTFHMkN4Ympac1lid3ZKVGF0QWtFQXNwbU1sSXlLV2dyUWtMSjRyYlBlc3BNSkNHZTZWWWhhcmwxUWM1Q0ZcXG5cIiArXG4gIFwiLzJTZ0tTQ3VMZmhBL0N1cjBuTzNkeHQ2WEppamsvcjMrais4TC9tK3dxdWQrQT09XFxuXCIgK1xuICBcIi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tXFxuXCIsXG4gIFwiLS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLVxcblwiICtcbiAgXCJNSUlFcEFJQkFBS0NBUUVBdEtyc0ZTbnpZbDE5bTV3VHdZZHUvcjFVVlpKVit6a0FGdWQ2K1hUSW5BeThIYkNSXFxuXCIgK1xuICBcIjluNTlIOSs1NFArQWYvZlVFNnJ2RVBjNEgwOVo2M3ZReklHTWlMNkdscXpNbXB0di9LUkRJaGo3TWszTVhvbXZcXG5cIiArXG4gIFwiRVZmVXNYcno1SXBPMGxmNk5TZUdoejRQR1pVa0haMzBWUngzSmQvYTBLSWhnZnRaSHh6bU1zaDhpQi9uNzgxQlxcblwiICtcbiAgXCIxOHBDUDJlT1BURis1Z1JDYVcrMGZWUEJsYi9tQmxnOE1KcmRTY0dDQVJlUTlOZlRxOHNsSjBhTzFOV2FhUlJBXFxuXCIgK1xuICBcIk5QUWNDTWxqblRJSzFzc3lYQmFTSEtmb1dlR3gxNDFtV01SeC9MeHlaMTNaYzNscWdtSUNpS0ZxTXJRbDVVZVZcXG5cIiArXG4gIFwiMUlVWFlwajVoTzlmNjBMR3BaVkhEcXFvL0pkRjMrVkFoZWFmUXdJREFRQUJBb0lCQVFDUy8rK1BXTTdiWGs1eFxcblwiICtcbiAgXCJhcEQ0aW9YWlo1dFM5UHBZcW94VUZveU1wR1VGODZhc1VacXlBVUUxeWdlbjlyeExZdzUvNGprYWlNeDFUVTlRXFxuXCIgK1xuICBcInR6R3c5RWV3aTdWZXE4TGVtVktKTWU0ZHRFM1BKRllCSmUzNElvckF6ZFhjUWx6WDhSVjRZbXluWmV0TFdYcEZcXG5cIiArXG4gIFwiVHR3YTFFcHQyckpqeDBlVVJ6ckFnZmNib3QwUXMrYzhiQjBxbkdDNjdQb0wzRHlZZzh2WDVQRG1paUEyVlpNR1xcblwiICtcbiAgXCJFeWxWUVMwOXRvSm41UmVhS0N0anhKYi9YRlFqQmVTUDB4TGp2WlpmdEdESmdwd21taTdTeS96QVpvRjQrN3dmXFxuXCIgK1xuICBcIjhuaWhYazRaZllDK2JlQmo1VTlwY1VjczZMZE5vYlVvZldGUkxTanVlc2VSUUJJMHNLVXNscjNZZTR6aGtyV01cXG5cIiArXG4gIFwiQ0Ruc1N4QmhBb0dCQU5pMHNwUy9NYzZ4SDExODltUjdkSlY5Z3k3S2tHeGhlQXN0d0NKcjdXemJYcWdsaEZtMlxcblwiICtcbiAgXCJTdlk5aHJwRTlPWVdpcjVFcVg2ak02VmlwU29iVG4wUnBDc1lVQy9KMUlTTXlFQTVVa1BMUDRqSFF3NlVVRE4yXFxuXCIgK1xuICBcIjFmTkFYZmZFeXVqdTVTaFA5TWsydW5ac3RsVXdlS2xGRjdkMWs3WUF6V0RJS25GNmJPTDA2WUM5QW9HQkFOVnRcXG5cIiArXG4gIFwiWE00T0gwenc4TTk3VzA0V3dZR29hNXMxWTVKWWM0Uk1WMjAwY3IzaU9OVmZMWmdTUDh0aFAxcVB1b01NM09KZ1xcblwiICtcbiAgXCJCcWU2TVJtby9WWGhnVnZwa2UwNFpKODNMU3ovU29xZlZSTnd4dUNIcXAzYmVKUVB4ckFwMWQvTDdFeTdmNDFVXFxuXCIgK1xuICBcIlFCRThwaWJGYjhiYmdPVFVXNWl5WmJnN2xMUzhuZ2hzbitCcVlwLy9Bb0dCQUpPLzU3NG8rWUdPRys5Mnd0dFJcXG5cIiArXG4gIFwiblBSTGhnU0NFYVFEZElCU3Fod043K3YzU1h0bFVPNkZybWhqSEplbGFqL3lBSmluWWRTNDJ2Nlkyamx5TXJwdFxcblwiICtcbiAgXCJLN3hDTUhIVXJ6UE1kTC90RlJ5cDErQ2UweVora292MEt2MVYxbnVXemkyd3E4Y25kS00zMER2cjlRanlLbUptXFxuXCIgK1xuICBcImZEd1dTeWFkTjJvVUwzUDlYMzRDTTY0VkFvR0FiYWpBVzFza04vdEFMOHI0OGRsOVdXbzR4OG1adkpMWDM2ejlcXG5cIiArXG4gIFwiNnExZEd6VkY4RlB6OEVQSUpXNTFCOG43a2VRbEJlZEM1Q0VsbzBLUnovT0s3TGZJODdMYStIZDRMYnVLQ0VtdlxcblwiICtcbiAgXCJnOHFaVkxwQUx0V2FVYkQ5Ykh4Q1dMZkZWUE90cU9jVitBVktkWGRTWkVGYUs3ajB5ek0yVW4vQ2UwN0NnQitYXFxuXCIgK1xuICBcIjBjMjNtTzhDZ1lBT3FuVVIvdVBJemt2ai9lSWJPN3BuaEhvS1o0SmkyVHJJQnFqc2t6YUZkMFRveDlpM1NXS2FcXG5cIiArXG4gIFwiY1JkUWNpUklUMXdrTWR5d25IRnJKVDFyd1lYeGNnZlFYQWt1L3ZuWXFBZnZJelk3VHlvTDNwV1g1NU8wWnJzN1xcblwiICtcbiAgXCIwNVI5bUE1VFptelVVOW0vUHpVclJqYXNPR1lTS2tDejRZMnFHbHJLSTNIMGFFK3ArUjU2a1E9PVxcblwiICtcbiAgXCItLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLVxcblwiXG5dO1xuXG5rZXlTaXplcy5mb3JFYWNoKGZ1bmN0aW9uKGtleVNpemUsIGluZGV4KXtcbiAgICBcbiAgICB2YXIganNlID0gbmV3IEpTRW5jcnlwdCh7ZGVmYXVsdF9rZXlfc2l6ZTprZXlTaXplfSk7XG4gICAgdmFyIG9wZW5zc2xfcHVibGljX2tleSA9IHBia2V5c1tpbmRleF07XG4gICAgdmFyIG9wZW5zc2xfcHJpdmF0ZV9rZXkgPSBwcmtleXNbaW5kZXhdO1xuICAgIFxuICAgIGRlc2NyaWJlKCdKU0VuY3J5cHQgLSAnK2tleVNpemUrJyBiaXQnLCBmdW5jdGlvbigpe1xuICAgICAgICAvL3RoaXMudGltZW91dCgwKTsgLy9UaW1vdXQgZm9yIHRlc3QgY2FzZXMsIHplcm8gbWVhbnMgaW5maW5pdGUuIE5lZWRlZCBmb3Iga2V5IHNpemVzID4gMTAyNFxuICAgICAgICBcbiAgICAgICAgZGVzY3JpYmUoJyNnZXRLZXkoKScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGl0KCdzaG91bGQgYmUgJytrZXlTaXplKycgYml0IGxvbmcnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGpzZS5nZXRLZXkoKTtcbiAgICAgICAgICAgICAgICB2YXIgbGVuZ3RoID0ga2V5Lm4uYml0TGVuZ3RoKCk7XG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gbGVuZ3RoJTI9PT0wID8gbGVuZ3RoOiBsZW5ndGgrMTtcbiAgICAgICAgICAgICAgICBleHBlY3QobGVuZ3RoKS50by5lcXVhbChrZXlTaXplKTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJyNlbmNyeXB0KCkgfCAjZGVjcnlwdCgpJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9Ub20gV3UncyBSU0EgT2JqZWN0IHVzZSBwYWRkaW5ncGtjcyAjMSwgdHlwZSAyXG4gICAgICAgICAgICB2YXIgbWF4TGVuZ3RoID0gKCgoanNlLmdldEtleSgpLm4uYml0TGVuZ3RoKCkrNyk+PjMpLTExKTtcbiAgICAgICAgICAgIHZhciBtYXhMZW5ndGhCaXQgPSBtYXhMZW5ndGggPDwgMztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBlbmNyeXB0L2RlY3J5cHQgdXAgdG8gJyttYXhMZW5ndGhCaXQrJyBiaXQnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxtYXhMZW5ndGg7aSsrKVxuICAgICAgICAgICAgICAgICAgICB0ZXN0LnB1c2goJ2EnKTtcbiAgICAgICAgICAgICAgICB0ZXN0ID0gdGVzdC5qb2luKCcnKTtcblxuICAgICAgICAgICAgICAgIHZhciBlbmNyeXB0ZWQgPSBqc2UuZW5jcnlwdCh0ZXN0KTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZW5jcnlwdGVkKS50by5iZS5vaygpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGRlY3J5cHRlZCA9IGpzZS5kZWNyeXB0KGVuY3J5cHRlZCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGRlY3J5cHRlZCkudG8uYmUodGVzdCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGZhaWwgdG8gZW5jcnlwdCBtb3JlIHRoYW4gJyttYXhMZW5ndGhCaXQrJyBiaXQnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPChtYXhMZW5ndGgrMSk7aSsrKVxuICAgICAgICAgICAgICAgICAgICB0ZXN0LnB1c2goJ2EnKTtcbiAgICAgICAgICAgICAgICB0ZXN0ID0gdGVzdC5qb2luKCcnKTtcblxuICAgICAgICAgICAgICAgIHZhciBlbmNyeXB0ZWQgPSBqc2UuZW5jcnlwdCh0ZXN0KTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZW5jcnlwdGVkKS50by5ub3QuYmUub2soKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgZGVzY3JpYmUoJyNnZXRQdWJsaWNLZXkoKScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBwa2V5ID0ganNlLmdldFB1YmxpY0tleSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGJlIGEgbm9uLWVtcHR5IHN0cmluZycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZXhwZWN0KHBrZXkpLnRvLmJlLmEoJ3N0cmluZycpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChwa2V5KS50by5ub3QuYmUuZW1wdHkoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpdCgnc2hvdWxkIGNvbnRhaW4gcHVibGljIGhlYWRlciBhbmQgZm9vdGVyIGFuZCBiZSB3cmFwcGVkIGF0IDY0IGNoYXJzJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvL0ZvciBzbWFsbCBiaXQga2V5cywgdGhlIHB1YmxpYyBrZXkgbWF5IGNvbnRhaW4gb25seSBvbmUgbGluZVxuICAgICAgICAgICAgICAgIHZhciByZWdleCA9IC8tLS0tLUJFR0lOIFBVQkxJQyBLRVktLS0tLVxcbigoLns2NH1cXG4pKyguezEsNjR9XFxuKT8pfCguezEsNjR9XFxuKS0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLS87XG4gICAgICAgICAgICAgICAgZXhwZWN0KHBrZXkpLnRvLm1hdGNoKHJlZ2V4KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBkZXNjcmliZSgnI2dldFByaXZhdGVLZXkoKScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBwa2V5ID0ganNlLmdldFByaXZhdGVLZXkoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGV4cGVjdChwa2V5KS50by5iZS5hKCdzdHJpbmcnKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocGtleSkudG8ubm90LmJlLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBjb250YWluIHByaXZhdGUgaGVhZGVyIGFuZCBmb290ZXIgYW5kIGJlIHdyYXBwZWQgYXQgNjQgY2hhcnMnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciByZWdleCA9IC8tLS0tLUJFR0lOIFJTQSBQUklWQVRFIEtFWS0tLS0tXFxuKC57NjR9XFxuKSsoLnsxLDY0fVxcbik/LS0tLS1FTkQgUlNBIFBSSVZBVEUgS0VZLS0tLS0vO1xuICAgICAgICAgICAgICAgIGV4cGVjdChwa2V5KS50by5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGRlc2NyaWJlKCcjZ2V0UHVibGljS2V5QjY0KCknLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgcGtleSA9IGpzZS5nZXRQdWJsaWNLZXlCNjQoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGV4cGVjdChwa2V5KS50by5iZS5hKCdzdHJpbmcnKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocGtleSkudG8ubm90LmJlLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBub3QgY29udGFpbiBwdWJsaWMgaGVhZGVyIGFuZCBmb290ZXIsb25lIGxpbmUsIGJhc2U2NCBlbmNvZGVkJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvL3JlZ2V4IHRvIG1hdGNoIGJhc2U2NCBlbmNvZGVkIHN0cmluZywgcmVmZXJlbmNlOlxuICAgICAgICAgICAgICAgIC8vaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTg4NTA5Ny8xNDQ2MzIxXG4gICAgICAgICAgICAgICAgdmFyIHJlZ2V4ID0gL14oPzpbQS1aYS16MC05Ky9dezR9KSooPzpbQS1aYS16MC05Ky9dezJ9PT18W0EtWmEtejAtOSsvXXszfT18W0EtWmEtejAtOSsvXXs0fSkkLztcbiAgICAgICAgICAgICAgICBleHBlY3QocGtleSkudG8ubWF0Y2gocmVnZXgpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBkZXNjcmliZSgnI2dldFByaXZhdGVLZXlCNjQoKScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBwa2V5ID0ganNlLmdldFByaXZhdGVLZXlCNjQoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGV4cGVjdChwa2V5KS50by5iZS5hKCdzdHJpbmcnKTtcbiAgICAgICAgICAgICAgICBleHBlY3QocGtleSkudG8ubm90LmJlLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBub3QgY29udGFpbiBwcml2YXRlIGhlYWRlciBhbmQgZm9vdGVyLG9uZSBsaW5lLCBiYXNlNjQgZW5jb2RlZCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy9yZWdleCB0byBtYXRjaCBiYXNlNjQgZW5jb2RlZCBzdHJpbmcsIHJlZmVyZW5jZTpcbiAgICAgICAgICAgICAgICAvL2h0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU4ODUwOTcvMTQ0NjMyMVxuICAgICAgICAgICAgICAgIHZhciByZWdleCA9IC9eKD86W0EtWmEtejAtOSsvXXs0fSkqKD86W0EtWmEtejAtOSsvXXsyfT09fFtBLVphLXowLTkrL117M309fFtBLVphLXowLTkrL117NH0pJC87XG4gICAgICAgICAgICAgICAgZXhwZWN0KHBrZXkpLnRvLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgZGVzY3JpYmUoJyNzZXRQcml2YXRlS2V5KCknLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgdG1wID0gbmV3IEpTRW5jcnlwdCgpO1xuICAgICAgICAgICAgdG1wLnNldFByaXZhdGVLZXkob3BlbnNzbF9wcml2YXRlX2tleSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGl0KCdzaG91bGQgY29ycmVjdGx5IHNldCB0aGUgcHJpdmF0ZSBrZXkgcGFyYW1ldGVycycsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0gWyduJywgJ2UnLCAnZCcsICdwJywgJ3EnLCAnZG1wMScsICdkbXExJywgJ2NvZWZmJ107XG4gICAgICAgICAgICAgICAgZXhwZWN0KHRtcC5rZXkpLnRvLmJlLm9rKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHRtcC5rZXkpLnRvLmhhdmUua2V5cyhwYXJhbXMpO1xuICAgICAgICAgICAgICAgIHBhcmFtcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLGluZGV4KXtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHRtcC5rZXlbdmFsdWVdKS50by5iZS5vaygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGl0KCdzaG91bGQgYm90aCBlbmNyeXB0IGFuZCBkZWNyeXB0JyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICB2YXIgdGVzdCA9ICd0ZXN0JztcbiAgICAgICAgICAgICAgIHZhciBlbmMgPSB0bXAuZW5jcnlwdCh0ZXN0KTtcbiAgICAgICAgICAgICAgIGV4cGVjdChlbmMpLnRvLmJlLm9rKCk7XG4gICAgICAgICAgICAgICB2YXIgZGVjID0gdG1wLmRlY3J5cHQoZW5jKTtcbiAgICAgICAgICAgICAgIGV4cGVjdChkZWMpLnRvLmJlKHRlc3QpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBkZXNjcmliZSgnI3NldFB1YmxpY0tleSgpJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHRtcCA9IG5ldyBKU0VuY3J5cHQoKTtcbiAgICAgICAgICAgIHRtcC5zZXRQdWJsaWNLZXkob3BlbnNzbF9wdWJsaWNfa2V5KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBjb3JyZWN0bHkgc2V0IHRoZSBwdWJsaWMga2V5IHBhcmFtZXRlcnMnLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIHB1Yl9wYXJhbXMgPSBbJ24nLCAnZSddO1xuICAgICAgICAgICAgICAgIHZhciBwcml2X3BhcmFtcyA9IFsnZCcsICdwJywgJ3EnLCAnZG1wMScsICdkbXExJywgJ2NvZWZmJ107XG4gICAgICAgICAgICAgICAgZXhwZWN0KHRtcC5rZXkpLnRvLmJlLm9rKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KHRtcC5rZXkpLnRvLmhhdmUua2V5cyhwdWJfcGFyYW1zKTtcbiAgICAgICAgICAgICAgICBwdWJfcGFyYW1zLmZvckVhY2goZnVuY3Rpb24odmFsdWUsaW5kZXgpe1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QodG1wLmtleVt2YWx1ZV0pLnRvLmJlLm9rKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcHJpdl9wYXJhbXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSxpbmRleCl7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdCh0bXAua2V5W3ZhbHVlXSkudG8ubm90LmJlLm9rKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaXQoJ3Nob3VsZCBvbmx5IGVuY3J5cHQnLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gJ3Rlc3QnO1xuICAgICAgICAgICAgICAgdmFyIGVuYyA9IHRtcC5lbmNyeXB0KHRlc3QpO1xuICAgICAgICAgICAgICAgdmFyIGRlYyA9IHRtcC5kZWNyeXB0KGVuYyk7XG4gICAgICAgICAgICAgICBleHBlY3QoZW5jKS50by5iZS5vaygpO1xuICAgICAgICAgICAgICAgZXhwZWN0KGRlYykudG8ubm90LmJlLm9rKCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgfSk7XG4gICAgXG59KTtcblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi90ZXN0L3Rlc3QucnNhLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7YjY0dG9oZXgsIGhleDJiNjR9IGZyb20gXCIuLi9saWIvanNibi9iYXNlNjRcIjtcbmltcG9ydCB7SlNFbmNyeXB0UlNBS2V5fSBmcm9tIFwiLi9KU0VuY3J5cHRSU0FLZXlcIjtcblxuXG5pbnRlcmZhY2UgSUpTRW5jcnlwdE9wdGlvbnMge1xuICAgIGRlZmF1bHRfa2V5X3NpemU/OnN0cmluZztcbiAgICBkZWZhdWx0X3B1YmxpY19leHBvbmVudD86c3RyaW5nO1xuICAgIGxvZz86Ym9vbGVhbjtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zID0ge31dIC0gQW4gb2JqZWN0IHRvIGN1c3RvbWl6ZSBKU0VuY3J5cHQgYmVoYXZpb3VyXG4gKiBwb3NzaWJsZSBwYXJhbWV0ZXJzIGFyZTpcbiAqIC0gZGVmYXVsdF9rZXlfc2l6ZSAgICAgICAge251bWJlcn0gIGRlZmF1bHQ6IDEwMjQgdGhlIGtleSBzaXplIGluIGJpdFxuICogLSBkZWZhdWx0X3B1YmxpY19leHBvbmVudCB7c3RyaW5nfSAgZGVmYXVsdDogJzAxMDAwMScgdGhlIGhleGFkZWNpbWFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBwdWJsaWMgZXhwb25lbnRcbiAqIC0gbG9nICAgICAgICAgICAgICAgICAgICAge2Jvb2xlYW59IGRlZmF1bHQ6IGZhbHNlIHdoZXRoZXIgbG9nIHdhcm4vZXJyb3Igb3Igbm90XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIEpTRW5jcnlwdCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9uczpJSlNFbmNyeXB0T3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgdGhpcy5kZWZhdWx0X2tleV9zaXplID0gcGFyc2VJbnQob3B0aW9ucy5kZWZhdWx0X2tleV9zaXplLCAxMCkgfHwgMTAyNDtcbiAgICAgICAgdGhpcy5kZWZhdWx0X3B1YmxpY19leHBvbmVudCA9IG9wdGlvbnMuZGVmYXVsdF9wdWJsaWNfZXhwb25lbnQgfHwgXCIwMTAwMDFcIjsgLy8gNjU1MzcgZGVmYXVsdCBvcGVuc3NsIHB1YmxpYyBleHBvbmVudCBmb3IgcnNhIGtleSB0eXBlXG4gICAgICAgIHRoaXMubG9nID0gb3B0aW9ucy5sb2cgfHwgZmFsc2U7XG4gICAgICAgIC8vIFRoZSBwcml2YXRlIGFuZCBwdWJsaWMga2V5LlxuICAgICAgICB0aGlzLmtleSA9IG51bGw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWZhdWx0X2tleV9zaXplOm51bWJlcjtcbiAgICBwcml2YXRlIGRlZmF1bHRfcHVibGljX2V4cG9uZW50OnN0cmluZztcbiAgICBwcml2YXRlIGxvZzpib29sZWFuO1xuICAgIHByaXZhdGUga2V5OkpTRW5jcnlwdFJTQUtleTtcblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCB0byBzZXQgdGhlIHJzYSBrZXkgcGFyYW1ldGVyIChvbmUgbWV0aG9kIGlzIGVub3VnaCB0byBzZXQgYm90aCB0aGUgcHVibGljXG4gICAgICogYW5kIHRoZSBwcml2YXRlIGtleSwgc2luY2UgdGhlIHByaXZhdGUga2V5IGNvbnRhaW5zIHRoZSBwdWJsaWMga2V5IHBhcmFtZW50ZXJzKVxuICAgICAqIExvZyBhIHdhcm5pbmcgaWYgbG9ncyBhcmUgZW5hYmxlZFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30ga2V5IHRoZSBwZW0gZW5jb2RlZCBzdHJpbmcgb3IgYW4gb2JqZWN0ICh3aXRoIG9yIHdpdGhvdXQgaGVhZGVyL2Zvb3RlcilcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgcHVibGljIHNldEtleShrZXk6c3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLmxvZyAmJiB0aGlzLmtleSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQSBrZXkgd2FzIGFscmVhZHkgc2V0LCBvdmVycmlkaW5nIGV4aXN0aW5nLlwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtleSA9IG5ldyBKU0VuY3J5cHRSU0FLZXkoa2V5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm94eSBtZXRob2QgZm9yIHNldEtleSwgZm9yIGFwaSBjb21wYXRpYmlsaXR5XG4gICAgICogQHNlZSBzZXRLZXlcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgcHVibGljIHNldFByaXZhdGVLZXkocHJpdmtleTpzdHJpbmcpIHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBrZXkuXG4gICAgICAgIHRoaXMuc2V0S2V5KHByaXZrZXkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb3h5IG1ldGhvZCBmb3Igc2V0S2V5LCBmb3IgYXBpIGNvbXBhdGliaWxpdHlcbiAgICAgKiBAc2VlIHNldEtleVxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0UHVibGljS2V5KHB1YmtleTpzdHJpbmcpIHtcbiAgICAgICAgLy8gU2V0cyB0aGUgcHVibGljIGtleS5cbiAgICAgICAgdGhpcy5zZXRLZXkocHVia2V5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm94eSBtZXRob2QgZm9yIFJTQUtleSBvYmplY3QncyBkZWNyeXB0LCBkZWNyeXB0IHRoZSBzdHJpbmcgdXNpbmcgdGhlIHByaXZhdGVcbiAgICAgKiBjb21wb25lbnRzIG9mIHRoZSByc2Ega2V5IG9iamVjdC4gTm90ZSB0aGF0IGlmIHRoZSBvYmplY3Qgd2FzIG5vdCBzZXQgd2lsbCBiZSBjcmVhdGVkXG4gICAgICogb24gdGhlIGZseSAoYnkgdGhlIGdldEtleSBtZXRob2QpIHVzaW5nIHRoZSBwYXJhbWV0ZXJzIHBhc3NlZCBpbiB0aGUgSlNFbmNyeXB0IGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciBiYXNlNjQgZW5jb2RlZCBjcnlwdGVkIHN0cmluZyB0byBkZWNyeXB0XG4gICAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgZGVjcnlwdGVkIHN0cmluZ1xuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVjcnlwdChzdHI6c3RyaW5nKSB7XG4gICAgICAgIC8vIFJldHVybiB0aGUgZGVjcnlwdGVkIHN0cmluZy5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEtleSgpLmRlY3J5cHQoYjY0dG9oZXgoc3RyKSk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm94eSBtZXRob2QgZm9yIFJTQUtleSBvYmplY3QncyBlbmNyeXB0LCBlbmNyeXB0IHRoZSBzdHJpbmcgdXNpbmcgdGhlIHB1YmxpY1xuICAgICAqIGNvbXBvbmVudHMgb2YgdGhlIHJzYSBrZXkgb2JqZWN0LiBOb3RlIHRoYXQgaWYgdGhlIG9iamVjdCB3YXMgbm90IHNldCB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBvbiB0aGUgZmx5IChieSB0aGUgZ2V0S2V5IG1ldGhvZCkgdXNpbmcgdGhlIHBhcmFtZXRlcnMgcGFzc2VkIGluIHRoZSBKU0VuY3J5cHQgY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIHRoZSBzdHJpbmcgdG8gZW5jcnlwdFxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gdGhlIGVuY3J5cHRlZCBzdHJpbmcgZW5jb2RlZCBpbiBiYXNlNjRcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgcHVibGljIGVuY3J5cHQoc3RyOnN0cmluZykge1xuICAgICAgICAvLyBSZXR1cm4gdGhlIGVuY3J5cHRlZCBzdHJpbmcuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gaGV4MmI2NCh0aGlzLmdldEtleSgpLmVuY3J5cHQoc3RyKSk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXR0ZXIgZm9yIHRoZSBjdXJyZW50IEpTRW5jcnlwdFJTQUtleSBvYmplY3QuIElmIGl0IGRvZXNuJ3QgZXhpc3RzIGEgbmV3IG9iamVjdFxuICAgICAqIHdpbGwgYmUgY3JlYXRlZCBhbmQgcmV0dXJuZWRcbiAgICAgKiBAcGFyYW0ge2NhbGxiYWNrfSBbY2JdIHRoZSBjYWxsYmFjayB0byBiZSBjYWxsZWQgaWYgd2Ugd2FudCB0aGUga2V5IHRvIGJlIGdlbmVyYXRlZFxuICAgICAqIGluIGFuIGFzeW5jIGZhc2hpb25cbiAgICAgKiBAcmV0dXJucyB7SlNFbmNyeXB0UlNBS2V5fSB0aGUgSlNFbmNyeXB0UlNBS2V5IG9iamVjdFxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0S2V5KGNiPzooKSA9PiB2b2lkKSB7XG4gICAgICAgIC8vIE9ubHkgY3JlYXRlIG5ldyBpZiBpdCBkb2VzIG5vdCBleGlzdC5cbiAgICAgICAgaWYgKCF0aGlzLmtleSkge1xuICAgICAgICAgICAgLy8gR2V0IGEgbmV3IHByaXZhdGUga2V5LlxuICAgICAgICAgICAgdGhpcy5rZXkgPSBuZXcgSlNFbmNyeXB0UlNBS2V5KCk7XG4gICAgICAgICAgICBpZiAoY2IgJiYge30udG9TdHJpbmcuY2FsbChjYikgPT09IFwiW29iamVjdCBGdW5jdGlvbl1cIikge1xuICAgICAgICAgICAgICAgIHRoaXMua2V5LmdlbmVyYXRlQXN5bmModGhpcy5kZWZhdWx0X2tleV9zaXplLCB0aGlzLmRlZmF1bHRfcHVibGljX2V4cG9uZW50LCBjYik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gR2VuZXJhdGUgdGhlIGtleS5cbiAgICAgICAgICAgIHRoaXMua2V5LmdlbmVyYXRlKHRoaXMuZGVmYXVsdF9rZXlfc2l6ZSwgdGhpcy5kZWZhdWx0X3B1YmxpY19leHBvbmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMua2V5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHBlbSBlbmNvZGVkIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBwcml2YXRlIGtleVxuICAgICAqIElmIHRoZSBrZXkgZG9lc24ndCBleGlzdHMgYSBuZXcga2V5IHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IHBlbSBlbmNvZGVkIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBwcml2YXRlIGtleSBXSVRIIGhlYWRlciBhbmQgZm9vdGVyXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIHB1YmxpYyBnZXRQcml2YXRlS2V5KCkge1xuICAgICAgICAvLyBSZXR1cm4gdGhlIHByaXZhdGUgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBrZXkuXG4gICAgICAgIHJldHVybiB0aGlzLmdldEtleSgpLmdldFByaXZhdGVLZXkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBwZW0gZW5jb2RlZCByZXByZXNlbnRhdGlvbiBvZiB0aGUgcHJpdmF0ZSBrZXlcbiAgICAgKiBJZiB0aGUga2V5IGRvZXNuJ3QgZXhpc3RzIGEgbmV3IGtleSB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBwZW0gZW5jb2RlZCByZXByZXNlbnRhdGlvbiBvZiB0aGUgcHJpdmF0ZSBrZXkgV0lUSE9VVCBoZWFkZXIgYW5kIGZvb3RlclxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0UHJpdmF0ZUtleUI2NCgpIHtcbiAgICAgICAgLy8gUmV0dXJuIHRoZSBwcml2YXRlIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMga2V5LlxuICAgICAgICByZXR1cm4gdGhpcy5nZXRLZXkoKS5nZXRQcml2YXRlQmFzZUtleUI2NCgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgcGVtIGVuY29kZWQgcmVwcmVzZW50YXRpb24gb2YgdGhlIHB1YmxpYyBrZXlcbiAgICAgKiBJZiB0aGUga2V5IGRvZXNuJ3QgZXhpc3RzIGEgbmV3IGtleSB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBwZW0gZW5jb2RlZCByZXByZXNlbnRhdGlvbiBvZiB0aGUgcHVibGljIGtleSBXSVRIIGhlYWRlciBhbmQgZm9vdGVyXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIHB1YmxpYyBnZXRQdWJsaWNLZXkoKSB7XG4gICAgICAgIC8vIFJldHVybiB0aGUgcHJpdmF0ZSByZXByZXNlbnRhdGlvbiBvZiB0aGlzIGtleS5cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0S2V5KCkuZ2V0UHVibGljS2V5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgcGVtIGVuY29kZWQgcmVwcmVzZW50YXRpb24gb2YgdGhlIHB1YmxpYyBrZXlcbiAgICAgKiBJZiB0aGUga2V5IGRvZXNuJ3QgZXhpc3RzIGEgbmV3IGtleSB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBwZW0gZW5jb2RlZCByZXByZXNlbnRhdGlvbiBvZiB0aGUgcHVibGljIGtleSBXSVRIT1VUIGhlYWRlciBhbmQgZm9vdGVyXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIHB1YmxpYyBnZXRQdWJsaWNLZXlCNjQoKSB7XG4gICAgICAgIC8vIFJldHVybiB0aGUgcHJpdmF0ZSByZXByZXNlbnRhdGlvbiBvZiB0aGlzIGtleS5cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0S2V5KCkuZ2V0UHVibGljQmFzZUtleUI2NCgpO1xuICAgIH1cbn1cblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0pTRW5jcnlwdC50cyIsImltcG9ydCB7aGV4MmI2NH0gZnJvbSBcIi4uL2xpYi9qc2JuL2Jhc2U2NFwiO1xuaW1wb3J0IHtIZXh9IGZyb20gXCIuLi9saWIvYXNuMWpzL2hleFwiO1xuaW1wb3J0IHtCYXNlNjR9IGZyb20gXCIuLi9saWIvYXNuMWpzL2Jhc2U2NFwiO1xuaW1wb3J0IHtBU04xfSBmcm9tIFwiLi4vbGliL2FzbjFqcy9hc24xXCI7XG5pbXBvcnQge1JTQUtleX0gZnJvbSBcIi4uL2xpYi9qc2JuL3JzYVwiO1xuaW1wb3J0IHtwYXJzZUJpZ0ludH0gZnJvbSBcIi4uL2xpYi9qc2JuL2pzYm5cIjtcbmltcG9ydCB7S0pVUn0gZnJvbSBcIi4uL2xpYi9qc3JzYXNpZ24vYXNuMS0xLjBcIjtcblxuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBKU0VuY3J5cHRSU0FLZXkgdGhhdCBleHRlbmRzIFRvbSBXdSdzIFJTQSBrZXkgb2JqZWN0LlxuICogVGhpcyBvYmplY3QgaXMganVzdCBhIGRlY29yYXRvciBmb3IgcGFyc2luZyB0aGUga2V5IHBhcmFtZXRlclxuICogQHBhcmFtIHtzdHJpbmd8T2JqZWN0fSBrZXkgLSBUaGUga2V5IGluIHN0cmluZyBmb3JtYXQsIG9yIGFuIG9iamVjdCBjb250YWluaW5nXG4gKiB0aGUgcGFyYW1ldGVycyBuZWVkZWQgdG8gYnVpbGQgYSBSU0FLZXkgb2JqZWN0LlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBKU0VuY3J5cHRSU0FLZXkgZXh0ZW5kcyBSU0FLZXkge1xuICAgIGNvbnN0cnVjdG9yKGtleT86c3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIC8vIENhbGwgdGhlIHN1cGVyIGNvbnN0cnVjdG9yLlxuICAgICAgICAvLyAgUlNBS2V5LmNhbGwodGhpcyk7XG4gICAgICAgIC8vIElmIGEga2V5IGtleSB3YXMgcHJvdmlkZWQuXG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSBzdHJpbmcuLi5cbiAgICAgICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJzZUtleShrZXkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICBKU0VuY3J5cHRSU0FLZXkuaGFzUHJpdmF0ZUtleVByb3BlcnR5KGtleSkgfHxcbiAgICAgICAgICAgICAgICBKU0VuY3J5cHRSU0FLZXkuaGFzUHVibGljS2V5UHJvcGVydHkoa2V5KVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gU2V0IHRoZSB2YWx1ZXMgZm9yIHRoZSBrZXkuXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJzZVByb3BlcnRpZXNGcm9tKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgdG8gcGFyc2UgYSBwZW0gZW5jb2RlZCBzdHJpbmcgY29udGFpbmluZyBib3RoIGEgcHVibGljIG9yIHByaXZhdGUga2V5LlxuICAgICAqIFRoZSBtZXRob2Qgd2lsbCB0cmFuc2xhdGUgdGhlIHBlbSBlbmNvZGVkIHN0cmluZyBpbiBhIGRlciBlbmNvZGVkIHN0cmluZyBhbmRcbiAgICAgKiB3aWxsIHBhcnNlIHByaXZhdGUga2V5IGFuZCBwdWJsaWMga2V5IHBhcmFtZXRlcnMuIFRoaXMgbWV0aG9kIGFjY2VwdHMgcHVibGljIGtleVxuICAgICAqIGluIHRoZSByc2FlbmNyeXB0aW9uIHBrY3MgIzEgZm9ybWF0IChvaWQ6IDEuMi44NDAuMTEzNTQ5LjEuMS4xKS5cbiAgICAgKlxuICAgICAqIEB0b2RvIENoZWNrIGhvdyBtYW55IHJzYSBmb3JtYXRzIHVzZSB0aGUgc2FtZSBmb3JtYXQgb2YgcGtjcyAjMS5cbiAgICAgKlxuICAgICAqIFRoZSBmb3JtYXQgaXMgZGVmaW5lZCBhczpcbiAgICAgKiBQdWJsaWNLZXlJbmZvIDo6PSBTRVFVRU5DRSB7XG4gICAgICogICBhbGdvcml0aG0gICAgICAgQWxnb3JpdGhtSWRlbnRpZmllcixcbiAgICAgKiAgIFB1YmxpY0tleSAgICAgICBCSVQgU1RSSU5HXG4gICAgICogfVxuICAgICAqIFdoZXJlIEFsZ29yaXRobUlkZW50aWZpZXIgaXM6XG4gICAgICogQWxnb3JpdGhtSWRlbnRpZmllciA6Oj0gU0VRVUVOQ0Uge1xuICAgICAqICAgYWxnb3JpdGhtICAgICAgIE9CSkVDVCBJREVOVElGSUVSLCAgICAgdGhlIE9JRCBvZiB0aGUgZW5jIGFsZ29yaXRobVxuICAgICAqICAgcGFyYW1ldGVycyAgICAgIEFOWSBERUZJTkVEIEJZIGFsZ29yaXRobSBPUFRJT05BTCAoTlVMTCBmb3IgUEtDUyAjMSlcbiAgICAgKiB9XG4gICAgICogYW5kIFB1YmxpY0tleSBpcyBhIFNFUVVFTkNFIGVuY2Fwc3VsYXRlZCBpbiBhIEJJVCBTVFJJTkdcbiAgICAgKiBSU0FQdWJsaWNLZXkgOjo9IFNFUVVFTkNFIHtcbiAgICAgKiAgIG1vZHVsdXMgICAgICAgICAgIElOVEVHRVIsICAtLSBuXG4gICAgICogICBwdWJsaWNFeHBvbmVudCAgICBJTlRFR0VSICAgLS0gZVxuICAgICAqIH1cbiAgICAgKiBpdCdzIHBvc3NpYmxlIHRvIGV4YW1pbmUgdGhlIHN0cnVjdHVyZSBvZiB0aGUga2V5cyBvYnRhaW5lZCBmcm9tIG9wZW5zc2wgdXNpbmdcbiAgICAgKiBhbiBhc24uMSBkdW1wZXIgYXMgdGhlIG9uZSB1c2VkIGhlcmUgdG8gcGFyc2UgdGhlIGNvbXBvbmVudHM6IGh0dHA6Ly9sYXBvLml0L2FzbjFqcy9cbiAgICAgKiBAYXJndW1lbnQge3N0cmluZ30gcGVtIHRoZSBwZW0gZW5jb2RlZCBzdHJpbmcsIGNhbiBpbmNsdWRlIHRoZSBCRUdJTi9FTkQgaGVhZGVyL2Zvb3RlclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcHVibGljIHBhcnNlS2V5KHBlbTpzdHJpbmcpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBtb2R1bHVzOnN0cmluZyB8IG51bWJlciA9IDA7XG4gICAgICAgICAgICBsZXQgcHVibGljX2V4cG9uZW50OnN0cmluZyB8IG51bWJlciA9IDA7XG4gICAgICAgICAgICBjb25zdCByZUhleCA9IC9eXFxzKig/OlswLTlBLUZhLWZdWzAtOUEtRmEtZl1cXHMqKSskLztcbiAgICAgICAgICAgIGNvbnN0IGRlciA9IHJlSGV4LnRlc3QocGVtKSA/IEhleC5kZWNvZGUocGVtKSA6IEJhc2U2NC51bmFybW9yKHBlbSk7XG4gICAgICAgICAgICBsZXQgYXNuMSA9IEFTTjEuZGVjb2RlKGRlcik7XG5cbiAgICAgICAgICAgIC8vIEZpeGVzIGEgYnVnIHdpdGggT3BlblNTTCAxLjArIHByaXZhdGUga2V5c1xuICAgICAgICAgICAgaWYgKGFzbjEuc3ViLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgIGFzbjEgPSBhc24xLnN1YlsyXS5zdWJbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYXNuMS5zdWIubGVuZ3RoID09PSA5KSB7XG5cbiAgICAgICAgICAgICAgICAvLyBQYXJzZSB0aGUgcHJpdmF0ZSBrZXkuXG4gICAgICAgICAgICAgICAgbW9kdWx1cyA9IGFzbjEuc3ViWzFdLmdldEhleFN0cmluZ1ZhbHVlKCk7IC8vIGJpZ2ludFxuICAgICAgICAgICAgICAgIHRoaXMubiA9IHBhcnNlQmlnSW50KG1vZHVsdXMsIDE2KTtcblxuICAgICAgICAgICAgICAgIHB1YmxpY19leHBvbmVudCA9IGFzbjEuc3ViWzJdLmdldEhleFN0cmluZ1ZhbHVlKCk7IC8vIGludFxuICAgICAgICAgICAgICAgIHRoaXMuZSA9IHBhcnNlSW50KHB1YmxpY19leHBvbmVudCwgMTYpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcHJpdmF0ZV9leHBvbmVudCA9IGFzbjEuc3ViWzNdLmdldEhleFN0cmluZ1ZhbHVlKCk7IC8vIGJpZ2ludFxuICAgICAgICAgICAgICAgIHRoaXMuZCA9IHBhcnNlQmlnSW50KHByaXZhdGVfZXhwb25lbnQsIDE2KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHByaW1lMSA9IGFzbjEuc3ViWzRdLmdldEhleFN0cmluZ1ZhbHVlKCk7IC8vIGJpZ2ludFxuICAgICAgICAgICAgICAgIHRoaXMucCA9IHBhcnNlQmlnSW50KHByaW1lMSwgMTYpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcHJpbWUyID0gYXNuMS5zdWJbNV0uZ2V0SGV4U3RyaW5nVmFsdWUoKTsgLy8gYmlnaW50XG4gICAgICAgICAgICAgICAgdGhpcy5xID0gcGFyc2VCaWdJbnQocHJpbWUyLCAxNik7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBleHBvbmVudDEgPSBhc24xLnN1Yls2XS5nZXRIZXhTdHJpbmdWYWx1ZSgpOyAvLyBiaWdpbnRcbiAgICAgICAgICAgICAgICB0aGlzLmRtcDEgPSBwYXJzZUJpZ0ludChleHBvbmVudDEsIDE2KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cG9uZW50MiA9IGFzbjEuc3ViWzddLmdldEhleFN0cmluZ1ZhbHVlKCk7IC8vIGJpZ2ludFxuICAgICAgICAgICAgICAgIHRoaXMuZG1xMSA9IHBhcnNlQmlnSW50KGV4cG9uZW50MiwgMTYpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgY29lZmZpY2llbnQgPSBhc24xLnN1Yls4XS5nZXRIZXhTdHJpbmdWYWx1ZSgpOyAvLyBiaWdpbnRcbiAgICAgICAgICAgICAgICB0aGlzLmNvZWZmID0gcGFyc2VCaWdJbnQoY29lZmZpY2llbnQsIDE2KTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChhc24xLnN1Yi5sZW5ndGggPT09IDIpIHtcblxuICAgICAgICAgICAgICAgIC8vIFBhcnNlIHRoZSBwdWJsaWMga2V5LlxuICAgICAgICAgICAgICAgIGNvbnN0IGJpdF9zdHJpbmcgPSBhc24xLnN1YlsxXTtcbiAgICAgICAgICAgICAgICBjb25zdCBzZXF1ZW5jZSA9IGJpdF9zdHJpbmcuc3ViWzBdO1xuXG4gICAgICAgICAgICAgICAgbW9kdWx1cyA9IHNlcXVlbmNlLnN1YlswXS5nZXRIZXhTdHJpbmdWYWx1ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMubiA9IHBhcnNlQmlnSW50KG1vZHVsdXMsIDE2KTtcbiAgICAgICAgICAgICAgICBwdWJsaWNfZXhwb25lbnQgPSBzZXF1ZW5jZS5zdWJbMV0uZ2V0SGV4U3RyaW5nVmFsdWUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmUgPSBwYXJzZUludChwdWJsaWNfZXhwb25lbnQsIDE2KTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYW5zbGF0ZSByc2EgcGFyYW1ldGVycyBpbiBhIGhleCBlbmNvZGVkIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHJzYSBrZXkuXG4gICAgICpcbiAgICAgKiBUaGUgdHJhbnNsYXRpb24gZm9sbG93IHRoZSBBU04uMSBub3RhdGlvbiA6XG4gICAgICogUlNBUHJpdmF0ZUtleSA6Oj0gU0VRVUVOQ0Uge1xuICAgICAqICAgdmVyc2lvbiAgICAgICAgICAgVmVyc2lvbixcbiAgICAgKiAgIG1vZHVsdXMgICAgICAgICAgIElOVEVHRVIsICAtLSBuXG4gICAgICogICBwdWJsaWNFeHBvbmVudCAgICBJTlRFR0VSLCAgLS0gZVxuICAgICAqICAgcHJpdmF0ZUV4cG9uZW50ICAgSU5URUdFUiwgIC0tIGRcbiAgICAgKiAgIHByaW1lMSAgICAgICAgICAgIElOVEVHRVIsICAtLSBwXG4gICAgICogICBwcmltZTIgICAgICAgICAgICBJTlRFR0VSLCAgLS0gcVxuICAgICAqICAgZXhwb25lbnQxICAgICAgICAgSU5URUdFUiwgIC0tIGQgbW9kIChwMSlcbiAgICAgKiAgIGV4cG9uZW50MiAgICAgICAgIElOVEVHRVIsICAtLSBkIG1vZCAocS0xKVxuICAgICAqICAgY29lZmZpY2llbnQgICAgICAgSU5URUdFUiwgIC0tIChpbnZlcnNlIG9mIHEpIG1vZCBwXG4gICAgICogfVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9ICBERVIgRW5jb2RlZCBTdHJpbmcgcmVwcmVzZW50aW5nIHRoZSByc2EgcHJpdmF0ZSBrZXlcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRQcml2YXRlQmFzZUtleSgpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGFycmF5OiBbXG4gICAgICAgICAgICAgICAgbmV3IEtKVVIuYXNuMS5ERVJJbnRlZ2VyKHtpbnQ6IDB9KSxcbiAgICAgICAgICAgICAgICBuZXcgS0pVUi5hc24xLkRFUkludGVnZXIoe2JpZ2ludDogdGhpcy5ufSksXG4gICAgICAgICAgICAgICAgbmV3IEtKVVIuYXNuMS5ERVJJbnRlZ2VyKHtpbnQ6IHRoaXMuZX0pLFxuICAgICAgICAgICAgICAgIG5ldyBLSlVSLmFzbjEuREVSSW50ZWdlcih7YmlnaW50OiB0aGlzLmR9KSxcbiAgICAgICAgICAgICAgICBuZXcgS0pVUi5hc24xLkRFUkludGVnZXIoe2JpZ2ludDogdGhpcy5wfSksXG4gICAgICAgICAgICAgICAgbmV3IEtKVVIuYXNuMS5ERVJJbnRlZ2VyKHtiaWdpbnQ6IHRoaXMucX0pLFxuICAgICAgICAgICAgICAgIG5ldyBLSlVSLmFzbjEuREVSSW50ZWdlcih7YmlnaW50OiB0aGlzLmRtcDF9KSxcbiAgICAgICAgICAgICAgICBuZXcgS0pVUi5hc24xLkRFUkludGVnZXIoe2JpZ2ludDogdGhpcy5kbXExfSksXG4gICAgICAgICAgICAgICAgbmV3IEtKVVIuYXNuMS5ERVJJbnRlZ2VyKHtiaWdpbnQ6IHRoaXMuY29lZmZ9KVxuICAgICAgICAgICAgXVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBzZXEgPSBuZXcgS0pVUi5hc24xLkRFUlNlcXVlbmNlKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gc2VxLmdldEVuY29kZWRIZXgoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBiYXNlNjQgKHBlbSkgZW5jb2RlZCB2ZXJzaW9uIG9mIHRoZSBERVIgZW5jb2RlZCByZXByZXNlbnRhdGlvblxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IHBlbSBlbmNvZGVkIHJlcHJlc2VudGF0aW9uIHdpdGhvdXQgaGVhZGVyIGFuZCBmb290ZXJcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgcHVibGljIGdldFByaXZhdGVCYXNlS2V5QjY0KCkge1xuICAgICAgICByZXR1cm4gaGV4MmI2NCh0aGlzLmdldFByaXZhdGVCYXNlS2V5KCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYW5zbGF0ZSByc2EgcGFyYW1ldGVycyBpbiBhIGhleCBlbmNvZGVkIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHJzYSBwdWJsaWMga2V5LlxuICAgICAqIFRoZSByZXByZXNlbnRhdGlvbiBmb2xsb3cgdGhlIEFTTi4xIG5vdGF0aW9uIDpcbiAgICAgKiBQdWJsaWNLZXlJbmZvIDo6PSBTRVFVRU5DRSB7XG4gICAgICogICBhbGdvcml0aG0gICAgICAgQWxnb3JpdGhtSWRlbnRpZmllcixcbiAgICAgKiAgIFB1YmxpY0tleSAgICAgICBCSVQgU1RSSU5HXG4gICAgICogfVxuICAgICAqIFdoZXJlIEFsZ29yaXRobUlkZW50aWZpZXIgaXM6XG4gICAgICogQWxnb3JpdGhtSWRlbnRpZmllciA6Oj0gU0VRVUVOQ0Uge1xuICAgICAqICAgYWxnb3JpdGhtICAgICAgIE9CSkVDVCBJREVOVElGSUVSLCAgICAgdGhlIE9JRCBvZiB0aGUgZW5jIGFsZ29yaXRobVxuICAgICAqICAgcGFyYW1ldGVycyAgICAgIEFOWSBERUZJTkVEIEJZIGFsZ29yaXRobSBPUFRJT05BTCAoTlVMTCBmb3IgUEtDUyAjMSlcbiAgICAgKiB9XG4gICAgICogYW5kIFB1YmxpY0tleSBpcyBhIFNFUVVFTkNFIGVuY2Fwc3VsYXRlZCBpbiBhIEJJVCBTVFJJTkdcbiAgICAgKiBSU0FQdWJsaWNLZXkgOjo9IFNFUVVFTkNFIHtcbiAgICAgKiAgIG1vZHVsdXMgICAgICAgICAgIElOVEVHRVIsICAtLSBuXG4gICAgICogICBwdWJsaWNFeHBvbmVudCAgICBJTlRFR0VSICAgLS0gZVxuICAgICAqIH1cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBERVIgRW5jb2RlZCBTdHJpbmcgcmVwcmVzZW50aW5nIHRoZSByc2EgcHVibGljIGtleVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcHVibGljIGdldFB1YmxpY0Jhc2VLZXkoKSB7XG4gICAgICAgIGNvbnN0IGZpcnN0X3NlcXVlbmNlID0gbmV3IEtKVVIuYXNuMS5ERVJTZXF1ZW5jZSh7XG4gICAgICAgICAgICBhcnJheTogW1xuICAgICAgICAgICAgICAgIG5ldyBLSlVSLmFzbjEuREVST2JqZWN0SWRlbnRpZmllcih7b2lkOiBcIjEuMi44NDAuMTEzNTQ5LjEuMS4xXCJ9KSwgLy8gUlNBIEVuY3J5cHRpb24gcGtjcyAjMSBvaWRcbiAgICAgICAgICAgICAgICBuZXcgS0pVUi5hc24xLkRFUk51bGwoKVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBzZWNvbmRfc2VxdWVuY2UgPSBuZXcgS0pVUi5hc24xLkRFUlNlcXVlbmNlKHtcbiAgICAgICAgICAgIGFycmF5OiBbXG4gICAgICAgICAgICAgICAgbmV3IEtKVVIuYXNuMS5ERVJJbnRlZ2VyKHtiaWdpbnQ6IHRoaXMubn0pLFxuICAgICAgICAgICAgICAgIG5ldyBLSlVSLmFzbjEuREVSSW50ZWdlcih7aW50OiB0aGlzLmV9KVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBiaXRfc3RyaW5nID0gbmV3IEtKVVIuYXNuMS5ERVJCaXRTdHJpbmcoe1xuICAgICAgICAgICAgaGV4OiBcIjAwXCIgKyBzZWNvbmRfc2VxdWVuY2UuZ2V0RW5jb2RlZEhleCgpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHNlcSA9IG5ldyBLSlVSLmFzbjEuREVSU2VxdWVuY2Uoe1xuICAgICAgICAgICAgYXJyYXk6IFtcbiAgICAgICAgICAgICAgICBmaXJzdF9zZXF1ZW5jZSxcbiAgICAgICAgICAgICAgICBiaXRfc3RyaW5nXG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gc2VxLmdldEVuY29kZWRIZXgoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBiYXNlNjQgKHBlbSkgZW5jb2RlZCB2ZXJzaW9uIG9mIHRoZSBERVIgZW5jb2RlZCByZXByZXNlbnRhdGlvblxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IHBlbSBlbmNvZGVkIHJlcHJlc2VudGF0aW9uIHdpdGhvdXQgaGVhZGVyIGFuZCBmb290ZXJcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgcHVibGljIGdldFB1YmxpY0Jhc2VLZXlCNjQoKSB7XG4gICAgICAgIHJldHVybiBoZXgyYjY0KHRoaXMuZ2V0UHVibGljQmFzZUtleSgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB3cmFwIHRoZSBzdHJpbmcgaW4gYmxvY2sgb2Ygd2lkdGggY2hhcnMuIFRoZSBkZWZhdWx0IHZhbHVlIGZvciByc2Ega2V5cyBpcyA2NFxuICAgICAqIGNoYXJhY3RlcnMuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciB0aGUgcGVtIGVuY29kZWQgc3RyaW5nIHdpdGhvdXQgaGVhZGVyIGFuZCBmb290ZXJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3dpZHRoPTY0XSAtIHRoZSBsZW5ndGggdGhlIHN0cmluZyBoYXMgdG8gYmUgd3JhcHBlZCBhdFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHdvcmR3cmFwKHN0cjpzdHJpbmcsIHdpZHRoPzpudW1iZXIpIHtcbiAgICAgICAgd2lkdGggPSB3aWR0aCB8fCA2NDtcbiAgICAgICAgaWYgKCFzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVnZXggPSBcIiguezEsXCIgKyB3aWR0aCArIFwifSkoICt8JFxcbj8pfCguezEsXCIgKyB3aWR0aCArIFwifSlcIjtcbiAgICAgICAgcmV0dXJuIHN0ci5tYXRjaChSZWdFeHAocmVnZXgsIFwiZ1wiKSkuam9pbihcIlxcblwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSB0aGUgcGVtIGVuY29kZWQgcHJpdmF0ZSBrZXlcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgcGVtIGVuY29kZWQgcHJpdmF0ZSBrZXkgd2l0aCBoZWFkZXIvZm9vdGVyXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIHB1YmxpYyBnZXRQcml2YXRlS2V5KCkge1xuICAgICAgICBsZXQga2V5ID0gXCItLS0tLUJFR0lOIFJTQSBQUklWQVRFIEtFWS0tLS0tXFxuXCI7XG4gICAgICAgIGtleSArPSBKU0VuY3J5cHRSU0FLZXkud29yZHdyYXAodGhpcy5nZXRQcml2YXRlQmFzZUtleUI2NCgpKSArIFwiXFxuXCI7XG4gICAgICAgIGtleSArPSBcIi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tXCI7XG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgdGhlIHBlbSBlbmNvZGVkIHB1YmxpYyBrZXlcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgcGVtIGVuY29kZWQgcHVibGljIGtleSB3aXRoIGhlYWRlci9mb290ZXJcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgcHVibGljIGdldFB1YmxpY0tleSgpIHtcbiAgICAgICAgbGV0IGtleSA9IFwiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cXG5cIjtcbiAgICAgICAga2V5ICs9IEpTRW5jcnlwdFJTQUtleS53b3Jkd3JhcCh0aGlzLmdldFB1YmxpY0Jhc2VLZXlCNjQoKSkgKyBcIlxcblwiO1xuICAgICAgICBrZXkgKz0gXCItLS0tLUVORCBQVUJMSUMgS0VZLS0tLS1cIjtcbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgb2JqZWN0IGNvbnRhaW5zIHRoZSBuZWNlc3NhcnkgcGFyYW1ldGVycyB0byBwb3B1bGF0ZSB0aGUgcnNhIG1vZHVsdXNcbiAgICAgKiBhbmQgcHVibGljIGV4cG9uZW50IHBhcmFtZXRlcnMuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvYmo9e31dIC0gQW4gb2JqZWN0IHRoYXQgbWF5IGNvbnRhaW4gdGhlIHR3byBwdWJsaWMga2V5XG4gICAgICogcGFyYW1ldGVyc1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBvYmplY3QgY29udGFpbnMgYm90aCB0aGUgbW9kdWx1cyBhbmQgdGhlIHB1YmxpYyBleHBvbmVudFxuICAgICAqIHByb3BlcnRpZXMgKG4gYW5kIGUpXG4gICAgICogQHRvZG8gY2hlY2sgZm9yIHR5cGVzIG9mIG4gYW5kIGUuIE4gc2hvdWxkIGJlIGEgcGFyc2VhYmxlIGJpZ0ludCBvYmplY3QsIEUgc2hvdWxkXG4gICAgICogYmUgYSBwYXJzZWFibGUgaW50ZWdlciBudW1iZXJcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgaGFzUHVibGljS2V5UHJvcGVydHkob2JqOm9iamVjdCkge1xuICAgICAgICBvYmogPSBvYmogfHwge307XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBvYmouaGFzT3duUHJvcGVydHkoXCJuXCIpICYmXG4gICAgICAgICAgICBvYmouaGFzT3duUHJvcGVydHkoXCJlXCIpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIG9iamVjdCBjb250YWlucyBBTEwgdGhlIHBhcmFtZXRlcnMgb2YgYW4gUlNBIGtleS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29iaj17fV0gLSBBbiBvYmplY3QgdGhhdCBtYXkgY29udGFpbiBuaW5lIHJzYSBrZXlcbiAgICAgKiBwYXJhbWV0ZXJzXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIG9iamVjdCBjb250YWlucyBhbGwgdGhlIHBhcmFtZXRlcnMgbmVlZGVkXG4gICAgICogQHRvZG8gY2hlY2sgZm9yIHR5cGVzIG9mIHRoZSBwYXJhbWV0ZXJzIGFsbCB0aGUgcGFyYW1ldGVycyBidXQgdGhlIHB1YmxpYyBleHBvbmVudFxuICAgICAqIHNob3VsZCBiZSBwYXJzZWFibGUgYmlnaW50IG9iamVjdHMsIHRoZSBwdWJsaWMgZXhwb25lbnQgc2hvdWxkIGJlIGEgcGFyc2VhYmxlIGludGVnZXIgbnVtYmVyXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGhhc1ByaXZhdGVLZXlQcm9wZXJ0eShvYmo6b2JqZWN0KSB7XG4gICAgICAgIG9iaiA9IG9iaiB8fCB7fTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIG9iai5oYXNPd25Qcm9wZXJ0eShcIm5cIikgJiZcbiAgICAgICAgICAgIG9iai5oYXNPd25Qcm9wZXJ0eShcImVcIikgJiZcbiAgICAgICAgICAgIG9iai5oYXNPd25Qcm9wZXJ0eShcImRcIikgJiZcbiAgICAgICAgICAgIG9iai5oYXNPd25Qcm9wZXJ0eShcInBcIikgJiZcbiAgICAgICAgICAgIG9iai5oYXNPd25Qcm9wZXJ0eShcInFcIikgJiZcbiAgICAgICAgICAgIG9iai5oYXNPd25Qcm9wZXJ0eShcImRtcDFcIikgJiZcbiAgICAgICAgICAgIG9iai5oYXNPd25Qcm9wZXJ0eShcImRtcTFcIikgJiZcbiAgICAgICAgICAgIG9iai5oYXNPd25Qcm9wZXJ0eShcImNvZWZmXCIpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2UgdGhlIHByb3BlcnRpZXMgb2Ygb2JqIGluIHRoZSBjdXJyZW50IHJzYSBvYmplY3QuIE9iaiBzaG91bGQgQVQgTEVBU1RcbiAgICAgKiBpbmNsdWRlIHRoZSBtb2R1bHVzIGFuZCBwdWJsaWMgZXhwb25lbnQgKG4sIGUpIHBhcmFtZXRlcnMuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiAtIHRoZSBvYmplY3QgY29udGFpbmluZyByc2EgcGFyYW1ldGVyc1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcHVibGljIHBhcnNlUHJvcGVydGllc0Zyb20ob2JqOmFueSkge1xuICAgICAgICB0aGlzLm4gPSBvYmoubjtcbiAgICAgICAgdGhpcy5lID0gb2JqLmU7XG5cbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShcImRcIikpIHtcbiAgICAgICAgICAgIHRoaXMuZCA9IG9iai5kO1xuICAgICAgICAgICAgdGhpcy5wID0gb2JqLnA7XG4gICAgICAgICAgICB0aGlzLnEgPSBvYmoucTtcbiAgICAgICAgICAgIHRoaXMuZG1wMSA9IG9iai5kbXAxO1xuICAgICAgICAgICAgdGhpcy5kbXExID0gb2JqLmRtcTE7XG4gICAgICAgICAgICB0aGlzLmNvZWZmID0gb2JqLmNvZWZmO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0pTRW5jcnlwdFJTQUtleS50cyIsIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0geVtvcFswXSAmIDIgPyBcInJldHVyblwiIDogb3BbMF0gPyBcInRocm93XCIgOiBcIm5leHRcIl0pICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gWzAsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7ICB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpZiAob1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gSGV4IEphdmFTY3JpcHQgZGVjb2RlclxuLy8gQ29weXJpZ2h0IChjKSAyMDA4LTIwMTMgTGFwbyBMdWNoaW5pIDxsYXBvQGxhcG8uaXQ+XG5cbi8vIFBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxuLy8gcHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLCBwcm92aWRlZCB0aGF0IHRoZSBhYm92ZVxuLy8gY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBhcHBlYXIgaW4gYWxsIGNvcGllcy5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFU1xuLy8gV0lUSCBSRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1Jcbi8vIEFOWSBTUEVDSUFMLCBESVJFQ1QsIElORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVNcbi8vIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST00gTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTlxuLy8gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SIE9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0Zcbi8vIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SIFBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXG5cbi8qanNoaW50IGJyb3dzZXI6IHRydWUsIHN0cmljdDogdHJ1ZSwgaW1tZWQ6IHRydWUsIGxhdGVkZWY6IHRydWUsIHVuZGVmOiB0cnVlLCByZWdleGRhc2g6IGZhbHNlICovXG5cbmxldCBkZWNvZGVyOnsgW2luZGV4OnN0cmluZ106bnVtYmVyIH07XG5leHBvcnQgY29uc3QgSGV4ID0ge1xuICAgIGRlY29kZShhOnN0cmluZyk6bnVtYmVyW10ge1xuICAgICAgICBsZXQgaTtcbiAgICAgICAgaWYgKGRlY29kZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbGV0IGhleCA9IFwiMDEyMzQ1Njc4OUFCQ0RFRlwiO1xuICAgICAgICAgICAgY29uc3QgaWdub3JlID0gXCIgXFxmXFxuXFxyXFx0XFx1MDBBMFxcdTIwMjhcXHUyMDI5XCI7XG4gICAgICAgICAgICBkZWNvZGVyID0ge307XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgICAgICAgICAgICAgIGRlY29kZXJbaGV4LmNoYXJBdChpKV0gPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGV4ID0gaGV4LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBmb3IgKGkgPSAxMDsgaSA8IDE2OyArK2kpIHtcbiAgICAgICAgICAgICAgICBkZWNvZGVyW2hleC5jaGFyQXQoaSldID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBpZ25vcmUubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBkZWNvZGVyW2lnbm9yZS5jaGFyQXQoaSldID0gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb3V0ID0gW107XG4gICAgICAgIGxldCBiaXRzID0gMDtcbiAgICAgICAgbGV0IGNoYXJfY291bnQgPSAwO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgbGV0IGM6bnVtYmVyfHN0cmluZyA9IGEuY2hhckF0KGkpO1xuICAgICAgICAgICAgaWYgKGMgPT0gXCI9XCIpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGMgPSBkZWNvZGVyW2NdO1xuICAgICAgICAgICAgaWYgKGMgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbGxlZ2FsIGNoYXJhY3RlciBhdCBvZmZzZXQgXCIgKyBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJpdHMgfD0gYztcbiAgICAgICAgICAgIGlmICgrK2NoYXJfY291bnQgPj0gMikge1xuICAgICAgICAgICAgICAgIG91dFtvdXQubGVuZ3RoXSA9IGJpdHM7XG4gICAgICAgICAgICAgICAgYml0cyA9IDA7XG4gICAgICAgICAgICAgICAgY2hhcl9jb3VudCA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJpdHMgPDw9IDQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoYXJfY291bnQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkhleCBlbmNvZGluZyBpbmNvbXBsZXRlOiA0IGJpdHMgbWlzc2luZ1wiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvYXNuMWpzL2hleC50cyIsIi8vIEJhc2U2NCBKYXZhU2NyaXB0IGRlY29kZXJcbi8vIENvcHlyaWdodCAoYykgMjAwOC0yMDEzIExhcG8gTHVjaGluaSA8bGFwb0BsYXBvLml0PlxuXG4vLyBQZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcbi8vIHB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZCwgcHJvdmlkZWQgdGhhdCB0aGUgYWJvdmVcbi8vIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2UgYXBwZWFyIGluIGFsbCBjb3BpZXMuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVNcbi8vIFdJVEggUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SXG4vLyBBTlkgU1BFQ0lBTCwgRElSRUNULCBJTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTXG4vLyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NIExPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU5cbi8vIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUiBPVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GXG4vLyBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUiBQRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxuXG4vKmpzaGludCBicm93c2VyOiB0cnVlLCBzdHJpY3Q6IHRydWUsIGltbWVkOiB0cnVlLCBsYXRlZGVmOiB0cnVlLCB1bmRlZjogdHJ1ZSwgcmVnZXhkYXNoOiBmYWxzZSAqL1xubGV0IGRlY29kZXI6eyBbaW5kZXg6c3RyaW5nXTpudW1iZXIgfCBzdHJpbmcgfTtcbmV4cG9ydCBjb25zdCBCYXNlNjQgPSB7XG4gICAgZGVjb2RlKGE6c3RyaW5nKSB7XG4gICAgICAgIGxldCBpO1xuICAgICAgICBpZiAoZGVjb2RlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBiNjQgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIjtcbiAgICAgICAgICAgIGNvbnN0IGlnbm9yZSA9IFwiPSBcXGZcXG5cXHJcXHRcXHUwMEEwXFx1MjAyOFxcdTIwMjlcIjtcbiAgICAgICAgICAgIGRlY29kZXIgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IDY0OyArK2kpIHtcbiAgICAgICAgICAgICAgICBkZWNvZGVyW2I2NC5jaGFyQXQoaSldID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBpZ25vcmUubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBkZWNvZGVyW2lnbm9yZS5jaGFyQXQoaSldID0gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb3V0ID0gW107XG4gICAgICAgIGxldCBiaXRzID0gMDtcbiAgICAgICAgbGV0IGNoYXJfY291bnQgPSAwO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgbGV0IGM6c3RyaW5nfG51bWJlciA9IGEuY2hhckF0KGkpO1xuICAgICAgICAgICAgaWYgKGMgPT0gXCI9XCIpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGMgPSBkZWNvZGVyW2NdO1xuICAgICAgICAgICAgaWYgKGMgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbGxlZ2FsIGNoYXJhY3RlciBhdCBvZmZzZXQgXCIgKyBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJpdHMgfD0gYyBhcyBudW1iZXI7XG4gICAgICAgICAgICBpZiAoKytjaGFyX2NvdW50ID49IDQpIHtcbiAgICAgICAgICAgICAgICBvdXRbb3V0Lmxlbmd0aF0gPSAoYml0cyA+PiAxNik7XG4gICAgICAgICAgICAgICAgb3V0W291dC5sZW5ndGhdID0gKGJpdHMgPj4gOCkgJiAweEZGO1xuICAgICAgICAgICAgICAgIG91dFtvdXQubGVuZ3RoXSA9IGJpdHMgJiAweEZGO1xuICAgICAgICAgICAgICAgIGJpdHMgPSAwO1xuICAgICAgICAgICAgICAgIGNoYXJfY291bnQgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBiaXRzIDw8PSA2O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAoY2hhcl9jb3VudCkge1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJhc2U2NCBlbmNvZGluZyBpbmNvbXBsZXRlOiBhdCBsZWFzdCAyIGJpdHMgbWlzc2luZ1wiKTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBvdXRbb3V0Lmxlbmd0aF0gPSAoYml0cyA+PiAxMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgb3V0W291dC5sZW5ndGhdID0gKGJpdHMgPj4gMTYpO1xuICAgICAgICAgICAgICAgIG91dFtvdXQubGVuZ3RoXSA9IChiaXRzID4+IDgpICYgMHhGRjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG4gICAgcmU6IC8tLS0tLUJFR0lOIFteLV0rLS0tLS0oW0EtWmEtejAtOStcXC89XFxzXSspLS0tLS1FTkQgW14tXSstLS0tLXxiZWdpbi1iYXNlNjRbXlxcbl0rXFxuKFtBLVphLXowLTkrXFwvPVxcc10rKT09PT0vLFxuICAgIHVuYXJtb3IoYTpzdHJpbmcpOm51bWJlcltdIHtcbiAgICAgICAgY29uc3QgbSA9IEJhc2U2NC5yZS5leGVjKGEpO1xuICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgaWYgKG1bMV0pIHtcbiAgICAgICAgICAgICAgICBhID0gbVsxXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobVsyXSkge1xuICAgICAgICAgICAgICAgIGEgPSBtWzJdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJSZWdFeHAgb3V0IG9mIHN5bmNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEJhc2U2NC5kZWNvZGUoYSk7XG4gICAgfVxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9hc24xanMvYmFzZTY0LnRzIiwiLy8gQVNOLjEgSmF2YVNjcmlwdCBkZWNvZGVyXG4vLyBDb3B5cmlnaHQgKGMpIDIwMDgtMjAxNCBMYXBvIEx1Y2hpbmkgPGxhcG9AbGFwby5pdD5cblxuLy8gUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XG4vLyBwdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQsIHByb3ZpZGVkIHRoYXQgdGhlIGFib3ZlXG4vLyBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIGFwcGVhciBpbiBhbGwgY29waWVzLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTXG4vLyBXSVRIIFJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUlxuLy8gQU5ZIFNQRUNJQUwsIERJUkVDVCwgSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFU1xuLy8gV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTSBMT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOXG4vLyBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1IgT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRlxuLy8gT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1IgUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cblxuLypqc2hpbnQgYnJvd3NlcjogdHJ1ZSwgc3RyaWN0OiB0cnVlLCBpbW1lZDogdHJ1ZSwgbGF0ZWRlZjogdHJ1ZSwgdW5kZWY6IHRydWUsIHJlZ2V4ZGFzaDogZmFsc2UgKi9cbi8qZ2xvYmFsIG9pZHMgKi9cblxuaW1wb3J0IHtJbnQxMH0gZnJvbSBcIi4vaW50MTBcIjtcblxuY29uc3QgZWxsaXBzaXMgPSBcIlxcdTIwMjZcIjtcbmNvbnN0IHJlVGltZVMgPSAgICAgL14oXFxkXFxkKSgwWzEtOV18MVswLTJdKSgwWzEtOV18WzEyXVxcZHwzWzAxXSkoWzAxXVxcZHwyWzAtM10pKD86KFswLTVdXFxkKSg/OihbMC01XVxcZCkoPzpbLixdKFxcZHsxLDN9KSk/KT8pPyhafFstK10oPzpbMF1cXGR8MVswLTJdKShbMC01XVxcZCk/KT8kLztcbmNvbnN0IHJlVGltZUwgPSAvXihcXGRcXGRcXGRcXGQpKDBbMS05XXwxWzAtMl0pKDBbMS05XXxbMTJdXFxkfDNbMDFdKShbMDFdXFxkfDJbMC0zXSkoPzooWzAtNV1cXGQpKD86KFswLTVdXFxkKSg/OlsuLF0oXFxkezEsM30pKT8pPyk/KFp8Wy0rXSg/OlswXVxcZHwxWzAtMl0pKFswLTVdXFxkKT8pPyQvO1xuXG5mdW5jdGlvbiBzdHJpbmdDdXQoc3RyOnN0cmluZywgbGVuOm51bWJlcikge1xuICAgIGlmIChzdHIubGVuZ3RoID4gbGVuKSB7XG4gICAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoMCwgbGVuKSArIGVsbGlwc2lzO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xufVxuXG5leHBvcnQgY2xhc3MgU3RyZWFtIHtcbiAgICBjb25zdHJ1Y3RvcihlbmM6U3RyZWFtfG51bWJlcltdLCBwb3M/Om51bWJlcikge1xuICAgICAgICBpZiAoZW5jIGluc3RhbmNlb2YgU3RyZWFtKSB7XG4gICAgICAgICAgICB0aGlzLmVuYyA9IGVuYy5lbmM7XG4gICAgICAgICAgICB0aGlzLnBvcyA9IGVuYy5wb3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBlbmMgc2hvdWxkIGJlIGFuIGFycmF5IG9yIGEgYmluYXJ5IHN0cmluZ1xuICAgICAgICAgICAgdGhpcy5lbmMgPSBlbmM7XG4gICAgICAgICAgICB0aGlzLnBvcyA9IHBvcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZW5jOnN0cmluZ3xudW1iZXJbXTtcbiAgICBwdWJsaWMgcG9zOm51bWJlcjtcblxuICAgIHB1YmxpYyBnZXQocG9zPzpudW1iZXIpIHtcbiAgICAgICAgaWYgKHBvcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwb3MgPSB0aGlzLnBvcysrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb3MgPj0gdGhpcy5lbmMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFJlcXVlc3RpbmcgYnl0ZSBvZmZzZXQgJHtwb3N9IG9uIGEgc3RyZWFtIG9mIGxlbmd0aCAke3RoaXMuZW5jLmxlbmd0aH1gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFwic3RyaW5nXCIgPT09IHR5cGVvZiB0aGlzLmVuYykgPyB0aGlzLmVuYy5jaGFyQ29kZUF0KHBvcykgOiB0aGlzLmVuY1twb3NdO1xuICAgIH1cblxuICAgIHB1YmxpYyBoZXhEaWdpdHMgPSBcIjAxMjM0NTY3ODlBQkNERUZcIjtcblxuICAgIHB1YmxpYyBoZXhCeXRlKGI6bnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhleERpZ2l0cy5jaGFyQXQoKGIgPj4gNCkgJiAweEYpICsgdGhpcy5oZXhEaWdpdHMuY2hhckF0KGIgJiAweEYpO1xuICAgIH1cblxuICAgIHB1YmxpYyBoZXhEdW1wKHN0YXJ0Om51bWJlciwgZW5kOm51bWJlciwgcmF3OmJvb2xlYW4pIHtcbiAgICAgICAgbGV0IHMgPSBcIlwiO1xuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgICAgICAgcyArPSB0aGlzLmhleEJ5dGUodGhpcy5nZXQoaSkpO1xuICAgICAgICAgICAgaWYgKHJhdyAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoaSAmIDB4Rikge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDB4NzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHMgKz0gXCIgIFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMHhGOlxuICAgICAgICAgICAgICAgICAgICAgICAgcyArPSBcIlxcblwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBzICs9IFwiIFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcztcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNBU0NJSShzdGFydDpudW1iZXIsIGVuZDpudW1iZXIpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IGMgPSB0aGlzLmdldChpKTtcbiAgICAgICAgICAgIGlmIChjIDwgMzIgfHwgYyA+IDE3Nikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcGFyc2VTdHJpbmdJU08oc3RhcnQ6bnVtYmVyLCBlbmQ6bnVtYmVyKSB7XG4gICAgICAgIGxldCBzID0gXCJcIjtcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICAgICAgICAgIHMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzLmdldChpKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfVxuXG4gICAgcHVibGljIHBhcnNlU3RyaW5nVVRGKHN0YXJ0Om51bWJlciwgZW5kOm51bWJlcikge1xuICAgICAgICBsZXQgcyA9IFwiXCI7XG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDspIHtcbiAgICAgICAgICAgIGNvbnN0IGMgPSB0aGlzLmdldChpKyspO1xuICAgICAgICAgICAgaWYgKGMgPCAxMjgpIHtcbiAgICAgICAgICAgICAgICBzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKChjID4gMTkxKSAmJiAoYyA8IDIyNCkpIHtcbiAgICAgICAgICAgICAgICBzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjICYgMHgxRikgPDwgNikgfCAodGhpcy5nZXQoaSsrKSAmIDB4M0YpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYyAmIDB4MEYpIDw8IDEyKSB8ICgodGhpcy5nZXQoaSsrKSAmIDB4M0YpIDw8IDYpIHwgKHRoaXMuZ2V0KGkrKykgJiAweDNGKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfVxuXG4gICAgcHVibGljIHBhcnNlU3RyaW5nQk1QKHN0YXJ0Om51bWJlciwgZW5kOm51bWJlcikge1xuICAgICAgICBsZXQgc3RyID0gXCJcIjtcbiAgICAgICAgbGV0IGhpO1xuICAgICAgICBsZXQgbG87XG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDspIHtcbiAgICAgICAgICAgIGhpID0gdGhpcy5nZXQoaSsrKTtcbiAgICAgICAgICAgIGxvID0gdGhpcy5nZXQoaSsrKTtcbiAgICAgICAgICAgIHN0ciArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKChoaSA8PCA4KSB8IGxvKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cblxuICAgIHB1YmxpYyBwYXJzZVRpbWUoc3RhcnQ6bnVtYmVyLCBlbmQ6bnVtYmVyLCBzaG9ydFllYXI6Ym9vbGVhbikge1xuICAgICAgICBsZXQgcyA9IHRoaXMucGFyc2VTdHJpbmdJU08oc3RhcnQsIGVuZCk7XG4gICAgICAgIGNvbnN0IG06QXJyYXk8bnVtYmVyfHN0cmluZz4gPSAoc2hvcnRZZWFyID8gcmVUaW1lUyA6IHJlVGltZUwpLmV4ZWMocyk7XG4gICAgICAgIGlmICghbSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiVW5yZWNvZ25pemVkIHRpbWU6IFwiICsgcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2hvcnRZZWFyKSB7XG4gICAgICAgICAgICAvLyB0byBhdm9pZCBxdWVyeWluZyB0aGUgdGltZXIsIHVzZSB0aGUgZml4ZWQgcmFuZ2UgWzE5NzAsIDIwNjldXG4gICAgICAgICAgICAvLyBpdCB3aWxsIGNvbmZvcm0gd2l0aCBJVFUgWC40MDAgWy0xMCwgKzQwXSBzbGlkaW5nIHdpbmRvdyB1bnRpbCAyMDMwXG4gICAgICAgICAgICBtWzFdID0gK21bMV07XG4gICAgICAgICAgICAobVsxXSBhcyBudW1iZXIpICs9ICgrbVsxXSA8IDcwKSA/IDIwMDAgOiAxOTAwO1xuICAgICAgICB9XG4gICAgICAgIHMgPSBtWzFdICsgXCItXCIgKyBtWzJdICsgXCItXCIgKyBtWzNdICsgXCIgXCIgKyBtWzRdO1xuICAgICAgICBpZiAobVs1XSkge1xuICAgICAgICAgICAgcyArPSBcIjpcIiArIG1bNV07XG4gICAgICAgICAgICBpZiAobVs2XSkge1xuICAgICAgICAgICAgICAgIHMgKz0gXCI6XCIgKyBtWzZdO1xuICAgICAgICAgICAgICAgIGlmIChtWzddKSB7XG4gICAgICAgICAgICAgICAgICAgIHMgKz0gXCIuXCIgKyBtWzddO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobVs4XSkge1xuICAgICAgICAgICAgcyArPSBcIiBVVENcIjtcbiAgICAgICAgICAgIGlmIChtWzhdICE9IFwiWlwiKSB7XG4gICAgICAgICAgICAgICAgcyArPSBtWzhdO1xuICAgICAgICAgICAgICAgIGlmIChtWzldKSB7XG4gICAgICAgICAgICAgICAgICAgIHMgKz0gXCI6XCIgKyBtWzldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcztcbiAgICB9XG5cbiAgICBwdWJsaWMgcGFyc2VJbnRlZ2VyKHN0YXJ0Om51bWJlciwgZW5kOm51bWJlcikge1xuICAgICAgICBsZXQgdiA9IHRoaXMuZ2V0KHN0YXJ0KTtcbiAgICAgICAgY29uc3QgbmVnID0gKHYgPiAxMjcpO1xuICAgICAgICBjb25zdCBwYWQgPSBuZWcgPyAyNTUgOiAwO1xuICAgICAgICBsZXQgbGVuO1xuICAgICAgICBsZXQgczpzdHJpbmcgfCBudW1iZXIgPSBcIlwiO1xuICAgICAgICAvLyBza2lwIHVudXNlZnVsIGJpdHMgKG5vdCBhbGxvd2VkIGluIERFUilcbiAgICAgICAgd2hpbGUgKHYgPT0gcGFkICYmICsrc3RhcnQgPCBlbmQpIHtcbiAgICAgICAgICAgIHYgPSB0aGlzLmdldChzdGFydCk7XG4gICAgICAgIH1cbiAgICAgICAgbGVuID0gZW5kIC0gc3RhcnQ7XG4gICAgICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBuZWcgPyAtMSA6IDA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2hvdyBiaXQgbGVuZ3RoIG9mIGh1Z2UgaW50ZWdlcnNcbiAgICAgICAgaWYgKGxlbiA+IDQpIHtcbiAgICAgICAgICAgIHMgPSB2O1xuICAgICAgICAgICAgbGVuIDw8PSAzO1xuICAgICAgICAgICAgd2hpbGUgKCgoK3MgXiBwYWQpICYgMHg4MCkgPT0gMCkge1xuICAgICAgICAgICAgICAgIHMgPSArcyA8PCAxO1xuICAgICAgICAgICAgICAgIC0tbGVuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcyA9IFwiKFwiICsgbGVuICsgXCIgYml0KVxcblwiO1xuICAgICAgICB9XG4gICAgICAgIC8vIGRlY29kZSB0aGUgaW50ZWdlclxuICAgICAgICBpZiAobmVnKSB7XG4gICAgICAgICAgICB2ID0gdiAtIDI1NjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuID0gbmV3IEludDEwKHYpO1xuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQgKyAxOyBpIDwgZW5kOyArK2kpIHtcbiAgICAgICAgICAgIG4ubXVsQWRkKDI1NiwgdGhpcy5nZXQoaSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzICsgbi50b1N0cmluZygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBwYXJzZUJpdFN0cmluZyhzdGFydDpudW1iZXIsIGVuZDpudW1iZXIsIG1heExlbmd0aDpudW1iZXIpIHtcbiAgICAgICAgY29uc3QgdW51c2VkQml0ID0gdGhpcy5nZXQoc3RhcnQpO1xuICAgICAgICBjb25zdCBsZW5CaXQgPSAoKGVuZCAtIHN0YXJ0IC0gMSkgPDwgMykgLSB1bnVzZWRCaXQ7XG4gICAgICAgIGNvbnN0IGludHJvID0gXCIoXCIgKyBsZW5CaXQgKyBcIiBiaXQpXFxuXCI7XG4gICAgICAgIGxldCBzID0gXCJcIjtcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0ICsgMTsgaSA8IGVuZDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBiID0gdGhpcy5nZXQoaSk7XG4gICAgICAgICAgICBjb25zdCBza2lwID0gKGkgPT0gZW5kIC0gMSkgPyB1bnVzZWRCaXQgOiAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDc7IGogPj0gc2tpcDsgLS1qKSB7XG4gICAgICAgICAgICAgICAgcyArPSAoYiA+PiBqKSAmIDEgPyBcIjFcIiA6IFwiMFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHMubGVuZ3RoID4gbWF4TGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGludHJvICsgc3RyaW5nQ3V0KHMsIG1heExlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGludHJvICsgcztcbiAgICB9XG5cbiAgICBwdWJsaWMgcGFyc2VPY3RldFN0cmluZyhzdGFydDpudW1iZXIsIGVuZDpudW1iZXIsIG1heExlbmd0aDpudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBU0NJSShzdGFydCwgZW5kKSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0cmluZ0N1dCh0aGlzLnBhcnNlU3RyaW5nSVNPKHN0YXJ0LCBlbmQpLCBtYXhMZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxlbiA9IGVuZCAtIHN0YXJ0O1xuICAgICAgICBsZXQgcyA9IFwiKFwiICsgbGVuICsgXCIgYnl0ZSlcXG5cIjtcbiAgICAgICAgbWF4TGVuZ3RoIC89IDI7IC8vIHdlIHdvcmsgaW4gYnl0ZXNcbiAgICAgICAgaWYgKGxlbiA+IG1heExlbmd0aCkge1xuICAgICAgICAgICAgZW5kID0gc3RhcnQgKyBtYXhMZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICAgICAgICAgIHMgKz0gdGhpcy5oZXhCeXRlKHRoaXMuZ2V0KGkpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGVuID4gbWF4TGVuZ3RoKSB7XG4gICAgICAgICAgICBzICs9IGVsbGlwc2lzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzO1xuICAgIH1cblxuICAgIHB1YmxpYyBwYXJzZU9JRChzdGFydDpudW1iZXIsIGVuZDpudW1iZXIsIG1heExlbmd0aDpudW1iZXIpIHtcbiAgICAgICAgbGV0IHMgPSBcIlwiO1xuICAgICAgICBsZXQgbjpudW1iZXJ8SW50MTAgPSBuZXcgSW50MTAoKTtcbiAgICAgICAgbGV0IGJpdHMgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMuZ2V0KGkpO1xuICAgICAgICAgICAgbi5tdWxBZGQoMTI4LCB2ICYgMHg3Rik7XG4gICAgICAgICAgICBiaXRzICs9IDc7XG4gICAgICAgICAgICBpZiAoISh2ICYgMHg4MCkpIHsgLy8gZmluaXNoZWRcbiAgICAgICAgICAgICAgICBpZiAocyA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICBuID0gbi5zaW1wbGlmeSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobiBpbnN0YW5jZW9mIEludDEwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuLnN1Yig4MCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzID0gXCIyLlwiICsgbi50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbSA9IG4gPCA4MCA/IG4gPCA0MCA/IDAgOiAxIDogMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMgPSBtICsgXCIuXCIgKyAobiAtIG0gKiA0MCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzICs9IFwiLlwiICsgbi50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocy5sZW5ndGggPiBtYXhMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0cmluZ0N1dChzLCBtYXhMZW5ndGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBuID0gbmV3IEludDEwKCk7XG4gICAgICAgICAgICAgICAgYml0cyA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJpdHMgPiAwKSB7XG4gICAgICAgICAgICBzICs9IFwiLmluY29tcGxldGVcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcztcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgQVNOMSB7XG4gICAgY29uc3RydWN0b3Ioc3RyZWFtOlN0cmVhbSwgaGVhZGVyOm51bWJlciwgbGVuZ3RoOm51bWJlciwgdGFnOkFTTjFUYWcsIHN1YjpBU04xW10pIHtcbiAgICAgICAgaWYgKCEodGFnIGluc3RhbmNlb2YgQVNOMVRhZykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdGFnIHZhbHVlLlwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0cmVhbSA9IHN0cmVhbTtcbiAgICAgICAgdGhpcy5oZWFkZXIgPSBoZWFkZXI7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgICAgICB0aGlzLnRhZyA9IHRhZztcbiAgICAgICAgdGhpcy5zdWIgPSBzdWI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdHJlYW06U3RyZWFtO1xuICAgIHByaXZhdGUgaGVhZGVyOm51bWJlcjtcbiAgICBwcml2YXRlIGxlbmd0aDpudW1iZXI7XG4gICAgcHJpdmF0ZSB0YWc6QVNOMVRhZztcbiAgICBwdWJsaWMgc3ViOkFTTjFbXTtcblxuICAgIHB1YmxpYyB0eXBlTmFtZSgpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnRhZy50YWdDbGFzcykge1xuICAgICAgICAgICAgY2FzZSAwOiAvLyB1bml2ZXJzYWxcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMudGFnLnRhZ051bWJlcikge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDB4MDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJFT0NcIjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAweDAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiQk9PTEVBTlwiO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDB4MDI6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJJTlRFR0VSXCI7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMHgwMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkJJVF9TVFJJTkdcIjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAweDA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiT0NURVRfU1RSSU5HXCI7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMHgwNTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIk5VTExcIjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAweDA2OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiT0JKRUNUX0lERU5USUZJRVJcIjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAweDA3OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiT2JqZWN0RGVzY3JpcHRvclwiO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDB4MDg6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJFWFRFUk5BTFwiO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDB4MDk6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJSRUFMXCI7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMHgwQTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkVOVU1FUkFURURcIjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAweDBCOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiRU1CRURERURfUERWXCI7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMHgwQzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlVURjhTdHJpbmdcIjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAweDEwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiU0VRVUVOQ0VcIjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAweDExOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiU0VUXCI7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMHgxMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIk51bWVyaWNTdHJpbmdcIjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAweDEzOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiUHJpbnRhYmxlU3RyaW5nXCI7IC8vIEFTQ0lJIHN1YnNldFxuICAgICAgICAgICAgICAgICAgICBjYXNlIDB4MTQ6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJUZWxldGV4U3RyaW5nXCI7IC8vIGFrYSBUNjFTdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAweDE1OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiVmlkZW90ZXhTdHJpbmdcIjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAweDE2OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiSUE1U3RyaW5nXCI7IC8vIEFTQ0lJXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMHgxNzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlVUQ1RpbWVcIjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAweDE4OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiR2VuZXJhbGl6ZWRUaW1lXCI7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMHgxOTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkdyYXBoaWNTdHJpbmdcIjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAweDFBOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiVmlzaWJsZVN0cmluZ1wiOyAvLyBBU0NJSSBzdWJzZXRcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAweDFCOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiR2VuZXJhbFN0cmluZ1wiO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDB4MUM6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJVbml2ZXJzYWxTdHJpbmdcIjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAweDFFOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiQk1QU3RyaW5nXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlVuaXZlcnNhbF9cIiArIHRoaXMudGFnLnRhZ051bWJlci50b1N0cmluZygpO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIkFwcGxpY2F0aW9uX1wiICsgdGhpcy50YWcudGFnTnVtYmVyLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiW1wiICsgdGhpcy50YWcudGFnTnVtYmVyLnRvU3RyaW5nKCkgKyBcIl1cIjsgLy8gQ29udGV4dFxuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIlByaXZhdGVfXCIgKyB0aGlzLnRhZy50YWdOdW1iZXIudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBjb250ZW50KG1heExlbmd0aDpudW1iZXIpIHsgLy8gYSBwcmV2aWV3IG9mIHRoZSBjb250ZW50IChpbnRlbmRlZCBmb3IgaHVtYW5zKVxuICAgICAgICBpZiAodGhpcy50YWcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1heExlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBtYXhMZW5ndGggPSBJbmZpbml0eTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb250ZW50ID0gdGhpcy5wb3NDb250ZW50KCk7XG4gICAgICAgIGNvbnN0IGxlbiA9IE1hdGguYWJzKHRoaXMubGVuZ3RoKTtcbiAgICAgICAgaWYgKCF0aGlzLnRhZy5pc1VuaXZlcnNhbCgpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdWIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCIoXCIgKyB0aGlzLnN1Yi5sZW5ndGggKyBcIiBlbGVtKVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RyZWFtLnBhcnNlT2N0ZXRTdHJpbmcoY29udGVudCwgY29udGVudCArIGxlbiwgbWF4TGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHRoaXMudGFnLnRhZ051bWJlcikge1xuICAgICAgICAgICAgY2FzZSAweDAxOiAvLyBCT09MRUFOXG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLnN0cmVhbS5nZXQoY29udGVudCkgPT09IDApID8gXCJmYWxzZVwiIDogXCJ0cnVlXCI7XG4gICAgICAgICAgICBjYXNlIDB4MDI6IC8vIElOVEVHRVJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdHJlYW0ucGFyc2VJbnRlZ2VyKGNvbnRlbnQsIGNvbnRlbnQgKyBsZW4pO1xuICAgICAgICAgICAgY2FzZSAweDAzOiAvLyBCSVRfU1RSSU5HXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViID8gXCIoXCIgKyB0aGlzLnN1Yi5sZW5ndGggKyBcIiBlbGVtKVwiIDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHJlYW0ucGFyc2VCaXRTdHJpbmcoY29udGVudCwgY29udGVudCArIGxlbiwgbWF4TGVuZ3RoKTtcbiAgICAgICAgICAgIGNhc2UgMHgwNDogLy8gT0NURVRfU1RSSU5HXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViID8gXCIoXCIgKyB0aGlzLnN1Yi5sZW5ndGggKyBcIiBlbGVtKVwiIDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHJlYW0ucGFyc2VPY3RldFN0cmluZyhjb250ZW50LCBjb250ZW50ICsgbGVuLCBtYXhMZW5ndGgpO1xuICAgICAgICAgICAgLy8gY2FzZSAweDA1OiAvLyBOVUxMXG4gICAgICAgICAgICBjYXNlIDB4MDY6IC8vIE9CSkVDVF9JREVOVElGSUVSXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RyZWFtLnBhcnNlT0lEKGNvbnRlbnQsIGNvbnRlbnQgKyBsZW4sIG1heExlbmd0aCk7XG4gICAgICAgICAgICAvLyBjYXNlIDB4MDc6IC8vIE9iamVjdERlc2NyaXB0b3JcbiAgICAgICAgICAgIC8vIGNhc2UgMHgwODogLy8gRVhURVJOQUxcbiAgICAgICAgICAgIC8vIGNhc2UgMHgwOTogLy8gUkVBTFxuICAgICAgICAgICAgLy8gY2FzZSAweDBBOiAvLyBFTlVNRVJBVEVEXG4gICAgICAgICAgICAvLyBjYXNlIDB4MEI6IC8vIEVNQkVEREVEX1BEVlxuICAgICAgICAgICAgY2FzZSAweDEwOiAvLyBTRVFVRU5DRVxuICAgICAgICAgICAgY2FzZSAweDExOiAvLyBTRVRcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdWIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiKFwiICsgdGhpcy5zdWIubGVuZ3RoICsgXCIgZWxlbSlcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIobm8gZWxlbSlcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIDB4MEM6IC8vIFVURjhTdHJpbmdcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyaW5nQ3V0KHRoaXMuc3RyZWFtLnBhcnNlU3RyaW5nVVRGKGNvbnRlbnQsIGNvbnRlbnQgKyBsZW4pLCBtYXhMZW5ndGgpO1xuICAgICAgICAgICAgY2FzZSAweDEyOiAvLyBOdW1lcmljU3RyaW5nXG4gICAgICAgICAgICBjYXNlIDB4MTM6IC8vIFByaW50YWJsZVN0cmluZ1xuICAgICAgICAgICAgY2FzZSAweDE0OiAvLyBUZWxldGV4U3RyaW5nXG4gICAgICAgICAgICBjYXNlIDB4MTU6IC8vIFZpZGVvdGV4U3RyaW5nXG4gICAgICAgICAgICBjYXNlIDB4MTY6IC8vIElBNVN0cmluZ1xuICAgICAgICAgICAgLy8gY2FzZSAweDE5OiAvLyBHcmFwaGljU3RyaW5nXG4gICAgICAgICAgICBjYXNlIDB4MUE6IC8vIFZpc2libGVTdHJpbmdcbiAgICAgICAgICAgICAgICAvLyBjYXNlIDB4MUI6IC8vIEdlbmVyYWxTdHJpbmdcbiAgICAgICAgICAgICAgICAvLyBjYXNlIDB4MUM6IC8vIFVuaXZlcnNhbFN0cmluZ1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmdDdXQodGhpcy5zdHJlYW0ucGFyc2VTdHJpbmdJU08oY29udGVudCwgY29udGVudCArIGxlbiksIG1heExlbmd0aCk7XG4gICAgICAgICAgICBjYXNlIDB4MUU6IC8vIEJNUFN0cmluZ1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmdDdXQodGhpcy5zdHJlYW0ucGFyc2VTdHJpbmdCTVAoY29udGVudCwgY29udGVudCArIGxlbiksIG1heExlbmd0aCk7XG4gICAgICAgICAgICBjYXNlIDB4MTc6IC8vIFVUQ1RpbWVcbiAgICAgICAgICAgIGNhc2UgMHgxODogLy8gR2VuZXJhbGl6ZWRUaW1lXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RyZWFtLnBhcnNlVGltZShjb250ZW50LCBjb250ZW50ICsgbGVuLCAodGhpcy50YWcudGFnTnVtYmVyID09IDB4MTcpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnR5cGVOYW1lKCkgKyBcIkBcIiArIHRoaXMuc3RyZWFtLnBvcyArIFwiW2hlYWRlcjpcIiArIHRoaXMuaGVhZGVyICsgXCIsbGVuZ3RoOlwiICsgdGhpcy5sZW5ndGggKyBcIixzdWI6XCIgKyAoKHRoaXMuc3ViID09PSBudWxsKSA/IFwibnVsbFwiIDogdGhpcy5zdWIubGVuZ3RoKSArIFwiXVwiO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1ByZXR0eVN0cmluZyhpbmRlbnQ6c3RyaW5nKSB7XG4gICAgICAgIGlmIChpbmRlbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaW5kZW50ID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcyA9IGluZGVudCArIHRoaXMudHlwZU5hbWUoKSArIFwiIEBcIiArIHRoaXMuc3RyZWFtLnBvcztcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoID49IDApIHtcbiAgICAgICAgICAgIHMgKz0gXCIrXCI7XG4gICAgICAgIH1cbiAgICAgICAgcyArPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgaWYgKHRoaXMudGFnLnRhZ0NvbnN0cnVjdGVkKSB7XG4gICAgICAgICAgICBzICs9IFwiIChjb25zdHJ1Y3RlZClcIjtcbiAgICAgICAgfSBlbHNlIGlmICgodGhpcy50YWcuaXNVbml2ZXJzYWwoKSAmJiAoKHRoaXMudGFnLnRhZ051bWJlciA9PSAweDAzKSB8fCAodGhpcy50YWcudGFnTnVtYmVyID09IDB4MDQpKSkgJiYgKHRoaXMuc3ViICE9PSBudWxsKSkge1xuICAgICAgICAgICAgcyArPSBcIiAoZW5jYXBzdWxhdGVzKVwiO1xuICAgICAgICB9XG4gICAgICAgIHMgKz0gXCJcXG5cIjtcbiAgICAgICAgaWYgKHRoaXMuc3ViICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpbmRlbnQgKz0gXCIgIFwiO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIG1heCA9IHRoaXMuc3ViLmxlbmd0aDsgaSA8IG1heDsgKytpKSB7XG4gICAgICAgICAgICAgICAgcyArPSB0aGlzLnN1YltpXS50b1ByZXR0eVN0cmluZyhpbmRlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzO1xuICAgIH1cblxuICAgIHB1YmxpYyBwb3NTdGFydCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RyZWFtLnBvcztcbiAgICB9XG5cbiAgICBwdWJsaWMgcG9zQ29udGVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RyZWFtLnBvcyArIHRoaXMuaGVhZGVyO1xuICAgIH1cblxuICAgIHB1YmxpYyBwb3NFbmQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0cmVhbS5wb3MgKyB0aGlzLmhlYWRlciArIE1hdGguYWJzKHRoaXMubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9IZXhTdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0cmVhbS5oZXhEdW1wKHRoaXMucG9zU3RhcnQoKSwgdGhpcy5wb3NFbmQoKSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBkZWNvZGVMZW5ndGgoc3RyZWFtOlN0cmVhbSk6bnVtYmVyIHtcbiAgICAgICAgbGV0IGJ1ZiA9IHN0cmVhbS5nZXQoKTtcbiAgICAgICAgY29uc3QgbGVuID0gYnVmICYgMHg3RjtcbiAgICAgICAgaWYgKGxlbiA9PSBidWYpIHtcbiAgICAgICAgICAgIHJldHVybiBsZW47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBubyByZWFzb24gdG8gdXNlIEludDEwLCBhcyBpdCB3b3VsZCBiZSBhIGh1Z2UgYnVmZmVyIGFueXdheXNcbiAgICAgICAgaWYgKGxlbiA+IDYpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxlbmd0aCBvdmVyIDQ4IGJpdHMgbm90IHN1cHBvcnRlZCBhdCBwb3NpdGlvbiBcIiArIChzdHJlYW0ucG9zIC0gMSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9IC8vIHVuZGVmaW5lZFxuICAgICAgICBidWYgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICBidWYgPSAoYnVmICogMjU2KSArIHN0cmVhbS5nZXQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYnVmO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIHRoZSBoZXhhZGVjaW1hbCB2YWx1ZSAoYXMgYSBzdHJpbmcpIG9mIHRoZSBjdXJyZW50IEFTTi4xIGVsZW1lbnRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0SGV4U3RyaW5nVmFsdWUoKTpzdHJpbmcge1xuICAgICAgICBjb25zdCBoZXhTdHJpbmcgPSB0aGlzLnRvSGV4U3RyaW5nKCk7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHRoaXMuaGVhZGVyICogMjtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGggKiAyO1xuICAgICAgICByZXR1cm4gaGV4U3RyaW5nLnN1YnN0cihvZmZzZXQsIGxlbmd0aCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBkZWNvZGUoc3RyOlN0cmVhbXxudW1iZXJbXSkge1xuICAgICAgICBsZXQgc3RyZWFtOlN0cmVhbTtcblxuICAgICAgICBpZiAoIShzdHIgaW5zdGFuY2VvZiBTdHJlYW0pKSB7XG4gICAgICAgICAgICBzdHJlYW0gPSBuZXcgU3RyZWFtKHN0ciwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHJlYW0gPSBzdHI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdHJlYW1TdGFydCA9IG5ldyBTdHJlYW0oc3RyZWFtKTtcbiAgICAgICAgY29uc3QgdGFnID0gbmV3IEFTTjFUYWcoc3RyZWFtKTtcbiAgICAgICAgbGV0IGxlbiA9IEFTTjEuZGVjb2RlTGVuZ3RoKHN0cmVhbSk7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gc3RyZWFtLnBvcztcbiAgICAgICAgY29uc3QgaGVhZGVyID0gc3RhcnQgLSBzdHJlYW1TdGFydC5wb3M7XG4gICAgICAgIGxldCBzdWIgPSBudWxsO1xuICAgICAgICBjb25zdCBnZXRTdWI6KCkgPT4gQVNOMVtdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gW107XG4gICAgICAgICAgICBpZiAobGVuICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gZGVmaW5pdGUgbGVuZ3RoXG4gICAgICAgICAgICAgICAgY29uc3QgZW5kID0gc3RhcnQgKyBsZW47XG4gICAgICAgICAgICAgICAgd2hpbGUgKHN0cmVhbS5wb3MgPCBlbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0W3JldC5sZW5ndGhdID0gQVNOMS5kZWNvZGUoc3RyZWFtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHN0cmVhbS5wb3MgIT0gZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvbnRlbnQgc2l6ZSBpcyBub3QgY29ycmVjdCBmb3IgY29udGFpbmVyIHN0YXJ0aW5nIGF0IG9mZnNldCBcIiArIHN0YXJ0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHVuZGVmaW5lZCBsZW5ndGhcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKDsgOykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcyA9IEFTTjEuZGVjb2RlKHN0cmVhbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocy50YWcuaXNFT0MoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0W3JldC5sZW5ndGhdID0gcztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZW4gPSBzdGFydCAtIHN0cmVhbS5wb3M7IC8vIHVuZGVmaW5lZCBsZW5ndGhzIGFyZSByZXByZXNlbnRlZCBhcyBuZWdhdGl2ZSB2YWx1ZXNcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4Y2VwdGlvbiB3aGlsZSBkZWNvZGluZyB1bmRlZmluZWQgbGVuZ3RoIGNvbnRlbnQ6IFwiICsgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9O1xuICAgICAgICBpZiAodGFnLnRhZ0NvbnN0cnVjdGVkKSB7XG4gICAgICAgICAgICAvLyBtdXN0IGhhdmUgdmFsaWQgY29udGVudFxuICAgICAgICAgICAgc3ViID0gZ2V0U3ViKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGFnLmlzVW5pdmVyc2FsKCkgJiYgKCh0YWcudGFnTnVtYmVyID09IDB4MDMpIHx8ICh0YWcudGFnTnVtYmVyID09IDB4MDQpKSkge1xuICAgICAgICAgICAgLy8gc29tZXRpbWVzIEJpdFN0cmluZyBhbmQgT2N0ZXRTdHJpbmcgYXJlIHVzZWQgdG8gZW5jYXBzdWxhdGUgQVNOLjFcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhZy50YWdOdW1iZXIgPT0gMHgwMykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RyZWFtLmdldCgpICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJJVCBTVFJJTkdzIHdpdGggdW51c2VkIGJpdHMgY2Fubm90IGVuY2Fwc3VsYXRlLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdWIgPSBnZXRTdWIoKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1Yi5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3ViW2ldLnRhZy5pc0VPQygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFT0MgaXMgbm90IHN1cHBvc2VkIHRvIGJlIGFjdHVhbCBjb250ZW50LlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBidXQgc2lsZW50bHkgaWdub3JlIHdoZW4gdGhleSBkb24ndFxuICAgICAgICAgICAgICAgIHN1YiA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN1YiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGxlbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIldlIGNhbid0IHNraXAgb3ZlciBhbiBpbnZhbGlkIHRhZyB3aXRoIHVuZGVmaW5lZCBsZW5ndGggYXQgb2Zmc2V0IFwiICsgc3RhcnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RyZWFtLnBvcyA9IHN0YXJ0ICsgTWF0aC5hYnMobGVuKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEFTTjEoc3RyZWFtU3RhcnQsIGhlYWRlciwgbGVuLCB0YWcsIHN1Yik7XG4gICAgfVxufVxuXG5cbmNsYXNzIEFTTjFUYWcge1xuICAgIGNvbnN0cnVjdG9yKHN0cmVhbTpTdHJlYW0pIHtcbiAgICAgICAgbGV0IGJ1ZiA9IHN0cmVhbS5nZXQoKTtcbiAgICAgICAgdGhpcy50YWdDbGFzcyA9IGJ1ZiA+PiA2O1xuICAgICAgICB0aGlzLnRhZ0NvbnN0cnVjdGVkID0gKChidWYgJiAweDIwKSAhPT0gMCk7XG4gICAgICAgIHRoaXMudGFnTnVtYmVyID0gYnVmICYgMHgxRjtcbiAgICAgICAgaWYgKHRoaXMudGFnTnVtYmVyID09IDB4MUYpIHsgLy8gbG9uZyB0YWdcbiAgICAgICAgICAgIGNvbnN0IG4gPSBuZXcgSW50MTAoKTtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBidWYgPSBzdHJlYW0uZ2V0KCk7XG4gICAgICAgICAgICAgICAgbi5tdWxBZGQoMTI4LCBidWYgJiAweDdGKTtcbiAgICAgICAgICAgIH0gd2hpbGUgKGJ1ZiAmIDB4ODApO1xuICAgICAgICAgICAgdGhpcy50YWdOdW1iZXIgPSBuLnNpbXBsaWZ5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdGFnQ2xhc3M6bnVtYmVyO1xuICAgIHB1YmxpYyB0YWdDb25zdHJ1Y3RlZDpib29sZWFuO1xuICAgIHB1YmxpYyB0YWdOdW1iZXI6bnVtYmVyIHwgSW50MTA7XG5cbiAgICBwdWJsaWMgaXNVbml2ZXJzYWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRhZ0NsYXNzID09PSAweDAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc0VPQygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFnQ2xhc3MgPT09IDB4MDAgJiYgdGhpcy50YWdOdW1iZXIgPT09IDB4MDA7XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL2FzbjFqcy9hc24xLnRzIiwiLy8gQmlnIGludGVnZXIgYmFzZS0xMCBwcmludGluZyBsaWJyYXJ5XG4vLyBDb3B5cmlnaHQgKGMpIDIwMTQgTGFwbyBMdWNoaW5pIDxsYXBvQGxhcG8uaXQ+XG5cbi8vIFBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxuLy8gcHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLCBwcm92aWRlZCB0aGF0IHRoZSBhYm92ZVxuLy8gY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBhcHBlYXIgaW4gYWxsIGNvcGllcy5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFU1xuLy8gV0lUSCBSRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1Jcbi8vIEFOWSBTUEVDSUFMLCBESVJFQ1QsIElORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVNcbi8vIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST00gTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTlxuLy8gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SIE9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0Zcbi8vIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SIFBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXG5cbi8qanNoaW50IGJyb3dzZXI6IHRydWUsIHN0cmljdDogdHJ1ZSwgaW1tZWQ6IHRydWUsIGxhdGVkZWY6IHRydWUsIHVuZGVmOiB0cnVlLCByZWdleGRhc2g6IGZhbHNlICovXG5cblxuY29uc3QgbWF4ID0gMTAwMDAwMDAwMDAwMDA7IC8vIGJpZ2dlc3QgaW50ZWdlciB0aGF0IGNhbiBzdGlsbCBmaXQgMl41MyB3aGVuIG11bHRpcGxpZWQgYnkgMjU2XG5cbmV4cG9ydCBjbGFzcyBJbnQxMCB7XG4gICAgY29uc3RydWN0b3IodmFsdWU/OnN0cmluZyB8IG51bWJlcikge1xuICAgICAgICB0aGlzLmJ1ZiA9IFsrdmFsdWUgfHwgMF07XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgbXVsQWRkKG06bnVtYmVyLCBjOm51bWJlcikge1xuICAgICAgICAvLyBhc3NlcnQobSA8PSAyNTYpXG4gICAgICAgIGNvbnN0IGIgPSB0aGlzLmJ1ZjtcbiAgICAgICAgY29uc3QgbCA9IGIubGVuZ3RoO1xuICAgICAgICBsZXQgaTtcbiAgICAgICAgbGV0IHQ7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIHQgPSBiW2ldICogbSArIGM7XG4gICAgICAgICAgICBpZiAodCA8IG1heCkge1xuICAgICAgICAgICAgICAgIGMgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjID0gMCB8ICh0IC8gbWF4KTtcbiAgICAgICAgICAgICAgICB0IC09IGMgKiBtYXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBiW2ldID0gdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYyA+IDApIHtcbiAgICAgICAgICAgIGJbaV0gPSBjO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN1YihjOm51bWJlcikge1xuICAgICAgICAvLyBhc3NlcnQobSA8PSAyNTYpXG4gICAgICAgIGNvbnN0IGIgPSB0aGlzLmJ1ZjtcbiAgICAgICAgY29uc3QgbCA9IGIubGVuZ3RoO1xuICAgICAgICBsZXQgaTtcbiAgICAgICAgbGV0IHQ7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIHQgPSBiW2ldIC0gYztcbiAgICAgICAgICAgIGlmICh0IDwgMCkge1xuICAgICAgICAgICAgICAgIHQgKz0gbWF4O1xuICAgICAgICAgICAgICAgIGMgPSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJbaV0gPSB0O1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChiW2IubGVuZ3RoIC0gMV0gPT09IDApIHtcbiAgICAgICAgICAgIGIucG9wKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoYmFzZT86bnVtYmVyKSB7XG4gICAgICAgIGlmICgoYmFzZSB8fCAxMCkgIT0gMTApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm9ubHkgYmFzZSAxMCBpcyBzdXBwb3J0ZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYiA9IHRoaXMuYnVmO1xuICAgICAgICBsZXQgcyA9IGJbYi5sZW5ndGggLSAxXS50b1N0cmluZygpO1xuICAgICAgICBmb3IgKGxldCBpID0gYi5sZW5ndGggLSAyOyBpID49IDA7IC0taSkge1xuICAgICAgICAgICAgcyArPSAobWF4ICsgYltpXSkudG9TdHJpbmcoKS5zdWJzdHJpbmcoMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfVxuXG4gICAgcHVibGljIHZhbHVlT2YoKSB7XG4gICAgICAgIGNvbnN0IGIgPSB0aGlzLmJ1ZjtcbiAgICAgICAgbGV0IHYgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gYi5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICAgICAgdiA9IHYgKiBtYXggKyBiW2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2O1xuICAgIH1cblxuICAgIHB1YmxpYyBzaW1wbGlmeSgpIHtcbiAgICAgICAgY29uc3QgYiA9IHRoaXMuYnVmO1xuICAgICAgICByZXR1cm4gKGIubGVuZ3RoID09IDEpID8gYlswXSA6IHRoaXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBidWY6bnVtYmVyW107XG59XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9hc24xanMvaW50MTAudHMiLCIvLyBEZXBlbmRzIG9uIGpzYm4uanMgYW5kIHJuZy5qc1xuXG4vLyBWZXJzaW9uIDEuMTogc3VwcG9ydCB1dGYtOCBlbmNvZGluZyBpbiBwa2NzMXBhZDJcblxuLy8gY29udmVydCBhIChoZXgpIHN0cmluZyB0byBhIGJpZ251bSBvYmplY3RcblxuaW1wb3J0IHtCaWdJbnRlZ2VyLCBuYmksIHBhcnNlQmlnSW50fSBmcm9tIFwiLi9qc2JuXCI7XG5pbXBvcnQge1NlY3VyZVJhbmRvbX0gZnJvbSBcIi4vcm5nXCI7XG5cblxuLy8gZnVuY3Rpb24gbGluZWJyayhzLG4pIHtcbi8vICAgdmFyIHJldCA9IFwiXCI7XG4vLyAgIHZhciBpID0gMDtcbi8vICAgd2hpbGUoaSArIG4gPCBzLmxlbmd0aCkge1xuLy8gICAgIHJldCArPSBzLnN1YnN0cmluZyhpLGkrbikgKyBcIlxcblwiO1xuLy8gICAgIGkgKz0gbjtcbi8vICAgfVxuLy8gICByZXR1cm4gcmV0ICsgcy5zdWJzdHJpbmcoaSxzLmxlbmd0aCk7XG4vLyB9XG5cbi8vIGZ1bmN0aW9uIGJ5dGUySGV4KGIpIHtcbi8vICAgaWYoYiA8IDB4MTApXG4vLyAgICAgcmV0dXJuIFwiMFwiICsgYi50b1N0cmluZygxNik7XG4vLyAgIGVsc2Vcbi8vICAgICByZXR1cm4gYi50b1N0cmluZygxNik7XG4vLyB9XG5cbi8vIFBLQ1MjMSAodHlwZSAyLCByYW5kb20pIHBhZCBpbnB1dCBzdHJpbmcgcyB0byBuIGJ5dGVzLCBhbmQgcmV0dXJuIGEgYmlnaW50XG5mdW5jdGlvbiBwa2NzMXBhZDIoczpzdHJpbmcsIG46bnVtYmVyKSB7XG4gICAgaWYgKG4gPCBzLmxlbmd0aCArIDExKSB7IC8vIFRPRE86IGZpeCBmb3IgdXRmLThcblxuICAgICAgICBjb25zb2xlLmVycm9yKFwiTWVzc2FnZSB0b28gbG9uZyBmb3IgUlNBXCIpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgYmEgPSBbXTtcbiAgICBsZXQgaSA9IHMubGVuZ3RoIC0gMTtcbiAgICB3aGlsZSAoaSA+PSAwICYmIG4gPiAwKSB7XG4gICAgICAgIGNvbnN0IGMgPSBzLmNoYXJDb2RlQXQoaS0tKTtcbiAgICAgICAgaWYgKGMgPCAxMjgpIHsgLy8gZW5jb2RlIHVzaW5nIHV0Zi04XG4gICAgICAgICAgICBiYVstLW5dID0gYztcbiAgICAgICAgfSBlbHNlIGlmICgoYyA+IDEyNykgJiYgKGMgPCAyMDQ4KSkge1xuICAgICAgICAgICAgYmFbLS1uXSA9IChjICYgNjMpIHwgMTI4O1xuICAgICAgICAgICAgYmFbLS1uXSA9IChjID4+IDYpIHwgMTkyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmFbLS1uXSA9IChjICYgNjMpIHwgMTI4O1xuICAgICAgICAgICAgYmFbLS1uXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcbiAgICAgICAgICAgIGJhWy0tbl0gPSAoYyA+PiAxMikgfCAyMjQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYmFbLS1uXSA9IDA7XG4gICAgY29uc3Qgcm5nID0gbmV3IFNlY3VyZVJhbmRvbSgpO1xuICAgIGNvbnN0IHggPSBbXTtcbiAgICB3aGlsZSAobiA+IDIpIHsgLy8gcmFuZG9tIG5vbi16ZXJvIHBhZFxuICAgICAgICB4WzBdID0gMDtcbiAgICAgICAgd2hpbGUgKHhbMF0gPT0gMCkge1xuICAgICAgICAgICAgcm5nLm5leHRCeXRlcyh4KTtcbiAgICAgICAgfVxuICAgICAgICBiYVstLW5dID0geFswXTtcbiAgICB9XG4gICAgYmFbLS1uXSA9IDI7XG4gICAgYmFbLS1uXSA9IDA7XG4gICAgcmV0dXJuIG5ldyBCaWdJbnRlZ2VyKGJhKTtcbn1cblxuLy8gXCJlbXB0eVwiIFJTQSBrZXkgY29uc3RydWN0b3JcbmV4cG9ydCBjbGFzcyBSU0FLZXkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5uID0gbnVsbDtcbiAgICAgICAgdGhpcy5lID0gMDtcbiAgICAgICAgdGhpcy5kID0gbnVsbDtcbiAgICAgICAgdGhpcy5wID0gbnVsbDtcbiAgICAgICAgdGhpcy5xID0gbnVsbDtcbiAgICAgICAgdGhpcy5kbXAxID0gbnVsbDtcbiAgICAgICAgdGhpcy5kbXExID0gbnVsbDtcbiAgICAgICAgdGhpcy5jb2VmZiA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8jcmVnaW9uIFBST1RFQ1RFRFxuICAgIC8vIHByb3RlY3RlZFxuICAgIC8vIFJTQUtleS5wcm90b3R5cGUuZG9QdWJsaWMgPSBSU0FEb1B1YmxpYztcbiAgICAvLyBQZXJmb3JtIHJhdyBwdWJsaWMgb3BlcmF0aW9uIG9uIFwieFwiOiByZXR1cm4geF5lIChtb2QgbilcbiAgICBwdWJsaWMgZG9QdWJsaWMoeDpCaWdJbnRlZ2VyKSB7XG4gICAgICAgIHJldHVybiB4Lm1vZFBvd0ludCh0aGlzLmUsIHRoaXMubik7XG4gICAgfVxuXG5cbiAgICAvLyBSU0FLZXkucHJvdG90eXBlLmRvUHJpdmF0ZSA9IFJTQURvUHJpdmF0ZTtcbiAgICAvLyBQZXJmb3JtIHJhdyBwcml2YXRlIG9wZXJhdGlvbiBvbiBcInhcIjogcmV0dXJuIHheZCAobW9kIG4pXG4gICAgcHVibGljIGRvUHJpdmF0ZSh4OkJpZ0ludGVnZXIpIHtcbiAgICAgICAgaWYgKHRoaXMucCA9PSBudWxsIHx8IHRoaXMucSA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4geC5tb2RQb3codGhpcy5kLCB0aGlzLm4pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ETzogcmUtY2FsY3VsYXRlIGFueSBtaXNzaW5nIENSVCBwYXJhbXNcbiAgICAgICAgbGV0IHhwID0geC5tb2QodGhpcy5wKS5tb2RQb3codGhpcy5kbXAxLCB0aGlzLnApO1xuICAgICAgICBjb25zdCB4cSA9IHgubW9kKHRoaXMucSkubW9kUG93KHRoaXMuZG1xMSwgdGhpcy5xKTtcblxuICAgICAgICB3aGlsZSAoeHAuY29tcGFyZVRvKHhxKSA8IDApIHtcbiAgICAgICAgICAgIHhwID0geHAuYWRkKHRoaXMucCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHhwLnN1YnRyYWN0KHhxKS5tdWx0aXBseSh0aGlzLmNvZWZmKS5tb2QodGhpcy5wKS5tdWx0aXBseSh0aGlzLnEpLmFkZCh4cSk7XG4gICAgfVxuXG4gICAgLy8jZW5kcmVnaW9uIFBST1RFQ1RFRFxuXG4gICAgLy8jcmVnaW9uIFBVQkxJQ1xuXG4gICAgLy8gUlNBS2V5LnByb3RvdHlwZS5zZXRQdWJsaWMgPSBSU0FTZXRQdWJsaWM7XG4gICAgLy8gU2V0IHRoZSBwdWJsaWMga2V5IGZpZWxkcyBOIGFuZCBlIGZyb20gaGV4IHN0cmluZ3NcbiAgICBwdWJsaWMgc2V0UHVibGljKE46c3RyaW5nLCBFOnN0cmluZykge1xuICAgICAgICBpZiAoTiAhPSBudWxsICYmIEUgIT0gbnVsbCAmJiBOLmxlbmd0aCA+IDAgJiYgRS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLm4gPSBwYXJzZUJpZ0ludChOLCAxNik7XG4gICAgICAgICAgICB0aGlzLmUgPSBwYXJzZUludChFLCAxNik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBSU0EgcHVibGljIGtleVwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gUlNBS2V5LnByb3RvdHlwZS5lbmNyeXB0ID0gUlNBRW5jcnlwdDtcbiAgICAvLyBSZXR1cm4gdGhlIFBLQ1MjMSBSU0EgZW5jcnlwdGlvbiBvZiBcInRleHRcIiBhcyBhbiBldmVuLWxlbmd0aCBoZXggc3RyaW5nXG4gICAgcHVibGljIGVuY3J5cHQodGV4dDpzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgbSA9IHBrY3MxcGFkMih0ZXh0LCAodGhpcy5uLmJpdExlbmd0aCgpICsgNykgPj4gMyk7XG5cbiAgICAgICAgaWYgKG0gPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYyA9IHRoaXMuZG9QdWJsaWMobSk7XG4gICAgICAgIGlmIChjID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGggPSBjLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgaWYgKChoLmxlbmd0aCAmIDEpID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwiMFwiICsgaDtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gUlNBS2V5LnByb3RvdHlwZS5zZXRQcml2YXRlID0gUlNBU2V0UHJpdmF0ZTtcbiAgICAvLyBTZXQgdGhlIHByaXZhdGUga2V5IGZpZWxkcyBOLCBlLCBhbmQgZCBmcm9tIGhleCBzdHJpbmdzXG4gICAgcHVibGljIHNldFByaXZhdGUoTjpzdHJpbmcsIEU6c3RyaW5nLCBEOnN0cmluZykge1xuICAgICAgICBpZiAoTiAhPSBudWxsICYmIEUgIT0gbnVsbCAmJiBOLmxlbmd0aCA+IDAgJiYgRS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLm4gPSBwYXJzZUJpZ0ludChOLCAxNik7XG4gICAgICAgICAgICB0aGlzLmUgPSBwYXJzZUludChFLCAxNik7XG4gICAgICAgICAgICB0aGlzLmQgPSBwYXJzZUJpZ0ludChELCAxNik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBSU0EgcHJpdmF0ZSBrZXlcIik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vIFJTQUtleS5wcm90b3R5cGUuc2V0UHJpdmF0ZUV4ID0gUlNBU2V0UHJpdmF0ZUV4O1xuICAgIC8vIFNldCB0aGUgcHJpdmF0ZSBrZXkgZmllbGRzIE4sIGUsIGQgYW5kIENSVCBwYXJhbXMgZnJvbSBoZXggc3RyaW5nc1xuICAgIHB1YmxpYyBzZXRQcml2YXRlRXgoTjpzdHJpbmcsIEU6c3RyaW5nLCBEOnN0cmluZywgUDpzdHJpbmcsIFE6c3RyaW5nLCBEUDpzdHJpbmcsIERROnN0cmluZywgQzpzdHJpbmcpIHtcbiAgICAgICAgaWYgKE4gIT0gbnVsbCAmJiBFICE9IG51bGwgJiYgTi5sZW5ndGggPiAwICYmIEUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5uID0gcGFyc2VCaWdJbnQoTiwgMTYpO1xuICAgICAgICAgICAgdGhpcy5lID0gcGFyc2VJbnQoRSwgMTYpO1xuICAgICAgICAgICAgdGhpcy5kID0gcGFyc2VCaWdJbnQoRCwgMTYpO1xuICAgICAgICAgICAgdGhpcy5wID0gcGFyc2VCaWdJbnQoUCwgMTYpO1xuICAgICAgICAgICAgdGhpcy5xID0gcGFyc2VCaWdJbnQoUSwgMTYpO1xuICAgICAgICAgICAgdGhpcy5kbXAxID0gcGFyc2VCaWdJbnQoRFAsIDE2KTtcbiAgICAgICAgICAgIHRoaXMuZG1xMSA9IHBhcnNlQmlnSW50KERRLCAxNik7XG4gICAgICAgICAgICB0aGlzLmNvZWZmID0gcGFyc2VCaWdJbnQoQywgMTYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgUlNBIHByaXZhdGUga2V5XCIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvLyBSU0FLZXkucHJvdG90eXBlLmdlbmVyYXRlID0gUlNBR2VuZXJhdGU7XG4gICAgLy8gR2VuZXJhdGUgYSBuZXcgcmFuZG9tIHByaXZhdGUga2V5IEIgYml0cyBsb25nLCB1c2luZyBwdWJsaWMgZXhwdCBFXG4gICAgcHVibGljIGdlbmVyYXRlKEI6bnVtYmVyLCBFOnN0cmluZykge1xuICAgICAgICBjb25zdCBybmcgPSBuZXcgU2VjdXJlUmFuZG9tKCk7XG4gICAgICAgIGNvbnN0IHFzID0gQiA+PiAxO1xuICAgICAgICB0aGlzLmUgPSBwYXJzZUludChFLCAxNik7XG4gICAgICAgIGNvbnN0IGVlID0gbmV3IEJpZ0ludGVnZXIoRSwgMTYpO1xuICAgICAgICBmb3IgKDs7KSB7XG4gICAgICAgICAgICBmb3IgKDs7KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wID0gbmV3IEJpZ0ludGVnZXIoQiAtIHFzLCAxLCBybmcpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnAuc3VidHJhY3QoQmlnSW50ZWdlci5PTkUpLmdjZChlZSkuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKSA9PSAwICYmIHRoaXMucC5pc1Byb2JhYmxlUHJpbWUoMTApKSB7IGJyZWFrOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKDs7KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5xID0gbmV3IEJpZ0ludGVnZXIocXMsIDEsIHJuZyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucS5zdWJ0cmFjdChCaWdJbnRlZ2VyLk9ORSkuZ2NkKGVlKS5jb21wYXJlVG8oQmlnSW50ZWdlci5PTkUpID09IDAgJiYgdGhpcy5xLmlzUHJvYmFibGVQcmltZSgxMCkpIHsgYnJlYWs7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnAuY29tcGFyZVRvKHRoaXMucSkgPD0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHQgPSB0aGlzLnA7XG4gICAgICAgICAgICAgICAgdGhpcy5wID0gdGhpcy5xO1xuICAgICAgICAgICAgICAgIHRoaXMucSA9IHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwMSA9IHRoaXMucC5zdWJ0cmFjdChCaWdJbnRlZ2VyLk9ORSk7XG4gICAgICAgICAgICBjb25zdCBxMSA9IHRoaXMucS5zdWJ0cmFjdChCaWdJbnRlZ2VyLk9ORSk7XG4gICAgICAgICAgICBjb25zdCBwaGkgPSBwMS5tdWx0aXBseShxMSk7XG4gICAgICAgICAgICBpZiAocGhpLmdjZChlZSkuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uID0gdGhpcy5wLm11bHRpcGx5KHRoaXMucSk7XG4gICAgICAgICAgICAgICAgdGhpcy5kID0gZWUubW9kSW52ZXJzZShwaGkpO1xuICAgICAgICAgICAgICAgIHRoaXMuZG1wMSA9IHRoaXMuZC5tb2QocDEpO1xuICAgICAgICAgICAgICAgIHRoaXMuZG1xMSA9IHRoaXMuZC5tb2QocTEpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29lZmYgPSB0aGlzLnEubW9kSW52ZXJzZSh0aGlzLnApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUlNBS2V5LnByb3RvdHlwZS5kZWNyeXB0ID0gUlNBRGVjcnlwdDtcbiAgICAvLyBSZXR1cm4gdGhlIFBLQ1MjMSBSU0EgZGVjcnlwdGlvbiBvZiBcImN0ZXh0XCIuXG4gICAgLy8gXCJjdGV4dFwiIGlzIGFuIGV2ZW4tbGVuZ3RoIGhleCBzdHJpbmcgYW5kIHRoZSBvdXRwdXQgaXMgYSBwbGFpbiBzdHJpbmcuXG4gICAgcHVibGljIGRlY3J5cHQoY3RleHQ6c3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGMgPSBwYXJzZUJpZ0ludChjdGV4dCwgMTYpO1xuICAgICAgICBjb25zdCBtID0gdGhpcy5kb1ByaXZhdGUoYyk7XG4gICAgICAgIGlmIChtID09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgICAgcmV0dXJuIHBrY3MxdW5wYWQyKG0sICh0aGlzLm4uYml0TGVuZ3RoKCkgKyA3KSA+PiAzKTtcbiAgICB9XG5cbiAgICAvLyBHZW5lcmF0ZSBhIG5ldyByYW5kb20gcHJpdmF0ZSBrZXkgQiBiaXRzIGxvbmcsIHVzaW5nIHB1YmxpYyBleHB0IEVcbiAgICBwdWJsaWMgZ2VuZXJhdGVBc3luYyhCOm51bWJlciwgRTpzdHJpbmcsIGNhbGxiYWNrOigpID0+IHZvaWQpIHtcbiAgICAgICAgY29uc3Qgcm5nID0gbmV3IFNlY3VyZVJhbmRvbSgpO1xuICAgICAgICBjb25zdCBxcyA9IEIgPj4gMTtcbiAgICAgICAgdGhpcy5lID0gcGFyc2VJbnQoRSwgMTYpO1xuICAgICAgICBjb25zdCBlZSA9IG5ldyBCaWdJbnRlZ2VyKEUsIDE2KTtcbiAgICAgICAgY29uc3QgcnNhID0gdGhpcztcbiAgICAgICAgLy8gVGhlc2UgZnVuY3Rpb25zIGhhdmUgbm9uLWRlc2NyaXB0IG5hbWVzIGJlY2F1c2UgdGhleSB3ZXJlIG9yaWdpbmFsbHkgZm9yKDs7KSBsb29wcy5cbiAgICAgICAgLy8gSSBkb24ndCBrbm93IGFib3V0IGNyeXB0b2dyYXBoeSB0byBnaXZlIHRoZW0gYmV0dGVyIG5hbWVzIHRoYW4gbG9vcDEtNC5cbiAgICAgICAgY29uc3QgbG9vcDEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBsb29wNCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAocnNhLnAuY29tcGFyZVRvKHJzYS5xKSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSByc2EucDtcbiAgICAgICAgICAgICAgICAgICAgcnNhLnAgPSByc2EucTtcbiAgICAgICAgICAgICAgICAgICAgcnNhLnEgPSB0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBwMSA9IHJzYS5wLnN1YnRyYWN0KEJpZ0ludGVnZXIuT05FKTtcbiAgICAgICAgICAgICAgICBjb25zdCBxMSA9IHJzYS5xLnN1YnRyYWN0KEJpZ0ludGVnZXIuT05FKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwaGkgPSBwMS5tdWx0aXBseShxMSk7XG4gICAgICAgICAgICAgICAgaWYgKHBoaS5nY2QoZWUpLmNvbXBhcmVUbyhCaWdJbnRlZ2VyLk9ORSkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByc2EubiA9IHJzYS5wLm11bHRpcGx5KHJzYS5xKTtcbiAgICAgICAgICAgICAgICAgICAgcnNhLmQgPSBlZS5tb2RJbnZlcnNlKHBoaSk7XG4gICAgICAgICAgICAgICAgICAgIHJzYS5kbXAxID0gcnNhLmQubW9kKHAxKTtcbiAgICAgICAgICAgICAgICAgICAgcnNhLmRtcTEgPSByc2EuZC5tb2QocTEpO1xuICAgICAgICAgICAgICAgICAgICByc2EuY29lZmYgPSByc2EucS5tb2RJbnZlcnNlKHJzYS5wKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7Y2FsbGJhY2soKTsgfSwgMCk7IC8vIGVzY2FwZVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQobG9vcDEsIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBsb29wMyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByc2EucSA9IG5iaSgpO1xuICAgICAgICAgICAgICAgIHJzYS5xLmZyb21OdW1iZXJBc3luYyhxcywgMSwgcm5nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJzYS5xLnN1YnRyYWN0KEJpZ0ludGVnZXIuT05FKS5nY2RhKGVlLCBmdW5jdGlvbiAocikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKSA9PSAwICYmIHJzYS5xLmlzUHJvYmFibGVQcmltZSgxMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGxvb3A0LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChsb29wMywgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IGxvb3AyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJzYS5wID0gbmJpKCk7XG4gICAgICAgICAgICAgICAgcnNhLnAuZnJvbU51bWJlckFzeW5jKEIgLSBxcywgMSwgcm5nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJzYS5wLnN1YnRyYWN0KEJpZ0ludGVnZXIuT05FKS5nY2RhKGVlLCBmdW5jdGlvbiAocikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKSA9PSAwICYmIHJzYS5wLmlzUHJvYmFibGVQcmltZSgxMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGxvb3AzLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChsb29wMiwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQobG9vcDIsIDApO1xuICAgICAgICB9O1xuICAgICAgICBzZXRUaW1lb3V0KGxvb3AxLCAwKTtcbiAgICB9XG5cbiAgICAvLyNlbmRyZWdpb24gUFVCTElDXG5cbiAgICBwcm90ZWN0ZWQgbjpCaWdJbnRlZ2VyO1xuICAgIHByb3RlY3RlZCBlOm51bWJlcjtcbiAgICBwcm90ZWN0ZWQgZDpCaWdJbnRlZ2VyO1xuICAgIHByb3RlY3RlZCBwOkJpZ0ludGVnZXI7XG4gICAgcHJvdGVjdGVkIHE6QmlnSW50ZWdlcjtcbiAgICBwcm90ZWN0ZWQgZG1wMTpCaWdJbnRlZ2VyO1xuICAgIHByb3RlY3RlZCBkbXExOkJpZ0ludGVnZXI7XG4gICAgcHJvdGVjdGVkIGNvZWZmOkJpZ0ludGVnZXI7XG5cbn1cblxuXG4vLyBVbmRvIFBLQ1MjMSAodHlwZSAyLCByYW5kb20pIHBhZGRpbmcgYW5kLCBpZiB2YWxpZCwgcmV0dXJuIHRoZSBwbGFpbnRleHRcbmZ1bmN0aW9uIHBrY3MxdW5wYWQyKGQ6QmlnSW50ZWdlciwgbjpudW1iZXIpOnN0cmluZyB7XG4gICAgY29uc3QgYiA9IGQudG9CeXRlQXJyYXkoKTtcbiAgICBsZXQgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBiLmxlbmd0aCAmJiBiW2ldID09IDApIHsgKytpOyB9XG4gICAgaWYgKGIubGVuZ3RoIC0gaSAhPSBuIC0gMSB8fCBiW2ldICE9IDIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgICsraTtcbiAgICB3aGlsZSAoYltpXSAhPSAwKSB7XG4gICAgICAgIGlmICgrK2kgPj0gYi5sZW5ndGgpIHsgcmV0dXJuIG51bGw7IH1cbiAgICB9XG4gICAgbGV0IHJldCA9IFwiXCI7XG4gICAgd2hpbGUgKCsraSA8IGIubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGMgPSBiW2ldICYgMjU1O1xuICAgICAgICBpZiAoYyA8IDEyOCkgeyAvLyB1dGYtOCBkZWNvZGVcbiAgICAgICAgICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpO1xuICAgICAgICB9IGVsc2UgaWYgKChjID4gMTkxKSAmJiAoYyA8IDIyNCkpIHtcbiAgICAgICAgICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYyAmIDMxKSA8PCA2KSB8IChiW2kgKyAxXSAmIDYzKSk7XG4gICAgICAgICAgICArK2k7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMgJiAxNSkgPDwgMTIpIHwgKChiW2kgKyAxXSAmIDYzKSA8PCA2KSB8IChiW2kgKyAyXSAmIDYzKSk7XG4gICAgICAgICAgICBpICs9IDI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn1cblxuXG4vLyBSZXR1cm4gdGhlIFBLQ1MjMSBSU0EgZW5jcnlwdGlvbiBvZiBcInRleHRcIiBhcyBhIEJhc2U2NC1lbmNvZGVkIHN0cmluZ1xuLy8gZnVuY3Rpb24gUlNBRW5jcnlwdEI2NCh0ZXh0KSB7XG4vLyAgdmFyIGggPSB0aGlzLmVuY3J5cHQodGV4dCk7XG4vLyAgaWYoaCkgcmV0dXJuIGhleDJiNjQoaCk7IGVsc2UgcmV0dXJuIG51bGw7XG4vLyB9XG5cblxuLy8gcHVibGljXG5cbi8vIFJTQUtleS5wcm90b3R5cGUuZW5jcnlwdF9iNjQgPSBSU0FFbmNyeXB0QjY0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL2pzYm4vcnNhLnRzIiwiLy8gUmFuZG9tIG51bWJlciBnZW5lcmF0b3IgLSByZXF1aXJlcyBhIFBSTkcgYmFja2VuZCwgZS5nLiBwcm5nNC5qc1xuaW1wb3J0IHtBcmNmb3VyLCBwcm5nX25ld3N0YXRlLCBybmdfcHNpemV9IGZyb20gXCIuL3Bybmc0XCI7XG5cbmxldCBybmdfc3RhdGU6QXJjZm91cjtcbmxldCBybmdfcG9vbDpudW1iZXJbXSA9IG51bGw7XG5sZXQgcm5nX3BwdHI6bnVtYmVyO1xuXG4vLyBJbml0aWFsaXplIHRoZSBwb29sIHdpdGgganVuayBpZiBuZWVkZWQuXG5pZiAocm5nX3Bvb2wgPT0gbnVsbCkge1xuICBybmdfcG9vbCA9IFtdO1xuICBybmdfcHB0ciA9IDA7XG4gIGxldCB0O1xuICBpZiAod2luZG93LmNyeXB0byAmJiB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xuICAgIC8vIEV4dHJhY3QgZW50cm9weSAoMjA0OCBiaXRzKSBmcm9tIFJORyBpZiBhdmFpbGFibGVcbiAgICBjb25zdCB6ID0gbmV3IFVpbnQzMkFycmF5KDI1Nik7XG4gICAgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoeik7XG4gICAgZm9yICh0ID0gMDsgdCA8IHoubGVuZ3RoOyArK3QpIHtcbiAgICAgICAgcm5nX3Bvb2xbcm5nX3BwdHIrK10gPSB6W3RdICYgMjU1O1xuICAgIH1cbiAgfVxuXG4gIC8vIFVzZSBtb3VzZSBldmVudHMgZm9yIGVudHJvcHksIGlmIHdlIGRvIG5vdCBoYXZlIGVub3VnaCBlbnRyb3B5IGJ5IHRoZSB0aW1lXG4gIC8vIHdlIG5lZWQgaXQsIGVudHJvcHkgd2lsbCBiZSBnZW5lcmF0ZWQgYnkgTWF0aC5yYW5kb20uXG4gIGNvbnN0IG9uTW91c2VNb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiAoZXY6RXZlbnQgJiB7eDpudW1iZXI7IHk6bnVtYmVyOyB9KSB7XG4gICAgdGhpcy5jb3VudCA9IHRoaXMuY291bnQgfHwgMDtcbiAgICBpZiAodGhpcy5jb3VudCA+PSAyNTYgfHwgcm5nX3BwdHIgPj0gcm5nX3BzaXplKSB7XG4gICAgICBpZiAod2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZUxpc3RlbmVyLCBmYWxzZSk7XG4gICAgICB9IGVsc2UgaWYgKCh3aW5kb3cgYXMgYW55KS5kZXRhY2hFdmVudCkge1xuICAgICAgICAgICh3aW5kb3cgYXMgYW55KS5kZXRhY2hFdmVudChcIm9ubW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlTGlzdGVuZXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgbW91c2VDb29yZGluYXRlcyA9IGV2LnggKyBldi55O1xuICAgICAgcm5nX3Bvb2xbcm5nX3BwdHIrK10gPSBtb3VzZUNvb3JkaW5hdGVzICYgMjU1O1xuICAgICAgdGhpcy5jb3VudCArPSAxO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIFNvbWV0aW1lcyBGaXJlZm94IHdpbGwgZGVueSBwZXJtaXNzaW9uIHRvIGFjY2VzcyBldmVudCBwcm9wZXJ0aWVzIGZvciBzb21lIHJlYXNvbi4gSWdub3JlLlxuICAgIH1cbiAgfTtcbiAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZUxpc3RlbmVyLCBmYWxzZSk7XG4gIH0gZWxzZSBpZiAoKHdpbmRvdyBhcyBhbnkpLmF0dGFjaEV2ZW50KSB7XG4gICAgICAod2luZG93IGFzIGFueSkuYXR0YWNoRXZlbnQoXCJvbm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZUxpc3RlbmVyKTtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIHJuZ19nZXRfYnl0ZSgpIHtcbiAgaWYgKHJuZ19zdGF0ZSA9PSBudWxsKSB7XG4gICAgcm5nX3N0YXRlID0gcHJuZ19uZXdzdGF0ZSgpO1xuICAgIC8vIEF0IHRoaXMgcG9pbnQsIHdlIG1heSBub3QgaGF2ZSBjb2xsZWN0ZWQgZW5vdWdoIGVudHJvcHkuICBJZiBub3QsIGZhbGwgYmFjayB0byBNYXRoLnJhbmRvbVxuICAgIHdoaWxlIChybmdfcHB0ciA8IHJuZ19wc2l6ZSkge1xuICAgICAgY29uc3QgcmFuZG9tID0gTWF0aC5mbG9vcig2NTUzNiAqIE1hdGgucmFuZG9tKCkpO1xuICAgICAgcm5nX3Bvb2xbcm5nX3BwdHIrK10gPSByYW5kb20gJiAyNTU7XG4gICAgfVxuICAgIHJuZ19zdGF0ZS5pbml0KHJuZ19wb29sKTtcbiAgICBmb3IgKHJuZ19wcHRyID0gMDsgcm5nX3BwdHIgPCBybmdfcG9vbC5sZW5ndGg7ICsrcm5nX3BwdHIpIHtcbiAgICAgICAgcm5nX3Bvb2xbcm5nX3BwdHJdID0gMDtcbiAgICB9XG4gICAgcm5nX3BwdHIgPSAwO1xuICB9XG4gIC8vIFRPRE86IGFsbG93IHJlc2VlZGluZyBhZnRlciBmaXJzdCByZXF1ZXN0XG4gIHJldHVybiBybmdfc3RhdGUubmV4dCgpO1xufVxuXG5cbmV4cG9ydCBjbGFzcyBTZWN1cmVSYW5kb20ge1xuXG4gIHB1YmxpYyBuZXh0Qnl0ZXMoYmE6bnVtYmVyW10pIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmEubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBiYVtpXSA9IHJuZ19nZXRfYnl0ZSgpO1xuICAgICAgfVxuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvanNibi9ybmcudHMiLCIvLyBwcm5nNC5qcyAtIHVzZXMgQXJjZm91ciBhcyBhIFBSTkdcblxuZXhwb3J0IGNsYXNzIEFyY2ZvdXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmkgPSAwO1xuICAgICAgICB0aGlzLmogPSAwO1xuICAgICAgICB0aGlzLlMgPSBbXTtcbiAgICB9XG5cbiAgICAvLyBBcmNmb3VyLnByb3RvdHlwZS5pbml0ID0gQVJDNGluaXQ7XG4gICAgLy8gSW5pdGlhbGl6ZSBhcmNmb3VyIGNvbnRleHQgZnJvbSBrZXksIGFuIGFycmF5IG9mIGludHMsIGVhY2ggZnJvbSBbMC4uMjU1XVxuICAgIHB1YmxpYyBpbml0KGtleTpudW1iZXJbXSkge1xuICAgICAgICBsZXQgaTtcbiAgICAgICAgbGV0IGo7XG4gICAgICAgIGxldCB0O1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgICAgICAgICAgIHRoaXMuU1tpXSA9IGk7XG4gICAgICAgIH1cbiAgICAgICAgaiA9IDA7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICAgICAgICAgICAgaiA9IChqICsgdGhpcy5TW2ldICsga2V5W2kgJSBrZXkubGVuZ3RoXSkgJiAyNTU7XG4gICAgICAgICAgICB0ID0gdGhpcy5TW2ldO1xuICAgICAgICAgICAgdGhpcy5TW2ldID0gdGhpcy5TW2pdO1xuICAgICAgICAgICAgdGhpcy5TW2pdID0gdDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmkgPSAwO1xuICAgICAgICB0aGlzLmogPSAwO1xuICAgIH1cblxuICAgIC8vIEFyY2ZvdXIucHJvdG90eXBlLm5leHQgPSBBUkM0bmV4dDtcbiAgICBwdWJsaWMgbmV4dCgpIHtcbiAgICAgICAgbGV0IHQ7XG4gICAgICAgIHRoaXMuaSA9ICh0aGlzLmkgKyAxKSAmIDI1NTtcbiAgICAgICAgdGhpcy5qID0gKHRoaXMuaiArIHRoaXMuU1t0aGlzLmldKSAmIDI1NTtcbiAgICAgICAgdCA9IHRoaXMuU1t0aGlzLmldO1xuICAgICAgICB0aGlzLlNbdGhpcy5pXSA9IHRoaXMuU1t0aGlzLmpdO1xuICAgICAgICB0aGlzLlNbdGhpcy5qXSA9IHQ7XG4gICAgICAgIHJldHVybiB0aGlzLlNbKHQgKyB0aGlzLlNbdGhpcy5pXSkgJiAyNTVdO1xuICAgIH1cblxuICAgIHByaXZhdGUgaTpudW1iZXI7XG4gICAgcHJpdmF0ZSBqOm51bWJlcjtcbiAgICBwcml2YXRlIFM6bnVtYmVyW107XG59XG5cblxuLy8gUGx1ZyBpbiB5b3VyIFJORyBjb25zdHJ1Y3RvciBoZXJlXG5leHBvcnQgZnVuY3Rpb24gcHJuZ19uZXdzdGF0ZSgpIHtcbiAgICByZXR1cm4gbmV3IEFyY2ZvdXIoKTtcbn1cblxuLy8gUG9vbCBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0IGFuZCBncmVhdGVyIHRoYW4gMzIuXG4vLyBBbiBhcnJheSBvZiBieXRlcyB0aGUgc2l6ZSBvZiB0aGUgcG9vbCB3aWxsIGJlIHBhc3NlZCB0byBpbml0KClcbmV4cG9ydCBsZXQgcm5nX3BzaXplID0gMjU2O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL2pzYm4vcHJuZzQudHMiLCIvKiBhc24xLTEuMC4xMy5qcyAoYykgMjAxMy0yMDE3IEtlbmppIFVydXNoaW1hIHwga2p1ci5naXRodWIuY29tL2pzcnNhc2lnbi9saWNlbnNlXG4gKi9cbi8qXG4gKiBhc24xLmpzIC0gQVNOLjEgREVSIGVuY29kZXIgY2xhc3Nlc1xuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMy0yMDE3IEtlbmppIFVydXNoaW1hIChrZW5qaS51cnVzaGltYUBnbWFpbC5jb20pXG4gKlxuICogVGhpcyBzb2Z0d2FyZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cHM6Ly9ranVyLmdpdGh1Yi5pby9qc3JzYXNpZ24vbGljZW5zZVxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgYW5kIGxpY2Vuc2Ugbm90aWNlIHNoYWxsIGJlXG4gKiBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqL1xuXG5pbXBvcnQge0JpZ0ludGVnZXJ9IGZyb20gXCIuLi9qc2JuL2pzYm5cIjtcbmltcG9ydCB7WUFIT099IGZyb20gXCIuL3lhaG9vXCI7XG5cbi8qKlxuICogQGZpbGVPdmVydmlld1xuICogQG5hbWUgYXNuMS0xLjAuanNcbiAqIEBhdXRob3IgS2VuamkgVXJ1c2hpbWEga2VuamkudXJ1c2hpbWFAZ21haWwuY29tXG4gKiBAdmVyc2lvbiBhc24xIDEuMC4xMyAoMjAxNy1KdW4tMDIpXG4gKiBAc2luY2UganNyc2FzaWduIDIuMVxuICogQGxpY2Vuc2UgPGEgaHJlZj1cImh0dHBzOi8va2p1ci5naXRodWIuaW8vanNyc2FzaWduL2xpY2Vuc2UvXCI+TUlUIExpY2Vuc2U8L2E+XG4gKi9cblxuLyoqXG4gKiBranVyJ3MgY2xhc3MgbGlicmFyeSBuYW1lIHNwYWNlXG4gKiA8cD5cbiAqIFRoaXMgbmFtZSBzcGFjZSBwcm92aWRlcyBmb2xsb3dpbmcgbmFtZSBzcGFjZXM6XG4gKiA8dWw+XG4gKiA8bGk+e0BsaW5rIEtKVVIuYXNuMX0gLSBBU04uMSBwcmltaXRpdmUgaGV4YWRlY2ltYWwgZW5jb2RlcjwvbGk+XG4gKiA8bGk+e0BsaW5rIEtKVVIuYXNuMS54NTA5fSAtIEFTTi4xIHN0cnVjdHVyZSBmb3IgWC41MDkgY2VydGlmaWNhdGUgYW5kIENSTDwvbGk+XG4gKiA8bGk+e0BsaW5rIEtKVVIuY3J5cHRvfSAtIEphdmEgQ3J5cHRvZ3JhcGhpYyBFeHRlbnNpb24oSkNFKSBzdHlsZSBNZXNzYWdlRGlnZXN0L1NpZ25hdHVyZVxuICogY2xhc3MgYW5kIHV0aWxpdGllczwvbGk+XG4gKiA8L3VsPlxuICogPC9wPlxuICogTk9URTogUGxlYXNlIGlnbm9yZSBtZXRob2Qgc3VtbWFyeSBhbmQgZG9jdW1lbnQgb2YgdGhpcyBuYW1lc3BhY2UuIFRoaXMgY2F1c2VkIGJ5IGEgYnVnIG9mIGpzZG9jMi5cbiAqIEBuYW1lIEtKVVJcbiAqIEBuYW1lc3BhY2Uga2p1cidzIGNsYXNzIGxpYnJhcnkgbmFtZSBzcGFjZVxuICovXG5leHBvcnQgY29uc3QgS0pVUiA9IHt9O1xuXG4vKipcbiAqIGtqdXIncyBBU04uMSBjbGFzcyBsaWJyYXJ5IG5hbWUgc3BhY2VcbiAqIDxwPlxuICogVGhpcyBpcyBJVFUtVCBYLjY5MCBBU04uMSBERVIgZW5jb2RlciBjbGFzcyBsaWJyYXJ5IGFuZFxuICogY2xhc3Mgc3RydWN0dXJlIGFuZCBtZXRob2RzIGlzIHZlcnkgc2ltaWxhciB0b1xuICogb3JnLmJvdW5jeWNhc3RsZS5hc24xIHBhY2thZ2Ugb2ZcbiAqIHdlbGwga25vd24gQm91bmN5Q2FzbHRlIENyeXB0b2dyYXBoeSBMaWJyYXJ5LlxuICogPGg0PlBST1ZJRElORyBBU04uMSBQUklNSVRJVkVTPC9oND5cbiAqIEhlcmUgYXJlIEFTTi4xIERFUiBwcmltaXRpdmUgY2xhc3Nlcy5cbiAqIDx1bD5cbiAqIDxsaT4weDAxIHtAbGluayBLSlVSLmFzbjEuREVSQm9vbGVhbn08L2xpPlxuICogPGxpPjB4MDIge0BsaW5rIEtKVVIuYXNuMS5ERVJJbnRlZ2VyfTwvbGk+XG4gKiA8bGk+MHgwMyB7QGxpbmsgS0pVUi5hc24xLkRFUkJpdFN0cmluZ308L2xpPlxuICogPGxpPjB4MDQge0BsaW5rIEtKVVIuYXNuMS5ERVJPY3RldFN0cmluZ308L2xpPlxuICogPGxpPjB4MDUge0BsaW5rIEtKVVIuYXNuMS5ERVJOdWxsfTwvbGk+XG4gKiA8bGk+MHgwNiB7QGxpbmsgS0pVUi5hc24xLkRFUk9iamVjdElkZW50aWZpZXJ9PC9saT5cbiAqIDxsaT4weDBhIHtAbGluayBLSlVSLmFzbjEuREVSRW51bWVyYXRlZH08L2xpPlxuICogPGxpPjB4MGMge0BsaW5rIEtKVVIuYXNuMS5ERVJVVEY4U3RyaW5nfTwvbGk+XG4gKiA8bGk+MHgxMiB7QGxpbmsgS0pVUi5hc24xLkRFUk51bWVyaWNTdHJpbmd9PC9saT5cbiAqIDxsaT4weDEzIHtAbGluayBLSlVSLmFzbjEuREVSUHJpbnRhYmxlU3RyaW5nfTwvbGk+XG4gKiA8bGk+MHgxNCB7QGxpbmsgS0pVUi5hc24xLkRFUlRlbGV0ZXhTdHJpbmd9PC9saT5cbiAqIDxsaT4weDE2IHtAbGluayBLSlVSLmFzbjEuREVSSUE1U3RyaW5nfTwvbGk+XG4gKiA8bGk+MHgxNyB7QGxpbmsgS0pVUi5hc24xLkRFUlVUQ1RpbWV9PC9saT5cbiAqIDxsaT4weDE4IHtAbGluayBLSlVSLmFzbjEuREVSR2VuZXJhbGl6ZWRUaW1lfTwvbGk+XG4gKiA8bGk+MHgzMCB7QGxpbmsgS0pVUi5hc24xLkRFUlNlcXVlbmNlfTwvbGk+XG4gKiA8bGk+MHgzMSB7QGxpbmsgS0pVUi5hc24xLkRFUlNldH08L2xpPlxuICogPC91bD5cbiAqIDxoND5PVEhFUiBBU04uMSBDTEFTU0VTPC9oND5cbiAqIDx1bD5cbiAqIDxsaT57QGxpbmsgS0pVUi5hc24xLkFTTjFPYmplY3R9PC9saT5cbiAqIDxsaT57QGxpbmsgS0pVUi5hc24xLkRFUkFic3RyYWN0U3RyaW5nfTwvbGk+XG4gKiA8bGk+e0BsaW5rIEtKVVIuYXNuMS5ERVJBYnN0cmFjdFRpbWV9PC9saT5cbiAqIDxsaT57QGxpbmsgS0pVUi5hc24xLkRFUkFic3RyYWN0U3RydWN0dXJlZH08L2xpPlxuICogPGxpPntAbGluayBLSlVSLmFzbjEuREVSVGFnZ2VkT2JqZWN0fTwvbGk+XG4gKiA8L3VsPlxuICogPGg0PlNVQiBOQU1FIFNQQUNFUzwvaDQ+XG4gKiA8dWw+XG4gKiA8bGk+e0BsaW5rIEtKVVIuYXNuMS5jYWRlc30gLSBDQWRFUyBsb25nIHRlcm0gc2lnbmF0dXJlIGZvcm1hdDwvbGk+XG4gKiA8bGk+e0BsaW5rIEtKVVIuYXNuMS5jbXN9IC0gQ3J5cHRvZ3JhcGhpYyBNZXNzYWdlIFN5bnRheDwvbGk+XG4gKiA8bGk+e0BsaW5rIEtKVVIuYXNuMS5jc3J9IC0gQ2VydGlmaWNhdGUgU2lnbmluZyBSZXF1ZXN0IChDU1IvUEtDUyMxMCk8L2xpPlxuICogPGxpPntAbGluayBLSlVSLmFzbjEudHNwfSAtIFJGQyAzMTYxIFRpbWVzdGFtcGluZyBQcm90b2NvbCBGb3JtYXQ8L2xpPlxuICogPGxpPntAbGluayBLSlVSLmFzbjEueDUwOX0gLSBSRkMgNTI4MCBYLjUwOSBjZXJ0aWZpY2F0ZSBhbmQgQ1JMPC9saT5cbiAqIDwvdWw+XG4gKiA8L3A+XG4gKiBOT1RFOiBQbGVhc2UgaWdub3JlIG1ldGhvZCBzdW1tYXJ5IGFuZCBkb2N1bWVudCBvZiB0aGlzIG5hbWVzcGFjZS5cbiAqIFRoaXMgY2F1c2VkIGJ5IGEgYnVnIG9mIGpzZG9jMi5cbiAqIEBuYW1lIEtKVVIuYXNuMVxuICogQG5hbWVzcGFjZVxuICovXG5pZiAodHlwZW9mIEtKVVIuYXNuMSA9PSBcInVuZGVmaW5lZFwiIHx8ICFLSlVSLmFzbjEpIEtKVVIuYXNuMSA9IHt9O1xuXG4vKipcbiAqIEFTTjEgdXRpbGl0aWVzIGNsYXNzXG4gKiBAbmFtZSBLSlVSLmFzbjEuQVNOMVV0aWxcbiAqIEBjbGFzcyBBU04xIHV0aWxpdGllcyBjbGFzc1xuICogQHNpbmNlIGFzbjEgMS4wLjJcbiAqL1xuS0pVUi5hc24xLkFTTjFVdGlsID0gbmV3IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW50ZWdlclRvQnl0ZUhleCA9IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgdmFyIGggPSBpLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgaWYgKChoLmxlbmd0aCAlIDIpID09IDEpIGggPSAnMCcgKyBoO1xuICAgICAgICByZXR1cm4gaDtcbiAgICB9O1xuICAgIHRoaXMuYmlnSW50VG9NaW5Ud29zQ29tcGxlbWVudHNIZXggPSBmdW5jdGlvbihiaWdJbnRlZ2VyVmFsdWUpIHtcbiAgICAgICAgdmFyIGggPSBiaWdJbnRlZ2VyVmFsdWUudG9TdHJpbmcoMTYpO1xuICAgICAgICBpZiAoaC5zdWJzdHIoMCwgMSkgIT0gJy0nKSB7XG4gICAgICAgICAgICBpZiAoaC5sZW5ndGggJSAyID09IDEpIHtcbiAgICAgICAgICAgICAgICBoID0gJzAnICsgaDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCEgaC5tYXRjaCgvXlswLTddLykpIHtcbiAgICAgICAgICAgICAgICAgICAgaCA9ICcwMCcgKyBoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBoUG9zID0gaC5zdWJzdHIoMSk7XG4gICAgICAgICAgICB2YXIgeG9yTGVuID0gaFBvcy5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoeG9yTGVuICUgMiA9PSAxKSB7XG4gICAgICAgICAgICAgICAgeG9yTGVuICs9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghIGgubWF0Y2goL15bMC03XS8pKSB7XG4gICAgICAgICAgICAgICAgICAgIHhvckxlbiArPSAyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBoTWFzayA9ICcnO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4b3JMZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGhNYXNrICs9ICdmJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBiaU1hc2sgPSBuZXcgQmlnSW50ZWdlcihoTWFzaywgMTYpO1xuICAgICAgICAgICAgdmFyIGJpTmVnID0gYmlNYXNrLnhvcihiaWdJbnRlZ2VyVmFsdWUpLmFkZChCaWdJbnRlZ2VyLk9ORSk7XG4gICAgICAgICAgICBoID0gYmlOZWcudG9TdHJpbmcoMTYpLnJlcGxhY2UoL14tLywgJycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogZ2V0IFBFTSBzdHJpbmcgZnJvbSBoZXhhZGVjaW1hbCBkYXRhIGFuZCBoZWFkZXIgc3RyaW5nXG4gICAgICogQG5hbWUgZ2V0UEVNU3RyaW5nRnJvbUhleFxuICAgICAqIEBtZW1iZXJPZiBLSlVSLmFzbjEuQVNOMVV0aWxcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YUhleCBoZXhhZGVjaW1hbCBzdHJpbmcgb2YgUEVNIGJvZHlcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGVtSGVhZGVyIFBFTSBoZWFkZXIgc3RyaW5nIChleC4gJ1JTQSBQUklWQVRFIEtFWScpXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBQRU0gZm9ybWF0dGVkIHN0cmluZyBvZiBpbnB1dCBkYXRhXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVGhpcyBtZXRob2QgY29udmVydHMgYSBoZXhhZGVjaW1hbCBzdHJpbmcgdG8gYSBQRU0gc3RyaW5nIHdpdGhcbiAgICAgKiBhIHNwZWNpZmllZCBoZWFkZXIuIEl0cyBsaW5lIGJyZWFrIHdpbGwgYmUgQ1JMRihcIlxcclxcblwiKS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBwZW0gID0gS0pVUi5hc24xLkFTTjFVdGlsLmdldFBFTVN0cmluZ0Zyb21IZXgoJzYxNjE2MScsICdSU0EgUFJJVkFURSBLRVknKTtcbiAgICAgKiAvLyB2YWx1ZSBvZiBwZW0gd2lsbCBiZTpcbiAgICAgKiAtLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbiAgICAgKiBZV0ZoXG4gICAgICogLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuICAgICAqL1xuICAgIHRoaXMuZ2V0UEVNU3RyaW5nRnJvbUhleCA9IGZ1bmN0aW9uKGRhdGFIZXgsIHBlbUhlYWRlcikge1xuICAgICAgICByZXR1cm4gaGV4dG9wZW0oZGF0YUhleCwgcGVtSGVhZGVyKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogZ2VuZXJhdGUgQVNOMU9iamVjdCBzcGVjaWZlZCBieSBKU09OIHBhcmFtZXRlcnNcbiAgICAgKiBAbmFtZSBuZXdPYmplY3RcbiAgICAgKiBAbWVtYmVyT2YgS0pVUi5hc24xLkFTTjFVdGlsXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtBcnJheX0gcGFyYW0gSlNPTiBwYXJhbWV0ZXIgdG8gZ2VuZXJhdGUgQVNOMU9iamVjdFxuICAgICAqIEByZXR1cm4ge0tKVVIuYXNuMS5BU04xT2JqZWN0fSBnZW5lcmF0ZWQgb2JqZWN0XG4gICAgICogQHNpbmNlIGFzbjEgMS4wLjNcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBnZW5lcmF0ZSBhbnkgQVNOMU9iamVjdCBzcGVjaWZpZWQgYnkgSlNPTiBwYXJhbVxuICAgICAqIGluY2x1ZGluZyBBU04uMSBwcmltaXRpdmUgb3Igc3RydWN0dXJlZC5cbiAgICAgKiBHZW5lcmFsbHkgJ3BhcmFtJyBjYW4gYmUgZGVzY3JpYmVkIGFzIGZvbGxvd3M6XG4gICAgICogPGJsb2NrcXVvdGU+XG4gICAgICoge1RZUEUtT0YtQVNOT0JKOiBBU04xT0JKLVBBUkFNRVRFUn1cbiAgICAgKiA8L2Jsb2NrcXVvdGU+XG4gICAgICogJ1RZUEUtT0YtQVNOMU9CSicgY2FuIGJlIG9uZSBvZiBmb2xsb3dpbmcgc3ltYm9sczpcbiAgICAgKiA8dWw+XG4gICAgICogPGxpPidib29sJyAtIERFUkJvb2xlYW48L2xpPlxuICAgICAqIDxsaT4naW50JyAtIERFUkludGVnZXI8L2xpPlxuICAgICAqIDxsaT4nYml0c3RyJyAtIERFUkJpdFN0cmluZzwvbGk+XG4gICAgICogPGxpPidvY3RzdHInIC0gREVST2N0ZXRTdHJpbmc8L2xpPlxuICAgICAqIDxsaT4nbnVsbCcgLSBERVJOdWxsPC9saT5cbiAgICAgKiA8bGk+J29pZCcgLSBERVJPYmplY3RJZGVudGlmaWVyPC9saT5cbiAgICAgKiA8bGk+J2VudW0nIC0gREVSRW51bWVyYXRlZDwvbGk+XG4gICAgICogPGxpPid1dGY4c3RyJyAtIERFUlVURjhTdHJpbmc8L2xpPlxuICAgICAqIDxsaT4nbnVtc3RyJyAtIERFUk51bWVyaWNTdHJpbmc8L2xpPlxuICAgICAqIDxsaT4ncHJuc3RyJyAtIERFUlByaW50YWJsZVN0cmluZzwvbGk+XG4gICAgICogPGxpPid0ZWxzdHInIC0gREVSVGVsZXRleFN0cmluZzwvbGk+XG4gICAgICogPGxpPidpYTVzdHInIC0gREVSSUE1U3RyaW5nPC9saT5cbiAgICAgKiA8bGk+J3V0Y3RpbWUnIC0gREVSVVRDVGltZTwvbGk+XG4gICAgICogPGxpPidnZW50aW1lJyAtIERFUkdlbmVyYWxpemVkVGltZTwvbGk+XG4gICAgICogPGxpPidzZXEnIC0gREVSU2VxdWVuY2U8L2xpPlxuICAgICAqIDxsaT4nc2V0JyAtIERFUlNldDwvbGk+XG4gICAgICogPGxpPid0YWcnIC0gREVSVGFnZ2VkT2JqZWN0PC9saT5cbiAgICAgKiA8L3VsPlxuICAgICAqIEBleGFtcGxlXG4gICAgICogbmV3T2JqZWN0KHsncHJuc3RyJzogJ2FhYSd9KTtcbiAgICAgKiBuZXdPYmplY3QoeydzZXEnOiBbeydpbnQnOiAzfSwgeydwcm5zdHInOiAnYWFhJ31dfSlcbiAgICAgKiAvLyBBU04uMSBUYWdnZWQgT2JqZWN0XG4gICAgICogbmV3T2JqZWN0KHsndGFnJzogeyd0YWcnOiAnYTEnLFxuICAgICAqICAgICAgICAgICAgICAgICAgICAnZXhwbGljaXQnOiB0cnVlLFxuICAgICAqICAgICAgICAgICAgICAgICAgICAnb2JqJzogeydzZXEnOiBbeydpbnQnOiAzfSwgeydwcm5zdHInOiAnYWFhJ31dfX19KTtcbiAgICAgKiAvLyBtb3JlIHNpbXBsZSByZXByZXNlbnRhdGlvbiBvZiBBU04uMSBUYWdnZWQgT2JqZWN0XG4gICAgICogbmV3T2JqZWN0KHsndGFnJzogWydhMScsXG4gICAgICogICAgICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICogICAgICAgICAgICAgICAgICAgIHsnc2VxJzogW1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgIHsnaW50JzogM30sXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgeydwcm5zdHInOiAnYWFhJ31dfVxuICAgICAqICAgICAgICAgICAgICAgICAgIF19KTtcbiAgICAgKi9cbiAgICB0aGlzLm5ld09iamVjdCA9IGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICAgIHZhciBfS0pVUiA9IEtKVVIsXG4gICAgICAgICAgICBfS0pVUl9hc24xID0gX0tKVVIuYXNuMSxcbiAgICAgICAgICAgIF9ERVJCb29sZWFuID0gX0tKVVJfYXNuMS5ERVJCb29sZWFuLFxuICAgICAgICAgICAgX0RFUkludGVnZXIgPSBfS0pVUl9hc24xLkRFUkludGVnZXIsXG4gICAgICAgICAgICBfREVSQml0U3RyaW5nID0gX0tKVVJfYXNuMS5ERVJCaXRTdHJpbmcsXG4gICAgICAgICAgICBfREVST2N0ZXRTdHJpbmcgPSBfS0pVUl9hc24xLkRFUk9jdGV0U3RyaW5nLFxuICAgICAgICAgICAgX0RFUk51bGwgPSBfS0pVUl9hc24xLkRFUk51bGwsXG4gICAgICAgICAgICBfREVST2JqZWN0SWRlbnRpZmllciA9IF9LSlVSX2FzbjEuREVST2JqZWN0SWRlbnRpZmllcixcbiAgICAgICAgICAgIF9ERVJFbnVtZXJhdGVkID0gX0tKVVJfYXNuMS5ERVJFbnVtZXJhdGVkLFxuICAgICAgICAgICAgX0RFUlVURjhTdHJpbmcgPSBfS0pVUl9hc24xLkRFUlVURjhTdHJpbmcsXG4gICAgICAgICAgICBfREVSTnVtZXJpY1N0cmluZyA9IF9LSlVSX2FzbjEuREVSTnVtZXJpY1N0cmluZyxcbiAgICAgICAgICAgIF9ERVJQcmludGFibGVTdHJpbmcgPSBfS0pVUl9hc24xLkRFUlByaW50YWJsZVN0cmluZyxcbiAgICAgICAgICAgIF9ERVJUZWxldGV4U3RyaW5nID0gX0tKVVJfYXNuMS5ERVJUZWxldGV4U3RyaW5nLFxuICAgICAgICAgICAgX0RFUklBNVN0cmluZyA9IF9LSlVSX2FzbjEuREVSSUE1U3RyaW5nLFxuICAgICAgICAgICAgX0RFUlVUQ1RpbWUgPSBfS0pVUl9hc24xLkRFUlVUQ1RpbWUsXG4gICAgICAgICAgICBfREVSR2VuZXJhbGl6ZWRUaW1lID0gX0tKVVJfYXNuMS5ERVJHZW5lcmFsaXplZFRpbWUsXG4gICAgICAgICAgICBfREVSU2VxdWVuY2UgPSBfS0pVUl9hc24xLkRFUlNlcXVlbmNlLFxuICAgICAgICAgICAgX0RFUlNldCA9IF9LSlVSX2FzbjEuREVSU2V0LFxuICAgICAgICAgICAgX0RFUlRhZ2dlZE9iamVjdCA9IF9LSlVSX2FzbjEuREVSVGFnZ2VkT2JqZWN0LFxuICAgICAgICAgICAgX25ld09iamVjdCA9IF9LSlVSX2FzbjEuQVNOMVV0aWwubmV3T2JqZWN0O1xuXG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMocGFyYW0pO1xuICAgICAgICBpZiAoa2V5cy5sZW5ndGggIT0gMSlcbiAgICAgICAgICAgIHRocm93IFwia2V5IG9mIHBhcmFtIHNoYWxsIGJlIG9ubHkgb25lLlwiO1xuICAgICAgICB2YXIga2V5ID0ga2V5c1swXTtcblxuICAgICAgICBpZiAoXCI6Ym9vbDppbnQ6Yml0c3RyOm9jdHN0cjpudWxsOm9pZDplbnVtOnV0ZjhzdHI6bnVtc3RyOnBybnN0cjp0ZWxzdHI6aWE1c3RyOnV0Y3RpbWU6Z2VudGltZTpzZXE6c2V0OnRhZzpcIi5pbmRleE9mKFwiOlwiICsga2V5ICsgXCI6XCIpID09IC0xKVxuICAgICAgICAgICAgdGhyb3cgXCJ1bmRlZmluZWQga2V5OiBcIiArIGtleTtcblxuICAgICAgICBpZiAoa2V5ID09IFwiYm9vbFwiKSAgICByZXR1cm4gbmV3IF9ERVJCb29sZWFuKHBhcmFtW2tleV0pO1xuICAgICAgICBpZiAoa2V5ID09IFwiaW50XCIpICAgICByZXR1cm4gbmV3IF9ERVJJbnRlZ2VyKHBhcmFtW2tleV0pO1xuICAgICAgICBpZiAoa2V5ID09IFwiYml0c3RyXCIpICByZXR1cm4gbmV3IF9ERVJCaXRTdHJpbmcocGFyYW1ba2V5XSk7XG4gICAgICAgIGlmIChrZXkgPT0gXCJvY3RzdHJcIikgIHJldHVybiBuZXcgX0RFUk9jdGV0U3RyaW5nKHBhcmFtW2tleV0pO1xuICAgICAgICBpZiAoa2V5ID09IFwibnVsbFwiKSAgICByZXR1cm4gbmV3IF9ERVJOdWxsKHBhcmFtW2tleV0pO1xuICAgICAgICBpZiAoa2V5ID09IFwib2lkXCIpICAgICByZXR1cm4gbmV3IF9ERVJPYmplY3RJZGVudGlmaWVyKHBhcmFtW2tleV0pO1xuICAgICAgICBpZiAoa2V5ID09IFwiZW51bVwiKSAgICByZXR1cm4gbmV3IF9ERVJFbnVtZXJhdGVkKHBhcmFtW2tleV0pO1xuICAgICAgICBpZiAoa2V5ID09IFwidXRmOHN0clwiKSByZXR1cm4gbmV3IF9ERVJVVEY4U3RyaW5nKHBhcmFtW2tleV0pO1xuICAgICAgICBpZiAoa2V5ID09IFwibnVtc3RyXCIpICByZXR1cm4gbmV3IF9ERVJOdW1lcmljU3RyaW5nKHBhcmFtW2tleV0pO1xuICAgICAgICBpZiAoa2V5ID09IFwicHJuc3RyXCIpICByZXR1cm4gbmV3IF9ERVJQcmludGFibGVTdHJpbmcocGFyYW1ba2V5XSk7XG4gICAgICAgIGlmIChrZXkgPT0gXCJ0ZWxzdHJcIikgIHJldHVybiBuZXcgX0RFUlRlbGV0ZXhTdHJpbmcocGFyYW1ba2V5XSk7XG4gICAgICAgIGlmIChrZXkgPT0gXCJpYTVzdHJcIikgIHJldHVybiBuZXcgX0RFUklBNVN0cmluZyhwYXJhbVtrZXldKTtcbiAgICAgICAgaWYgKGtleSA9PSBcInV0Y3RpbWVcIikgcmV0dXJuIG5ldyBfREVSVVRDVGltZShwYXJhbVtrZXldKTtcbiAgICAgICAgaWYgKGtleSA9PSBcImdlbnRpbWVcIikgcmV0dXJuIG5ldyBfREVSR2VuZXJhbGl6ZWRUaW1lKHBhcmFtW2tleV0pO1xuXG4gICAgICAgIGlmIChrZXkgPT0gXCJzZXFcIikge1xuICAgICAgICAgICAgdmFyIHBhcmFtTGlzdCA9IHBhcmFtW2tleV07XG4gICAgICAgICAgICB2YXIgYSA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJhbUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYXNuMU9iaiA9IF9uZXdPYmplY3QocGFyYW1MaXN0W2ldKTtcbiAgICAgICAgICAgICAgICBhLnB1c2goYXNuMU9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3IF9ERVJTZXF1ZW5jZSh7J2FycmF5JzogYX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGtleSA9PSBcInNldFwiKSB7XG4gICAgICAgICAgICB2YXIgcGFyYW1MaXN0ID0gcGFyYW1ba2V5XTtcbiAgICAgICAgICAgIHZhciBhID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmFtTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBhc24xT2JqID0gX25ld09iamVjdChwYXJhbUxpc3RbaV0pO1xuICAgICAgICAgICAgICAgIGEucHVzaChhc24xT2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgX0RFUlNldCh7J2FycmF5JzogYX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGtleSA9PSBcInRhZ1wiKSB7XG4gICAgICAgICAgICB2YXIgdGFnUGFyYW0gPSBwYXJhbVtrZXldO1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0YWdQYXJhbSkgPT09ICdbb2JqZWN0IEFycmF5XScgJiZcbiAgICAgICAgICAgICAgICB0YWdQYXJhbS5sZW5ndGggPT0gMykge1xuICAgICAgICAgICAgICAgIHZhciBvYmogPSBfbmV3T2JqZWN0KHRhZ1BhcmFtWzJdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IF9ERVJUYWdnZWRPYmplY3Qoe3RhZzogdGFnUGFyYW1bMF0sXG4gICAgICAgICAgICAgICAgICAgIGV4cGxpY2l0OiB0YWdQYXJhbVsxXSxcbiAgICAgICAgICAgICAgICAgICAgb2JqOiBvYmp9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1BhcmFtID0ge307XG4gICAgICAgICAgICAgICAgaWYgKHRhZ1BhcmFtLmV4cGxpY2l0ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIG5ld1BhcmFtLmV4cGxpY2l0ID0gdGFnUGFyYW0uZXhwbGljaXQ7XG4gICAgICAgICAgICAgICAgaWYgKHRhZ1BhcmFtLnRhZyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICBuZXdQYXJhbS50YWcgPSB0YWdQYXJhbS50YWc7XG4gICAgICAgICAgICAgICAgaWYgKHRhZ1BhcmFtLm9iaiA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIm9iaiBzaGFsbCBiZSBzcGVjaWZpZWQgZm9yICd0YWcnLlwiO1xuICAgICAgICAgICAgICAgIG5ld1BhcmFtLm9iaiA9IF9uZXdPYmplY3QodGFnUGFyYW0ub2JqKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IF9ERVJUYWdnZWRPYmplY3QobmV3UGFyYW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIGdldCBlbmNvZGVkIGhleGFkZWNpbWFsIHN0cmluZyBvZiBBU04xT2JqZWN0IHNwZWNpZmVkIGJ5IEpTT04gcGFyYW1ldGVyc1xuICAgICAqIEBuYW1lIGpzb25Ub0FTTjFIRVhcbiAgICAgKiBAbWVtYmVyT2YgS0pVUi5hc24xLkFTTjFVdGlsXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtBcnJheX0gcGFyYW0gSlNPTiBwYXJhbWV0ZXIgdG8gZ2VuZXJhdGUgQVNOMU9iamVjdFxuICAgICAqIEByZXR1cm4gaGV4YWRlY2ltYWwgc3RyaW5nIG9mIEFTTjFPYmplY3RcbiAgICAgKiBAc2luY2UgYXNuMSAxLjAuNFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEFzIGZvciBBU04uMSBvYmplY3QgcmVwcmVzZW50YXRpb24gb2YgSlNPTiBvYmplY3QsXG4gICAgICogcGxlYXNlIHNlZSB7QGxpbmsgbmV3T2JqZWN0fS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGpzb25Ub0FTTjFIRVgoeydwcm5zdHInOiAnYWFhJ30pO1xuICAgICAqL1xuICAgIHRoaXMuanNvblRvQVNOMUhFWCA9IGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICAgIHZhciBhc24xT2JqID0gdGhpcy5uZXdPYmplY3QocGFyYW0pO1xuICAgICAgICByZXR1cm4gYXNuMU9iai5nZXRFbmNvZGVkSGV4KCk7XG4gICAgfTtcbn07XG5cbi8qKlxuICogZ2V0IGRvdCBub3RlZCBvaWQgbnVtYmVyIHN0cmluZyBmcm9tIGhleGFkZWNpbWFsIHZhbHVlIG9mIE9JRFxuICogQG5hbWUgb2lkSGV4VG9JbnRcbiAqIEBtZW1iZXJPZiBLSlVSLmFzbjEuQVNOMVV0aWxcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGhleCBoZXhhZGVjaW1hbCB2YWx1ZSBvZiBvYmplY3QgaWRlbnRpZmllclxuICogQHJldHVybiB7U3RyaW5nfSBkb3Qgbm90ZWQgc3RyaW5nIG9mIG9iamVjdCBpZGVudGlmaWVyXG4gKiBAc2luY2UganNyc2FzaWduIDQuOC4zIGFzbjEgMS4wLjdcbiAqIEBkZXNjcmlwdGlvblxuICogVGhpcyBzdGF0aWMgbWV0aG9kIGNvbnZlcnRzIGZyb20gaGV4YWRlY2ltYWwgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mXG4gKiBBU04uMSB2YWx1ZSBvZiBvYmplY3QgaWRlbnRpZmllciB0byBvaWQgbnVtYmVyIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKiBLSlVSLmFzbjEuQVNOMVV0aWwub2lkSGV4VG9JbnQoJzU1MDQwNicpICZyYXJyOyBcIjIuNS40LjZcIlxuICovXG5LSlVSLmFzbjEuQVNOMVV0aWwub2lkSGV4VG9JbnQgPSBmdW5jdGlvbihoZXgpIHtcbiAgICB2YXIgcyA9IFwiXCI7XG4gICAgdmFyIGkwMSA9IHBhcnNlSW50KGhleC5zdWJzdHIoMCwgMiksIDE2KTtcbiAgICB2YXIgaTAgPSBNYXRoLmZsb29yKGkwMSAvIDQwKTtcbiAgICB2YXIgaTEgPSBpMDEgJSA0MDtcbiAgICB2YXIgcyA9IGkwICsgXCIuXCIgKyBpMTtcblxuICAgIHZhciBiaW5idWYgPSBcIlwiO1xuICAgIGZvciAodmFyIGkgPSAyOyBpIDwgaGV4Lmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcnNlSW50KGhleC5zdWJzdHIoaSwgMiksIDE2KTtcbiAgICAgICAgdmFyIGJpbiA9IChcIjAwMDAwMDAwXCIgKyB2YWx1ZS50b1N0cmluZygyKSkuc2xpY2UoLSA4KTtcbiAgICAgICAgYmluYnVmID0gYmluYnVmICsgYmluLnN1YnN0cigxLCA3KTtcbiAgICAgICAgaWYgKGJpbi5zdWJzdHIoMCwgMSkgPT0gXCIwXCIpIHtcbiAgICAgICAgICAgIHZhciBiaSA9IG5ldyBCaWdJbnRlZ2VyKGJpbmJ1ZiwgMik7XG4gICAgICAgICAgICBzID0gcyArIFwiLlwiICsgYmkudG9TdHJpbmcoMTApO1xuICAgICAgICAgICAgYmluYnVmID0gXCJcIjtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gcztcbn07XG5cbi8qKlxuICogZ2V0IGhleGFkZWNpbWFsIHZhbHVlIG9mIG9iamVjdCBpZGVudGlmaWVyIGZyb20gZG90IG5vdGVkIG9pZCB2YWx1ZVxuICogQG5hbWUgb2lkSW50VG9IZXhcbiAqIEBtZW1iZXJPZiBLSlVSLmFzbjEuQVNOMVV0aWxcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IG9pZFN0cmluZyBkb3Qgbm90ZWQgc3RyaW5nIG9mIG9iamVjdCBpZGVudGlmaWVyXG4gKiBAcmV0dXJuIHtTdHJpbmd9IGhleGFkZWNpbWFsIHZhbHVlIG9mIG9iamVjdCBpZGVudGlmaWVyXG4gKiBAc2luY2UganNyc2FzaWduIDQuOC4zIGFzbjEgMS4wLjdcbiAqIEBkZXNjcmlwdGlvblxuICogVGhpcyBzdGF0aWMgbWV0aG9kIGNvbnZlcnRzIGZyb20gb2JqZWN0IGlkZW50aWZpZXIgdmFsdWUgc3RyaW5nLlxuICogdG8gaGV4YWRlY2ltYWwgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGl0LlxuICogQGV4YW1wbGVcbiAqIEtKVVIuYXNuMS5BU04xVXRpbC5vaWRJbnRUb0hleChcIjIuNS40LjZcIikgJnJhcnI7IFwiNTUwNDA2XCJcbiAqL1xuS0pVUi5hc24xLkFTTjFVdGlsLm9pZEludFRvSGV4ID0gZnVuY3Rpb24ob2lkU3RyaW5nKSB7XG4gICAgdmFyIGl0b3ggPSBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciBoID0gaS50b1N0cmluZygxNik7XG4gICAgICAgIGlmIChoLmxlbmd0aCA9PSAxKSBoID0gJzAnICsgaDtcbiAgICAgICAgcmV0dXJuIGg7XG4gICAgfTtcblxuICAgIHZhciByb2lkdG94ID0gZnVuY3Rpb24ocm9pZCkge1xuICAgICAgICB2YXIgaCA9ICcnO1xuICAgICAgICB2YXIgYmkgPSBuZXcgQmlnSW50ZWdlcihyb2lkLCAxMCk7XG4gICAgICAgIHZhciBiID0gYmkudG9TdHJpbmcoMik7XG4gICAgICAgIHZhciBwYWRMZW4gPSA3IC0gYi5sZW5ndGggJSA3O1xuICAgICAgICBpZiAocGFkTGVuID09IDcpIHBhZExlbiA9IDA7XG4gICAgICAgIHZhciBiUGFkID0gJyc7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFkTGVuOyBpKyspIGJQYWQgKz0gJzAnO1xuICAgICAgICBiID0gYlBhZCArIGI7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGggLSAxOyBpICs9IDcpIHtcbiAgICAgICAgICAgIHZhciBiOCA9IGIuc3Vic3RyKGksIDcpO1xuICAgICAgICAgICAgaWYgKGkgIT0gYi5sZW5ndGggLSA3KSBiOCA9ICcxJyArIGI4O1xuICAgICAgICAgICAgaCArPSBpdG94KHBhcnNlSW50KGI4LCAyKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGg7XG4gICAgfTtcblxuICAgIGlmICghIG9pZFN0cmluZy5tYXRjaCgvXlswLTkuXSskLykpIHtcbiAgICAgICAgdGhyb3cgXCJtYWxmb3JtZWQgb2lkIHN0cmluZzogXCIgKyBvaWRTdHJpbmc7XG4gICAgfVxuICAgIHZhciBoID0gJyc7XG4gICAgdmFyIGEgPSBvaWRTdHJpbmcuc3BsaXQoJy4nKTtcbiAgICB2YXIgaTAgPSBwYXJzZUludChhWzBdKSAqIDQwICsgcGFyc2VJbnQoYVsxXSk7XG4gICAgaCArPSBpdG94KGkwKTtcbiAgICBhLnNwbGljZSgwLCAyKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaCArPSByb2lkdG94KGFbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gaDtcbn07XG5cblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICBBYnN0cmFjdCBBU04uMSBDbGFzc2VzXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4vKipcbiAqIGJhc2UgY2xhc3MgZm9yIEFTTi4xIERFUiBlbmNvZGVyIG9iamVjdFxuICogQG5hbWUgS0pVUi5hc24xLkFTTjFPYmplY3RcbiAqIEBjbGFzcyBiYXNlIGNsYXNzIGZvciBBU04uMSBERVIgZW5jb2RlciBvYmplY3RcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaXNNb2RpZmllZCBmbGFnIHdoZXRoZXIgaW50ZXJuYWwgZGF0YSB3YXMgY2hhbmdlZFxuICogQHByb3BlcnR5IHtTdHJpbmd9IGhUTFYgaGV4YWRlY2ltYWwgc3RyaW5nIG9mIEFTTi4xIFRMVlxuICogQHByb3BlcnR5IHtTdHJpbmd9IGhUIGhleGFkZWNpbWFsIHN0cmluZyBvZiBBU04uMSBUTFYgdGFnKFQpXG4gKiBAcHJvcGVydHkge1N0cmluZ30gaEwgaGV4YWRlY2ltYWwgc3RyaW5nIG9mIEFTTi4xIFRMViBsZW5ndGgoTClcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBoViBoZXhhZGVjaW1hbCBzdHJpbmcgb2YgQVNOLjEgVExWIHZhbHVlKFYpXG4gKiBAZGVzY3JpcHRpb25cbiAqL1xuS0pVUi5hc24xLkFTTjFPYmplY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXNNb2RpZmllZCA9IHRydWU7XG4gICAgdmFyIGhUTFYgPSBudWxsO1xuICAgIHZhciBoVCA9ICcwMCc7XG4gICAgdmFyIGhMID0gJzAwJztcbiAgICB2YXIgaFYgPSAnJztcblxuICAgIC8qKlxuICAgICAqIGdldCBoZXhhZGVjaW1hbCBBU04uMSBUTFYgbGVuZ3RoKEwpIGJ5dGVzIGZyb20gVExWIHZhbHVlKFYpXG4gICAgICogQG5hbWUgZ2V0TGVuZ3RoSGV4RnJvbVZhbHVlXG4gICAgICogQG1lbWJlck9mIEtKVVIuYXNuMS5BU04xT2JqZWN0I1xuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gaGV4YWRlY2ltYWwgc3RyaW5nIG9mIEFTTi4xIFRMViBsZW5ndGgoTClcbiAgICAgKi9cbiAgICB0aGlzLmdldExlbmd0aEhleEZyb21WYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaFYgPT0gXCJ1bmRlZmluZWRcIiB8fCB0aGlzLmhWID09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IFwidGhpcy5oViBpcyBudWxsIG9yIHVuZGVmaW5lZC5cIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5oVi5sZW5ndGggJSAyID09IDEpIHtcbiAgICAgICAgICAgIHRocm93IFwidmFsdWUgaGV4IG11c3QgYmUgZXZlbiBsZW5ndGg6IG49XCIgKyBoVi5sZW5ndGggKyBcIix2PVwiICsgdGhpcy5oVjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbiA9IHRoaXMuaFYubGVuZ3RoIC8gMjtcbiAgICAgICAgdmFyIGhOID0gbi50b1N0cmluZygxNik7XG4gICAgICAgIGlmIChoTi5sZW5ndGggJSAyID09IDEpIHtcbiAgICAgICAgICAgIGhOID0gXCIwXCIgKyBoTjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobiA8IDEyOCkge1xuICAgICAgICAgICAgcmV0dXJuIGhOO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGhObGVuID0gaE4ubGVuZ3RoIC8gMjtcbiAgICAgICAgICAgIGlmIChoTmxlbiA+IDE1KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJBU04uMSBsZW5ndGggdG9vIGxvbmcgdG8gcmVwcmVzZW50IGJ5IDh4OiBuID0gXCIgKyBuLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBoZWFkID0gMTI4ICsgaE5sZW47XG4gICAgICAgICAgICByZXR1cm4gaGVhZC50b1N0cmluZygxNikgKyBoTjtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBnZXQgaGV4YWRlY2ltYWwgc3RyaW5nIG9mIEFTTi4xIFRMViBieXRlc1xuICAgICAqIEBuYW1lIGdldEVuY29kZWRIZXhcbiAgICAgKiBAbWVtYmVyT2YgS0pVUi5hc24xLkFTTjFPYmplY3QjXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBoZXhhZGVjaW1hbCBzdHJpbmcgb2YgQVNOLjEgVExWXG4gICAgICovXG4gICAgdGhpcy5nZXRFbmNvZGVkSGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmhUTFYgPT0gbnVsbCB8fCB0aGlzLmlzTW9kaWZpZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaFYgPSB0aGlzLmdldEZyZXNoVmFsdWVIZXgoKTtcbiAgICAgICAgICAgIHRoaXMuaEwgPSB0aGlzLmdldExlbmd0aEhleEZyb21WYWx1ZSgpO1xuICAgICAgICAgICAgdGhpcy5oVExWID0gdGhpcy5oVCArIHRoaXMuaEwgKyB0aGlzLmhWO1xuICAgICAgICAgICAgdGhpcy5pc01vZGlmaWVkID0gZmFsc2U7XG4gICAgICAgICAgICAvL2FsZXJ0KFwiZmlyc3QgdGltZTogXCIgKyB0aGlzLmhUTFYpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmhUTFY7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIGdldCBoZXhhZGVjaW1hbCBzdHJpbmcgb2YgQVNOLjEgVExWIHZhbHVlKFYpIGJ5dGVzXG4gICAgICogQG5hbWUgZ2V0VmFsdWVIZXhcbiAgICAgKiBAbWVtYmVyT2YgS0pVUi5hc24xLkFTTjFPYmplY3QjXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBoZXhhZGVjaW1hbCBzdHJpbmcgb2YgQVNOLjEgVExWIHZhbHVlKFYpIGJ5dGVzXG4gICAgICovXG4gICAgdGhpcy5nZXRWYWx1ZUhleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmdldEVuY29kZWRIZXgoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaFY7XG4gICAgfVxuXG4gICAgdGhpcy5nZXRGcmVzaFZhbHVlSGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9O1xufTtcblxuLy8gPT0gQkVHSU4gREVSQWJzdHJhY3RTdHJpbmcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vKipcbiAqIGJhc2UgY2xhc3MgZm9yIEFTTi4xIERFUiBzdHJpbmcgY2xhc3Nlc1xuICogQG5hbWUgS0pVUi5hc24xLkRFUkFic3RyYWN0U3RyaW5nXG4gKiBAY2xhc3MgYmFzZSBjbGFzcyBmb3IgQVNOLjEgREVSIHN0cmluZyBjbGFzc2VzXG4gKiBAcGFyYW0ge0FycmF5fSBwYXJhbXMgYXNzb2NpYXRpdmUgYXJyYXkgb2YgcGFyYW1ldGVycyAoZXguIHsnc3RyJzogJ2FhYSd9KVxuICogQHByb3BlcnR5IHtTdHJpbmd9IHMgaW50ZXJuYWwgc3RyaW5nIG9mIHZhbHVlXG4gKiBAZXh0ZW5kcyBLSlVSLmFzbjEuQVNOMU9iamVjdFxuICogQGRlc2NyaXB0aW9uXG4gKiA8YnIvPlxuICogQXMgZm9yIGFyZ3VtZW50ICdwYXJhbXMnIGZvciBjb25zdHJ1Y3RvciwgeW91IGNhbiBzcGVjaWZ5IG9uZSBvZlxuICogZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKiA8dWw+XG4gKiA8bGk+c3RyIC0gc3BlY2lmeSBpbml0aWFsIEFTTi4xIHZhbHVlKFYpIGJ5IGEgc3RyaW5nPC9saT5cbiAqIDxsaT5oZXggLSBzcGVjaWZ5IGluaXRpYWwgQVNOLjEgdmFsdWUoVikgYnkgYSBoZXhhZGVjaW1hbCBzdHJpbmc8L2xpPlxuICogPC91bD5cbiAqIE5PVEU6ICdwYXJhbXMnIGNhbiBiZSBvbWl0dGVkLlxuICovXG5LSlVSLmFzbjEuREVSQWJzdHJhY3RTdHJpbmcgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBLSlVSLmFzbjEuREVSQWJzdHJhY3RTdHJpbmcuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuICAgIHZhciBzID0gbnVsbDtcbiAgICB2YXIgaFYgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogZ2V0IHN0cmluZyB2YWx1ZSBvZiB0aGlzIHN0cmluZyBvYmplY3RcbiAgICAgKiBAbmFtZSBnZXRTdHJpbmdcbiAgICAgKiBAbWVtYmVyT2YgS0pVUi5hc24xLkRFUkFic3RyYWN0U3RyaW5nI1xuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gc3RyaW5nIHZhbHVlIG9mIHRoaXMgc3RyaW5nIG9iamVjdFxuICAgICAqL1xuICAgIHRoaXMuZ2V0U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIHNldCB2YWx1ZSBieSBhIHN0cmluZ1xuICAgICAqIEBuYW1lIHNldFN0cmluZ1xuICAgICAqIEBtZW1iZXJPZiBLSlVSLmFzbjEuREVSQWJzdHJhY3RTdHJpbmcjXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5ld1MgdmFsdWUgYnkgYSBzdHJpbmcgdG8gc2V0XG4gICAgICovXG4gICAgdGhpcy5zZXRTdHJpbmcgPSBmdW5jdGlvbihuZXdTKSB7XG4gICAgICAgIHRoaXMuaFRMViA9IG51bGw7XG4gICAgICAgIHRoaXMuaXNNb2RpZmllZCA9IHRydWU7XG4gICAgICAgIHRoaXMucyA9IG5ld1M7XG4gICAgICAgIHRoaXMuaFYgPSBzdG9oZXgodGhpcy5zKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogc2V0IHZhbHVlIGJ5IGEgaGV4YWRlY2ltYWwgc3RyaW5nXG4gICAgICogQG5hbWUgc2V0U3RyaW5nSGV4XG4gICAgICogQG1lbWJlck9mIEtKVVIuYXNuMS5ERVJBYnN0cmFjdFN0cmluZyNcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmV3SGV4U3RyaW5nIHZhbHVlIGJ5IGEgaGV4YWRlY2ltYWwgc3RyaW5nIHRvIHNldFxuICAgICAqL1xuICAgIHRoaXMuc2V0U3RyaW5nSGV4ID0gZnVuY3Rpb24obmV3SGV4U3RyaW5nKSB7XG4gICAgICAgIHRoaXMuaFRMViA9IG51bGw7XG4gICAgICAgIHRoaXMuaXNNb2RpZmllZCA9IHRydWU7XG4gICAgICAgIHRoaXMucyA9IG51bGw7XG4gICAgICAgIHRoaXMuaFYgPSBuZXdIZXhTdHJpbmc7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0RnJlc2hWYWx1ZUhleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oVjtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIHBhcmFtcyA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0cmluZyhwYXJhbXMpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXJhbXNbJ3N0ciddICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RyaW5nKHBhcmFtc1snc3RyJ10pO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXJhbXNbJ2hleCddICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RyaW5nSGV4KHBhcmFtc1snaGV4J10pO1xuICAgICAgICB9XG4gICAgfVxufTtcbllBSE9PLmxhbmcuZXh0ZW5kKEtKVVIuYXNuMS5ERVJBYnN0cmFjdFN0cmluZywgS0pVUi5hc24xLkFTTjFPYmplY3QpO1xuLy8gPT0gRU5EICAgREVSQWJzdHJhY3RTdHJpbmcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vID09IEJFR0lOIERFUkFic3RyYWN0VGltZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLyoqXG4gKiBiYXNlIGNsYXNzIGZvciBBU04uMSBERVIgR2VuZXJhbGl6ZWQvVVRDVGltZSBjbGFzc1xuICogQG5hbWUgS0pVUi5hc24xLkRFUkFic3RyYWN0VGltZVxuICogQGNsYXNzIGJhc2UgY2xhc3MgZm9yIEFTTi4xIERFUiBHZW5lcmFsaXplZC9VVENUaW1lIGNsYXNzXG4gKiBAcGFyYW0ge0FycmF5fSBwYXJhbXMgYXNzb2NpYXRpdmUgYXJyYXkgb2YgcGFyYW1ldGVycyAoZXguIHsnc3RyJzogJzEzMDQzMDIzNTk1OVonfSlcbiAqIEBleHRlbmRzIEtKVVIuYXNuMS5BU04xT2JqZWN0XG4gKiBAZGVzY3JpcHRpb25cbiAqIEBzZWUgS0pVUi5hc24xLkFTTjFPYmplY3QgLSBzdXBlcmNsYXNzXG4gKi9cbktKVVIuYXNuMS5ERVJBYnN0cmFjdFRpbWUgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBLSlVSLmFzbjEuREVSQWJzdHJhY3RUaW1lLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuY2FsbCh0aGlzKTtcbiAgICB2YXIgcyA9IG51bGw7XG4gICAgdmFyIGRhdGUgPSBudWxsO1xuXG4gICAgLy8gLS0tIFBSSVZBVEUgTUVUSE9EUyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHRoaXMubG9jYWxEYXRlVG9VVEMgPSBmdW5jdGlvbihkKSB7XG4gICAgICAgIHV0YyA9IGQuZ2V0VGltZSgpICsgKGQuZ2V0VGltZXpvbmVPZmZzZXQoKSAqIDYwMDAwKTtcbiAgICAgICAgdmFyIHV0Y0RhdGUgPSBuZXcgRGF0ZSh1dGMpO1xuICAgICAgICByZXR1cm4gdXRjRGF0ZTtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBmb3JtYXQgZGF0ZSBzdHJpbmcgYnkgRGF0YSBvYmplY3RcbiAgICAgKiBAbmFtZSBmb3JtYXREYXRlXG4gICAgICogQG1lbWJlck9mIEtKVVIuYXNuMS5BYnN0cmFjdFRpbWU7XG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlT2JqZWN0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgJ3V0Yycgb3IgJ2dlbidcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHdpdGhNaWxsaXMgZmxhZyBmb3Igd2l0aCBtaWxsaXNlY3Rpb25zIG9yIG5vdFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqICd3aXRoTWlsbGlzJyBmbGFnIGlzIHN1cHBvcnRlZCBmcm9tIGFzbjEgMS4wLjYuXG4gICAgICovXG4gICAgdGhpcy5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZU9iamVjdCwgdHlwZSwgd2l0aE1pbGxpcykge1xuICAgICAgICB2YXIgcGFkID0gdGhpcy56ZXJvUGFkZGluZztcbiAgICAgICAgdmFyIGQgPSB0aGlzLmxvY2FsRGF0ZVRvVVRDKGRhdGVPYmplY3QpO1xuICAgICAgICB2YXIgeWVhciA9IFN0cmluZyhkLmdldEZ1bGxZZWFyKCkpO1xuICAgICAgICBpZiAodHlwZSA9PSAndXRjJykgeWVhciA9IHllYXIuc3Vic3RyKDIsIDIpO1xuICAgICAgICB2YXIgbW9udGggPSBwYWQoU3RyaW5nKGQuZ2V0TW9udGgoKSArIDEpLCAyKTtcbiAgICAgICAgdmFyIGRheSA9IHBhZChTdHJpbmcoZC5nZXREYXRlKCkpLCAyKTtcbiAgICAgICAgdmFyIGhvdXIgPSBwYWQoU3RyaW5nKGQuZ2V0SG91cnMoKSksIDIpO1xuICAgICAgICB2YXIgbWluID0gcGFkKFN0cmluZyhkLmdldE1pbnV0ZXMoKSksIDIpO1xuICAgICAgICB2YXIgc2VjID0gcGFkKFN0cmluZyhkLmdldFNlY29uZHMoKSksIDIpO1xuICAgICAgICB2YXIgcyA9IHllYXIgKyBtb250aCArIGRheSArIGhvdXIgKyBtaW4gKyBzZWM7XG4gICAgICAgIGlmICh3aXRoTWlsbGlzID09PSB0cnVlKSB7XG4gICAgICAgICAgICB2YXIgbWlsbGlzID0gZC5nZXRNaWxsaXNlY29uZHMoKTtcbiAgICAgICAgICAgIGlmIChtaWxsaXMgIT0gMCkge1xuICAgICAgICAgICAgICAgIHZhciBzTWlsbGlzID0gcGFkKFN0cmluZyhtaWxsaXMpLCAzKTtcbiAgICAgICAgICAgICAgICBzTWlsbGlzID0gc01pbGxpcy5yZXBsYWNlKC9bMF0rJC8sIFwiXCIpO1xuICAgICAgICAgICAgICAgIHMgPSBzICsgXCIuXCIgKyBzTWlsbGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzICsgXCJaXCI7XG4gICAgfTtcblxuICAgIHRoaXMuemVyb1BhZGRpbmcgPSBmdW5jdGlvbihzLCBsZW4pIHtcbiAgICAgICAgaWYgKHMubGVuZ3RoID49IGxlbikgcmV0dXJuIHM7XG4gICAgICAgIHJldHVybiBuZXcgQXJyYXkobGVuIC0gcy5sZW5ndGggKyAxKS5qb2luKCcwJykgKyBzO1xuICAgIH07XG5cbiAgICAvLyAtLS0gUFVCTElDIE1FVEhPRFMgLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvKipcbiAgICAgKiBnZXQgc3RyaW5nIHZhbHVlIG9mIHRoaXMgc3RyaW5nIG9iamVjdFxuICAgICAqIEBuYW1lIGdldFN0cmluZ1xuICAgICAqIEBtZW1iZXJPZiBLSlVSLmFzbjEuREVSQWJzdHJhY3RUaW1lI1xuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gc3RyaW5nIHZhbHVlIG9mIHRoaXMgdGltZSBvYmplY3RcbiAgICAgKi9cbiAgICB0aGlzLmdldFN0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBzZXQgdmFsdWUgYnkgYSBzdHJpbmdcbiAgICAgKiBAbmFtZSBzZXRTdHJpbmdcbiAgICAgKiBAbWVtYmVyT2YgS0pVUi5hc24xLkRFUkFic3RyYWN0VGltZSNcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmV3UyB2YWx1ZSBieSBhIHN0cmluZyB0byBzZXQgc3VjaCBsaWtlIFwiMTMwNDMwMjM1OTU5WlwiXG4gICAgICovXG4gICAgdGhpcy5zZXRTdHJpbmcgPSBmdW5jdGlvbihuZXdTKSB7XG4gICAgICAgIHRoaXMuaFRMViA9IG51bGw7XG4gICAgICAgIHRoaXMuaXNNb2RpZmllZCA9IHRydWU7XG4gICAgICAgIHRoaXMucyA9IG5ld1M7XG4gICAgICAgIHRoaXMuaFYgPSBzdG9oZXgobmV3Uyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIHNldCB2YWx1ZSBieSBhIERhdGUgb2JqZWN0XG4gICAgICogQG5hbWUgc2V0QnlEYXRlVmFsdWVcbiAgICAgKiBAbWVtYmVyT2YgS0pVUi5hc24xLkRFUkFic3RyYWN0VGltZSNcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IHllYXIgeWVhciBvZiBkYXRlIChleC4gMjAxMylcbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IG1vbnRoIG1vbnRoIG9mIGRhdGUgYmV0d2VlbiAxIGFuZCAxMiAoZXguIDEyKVxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gZGF5IGRheSBvZiBtb250aFxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gaG91ciBob3VycyBvZiBkYXRlXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSBtaW4gbWludXRlcyBvZiBkYXRlXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSBzZWMgc2Vjb25kcyBvZiBkYXRlXG4gICAgICovXG4gICAgdGhpcy5zZXRCeURhdGVWYWx1ZSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoLCBkYXksIGhvdXIsIG1pbiwgc2VjKSB7XG4gICAgICAgIHZhciBkYXRlT2JqZWN0ID0gbmV3IERhdGUoRGF0ZS5VVEMoeWVhciwgbW9udGggLSAxLCBkYXksIGhvdXIsIG1pbiwgc2VjLCAwKSk7XG4gICAgICAgIHRoaXMuc2V0QnlEYXRlKGRhdGVPYmplY3QpO1xuICAgIH07XG5cbiAgICB0aGlzLmdldEZyZXNoVmFsdWVIZXggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaFY7XG4gICAgfTtcbn07XG5ZQUhPTy5sYW5nLmV4dGVuZChLSlVSLmFzbjEuREVSQWJzdHJhY3RUaW1lLCBLSlVSLmFzbjEuQVNOMU9iamVjdCk7XG4vLyA9PSBFTkQgICBERVJBYnN0cmFjdFRpbWUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gPT0gQkVHSU4gREVSQWJzdHJhY3RTdHJ1Y3R1cmVkID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vKipcbiAqIGJhc2UgY2xhc3MgZm9yIEFTTi4xIERFUiBzdHJ1Y3R1cmVkIGNsYXNzXG4gKiBAbmFtZSBLSlVSLmFzbjEuREVSQWJzdHJhY3RTdHJ1Y3R1cmVkXG4gKiBAY2xhc3MgYmFzZSBjbGFzcyBmb3IgQVNOLjEgREVSIHN0cnVjdHVyZWQgY2xhc3NcbiAqIEBwcm9wZXJ0eSB7QXJyYXl9IGFzbjFBcnJheSBpbnRlcm5hbCBhcnJheSBvZiBBU04xT2JqZWN0XG4gKiBAZXh0ZW5kcyBLSlVSLmFzbjEuQVNOMU9iamVjdFxuICogQGRlc2NyaXB0aW9uXG4gKiBAc2VlIEtKVVIuYXNuMS5BU04xT2JqZWN0IC0gc3VwZXJjbGFzc1xuICovXG5LSlVSLmFzbjEuREVSQWJzdHJhY3RTdHJ1Y3R1cmVkID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgS0pVUi5hc24xLkRFUkFic3RyYWN0U3RyaW5nLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuY2FsbCh0aGlzKTtcbiAgICB2YXIgYXNuMUFycmF5ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIHNldCB2YWx1ZSBieSBhcnJheSBvZiBBU04xT2JqZWN0XG4gICAgICogQG5hbWUgc2V0QnlBU04xT2JqZWN0QXJyYXlcbiAgICAgKiBAbWVtYmVyT2YgS0pVUi5hc24xLkRFUkFic3RyYWN0U3RydWN0dXJlZCNcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge2FycmF5fSBhc24xT2JqZWN0QXJyYXkgYXJyYXkgb2YgQVNOMU9iamVjdCB0byBzZXRcbiAgICAgKi9cbiAgICB0aGlzLnNldEJ5QVNOMU9iamVjdEFycmF5ID0gZnVuY3Rpb24oYXNuMU9iamVjdEFycmF5KSB7XG4gICAgICAgIHRoaXMuaFRMViA9IG51bGw7XG4gICAgICAgIHRoaXMuaXNNb2RpZmllZCA9IHRydWU7XG4gICAgICAgIHRoaXMuYXNuMUFycmF5ID0gYXNuMU9iamVjdEFycmF5O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBhcHBlbmQgYW4gQVNOMU9iamVjdCB0byBpbnRlcm5hbCBhcnJheVxuICAgICAqIEBuYW1lIGFwcGVuZEFTTjFPYmplY3RcbiAgICAgKiBAbWVtYmVyT2YgS0pVUi5hc24xLkRFUkFic3RyYWN0U3RydWN0dXJlZCNcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge0FTTjFPYmplY3R9IGFzbjFPYmplY3QgdG8gYWRkXG4gICAgICovXG4gICAgdGhpcy5hcHBlbmRBU04xT2JqZWN0ID0gZnVuY3Rpb24oYXNuMU9iamVjdCkge1xuICAgICAgICB0aGlzLmhUTFYgPSBudWxsO1xuICAgICAgICB0aGlzLmlzTW9kaWZpZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmFzbjFBcnJheS5wdXNoKGFzbjFPYmplY3QpO1xuICAgIH07XG5cbiAgICB0aGlzLmFzbjFBcnJheSA9IG5ldyBBcnJheSgpO1xuICAgIGlmICh0eXBlb2YgcGFyYW1zICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwYXJhbXNbJ2FycmF5J10gIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5hc24xQXJyYXkgPSBwYXJhbXNbJ2FycmF5J107XG4gICAgICAgIH1cbiAgICB9XG59O1xuWUFIT08ubGFuZy5leHRlbmQoS0pVUi5hc24xLkRFUkFic3RyYWN0U3RydWN0dXJlZCwgS0pVUi5hc24xLkFTTjFPYmplY3QpO1xuXG5cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAgQVNOLjEgT2JqZWN0IENsYXNzZXNcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vKipcbiAqIGNsYXNzIGZvciBBU04uMSBERVIgQm9vbGVhblxuICogQG5hbWUgS0pVUi5hc24xLkRFUkJvb2xlYW5cbiAqIEBjbGFzcyBjbGFzcyBmb3IgQVNOLjEgREVSIEJvb2xlYW5cbiAqIEBleHRlbmRzIEtKVVIuYXNuMS5BU04xT2JqZWN0XG4gKiBAZGVzY3JpcHRpb25cbiAqIEBzZWUgS0pVUi5hc24xLkFTTjFPYmplY3QgLSBzdXBlcmNsYXNzXG4gKi9cbktKVVIuYXNuMS5ERVJCb29sZWFuID0gZnVuY3Rpb24oKSB7XG4gICAgS0pVUi5hc24xLkRFUkJvb2xlYW4uc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuICAgIHRoaXMuaFQgPSBcIjAxXCI7XG4gICAgdGhpcy5oVExWID0gXCIwMTAxZmZcIjtcbn07XG5ZQUhPTy5sYW5nLmV4dGVuZChLSlVSLmFzbjEuREVSQm9vbGVhbiwgS0pVUi5hc24xLkFTTjFPYmplY3QpO1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLyoqXG4gKiBjbGFzcyBmb3IgQVNOLjEgREVSIEludGVnZXJcbiAqIEBuYW1lIEtKVVIuYXNuMS5ERVJJbnRlZ2VyXG4gKiBAY2xhc3MgY2xhc3MgZm9yIEFTTi4xIERFUiBJbnRlZ2VyXG4gKiBAZXh0ZW5kcyBLSlVSLmFzbjEuQVNOMU9iamVjdFxuICogQGRlc2NyaXB0aW9uXG4gKiA8YnIvPlxuICogQXMgZm9yIGFyZ3VtZW50ICdwYXJhbXMnIGZvciBjb25zdHJ1Y3RvciwgeW91IGNhbiBzcGVjaWZ5IG9uZSBvZlxuICogZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKiA8dWw+XG4gKiA8bGk+aW50IC0gc3BlY2lmeSBpbml0aWFsIEFTTi4xIHZhbHVlKFYpIGJ5IGludGVnZXIgdmFsdWU8L2xpPlxuICogPGxpPmJpZ2ludCAtIHNwZWNpZnkgaW5pdGlhbCBBU04uMSB2YWx1ZShWKSBieSBCaWdJbnRlZ2VyIG9iamVjdDwvbGk+XG4gKiA8bGk+aGV4IC0gc3BlY2lmeSBpbml0aWFsIEFTTi4xIHZhbHVlKFYpIGJ5IGEgaGV4YWRlY2ltYWwgc3RyaW5nPC9saT5cbiAqIDwvdWw+XG4gKiBOT1RFOiAncGFyYW1zJyBjYW4gYmUgb21pdHRlZC5cbiAqL1xuS0pVUi5hc24xLkRFUkludGVnZXIgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBLSlVSLmFzbjEuREVSSW50ZWdlci5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XG4gICAgdGhpcy5oVCA9IFwiMDJcIjtcblxuICAgIC8qKlxuICAgICAqIHNldCB2YWx1ZSBieSBUb20gV3UncyBCaWdJbnRlZ2VyIG9iamVjdFxuICAgICAqIEBuYW1lIHNldEJ5QmlnSW50ZWdlclxuICAgICAqIEBtZW1iZXJPZiBLSlVSLmFzbjEuREVSSW50ZWdlciNcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge0JpZ0ludGVnZXJ9IGJpZ0ludGVnZXJWYWx1ZSB0byBzZXRcbiAgICAgKi9cbiAgICB0aGlzLnNldEJ5QmlnSW50ZWdlciA9IGZ1bmN0aW9uKGJpZ0ludGVnZXJWYWx1ZSkge1xuICAgICAgICB0aGlzLmhUTFYgPSBudWxsO1xuICAgICAgICB0aGlzLmlzTW9kaWZpZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmhWID0gS0pVUi5hc24xLkFTTjFVdGlsLmJpZ0ludFRvTWluVHdvc0NvbXBsZW1lbnRzSGV4KGJpZ0ludGVnZXJWYWx1ZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIHNldCB2YWx1ZSBieSBpbnRlZ2VyIHZhbHVlXG4gICAgICogQG5hbWUgc2V0QnlJbnRlZ2VyXG4gICAgICogQG1lbWJlck9mIEtKVVIuYXNuMS5ERVJJbnRlZ2VyXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSBpbnRlZ2VyIHZhbHVlIHRvIHNldFxuICAgICAqL1xuICAgIHRoaXMuc2V0QnlJbnRlZ2VyID0gZnVuY3Rpb24oaW50VmFsdWUpIHtcbiAgICAgICAgdmFyIGJpID0gbmV3IEJpZ0ludGVnZXIoU3RyaW5nKGludFZhbHVlKSwgMTApO1xuICAgICAgICB0aGlzLnNldEJ5QmlnSW50ZWdlcihiaSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIHNldCB2YWx1ZSBieSBpbnRlZ2VyIHZhbHVlXG4gICAgICogQG5hbWUgc2V0VmFsdWVIZXhcbiAgICAgKiBAbWVtYmVyT2YgS0pVUi5hc24xLkRFUkludGVnZXIjXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGhleGFkZWNpbWFsIHN0cmluZyBvZiBpbnRlZ2VyIHZhbHVlXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogPGJyLz5cbiAgICAgKiBOT1RFOiBWYWx1ZSBzaGFsbCBiZSByZXByZXNlbnRlZCBieSBtaW5pbXVtIG9jdGV0IGxlbmd0aCBvZlxuICAgICAqIHR3bydzIGNvbXBsZW1lbnQgcmVwcmVzZW50YXRpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBuZXcgS0pVUi5hc24xLkRFUkludGVnZXIoMTIzKTtcbiAgICAgKiBuZXcgS0pVUi5hc24xLkRFUkludGVnZXIoeydpbnQnOiAxMjN9KTtcbiAgICAgKiBuZXcgS0pVUi5hc24xLkRFUkludGVnZXIoeydoZXgnOiAnMWZhZCd9KTtcbiAgICAgKi9cbiAgICB0aGlzLnNldFZhbHVlSGV4ID0gZnVuY3Rpb24obmV3SGV4U3RyaW5nKSB7XG4gICAgICAgIHRoaXMuaFYgPSBuZXdIZXhTdHJpbmc7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0RnJlc2hWYWx1ZUhleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oVjtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIHBhcmFtc1snYmlnaW50J10gIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5zZXRCeUJpZ0ludGVnZXIocGFyYW1zWydiaWdpbnQnXSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhcmFtc1snaW50J10gIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5zZXRCeUludGVnZXIocGFyYW1zWydpbnQnXSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhcmFtcyA9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICB0aGlzLnNldEJ5SW50ZWdlcihwYXJhbXMpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXJhbXNbJ2hleCddICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWVIZXgocGFyYW1zWydoZXgnXSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuWUFIT08ubGFuZy5leHRlbmQoS0pVUi5hc24xLkRFUkludGVnZXIsIEtKVVIuYXNuMS5BU04xT2JqZWN0KTtcblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8qKlxuICogY2xhc3MgZm9yIEFTTi4xIERFUiBlbmNvZGVkIEJpdFN0cmluZyBwcmltaXRpdmVcbiAqIEBuYW1lIEtKVVIuYXNuMS5ERVJCaXRTdHJpbmdcbiAqIEBjbGFzcyBjbGFzcyBmb3IgQVNOLjEgREVSIGVuY29kZWQgQml0U3RyaW5nIHByaW1pdGl2ZVxuICogQGV4dGVuZHMgS0pVUi5hc24xLkFTTjFPYmplY3RcbiAqIEBkZXNjcmlwdGlvblxuICogPGJyLz5cbiAqIEFzIGZvciBhcmd1bWVudCAncGFyYW1zJyBmb3IgY29uc3RydWN0b3IsIHlvdSBjYW4gc3BlY2lmeSBvbmUgb2ZcbiAqIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICogPHVsPlxuICogPGxpPmJpbiAtIHNwZWNpZnkgYmluYXJ5IHN0cmluZyAoZXguICcxMDExMScpPC9saT5cbiAqIDxsaT5hcnJheSAtIHNwZWNpZnkgYXJyYXkgb2YgYm9vbGVhbiAoZXguIFt0cnVlLGZhbHNlLHRydWUsdHJ1ZV0pPC9saT5cbiAqIDxsaT5oZXggLSBzcGVjaWZ5IGhleGFkZWNpbWFsIHN0cmluZyBvZiBBU04uMSB2YWx1ZShWKSBpbmNsdWRpbmcgdW51c2VkIGJpdHM8L2xpPlxuICogPGxpPm9iaiAtIHNwZWNpZnkge0BsaW5rIEtKVVIuYXNuMS5BU04xVXRpbC5uZXdPYmplY3R9XG4gKiBhcmd1bWVudCBmb3IgXCJCaXRTdHJpbmcgZW5jYXBzdWxhdGVzXCIgc3RydWN0dXJlLjwvbGk+XG4gKiA8L3VsPlxuICogTk9URTE6ICdwYXJhbXMnIGNhbiBiZSBvbWl0dGVkLjxici8+XG4gKiBOT1RFMjogJ29iaicgcGFyYW1ldGVyIGhhdmUgYmVlbiBzdXBwb3J0ZWQgc2luY2VcbiAqIGFzbjEgMS4wLjExLCBqc3JzYXNpZ24gNi4xLjEgKDIwMTYtU2VwLTI1KS48YnIvPlxuICogQGV4YW1wbGVcbiAqIC8vIGRlZmF1bHQgY29uc3RydWN0b3JcbiAqIG8gPSBuZXcgS0pVUi5hc24xLkRFUkJpdFN0cmluZygpO1xuICogLy8gaW5pdGlhbGl6ZSB3aXRoIGJpbmFyeSBzdHJpbmdcbiAqIG8gPSBuZXcgS0pVUi5hc24xLkRFUkJpdFN0cmluZyh7YmluOiBcIjEwMTFcIn0pO1xuICogLy8gaW5pdGlhbGl6ZSB3aXRoIGJvb2xlYW4gYXJyYXlcbiAqIG8gPSBuZXcgS0pVUi5hc24xLkRFUkJpdFN0cmluZyh7YXJyYXk6IFt0cnVlLGZhbHNlLHRydWUsdHJ1ZV19KTtcbiAqIC8vIGluaXRpYWxpemUgd2l0aCBoZXhhZGVjaW1hbCBzdHJpbmcgKDA0IGlzIHVudXNlZCBiaXRzKVxuICogbyA9IG5ldyBLSlVSLmFzbjEuREVST2N0ZXRTdHJpbmcoe2hleDogXCIwNGJhYzBcIn0pO1xuICogLy8gaW5pdGlhbGl6ZSB3aXRoIEFTTjFVdGlsLm5ld09iamVjdCBhcmd1bWVudCBmb3IgZW5jYXBzdWxhdGVkXG4gKiBvID0gbmV3IEtKVVIuYXNuMS5ERVJCaXRTdHJpbmcoe29iajoge3NlcTogW3tpbnQ6IDN9LCB7cHJuc3RyOiAnYWFhJ31dfX0pO1xuICogLy8gYWJvdmUgZ2VuZXJhdGVzIGEgQVNOLjEgZGF0YSBsaWtlIHRoaXM6XG4gKiAvLyBCSVQgU1RSSU5HLCBlbmNhcHN1bGF0ZXMge1xuICogLy8gICBTRVFVRU5DRSB7XG4gKiAvLyAgICAgSU5URUdFUiAzXG4gKiAvLyAgICAgUHJpbnRhYmxlU3RyaW5nICdhYWEnXG4gKiAvLyAgICAgfVxuICogLy8gICB9XG4gKi9cbktKVVIuYXNuMS5ERVJCaXRTdHJpbmcgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBpZiAocGFyYW1zICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHBhcmFtcy5vYmogIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgdmFyIG8gPSBLSlVSLmFzbjEuQVNOMVV0aWwubmV3T2JqZWN0KHBhcmFtcy5vYmopO1xuICAgICAgICBwYXJhbXMuaGV4ID0gXCIwMFwiICsgby5nZXRFbmNvZGVkSGV4KCk7XG4gICAgfVxuICAgIEtKVVIuYXNuMS5ERVJCaXRTdHJpbmcuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuICAgIHRoaXMuaFQgPSBcIjAzXCI7XG5cbiAgICAvKipcbiAgICAgKiBzZXQgQVNOLjEgdmFsdWUoVikgYnkgYSBoZXhhZGVjaW1hbCBzdHJpbmcgaW5jbHVkaW5nIHVudXNlZCBiaXRzXG4gICAgICogQG5hbWUgc2V0SGV4VmFsdWVJbmNsdWRpbmdVbnVzZWRCaXRzXG4gICAgICogQG1lbWJlck9mIEtKVVIuYXNuMS5ERVJCaXRTdHJpbmcjXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5ld0hleFN0cmluZ0luY2x1ZGluZ1VudXNlZEJpdHNcbiAgICAgKi9cbiAgICB0aGlzLnNldEhleFZhbHVlSW5jbHVkaW5nVW51c2VkQml0cyA9IGZ1bmN0aW9uKG5ld0hleFN0cmluZ0luY2x1ZGluZ1VudXNlZEJpdHMpIHtcbiAgICAgICAgdGhpcy5oVExWID0gbnVsbDtcbiAgICAgICAgdGhpcy5pc01vZGlmaWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oViA9IG5ld0hleFN0cmluZ0luY2x1ZGluZ1VudXNlZEJpdHM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIHNldCBBU04uMSB2YWx1ZShWKSBieSB1bnVzZWQgYml0IGFuZCBoZXhhZGVjaW1hbCBzdHJpbmcgb2YgdmFsdWVcbiAgICAgKiBAbmFtZSBzZXRVbnVzZWRCaXRzQW5kSGV4VmFsdWVcbiAgICAgKiBAbWVtYmVyT2YgS0pVUi5hc24xLkRFUkJpdFN0cmluZyNcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IHVudXNlZEJpdHNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gaFZhbHVlXG4gICAgICovXG4gICAgdGhpcy5zZXRVbnVzZWRCaXRzQW5kSGV4VmFsdWUgPSBmdW5jdGlvbih1bnVzZWRCaXRzLCBoVmFsdWUpIHtcbiAgICAgICAgaWYgKHVudXNlZEJpdHMgPCAwIHx8IDcgPCB1bnVzZWRCaXRzKSB7XG4gICAgICAgICAgICB0aHJvdyBcInVudXNlZCBiaXRzIHNoYWxsIGJlIGZyb20gMCB0byA3OiB1ID0gXCIgKyB1bnVzZWRCaXRzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBoVW51c2VkQml0cyA9IFwiMFwiICsgdW51c2VkQml0cztcbiAgICAgICAgdGhpcy5oVExWID0gbnVsbDtcbiAgICAgICAgdGhpcy5pc01vZGlmaWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oViA9IGhVbnVzZWRCaXRzICsgaFZhbHVlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBzZXQgQVNOLjEgREVSIEJpdFN0cmluZyBieSBiaW5hcnkgc3RyaW5nPGJyLz5cbiAgICAgKiBAbmFtZSBzZXRCeUJpbmFyeVN0cmluZ1xuICAgICAqIEBtZW1iZXJPZiBLSlVSLmFzbjEuREVSQml0U3RyaW5nI1xuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBiaW5hcnlTdHJpbmcgYmluYXJ5IHZhbHVlIHN0cmluZyAoaS5lLiAnMTAxMTEnKVxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEl0cyB1bnVzZWQgYml0cyB3aWxsIGJlIGNhbGN1bGF0ZWQgYXV0b21hdGljYWxseSBieSBsZW5ndGggb2ZcbiAgICAgKiAnYmluYXJ5VmFsdWUnLiA8YnIvPlxuICAgICAqIE5PVEU6IFRyYWlsaW5nIHplcm9zICcwJyB3aWxsIGJlIGlnbm9yZWQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBvID0gbmV3IEtKVVIuYXNuMS5ERVJCaXRTdHJpbmcoKTtcbiAgICAgKiBvLnNldEJ5Qm9vbGVhbkFycmF5KFwiMDEwMTFcIik7XG4gICAgICovXG4gICAgdGhpcy5zZXRCeUJpbmFyeVN0cmluZyA9IGZ1bmN0aW9uKGJpbmFyeVN0cmluZykge1xuICAgICAgICBiaW5hcnlTdHJpbmcgPSBiaW5hcnlTdHJpbmcucmVwbGFjZSgvMCskLywgJycpO1xuICAgICAgICB2YXIgdW51c2VkQml0cyA9IDggLSBiaW5hcnlTdHJpbmcubGVuZ3RoICUgODtcbiAgICAgICAgaWYgKHVudXNlZEJpdHMgPT0gOCkgdW51c2VkQml0cyA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IHVudXNlZEJpdHM7IGkrKykge1xuICAgICAgICAgICAgYmluYXJ5U3RyaW5nICs9ICcwJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgaCA9ICcnO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJpbmFyeVN0cmluZy5sZW5ndGggLSAxOyBpICs9IDgpIHtcbiAgICAgICAgICAgIHZhciBiID0gYmluYXJ5U3RyaW5nLnN1YnN0cihpLCA4KTtcbiAgICAgICAgICAgIHZhciB4ID0gcGFyc2VJbnQoYiwgMikudG9TdHJpbmcoMTYpO1xuICAgICAgICAgICAgaWYgKHgubGVuZ3RoID09IDEpIHggPSAnMCcgKyB4O1xuICAgICAgICAgICAgaCArPSB4O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaFRMViA9IG51bGw7XG4gICAgICAgIHRoaXMuaXNNb2RpZmllZCA9IHRydWU7XG4gICAgICAgIHRoaXMuaFYgPSAnMCcgKyB1bnVzZWRCaXRzICsgaDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogc2V0IEFTTi4xIFRMViB2YWx1ZShWKSBieSBhbiBhcnJheSBvZiBib29sZWFuPGJyLz5cbiAgICAgKiBAbmFtZSBzZXRCeUJvb2xlYW5BcnJheVxuICAgICAqIEBtZW1iZXJPZiBLSlVSLmFzbjEuREVSQml0U3RyaW5nI1xuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7YXJyYXl9IGJvb2xlYW5BcnJheSBhcnJheSBvZiBib29sZWFuIChleC4gW3RydWUsIGZhbHNlLCB0cnVlXSlcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBOT1RFOiBUcmFpbGluZyBmYWxzZXMgd2lsbCBiZSBpZ25vcmVkIGluIHRoZSBBU04uMSBERVIgT2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICogbyA9IG5ldyBLSlVSLmFzbjEuREVSQml0U3RyaW5nKCk7XG4gICAgICogby5zZXRCeUJvb2xlYW5BcnJheShbZmFsc2UsIHRydWUsIGZhbHNlLCB0cnVlLCB0cnVlXSk7XG4gICAgICovXG4gICAgdGhpcy5zZXRCeUJvb2xlYW5BcnJheSA9IGZ1bmN0aW9uKGJvb2xlYW5BcnJheSkge1xuICAgICAgICB2YXIgcyA9ICcnO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvb2xlYW5BcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGJvb2xlYW5BcnJheVtpXSA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcyArPSAnMSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHMgKz0gJzAnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0QnlCaW5hcnlTdHJpbmcocyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIGdlbmVyYXRlIGFuIGFycmF5IG9mIGZhbHNlcyB3aXRoIHNwZWNpZmllZCBsZW5ndGg8YnIvPlxuICAgICAqIEBuYW1lIG5ld0ZhbHNlQXJyYXlcbiAgICAgKiBAbWVtYmVyT2YgS0pVUi5hc24xLkRFUkJpdFN0cmluZ1xuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gbkxlbmd0aCBsZW5ndGggb2YgYXJyYXkgdG8gZ2VuZXJhdGVcbiAgICAgKiBAcmV0dXJuIHthcnJheX0gYXJyYXkgb2YgYm9vbGVhbiBmYWxzZXNcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBUaGlzIHN0YXRpYyBtZXRob2QgbWF5IGJlIHVzZWZ1bCB0byBpbml0aWFsaXplIGJvb2xlYW4gYXJyYXkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBvID0gbmV3IEtKVVIuYXNuMS5ERVJCaXRTdHJpbmcoKTtcbiAgICAgKiBvLm5ld0ZhbHNlQXJyYXkoMykgJnJhcnI7IFtmYWxzZSwgZmFsc2UsIGZhbHNlXVxuICAgICAqL1xuICAgIHRoaXMubmV3RmFsc2VBcnJheSA9IGZ1bmN0aW9uKG5MZW5ndGgpIHtcbiAgICAgICAgdmFyIGEgPSBuZXcgQXJyYXkobkxlbmd0aCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbkxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhW2ldID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0RnJlc2hWYWx1ZUhleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oVjtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIHBhcmFtcyA9PSBcInN0cmluZ1wiICYmIHBhcmFtcy50b0xvd2VyQ2FzZSgpLm1hdGNoKC9eWzAtOWEtZl0rJC8pKSB7XG4gICAgICAgICAgICB0aGlzLnNldEhleFZhbHVlSW5jbHVkaW5nVW51c2VkQml0cyhwYXJhbXMpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXJhbXNbJ2hleCddICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0SGV4VmFsdWVJbmNsdWRpbmdVbnVzZWRCaXRzKHBhcmFtc1snaGV4J10pO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXJhbXNbJ2JpbiddICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0QnlCaW5hcnlTdHJpbmcocGFyYW1zWydiaW4nXSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhcmFtc1snYXJyYXknXSAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLnNldEJ5Qm9vbGVhbkFycmF5KHBhcmFtc1snYXJyYXknXSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuWUFIT08ubGFuZy5leHRlbmQoS0pVUi5hc24xLkRFUkJpdFN0cmluZywgS0pVUi5hc24xLkFTTjFPYmplY3QpO1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLyoqXG4gKiBjbGFzcyBmb3IgQVNOLjEgREVSIE9jdGV0U3RyaW5nPGJyLz5cbiAqIEBuYW1lIEtKVVIuYXNuMS5ERVJPY3RldFN0cmluZ1xuICogQGNsYXNzIGNsYXNzIGZvciBBU04uMSBERVIgT2N0ZXRTdHJpbmdcbiAqIEBwYXJhbSB7QXJyYXl9IHBhcmFtcyBhc3NvY2lhdGl2ZSBhcnJheSBvZiBwYXJhbWV0ZXJzIChleC4geydzdHInOiAnYWFhJ30pXG4gKiBAZXh0ZW5kcyBLSlVSLmFzbjEuREVSQWJzdHJhY3RTdHJpbmdcbiAqIEBkZXNjcmlwdGlvblxuICogVGhpcyBjbGFzcyBwcm92aWRlcyBBU04uMSBPY3RldFN0cmluZyBzaW1wbGUgdHlwZS48YnIvPlxuICogU3VwcG9ydGVkIFwicGFyYW1zXCIgYXR0cmlidXRlcyBhcmU6XG4gKiA8dWw+XG4gKiA8bGk+c3RyIC0gdG8gc2V0IGEgc3RyaW5nIGFzIGEgdmFsdWU8L2xpPlxuICogPGxpPmhleCAtIHRvIHNldCBhIGhleGFkZWNpbWFsIHN0cmluZyBhcyBhIHZhbHVlPC9saT5cbiAqIDxsaT5vYmogLSB0byBzZXQgYSBlbmNhcHN1bGF0ZWQgQVNOLjEgdmFsdWUgYnkgSlNPTiBvYmplY3RcbiAqIHdoaWNoIGlzIGRlZmluZWQgaW4ge0BsaW5rIEtKVVIuYXNuMS5BU04xVXRpbC5uZXdPYmplY3R9PC9saT5cbiAqIDwvdWw+XG4gKiBOT1RFOiBBIHBhcmFtZXRlciAnb2JqJyBoYXZlIGJlZW4gc3VwcG9ydGVkXG4gKiBmb3IgXCJPQ1RFVCBTVFJJTkcsIGVuY2Fwc3VsYXRlc1wiIHN0cnVjdHVyZS5cbiAqIHNpbmNlIGFzbjEgMS4wLjExLCBqc3JzYXNpZ24gNi4xLjEgKDIwMTYtU2VwLTI1KS5cbiAqIEBzZWUgS0pVUi5hc24xLkRFUkFic3RyYWN0U3RyaW5nIC0gc3VwZXJjbGFzc1xuICogQGV4YW1wbGVcbiAqIC8vIGRlZmF1bHQgY29uc3RydWN0b3JcbiAqIG8gPSBuZXcgS0pVUi5hc24xLkRFUk9jdGV0U3RyaW5nKCk7XG4gKiAvLyBpbml0aWFsaXplIHdpdGggc3RyaW5nXG4gKiBvID0gbmV3IEtKVVIuYXNuMS5ERVJPY3RldFN0cmluZyh7c3RyOiBcImFhYVwifSk7XG4gKiAvLyBpbml0aWFsaXplIHdpdGggaGV4YWRlY2ltYWwgc3RyaW5nXG4gKiBvID0gbmV3IEtKVVIuYXNuMS5ERVJPY3RldFN0cmluZyh7aGV4OiBcIjYxNjE2MVwifSk7XG4gKiAvLyBpbml0aWFsaXplIHdpdGggQVNOMVV0aWwubmV3T2JqZWN0IGFyZ3VtZW50XG4gKiBvID0gbmV3IEtKVVIuYXNuMS5ERVJPY3RldFN0cmluZyh7b2JqOiB7c2VxOiBbe2ludDogM30sIHtwcm5zdHI6ICdhYWEnfV19fSk7XG4gKiAvLyBhYm92ZSBnZW5lcmF0ZXMgYSBBU04uMSBkYXRhIGxpa2UgdGhpczpcbiAqIC8vIE9DVEVUIFNUUklORywgZW5jYXBzdWxhdGVzIHtcbiAqIC8vICAgU0VRVUVOQ0Uge1xuICogLy8gICAgIElOVEVHRVIgM1xuICogLy8gICAgIFByaW50YWJsZVN0cmluZyAnYWFhJ1xuICogLy8gICAgIH1cbiAqIC8vICAgfVxuICovXG5LSlVSLmFzbjEuREVST2N0ZXRTdHJpbmcgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBpZiAocGFyYW1zICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHBhcmFtcy5vYmogIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgdmFyIG8gPSBLSlVSLmFzbjEuQVNOMVV0aWwubmV3T2JqZWN0KHBhcmFtcy5vYmopO1xuICAgICAgICBwYXJhbXMuaGV4ID0gby5nZXRFbmNvZGVkSGV4KCk7XG4gICAgfVxuICAgIEtKVVIuYXNuMS5ERVJPY3RldFN0cmluZy5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgcGFyYW1zKTtcbiAgICB0aGlzLmhUID0gXCIwNFwiO1xufTtcbllBSE9PLmxhbmcuZXh0ZW5kKEtKVVIuYXNuMS5ERVJPY3RldFN0cmluZywgS0pVUi5hc24xLkRFUkFic3RyYWN0U3RyaW5nKTtcblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8qKlxuICogY2xhc3MgZm9yIEFTTi4xIERFUiBOdWxsXG4gKiBAbmFtZSBLSlVSLmFzbjEuREVSTnVsbFxuICogQGNsYXNzIGNsYXNzIGZvciBBU04uMSBERVIgTnVsbFxuICogQGV4dGVuZHMgS0pVUi5hc24xLkFTTjFPYmplY3RcbiAqIEBkZXNjcmlwdGlvblxuICogQHNlZSBLSlVSLmFzbjEuQVNOMU9iamVjdCAtIHN1cGVyY2xhc3NcbiAqL1xuS0pVUi5hc24xLkRFUk51bGwgPSBmdW5jdGlvbigpIHtcbiAgICBLSlVSLmFzbjEuREVSTnVsbC5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XG4gICAgdGhpcy5oVCA9IFwiMDVcIjtcbiAgICB0aGlzLmhUTFYgPSBcIjA1MDBcIjtcbn07XG5ZQUhPTy5sYW5nLmV4dGVuZChLSlVSLmFzbjEuREVSTnVsbCwgS0pVUi5hc24xLkFTTjFPYmplY3QpO1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLyoqXG4gKiBjbGFzcyBmb3IgQVNOLjEgREVSIE9iamVjdElkZW50aWZpZXJcbiAqIEBuYW1lIEtKVVIuYXNuMS5ERVJPYmplY3RJZGVudGlmaWVyXG4gKiBAY2xhc3MgY2xhc3MgZm9yIEFTTi4xIERFUiBPYmplY3RJZGVudGlmaWVyXG4gKiBAcGFyYW0ge0FycmF5fSBwYXJhbXMgYXNzb2NpYXRpdmUgYXJyYXkgb2YgcGFyYW1ldGVycyAoZXguIHsnb2lkJzogJzIuNS40LjUnfSlcbiAqIEBleHRlbmRzIEtKVVIuYXNuMS5BU04xT2JqZWN0XG4gKiBAZGVzY3JpcHRpb25cbiAqIDxici8+XG4gKiBBcyBmb3IgYXJndW1lbnQgJ3BhcmFtcycgZm9yIGNvbnN0cnVjdG9yLCB5b3UgY2FuIHNwZWNpZnkgb25lIG9mXG4gKiBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqIDx1bD5cbiAqIDxsaT5vaWQgLSBzcGVjaWZ5IGluaXRpYWwgQVNOLjEgdmFsdWUoVikgYnkgYSBvaWQgc3RyaW5nIChleC4gMi41LjQuMTMpPC9saT5cbiAqIDxsaT5oZXggLSBzcGVjaWZ5IGluaXRpYWwgQVNOLjEgdmFsdWUoVikgYnkgYSBoZXhhZGVjaW1hbCBzdHJpbmc8L2xpPlxuICogPC91bD5cbiAqIE5PVEU6ICdwYXJhbXMnIGNhbiBiZSBvbWl0dGVkLlxuICovXG5LSlVSLmFzbjEuREVST2JqZWN0SWRlbnRpZmllciA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgIHZhciBpdG94ID0gZnVuY3Rpb24oaSkge1xuICAgICAgICB2YXIgaCA9IGkudG9TdHJpbmcoMTYpO1xuICAgICAgICBpZiAoaC5sZW5ndGggPT0gMSkgaCA9ICcwJyArIGg7XG4gICAgICAgIHJldHVybiBoO1xuICAgIH07XG4gICAgdmFyIHJvaWR0b3ggPSBmdW5jdGlvbihyb2lkKSB7XG4gICAgICAgIHZhciBoID0gJyc7XG4gICAgICAgIHZhciBiaSA9IG5ldyBCaWdJbnRlZ2VyKHJvaWQsIDEwKTtcbiAgICAgICAgdmFyIGIgPSBiaS50b1N0cmluZygyKTtcbiAgICAgICAgdmFyIHBhZExlbiA9IDcgLSBiLmxlbmd0aCAlIDc7XG4gICAgICAgIGlmIChwYWRMZW4gPT0gNykgcGFkTGVuID0gMDtcbiAgICAgICAgdmFyIGJQYWQgPSAnJztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWRMZW47IGkrKykgYlBhZCArPSAnMCc7XG4gICAgICAgIGIgPSBiUGFkICsgYjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aCAtIDE7IGkgKz0gNykge1xuICAgICAgICAgICAgdmFyIGI4ID0gYi5zdWJzdHIoaSwgNyk7XG4gICAgICAgICAgICBpZiAoaSAhPSBiLmxlbmd0aCAtIDcpIGI4ID0gJzEnICsgYjg7XG4gICAgICAgICAgICBoICs9IGl0b3gocGFyc2VJbnQoYjgsIDIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaDtcbiAgICB9XG5cbiAgICBLSlVSLmFzbjEuREVST2JqZWN0SWRlbnRpZmllci5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XG4gICAgdGhpcy5oVCA9IFwiMDZcIjtcblxuICAgIC8qKlxuICAgICAqIHNldCB2YWx1ZSBieSBhIGhleGFkZWNpbWFsIHN0cmluZ1xuICAgICAqIEBuYW1lIHNldFZhbHVlSGV4XG4gICAgICogQG1lbWJlck9mIEtKVVIuYXNuMS5ERVJPYmplY3RJZGVudGlmaWVyI1xuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuZXdIZXhTdHJpbmcgaGV4YWRlY2ltYWwgdmFsdWUgb2YgT0lEIGJ5dGVzXG4gICAgICovXG4gICAgdGhpcy5zZXRWYWx1ZUhleCA9IGZ1bmN0aW9uKG5ld0hleFN0cmluZykge1xuICAgICAgICB0aGlzLmhUTFYgPSBudWxsO1xuICAgICAgICB0aGlzLmlzTW9kaWZpZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnMgPSBudWxsO1xuICAgICAgICB0aGlzLmhWID0gbmV3SGV4U3RyaW5nO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBzZXQgdmFsdWUgYnkgYSBPSUQgc3RyaW5nPGJyLz5cbiAgICAgKiBAbmFtZSBzZXRWYWx1ZU9pZFN0cmluZ1xuICAgICAqIEBtZW1iZXJPZiBLSlVSLmFzbjEuREVST2JqZWN0SWRlbnRpZmllciNcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb2lkU3RyaW5nIE9JRCBzdHJpbmcgKGV4LiAyLjUuNC4xMylcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIG8gPSBuZXcgS0pVUi5hc24xLkRFUk9iamVjdElkZW50aWZpZXIoKTtcbiAgICAgKiBvLnNldFZhbHVlT2lkU3RyaW5nKFwiMi41LjQuMTNcIik7XG4gICAgICovXG4gICAgdGhpcy5zZXRWYWx1ZU9pZFN0cmluZyA9IGZ1bmN0aW9uKG9pZFN0cmluZykge1xuICAgICAgICBpZiAoISBvaWRTdHJpbmcubWF0Y2goL15bMC05Ll0rJC8pKSB7XG4gICAgICAgICAgICB0aHJvdyBcIm1hbGZvcm1lZCBvaWQgc3RyaW5nOiBcIiArIG9pZFN0cmluZztcbiAgICAgICAgfVxuICAgICAgICB2YXIgaCA9ICcnO1xuICAgICAgICB2YXIgYSA9IG9pZFN0cmluZy5zcGxpdCgnLicpO1xuICAgICAgICB2YXIgaTAgPSBwYXJzZUludChhWzBdKSAqIDQwICsgcGFyc2VJbnQoYVsxXSk7XG4gICAgICAgIGggKz0gaXRveChpMCk7XG4gICAgICAgIGEuc3BsaWNlKDAsIDIpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGggKz0gcm9pZHRveChhW2ldKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhUTFYgPSBudWxsO1xuICAgICAgICB0aGlzLmlzTW9kaWZpZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnMgPSBudWxsO1xuICAgICAgICB0aGlzLmhWID0gaDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogc2V0IHZhbHVlIGJ5IGEgT0lEIG5hbWVcbiAgICAgKiBAbmFtZSBzZXRWYWx1ZU5hbWVcbiAgICAgKiBAbWVtYmVyT2YgS0pVUi5hc24xLkRFUk9iamVjdElkZW50aWZpZXIjXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9pZE5hbWUgT0lEIG5hbWUgKGV4LiAnc2VydmVyQXV0aCcpXG4gICAgICogQHNpbmNlIDEuMC4xXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogT0lEIG5hbWUgc2hhbGwgYmUgZGVmaW5lZCBpbiAnS0pVUi5hc24xLng1MDkuT0lELm5hbWUyb2lkTGlzdCcuXG4gICAgICogT3RoZXJ3aXNlIHJhaXNlIGVycm9yLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogbyA9IG5ldyBLSlVSLmFzbjEuREVST2JqZWN0SWRlbnRpZmllcigpO1xuICAgICAqIG8uc2V0VmFsdWVOYW1lKFwic2VydmVyQXV0aFwiKTtcbiAgICAgKi9cbiAgICB0aGlzLnNldFZhbHVlTmFtZSA9IGZ1bmN0aW9uKG9pZE5hbWUpIHtcbiAgICAgICAgdmFyIG9pZCA9IEtKVVIuYXNuMS54NTA5Lk9JRC5uYW1lMm9pZChvaWROYW1lKTtcbiAgICAgICAgaWYgKG9pZCAhPT0gJycpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWVPaWRTdHJpbmcob2lkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IFwiREVST2JqZWN0SWRlbnRpZmllciBvaWROYW1lIHVuZGVmaW5lZDogXCIgKyBvaWROYW1lO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0RnJlc2hWYWx1ZUhleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oVjtcbiAgICB9O1xuXG4gICAgaWYgKHBhcmFtcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcGFyYW1zID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBpZiAocGFyYW1zLm1hdGNoKC9eWzAtMl0uWzAtOS5dKyQvKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmFsdWVPaWRTdHJpbmcocGFyYW1zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZU5hbWUocGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMub2lkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWVPaWRTdHJpbmcocGFyYW1zLm9pZCk7XG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLmhleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlSGV4KHBhcmFtcy5oZXgpO1xuICAgICAgICB9IGVsc2UgaWYgKHBhcmFtcy5uYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWVOYW1lKHBhcmFtcy5uYW1lKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5ZQUhPTy5sYW5nLmV4dGVuZChLSlVSLmFzbjEuREVST2JqZWN0SWRlbnRpZmllciwgS0pVUi5hc24xLkFTTjFPYmplY3QpO1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLyoqXG4gKiBjbGFzcyBmb3IgQVNOLjEgREVSIEVudW1lcmF0ZWRcbiAqIEBuYW1lIEtKVVIuYXNuMS5ERVJFbnVtZXJhdGVkXG4gKiBAY2xhc3MgY2xhc3MgZm9yIEFTTi4xIERFUiBFbnVtZXJhdGVkXG4gKiBAZXh0ZW5kcyBLSlVSLmFzbjEuQVNOMU9iamVjdFxuICogQGRlc2NyaXB0aW9uXG4gKiA8YnIvPlxuICogQXMgZm9yIGFyZ3VtZW50ICdwYXJhbXMnIGZvciBjb25zdHJ1Y3RvciwgeW91IGNhbiBzcGVjaWZ5IG9uZSBvZlxuICogZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKiA8dWw+XG4gKiA8bGk+aW50IC0gc3BlY2lmeSBpbml0aWFsIEFTTi4xIHZhbHVlKFYpIGJ5IGludGVnZXIgdmFsdWU8L2xpPlxuICogPGxpPmhleCAtIHNwZWNpZnkgaW5pdGlhbCBBU04uMSB2YWx1ZShWKSBieSBhIGhleGFkZWNpbWFsIHN0cmluZzwvbGk+XG4gKiA8L3VsPlxuICogTk9URTogJ3BhcmFtcycgY2FuIGJlIG9taXR0ZWQuXG4gKiBAZXhhbXBsZVxuICogbmV3IEtKVVIuYXNuMS5ERVJFbnVtZXJhdGVkKDEyMyk7XG4gKiBuZXcgS0pVUi5hc24xLkRFUkVudW1lcmF0ZWQoe2ludDogMTIzfSk7XG4gKiBuZXcgS0pVUi5hc24xLkRFUkVudW1lcmF0ZWQoe2hleDogJzFmYWQnfSk7XG4gKi9cbktKVVIuYXNuMS5ERVJFbnVtZXJhdGVkID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgS0pVUi5hc24xLkRFUkVudW1lcmF0ZWQuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuICAgIHRoaXMuaFQgPSBcIjBhXCI7XG5cbiAgICAvKipcbiAgICAgKiBzZXQgdmFsdWUgYnkgVG9tIFd1J3MgQmlnSW50ZWdlciBvYmplY3RcbiAgICAgKiBAbmFtZSBzZXRCeUJpZ0ludGVnZXJcbiAgICAgKiBAbWVtYmVyT2YgS0pVUi5hc24xLkRFUkVudW1lcmF0ZWQjXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtCaWdJbnRlZ2VyfSBiaWdJbnRlZ2VyVmFsdWUgdG8gc2V0XG4gICAgICovXG4gICAgdGhpcy5zZXRCeUJpZ0ludGVnZXIgPSBmdW5jdGlvbihiaWdJbnRlZ2VyVmFsdWUpIHtcbiAgICAgICAgdGhpcy5oVExWID0gbnVsbDtcbiAgICAgICAgdGhpcy5pc01vZGlmaWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oViA9IEtKVVIuYXNuMS5BU04xVXRpbC5iaWdJbnRUb01pblR3b3NDb21wbGVtZW50c0hleChiaWdJbnRlZ2VyVmFsdWUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBzZXQgdmFsdWUgYnkgaW50ZWdlciB2YWx1ZVxuICAgICAqIEBuYW1lIHNldEJ5SW50ZWdlclxuICAgICAqIEBtZW1iZXJPZiBLSlVSLmFzbjEuREVSRW51bWVyYXRlZCNcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IGludGVnZXIgdmFsdWUgdG8gc2V0XG4gICAgICovXG4gICAgdGhpcy5zZXRCeUludGVnZXIgPSBmdW5jdGlvbihpbnRWYWx1ZSkge1xuICAgICAgICB2YXIgYmkgPSBuZXcgQmlnSW50ZWdlcihTdHJpbmcoaW50VmFsdWUpLCAxMCk7XG4gICAgICAgIHRoaXMuc2V0QnlCaWdJbnRlZ2VyKGJpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogc2V0IHZhbHVlIGJ5IGludGVnZXIgdmFsdWVcbiAgICAgKiBAbmFtZSBzZXRWYWx1ZUhleFxuICAgICAqIEBtZW1iZXJPZiBLSlVSLmFzbjEuREVSRW51bWVyYXRlZCNcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gaGV4YWRlY2ltYWwgc3RyaW5nIG9mIGludGVnZXIgdmFsdWVcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiA8YnIvPlxuICAgICAqIE5PVEU6IFZhbHVlIHNoYWxsIGJlIHJlcHJlc2VudGVkIGJ5IG1pbmltdW0gb2N0ZXQgbGVuZ3RoIG9mXG4gICAgICogdHdvJ3MgY29tcGxlbWVudCByZXByZXNlbnRhdGlvbi5cbiAgICAgKi9cbiAgICB0aGlzLnNldFZhbHVlSGV4ID0gZnVuY3Rpb24obmV3SGV4U3RyaW5nKSB7XG4gICAgICAgIHRoaXMuaFYgPSBuZXdIZXhTdHJpbmc7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0RnJlc2hWYWx1ZUhleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oVjtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIHBhcmFtc1snaW50J10gIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5zZXRCeUludGVnZXIocGFyYW1zWydpbnQnXSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhcmFtcyA9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICB0aGlzLnNldEJ5SW50ZWdlcihwYXJhbXMpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXJhbXNbJ2hleCddICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWVIZXgocGFyYW1zWydoZXgnXSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuWUFIT08ubGFuZy5leHRlbmQoS0pVUi5hc24xLkRFUkVudW1lcmF0ZWQsIEtKVVIuYXNuMS5BU04xT2JqZWN0KTtcblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8qKlxuICogY2xhc3MgZm9yIEFTTi4xIERFUiBVVEY4U3RyaW5nXG4gKiBAbmFtZSBLSlVSLmFzbjEuREVSVVRGOFN0cmluZ1xuICogQGNsYXNzIGNsYXNzIGZvciBBU04uMSBERVIgVVRGOFN0cmluZ1xuICogQHBhcmFtIHtBcnJheX0gcGFyYW1zIGFzc29jaWF0aXZlIGFycmF5IG9mIHBhcmFtZXRlcnMgKGV4LiB7J3N0cic6ICdhYWEnfSlcbiAqIEBleHRlbmRzIEtKVVIuYXNuMS5ERVJBYnN0cmFjdFN0cmluZ1xuICogQGRlc2NyaXB0aW9uXG4gKiBAc2VlIEtKVVIuYXNuMS5ERVJBYnN0cmFjdFN0cmluZyAtIHN1cGVyY2xhc3NcbiAqL1xuS0pVUi5hc24xLkRFUlVURjhTdHJpbmcgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBLSlVSLmFzbjEuREVSVVRGOFN0cmluZy5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgcGFyYW1zKTtcbiAgICB0aGlzLmhUID0gXCIwY1wiO1xufTtcbllBSE9PLmxhbmcuZXh0ZW5kKEtKVVIuYXNuMS5ERVJVVEY4U3RyaW5nLCBLSlVSLmFzbjEuREVSQWJzdHJhY3RTdHJpbmcpO1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLyoqXG4gKiBjbGFzcyBmb3IgQVNOLjEgREVSIE51bWVyaWNTdHJpbmdcbiAqIEBuYW1lIEtKVVIuYXNuMS5ERVJOdW1lcmljU3RyaW5nXG4gKiBAY2xhc3MgY2xhc3MgZm9yIEFTTi4xIERFUiBOdW1lcmljU3RyaW5nXG4gKiBAcGFyYW0ge0FycmF5fSBwYXJhbXMgYXNzb2NpYXRpdmUgYXJyYXkgb2YgcGFyYW1ldGVycyAoZXguIHsnc3RyJzogJ2FhYSd9KVxuICogQGV4dGVuZHMgS0pVUi5hc24xLkRFUkFic3RyYWN0U3RyaW5nXG4gKiBAZGVzY3JpcHRpb25cbiAqIEBzZWUgS0pVUi5hc24xLkRFUkFic3RyYWN0U3RyaW5nIC0gc3VwZXJjbGFzc1xuICovXG5LSlVSLmFzbjEuREVSTnVtZXJpY1N0cmluZyA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgIEtKVVIuYXNuMS5ERVJOdW1lcmljU3RyaW5nLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBwYXJhbXMpO1xuICAgIHRoaXMuaFQgPSBcIjEyXCI7XG59O1xuWUFIT08ubGFuZy5leHRlbmQoS0pVUi5hc24xLkRFUk51bWVyaWNTdHJpbmcsIEtKVVIuYXNuMS5ERVJBYnN0cmFjdFN0cmluZyk7XG5cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vKipcbiAqIGNsYXNzIGZvciBBU04uMSBERVIgUHJpbnRhYmxlU3RyaW5nXG4gKiBAbmFtZSBLSlVSLmFzbjEuREVSUHJpbnRhYmxlU3RyaW5nXG4gKiBAY2xhc3MgY2xhc3MgZm9yIEFTTi4xIERFUiBQcmludGFibGVTdHJpbmdcbiAqIEBwYXJhbSB7QXJyYXl9IHBhcmFtcyBhc3NvY2lhdGl2ZSBhcnJheSBvZiBwYXJhbWV0ZXJzIChleC4geydzdHInOiAnYWFhJ30pXG4gKiBAZXh0ZW5kcyBLSlVSLmFzbjEuREVSQWJzdHJhY3RTdHJpbmdcbiAqIEBkZXNjcmlwdGlvblxuICogQHNlZSBLSlVSLmFzbjEuREVSQWJzdHJhY3RTdHJpbmcgLSBzdXBlcmNsYXNzXG4gKi9cbktKVVIuYXNuMS5ERVJQcmludGFibGVTdHJpbmcgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBLSlVSLmFzbjEuREVSUHJpbnRhYmxlU3RyaW5nLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBwYXJhbXMpO1xuICAgIHRoaXMuaFQgPSBcIjEzXCI7XG59O1xuWUFIT08ubGFuZy5leHRlbmQoS0pVUi5hc24xLkRFUlByaW50YWJsZVN0cmluZywgS0pVUi5hc24xLkRFUkFic3RyYWN0U3RyaW5nKTtcblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8qKlxuICogY2xhc3MgZm9yIEFTTi4xIERFUiBUZWxldGV4U3RyaW5nXG4gKiBAbmFtZSBLSlVSLmFzbjEuREVSVGVsZXRleFN0cmluZ1xuICogQGNsYXNzIGNsYXNzIGZvciBBU04uMSBERVIgVGVsZXRleFN0cmluZ1xuICogQHBhcmFtIHtBcnJheX0gcGFyYW1zIGFzc29jaWF0aXZlIGFycmF5IG9mIHBhcmFtZXRlcnMgKGV4LiB7J3N0cic6ICdhYWEnfSlcbiAqIEBleHRlbmRzIEtKVVIuYXNuMS5ERVJBYnN0cmFjdFN0cmluZ1xuICogQGRlc2NyaXB0aW9uXG4gKiBAc2VlIEtKVVIuYXNuMS5ERVJBYnN0cmFjdFN0cmluZyAtIHN1cGVyY2xhc3NcbiAqL1xuS0pVUi5hc24xLkRFUlRlbGV0ZXhTdHJpbmcgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBLSlVSLmFzbjEuREVSVGVsZXRleFN0cmluZy5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgcGFyYW1zKTtcbiAgICB0aGlzLmhUID0gXCIxNFwiO1xufTtcbllBSE9PLmxhbmcuZXh0ZW5kKEtKVVIuYXNuMS5ERVJUZWxldGV4U3RyaW5nLCBLSlVSLmFzbjEuREVSQWJzdHJhY3RTdHJpbmcpO1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLyoqXG4gKiBjbGFzcyBmb3IgQVNOLjEgREVSIElBNVN0cmluZ1xuICogQG5hbWUgS0pVUi5hc24xLkRFUklBNVN0cmluZ1xuICogQGNsYXNzIGNsYXNzIGZvciBBU04uMSBERVIgSUE1U3RyaW5nXG4gKiBAcGFyYW0ge0FycmF5fSBwYXJhbXMgYXNzb2NpYXRpdmUgYXJyYXkgb2YgcGFyYW1ldGVycyAoZXguIHsnc3RyJzogJ2FhYSd9KVxuICogQGV4dGVuZHMgS0pVUi5hc24xLkRFUkFic3RyYWN0U3RyaW5nXG4gKiBAZGVzY3JpcHRpb25cbiAqIEBzZWUgS0pVUi5hc24xLkRFUkFic3RyYWN0U3RyaW5nIC0gc3VwZXJjbGFzc1xuICovXG5LSlVSLmFzbjEuREVSSUE1U3RyaW5nID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgS0pVUi5hc24xLkRFUklBNVN0cmluZy5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgcGFyYW1zKTtcbiAgICB0aGlzLmhUID0gXCIxNlwiO1xufTtcbllBSE9PLmxhbmcuZXh0ZW5kKEtKVVIuYXNuMS5ERVJJQTVTdHJpbmcsIEtKVVIuYXNuMS5ERVJBYnN0cmFjdFN0cmluZyk7XG5cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vKipcbiAqIGNsYXNzIGZvciBBU04uMSBERVIgVVRDVGltZVxuICogQG5hbWUgS0pVUi5hc24xLkRFUlVUQ1RpbWVcbiAqIEBjbGFzcyBjbGFzcyBmb3IgQVNOLjEgREVSIFVUQ1RpbWVcbiAqIEBwYXJhbSB7QXJyYXl9IHBhcmFtcyBhc3NvY2lhdGl2ZSBhcnJheSBvZiBwYXJhbWV0ZXJzIChleC4geydzdHInOiAnMTMwNDMwMjM1OTU5Wid9KVxuICogQGV4dGVuZHMgS0pVUi5hc24xLkRFUkFic3RyYWN0VGltZVxuICogQGRlc2NyaXB0aW9uXG4gKiA8YnIvPlxuICogQXMgZm9yIGFyZ3VtZW50ICdwYXJhbXMnIGZvciBjb25zdHJ1Y3RvciwgeW91IGNhbiBzcGVjaWZ5IG9uZSBvZlxuICogZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKiA8dWw+XG4gKiA8bGk+c3RyIC0gc3BlY2lmeSBpbml0aWFsIEFTTi4xIHZhbHVlKFYpIGJ5IGEgc3RyaW5nIChleC4nMTMwNDMwMjM1OTU5WicpPC9saT5cbiAqIDxsaT5oZXggLSBzcGVjaWZ5IGluaXRpYWwgQVNOLjEgdmFsdWUoVikgYnkgYSBoZXhhZGVjaW1hbCBzdHJpbmc8L2xpPlxuICogPGxpPmRhdGUgLSBzcGVjaWZ5IERhdGUgb2JqZWN0LjwvbGk+XG4gKiA8L3VsPlxuICogTk9URTogJ3BhcmFtcycgY2FuIGJlIG9taXR0ZWQuXG4gKiA8aDQ+RVhBTVBMRVM8L2g0PlxuICogQGV4YW1wbGVcbiAqIGQxID0gbmV3IEtKVVIuYXNuMS5ERVJVVENUaW1lKCk7XG4gKiBkMS5zZXRTdHJpbmcoJzEzMDQzMDEyNTk1OVonKTtcbiAqXG4gKiBkMiA9IG5ldyBLSlVSLmFzbjEuREVSVVRDVGltZSh7J3N0cic6ICcxMzA0MzAxMjU5NTlaJ30pO1xuICogZDMgPSBuZXcgS0pVUi5hc24xLkRFUlVUQ1RpbWUoeydkYXRlJzogbmV3IERhdGUoRGF0ZS5VVEMoMjAxNSwgMCwgMzEsIDAsIDAsIDAsIDApKX0pO1xuICogZDQgPSBuZXcgS0pVUi5hc24xLkRFUlVUQ1RpbWUoJzEzMDQzMDEyNTk1OVonKTtcbiAqL1xuS0pVUi5hc24xLkRFUlVUQ1RpbWUgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBLSlVSLmFzbjEuREVSVVRDVGltZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgcGFyYW1zKTtcbiAgICB0aGlzLmhUID0gXCIxN1wiO1xuXG4gICAgLyoqXG4gICAgICogc2V0IHZhbHVlIGJ5IGEgRGF0ZSBvYmplY3Q8YnIvPlxuICAgICAqIEBuYW1lIHNldEJ5RGF0ZVxuICAgICAqIEBtZW1iZXJPZiBLSlVSLmFzbjEuREVSVVRDVGltZSNcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge0RhdGV9IGRhdGVPYmplY3QgRGF0ZSBvYmplY3QgdG8gc2V0IEFTTi4xIHZhbHVlKFYpXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBvID0gbmV3IEtKVVIuYXNuMS5ERVJVVENUaW1lKCk7XG4gICAgICogby5zZXRCeURhdGUobmV3IERhdGUoXCIyMDE2LzEyLzMxXCIpKTtcbiAgICAgKi9cbiAgICB0aGlzLnNldEJ5RGF0ZSA9IGZ1bmN0aW9uKGRhdGVPYmplY3QpIHtcbiAgICAgICAgdGhpcy5oVExWID0gbnVsbDtcbiAgICAgICAgdGhpcy5pc01vZGlmaWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kYXRlID0gZGF0ZU9iamVjdDtcbiAgICAgICAgdGhpcy5zID0gdGhpcy5mb3JtYXREYXRlKHRoaXMuZGF0ZSwgJ3V0YycpO1xuICAgICAgICB0aGlzLmhWID0gc3RvaGV4KHRoaXMucyk7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0RnJlc2hWYWx1ZUhleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuZGF0ZSA9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiB0aGlzLnMgPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5kYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHRoaXMucyA9IHRoaXMuZm9ybWF0RGF0ZSh0aGlzLmRhdGUsICd1dGMnKTtcbiAgICAgICAgICAgIHRoaXMuaFYgPSBzdG9oZXgodGhpcy5zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5oVjtcbiAgICB9O1xuXG4gICAgaWYgKHBhcmFtcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChwYXJhbXMuc3RyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RyaW5nKHBhcmFtcy5zdHIpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXJhbXMgPT0gXCJzdHJpbmdcIiAmJiBwYXJhbXMubWF0Y2goL15bMC05XXsxMn1aJC8pKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0cmluZyhwYXJhbXMpO1xuICAgICAgICB9IGVsc2UgaWYgKHBhcmFtcy5oZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdHJpbmdIZXgocGFyYW1zLmhleCk7XG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLmRhdGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRCeURhdGUocGFyYW1zLmRhdGUpO1xuICAgICAgICB9XG4gICAgfVxufTtcbllBSE9PLmxhbmcuZXh0ZW5kKEtKVVIuYXNuMS5ERVJVVENUaW1lLCBLSlVSLmFzbjEuREVSQWJzdHJhY3RUaW1lKTtcblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8qKlxuICogY2xhc3MgZm9yIEFTTi4xIERFUiBHZW5lcmFsaXplZFRpbWVcbiAqIEBuYW1lIEtKVVIuYXNuMS5ERVJHZW5lcmFsaXplZFRpbWVcbiAqIEBjbGFzcyBjbGFzcyBmb3IgQVNOLjEgREVSIEdlbmVyYWxpemVkVGltZVxuICogQHBhcmFtIHtBcnJheX0gcGFyYW1zIGFzc29jaWF0aXZlIGFycmF5IG9mIHBhcmFtZXRlcnMgKGV4LiB7J3N0cic6ICcyMDEzMDQzMDIzNTk1OVonfSlcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gd2l0aE1pbGxpcyBmbGFnIHRvIHNob3cgbWlsbGlzZWNvbmRzIG9yIG5vdFxuICogQGV4dGVuZHMgS0pVUi5hc24xLkRFUkFic3RyYWN0VGltZVxuICogQGRlc2NyaXB0aW9uXG4gKiA8YnIvPlxuICogQXMgZm9yIGFyZ3VtZW50ICdwYXJhbXMnIGZvciBjb25zdHJ1Y3RvciwgeW91IGNhbiBzcGVjaWZ5IG9uZSBvZlxuICogZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKiA8dWw+XG4gKiA8bGk+c3RyIC0gc3BlY2lmeSBpbml0aWFsIEFTTi4xIHZhbHVlKFYpIGJ5IGEgc3RyaW5nIChleC4nMjAxMzA0MzAyMzU5NTlaJyk8L2xpPlxuICogPGxpPmhleCAtIHNwZWNpZnkgaW5pdGlhbCBBU04uMSB2YWx1ZShWKSBieSBhIGhleGFkZWNpbWFsIHN0cmluZzwvbGk+XG4gKiA8bGk+ZGF0ZSAtIHNwZWNpZnkgRGF0ZSBvYmplY3QuPC9saT5cbiAqIDxsaT5taWxsaXMgLSBzcGVjaWZ5IGZsYWcgdG8gc2hvdyBtaWxsaXNlY29uZHMgKGZyb20gMS4wLjYpPC9saT5cbiAqIDwvdWw+XG4gKiBOT1RFMTogJ3BhcmFtcycgY2FuIGJlIG9taXR0ZWQuXG4gKiBOT1RFMjogJ3dpdGhNaWxsaXMnIHByb3BlcnR5IGlzIHN1cHBvcnRlZCBmcm9tIGFzbjEgMS4wLjYuXG4gKi9cbktKVVIuYXNuMS5ERVJHZW5lcmFsaXplZFRpbWUgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBLSlVSLmFzbjEuREVSR2VuZXJhbGl6ZWRUaW1lLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBwYXJhbXMpO1xuICAgIHRoaXMuaFQgPSBcIjE4XCI7XG4gICAgdGhpcy53aXRoTWlsbGlzID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBzZXQgdmFsdWUgYnkgYSBEYXRlIG9iamVjdFxuICAgICAqIEBuYW1lIHNldEJ5RGF0ZVxuICAgICAqIEBtZW1iZXJPZiBLSlVSLmFzbjEuREVSR2VuZXJhbGl6ZWRUaW1lI1xuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZU9iamVjdCBEYXRlIG9iamVjdCB0byBzZXQgQVNOLjEgdmFsdWUoVilcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIFdoZW4geW91IHNwZWNpZnkgVVRDIHRpbWUsIHVzZSAnRGF0ZS5VVEMnIG1ldGhvZCBsaWtlIHRoaXM6PGJyLz5cbiAgICAgKiBvMSA9IG5ldyBERVJVVENUaW1lKCk7XG4gICAgICogbzEuc2V0QnlEYXRlKGRhdGUpO1xuICAgICAqXG4gICAgICogZGF0ZSA9IG5ldyBEYXRlKERhdGUuVVRDKDIwMTUsIDAsIDMxLCAyMywgNTksIDU5LCAwKSk7ICMyMDE1SkFOMzEgMjM6NTk6NTlcbiAgICAgKi9cbiAgICB0aGlzLnNldEJ5RGF0ZSA9IGZ1bmN0aW9uKGRhdGVPYmplY3QpIHtcbiAgICAgICAgdGhpcy5oVExWID0gbnVsbDtcbiAgICAgICAgdGhpcy5pc01vZGlmaWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kYXRlID0gZGF0ZU9iamVjdDtcbiAgICAgICAgdGhpcy5zID0gdGhpcy5mb3JtYXREYXRlKHRoaXMuZGF0ZSwgJ2dlbicsIHRoaXMud2l0aE1pbGxpcyk7XG4gICAgICAgIHRoaXMuaFYgPSBzdG9oZXgodGhpcy5zKTtcbiAgICB9O1xuXG4gICAgdGhpcy5nZXRGcmVzaFZhbHVlSGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGUgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5kYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHRoaXMucyA9IHRoaXMuZm9ybWF0RGF0ZSh0aGlzLmRhdGUsICdnZW4nLCB0aGlzLndpdGhNaWxsaXMpO1xuICAgICAgICAgICAgdGhpcy5oViA9IHN0b2hleCh0aGlzLnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmhWO1xuICAgIH07XG5cbiAgICBpZiAocGFyYW1zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHBhcmFtcy5zdHIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdHJpbmcocGFyYW1zLnN0cik7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhcmFtcyA9PSBcInN0cmluZ1wiICYmIHBhcmFtcy5tYXRjaCgvXlswLTldezE0fVokLykpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RyaW5nKHBhcmFtcyk7XG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLmhleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0cmluZ0hleChwYXJhbXMuaGV4KTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMuZGF0ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnNldEJ5RGF0ZShwYXJhbXMuZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmFtcy5taWxsaXMgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMud2l0aE1pbGxpcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59O1xuWUFIT08ubGFuZy5leHRlbmQoS0pVUi5hc24xLkRFUkdlbmVyYWxpemVkVGltZSwgS0pVUi5hc24xLkRFUkFic3RyYWN0VGltZSk7XG5cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vKipcbiAqIGNsYXNzIGZvciBBU04uMSBERVIgU2VxdWVuY2VcbiAqIEBuYW1lIEtKVVIuYXNuMS5ERVJTZXF1ZW5jZVxuICogQGNsYXNzIGNsYXNzIGZvciBBU04uMSBERVIgU2VxdWVuY2VcbiAqIEBleHRlbmRzIEtKVVIuYXNuMS5ERVJBYnN0cmFjdFN0cnVjdHVyZWRcbiAqIEBkZXNjcmlwdGlvblxuICogPGJyLz5cbiAqIEFzIGZvciBhcmd1bWVudCAncGFyYW1zJyBmb3IgY29uc3RydWN0b3IsIHlvdSBjYW4gc3BlY2lmeSBvbmUgb2ZcbiAqIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICogPHVsPlxuICogPGxpPmFycmF5IC0gc3BlY2lmeSBhcnJheSBvZiBBU04xT2JqZWN0IHRvIHNldCBlbGVtZW50cyBvZiBjb250ZW50PC9saT5cbiAqIDwvdWw+XG4gKiBOT1RFOiAncGFyYW1zJyBjYW4gYmUgb21pdHRlZC5cbiAqL1xuS0pVUi5hc24xLkRFUlNlcXVlbmNlID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgS0pVUi5hc24xLkRFUlNlcXVlbmNlLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBwYXJhbXMpO1xuICAgIHRoaXMuaFQgPSBcIjMwXCI7XG4gICAgdGhpcy5nZXRGcmVzaFZhbHVlSGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoID0gJyc7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hc24xQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBhc24xT2JqID0gdGhpcy5hc24xQXJyYXlbaV07XG4gICAgICAgICAgICBoICs9IGFzbjFPYmouZ2V0RW5jb2RlZEhleCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaFYgPSBoO1xuICAgICAgICByZXR1cm4gdGhpcy5oVjtcbiAgICB9O1xufTtcbllBSE9PLmxhbmcuZXh0ZW5kKEtKVVIuYXNuMS5ERVJTZXF1ZW5jZSwgS0pVUi5hc24xLkRFUkFic3RyYWN0U3RydWN0dXJlZCk7XG5cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vKipcbiAqIGNsYXNzIGZvciBBU04uMSBERVIgU2V0XG4gKiBAbmFtZSBLSlVSLmFzbjEuREVSU2V0XG4gKiBAY2xhc3MgY2xhc3MgZm9yIEFTTi4xIERFUiBTZXRcbiAqIEBleHRlbmRzIEtKVVIuYXNuMS5ERVJBYnN0cmFjdFN0cnVjdHVyZWRcbiAqIEBkZXNjcmlwdGlvblxuICogPGJyLz5cbiAqIEFzIGZvciBhcmd1bWVudCAncGFyYW1zJyBmb3IgY29uc3RydWN0b3IsIHlvdSBjYW4gc3BlY2lmeSBvbmUgb2ZcbiAqIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICogPHVsPlxuICogPGxpPmFycmF5IC0gc3BlY2lmeSBhcnJheSBvZiBBU04xT2JqZWN0IHRvIHNldCBlbGVtZW50cyBvZiBjb250ZW50PC9saT5cbiAqIDxsaT5zb3J0ZmxhZyAtIGZsYWcgZm9yIHNvcnQgKGRlZmF1bHQ6IHRydWUpLiBBU04uMSBCRVIgaXMgbm90IHNvcnRlZCBpbiAnU0VUIE9GJy48L2xpPlxuICogPC91bD5cbiAqIE5PVEUxOiAncGFyYW1zJyBjYW4gYmUgb21pdHRlZC48YnIvPlxuICogTk9URTI6IHNvcnRmbGFnIGlzIHN1cHBvcnRlZCBzaW5jZSAxLjAuNS5cbiAqL1xuS0pVUi5hc24xLkRFUlNldCA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgIEtKVVIuYXNuMS5ERVJTZXQuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIHBhcmFtcyk7XG4gICAgdGhpcy5oVCA9IFwiMzFcIjtcbiAgICB0aGlzLnNvcnRGbGFnID0gdHJ1ZTsgLy8gaXRlbSBzaGFsbCBiZSBzb3J0ZWQgb25seSBpbiBBU04uMSBERVJcbiAgICB0aGlzLmdldEZyZXNoVmFsdWVIZXggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGEgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFzbjFBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGFzbjFPYmogPSB0aGlzLmFzbjFBcnJheVtpXTtcbiAgICAgICAgICAgIGEucHVzaChhc24xT2JqLmdldEVuY29kZWRIZXgoKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc29ydEZsYWcgPT0gdHJ1ZSkgYS5zb3J0KCk7XG4gICAgICAgIHRoaXMuaFYgPSBhLmpvaW4oJycpO1xuICAgICAgICByZXR1cm4gdGhpcy5oVjtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIHBhcmFtcy5zb3J0ZmxhZyAhPSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgICAgICBwYXJhbXMuc29ydGZsYWcgPT0gZmFsc2UpXG4gICAgICAgICAgICB0aGlzLnNvcnRGbGFnID0gZmFsc2U7XG4gICAgfVxufTtcbllBSE9PLmxhbmcuZXh0ZW5kKEtKVVIuYXNuMS5ERVJTZXQsIEtKVVIuYXNuMS5ERVJBYnN0cmFjdFN0cnVjdHVyZWQpO1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLyoqXG4gKiBjbGFzcyBmb3IgQVNOLjEgREVSIFRhZ2dlZE9iamVjdFxuICogQG5hbWUgS0pVUi5hc24xLkRFUlRhZ2dlZE9iamVjdFxuICogQGNsYXNzIGNsYXNzIGZvciBBU04uMSBERVIgVGFnZ2VkT2JqZWN0XG4gKiBAZXh0ZW5kcyBLSlVSLmFzbjEuQVNOMU9iamVjdFxuICogQGRlc2NyaXB0aW9uXG4gKiA8YnIvPlxuICogUGFyYW1ldGVyICd0YWdOb05leCcgaXMgQVNOLjEgdGFnKFQpIHZhbHVlIGZvciB0aGlzIG9iamVjdC5cbiAqIEZvciBleGFtcGxlLCBpZiB5b3UgZmluZCAnWzFdJyB0YWcgaW4gYSBBU04uMSBkdW1wLFxuICogJ3RhZ05vSGV4JyB3aWxsIGJlICdhMScuXG4gKiA8YnIvPlxuICogQXMgZm9yIG9wdGlvbmFsIGFyZ3VtZW50ICdwYXJhbXMnIGZvciBjb25zdHJ1Y3RvciwgeW91IGNhbiBzcGVjaWZ5ICpBTlkqIG9mXG4gKiBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqIDx1bD5cbiAqIDxsaT5leHBsaWNpdCAtIHNwZWNpZnkgdHJ1ZSBpZiB0aGlzIGlzIGV4cGxpY2l0IHRhZyBvdGhlcndpc2UgZmFsc2VcbiAqICAgICAoZGVmYXVsdCBpcyAndHJ1ZScpLjwvbGk+XG4gKiA8bGk+dGFnIC0gc3BlY2lmeSB0YWcgKGRlZmF1bHQgaXMgJ2EwJyB3aGljaCBtZWFucyBbMF0pPC9saT5cbiAqIDxsaT5vYmogLSBzcGVjaWZ5IEFTTjFPYmplY3Qgd2hpY2ggaXMgdGFnZ2VkPC9saT5cbiAqIDwvdWw+XG4gKiBAZXhhbXBsZVxuICogZDEgPSBuZXcgS0pVUi5hc24xLkRFUlVURjhTdHJpbmcoeydzdHInOidhJ30pO1xuICogZDIgPSBuZXcgS0pVUi5hc24xLkRFUlRhZ2dlZE9iamVjdCh7J29iaic6IGQxfSk7XG4gKiBoZXggPSBkMi5nZXRFbmNvZGVkSGV4KCk7XG4gKi9cbktKVVIuYXNuMS5ERVJUYWdnZWRPYmplY3QgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBLSlVSLmFzbjEuREVSVGFnZ2VkT2JqZWN0LnN1cGVyY2xhc3MuY29uc3RydWN0b3IuY2FsbCh0aGlzKTtcbiAgICB0aGlzLmhUID0gXCJhMFwiO1xuICAgIHRoaXMuaFYgPSAnJztcbiAgICB0aGlzLmlzRXhwbGljaXQgPSB0cnVlO1xuICAgIHRoaXMuYXNuMU9iamVjdCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBzZXQgdmFsdWUgYnkgYW4gQVNOMU9iamVjdFxuICAgICAqIEBuYW1lIHNldFN0cmluZ1xuICAgICAqIEBtZW1iZXJPZiBLSlVSLmFzbjEuREVSVGFnZ2VkT2JqZWN0I1xuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNFeHBsaWNpdEZsYWcgZmxhZyBmb3IgZXhwbGljaXQvaW1wbGljaXQgdGFnXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSB0YWdOb0hleCBoZXhhZGVjaW1hbCBzdHJpbmcgb2YgQVNOLjEgdGFnXG4gICAgICogQHBhcmFtIHtBU04xT2JqZWN0fSBhc24xT2JqZWN0IEFTTi4xIHRvIGVuY2Fwc3VsYXRlXG4gICAgICovXG4gICAgdGhpcy5zZXRBU04xT2JqZWN0ID0gZnVuY3Rpb24oaXNFeHBsaWNpdEZsYWcsIHRhZ05vSGV4LCBhc24xT2JqZWN0KSB7XG4gICAgICAgIHRoaXMuaFQgPSB0YWdOb0hleDtcbiAgICAgICAgdGhpcy5pc0V4cGxpY2l0ID0gaXNFeHBsaWNpdEZsYWc7XG4gICAgICAgIHRoaXMuYXNuMU9iamVjdCA9IGFzbjFPYmplY3Q7XG4gICAgICAgIGlmICh0aGlzLmlzRXhwbGljaXQpIHtcbiAgICAgICAgICAgIHRoaXMuaFYgPSB0aGlzLmFzbjFPYmplY3QuZ2V0RW5jb2RlZEhleCgpO1xuICAgICAgICAgICAgdGhpcy5oVExWID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuaXNNb2RpZmllZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmhWID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuaFRMViA9IGFzbjFPYmplY3QuZ2V0RW5jb2RlZEhleCgpO1xuICAgICAgICAgICAgdGhpcy5oVExWID0gdGhpcy5oVExWLnJlcGxhY2UoL14uLi8sIHRhZ05vSGV4KTtcbiAgICAgICAgICAgIHRoaXMuaXNNb2RpZmllZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0RnJlc2hWYWx1ZUhleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oVjtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIHBhcmFtc1sndGFnJ10gIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5oVCA9IHBhcmFtc1sndGFnJ107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBwYXJhbXNbJ2V4cGxpY2l0J10gIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5pc0V4cGxpY2l0ID0gcGFyYW1zWydleHBsaWNpdCddO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgcGFyYW1zWydvYmonXSAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLmFzbjFPYmplY3QgPSBwYXJhbXNbJ29iaiddO1xuICAgICAgICAgICAgdGhpcy5zZXRBU04xT2JqZWN0KHRoaXMuaXNFeHBsaWNpdCwgdGhpcy5oVCwgdGhpcy5hc24xT2JqZWN0KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5ZQUhPTy5sYW5nLmV4dGVuZChLSlVSLmFzbjEuREVSVGFnZ2VkT2JqZWN0LCBLSlVSLmFzbjEuQVNOMU9iamVjdCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvanNyc2FzaWduL2FzbjEtMS4wLmpzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiFcbkNvcHlyaWdodCAoYykgMjAxMSwgWWFob28hIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbkNvZGUgbGljZW5zZWQgdW5kZXIgdGhlIEJTRCBMaWNlbnNlOlxuaHR0cDovL2RldmVsb3Blci55YWhvby5jb20veXVpL2xpY2Vuc2UuaHRtbFxudmVyc2lvbjogMi45LjBcbiovXG5leHBvcnQgY29uc3QgWUFIT08gPSB7fTtcbllBSE9PLmxhbmcgPSB7XG4gICAgLyoqXG4gICAgICogVXRpbGl0eSB0byBzZXQgdXAgdGhlIHByb3RvdHlwZSwgY29uc3RydWN0b3IgYW5kIHN1cGVyY2xhc3MgcHJvcGVydGllcyB0b1xuICAgICAqIHN1cHBvcnQgYW4gaW5oZXJpdGFuY2Ugc3RyYXRlZ3kgdGhhdCBjYW4gY2hhaW4gY29uc3RydWN0b3JzIGFuZCBtZXRob2RzLlxuICAgICAqIFN0YXRpYyBtZW1iZXJzIHdpbGwgbm90IGJlIGluaGVyaXRlZC5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgZXh0ZW5kXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHN1YmMgICB0aGUgb2JqZWN0IHRvIG1vZGlmeVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHN1cGVyYyB0aGUgb2JqZWN0IHRvIGluaGVyaXRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3ZlcnJpZGVzICBhZGRpdGlvbmFsIHByb3BlcnRpZXMvbWV0aG9kcyB0byBhZGQgdG8gdGhlXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJjbGFzcyBwcm90b3R5cGUuICBUaGVzZSB3aWxsIG92ZXJyaWRlIHRoZVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hpbmcgaXRlbXMgb2J0YWluZWQgZnJvbSB0aGUgc3VwZXJjbGFzc1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgcHJlc2VudC5cbiAgICAgKi9cbiAgICBleHRlbmQ6IGZ1bmN0aW9uKHN1YmMsIHN1cGVyYywgb3ZlcnJpZGVzKSB7XG4gICAgICAgIGlmICghIHN1cGVyYyB8fCAhIHN1YmMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIllBSE9PLmxhbmcuZXh0ZW5kIGZhaWxlZCwgcGxlYXNlIGNoZWNrIHRoYXQgXCIgK1xuICAgICAgICAgICAgICAgIFwiYWxsIGRlcGVuZGVuY2llcyBhcmUgaW5jbHVkZWQuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIEYgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgICBGLnByb3RvdHlwZSA9IHN1cGVyYy5wcm90b3R5cGU7XG4gICAgICAgIHN1YmMucHJvdG90eXBlID0gbmV3IEYoKTtcbiAgICAgICAgc3ViYy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWJjO1xuICAgICAgICBzdWJjLnN1cGVyY2xhc3MgPSBzdXBlcmMucHJvdG90eXBlO1xuXG4gICAgICAgIGlmIChzdXBlcmMucHJvdG90eXBlLmNvbnN0cnVjdG9yID09IE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIHN1cGVyYy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdXBlcmM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3ZlcnJpZGVzKSB7XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIGZvciAoaSBpbiBvdmVycmlkZXMpIHtcbiAgICAgICAgICAgICAgICBzdWJjLnByb3RvdHlwZVtpXSA9IG92ZXJyaWRlc1tpXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIElFIHdpbGwgbm90IGVudW1lcmF0ZSBuYXRpdmUgZnVuY3Rpb25zIGluIGEgZGVyaXZlZCBvYmplY3QgZXZlbiBpZiB0aGVcbiAgICAgICAgICAgICAqIGZ1bmN0aW9uIHdhcyBvdmVycmlkZGVuLiAgVGhpcyBpcyBhIHdvcmthcm91bmQgZm9yIHNwZWNpZmljIGZ1bmN0aW9uc1xuICAgICAgICAgICAgICogd2UgY2FyZSBhYm91dCBvbiB0aGUgT2JqZWN0IHByb3RvdHlwZS5cbiAgICAgICAgICAgICAqIEBwcm9wZXJ0eSBfSUVFbnVtRml4XG4gICAgICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByICB0aGUgb2JqZWN0IHRvIHJlY2VpdmUgdGhlIGF1Z21lbnRhdGlvblxuICAgICAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcyAgdGhlIG9iamVjdCB0aGF0IHN1cHBsaWVzIHRoZSBwcm9wZXJ0aWVzIHRvIGF1Z21lbnRcbiAgICAgICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBfSUVFbnVtRml4ID0gZnVuY3Rpb24oKSB7fSxcbiAgICAgICAgICAgICAgICBBREQgPSBbXCJ0b1N0cmluZ1wiLCBcInZhbHVlT2ZcIl07XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmICgvTVNJRS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xuICAgICAgICAgICAgICAgICAgICBfSUVFbnVtRml4ID0gZnVuY3Rpb24ociwgcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IEFERC5sZW5ndGg7IGkgPSBpICsgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmbmFtZSA9IEFERFtpXSwgZiA9IHNbZm5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZiA9PT0gJ2Z1bmN0aW9uJyAmJiBmICE9IE9iamVjdC5wcm90b3R5cGVbZm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJbZm5hbWVdID0gZjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHt9O1xuICAgICAgICAgICAgX0lFRW51bUZpeChzdWJjLnByb3RvdHlwZSwgb3ZlcnJpZGVzKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvanNyc2FzaWduL3lhaG9vLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9