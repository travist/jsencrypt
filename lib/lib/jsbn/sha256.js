/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2 Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 * Also http://anmar.eu.org/projects/jssha2/
 */
// /*
//  * Configurable variables. You may need to tweak these to be compatible with
//  * the server-side, but the defaults work in most cases.
//  */
// var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
// var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */
// /*
//  * These are the functions you'll usually want to call
//  * They take string arguments and return either hex or base-64 encoded strings
//  */
// function hex_sha256(s: string) {
//     return rstr2hex(rstr_sha256(str2rstr_utf8(s)));
// }
// function b64_sha256(s: string) {
//     return rstr2b64(rstr_sha256(str2rstr_utf8(s)));
// }
// function any_sha256(s: string, e: any) {
//     return rstr2any(rstr_sha256(str2rstr_utf8(s)), e);
// }
// function hex_hmac_sha256(k: string, d: any) {
//     return rstr2hex(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)));
// }
// function b64_hmac_sha256(k: string, d: any) {
//     return rstr2b64(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)));
// }
// function any_hmac_sha256(k: string, d: string, e: any) {
//     return rstr2any(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)), e);
// }
// /*
//  * Perform a simple self-test to see if the VM is working
//  */
// function sha256_vm_test() {
//     return (
//         hex_sha256("abc").toLowerCase() ==
//         "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
//     );
// }
/*
 * Calculate the sha256 of a raw string
 */
export function rstr_sha256(s) {
    return binb2rstr(binb_sha256(rstr2binb(s), s.length * 8));
}
// /*
//  * Calculate the HMAC-sha256 of a key and some data (raw strings)
//  */
// function rstr_hmac_sha256(key: string, data: any) {
//     var bkey = rstr2binb(key);
//     if (bkey.length > 16) bkey = binb_sha256(bkey, key.length * 8);
//     var ipad = Array(16),
//         opad = Array(16);
//     for (var i = 0; i < 16; i++) {
//         ipad[i] = bkey[i] ^ 0x36363636;
//         opad[i] = bkey[i] ^ 0x5c5c5c5c;
//     }
//     var hash = binb_sha256(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
//     return binb2rstr(binb_sha256(opad.concat(hash), 512 + 256));
// }
// /*
//  * Convert a raw string to a hex string
//  */
export function rstr2hex(input) {
    var hex_tab = "0123456789abcdef";
    var output = "";
    for (var i = 0; i < input.length; i++) {
        var x = input.charCodeAt(i);
        output += hex_tab.charAt((x >>> 4) & 0x0f) + hex_tab.charAt(x & 0x0f);
    }
    return output;
}
// /*
//  * Convert a raw string to a base-64 string
//  */
// function rstr2b64(input: string) {
//     try {
//         b64pad;
//     } catch (e) {
//         b64pad = "";
//     }
//     var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
//     var output = "";
//     var len = input.length;
//     for (var i = 0; i < len; i += 3) {
//         var triplet =
//             (input.charCodeAt(i) << 16) |
//             (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) |
//             (i + 2 < len ? input.charCodeAt(i + 2) : 0);
//         for (var j = 0; j < 4; j++) {
//             if (i * 8 + j * 6 > input.length * 8) output += b64pad;
//             else output += tab.charAt((triplet >>> (6 * (3 - j))) & 0x3f);
//         }
//     }
//     return output;
// }
// /*
//  * Convert a raw string to an arbitrary string encoding
//  */
// function rstr2any(input: string, encoding: string) {
//     var divisor = encoding.length;
//     var remainders = Array();
//     var i, q, x, quotient;
//     /* Convert to an array of 16-bit big-endian values, forming the dividend */
//     var dividend = Array(Math.ceil(input.length / 2));
//     for (i = 0; i < dividend.length; i++) {
//         dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
//     }
//     /*
//      * Repeatedly perform a long division. The binary array forms the dividend,
//      * the length of the encoding is the divisor. Once computed, the quotient
//      * forms the dividend for the next step. We stop when the dividend is zero.
//      * All remainders are stored for later use.
//      */
//     while (dividend.length > 0) {
//         quotient = Array();
//         x = 0;
//         for (i = 0; i < dividend.length; i++) {
//             x = (x << 16) + dividend[i];
//             q = Math.floor(x / divisor);
//             x -= q * divisor;
//             if (quotient.length > 0 || q > 0) quotient[quotient.length] = q;
//         }
//         remainders[remainders.length] = x;
//         dividend = quotient;
//     }
//     /* Convert the remainders to the output string */
//     var output = "";
//     for (i = remainders.length - 1; i >= 0; i--) output += encoding.charAt(remainders[i]);
//     /* Append leading zero equivalents */
//     var full_length = Math.ceil(
//         (input.length * 8) / (Math.log(encoding.length) / Math.log(2)),
//     );
//     for (i = output.length; i < full_length; i++) output = encoding[0] + output;
//     return output;
// }
// /*
//  * Encode a string as utf-8.
//  * For efficiency, this assumes the input is valid utf-16.
//  */
// function str2rstr_utf8(input: string) {
//     var output = "";
//     var i = -1;
//     var x, y;
//     while (++i < input.length) {
//         /* Decode utf-16 surrogate pairs */
//         x = input.charCodeAt(i);
//         y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
//         if (0xd800 <= x && x <= 0xdbff && 0xdc00 <= y && y <= 0xdfff) {
//             x = 0x10000 + ((x & 0x03ff) << 10) + (y & 0x03ff);
//             i++;
//         }
//         /* Encode output as utf-8 */
//         if (x <= 0x7f) output += String.fromCharCode(x);
//         else if (x <= 0x7ff)
//             output += String.fromCharCode(0xc0 | ((x >>> 6) & 0x1f), 0x80 | (x & 0x3f));
//         else if (x <= 0xffff)
//             output += String.fromCharCode(
//                 0xe0 | ((x >>> 12) & 0x0f),
//                 0x80 | ((x >>> 6) & 0x3f),
//                 0x80 | (x & 0x3f),
//             );
//         else if (x <= 0x1fffff)
//             output += String.fromCharCode(
//                 0xf0 | ((x >>> 18) & 0x07),
//                 0x80 | ((x >>> 12) & 0x3f),
//                 0x80 | ((x >>> 6) & 0x3f),
//                 0x80 | (x & 0x3f),
//             );
//     }
//     return output;
// }
// /*
//  * Encode a string as utf-16
//  */
// function str2rstr_utf16le(input: string) {
//     var output = "";
//     for (var i = 0; i < input.length; i++)
//         output += String.fromCharCode(
//             input.charCodeAt(i) & 0xff,
//             (input.charCodeAt(i) >>> 8) & 0xff,
//         );
//     return output;
// }
// function str2rstr_utf16be(input: string) {
//     var output = "";
//     for (var i = 0; i < input.length; i++)
//         output += String.fromCharCode(
//             (input.charCodeAt(i) >>> 8) & 0xff,
//             input.charCodeAt(i) & 0xff,
//         );
//     return output;
// }
/*
 * Convert a raw string to an array of big-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binb(input) {
    var output = Array(input.length >> 2);
    for (var i = 0; i < output.length; i++)
        output[i] = 0;
    for (var i = 0; i < input.length * 8; i += 8)
        output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (24 - (i % 32));
    return output;
}
/*
 * Convert an array of big-endian words to a string
 */
function binb2rstr(input) {
    var output = "";
    for (var i = 0; i < input.length * 32; i += 8)
        output += String.fromCharCode((input[i >> 5] >>> (24 - (i % 32))) & 0xff);
    return output;
}
/*
 * Main sha256 function, with its support functions
 */
function sha256_S(X, n) {
    return (X >>> n) | (X << (32 - n));
}
function sha256_R(X, n) {
    return X >>> n;
}
function sha256_Ch(x, y, z) {
    return (x & y) ^ (~x & z);
}
function sha256_Maj(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
}
function sha256_Sigma0256(x) {
    return sha256_S(x, 2) ^ sha256_S(x, 13) ^ sha256_S(x, 22);
}
function sha256_Sigma1256(x) {
    return sha256_S(x, 6) ^ sha256_S(x, 11) ^ sha256_S(x, 25);
}
function sha256_Gamma0256(x) {
    return sha256_S(x, 7) ^ sha256_S(x, 18) ^ sha256_R(x, 3);
}
function sha256_Gamma1256(x) {
    return sha256_S(x, 17) ^ sha256_S(x, 19) ^ sha256_R(x, 10);
}
// function sha256_Sigma0512(x: number) {
//     return sha256_S(x, 28) ^ sha256_S(x, 34) ^ sha256_S(x, 39);
// }
// function sha256_Sigma1512(x: number) {
//     return sha256_S(x, 14) ^ sha256_S(x, 18) ^ sha256_S(x, 41);
// }
// function sha256_Gamma0512(x: number) {
//     return sha256_S(x, 1) ^ sha256_S(x, 8) ^ sha256_R(x, 7);
// }
// function sha256_Gamma1512(x: number) {
//     return sha256_S(x, 19) ^ sha256_S(x, 61) ^ sha256_R(x, 6);
// }
var sha256_K = new Array(1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993, -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987, 1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885, -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872, -1866530822, -1538233109, -1090935817, -965641998);
function binb_sha256(m, l) {
    var HASH = new Array(1779033703, -1150833019, 1013904242, -1521486534, 1359893119, -1694144372, 528734635, 1541459225);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h;
    var i, j, T1, T2;
    /* append padding */
    m[l >> 5] |= 0x80 << (24 - (l % 32));
    m[(((l + 64) >> 9) << 4) + 15] = l;
    for (i = 0; i < m.length; i += 16) {
        a = HASH[0];
        b = HASH[1];
        c = HASH[2];
        d = HASH[3];
        e = HASH[4];
        f = HASH[5];
        g = HASH[6];
        h = HASH[7];
        for (j = 0; j < 64; j++) {
            if (j < 16)
                W[j] = m[j + i];
            else
                W[j] = safe_add(safe_add(safe_add(sha256_Gamma1256(W[j - 2]), W[j - 7]), sha256_Gamma0256(W[j - 15])), W[j - 16]);
            T1 = safe_add(safe_add(safe_add(safe_add(h, sha256_Sigma1256(e)), sha256_Ch(e, f, g)), sha256_K[j]), W[j]);
            T2 = safe_add(sha256_Sigma0256(a), sha256_Maj(a, b, c));
            h = g;
            g = f;
            f = e;
            e = safe_add(d, T1);
            d = c;
            c = b;
            b = a;
            a = safe_add(T1, T2);
        }
        HASH[0] = safe_add(a, HASH[0]);
        HASH[1] = safe_add(b, HASH[1]);
        HASH[2] = safe_add(c, HASH[2]);
        HASH[3] = safe_add(d, HASH[3]);
        HASH[4] = safe_add(e, HASH[4]);
        HASH[5] = safe_add(f, HASH[5]);
        HASH[6] = safe_add(g, HASH[6]);
        HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
}
function safe_add(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
}
