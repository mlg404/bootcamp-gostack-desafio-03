import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import DeliveryProblems from '../models/DeliveryProblems';

class DeliveryProblemController {
  async show(req, res) {
    const problem = await DeliveryProblems.findAll({
      where: {
        delivery_id: req.params.id,
      },
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['product'],
        },
      ],
    });
    return res.json(problem);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not found.' });
    }

    if (delivery.deliveryman_id !== req.userId) {
      return res.status(401).json({ error: 'You are not allowed to do that' });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails.' });
    }
    const problem = await DeliveryProblems.create({
      description: req.body.description,
      delivery_id: req.params.id,
    });
    return res.json(problem);
  }
}
export default new DeliveryProblemController();
