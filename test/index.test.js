import { 
    helloWorld,
    hashBuffer,
 } from "../dist/index";

describe('Hello World', () => {
    test('should return the correct value', () => {
        expect(helloWorld()).toBe('🐬 Hello World!');
    });
});

describe('Hashing', () => {
    test('Basic string hash', () => {
        const myString = helloWorld();
        const data = new TextEncoder().encode(myString);
        const result = "a61391aecaa05c56e9225df1b7889880e22698a2a110267808b31d81be3ca544";
        return hashBuffer(data).then((outputHash) => {
            const hashArray = Array.from(new Uint8Array(outputHash));
            const hexHashString = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
            expect(hexHashString).toBe(result);
        })
    });
});