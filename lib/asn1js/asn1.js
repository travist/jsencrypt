// ASN.1 JavaScript decoder
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
/*global oids */

var hardLimit = 100,
    ellipsis = "\u2026",
    DOM = {
        tag: function (tagName, className) {
            var t = document.createElement(tagName);
            t.className = className;
            return t;
        },
        text: function (str) {
            return document.createTextNode(str);
        }
    };

class Stream {
    static get hexDigits() {
        return "0123456789ABCDEF";
    };

    static get reTime() {
        return /^((?:1[89]|2\d)?\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
    }


    constructor(enc, pos) {
        if (enc instanceof Stream) {
            this.enc = enc.enc;
            this.pos = enc.pos;
        } else {
            this.enc = enc;
            this.pos = pos;
        }
    }

    get(pos) {
        if (pos === undefined)
            pos = this.pos++;
        if (pos >= this.enc.length)
            throw 'Requesting byte offset ' + pos + ' on a stream of length ' + this.enc.length;
        return this.enc[pos];
    };

    hexByte(b) {
        return Stream.hexDigits.charAt((b >> 4) & 0xF) + Stream.hexDigits.charAt(b & 0xF);
    };

    hexDump(start, end, raw) {
        var s = "";
        for (var i = start; i < end; ++i) {
            s += this.hexByte(this.get(i));
            if (raw !== true)
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
        return s;
    };

    parseStringISO(start, end) {
        var s = "";
        for (var i = start; i < end; ++i)
            s += String.fromCharCode(this.get(i));
        return s;
    };

    parseStringUTF(start, end) {
        var s = "";
        for (var i = start; i < end;) {
            var c = this.get(i++);
            if (c < 128)
                s += String.fromCharCode(c);
            else if ((c > 191) && (c < 224))
                s += String.fromCharCode(((c & 0x1F) << 6) | (this.get(i++) & 0x3F));
            else
                s += String.fromCharCode(((c & 0x0F) << 12) | ((this.get(i++) & 0x3F) << 6) | (this.get(i++) & 0x3F));
        }
        return s;
    };

    parseStringBMP(start, end) {
        var str = ""
        for (var i = start; i < end; i += 2) {
            var high_byte = this.get(i);
            var low_byte = this.get(i + 1);
            str += String.fromCharCode((high_byte << 8) + low_byte);
        }

        return str;
    };

    parseTime(start, end) {
        var s = this.parseStringISO(start, end),
            m = Stream.reTime.exec(s);
        if (!m)
            return "Unrecognized time: " + s;
        s = m[1] + "-" + m[2] + "-" + m[3] + " " + m[4];
        if (m[5]) {
            s += ":" + m[5];
            if (m[6]) {
                s += ":" + m[6];
                if (m[7])
                    s += "." + m[7];
            }
        }
        if (m[8]) {
            s += " UTC";
            if (m[8] != 'Z') {
                s += m[8];
                if (m[9])
                    s += ":" + m[9];
            }
        }
        return s;
    };

    parseInteger(start, end) {
        //TODO support negative numbers
        var len = end - start;
        if (len > 4) {
            len <<= 3;
            var s = this.get(start);
            if (s === 0)
                len -= 8;
            else
                while (s < 128) {
                    s <<= 1;
                    --len;
                }
            return "(" + len + " bit)";
        }
        var n = 0;
        for (var i = start; i < end; ++i)
            n = (n << 8) | this.get(i);
        return n;
    };

    parseBitString(start, end) {
        var unusedBit = this.get(start),
            lenBit = ((end - start - 1) << 3) - unusedBit,
            s = "(" + lenBit + " bit)";
        if (lenBit <= 20) {
            var skip = unusedBit;
            s += " ";
            for (var i = end - 1; i > start; --i) {
                var b = this.get(i);
                for (var j = skip; j < 8; ++j)
                    s += (b >> j) & 1 ? "1" : "0";
                skip = 0;
            }
        }
        return s;
    };

    parseOctetString(start, end) {
        var len = end - start,
            s = "(" + len + " byte) ";
        if (len > hardLimit)
            end = start + hardLimit;
        for (var i = start; i < end; ++i)
            s += this.hexByte(this.get(i)); //TODO: also try Latin1?
        if (len > hardLimit)
            s += ellipsis;
        return s;
    };

    parseOID(start, end) {
        var s = '',
            n = 0,
            bits = 0;
        for (var i = start; i < end; ++i) {
            var v = this.get(i);
            n = (n << 7) | (v & 0x7F);
            bits += 7;
            if (!(v & 0x80)) { // finished
                if (s === '') {
                    var m = n < 80 ? n < 40 ? 0 : 1 : 2;
                    s = m + "." + (n - m * 40);
                } else
                    s += "." + ((bits >= 31) ? "bigint" : n);
                n = bits = 0;
            }
        }
        return s;
    };
}

export class ASN1 {
    static get reSeemsASCII() {
        return /^[ -~]+$/;
    }

    constructor(stream, header, length, tag, sub) {
        this.stream = stream;
        this.header = header;
        this.length = length;
        this.tag = tag;
        this.sub = sub;
    }

    typeName() {
        if (this.tag === undefined)
            return "unknown";
        var tagClass = this.tag >> 6,
            tagConstructed = (this.tag >> 5) & 1,
            tagNumber = this.tag & 0x1F;
        switch (tagClass) {
            case 0: // universal
                switch (tagNumber) {
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
                    default:
                        return "Universal_" + tagNumber.toString(16);
                }
            case 1:
                return "Application_" + tagNumber.toString(16);
            case 2:
                return "[" + tagNumber + "]"; // Context
            case 3:
                return "Private_" + tagNumber.toString(16);
        }
    }

    content() {
        if (this.tag === undefined)
            return null;
        var tagClass = this.tag >> 6,
            tagNumber = this.tag & 0x1F,
            content = this.posContent(),
            len = Math.abs(this.length);
        if (tagClass !== 0) { // universal
            if (this.sub !== null)
                return "(" + this.sub.length + " elem)";
            //TODO: TRY TO PARSE ASCII STRING
            var s = this.stream.parseStringISO(content, content + Math.min(len, hardLimit));
            if (ASN1.reSeemsASCII.test(s))
                return s.substring(0, 2 * hardLimit) + ((s.length > 2 * hardLimit) ? ellipsis : "");
            else
                return this.stream.parseOctetString(content, content + len);
        }
        switch (tagNumber) {
            case 0x01: // BOOLEAN
                return (this.stream.get(content) === 0) ? "false" : "true";
            case 0x02: // INTEGER
                return this.stream.parseInteger(content, content + len);
            case 0x03: // BIT_STRING
                return this.sub ? "(" + this.sub.length + " elem)" :
                    this.stream.parseBitString(content, content + len);
            case 0x04: // OCTET_STRING
                return this.sub ? "(" + this.sub.length + " elem)" :
                    this.stream.parseOctetString(content, content + len);
            //case 0x05: // NULL
            case 0x06: // OBJECT_IDENTIFIER
                return this.stream.parseOID(content, content + len);
            //case 0x07: // ObjectDescriptor
            //case 0x08: // EXTERNAL
            //case 0x09: // REAL
            //case 0x0A: // ENUMERATED
            //case 0x0B: // EMBEDDED_PDV
            case 0x10: // SEQUENCE
            case 0x11: // SET
                return "(" + this.sub.length + " elem)";
            case 0x0C: // UTF8String
                return this.stream.parseStringUTF(content, content + len);
            case 0x12: // NumericString
            case 0x13: // PrintableString
            case 0x14: // TeletexString
            case 0x15: // VideotexString
            case 0x16: // IA5String
            //case 0x19: // GraphicString
            case 0x1A: // VisibleString
                //case 0x1B: // GeneralString
                //case 0x1C: // UniversalString
                return this.stream.parseStringISO(content, content + len);
            case 0x1E: // BMPString
                return this.stream.parseStringBMP(content, content + len);
            case 0x17: // UTCTime
            case 0x18: // GeneralizedTime
                return this.stream.parseTime(content, content + len);
        }
        return null;
    };

    toString() {
        return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + ((this.sub === null) ? 'null' : this.sub.length) + "]";
    };

    print(indent) {
        if (indent === undefined) indent = '';
        document.writeln(indent + this);
        if (this.sub !== null) {
            indent += '  ';
            for (var i = 0, max = this.sub.length; i < max; ++i)
                this.sub[i].print(indent);
        }
    };

    toPrettyString(indent) {
        if (indent === undefined) indent = '';
        var s = indent + this.typeName() + " @" + this.stream.pos;
        if (this.length >= 0)
            s += "+";
        s += this.length;
        if (this.tag & 0x20)
            s += " (constructed)";
        else if (((this.tag == 0x03) || (this.tag == 0x04)) && (this.sub !== null))
            s += " (encapsulates)";
        s += "\n";
        if (this.sub !== null) {
            indent += '  ';
            for (var i = 0, max = this.sub.length; i < max; ++i)
                s += this.sub[i].toPrettyString(indent);
        }
        return s;
    };

    toDOM() {
        var node = DOM.tag("div", "node");
        node.asn1 = this;
        var head = DOM.tag("div", "head");
        var s = this.typeName().replace(/_/g, " ");
        head.innerHTML = s;
        var content = this.content();
        if (content !== null) {
            content = String(content).replace(/</g, "&lt;");
            var preview = DOM.tag("span", "preview");
            preview.appendChild(DOM.text(content));
            head.appendChild(preview);
        }
        node.appendChild(head);
        this.node = node;
        this.head = head;
        var value = DOM.tag("div", "value");
        s = "Offset: " + this.stream.pos + "<br/>";
        s += "Length: " + this.header + "+";
        if (this.length >= 0)
            s += this.length;
        else
            s += (-this.length) + " (undefined)";
        if (this.tag & 0x20)
            s += "<br/>(constructed)";
        else if (((this.tag == 0x03) || (this.tag == 0x04)) && (this.sub !== null))
            s += "<br/>(encapsulates)";
        //TODO if (this.tag == 0x03) s += "Unused bits: "
        if (content !== null) {
            s += "<br/>Value:<br/><b>" + content + "</b>";
            if ((typeof oids === 'object') && (this.tag == 0x06)) {
                var oid = oids[content];
                if (oid) {
                    if (oid.d) s += "<br/>" + oid.d;
                    if (oid.c) s += "<br/>" + oid.c;
                    if (oid.w) s += "<br/>(warning!)";
                }
            }
        }
        value.innerHTML = s;
        node.appendChild(value);
        var sub = DOM.tag("div", "sub");
        if (this.sub !== null) {
            for (var i = 0, max = this.sub.length; i < max; ++i)
                sub.appendChild(this.sub[i].toDOM());
        }
        node.appendChild(sub);
        head.onclick = function () {
            node.className = (node.className == "node collapsed") ? "node" : "node collapsed";
        };
        return node;
    };

    posStart() {
        return this.stream.pos;
    };

    posContent() {
        return this.stream.pos + this.header;
    };

    posEnd() {
        return this.stream.pos + this.header + Math.abs(this.length);
    };

    fakeHover(current) {
        this.node.className += " hover";
        if (current)
            this.head.className += " hover";
    };

    fakeOut(current) {
        var re = / ?hover/;
        this.node.className = this.node.className.replace(re, "");
        if (current)
            this.head.className = this.head.className.replace(re, "");
    };

    toHexDOM_sub(node, className, stream, start, end) {
        if (start >= end)
            return;
        var sub = DOM.tag("span", className);
        sub.appendChild(DOM.text(
            stream.hexDump(start, end)));
        node.appendChild(sub);
    };

    toHexDOM(root) {
        var node = DOM.tag("span", "hex");
        if (root === undefined) root = node;
        this.head.hexNode = node;
        this.head.onmouseover = function () {
            this.hexNode.className = "hexCurrent";
        };
        this.head.onmouseout = function () {
            this.hexNode.className = "hex";
        };
        node.asn1 = this;
        node.onmouseover = function () {
            var current = !root.selected;
            if (current) {
                root.selected = this.asn1;
                this.className = "hexCurrent";
            }
            this.asn1.fakeHover(current);
        };
        node.onmouseout = function () {
            var current = (root.selected == this.asn1);
            this.asn1.fakeOut(current);
            if (current) {
                root.selected = null;
                this.className = "hex";
            }
        };
        this.toHexDOM_sub(node, "tag", this.stream, this.posStart(), this.posStart() + 1);
        this.toHexDOM_sub(node, (this.length >= 0) ? "dlen" : "ulen", this.stream, this.posStart() + 1, this.posContent());
        if (this.sub === null)
            node.appendChild(DOM.text(
                this.stream.hexDump(this.posContent(), this.posEnd())));
        else if (this.sub.length > 0) {
            var first = this.sub[0];
            var last = this.sub[this.sub.length - 1];
            this.toHexDOM_sub(node, "intro", this.stream, this.posContent(), first.posStart());
            for (var i = 0, max = this.sub.length; i < max; ++i)
                node.appendChild(this.sub[i].toHexDOM(root));
            this.toHexDOM_sub(node, "outro", this.stream, last.posEnd(), this.posEnd());
        }
        return node;
    };

    toHexString(root) {
        return this.stream.hexDump(this.posStart(), this.posEnd(), true);
    };

}

ASN1.decodeLength = function (stream) {
    var buf = stream.get(),
        len = buf & 0x7F;
    if (len == buf)
        return len;
    if (len > 3)
        throw "Length over 24 bits not supported at position " + (stream.pos - 1);
    if (len === 0)
        return -1; // undefined
    buf = 0;
    for (var i = 0; i < len; ++i)
        buf = (buf << 8) | stream.get();
    return buf;
};
ASN1.hasContent = function (tag, len, stream) {
    if (tag & 0x20) // constructed
        return true;
    if ((tag < 0x03) || (tag > 0x04))
        return false;
    var p = new Stream(stream);
    if (tag == 0x03) p.get(); // BitString unused bits, must be in [0, 7]
    var subTag = p.get();
    if ((subTag >> 6) & 0x01) // not (universal or context)
        return false;
    try {
        var subLength = ASN1.decodeLength(p);
        return ((p.pos - stream.pos) + subLength == len);
    } catch (exception) {
        return false;
    }
};
ASN1.decode = function (stream) {
    if (!(stream instanceof Stream))
        stream = new Stream(stream, 0);
    var streamStart = new Stream(stream),
        tag = stream.get(),
        len = ASN1.decodeLength(stream),
        header = stream.pos - streamStart.pos,
        sub = null;
    if (ASN1.hasContent(tag, len, stream)) {
        // it has content, so we decode it
        var start = stream.pos;
        if (tag == 0x03) stream.get(); // skip BitString unused bits, must be in [0, 7]
        sub = [];
        if (len >= 0) {
            // definite length
            var end = start + len;
            while (stream.pos < end)
                sub[sub.length] = ASN1.decode(stream);
            if (stream.pos != end)
                throw "Content size is not correct for container starting at offset " + start;
        } else {
            // undefined length
            try {
                for (; ;) {
                    var s = ASN1.decode(stream);
                    if (s.tag === 0)
                        break;
                    sub[sub.length] = s;
                }
                len = start - stream.pos;
            } catch (e) {
                throw "Exception while decoding undefined length content: " + e;
            }
        }
    } else
        stream.pos += len; // skip content
    return new ASN1(streamStart, header, len, tag, sub);
};
ASN1.test = function () {
    var test = [
        {value: [0x27], expected: 0x27},
        {value: [0x81, 0xC9], expected: 0xC9},
        {value: [0x83, 0xFE, 0xDC, 0xBA], expected: 0xFEDCBA}
    ];
    for (var i = 0, max = test.length; i < max; ++i) {
        var pos = 0,
            stream = new Stream(test[i].value, 0),
            res = ASN1.decodeLength(stream);
        if (res != test[i].expected)
            document.write("In test[" + i + "] expected " + test[i].expected + " got " + res + "\n");
    }
};