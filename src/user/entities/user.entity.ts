import { PostEntity } from "src/post/entities/post.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @OneToMany(() => PostEntity, (post) => post.user)
    posts: PostEntity[];

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
