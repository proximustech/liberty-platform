export class Config {

    public static APP_KEYS:string = (process.env.APP_KEYS as string)
    public static CASBIN_MONGO_URI:string = (process.env.CASBIN_MONGO_URI as string)

    public static OIDC_ISSUER:string = (process.env.OIDC_ISSUER as string)
    public static OIDC_AUTHORIZATION_URL:string = (process.env.OIDC_AUTHORIZATION_URL as string)
    public static OIDC_TOKEN_URL:string = (process.env.OIDC_TOKEN_URL as string)
    public static OIDC_USER_INFO_URL:string = (process.env.OIDC_USER_INFO_URL as string)
    public static OIDC_CLIENT_ID:string = (process.env.OIDC_CLIENT_ID as string)
    public static OIDC_CLIENT_SECRET:string = (process.env.OIDC_CLIENT_SECRET as string)
    public static OIDC_CALLBACK_URL:string = (process.env.OIDC_CALLBACK_URL as string)
    
}