import { IsString } from "class-validator";
import { PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Entity } from "typeorm";
import { DatabaseType } from "../common/config/database/database-type";
import { Comment } from "./comment";

@Entity({ name: "comment_content" })
class CommentContent {
    @PrimaryGeneratedColumn("increment", { type: "int" })
    id;

    @Column({ name: "content", type: process.env.DATABASE_TYPE === DatabaseType.MYSQL ? "mediumtext" : "varchar", charset: "utf-8" })
    @IsString
    content;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime" })
    deletedAt;

    @OneToOne(() => Comment, (comment) => comment.content)
    comment;
}

export { CommentContent };
