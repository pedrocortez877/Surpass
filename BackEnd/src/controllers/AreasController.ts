import {Request, Response} from 'express'
import { getRepository, getConnection } from 'typeorm';
import Area from  '../models/Area'
import areasView from '../views/areasView';
import * as Yup from 'yup'

export default{
    async index(req: Request, res: Response){
        const areasRepository = getRepository(Area);

        const areas = await areasRepository.find({
            relations: ['images']
        });

        return res.json(areasView.renderMany(areas));
    },

    async show(req: Request, res: Response){
        const { id } = req.params;

        const areasRepository = getRepository(Area);

        const area = await areasRepository.findOneOrFail(id, {
            relations: ['images']
        });

        return res.json(areasView.render(area));
    },

    async create(req: Request, res: Response){
        const {
            name,
            contact,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends
        } = req.body;
    
        const areasRepository = getRepository(Area);

        const requestImages = req.files as Express.Multer.File[];
        const images = requestImages.map(image => {
            return { path: image.filename }
        })
    
        const data = {
            name,
            contact,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends : open_on_weekends === 'true',
            images
        };

        const schema = Yup.object().shape({
            name:  Yup.string().required(),
            contact:  Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            images: Yup.array(Yup.object().shape({
                path: Yup.string().required()
            }))
        });

        await schema.validate(data, {
            abortEarly: false,
        });

        const area = areasRepository.create(data);
    
        await areasRepository.save(area);
    
        return res.status(201).json(area);
    },

    async remove(req: Request, res: Response){
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Area)
            .where("id = :id", { id: req.params.id })
            .execute()
            .then(() => {
                return res.status(200).send("Removido com sucesso!");
            })
            .catch(error => {
                console.log("Erro: ", error);
                return res.status(500).send({erro: error});
            });
    },

    async update(req: Request, res: Response) {
        await getConnection()
        .createQueryBuilder()
        .update(Area)
        .set({ 
            name: req.body.name, 
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            about: req.body.about,
            instructions: req.body.instructions,
            opening_hours: req.body.opening_hours,
            open_on_weekends : req.body.open_on_weekends === 'true',
        })
        .where("id = :id", { id: req.params.id })
        .execute()
        .then(() => {
            return res.status(200).send("Alterado com sucesso!");
        })
        .catch(error => {
            console.log("Erro: ", error);
            return res.status(500).send({erro: error});
        });;
    }
}