import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    DeleteDateColumn,
    JoinColumn
} from "typeorm";
import { IsString, IsUrl, IsOptional } from "class-validator";
import { Comment } from "./comment";
import { User } from "./user";
import { UserToIssue } from "./user-to-issue";
import { Milestone } from "./milestone";
import { LabelToIssue } from "./label-to-issue";
import { ISSUESTATE } from "../common/type";

@Entity({ name: "issue" })
class Issue {
    @PrimaryGeneratedColumn("increment", { type: "int" })
    id;

    @Column({ name: "title", type: "varchar", charset: "utf-8" })
    @IsString()
    title;

    @Column({ name: "content", type: "varchar" })
    @IsString()
    @IsUrl()
    content;

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

    @OneToMany(() => Comment, (comment) => comment.issue, { lazy: true })
    comments;

    @OneToMany(() => UserToIssue, (userToIssue) => userToIssue.issue, { lazy: true })
    userToIssues;

    @ManyToOne(() => User, (user) => user.id, { eager: true })
    @JoinColumn({ name: "author_id" })
    author;

    @ManyToOne(() => Milestone, (milestone) => milestone.id, { eager: true })
    @JoinColumn({ name: "milestone_id" })
    milestone;

    @OneToMany(() => LabelToIssue, (labelToIssue) => labelToIssue.issue, { lazy: true })
    labelToIssues;
}
export { Issue };
