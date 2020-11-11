import { getRepository } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import { LabelToIssue } from "../model/label-to-issue";
import { Issue } from "../model/issue";
import { Label } from "../model/label";
import { EntityNotFoundError } from "../common/error/entity-not-found-error";

class LabelToIssueService {
    constructor() {
        this.labelToIssueRepository = getRepository(LabelToIssue);
        this.labelRepository = getRepository(Label);
        this.issueRepository = getRepository(Issue);
    }

    static instance = null;

    static getInstance() {
        if (LabelToIssueService.instance === null) {
            LabelToIssueService.instance = new LabelToIssueService();
        }
        return LabelToIssueService.instance;
    }

    async getLabelById(id) {
        const label = await this.labelRepository.findOne(id);
        return label;
    }

    async getIssueById(id) {
        const issue = await this.issueRepository.findOne(id);
        return issue;
    }

    @Transactional()
    async addLabelToIssue(labelId, issueId) {
        const targetLabel = await this.getLabelById(labelId);
        const targetIssue = await this.getIssueById(issueId);
        if (targetLabel === undefined || targetIssue === undefined) {
            throw new EntityNotFoundError();
        }

        const newLabelToIssue = this.labelToIssueRepository.create({ label: targetLabel, issue: targetIssue });
        await this.labelToIssueRepository.save(newLabelToIssue);

        return newLabelToIssue;
    }

    @Transactional()
    async removeLabelToIssue(labelId, issueId) {
        const targetLabel = await this.getLabelById(labelId);
        const targetIssue = await this.getIssueById(issueId);
        const targetIssueLabel = await this.labelToIssueRepository.findOne({ label: targetLabel, issue: targetIssue });
        if (targetIssueLabel === undefined) {
            throw new EntityNotFoundError();
        }
        await this.labelToIssueRepository.remove(targetIssueLabel);
    }
}

export { LabelToIssueService };
