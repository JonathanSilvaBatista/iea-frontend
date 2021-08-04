
//Desenvolvimento
export const urls = {
   // baseURL: 'https://web.unimedpg.com.br:8443/OpmeAPITeste/rest'
}

//Produção
// export const urls = {
//     baseURL: 'https://web.unimedpg.com.br:8443/GestaoPrestadoresAPI/rest'
// }

//Retorna o token salvo nos cookies do navegador para realizar a requisição
export function getToken(){
    var aux = document.cookie.split(';');
    var token = null;
    aux.forEach(element => {
        if (element.match(new RegExp(/token/g)))
            token = { headers: { 'Authorization': element.replace('token=', '').trim() } };
    });
    return token;
}

export function getOnlyToken(){
    var aux = document.cookie.split(';');
    var token = null;
    aux.forEach(element => {
        if (element.match(new RegExp(/token/g)))
            token = element.replace('token=', '').trim();
    });
    return token;
}