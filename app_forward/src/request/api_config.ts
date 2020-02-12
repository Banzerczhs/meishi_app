interface config {
    [key: string] : any,
    development? : Object,
    production? : Object
}

const api_config:config={
    development : {
        baseUrl : 'http://localhost:9000/api',
        get : {
            categoryData : '/admin/categorys',
            authorization : '/access/isLogin',
            accessLoginout : '/access/loginout',
            userData : '/admin/users',
            userInfo : '/access/user_info',
            productData : '/admin/products'
        },
        put : {
            categoryData : '/admin/categorys',
            userData : '/admin/users',
            productData : '/admin/products'
        },
        post : {
            categoryData : '/admin/categorys',
            accessLogin : '/access/login',
            accessRegister : '/access/register',
            userData : '/admin/users',
            productData : '/admin/products',
            isEnable : '/access/isEnable'
        },
        delete : {
            categoryData : '/admin/categorys',
            userData : '/admin/users',
            productData : '/admin/products'
        }
    },
    production : {

    }
};

export default api_config;