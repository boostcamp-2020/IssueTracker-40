import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "user" })
class User {
    @PrimaryGeneratedColumn("increment", { type: "int" })
    id;

    @Column({ name: "email", type: "varchar" })
    email;

    @Column({ name: "name", type: "varchar" })
    name;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt;
}

export { User };
