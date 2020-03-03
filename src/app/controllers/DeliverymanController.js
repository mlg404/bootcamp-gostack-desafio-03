import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }
    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });
    if (deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman already exists' });
    }

    const createDeliveryman = await Deliveryman.create(req.body);

    return res.json(createDeliveryman);
  }

  async show(req, res) {
    const { page = 1 } = req.query;
    const deliverymen = await Deliveryman.findAll({
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: File,
          as: 'avatar',
        },
      ],
    });

    return res.json(deliverymen);
  }

  async update(req, res) {
    const deliverymen = await Deliveryman.findByPk(req.params.id);

    if (!deliverymen) {
      return res.status(401).json({ error: 'Deliveryman not founded.' });
    }

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const deliverymanEmailExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanEmailExists) {
      return res.status(401).json({ error: 'Email already in use' });
    }

    const avatarExists = await File.findByPk(req.body.avatar_id);
    if (!avatarExists) {
      return res.status(401).json({ error: 'Avatar not founded' });
    }

    const deliverymanUpdate = await deliverymen.update(req.body);

    if (!deliverymanUpdate) {
      return res.status(500).json({ error: 'Something wrong happens' });
    }
    return res.json(deliverymanUpdate);
  }

  async destroy(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not founded' });
    }

    await deliveryman.destroy();
    return res.json({ message: 'Deliveryman deleted' });
  }

  async index(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);
    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman not founded' });
    }
    return res.json(deliveryman);
  }
}

export default new DeliverymanController();
