import { IsString, IsHexColor, IsOptional } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { LabelToIssue } from "./label-to-issue";

@Entity({ name: "label" })
class Label {
    @PrimaryGeneratedColumn("increment", { type: "int" })
    id;

    @Column({ name: "name", type: "varchar", unique: true, charset: "utf-8" })
    @IsString()
    name;

    @Column({ name: "color", type: "varchar" })
    @IsString()
    @IsHexColor()
    color;

    @Column({ name: "description", type: "varchar", nullable: true, charset: "utf-8" })
    @IsOptional()
    @IsString()
    description;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime" })
    deletedAt;

    @OneToMany(() => LabelToIssue, (labelToIssues) => labelToIssues.label, { lazy: true })
    labelToIssues;
}

export { Label };
