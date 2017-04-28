import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import generator from './mocks/mock-metricnames'

@Injectable()
export class QueryService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
//    private baseUrl = location.protocol + '//' + location.host;
    private baseUrl = location.protocol + '//localhost:8080';
    private metricNamesUrl = this.baseUrl + '/api/v1/metricnames';
    private tagsUrl = this.baseUrl + '/api/v1/datapoints/query/tags';
    private queryUrl = this.baseUrl + '/api/v1/datapoints/query';

    constructor(private http: Http) { }

    getMetricNames(): Promise<string[]> {
        return this.http.get(this.metricNamesUrl)
        .toPromise()
        .then(response => response.json().results || [] as string[])
        .catch(this.handleError);
    }

    /*
    getMetricNames(): Promise<string[]> {
    return Promise.resolve(generator.metricnames(10000));
}
*/

getTagNameValues(metricName: string): Promise<any> {
    return this.http.post(this.tagsUrl, JSON.stringify({ cache_time: 0, start_absolute: 0, metrics: [{ tags: {}, name: metricName }] }), { headers: this.headers })
    .toPromise()
    .then(response => response.json().queries[0].results[0].tags || {})
    .catch(this.handleError);
}

executeQuery(query: string): Promise<any> {
    return this.http.post(this.queryUrl, query, { headers: this.headers })
    .toPromise()
    .then(response => response.json().queries || [])
    .catch(this.handleError);
}

private handleError(error: any): Promise<any> {
    console.error('Query service logging: promise rejected with reason', error); // for demo purposes only
    return Promise.reject(error.message || error);
}
}
