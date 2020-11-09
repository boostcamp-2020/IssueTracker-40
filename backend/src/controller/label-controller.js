import { validate } from "class-validator";
import { BadRequestError } from "../common/error/bad-request-error";
import { LabelService } from "../service";

const validateAddLabelParam = async (req, res, next) => {
    const { name, color, description } = req.body;
    const labelService = LabelService.getInstance();
    const newLabel = labelService.createLabel({ name, color, description });

    const error = await validate(newLabel);
    if (error.length > 0) {
        next(new BadRequestError());
        return;
    }
    req.newLabel = newLabel;
    next();
};

const addLabel = async (req, res, next) => {
    try {
        const labelService = LabelService.getInstance();
        await labelService.addLabel(req.newLabel);
        res.status(200).send("ok");
    } catch (error) {
        next(error);
    }
};

export { validateAddLabelParam, addLabel };
