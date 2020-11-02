import { IsDate, IsString, IsUrl } from "class-validator";
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
    @IsDate()
    createdAt;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    @IsDate()
    updatedAt;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime" })
    @IsDate()
    deletedAt;

    @ManyToOne(() => Issue, (issue) => issue.id)
    issue;

    @ManyToOne(() => User, (user) => user.id)
    user;
}

export { Comment };
