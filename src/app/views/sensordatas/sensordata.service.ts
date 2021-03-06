import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Sensordata } from './sensordata.model';
import { AgriHub } from '../core/global/agrihub';

import { CredentialsService } from '../core/authenticate/credentials.service';

@Injectable()
export class SensordataService {
    private url = AgriHub.BASE_API_URL + '/sensordatas';
    private headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this.credentialsService.getToken()
    });

    constructor(
        private http: Http,
        private credentialsService: CredentialsService
    ) { }

    getSensorDataByUser(page: number = 1, date_start = "", date_end = ""): Observable<any> {
        var user = this.credentialsService.getUser().username;
        var filter = this.getFilterQuery(date_start, date_end);

        return this.http.get(`${this.url}?page=${page}${filter}`, { headers: this.headers })
            .map(this.extractData)
            .catch(this.handleError);
    }

    getSensorDataBySupernode(page: number = 1, supernodeid: string,
        date_start = "", date_end = ""): Observable<any> {
        var filter = this.getFilterQuery(date_start, date_end);
        return this.http.get(
            `${this.url}/supernode/${supernodeid}/?page=${page}${filter}`,
            { headers: this.headers }
        ).map(this.extractData)
        .catch(this.handleError);
    }

    getSensorDataBySupernodeSensor(page: number = 1, supernodeid: string, sensorid: string,
        date_start = "", date_end = ""): Observable<any> {
        var filter = this.getFilterQuery(date_start, date_end);
        return this.http.get(
            `${this.url}/supernode/${supernodeid}/sensor/${sensorid}/?page=${page}${filter}`,
            { headers: this.headers }
        ).map(this.extractData)
        .catch(this.handleError);
    }

    getSensorDataByNode(page: number = 1, nodeid: string, 
        date_start = "", date_end = ""): Observable<any> {
        var filter = this.getFilterQuery(date_start, date_end);
        return this.http.get(
            `${this.url}/node/${nodeid}/?page=${page}${filter}`, 
            { headers: this.headers }
        ).map(this.extractData)
        .catch(this.handleError);
    }

    getSensorDataBySensor(page: number = 1, nodeid: string, sensorid: string,
        date_start = "", date_end = ""): Observable<any> {
        var filter = this.getFilterQuery(date_start, date_end);
        return this.http.get(
            `${this.url}/node/${nodeid}/sensor/${sensorid}/?page=${page}${filter}`,
            { headers: this.headers }
        ).map(this.extractData)
        .catch(this.handleError);
    }

    private getFilterQuery(date_start = "", date_end = ""): string {
        var filter = "";
        if (date_start) {
            filter += `&&start=${date_start}`
        }

        if (date_end) {
            filter += `&&end=${date_end}`
        }
        return filter;
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}