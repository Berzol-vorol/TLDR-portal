const apiURL = process.env.REACT_APP_BACKEND_URL;

export async function fetchSummariesForUser(id) {
    let response = await fetch(apiURL + '/api/summaries/user/' + id)
    let result = await response.json();
    console.log(result)
    return result.summaries;
}

export async function fetchAllSummaries() {
    let response = await fetch(apiURL + '/api/summaries/')
    let result = await response.json();
    console.log(result)
    return result.summaries;
}

export async function fetchSummary(id) {
    let response = await fetch(apiURL + '/api/summaries/'+ id)
    let result = await response.json();
    console.log(result)
    return result.summary;
}

export async function fetchUserById(id) {
    let response = await fetch(apiURL + '/api/users/'+ id)
    let result = await response.json();
    console.log(result)
    return result.user;
}

export async function fetchUserByToken(token) {
    let response = await fetch(apiURL + '/api/users/check_auth/'+ token)
    let result = await response.json();
    console.log(result)
    return result;
}

export async function fetchReview(id) {
    let response = await fetch(apiURL + '/api/reviews/'+ id)
    let result = await response.json();
    console.log(result)
    return result.review;
}

export async function addReview(review) {
    let response = await fetch(apiURL + '/api/reviews', {
        headers: { 'Content-Type': 'application/json' },
        method : 'POST',
        body: JSON.stringify(review)
    })
    let result = await response.json();
    console.log(result)
    return result.review;
}

export async function editSummary(summary) {
    let response = await fetch(apiURL + '/api/summaries/' + summary.id , {
        headers: { 'Content-Type': 'application/json' },
        method : 'PATCH',
        body: JSON.stringify(summary)
    })
    let result = await response.json();
    console.log(result)
    return result.review;
}

export async function editSummaryMark(summary) {
    let response = await fetch(apiURL + '/api/summaries/mark/' + summary.id , {
        headers: { 'Content-Type': 'application/json' },
        method : 'PATCH',
        body: JSON.stringify(summary)
    })
    let result = await response.json();
    console.log(result)
    return result.review;
}

export async function editReview(review){
    let response = await fetch(apiURL + '/api/reviews/' + review.id , {
        headers: { 'Content-Type': 'application/json' },
        method : 'PATCH',
        body: JSON.stringify(review)
    })
    let result = await response.json();
    console.log(result)
    return result.review;
}

export async function loginUser(user) {
    let response = await fetch(apiURL + '/api/users/login',{
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(user)
    })

    let result = await response.json();
    console.log(result)
    return result.user;

}

export async function signUpUser(user) {
    let response = await fetch(apiURL + '/api/users/signup',{
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    })

    let result = await response.json();
    console.log(result)
    return result.user;

}

export async function updateUserImg(user) {

    let response = await fetch(apiURL + '/api/users/' + user.id,{
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
        body: JSON.stringify(user)
    })

    let result = await response.json();
    console.log(result)
    return result.user;

}

export async function addSummary(summary){
    let response = await fetch(apiURL + '/api/summaries',{
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summary)
    })

    let result = await response.json();
    console.log(result)
    return result.summary;
}

export async function generateSummary(summary){
    let response = await fetch(apiURL + '/api/summaries/auto_generated',{
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summary)
    })

    let result = await response.json();
    console.log(result)
    return result.summary;
}