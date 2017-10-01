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

    let joke = app.loadLastJokeFromLocalStorage();
    if (joke) {
        app.displayJoke(joke);
    }

    window.addEventListener('online', app.isOnline);
    window.addEventListener('offline', app.isOnline);
    app.isOnline();

    // Testen, ob ServiceWorker unterstützt wird und registrieren
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
            .then(() => {
                console.log('[ServiceWorker] Registered');
            }
        );
        navigator.serviceWorker.addEventListener('message', (e) => {
            app.jokeLoadedCallback(e.data.joke);
        });
    }
    else {
        let warning = 'Your Browser doesn\'t support service worker.\nYou should be ashamed of yourself.';
        console.log(warning);
        alert(warning);
    }

    // inspired by: https://jakearchibald.github.io/isserviceworkerready/demos/sync/
    // Erlaubnis einholen notifications zu zeigen und request mit backgroundsync
    document.getElementById('butRefresh').addEventListener('click', () => {
        app.activateSpinner();
        fetch(ChuckNorrisIOApiClient.url + ChuckNorrisIOApiClient.getRandomJokeEndpoint)
        .then((response) => {
                return response.json();
        }).then((data) => {
            app.jokeLoadedCallback(data);
        }).catch((error) => {
            app.deactivateSpinner();
            console.log('Error: ' + error.message);
            app.jokeTextElement.innerHTML = '<span style="color: #f00">Failed to fetch new Chuck Norris Fact. Trying background sync.You will be notified when it\'s fetched.</span>';

            // refresh mit background sync
            new Promise((resolve, reject) => {
                Notification.requestPermission((result) => {
                    if (result !== 'granted') {
                        return reject(Error('Notification permission denied'));
                    }
                    resolve();
                })
            }).then(() => {
                return navigator.serviceWorker.ready;
            }).then((reg) => {
                return reg.sync.register(app.loadRandomJokeSyncTagPrefix + (new Date()).getTime());
            }).then(() => {
                console.log('New sync registered successfully');
            }).catch((error) => {
                app.deactivateSpinner();
                console.log('Error: ' + error.message);
            });
        });

    });
})();