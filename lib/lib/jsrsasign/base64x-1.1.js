/* base64x-1.1.34 (c) 2012-2023 Kenji Urushima | kjur.github.io/jsrsasign/license
 */
/*
 * base64x.js - Base64url and supplementary functions for Tom Wu's base64.js library
 *
 * Copyright (c) 2012-2023 Kenji Urushima (kenji.urushima@gmail.com)
 *
 * This software is licensed under the terms of the MIT License.
 * https://kjur.github.io/jsrsasign/license
 *
 * The above copyright and license notice shall be
 * included in all copies or substantial portions of the Software.
 */

/**
 * @fileOverview
 * @name base64x-1.1.js
 * @author Kenji Urushima kenji.urushima@gmail.com
 * @version jsrsasign 10.9.0 base64x 1.1.34 (2023-Nov-27)
 * @since jsrsasign 2.1
 * @license <a href="https://kjur.github.io/jsrsasign/license/">MIT License</a>
 */

// ==== hex / oid =================================

/**
 * get hexadecimal value of object identifier from dot noted oid value
 * @name oidtohex
 * @function
 * @param {String} oidString dot noted string of object identifier
 * @return {String} hexadecimal value of object identifier
 * @since jsrsasign 10.1.0 base64x 1.1.18
 * @see hextooid
 * @see ASN1HEX.hextooidstr
 * @see KJUR.asn1.ASN1Util.oidIntToHex
 * @description
 * This static method converts from object identifier value string.
 * to hexadecimal string representation of it.
 * {@link hextooid} is a reverse function of this.
 * @example
 * oidtohex("2.5.4.6") &rarr; "550406"
 */
export function oidtohex(oidString) {
    var itox = function (i) {
        var h = i.toString(16);
        if (h.length == 1) h = "0" + h;
        return h;
    };

    var roidtox = function (roid) {
        var h = "";
        var bi = parseInt(roid, 10);
        var b = bi.toString(2);

        var padLen = 7 - (b.length % 7);
        if (padLen == 7) padLen = 0;
        var bPad = "";
        for (var i = 0; i < padLen; i++) bPad += "0";
        b = bPad + b;
        for (var i = 0; i < b.length - 1; i += 7) {
            var b8 = b.substr(i, 7);
            if (i != b.length - 7) b8 = "1" + b8;
            h += itox(parseInt(b8, 2));
        }
        return h;
    };

    try {
        if (!oidString.match(/^[0-9.]+$/)) return null;

        var h = "";
        var a = oidString.split(".");
        var i0 = parseInt(a[0], 10) * 40 + parseInt(a[1], 10);
        h += itox(i0);
        a.splice(0, 2);
        for (var i = 0; i < a.length; i++) {
            h += roidtox(a[i]);
        }
        return h;
    } catch (ex) {
        return null;
    }
}

// ==== int / hex =================================

/**
 * get hexadecimal string of minimum two's complement of BigInteger<br/>
 * @name twoscompl
 * @function
 * @param {BigInteger} bi BigInteger object
 * @return {string} hexadecimal string of two's complement of the integer
 * @since jsrsasign 10.9.0 base64x 1.1.34
 * @see inttohex
 *
 * @description
 * This static method converts from a BigInteger object to a minimum length
 * hexadecimal string of two's complement of the integer.
 * <br/>
 * NOTE: This function is a replacement of deprecated ASN1Util.bigIntToMinTwosComplementsHex method.
 *
 * @example
 * twoscompl(new BigInteger("1", 10)) &rarr; "01"
 * twoscompl(new BigInteger("-1", 10)) &rarr; "ff"
 */
export function twoscompl(bi) {
    var h = bi.toString(16);
    // positive
    if (h.substr(0, 1) != "-") {
        if (h.length % 2 == 1) {
            h = "0" + h;
        } else {
            if (!h.match(/^[0-7]/)) {
                h = "00" + h;
            }
        }
        return h;
    }
    // negative
    var hPos = h.substr(1);
    var xorLen = hPos.length;
    if (xorLen % 2 == 1) {
        xorLen += 1;
    } else {
        if (!h.match(/^[0-7]/)) {
            xorLen += 2;
        }
    }
    var hMask = "";
    for (var i = 0; i < xorLen; i++) {
        hMask += "f";
    }
    var biMask = new BigInteger(hMask, 16);
    var biNeg = biMask.xor(bi).add(BigInteger.ONE);
    h = biNeg.toString(16).replace(/^-/, "");
    return h;
}

// =======================================================
/**
 * set class inheritance<br/>
 * @name extendClass
 * @function
 * @param {Function} subClass sub class to set inheritance
 * @param {Function} superClass super class to inherit
 * @since jsrsasign 10.3.0 base64x 1.1.21
 *
 * @description
 * This function extends a class and set an inheritance
 * for member variables and methods.
 *
 * @example
 * var Animal = function() {
 *   this.hello = function(){console.log("Hello")};
 *   this.name="Ani";
 * };
 * var Dog = function() {
 *   Dog.superclass.constructor.call(this);
 *   this.vow = function(){console.log("Vow wow")};
 *   this.tail=true;
 * };
 * extendClass(Dog, Animal);
 */
export function extendClass(subClass, superClass) {
    var F = function () {};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    subClass.superclass = superClass.prototype;

    if (superClass.prototype.constructor == Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
}
