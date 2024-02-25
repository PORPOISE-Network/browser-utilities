# 🐬 PORPOISE Network Browser Utilities

This is a simple typescript package for PORPOISE clients with no external dependencies. It implements the functions needed
for survey commitments, survey roots, and inclusion proofs that are compatible with the [PORPOISE oracle
contracts](https://github.com/PORPOISE-Network/oracle-v1). 

See the PORPOISE [survey standard](https://info.porpoise.network/whitepaper/survey-posting-standard) and 
[commitment protocol](https://info.porpoise.network/whitepaper/survey-commitment-protocol) for more information. 

## Install

If you are using the PORPOISE browser utilities in a React app (or something similar), install from npm:
```sh
npm install --save @zkporpoise/browser-utilities
```

Alternatively, include the package with a script tag in your html via [UNPKG](https://unpkg.com/):

```html
<script src="https://unpkg.com/@zkporpoise/browser-utilities@1.0.0/dist/index.js"></script>
```

## Methods 

- `computeMerkleRoot(leafs: ArrayBuffer[], proof: ArrayBuffer[], tracker: number)`: takes output of `padArrayToPowerOfTwo` for leafs, an empty array, and the index of the leaf for which the proof is needed and returns an array containing the proof array, Merkle root, and root index. The proof and root can be used for registering and resolving survey on the PORPOISE oracle. 

- `padArrayToPowerOfTwo(arr: string[], paddingValue: string)`: given an array of string elements representing a PORPOISE survey, returns sha256-hashed leaf values. Note, that leafs must be given in the order 🐬, ⏰, 🔮, 🗳️1, ... Additionally, the deadline value (⏰) is encoded as 'hex' while all other inputs are 'binary' encoded.

- `mapBigIntTo256BitNumber(bigIntValue: bigint)`: Converts a BigInt into a hex string so that hashes computed off-chain will match hashes computed on-chain for integers. 


- `arrayBufferToHex(arrayBuffer: ArrayBuffer)`: converts an ArrayBuffer to a hex string. 

## Examples

```javascript
    test('Compute the Merkle Root of a survey', () => {
        const dolphin = "When Moon?";
        const alarmclock = 1708898357455;
        const hexAlarmClock = mapBigIntTo256BitNumber(BigInt(alarmclock));
        const oracle = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
        const option1 = "Soon";
        const option2 = "NGMI";

        // expected results
        const surveyRoot = 'fbe8df6fbca5d1d3b8d1a1fde29187414985123c7b23c292630b4643c6e0e792';
        const proof1 = '1bea05448b2915e8c8aabb7b3b2aefca39dd08a667f5f1b86826cfec4724f1dd';
        const proof2 = '1003f681e3e7ac40f94da4da04a359cc066c10c4cbc1e22e26aa2e7215b281f6';
        const proof3 = '0bf89986e3662d6b50568f6a9ea422648cea72453bc7e736a29f7905869b29e5';


        return padArrayToPowerOfTwo([dolphin, hexAlarmClock, oracle, option1, option2], '0')
            .then((paddedComponents) => {
                return computeMerkleRoot(paddedComponents, [], 1);
            })
            .then((result) => {
                expect(result.length).toBe(2);
                const hexProof = result[1].map(buf => arrayBufferToHex(buf));
                expect(arrayBufferToHex(result[0])).toBe(surveyRoot);
                expect(hexProof[0]).toContain(proof1);
                expect(hexProof[1]).toContain(proof2);
                expect(hexProof[2]).toContain(proof3);
            })
    });
```