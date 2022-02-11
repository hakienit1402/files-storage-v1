export const getTotal = async (type) => {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    const data = await fetch(`http://localhost:8080/api/admin/${type}`, requestOptions);
    return await data.json();
}