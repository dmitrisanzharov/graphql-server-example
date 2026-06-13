fetch('http://localhost:4000', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        query: `
query ($singleGameByIdId: ID!) {
  singleGameById(id: $singleGameByIdId) {
    id
    platforms
    title
  }
}
        `,
        variables: {
            singleGameByIdId: '3'
        }
    })
})
    .then((res) => res.json())
    .then((data) => console.log(data));
