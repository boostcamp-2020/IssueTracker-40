import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { IsEmail, Length, IsString, IsUrl } from "class-validator";
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

    @Column({ name: "profile_image", type: "varchar" })
    @IsUrl()
    profileImage;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime" })
    deletedAt;

    @OneToMany(() => UserToIssue, (userToIssue) => userToIssue.user, { lazy: true })
    userToIssues;

    @OneToMany(() => Issue, (issue) => issue.author, { lazy: true })
    issues;

    @OneToMany(() => Comment, (comment) => comment.user, { lazy: true })
    comments;
}

export { User };
