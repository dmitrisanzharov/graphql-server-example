console.log('============================');

fetch('http://localhost:4000/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        query: `
            query Query($singleReviewId: ID!) {
            singleReview(id: $singleReviewId) {
                content
                id
                author_id
                game_id
                rating
            }
            }
        `,
        variables: {
            singleReviewId: '2'
        }
    })
})
    .then((res) => res.json())
    .then((data) => console.log('data', data))
    .catch((err) => console.log('err', err));
