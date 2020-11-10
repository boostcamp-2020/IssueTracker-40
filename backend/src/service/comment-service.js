import { getRepository } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import { EntityNotFoundError } from "../common/error/entity-not-found-error";
import { User } from "../model/user";
import { Issue } from "../model/issue";
import { Comment } from "../model/comment";
import { CommentContent } from "../model/comment-content";

class CommentService {
    static instance = null;

    static getInstance() {
        if (CommentService.instance === null) {
            CommentService.instance = new CommentService();
        }
        return CommentService.instance;
    }

    constructor() {
        this.userRepository = getRepository(User);
        this.issueRepository = getRepository(Issue);
        this.commentRepository = getRepository(Comment);
        this.commentContentRepository = getRepository(CommentContent);
    }

    async getUserById(id) {
        const user = await this.userRepository.findOne(id);
        return user;
    }

    async getIssueById(id) {
        const issue = await this.issueRepository.findOne(id);
        return issue;
    }

    @Transactional()
    async addComment(userId, issueId, content) {
        const targetUser = await this.getUserById(userId);
        const targetIssue = await this.getIssueById(issueId);
        if (targetUser === undefined || targetIssue === undefined) {
            throw new EntityNotFoundError();
        }

        const commentContent = this.commentContentRepository.create({ content });
        await this.commentContentRepository.save(commentContent);

        const comment = this.commentRepository.create({ user: targetUser, issue: targetIssue, content: commentContent });
        await this.commentRepository.save(comment);

        return comment;
    }

    @Transactional()
    async getComments(issueId) {
        const comments = this.commentRepository.find({ issue: issueId });
        return comments;
    }
}

export { CommentService };
