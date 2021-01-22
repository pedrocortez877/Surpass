import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import Area from './Area';


@Entity('images')
export default class Image{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    path: string

    @ManyToOne(() => Area, area => area.images)
    @JoinColumn({name: 'area_id'})
    area: Area;
}