import { IsDate, IsOptional, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { Issue } from "./issue";
import { MILESTONESTATE } from "../common/type";

@Entity({ name: "milestone" })
class Milestone {
    @PrimaryGeneratedColumn("increment", { type: "int" })
    id;

    @Column({ name: "title", type: "varchar", unique: true, charset: "utf-8" })
    @IsString()
    title;

    @Column({ name: "description", type: "varchar", nullable: true, charset: "utf-8" })
    @IsOptional()
    @IsString()
    description;

    @Column({ name: "state", type: "varchar", default: MILESTONESTATE.OPEN })
    @IsOptional()
    @IsString()
    state;

    @Column({ name: "due_date", type: "datetime", nullable: true })
    @IsOptional()
    @IsDate()
    dueDate;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime" })
    deletedAt;

    @OneToMany(() => Issue, (issue) => issue.id)
    issues;
}

export { Milestone };
