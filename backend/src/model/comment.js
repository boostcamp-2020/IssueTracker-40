import { IsString, IsUrl } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, DeleteDateColumn } from "typeorm";
import { Issue } from "./issue";
import { User } from "./user";

@Entity({ name: "comment" })
class Comment {
    @PrimaryGeneratedColumn("increment", { type: "int" })
    id;

    @Column({ name: "content", type: "varchar" })
    @IsString()
    @IsUrl()
    content;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime" })
    deletedAt;

    @ManyToOne(() => Issue, (issue) => issue.id, { cascade: true, onDelete: "CASCADE" })
    issue;

    @ManyToOne(() => User, (user) => user.id, { cascade: true })
    user;
}

export { Comment };
