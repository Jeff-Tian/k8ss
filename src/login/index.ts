import {loginByKeycloak} from "./loginByKeycloak";

export interface ILoginArgs {
  idp: string;
}

export class NotSupportedError implements Error {
    constructor(s: string) {
        this.name = NotSupportedError.name
        this.message = s;
    }

    message: string;
    name: string;
}

export const login = async (args: ILoginArgs)=>{
    if(args.idp === 'keycloak') {
        return loginByKeycloak()
    }

    throw new NotSupportedError(`Login by ${args.idp} is not supported`);
}