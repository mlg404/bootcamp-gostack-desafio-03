import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import DeliveryProblems from '../models/DeliveryProblems';

import CancelationMail from '../jobs/CancelationMail';
import Queue from '../../lib/queue';

class ProblemController {
  async update(req, res) {
    const problem = await DeliveryProblems.findByPk(req.params.id);

    if (!problem) {
      return res.status(401).json({ error: 'Problem not found.' });
    }

    const delivery = await Delivery.findByPk(problem.delivery_id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });
    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not found.' });
    }

    if (delivery.canceled_at !== null) {
      return res.status(401).json({ error: 'Delivery already canceled.' });
    }

    delivery.canceled_at = new Date();
    delivery.save();

    await Queue.add(CancelationMail.key, {
      name: delivery.deliveryman.name,
      email: delivery.deliveryman.email,
      product: delivery.product,
      description: problem.description,
    });
    return res.json(delivery);
  }
}

export default new ProblemController();
