fetch('http://localhost:4000/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        query: `
            query Author($authorId: ID!) {
                author(id: $authorId) {
                    id
                    name
                    verified
                }
            }
        `,
        variables: {
            authorId: '2'
        }
    })
})
    .then((res) => res.json())
    .then((data) => {
        console.log(JSON.stringify(data, null, 2));
    });
