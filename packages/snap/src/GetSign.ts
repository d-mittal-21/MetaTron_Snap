import {ec as EC} from 'elliptic';
import CryptoJS from 'crypto-js';
const keccak256 = CryptoJS.SHA3;
const sha256 = CryptoJS.SHA256;
const ALPHABET : any = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const ALPHABET_MAP : any = {};
const ADDRESS_PREFIX: any  = '41';
for (let i = 0; i < ALPHABET.length; i++)
    ALPHABET_MAP[ALPHABET.charAt(i)] = i;
const BASE = 58;
function encode58(buffer: any) {
    if (buffer.length === 0)
        return '';

    let i;
    let j;

    const digits = [0];

    for (i = 0; i < buffer.length; i++) {
        for (j = 0; j < digits.length; j++)
            digits[j] <<= 8;

        digits[0] += buffer[i];
        let carry = 0;

        for (j = 0; j < digits.length; ++j) {
            digits[j] += carry;
            carry = (digits[j] / BASE) | 0;
            digits[j] %= BASE
        }

        while (carry) {
            digits.push(carry % BASE);
            carry = (carry / BASE) | 0
        }
    }

    for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++)
        digits.push(0);

    return digits.reverse().map(digit => ALPHABET[digit]).join('');
}
function hexChar2byte(c : any) {
    let d;

    if (c >= 'A' && c <= 'F')
        d = c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
    else if (c >= 'a' && c <= 'f')
        d = c.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
    else if (c >= '0' && c <= '9')
        d = c.charCodeAt(0) - '0'.charCodeAt(0);

    if (typeof d === 'number')
        return d;
    else
        throw new Error('The passed hex char is not a valid hex char');
}
function isHexChar(c: any) {
    if ((c >= 'A' && c <= 'F') ||
        (c >= 'a' && c <= 'f') ||
        (c >= '0' && c <= '9')) {
        return 1;
    }

    return 0;
}

function hexStr2byteArray(str: any, strict = false) {
    console.log(str,typeof str);
    if (typeof str !== 'string')
        throw new Error('The passed string is not a string')

    let len = str.length;

    if (strict) {
        if (len % 2) {
            str = `0${str}`;
            len++;
        }
    }
    const byteArray = Array();
    let d = 0;
    let j = 0;
    let k = 0;

    for (let i = 0; i < len; i++) {
        const c = str.charAt(i);

        if (isHexChar(c)) {
            d <<= 4;
            d += hexChar2byte(c);
            j++;

            if (0 === (j % 2)) {
                byteArray[k++] = d;
                d = 0;
            }
        } else
            throw new Error('The passed hex char is not a valid hex string')
    }

    return byteArray;
}
function byte2hexStr(byte: any) {
    if (typeof byte !== 'number')
        throw new Error('Input must be a number');

    if (byte < 0 || byte > 255)
        throw new Error('Input must be a byte');

    const hexByteMap = '0123456789ABCDEF';

    let str = '';
    str += hexByteMap.charAt(byte >> 4);
    str += hexByteMap.charAt(byte & 0x0f);

    return str;
}
function ECKeySign(hashBytes : any, priKeyBytes : any) {
    const ec = new EC('secp256k1');
    const key = ec.keyFromPrivate(priKeyBytes, 'bytes');
    const signature = key.sign(hashBytes);
    const r = signature.r;
    const s = signature.s;
    const id = signature.recoveryParam;

    let rHex = r.toString('hex');

    while (rHex.length < 64) {
        rHex = `0${rHex}`;
    }

    let sHex = s.toString('hex');

    while (sHex.length < 64) {
        sHex = `0${sHex}`;
    }

    const idHex = byte2hexStr(id);
    const signHex = rHex + sHex + idHex;

    return signHex;
}

export function signTransaction(priKeyBytes: any, transaction : any) {
    if (typeof priKeyBytes === 'string')
        priKeyBytes = hexStr2byteArray(priKeyBytes);

    const txID = transaction.txID;
    console.log(transaction,5)
    console.log(txID);
    const signature = ECKeySign(hexStr2byteArray(txID), priKeyBytes);

    if (Array.isArray(transaction.signature)) {
        if (!transaction.signature.includes(signature))
            transaction.signature.push(signature);
    } else
        transaction.signature = [signature];
    console.log(transaction);
    return transaction;
}