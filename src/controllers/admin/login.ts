import { Request, Response } from 'express';

interface LoginRequest extends Request {
    body: {
        username: string;
        password: string;
    };
}
export const login = async (
    req: LoginRequest,
    res: Response,
): Promise<void> => {
    const { username, password } = req.body;
    console.log(JSON.parse(JSON.stringify({ username, password }, null, 4)));
    res.send('Login');
};
