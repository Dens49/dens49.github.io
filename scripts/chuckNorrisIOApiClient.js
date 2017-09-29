const ChuckNorrisIOApiClient = {
    url: 'https://api.chucknorris.io/jokes',
    getRandomJokeEndpoint: '/random',
    listCategoriesEndpoint: '/categories',
    getRandomJoke: (callback) => {
        return ChuckNorrisIOApiClient.doApiCall(ChuckNorrisIOApiClient.url + ChuckNorrisIOApiClient.getRandomJokeEndpoint, callback);
    },
    listCategories: () => {

    },
    doApiCall: (url, callback = () => {}) => {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    callback(this.responseText);
                }
                else {
                    console.log('oops... status: ' + this.status);
                }
            }
        };
        xhttp.open('GET', url, true);
        xhttp.send();
    }
};