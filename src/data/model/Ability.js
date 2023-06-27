import * as ABILITY from '../ids/abilities';

class Ability {
    constructor({
        uid = 'ability',
    }) {
        this.attr = {
            uid,
        };
    }

    toJSON() {
        return this.attr;
    }
}

export default Ability;
export { ABILITY };
export const ABILITY_VALUES = Object.values(ABILITY);
