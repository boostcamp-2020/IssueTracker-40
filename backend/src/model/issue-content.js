import { IsString } from "class-validator";
import { PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Entity } from "typeorm";
import { DatabaseType } from "../common/config/database/database-type";
import { Issue } from "./issue";

@Entity({ name: "issue_content" })
class IssueContent {
    @PrimaryGeneratedColumn("increment", { type: "int" })
    id;

    @Column({ name: "content", type: process.env.DATABASE_TYPE === DatabaseType.MYSQL ? "mediumtext" : "varchar" })
    @IsString()
    content;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime" })
    deletedAt;

    @OneToOne(() => Issue, (issue) => issue.content)
    issue;
}

export { IssueContent };
