import { Router } from 'express';
import { getFileStream } from '../utils/aws.js';

const imageRouter = Router();

imageRouter.get('/:key', async (req, res) => {
    const key = req.params.key;
    const { err, img } = await getFileStream(key);

    if (!img | err)
        return res.status(404).send({ status: 'not found' });
    img.pipe(res);
});

export default imageRouter;
