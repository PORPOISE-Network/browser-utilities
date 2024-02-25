import {
    helloWorld,
    hashBuffer,
    stringToBuffer,
    mapBigIntTo256BitNumber,
    padArrayToPowerOfTwo,
    arrayBufferToHex,
    computeMerkleRoot,
} from "../dist/index";

describe('Hello World', () => {
    test('should return the correct value', () => {
        expect(helloWorld()).toBe('🐬 Hello World!');
    });
});

describe('Type conversions', () => {
    test('Should map a timestamp to a hex string', () => {
        const arbitraryTimeStamp = 1708898357455;
        const hexTime = mapBigIntTo256BitNumber(BigInt(arbitraryTimeStamp));
        const result = "0000000000000000000000000000000000000000000000000000018de24790cf";
        expect(hexTime).toBe(result);
    });
});

describe('Hashing', () => {
    test('Hash a regular string', () => {
        const myString = helloWorld();
        const data = stringToBuffer(myString, 'utf8');
        const result = "a61391aecaa05c56e9225df1b7889880e22698a2a110267808b31d81be3ca544";
        return hashBuffer(data).then((outputHash) => {
            const hashArray = Array.from(new Uint8Array(outputHash));
            const hexHashString = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
            expect(hexHashString).toBe(result);
        })
    });
    test('Hash a hex string', () => {
        const hexString = "0000000000000000000000000000000000000000000000000000018de24790cf";
        const hexBuffer = stringToBuffer(hexString, 'hex')
        const result = '347d479ea8e050e1442ce049352519a039cb0d8ee0747899e986e80e667b8818';
        expect(hexBuffer.byteLength).toBe(32);
        return hashBuffer(hexBuffer).then((outputHash) => {
            const hashArray = Array.from(new Uint8Array(outputHash));
            const hexHashString = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
            expect(hexHashString).toBe(result);
        })
    });
});

describe('Merkle Tree Operations', () => {
    test('Pad a survey array to the next power of 2', () => {
        const dolphin = "When Moon?";
        const alarmclock = new Date().getTime() + 86400000;
        const hexAlarmClock = mapBigIntTo256BitNumber(BigInt(alarmclock));
        const oracle = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
        const option1 = "Soon";
        const option2 = "NGMI";

        const dolphinHash = '1bea05448b2915e8c8aabb7b3b2aefca39dd08a667f5f1b86826cfec4724f1dd';
        const option1Hash = 'cf0ee3547a4e51a52304eb720431ff5a38bf9561d8a1537953d6ddfc9edb04ce';
        const paddingHash = '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9';

        return padArrayToPowerOfTwo([dolphin, hexAlarmClock, oracle, option1, option2], '0')
            .then((paddedComponents) => {
                const paddedComponentsHex = paddedComponents.map(buf => arrayBufferToHex(buf));
                expect(paddedComponents.length).toBe(8);
                expect(paddedComponentsHex).toContain(dolphinHash);
                expect(paddedComponentsHex).toContain(option1Hash);
                expect(paddedComponentsHex).toContain(paddingHash);
            })
    });
    test('Compute the Merkle Root of a survey', () => {
        const dolphin = "When Moon?";
        const alarmclock = new Date().getTime() + 86400000;
        const hexAlarmClock = mapBigIntTo256BitNumber(BigInt(alarmclock));
        const oracle = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
        const option1 = "Soon";
        const option2 = "NGMI";

        const dolphinHash = '1bea05448b2915e8c8aabb7b3b2aefca39dd08a667f5f1b86826cfec4724f1dd';
        const option1Hash = 'cf0ee3547a4e51a52304eb720431ff5a38bf9561d8a1537953d6ddfc9edb04ce';
        const paddingHash = '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9';

        return padArrayToPowerOfTwo([dolphin, hexAlarmClock, oracle, option1, option2], '0')
            .then((paddedComponents) => {
                return computeMerkleRoot(paddedComponents, [], 1);
            })
            .then((result) => {
                const hexProof = result[1].map(buf => arrayBufferToHex(buf));
                console.log("Hex Proof: ", hexProof);
                console.log("Root: ", arrayBufferToHex(result[0]));
                expect(result.length).toBe(2);
            })
    });
});