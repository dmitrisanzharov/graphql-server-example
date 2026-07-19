console.log('ran');
fetch('http://localhost:4000/', {
   method: 'POST',
   headers: {
       'Content-Type': 'application/json'
   },
   body: JSON.stringify({
       query: `
           query AnyName{
               foo
           }
       `
   })
})
.then(res => res.json())
.then(data => {
   console.log(data);
});
