export interface IFacebookToken {
    access_token: string;
    token_type: string;
    expires_in: string;
}

export interface IFacebookUser {
    id: string;
    name: string;
    email: string;
    picture: {
        data: {
            height: number;
            is_silhouette: boolean;
            url: string;
            width: number;
        };
    };
}
