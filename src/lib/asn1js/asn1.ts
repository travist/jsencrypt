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

import { Int10 } from "./int10";

const ellipsis = "\u2026";
const reTimeS = /^(\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
const reTimeL = /^(\d\d\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;

function stringCut(str: string, len: number) {
    if (str.length > len) {
        str = str.substring(0, len) + ellipsis;
    }
    return str;
}

export class Stream {
    constructor(enc: Stream | number[], pos?: number) {
        if (enc instanceof Stream) {
            this.enc = enc.enc;
            this.pos = enc.pos;
        } else {
            // enc should be an array or a binary string
            this.enc = enc;
            this.pos = pos;
        }
    }

    private enc: string | number[];
    public pos: number;

    public get(pos?: number) {
        if (pos === undefined) {
            pos = this.pos++;
        }
        if (pos >= this.enc.length) {
            throw new Error(`Requesting byte offset ${pos} on a stream of length ${this.enc.length}`);
        }
        return ("string" === typeof this.enc) ? this.enc.charCodeAt(pos) : this.enc[pos];
    }

    public hexDigits = "0123456789ABCDEF";

    public hexByte(b: number) {
        return this.hexDigits.charAt((b >> 4) & 0xF) + this.hexDigits.charAt(b & 0xF);
    }

    public hexDump(start: number, end: number, raw: boolean) {
        let s = "";
        for (let i = start; i < end; ++i) {
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
    }

    public isASCII(start: number, end: number) {
        for (let i = start; i < end; ++i) {
            const c = this.get(i);
            if (c < 32 || c > 176) {
                return false;
            }
        }
        return true;
    }

    public parseStringISO(start: number, end: number) {
        let s = "";
        for (let i = start; i < end; ++i) {
            s += String.fromCharCode(this.get(i));
        }
        return s;
    }

    public parseStringUTF(start: number, end: number) {
        let s = "";
        for (let i = start; i < end;) {
            const c = this.get(i++);
            if (c < 128) {
                s += String.fromCharCode(c);
            } else if ((c > 191) && (c < 224)) {
                s += String.fromCharCode(((c & 0x1F) << 6) | (this.get(i++) & 0x3F));
            } else {
                s += String.fromCharCode(((c & 0x0F) << 12) | ((this.get(i++) & 0x3F) << 6) | (this.get(i++) & 0x3F));
            }
        }
        return s;
    }

    public parseStringBMP(start: number, end: number) {
        let str = "";
        let hi;
        let lo;
        for (let i = start; i < end;) {
            hi = this.get(i++);
            lo = this.get(i++);
            str += String.fromCharCode((hi << 8) | lo);
        }
        return str;
    }

    public parseTime(start: number, end: number, shortYear: boolean) {
        let s = this.parseStringISO(start, end);
        const m: Array<number | string> = (shortYear ? reTimeS : reTimeL).exec(s);
        if (!m) {
            return "Unrecognized time: " + s;
        }
        if (shortYear) {
            // to avoid querying the timer, use the fixed range [1970, 2069]
            // it will conform with ITU X.400 [-10, +40] sliding window until 2030
            m[1] = +m[1];
            (m[1] as number) += (+m[1] < 70) ? 2000 : 1900;
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
    }

    public parseInteger(start: number, end: number) {
        let v = this.get(start);
        const neg = (v > 127);
        const pad = neg ? 255 : 0;
        let len;
        let s: string | number = "";
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
        const n = new Int10(v);
        for (let i = start + 1; i < end; ++i) {
            n.mulAdd(256, this.get(i));
        }
        return s + n.toString();
    }

    public parseBitString(start: number, end: number, maxLength: number) {
        const unusedBit = this.get(start);
        const lenBit = ((end - start - 1) << 3) - unusedBit;
        const intro = "(" + lenBit + " bit)\n";
        let s = "";
        for (let i = start + 1; i < end; ++i) {
            const b = this.get(i);
            const skip = (i == end - 1) ? unusedBit : 0;
            for (let j = 7; j >= skip; --j) {
                s += (b >> j) & 1 ? "1" : "0";
            }
            if (s.length > maxLength) {
                return intro + stringCut(s, maxLength);
            }
        }
        return intro + s;
    }

    public parseOctetString(start: number, end: number, maxLength: number) {
        if (this.isASCII(start, end)) {
            return stringCut(this.parseStringISO(start, end), maxLength);
        }
        const len = end - start;
        let s = "(" + len + " byte)\n";
        maxLength /= 2; // we work in bytes
        if (len > maxLength) {
            end = start + maxLength;
        }
        for (let i = start; i < end; ++i) {
            s += this.hexByte(this.get(i));
        }
        if (len > maxLength) {
            s += ellipsis;
        }
        return s;
    }

    public parseOID(start: number, end: number, maxLength: number) {
        let s = "";
        let n: number | Int10 = new Int10();
        let bits = 0;
        for (let i = start; i < end; ++i) {
            const v = this.get(i);
            n.mulAdd(128, v & 0x7F);
            bits += 7;
            if (!(v & 0x80)) { // finished
                if (s === "") {
                    n = n.simplify();
                    if (n instanceof Int10) {
                        n.sub(80);
                        s = "2." + n.toString();
                    } else {
                        const m = n < 80 ? n < 40 ? 0 : 1 : 2;
                        s = m + "." + (n - m * 40);
                    }
                } else {
                    s += "." + n.toString();
                }
                if (s.length > maxLength) {
                    return stringCut(s, maxLength);
                }
                n = new Int10();
                bits = 0;
            }
        }
        if (bits > 0) {
            s += ".incomplete";
        }
        return s;
    }
}
export class ASN1 {
    constructor(stream: Stream, header: number, length: number, tag: ASN1Tag, sub: ASN1[]) {
        if (!(tag instanceof ASN1Tag)) {
            throw new Error("Invalid tag value.");
        }
        this.stream = stream;
        this.header = header;
        this.length = length;
        this.tag = tag;
        this.sub = sub;
    }

    private stream: Stream;
    private header: number;
    private length: number;
    private tag: ASN1Tag;
    public sub: ASN1[];

    public typeName() {
        switch (this.tag.tagClass) {
            case 0: // universal
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
    }

    public content(maxLength: number) { // a preview of the content (intended for humans)
        if (this.tag === undefined) {
            return null;
        }
        if (maxLength === undefined) {
            maxLength = Infinity;
        }
        const content = this.posContent();
        const len = Math.abs(this.length);
        if (!this.tag.isUniversal()) {
            if (this.sub !== null) {
                return "(" + this.sub.length + " elem)";
            }
            return this.stream.parseOctetString(content, content + len, maxLength);
        }
        switch (this.tag.tagNumber) {
            case 0x01: // BOOLEAN
                return (this.stream.get(content) === 0) ? "false" : "true";
            case 0x02: // INTEGER
                return this.stream.parseInteger(content, content + len);
            case 0x03: // BIT_STRING
                return this.sub ? "(" + this.sub.length + " elem)" :
                    this.stream.parseBitString(content, content + len, maxLength);
            case 0x04: // OCTET_STRING
                return this.sub ? "(" + this.sub.length + " elem)" :
                    this.stream.parseOctetString(content, content + len, maxLength);
            // case 0x05: // NULL
            case 0x06: // OBJECT_IDENTIFIER
                return this.stream.parseOID(content, content + len, maxLength);
            // case 0x07: // ObjectDescriptor
            // case 0x08: // EXTERNAL
            // case 0x09: // REAL
            // case 0x0A: // ENUMERATED
            // case 0x0B: // EMBEDDED_PDV
            case 0x10: // SEQUENCE
            case 0x11: // SET
                if (this.sub !== null) {
                    return "(" + this.sub.length + " elem)";
                } else {
                    return "(no elem)";
                }
            case 0x0C: // UTF8String
                return stringCut(this.stream.parseStringUTF(content, content + len), maxLength);
            case 0x12: // NumericString
            case 0x13: // PrintableString
            case 0x14: // TeletexString
            case 0x15: // VideotexString
            case 0x16: // IA5String
            // case 0x19: // GraphicString
            case 0x1A: // VisibleString
                // case 0x1B: // GeneralString
                // case 0x1C: // UniversalString
                return stringCut(this.stream.parseStringISO(content, content + len), maxLength);
            case 0x1E: // BMPString
                return stringCut(this.stream.parseStringBMP(content, content + len), maxLength);
            case 0x17: // UTCTime
            case 0x18: // GeneralizedTime
                return this.stream.parseTime(content, content + len, (this.tag.tagNumber == 0x17));
        }
        return null;
    }

    public toString() {
        return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + ((this.sub === null) ? "null" : this.sub.length) + "]";
    }

    public toPrettyString(indent: string) {
        if (indent === undefined) {
            indent = "";
        }
        let s = indent + this.typeName() + " @" + this.stream.pos;
        if (this.length >= 0) {
            s += "+";
        }
        s += this.length;
        if (this.tag.tagConstructed) {
            s += " (constructed)";
        } else if ((this.tag.isUniversal() && ((this.tag.tagNumber == 0x03) || (this.tag.tagNumber == 0x04))) && (this.sub !== null)) {
            s += " (encapsulates)";
        }
        s += "\n";
        if (this.sub !== null) {
            indent += "  ";
            for (let i = 0, max = this.sub.length; i < max; ++i) {
                s += this.sub[i].toPrettyString(indent);
            }
        }
        return s;
    }

    public posStart() {
        return this.stream.pos;
    }

    public posContent() {
        return this.stream.pos + this.header;
    }

    public posEnd() {
        return this.stream.pos + this.header + Math.abs(this.length);
    }

    public toHexString() {
        return this.stream.hexDump(this.posStart(), this.posEnd(), true);
    }

    public static decodeLength(stream: Stream): number {
        let buf = stream.get();
        const len = buf & 0x7F;
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
        for (let i = 0; i < len; ++i) {
            buf = (buf * 256) + stream.get();
        }
        return buf;
    }

    /**
     * Retrieve the hexadecimal value (as a string) of the current ASN.1 element
     * @returns {string}
     * @public
     */
    public getHexStringValue(): string {
        const hexString = this.toHexString();
        const offset = this.header * 2;
        const length = this.length * 2;
        return hexString.substring(offset, offset + length);
    }

    public static decode(str: Stream | number[]) {
        let stream: Stream;

        if (!(str instanceof Stream)) {
            stream = new Stream(str, 0);
        } else {
            stream = str;
        }

        const streamStart = new Stream(stream);
        const tag = new ASN1Tag(stream);
        let len = ASN1.decodeLength(stream);
        const start = stream.pos;
        const header = start - streamStart.pos;
        let sub = null;
        const getSub: () => ASN1[] = function () {
            const ret = [];
            if (len !== null) {
                // definite length
                const end = start + len;
                while (stream.pos < end) {
                    ret[ret.length] = ASN1.decode(stream);
                }
                if (stream.pos != end) {
                    throw new Error("Content size is not correct for container starting at offset " + start);
                }
            } else {
                // undefined length
                try {
                    for (; ;) {
                        const s = ASN1.decode(stream);
                        if (s.tag.isEOC()) {
                            break;
                        }
                        ret[ret.length] = s;
                    }
                    len = start - stream.pos; // undefined lengths are represented as negative values
                } catch (e) {
                    throw new Error("Exception while decoding undefined length content: " + e);
                }
            }

            return ret;
        };
        if (tag.tagConstructed) {
            // must have valid content
            sub = getSub();
        } else if (tag.isUniversal() && ((tag.tagNumber == 0x03) || (tag.tagNumber == 0x04))) {
            // sometimes BitString and OctetString are used to encapsulate ASN.1
            try {
                if (tag.tagNumber == 0x03) {
                    if (stream.get() != 0) {
                        throw new Error("BIT STRINGs with unused bits cannot encapsulate.");
                    }
                }
                sub = getSub();
                for (let i = 0; i < sub.length; ++i) {
                    if (sub[i].tag.isEOC()) {
                        throw new Error("EOC is not supposed to be actual content.");
                    }
                }
            } catch (e) {
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
    }
}


export class ASN1Tag {
    constructor(stream: Stream) {
        let buf = stream.get();
        this.tagClass = buf >> 6;
        this.tagConstructed = ((buf & 0x20) !== 0);
        this.tagNumber = buf & 0x1F;
        if (this.tagNumber == 0x1F) { // long tag
            const n = new Int10();
            do {
                buf = stream.get();
                n.mulAdd(128, buf & 0x7F);
            } while (buf & 0x80);
            this.tagNumber = n.simplify();
        }
    }

    public tagClass: number;
    public tagConstructed: boolean;
    public tagNumber: number | Int10;

    public isUniversal() {
        return this.tagClass === 0x00;
    }

    public isEOC() {
        return this.tagClass === 0x00 && this.tagNumber === 0x00;
    }
}
