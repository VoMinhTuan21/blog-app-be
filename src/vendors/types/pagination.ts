export class PaginationResponse<T> {
    total: number;
    previous?: {
        page: number;
        limit: number;
    };
    data: T[];
    next?: {
        page: number;
        limit: number;
    };
    rowPerpage: number;
}
