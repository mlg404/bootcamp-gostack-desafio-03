import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Recipient from '../models/Recipient';

class DeliverymanDeliveryControler {
  async show(req, res) {
    const { page = 1, filter } = req.query;

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman not found.' });
    }

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.id,
        end_date: filter === 'finished' ? { [Op.ne]: null } : null,
        canceled_at: null,
      },
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zipcode',
          ],
        },
        {
          model: File,
          as: 'file',
          attributes: ['id', 'name', 'url', 'path'],
        },
      ],
      attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
    });
    return res.json(deliveries);
  }
}

export default new DeliverymanDeliveryControler();
