import { IsDate, IsInt } from "class-validator";
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { Issue } from "./issue";
import { User } from "./user";

@Entity()
class UserToIssue {
    @PrimaryGeneratedColumn({ type: "int" })
    userToIssueId;

    @Column({ type: "int" })
    @IsInt()
    userId;

    @Column({ type: "int" })
    @IsInt()
    issueId;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    @IsDate()
    createdAt;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    @IsDate()
    updatedAt;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime" })
    @IsDate()
    deletedAt;

    @ManyToOne(() => User, (user) => user.userToIssues)
    user;

    @ManyToOne(() => Issue, (issue) => issue.userToIssues)
    issue;
}

export { UserToIssue };
