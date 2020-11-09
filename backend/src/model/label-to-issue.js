import { Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn } from "typeorm";
import { Issue } from "./issue";
import { Label } from "./label";

@Entity()
class LabelToIssue {
    @PrimaryGeneratedColumn("increment", { type: "int" })
    labelToIssueId;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime" })
    deletedAt;

    @ManyToOne(() => Label, (label) => label.labelToIssues)
    @JoinColumn({ name: "label_id" })
    label;

    @ManyToOne(() => Issue, (issue) => issue.labelToIssues)
    @JoinColumn({ name: "issue_id" })
    issue;
}

export { LabelToIssue };
