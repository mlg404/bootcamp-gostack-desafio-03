import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
      signature_id: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const checkDeliveryman = await Deliveryman.findByPk(
      req.body.deliveryman_id
    );
    if (!checkDeliveryman) {
      return res.status(401).json({ error: 'Deliveryman not founded' });
    }

    const checkRecipient = await Recipient.findByPk(req.body.recipient_id);
    if (!checkRecipient) {
      return res.status(401).json({ error: 'Recipient not founded' });
    }

    const delivery = await Delivery.create(
      {
        recipient_id: req.body.recipient_id,
        deliveryman_id: req.body.deliveryman_id,
        product: req.body.product,
      },
      { attributes: ['id', 'recipient_id', 'deliveryman_id', 'product'] }
    );
    return res.json(delivery);
  }

  async show(req, res) {
    const { page = 1 } = req.query;
    const deliveries = await Delivery.findAll({
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

  async index(req, res) {
    const delivery = await Delivery.findByPk(req.params.id, {
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
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not founded' });
    }

    return res.json(delivery);
  }

  async destroy(req, res) {
    const delivery = await Delivery.destroy({ where: { id: req.params.id } });
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not founded' });
    }
    return res.json({ message: 'Delivery deleted!' });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number(),
      product: Yup.string().required(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
      signature_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not founded' });
    }
    const updateDelivery = await delivery.update(req.body);
    return res.json(updateDelivery);
  }
}
export default new DeliveryController();
