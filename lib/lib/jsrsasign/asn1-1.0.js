/* asn1-1.0.28.js (c) 2013-2023 Kenji Urushima | kjur.github.io/jsrsasign/license
 */
/*
 * asn1.js - ASN.1 DER encoder classes
 *
 * Copyright (c) 2013-2022 Kenji Urushima (kenji.urushima@gmail.com)
 *
 * This software is licensed under the terms of the MIT License.
 * https://kjur.github.io/jsrsasign/license
 *
 * The above copyright and license notice shall be
 * included in all copies or substantial portions of the Software.
 */
import { BigInteger } from "../jsbn/jsbn";
import { oidtohex, extendClass, twoscompl } from "./base64x-1.1";
/**
 * @fileOverview
 * @name asn1-1.0.js
 * @author Kenji Urushima kenji.urushima@gmail.com
 * @version jsrsasign 10.9.0 asn1 1.0.28 (2023-Nov-27)
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
export var KJUR = {};
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
 * <li>0x1a {@link KJUR.asn1.DERVisibleString}</li>
 * <li>0x1e {@link KJUR.asn1.DERBMPString}</li>
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
KJUR.asn1.ASN1Util = new (function () {
    this.integerToByteHex = function (i) {
        var h = i.toString(16);
        if (h.length % 2 == 1) h = "0" + h;
        return h;
    };
    this.bigIntToMinTwosComplementsHex = function (bigIntegerValue) {
        // DEPRECATED. use twoscompl
        return twoscompl(bigIntegerValue);
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
    this.getPEMStringFromHex = function (dataHex, pemHeader) {
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
     * <li>'bool' - {@link KJUR.asn1.DERBoolean}</li>
     * <li>'int' - {@link KJUR.asn1.DERInteger}</li>
     * <li>'bitstr' - {@link KJUR.asn1.DERBitString}</li>
     * <li>'octstr' - {@link KJUR.asn1.DEROctetString}</li>
     * <li>'null' - {@link KJUR.asn1.DERNull}</li>
     * <li>'oid' - {@link KJUR.asn1.DERObjectIdentifier}</li>
     * <li>'enum' - {@link KJUR.asn1.DEREnumerated}</li>
     * <li>'utf8str' - {@link KJUR.asn1.DERUTF8String}</li>
     * <li>'numstr' - {@link KJUR.asn1.DERNumericString}</li>
     * <li>'prnstr' - {@link KJUR.asn1.DERPrintableString}</li>
     * <li>'telstr' - {@link KJUR.asn1.DERTeletexString}</li>
     * <li>'ia5str' - {@link KJUR.asn1.DERIA5String}</li>
     * <li>'utctime' - {@link KJUR.asn1.DERUTCTime}</li>
     * <li>'gentime' - {@link KJUR.asn1.DERGeneralizedTime}</li>
     * <li>'visstr' - {@link KJUR.asn1.DERVisibleString}</li>
     * <li>'bmpstr' - {@link KJUR.asn1.DERBMPString}</li>
     * <li>'seq' - {@link KJUR.asn1.DERSequence}</li>
     * <li>'set' - {@link KJUR.asn1.DERSet}</li>
     * <li>'tag' - {@link KJUR.asn1.DERTaggedObject}</li>
     * <li>'asn1' - {@link KJUR.asn1.ASN1Object}</li>
     * </ul>
     * <br/>
     * NOTE: Structured object such as SEQUENCE or SET can conclude
     * ASN1Object as well as JSON parameters since jsrsasign 9.0.0.
     *
     * @example
     * newObject({'prnstr': 'aaa'});
     * newObject({'seq': [{'int': 3}, {'prnstr': 'aaa'}]})
     * newObject({seq: [{int: 3}, new DERInteger({int: 3})]}) // mixed
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
    this.newObject = function (param) {
        var _KJUR = KJUR,
            _KJUR_asn1 = _KJUR.asn1,
            _ASN1Object = _KJUR_asn1.ASN1Object,
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
            _DERVisibleString = _KJUR_asn1.DERVisibleString,
            _DERBMPString = _KJUR_asn1.DERBMPString,
            _DERSequence = _KJUR_asn1.DERSequence,
            _DERSet = _KJUR_asn1.DERSet,
            _DERTaggedObject = _KJUR_asn1.DERTaggedObject,
            _newObject = _KJUR_asn1.ASN1Util.newObject;

        if (param instanceof _KJUR_asn1.ASN1Object) return param;

        var keys = Object.keys(param);
        if (keys.length != 1) throw new Error("key of param shall be only one.");
        var key = keys[0];

        if (
            ":asn1:bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:visstr:bmpstr:seq:set:tag:".indexOf(
                ":" + key + ":",
            ) == -1
        )
            throw new Error("undefined key: " + key);

        if (key == "bool") return new _DERBoolean(param[key]);
        if (key == "int") return new _DERInteger(param[key]);
        if (key == "bitstr") return new _DERBitString(param[key]);
        if (key == "octstr") return new _DEROctetString(param[key]);
        if (key == "null") return new _DERNull(param[key]);
        if (key == "oid") return new _DERObjectIdentifier(param[key]);
        if (key == "enum") return new _DEREnumerated(param[key]);
        if (key == "utf8str") return new _DERUTF8String(param[key]);
        if (key == "numstr") return new _DERNumericString(param[key]);
        if (key == "prnstr") return new _DERPrintableString(param[key]);
        if (key == "telstr") return new _DERTeletexString(param[key]);
        if (key == "ia5str") return new _DERIA5String(param[key]);
        if (key == "utctime") return new _DERUTCTime(param[key]);
        if (key == "gentime") return new _DERGeneralizedTime(param[key]);
        if (key == "visstr") return new _DERVisibleString(param[key]);
        if (key == "bmpstr") return new _DERBMPString(param[key]);
        if (key == "asn1") return new _ASN1Object(param[key]);

        if (key == "seq") {
            var paramList = param[key];
            var a = [];
            for (var i = 0; i < paramList.length; i++) {
                var asn1Obj = _newObject(paramList[i]);
                a.push(asn1Obj);
            }
            return new _DERSequence({ array: a });
        }

        if (key == "set") {
            var paramList = param[key];
            var a = [];
            for (var i = 0; i < paramList.length; i++) {
                var asn1Obj = _newObject(paramList[i]);
                a.push(asn1Obj);
            }
            return new _DERSet({ array: a });
        }

        if (key == "tag") {
            var tagParam = param[key];
            if (
                Object.prototype.toString.call(tagParam) === "[object Array]" &&
                tagParam.length == 3
            ) {
                var obj = _newObject(tagParam[2]);
                return new _DERTaggedObject({
                    tag: tagParam[0],
                    explicit: tagParam[1],
                    obj: obj,
                });
            } else {
                return new _DERTaggedObject(tagParam);
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
    this.jsonToASN1HEX = function (param) {
        var asn1Obj = this.newObject(param);
        return asn1Obj.tohex();
    };
})();

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
KJUR.asn1.ASN1Util.oidHexToInt = function (hex) {
    var s = "";
    var i01 = parseInt(hex.substring(0, 2), 16);
    var i0 = Math.floor(i01 / 40);
    var i1 = i01 % 40;
    var s = i0 + "." + i1;

    var binbuf = "";
    for (var i = 2; i < hex.length; i += 2) {
        var value = parseInt(hex.substring(i, i + 2), 16);
        var bin = ("00000000" + value.toString(2)).slice(-8);
        binbuf = binbuf + bin.substring(1, 8);
        if (bin.substring(0, 1) == "0") {
            var bi = new BigInteger(binbuf, 2);
            s = s + "." + bi.toString(10);
            binbuf = "";
        }
    }

    return s;
};

/**
 * get hexadecimal value of object identifier from dot noted oid value (DEPRECATED)
 * @name oidIntToHex
 * @memberOf KJUR.asn1.ASN1Util
 * @function
 * @param {String} oidString dot noted string of object identifier
 * @return {String} hexadecimal value of object identifier
 * @since jsrsasign 4.8.3 asn1 1.0.7
 * @see {@link ASN1HEX.hextooidstr}
 * @deprecated from jsrsasign 10.0.6. please use {@link oidtohex}
 *
 * @description
 * This static method converts from object identifier value string.
 * to hexadecimal string representation of it.
 * {@link ASN1HEX.hextooidstr} is a reverse function of this.
 * @example
 * KJUR.asn1.ASN1Util.oidIntToHex("2.5.4.6") &rarr; "550406"
 */
KJUR.asn1.ASN1Util.oidIntToHex = function (oidString) {
    var itox = function (i) {
        var h = i.toString(16);
        if (h.length == 1) h = "0" + h;
        return h;
    };

    var roidtox = function (roid) {
        var h = "";
        var bi = new BigInteger(roid, 10);
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

    if (!oidString.match(/^[0-9.]+$/)) {
        throw "malformed oid string: " + oidString;
    }
    var h = "";
    var a = oidString.split(".");
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
 * base class for ASN.1 DER encoder object<br/>
 * @name KJUR.asn1.ASN1Object
 * @class base class for ASN.1 DER encoder object
 * @param {Array} params JSON object parameter for constructor
 * @property {Boolean} isModified flag whether internal data was changed
 * @property {Array} params JSON object parameter for ASN.1 encode
 * @property {String} hTLV hexadecimal string of ASN.1 TLV
 * @property {String} hT hexadecimal string of ASN.1 TLV tag(T)
 * @property {String} hL hexadecimal string of ASN.1 TLV length(L)
 * @property {String} hV hexadecimal string of ASN.1 TLV value(V)
 *
 * @description
 * This class is ASN.1 DER object encode base class.
 *
 * @example
 * new KJUR.asn1.ASN1Object({tlv: "030101"})
 */
KJUR.asn1.ASN1Object = function (params) {
    var isModified = true;
    var hTLV = null;
    var hT = "00";
    var hL = "00";
    var hV = "";
    this.params = null;

    /**
     * get hexadecimal ASN.1 TLV length(L) bytes from TLV value(V)<br/>
     * @name getLengthHexFromValue
     * @memberOf KJUR.asn1.ASN1Object#
     * @function
     * @return {String} hexadecimal string of ASN.1 TLV length(L)
     */
    this.getLengthHexFromValue = function () {
        if (typeof this.hV == "undefined" || this.hV == null) {
            throw new Error("this.hV is null or undefined");
        }
        if (this.hV.length % 2 == 1) {
            throw new Error(
                "value hex must be even length: n=" + hV.length + ",v=" + this.hV,
            );
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
                throw new Error(
                    "ASN.1 length too long to represent by 8x: n = " + n.toString(16),
                );
            }
            var head = 128 + hNlen;
            return head.toString(16) + hN;
        }
    };

    /**
     * get hexadecimal string of ASN.1 TLV bytes<br/>
     * @name tohex
     * @memberOf KJUR.asn1.ASN1Object#
     * @function
     * @return {String} hexadecimal string of ASN.1 TLV
     * @since jsrsasign 10.5.16 asn1 1.0.24
     * @see KJUR.asn1.ASN1Object#getEncodedHex
     * @example
     * ...ASN1ObjectInstance.tohex() &rarr; "3003020101"
     */
    this.tohex = function () {
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
     * get hexadecimal string of ASN.1 TLV bytes (DEPRECATED)<br/>
     * @name getEncodedHex
     * @memberOf KJUR.asn1.ASN1Object#
     * @function
     * @return {String} hexadecimal string of ASN.1 TLV
     * @deprecated since jsrsasign 10.5.16 please use {@link KJUR.asn1.ASN1Object#tohex}
     */
    this.getEncodedHex = function () {
        return this.tohex();
    };

    /**
     * get hexadecimal string of ASN.1 TLV value(V) bytes
     * @name getValueHex
     * @memberOf KJUR.asn1.ASN1Object#
     * @function
     * @return {String} hexadecimal string of ASN.1 TLV value(V) bytes
     */
    this.getValueHex = function () {
        this.tohex();
        return this.hV;
    };

    this.getFreshValueHex = function () {
        return "";
    };

    this.setByParam = function (params) {
        this.params = params;
    };

    if (params != undefined) {
        if (params.tlv != undefined) {
            this.hTLV = params.tlv;
            this.isModified = false;
        }
    }
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
KJUR.asn1.DERAbstractString = function (params) {
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
    this.getString = function () {
        return this.s;
    };

    /**
     * set value by a string
     * @name setString
     * @memberOf KJUR.asn1.DERAbstractString#
     * @function
     * @param {String} newS value by a string to set
     * @description
     * This method set value by string. <br/>
     * NOTE: This method assumes that the argument string is
     * UTF-8 encoded even though ASN.1 primitive
     * such as IA5String or PrintableString doesn't
     * support all of UTF-8 characters.
     * @example
     * o = new KJUR.asn1.DERIA5String();
     * o.setString("abc");
     * o.setString("あいう");
     */
    this.setString = function (newS) {
        this.hTLV = null;
        this.isModified = true;
        this.s = newS;
        this.hV = utf8tohex(this.s).toLowerCase();
    };

    /**
     * set value by a hexadecimal string
     * @name setStringHex
     * @memberOf KJUR.asn1.DERAbstractString#
     * @function
     * @param {String} newHexString value by a hexadecimal string to set
     */
    this.setStringHex = function (newHexString) {
        this.hTLV = null;
        this.isModified = true;
        this.s = null;
        this.hV = newHexString;
    };

    this.getFreshValueHex = function () {
        return this.hV;
    };

    if (typeof params != "undefined") {
        if (typeof params == "string") {
            this.setString(params);
        } else if (typeof params["str"] != "undefined") {
            this.setString(params["str"]);
        } else if (typeof params["hex"] != "undefined") {
            this.setStringHex(params["hex"]);
        }
    }
};
extendClass(KJUR.asn1.DERAbstractString, KJUR.asn1.ASN1Object);
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
 * @see KJUR.asn1.DERGeneralizedTime
 * @see KJUR.asn1.DERUTCTime
 * @see KJUR.asn1.x509.Time
 */
KJUR.asn1.DERAbstractTime = function (params) {
    KJUR.asn1.DERAbstractTime.superclass.constructor.call(this);
    var s = null;
    var date = null;

    // --- PRIVATE METHODS --------------------
    this.localDateToUTC = function (d) {
        var utc = d.getTime() + d.getTimezoneOffset() * 60000;
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
    this.formatDate = function (dateObject, type, withMillis) {
        var pad = this.zeroPadding;
        var d = this.localDateToUTC(dateObject);
        var year = String(d.getFullYear());
        if (type == "utc") year = year.substring(2, 4);
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

    this.zeroPadding = function (s, len) {
        if (s.length >= len) return s;
        return new Array(len - s.length + 1).join("0") + s;
    };

    // --- PUBLIC METHODS --------------------

    /**
     * set parameter of time
     * @name setByParam
     * @memberOf KJUR.asn1.DERAbstractTime#
     * @function
     * @param {Object} params JSON object, Date object or string of time
     * @since jsrsasign 10.4.1 asn1 1.0.22
     *
     * NOTE: If a member "millis" has a value "true",
     * a fraction of second will be specified for this object.
     * This default is "false".
     *
     * @example
     * d1 = new KJUR.asn1.DERGeneralizedTime();
     * d1.setByParam("20210930235959.123Z");
     * d1.setByParam({str: "20210930235959.123Z"});
     *
     * d1.setByParam(new Date("2013/12/31 23:59:59.12"));
     * date1 = new Date(Date.UTC(2021,8,31,23,59,59,123));
     * d1.setByParam(date1);
     * d1.setByParam({date: date1});
     * d1.setByParam({date: date1, millis: true});
     */
    this.setByParam = function (params) {
        this.hV = null;
        this.hTLV = null;
        this.params = params;
    };

    /**
     * get string value of this string object (DEPRECATED)
     * @name getString
     * @memberOf KJUR.asn1.DERAbstractTime#
     * @function
     * @return {String} string value of this time object
     * @deprecated from jsrsasign 10.4.1 asn1 1.0.22.
     */
    this.getString = function () {
        return undefined;
    };

    /**
     * set value by a string (DEPRECATED)
     * @name setString
     * @memberOf KJUR.asn1.DERAbstractTime#
     * @function
     * @param {String} newS value by a string to set such like "130430235959Z"
     * @deprecated from jsrsasign 10.4.1 asn1 1.0.22.
     */
    this.setString = function (newS) {
        this.hTLV = null;
        this.isModified = true;
        if (this.params == undefined) this.params = {};
        this.params.str = newS;
    };

    /**
     * set value by a Date object<br/>
     * @name setByDate
     * @memberOf KJUR.asn1.DERAbstractTime#
     * @function
     * @param {Date} dateObject Date object to set ASN.1 value(V)
     * @since jsrsasign 10.4.1 asn1 1.0.22
     *
     * @example
     * o = new KJUR.asn1.DERUTCTime();
     * o.setByDate(new Date("2016/12/31 23:59:59.12"));
     * // 2015-Jan-31 23:59:59.12
     * o.setByDate(new Date(Date.UTC(2015, 0, 31, 23, 59, 59, 0)));
     */
    this.setByDate = function (dateObject) {
        this.hTLV = null;
        this.isModified = true;
        if (this.params == undefined) this.params = {};
        this.params.date = dateObject;
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
    this.setByDateValue = function (year, month, day, hour, min, sec) {
        var dateObject = new Date(Date.UTC(year, month - 1, day, hour, min, sec, 0));
        this.setByDate(dateObject);
    };

    this.getFreshValueHex = function () {
        return this.hV;
    };
};
extendClass(KJUR.asn1.DERAbstractTime, KJUR.asn1.ASN1Object);
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
KJUR.asn1.DERAbstractStructured = function (params) {
    KJUR.asn1.DERAbstractString.superclass.constructor.call(this);
    var asn1Array = null;

    /**
     * set value by array of ASN1Object
     * @name setByASN1ObjectArray
     * @memberOf KJUR.asn1.DERAbstractStructured#
     * @function
     * @param {array} asn1ObjectArray array of ASN1Object to set
     */
    this.setByASN1ObjectArray = function (asn1ObjectArray) {
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
    this.appendASN1Object = function (asn1Object) {
        this.hTLV = null;
        this.isModified = true;
        this.asn1Array.push(asn1Object);
    };

    this.asn1Array = new Array();
    if (typeof params != "undefined") {
        if (typeof params["array"] != "undefined") {
            this.asn1Array = params["array"];
        }
    }
};
extendClass(KJUR.asn1.DERAbstractStructured, KJUR.asn1.ASN1Object);

// ********************************************************************
//  ASN.1 Object Classes
// ********************************************************************

// ********************************************************************
/**
 * class for ASN.1 DER Boolean
 * @name KJUR.asn1.DERBoolean
 * @class class for ASN.1 DER Boolean
 * @extends KJUR.asn1.ASN1Object
 * @see KJUR.asn1.ASN1Object - superclass
 * @description
 * In ASN.1 DER, DER Boolean "false" shall be omitted.
 * However this supports boolean false for future BER support.
 * @example
 * new KJUR.asn1.DERBoolean(true)
 * new KJUR.asn1.DERBoolean(false)
 */
KJUR.asn1.DERBoolean = function (params) {
    KJUR.asn1.DERBoolean.superclass.constructor.call(this);
    this.hT = "01";
    if (params == false) this.hTLV = "010100";
    else this.hTLV = "0101ff";
};
extendClass(KJUR.asn1.DERBoolean, KJUR.asn1.ASN1Object);

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
KJUR.asn1.DERInteger = function (params) {
    KJUR.asn1.DERInteger.superclass.constructor.call(this);
    this.hT = "02";
    this.params = null;
    var _biToTwoCompl = twoscompl;

    /**
     * set value by Tom Wu's BigInteger object
     * @name setByBigInteger
     * @memberOf KJUR.asn1.DERInteger#
     * @function
     * @param {BigInteger} bigIntegerValue to set
     */
    this.setByBigInteger = function (bigIntegerValue) {
        this.isModified = true;
        this.params = { bigint: bigIntegerValue };
    };

    /**
     * set value by integer value
     * @name setByInteger
     * @memberOf KJUR.asn1.DERInteger
     * @function
     * @param {Integer} integer value to set
     */
    this.setByInteger = function (intValue) {
        this.isModified = true;
        this.params = intValue;
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
     * new KJUR.asn1.DERInteger({'bigint': new BigInteger("1234", 10)});
     */
    this.setValueHex = function (newHexString) {
        this.isModified = true;
        this.params = { hex: newHexString };
    };

    this.getFreshValueHex = function () {
        var params = this.params;
        var bi = null;
        if (params == null) throw new Error("value not set");

        if (typeof params == "object" && params.hex != undefined) {
            this.hV = params.hex;
            return this.hV;
        }

        if (typeof params == "number") {
            bi = new BigInteger(String(params), 10);
        } else if (params["int"] != undefined) {
            bi = new BigInteger(String(params["int"]), 10);
        } else if (params.bigint != undefined) {
            bi = params.bigint;
        } else {
            throw new Error("wrong parameter");
        }
        this.hV = _biToTwoCompl(bi);
        return this.hV;
    };

    if (params != undefined) {
        this.params = params;
    }
};
extendClass(KJUR.asn1.DERInteger, KJUR.asn1.ASN1Object);

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
 *
 * @example
 * // default constructor
 * o = new KJUR.asn1.DERBitString();
 * // initialize with binary string
 * o = new KJUR.asn1.DERBitString({bin: "1011"});
 * // initialize with boolean array
 * o = new KJUR.asn1.DERBitString({array: [true,false,true,true]});
 * // initialize with hexadecimal string (04 is unused bits)
 * o = new KJUR.asn1.DERBitString({hex: "04bac0"});
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
KJUR.asn1.DERBitString = function (params) {
    if (params !== undefined && typeof params.obj !== "undefined") {
        var o = KJUR.asn1.ASN1Util.newObject(params.obj);
        params.hex = "00" + o.tohex();
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
    this.setHexValueIncludingUnusedBits = function (newHexStringIncludingUnusedBits) {
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
    this.setUnusedBitsAndHexValue = function (unusedBits, hValue) {
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
     * NOTE: Leading zeros '0' will be ignored.
     * @example
     * o = new KJUR.asn1.DERBitString();
     * o.setByBinaryString("1011");
     * o.setByBinaryString("001"); // leading zeros ignored
     */
    this.setByBinaryString = function (binaryString) {
        binaryString = binaryString.replace(/0+$/, "");
        var unusedBits = 8 - (binaryString.length % 8);
        if (unusedBits == 8) unusedBits = 0;

        binaryString += "0000000".substr(0, unusedBits);

        var h = "";
        for (var i = 0; i < binaryString.length - 1; i += 8) {
            var b = binaryString.substring(i, i + 8);
            var x = parseInt(b, 2).toString(16);
            if (x.length == 1) x = "0" + x;
            h += x;
        }
        this.hTLV = null;
        this.isModified = true;
        this.hV = "0" + unusedBits + h;
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
    this.setByBooleanArray = function (booleanArray) {
        var s = "";
        for (var i = 0; i < booleanArray.length; i++) {
            if (booleanArray[i] == true) {
                s += "1";
            } else {
                s += "0";
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
    this.newFalseArray = function (nLength) {
        var a = new Array(nLength);
        for (var i = 0; i < nLength; i++) {
            a[i] = false;
        }
        return a;
    };

    this.getFreshValueHex = function () {
        return this.hV;
    };

    if (typeof params != "undefined") {
        if (typeof params == "string" && params.toLowerCase().match(/^[0-9a-f]+$/)) {
            this.setHexValueIncludingUnusedBits(params);
        } else if (typeof params["hex"] != "undefined") {
            this.setHexValueIncludingUnusedBits(params["hex"]);
        } else if (typeof params["bin"] != "undefined") {
            this.setByBinaryString(params["bin"]);
        } else if (typeof params["array"] != "undefined") {
            this.setByBooleanArray(params["array"]);
        }
    }
};
extendClass(KJUR.asn1.DERBitString, KJUR.asn1.ASN1Object);

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
KJUR.asn1.DEROctetString = function (params) {
    if (params !== undefined && typeof params.obj !== "undefined") {
        var o = KJUR.asn1.ASN1Util.newObject(params.obj);
        params.hex = o.tohex();
    }
    KJUR.asn1.DEROctetString.superclass.constructor.call(this, params);
    this.hT = "04";
};
extendClass(KJUR.asn1.DEROctetString, KJUR.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER Null
 * @name KJUR.asn1.DERNull
 * @class class for ASN.1 DER Null
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERNull = function () {
    KJUR.asn1.DERNull.superclass.constructor.call(this);
    this.hT = "05";
    this.hTLV = "0500";
};
extendClass(KJUR.asn1.DERNull, KJUR.asn1.ASN1Object);

// ********************************************************************
/**
 * class for ASN.1 DER ObjectIdentifier
 * @name KJUR.asn1.DERObjectIdentifier
 * @class class for ASN.1 DER ObjectIdentifier
 * @param {Object} JSON object or string of parameters (ex. {'oid': '2.5.4.5'})
 * @extends KJUR.asn1.ASN1Object
 * @see oidtohex
 *
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>oid - specify initial ASN.1 value(V) by a oid string (ex. 2.5.4.13)</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 * @example
 * new DERObjectIdentifier({"name": "sha1"})
 * new DERObjectIdentifier({"oid": "1.2.3.4"})
 * new DERObjectIdentifier({"hex": "2d..."})
 * new DERObjectIdentifier("1.2.3.4")
 * new DERObjectIdentifier("SHA1withRSA")
 */
KJUR.asn1.DERObjectIdentifier = function (params) {
    KJUR.asn1.DERObjectIdentifier.superclass.constructor.call(this);
    this.hT = "06";

    /**
     * set value by a hexadecimal string
     * @name setValueHex
     * @memberOf KJUR.asn1.DERObjectIdentifier#
     * @function
     * @param {String} newHexString hexadecimal value of OID bytes
     */
    this.setValueHex = function (newHexString) {
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
    this.setValueOidString = function (oidString) {
        var h = oidtohex(oidString);
        if (h == null) throw new Error("malformed oid string: " + oidString);
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
    this.setValueName = function (oidName) {
        var oid = KJUR.asn1.x509.OID.name2oid(oidName);
        if (oid !== "") {
            this.setValueOidString(oid);
        } else {
            throw new Error("DERObjectIdentifier oidName undefined: " + oidName);
        }
    };

    this.setValueNameOrOid = function (nameOrOid) {
        if (nameOrOid.match(/^[0-2].[0-9.]+$/)) {
            this.setValueOidString(nameOrOid);
        } else {
            this.setValueName(nameOrOid);
        }
    };

    this.getFreshValueHex = function () {
        return this.hV;
    };

    this.setByParam = function (params) {
        if (typeof params === "string") {
            this.setValueNameOrOid(params);
        } else if (params.oid !== undefined) {
            this.setValueNameOrOid(params.oid);
        } else if (params.name !== undefined) {
            this.setValueNameOrOid(params.name);
        } else if (params.hex !== undefined) {
            this.setValueHex(params.hex);
        }
    };

    if (params !== undefined) this.setByParam(params);
};
extendClass(KJUR.asn1.DERObjectIdentifier, KJUR.asn1.ASN1Object);

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
KJUR.asn1.DEREnumerated = function (params) {
    KJUR.asn1.DEREnumerated.superclass.constructor.call(this);
    this.hT = "0a";

    /**
     * set value by Tom Wu's BigInteger object
     * @name setByBigInteger
     * @memberOf KJUR.asn1.DEREnumerated#
     * @function
     * @param {BigInteger} bigIntegerValue to set
     */
    this.setByBigInteger = function (bigIntegerValue) {
        this.hTLV = null;
        this.isModified = true;
        this.hV = twoscompl(bigIntegerValue);
    };

    /**
     * set value by integer value
     * @name setByInteger
     * @memberOf KJUR.asn1.DEREnumerated#
     * @function
     * @param {Integer} integer value to set
     */
    this.setByInteger = function (intValue) {
        var bi = new BigInteger(String(intValue), 10);
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
    this.setValueHex = function (newHexString) {
        this.hV = newHexString;
    };

    this.getFreshValueHex = function () {
        return this.hV;
    };

    if (typeof params != "undefined") {
        if (typeof params["int"] != "undefined") {
            this.setByInteger(params["int"]);
        } else if (typeof params == "number") {
            this.setByInteger(params);
        } else if (typeof params["hex"] != "undefined") {
            this.setValueHex(params["hex"]);
        }
    }
};
extendClass(KJUR.asn1.DEREnumerated, KJUR.asn1.ASN1Object);

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
KJUR.asn1.DERUTF8String = function (params) {
    KJUR.asn1.DERUTF8String.superclass.constructor.call(this, params);
    this.hT = "0c";
};
extendClass(KJUR.asn1.DERUTF8String, KJUR.asn1.DERAbstractString);

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
KJUR.asn1.DERNumericString = function (params) {
    KJUR.asn1.DERNumericString.superclass.constructor.call(this, params);
    this.hT = "12";
};
extendClass(KJUR.asn1.DERNumericString, KJUR.asn1.DERAbstractString);

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
KJUR.asn1.DERPrintableString = function (params) {
    KJUR.asn1.DERPrintableString.superclass.constructor.call(this, params);
    this.hT = "13";
};
extendClass(KJUR.asn1.DERPrintableString, KJUR.asn1.DERAbstractString);

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
KJUR.asn1.DERTeletexString = function (params) {
    KJUR.asn1.DERTeletexString.superclass.constructor.call(this, params);
    this.hT = "14";
};
extendClass(KJUR.asn1.DERTeletexString, KJUR.asn1.DERAbstractString);

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
KJUR.asn1.DERIA5String = function (params) {
    KJUR.asn1.DERIA5String.superclass.constructor.call(this, params);
    this.hT = "16";
};
extendClass(KJUR.asn1.DERIA5String, KJUR.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER VisibleString
 * @name KJUR.asn1.DERVisibleString
 * @class class for ASN.1 DER VisibleString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @since jsrsasign 8.0.23 asn1 1.0.15
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERVisibleString = function (params) {
    KJUR.asn1.DERIA5String.superclass.constructor.call(this, params);
    this.hT = "1a";
};
extendClass(KJUR.asn1.DERVisibleString, KJUR.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER BMPString
 * @name KJUR.asn1.DERBMPString
 * @class class for ASN.1 DER BMPString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @since jsrsasign 8.0.23 asn1 1.0.15
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERBMPString = function (params) {
    KJUR.asn1.DERBMPString.superclass.constructor.call(this, params);
    this.hT = "1e";
};
extendClass(KJUR.asn1.DERBMPString, KJUR.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER UTCTime
 * @name KJUR.asn1.DERUTCTime
 * @class class for ASN.1 DER UTCTime
 * @param {Array} params associative array of parameters (ex. {'str': '130430235959Z'})
 * @extends KJUR.asn1.DERAbstractTime
 * @see KJUR.asn1.DERGeneralizedTime
 * @see KJUR.asn1.x509.Time
 *
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string (ex.'130430235959Z')</li>
 * <li>date - specify Date object.</li>
 * <li>millis - specify flag to show milliseconds (from 1.0.6)</li>
 * </ul>
 * NOTE1: 'params' can be omitted.
 * NOTE2: 'millis' property is supported from jsrsasign 10.4.1 asn1 1.0.22.
 *
 * <h4>EXAMPLES</h4>
 * @example
 * new DERUTCTime("20151231235959Z")
 * new DERUTCTime("20151231235959.123Z")
 * new DERUTCTime(new Date())
 * new DERUTCTime(new Date(Date.UTC(2015,11,31,23,59,59,123)))
 * new DERUTCTime({str: "20151231235959.123Z"})
 * new DERUTCTime({date: new Date()})
 * new DERUTCTime({date: new Date(), millis: true})
 * new DERUTCTime({millis: true})
 */
KJUR.asn1.DERUTCTime = function (params) {
    KJUR.asn1.DERUTCTime.superclass.constructor.call(this, params);
    this.hT = "17";
    this.params = undefined;

    this.getFreshValueHex = function () {
        var params = this.params;

        if (this.params == undefined) params = { date: new Date() };

        if (typeof params == "string") {
            if (params.match(/^[0-9]{12}Z$/) || params.match(/^[0-9]{12}\.[0-9]+Z$/)) {
                this.hV = stohex(params);
            } else {
                throw new Error("malformed string for UTCTime: " + params);
            }
        } else if (params.str != undefined) {
            this.hV = stohex(params.str);
        } else if (params.date == undefined && params.millis == true) {
            var date = new Date();
            this.hV = stohex(this.formatDate(date, "utc", true));
        } else if (params.date != undefined && params.date instanceof Date) {
            var withMillis = params.millis === true;
            this.hV = stohex(this.formatDate(params.date, "utc", withMillis));
        } else if (params instanceof Date) {
            this.hV = stohex(this.formatDate(params, "utc"));
        }

        if (this.hV == undefined) {
            throw new Error("parameter not specified properly for UTCTime");
        }
        return this.hV;
    };

    if (params != undefined) this.setByParam(params);
};
extendClass(KJUR.asn1.DERUTCTime, KJUR.asn1.DERAbstractTime);

// ********************************************************************
/**
 * class for ASN.1 DER GeneralizedTime
 * @name KJUR.asn1.DERGeneralizedTime
 * @class class for ASN.1 DER GeneralizedTime
 * @param {Array} params associative array of parameters (ex. {'str': '20130430235959Z'})
 * @property {Boolean} withMillis flag to show milliseconds or not
 * @extends KJUR.asn1.DERAbstractTime
 * @see KJUR.asn1.DERUTCTime
 * @see KJUR.asn1.x509.Time
 *
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string (ex.'20130430235959Z')</li>
 * <li>date - specify Date object.</li>
 * <li>millis - specify flag to show milliseconds (from 1.0.6)</li>
 * </ul>
 * NOTE1: 'params' can be omitted.
 * NOTE2: 'millis' property is supported from asn1 1.0.6.
 *
 * <h4>EXAMPLES</h4>
 * @example
 * new DERGeneralizedTime("20151231235959Z")
 * new DERGeneralizedTime("20151231235959.123Z")
 * new DERGeneralizedTime(new Date())
 * new DERGeneralizedTime(new Date(Date.UTC(2015,11,31,23,59,59,123)))
 * new DERGeneralizedTime({str: "20151231235959.123Z"})
 * new DERGeneralizedTime({date: new Date()})
 * new DERGeneralizedTime({date: new Date(), millis: true})
 * new DERGeneralizedTime({millis: true})
 */
KJUR.asn1.DERGeneralizedTime = function (params) {
    KJUR.asn1.DERGeneralizedTime.superclass.constructor.call(this, params);
    this.hT = "18";
    this.params = params;

    this.getFreshValueHex = function () {
        var params = this.params;

        if (this.params == undefined) params = { date: new Date() };

        if (typeof params == "string") {
            if (params.match(/^[0-9]{14}Z$/) || params.match(/^[0-9]{14}\.[0-9]+Z$/)) {
                this.hV = stohex(params);
            } else {
                throw new Error("malformed string for GeneralizedTime: " + params);
            }
        } else if (params.str != undefined) {
            this.hV = stohex(params.str);
        } else if (params.date == undefined && params.millis == true) {
            var date = new Date();
            this.hV = stohex(this.formatDate(date, "gen", true));
        } else if (params.date != undefined && params.date instanceof Date) {
            var withMillis = params.millis === true;
            this.hV = stohex(this.formatDate(params.date, "gen", withMillis));
        } else if (params instanceof Date) {
            this.hV = stohex(this.formatDate(params, "gen"));
        }

        if (this.hV == undefined) {
            throw new Error("parameter not specified properly for GeneralizedTime");
        }
        return this.hV;
    };

    if (params != undefined) this.setByParam(params);
};
extendClass(KJUR.asn1.DERGeneralizedTime, KJUR.asn1.DERAbstractTime);

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
KJUR.asn1.DERSequence = function (params) {
    KJUR.asn1.DERSequence.superclass.constructor.call(this, params);
    this.hT = "30";
    this.getFreshValueHex = function () {
        var h = "";
        for (var i = 0; i < this.asn1Array.length; i++) {
            var asn1Obj = this.asn1Array[i];
            h += asn1Obj.tohex();
        }
        this.hV = h;
        return this.hV;
    };
};
extendClass(KJUR.asn1.DERSequence, KJUR.asn1.DERAbstractStructured);

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
KJUR.asn1.DERSet = function (params) {
    KJUR.asn1.DERSet.superclass.constructor.call(this, params);
    this.hT = "31";
    this.sortFlag = true; // item shall be sorted only in ASN.1 DER
    this.getFreshValueHex = function () {
        var a = new Array();
        for (var i = 0; i < this.asn1Array.length; i++) {
            var asn1Obj = this.asn1Array[i];
            a.push(asn1Obj.tohex());
        }
        if (this.sortFlag == true) a.sort();
        this.hV = a.join("");
        return this.hV;
    };

    if (typeof params != "undefined") {
        if (typeof params.sortflag != "undefined" && params.sortflag == false)
            this.sortFlag = false;
    }
};
extendClass(KJUR.asn1.DERSet, KJUR.asn1.DERAbstractStructured);

// ********************************************************************
/**
 * class for ASN.1 DER TaggedObject
 * @name KJUR.asn1.DERTaggedObject
 * @class class for ASN.1 DER TaggedObject
 * @extends KJUR.asn1.ASN1Object
 * @see KJUR_asn1.ASN1Util.newObject
 *
 * @description
 * <br/>
 * Parameter 'tagNoNex' is ASN.1 tag(T) value for this object.
 * For example, if you find '[1]' tag in a ASN.1 dump,
 * 'tagNoHex' will be 'a1'.
 * <br/>
 * As for optional argument 'params' for constructor, you can specify *ANY* of
 * following properties:
 * <ul>
 * <li>tag - specify tag (default is 'a0' which means [0])</li>
 * <li>explicit - specify true if this is explicit tag otherwise false
 *     (default is 'true').</li>
 * <li>obj - specify ASN1Object or JSON object which will be tagged</li>
 * <li>tage - specify tag with explicit</li>
 * <li>tagi - specify tag with implicit</li>
 * </ul>
 * As for the member "obj" value of JSON object,
 * {@link KJUR_asn1.ASN1Util.newObject} is used to generate.
 *
 * @example
 * // by JSON
 * new KJUR.asn1.DERTaggedObject({
 *  tag:'a0', explicit: true, obj: { "prnstr": { "str": "aaa" } }
 * }).tohex()
 *
 * // by ASN1Object object
 * new KJUR.asn1.DERTaggedObject({
 *  tage:'a0', obj: new KJUR.asn1.DERInteger({int: 3}) // explicit
 * })
 * new KJUR.asn1.DERTaggedObject({
 *  tagi:'a0', obj: new KJUR.asn1.DERInteger({int: 3}) // implicit
 * })
 * new KJUR.asn1.DERTaggedObject({
 *  tag:'a0', explicit: true, obj: new KJUR.asn1.DERInteger({int: 3}) // explicit
 * })
 *
 * // to hexadecimal
 * d1 = new KJUR.asn1.DERUTF8String({str':'a'})
 * d2 = new KJUR.asn1.DERTaggedObject({'obj': d1});
 * hex = d2.tohex();
 */
KJUR.asn1.DERTaggedObject = function (params) {
    KJUR.asn1.DERTaggedObject.superclass.constructor.call(this);

    var _KJUR_asn1 = KJUR.asn1,
        _ASN1HEX = ASN1HEX,
        _getV = _ASN1HEX.getV,
        _isASN1HEX = _ASN1HEX.isASN1HEX,
        _newObject = _KJUR_asn1.ASN1Util.newObject;

    this.hT = "a0";
    this.hV = "";
    this.isExplicit = true;
    this.asn1Object = null;
    this.params = { tag: "a0", explicit: true }; //"tag": "a0, "explicit": true};

    /**
     * set value by an ASN1Object
     * @name setString
     * @memberOf KJUR.asn1.DERTaggedObject#
     * @function
     * @param {Boolean} isExplicitFlag flag for explicit/implicit tag
     * @param {Integer} tagNoHex hexadecimal string of ASN.1 tag
     * @param {ASN1Object} asn1Object ASN.1 to encapsulate
     * @deprecated since jsrsasign 10.5.4 please use setByParam instead
     */
    this.setASN1Object = function (isExplicitFlag, tagNoHex, asn1Object) {
        this.params = { tag: tagNoHex, explicit: isExplicitFlag, obj: asn1Object };
    };

    this.getFreshValueHex = function () {
        var params = this.params;

        if (params.explicit == undefined) params.explicit = true;

        if (params.tage != undefined) {
            params.tag = params.tage;
            params.explicit = true;
        }
        if (params.tagi != undefined) {
            params.tag = params.tagi;
            params.explicit = false;
        }

        if (params.str != undefined) {
            this.hV = utf8tohex(params.str);
        } else if (params.hex != undefined) {
            this.hV = params.hex;
        } else if (params.obj != undefined) {
            var hV1;
            if (params.obj instanceof _KJUR_asn1.ASN1Object) {
                hV1 = params.obj.tohex();
            } else if (typeof params.obj == "object") {
                hV1 = _newObject(params.obj).tohex();
            }
            if (params.explicit) {
                this.hV = hV1;
            } else {
                this.hV = _getV(hV1, 0);
            }
        } else {
            throw new Error("str, hex nor obj not specified");
        }

        if (params.tag == undefined) params.tag = "a0";
        this.hT = params.tag;
        this.hTLV = null;
        this.isModified = true;

        return this.hV;
    };

    this.setByParam = function (params) {
        this.params = params;
    };

    if (params !== undefined) this.setByParam(params);
};
extendClass(KJUR.asn1.DERTaggedObject, KJUR.asn1.ASN1Object);
