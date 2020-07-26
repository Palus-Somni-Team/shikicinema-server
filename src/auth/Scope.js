const ALL_SCOPES = [
    'admin',
    'banned',
    'database',
        'database:shikivideos',
        'database:shikivideos_create',
        'database:articles',
    'default',
    'user',
        'user:modify'
];

const SCOPES_COMPARATOR = {
    MORE: 1,
    LESS: -1,
    EQUAL: 0,
    INCOMPARABLE: {}
};

class Scope {
    constructor(scope) {
        if (ALL_SCOPES.includes(scope))
            this.scope = scope;
        else this.scope = 'default';
    }

    static compare(left_scope, right_scope) {
        if (ALL_SCOPES.includes(left_scope) && ALL_SCOPES.includes(right_scope)) {
            if (left_scope === right_scope) {
                return SCOPES_COMPARATOR.EQUAL;
            } else if (left_scope.includes(right_scope)) {
                return SCOPES_COMPARATOR.LESS;
            } else if (right_scope.includes(left_scope) || left_scope === 'default') {
                return SCOPES_COMPARATOR.MORE
            } else
                return SCOPES_COMPARATOR.INCOMPARABLE;
        } else throw new Error(`Invalid scopes to compare: ${left_scope} and ${right_scope}`);
    }

    static normilize(scopes) {
        let scopes_set = new Set(`${scopes}`.split(';'));
        let normilized = new Set([]);

        // TODO: remove scopes with fewer permissions
        scopes_set.forEach(scope => {
            let scope_obj = new Scope(scope);

            normilized.add(scope_obj.toString());
        });

        if (normilized.length === 0)
            normilized.add('default');

        return Array.from(normilized);
    }

    /**
     * Compares a Scopes instance with another string scope
     * @param {string} scope
     * @returns {number} -1 if passed argument has more permissions, 0 if equal, 1 otherwise
     * @throws {Error}
     */
    compareWith(scope) {
        const scope_obj = typeof scope === typeof Scope ? scope : new Scope(scope);

        return Scope.compare(this.scope, scope_obj.scope);
    }

    isAllowedFor(scope) {
        const cmp = this.compareWith(scope);
        return cmp === SCOPES_COMPARATOR.EQUAL || cmp === SCOPES_COMPARATOR.MORE;
    }

    toString() {
        return `${this.scope}`;
    }
}

module.exports = {
    Scope: Scope,
    AVAILABLE_SCOPE: ALL_SCOPES,
    SCOPES_COMPARATOR: SCOPES_COMPARATOR
};
