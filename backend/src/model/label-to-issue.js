import { Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
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

    @ManyToOne(() => Label, (label) => label.labelToIssues, { eager: true, cascade: true, onDelete: "CASCADE" })
    label;

    @ManyToOne(() => Issue, (issue) => issue.labelToIssues, { eager: true, cascade: true, onDelete: "CASCADE" })
    issue;
}

export { LabelToIssue };
