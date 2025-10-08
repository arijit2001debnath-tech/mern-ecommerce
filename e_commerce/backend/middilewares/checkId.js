import { isValidObjectId } from "mongoose";

const checkId = (req, res, next) => {
    if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: `Invalid ID of ${req.params.id}` });
    }
    next();
}

export default checkId;