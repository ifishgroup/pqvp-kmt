const baseUrl = 'http://localhost:3003/api/'

const config = {  
    wideMenu: false,
    apiUrl: baseUrl,
    registerUrl: baseUrl + 'users/create',
    loginUrl: baseUrl + 'users/login',
    editUserUrl: baseUrl + 'users/edit',
    deleteUserUrl: baseUrl + 'users/delete',
    allUsersUrl: baseUrl + 'users/all',
    meUrl: baseUrl + 'users/me',
    logoutUrl: baseUrl + 'users/logout',
    newArticleUrl: baseUrl + 'articles/create',
    editArticleUrl: baseUrl + 'articles/edit',
    deleteArticleUrl: baseUrl + 'articles/delete',
    allArticlesUrl: baseUrl + 'articles/all'
}

const app = {  
    error: null
}

const user = null

export default 
{  
    config,
    app,
    user
} 