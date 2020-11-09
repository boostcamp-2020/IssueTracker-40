import { Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn } from "typeorm";
import { Issue } from "./issue";
import { User } from "./user";

@Entity()
class UserToIssue {
    @PrimaryGeneratedColumn("increment", { type: "int" })
    userToIssueId;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime" })
    deletedAt;

    @ManyToOne(() => User, (user) => user.userToIssues)
    @JoinColumn({ name: "user_id" })
    user;

    @ManyToOne(() => Issue, (issue) => issue.userToIssues)
    @JoinColumn({ name: "issue_id" })
    issue;
}

export { UserToIssue };
