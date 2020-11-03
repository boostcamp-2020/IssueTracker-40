import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { IsEmail, Length, IsString } from "class-validator";
import { Issue } from "./issue";
import { Comment } from "./comment";
import { UserToIssue } from "./user-to-issue";

@Entity({ name: "user" })
class User {
    @PrimaryGeneratedColumn("increment", { type: "int" })
    id;

    @Column({ name: "email", type: "varchar", unique: true })
    @IsEmail()
    email;

    @Column({ name: "name", type: "varchar", unique: true, charset: "utf-8" })
    @IsString()
    @Length(4, 20)
    name;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime" })
    deletedAt;

    @OneToMany(() => UserToIssue, (userToIssue) => userToIssue.user)
    userToIssues;

    @OneToMany(() => Issue, (issue) => issue.id)
    issues;

    @OneToMany(() => Comment, (comment) => comment.id)
    comments;
}

export { User };
