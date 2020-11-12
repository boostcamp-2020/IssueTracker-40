import { getRepository } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import { Label } from "../model/label";
import { EntityAlreadyExist } from "../common/error/entity-already-exist";
import { EntityNotFoundError } from "../common/error/entity-not-found-error";

class LabelService {
    constructor() {
        this.labelRepository = getRepository(Label);
    }

    static instance = null;

    static getInstance() {
        if (LabelService.instance === null) {
            LabelService.instance = new LabelService();
        }
        return LabelService.instance;
    }

    createLabel({ name, color, description }) {
        const newLabel = new Label();
        newLabel.name = name;
        newLabel.color = color;
        newLabel.description = description;

        return newLabel;
    }

    async isLabelExistById({ id }) {
        const label = await this.getLabelById(id);
        return label === undefined;
    }

    async isLabelExistByName({ name }) {
        const label = await this.getLabelByName(name);
        return label === undefined;
    }

    async getLabelByName(labelname) {
        const label = await this.labelRepository.findOne({ name: labelname });
        return label;
    }

    async getLabelById(labelid) {
        const label = await this.labelRepository.findOne({ id: labelid });
        return label;
    }

    async getLabels() {
        const label = await this.labelRepository.find();
        return label;
    }

    @Transactional()
    async addLabel(newLabel) {
        const { name } = newLabel;

        if (!(await this.isLabelExistByName({ name }))) {
            throw new EntityAlreadyExist();
        }

        const result = await this.labelRepository.save(newLabel);
    }

    @Transactional()
    async changeLabel(labelid, newLabel) {
        const { name, color, description } = newLabel;
        const targetLabel = await this.getLabelById(labelid);

        if (targetLabel === undefined) {
            throw new EntityNotFoundError();
        }

        if (!(await this.isLabelExistByName({ name }))) {
            throw new EntityAlreadyExist();
        }

        targetLabel.name = name;
        targetLabel.color = color;
        targetLabel.description = description;
        await this.labelRepository.save(targetLabel);
    }

    @Transactional()
    async removeLabel(labelid) {
        const targetLabel = await this.getLabelById(labelid);
        if (targetLabel === undefined) {
            throw new EntityNotFoundError();
        }
        await this.labelRepository.remove(targetLabel);
    }
}

export { LabelService };
