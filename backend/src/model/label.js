import { IsString, IsHexColor, IsDate } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { LabelToIssue } from "./label-to-issue";

@Entity({ name: "label" })
class Label {
    @PrimaryGeneratedColumn("increment", { type: "int" })
    id;

    @Column({ name: "name", type: "varchar", unique: true })
    @IsString()
    name;

    @Column({ name: "color", type: "varchar" })
    @IsString()
    @IsHexColor()
    color;

    @Column({ name: "description", type: "varchar", nullable: true, charset:true})
    @IsString()
    description;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    @IsDate()
    createdAt;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    @IsDate()
    updatedAt;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime" })
    @IsDate()
    deletedAt;

    @OneToMany(() => LabelToIssue, labelToIssues => labelToIssues.issue)
    labelToIssues;
}

export { Label };
