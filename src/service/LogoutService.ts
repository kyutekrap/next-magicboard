import http from './http';

export const LogoutService = async () => {
    var response = await http.Exit();
    return response;
}