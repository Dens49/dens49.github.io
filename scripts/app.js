const app = {
    isLoading: false,
    spinner: document.querySelector('.loader'),
    jokeContainerElement: document.querySelector('.joke_container'),
    jokeTextElement: document.querySelector('.joke_container > .joke_text'),
    onlineStatusElement: document.querySelector('.online_status > u'),
    lastJokeLocalStorageKey: 'lastJoke',
    loadRandomJokeSyncTagPrefix: 'loadJokeSync_',
    chuckApiClient: ChuckNorrisIOApiClient
};

app.jokeLoadedCallback = (joke) => {
    app.saveLastJokeToLocalStorage(joke);
    app.displayJoke(joke);
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

app.isOnline = () => {
    if (navigator.onLine){
        app.onlineStatusElement.innerHTML = 'online';
    } else {
        app.onlineStatusElement.innerHTML = 'offline';
    }
};