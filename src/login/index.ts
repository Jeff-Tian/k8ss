import {loginByKeycloak} from "./loginByKeycloak";

export interface ILoginArgs {
  idp: string;
}

export class NotSupportedError implements Error {

    public message: string;
    public name: string;
    constructor(s: string) {
        this.name = NotSupportedError.name
        this.message = s;
    }
}

export const login = async (args: ILoginArgs)=>{
    if(args.idp === 'keycloak') {
        return loginByKeycloak()
    }

    throw new NotSupportedError(`Login by ${args.idp} is not supported`);
}