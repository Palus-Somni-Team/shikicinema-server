import {Scope} from '../models/Scope';

class ScopesService {
    readonly scopes: readonly Scope[];
    private static _instance: ScopesService;

    private constructor(scopes: Scope[]) {
        this.scopes = scopes;
    };

    static async getInstance(): Promise<ScopesService> {
        if (!ScopesService._instance) {
            try {
                const knownScopes = await Scope.findAll();
                ScopesService._instance = new ScopesService(knownScopes);
            } catch (e) {
                return Promise.reject(e);
            }
        }

        return Promise.resolve(ScopesService._instance);
    }

    public rawToDTO(scopes: Scope[]): string[] {
        return scopes?.map((s) => s.value) || [];
    }

    public dtoToRaw(scopes: string[]): Scope[] {
        scopes = scopes || [];
        return this.scopes.filter((scope) => scopes.includes(scope.value));
    }
}

export default ScopesService.getInstance();
