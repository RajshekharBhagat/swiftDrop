export interface ApiResponse {
    success: boolean,
    message: string,
    data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}