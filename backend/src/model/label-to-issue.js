import { IsDate, IsInt } from "class-validator";
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { Issue } from "./issue";
import { Label } from "./label";

@Entity()
class LabelToIssue {
    @PrimaryGeneratedColumn({type: "int"})
    labelToIssueId;

    @Column({type: "int" })
    @IsInt()
    issueId;

    @Column({type: "int" })
    @IsInt()
    labelId;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    @IsDate()
    createdAt;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    @IsDate()
    updatedAt;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime" })
    @IsDate()
    deletedAt;

    @ManyToOne(() => Label, label => label.labelToIssues)
    label;

    @ManyToOne(() => Issue, issue => issue.labelToIssues)
    issue;
}

export { LabelToIssue };