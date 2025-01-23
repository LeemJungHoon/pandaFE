const axios = require('axios').default;

const instance = axios.create({
    baseURL: 'http://kdt-sw-6-team10.elicecoding.com'
  });

const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InMzTTBBenBwTiIsImF1dGgiOnRydWUsImlhdCI6MTY5NzEzMjM4MSwiZXhwIjoxNjk3MTM5NTgxfQ.ipEDfB4fj6CQNPV-dGt7TDdupILM-ok3-1ifm_Zi-Kw'//로컬스토리지 저장 이름



// instance.get('/api/admin/orders', {
// headers : {
//     Authorization : "Bearer " + jwtToken
// }
// }
// )
// .then((response) => { 
//     console.log(response.data);
// })


