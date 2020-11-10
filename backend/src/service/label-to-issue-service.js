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

    async getLabelById(labelid) {
        const label = await this.labelRepository.findOne({ id: labelid });
        return label;
    }

    async getIssueById(issueid) {
        const issue = await this.issueRepository.findOne({ id: issueid });
        return issue;
    }

    @Transactional()
    async addLabelToIssue(labelid, issueid) {
        const targetLabel = await this.getLabelById(labelid);
        const targetIssue = await this.getIssueById(issueid);

        if (targetLabel === undefined || targetIssue === undefined) {
            throw new EntityNotFoundError();
        }

        const newLabelToIssue = this.labelToIssueRepository.create({ label: targetLabel, issue: targetIssue });
        await this.labelToIssueRepositorylabelTo.save(newLabelToIssue);
    }
}

export { LabelToIssueService };
