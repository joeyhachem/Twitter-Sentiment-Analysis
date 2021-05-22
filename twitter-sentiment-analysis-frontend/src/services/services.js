export function fetchUserAnalysis(inputText) {
    return fetch(`http://localhost:5000/all-tweets/${inputText}/350/600`, {
        "method": "GET",
    })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            return response;
        })
        .catch(err => {
            console.log(err);
            return err;
        });
}
