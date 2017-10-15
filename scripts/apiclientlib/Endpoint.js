'use strict';

class Endpoint {
    constructor(id, location, method = 'GET', requiredQueryParams = [], optionalQueryParams = []) {
        this.id = id;
        this.location = location;
        this.method = method;
        this.requiredQueryParams = requiredQueryParams;
        this.optionalQueryParams = optionalQueryParams;
    }

    buildRequest(baseUrl, queryParams) {
        let filteredParams = this.filterQueryParams(queryParams);
        let url = baseUrl + this.location;
        let options = {
            method: this.method,
            mode: 'cors'
        };
        return new Request(url, options);
    }

    filterQueryParams(params) {
        let filteredParams = [];
        for (let param of params) {
            if (this.requiredQueryParams.indexOf(param) > -1
                || this.optionalQueryParams.indexOf(param) > -1) {
                filteredParams.push(param);
            }
        }

        // check whether every required query param was supplied
        let missingParams = '';
        for (let param of this.requiredQueryParams) {
            if (missingParams !== '') {
                missingParams += ', ';
            }
            if (filteredParams.indexOf(param) === -1) {
                missingParams += param ;
            }
        }
        if (missingParams !== '') {
            throw new Error('Missing required query parameter(s): ' + missingParams);
        }

        return filteredParams;
    }
}
