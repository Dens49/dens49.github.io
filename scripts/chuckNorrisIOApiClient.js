'use strict';

class ChuckNorrisIOApiClient extends ApiClient {
    static get baseUrl() {
        return 'https://api.chucknorris.io/jokes';
    }

    constructor() {
        super('Chuck-Norris-io-Api-Client',
            ChuckNorrisIOApiClient.baseUrl,
            [
                new Endpoint('random', '/random', 'GET', [], ['category']),
                new Endpoint('categories', '/categories', 'GET', [], []),
                new Endpoint('search', '/search', 'GET', [], ['query']),
            ]);
    }

    getRandomJoke(successCallback = ApiClient.defaultSuccessCallback, errorCallback = ApiClient.defaultErrorCallback) {
        return this.doApiCall('random', [], successCallback, errorCallback);
    }
}
