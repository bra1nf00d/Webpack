console.log('Hello Webpack');

const promise = new Promise((resolve) => {
    setTimeout(() => {
        resolve('Promise done');
    }, 1000);
});

promise.then((result) => {
    console.log(result);
});
