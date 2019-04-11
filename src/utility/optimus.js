import Optimus from 'optimus-js';

const optimus = new Optimus(1580030173, 59260789, 1163945558);

class OptimalHash {
    encode(plainText) {
        return optimus.encode(plainText)
    }

    decode(cyperText) {
        return optimus.decode(cyperText);
    }

}

export default new OptimalHash();