'use strict';

class ApiClient {
    constructor(id, baseUrl, endpoints = []) {
        this.id = id;
        this.baseUrl = baseUrl;
        this.endpoints = endpoints;
    }

    doApiCall(id,
              queryParams = [],
              successCallback = ApiClient.defaultSuccessCallback,
              errorCallback = ApiClient.defaultErrorCallback) {
        let endpoint = this.endpoints.find((endpoint) => endpoint.id === id);
        let request = endpoint.buildRequest(this.baseUrl, queryParams);

        fetch(request).then((response) => {
            //  response is ok if status is between 200 and 299
            if (response.ok) {
                return response.json();
            }
            throw new Error('Fetching ' + response.url + ' resulted in error: status '
                + response.status + ' (status text: ' + response.statusText + ').',);
        })
        .then(successCallback)
        .catch(errorCallback);
    }

    static defaultSuccessCallback(responseData) {
        console.log(responseData);
    }

    static defaultErrorCallback(error) {
        console.log(error);
    }
}
