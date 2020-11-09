import { validate } from "class-validator";
import { BadRequestError } from "../common/error/bad-request-error";
import { LabelService } from "../service";

const validateLabelParam = async (req, res, next) => {
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

const getLabels = async (req, res, next) => {
    try {
        const labelService = LabelService.getInstance();
        const labels = await labelService.getLabels();
        res.status(200).json({lables: labels});
    } catch (error) {
        next(error);
    }
}

const changeLabel = async (req, res, next) => {
    try {
        const labelId = req.params.labelId;
        const labelService = LabelService.getInstance();
        await labelService.changeLabel(labelId, req.newLabel);
        res.status(200).send("update success");
    } catch (error) {
        next(error);
    }
}

const removeLabel = async (req, res, next) => {
    try {
        const labelId = req.params.labelId;
        const labelService = LabelService.getInstance();
        await labelService.removeLabel(labelId, req.newLabel);
        res.status(200).send("remove success");
    } catch (error) {
        next(error);
    }
}

export { validateLabelParam, addLabel, getLabels, changeLabel, removeLabel };
