import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      city,
      uf,
      latitude,
      longitude,
      items,
    } = request.body;

    // const trx = await knex.transaction();

    const point = {
      image: 'image-fake',
      name,
      email,
      whatsapp,
      city,
      uf,
      latitude,
      longitude,
    };

    const pointId = await knex('points').insert(point);

    const pointItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id: pointId[0],
      };
    });

    await knex('point_items').insert(pointItems);

    return response.json({ id: pointId[0], ...point });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const point = await knex('points').where('id', id).first();

    if (!point) {
      return response.status(400).json({ message: 'Ponto não encontrado' });
    }

    const pointItems = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return response.json({ point, pointItems });
  }
}

export default PointsController;
