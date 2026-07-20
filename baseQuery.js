console.log('ran');
fetch('http://localhost:4000/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        query: `
query Query($fooWithVarsFooVar2: String!) {
  fooWithVars(fooVar: $fooWithVarsFooVar2)
}
       `,
        variables: {
            fooWithVarsFooVar2: 'randomVar'
        }
    })
})
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    });
