import * as Yup from 'yup';
import { getHours, parseISO, isFuture } from 'date-fns';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class DeliveryStartsController {
  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const searchDate = req.body.start_date;
    const dateHour = getHours(parseISO(searchDate));

    // check if time is between 08h and 18h
    if (!(dateHour >= 8 && dateHour < 18)) {
      return res.status(401).json({ error: 'Outside the pick-up interval' });
    }

    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not found' });
    }

    // check if pick up delivery time is not a future time
    if (isFuture(parseISO(searchDate))) {
      return res
        .status(401)
        .json({ error: 'You can not pick up a delivery in a future time' });
    }

    const updateDelivery = await delivery.update({
      start_date: req.body.start_date,
    });
    return res.json(updateDelivery);
  }
}
export default new DeliveryStartsController();
