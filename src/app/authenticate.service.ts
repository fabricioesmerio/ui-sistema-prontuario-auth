import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { MedModel, PatModel } from "./app.component";

interface Response {
    message: string
    token: string
}

@Injectable({
    providedIn: 'root',
})
export class AuthenticaService {

    private env: any = environment

    constructor(
        private http: HttpClient
    ) { }

    authenticaMed(authData: MedModel): Promise<Response> {
        console.log('ENV ::', this.env)
        return this.http.post<Response>(this.env.host + '/api/authenticate', authData).toPromise()
    }

    authenticaPat(pathData: PatModel): Promise<Response> {
        Object.keys(pathData).forEach(item => pathData[item] = parseInt(pathData[item]))
        return this.http.post<Response>(this.env.host + '/api/patients/authenticate', pathData).toPromise()
    }
}