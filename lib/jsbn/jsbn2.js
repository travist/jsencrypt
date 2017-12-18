// Copyright (c) 2005-2009  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Extended JavaScript BN functions, required for RSA private ops.

// Version 1.1: new BigInteger("0", 10) returns "proper" zero
// Version 1.2: square() API, isProbablePrime fix

import {BigInteger, nbi} from "./jsbn";
export {BigInteger} from "./jsbn";

export function parseBigInt(str,r) {
  return new BigInteger(str,r);
}
































































































// protected


// public


// JSBN-specific extension


// BigInteger interfaces not implemented in jsbn:

// BigInteger(int signum, byte[] magnitude)
// double doubleValue()
// float floatValue()
// int hashCode()
// long longValue()
// static BigInteger valueOf(long val)
