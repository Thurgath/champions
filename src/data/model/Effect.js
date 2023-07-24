import * as EFFECT from '../ids/effects';

class Effect {
    constructor({
        uid = 'effect',
        base = 0,
        amount = 0,
    }) {
        this.attr = {
            uid,
            base,
            amount,
        };
    }

    toJSON() {
        return this.attr;
    }
}

export default Effect;
export { EFFECT };
export function effectExists(effect) {
    return EFFECT_VALUES.indexOf(effect) !== -1;
}
export const EFFECT_VALUES = Object.values(EFFECT);
