import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    DeleteDateColumn,
    JoinColumn,
    OneToOne
} from "typeorm";
import { IsString, IsOptional } from "class-validator";
import { Comment } from "./comment";
import { User } from "./user";
import { UserToIssue } from "./user-to-issue";
import { Milestone } from "./milestone";
import { LabelToIssue } from "./label-to-issue";
import { ISSUESTATE } from "../common/type";
import { IssueContent } from "./issue-content";

@Entity({ name: "issue" })
class Issue {
    @PrimaryGeneratedColumn("increment", { type: "int" })
    id;

    @Column({ name: "title", type: "varchar", charset: "utf-8" })
    @IsString()
    title;

    @Column({ name: "state", type: "varchar", default: ISSUESTATE.OPEN })
    @IsOptional()
    @IsString()
    state;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime" })
    deletedAt;

    @OneToMany(() => Comment, (comment) => comment.issue)
    comments;

    @OneToMany(() => UserToIssue, (userToIssue) => userToIssue.issue, { cascade: ["insert"] })
    userToIssues;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: "author_id" })
    author;

    @ManyToOne(() => Milestone, (milestone) => milestone.id)
    @JoinColumn({ name: "milestone_id" })
    milestone;

    @OneToMany(() => LabelToIssue, (labelToIssue) => labelToIssue.issue, { cascade: ["insert"] })
    labelToIssues;

    @OneToOne(() => IssueContent, (content) => content.issue, { cascade: ["insert"] })
    @JoinColumn({ name: "content_id" })
    content;
}
export { Issue };
