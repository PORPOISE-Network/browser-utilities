export function helloWorld(): string {
    return "🐬 Hello World!";
}

export async function hashBuffer(data: ArrayBuffer): Promise<ArrayBuffer> {
    return await crypto.subtle.digest('SHA-256', data)
}

export function arrayBufferToHex(arrayBuffer: ArrayBuffer): string {
    const uint8Array = new Uint8Array(arrayBuffer);
    return Array.prototype.map.call(uint8Array, byte => {
        return ('0' + byte.toString(16)).slice(-2);
    }).join('');
}

export function mapBigIntTo256BitNumber(bigIntValue: bigint): string {
    // Convert the BigInt to a hexadecimal string
    let hexString = bigIntValue.toString(16);

    // Pad the hexadecimal string with zeros to ensure it is 64 characters long
    while (hexString.length < 64) {
        hexString = '0' + hexString;
    }

    return hexString;
}

export function stringToBuffer(str: string, encoding: string): ArrayBuffer {
    if (encoding === 'utf8' || encoding === 'utf-8') {
        const encoder = new TextEncoder();
        return encoder.encode(str).buffer;
    } else if (encoding === 'hex') {
        if (str.length % 2 !== 0) {
            throw new Error("Hex string must have an even number of characters");
        }

        const uint8Array = new Uint8Array(str.length / 2);

        for (let i = 0; i < str.length; i += 2) {
            const byteValue = parseInt(str.substring(i, i + 2), 16);
            uint8Array[i / 2] = byteValue;
        }

        return uint8Array.buffer;
    } else {
        return new ArrayBuffer(0);
    }
}

export async function padArrayToPowerOfTwo(arr: string[], paddingValue: string): Promise<ArrayBuffer[]> {
    // Check if the array length is already a power of 2
    if ((arr.length & (arr.length - 1)) === 0) {
        return Promise.all(arr.map((elem: string, index: number) => {
            if (index === 1) {
                // for the time element, it must be hex encoded
                return hashBuffer(stringToBuffer(elem, 'hex'));
            } else {
                return hashBuffer(stringToBuffer(elem, 'utf8'));
            }
        })); // Array length is already a power of 2, no padding needed
    }

    // Calculate the next power of 2 greater than the current length
    const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(arr.length)));

    // Calculate the number of elements to pad
    const paddingCount = nextPowerOfTwo - arr.length;

    // Pad the array with the specified paddingValue (default is undefined)
    return Promise.all(arr.concat(new Array(paddingCount).fill(paddingValue))
        .map((elem: string, index: number) => {
            if (index === 1) {
                // for the time element, it must be hex encoded
                return hashBuffer(stringToBuffer(elem, 'hex'));
            } else {
                return hashBuffer(stringToBuffer(elem, 'utf8'));
            }
        }));
}

export async function computeMerkleRoot(leafs: ArrayBuffer[], proof: ArrayBuffer[], tracker: number): Promise<[ArrayBuffer, ArrayBuffer[]]> {
    // Base case: if there's only one element, return its hash
    if (leafs.length === 1) {
        return [leafs[0], proof];
    }

    // Recursive case: compute hash of pairs until a single hash is obtained
    const pairedHashes: ArrayBuffer[] = [];
    let j: number = 0;
    for (let i = 0; i < leafs.length; i += 2, j++) {
        const a = leafs[i];
        const b = leafs[i + 1];
        if (tracker === i) {
            proof.push(b);
            tracker = j;
        } else if (tracker === (i + 1)) {
            proof.push(a);
            tracker = j;
        }

        const pairHash = (uint8ArrayToBigInt(new Uint8Array(a)) < uint8ArrayToBigInt(new Uint8Array(b))) ?
            await hashBuffer(concatArrayBuffers(a, b)) :
            await hashBuffer(concatArrayBuffers(b, a));

        pairedHashes.push(pairHash);
    }

    // Recursively compute the Merkle root for the paired hashes
    return computeMerkleRoot(pairedHashes, proof, tracker);
}

function concatArrayBuffers(buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer {
    const combinedLength: number = buffer1.byteLength + buffer2.byteLength;
    const combinedArray: Uint8Array = new Uint8Array(combinedLength);

    combinedArray.set(new Uint8Array(buffer1), 0);
    combinedArray.set(new Uint8Array(buffer2), buffer1.byteLength);

    return combinedArray.buffer;
}

function uint8ArrayToBigInt(uint8Array: Uint8Array): BigInt {
    let result: bigint = BigInt(0);
    for (let i = 0; i < uint8Array.length; i++) {
        result = result << BigInt(8);
        result = result + BigInt(uint8Array[i]);
    }
    return result;
}