import { listAllUsers } from '../services/userService.js';

const GetAllUsers = async (req, res) => {
    const users = await listAllUsers();
    res.json({ data: users, status: 'success' });
};

export { GetAllUsers };
