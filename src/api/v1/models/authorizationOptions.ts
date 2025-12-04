export interface AuthorizationOptions {
    hasRole: Array<"admin" | "editor" | "user">;
    allowSameUser?: boolean;
}