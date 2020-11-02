import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany, ManyToOne, DeleteDateColumn } from "typeorm";
import { Comment } from "./comment";
import { User } from "./user";
import { UserToIssue } from "./user-to-issue";
import { Milestone } from "./milestone";
import { LabelToIssue } from "./label-to-issue";
import { IsDate, IsString, IsUrl } from "class-validator";

const STATE = {
    OPEN: "open",
    CLOSED: "closed"
}

@Entity({ name: "issue" })
class Issue {
    @PrimaryGeneratedColumn("increment", { type: "int" })
    id;

    @Column({ name: "title", type: "varchar", charset:"utf-8" })
    @IsString()
    title;

    @Column({ name: "content", type: "varchar" })
    @IsString()
    @IsUrl()
    content;

    @Column({ name: "state", type: "varchar", default: STATE.OPEN})
    @IsString()
    state;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    @IsDate()
    createdAt;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    @IsDate()
    updatedAt;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime" })
    @IsDate()
    deletedAt;

    @OneToMany(() => Comment, comment => comment.id)
    comments;

    @OneToMany(() => UserToIssue, userToIssue => userToIssue.issue)
    userToIssues;

    @ManyToOne(() => User, user => user.id)
    author;

    @ManyToOne(() => Milestone, milestone => milestone.id)
    milestone;

    @OneToMany(() => LabelToIssue, labelToIssue => labelToIssue.label)
    labelToIssues;
}
export { Issue };
