export function helloWorld(): string {
    return "🐬 Hello World!";
}

export async function hashBuffer(data: ArrayBuffer): Promise<ArrayBuffer> {
    return crypto.subtle.digest('SHA-256', data)
}

/*export function padArrayToPowerOfTwo(arr: string[], paddingValue: string): ArrayBuffer[] {
    // Check if the array length is already a power of 2
    if ((arr.length & (arr.length - 1)) === 0) {
        return arr.map((elem: string, index: number) => {
            if (index === 1) {
                // for the time element, it must be hex encoded
                return crypto.createHash("sha256").update(Buffer.from(elem, 'hex')).digest();
            } else {
                return crypto.createHash("sha256").update(Buffer.from(elem, 'binary')).digest();
            }
        }); // Array length is already a power of 2, no padding needed
    }

    // Calculate the next power of 2 greater than the current length
    const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(arr.length)));

    // Calculate the number of elements to pad
    const paddingCount = nextPowerOfTwo - arr.length;

    // Pad the array with the specified paddingValue (default is undefined)
    return arr.concat(new Array(paddingCount).fill(paddingValue)).map((elem: string, index: number) => {
        if (index === 1) {
            // for the time element, it must be hex encoded
            return crypto.createHash("sha256").update(Buffer.from(elem, 'hex')).digest();
        } else {
            return crypto.createHash("sha256").update(Buffer.from(elem, 'binary')).digest();
        }
    });
}*/