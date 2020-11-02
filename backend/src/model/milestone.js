import { IsDate, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { Issue } from "./issue";

const STATE = {
    OPEN: "open",
    CLOSED: "closed"
}

@Entity({ name: "milestone" })
class Milestone {
    @PrimaryGeneratedColumn("increment", { type: "int" })
    id;

    @Column({ name: "title", type: "varchar", unique: true, charset:'utf-8'})
    @IsString()
    title;

    @Column({ name: "description", type: "varchar", nullable: true, charset:'utf-8' })
    @IsString()
    description;

    @Column({ name: "state", type: "varchar", default: STATE.OPEN})
    @IsString()
    state;

    @Column({ name: "due_date", type: "datetime", nullable: true})
    @IsDate()
    dueDate;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    @IsDate()
    createdAt;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    @IsDate()
    updatedAt;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime" })
    @IsDate()
    deletedAt;

    @OneToMany(()=>Issue, issue => issue.id)
    issues;
}

export { Milestone };
