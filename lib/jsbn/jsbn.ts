// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Basic JavaScript BN library - subset useful for RSA encryption.

import {cbit, int2char, lbit, op_and, op_andnot, op_or, op_xor} from "./util";
// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);


//#region
const lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
const lplim = (1<<26)/lowprimes[lowprimes.length-1];
//#endregion

// (public) Constructor
export class BigInteger {
  constructor(a, b?, c?) {
    if (a != null)
      if ("number" == typeof a) this.fromNumber(a, b, c);
      else if (b == null && "string" != typeof a) this.fromString(a, 256);
      else this.fromString(a, b);
  }

  //#region PUBLIC

    // BigInteger.prototype.toString = bnToString;
    // (public) return string representation in given radix
    public toString(b) {
        if(this.s < 0) {
            return "-" + this.negate().toString(b);
        }
        var k;
        if(b == 16) k = 4;
        else if(b == 8) k = 3;
        else if(b == 2) k = 1;
        else if(b == 32) k = 5;
        else if(b == 4) k = 2;
        else return this.toRadix(b);
        var km = (1<<k)-1, d, m = false, r = "", i = this.t;
        var p = this.DB-(i*this.DB)%k;
        if(i-- > 0) {
            if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
            while(i >= 0) {
                if(p < k) {
                    d = (this[i]&((1<<p)-1))<<(k-p);
                    d |= this[--i]>>(p+=this.DB-k);
                }
                else {
                    d = (this[i]>>(p-=k))&km;
                    if(p <= 0) { p += this.DB; --i; }
                }
                if(d > 0) m = true;
                if(m) r += int2char(d);
            }
        }
        return m?r:"0";
    }


    // BigInteger.prototype.negate = bnNegate;
    // (public) -this
    protected negate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }


    // BigInteger.prototype.abs = bnAbs;
    // (public) |this|
    protected abs() { return (this.s<0)?this.negate():this; }


    // BigInteger.prototype.compareTo = bnCompareTo;
    // (public) return + if this > a, - if this < a, 0 if equal
    public compareTo(a) {
        var r = this.s-a.s;
        if(r != 0) return r;
        var i = this.t;
        r = i-a.t;
        if(r != 0) return (this.s<0)?-r:r;
        while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
        return 0;
    }


    // BigInteger.prototype.bitLength = bnBitLength;
    // (public) return the number of bits in "this"
    protected bitLength() {
        if(this.t <= 0) return 0;
        return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
    }


    // BigInteger.prototype.mod = bnMod;
    // (public) this mod a
    public mod(a) {
        var r = nbi();
        this.abs().divRemTo(a,null,r);
        if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
        return r;
    }


    // BigInteger.prototype.modPowInt = bnModPowInt;
    // (public) this^e % m, 0 <= e < 2^32
    protected modPowInt(e,m) {
        var z;
        if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
        return this.exp(e,z);
    }


    // BigInteger.prototype.clone = bnClone;
    // (public)
    protected clone() { var r = nbi(); this.copyTo(r); return r; }


    // BigInteger.prototype.intValue = bnIntValue;
    // (public) return value as integer
    protected intValue() {
        if(this.s < 0) {
            if(this.t == 1) return this[0]-this.DV;
            else if(this.t == 0) return -1;
        }
        else if(this.t == 1) return this[0];
        else if(this.t == 0) return 0;
        // assumes 16 < DB < 32
        return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
    }


    // BigInteger.prototype.byteValue = bnByteValue;
    // (public) return value as byte
    protected byteValue() { return (this.t==0)?this.s:(this[0]<<24)>>24; }


    // BigInteger.prototype.shortValue = bnShortValue;
    // (public) return value as short (assumes DB>=16)
    protected shortValue() { return (this.t==0)?this.s:(this[0]<<16)>>16; }


    // BigInteger.prototype.signum = bnSigNum;
    // (public) 0 if this == 0, 1 if this > 0
    protected signum() {
        if(this.s < 0) return -1;
        else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
        else return 1;
    }


    // BigInteger.prototype.toByteArray = bnToByteArray;
    // (public) convert to bigendian byte array
    protected toByteArray() {
        var i = this.t, r = new Array();
        r[0] = this.s;
        var p = this.DB-(i*this.DB)%8, d, k = 0;
        if(i-- > 0) {
            if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
                r[k++] = d|(this.s<<(this.DB-p));
            while(i >= 0) {
                if(p < 8) {
                    d = (this[i]&((1<<p)-1))<<(8-p);
                    d |= this[--i]>>(p+=this.DB-8);
                }
                else {
                    d = (this[i]>>(p-=8))&0xff;
                    if(p <= 0) { p += this.DB; --i; }
                }
                if((d&0x80) != 0) d |= -256;
                if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
                if(k > 0 || d != this.s) r[k++] = d;
            }
        }
        return r;
    }


    // BigInteger.prototype.equals = bnEquals;
    protected equals(a) { return(this.compareTo(a)==0); }


    // BigInteger.prototype.min = bnMin;
    protected min(a) { return(this.compareTo(a)<0)?this:a; }


    // BigInteger.prototype.max = bnMax;
    protected max(a) { return(this.compareTo(a)>0)?this:a; }


    // BigInteger.prototype.and = bnAnd;
    protected and(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }


    // BigInteger.prototype.or = bnOr;
    protected or(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }


    // BigInteger.prototype.xor = bnXor;
    protected xor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }


    // BigInteger.prototype.andNot = bnAndNot;
    protected andNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }



    // BigInteger.prototype.not = bnNot;
// (public) ~this
    protected not() {
        var r = nbi();
        for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
        r.t = this.t;
        r.s = ~this.s;
        return r;
    }


    // BigInteger.prototype.shiftLeft = bnShiftLeft;
    // (public) this << n
    protected shiftLeft(n) {
        var r = nbi();
        if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
        return r;
    }


    // BigInteger.prototype.shiftRight = bnShiftRight;
    // (public) this >> n
    protected shiftRight(n) {
        var r = nbi();
        if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
        return r;
    }


    // BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
    // (public) returns index of lowest 1-bit (or -1 if none)
    protected getLowestSetBit() {
        for(var i = 0; i < this.t; ++i)
            if(this[i] != 0) return i*this.DB+lbit(this[i]);
        if(this.s < 0) return this.t*this.DB;
        return -1;
    }


    // BigInteger.prototype.bitCount = bnBitCount;
    // (public) return number of set bits
    protected bitCount() {
        var r = 0, x = this.s&this.DM;
        for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
        return r;
    }


    // BigInteger.prototype.testBit = bnTestBit;
    // (public) true iff nth bit is set
    protected testBit(n) {
        var j = Math.floor(n/this.DB);
        if(j >= this.t) return(this.s!=0);
        return((this[j]&(1<<(n%this.DB)))!=0);
    }


    // BigInteger.prototype.setBit = bnSetBit;
    // (public) this | (1<<n)
    protected setBit(n) { return this.changeBit(n,op_or); }


    // BigInteger.prototype.clearBit = bnClearBit;
    // (public) this & ~(1<<n)
    protected clearBit(n) { return this.changeBit(n,op_andnot); }


    // BigInteger.prototype.flipBit = bnFlipBit;
    // (public) this ^ (1<<n)
    protected flipBit(n) { return this.changeBit(n,op_xor); }


    // BigInteger.prototype.add = bnAdd;
    // (public) this + a
    protected add(a) { var r = nbi(); this.addTo(a,r); return r; }


    // BigInteger.prototype.subtract = bnSubtract;
    // (public) this - a
    protected subtract(a) { var r = nbi(); this.subTo(a,r); return r; }


    // BigInteger.prototype.multiply = bnMultiply;
    // (public) this * a
    protected multiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }


    // BigInteger.prototype.divide = bnDivide;
    // (public) this / a
    public divide(a):BigInteger { var r = nbi(); this.divRemTo(a,r,null); return r; }


    // BigInteger.prototype.remainder = bnRemainder;
    // (public) this % a
    protected remainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }


    // BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
    // (public) [this/a,this%a]
    protected divideAndRemainder(a) {
        var q = nbi(), r = nbi();
        this.divRemTo(a,q,r);
        return new Array(q,r);
    }


    // BigInteger.prototype.modPow = bnModPow;
    // (public) this^e % m (HAC 14.85)
    protected modPow(e,m) {
        var i = e.bitLength(), k, r = nbv(1), z;
        if(i <= 0) return r;
        else if(i < 18) k = 1;
        else if(i < 48) k = 3;
        else if(i < 144) k = 4;
        else if(i < 768) k = 5;
        else k = 6;
        if(i < 8)
            z = new Classic(m);
        else if(m.isEven())
            z = new Barrett(m);
        else
            z = new Montgomery(m);

        // precomputation
        var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
        g[1] = z.convert(this);
        if(k > 1) {
            var g2 = nbi();
            z.sqrTo(g[1],g2);
            while(n <= km) {
                g[n] = nbi();
                z.mulTo(g2,g[n-2],g[n]);
                n += 2;
            }
        }

        var j = e.t-1, w, is1 = true, r2 = nbi(), t;
        i = nbits(e[j])-1;
        while(j >= 0) {
            if(i >= k1) w = (e[j]>>(i-k1))&km;
            else {
                w = (e[j]&((1<<(i+1))-1))<<(k1-i);
                if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
            }

            n = k;
            while((w&1) == 0) { w >>= 1; --n; }
            if((i -= n) < 0) { i += this.DB; --j; }
            if(is1) {	// ret == 1, don't bother squaring or multiplying it
                g[w].copyTo(r);
                is1 = false;
            }
            else {
                while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
                if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
                z.mulTo(r2,g[w],r);
            }

            while(j >= 0 && (e[j]&(1<<i)) == 0) {
                z.sqrTo(r,r2); t = r; r = r2; r2 = t;
                if(--i < 0) { i = this.DB-1; --j; }
            }
        }
        return z.revert(r);
    }


    // BigInteger.prototype.modInverse = bnModInverse;
    // (public) 1/this % m (HAC 14.61)
    protected modInverse(m) {
        var ac = m.isEven();
        if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
        var u = m.clone(), v = this.clone();
        var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
        while(u.signum() != 0) {
            while(u.isEven()) {
                u.rShiftTo(1,u);
                if(ac) {
                    if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
                    a.rShiftTo(1,a);
                }
                else if(!b.isEven()) b.subTo(m,b);
                b.rShiftTo(1,b);
            }
            while(v.isEven()) {
                v.rShiftTo(1,v);
                if(ac) {
                    if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
                    c.rShiftTo(1,c);
                }
                else if(!d.isEven()) d.subTo(m,d);
                d.rShiftTo(1,d);
            }
            if(u.compareTo(v) >= 0) {
                u.subTo(v,u);
                if(ac) a.subTo(c,a);
                b.subTo(d,b);
            }
            else {
                v.subTo(u,v);
                if(ac) c.subTo(a,c);
                d.subTo(b,d);
            }
        }
        if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
        if(d.compareTo(m) >= 0) return d.subtract(m);
        if(d.signum() < 0) d.addTo(m,d); else return d;
        if(d.signum() < 0) return d.add(m); else return d;
    }


    // BigInteger.prototype.pow = bnPow;
    // (public) this^e
    protected pow(e) { return this.exp(e,new NullExp()); }


    // BigInteger.prototype.gcd = bnGCD;
    // (public) gcd(this,a) (HAC 14.54)
    protected gcd(a) {
        var x = (this.s<0)?this.negate():this.clone();
        var y = (a.s<0)?a.negate():a.clone();
        if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
        var i = x.getLowestSetBit(), g = y.getLowestSetBit();
        if(g < 0) return x;
        if(i < g) g = i;
        if(g > 0) {
            x.rShiftTo(g,x);
            y.rShiftTo(g,y);
        }
        while(x.signum() > 0) {
            if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
            if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
            if(x.compareTo(y) >= 0) {
                x.subTo(y,x);
                x.rShiftTo(1,x);
            }
            else {
                y.subTo(x,y);
                y.rShiftTo(1,y);
            }
        }
        if(g > 0) y.lShiftTo(g,y);
        return y;
    }


    // BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
    // (public) test primality with certainty >= 1-.5^t
    protected isProbablePrime(t) {
        var i, x = this.abs();
        if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
            for(i = 0; i < lowprimes.length; ++i)
                if(x[0] == lowprimes[i]) return true;
            return false;
        }
        if(x.isEven()) return false;
        i = 1;
        while(i < lowprimes.length) {
            var m = lowprimes[i], j = i+1;
            while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
            m = x.modInt(m);
            while(i < j) if(m%lowprimes[i++] == 0) return false;
        }
        return x.millerRabin(t);
    }



  //#endregion PUBLIC

  //#region PROTECTED

    // BigInteger.prototype.copyTo = bnpCopyTo;
    // (protected) copy this to r
    protected copyTo(r) {
        for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
        r.t = this.t;
        r.s = this.s;
    }


    // BigInteger.prototype.fromInt = bnpFromInt;
    // (protected) set from integer value x, -DV <= x < DV
    public fromInt(x) {
        this.t = 1;
        this.s = (x<0)?-1:0;
        if(x > 0) this[0] = x;
        else if(x < -1) this[0] = x+this.DV;
        else this.t = 0;
    }


    // BigInteger.prototype.fromString = bnpFromString;
    // (protected) set from string and radix
    protected fromString(s,b) {
        var k;
        if(b == 16) k = 4;
        else if(b == 8) k = 3;
        else if(b == 256) k = 8; // byte array
        else if(b == 2) k = 1;
        else if(b == 32) k = 5;
        else if(b == 4) k = 2;
        else { this.fromRadix(s,b); return; }
        this.t = 0;
        this.s = 0;
        var i = s.length, mi = false, sh = 0;
        while(--i >= 0) {
            var x = (k==8)?s[i]&0xff:intAt(s,i);
            if(x < 0) {
                if(s.charAt(i) == "-") mi = true;
                continue;
            }
            mi = false;
            if(sh == 0)
                this[this.t++] = x;
            else if(sh+k > this.DB) {
                this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
                this[this.t++] = (x>>(this.DB-sh));
            }
            else
                this[this.t-1] |= x<<sh;
            sh += k;
            if(sh >= this.DB) sh -= this.DB;
        }
        if(k == 8 && (s[0]&0x80) != 0) {
            this.s = -1;
            if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
        }
        this.clamp();
        if(mi) BigInteger.ZERO.subTo(this,this);
    }


    // BigInteger.prototype.clamp = bnpClamp;
    // (protected) clamp off excess high words
    protected clamp() {
        var c = this.s&this.DM;
        while(this.t > 0 && this[this.t-1] == c) --this.t;
    }


    // BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
    // (protected) r = this << n*DB
    public dlShiftTo(n,r) {
        var i;
        for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
        for(i = n-1; i >= 0; --i) r[i] = 0;
        r.t = this.t+n;
        r.s = this.s;
    }


    // BigInteger.prototype.drShiftTo = bnpDRShiftTo;
    // (protected) r = this >> n*DB
    protected drShiftTo(n,r) {
        for(var i = n; i < this.t; ++i) r[i-n] = this[i];
        r.t = Math.max(this.t-n,0);
        r.s = this.s;
    }


    // BigInteger.prototype.lShiftTo = bnpLShiftTo;
    // (protected) r = this << n
    protected lShiftTo(n,r) {
        var bs = n%this.DB;
        var cbs = this.DB-bs;
        var bm = (1<<cbs)-1;
        var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
        for(i = this.t-1; i >= 0; --i) {
            r[i+ds+1] = (this[i]>>cbs)|c;
            c = (this[i]&bm)<<bs;
        }
        for(i = ds-1; i >= 0; --i) r[i] = 0;
        r[ds] = c;
        r.t = this.t+ds+1;
        r.s = this.s;
        r.clamp();
    }


    // BigInteger.prototype.rShiftTo = bnpRShiftTo;
    // (protected) r = this >> n
    protected rShiftTo(n,r) {
        r.s = this.s;
        var ds = Math.floor(n/this.DB);
        if(ds >= this.t) { r.t = 0; return; }
        var bs = n%this.DB;
        var cbs = this.DB-bs;
        var bm = (1<<bs)-1;
        r[0] = this[ds]>>bs;
        for(var i = ds+1; i < this.t; ++i) {
            r[i-ds-1] |= (this[i]&bm)<<cbs;
            r[i-ds] = this[i]>>bs;
        }
        if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
        r.t = this.t-ds;
        r.clamp();
    }


    // BigInteger.prototype.subTo = bnpSubTo;
    // (protected) r = this - a
    public subTo(a,r) {
        var i = 0, c = 0, m = Math.min(a.t,this.t);
        while(i < m) {
            c += this[i]-a[i];
            r[i++] = c&this.DM;
            c >>= this.DB;
        }
        if(a.t < this.t) {
            c -= a.s;
            while(i < this.t) {
                c += this[i];
                r[i++] = c&this.DM;
                c >>= this.DB;
            }
            c += this.s;
        }
        else {
            c += this.s;
            while(i < a.t) {
                c -= a[i];
                r[i++] = c&this.DM;
                c >>= this.DB;
            }
            c -= a.s;
        }
        r.s = (c<0)?-1:0;
        if(c < -1) r[i++] = this.DV+c;
        else if(c > 0) r[i++] = c;
        r.t = i;
        r.clamp();
    }


    // BigInteger.prototype.multiplyTo = bnpMultiplyTo;
    // (protected) r = this * a, r != this,a (HAC 14.12)
    // "this" should be the larger one if appropriate.
    public multiplyTo(a,r) {
        var x = this.abs(), y = a.abs();
        var i = x.t;
        r.t = i+y.t;
        while(--i >= 0) r[i] = 0;
        for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
        r.s = 0;
        r.clamp();
        if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
    }


    // BigInteger.prototype.squareTo = bnpSquareTo;
    // (protected) r = this^2, r != this (HAC 14.16)
    public squareTo(r) {
        var x = this.abs();
        var i = r.t = 2*x.t;
        while(--i >= 0) r[i] = 0;
        for(i = 0; i < x.t-1; ++i) {
            var c = x.am(i,x[i],r,2*i,0,1);
            if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
                r[i+x.t] -= x.DV;
                r[i+x.t+1] = 1;
            }
        }
        if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
        r.s = 0;
        r.clamp();
    }


    // BigInteger.prototype.divRemTo = bnpDivRemTo;
    // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
    // r != q, this != m.  q or r may be null.
    public divRemTo(m,q,r) {
        var pm = m.abs();
        if(pm.t <= 0) return;
        var pt = this.abs();
        if(pt.t < pm.t) {
            if(q != null) q.fromInt(0);
            if(r != null) this.copyTo(r);
            return;
        }
        if(r == null) r = nbi();
        var y = nbi(), ts = this.s, ms = m.s;
        var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
        if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
        else { pm.copyTo(y); pt.copyTo(r); }
        var ys = y.t;
        var y0 = y[ys-1];
        if(y0 == 0) return;
        var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
        var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
        var i = r.t, j = i-ys, t = (q==null)?nbi():q;
        y.dlShiftTo(j,t);
        if(r.compareTo(t) >= 0) {
            r[r.t++] = 1;
            r.subTo(t,r);
        }
        BigInteger.ONE.dlShiftTo(ys,t);
        t.subTo(y,y);	// "negative" y so we can replace sub with am later
        while(y.t < ys) y[y.t++] = 0;
        while(--j >= 0) {
            // Estimate quotient digit
            var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
            if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
                y.dlShiftTo(j,t);
                r.subTo(t,r);
                while(r[i] < --qd) r.subTo(t,r);
            }
        }
        if(q != null) {
            r.drShiftTo(ys,q);
            if(ts != ms) BigInteger.ZERO.subTo(q,q);
        }
        r.t = ys;
        r.clamp();
        if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
        if(ts < 0) BigInteger.ZERO.subTo(r,r);
    }


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
    public invDigit():number {
        if(this.t < 1) return 0;
        var x = this[0];
        if((x&1) == 0) return 0;
        var y = x&3;		// y == 1/x mod 2^2
        y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
        y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
        y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
        // last step - calculate inverse mod DV directly;
        // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
        y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
        // we really want the negative inverse, and -DV < y < DV
        return (y>0)?this.DV-y:-y;
    }


    // BigInteger.prototype.isEven = bnpIsEven;
    // (protected) true iff this is even
    protected isEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }


    // BigInteger.prototype.exp = bnpExp;
    // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
    protected exp(e,z) {
        if(e > 0xffffffff || e < 1) return BigInteger.ONE;
        var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
        g.copyTo(r);
        while(--i >= 0) {
            z.sqrTo(r,r2);
            if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
            else { var t = r; r = r2; r2 = t; }
        }
        return z.revert(r);
    }


    // BigInteger.prototype.chunkSize = bnpChunkSize;
    // (protected) return x s.t. r^x < DV
    protected chunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }


    // BigInteger.prototype.toRadix = bnpToRadix;
    // (protected) convert to radix string
    protected toRadix(b) {
        if(b == null) b = 10;
        if(this.signum() == 0 || b < 2 || b > 36) return "0";
        var cs = this.chunkSize(b);
        var a = Math.pow(b,cs);
        var d = nbv(a), y = nbi(), z = nbi(), r = "";
        this.divRemTo(d,y,z);
        while(y.signum() > 0) {
            r = (a+z.intValue()).toString(b).substr(1) + r;
            y.divRemTo(d,y,z);
        }
        return z.intValue().toString(b) + r;
    }


    // BigInteger.prototype.fromRadix = bnpFromRadix;
    // (protected) convert from radix string
    public fromRadix(s,b) {
        this.fromInt(0);
        if(b == null) b = 10;
        var cs = this.chunkSize(b);
        var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
        for(var i = 0; i < s.length; ++i) {
            var x = intAt(s,i);
            if(x < 0) {
                if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
                continue;
            }
            w = b*w+x;
            if(++j >= cs) {
                this.dMultiply(d);
                this.dAddOffset(w,0);
                j = 0;
                w = 0;
            }
        }
        if(j > 0) {
            this.dMultiply(Math.pow(b,j));
            this.dAddOffset(w,0);
        }
        if(mi) BigInteger.ZERO.subTo(this,this);
    }


    // BigInteger.prototype.fromNumber = bnpFromNumber;
    // (protected) alternate constructor
    protected fromNumber(a,b,c?) {
        if("number" == typeof b) {
            // new BigInteger(int,int,RNG)
            if(a < 2) this.fromInt(1);
            else {
                this.fromNumber(a,c);
                if(!this.testBit(a-1))	// force MSB set
                    this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
                if(this.isEven()) this.dAddOffset(1,0); // force odd
                while(!this.isProbablePrime(b)) {
                    this.dAddOffset(2,0);
                    if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
                }
            }
        }
        else {
            // new BigInteger(int,RNG)
            var x = new Array(), t = a&7;
            x.length = (a>>3)+1;
            b.nextBytes(x);
            if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
            this.fromString(x,256);
        }
    }


    // BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
    // (protected) r = this op a (bitwise)
    protected bitwiseTo(a,op,r) {
        var i, f, m = Math.min(a.t,this.t);
        for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
        if(a.t < this.t) {
            f = a.s&this.DM;
            for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
            r.t = this.t;
        }
        else {
            f = this.s&this.DM;
            for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
            r.t = a.t;
        }
        r.s = op(this.s,a.s);
        r.clamp();
    }


    // BigInteger.prototype.changeBit = bnpChangeBit;
    // (protected) this op (1<<n)
    protected changeBit(n,op) {
        var r = BigInteger.ONE.shiftLeft(n);
        this.bitwiseTo(r,op,r);
        return r;
    }


    // BigInteger.prototype.addTo = bnpAddTo;
    // (protected) r = this + a
    protected addTo(a,r) {
        var i = 0, c = 0, m = Math.min(a.t,this.t);
        while(i < m) {
            c += this[i]+a[i];
            r[i++] = c&this.DM;
            c >>= this.DB;
        }
        if(a.t < this.t) {
            c += a.s;
            while(i < this.t) {
                c += this[i];
                r[i++] = c&this.DM;
                c >>= this.DB;
            }
            c += this.s;
        }
        else {
            c += this.s;
            while(i < a.t) {
                c += a[i];
                r[i++] = c&this.DM;
                c >>= this.DB;
            }
            c += a.s;
        }
        r.s = (c<0)?-1:0;
        if(c > 0) r[i++] = c;
        else if(c < -1) r[i++] = this.DV+c;
        r.t = i;
        r.clamp();
    }


    // BigInteger.prototype.dMultiply = bnpDMultiply;
    // (protected) this *= n, this >= 0, 1 < n < DV
    protected dMultiply(n) {
        this[this.t] = this.am(0,n-1,this,0,0,this.t);
        ++this.t;
        this.clamp();
    }


    // BigInteger.prototype.dAddOffset = bnpDAddOffset;
    // (protected) this += n << w words, this >= 0
    protected dAddOffset(n,w) {
        if(n == 0) return;
        while(this.t <= w) this[this.t++] = 0;
        this[w] += n;
        while(this[w] >= this.DV) {
            this[w] -= this.DV;
            if(++w >= this.t) this[this.t++] = 0;
            ++this[w];
        }
    }


    // BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
    // (protected) r = lower n words of "this * a", a.t <= n
    // "this" should be the larger one if appropriate.
    public multiplyLowerTo(a,n,r) {
        var i = Math.min(this.t+a.t,n);
        r.s = 0; // assumes a,this >= 0
        r.t = i;
        while(i > 0) r[--i] = 0;
        var j;
        for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
        for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
        r.clamp();
    }


    // BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
    // (protected) r = "this * a" without lower n words, n > 0
    // "this" should be the larger one if appropriate.
    public multiplyUpperTo(a,n,r) {
        --n;
        var i = r.t = this.t+a.t-n;
        r.s = 0; // assumes a,this >= 0
        while(--i >= 0) r[i] = 0;
        for(i = Math.max(n-this.t,0); i < a.t; ++i)
            r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
        r.clamp();
        r.drShiftTo(1,r);
    }


    // BigInteger.prototype.modInt = bnpModInt;
    // (protected) this % n, n < 2^26
    protected modInt(n) {
        if(n <= 0) return 0;
        var d = this.DV%n, r = (this.s<0)?n-1:0;
        if(this.t > 0)
            if(d == 0) r = this[0]%n;
            else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
        return r;
    }


    // BigInteger.prototype.millerRabin = bnpMillerRabin;
    // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
    protected millerRabin(t) {
        var n1 = this.subtract(BigInteger.ONE);
        var k = n1.getLowestSetBit();
        if(k <= 0) return false;
        var r = n1.shiftRight(k);
        t = (t+1)>>1;
        if(t > lowprimes.length) t = lowprimes.length;
        var a = nbi();
        for(var i = 0; i < t; ++i) {
            //Pick bases at random, instead of starting at 2
            a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
            var y = a.modPow(r,this);
            if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
                var j = 1;
                while(j++ < k && y.compareTo(n1) != 0) {
                    y = y.modPowInt(2,this);
                    if(y.compareTo(BigInteger.ONE) == 0) return false;
                }
                if(y.compareTo(n1) != 0) return false;
            }
        }
        return true;
    }

    //BigInteger.prototype.square = bnSquare;
    // (public) this^2
    protected square() { var r = nbi(); this.squareTo(r); return r; }


  //#endregion PROTECTED

    //#region FIELDS

    public s:number;
    public t:number;


    public DB:number;
    public DM:number;
    public DV:number;

    public FV:number;
    public F1:number;
    public F2:number;

    public am:(i,x,w,j,c,n) => number;

    [index:number]:number;

    public static ONE:BigInteger;
    public static ZERO:BigInteger;

    //#endregion FIELDS
}

//#region REDUCERS

//#region NullExp

class NullExp {
    constructor() {

    }
    // NullExp.prototype.convert = nNop;
    public convert(x:BigInteger) { return x; }


    // NullExp.prototype.revert = nNop;
    public revert(x:BigInteger) { return x; }


    // NullExp.prototype.mulTo = nMulTo;
    public mulTo(x:BigInteger,y:BigInteger,r:BigInteger) { x.multiplyTo(y,r); }


    // NullExp.prototype.sqrTo = nSqrTo;
    public nSqrTo(x:BigInteger,r:BigInteger) { x.squareTo(r); }
}

//#endregion NullExp

//#region Classic

interface IReduction {
    convert(x:BigInteger):BigInteger;

    revert(x:BigInteger):BigInteger;

    reduce(x:BigInteger):void;

    mulTo(x:BigInteger, y:BigInteger, r:BigInteger):void;

    sqrTo(x:BigInteger, r:BigInteger):void;
}

// Modular reduction using "classic" algorithm
export class Classic implements IReduction {
    constructor(protected m:BigInteger) {
    }

    // Classic.prototype.convert = cConvert;
    public convert(x:BigInteger) {
        if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
        else return x;
    }


    // Classic.prototype.revert = cRevert;
    public revert(x:BigInteger) {
        return x;
    }


    // Classic.prototype.reduce = cReduce;
    public reduce(x:BigInteger) {
        x.divRemTo(this.m, null, x);
    }


    // Classic.prototype.mulTo = cMulTo;
    public mulTo(x:BigInteger, y:BigInteger, r:BigInteger) {
        x.multiplyTo(y, r);
        this.reduce(r);
    }


    // Classic.prototype.sqrTo = cSqrTo;
    public sqrTo(x:BigInteger, r:BigInteger) {
        x.squareTo(r);
        this.reduce(r);
    }
}

//#endregion

//#region Montgomery

// Montgomery reduction
export class Montgomery implements IReduction {
    constructor(protected m:BigInteger) {
        this.mp = m.invDigit();
        this.mpl = this.mp & 0x7fff;
        this.mph = this.mp >> 15;
        this.um = (1 << (m.DB - 15)) - 1;
        this.mt2 = 2 * m.t;
    }

    protected mp:number;
    protected mpl:number;
    protected mph:number;
    protected um:number;
    protected mt2:number;

    // Montgomery.prototype.convert = montConvert;
    // xR mod m
    public convert(x) {
        var r = nbi();
        x.abs().dlShiftTo(this.m.t,r);
        r.divRemTo(this.m,null,r);
        if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
        return r;
    }

    // Montgomery.prototype.revert = montRevert;
    // x/R mod m
    public revert(x) {
        var r = nbi();
        x.copyTo(r);
        this.reduce(r);
        return r;
    }

    // Montgomery.prototype.reduce = montReduce;
    // x = x/R mod m (HAC 14.32)
    public reduce(x) {
        while(x.t <= this.mt2)	// pad x so am has enough room later
            x[x.t++] = 0;
        for(var i = 0; i < this.m.t; ++i) {
            // faster way of calculating u0 = x[i]*mp mod DV
            var j = x[i]&0x7fff;
            var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
            // use am to combine the multiply-shift-add into one call
            j = i+this.m.t;
            x[j] += this.m.am(0,u0,x,i,0,this.m.t);
            // propagate carry
            while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
        }
        x.clamp();
        x.drShiftTo(this.m.t,x);
        if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
    }


    // Montgomery.prototype.mulTo = montMulTo;
    // r = "xy/R mod m"; x,y != r
    public mulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }


    // Montgomery.prototype.sqrTo = montSqrTo;
    // r = "x^2/R mod m"; x != r
    public sqrTo(x,r) { x.squareTo(r); this.reduce(r); }

}













//#endregion Montgomery


//#region Barrett

// Barrett modular reduction
class Barrett implements IReduction {
    constructor(protected m:BigInteger) {
        // setup Barrett
        this.r2 = nbi();
        this.q3 = nbi();
        BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
        this.mu = this.r2.divide(m);
    }

    protected r2:BigInteger;
    protected q3:BigInteger;
    protected mu:BigInteger;

    // Barrett.prototype.convert = barrettConvert;
    public convert(x) {
        if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
        else if(x.compareTo(this.m) < 0) return x;
        else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
    }

    // Barrett.prototype.revert = barrettRevert;
    public revert(x) { return x; }

    // Barrett.prototype.reduce = barrettReduce;
    // x = x mod m (HAC 14.42)
    public reduce(x) {
        x.drShiftTo(this.m.t-1,this.r2);
        if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
        this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
        this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
        while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
        x.subTo(this.r2,x);
        while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
    }


    // Barrett.prototype.mulTo = barrettMulTo;
    // r = x*y mod m; x,y != r
    public mulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }


    // Barrett.prototype.sqrTo = barrettSqrTo;
    // r = x^2 mod m; x != r
    public sqrTo(x,r) { x.squareTo(r); this.reduce(r); }
}













//#endregion

//#endregion REDUCERS

// return new, unset BigInteger
export function nbi() { return new BigInteger(null); }

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i,x,w,j,c,n) {
  while(--n >= 0) {
    var v = x*this[i++]+w[j]+c;
    c = Math.floor(v/0x4000000);
    w[j++] = v&0x3ffffff;
  }
  return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i,x,w,j,c,n) {
  var xl = x&0x7fff, xh = x>>15;
  while(--n >= 0) {
    var l = this[i]&0x7fff;
    var h = this[i++]>>15;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
    c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
    w[j++] = l&0x3fffffff;
  }
  return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i,x,w,j,c,n) {
  var xl = x&0x3fff, xh = x>>14;
  while(--n >= 0) {
    var l = this[i]&0x3fff;
    var h = this[i++]>>14;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x3fff)<<14)+w[j]+c;
    c = (l>>28)+(m>>14)+xh*h;
    w[j++] = l&0xfffffff;
  }
  return c;
}
if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
  BigInteger.prototype.am = am2;
  dbits = 30;
}
else if(j_lm && (navigator.appName != "Netscape")) {
  BigInteger.prototype.am = am1;
  dbits = 26;
}
else { // Mozilla/Netscape seems to prefer am3
  BigInteger.prototype.am = am3;
  dbits = 28;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;

// Digit conversions
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;


export function intAt(s,i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c==null)?-1:c;
}





// return bigint initialized to value
export function nbv(i) { var r = nbi(); r.fromInt(i); return r; }













// returns bit length of the integer x
export function nbits(x) {
  var r = 1, t;
  if((t=x>>>16) != 0) { x = t; r += 16; }
  if((t=x>>8) != 0) { x = t; r += 8; }
  if((t=x>>4) != 0) { x = t; r += 4; }
  if((t=x>>2) != 0) { x = t; r += 2; }
  if((t=x>>1) != 0) { x = t; r += 1; }
  return r;
}

































// protected


// public


// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);
