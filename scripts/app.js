// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// -edited by Dennis Bystrow for educational purposes-


(function() {
    'use strict';

    let ChuckNorrisIOApiClient = {
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

    let app = {
        isLoading: false,
        spinner: document.querySelector('.loader'),
        jokeContainerElement: document.querySelector('.joke_container'),
        jokeTextElement: document.querySelector('.joke_container > .joke_text'),
        lastJokeLocalStorageKey: 'lastJoke',
        chuckApiClient: ChuckNorrisIOApiClient
    };

    app.jokeLoadedCallback = (joke) => {
        let jokeObj = JSON.parse(joke);
        app.saveLastJokeToLocalStorage(jokeObj);
        app.displayJoke(jokeObj);
    };

    app.loadRandomJoke = () => {
        app.activateSpinner();
        let joke = app.chuckApiClient.getRandomJoke(app.jokeLoadedCallback);
    };

    app.saveLastJokeToLocalStorage = (lastJoke) => {
        localStorage.setItem(app.lastJokeLocalStorageKey, JSON.stringify(lastJoke));
    };

    app.loadLastJokeFromLocalStorage = () => {
        return JSON.parse(localStorage.getItem(app.lastJokeLocalStorageKey));
    };

    app.activateSpinner = () => {
        app.isLoading = true;
        app.spinner.style.display = 'block';
    };

    app.deactivateSpinner = () => {
        app.isLoading = false;
        app.spinner.style.display = 'none';
    };

    app.displayJoke = (joke) => {
        app.jokeContainerElement.style.display = 'block';
        app.jokeTextElement.innerHTML = joke.value;
        app.deactivateSpinner();
    };

    document.getElementById('butRefresh').addEventListener('click', function() {
        // do refresh operations
        app.loadRandomJoke();
    });

    // TODO add startup code here
    let joke = app.loadLastJokeFromLocalStorage();
    if (joke) {
        app.displayJoke(joke);
    }

    // Testen, ob ServiceWorker unterstützt wird.
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function() { console.log('[ServiceWorker] Registered'); });
    }
})();
